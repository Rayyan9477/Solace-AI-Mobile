/**
 * Chat Stack Navigator
 * @description Navigation stack for AI therapy chatbot feature screens.
 *
 * Sprint 4 (prototype v4.2): slimmed to ChatsList + ActiveChat.
 * Sprint 8 additions: VoiceSession (#25), SessionSummary (#26), CbtThoughtRecord
 * (#27). New routes are wrapped in lightweight containers so feature screens can
 * keep their explicit prop interfaces (no implicit `route` coupling).
 */

import React, { useCallback, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { ChatStackParamList } from "../../../shared/types/navigation";

import { ChatsListScreen } from "../../../features/chat/screens/ChatsListScreen";
import { ActiveChatScreen } from "../../../features/chat/screens/ActiveChatScreen";
import { VoiceSessionScreen } from "../../../features/chat/screens/VoiceSessionScreen";
import { SessionSummaryScreen } from "../../../features/chat/screens/SessionSummaryScreen";
import {
  CbtThoughtRecordScreen,
  type CbtField,
  type CbtStepIndex,
} from "../../../features/chat/screens/CbtThoughtRecordScreen";

const Stack = createNativeStackNavigator<ChatStackParamList>();

const noop = (): void => {
  /* placeholder — wired to real handlers in a future sprint */
};

// ---------------------------------------------------------------------------
// Containers (provide concrete props for feature screens)
// ---------------------------------------------------------------------------

function ChatsListScreenContainer(): React.ReactElement {
  const [filter, setFilter] = useState<"all" | "active" | "archived">("all");
  return (
    <ChatsListScreen
      selectedFilter={filter}
      onSearch={noop}
      onNewConversation={noop}
      onConversationPress={noop}
      onFilterChange={setFilter}
    />
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
      <Stack.Screen name="ActiveChat" component={ActiveChatScreen} />
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
