/**
 * Course Lesson Screen - Active Meditation/Course Lesson Playback
 * Based on ui-designs/Dark-mode/Mindful Resources.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

export const CourseLessonScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(325); // 05:25 in seconds
  const [duration] = useState(360); // 06:00 total

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= duration) {
          clearInterval(interval);
          return duration;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = currentTime / duration;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.green["40"],
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.2)",
      borderRadius: 20,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 40,
    },
    title: {
      fontSize: 28,
      fontWeight: "800",
      color: "#FFFFFF",
      textAlign: "center",
      marginBottom: 40,
    },
    progressCircle: {
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: "rgba(255,255,255,0.3)",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 40,
    },
    progressCircleInner: {
      width: 180,
      height: 180,
      borderRadius: 90,
      backgroundColor: theme.colors.green["60"],
      justifyContent: "center",
      alignItems: "center",
    },
    playPauseButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "#FFFFFF",
      justifyContent: "center",
      alignItems: "center",
    },
    playPauseIcon: {
      fontSize: 32,
    },
    timeText: {
      fontSize: 48,
      fontWeight: "800",
      color: "#FFFFFF",
      marginTop: 20,
    },
    nextCourseCard: {
      backgroundColor: "rgba(255,255,255,0.2)",
      borderRadius: 20,
      padding: 20,
      width: "100%",
      marginTop: 40,
    },
    nextCourseLabel: {
      fontSize: 12,
      fontWeight: "700",
      color: "rgba(255,255,255,0.8)",
      marginBottom: 8,
      textTransform: "uppercase",
    },
    nextCourseRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    nextCourseInfo: {
      flex: 1,
    },
    nextCourseTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
      marginBottom: 4,
    },
    nextCourseMeta: {
      fontSize: 13,
      fontWeight: "600",
      color: "rgba(255,255,255,0.8)",
    },
    nextButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: "#FFFFFF",
      justifyContent: "center",
      alignItems: "center",
    },
    nextButtonIcon: {
      fontSize: 20,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessible
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 20, color: "#FFFFFF" }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Courses</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Mindfulness{"\n"}Meditation Intro</Text>

        {/* Progress Circle */}
        <View style={styles.progressCircle}>
          <View style={styles.progressCircleInner}>
            <TouchableOpacity
              style={styles.playPauseButton}
              onPress={() => setIsPlaying(!isPlaying)}
            >
              <Text style={styles.playPauseIcon}>
                {isPlaying ? "⏸️" : "▶️"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>

        {/* Next Course */}
        <View style={styles.nextCourseCard}>
          <Text style={styles.nextCourseLabel}>NEXT COURSE</Text>
          <View style={styles.nextCourseRow}>
            <View style={styles.nextCourseInfo}>
              <Text style={styles.nextCourseTitle}>
                First Session Meditation
              </Text>
              <Text style={styles.nextCourseMeta}>⏱️ ~15 Min · ⭐ 4.8</Text>
            </View>
            <TouchableOpacity style={styles.nextButton}>
              <Text style={styles.nextButtonIcon}>▶️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CourseLessonScreen;
