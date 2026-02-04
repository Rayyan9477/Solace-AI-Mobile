/**
 * TypingIndicator Component
 * @description Animated typing indicator for chat interfaces
 * @task Task 2.7.2: TypingIndicator Component
 * @phase Phase 3C: Refactored to use theme tokens
 *
 * Features:
 * - Animated bouncing dots
 * - Text with custom message
 * - Combined dots and text variant
 * - Avatar display
 * - Multiple size options
 * - Full accessibility support
 * - Dark mode first design
 */

import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  StyleSheet,
} from "react-native";

import type { TypingIndicatorProps } from "./TypingIndicator.types";
import { sizeSpecs, getTypingText } from "./TypingIndicator.types";
import { palette } from "../../../theme";

/**
 * Color tokens from theme
 */
const colors = {
  // Background colors
  background: palette.gray[700],
  dot: palette.olive[500],

  // Text colors
  text: palette.gray[400],

  // Avatar
  avatarBg: palette.olive[500],
  avatarText: palette.brown[900],
};

/**
 * Avatar Component
 */
interface AvatarProps {
  uri?: string;
  size: number;
  testID?: string;
}

function Avatar({ uri, size, testID }: AvatarProps) {
  return (
    <View testID={testID} style={[styles.avatar, { width: size, height: size }]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.avatarImage, { width: size, height: size, borderRadius: size / 2 }]}
        />
      ) : (
        <View
          style={[
            styles.avatarPlaceholder,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <Text style={[styles.avatarText, { fontSize: size * 0.5 }]}>🤖</Text>
        </View>
      )}
    </View>
  );
}

/**
 * Animated Dot Component
 */
interface AnimatedDotProps {
  size: number;
  delay: number;
  duration: number;
  testID?: string;
}

function AnimatedDot({ size, delay, duration, testID }: AnimatedDotProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [animatedValue, delay, duration]);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -size / 2],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.4, 1, 0.4],
  });

  return (
    <Animated.View
      testID={testID}
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    />
  );
}

/**
 * Dots Container Component
 */
interface DotsContainerProps {
  dotCount: number;
  dotSize: number;
  spacing: number;
  duration: number;
  testID?: string;
}

function DotsContainer({
  dotCount,
  dotSize,
  spacing,
  duration,
  testID,
}: DotsContainerProps) {
  const dots = Array.from({ length: dotCount }, (_, index) => index);
  const delayPerDot = duration / dotCount;

  return (
    <View testID={testID} style={[styles.dotsContainer, { gap: spacing }]}>
      {dots.map((index) => (
        <AnimatedDot
          key={index}
          size={dotSize}
          delay={index * delayPerDot}
          duration={duration}
          testID={`${testID?.replace("-dots", "")}-dot-${index}`}
        />
      ))}
    </View>
  );
}

/**
 * TypingIndicator Component
 *
 * @example
 * ```tsx
 * // Basic usage
 * <TypingIndicator isTyping />
 *
 * // With custom text
 * <TypingIndicator
 *   isTyping
 *   text="Dr. Freud is thinking..."
 *   showAvatar
 * />
 *
 * // Dots only
 * <TypingIndicator
 *   isTyping
 *   variant="dots"
 *   size="lg"
 * />
 * ```
 */
export function TypingIndicator({
  isTyping = true,
  variant = "combined",
  size = "md",
  text,
  typingUserName,
  avatar,
  showAvatar = true,
  animationDuration = 600,
  dotCount = 3,
  testID,
  accessibilityLabel,
  style,
}: TypingIndicatorProps): React.ReactElement | null {
  // Don't render if not typing
  if (!isTyping) {
    return null;
  }

  const specs = sizeSpecs[size];
  const displayText = text || getTypingText(typingUserName);

  const showDots = variant === "dots" || variant === "combined";
  const showText = variant === "text" || variant === "combined";

  return (
    <View
      testID={testID}
      accessibilityLabel={accessibilityLabel || "Typing indicator"}
      accessibilityLiveRegion="polite"
      accessibilityRole="text"
      style={[styles.container, style]}
    >
      {/* Avatar */}
      {showAvatar && (
        <Avatar
          uri={avatar}
          size={specs.avatarSize}
          testID={`${testID}-avatar`}
        />
      )}

      {/* Content */}
      <View style={styles.contentContainer}>
        <View style={styles.bubbleContainer}>
          {/* Text */}
          {showText && (
            <Text
              testID={`${testID}-text`}
              style={[styles.text, { fontSize: specs.fontSize }]}
            >
              {displayText}
            </Text>
          )}

          {/* Dots */}
          {showDots && (
            <DotsContainer
              dotCount={dotCount}
              dotSize={specs.dotSize}
              spacing={specs.spacing}
              duration={animationDuration}
              testID={`${testID}-dots`}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    marginRight: 8,
  },
  avatarImage: {
    backgroundColor: colors.avatarBg,
  },
  avatarPlaceholder: {
    alignItems: "center",
    backgroundColor: colors.avatarBg,
    justifyContent: "center",
  },
  avatarText: {
    color: colors.avatarText,
  },
  bubbleContainer: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderBottomLeftRadius: 4,
    borderRadius: 16,
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  container: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    marginHorizontal: 8,
    marginVertical: 8,
  },
  contentContainer: {
    flexShrink: 1,
  },
  dot: {
    backgroundColor: colors.dot,
  },
  dotsContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 8,
  },
  text: {
    color: colors.text,
  },
});

export default TypingIndicator;
