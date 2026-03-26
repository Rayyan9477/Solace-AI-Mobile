/**
 * Sleep Stack Navigator
 * @description Navigation stack for sleep tracking feature screens
 * @module Navigation
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { SleepStackParamList } from "../../../shared/types/navigation";

// Sleep Screens
import { SleepDashboardScreen } from "../../../features/sleep/screens/SleepDashboardScreen";
import { SleepQualityGaugeScreen } from "../../../features/sleep/screens/SleepQualityGaugeScreen";
import { SleepCalendarHistoryScreen } from "../../../features/sleep/screens/SleepCalendarHistoryScreen";
import { SleepInsightsScreen } from "../../../features/sleep/screens/SleepInsightsScreen";
import { NewSleepScheduleScreen } from "../../../features/sleep/screens/NewSleepScheduleScreen";
import { StartSleepingScreen } from "../../../features/sleep/screens/StartSleepingScreen";
import { SleepingScreen } from "../../../features/sleep/screens/SleepingScreen";
import { WakeUpScreen } from "../../../features/sleep/screens/WakeUpScreen";
import { SleepSummaryScreen } from "../../../features/sleep/screens/SleepSummaryScreen";
import { FilterSleepBottomSheet } from "../../../features/sleep/screens/FilterSleepBottomSheet";

const Stack = createNativeStackNavigator<SleepStackParamList>();

// ---------------------------------------------------------------------------
// Route wrappers
// ---------------------------------------------------------------------------

function SleepDashboardRoute({ navigation }: any): React.ReactElement {
  return (
    <SleepDashboardScreen
      sleepScore={72}
      sleepQuality="Good"
      remHours={1.5}
      coreHours={5.5}
      remProgress={0.6}
      coreProgress={0.8}
      onBack={() => navigation.goBack()}
      onSeeAll={() => navigation.navigate("SleepCalendar")}
      onAddSleep={() => navigation.navigate("LogSleepData")}
      onMetricPress={() => navigation.navigate("SleepStages", { date: Date.now() })}
    />
  );
}

function SleepQualityGaugeRoute({ navigation }: any): React.ReactElement {
  return (
    <SleepQualityGaugeScreen
      improvementPercent={12}
      distribution={{ normal: 40, core: 25, rem: 20, irregular: 10, insomniac: 5 }}
      onBack={() => navigation.goBack()}
      onHome={() => navigation.navigate("SleepDashboard")}
      onSettings={() => {}}
      onSegmentPress={() => {}}
      onChartCenter={() => {}}
    />
  );
}

function SleepCalendarHistoryRoute({ navigation }: any): React.ReactElement {
  return (
    <SleepCalendarHistoryScreen
      monthLabel="March 2026"
      calendarDays={[]}
      weekDays={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
      sleepHistory={[]}
      suggestionsCount={0}
      onBack={() => navigation.goBack()}
      onPrevMonth={() => {}}
      onNextMonth={() => {}}
      onDayPress={() => {}}
      onSuggestionsSeeAll={() => {}}
      onHistorySeeAll={() => {}}
      onHistoryItemPress={() => {}}
      onSuggestionsCardPress={() => {}}
      onAddSleep={() => navigation.navigate("LogSleepData")}
    />
  );
}

function SleepInsightsRoute({ navigation }: any): React.ReactElement {
  return (
    <SleepInsightsScreen
      selectedRange="1 Week"
      suggestions={[]}
      onBack={() => navigation.goBack()}
      onRangeChange={() => {}}
      onSuggestionPress={() => {}}
      onSeeAllPress={() => {}}
    />
  );
}

function NewSleepScheduleRoute({ navigation }: any): React.ReactElement {
  return (
    <NewSleepScheduleScreen
      sleepTime="10:00 PM"
      wakeTime="6:00 AM"
      snoozeCount={3}
      selectedDays={["Mon", "Tue", "Wed", "Thu", "Fri"]}
      autoDisplayStats={false}
      autoSetAlarm={true}
      onBack={() => navigation.goBack()}
      onSleepTimePress={() => {}}
      onWakeTimePress={() => {}}
      onSnoozeChange={() => {}}
      onDayToggle={() => {}}
      onAutoDisplayStatsToggle={() => {}}
      onAutoSetAlarmToggle={() => {}}
      onSetSchedule={() => navigation.goBack()}
    />
  );
}

function StartSleepingRoute({ navigation }: any): React.ReactElement {
  return (
    <StartSleepingScreen
      onStartSleep={() => navigation.navigate("SleepHistory")}
      onScheduleSleep={() => navigation.navigate("SleepSchedule")}
    />
  );
}

function SleepingRoute({ navigation }: any): React.ReactElement {
  return (
    <SleepingScreen
      alarmTime="6:00 AM"
      userName="User"
      currentTime="10:30 PM"
      durationHours={0}
      durationMinutes={30}
      onSwipeToWake={() => navigation.navigate("SleepAISuggestions")}
    />
  );
}

function WakeUpRoute({ navigation }: any): React.ReactElement {
  return (
    <WakeUpScreen
      userName="User"
      wakeTime="6:00 AM"
      durationHours={7}
      durationMinutes={30}
      onSwipeToWake={() => navigation.navigate("SleepAISuggestions")}
    />
  );
}

function SleepSummaryRoute({ navigation }: any): React.ReactElement {
  return (
    <SleepSummaryScreen
      totalSleepHours="7h 30m"
      stages={[
        { type: "rem", label: "REM", duration: "1h 30m", color: "#A3C4BC", icon: "moon" },
        { type: "core", label: "Core", duration: "5h 00m", color: "#5B7BB5", icon: "bed" },
        { type: "post", label: "Light", duration: "1h 00m", color: "#C4A535", icon: "sunny" },
      ]}
      onGotIt={() => navigation.navigate("SleepDashboard")}
    />
  );
}

function FilterSleepRoute({ navigation }: any): React.ReactElement {
  return (
    <FilterSleepBottomSheet
      fromDate="Jan 1, 2025"
      toDate="Jan 31, 2025"
      minDuration={0}
      maxDuration={12}
      sleepTypes={[]}
      selectedTypes={[]}
      includeAISuggestion={false}
      resultCount={0}
      onFromDatePress={() => {}}
      onToDatePress={() => {}}
      onTypeToggle={() => {}}
      onAISuggestionToggle={() => {}}
      onApplyFilter={() => navigation.goBack()}
      onHelpPress={() => {}}
    />
  );
}

// ---------------------------------------------------------------------------
// Stack Navigator
// ---------------------------------------------------------------------------

/**
 * SleepStack Navigator Component
 * @returns {React.ReactElement} Sleep stack navigator
 */
export function SleepStack(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName="SleepDashboard"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="SleepDashboard" component={SleepDashboardRoute} />
      <Stack.Screen name="SleepStages" component={SleepQualityGaugeRoute} />
      <Stack.Screen name="SleepCalendar" component={SleepCalendarHistoryRoute} />
      <Stack.Screen name="SleepInsights" component={SleepInsightsRoute} />
      <Stack.Screen name="SleepSchedule" component={NewSleepScheduleRoute} />
      <Stack.Screen name="LogSleepData" component={StartSleepingRoute} />
      <Stack.Screen name="SleepHistory" component={SleepingRoute} />
      <Stack.Screen
        name="SleepQualityIncrease"
        component={WakeUpRoute}
        options={{ presentation: "modal", animation: "fade" }}
      />
      <Stack.Screen
        name="SleepAISuggestions"
        component={SleepSummaryRoute}
        options={{ presentation: "modal", animation: "fade" }}
      />
      <Stack.Screen
        name="SleepReminders"
        component={FilterSleepRoute}
        options={{ presentation: "modal", animation: "fade" }}
      />
    </Stack.Navigator>
  );
}
