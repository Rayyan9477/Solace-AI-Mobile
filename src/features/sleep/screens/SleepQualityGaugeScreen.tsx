/**
 * SleepQualityGaugeScreen Component
 * @description Fan/gauge chart showing sleep quality distribution with legend and improvement stats
 * @task Task 3.10.2: Sleep Quality Gauge Screen (Screen 88)
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface SleepDistribution {
  normal: number;
  core: number;
  rem: number;
  irregular: number;
  insomniac: number;
}

interface SleepQualityGaugeScreenProps {
  improvementPercent: number;
  distribution: SleepDistribution;
  onBack: () => void;
  onHome: () => void;
  onSettings: () => void;
  onSegmentPress: (type: string) => void;
  onChartCenter: () => void;
}

const colors = {
  background: "#1C1410",
  white: "#FFFFFF",
  gray: "#94A3B8",
  brown: "#3D2E23",
  normalGreen: "#9AAD5C",
  coreGray: "#6B6B6B",
  remGold: "#C4A535",
  irregularOrange: "#E8853A",
  insomniacPurple: "#7B68B5",
} as const;

const legendItems = [
  { key: "normal", label: "Normal", color: colors.normalGreen },
  { key: "core", label: "Core", color: colors.coreGray },
  { key: "rem", label: "REM", color: colors.remGold },
  { key: "irregular", label: "Irregular", color: colors.irregularOrange },
  { key: "insomniac", label: "Insomniac", color: colors.insomniacPurple },
] as const;

export function SleepQualityGaugeScreen({
  improvementPercent,
  distribution,
  onBack,
  onHome,
  onSettings,
  onSegmentPress,
  onChartCenter,
}: SleepQualityGaugeScreenProps): React.ReactElement {
  return (
    <View testID="sleep-quality-gauge-screen" style={styles.container}>
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

      {/* Title */}
      <Text style={styles.title}>Sleep Quality</Text>
      <Text style={styles.improvementText}>
        {`${improvementPercent}% better from last month.`}
      </Text>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendRow}>
          {legendItems.slice(0, 3).map((item) => (
            <View key={item.key} style={styles.legendItem}>
              <View
                testID={`legend-dot-${item.key}`}
                style={[styles.legendDot, { backgroundColor: item.color }]}
              />
              <Text style={styles.legendLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
        <View style={styles.legendRow}>
          {legendItems.slice(3).map((item) => (
            <View key={item.key} style={styles.legendItem}>
              <View
                testID={`legend-dot-${item.key}`}
                style={[styles.legendDot, { backgroundColor: item.color }]}
              />
              <Text style={styles.legendLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Gauge Chart */}
      <View testID="gauge-chart" style={styles.gaugeChart}>
        <View testID="gauge-segments" style={styles.gaugeSegments}>
          {/* Fan segments represented as colored blocks */}
          <View style={[styles.gaugeSegment, { backgroundColor: colors.irregularOrange, flex: distribution.irregular }]} />
          <View style={[styles.gaugeSegment, { backgroundColor: colors.normalGreen, flex: distribution.normal }]} />
          <View style={[styles.gaugeSegment, { backgroundColor: colors.remGold, flex: distribution.rem }]} />
          <View style={[styles.gaugeSegment, { backgroundColor: colors.insomniacPurple, flex: distribution.insomniac }]} />
          <View style={[styles.gaugeSegment, { backgroundColor: colors.coreGray, flex: distribution.core }]} />
        </View>

        {/* Center Button */}
        <TouchableOpacity
          testID="chart-center-button"
          style={styles.chartCenterButton}
          onPress={onChartCenter}
          accessibilityRole="button"
          accessibilityLabel="View chart details"
        >
          <Text style={styles.chartCenterIcon}>📊</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          testID="home-button"
          style={styles.bottomNavButton}
          onPress={onHome}
          accessibilityRole="button"
          accessibilityLabel="Go to home"
        >
          <Text style={styles.bottomNavIcon}>🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="settings-button"
          style={styles.bottomNavButton}
          onPress={onSettings}
          accessibilityRole="button"
          accessibilityLabel="Sleep settings"
        >
          <Text style={styles.bottomNavIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 40,
  },
  backIcon: {
    color: colors.white,
    fontSize: 20,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 32,
    paddingHorizontal: 40,
  },
  bottomNavButton: {
    alignItems: "center",
    backgroundColor: colors.brown,
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 48,
  },
  bottomNavIcon: {
    fontSize: 20,
  },
  chartCenterButton: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 28,
    elevation: 4,
    height: 56,
    justifyContent: "center",
    marginTop: -28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: 56,
    zIndex: 10,
  },
  chartCenterIcon: {
    fontSize: 24,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  gaugeChart: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 16,
  },
  gaugeSegment: {
    borderRadius: 4,
    minWidth: 4,
  },
  gaugeSegments: {
    borderTopLeftRadius: 120,
    borderTopRightRadius: 120,
    flexDirection: "row",
    height: 200,
    overflow: "hidden",
    width: "90%",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  improvementText: {
    color: colors.gray,
    fontSize: 14,
    marginTop: 8,
    paddingHorizontal: 24,
  },
  legendContainer: {
    marginTop: 20,
    paddingHorizontal: 24,
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
    marginRight: 20,
    marginVertical: 4,
  },
  legendLabel: {
    color: colors.white,
    fontSize: 14,
  },
  legendRow: {
    flexDirection: "row",
  },
  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 16,
    paddingHorizontal: 24,
  },
});

export default SleepQualityGaugeScreen;
