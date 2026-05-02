/**
 * Search Stack Navigator (Sprint 9 Wave 2).
 *
 * Single-screen stack — internal state drives result categories. Mounted as
 * a root-level modal (`SearchModal`) reachable via the search IconButton in
 * any tab header.
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { SearchStackParamList } from "../../../shared/types/navigation";

import { SearchResultsScreen } from "../../../features/search/screens/SearchResultsScreen";

const Stack = createNativeStackNavigator<SearchStackParamList>();

function SearchResultsRoute({ navigation, route }: any): React.ReactElement {
  return (
    <SearchResultsScreen
      query={route.params?.query ?? ""}
      onBack={() => navigation.goBack()}
      onClear={() => {}}
      onQueryChange={() => {}}
      onCategoryChange={() => {}}
      onResultPress={() => {}}
    />
  );
}

export function SearchStack(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName="SearchResults"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="SearchResults" component={SearchResultsRoute} />
    </Stack.Navigator>
  );
}
