/**
 * Sleep Quality Screen - Track and visualize sleep patterns
 * Based on ui-designs/Dark-mode/Sleep Quality.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

interface SleepData {
  date: string;
  hours: number;
  quality: "normal" | "core" | "REM";
  rating: number;
}

const SLEEP_HISTORY: SleepData[] = [
  { date: "Mon", hours: 8.5, quality: "normal", rating: 4 },
  { date: "Tue", hours: 7.8, quality: "core", rating: 3 },
  { date: "Wed", hours: 6.2, quality: "REM", rating: 2 },
  { date: "Thu", hours: 8.0, quality: "normal", rating: 4 },
  { date: "Fri", hours: 7.5, quality: "core", rating: 3 },
  { date: "Sat", hours: 9.0, quality: "normal", rating: 5 },
  { date: "Sun", hours: 8.25, quality: "REM", rating: 4 },
];

const QUALITY_COLORS = {
  normal: "#98B068",
  core: "#C96100",
  REM: "#8B7DA8",
};

export const SleepQualityScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month">(
    "week",
  );

  const totalHours = SLEEP_HISTORY.reduce((sum, day) => sum + day.hours, 0);
  const avgHours = (totalHours / SLEEP_HISTORY.length).toFixed(1);
  const sleepScore = 20; // Mock score

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.brown["20"],
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    scoreCard: {
      backgroundColor: "#8B7DA8",
      borderRadius: 24,
      padding: 32,
      alignItems: "center",
      marginBottom: 24,
    },
    scoreValue: {
      fontSize: 72,
      fontWeight: "800",
      color: "#FFFFFF",
      marginBottom: 8,
    },
    scoreLabel: {
      fontSize: 18,
      fontWeight: "600",
      color: "rgba(255,255,255,0.9)",
    },
    sleepOverview: {
      backgroundColor: theme.colors.brown["20"],
      borderRadius: 20,
      padding: 20,
      marginBottom: 24,
    },
    overviewTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 20,
    },
    statItem: {
      alignItems: "center",
    },
    statCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
    },
    statValue: {
      fontSize: 20,
      fontWeight: "800",
      color: "#FFFFFF",
    },
    statLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    qualityChart: {
      height: 200,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    chartLegend: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 16,
    },
    legendItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    legendDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    legendText: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    historySection: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    periodToggle: {
      flexDirection: "row",
      backgroundColor: theme.colors.brown["20"],
      borderRadius: 12,
      padding: 4,
    },
    periodButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    periodButtonActive: {
      backgroundColor: theme.colors.brown["70"],
    },
    periodText: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    periodTextActive: {
      color: theme.colors.background.secondary,
    },
    historyList: {
      gap: 12,
    },
    historyItem: {
      backgroundColor: theme.colors.brown["20"],
      borderRadius: 16,
      padding: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    historyLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    historyIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
    },
    historyDate: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    historyHours: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    historyRating: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
  });

  const renderPieChart = () => {
    const normalPercent = 0.4;
    const corePercent = 0.35;
    const remPercent = 0.25;

    return (
      <View style={styles.qualityChart}>
        <Svg width={200} height={200}>
          {/* Normal - Green segment */}
          <Path
            d={describeArc(100, 100, 80, 0, normalPercent * 360)}
            fill={QUALITY_COLORS.normal}
          />
          {/* Core - Orange segment */}
          <Path
            d={describeArc(
              100,
              100,
              80,
              normalPercent * 360,
              (normalPercent + corePercent) * 360,
            )}
            fill={QUALITY_COLORS.core}
          />
          {/* REM - Purple segment */}
          <Path
            d={describeArc(
              100,
              100,
              80,
              (normalPercent + corePercent) * 360,
              360,
            )}
            fill={QUALITY_COLORS.REM}
          />
          {/* Center white circle */}
          <Circle cx={100} cy={100} r={50} fill={theme.colors.brown["10"]} />
        </Svg>
        <View style={{ position: "absolute", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "800",
              color: theme.colors.text.primary,
            }}
          >
            {avgHours}h
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: theme.colors.text.secondary,
            }}
          >
            Average
          </Text>
        </View>
      </View>
    );
  };

  const describeArc = (
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
  ) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${x} ${y} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
  };

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number,
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sleep Quality</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sleep Score */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreValue}>{sleepScore}</Text>
          <Text style={styles.scoreLabel}>You are Insomniac</Text>
        </View>

        {/* Sleep Overview */}
        <View style={styles.sleepOverview}>
          <Text style={styles.overviewTitle}>Sleep Overview</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={[styles.statCircle, { backgroundColor: "#98B068" }]}>
                <Text style={styles.statValue}>8.5h</Text>
              </View>
              <Text style={styles.statLabel}>Goal</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statCircle, { backgroundColor: "#C96100" }]}>
                <Text style={styles.statValue}>7.8h</Text>
              </View>
              <Text style={styles.statLabel}>Core</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statCircle, { backgroundColor: "#8B7DA8" }]}>
                <Text style={styles.statValue}>5+</Text>
              </View>
              <Text style={styles.statLabel}>REM</Text>
            </View>
          </View>

          {/* Pie Chart */}
          {renderPieChart()}

          {/* Legend */}
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#98B068" }]}
              />
              <Text style={styles.legendText}>Normal</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#C96100" }]}
              />
              <Text style={styles.legendText}>Core</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#8B7DA8" }]}
              />
              <Text style={styles.legendText}>REM</Text>
            </View>
          </View>
        </View>

        {/* Sleep History */}
        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sleep History</Text>
            <View style={styles.periodToggle}>
              <TouchableOpacity
                style={[
                  styles.periodButton,
                  selectedPeriod === "week" && styles.periodButtonActive,
                ]}
                onPress={() => setSelectedPeriod("week")}
              >
                <Text
                  style={[
                    styles.periodText,
                    selectedPeriod === "week" && styles.periodTextActive,
                  ]}
                >
                  Week
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.periodButton,
                  selectedPeriod === "month" && styles.periodButtonActive,
                ]}
                onPress={() => setSelectedPeriod("month")}
              >
                <Text
                  style={[
                    styles.periodText,
                    selectedPeriod === "month" && styles.periodTextActive,
                  ]}
                >
                  Month
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.historyList}>
            {/* LOW-NEW-002 FIX: Use date as stable key instead of index */}
            {SLEEP_HISTORY.map((item) => (
              <TouchableOpacity key={`sleep-${item.date}`} style={styles.historyItem}>
                <View style={styles.historyLeft}>
                  <View
                    style={[
                      styles.historyIcon,
                      { backgroundColor: QUALITY_COLORS[item.quality] },
                    ]}
                  >
                    <Text style={{ fontSize: 24 }}>🌙</Text>
                  </View>
                  <View>
                    <Text style={styles.historyDate}>
                      You slept for {item.hours}h
                    </Text>
                    <Text style={styles.historyHours}>{item.date}</Text>
                  </View>
                </View>
                <Text style={styles.historyRating}>★ {item.rating}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// LOW-NEW-001 FIX: Add displayName for debugging
SleepQualityScreen.displayName = 'SleepQualityScreen';

export default SleepQualityScreen;
