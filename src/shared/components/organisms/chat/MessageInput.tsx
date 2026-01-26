/**
 * MessageInput Component
 * @description Chat message input with text, voice, and attachment support
 * @task Task 2.7.3: MessageInput Component
 *
 * Features:
 * - Text input with multiline support
 * - Attachment button
 * - Voice recording button
 * - Send button
 * - Attachment preview
 * - Voice recording UI
 * - Full accessibility support
 * - Dark mode first design
 */

import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";

import type {
  MessageInputProps,
  InputAttachment,
} from "./MessageInput.types";
import { formatDuration, canSendMessage } from "./MessageInput.types";

/**
 * Color tokens (dark mode first)
 */
const colors = {
  // Background colors
  background: "#1C1410",
  inputBg: "#334155",
  buttonBg: "#9AAD5C", // Olive green

  // Text colors
  text: "#F1F5F9",
  textSecondary: "#94A3B8",
  placeholder: "#64748B",

  // Icon colors
  iconDefault: "#94A3B8",
  iconActive: "#9AAD5C",

  // Attachment
  attachmentBg: "#475569",

  // Recording
  recordingIndicator: "#EF4444",

  // Border
  border: "#475569",
};

/**
 * Attachment Preview Component
 */
interface AttachmentPreviewProps {
  attachment: InputAttachment;
  onRemove: (id: string) => void;
  testID?: string;
}

function AttachmentPreview({
  attachment,
  onRemove,
  testID,
}: AttachmentPreviewProps) {
  const getIcon = () => {
    switch (attachment.type) {
      case "image":
        return "🖼️";
      case "video":
        return "🎬";
      case "audio":
        return "🎵";
      case "file":
        return "📄";
      default:
        return "📎";
    }
  };

  return (
    <View testID={testID} style={styles.attachmentPreview}>
      {attachment.type === "image" ? (
        <Image
          source={{ uri: attachment.uri }}
          style={styles.attachmentImage}
        />
      ) : (
        <View style={styles.attachmentIcon}>
          <Text style={styles.attachmentIconText}>{getIcon()}</Text>
        </View>
      )}
      {attachment.name && (
        <Text style={styles.attachmentName} numberOfLines={1}>
          {attachment.name}
        </Text>
      )}
      <TouchableOpacity
        testID={`${testID}-remove`}
        style={styles.attachmentRemove}
        onPress={() => onRemove(attachment.id)}
        accessibilityLabel={`Remove ${attachment.name || "attachment"}`}
        accessibilityRole="button"
      >
        <Text style={styles.attachmentRemoveText}>×</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * Voice Recording UI Component
 */
interface VoiceRecordingUIProps {
  duration: number;
  testID?: string;
}

function VoiceRecordingUI({ duration, testID }: VoiceRecordingUIProps) {
  return (
    <View testID={testID} style={styles.voiceRecordingContainer}>
      <View style={styles.recordingIndicator} />
      <Text style={styles.recordingText}>Recording</Text>
      <Text style={styles.recordingDuration}>{formatDuration(duration)}</Text>
    </View>
  );
}

/**
 * MessageInput Component
 *
 * @example
 * ```tsx
 * // Basic usage
 * <MessageInput
 *   value={message}
 *   onChangeText={setMessage}
 *   onSend={handleSend}
 *   placeholder="Type to start chatting..."
 * />
 *
 * // With attachments
 * <MessageInput
 *   value={message}
 *   onChangeText={setMessage}
 *   onSend={handleSend}
 *   attachments={attachments}
 *   onAttachmentPress={handleAttachment}
 *   onRemoveAttachment={handleRemove}
 * />
 * ```
 */
export function MessageInput({
  value = "",
  onChangeText,
  onSend,
  onAttachmentPress,
  onVoicePress,
  placeholder = "Type to start chatting...",
  disabled = false,
  showAttachment = true,
  showVoice = true,
  attachments,
  onRemoveAttachment,
  maxLength,
  multiline = true,
  maxLines = 5,
  voiceRecordingState = "idle",
  voiceRecordingDuration = 0,
  leftAddon,
  rightAddon,
  testID,
  accessibilityLabel,
  style,
  inputStyle,
}: MessageInputProps): React.ReactElement {
  const isRecording = voiceRecordingState === "recording";
  const canSend = canSendMessage(value, attachments);

  const handleSend = () => {
    if (disabled || !canSend) return;
    onSend?.(value, attachments);
  };

  return (
    <View
      testID={testID}
      style={[styles.container, disabled && styles.containerDisabled, style]}
    >
      {/* Attachments Row */}
      {attachments && attachments.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.attachmentsRow}
          contentContainerStyle={styles.attachmentsContent}
        >
          {attachments.map((attachment) => (
            <AttachmentPreview
              key={attachment.id}
              attachment={attachment}
              onRemove={onRemoveAttachment || (() => {})}
              testID={`${testID}-attachment-${attachment.id}`}
            />
          ))}
        </ScrollView>
      )}

      {/* Voice Recording UI */}
      {isRecording && (
        <VoiceRecordingUI
          duration={voiceRecordingDuration}
          testID={`${testID}-voice-recording`}
        />
      )}

      {/* Input Row */}
      <View style={styles.inputRow}>
        {/* Left Addon or Attachment Button */}
        {leftAddon ? (
          leftAddon
        ) : showAttachment ? (
          <TouchableOpacity
            testID={`${testID}-attachment-button`}
            style={styles.actionButton}
            onPress={onAttachmentPress}
            disabled={disabled}
            accessibilityLabel="Add attachment"
            accessibilityRole="button"
          >
            <Text style={styles.actionButtonIcon}>📎</Text>
          </TouchableOpacity>
        ) : null}

        {/* Text Input */}
        <View style={styles.inputContainer}>
          <TextInput
            testID={`${testID}-field`}
            style={[styles.input, inputStyle]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.placeholder}
            editable={!disabled}
            maxLength={maxLength}
            multiline={multiline}
            numberOfLines={maxLines}
            accessibilityLabel={accessibilityLabel || "Message input field"}
            returnKeyType="default"
          />
        </View>

        {/* Right Addon or Voice Button */}
        {rightAddon ? (
          rightAddon
        ) : showVoice ? (
          <TouchableOpacity
            testID={`${testID}-voice-button`}
            style={[
              styles.actionButton,
              isRecording && styles.actionButtonActive,
            ]}
            onPress={onVoicePress}
            disabled={disabled}
            accessibilityLabel="Record voice message"
            accessibilityRole="button"
          >
            <Text style={styles.actionButtonIcon}>🎤</Text>
          </TouchableOpacity>
        ) : null}

        {/* Send Button */}
        <TouchableOpacity
          testID={`${testID}-send-button`}
          style={[
            styles.sendButton,
            (!canSend || disabled) && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={disabled || !canSend}
          accessibilityLabel="Send message"
          accessibilityRole="button"
        >
          <Text style={styles.sendButtonIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  actionButtonActive: {
    backgroundColor: colors.recordingIndicator,
    borderRadius: 22,
  },
  actionButtonIcon: {
    fontSize: 20,
  },
  attachmentIcon: {
    alignItems: "center",
    backgroundColor: colors.attachmentBg,
    borderRadius: 8,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  attachmentIconText: {
    fontSize: 24,
  },
  attachmentImage: {
    borderRadius: 8,
    height: 48,
    width: 48,
  },
  attachmentName: {
    color: colors.textSecondary,
    flex: 1,
    fontSize: 12,
    marginHorizontal: 8,
  },
  attachmentPreview: {
    alignItems: "center",
    backgroundColor: colors.attachmentBg,
    borderRadius: 8,
    flexDirection: "row",
    marginRight: 8,
    padding: 4,
  },
  attachmentRemove: {
    alignItems: "center",
    backgroundColor: colors.border,
    borderRadius: 10,
    height: 20,
    justifyContent: "center",
    width: 20,
  },
  attachmentRemoveText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "bold",
  },
  attachmentsContent: {
    paddingHorizontal: 12,
  },
  attachmentsRow: {
    marginBottom: 8,
  },
  container: {
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingBottom: 8,
    paddingTop: 8,
  },
  containerDisabled: {
    opacity: 0.5,
  },
  input: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    maxHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputContainer: {
    backgroundColor: colors.inputBg,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 8,
  },
  inputRow: {
    alignItems: "flex-end",
    flexDirection: "row",
    paddingHorizontal: 8,
  },
  recordingDuration: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  recordingIndicator: {
    backgroundColor: colors.recordingIndicator,
    borderRadius: 4,
    height: 8,
    marginRight: 8,
    width: 8,
  },
  recordingText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginRight: 8,
  },
  sendButton: {
    alignItems: "center",
    backgroundColor: colors.buttonBg,
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
    opacity: 0.5,
  },
  sendButtonIcon: {
    color: colors.background,
    fontSize: 18,
  },
  voiceRecordingContainer: {
    alignItems: "center",
    backgroundColor: colors.inputBg,
    borderRadius: 8,
    flexDirection: "row",
    marginBottom: 8,
    marginHorizontal: 12,
    padding: 12,
  },
});

export default MessageInput;
