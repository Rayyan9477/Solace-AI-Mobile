/**
 * SleepLogEntryScreen — prototype v4.2 #33 (Sprint 6).
 *
 * Night-sky StarField background, bedtime/woke-up time cards, hero duration
 * display, 5-step quality slider with lavender→sage gradient track, multi-select
 * feeling tags, and a sticky sage CTA.
 *
 * Maps to `prototypes/screens/33-sleep-log.js`.
 */

import React, { useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RNSlider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";

import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { useTheme } from "@/shared/theme/useTheme";
import { Button } from "@/shared/components/atoms/buttons/Button";
import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import { ScreenContainer } from "@/shared/components/atoms/layout";
import { HashtagChip } from "@/shared/components/molecules/chips/HashtagChip";
import { BracketLabel, StarField } from "@/shared/components/primitives";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SleepQuality =
  | "restless"
  | "light"
  | "okay"
  | "deep"
  | "restorative";

export interface SleepLogEntryScreenProps {
  /** Total sleep duration in minutes — e.g. 468 for 7h 48m */
  durationMinutes: number;
  /** Formatted display string e.g. "10:42 PM" */
  bedtime: string;
  /** Formatted display string e.g. "6:30 AM" */
  wokeUp: string;
  quality: SleepQuality;
  feelings: string[];
  onClose: () => void;
  onBedtimePress?: () => void;
  onWokeUpPress?: () => void;
  onQualityChange: (_q: SleepQuality) => void;
  onFeelingsChange: (_ids: string[]) => void;
  onSave: () => void;
  testID?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const QUALITY_STEPS: SleepQuality[] = [
  "restless",
  "light",
  "okay",
  "deep",
  "restorative",
];

const QUALITY_LABELS: Record<SleepQuality, string> = {
  restless: "Restless",
  light: "Light",
  okay: "Okay",
  deep: "Deep",
  restorative: "Restorative",
};

const FEELING_TAGS: { id: string; label: string }[] = [
  { id: "refreshed", label: "Refreshed" },
  { id: "groggy", label: "Groggy" },
  { id: "tired", label: "Tired" },
  { id: "energized", label: "Energized" },
  { id: "foggy", label: "Foggy" },
  { id: "calm", label: "Calm" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatDuration = (mins: number): string => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${String(m).padStart(2, "0")}m`;
};

const qualityToSliderIndex = (q: SleepQuality): number =>
  QUALITY_STEPS.indexOf(q);

const sliderIndexToQuality = (idx: number): SleepQuality =>
  QUALITY_STEPS[Math.round(idx)] ?? "okay";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SleepLogEntryScreen({
  durationMinutes,
  bedtime,
  wokeUp,
  quality,
  feelings,
  onClose,
  onBedtimePress,
  onWokeUpPress,
  onQualityChange,
  onFeelingsChange,
  onSave,
  testID = "sleep-log-entry-screen",
}: SleepLogEntryScreenProps): React.ReactElement {
  const { palette, typography } = useTheme();
  const reducedMotion = useReducedMotion();

  const durationDisplay = formatDuration(durationMinutes);
  const sliderIndex = qualityToSliderIndex(quality);
  const qualityLabel = QUALITY_LABELS[quality];

  const handleSliderChange = useCallback(
    (value: number) => {
      onQualityChange(sliderIndexToQuality(value));
    },
    [onQualityChange],
  );

  const handleTagToggle = useCallback(
    (id: string) => {
      if (feelings.includes(id)) {
        onFeelingsChange(feelings.filter((f) => f !== id));
      } else {
        onFeelingsChange([...feelings, id]);
      }
    },
    [feelings, onFeelingsChange],
  );

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={styles.container}
    >
      {/* StarField — full-screen decorative background */}
      <View testID="star-field" style={styles.starField}>
        <StarField width={375} height={700} count={32} seed={33} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <BracketLabel variant="aurora" style={styles.headerLabel}>
            Log Sleep
          </BracketLabel>
          <TouchableOpacity
            testID="close-button"
            style={[
              styles.closeButton,
              {
                backgroundColor: palette.midnight[800],
                borderColor: palette.midnight[600],
              },
            ]}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close sleep log"
            accessibilityHint="Dismisses the sleep log entry form"
            hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
          >
            <AppIcon name="x" size={16} color={palette.warm[400]} />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text
          accessibilityRole="header"
          style={[
            styles.title,
            {
              color: palette.warm[50],
              fontFamily: typography.fontFamily.display,
            },
          ]}
        >
          Last night you slept
        </Text>

        {/* Hero duration */}
        <View style={styles.heroBlock}>
          <Text
            testID="duration-display"
            accessibilityRole="text"
            accessibilityLabel={`Duration: ${durationDisplay}`}
            style={[
              styles.heroDuration,
              {
                color: palette.warm[50],
                fontFamily: typography.fontFamily.display,
              },
            ]}
          >
            {durationDisplay}
          </Text>
        </View>

        {/* Bedtime / Woke up cards */}
        <View style={styles.timeCardsRow}>
          {/* Bedtime card */}
          <TouchableOpacity
            testID="bedtime-card"
            style={[
              styles.timeCard,
              {
                backgroundColor: palette.midnight[800],
                borderColor: palette.midnight[600],
              },
            ]}
            onPress={onBedtimePress}
            accessibilityRole="button"
            accessibilityLabel={`Bedtime: ${bedtime}. Tap to change.`}
            accessibilityHint="Opens the bedtime time picker"
            disabled={!onBedtimePress}
          >
            <BracketLabel variant="muted" style={styles.timeCardLabel}>
              Bedtime
            </BracketLabel>
            <Text
              testID="bedtime-value"
              style={[
                styles.timeValue,
                {
                  color: palette.warm[50],
                  fontFamily: typography.fontFamily.mono,
                },
              ]}
            >
              {bedtime}
            </Text>
          </TouchableOpacity>

          {/* Woke up card */}
          <TouchableOpacity
            testID="woke-up-card"
            style={[
              styles.timeCard,
              {
                backgroundColor: palette.midnight[800],
                borderColor: palette.midnight[600],
              },
            ]}
            onPress={onWokeUpPress}
            accessibilityRole="button"
            accessibilityLabel={`Woke up: ${wokeUp}. Tap to change.`}
            accessibilityHint="Opens the wake-up time picker"
            disabled={!onWokeUpPress}
          >
            <BracketLabel variant="muted" style={styles.timeCardLabel}>
              Woke Up
            </BracketLabel>
            <Text
              testID="woke-up-value"
              style={[
                styles.timeValue,
                {
                  color: palette.warm[50],
                  fontFamily: typography.fontFamily.mono,
                },
              ]}
            >
              {wokeUp}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quality section */}
        <View
          style={[
            styles.qualityCard,
            {
              backgroundColor: palette.midnight[800],
              borderColor: palette.midnight[600],
            },
          ]}
        >
          <BracketLabel variant="sage" style={styles.sectionLabel}>
            Quality
          </BracketLabel>

          {/* Active quality label */}
          <Text
            testID="quality-label"
            accessibilityRole="text"
            style={[
              styles.qualityActiveLabel,
              {
                color: palette.lavender[300],
                fontFamily: typography.fontFamily.mono,
              },
            ]}
          >
            {qualityLabel}
          </Text>

          {/* Gradient track + slider stacked */}
          <View
            style={styles.sliderContainer}
            accessibilityRole="adjustable"
            accessibilityLabel={`Sleep quality: ${qualityLabel}`}
            accessibilityHint="Swipe left or right to change sleep quality"
            accessibilityValue={{ max: 4, min: 0, now: sliderIndex }}
          >
            <LinearGradient
              testID="quality-gradient-track"
              colors={[palette.lavender[300], palette.sage[300]]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.gradientTrack}
              pointerEvents="none"
            />
            <RNSlider
              testID="quality-slider"
              value={sliderIndex}
              onValueChange={handleSliderChange}
              minimumValue={0}
              maximumValue={4}
              step={1}
              minimumTrackTintColor="transparent"
              maximumTrackTintColor="transparent"
              thumbTintColor={
                reducedMotion ? palette.warm[50] : palette.lavender[100]
              }
              accessibilityLabel="Sleep quality slider"
              accessibilityRole="adjustable"
              style={styles.slider}
            />
          </View>

          {/* Step labels */}
          <View style={styles.sliderStepRow}>
            {QUALITY_STEPS.map((step) => (
              <Text
                key={step}
                style={[
                  styles.sliderStepLabel,
                  {
                    color:
                      step === quality
                        ? palette.lavender[300]
                        : palette.warm[500],
                    fontFamily: typography.fontFamily.mono,
                  },
                ]}
              >
                {QUALITY_LABELS[step]}
              </Text>
            ))}
          </View>
        </View>

        {/* Feelings section */}
        <View style={styles.feelingsSection}>
          <BracketLabel variant="peach" style={styles.sectionLabel}>
            How Do You Feel?
          </BracketLabel>
          <View style={styles.feelingsRow}>
            {FEELING_TAGS.map(({ id, label }) => (
              <HashtagChip
                key={id}
                testID={`feeling-chip-${id}`}
                label={label}
                selected={feelings.includes(id)}
                onPress={() => handleTagToggle(id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View
        style={[
          styles.stickyButton,
          { backgroundColor: palette.midnight[950] },
        ]}
      >
        <Button
          testID="save-button"
          label="Save sleep log"
          variant="primary"
          fullWidth
          onPress={onSave}
          accessibilityLabel="Save sleep log"
          accessibilityHint="Saves your sleep entry for last night"
          style={styles.saveButton}
        />
      </View>
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------
// Styles — properties alphabetically sorted per react-native/sort-styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  closeButton: {
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 36,
  },
  container: {
    flex: 1,
  },
  feelingsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  feelingsSection: {
    marginBottom: 16,
  },
  gradientTrack: {
    borderRadius: 4,
    height: 6,
    left: 0,
    position: "absolute",
    right: 0,
    top: "50%",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 4,
    paddingHorizontal: 0,
    paddingTop: 8,
  },
  headerLabel: {
    flex: 1,
  },
  heroBlock: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
  },
  heroDuration: {
    fontSize: 52,
    fontWeight: "300",
    letterSpacing: -1,
    lineHeight: 56,
    textAlign: "center",
  },
  qualityActiveLabel: {
    fontSize: 14,
    letterSpacing: 0.5,
    marginBottom: 12,
    marginTop: 4,
    textAlign: "center",
  },
  qualityCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  saveButton: {
    minHeight: 44,
  },
  scroll: {
    paddingBottom: 120,
    paddingHorizontal: 24,
  },
  sectionLabel: {
    marginBottom: 4,
  },
  slider: {
    height: 40,
    width: "100%",
  },
  sliderContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    position: "relative",
  },
  sliderStepLabel: {
    fontSize: 9,
    letterSpacing: 0.2,
    textAlign: "center",
  },
  sliderStepRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  starField: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  stickyButton: {
    bottom: 0,
    left: 0,
    paddingBottom: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    position: "absolute",
    right: 0,
  },
  timeCard: {
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    minHeight: 80,
    padding: 16,
  },
  timeCardLabel: {
    marginBottom: 6,
  },
  timeCardsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  timeValue: {
    fontSize: 22,
    fontWeight: "300",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: "300",
    letterSpacing: -0.3,
    lineHeight: 28,
    marginBottom: 4,
    marginTop: 16,
    textAlign: "center",
  },
});

export default SleepLogEntryScreen;
