/**
 * StressDashboardScreen Component
 * @description Main stress tracking dashboard with orange hero section, score display,
 *   settings button, and stressor/impact stat cards
 * @task Task 3.11.1: Stress Dashboard Screen (Screen 97)
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface StressDashboardScreenProps {
  stressScore: number;
  stressLabel: string;
  primaryStressor: string;
  impactLevel: string;
  onBack: () => void;
  onSettingsPress: () => void;
  onSeeAllPress: () => void;
  onStressorCardPress: () => void;
  onImpactCardPress: () => void;
}

const colors = {
  background: "#1C1410",
  heroOrange: "#E8853A",
  white: "#FFFFFF",
  cardBg: "#2A1F18",
  textSecondary: "rgba(255,255,255,0.6)",
  settingsBg: "#5C4A2A",
  seeAllColor: "#4A9E8C",
  chartBarGreen: "#9AAD5C",
  chartBarOlive: "#7B8A3E",
  chartLineBlue: "#7B68B5",
} as const;

export function StressDashboardScreen({
  stressScore,
  stressLabel,
  primaryStressor,
  impactLevel,
  onBack,
  onSettingsPress,
  onSeeAllPress,
  onStressorCardPress,
  onImpactCardPress,
}: StressDashboardScreenProps): React.ReactElement {
  return (
    <View testID="stress-dashboard-screen" style={styles.container}>
      {/* Hero Section */}
      <View testID="hero-section" style={styles.heroSection}>
        {/* Decorative Shapes */}
        <View style={styles.decoTriangle1} />
        <View style={styles.decoTriangle2} />
        <View style={styles.decoCircle1} />
        <View style={styles.decoCircle2} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            testID="back-button"
            style={styles.backButton}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backIcon}>{"\u263E"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerLabel}>Stress Level</Text>
        </View>

        {/* Score */}
        <View style={styles.scoreContainer}>
          <Text testID="stress-score" style={styles.scoreNumber}>
            {stressScore}
          </Text>
          <Text style={styles.scoreLabel}>{stressLabel}</Text>
        </View>

        {/* Settings Button */}
        <View style={styles.settingsContainer}>
          <TouchableOpacity
            testID="settings-button"
            style={styles.settingsButton}
            onPress={onSettingsPress}
            accessibilityRole="button"
            accessibilityLabel="Stress settings"
          >
            <Text style={styles.settingsIcon}>{"\u2699\uFE0F"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statsHeader}>
          <Text style={styles.statsTitle}>Stress Stats</Text>
          <TouchableOpacity
            testID="see-all-button"
            onPress={onSeeAllPress}
            accessibilityRole="button"
            accessibilityLabel="See all stress stats"
          >
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Cards Row */}
        <View style={styles.cardsRow}>
          {/* Stressor Card */}
          <TouchableOpacity
            testID="stressor-card"
            style={styles.statCard}
            onPress={onStressorCardPress}
            accessibilityRole="button"
            accessibilityLabel={`Stressor: ${primaryStressor}`}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Stressor</Text>
              <Text testID="stressor-icon" style={styles.cardIcon}>
                {"\u26A0\uFE0F"}
              </Text>
            </View>
            <Text style={styles.cardValue}>{primaryStressor}</Text>
            <View testID="stressor-chart" style={styles.miniChart}>
              <View style={styles.barRow}>
                <View style={[styles.bar, styles.barGreen, { width: "45%" }]} />
                <View style={[styles.bar, styles.barOlive, { width: "35%" }]} />
              </View>
              <View style={styles.barRow}>
                <View style={[styles.bar, styles.barGreen, { width: "55%" }]} />
                <View style={[styles.bar, styles.barOlive, { width: "25%" }]} />
              </View>
              <View style={styles.barRow}>
                <View style={[styles.bar, styles.barGreen, { width: "40%" }]} />
                <View style={[styles.bar, styles.barOlive, { width: "20%" }]} />
              </View>
            </View>
          </TouchableOpacity>

          {/* Impact Card */}
          <TouchableOpacity
            testID="impact-card"
            style={styles.statCard}
            onPress={onImpactCardPress}
            accessibilityRole="button"
            accessibilityLabel={`Impact: ${impactLevel}`}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Impact</Text>
              <Text testID="impact-icon" style={styles.cardIcon}>
                {"\uD83C\uDFF3\uFE0F"}
              </Text>
            </View>
            <Text style={styles.cardValue}>{impactLevel}</Text>
            <View testID="impact-chart" style={styles.miniChart}>
              <View style={styles.lineChartPlaceholder} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  backIcon: {
    color: colors.white,
    fontSize: 24,
  },
  bar: {
    borderRadius: 3,
    height: 8,
    marginRight: 4,
  },
  barGreen: {
    backgroundColor: colors.chartBarGreen,
  },
  barOlive: {
    backgroundColor: colors.chartBarOlive,
  },
  barRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  cardHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardIcon: {
    fontSize: 16,
  },
  cardTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  cardValue: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },
  cardsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  container: {
    flex: 1,
  },
  decoCircle1: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 30,
    height: 60,
    left: "15%",
    position: "absolute",
    top: "35%",
    width: 60,
  },
  decoCircle2: {
    backgroundColor: "rgba(0,0,0,0.06)",
    borderRadius: 10,
    height: 20,
    position: "absolute",
    right: "20%",
    top: "25%",
    width: 20,
  },
  decoTriangle1: {
    backgroundColor: "rgba(0,0,0,0.08)",
    height: 80,
    position: "absolute",
    right: "10%",
    top: "20%",
    transform: [{ rotate: "15deg" }],
    width: 80,
  },
  decoTriangle2: {
    backgroundColor: "rgba(0,0,0,0.06)",
    height: 60,
    left: "5%",
    position: "absolute",
    top: "45%",
    transform: [{ rotate: "-10deg" }],
    width: 60,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  heroSection: {
    backgroundColor: colors.heroOrange,
    overflow: "hidden",
    paddingBottom: 40,
  },
  lineChartPlaceholder: {
    backgroundColor: colors.chartLineBlue,
    borderRadius: 4,
    height: 40,
    opacity: 0.3,
    width: "100%",
  },
  miniChart: {
    marginTop: 12,
  },
  scoreContainer: {
    alignItems: "center",
    paddingTop: 24,
  },
  scoreLabel: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "600",
    marginTop: 8,
  },
  scoreNumber: {
    color: colors.white,
    fontSize: 80,
    fontWeight: "800",
  },
  seeAllText: {
    color: colors.seeAllColor,
    fontSize: 14,
    fontWeight: "600",
  },
  settingsButton: {
    alignItems: "center",
    backgroundColor: colors.settingsBg,
    borderRadius: 28,
    height: 56,
    justifyContent: "center",
    minHeight: 44,
    width: 56,
  },
  settingsContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  settingsIcon: {
    fontSize: 24,
  },
  statCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    flex: 1,
    padding: 16,
  },
  statsHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statsSection: {
    backgroundColor: colors.background,
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  statsTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
});

export default StressDashboardScreen;
