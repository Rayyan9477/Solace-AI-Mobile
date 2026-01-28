/**
 * CompilingDataScreen Component
 * @description Loading screen while compiling user data
 * @task Task 3.3.8: Compiling Data Screen (Screen 22)
 */

import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";

interface CompilingDataScreenProps {
  onComplete?: () => void;
}

export function CompilingDataScreen({
  onComplete,
}: CompilingDataScreenProps): React.ReactElement {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();

    return () => {
      spinAnimation.stop();
    };
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View
      testID="compiling-data-screen"
      style={styles.container}
      accessibilityLabel="Loading screen, compiling your data"
    >
      {/* Mascot Illustration */}
      <View testID="mascot-illustration" style={styles.mascotIllustration}>
        {/* Meditation Character */}
        <View testID="meditation-character" style={styles.meditationCharacter}>
          {/* Head */}
          <View style={styles.characterHead} />
          {/* Body */}
          <View style={styles.characterBody}>
            <View style={styles.characterArm} />
            <View style={[styles.characterArm, styles.characterArmRight]} />
          </View>
          {/* Legs in meditation pose */}
          <View style={styles.characterLegs} />
        </View>

        {/* Decorative Wave */}
        <View testID="decorative-wave" style={styles.decorativeWave}>
          <View style={styles.waveLayer1} />
          <View style={styles.waveLayer2} />
          <View style={styles.waveLayer3} />
        </View>
      </View>

      {/* Status Text */}
      <Text
        testID="status-text"
        style={styles.statusText}
        accessibilityRole="text"
        accessibilityLabel="Compiling Data"
      >
        Compiling Data...
      </Text>

      {/* Loading Indicator */}
      <Animated.View
        testID="loading-indicator"
        style={[
          styles.loadingIndicator,
          { transform: [{ rotate: spin }] },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  characterArm: {
    backgroundColor: "#E8853A",
    borderRadius: 4,
    height: 30,
    left: -10,
    position: "absolute",
    top: 10,
    width: 8,
  },
  characterArmRight: {
    left: "auto",
    right: -10,
  },
  characterBody: {
    backgroundColor: "#E8853A",
    borderRadius: 8,
    height: 40,
    position: "relative",
    width: 50,
  },
  characterHead: {
    backgroundColor: "#C4A574",
    borderRadius: 25,
    height: 50,
    marginBottom: 4,
    width: 50,
  },
  characterLegs: {
    backgroundColor: "#E8853A",
    borderRadius: 20,
    height: 20,
    marginTop: 4,
    width: 70,
  },
  container: {
    alignItems: "center",
    backgroundColor: "#1C1410",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  decorativeWave: {
    alignItems: "center",
    bottom: -30,
    position: "absolute",
    width: "100%",
  },
  loadingIndicator: {
    borderColor: "rgba(196, 165, 116, 0.3)",
    borderRadius: 20,
    borderTopColor: "#C4A574",
    borderWidth: 3,
    height: 40,
    marginTop: 24,
    width: 40,
  },
  mascotIllustration: {
    alignItems: "center",
    height: 200,
    justifyContent: "center",
    marginBottom: 32,
    position: "relative",
    width: 200,
  },
  meditationCharacter: {
    alignItems: "center",
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  waveLayer1: {
    backgroundColor: "rgba(154, 173, 92, 0.1)",
    borderRadius: 100,
    height: 60,
    position: "absolute",
    top: 0,
    width: 180,
  },
  waveLayer2: {
    backgroundColor: "rgba(154, 173, 92, 0.15)",
    borderRadius: 80,
    height: 50,
    position: "absolute",
    top: 10,
    width: 150,
  },
  waveLayer3: {
    backgroundColor: "rgba(154, 173, 92, 0.2)",
    borderRadius: 60,
    height: 40,
    position: "absolute",
    top: 20,
    width: 120,
  },
});

export default CompilingDataScreen;
