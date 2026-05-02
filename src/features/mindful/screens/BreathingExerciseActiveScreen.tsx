/**
 * BreathingExerciseActiveScreen — prototype v4.2 #10 reskin (Sprint 8 Batch C).
 *
 * Immersive 4-7-8 breathing session. Full-bleed midnight background with
 * decorative sage SmokeBlob (top-left) and aurora BreathingOrb (bottom-right).
 * Concentric rings host the active phase orb (sage gradient with Fraunces
 * italic phase label), a monospace seconds counter, an 8-pip cycle progress
 * bar, and the bottom restart / play-pause / settings control row.
 *
 * Pulse animation gated by `useReducedMotion()`; static path uses no
 * animation. Maps to `prototypes/screens/10-breathing.js`.
 */

import React, { useEffect, useMemo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { useTheme } from "@/shared/theme/useTheme";
import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import { ScreenContainer } from "@/shared/components/atoms/layout";
import {
  BracketLabel,
  BreathingOrb,
  ConcentricRings,
  SmokeBlob,
} from "@/shared/components/primitives";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BreathingPhase = "inhale" | "hold" | "exhale";

export interface BreathingExerciseActiveScreenProps {
  /** Total cycles in the session. Default 8. */
  cycleCount?: number;
  /** Current cycle index (1-based). Default 1. */
  currentCycle?: number;
  /** Active phase label. Default "inhale". */
  currentPhase?: BreathingPhase;
  /** Seconds remaining for the current phase. Default 4. */
  secondsRemaining?: number;
  /** Whether playback is paused. Default false. */
  isPaused?: boolean;
  onClose: () => void;
  onTogglePause: () => void;
  onRestart: () => void;
  onSettings: () => void;
  onToggleSound?: () => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PHASE_LABEL: Record<BreathingPhase, string> = {
  inhale: "Breathe in",
  hold: "Hold",
  exhale: "Breathe out",
};

const padTwo = (n: number): string => String(Math.max(0, Math.floor(n))).padStart(2, "0");

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BreathingExerciseActiveScreen({
  cycleCount = 8,
  currentCycle = 1,
  currentPhase = "inhale",
  secondsRemaining = 4,
  isPaused = false,
  onClose,
  onTogglePause,
  onRestart,
  onSettings,
  onToggleSound,
  testID = "breathing-exercise-active-screen",
  style,
}: BreathingExerciseActiveScreenProps): React.ReactElement {
  const { palette, typography } = useTheme();
  const reducedMotion = useReducedMotion();

  const shouldAnimate = !reducedMotion && !isPaused;
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (!shouldAnimate) {
      pulse.value = 1;
      return;
    }
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 3200, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 3200, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [shouldAnimate, pulse]);

  const orbAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const phaseLabel = PHASE_LABEL[currentPhase];
  const secondsLabel = padTwo(secondsRemaining);

  const cyclePips = useMemo(
    () => Array.from({ length: cycleCount }, (_, i) => i < currentCycle),
    [cycleCount, currentCycle],
  );

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={[styles.container, style]}
    >
      {/* Decorative ambient blobs */}
      <View
        style={[styles.smokeWrap, styles.smokeTopLeft]}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <SmokeBlob size={320} tint="sage" opacity={0.6} />
      </View>
      <View
        style={[styles.smokeWrap, styles.smokeBottomRight]}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <BreathingOrb size={260} tint="cool" pulsing={!reducedMotion} />
      </View>

      {/* Top header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="close-button"
          style={[
            styles.iconBtn,
            styles.iconBtnSm,
            { backgroundColor: palette.midnight[800], borderColor: palette.midnight[600] },
          ]}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close breathing exercise"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <AppIcon name="x" size={16} color={palette.warm[400]} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <BracketLabel variant="default">4-7-8 Breathing</BracketLabel>
          <Text
            testID="cycle-counter"
            style={[styles.cycleText, { color: palette.warm[500], fontFamily: typography.fontFamily.mono }]}
          >
            {`Cycle ${currentCycle} of ${cycleCount}`}
          </Text>
        </View>

        <TouchableOpacity
          testID="sound-button"
          style={[
            styles.iconBtn,
            styles.iconBtnSm,
            { backgroundColor: palette.midnight[800], borderColor: palette.midnight[600] },
          ]}
          onPress={onToggleSound}
          disabled={!onToggleSound}
          accessibilityRole="button"
          accessibilityLabel="Toggle sound"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <AppIcon name="volume-2" size={16} color={palette.warm[400]} />
        </TouchableOpacity>
      </View>

      {/* Center stack */}
      <View style={styles.center}>
        {/* Concentric rings + inner orb */}
        <View
          testID="breathing-circle"
          accessibilityRole="image"
          accessibilityLabel={`${phaseLabel}, ${secondsRemaining} seconds remaining`}
          style={styles.ringsWrap}
        >
          <ConcentricRings size={288} rings={3} tint="sage">
            <Animated.View style={[styles.innerOrb, orbAnimStyle]}>
              <LinearGradient
                colors={[palette.sage[300], palette.aurora[500], palette.midnight[800]]}
                start={{ x: 0.3, y: 0.3 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Text
                testID="instruction-text"
                style={[
                  styles.phaseLabel,
                  {
                    color: palette.warm[50],
                    fontFamily: typography.fontFamily.displayItalic,
                  },
                ]}
              >
                {phaseLabel}
              </Text>
            </Animated.View>
          </ConcentricRings>
        </View>

        {/* Counter */}
        <Text
          testID="seconds-counter"
          accessibilityLiveRegion="polite"
          accessibilityLabel={`${secondsRemaining} seconds`}
          style={[
            styles.secondsValue,
            { color: palette.warm[50], fontFamily: typography.fontFamily.mono },
          ]}
        >
          {secondsLabel}
        </Text>
        <BracketLabel variant="muted" style={styles.secondsBracket}>
          seconds
        </BracketLabel>

        {/* Cycle progress dots */}
        <View
          testID="cycle-progress"
          accessibilityRole="progressbar"
          accessibilityLabel="Breathing cycle progress"
          accessibilityValue={{ min: 0, max: cycleCount, now: currentCycle }}
          style={styles.pipsRow}
        >
          {cyclePips.map((on, i) => (
            <View
              key={i}
              style={[
                styles.pip,
                {
                  backgroundColor: on
                    ? palette.sage[300]
                    : `${palette.warm[50]}${palette.alpha[15]}`,
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Bottom controls */}
      <View style={styles.controlsRow}>
        <TouchableOpacity
          testID="restart-button"
          style={[
            styles.iconBtn,
            styles.iconBtnMd,
            { backgroundColor: palette.midnight[800], borderColor: palette.midnight[600] },
          ]}
          onPress={onRestart}
          accessibilityRole="button"
          accessibilityLabel="Restart exercise"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <AppIcon name="rotate-ccw" size={18} color={palette.warm[100]} />
        </TouchableOpacity>

        <TouchableOpacity
          testID="play-pause-button"
          style={[
            styles.iconBtn,
            styles.iconBtnLg,
            { backgroundColor: palette.sage[300] },
          ]}
          onPress={onTogglePause}
          accessibilityRole="button"
          accessibilityLabel={isPaused ? "Resume breathing exercise" : "Pause breathing exercise"}
          accessibilityState={{ selected: !isPaused }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <AppIcon
            name={isPaused ? "play" : "pause"}
            size={26}
            color={palette.midnight[950]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          testID="settings-button"
          style={[
            styles.iconBtn,
            styles.iconBtnMd,
            { backgroundColor: palette.midnight[800], borderColor: palette.midnight[600] },
          ]}
          onPress={onSettings}
          accessibilityRole="button"
          accessibilityLabel="Exercise settings"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <AppIcon name="settings-2" size={18} color={palette.warm[100]} />
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  container: {
    flex: 1,
    overflow: "hidden",
  },
  controlsRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 24,
    justifyContent: "center",
    paddingBottom: 32,
    paddingTop: 8,
  },
  cycleText: {
    fontSize: 10,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  headerCenter: {
    alignItems: "center",
  },
  iconBtn: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: "center",
  },
  iconBtnLg: {
    height: 68,
    minHeight: 44,
    minWidth: 44,
    width: 68,
  },
  iconBtnMd: {
    height: 52,
    minHeight: 44,
    minWidth: 44,
    width: 52,
  },
  iconBtnSm: {
    height: 44,
    minHeight: 44,
    minWidth: 44,
    width: 44,
  },
  innerOrb: {
    alignItems: "center",
    borderRadius: 64,
    height: 128,
    justifyContent: "center",
    overflow: "hidden",
    width: 128,
  },
  phaseLabel: {
    fontSize: 22,
    fontStyle: "italic",
    textAlign: "center",
  },
  pip: {
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  pipsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 24,
  },
  ringsWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  secondsBracket: {
    marginTop: 4,
  },
  secondsValue: {
    fontSize: 64,
    letterSpacing: -1.5,
    lineHeight: 64,
  },
  smokeBottomRight: {
    bottom: -80,
    right: -80,
  },
  smokeTopLeft: {
    left: -80,
    top: -40,
  },
  smokeWrap: {
    position: "absolute",
  },
});

export default BreathingExerciseActiveScreen;
