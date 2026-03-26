/**
 * Stress Stack Navigator
 * @description Navigation stack for stress management feature screens
 * @module Navigation
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { StressStackParamList } from "../../../shared/types/navigation";

// Stress Screens
import { StressDashboardScreen } from "../../../features/stress/screens/StressDashboardScreen";
import { StressLevelInputScreen } from "../../../features/stress/screens/StressLevelInputScreen";
import { StressorSelectorScreen } from "../../../features/stress/screens/StressorSelectorScreen";
import { RecordExpressionPrepScreen } from "../../../features/stress/screens/RecordExpressionPrepScreen";
import { FacialExpressionCameraScreen } from "../../../features/stress/screens/FacialExpressionCameraScreen";
import { StressLevelConfirmationScreen } from "../../../features/stress/screens/StressLevelConfirmationScreen";
import { StressLevelStatsScreen } from "../../../features/stress/screens/StressLevelStatsScreen";

const Stack = createNativeStackNavigator<StressStackParamList>();

// ---------------------------------------------------------------------------
// Route wrappers
// ---------------------------------------------------------------------------

function StressDashboardRoute({ navigation }: any): React.ReactElement {
  return (
    <StressDashboardScreen
      stressScore={45}
      stressLabel="Moderate"
      primaryStressor="Work"
      impactLevel="Medium"
      onBack={() => navigation.goBack()}
      onSettingsPress={() => navigation.navigate("StressTrends")}
      onSeeAllPress={() => navigation.navigate("StressTrends")}
      onStressorCardPress={() => navigation.navigate("StressTriggers")}
      onImpactCardPress={() => navigation.navigate("StressAssessment")}
    />
  );
}

function StressLevelInputRoute({ navigation }: any): React.ReactElement {
  return (
    <StressLevelInputScreen
      selectedLevel={3}
      levelLabel="Moderate"
      onBack={() => navigation.goBack()}
      onLevelSelect={() => {}}
      onContinue={() => navigation.navigate("StressTriggers")}
    />
  );
}

function StressorSelectorRoute({ navigation }: any): React.ReactElement {
  return (
    <StressorSelectorScreen
      stressors={[
        { id: "work", label: "Work" },
        { id: "family", label: "Family" },
        { id: "health", label: "Health" },
        { id: "finances", label: "Finances" },
        { id: "relationships", label: "Relationships" },
      ]}
      selectedStressorId={null}
      impactLevel="Medium"
      onBack={() => navigation.goBack()}
      onStressorSelect={() => {}}
      onContinue={() => navigation.navigate("CopingStrategies")}
    />
  );
}

function RecordExpressionPrepRoute({ navigation }: any): React.ReactElement {
  return (
    <RecordExpressionPrepScreen
      requirements={[
        { id: "lighting", label: "Good lighting", icon: "sunny" },
        { id: "face", label: "Face visible", icon: "person" },
        { id: "neutral", label: "Neutral background", icon: "image" },
      ]}
      onBack={() => navigation.goBack()}
      onSkip={() => navigation.navigate("CopingStrategies")}
      onContinue={() => navigation.navigate("QuickRelief")}
    />
  );
}

function FacialExpressionCameraRoute({ navigation }: any): React.ReactElement {
  return (
    <FacialExpressionCameraScreen
      heartRate={72}
      bloodPressureSys={120}
      instructionText="Position your face in the frame"
      onSettingsPress={() => {}}
      onCapture={() => navigation.navigate("CopingStrategies")}
    />
  );
}

function StressLevelConfirmationRoute({ navigation }: any): React.ReactElement {
  return (
    <StressLevelConfirmationScreen
      stressLevel={3}
      onBack={() => navigation.goBack()}
      onGotIt={() => navigation.navigate("StressDashboard")}
      onClose={() => navigation.navigate("StressDashboard")}
    />
  );
}

function StressLevelStatsRoute({ navigation }: any): React.ReactElement {
  return (
    <StressLevelStatsScreen
      bubbles={[
        { level: "Low", count: 12, color: "#4CAF50" },
        { level: "Moderate", count: 8, color: "#FF9800" },
        { level: "High", count: 5, color: "#F44336" },
      ]}
      selectedPeriod="Monthly"
      onBack={() => navigation.goBack()}
      onSettingsPress={() => {}}
      onPeriodChange={() => {}}
      onBubblePress={() => {}}
    />
  );
}

// ---------------------------------------------------------------------------
// Stack Navigator
// ---------------------------------------------------------------------------

/**
 * StressStack Navigator Component
 * @returns {React.ReactElement} Stress stack navigator
 */
export function StressStack(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName="StressDashboard"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="StressDashboard" component={StressDashboardRoute} />
      <Stack.Screen name="StressAssessment" component={StressLevelInputRoute} />
      <Stack.Screen name="StressTriggers" component={StressorSelectorRoute} />
      <Stack.Screen name="CopingStrategies" component={RecordExpressionPrepRoute} />
      <Stack.Screen name="QuickRelief" component={FacialExpressionCameraRoute} />
      <Stack.Screen
        name="BreathingExercise"
        component={StressLevelConfirmationRoute}
        options={{ presentation: "modal", animation: "fade" }}
      />
      <Stack.Screen name="StressTrends" component={StressLevelStatsRoute} />
    </Stack.Navigator>
  );
}
