import { useTheme } from "@theme/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";

import FreudDesignSystem, {
  FreudColors,
  FreudSpacing,
  FreudTypography,
  FreudShadows,
} from "../../shared/theme/FreudDesignSystem";
import { MentalHealthIcon } from "../icons";

const { width: screenWidth } = Dimensions.get("window");

/**
 * FloatingActionButton - A therapeutic-styled floating action button
 *
 * Features:
 * - Therapeutic gradient backgrounds
 * - Gentle pulse animation
 * - Accessibility-first design
 * - Mental health-focused styling
 * - Customizable positioning and content
 */
const FloatingActionButton = ({
  onPress,
  icon = "Therapy",
  label = "Dr. Freud",
  size = 64,
  variant = "primary", // 'primary', 'secondary', 'accent'
  position = "bottomRight", // 'bottomRight', 'bottomLeft', 'bottomCenter'
  customGradientColors,
  disabled = false,
  testID = "floating-action-button",
  accessibilityLabel = "Start AI Therapy Session",
  accessibilityHint = "Double tap to begin a private conversation with your AI therapist",
  showPulse = true,
  style,
  ...props
}) => {
  const { theme, isDarkMode } = useTheme();

  // Animation values
  const scaleValue = useRef(new Animated.Value(1)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  // Get gradient colors based on variant
  const getGradientColors = () => {
    if (customGradientColors) return customGradientColors;

    switch (variant) {
      case "secondary":
        return [FreudColors.serenityGreen[60], FreudColors.serenityGreen[80]];
      case "accent":
        return [FreudColors.kindPurple[60], FreudColors.kindPurple[80]];
      default:
        return [FreudColors.mindfulBrown[70], FreudColors.mindfulBrown[90]];
    }
  };

  // Get position styles
  const getPositionStyle = () => {
    const baseStyle = {
      position: "absolute",
      zIndex: 1000,
    };

    switch (position) {
      case "bottomLeft":
        return {
          ...baseStyle,
          bottom: FreudSpacing[6],
          left: FreudSpacing[6],
        };
      case "bottomCenter":
        return {
          ...baseStyle,
          bottom: FreudSpacing[6],
          left: (screenWidth - size) / 2,
        };
      default: // bottomRight
        return {
          ...baseStyle,
          bottom: FreudSpacing[6],
          right: FreudSpacing[6],
        };
    }
  };

  // Setup animations
  // HIGH-015 FIX: Store animation references for proper cleanup
  const entranceAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const pulseAnimRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    // HIGH-015 FIX: Stop any existing entrance animation before starting new one
    if (entranceAnimRef.current) {
      entranceAnimRef.current.stop();
    }

    // Entrance animation
    entranceAnimRef.current = Animated.timing(opacityValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    });
    entranceAnimRef.current.start();

    // HIGH-015 FIX: Cleanup entrance animation on unmount
    return () => {
      if (entranceAnimRef.current) {
        entranceAnimRef.current.stop();
        entranceAnimRef.current = null;
      }
    };
  }, []); // Run once on mount

  useEffect(() => {
    // HIGH-015 FIX: Stop existing pulse animation before creating new one
    if (pulseAnimRef.current) {
      pulseAnimRef.current.stop();
      pulseAnimRef.current = null;
      // Reset pulse value to avoid stuck state
      pulseValue.setValue(1);
    }

    // Pulse animation (if enabled)
    if (showPulse && !disabled) {
      pulseAnimRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.05,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      );
      pulseAnimRef.current.start();
    }

    // HIGH-015 FIX: Proper cleanup with animation reference
    return () => {
      if (pulseAnimRef.current) {
        pulseAnimRef.current.stop();
        pulseAnimRef.current = null;
      }
      pulseValue.setValue(1); // Reset to initial state
    };
  }, [showPulse, disabled, pulseValue]);

  // Handle press interactions
  const handlePressIn = () => {
    if (disabled) return;

    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;

    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();
  };

  const handlePress = () => {
    if (disabled) return;
    onPress?.();
  };

  return (
    <Animated.View
      style={[
        getPositionStyle(),
        {
          opacity: opacityValue,
          transform: [{ scale: scaleValue }, { scale: pulseValue }],
        },
        disabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.9}
        style={[
          styles.button,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole="button"
      >
        <LinearGradient
          colors={getGradientColors()}
          style={[styles.gradient, { borderRadius: size / 2 }]}
          start={[0, 0]}
          end={[1, 1]}
        >
          <View style={styles.content}>
            <MentalHealthIcon name={icon} size={size * 0.4} color="#FFFFFF" />
            {label && (
              <Text style={[styles.label, { fontSize: size * 0.15 }]}>
                {label}
              </Text>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// LOW-004 & LOW-005 FIX: Add TypeScript types for FAB variant props
interface FABVariantProps {
  onPress?: () => void;
  position?: "bottomRight" | "bottomLeft" | "bottomCenter";
  size?: number;
  disabled?: boolean;
  showPulse?: boolean;
  testID?: string;
  style?: object;
}

// Specialized FAB variants for common mental health actions
export const TherapyFAB: React.FC<FABVariantProps> = (props) => (
  <FloatingActionButton
    icon="Therapy"
    label="Dr. Freud"
    variant="primary"
    accessibilityLabel="Start AI Therapy Session"
    accessibilityHint="Begin a conversation with your AI therapist"
    {...props}
  />
);
TherapyFAB.displayName = "TherapyFAB";

export const MoodTrackerFAB: React.FC<FABVariantProps> = (props) => (
  <FloatingActionButton
    icon="Heart"
    label="Mood"
    variant="secondary"
    accessibilityLabel="Quick Mood Check"
    accessibilityHint="Log your current mood quickly"
    {...props}
  />
);
MoodTrackerFAB.displayName = "MoodTrackerFAB";

export const MeditationFAB: React.FC<FABVariantProps> = (props) => (
  <FloatingActionButton
    icon="Mindfulness"
    label="Breathe"
    variant="accent"
    accessibilityLabel="Start Meditation"
    accessibilityHint="Begin a guided breathing session"
    {...props}
  />
);
MeditationFAB.displayName = "MeditationFAB";

export const JournalFAB: React.FC<FABVariantProps> = (props) => (
  <FloatingActionButton
    icon="Journal"
    label="Journal"
    variant="secondary"
    accessibilityLabel="Open Journal"
    accessibilityHint="Write in your personal journal"
    {...props}
  />
);
JournalFAB.displayName = "JournalFAB";

const styles = StyleSheet.create({
  button: {
    ...FreudShadows.lg,
    elevation: 8,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontWeight: FreudTypography.weights.bold,
    color: "#FFFFFF",
    marginTop: FreudSpacing[1],
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default FloatingActionButton;
