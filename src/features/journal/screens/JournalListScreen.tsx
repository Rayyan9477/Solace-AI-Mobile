import { logger } from "@shared/utils/logger";

/**
 * Journal List Screen - My Journals view
 * Based on ui-designs/Dark-mode/Mental Health Journal.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import mentalHealthAPI from "@app/services/mentalHealthAPI";
import dataPersistence from "@app/services/dataPersistence";
import { ScreenErrorBoundary } from "@shared/components/ErrorBoundaryWrapper";

interface JournalEntry {
  id: string;
  title: string;
  preview: string;
  mood: string;
  date: string;
  tags: string[];
  color: string;
}

const MOCK_JOURNALS: JournalEntry[] = [
  {
    id: "1",
    title: "Feeling Positive Today 😊",
    preview:
      "I'm grateful for the supportive phone call from my friend today...",
    mood: "😊",
    date: "22",
    tags: ["Grateful", "Progress"],
    color: "#98B068",
  },
  {
    id: "2",
    title: "Can't focus too my day",
    preview: "I experienced anxiety today while taking the exam...",
    mood: "😰",
    date: "21",
    tags: ["AI Suggestions", "Triggers"],
    color: "#E0A500",
  },
  {
    id: "3",
    title: "Felt Bad, but I'm OK",
    preview: "I felt stressed doing the team meeting, but at...",
    mood: "😔",
    date: "20",
    tags: ["AI Suggestions", "Triggers"],
    color: "#ED7E1C",
  },
  {
    id: "4",
    title: "I was sad & Grateful",
    preview: "feeling sad today after knowing the bad news that...",
    mood: "😢",
    date: "19",
    tags: ["AI Suggestions"],
    color: "#6B5FC8",
  },
];

const JournalListScreenComponent = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [filter, setFilter] = useState<"all" | "recent">("recent");
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadJournals();
  }, []);

  const loadJournals = async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);

    try {
      let journalData: JournalEntry[] = [];

      try {
        // Try to fetch from API
        const apiJournals = await mentalHealthAPI.journal.getEntries(1, 50);

        // Transform API data to match our interface
        interface APIJournalEntry {
          id?: string;
          title?: string;
          content?: string;
          mood?: string;
          timestamp: string;
          tags?: string[];
        }
        journalData = (apiJournals as APIJournalEntry[]).map((journal) => ({
          id: journal.id || `journal_${Date.now()}_${Math.random()}`,
          title: journal.title || "Untitled",
          preview: journal.content?.substring(0, 100) || "No content",
          mood: getMoodEmoji(journal.mood || "Neutral"),
          date: new Date(journal.timestamp).getDate().toString(),
          tags: journal.tags || [],
          color: getMoodColor(journal.mood || "Neutral"),
        }));

        // Cache the data
        await dataPersistence.saveJournalEntries(apiJournals);

      } catch (apiError) {
        logger.debug("API unavailable, using local data");

        // Fallback to local storage
        const cachedJournals = await dataPersistence.getJournalEntries();

        journalData = cachedJournals.map((journal) => ({
          id: journal.id || `journal_${Date.now()}_${Math.random()}`,
          title: journal.title || "Untitled",
          preview: journal.content?.substring(0, 100) || "No content",
          mood: getMoodEmoji(String(journal.mood) || "Neutral"),
          date: new Date(journal.timestamp || Date.now()).getDate().toString(),
          tags: journal.tags || [],
          color: getMoodColor(String(journal.mood) || "Neutral"),
        }));

        // If no cached data, use mock data as last resort
        if (journalData.length === 0) {
          journalData = MOCK_JOURNALS;
        }
      }

      setJournals(journalData);

    } catch (error) {
      logger.error("Failed to load journals:", error);
      setErrorMessage("Unable to load journals. Please try again.");
      // Use mock data on error
      setJournals(MOCK_JOURNALS);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const getMoodEmoji = (mood: string): string => {
    const emojiMap: Record<string, string> = {
      "Happy": "😊",
      "Sad": "😢",
      "Anxious": "😰",
      "Angry": "😠",
      "Neutral": "😐",
      "Excited": "🤩",
      "Stressed": "😔",
      "Grateful": "🙏",
    };
    return emojiMap[mood] || "😐";
  };

  const getMoodColor = (mood: string): string => {
    const colorMap: Record<string, string> = {
      "Happy": "#98B068",
      "Sad": "#6B5FC8",
      "Anxious": "#E0A500",
      "Angry": "#ED7E1C",
      "Neutral": "#808080",
      "Excited": "#4CAF50",
      "Stressed": "#FF5722",
      "Grateful": "#2196F3",
    };
    return colorMap[mood] || "#808080";
  };

  const renderJournalCard = ({ item }: { item: JournalEntry }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.colors.brown["10"] }]}
      onPress={() => navigation.navigate("JournalDetail", { id: item.id })}
      accessible
      accessibilityLabel={`Journal entry: ${item.title}`}
      accessibilityHint="Double tap to view full entry"
    >
      <View style={styles.cardHeader}>
        <View style={styles.dateBox}>
          <Text style={styles.dateNumber}>{item.date}</Text>
        </View>
        <View style={styles.moodBadge}>
          <Text style={styles.moodEmoji}>{item.mood}</Text>
        </View>
      </View>

      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        {item.title}
      </Text>

      <Text
        style={[styles.preview, { color: theme.colors.text.secondary }]}
        numberOfLines={2}
      >
        {item.preview}
      </Text>

      <View style={styles.tags}>
        {/* LOW-NEW-002 FIX: Use tag text as stable key instead of index */}
        {item.tags.map((tag) => (
          <View
            key={`tag-${item.id}-${tag}`}
            style={[styles.tag, { backgroundColor: `${item.color}20` }]}
          >
            <Text style={[styles.tagText, { color: item.color }]}>{tag}</Text>
          </View>
        ))}
        <Text style={[styles.triggers, { color: theme.colors.text.tertiary }]}>
          0 - 7 AI Suggestions
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text
            style={[styles.backButton, { color: theme.colors.text.primary }]}
          >
            ←
          </Text>
        </TouchableOpacity>
        <Text
          style={[styles.headerTitle, { color: theme.colors.text.primary }]}
        >
          My Journals
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Date filter */}
      <View style={styles.dateFilter}>
        <Text
          style={[styles.dateLabel, { color: theme.colors.text.secondary }]}
        >
          Nov
        </Text>
        {["22", "23", "24", "25", "26"].map((day, index) => (
          <View
            key={day}
            style={[
              styles.dateCircle,
              index === 0 && { backgroundColor: theme.colors.green["60"] },
            ]}
          >
            <Text
              style={[
                styles.dateText,
                { color: index === 0 ? "#fff" : theme.colors.text.primary },
              ]}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Filter toggle */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "recent" && {
              backgroundColor: theme.colors.brown["30"],
            },
          ]}
          onPress={() => setFilter("recent")}
        >
          <Text
            style={[
              styles.filterText,
              {
                color:
                  filter === "recent"
                    ? theme.colors.brown["100"]
                    : theme.colors.text.secondary,
              },
            ]}
          >
            Recent
          </Text>
        </TouchableOpacity>
      </View>

      {/* Error state */}
      {errorMessage && !isLoading && (
        <View style={{ padding: 20, backgroundColor: theme.colors.red["20"], borderRadius: 12, margin: 16 }}>
          <Text style={{ color: theme.colors.red["80"], textAlign: "center" }}>
            {errorMessage}
          </Text>
          <TouchableOpacity
            style={{ marginTop: 12, padding: 8 }}
            onPress={() => loadJournals()}
          >
            <Text style={{ color: theme.colors.red["100"], textAlign: "center", fontWeight: "600" }}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading state */}
      {isLoading && !isRefreshing ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 100 }}>
          <ActivityIndicator size="large" color={theme.colors.brown["70"]} />
          <Text style={{ marginTop: 16, color: theme.colors.text.secondary }}>
            Loading journals...
          </Text>
        </View>
      ) : (
        /* Journal list */
        <FlatList
          data={filter === "recent" ? journals.slice(0, 10) : journals}
          renderItem={renderJournalCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => loadJournals(true)}
              tintColor={theme.colors.brown["70"]}
              colors={[theme.colors.brown["70"]]}
            />
          }
          ListEmptyComponent={
            !isLoading && !errorMessage ? (
              <View style={{ padding: 40, alignItems: "center" }}>
                <Text style={{ fontSize: 48, marginBottom: 16 }}>📖</Text>
                <Text style={{ color: theme.colors.text.primary, fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
                  No journals yet
                </Text>
                <Text style={{ color: theme.colors.text.secondary, textAlign: "center" }}>
                  Start writing your thoughts and feelings
                </Text>
              </View>
            ) : null
          }
        />
      )}

      {/* Add button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.brown["70"] }]}
        onPress={() => navigation.navigate("JournalCreate")}
        accessible
        accessibilityLabel="Create new journal entry"
        accessibilityRole="button"
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    fontSize: 28,
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  dateFilter: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    fontSize: 14,
    fontWeight: "600",
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dateBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  dateNumber: {
    fontSize: 16,
    fontWeight: "700",
  },
  moodBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  moodEmoji: {
    fontSize: 18,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  preview: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
  },
  triggers: {
    fontSize: 12,
    marginLeft: "auto",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabIcon: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "300",
  },
});

export const JournalListScreen = () => (
  <ScreenErrorBoundary screenName="Journal List">
    <JournalListScreenComponent />
  </ScreenErrorBoundary>
);

// LOW-NEW-001 FIX: Add displayName for debugging
JournalListScreen.displayName = 'JournalListScreen';
JournalListScreenComponent.displayName = 'JournalListScreenComponent';

export default JournalListScreen;
