/**
 * Chat Stack Navigator
 * @description Navigation stack for AI therapy chatbot feature screens.
 *
 * Sprint 4 (prototype v4.2): slimmed to ChatsList + ActiveChat.
 * Sprint 8 additions: VoiceSession (#25), SessionSummary (#26), CbtThoughtRecord
 * (#27). New routes are wrapped in lightweight containers so feature screens can
 * keep their explicit prop interfaces (no implicit `route` coupling).
 *
 * Sprint 11: ChatsList wired to `chat.listConversations()`. ActiveChat
 * persists each user/assistant turn via `chat.appendMessage()` (write path).
 *
 * Phase 1.6: the three swallowed writes here now report. A failed
 * `createConversation` used to leave the "+" button looking inert (roadmap
 * B5); a failed `appendMessage` left the turn on screen while the transcript
 * was never written, so reopening the conversation lost it without warning.
 */

import React, { useCallback, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { NavigationProp } from "@react-navigation/native";
import type {
  ChatStackParamList,
  RootStackParamList,
} from "../../../shared/types/navigation";

import { ChatsListScreen } from "../../../features/chat/screens/ChatsListScreen";
import {
  ActiveChatScreen,
  type ChatMessage as ScreenChatMessage,
} from "../../../features/chat/screens/ActiveChatScreen";
import type { Conversation as ScreenConversation } from "../../../features/chat/screens/ChatsListScreen";
import { VoiceSessionScreen } from "../../../features/chat/screens/VoiceSessionScreen";
import { SessionSummaryScreen } from "../../../features/chat/screens/SessionSummaryScreen";
import {
  CbtThoughtRecordScreen,
  type CbtField,
  type CbtStepIndex,
} from "../../../features/chat/screens/CbtThoughtRecordScreen";
import { ScreenSkeleton } from "../../../shared/components/primitives/ScreenSkeleton";
import { logSilentFailure } from "../../../shared/utils/logSilentFailure";
import { useWriteFailureToast } from "../../../shared/utils/useWriteFailureToast";
import { useRepositories } from "../../providers/RepositoryProvider";
import { sendMessage as mockSendMessage } from "../../../features/chat/services/mockChatService";
import type {
  ChatConversation,
  ChatMessage,
} from "../../../shared/data/types";

const Stack = createNativeStackNavigator<ChatStackParamList>();

const noop = (): void => {
  /* placeholder — wired to real handlers in a future sprint */
};

// ---------------------------------------------------------------------------
// Containers (provide concrete props for feature screens)
// ---------------------------------------------------------------------------

function ChatsListScreenContainer({
  navigation,
}: NativeStackScreenProps<
  ChatStackParamList,
  "ChatsList"
>): React.ReactElement {
  const { chat, isReady } = useRepositories();
  const { reportWriteFailure, failureToast } = useWriteFailureToast();
  const [filter, setFilter] = useState<"all" | "active" | "archived">("all");
  const [enriched, setEnriched] = React.useState<
    readonly EnrichedConversation[] | null
  >(null);

  React.useEffect(() => {
    if (!isReady) return;
    let cancelled = false;
    void (async () => {
      const list = await chat.listConversations();
      // Enrich each conversation with its message count + latest preview text.
      // N+1 queries are acceptable for the conversation-list scale (<50 rows);
      // a future sprint can fold these into a denormalised conversations view.
      const withCounts = await Promise.all(
        list.map(async (conv) => {
          const msgs = await chat.listMessages(conv.id);
          return {
            conv,
            msgCount: msgs.length,
            preview: msgs.length > 0 ? msgs[msgs.length - 1]!.content : "",
          };
        }),
      );
      if (cancelled) return;
      setEnriched(withCounts);
    })();
    return () => {
      cancelled = true;
    };
  }, [chat, isReady]);

  const handleNewConversation = useCallback(async () => {
    try {
      const created = await chat.createConversation({ mode: "general" });
      navigation.navigate("ActiveChat", { conversationId: created.id });
    } catch (error) {
      // Roadmap B5: this is the "+" that did nothing. Not navigating is
      // correct — there is no conversation to navigate to — but the user has
      // to be told that, or the button reads as broken.
      reportWriteFailure({
        operation: "chat.createConversation",
        error,
        message: "We couldn't start a new conversation. Please try again.",
      });
    }
  }, [chat, navigation, reportWriteFailure]);

  if (!isReady || !enriched) {
    return (
      <ScreenSkeleton testID="chats-list-skeleton" />
    );
  }

  const screenConversations = enriched.map(toScreenConversation);

  return (
    <>
      <ChatsListScreen
        conversations={screenConversations}
        selectedFilter={filter}
        onSearch={noop}
        onNewConversation={handleNewConversation}
        onConversationPress={(id) =>
          navigation.navigate("ActiveChat", { conversationId: id })
        }
        onFilterChange={setFilter}
      />
      {failureToast}
    </>
  );
}

function ActiveChatScreenContainer({
  navigation,
  route,
}: NativeStackScreenProps<
  ChatStackParamList,
  "ActiveChat"
>): React.ReactElement {
  const { chat, isReady } = useRepositories();
  const { reportWriteFailure, failureToast } = useWriteFailureToast();
  const conversationId = route.params?.conversationId;
  const [messages, setMessages] = React.useState<
    readonly ChatMessage[] | null
  >(null);

  React.useEffect(() => {
    if (!isReady || !conversationId) return;
    let cancelled = false;
    void (async () => {
      const list = await chat.listMessages(conversationId);
      if (cancelled) return;
      setMessages(list);
    })();
    return () => {
      cancelled = true;
    };
  }, [chat, conversationId, isReady]);

  // Write path: persist every user message + every AI reply.
  const handleSendMessage = useCallback(
    async (
      text: string,
    ): Promise<{ reply: string; action?: ScreenChatMessage["action"] }> => {
      if (!isReady || !conversationId) {
        return { reply: "I'm here. Tell me more." };
      }
      // The turn is already on screen by the time we get here, so a failed
      // write cannot be rolled back — the honest move is to say the
      // transcript is not being kept, before the user types anything they
      // would mind losing.
      const reportTranscriptLoss = (error: unknown, role: string): void => {
        reportWriteFailure({
          operation: "chat.appendMessage",
          error,
          message:
            "This conversation isn't being saved right now. You can keep talking, but it won't be here later.",
          // Never log `content`: chat bodies are the most sensitive text in
          // the app after journal entries.
          context: { conversationId, role },
        });
      };

      try {
        await chat.appendMessage({
          conversationId,
          role: "user",
          content: text,
        });
      } catch (error) {
        reportTranscriptLoss(error, "user");
      }
      // Generate the assistant reply via the real mock service so the user
      // sees varied responses, then persist the SAME reply so reloading the
      // conversation shows the history they actually experienced.
      let reply: string;
      try {
        const response = await mockSendMessage({ input: text, mode: "cbt" });
        reply = response.text;
      } catch (error) {
        // Service-level failure — fall back to a brief acknowledgement so the
        // conversation never strands the user without a response. No toast:
        // this one HAS a visible fallback, so the user is not misled.
        logSilentFailure("mockChatService.sendMessage", error, {
          conversationId,
        });
        reply = "I'm here. Tell me more.";
      }
      try {
        await chat.appendMessage({
          conversationId,
          role: "assistant",
          content: reply,
        });
      } catch (error) {
        reportTranscriptLoss(error, "assistant");
      }
      return { reply };
    },
    [chat, conversationId, isReady, reportWriteFailure],
  );

  if (!isReady || !messages) {
    return (
      <ScreenSkeleton testID="active-chat-skeleton" />
    );
  }

  return (
    <>
      <ActiveChatScreen
        conversationId={conversationId}
        initialMessages={messages.map(toScreenMessage)}
        onSendMessage={handleSendMessage}
        onClose={() => navigation.goBack()}
        onCrisisDetected={() => {
          // Classifier tripwire — open the root-mounted crisis modal.
          // Send is not blocked; modal is additive overlay.
          navigation
            .getParent<NavigationProp<RootStackParamList>>()
            ?.navigate("CrisisModal", { screen: "CrisisSupport" });
        }}
      />
      {failureToast}
    </>
  );
}

function VoiceSessionScreenContainer(): React.ReactElement {
  const [paused, setPaused] = useState<boolean>(false);
  const handleToggle = useCallback(() => {
    setPaused((p) => !p);
  }, []);
  return (
    <VoiceSessionScreen
      isPaused={paused}
      onClose={noop}
      onTogglePause={handleToggle}
      onSwitchToKeyboard={noop}
      onEnd={noop}
    />
  );
}

function SessionSummaryScreenContainer(): React.ReactElement {
  return (
    <SessionSummaryScreen
      onShare={noop}
      onScheduleReminder={noop}
      onBackToHome={noop}
    />
  );
}

function CbtThoughtRecordScreenContainer(): React.ReactElement {
  const [step, setStep] = useState<CbtStepIndex>(1);
  const [values, setValues] = useState<Record<CbtField, string>>({
    situation: "",
    thought: "",
    emotion: "",
    reframe: "",
    action: "",
  });
  const [distortions, setDistortions] = useState<string[]>([]);

  const handleTextChange = useCallback(
    (field: CbtField, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleToggleDistortion = useCallback((label: string) => {
    setDistortions((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  }, []);

  const handleNext = useCallback(() => {
    setStep((s) => (s < 5 ? ((s + 1) as CbtStepIndex) : s));
  }, []);

  const handleBack = useCallback(() => {
    setStep((s) => (s > 1 ? ((s - 1) as CbtStepIndex) : s));
  }, []);

  return (
    <CbtThoughtRecordScreen
      currentStep={step}
      situation={values.situation}
      thought={values.thought}
      emotion={values.emotion}
      reframe={values.reframe}
      action={values.action}
      selectedDistortions={distortions}
      onTextChange={handleTextChange}
      onToggleDistortion={handleToggleDistortion}
      onBack={handleBack}
      onNext={handleNext}
    />
  );
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

const HUE_BY_INDEX: ScreenConversation["hue"][] = [
  "sage",
  "lavender",
  "peach",
  "aurora",
];

interface EnrichedConversation {
  conv: ChatConversation;
  msgCount: number;
  preview: string;
}

function toScreenConversation(
  enriched: EnrichedConversation,
  index: number,
): ScreenConversation {
  const { conv, msgCount, preview } = enriched;
  return {
    id: conv.id,
    title: conv.title ?? "Conversation",
    preview,
    hue: HUE_BY_INDEX[index % HUE_BY_INDEX.length] ?? "sage",
    tag: conv.mode === "cbt"
      ? "CBT"
      : conv.mode === "mindfulness"
        ? "Mindfulness"
        : conv.mode === "sleep"
          ? "Sleep"
          : "Support",
    msgs: msgCount,
    time: formatTimeAgo(conv.lastMessageAt ?? conv.updatedAt),
  };
}

function toScreenMessage(msg: ChatMessage): ScreenChatMessage {
  return {
    id: msg.id,
    role: msg.role === "user" ? "user" : "ai",
    text: msg.content,
    timestamp: msg.createdAt,
  };
}

function formatTimeAgo(ms: number): string {
  const delta = Math.max(0, Date.now() - ms);
  if (delta < 60_000) return "now";
  if (delta < 3_600_000) return `${Math.round(delta / 60_000)}m`;
  if (delta < 86_400_000) return `${Math.round(delta / 3_600_000)}h`;
  if (delta < 7 * 86_400_000) return `${Math.round(delta / 86_400_000)}d`;
  return `${Math.round(delta / (7 * 86_400_000))}w`;
}

// ---------------------------------------------------------------------------
// Stack
// ---------------------------------------------------------------------------

export function ChatStack(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName="ChatsList"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="ChatsList" component={ChatsListScreenContainer} />
      <Stack.Screen name="ActiveChat" component={ActiveChatScreenContainer} />
      <Stack.Screen
        name="VoiceSession"
        component={VoiceSessionScreenContainer}
      />
      <Stack.Screen
        name="SessionSummary"
        component={SessionSummaryScreenContainer}
      />
      <Stack.Screen
        name="CbtThoughtRecord"
        component={CbtThoughtRecordScreenContainer}
      />
    </Stack.Navigator>
  );
}
