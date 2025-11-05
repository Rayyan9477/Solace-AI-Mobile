/**
 * Mental Health Score Widget - Circular progress indicator
 * Based on ui-designs/Dark-mode/Home & Mental Health Score.png
 */

import { useTheme } from "@theme/ThemeProvider";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Svg, Circle, Text as SvgText } from "react-native-svg";

interface MentalHealthScoreWidgetProps {
  score: number;
  maxScore?: number;
  label?: string;
  onPress?: () => void;
  size?: number;
}

export const MentalHealthScoreWidget: React.FC<
  MentalHealthScoreWidgetProps
> = ({
  score = 80,
  maxScore = 100,
  label = "Mentally Stable",
  onPress,
  size = 160,
}) => {
  const { theme } = useTheme();

  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / maxScore) * circumference;
  const center = size / 2;

  // Color based on score
  const getScoreColor = () => {
    if (score >= 80) return theme.colors.green["60"]; // Good
    if (score >= 60) return theme.colors.yellow["60"]; // Moderate
    if (score >= 40) return theme.colors.orange["60"]; // Low
    return theme.colors.orange["70"]; // Critical
  };

  const scoreColor = getScoreColor();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      style={[styles.container, { width: size, height: size }]}
      accessible
      accessibilityLabel={`Mental health score: ${score} out of ${maxScore}. ${label}`}
      accessibilityRole="button"
    >
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={theme.colors.gray["20"]}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={scoreColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />

        {/* Score text */}
        <SvgText
          x={center}
          y={center - 8}
          fontSize={48}
          fontWeight="800"
          fill={theme.colors.text.primary}
          textAnchor="middle"
        >
          {score}
        </SvgText>
      </Svg>

      <Text style={[styles.label, { color: theme.colors.text.secondary }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    position: "absolute",
    bottom: 30,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default MentalHealthScoreWidget;
