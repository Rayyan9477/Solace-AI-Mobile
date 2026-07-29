/**
 * Search Stack Navigator (Sprint 9 Wave 2).
 *
 * Single-screen stack — internal state drives the query and category filter.
 * Mounted as a root-level modal (`SearchModal`) reachable via the search
 * IconButton in any tab header, and via the `solace://search/:query` deep link.
 *
 * Phase 1 (2026-07-28): this adapter used to forward `route.params.query` and
 * nothing else. `SearchResultsScreen` therefore fell back to 24 invented hits,
 * so every query returned the same fabricated results — `/search/zzzzqqq`
 * reported "24 RESULTS FOR "ZZZZQQQ"". It now owns the query, reads the user's
 * journal from the repository, and runs a real index over that plus the bundled
 * practice catalogue. See `shared/services/search/searchService`.
 */

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import {
  SearchResultsScreen,
  type SearchCategory,
  type SearchResultType,
} from "../../../features/search/screens/SearchResultsScreen";
import { ScreenSkeleton } from "../../../shared/components/primitives/ScreenSkeleton";
import { findPractice } from "../../../shared/content/catalog";
import type { JournalEntry } from "../../../shared/data/types";
import { searchContent } from "../../../shared/services/search/searchService";
import type { SearchStackParamList } from "../../../shared/types/navigation";
import { useRepositories } from "../../providers/RepositoryProvider";

const Stack = createNativeStackNavigator<SearchStackParamList>();

/**
 * How many journal rows are searchable. The index is rebuilt in memory on every
 * keystroke, so this bounds the work; it is far above any realistic local
 * journal, and the cap is logged here rather than hidden.
 */
const JOURNAL_SEARCH_LIMIT = 500;

function SearchResultsRoute({ navigation, route }: any): React.ReactElement {
  const { journal: journalRepo, isReady } = useRepositories();
  const [query, setQuery] = React.useState<string>(route.params?.query ?? "");
  const [category, setCategory] = React.useState<SearchCategory>("all");
  const [entries, setEntries] = React.useState<readonly JournalEntry[] | null>(
    null,
  );

  React.useEffect(() => {
    if (!isReady) return;
    let cancelled = false;
    void (async () => {
      const list = await journalRepo.list({ limit: JOURNAL_SEARCH_LIMIT });
      if (cancelled) return;
      setEntries(list);
    })();
    return () => {
      cancelled = true;
    };
  }, [isReady, journalRepo]);

  const results = React.useMemo(
    () => searchContent(query, { journal: entries ?? [] }),
    [query, entries],
  );

  const handleResultPress = (id: string, type: SearchResultType): void => {
    if (type === "journal") {
      navigation.navigate("MainFlow", {
        screen: "JournalTab",
        params: { screen: "JournalEntryDetail", params: { entryId: id } },
      });
      return;
    }

    // Practices are bundled content, so the catalogue knows which surface each
    // one opens. An unknown id means the index and the catalogue disagree —
    // do nothing rather than navigate somewhere arbitrary.
    const practice = findPractice(id);
    if (!practice) return;

    navigation.navigate("MindfulModal", {
      screen: practice.kind === "soundscape" ? "Soundscapes" : "MindfulPlayer",
      params: practice.kind === "soundscape" ? undefined : { sessionId: id },
    });
  };

  if (!isReady || !entries) {
    return <ScreenSkeleton testID="search-skeleton" />;
  }

  return (
    <SearchResultsScreen
      query={query}
      results={results}
      selectedCategory={category}
      onBack={() => navigation.goBack()}
      onClear={() => setQuery("")}
      onQueryChange={setQuery}
      onCategoryChange={setCategory}
      onResultPress={handleResultPress}
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
