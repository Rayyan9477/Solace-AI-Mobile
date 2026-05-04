/**
 * GoalsPickerScreen — prototype v4.2 #15 GoalsPicker (Sprint 7 move+reskin).
 *
 * Multi-select 2×4 goal grid for the onboarding flow. midnight[950] bg.
 * Moved from src/features/mindful/screens/GoalSelectionScreen.tsx and
 * reskinned with v4.2 design tokens.
 *
 * Maps to `prototypes/screens/15-goals.js`.
 */

import React, { useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "@/shared/theme/useTheme";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { ScreenContainer } from "@/shared/components/atoms/layout";
import { Button } from "@/shared/components/atoms/buttons/Button";
import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import {
  BracketLabel,
  GlassCard,
  IconTile,
} from "@/shared/components/primitives";
import type { IconTileHue } from "@/shared/components/primitives";

// ─── Public API ──────────────────────────────────────────────────────────────

export type GoalId =
  | "anxiety"
  | "sleep"
  | "mood"
  | "mindful"
  | "journal"
  | "stress"
  | "focus"
  | "growth";

export interface GoalsPickerScreenProps {
  /** Selected goal ids (controlled) */
  selectedGoals: GoalId[];
  onGoalsChange: (goals: GoalId[]) => void;
  onContinue: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  /** Step indicator e.g. "Step 2 of 4" */
  stepLabel?: string;
  testID?: string;
}

// ─── Goal definitions ─────────────────────────────────────────────────────────

interface GoalDefinition {
  id: GoalId;
  label: string;
  iconName: string;
  hue: IconTileHue;
}

const GOALS: GoalDefinition[] = [
  { id: "anxiety", label: "Anxiety", iconName: "wind", hue: "sage" },
  { id: "sleep", label: "Better sleep", iconName: "moon", hue: "lavender" },
  { id: "mood", label: "Mood lift", iconName: "sun", hue: "peach" },
  { id: "mindful", label: "Mindfulness", iconName: "lotus", hue: "sage" },
  { id: "journal", label: "Journaling", iconName: "book-open", hue: "aurora" },
  { id: "stress", label: "Stress relief", iconName: "cloud", hue: "lavender" },
  { id: "focus", label: "Focus", iconName: "target", hue: "peach" },
  { id: "growth", label: "Personal growth", iconName: "trending-up", hue: "aurora" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function GoalsPickerScreen({
  selectedGoals,
  onGoalsChange,
  onContinue,
  onBack,
  onSkip,
  stepLabel,
  testID = "goals-picker-screen",
}: GoalsPickerScreenProps): React.ReactElement {
  const { palette } = useTheme();
  // Honor reduced motion preference (suppress future tile press animations)
  useReducedMotion();

  const handleTilePress = useCallback(
    (id: GoalId) => {
      if (selectedGoals.includes(id)) {
        onGoalsChange(selectedGoals.filter((g) => g !== id));
      } else {
        onGoalsChange([...selectedGoals, id]);
      }
    },
    [selectedGoals, onGoalsChange],
  );

  const selectionCount = selectedGoals.length;
  const isContinueEnabled = selectionCount >= 1;

  const selectionLabel =
    selectionCount === 0
      ? "None selected"
      : selectionCount === 1
        ? "1 selected"
        : `${selectionCount} selected`;

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={styles.screen}
    >
      {/* Header row: back button · bracket · skip link */}
      <View style={styles.headerRow}>
        {onBack ? (
          <TouchableOpacity
            testID="back-button"
            style={[
              styles.backButton,
              {
                backgroundColor: palette.midnight[800],
                borderColor: palette.midnight[600],
              },
            ]}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <AppIcon name="arrow-left" size={18} color={palette.warm[400]} />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerSpacer} />
        )}

        <View testID="step-label-wrapper">
          <BracketLabel variant="muted" style={styles.headerLabel}>
            {stepLabel ?? "STEP 2 OF 4"}
          </BracketLabel>
        </View>

        {onSkip ? (
          <TouchableOpacity
            testID="skip-link"
            style={styles.headerSkipLink}
            onPress={onSkip}
            accessibilityRole="button"
            accessibilityLabel="Skip goals selection"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.headerSkipText, { color: palette.warm[400] }]}>
              Skip
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero copy */}
        <View style={styles.hero}>
          <BracketLabel variant="peach" style={styles.goalsBracket}>
            GOALS
          </BracketLabel>

          <Text
            testID="headline"
            accessibilityRole="header"
            style={[styles.headline, { color: palette.warm[50] }]}
          >
            {"What brings you to "}
            <Text style={styles.headlineItalic}>Solace?</Text>
          </Text>

          <Text
            style={[styles.subtitle, { color: palette.warm[400] }]}
            accessibilityRole="text"
          >
            {"Pick all that apply — we’ll personalize your experience."}
          </Text>
        </View>

        {/* 2×4 goal tile grid */}
        <View
          testID="goal-grid"
          style={styles.grid}
          accessibilityRole="none"
        >
          {GOALS.map((goal) => {
            const isSelected = selectedGoals.includes(goal.id);

            return (
              <TouchableOpacity
                key={goal.id}
                testID={`goal-tile-${goal.id}`}
                style={styles.tileWrapper}
                onPress={() => handleTilePress(goal.id)}
                accessibilityRole="checkbox"
                accessibilityLabel={goal.label}
                accessibilityState={{ selected: isSelected }}
                activeOpacity={0.8}
              >
                <GlassCard
                  style={[
                    styles.tileCard,
                    isSelected && {
                      borderColor: palette.aurora[300],
                      borderWidth: 2,
                    },
                  ]}
                  radius={16}
                >
                  {/* Selected checkmark badge */}
                  {isSelected && (
                    <View
                      testID={`tile-check-${goal.id}`}
                      style={[
                        styles.checkBadge,
                        { backgroundColor: palette.sage[300] },
                      ]}
                    >
                      <AppIcon
                        name="check"
                        size={10}
                        color={palette.midnight[950]}
                      />
                    </View>
                  )}

                  {/* Tile content */}
                  <View style={styles.tileContent}>
                    <IconTile
                      iconName={goal.iconName}
                      size={40}
                      hue={goal.hue}
                      variant={isSelected ? "solid" : "soft"}
                    />
                    <Text
                      style={[
                        styles.tileLabel,
                        { color: palette.warm[50] },
                      ]}
                      numberOfLines={2}
                    >
                      {goal.label}
                    </Text>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky bottom CTA */}
      <View style={styles.bottomActions}>
        <Text
          testID="selection-counter"
          accessibilityRole="text"
          accessibilityLiveRegion="polite"
          style={[styles.selectionCounter, { color: palette.warm[500] }]}
        >
          {selectionLabel}
        </Text>

        <Button
          testID="continue-button"
          label="Continue"
          variant="primary"
          fullWidth
          disabled={!isContinueEnabled}
          onPress={onContinue}
          accessibilityLabel="Continue with selected goals"
          style={{
            ...styles.continueButton,
            backgroundColor: isContinueEnabled ? palette.sage[500] : palette.midnight[700],
          }}
          labelStyle={{ color: palette.midnight[950] }}
        />
      </View>
    </ScreenContainer>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  bottomActions: {
    paddingBottom: 28,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  checkBadge: {
    alignItems: "center",
    borderRadius: 8,
    height: 18,
    justifyContent: "center",
    position: "absolute",
    right: 8,
    top: 8,
    width: 18,
    zIndex: 2,
  },
  continueButton: {
    borderRadius: 28,
    marginTop: 4,
  },
  goalsBracket: {
    marginBottom: 8,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  headerLabel: {
    textAlign: "center",
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  headerSkipLink: {
    alignItems: "flex-end",
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  headerSkipText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  headerSpacer: {
    height: 44,
    width: 44,
  },
  headline: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 30,
    lineHeight: 36,
    marginBottom: 8,
    textAlign: "center",
  },
  headlineItalic: {
    fontFamily: "Fraunces_400Regular_Italic",
    fontStyle: "italic",
  },
  hero: {
    alignItems: "center",
    paddingBottom: 20,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  screen: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  selectionCounter: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 300,
    textAlign: "center",
  },
  tileCard: {
    aspectRatio: 1,
    flex: 1,
  },
  tileContent: {
    alignItems: "center",
    flex: 1,
    gap: 10,
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  tileLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    textAlign: "center",
  },
  tileWrapper: {
    aspectRatio: 1,
    width: "47%",
  },
});

export default GoalsPickerScreen;
