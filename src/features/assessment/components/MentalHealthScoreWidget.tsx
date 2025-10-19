import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  AccessibilityInfo,
  Platform,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from "react-native-svg";

import { useTheme } from "@theme/ThemeProvider";
import { MentalHealthIcon } from "@shared/components/icons";
// Mock theme constants
const spacing = { sm: 8, md: 16, lg: 24 };
const borderRadius = { sm: 4, md: 8, lg: 12 };
const shadows = { sm: { elevation: 2 }, md: { elevation: 4 } };
const typography = { fontSize: { sm: 12, md: 16, lg: 20 } };

const { width } = Dimensions.get("window");

// Score range mapping for emotional states
const getScoreState = (score) => {
  if (score >= 90)
    return {
      state: "Excellent",
      emoji: "🌟",
      description: "Thriving mentally",
      color: "#00C896",
    };
  if (score >= 80)
    return {
      state: "Mentally Stable",
      emoji: "😌",
      description: "In good mental health",
      color: "#00A878",
    };
  if (score >= 70)
    return {
      state: "Good",
      emoji: "🙂",
      description: "Generally positive",
      color: "#28A745",
    };
  if (score >= 60)
    return {
      state: "Fair",
      emoji: "😐",
      description: "Room for improvement",
      color: "#FFC107",
    };
  if (score >= 50)
    return {
      state: "Concerning",
      emoji: "😟",
      description: "Needs attention",
      color: "#FF9800",
    };
  if (score >= 40)
    return {
      state: "At Risk",
      emoji: "😰",
      description: "Requires support",
      color: "#FF5722",
    };
  return {
    state: "Critical",
    emoji: "🆘",
    description: "Immediate help needed",
    color: "#F44336",
  };
};

const MentalHealthScoreWidget = ({
  score = 80,
  size = 160,
  variant = "default", // default, compact, minimal, detailed
  animated = true,
  onPress,
  showDescription = true,
  showTrend = false,
  trend = "stable", // up, down, stable
  testID = "mental-health-score-widget",
  accessibilityLabel,
  accessibilityHint,
  style,
  ...props
}) => {
  const { theme } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const [isPressed, setIsPressed] = useState(false);

  const scoreState = getScoreState(score);
  const circumference = 2 * Math.PI * (size / 2 - 10);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (circumference * score) / 100;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: score,
        duration: 2000,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(score);
    }
  }, [score, animated]);

  const handlePress = () => {
    if (onPress) {
      // Haptic feedback
      if (Platform.OS === "ios") {
        const { HapticFeedback } = require("expo-haptics");
        HapticFeedback?.impactAsync(HapticFeedback.ImpactFeedbackStyle.Light);
      }

      // Scale animation
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      onPress();
    }
  };

  const handlePressIn = () => setIsPressed(true);
  const handlePressOut = () => setIsPressed(false);

  // Accessibility label
  const defaultAccessibilityLabel =
    accessibilityLabel ||
    `Mental health score ${score} out of 100, ${scoreState.state}`;
  const defaultAccessibilityHint =
    accessibilityHint || "Double tap to view detailed mental health analytics";

  // Component variants
  const getVariantStyles = () => {
    switch (variant) {
      case "compact":
        return { size: size * 0.75, fontSize: typography.sizes.lg };
      case "minimal":
        return { size: size * 0.6, fontSize: typography.sizes.base };
      case "detailed":
        return { size: size * 1.25, fontSize: typography.sizes["2xl"] };
      default:
        return { size, fontSize: typography.sizes.xl };
    }
  };

  const variantStyles = getVariantStyles();

  const CircularProgress = () => (
    <Svg width={variantStyles.size} height={variantStyles.size}>
      <Defs>
        <SvgGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor={scoreState.color} stopOpacity="0.3" />
          <Stop offset="100%" stopColor={scoreState.color} stopOpacity="1" />
        </SvgGradient>
      </Defs>

      {/* Background circle */}
      <Circle
        cx={variantStyles.size / 2}
        cy={variantStyles.size / 2}
        r={variantStyles.size / 2 - 10}
        stroke={theme.colors.border.light}
        strokeWidth="8"
        fill="transparent"
      />

      {/* Progress circle */}
      <Circle
        cx={variantStyles.size / 2}
        cy={variantStyles.size / 2}
        r={variantStyles.size / 2 - 10}
        stroke="url(#progressGradient)"
        strokeWidth="8"
        fill="transparent"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${variantStyles.size / 2} ${variantStyles.size / 2})`}
      />
    </Svg>
  );

  const TrendIndicator = () => {
    if (!showTrend) return null;

    const trendIcons = {
      up: "chevron-up",
      down: "chevron-down",
      stable: "minus",
    };

    const trendColors = {
      up: theme.colors.therapeutic.nurturing[500],
      down: theme.colors.therapeutic.empathy[500],
      stable: theme.colors.therapeutic.calm[500],
    };

    return (
      <View style={styles.trendContainer}>
        <MentalHealthIcon
          name={trendIcons[trend]}
          size={16}
          color={trendColors[trend]}
        />
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleValue }],
          opacity: isPressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={!onPress}
        style={[
          styles.touchable,
          {
            width: variantStyles.size + spacing[8],
            height:
              variantStyles.size + (showDescription ? spacing[16] : spacing[8]),
          },
          shadows.md,
        ]}
        testID={testID}
        accessibilityLabel={defaultAccessibilityLabel}
        accessibilityHint={defaultAccessibilityHint}
        accessibilityRole="button"
        accessible
        {...props}
      >
        <View
          style={[
            styles.content,
            { width: variantStyles.size, height: variantStyles.size },
          ]}
        >
          <View style={styles.progressContainer}>
            <CircularProgress />

            {/* Score display */}
            <View style={styles.scoreContainer}>
              <Animated.Text
                style={[
                  styles.scoreText,
                  {
                    fontSize: variantStyles.fontSize,
                    color: scoreState.color,
                  },
                ]}
              >
                {Math.round(score)}
              </Animated.Text>

              {variant !== "minimal" && (
                <Text
                  style={[
                    styles.scoreLabel,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  Score
                </Text>
              )}
            </View>

            {showTrend && <TrendIndicator />}
          </View>

          {/* State description */}
          {showDescription && variant !== "minimal" && (
            <View style={styles.descriptionContainer}>
              {variant === "detailed" && (
                <Text style={[styles.emoji, { fontSize: typography.sizes.xl }]}>
                  {scoreState.emoji}
                </Text>
              )}

              <Text
                style={[
                  styles.stateText,
                  {
                    color: theme.colors.text.primary,
                    fontSize:
                      variant === "compact"
                        ? typography.sizes.sm
                        : typography.sizes.base,
                  },
                ]}
              >
                {scoreState.state}
              </Text>

              {variant === "detailed" && (
                <Text
                  style={[
                    styles.descriptionText,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  {scoreState.description}
                </Text>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  touchable: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.xl,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing[4],
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  progressContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreText: {
    fontWeight: typography.weights.bold,
    lineHeight: typography.lineHeights.tight,
  },
  scoreLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    marginTop: spacing[1],
  },
  trendContainer: {
    position: "absolute",
    top: -spacing[2],
    right: -spacing[2],
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.full,
    padding: spacing[1],
    ...shadows.sm,
  },
  descriptionContainer: {
    alignItems: "center",
    marginTop: spacing[4],
  },
  emoji: {
    marginBottom: spacing[1],
  },
  stateText: {
    fontWeight: typography.weights.semiBold,
    textAlign: "center",
  },
  descriptionText: {
    fontSize: typography.sizes.xs,
    textAlign: "center",
    marginTop: spacing[1],
    maxWidth: width * 0.6,
  },
});

// Variant exports for convenience
export const CompactMentalHealthScoreWidget = (props) => (
  <MentalHealthScoreWidget {...props} variant="compact" size={120} />
);

export const MinimalMentalHealthScoreWidget = (props) => (
  <MentalHealthScoreWidget
    {...props}
    variant="minimal"
    size={100}
    showDescription={false}
  />
);

export const DetailedMentalHealthScoreWidget = (props) => (
  <MentalHealthScoreWidget {...props} variant="detailed" size={200} showTrend />
);

export default MentalHealthScoreWidget;
