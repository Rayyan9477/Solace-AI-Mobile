/**
 * StressorSelectorScreen Component
 * @description Bubble-based stressor selector with floating bubbles, impact banner,
 *   and continue button. Fixes audit grammar: "impacts" → "impact"
 * @task Task 3.11.3: Stressor Selector Screen (Screen 99)
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { palette } from "../../../shared/theme";

interface StressorOption {
  id: string;
  label: string;
}

interface StressorSelectorScreenProps {
  stressors: StressorOption[];
  selectedStressorId: string | null;
  impactLevel: string;
  onBack: () => void;
  onStressorSelect: (id: string) => void;
  onContinue: () => void;
}

const localColors = {
  background: palette.brown[900],
  white: palette.white,
  selectedGreen: palette.olive[500],
  unselectedBrown: palette.brown[700],
  bannerOrange: palette.accent.orange,
  continueBg: palette.tan[500],
  textSecondary: "rgba(255,255,255,0.6)",
} as const;

// Bubble selector container dimensions for pixel calculations
const SELECTOR_WIDTH = 340;
const SELECTOR_HEIGHT = 400;

// Bubble positions (pixel-based, computed from percentages of container)
const BUBBLE_LAYOUT: Record<string, { left: number; top: number }> = {
  work: { left: (12 / 100) * SELECTOR_WIDTH, top: (5 / 100) * SELECTOR_HEIGHT },
  life: { left: (65 / 100) * SELECTOR_WIDTH, top: (12 / 100) * SELECTOR_HEIGHT },
  relationship: { left: (0 / 100) * SELECTOR_WIDTH, top: (35 / 100) * SELECTOR_HEIGHT },
  loneliness: { left: (25 / 100) * SELECTOR_WIDTH, top: (25 / 100) * SELECTOR_HEIGHT },
  finance: { left: (68 / 100) * SELECTOR_WIDTH, top: (38 / 100) * SELECTOR_HEIGHT },
  kids: { left: (5 / 100) * SELECTOR_WIDTH, top: (60 / 100) * SELECTOR_HEIGHT },
  other: { left: (62 / 100) * SELECTOR_WIDTH, top: (62 / 100) * SELECTOR_HEIGHT },
};

export function StressorSelectorScreen({
  stressors,
  selectedStressorId,
  impactLevel,
  onBack,
  onStressorSelect,
  onContinue,
}: StressorSelectorScreenProps): React.ReactElement {
  return (
    <View testID="stressor-selector-screen" style={styles.container}>
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

      {/* Title */}
      <Text testID="screen-title" style={styles.title}>
        Select Stressors
      </Text>

      {/* Subtitle - grammar fix: "impact" not "impacts" */}
      <Text testID="subtitle-text" style={styles.subtitle}>
        Our AI will decide how your stressor will impact your life in general.
      </Text>

      {/* Bubble Selector */}
      <View testID="bubble-selector" style={styles.bubbleSelector}>
        {stressors.map((stressor) => {
          const isSelected = stressor.id === selectedStressorId;
          const position = BUBBLE_LAYOUT[stressor.id] || {
            left: (30 / 100) * SELECTOR_WIDTH,
            top: (30 / 100) * SELECTOR_HEIGHT,
          };
          return (
            <TouchableOpacity
              key={stressor.id}
              testID={`stressor-bubble-${stressor.id}`}
              style={[
                styles.bubble,
                isSelected ? styles.bubbleSelected : styles.bubbleUnselected,
                { left: position.left, top: position.top },
              ]}
              onPress={() => onStressorSelect(stressor.id)}
              accessibilityRole="button"
              accessibilityLabel={`Select ${stressor.label} stressor`}
            >
              <Text
                style={[
                  styles.bubbleLabel,
                  isSelected
                    ? styles.bubbleLabelSelected
                    : styles.bubbleLabelUnselected,
                ]}
              >
                {stressor.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Impact Banner */}
      <View style={styles.bannerContainer}>
        <View testID="impact-banner" style={styles.impactBanner}>
          <Text testID="impact-warning-icon" style={styles.warningIcon}>
            {"\u26A0\uFE0F"}
          </Text>
          <Text style={styles.bannerText}>Life Impact: {impactLevel}</Text>
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
  bannerContainer: {
    paddingHorizontal: 24,
  },
  bannerText: {
    color: localColors.white,
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
  },
  bubble: {
    alignItems: "center",
    borderRadius: 100,
    justifyContent: "center",
    position: "absolute",
  },
  bubbleLabel: {
    fontWeight: "700",
    textAlign: "center",
  },
  bubbleLabelSelected: {
    color: localColors.background,
    fontSize: 18,
  },
  bubbleLabelUnselected: {
    color: localColors.white,
    fontSize: 13,
  },
  bubbleSelected: {
    backgroundColor: localColors.selectedGreen,
    height: 140,
    width: 140,
  },
  bubbleSelector: {
    flex: 1,
    position: "relative",
  },
  bubbleUnselected: {
    backgroundColor: localColors.unselectedBrown,
    height: 70,
    width: 70,
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
    paddingTop: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  impactBanner: {
    alignItems: "center",
    backgroundColor: localColors.bannerOrange,
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  subtitle: {
    color: localColors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    paddingHorizontal: 24,
  },
  title: {
    color: localColors.white,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 16,
    paddingHorizontal: 24,
  },
  warningIcon: {
    fontSize: 16,
  },
});

export default StressorSelectorScreen;
