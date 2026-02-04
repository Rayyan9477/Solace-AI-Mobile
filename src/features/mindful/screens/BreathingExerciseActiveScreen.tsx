/**
 * BreathingExerciseActiveScreen Component
 * @description Active breathing exercise state with dynamic background color,
 *   concentric circles animation, phase instruction, progress bar, and playback controls
 * @task Task 3.12.7: Breathing Exercise Active Screen (Screen 110)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { palette } from "../../../shared/theme";

interface BreathingExerciseActiveScreenProps {
  soundName: string;
  instruction: string;
  elapsedTime: string;
  totalTime: string;
  progress: number;
  isPlaying: boolean;
  backgroundColor: string;
  onRewind: () => void;
  onPlayPause: () => void;
  onForward: () => void;
}

const colors = {
  white: palette.text.primary,
  circleRing1: palette.opacity.white08,
  circleRing2: palette.opacity.white12,
  circleRing3: palette.opacity.white18,
  progressTrack: palette.opacity.white30,
  progressFill: palette.text.primary,
  playPauseBg: palette.text.primary,
  badgeBorder: palette.opacity.white40,
} as const;

export function BreathingExerciseActiveScreen({
  soundName,
  instruction,
  elapsedTime,
  totalTime,
  progress,
  isPlaying,
  backgroundColor,
  onRewind,
  onPlayPause,
  onForward,
}: BreathingExerciseActiveScreenProps): React.ReactElement {
  return (
    <View
      testID="breathing-exercise-active-screen"
      style={[styles.container, { backgroundColor }]}
    >
      {/* Sound Badge */}
      <View style={styles.badgeContainer}>
        <View testID="sound-badge" style={styles.soundBadge}>
          <Text style={styles.soundIcon}>{"\uD83D\uDD0A"}</Text>
          <Text style={styles.soundName}>Sound: {soundName}</Text>
        </View>
      </View>

      {/* Breathing Circle */}
      <View testID="breathing-circle" style={styles.breathingCircle}>
        <View style={[styles.ring, styles.ringOuter]} />
        <View style={[styles.ring, styles.ringMiddle]} />
        <View style={[styles.ring, styles.ringInner]} />

        <Text testID="instruction-text" style={styles.instructionText}>
          {instruction}
        </Text>
      </View>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{elapsedTime}</Text>
          <Text style={styles.timeText}>{totalTime}</Text>
        </View>
        <View testID="progress-bar" style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min(progress * 100, 100)}%` },
            ]}
          />
        </View>
      </View>

      {/* Playback Controls */}
      <View style={styles.controlsRow}>
        <TouchableOpacity
          testID="rewind-button"
          style={styles.controlButton}
          onPress={onRewind}
          accessibilityRole="button"
          accessibilityLabel="Rewind"
        >
          <Text style={styles.controlIcon}>{"\u21BA"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="play-pause-button"
          style={styles.playPauseButton}
          onPress={onPlayPause}
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? "Pause" : "Play"}
        >
          <Text style={[styles.playPauseIcon, { color: backgroundColor }]}>
            {isPlaying ? "\u23F8" : "\u25B6"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="forward-button"
          style={styles.controlButton}
          onPress={onForward}
          accessibilityRole="button"
          accessibilityLabel="Forward"
        >
          <Text style={styles.controlIcon}>{"\u21BB"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    alignItems: "center",
    paddingTop: 24,
  },
  breathingCircle: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
  },
  controlButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  controlIcon: {
    color: colors.white,
    fontSize: 32,
  },
  controlsRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 40,
    justifyContent: "center",
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  instructionText: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  playPauseButton: {
    alignItems: "center",
    backgroundColor: colors.playPauseBg,
    borderRadius: 32,
    height: 64,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 64,
  },
  playPauseIcon: {
    fontSize: 24,
  },
  progressFill: {
    backgroundColor: colors.progressFill,
    borderRadius: 2,
    height: 4,
  },
  progressSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  progressTrack: {
    backgroundColor: colors.progressTrack,
    borderRadius: 2,
    height: 4,
    marginTop: 8,
    overflow: "hidden",
  },
  ring: {
    borderRadius: 999,
    position: "absolute",
  },
  ringInner: {
    backgroundColor: colors.circleRing3,
    height: 160,
    width: 160,
  },
  ringMiddle: {
    backgroundColor: colors.circleRing2,
    height: 220,
    width: 220,
  },
  ringOuter: {
    backgroundColor: colors.circleRing1,
    height: 280,
    width: 280,
  },
  soundBadge: {
    alignItems: "center",
    borderColor: colors.badgeBorder,
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  soundIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  soundName: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default BreathingExerciseActiveScreen;
