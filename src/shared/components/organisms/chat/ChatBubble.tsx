/**
 * ChatBubble Component
 * @description Chat message bubble with user/AI variants
 * @task Task 2.7.1: ChatBubble Component
 * @phase Phase 3C: Refactored to use theme tokens
 *
 * Features:
 * - User and AI message variants
 * - Avatar display
 * - Timestamp and status indicators
 * - Emotion detection badges
 * - Message reactions
 * - Attachment support
 * - Full accessibility support
 * - Dark mode first design
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import type {
  ChatBubbleProps,
  EmotionDetection,
  MessageAttachment,
  MessageReaction,
  MessageStatus,
} from "./ChatBubble.types";
import { formatTimestamp, getEmotionColor } from "./ChatBubble.types";
import { palette } from "../../../theme";

/**
 * Color tokens — cosmic editorial (prototype v4.2).
 *
 * Reskin notes (Sprint 2):
 * - User bubble swapped from sage (old "primary accent") to PEACH — the
 *   prototype's chat spec uses peach for warmth on the sender side. Legacy
 *   `palette.tan` would alias to sage and read cold.
 * - AI bubble uses midnight-700 (via legacy `gray[700]` alias). When the
 *   full chat screen ships in Sprint 5 it will be wrapped in <GlassCard/>.
 * - `palette.orange` didn't exist in the legacy palette (latent undefined
 *   bug). Swapped to `palette.peach[500]` — explicit cosmic value.
 */
const colors = {
  background: palette.midnight[950],
  userBubble: palette.peach[300],    // NEW: peach, not tan/sage
  aiBubble: palette.midnight[700],

  userText: palette.midnight[950],
  aiText: palette.warm[50],
  textSecondary: palette.warm[400],
  textMuted: palette.warm[500],

  avatarBg: palette.sage[300],

  statusSending: palette.warm[400],
  statusSent: palette.sage[500],
  statusError: palette.red[500],

  emotionPositive: palette.sage[500],
  emotionNegative: palette.peach[500],  // was palette.orange[500] — undefined bug fix
  emotionNeutral: palette.warm[400],
  emotionCrisis: palette.peach[500],    // crisis = warm peach, never alarming red

  reactionBg: palette.midnight[600],
  reactionSelected: palette.sage[300],
};

/**
 * Avatar Component
 */
interface AvatarProps {
  uri?: string;
  sender: "user" | "ai";
  testID?: string;
}

function Avatar({ uri, sender, testID }: AvatarProps) {
  return (
    <View testID={testID} style={styles.avatar}>
      {uri ? (
        <Image source={{ uri }} style={styles.avatarImage} />
      ) : (
        <View
          style={[
            styles.avatarPlaceholder,
            sender === "ai" && styles.avatarAI,
          ]}
        >
          <Icon
            name={sender === "ai" ? "hardware-chip-outline" : "person-circle-outline"}
            size={16}
            color={sender === "ai" ? colors.userText : colors.avatarBg}
          />
        </View>
      )}
    </View>
  );
}

/**
 * Status Indicator Component
 */
interface StatusIndicatorProps {
  status: MessageStatus;
  testID?: string;
}

function StatusIndicator({ status, testID }: StatusIndicatorProps) {
  const color =
    status === "read" ? colors.statusSent :
    status === "error" ? colors.statusError :
    colors.textMuted;

  if (status === "sent") {
    return (
      <Icon
        testID={testID}
        name="checkmark-outline"
        size={12}
        color={color}
        style={styles.statusIndicator}
      />
    );
  }
  if (status === "delivered" || status === "read") {
    return (
      <Icon
        testID={testID}
        name="checkmark-done-outline"
        size={12}
        color={color}
        style={styles.statusIndicator}
      />
    );
  }

  const fallbackText =
    status === "sending" ? "○" :
    status === "error" ? "!" :
    "";

  return (
    <Text
      testID={testID}
      style={[
        styles.statusIndicator,
        status === "error" && styles.statusError,
      ]}
    >
      {fallbackText}
    </Text>
  );
}

/**
 * Emotion Badge Component
 */
interface EmotionBadgeProps {
  emotion: EmotionDetection;
  testID?: string;
}

function EmotionBadge({ emotion, testID }: EmotionBadgeProps) {
  const backgroundColor = emotion.color || getEmotionColor(emotion.sentiment);
  const emotionText = emotion.emotions.join(", ");

  return (
    <View
      testID={testID}
      style={[styles.emotionBadge, { backgroundColor }]}
    >
      <Text style={styles.emotionText}>
        Emotion detected: {emotionText}
      </Text>
    </View>
  );
}

/**
 * Reaction Button Component
 */
interface ReactionButtonProps {
  reaction: MessageReaction;
  onPress: (emoji: string) => void;
  testID?: string;
}

function ReactionButton({ reaction, onPress, testID }: ReactionButtonProps) {
  return (
    <TouchableOpacity
      testID={testID}
      style={[
        styles.reactionButton,
        reaction.isSelected && styles.reactionButtonSelected,
      ]}
      onPress={() => onPress(reaction.emoji)}
      accessibilityRole="button"
      accessibilityLabel={`React with ${reaction.emoji}, ${reaction.count} reactions`}
    >
      <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
      {reaction.count > 0 && (
        <Text style={styles.reactionCount}>{reaction.count}</Text>
      )}
    </TouchableOpacity>
  );
}

/**
 * Attachment Preview Component
 */
interface AttachmentPreviewProps {
  attachment: MessageAttachment;
  onPress: (attachment: MessageAttachment) => void;
  testID?: string;
}

function AttachmentPreview({
  attachment,
  onPress,
  testID,
}: AttachmentPreviewProps) {
  return (
    <TouchableOpacity
      testID={testID}
      style={styles.attachmentContainer}
      onPress={() => onPress(attachment)}
      accessibilityRole="button"
      accessibilityLabel={`View ${attachment.type}: ${attachment.title || "attachment"}`}
    >
      {(attachment.type === "image" || attachment.type === "video") && (
        <Image
          source={{ uri: attachment.thumbnail || attachment.url }}
          style={styles.attachmentImage}
        />
      )}
      {attachment.title && (
        <Text style={styles.attachmentTitle} numberOfLines={1}>
          {attachment.title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

/**
 * ChatBubble Component
 *
 * @example
 * ```tsx
 * // User message
 * <ChatBubble
 *   message="Hello, how are you?"
 *   sender="user"
 *   timestamp={new Date()}
 *   status="sent"
 * />
 *
 * // AI message with emotion
 * <ChatBubble
 *   message="I'm here to help!"
 *   sender="ai"
 *   senderName="Dr. Freud.AI"
 *   emotion={{ emotions: ["Happy"], sentiment: "positive" }}
 * />
 * ```
 */
export function ChatBubble({
  message,
  sender,
  timestamp,
  status,
  avatar,
  senderName,
  showAvatar = true,
  showTimestamp = true,
  isSequential = false,
  emotion,
  reactions,
  attachments,
  children,
  onLongPress,
  onReactionPress,
  onAttachmentPress,
  testID,
  accessibilityLabel,
  style,
}: ChatBubbleProps): React.ReactElement {
  const isUser = sender === "user";

  // Build accessibility label
  const defaultAccessibilityLabel = `${isUser ? "You" : senderName || "AI"}: ${message}`;

  return (
    <View
      testID={testID}
      accessibilityLabel={accessibilityLabel || defaultAccessibilityLabel}
      style={[
        styles.container,
        isUser ? styles.containerUser : styles.containerAI,
        isSequential && styles.containerSequential,
        style,
      ]}
    >
      {/* Avatar (left for AI, hidden for user) */}
      {!isUser && showAvatar && !isSequential && (
        <Avatar
          uri={avatar}
          sender={sender}
          testID={`${testID}-avatar`}
        />
      )}

      {/* Spacer for sequential AI messages */}
      {!isUser && showAvatar && isSequential && (
        <View style={styles.avatarSpacer} />
      )}

      {/* Message Content */}
      <View style={styles.messageWrapper}>
        {/* Sender Name (AI only, non-sequential) */}
        {!isUser && senderName && !isSequential && (
          <Text style={styles.senderName}>{senderName}</Text>
        )}

        {/* Bubble */}
        <TouchableOpacity
          testID={`${testID}-content`}
          style={[
            styles.bubble,
            isUser ? styles.bubbleUser : styles.bubbleAI,
          ]}
          onLongPress={onLongPress}
          activeOpacity={onLongPress ? 0.7 : 1}
          accessible
          accessibilityRole="text"
        >
          {/* Attachments */}
          {attachments && attachments.length > 0 && (
            <View style={styles.attachmentsContainer}>
              {attachments.map((attachment) => (
                <AttachmentPreview
                  key={attachment.id}
                  attachment={attachment}
                  onPress={onAttachmentPress || (() => {})}
                  testID={`${testID}-attachment-${attachment.id}`}
                />
              ))}
            </View>
          )}

          {/* Message Text */}
          <Text
            style={[
              styles.messageText,
              isUser ? styles.messageTextUser : styles.messageTextAI,
            ]}
          >
            {message}
          </Text>

          {/* Custom Children */}
          {children}
        </TouchableOpacity>

        {/* Timestamp and Status Row */}
        {(showTimestamp || status) && (
          <View
            style={[
              styles.metaRow,
              isUser ? styles.metaRowUser : styles.metaRowAI,
            ]}
          >
            {showTimestamp && timestamp && (
              <Text style={styles.timestamp}>
                {formatTimestamp(timestamp)}
              </Text>
            )}
            {status && (
              <StatusIndicator
                status={status}
                testID={`${testID}-status`}
              />
            )}
          </View>
        )}

        {/* Reactions */}
        {reactions && reactions.length > 0 && (
          <View
            testID={`${testID}-reactions`}
            style={[
              styles.reactionsContainer,
              isUser ? styles.reactionsUser : styles.reactionsAI,
            ]}
          >
            {reactions.map((reaction) => (
              <ReactionButton
                key={reaction.emoji}
                reaction={reaction}
                onPress={onReactionPress || (() => {})}
                testID={`${testID}-reaction-${reaction.emoji}`}
              />
            ))}
          </View>
        )}
      </View>

      {/* Avatar (right for user) */}
      {isUser && showAvatar && !isSequential && (
        <Avatar
          uri={avatar}
          sender={sender}
          testID={`${testID}-avatar`}
        />
      )}

      {/* Spacer for sequential user messages */}
      {isUser && showAvatar && isSequential && (
        <View style={styles.avatarSpacer} />
      )}

      {/* Emotion Badge (centered, below bubble) */}
      {emotion && (
        <View style={styles.emotionContainer}>
          <EmotionBadge
            emotion={emotion}
            testID={`${testID}-emotion`}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  attachmentContainer: {
    borderRadius: 8,
    marginBottom: 8,
    overflow: "hidden",
  },
  attachmentImage: {
    borderRadius: 8,
    height: 120,
    width: "100%",
  },
  attachmentTitle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  attachmentsContainer: {
    marginBottom: 8,
  },
  avatar: {
    height: 36,
    marginHorizontal: 8,
    width: 36,
  },
  avatarAI: {
    backgroundColor: colors.avatarBg,
  },
  avatarImage: {
    borderRadius: 18,
    height: 36,
    width: 36,
  },
  avatarPlaceholder: {
    alignItems: "center",
    backgroundColor: colors.userBubble,
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  avatarSpacer: {
    marginHorizontal: 8,
    width: 36,
  },
  avatarText: {},
  bubble: {
    // Prototype spec: rounded-2xl body with ONE sharp corner near the speaker
    // (top-left for AI, top-right for user) — that's the "tail" pointing toward
    // the avatar side. Legacy code had sharp BOTTOM corner — flipped here.
    borderRadius: 20,
    maxWidth: "85%",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleAI: {
    backgroundColor: colors.aiBubble,
    borderTopLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: colors.userBubble,
    borderTopRightRadius: 4,
  },
  container: {
    flexDirection: "row",
    marginBottom: 8,
    marginHorizontal: 8,
    marginTop: 8,
  },
  containerAI: {
    alignSelf: "flex-start",
    flexDirection: "row",
  },
  containerSequential: {
    marginTop: 2,
  },
  containerUser: {
    alignSelf: "flex-end",
    flexDirection: "row",
  },
  emotionBadge: {
    alignSelf: "center",
    borderRadius: 12,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  emotionContainer: {
    left: 0,
    position: "absolute",
    right: 0,
    top: "100%",
  },
  emotionText: {
    color: colors.userText,
    fontSize: 12,
    fontWeight: "500",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageTextAI: {
    color: colors.aiText,
  },
  messageTextUser: {
    color: colors.userText,
  },
  messageWrapper: {
    flexShrink: 1,
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 4,
  },
  metaRowAI: {
    justifyContent: "flex-start",
  },
  metaRowUser: {
    justifyContent: "flex-end",
  },
  reactionButton: {
    alignItems: "center",
    backgroundColor: colors.reactionBg,
    borderRadius: 12,
    flexDirection: "row",
    marginRight: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  reactionButtonSelected: {
    backgroundColor: colors.reactionSelected,
  },
  reactionCount: {
    color: colors.aiText,
    fontSize: 12,
    marginLeft: 4,
  },
  reactionEmoji: {
    fontSize: 14,
  },
  reactionsAI: {
    justifyContent: "flex-start",
  },
  reactionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },
  reactionsUser: {
    justifyContent: "flex-end",
  },
  senderName: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
    marginLeft: 4,
  },
  statusError: {
    color: colors.statusError,
  },
  statusIndicator: {
    color: colors.textMuted,
    fontSize: 12,
    marginLeft: 4,
  },
  statusRead: {
    color: colors.statusSent,
  },
  timestamp: {
    color: colors.textMuted,
    fontSize: 11,
  },
});

export default ChatBubble;
