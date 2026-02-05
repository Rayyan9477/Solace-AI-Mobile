/**
 * Chat Stack Navigator
 * @description Navigation stack for AI therapy chatbot feature screens
 * @module Navigation
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { ChatStackParamList } from "../../../shared/types/navigation";

// Chat Screens
import { ChatsListScreen } from "../../../features/chat/screens/ChatsListScreen";
import { ActiveChatScreen } from "../../../features/chat/screens/ActiveChatScreen";
import { NewConversationScreen } from "../../../features/chat/screens/NewConversationScreen";
import { ChatLimitationsScreen } from "../../../features/chat/screens/ChatLimitationsScreen";
// TODO: Create missing screens or map to existing alternatives
// import { VoiceInputScreen } from "../../../features/chat/screens/VoiceInputScreen";
import { ExpressionAnalysisScreen } from "../../../features/chat/screens/ExpressionAnalysisScreen";
// import { ExpressionAnalysisResultsScreen } from "../../../features/chat/screens/ExpressionAnalysisResultsScreen";
import { BookRecommendationsScreen } from "../../../features/chat/screens/BookRecommendationsScreen";
// import { SleepQualityChartScreen } from "../../../features/chat/screens/SleepQualityChartScreen";
// import { FreudScoreChartScreen } from "../../../features/chat/screens/FreudScoreChartScreen";
// import { CrisisSupportAlertScreen } from "../../../features/chat/screens/CrisisSupportAlertScreen";
import { ChatbotEmptyScreen } from "../../../features/chat/screens/ChatbotEmptyScreen";

const Stack = createNativeStackNavigator<ChatStackParamList>();

/**
 * ChatStack Navigator Component
 * @returns {React.ReactElement} Chat stack navigator
 */
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
      <Stack.Screen name="NewConversation" component={NewConversationScreen} />
      <Stack.Screen name="ChatbotLimitations" component={ChatLimitationsScreen} />
      {/* TODO: Uncomment when screens are created */}
      {/* <Stack.Screen
        name="VoiceInput"
        component={VoiceInputScreen}
        options={{ presentation: "modal" }}
      /> */}
      <Stack.Screen name="ExpressionAnalysis" component={ExpressionAnalysisScreen} />
      {/* <Stack.Screen name="ExpressionAnalysisResults" component={ExpressionAnalysisResultsScreen} /> */}
      <Stack.Screen name="BookRecommendations" component={BookRecommendationsScreen} />
      {/* <Stack.Screen name="SleepQualityChart" component={SleepQualityChartScreen} /> */}
      {/* <Stack.Screen name="FreudScoreChart" component={FreudScoreChartScreen} /> */}
      {/* <Stack.Screen
        name="CrisisSupportAlert"
        component={CrisisSupportAlertScreen}
        options={{ presentation: "modal", animation: "fade" }}
      /> */}
    </Stack.Navigator>
  );
}
