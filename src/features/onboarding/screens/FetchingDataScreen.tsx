/**
 * Fetching Data Screen - Interactive Loading with Shake Gesture
 * Based on ui-designs/Dark-mode/Splash & Loading.png (Screen 4/4)
 * Features shake-to-interact functionality
 */

import { useTheme } from "@theme/ThemeProvider";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
} from "react-native";

interface FetchingDataScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export const FetchingDataScreen: React.FC<FetchingDataScreenProps> = ({
  onComplete,
  duration = 3000,
}) => {
  const { theme } = useTheme();
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Pulse animation for the text
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();

    // Auto-complete after duration
    if (onComplete && duration > 0) {
      const timer = setTimeout(onComplete, duration);
      return () => clearTimeout(timer);
    }

    return () => pulse.stop();
  }, [onComplete, duration, pulseAnim]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.green["50"],
      justifyContent: "center",
      alignItems: "center",
    },
    backgroundCircles: {
      position: "absolute",
      width: "100%",
      height: "100%",
    },
    circle: {
      position: "absolute",
      backgroundColor: theme.colors.green["60"],
      opacity: 0.3,
      borderRadius: 1000,
    },
    circle1: {
      width: 300,
      height: 300,
      top: 100,
      left: -50,
    },
    circle2: {
      width: 250,
      height: 250,
      bottom: 150,
      right: -30,
    },
    circle3: {
      width: 200,
      height: 200,
      top: "50%",
      left: "50%",
      marginTop: -100,
      marginLeft: -100,
    },
    contentContainer: {
      zIndex: 1,
      alignItems: "center",
    },
    mainText: {
      fontSize: 24,
      fontWeight: "700",
      color: "#FFFFFF",
      marginBottom: 40,
    },
    instruction: {
      alignItems: "center",
    },
    emoji: {
      fontSize: 32,
      marginBottom: 8,
    },
    instructionText: {
      fontSize: 14,
      fontWeight: "500",
      color: "#FFFFFF",
      textAlign: "center",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Background decorative circles */}
      <View style={styles.backgroundCircles}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      {/* Main content */}
      <Animated.View
        style={[
          styles.contentContainer,
          { transform: [{ scale: pulseAnim }] },
        ]}
      >
        <Text style={styles.mainText}>Fetching Data...</Text>

        <View style={styles.instruction}>
          <Text style={styles.emoji}>📱</Text>
          <Text style={styles.instructionText}>
            Shake screen to interact!
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default FetchingDataScreen;
