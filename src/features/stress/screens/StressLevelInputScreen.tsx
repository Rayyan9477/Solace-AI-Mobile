/**
 * StressLevelInputScreen Component
 * @description Interactive stress level input with arc gauge selector,
 *   5 selectable level points, level display, and continue button
 * @task Task 3.11.2: Stress Level Input Screen (Screen 98)
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface StressLevelInputScreenProps {
  selectedLevel: number;
  levelLabel: string;
  onBack: () => void;
  onLevelSelect: (level: number) => void;
  onContinue: () => void;
}

const colors = {
  background: "#1C1410",
  white: "#FFFFFF",
  selectedOrange: "#E8853A",
  unselectedBrown: "#3D2E23",
  continueBg: "#C4A574",
  arcInactive: "rgba(255,255,255,0.15)",
  textSecondary: "rgba(255,255,255,0.6)",
} as const;

const LEVELS = [1, 2, 3, 4, 5];

// Arc point positions (percentage-based, bottom-left to top-right)
const ARC_POSITIONS = [
  { left: "8%", top: "80%" },
  { left: "18%", top: "58%" },
  { left: "30%", top: "40%" },
  { left: "48%", top: "26%" },
  { left: "68%", top: "18%" },
];

// Segment positions connecting arc points
const SEGMENT_POSITIONS = [
  { left: "8%", top: "80%", width: 60, rotate: "-65deg" },
  { left: "18%", top: "58%", width: 60, rotate: "-50deg" },
  { left: "30%", top: "40%", width: 70, rotate: "-35deg" },
  { left: "48%", top: "26%", width: 70, rotate: "-20deg" },
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
              const isActive = index + 1 < selectedLevel;
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
                        ? colors.selectedOrange
                        : colors.arcInactive,
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
    color: colors.white,
    fontSize: 24,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  continueButton: {
    alignItems: "center",
    backgroundColor: colors.continueBg,
    borderRadius: 28,
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 16,
    width: "100%",
  },
  continueText: {
    color: colors.background,
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
    backgroundColor: colors.selectedOrange,
    height: 48,
    width: 48,
  },
  gaugePointUnselected: {
    backgroundColor: colors.unselectedBrown,
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
    bottom: "15%",
    position: "absolute",
    right: "10%",
  },
  levelLabel: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
  },
  levelNumber: {
    color: colors.white,
    fontSize: 80,
    fontWeight: "800",
    textAlign: "center",
  },
  questionTitle: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 16,
    paddingHorizontal: 24,
  },
  selectionIcon: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "700",
  },
});

export default StressLevelInputScreen;
