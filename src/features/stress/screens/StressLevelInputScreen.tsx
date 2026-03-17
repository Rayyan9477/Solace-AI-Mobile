/**
 * StressLevelInputScreen Component
 * @description Interactive stress level input with arc gauge selector,
 *   5 selectable level points, level display, and continue button
 * @task Task 3.11.2: Stress Level Input Screen (Screen 98)
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { palette } from "../../../shared/theme";

interface StressLevelInputScreenProps {
  selectedLevel: number;
  levelLabel: string;
  onBack: () => void;
  onLevelSelect: (level: number) => void;
  onContinue: () => void;
}

const localColors = {
  background: palette.brown[900],
  white: palette.white,
  selectedOrange: palette.accent.orange,
  unselectedBrown: palette.brown[700],
  continueBg: palette.tan[500],
  arcInactive: "rgba(255,255,255,0.15)",
  textSecondary: "rgba(255,255,255,0.6)",
} as const;

const LEVELS = [1, 2, 3, 4, 5];

// Gauge container dimensions for pixel calculations
const GAUGE_WIDTH = 300;
const GAUGE_HEIGHT = 300;

// Arc point positions (pixel-based, computed from percentages of container)
const ARC_POSITIONS = [
  { left: (8 / 100) * GAUGE_WIDTH, top: (80 / 100) * GAUGE_HEIGHT },
  { left: (18 / 100) * GAUGE_WIDTH, top: (58 / 100) * GAUGE_HEIGHT },
  { left: (30 / 100) * GAUGE_WIDTH, top: (40 / 100) * GAUGE_HEIGHT },
  { left: (48 / 100) * GAUGE_WIDTH, top: (26 / 100) * GAUGE_HEIGHT },
  { left: (68 / 100) * GAUGE_WIDTH, top: (18 / 100) * GAUGE_HEIGHT },
];

// Segment positions connecting arc points
const SEGMENT_POSITIONS = [
  { left: (8 / 100) * GAUGE_WIDTH, top: (80 / 100) * GAUGE_HEIGHT, width: 60, rotate: "-65deg" },
  { left: (18 / 100) * GAUGE_WIDTH, top: (58 / 100) * GAUGE_HEIGHT, width: 60, rotate: "-50deg" },
  { left: (30 / 100) * GAUGE_WIDTH, top: (40 / 100) * GAUGE_HEIGHT, width: 70, rotate: "-35deg" },
  { left: (48 / 100) * GAUGE_WIDTH, top: (26 / 100) * GAUGE_HEIGHT, width: 70, rotate: "-20deg" },
];

export function StressLevelInputScreen({
  selectedLevel,
  levelLabel,
  onBack,
  onLevelSelect,
  onContinue,
}: StressLevelInputScreenProps): React.ReactElement {
  return (
    <View testID="stress-level-input-screen" style={styles.container}>
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
      </View>

      {/* Question Title */}
      <Text testID="question-title" style={styles.questionTitle}>
        What's your stress level today?
      </Text>

      {/* Arc Gauge */}
      <View style={styles.gaugeSection}>
        <View testID="arc-gauge" style={styles.arcGauge}>
          {/* Arc Segments */}
          <View testID="arc-segments" style={styles.arcSegmentsContainer}>
            {SEGMENT_POSITIONS.map((seg, index) => {
              const isActive = index + 1 <= selectedLevel;
              return (
                <View
                  key={`segment-${index}`}
                  style={[
                    styles.arcSegment,
                    {
                      left: seg.left,
                      top: seg.top,
                      width: seg.width,
                      transform: [{ rotate: seg.rotate }],
                      backgroundColor: isActive
                        ? localColors.selectedOrange
                        : localColors.arcInactive,
                    },
                  ]}
                />
              );
            })}
          </View>

          {/* Gauge Points */}
          {LEVELS.map((level, index) => {
            const isSelected = level === selectedLevel;
            const pos = ARC_POSITIONS[index];
            return (
              <TouchableOpacity
                key={level}
                testID={`gauge-point-${level}`}
                style={[
                  styles.gaugePoint,
                  isSelected
                    ? styles.gaugePointSelected
                    : styles.gaugePointUnselected,
                  { left: pos.left, top: pos.top },
                ]}
                onPress={() => onLevelSelect(level)}
                accessibilityRole="button"
                accessibilityLabel={`Stress level ${level}`}
              >
                {isSelected && (
                  <Text
                    testID="selection-indicator"
                    style={styles.selectionIcon}
                  >
                    {"\u21BB"}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}

          {/* Level Display */}
          <View style={styles.levelDisplay}>
            <Text testID="level-number" style={styles.levelNumber}>
              {selectedLevel}
            </Text>
            <Text testID="level-label" style={styles.levelLabel}>
              {levelLabel}
            </Text>
          </View>
        </View>
      </View>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          testID="continue-button"
          style={styles.continueButton}
          onPress={onContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue to next step"
          activeOpacity={0.8}
        >
          <Text style={styles.continueText}>Continue {"\u2192"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  arcGauge: {
    height: "100%",
    position: "relative",
    width: "100%",
  },
  arcSegment: {
    borderRadius: 3,
    height: 6,
    position: "absolute",
  },
  arcSegmentsContainer: {
    height: "100%",
    position: "absolute",
    width: "100%",
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  backIcon: {
    color: localColors.white,
    fontSize: 24,
  },
  container: {
    backgroundColor: localColors.background,
    flex: 1,
  },
  continueButton: {
    alignItems: "center",
    backgroundColor: localColors.continueBg,
    borderRadius: 28,
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 16,
    width: "100%",
  },
  continueText: {
    color: localColors.background,
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  gaugePoint: {
    alignItems: "center",
    borderRadius: 50,
    justifyContent: "center",
    position: "absolute",
  },
  gaugePointSelected: {
    backgroundColor: localColors.selectedOrange,
    height: 48,
    width: 48,
  },
  gaugePointUnselected: {
    backgroundColor: localColors.unselectedBrown,
    height: 20,
    width: 20,
  },
  gaugeSection: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  levelDisplay: {
    bottom: (15 / 100) * GAUGE_HEIGHT,
    position: "absolute",
    right: (10 / 100) * GAUGE_WIDTH,
  },
  levelLabel: {
    color: localColors.white,
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
  },
  levelNumber: {
    color: localColors.white,
    fontSize: 80,
    fontWeight: "800",
    textAlign: "center",
  },
  questionTitle: {
    color: localColors.white,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 16,
    paddingHorizontal: 24,
  },
  selectionIcon: {
    color: localColors.white,
    fontSize: 20,
    fontWeight: "700",
  },
});

export default StressLevelInputScreen;
