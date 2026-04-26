/**
 * Chat Stack Navigator
 * @description Navigation stack for AI therapy chatbot feature screens.
 *
 * Sprint 4 (prototype v4.2): slimmed to ChatsList + ActiveChat. The 21
 * over-fragmented chat-detail screens (voice input, expression analysis,
 * book recommendations, etc.) were deleted; S6 reskins the survivors with
 * inline action cards instead of separate routes.
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { ChatStackParamList } from "../../../shared/types/navigation";

import { ChatsListScreen } from "../../../features/chat/screens/ChatsListScreen";
import { ActiveChatScreen } from "../../../features/chat/screens/ActiveChatScreen";

const Stack = createNativeStackNavigator<ChatStackParamList>();

export function ChatStack(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName="ChatsList"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="ChatsList" component={ChatsListScreen} />
      <Stack.Screen name="ActiveChat" component={ActiveChatScreen} />
    </Stack.Navigator>
  );
}
