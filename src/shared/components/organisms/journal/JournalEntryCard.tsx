/**
 * JournalEntryCard Component
 * @description Timeline journal entry card with mood, preview, and metadata
 * @task Task 2.9.1: JournalEntryCard Component
 * @phase Phase 3C: Refactored to use theme tokens
 *
 * Features:
 * - Timeline with timestamp label
 * - Mood avatar (colored circle)
 * - Title with mood badge
 * - Content preview (2 lines max)
 * - Metadata row (AI suggestions, heart rate)
 * - Full accessibility support
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import type { JournalEntryCardProps } from "./JournalEntryCard.types";
import { formatEntryTime } from "./JournalEntryCard.types";
import { MOOD_CONFIGS } from "../mood/MoodSelector.types";
import { palette } from "../../../theme";

/**
 * JournalEntryCard Component
 *
 * @example
 * ```tsx
 * <JournalEntryCard
 *   id="entry-1"
 *   title="Feeling Positive Today!"
 *   mood="overjoyed"
 *   contentPreview="Im grateful for..."
 *   timestamp={new Date()}
 *   aiSuggestionsCount={7}
 *   heartRate={96}
 *   onPress={(id) => navigateToDetail(id)}
 * />
 * ```
 */
export function JournalEntryCard({
  id,
  title,
  mood,
  contentPreview,
  timestamp,
  aiSuggestionsCount,
  heartRate,
  onPress,
  style,
  testID,
  accessibilityLabel,
}: JournalEntryCardProps): React.ReactElement {
  const moodConfig = MOOD_CONFIGS[mood];
  const timeLabel = formatEntryTime(timestamp);

  const defaultAccessibilityLabel = `Journal entry: ${title}, mood: ${moodConfig.label}, ${aiSuggestionsCount} AI suggestions${heartRate ? `, heart rate: ${heartRate}` : ""}`;

  const handlePress = () => {
    if (onPress) {
      onPress(id);
    }
  };

  const Container = onPress ? TouchableOpacity : View;
  const containerProps = onPress
    ? {
        onPress: handlePress,
        accessibilityRole: "button" as const,
        activeOpacity: 0.7,
      }
    : {};

  return (
    <Container
      testID={testID}
      accessibilityLabel={accessibilityLabel || defaultAccessibilityLabel}
      style={[styles.container, style]}
      {...containerProps}
    >
      {/* Timeline */}
      <View style={styles.timeline}>
        <Text style={styles.timeLabel}>{timeLabel}</Text>
        <View style={styles.connector}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: moodConfig.backgroundColor },
            ]}
          />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>

        {/* Mood Badge */}
        <View
          style={[
            styles.moodBadge,
            { backgroundColor: moodConfig.backgroundColor },
          ]}
        >
          <Text style={styles.moodLabel}>{moodConfig.label}</Text>
        </View>

        {/* Preview */}
        <Text
          style={styles.preview}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {contentPreview}
        </Text>

        {/* Metadata */}
        <View style={styles.metadata}>
          <Text style={styles.metadataText}>
            ↗ {aiSuggestionsCount} AI Suggestions
          </Text>
          {heartRate && (
            <Text style={styles.metadataText}>• ♡{heartRate}</Text>
          )}
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 6,
    height: 12,
    width: 12,
  },
  connector: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 4,
  },
  container: {
    flexDirection: "row",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  metadata: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  metadataText: {
    color: palette.gray[400],
    fontSize: 12,
  },
  moodBadge: {
    alignSelf: "flex-start",
    borderRadius: 12,
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  moodLabel: {
    color: palette.white,
    fontSize: 12,
    fontWeight: "600",
  },
  preview: {
    color: palette.gray[400],
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  timeLabel: {
    color: palette.gray[500],
    fontSize: 12,
    fontWeight: "500",
    width: 50,
  },
  timeline: {
    alignItems: "flex-start",
    flexDirection: "row",
  },
  title: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default JournalEntryCard;
