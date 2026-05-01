/**
 * JournalEntryDetailScreen — prototype v4.2 #29 reskin (Sprint 8).
 *
 * Visual ref: prototypes/screens/29-journal-detail.js
 * - miniHeader (back · centered date · edit)
 * - Mood badge row (MoodFace 52 + sage bracket label + monospace meta)
 * - Fraunces 30 light title
 * - Article body (3 paragraphs warm-200 leading 1.7) + gratitude bulleted list
 * - GlassAuroraCard "Solace noticed" insight
 * - HashtagChip row (sage variant)
 * - Metadata footer divider with words / HR / weather monospace stats
 */

import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import { ScreenContainer } from "@/shared/components/atoms/layout";
import { HashtagChip } from "@/shared/components/molecules/chips/HashtagChip";
import {
  AuroraHairline,
  BracketLabel,
  GlassAuroraCard,
  MoodFace,
  type MoodLevel,
} from "@/shared/components/primitives";
import { useTheme } from "@/shared/theme/useTheme";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface JournalEntry {
  id: string;
  date: string;
  time: string;
  moodLevel: MoodLevel;
  moodLabel: string;
  title: string;
  paragraphs: string[];
  gratitudeItems: string[];
  insight: string;
  tags: string[];
  wordCount: number;
  heartRate: number;
  weather: string;
  readMinutes: number;
}

export interface JournalEntryDetailScreenProps {
  entry?: JournalEntry;
  onBack: () => void;
  onEdit: () => void;
  testID?: string;
}

// ---------------------------------------------------------------------------
// Default fixture
// ---------------------------------------------------------------------------

export const DEFAULT_JOURNAL_ENTRY: JournalEntry = {
  id: "default-quiet-morning",
  date: "Apr 9, 2026",
  time: "2:45 PM",
  moodLevel: 4,
  moodLabel: "Content",
  title: "A quiet morning",
  paragraphs: [
    "Started the day with coffee and that book I've been meaning to finish. The rain outside makes everything feel softer — like the world is holding its breath with me.",
    "I'm still anxious about the meeting today, but I'm also noticing how much lighter I feel after journaling for the past week. Maybe Solace is onto something with the “small consistent actions” idea.",
    "Things I'm grateful for right now:",
  ],
  gratitudeItems: [
    "The hum of the rain",
    "This quiet hour before everyone wakes",
    "The fact that I'm learning to sit with feelings instead of running",
  ],
  insight:
    "This is the 4th morning entry mentioning gratitude. Your morning routine seems to be a stable anchor — worth protecting.",
  tags: ["gratitude", "morning"],
  wordCount: 142,
  heartRate: 68,
  weather: "Rain 64°",
  readMinutes: 4,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function JournalEntryDetailScreen({
  entry = DEFAULT_JOURNAL_ENTRY,
  onBack,
  onEdit,
  testID = "journal-entry-detail-screen",
}: JournalEntryDetailScreenProps): React.ReactElement {
  const { palette } = useTheme();

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------------------------------------------------------------- */}
        {/* Mini header                                                       */}
        {/* ---------------------------------------------------------------- */}
        <View style={styles.miniHeader}>
          <TouchableOpacity
            testID="back-button"
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
            style={[
              styles.iconButton,
              {
                backgroundColor: palette.midnight[800],
                borderColor: palette.midnight[600],
              },
            ]}
          >
            <AppIcon name="arrow-left" size={18} color={palette.warm[200]} />
          </TouchableOpacity>

          <BracketLabel variant="muted" style={styles.dateLabel}>
            {entry.date}
          </BracketLabel>

          <TouchableOpacity
            testID="edit-button"
            onPress={onEdit}
            accessibilityRole="button"
            accessibilityLabel="Edit entry"
            hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
            style={[
              styles.iconButton,
              {
                backgroundColor: palette.midnight[800],
                borderColor: palette.midnight[600],
              },
            ]}
          >
            <AppIcon name="edit-3" size={18} color={palette.warm[400]} />
          </TouchableOpacity>
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* Mood badge + meta                                                  */}
        {/* ---------------------------------------------------------------- */}
        <View style={styles.moodRow}>
          <MoodFace level={entry.moodLevel} size={52} />
          <View style={styles.moodMeta}>
            <BracketLabel variant="sage">{entry.moodLabel}</BracketLabel>
            <Text
              style={[styles.moodTime, { color: palette.warm[500] }]}
              accessibilityLabel={`${entry.time}, ${entry.readMinutes} minute read`}
            >
              {`${entry.time} · ${entry.readMinutes} min read`}
            </Text>
          </View>
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* Title                                                              */}
        {/* ---------------------------------------------------------------- */}
        <Text
          testID="entry-title"
          accessibilityRole="header"
          style={[styles.title, { color: palette.warm[50] }]}
        >
          {entry.title}
        </Text>

        {/* ---------------------------------------------------------------- */}
        {/* Body                                                               */}
        {/* ---------------------------------------------------------------- */}
        <View style={styles.article} testID="entry-body">
          {entry.paragraphs.map((p, idx) => (
            <Text
              key={`paragraph-${idx}`}
              testID={`entry-paragraph-${idx}`}
              style={[styles.paragraph, { color: palette.warm[200] }]}
            >
              {p}
            </Text>
          ))}

          {entry.gratitudeItems.length > 0 ? (
            <View
              style={styles.gratitudeList}
              testID="gratitude-list"
              accessibilityRole="list"
            >
              {entry.gratitudeItems.map((item, idx) => (
                <View
                  key={`gratitude-${idx}`}
                  testID={`gratitude-item-${idx}`}
                  style={styles.gratitudeRow}
                  accessibilityRole="text"
                >
                  <Text
                    style={[
                      styles.gratitudeBullet,
                      { color: palette.warm[200] },
                    ]}
                    accessibilityElementsHidden
                    importantForAccessibility="no-hide-descendants"
                  >
                    —
                  </Text>
                  <Text
                    style={[styles.gratitudeText, { color: palette.warm[200] }]}
                  >
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* AI insight                                                         */}
        {/* ---------------------------------------------------------------- */}
        <GlassAuroraCard
          testID="insight-card"
          radius={20}
          style={styles.insightCard}
          accessibilityRole="text"
          accessibilityLabel={`Solace noticed: ${entry.insight}`}
        >
          <View style={styles.insightInner}>
            <View style={styles.insightHeader}>
              <AppIcon name="sparkles" size={14} color={palette.sage[300]} />
              <BracketLabel variant="sage">Solace noticed</BracketLabel>
            </View>
            <Text style={[styles.insightBody, { color: palette.warm[200] }]}>
              {entry.insight}
            </Text>
          </View>
        </GlassAuroraCard>

        {/* ---------------------------------------------------------------- */}
        {/* Tags                                                               */}
        {/* ---------------------------------------------------------------- */}
        {entry.tags.length > 0 ? (
          <View
            style={styles.tagRow}
            testID="tag-row"
            accessibilityRole="list"
            accessibilityLabel="Tags"
          >
            {entry.tags.map((tag) => (
              <HashtagChip
                key={tag}
                testID={`tag-${tag}`}
                label={tag}
                selected
              />
            ))}
          </View>
        ) : null}

        {/* ---------------------------------------------------------------- */}
        {/* Metadata footer                                                    */}
        {/* ---------------------------------------------------------------- */}
        <AuroraHairline style={styles.metadataDivider} />
        <View
          style={styles.metadataRow}
          testID="metadata-row"
          accessibilityRole="text"
          accessibilityLabel={`${entry.wordCount} words. Heart rate ${entry.heartRate} bpm. ${entry.weather}.`}
        >
          <Text style={[styles.metadataText, { color: palette.warm[500] }]}>
            {`${entry.wordCount} words`}
          </Text>
          <View
            style={[styles.metaDot, { backgroundColor: palette.warm[500] }]}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
          <Text style={[styles.metadataText, { color: palette.warm[500] }]}>
            {"HR "}
            <Text style={[styles.metadataAccent, { color: palette.warm[200] }]}>
              {String(entry.heartRate)}
            </Text>
            {" bpm"}
          </Text>
          <View
            style={[styles.metaDot, { backgroundColor: palette.warm[500] }]}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
          <Text style={[styles.metadataText, { color: palette.warm[500] }]}>
            {entry.weather}
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------
// Styles (alphabetically sorted)
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  article: {
    gap: 12,
    marginTop: 20,
  },
  container: {
    flex: 1,
  },
  dateLabel: {
    flex: 1,
    textAlign: "center",
  },
  gratitudeBullet: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    width: 16,
  },
  gratitudeList: {
    gap: 6,
    paddingLeft: 4,
  },
  gratitudeRow: {
    flexDirection: "row",
  },
  gratitudeText: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 22,
  },
  iconButton: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  insightBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    lineHeight: 18,
    marginTop: 8,
  },
  insightCard: {
    marginTop: 24,
  },
  insightHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  insightInner: {
    padding: 16,
  },
  metaDot: {
    borderRadius: 2,
    height: 3,
    opacity: 0.5,
    width: 3,
  },
  metadataAccent: {
    fontFamily: "FiraCode_400Regular",
    fontSize: 10,
  },
  metadataDivider: {
    marginTop: 24,
  },
  metadataRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  metadataText: {
    fontFamily: "FiraCode_400Regular",
    fontSize: 10,
  },
  miniHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    paddingTop: 4,
  },
  moodMeta: {
    flex: 1,
    gap: 4,
  },
  moodRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    marginTop: 24,
  },
  moodTime: {
    fontFamily: "FiraCode_400Regular",
    fontSize: 10,
  },
  paragraph: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 22,
  },
  scroll: {
    paddingBottom: 40,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 18,
  },
  title: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 30,
    lineHeight: 34,
    marginTop: 20,
  },
});

export default JournalEntryDetailScreen;
