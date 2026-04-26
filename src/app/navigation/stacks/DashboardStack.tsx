/**
 * Dashboard Stack Navigator
 * @description Navigation stack for dashboard / home feature screens.
 *
 * Sprint 4 (prototype v4.2): slimmed to HomeDashboard. The Solace-Score
 * detail / insights / suggestions sub-screens were deleted; S6 builds
 * Home v2 (prototype #20) which absorbs the score-card + insights inline.
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { DashboardStackParamList } from "../../../shared/types/navigation";

import { HomeDashboardScreen } from "../../../features/dashboard/screens/HomeDashboardScreen";

const Stack = createNativeStackNavigator<DashboardStackParamList>();

export function DashboardStack(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName="HomeDashboard"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="HomeDashboard" component={HomeDashboardScreen} />
    </Stack.Navigator>
  );
}
