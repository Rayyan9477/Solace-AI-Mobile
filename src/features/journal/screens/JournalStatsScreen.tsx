/**
 * JournalStatsScreen Component
 * @description Journal statistics with tall rounded bar chart (positive/negative/skipped)
 * @screen Screen 79: Journal Stats Bar Chart
 * @audit batch-16-mood-tracker-final-journal-start.md
 * @phase Phase 3C: Refactored to use theme tokens
 *
 * Visual reference: Mental_Health_Journal_Screen_02.png
 * - Dark bg, bold "Journal Stats" title, period subtitle
 * - Chat icon (brown circle, top-right)
 * - 3 tall rounded bars: Skipped (brown), Negative (orange), Positive (green)
 * - Count + label inside each bar, emoji below
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { palette } from "../../../shared/theme";

/* ---------- types ---------- */
interface StatCategory {
  count: number;
  emoji: string;
}

interface JournalStatsScreenProps {
  periodLabel: string;
  stats: {
    skipped: StatCategory;
    negative: StatCategory;
    positive: StatCategory;
  };
  onBack: () => void;
  onChat: () => void;
  onBarPress: (category: "skipped" | "negative" | "positive") => void;
}

/* ---------- bar config ---------- */
const barConfig = [
  { key: "skipped" as const, label: "Skipped", color: palette.brown[700], maxRatio: 0.45 },
  { key: "negative" as const, label: "Negative", color: palette.onboarding.step2, maxRatio: 0.65 },
  { key: "positive" as const, label: "Positive", color: palette.olive[500], maxRatio: 0.85 },
];

/* ---------- component ---------- */
export function JournalStatsScreen({
  periodLabel,
  stats,
  onBack,
  onChat,
  onBarPress,
}: JournalStatsScreenProps): React.ReactElement {
  const maxCount = Math.max(stats.skipped.count, stats.negative.count, stats.positive.count, 1);

  return (
    <View testID="journal-stats-screen" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>☽</Text>
        </TouchableOpacity>
      </View>

      {/* Title Row */}
      <View style={styles.titleRow}>
        <View style={styles.titleColumn}>
          <Text style={styles.title}>Journal Stats</Text>
          <Text style={styles.subtitle}>{periodLabel}</Text>
        </View>
        <TouchableOpacity
          testID="chat-button"
          style={styles.chatButton}
          onPress={onChat}
          accessibilityRole="button"
          accessibilityLabel="Open chat"
        >
          <Text style={styles.chatIcon}>💬</Text>
        </TouchableOpacity>
      </View>

      {/* Bar Chart */}
      <View testID="stats-bar-chart" style={styles.chartContainer}>
        {barConfig.map((bar) => {
          const stat = stats[bar.key];
          const heightPct = (stat.count / maxCount) * 100;

          return (
            <View key={bar.key} style={styles.barWrapper}>
              <TouchableOpacity
                testID={`stats-bar-${bar.key}`}
                style={[
                  styles.bar,
                  {
                    backgroundColor: bar.color,
                    height: `${Math.max(heightPct, 20)}%`,
                  },
                ]}
                onPress={() => onBarPress(bar.key)}
                accessibilityRole="button"
                accessibilityLabel={`${bar.label}: ${stat.count} entries`}
              >
                <Text style={styles.barCount}>{stat.count}</Text>
                <Text style={styles.barLabel}>{bar.label}</Text>
              </TouchableOpacity>

              {/* Emoji indicator below bar */}
              <View
                testID={`bar-emoji-${bar.key}`}
                style={[
                  styles.emojiCircle,
                  { backgroundColor: bar.color },
                ]}
              >
                <Text style={styles.emojiText}>{stat.emoji}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    borderColor: `${palette.white}${palette.alpha[30]}`,
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 44,
  },
  backIcon: {
    color: palette.white,
    fontSize: 22,
  },
  bar: {
    alignItems: "center",
    borderRadius: 40,
    justifyContent: "flex-start",
    paddingTop: 20,
    width: 80,
  },
  barCount: {
    color: palette.white,
    fontSize: 36,
    fontWeight: "700",
  },
  barLabel: {
    color: palette.white,
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
  },
  barWrapper: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  chartContainer: {
    alignItems: "flex-end",
    flex: 1,
    flexDirection: "row",
    paddingBottom: 80,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  chatButton: {
    alignItems: "center",
    backgroundColor: palette.brown[700],
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 44,
  },
  chatIcon: {
    fontSize: 20,
  },
  container: {
    backgroundColor: palette.brown[900],
    flex: 1,
    paddingTop: 60,
  },
  emojiCircle: {
    alignItems: "center",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    marginTop: 16,
    width: 48,
  },
  emojiText: {
    fontSize: 20,
  },
  header: {
    paddingHorizontal: 24,
  },
  subtitle: {
    color: palette.gray[400],
    fontSize: 14,
    marginTop: 4,
  },
  title: {
    color: palette.white,
    fontSize: 28,
    fontWeight: "700",
  },
  titleColumn: {
    flex: 1,
  },
  titleRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 24,
  },
});

export default JournalStatsScreen;
