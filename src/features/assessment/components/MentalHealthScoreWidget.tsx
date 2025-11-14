import { MentalHealthIcon } from "@shared/components/icons";
import { useTheme } from "@theme/ThemeProvider";
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
  ViewStyle,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from "react-native-svg";
import { spacing, borderRadius, elevation } from "@shared/theme/spacing";
import { typography } from "@shared/theme/typography";

interface MentalHealthScoreWidgetProps {
  score?: number;
  size?: number;
  variant?: "default" | "compact" | "minimal" | "detailed";
  animated?: boolean;
  onPress?: () => void;
  showDescription?: boolean;
  showTrend?: boolean;
  trend?: "up" | "down" | "stable";
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: ViewStyle;
}

const { width } = Dimensions.get("window");

// Score range mapping for emotional states
const getScoreState = (score: number) => {
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

const MentalHealthScoreWidget: React.FC<MentalHealthScoreWidgetProps> = ({
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
        return { size: size * 0.75, fontSize: typography.h3.fontSize };
      case "minimal":
        return { size: size * 0.6, fontSize: typography.body.fontSize };
      case "detailed":
        return { size: size * 1.25, fontSize: typography.h1.fontSize };
      default:
        return { size, fontSize: typography.h2.fontSize };
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
      up: "ChevronUp",
      down: "ChevronDown",
      stable: "ArrowForward", // Using ArrowForward as a substitute for minus/stable
    } as const;

    const trendColors = {
      up: theme.colors.green[60],
      down: theme.colors.orange[60],
      stable: theme.colors.brown[60],
    };

    return (
      <View style={styles.trendContainer}>
        <MentalHealthIcon
          name={trendIcons[trend]}
          size={16}
          color={trendColors[trend]}
          style={{}}
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
            width: variantStyles.size + spacing.sm,
            height:
              variantStyles.size + (showDescription ? spacing.md : spacing.sm),
          },
          elevation.md,
        ]}
        testID={testID}
        accessibilityLabel={defaultAccessibilityLabel}
        accessibilityHint={defaultAccessibilityHint}
        accessibilityRole="button"
        accessible
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
                <Text style={[styles.emoji, { fontSize: typography.h2.fontSize }]}>
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
                        ? typography.bodySmall.fontSize
                        : typography.body.fontSize,
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
    padding: spacing.xs,
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
    fontWeight: "700",
    lineHeight: typography.h1.lineHeight,
  },
  scoreLabel: {
    fontSize: typography.caption.fontSize,
    fontWeight: "500",
    marginTop: spacing.xs / 2,
  },
  trendContainer: {
    position: "absolute",
    top: -spacing.xs / 2,
    right: -spacing.xs / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.full,
    padding: spacing.xs / 2,
    ...elevation.sm,
  },
  descriptionContainer: {
    alignItems: "center",
    marginTop: spacing.xs,
  },
  emoji: {
    marginBottom: spacing.xs / 2,
  },
  stateText: {
    fontWeight: "600",
    textAlign: "center",
  },
  descriptionText: {
    fontSize: typography.caption.fontSize,
    textAlign: "center",
    marginTop: spacing.xs / 2,
    maxWidth: width * 0.6,
  },
});

// Variant exports for convenience
export const CompactMentalHealthScoreWidget: React.FC<Omit<MentalHealthScoreWidgetProps, 'variant' | 'size'>> = (props) => (
  <MentalHealthScoreWidget {...props} variant="compact" size={120} />
);

export const MinimalMentalHealthScoreWidget: React.FC<Omit<MentalHealthScoreWidgetProps, 'variant' | 'size' | 'showDescription'>> = (props) => (
  <MentalHealthScoreWidget
    {...props}
    variant="minimal"
    size={100}
    showDescription={false}
  />
);

export const DetailedMentalHealthScoreWidget: React.FC<Omit<MentalHealthScoreWidgetProps, 'variant' | 'size' | 'showTrend'>> = (props) => (
  <MentalHealthScoreWidget {...props} variant="detailed" size={200} showTrend />
);

export default MentalHealthScoreWidget;
