/**
 * TransportControls — media transport button row (prototype v4.2)
 *
 * Used on screen 31 Mindful player. Five-button layout:
 *   prev | rewind-15 | play/pause (hero) | forward-15 | next
 *
 * The center play/pause button uses a sage→aurora linear gradient hero style.
 * Outer four buttons use midnight[800] circular surfaces.
 * Disabled state (no handler) renders at 0.4 opacity.
 */

import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useTheme } from "@/shared/theme/useTheme";
import { AppIcon } from "@/shared/components/atoms/display/AppIcon";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TransportControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  /** Skip back 15 seconds */
  onRewind?: () => void;
  /** Skip forward 15 seconds */
  onForward?: () => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TransportControls({
  isPlaying,
  onPlayPause,
  onPrev,
  onNext,
  onRewind,
  onForward,
  testID,
  style,
}: TransportControlsProps): React.ReactElement {
  const { palette } = useTheme();

  const sageStop = palette.sage[300];
  const auroraStop = palette.aurora[300];

  return (
    <View
      testID={testID}
      accessibilityRole="toolbar"
      style={[styles.row, style]}
    >
      {/* Previous */}
      <TouchableOpacity
        testID={testID ? `${testID}-prev` : "transport-prev"}
        onPress={onPrev}
        disabled={!onPrev}
        accessibilityRole="button"
        accessibilityLabel="Previous track"
        style={[
          styles.outerButton,
          { backgroundColor: palette.midnight[800] },
          !onPrev && styles.disabled,
        ]}
      >
        <AppIcon name="skip-back" size={22} color={palette.warm[100]} />
      </TouchableOpacity>

      {/* Rewind 15 */}
      <TouchableOpacity
        testID={testID ? `${testID}-rewind` : "transport-rewind"}
        onPress={onRewind}
        disabled={!onRewind}
        accessibilityRole="button"
        accessibilityLabel="Skip back 15 seconds"
        style={[
          styles.outerButton,
          { backgroundColor: palette.midnight[800] },
          !onRewind && styles.disabled,
        ]}
      >
        <AppIcon name="rotate-ccw" size={22} color={palette.warm[100]} />
      </TouchableOpacity>

      {/* Play / Pause — hero button */}
      <TouchableOpacity
        testID={testID ? `${testID}-playpause` : "transport-playpause"}
        onPress={onPlayPause}
        accessibilityRole="button"
        accessibilityLabel={isPlaying ? "Pause" : "Play"}
        style={styles.heroWrapper}
      >
        <LinearGradient
          colors={[sageStop, auroraStop]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <AppIcon
            name={isPlaying ? "pause" : "play"}
            size={32}
            color={palette.midnight[950]}
          />
        </LinearGradient>
      </TouchableOpacity>

      {/* Forward 15 */}
      <TouchableOpacity
        testID={testID ? `${testID}-forward` : "transport-forward"}
        onPress={onForward}
        disabled={!onForward}
        accessibilityRole="button"
        accessibilityLabel="Skip forward 15 seconds"
        style={[
          styles.outerButton,
          { backgroundColor: palette.midnight[800] },
          !onForward && styles.disabled,
        ]}
      >
        <AppIcon name="rotate-cw" size={22} color={palette.warm[100]} />
      </TouchableOpacity>

      {/* Next */}
      <TouchableOpacity
        testID={testID ? `${testID}-next` : "transport-next"}
        onPress={onNext}
        disabled={!onNext}
        accessibilityRole="button"
        accessibilityLabel="Next track"
        style={[
          styles.outerButton,
          { backgroundColor: palette.midnight[800] },
          !onNext && styles.disabled,
        ]}
      >
        <AppIcon name="skip-forward" size={22} color={palette.warm[100]} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.4,
  },
  heroGradient: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  heroWrapper: {
    borderRadius: 40,
    height: 80,
    overflow: "hidden",
    width: 80,
  },
  outerButton: {
    alignItems: "center",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
});

export default TransportControls;
