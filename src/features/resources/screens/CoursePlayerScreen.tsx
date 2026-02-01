/**
 * CoursePlayerScreen Component
 * @description Audio/video player for course lessons with circular progress ring,
 *   playback controls, timer display, and next lesson card
 * @task Task 3.13.6: Course Player Screen (Screen 117)
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface CoursePlayerScreenProps {
  lessonTitle: string;
  timerDisplay: string;
  progress: number;
  isPlaying: boolean;
  nextLessonTitle: string;
  nextLessonDuration: string;
  nextLessonRating: string;
  onBack: () => void;
  onPlayPause: () => void;
  onNextLesson: () => void;
}

const colors = {
  background: "#9AAD5C",
  white: "#FFFFFF",
  ringTrack: "rgba(255,255,255,0.2)",
  ringFill: "#FFFFFF",
  playPauseBg: "#FFFFFF",
  playPauseIcon: "#9AAD5C",
  cardBg: "rgba(255,255,255,0.15)",
  textSecondary: "rgba(255,255,255,0.7)",
  nextLabel: "rgba(255,255,255,0.6)",
} as const;

export function CoursePlayerScreen({
  lessonTitle,
  timerDisplay,
  progress,
  isPlaying,
  nextLessonTitle,
  nextLessonDuration,
  nextLessonRating,
  onBack,
  onPlayPause,
  onNextLesson,
}: CoursePlayerScreenProps): React.ReactElement {
  return (
    <View testID="course-player-screen" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>{"\u263E"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Courses</Text>
      </View>

      {/* Lesson Title */}
      <Text style={styles.lessonTitle}>{lessonTitle}</Text>

      {/* Progress Ring */}
      <View testID="progress-ring" style={styles.progressRingContainer}>
        {/* Outer ring track */}
        <View style={styles.ringTrack}>
          {/* Progress fill indicator */}
          <View
            style={[
              styles.ringFill,
              { transform: [{ rotate: `${progress * 360}deg` }] },
            ]}
          />
        </View>

        {/* Play/Pause Button (center) */}
        <TouchableOpacity
          testID="play-pause-button"
          style={styles.playPauseButton}
          onPress={onPlayPause}
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? "Pause" : "Play"}
        >
          <Text style={styles.playPauseIcon}>
            {isPlaying ? "\u23F8" : "\u25B6"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Timer Display */}
      <Text testID="timer-display" style={styles.timerDisplay}>
        {timerDisplay}
      </Text>

      {/* Next Lesson Card */}
      <TouchableOpacity
        testID="next-lesson-card"
        style={styles.nextLessonCard}
        onPress={onNextLesson}
        accessibilityRole="button"
        accessibilityLabel={`Next lesson: ${nextLessonTitle}`}
      >
        <Text style={styles.nextLabel}>NEXT COURSE</Text>
        <View style={styles.nextLessonRow}>
          <View style={styles.nextPlayIcon}>
            <Text style={styles.nextPlayIconText}>{"\u25B6"}</Text>
          </View>
          <View style={styles.nextLessonInfo}>
            <Text style={styles.nextLessonTitle}>{nextLessonTitle}</Text>
            <View style={styles.nextLessonMeta}>
              <Text style={styles.nextLessonDuration}>
                {nextLessonDuration}
              </Text>
              <Text style={styles.nextLessonRating}>
                {"\u2B50"} {nextLessonRating}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  backIcon: {
    color: colors.white,
    fontSize: 24,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  lessonTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "700",
    marginTop: 24,
    paddingHorizontal: 24,
    textAlign: "center",
  },
  nextLabel: {
    color: colors.nextLabel,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 12,
  },
  nextLessonCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    marginHorizontal: 24,
    padding: 16,
  },
  nextLessonDuration: {
    color: colors.textSecondary,
    fontSize: 12,
    marginRight: 12,
  },
  nextLessonInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nextLessonMeta: {
    flexDirection: "row",
    marginTop: 4,
  },
  nextLessonRating: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  nextLessonRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  nextLessonTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  nextPlayIcon: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  nextPlayIconText: {
    color: colors.white,
    fontSize: 14,
  },
  playPauseButton: {
    alignItems: "center",
    backgroundColor: colors.playPauseBg,
    borderRadius: 36,
    height: 72,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    position: "absolute",
    width: 72,
  },
  playPauseIcon: {
    color: colors.playPauseIcon,
    fontSize: 28,
  },
  progressRingContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  ringFill: {
    backgroundColor: colors.ringFill,
    borderRadius: 4,
    height: 8,
    position: "absolute",
    top: 0,
    width: 8,
  },
  ringTrack: {
    alignItems: "center",
    borderColor: colors.ringTrack,
    borderRadius: 120,
    borderWidth: 4,
    height: 240,
    justifyContent: "center",
    width: 240,
  },
  timerDisplay: {
    color: colors.white,
    fontSize: 48,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
  },
});

export default CoursePlayerScreen;
