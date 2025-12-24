/**
 * TherapyHistoryScreen - View past therapy sessions
 * Displays list of completed sessions with summaries
 */

import {
  loadTherapyHistory,
  selectSessionHistory,
  selectTherapyLoading,
} from "@app/store/slices/therapySlice";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

/**
 * TherapyHistoryScreen Component
 * Lists all past therapy sessions with summaries
 */
const TherapyHistoryScreen = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const sessionHistory = useSelector(selectSessionHistory);
  const loading = useSelector(selectTherapyLoading);

  useEffect(() => {
    dispatch(loadTherapyHistory());
  }, [dispatch]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year:
          date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const renderSessionItem = ({ item }: any) => (
    <TouchableOpacity
      style={[
        styles.sessionCard,
        {
          backgroundColor: theme.colors.background?.secondary || "#FFF",
          borderColor: theme.colors.border?.light || "#E2E8F0",
        },
      ]}
      onPress={() =>
        navigation.navigate("TherapySessionDetail", {
          sessionId: item.sessionId,
        })
      }
      accessible
      accessibilityLabel={`Therapy session from ${formatDate(item.startTime)}`}
      accessibilityRole="button"
    >
      <View style={styles.sessionHeader}>
        <View style={styles.sessionHeaderLeft}>
          <Text
            style={[
              styles.sessionDate,
              { color: theme.colors.text?.primary || "#2D3748" },
            ]}
          >
            {formatDate(item.startTime)}
          </Text>
          <Text
            style={[
              styles.sessionTime,
              { color: theme.colors.text?.tertiary || "#A0AEC0" },
            ]}
          >
            {new Date(item.startTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        <View
          style={[
            styles.durationBadge,
            { backgroundColor: theme.colors.brown?.[20] || "#F0EBE8" },
          ]}
        >
          <Text
            style={[
              styles.durationText,
              { color: theme.colors.brown?.[80] || "#5C3D2E" },
            ]}
          >
            {formatDuration(item.duration)}
          </Text>
        </View>
      </View>

      <View style={styles.sessionStats}>
        <View style={styles.statItem}>
          <Text
            style={[
              styles.statValue,
              { color: theme.colors.text?.primary || "#2D3748" },
            ]}
          >
            {item.messageCount}
          </Text>
          <Text
            style={[
              styles.statLabel,
              { color: theme.colors.text?.secondary || "#718096" },
            ]}
          >
            Messages
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text
            style={[
              styles.statValue,
              { color: theme.colors.text?.primary || "#2D3748" },
            ]}
          >
            {item.exercisesCompleted?.length || 0}
          </Text>
          <Text
            style={[
              styles.statLabel,
              { color: theme.colors.text?.secondary || "#718096" },
            ]}
          >
            Exercises
          </Text>
        </View>

        {item.mood && (
          <View style={styles.statItem}>
            <Text
              style={[
                styles.statValue,
                { color: theme.colors.text?.primary || "#2D3748" },
              ]}
            >
              {item.mood}
            </Text>
            <Text
              style={[
                styles.statLabel,
                { color: theme.colors.text?.secondary || "#718096" },
              ]}
            >
              Mood
            </Text>
          </View>
        )}
      </View>

      {item.tags && item.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {/* LOW-NEW-002 FIX: Use item id + tag as stable key instead of index */}
          {item.tags.slice(0, 3).map((tag: string) => (
            <View
              key={`tag-${item.id}-${tag}`}
              style={[
                styles.tag,
                { backgroundColor: theme.colors.brown?.[20] || "#F0EBE8" },
              ]}
            >
              <Text
                style={[
                  styles.tagText,
                  { color: theme.colors.brown?.[70] || "#704A33" },
                ]}
              >
                {tag}
              </Text>
            </View>
          ))}
          {item.tags.length > 3 && (
            <Text
              style={[
                styles.moreTagsText,
                { color: theme.colors.text?.tertiary || "#A0AEC0" },
              ]}
            >
              +{item.tags.length - 3} more
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text
        style={[
          styles.emptyTitle,
          { color: theme.colors.text?.primary || "#2D3748" },
        ]}
      >
        No therapy sessions yet
      </Text>
      <Text
        style={[
          styles.emptySubtitle,
          { color: theme.colors.text?.secondary || "#718096" },
        ]}
      >
        Start your first therapy session to begin your mental health journey
      </Text>
      <TouchableOpacity
        style={[
          styles.startButton,
          { backgroundColor: theme.colors.brown?.[70] || "#704A33" },
        ]}
        onPress={() => navigation.navigate("TherapySession")}
        accessible
        accessibilityLabel="Start new therapy session"
        accessibilityRole="button"
      >
        <Text
          style={[
            styles.startButtonText,
            { color: theme.colors.background?.primary || "#FFF" },
          ]}
        >
          Start Session
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background?.primary || "#F7FAFC" },
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: theme.colors.brown?.[70] || "#704A33" },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessible
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.backButtonText,
              { color: theme.colors.background?.primary || "#FFF" },
            ]}
          >
            ← Back
          </Text>
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            { color: theme.colors.background?.primary || "#FFF" },
          ]}
        >
          Therapy History
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={theme.colors.brown?.[70] || "#704A33"}
          />
          <Text
            style={[
              styles.loadingText,
              { color: theme.colors.text?.secondary || "#718096" },
            ]}
          >
            Loading sessions...
          </Text>
        </View>
      ) : (
        <FlatList
          data={sessionHistory}
          renderItem={renderSessionItem}
          keyExtractor={(item) => item.sessionId}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* New Session Button */}
      {sessionHistory.length > 0 && !loading && (
        <TouchableOpacity
          style={[
            styles.fab,
            { backgroundColor: theme.colors.brown?.[70] || "#704A33" },
          ]}
          onPress={() => navigation.navigate("TherapySession")}
          accessible
          accessibilityLabel="Start new therapy session"
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.fabText,
              { color: theme.colors.background?.primary || "#FFF" },
            ]}
          >
            + New Session
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  headerSpacer: {
    width: 60,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  sessionCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sessionHeaderLeft: {
    flex: 1,
  },
  sessionDate: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  sessionTime: {
    fontSize: 14,
    fontWeight: "500",
  },
  durationBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  durationText: {
    fontSize: 14,
    fontWeight: "600",
  },
  sessionStats: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 12,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
  },
  moreTagsText: {
    fontSize: 12,
    fontWeight: "500",
    alignSelf: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  startButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

// LOW-NEW-001 FIX: Add displayName for debugging
TherapyHistoryScreen.displayName = 'TherapyHistoryScreen';

export default TherapyHistoryScreen;
