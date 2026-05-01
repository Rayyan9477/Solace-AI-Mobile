/**
 * VoiceSessionScreen — prototype v4.2 #25 immersive voice session (Sprint 8).
 *
 * Full-bleed midnight stage with sage SmokeBlob and aurora BreathingOrb
 * accents. Centered ConcentricRings cradle a sage→aurora→lavender gradient
 * avatar with a sparkles icon, an italic "I'm listening…" headline, and a
 * 34-bar WaveformBars row. Bottom controls: switch-to-keyboard, pause/play
 * (peach), save & end.
 *
 * Maps to `prototypes/screens/25-voice.js`.
 */

import React from "react";
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

import { ScreenContainer } from "@/shared/components/atoms/layout";
import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import {
  BracketLabel,
  BreathingOrb,
  ConcentricRings,
  SmokeBlob,
  WaveformBars,
} from "@/shared/components/primitives";
import { useTheme } from "@/shared/theme/useTheme";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface VoiceSessionScreenProps {
  /** Elapsed seconds — formatted as MM:SS in the header timer chip. */
  elapsedSeconds?: number;
  /** Whether the session is currently paused (toggles icon + label). */
  isPaused?: boolean;
  onClose: () => void;
  onTogglePause: () => void;
  onSwitchToKeyboard: () => void;
  onEnd: () => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format `elapsedSeconds` as `MM:SS`. */
export function formatElapsed(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const m = Math.floor(safe / 60)
    .toString()
    .padStart(2, "0");
  const s = (safe % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ---------------------------------------------------------------------------
// Pulsing avatar
// ---------------------------------------------------------------------------

interface AvatarPulseProps {
  pulsing: boolean;
}

function AvatarPulse({ pulsing }: AvatarPulseProps): React.ReactElement {
  const { palette } = useTheme();
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (!pulsing) {
      scale.value = 1;
      return;
    }
    scale.value = withRepeat(
      withSequence(
        withTiming(1.06, {
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
      false,
    );
  }, [pulsing, scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      testID="voice-avatar"
      style={[avatarStyles.outer, animStyle]}
      accessibilityRole="image"
      accessibilityLabel="Solace avatar listening"
    >
      <LinearGradient
        colors={[palette.sage[300], palette.aurora[300], palette.lavender[300]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={avatarStyles.gradient}
      />
      <AppIcon name="sparkles" size={36} color={palette.midnight[950]} />
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export function VoiceSessionScreen({
  elapsedSeconds = 32,
  isPaused = false,
  onClose,
  onTogglePause,
  onSwitchToKeyboard,
  onEnd,
  testID = "voice-session-screen",
  style,
}: VoiceSessionScreenProps): React.ReactElement {
  const { palette, typography } = useTheme();
  const reducedMotion = useReducedMotion();

  const timerLabel = formatElapsed(elapsedSeconds);
  const pauseIcon = isPaused ? "play" : "pause";
  const pauseLabel = isPaused ? "Resume voice session" : "Pause voice session";

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={style as ViewStyle | undefined}
    >
      {/* Decorative background layers */}
      <View
        style={styles.bgLayer}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <SmokeBlob
          testID="bg-smoke"
          tint="sage"
          size={360}
          opacity={0.22}
          style={styles.bgSmoke}
        />
        <BreathingOrb
          testID="bg-orb"
          size={300}
          tint="cool"
          pulsing={!reducedMotion}
          style={styles.bgOrb}
        />
      </View>

      {/* Top header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="close-button"
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="End voice session"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={[
            styles.iconButton,
            {
              backgroundColor: palette.midnight[800],
              borderColor: palette.midnight[600],
            },
          ]}
        >
          <AppIcon name="x" size={18} color={palette.warm[100]} />
        </TouchableOpacity>

        <BracketLabel variant="default">Voice session</BracketLabel>

        <View
          testID="timer-chip"
          accessibilityRole="timer"
          accessibilityLabel={`Session time ${timerLabel}`}
          style={[
            styles.timerChip,
            {
              backgroundColor: palette.midnight[800],
              borderColor: palette.midnight[600],
            },
          ]}
        >
          <Text
            style={[
              styles.timerText,
              {
                color: palette.warm[200],
                fontFamily: typography.fontFamily.mono,
              },
            ]}
          >
            {timerLabel}
          </Text>
        </View>
      </View>

      {/* Center stack — pointer events disabled so controls underneath remain tappable */}
      <View
        style={styles.centerStack}
        pointerEvents="box-none"
      >
        <View style={styles.avatarWrap} pointerEvents="box-none">
          <ConcentricRings
            testID="avatar-rings"
            size={220}
            tint="aurora"
            rings={3}
          >
            <AvatarPulse pulsing={!reducedMotion && !isPaused} />
          </ConcentricRings>
        </View>

        <Text
          testID="listening-headline"
          accessibilityLiveRegion="polite"
          style={[
            styles.headline,
            {
              color: palette.warm[50],
              fontFamily: typography.fontFamily.displayItalic,
            },
          ]}
        >
          {isPaused ? "Paused for a moment…" : "I’m listening…"}
        </Text>

        <Text
          style={[
            styles.subheadline,
            { color: palette.warm[400] },
          ]}
        >
          Tap to pause at any time
        </Text>

        <View style={styles.waveformWrap}>
          <WaveformBars
            testID="waveform"
            count={34}
            width={300}
            height={64}
            active={!isPaused}
            accessibilityLabel="Audio waveform"
          />
        </View>
      </View>

      {/* Bottom controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          testID="switch-keyboard-button"
          onPress={onSwitchToKeyboard}
          accessibilityRole="button"
          accessibilityLabel="Switch to keyboard"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={[
            styles.controlButton,
            styles.controlSecondary,
            {
              backgroundColor: palette.midnight[800],
              borderColor: palette.midnight[600],
            },
          ]}
        >
          <AppIcon name="keyboard" size={20} color={palette.warm[100]} />
        </TouchableOpacity>

        <TouchableOpacity
          testID="toggle-pause-button"
          onPress={onTogglePause}
          accessibilityRole="button"
          accessibilityLabel={pauseLabel}
          accessibilityState={{ selected: isPaused }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={[
            styles.controlButton,
            styles.controlPrimary,
            { backgroundColor: palette.peach[300] },
          ]}
        >
          <AppIcon name={pauseIcon} size={28} color={palette.midnight[950]} />
        </TouchableOpacity>

        <TouchableOpacity
          testID="end-button"
          onPress={onEnd}
          accessibilityRole="button"
          accessibilityLabel="End and save session"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={[
            styles.controlButton,
            styles.controlSecondary,
            {
              backgroundColor: palette.midnight[800],
              borderColor: palette.midnight[600],
            },
          ]}
        >
          <AppIcon name="check" size={20} color={palette.warm[100]} />
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  avatarWrap: {
    alignItems: "center",
    marginBottom: 24,
  },
  bgLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  bgOrb: {
    bottom: -40,
    position: "absolute",
    right: -60,
  },
  bgSmoke: {
    left: -80,
    position: "absolute",
    top: 40,
  },
  centerStack: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  controlButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  controlPrimary: {
    borderRadius: 34,
    elevation: 6,
    height: 68,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    width: 68,
  },
  controlSecondary: {
    borderRadius: 26,
    borderWidth: 1,
    height: 52,
    width: 52,
  },
  controls: {
    alignItems: "center",
    flexDirection: "row",
    gap: 24,
    justifyContent: "center",
    paddingBottom: 32,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  headline: {
    fontSize: 26,
    fontStyle: "italic",
    lineHeight: 32,
    marginBottom: 6,
    textAlign: "center",
  },
  iconButton: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  subheadline: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 32,
    textAlign: "center",
  },
  timerChip: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    height: 32,
    justifyContent: "center",
    minWidth: 64,
    paddingHorizontal: 12,
  },
  timerText: {
    fontSize: 12,
    letterSpacing: 1,
  },
  waveformWrap: {
    alignItems: "center",
    height: 64,
    justifyContent: "center",
  },
});

const avatarStyles = StyleSheet.create({
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 60,
  },
  outer: {
    alignItems: "center",
    borderRadius: 60,
    height: 120,
    justifyContent: "center",
    overflow: "hidden",
    width: 120,
  },
});

export default VoiceSessionScreen;
