/**
 * SessionCard Component
 * @description Mindful session card with playback controls and progress
 * @task Task 2.9.2: SessionCard Component
 *
 * Features:
 * - Play button with icon
 * - Title and soundscape badge
 * - Progress bar with time labels
 * - Full accessibility support
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import type { SessionCardProps } from "./SessionCard.types";
import {
  formatSessionTime,
  calculateProgress,
} from "./SessionCard.types";

/**
 * SessionCard Component
 *
 * @example
 * ```tsx
 * <SessionCard
 *   id="session-1"
 *   title="Deep Meditation"
 *   soundscape={{ name: "Nature", color: "#9AAD5C" }}
 *   duration={25}
 *   progress={5.03}
 *   onPress={(id) => navigate(id)}
 *   onPlayPress={(id) => playSession(id)}
 * />
 * ```
 */
export function SessionCard({
  id,
  title,
  soundscape,
  duration,
  progress,
  onPress,
  onPlayPress,
  style,
  testID,
  accessibilityLabel,
}: SessionCardProps): React.ReactElement {
  const progressTime = formatSessionTime(progress);
  const totalTime = formatSessionTime(duration);
  const progressPercent = calculateProgress(progress, duration);

  const defaultAccessibilityLabel = `${title}, ${soundscape.name} soundscape, ${progressTime} of ${totalTime}`;

  const handlePress = () => {
    if (onPress) {
      onPress(id);
    }
  };

  const handlePlayPress = () => {
    if (onPlayPress) {
      onPlayPress(id);
    }
  };

  const Container = onPress ? TouchableOpacity : View;
  const containerProps = onPress
    ? {
        onPress: handlePress,
        accessibilityRole: "button" as const,
        activeOpacity: 0.7,
      }
    : {};

  return (
    <Container
      testID={testID}
      accessibilityLabel={accessibilityLabel || defaultAccessibilityLabel}
      style={[styles.container, style]}
      {...containerProps}
    >
      {/* Play Button */}
      <TouchableOpacity
        onPress={handlePlayPress}
        style={styles.playButton}
        testID={`${testID}-play-button`}
        accessibilityLabel="Play session"
        accessibilityRole="button"
      >
        <Text style={styles.playIcon}>▶</Text>
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        {/* Title and Badge */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <View
            style={[
              styles.soundscapeBadge,
              { backgroundColor: soundscape.color },
            ]}
          >
            <Text style={styles.badgeText}>{soundscape.name}</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View
          style={styles.progressContainer}
          testID={`${testID}-progress`}
        >
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressPercent}%` },
              ]}
            />
          </View>
          <View style={styles.timeLabels}>
            <Text style={styles.timeText}>{progressTime}</Text>
            <Text style={styles.timeText}>{totalTime}</Text>
          </View>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  container: {
    backgroundColor: "#334155",
    borderRadius: 12,
    flexDirection: "row",
    padding: 16,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  playButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  playIcon: {
    color: "#1E293B",
    fontSize: 16,
    marginLeft: 2,
  },
  progressBar: {
    backgroundColor: "#475569",
    borderRadius: 4,
    height: 6,
    overflow: "hidden",
    width: "100%",
  },
  progressContainer: {
    marginTop: 12,
  },
  progressFill: {
    backgroundColor: "#8B7355",
    height: "100%",
  },
  soundscapeBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  timeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  timeText: {
    color: "#94A3B8",
    fontSize: 12,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
});

export default SessionCard;
