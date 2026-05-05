/**
 * ActiveChatScreen — prototype v4.2 #07 AI Chat reskin (Sprint 6).
 *
 * Full local-state chat surface using Sprint 5 organisms:
 * ChatHeader, ChatBubble, ChatBubbleAction, ReactionChip, TypingIndicator,
 * MessageInput. Defaults to 6 seed messages with one action card and two
 * reaction chips to match the visual ground truth.
 */

import React, { useCallback, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTheme } from "@/shared/theme/useTheme";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { ScreenContainer } from "@/shared/components/atoms/layout";
import {
  ChatBubble,
  ChatBubbleAction,
  ChatHeader,
  MessageInput,
  ReactionChip,
  TypingIndicator,
} from "@/shared/components/organisms/chat";
import { sendMessage } from "@/features/chat/services/mockChatService";
import { detectCrisisSignals } from "@/features/chat/services/crisisClassifier";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  timestamp: number;
  /** Optional embedded action card */
  action?: {
    iconName?: string;
    title: string;
    subtitle?: string;
    ctaLabel?: string;
    onPress: () => void;
  };
  /** Optional reaction chips after this message */
  reactions?: {
    id: string;
    label: string;
    iconName?: string;
    selected?: boolean;
    onPress: () => void;
  }[];
}

export interface ActiveChatScreenProps {
  conversationId?: string;
  /** Optional pre-populated messages */
  initialMessages?: ChatMessage[];
  onClose?: () => void;
  onPhonePress?: () => void;
  onMorePress?: () => void;
  /** Override the mock send. Defaults to mockChatService.sendMessage. */
  onSendMessage?: (
    text: string,
  ) => Promise<{ reply: string; action?: ChatMessage["action"] }>;
  /**
   * Invoked synchronously when the rule-based crisis classifier detects a
   * positive match in the user's outgoing message (Sprint 9 8.4 wiring). The
   * host (RootNavigator) typically handles this by navigating to the
   * CrisisModal stack. The chat send still proceeds so the AI surface can
   * follow up with the safety script — the modal is an additional layer.
   */
  onCrisisDetected?: (input: string) => void;
  testID?: string;
}

// ---------------------------------------------------------------------------
// Default seed messages
// ---------------------------------------------------------------------------

const noop = (): void => {
  // placeholder
};

export const DEFAULT_INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "seed-1",
    role: "ai",
    text: "Hey there. How are you feeling about things today?",
    timestamp: Date.now() - 10 * 60_000,
  },
  {
    id: "seed-2",
    role: "user",
    text: "Honestly, pretty anxious. I keep replaying a meeting in my head.",
    timestamp: Date.now() - 9 * 60_000,
  },
  {
    id: "seed-3",
    role: "ai",
    text: "That's a really common pattern called rumination. Let's try a quick grounding exercise to interrupt it.",
    timestamp: Date.now() - 8 * 60_000,
    reactions: [
      {
        id: "r-helped",
        label: "This helped",
        iconName: "thumbs-up",
        selected: false,
        onPress: noop,
      },
      {
        id: "r-not-quite",
        label: "Not quite",
        iconName: "thumbs-down",
        selected: false,
        onPress: noop,
      },
    ],
    action: {
      iconName: "wind",
      title: "Try: 4-7-8 Breathing",
      subtitle: "2 minutes · in-app",
      ctaLabel: "Try now",
      onPress: noop,
    },
  },
  {
    id: "seed-4",
    role: "user",
    text: "Okay, I'll try it. What do I do first?",
    timestamp: Date.now() - 7 * 60_000,
  },
  {
    id: "seed-5",
    role: "ai",
    text: "Inhale slowly through your nose for 4 counts, hold for 7, then exhale through your mouth for 8. Ready to go?",
    timestamp: Date.now() - 6 * 60_000,
  },
  {
    id: "seed-6",
    role: "user",
    text: "Yes, starting now.",
    timestamp: Date.now() - 5 * 60_000,
  },
];

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyState(): React.ReactElement {
  const { palette } = useTheme();
  return (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyText, { color: palette.warm[400] }]}>
        Say something. Solace is listening.
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Message row — renders ChatBubble + optional action + optional reaction chips
// ---------------------------------------------------------------------------

interface MessageRowProps {
  item: ChatMessage;
  onReactionToggle: (msgId: string, reactionId: string) => void;
}

function MessageRow({
  item,
  onReactionToggle,
}: MessageRowProps): React.ReactElement {
  const isUser = item.role === "user";

  return (
    <View testID={`message-row-${item.id}`}>
      <ChatBubble
        testID={isUser ? `user-bubble-${item.id}` : `ai-bubble-${item.id}`}
        message={item.text}
        sender={item.role === "user" ? "user" : "ai"}
        timestamp={new Date(item.timestamp)}
        showTimestamp
        accessibilityLabel={`${isUser ? "You" : "Solace"}: ${item.text}`}
      />

      {/* Embedded action card — only below AI messages */}
      {!isUser && item.action ? (
        <View style={styles.actionWrapper}>
          <ChatBubbleAction
            testID={`action-card-${item.id}`}
            iconName={item.action.iconName ?? "wind"}
            title={item.action.title}
            subtitle={item.action.subtitle}
            ctaLabel={item.action.ctaLabel ?? "Try now"}
            onPress={item.action.onPress}
          />
        </View>
      ) : null}

      {/* Reaction chips row */}
      {!isUser && item.reactions && item.reactions.length > 0 ? (
        <View
          testID={`reactions-row-${item.id}`}
          style={styles.reactionsRow}
          accessibilityLabel="Rate this response"
        >
          {item.reactions.map((chip) => (
            <ReactionChip
              key={chip.id}
              testID={`reaction-chip-${chip.id}`}
              label={chip.label}
              iconName={chip.iconName}
              selected={chip.selected ?? false}
              onPress={() => onReactionToggle(item.id, chip.id)}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export function ActiveChatScreen({
  conversationId: _conversationId,
  initialMessages = DEFAULT_INITIAL_MESSAGES,
  onClose,
  onPhonePress,
  onMorePress,
  onSendMessage,
  onCrisisDetected,
  testID = "active-chat-screen",
}: ActiveChatScreenProps): React.ReactElement {
  const { palette } = useTheme();
  useReducedMotion();

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  // Toggle a reaction chip's selected state locally
  const handleReactionToggle = useCallback(
    (msgId: string, reactionId: string): void => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== msgId || !msg.reactions) return msg;
          return {
            ...msg,
            reactions: msg.reactions.map((chip) =>
              chip.id === reactionId
                ? { ...chip, selected: !chip.selected }
                : chip,
            ),
          };
        }),
      );
    },
    [],
  );

  const handleSend = useCallback(async (): Promise<void> => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    // Sprint 9 8.4 — rule-based crisis tripwire. Runs synchronously before
    // dispatch so the modal can open even if the chat backend is slow/offline.
    // The send still proceeds; the modal is additive.
    if (onCrisisDetected) {
      const detection = detectCrisisSignals(trimmed);
      if (detection.matched) {
        onCrisisDetected(trimmed);
      }
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Scroll after user message appends
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 50);

    try {
      let reply: string;
      let action: ChatMessage["action"] | undefined;

      if (onSendMessage) {
        const result = await onSendMessage(trimmed);
        reply = result.reply;
        action = result.action;
      } else {
        const result = await sendMessage({ input: trimmed, mode: "cbt" });
        reply = result.text;
      }

      // 600ms typing pause minimum (mockChatService already delays, but
      // onSendMessage override may not — keep the indicator visible briefly)
      await new Promise<void>((resolve) => setTimeout(resolve, 600));

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "ai",
        text: reply,
        timestamp: Date.now(),
        action,
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, aiMsg]);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 50);
    } catch {
      setIsTyping(false);
    }
  }, [inputValue, onSendMessage, onCrisisDetected]);

  const renderItem = useCallback(
    ({ item }: { item: ChatMessage }) => (
      <MessageRow item={item} onReactionToggle={handleReactionToggle} />
    ),
    [handleReactionToggle],
  );

  const keyExtractor = useCallback((item: ChatMessage): string => item.id, []);

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={styles.container}
    >
      <ChatHeader
        testID={`${testID}-header`}
        title="Solace"
        status="CBT mode · Online"
        onBack={onClose ?? noop}
        onPhonePress={onPhonePress}
        onMorePress={onMorePress}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <FlatList
          ref={flatListRef}
          testID="message-list"
          data={messages}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          style={styles.messageList}
          contentContainerStyle={[
            styles.messageListContent,
            messages.length === 0 && styles.messageListEmpty,
          ]}
          showsVerticalScrollIndicator={false}
          windowSize={10}
          maxToRenderPerBatch={10}
          initialNumToRender={15}
          removeClippedSubviews
          accessibilityRole="list"
          accessibilityLabel="Chat messages"
          ListEmptyComponent={<EmptyState />}
        />

        {isTyping ? (
          <TypingIndicator
            testID="typing-indicator"
            isTyping
            variant="combined"
            size="md"
            showAvatar={false}
          />
        ) : null}

        <MessageInput
          testID="message-input"
          value={inputValue}
          onChangeText={setInputValue}
          onSend={handleSend}
          placeholder="Type how you feel…"
          showAttachment={false}
          showVoice={false}
        />
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------
// Styles — properties alphabetically sorted per coding rules
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  actionWrapper: {
    marginBottom: 4,
    marginHorizontal: 16,
    marginTop: 2,
  },
  container: {
    flex: 1,
  },
  emptyState: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingTop: 80,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  keyboardAvoid: {
    flex: 1,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingBottom: 16,
    paddingTop: 16,
  },
  messageListEmpty: {
    flex: 1,
  },
  reactionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4,
    marginHorizontal: 16,
    marginTop: 4,
  },
});

export default ActiveChatScreen;
