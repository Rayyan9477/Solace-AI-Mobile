/**
 * Breathing Exercise Screen - Guided Breathing Exercise
 * Based on ui-designs/Dark-mode/Mindful Hours.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
} from "react-native";

type ExercisePhase = "breathe-in" | "breathe-out";

export const BreathingExerciseScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState<ExercisePhase>("breathe-in");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [totalTime] = useState(25 * 60); // 25 minutes in seconds

  // Animation values
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: phase === "breathe-in" ? "#98B068" : "#C96100",
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
      borderRadius: 20,
      backgroundColor: "rgba(255,255,255,0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    soundButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: "rgba(255,255,255,0.2)",
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    soundButtonText: {
      fontSize: 12,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 40,
    },
    breathingCircle: {
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 60,
    },
    circle: {
      position: "absolute",
      borderRadius: 1000,
      backgroundColor: "rgba(255,255,255,0.15)",
    },
    innerCircle: {
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: "rgba(255,255,255,0.3)",
      justifyContent: "center",
      alignItems: "center",
    },
    phaseText: {
      fontSize: 32,
      fontWeight: "800",
      color: "#FFFFFF",
      textAlign: "center",
    },
    timeDisplay: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: 32,
    },
    timeText: {
      fontSize: 14,
      fontWeight: "700",
      color: "rgba(255,255,255,0.8)",
    },
    progressBar: {
      flex: 1,
      height: 4,
      backgroundColor: "rgba(255,255,255,0.2)",
      borderRadius: 2,
      marginHorizontal: 16,
      overflow: "hidden",
    },
    progress: {
      height: "100%",
      backgroundColor: "#FFFFFF",
      borderRadius: 2,
    },
    controls: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 40,
    },
    controlButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: "rgba(255,255,255,0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    playButton: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: "#FFFFFF",
      justifyContent: "center",
      alignItems: "center",
    },
    footer: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    endButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: "#FFFFFF",
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
    },
  });

  // Breathing animation
  useEffect(() => {
    if (!isPlaying) return;

    let isMounted = true;

    const breatheIn = () => {
      if (!isMounted) return;
      setPhase("breathe-in");
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.6,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished && isMounted) breatheOut();
      });
    };

    const breatheOut = () => {
      if (!isMounted) return;
      setPhase("breathe-out");
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.6,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished && isMounted) breatheIn();
      });
    };

    breatheIn();

    return () => {
      isMounted = false;
      scaleAnim.stopAnimation();
      opacityAnim.stopAnimation();
    };
  }, [isPlaying, scaleAnim, opacityAnim]);

  // Timer
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => {
        if (prev >= totalTime) {
          setIsPlaying(false);
          return totalTime;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, totalTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = elapsedTime / totalTime;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ fontSize: 20, color: "#FFFFFF" }}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.soundButton}>
          <Text style={{ fontSize: 16 }}>🔊</Text>
          <Text style={styles.soundButtonText}>Sound: Chirping Birds</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Breathing Animation */}
        <View style={styles.breathingCircle}>
          <Animated.View
            style={[
              styles.circle,
              {
                width: 350,
                height: 350,
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.circle,
              {
                width: 300,
                height: 300,
                opacity: opacityAnim.interpolate({
                  inputRange: [0.3, 0.6],
                  outputRange: [0.5, 0.8],
                }),
                transform: [{ scale: scaleAnim }],
              },
            ]}
          />
          <View style={styles.innerCircle}>
            <Text style={styles.phaseText}>
              {phase === "breathe-in" ? "Breathe In..." : "Breathe Out..."}
            </Text>
          </View>
        </View>

        {/* Time Display */}
        <View style={styles.timeDisplay}>
          <Text style={styles.timeText}>{formatTime(elapsedTime)}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.timeText}>{formatTime(totalTime)}</Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setElapsedTime(Math.max(0, elapsedTime - 15))}
          >
            <Text style={{ fontSize: 24, color: "#FFFFFF" }}>↺</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playButton}
            onPress={() => setIsPlaying(!isPlaying)}
          >
            <Text style={{ fontSize: 28 }}>{isPlaying ? "⏸" : "▶️"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={() =>
              setElapsedTime(Math.min(totalTime, elapsedTime + 15))
            }
          >
            <Text style={{ fontSize: 24, color: "#FFFFFF" }}>↻</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.endButton}
          onPress={() => {
            setIsPlaying(false);
            // Show completion screen
            navigation.goBack();
          }}
        >
          <Text style={{ fontSize: 24 }}>✕</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BreathingExerciseScreen;
