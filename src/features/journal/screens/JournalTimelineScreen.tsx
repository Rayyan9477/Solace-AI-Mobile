/**
 * JournalTimelineScreen Component
 * @screen Screen 84: Journal Timeline List
 * @audit batch-17-journal-continued.md
 * @fixes CRITICAL: All harmful placeholder content replaced (Issue #84-1, #84-2, #84-3)
 * @fixes Typo: "Im" → "I'm" (Issue #84-6)
 *
 * Visual ref: Mental_Health_Journal_Screen_07.png
 * - "My Journals" title, week calendar strip with mood dots
 * - "Timeline" heading + "Newest ▼" sort control
 * - Chronological entry cards: time label, mood avatar, title, mood badge,
 *   content preview, AI suggestions count, heart rate
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

const colors = {
  screenBg: "#1C1410",
  white: "#FFFFFF",
  subtitle: "#94A3B8",
  cardBg: "#2A1F19",
  cardBorder: "#3D2E23",
  selectedDayBg: "#E8853A",
  backBtnBorder: "rgba(255,255,255,0.3)",
  timelineLine: "#3D2E23",
  metaText: "#94A3B8",
  sortText: "#C4A574",
} as const;

interface CalendarDay {
  dayLabel: string;
  date: number;
  selected: boolean;
  moodColor: string;
}

interface JournalEntry {
  id: string;
  time: string;
  title: string;
  titleEmoji: string;
  mood: string;
  moodColor: string;
  preview: string;
  aiSuggestions: number;
  heartRate: number;
}

interface JournalTimelineScreenProps {
  calendarDays: CalendarDay[];
  entries: JournalEntry[];
  sortOrder: "newest" | "oldest";
  onBack: () => void;
  onDaySelect: (index: number) => void;
  onEntryPress: (id: string) => void;
  onSortChange: (order: "newest" | "oldest") => void;
}

export function JournalTimelineScreen({
  calendarDays,
  entries,
  sortOrder,
  onBack,
  onDaySelect,
  onEntryPress,
  onSortChange,
}: JournalTimelineScreenProps): React.ReactElement {
  return (
    <View testID="journal-timeline-screen" style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>☽</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.screenTitle}>My Journals</Text>

        {/* Calendar Strip */}
        <View testID="calendar-strip" style={styles.calendarStrip}>
          {calendarDays.map((day, index) => (
            <TouchableOpacity
              key={`${day.dayLabel}-${index}`}
              testID={`calendar-day-${index}`}
              style={[
                styles.calendarDay,
                day.selected && {
                  backgroundColor: colors.selectedDayBg,
                },
              ]}
              onPress={() => onDaySelect(index)}
              accessibilityRole="button"
              accessibilityLabel={`${day.dayLabel} ${day.date}`}
            >
              <Text
                style={[
                  styles.calendarDayLabel,
                  day.selected && styles.calendarDayLabelSelected,
                ]}
              >
                {day.dayLabel}
              </Text>
              <Text
                style={[
                  styles.calendarDate,
                  day.selected && styles.calendarDateSelected,
                ]}
              >
                {day.date}
              </Text>
              <View
                testID={`calendar-mood-dot-${index}`}
                style={[
                  styles.calendarMoodDot,
                  { backgroundColor: day.moodColor },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sort Header */}
        <View style={styles.sortHeader}>
          <Text style={styles.timelineLabel}>Timeline</Text>
          <TouchableOpacity
            testID="sort-button"
            style={styles.sortButton}
            onPress={() =>
              onSortChange(sortOrder === "newest" ? "oldest" : "newest")
            }
            accessibilityRole="button"
            accessibilityLabel={`Sort by ${sortOrder}`}
          >
            <Text style={styles.sortText}>Newest ▼</Text>
          </TouchableOpacity>
        </View>

        {/* Timeline */}
        <View testID="timeline-connector" style={styles.timelineContainer}>
          {/* Vertical Line */}
          <View style={styles.timelineLine} />

          {/* Entries */}
          {entries.map((entry) => (
            <TouchableOpacity
              key={entry.id}
              testID={`entry-card-${entry.id}`}
              style={styles.entryRow}
              onPress={() => onEntryPress(entry.id)}
              accessibilityRole="button"
              accessibilityLabel={`${entry.title}, ${entry.mood}`}
            >
              {/* Time Label */}
              <View style={styles.timeColumn}>
                {entry.time !== "" && (
                  <Text style={styles.timeLabel}>{entry.time}</Text>
                )}
              </View>

              {/* Mood Avatar Dot */}
              <View
                style={[
                  styles.moodAvatar,
                  { backgroundColor: entry.moodColor },
                ]}
              />

              {/* Entry Content */}
              <View style={styles.entryContent}>
                {/* Mood Badge */}
                <View
                  style={[
                    styles.moodBadge,
                    { backgroundColor: entry.moodColor },
                  ]}
                >
                  <Text style={styles.moodBadgeText}>{entry.mood}</Text>
                </View>

                {/* Title */}
                <Text style={styles.entryTitle} numberOfLines={1}>
                  {entry.title}
                  {entry.titleEmoji ? ` ${entry.titleEmoji}` : ""}
                </Text>

                {/* Preview */}
                <Text style={styles.entryPreview} numberOfLines={2}>
                  {entry.preview}
                </Text>

                {/* Metadata */}
                <View style={styles.metadataRow}>
                  <Text style={styles.metaText}>
                    ↗ {entry.aiSuggestions} AI Suggestions
                  </Text>
                  <Text style={styles.metaSeparator}>•</Text>
                  <Text style={styles.metaText}>♡ {entry.heartRate}bpm</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    borderColor: colors.backBtnBorder,
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 44,
  },
  backIcon: { color: colors.white, fontSize: 22 },
  calendarDate: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },
  calendarDateSelected: { color: colors.white },
  calendarDay: {
    alignItems: "center",
    borderRadius: 16,
    flex: 1,
    minHeight: 44,
    paddingVertical: 8,
  },
  calendarDayLabel: {
    color: colors.subtitle,
    fontSize: 12,
    fontWeight: "500",
  },
  calendarDayLabelSelected: { color: colors.white },
  calendarMoodDot: {
    borderRadius: 4,
    height: 8,
    marginTop: 6,
    width: 8,
  },
  calendarStrip: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    flexDirection: "row",
    marginTop: 16,
    paddingHorizontal: 4,
    paddingVertical: 12,
  },
  container: {
    backgroundColor: colors.screenBg,
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  entryContent: {
    flex: 1,
    marginLeft: 12,
  },
  entryPreview: {
    color: colors.subtitle,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  entryRow: {
    flexDirection: "row",
    marginBottom: 20,
    minHeight: 44,
  },
  entryTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },
  metaText: {
    color: colors.metaText,
    fontSize: 12,
  },
  metaSeparator: {
    color: colors.metaText,
    fontSize: 12,
    marginHorizontal: 6,
  },
  metadataRow: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 8,
  },
  moodAvatar: {
    borderRadius: 12,
    height: 24,
    marginTop: 4,
    width: 24,
  },
  moodBadge: {
    alignSelf: "flex-end",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  moodBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
  screenTitle: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "700",
    marginTop: 20,
  },
  sortButton: {
    minHeight: 44,
    justifyContent: "center",
  },
  sortHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  sortText: {
    color: colors.sortText,
    fontSize: 14,
    fontWeight: "600",
  },
  timeColumn: {
    width: 44,
  },
  timeLabel: {
    color: colors.subtitle,
    fontSize: 13,
    fontWeight: "500",
  },
  timelineContainer: {
    marginTop: 16,
    paddingBottom: 40,
    position: "relative",
  },
  timelineLabel: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  timelineLine: {
    backgroundColor: colors.timelineLine,
    bottom: 0,
    left: 56,
    position: "absolute",
    top: 0,
    width: 2,
  },
});

export default JournalTimelineScreen;
