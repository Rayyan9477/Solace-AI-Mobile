/**
 * Crisis Stack Navigator (Sprint 9 Wave 2).
 *
 * Root-mounted modal stack — reachable from any screen via classifier triggers
 * (chat / journal) or explicit "I'm in crisis" affordances (account settings,
 * floating button). Always-on-top, dismissible by user.
 *
 * Routes:
 *   CrisisSupport        — cosmic prototype #12 reskin (Wave 1)
 *   CrisisSupportAlert   — legacy "Crisis Pattern Detected" alert (preserved)
 *   EmergencyContact     — emergency contact form (preserved)
 */

import React from "react";
import { Linking } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { CrisisStackParamList } from "../../../shared/types/navigation";

import { CrisisSupportScreen } from "../../../features/crisis/screens/CrisisSupportScreen";
import { CrisisSupportAlertScreen } from "../../../features/crisis/screens/CrisisSupportAlertScreen";
import { EmergencyContactScreen } from "../../../features/crisis/screens/EmergencyContactScreen";

const Stack = createNativeStackNavigator<CrisisStackParamList>();

function CrisisSupportAlertRoute({ navigation }: any): React.ReactElement | null {
  return (
    <CrisisSupportAlertScreen
      visible
      onCrisisSupport={() => navigation.navigate("CrisisSupport")}
      onCallForHelp={() => {
        Linking.openURL("tel:988").catch(() => undefined);
      }}
      onDismiss={() => navigation.goBack()}
      onClose={() => navigation.goBack()}
    />
  );
}

function CrisisSupportRoute({ navigation }: any): React.ReactElement {
  return (
    <CrisisSupportScreen
      onClose={() => navigation.goBack()}
      onCallHotline={() => {
        Linking.openURL("tel:988").catch(() => undefined);
      }}
      onTextLine={() => {
        Linking.openURL("sms:741741?&body=HOME").catch(() => undefined);
      }}
      onInternational={() => {
        Linking.openURL("https://findahelpline.com").catch(() => undefined);
      }}
      onStartChat={() => navigation.goBack()}
      onDismiss={() => navigation.goBack()}
    />
  );
}

export function CrisisStack(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName="CrisisSupport"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_bottom",
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="CrisisSupport" component={CrisisSupportRoute} />
      <Stack.Screen name="CrisisSupportAlert" component={CrisisSupportAlertRoute} />
      <Stack.Screen name="EmergencyContact" component={EmergencyContactScreen} />
    </Stack.Navigator>
  );
}
