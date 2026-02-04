/**
 * StressDecreasedScreen Component
 * @description Full-screen notification celebrating stress level decrease
 * @task Task 3.16.5: Stress Decreased Screen (Screen 138)
 * @audit-fix "Decresased" → "Decreased" (Issue #32)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { palette } from "../../../shared/theme";

interface EmojiItem {
  id: string;
  emoji: string;
  label: string;
}

interface StressDecreasedScreenProps {
  currentLevel: string;
  emojis: EmojiItem[];
  highlightedEmojiId: string;
  onBack: () => void;
  onSeeStressLevel: () => void;
}

const colors = {
  background: palette.background.primary,
  white: palette.text.primary,
  textSecondary: palette.text.secondary,
  illustrationBg: palette.accent.purple,
  ctaButtonBg: palette.primary.gold,
  ctaButtonText: palette.background.primary,
} as const;

export function StressDecreasedScreen({
  currentLevel,
  emojis,
  highlightedEmojiId,
  onBack,
  onSeeStressLevel,
}: StressDecreasedScreenProps): React.ReactElement {
  return (
    <View testID="stress-decreased-screen" style={styles.container}>
      {/* Header */}
      <TouchableOpacity
        testID="back-button"
        style={styles.backButton}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Text style={styles.backIcon}>{"\u2190"}</Text>
      </TouchableOpacity>

      {/* Illustration */}
      <View testID="stress-illustration" style={styles.illustration} />

      {/* Content */}
      <View style={styles.contentSection}>
        <Text style={styles.currentLevel}>{currentLevel}</Text>
        <Text style={styles.title}>Stress Decreased!</Text>
        <Text style={styles.message}>
          You are now {currentLevel}. Congrats!
        </Text>

        {/* Mood Transition Row */}
        <View testID="mood-transition-row" style={styles.transitionRow}>
          {emojis.map((item, index) => (
            <View key={item.id} style={styles.emojiContainer}>
              {index > 0 && <Text style={styles.arrow}>{"\u2192"}</Text>}
              <View
                testID={`emoji-${item.id}`}
                style={[
                  styles.emojiItem,
                  {
                    opacity: item.id === highlightedEmojiId ? 1 : 0.4,
                  },
                ]}
              >
                <Text style={styles.emoji}>{item.emoji}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Action Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          testID="see-stress-button"
          style={styles.ctaButton}
          onPress={onSeeStressLevel}
          accessibilityRole="button"
          accessibilityLabel="See Stress Level"
        >
          <Text style={styles.ctaButtonText}>
            See Stress Level {"\u2699\uFE0F"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  arrow: {
    color: colors.textSecondary,
    fontSize: 18,
    marginHorizontal: 8,
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  backIcon: { color: colors.white, fontSize: 24 },
  container: { backgroundColor: colors.background, flex: 1 },
  contentSection: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  ctaButton: {
    alignItems: "center",
    backgroundColor: colors.ctaButtonBg,
    borderRadius: 28,
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 16,
    width: "100%",
  },
  ctaButtonText: {
    color: colors.ctaButtonText,
    fontSize: 16,
    fontWeight: "700",
  },
  currentLevel: {
    color: colors.white,
    fontSize: 36,
    fontWeight: "800",
  },
  emoji: { fontSize: 32 },
  emojiContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  emojiItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    paddingBottom: 48,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  illustration: {
    backgroundColor: colors.illustrationBg,
    borderRadius: 16,
    height: 200,
    marginHorizontal: 24,
    marginTop: 16,
  },
  message: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
    marginTop: 12,
    textAlign: "center",
  },
  title: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 8,
    textAlign: "center",
  },
  transitionRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
});

export default StressDecreasedScreen;
