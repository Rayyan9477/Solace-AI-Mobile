/**
 * MoodSelectorScreen — prototype v4.2 #21 Daily Check-in reskin (Sprint 6).
 *
 * Big MoodFace hero wrapped in a BreathingOrb halo, 5-level radio strip,
 * multi-select influence chips, optional freetext note, and a sticky sage CTA.
 * Maps to `prototypes/screens/21-checkin.js`.
 *
 * Backwards-compatible with the legacy prop API. The new optional props
 * (`selectedInfluences`, `onInfluencesChange`, `note`, `onNoteChange`,
 * `onClose`) default gracefully so existing callers need no changes.
 */

import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Button } from "@/shared/components/atoms/buttons/Button";
import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import { ScreenContainer } from "@/shared/components/atoms/layout";
import { HashtagChip } from "@/shared/components/molecules/chips/HashtagChip";
import { GlassInput } from "@/shared/components/molecules/forms/GlassInput";
import {
  BracketLabel,
  BreathingOrb,
  MoodFace,
  MOOD_LABELS,
  MOOD_LEVELS,
  type MoodLevel,
} from "@/shared/components/primitives";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { useTheme } from "@/shared/theme/useTheme";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MoodOption {
  index: number;
  label: string;
  emoji: string;
  color: string;
}

export interface MoodSelectorScreenProps {
  /** 0–4; maps to MoodLevel 1–5 via +1 offset */
  selectedMoodIndex: number;
  /** Legacy API: backward-compat label lookup only */
  moodOptions: MoodOption[];
  onBack: () => void;
  onMoodChange: (index: number) => void;
  onSetMood: () => void;
  /** IDs of currently selected influence chips */
  selectedInfluences?: string[];
  onInfluencesChange?: (ids: string[]) => void;
  note?: string;
  onNoteChange?: (text: string) => void;
  /** Defaults to onBack when omitted */
  onClose?: () => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

interface InfluenceItem {
  id: string;
  label: string;
}

const INFLUENCES: InfluenceItem[] = [
  { id: "sleep", label: "Sleep" },
  { id: "work", label: "Work" },
  { id: "family", label: "Family" },
  { id: "exercise", label: "Exercise" },
  { id: "food", label: "Food" },
  { id: "weather", label: "Weather" },
  { id: "friends", label: "Friends" },
  { id: "health", label: "Health" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MoodSelectorScreen({
  selectedMoodIndex,
  moodOptions,
  onBack,
  onMoodChange,
  onSetMood,
  selectedInfluences = [],
  onInfluencesChange,
  note = "",
  onNoteChange,
  onClose,
}: MoodSelectorScreenProps): React.ReactElement {
  const { palette, typography } = useTheme();
  const reducedMotion = useReducedMotion();

  // Convert 0-based index to 1-based MoodLevel (clamp to valid range)
  const moodLevel: MoodLevel = (Math.min(
    Math.max(selectedMoodIndex + 1, 1),
    5,
  ) as MoodLevel);

  const closeHandler = onClose ?? onBack;

  // Backward-compat: look up label from legacy moodOptions if possible,
  // else fall back to MOOD_LABELS.
  const activeLegacyOption =
    selectedMoodIndex >= 0 && selectedMoodIndex < moodOptions.length
      ? moodOptions[selectedMoodIndex]
      : null;
  const moodDisplayLabel =
    activeLegacyOption?.label ?? MOOD_LABELS[moodLevel];

  const handleInfluenceToggle = (id: string): void => {
    if (!onInfluencesChange) return;
    const next = selectedInfluences.includes(id)
      ? selectedInfluences.filter((i) => i !== id)
      : [...selectedInfluences, id];
    onInfluencesChange(next);
  };

  return (
    <ScreenContainer
      testID="mood-selector-screen"
      backgroundColor={palette.midnight[950]}
      style={styles.container}
    >
      {/* Ambient orb — absolute, decorative */}
      <View
        style={styles.orbWrapper}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        pointerEvents="none"
      >
        <BreathingOrb
          testID="breathing-orb"
          size={320}
          tint="cool"
          pulsing={!reducedMotion}
        />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="close-button"
          style={[
            styles.iconButton,
            {
              backgroundColor: palette.midnight[800],
              borderColor: palette.midnight[600],
            },
          ]}
          onPress={closeHandler}
          accessibilityRole="button"
          accessibilityLabel="Close daily check-in"
        >
          <AppIcon name="x" size={16} color={palette.warm[400]} />
        </TouchableOpacity>

        <BracketLabel variant="muted">Daily check-in</BracketLabel>

        {/* Spacer to centre the label */}
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Headline */}
        <BracketLabel variant="aurora" style={styles.supertitle}>
          Right now
        </BracketLabel>

        <Text
          accessibilityRole="header"
          style={[
            styles.headline,
            {
              color: palette.warm[50],
              fontFamily: typography.fontFamily.displayRegular,
            },
          ]}
        >
          {"How are you\n"}
          <Text
            style={[
              styles.headlineItalic,
              { fontFamily: typography.fontFamily.displayItalic },
            ]}
          >
            right now?
          </Text>
        </Text>

        {/* Hero face + orb halo */}
        <View style={styles.heroArea}>
          <BreathingOrb
            size={200}
            tint="cool"
            pulsing={!reducedMotion}
            style={styles.heroOrb}
          />
          <View testID="hero-mood-face" style={styles.heroFace}>
            <MoodFace
              level={moodLevel}
              size={130}
              accessibilityLabel={`Current mood: ${moodDisplayLabel}`}
            />
          </View>
        </View>

        <Text
          testID="mood-display-label"
          accessibilityRole="text"
          style={[
            styles.moodLabel,
            {
              color: palette.warm[50],
              fontFamily: typography.fontFamily.displayItalic,
            },
          ]}
        >
          {moodDisplayLabel}
        </Text>

        {/* 5-level radio strip */}
        <View
          testID="mood-intensity-radiogroup"
          style={styles.radioStrip}
          accessibilityRole="radiogroup"
          accessible
          accessibilityLabel="Mood intensity"
        >
          {MOOD_LEVELS.map((level) => {
            const idx = level - 1; // 1-based → 0-based
            const isSelected = level === moodLevel;
            return (
              <TouchableOpacity
                key={level}
                testID={`mood-radio-${level}`}
                onPress={() => onMoodChange(idx)}
                accessibilityRole="radio"
                accessibilityLabel={MOOD_LABELS[level]}
                accessibilityState={{ checked: isSelected }}
                style={[
                  styles.radioButton,
                  { borderColor: isSelected ? palette.aurora[300] : "rgba(0,0,0,0)" },
                ]}
              >
                <MoodFace
                  level={level}
                  size={56}
                  selected={isSelected}
                  interactive
                  accessibilityLabel={MOOD_LABELS[level]}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Influence chips */}
        <View style={styles.influencesSection}>
          <BracketLabel variant="muted" style={styles.influencesLabel}>
            Influences
          </BracketLabel>
          <View
            testID="influence-chips-grid"
            style={styles.chipsGrid}
            accessible
            accessibilityLabel="What's influencing you? Select all that apply."
          >
            {INFLUENCES.map((item) => {
              const isSelected = selectedInfluences.includes(item.id);
              return (
                <HashtagChip
                  key={item.id}
                  testID={`influence-chip-${item.id}`}
                  label={item.label}
                  selected={isSelected}
                  onPress={() => handleInfluenceToggle(item.id)}
                />
              );
            })}
          </View>
        </View>

        {/* Optional note */}
        <GlassInput
          testID="mood-note-input"
          value={note}
          onChangeText={onNoteChange ?? (() => undefined)}
          placeholder="What's on your mind?"
          accessibilityLabel="Add a note about how you're feeling"
        />

        {/* Bottom padding for sticky CTA */}
        <View style={styles.scrollBottomPad} />
      </ScrollView>

      {/* Sticky CTA */}
      <View
        style={[
          styles.stickyFooter,
          { backgroundColor: palette.midnight[950] },
        ]}
      >
        <Button
          testID="log-mood-button"
          label="Log this mood"
          variant="primary"
          size="lg"
          fullWidth
          onPress={onSetMood}
          accessibilityLabel="Log this mood"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  chipsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  headerSpacer: {
    height: 44,
    width: 44,
  },
  headline: {
    fontSize: 30,
    lineHeight: 34,
    marginBottom: 4,
    paddingHorizontal: 24,
    textAlign: "center",
  },
  headlineItalic: {
    fontStyle: "italic",
  },
  heroArea: {
    alignItems: "center",
    height: 220,
    justifyContent: "center",
    marginBottom: 8,
    marginTop: 8,
  },
  heroFace: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  heroOrb: {
    position: "absolute",
  },
  iconButton: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 44,
  },
  influencesLabel: {
    marginBottom: 10,
  },
  influencesSection: {
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  moodLabel: {
    fontSize: 24,
    fontStyle: "italic",
    marginBottom: 20,
    textAlign: "center",
  },
  orbWrapper: {
    alignItems: "center",
    left: 0,
    opacity: 0.4,
    position: "absolute",
    right: 0,
    top: 80,
  },
  radioButton: {
    alignItems: "center",
    borderColor: "rgba(0,0,0,0)",
    borderRadius: 32,
    borderWidth: 2,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    padding: 2,
  },
  radioStrip: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
    paddingHorizontal: 24,
  },
  scroll: {
    paddingBottom: 8,
    paddingTop: 8,
  },
  scrollBottomPad: {
    height: 100,
  },
  stickyFooter: {
    bottom: 0,
    left: 0,
    paddingBottom: 32,
    paddingHorizontal: 24,
    paddingTop: 12,
    position: "absolute",
    right: 0,
  },
  supertitle: {
    marginBottom: 8,
    marginTop: 16,
    textAlign: "center",
  },
});

export default MoodSelectorScreen;
