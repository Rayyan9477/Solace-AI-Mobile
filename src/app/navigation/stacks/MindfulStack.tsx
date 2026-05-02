/**
 * Mindful Stack Navigator (Sprint 9 Wave 2).
 *
 * MindfulnessLibrary → MindfulPlayer / BreathingExerciseActive / Soundscapes
 * → SessionComplete (modal celebration on session end).
 *
 * Mounted as a root-level modal (`MindfulModal` in RootStackParamList) so it
 * can be opened from anywhere — Today's-practice tile on home, "Start a
 * session" CTA, or a deep-link.
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { MindfulStackParamList } from "../../../shared/types/navigation";

import { MindfulnessLibraryScreen } from "../../../features/mindful/screens/MindfulnessLibraryScreen";
import { MindfulPlayerScreen } from "../../../features/mindful/screens/MindfulPlayerScreen";
import { BreathingExerciseActiveScreen } from "../../../features/mindful/screens/BreathingExerciseActiveScreen";
import { SessionCompleteScreen } from "../../../features/mindful/screens/SessionCompleteScreen";
import { SoundscapesScreen } from "../../../features/mindful/screens/SoundscapesScreen";

const Stack = createNativeStackNavigator<MindfulStackParamList>();

function MindfulnessLibraryRoute({ navigation }: any): React.ReactElement {
  return (
    <MindfulnessLibraryScreen
      onSearch={() => {}}
      onCategoryChange={() => {}}
      onSelectSession={(id: string) =>
        navigation.navigate("MindfulPlayer", { sessionId: id })
      }
      onFeatured={() =>
        navigation.navigate("MindfulPlayer", { sessionId: "monday-reset" })
      }
    />
  );
}

function MindfulPlayerRoute({ navigation }: any): React.ReactElement {
  return (
    <MindfulPlayerScreen
      title="Monday reset"
      durationSeconds={600}
      positionSeconds={0}
      isPlaying={false}
      category="MEDITATION"
      narrator="MAYA WONG"
      onClose={() => navigation.goBack()}
      onPlayPause={() => {}}
    />
  );
}

function BreathingExerciseActiveRoute({ navigation }: any): React.ReactElement {
  return (
    <BreathingExerciseActiveScreen
      onClose={() => navigation.goBack()}
      onTogglePause={() => {}}
      onRestart={() => {}}
      onSettings={() => {}}
    />
  );
}

function SessionCompleteRoute({ navigation, route }: any): React.ReactElement {
  return (
    <SessionCompleteScreen
      sessionMinutes={route.params?.sessionMinutes}
      sessionTitle={route.params?.sessionTitle}
      onClose={() => navigation.popToTop()}
      onCheckIn={() => navigation.popToTop()}
      onBack={() => navigation.popToTop()}
    />
  );
}

function SoundscapesRoute({ navigation }: any): React.ReactElement {
  return (
    <SoundscapesScreen
      onSelectSound={() => {}}
      onTogglePlayback={() => {}}
    />
  );
}

export function MindfulStack(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName="MindfulnessLibrary"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="MindfulnessLibrary" component={MindfulnessLibraryRoute} />
      <Stack.Screen name="MindfulPlayer" component={MindfulPlayerRoute} />
      <Stack.Screen
        name="BreathingExerciseActive"
        component={BreathingExerciseActiveRoute}
        options={{ animation: "slide_from_bottom" }}
      />
      <Stack.Screen
        name="SessionComplete"
        component={SessionCompleteRoute}
        options={{ animation: "slide_from_bottom", gestureEnabled: false }}
      />
      <Stack.Screen name="Soundscapes" component={SoundscapesRoute} />
    </Stack.Navigator>
  );
}
