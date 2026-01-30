/**
 * JournalDashboardScreen Component
 * @description Main journal dashboard with hero stats, weekly calendar grid, and legend
 * @screen Screen 78: Health Journal Dashboard
 * @audit batch-16-mood-tracker-final-journal-start.md
 *
 * Visual reference: Mental_Health_Journal_Screen_01.png
 * - Brown/tan gradient hero with large journal count
 * - Crescent moon back button
 * - FAB "+" button (brown)
 * - Weekly calendar grid with colored mood dots
 * - Legend: Skipped (brown), Positive (green), Negative (orange)
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

/* ---------- colour tokens (dark-mode first, per design) ---------- */
const colors = {
  screenBg: "#1C1410",
  heroBg: "#8B6914",
  heroDecorative: "rgba(139, 105, 20, 0.4)",
  heroDecorativeAlt: "rgba(196, 165, 116, 0.3)",
  white: "#FFFFFF",
  sectionTitle: "#FFFFFF",
  seeAll: "#C4A574",
  fabBg: "#3D2E23",
  backBtnBorder: "rgba(255,255,255,0.3)",
  dotPositive: "#9AAD5C",
  dotNegative: "#E8853A",
  dotSkipped: "#3D2E23",
  legendText: "#FFFFFF",
  subtitleText: "rgba(255,255,255,0.85)",
  calendarCellBg: "#2A1F19",
  dayLabel: "#94A3B8",
} as const;

/* ---------- types ---------- */
type JournalStatus = "positive" | "negative" | "skipped";

interface CalendarDay {
  day: string;
  status: JournalStatus;
}

interface JournalDashboardScreenProps {
  journalCount: number;
  periodLabel: string;
  calendarData: CalendarDay[];
  onBack: () => void;
  onAddJournal: () => void;
  onSeeAllStats: () => void;
  onDayPress: (index: number) => void;
}

/* ---------- helpers ---------- */
const statusDotColor: Record<JournalStatus, string> = {
  positive: colors.dotPositive,
  negative: colors.dotNegative,
  skipped: colors.dotSkipped,
};

/* ---------- component ---------- */
export function JournalDashboardScreen({
  journalCount,
  periodLabel,
  calendarData,
  onBack,
  onAddJournal,
  onSeeAllStats,
  onDayPress,
}: JournalDashboardScreenProps): React.ReactElement {
  return (
    <View testID="journal-dashboard-screen" style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View testID="hero-section" style={styles.heroSection}>
          {/* Decorative Background Shapes */}
          <View testID="decorative-elements" style={styles.decorativeContainer}>
            <View style={[styles.decorativeCircle, styles.circleOne]} />
            <View style={[styles.decorativeCircle, styles.circleTwo]} />
            <View style={[styles.decorativeCircle, styles.circleThree]} />
          </View>

          {/* Header Row */}
          <View style={styles.heroHeader}>
            <TouchableOpacity
              testID="back-button"
              style={styles.backButton}
              onPress={onBack}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Text style={styles.backIcon}>☽</Text>
            </TouchableOpacity>
            <Text style={styles.heroTitle}>Health Journal</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Large Count */}
          <Text style={styles.journalCount}>{journalCount}</Text>
          <Text style={styles.journalSubtitle}>
            Journals {periodLabel}.
          </Text>

          {/* FAB */}
          <TouchableOpacity
            testID="add-journal-fab"
            style={styles.fab}
            onPress={onAddJournal}
            accessibilityRole="button"
            accessibilityLabel="Add new journal entry"
          >
            <Text style={styles.fabIcon}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Statistics Section */}
        <View style={styles.statsSection}>
          <View style={styles.statsSectionHeader}>
            <Text style={styles.statsSectionTitle}>Journal Statistics</Text>
            <TouchableOpacity
              testID="see-all-button"
              onPress={onSeeAllStats}
              accessibilityRole="button"
              accessibilityLabel="See all journal statistics"
              style={styles.seeAllTouchable}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Weekly Calendar Grid */}
          <View testID="calendar-grid" style={styles.calendarGrid}>
            {calendarData.map((entry, index) => (
              <TouchableOpacity
                key={`${entry.day}-${index}`}
                testID={`calendar-day-${index}`}
                style={styles.calendarColumn}
                onPress={() => onDayPress(index)}
                accessibilityRole="button"
                accessibilityLabel={`${entry.day}: ${entry.status}`}
              >
                <Text style={styles.calendarDayLabel}>{entry.day}</Text>
                <View
                  style={[
                    styles.calendarDot,
                    { backgroundColor: statusDotColor[entry.status] },
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Legend */}
          <View testID="legend" style={styles.legend}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: colors.dotSkipped },
                ]}
              />
              <Text style={styles.legendLabel}>Skipped</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: colors.dotPositive },
                ]}
              />
              <Text style={styles.legendLabel}>Positive</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: colors.dotNegative },
                ]}
              />
              <Text style={styles.legendLabel}>Negative</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------- styles ---------- */
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
  backIcon: {
    color: colors.white,
    fontSize: 22,
  },
  calendarColumn: {
    alignItems: "center",
    flex: 1,
    minHeight: 44,
    paddingVertical: 8,
  },
  calendarDayLabel: {
    color: colors.dayLabel,
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 8,
  },
  calendarDot: {
    borderRadius: 14,
    height: 28,
    width: 28,
  },
  calendarGrid: {
    backgroundColor: colors.calendarCellBg,
    borderRadius: 16,
    flexDirection: "row",
    marginTop: 16,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  circleOne: {
    backgroundColor: colors.heroDecorative,
    height: 180,
    left: -30,
    top: 20,
    width: 180,
  },
  circleThree: {
    backgroundColor: colors.heroDecorativeAlt,
    height: 120,
    left: "30%",
    top: 80,
    width: 120,
  },
  circleTwo: {
    backgroundColor: colors.heroDecorativeAlt,
    height: 140,
    right: -20,
    top: -10,
    width: 140,
  },
  container: {
    backgroundColor: colors.screenBg,
    flex: 1,
  },
  decorativeCircle: {
    borderRadius: 200,
    position: "absolute",
  },
  decorativeContainer: {
    bottom: 0,
    left: 0,
    overflow: "hidden",
    position: "absolute",
    right: 0,
    top: 0,
  },
  fab: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.fabBg,
    borderRadius: 28,
    elevation: 4,
    height: 56,
    justifyContent: "center",
    marginTop: 24,
    minHeight: 44,
    minWidth: 44,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: 56,
  },
  fabIcon: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "400",
  },
  headerSpacer: {
    width: 44,
  },
  heroHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  heroSection: {
    backgroundColor: colors.heroBg,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
    paddingBottom: 32,
  },
  heroTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  journalCount: {
    color: colors.white,
    fontSize: 72,
    fontWeight: "700",
    marginTop: 24,
    textAlign: "center",
  },
  journalSubtitle: {
    color: colors.subtitleText,
    fontSize: 18,
    marginTop: 4,
    textAlign: "center",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    paddingBottom: 24,
  },
  legendDot: {
    borderRadius: 5,
    height: 10,
    marginRight: 6,
    width: 10,
  },
  legendItem: {
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 12,
  },
  legendLabel: {
    color: colors.legendText,
    fontSize: 13,
  },
  seeAllText: {
    color: colors.seeAll,
    fontSize: 14,
    fontWeight: "600",
  },
  seeAllTouchable: {
    minHeight: 44,
    justifyContent: "center",
  },
  statsSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  statsSectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statsSectionTitle: {
    color: colors.sectionTitle,
    fontSize: 18,
    fontWeight: "700",
  },
});

export default JournalDashboardScreen;
