/**
 * Loading Screen - Data Loading Progress
 * Based on ui-designs/Dark-mode/Splash & Loading.png
 * Circular progress loader with overlapping circles design
 */

import { useTheme } from "@theme/ThemeProvider";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Svg, { Circle } from "react-native-svg";

interface LoadingScreenProps {
  message?: string;
  showProgress?: boolean;
}

/**
 * CircularProgressLoader - Overlapping circles design
 * Matches the design with large brown circles
 */
const CircularProgressLoader: React.FC<{ progress: number; size?: number }> = ({
  progress,
  size = 200
}) => {
  const { theme } = useTheme();
  const center = size / 2;
  const radius = size * 0.35;
  const strokeWidth = size * 0.15;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size}>
        {/* Background circle - larger, semi-transparent */}
        <Circle
          cx={center}
          cy={center}
          r={radius + strokeWidth * 0.3}
          fill="none"
          stroke={theme.colors.brown["40"]}
          strokeWidth={strokeWidth * 0.8}
          opacity={0.3}
        />

        {/* Progress circle - overlapping design */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={theme.colors.brown["60"]}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>

      {/* Progress percentage in center */}
      <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{
          fontSize: size * 0.25,
          fontWeight: '800',
          color: theme.colors.text.primary
        }}>
          {Math.round(progress)}%
        </Text>
      </View>
    </View>
  );
};

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading...",
  showProgress = true,
}) => {
  const { theme } = useTheme();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => {
      clearInterval(progressInterval);
    };
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.brown["80"],
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {showProgress && <CircularProgressLoader progress={progress} size={220} />}
    </SafeAreaView>
  );
};

export default LoadingScreen;
