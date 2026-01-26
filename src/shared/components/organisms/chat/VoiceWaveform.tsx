/**
 * VoiceWaveform Component
 * @description Animated audio waveform visualization
 * @task Task 2.7.4: VoiceWaveform Component
 *
 * Features:
 * - Animated bar visualization
 * - Live recording mode
 * - Playback progress mode
 * - Multiple visualization styles
 * - Customizable colors and dimensions
 * - Duration display
 * - Full accessibility support
 * - Dark mode first design
 */

import React, { useEffect, useRef, useMemo } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";

import type { VoiceWaveformProps } from "./VoiceWaveform.types";
import {
  generateRandomWaveform,
  resampleWaveform,
  formatWaveformDuration,
} from "./VoiceWaveform.types";

/**
 * Default color tokens (dark mode first)
 */
const defaultColors = {
  primary: "#9AAD5C", // Olive green
  secondary: "#475569", // Slate
  played: "#9AAD5C",
  unplayed: "#475569",
  text: "#94A3B8",
};

/**
 * Animated Bar Component
 */
interface AnimatedBarProps {
  height: number;
  maxHeight: number;
  width: number;
  radius: number;
  color: string;
  isAnimating: boolean;
  delay: number;
  testID?: string;
}

function AnimatedBar({
  height,
  maxHeight,
  width,
  radius,
  color,
  isAnimating,
  delay,
  testID,
}: AnimatedBarProps) {
  const animatedHeight = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (isAnimating) {
      // Create bouncy animation for live recording
      const animation = Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animatedHeight, {
            toValue: Math.random() * maxHeight * 0.8 + maxHeight * 0.2,
            duration: 150,
            useNativeDriver: false,
          }),
          Animated.timing(animatedHeight, {
            toValue: height,
            duration: 150,
            useNativeDriver: false,
          }),
        ]),
      );
      animation.start();

      return () => animation.stop();
    } else {
      // Static mode - just set the height
      Animated.timing(animatedHeight, {
        toValue: height,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }
  }, [isAnimating, height, maxHeight, delay, animatedHeight]);

  return (
    <Animated.View
      testID={testID}
      style={[
        styles.bar,
        {
          width,
          height: animatedHeight,
          borderRadius: radius,
          backgroundColor: color,
        },
      ]}
    />
  );
}

/**
 * VoiceWaveform Component
 *
 * @example
 * ```tsx
 * // Live recording
 * <VoiceWaveform
 *   isAnimating
 *   animationMode="live"
 *   showDuration
 *   duration={recordingDuration}
 * />
 *
 * // Playback with progress
 * <VoiceWaveform
 *   waveform={audioWaveform}
 *   animationMode="playback"
 *   playbackProgress={currentPosition / totalDuration}
 *   showDuration
 *   duration={currentPosition}
 *   totalDuration={totalDuration}
 * />
 * ```
 */
export function VoiceWaveform({
  waveform,
  barCount = 30,
  isAnimating = false,
  animationMode = "live",
  waveformStyle = "bars",
  primaryColor = defaultColors.primary,
  secondaryColor = defaultColors.secondary,
  minBarHeight = 0.1,
  maxHeight = 40,
  barWidth = 3,
  barGap = 2,
  barRadius = 2,
  playbackProgress = 0,
  showDuration = false,
  duration = 0,
  testID,
  accessibilityLabel,
  style,
}: VoiceWaveformProps): React.ReactElement {
  // Generate or process waveform data
  const processedWaveform = useMemo(() => {
    if (waveform && waveform.length > 0) {
      return resampleWaveform(waveform, barCount);
    }
    // Generate static random waveform if none provided
    if (animationMode === "static" || !isAnimating) {
      return generateRandomWaveform(barCount);
    }
    // For live mode without data, use minimum heights
    return Array(barCount).fill(minBarHeight);
  }, [waveform, barCount, animationMode, isAnimating, minBarHeight]);

  // Calculate bar heights
  const barHeights = useMemo(() => {
    return processedWaveform.map((amplitude) => {
      const normalizedAmplitude = Math.max(minBarHeight, Math.min(1, amplitude));
      return normalizedAmplitude * maxHeight;
    });
  }, [processedWaveform, minBarHeight, maxHeight]);

  // Calculate bar colors based on playback progress
  const getBarColor = (index: number): string => {
    if (animationMode === "playback") {
      const progressIndex = Math.floor(playbackProgress * barCount);
      return index <= progressIndex ? primaryColor : secondaryColor;
    }
    return primaryColor;
  };

  // Render mirrored bars if style is mirror
  const renderBars = () => {
    const bars = barHeights.map((height, index) => (
      <AnimatedBar
        key={index}
        height={height}
        maxHeight={maxHeight}
        width={barWidth}
        radius={barRadius}
        color={getBarColor(index)}
        isAnimating={isAnimating && animationMode === "live"}
        delay={index * 30}
        testID={`${testID}-bar-${index}`}
      />
    ));

    if (waveformStyle === "mirror") {
      return (
        <View style={styles.mirrorContainer}>
          <View style={[styles.barsContainer, { gap: barGap }]}>{bars}</View>
          <View
            style={[
              styles.barsContainer,
              styles.mirroredBars,
              { gap: barGap },
            ]}
          >
            {barHeights.map((height, index) => (
              <View
                key={`mirror-${index}`}
                style={[
                  styles.bar,
                  {
                    width: barWidth,
                    height: height * 0.5,
                    borderRadius: barRadius,
                    backgroundColor: secondaryColor,
                    opacity: 0.5,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      );
    }

    return (
      <View
        testID={`${testID}-bars`}
        style={[styles.barsContainer, { gap: barGap }]}
      >
        {bars}
      </View>
    );
  };

  return (
    <View
      testID={testID}
      accessibilityLabel={accessibilityLabel || "Audio waveform visualization"}
      accessibilityRole="image"
      style={[styles.container, { height: maxHeight }, style]}
    >
      {renderBars()}

      {/* Duration Display */}
      {showDuration && (
        <Text testID={`${testID}-duration`} style={styles.durationText}>
          {formatWaveformDuration(duration)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    minHeight: 2,
  },
  barsContainer: {
    alignItems: "center",
    flexDirection: "row",
    height: "100%",
  },
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  durationText: {
    color: defaultColors.text,
    fontSize: 12,
    marginLeft: 8,
  },
  mirrorContainer: {
    flexDirection: "column",
  },
  mirroredBars: {
    transform: [{ scaleY: -1 }],
  },
});

export default VoiceWaveform;
