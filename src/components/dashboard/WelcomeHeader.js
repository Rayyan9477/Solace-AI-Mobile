import React, { useRef, useEffect, memo, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from "react-native";

import { useTheme } from "../../shared/theme/UnifiedThemeProvider";
import FreudDesignSystem, {
  FreudColors,
  FreudSpacing,
  FreudTypography,
  FreudShadows,
  FreudBorderRadius,
} from "../../shared/theme/FreudDesignSystem";
import { OptimizedGradient } from "../ui/OptimizedGradients";

const WelcomeHeader = memo(({
  greeting,
  userName,
  onProfilePress,
  onEmergencyPress,
}) => {
  const { theme, isDarkMode, isReducedMotionEnabled } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    if (isReducedMotionEnabled) {
      // Skip animations for reduced motion
      fadeAnim.setValue(1);
      slideAnim.setValue(0);
      return;
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, isReducedMotionEnabled]);

  // Memoize time-based elements to prevent unnecessary recalculations
  const timeBasedEmoji = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "🌅";
    if (hour < 17) return "☀️";
    return "🌙";
  }, []);

  // Memoize callback handlers
  const handleProfilePress = useCallback(() => {
    onProfilePress?.();
  }, [onProfilePress]);

  const handleEmergencyPress = useCallback(() => {
    onEmergencyPress?.();
  }, [onEmergencyPress]);

  // Memoize styles based on theme
  const styles = useMemo(() => createStyles(isDarkMode), [isDarkMode]);

  return (
    <View style={styles.container}>
      <OptimizedGradient variant="subtle" style={styles.backgroundGradient}>
        <Animated.View
          style={[
            styles.mainContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.greetingContainer}>
            <Text style={styles.timeEmoji}>{timeBasedEmoji}</Text>
            <Text
              style={[
                styles.greeting,
                {
                  color: isDarkMode
                    ? FreudDesignSystem.themes.dark.colors.text.primary
                    : FreudDesignSystem.themes.light.colors.text.primary,
                },
              ]}
            >
              {greeting}
            </Text>
          </View>
          <Text
            style={[
              styles.userName,
              {
                color: isDarkMode
                  ? FreudDesignSystem.themes.dark.colors.text.primary
                  : FreudDesignSystem.themes.light.colors.text.primary,
              },
            ]}
          >
            {userName}
          </Text>
          <Text
            style={[
              styles.subtitle,
              {
                color: isDarkMode
                  ? FreudDesignSystem.themes.dark.colors.text.secondary
                  : FreudDesignSystem.themes.light.colors.text.secondary,
              },
            ]}
          >
            How are you feeling today?
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.headerActions,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            onPress={handleProfilePress}
            style={styles.avatarButton}
            testID="profile-button"
            accessibilityLabel="View Profile"
            accessibilityHint="Double tap to view your profile"
          >
            <Text style={styles.avatarText}>
              {userName.charAt(0).toUpperCase()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleEmergencyPress}
            style={styles.emergencyButton}
            testID="emergency-button"
            accessibilityLabel="Emergency Crisis Support"
            accessibilityHint="Double tap for immediate crisis support"
          >
            <Text style={styles.emergencyText}>🚨</Text>
          </TouchableOpacity>
        </Animated.View>
      </OptimizedGradient>
    </View>
  );
});

WelcomeHeader.displayName = 'WelcomeHeader';

const createStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      marginBottom: FreudSpacing[4],
      borderRadius: FreudBorderRadius.xl,
      overflow: "hidden",
      ...FreudShadows.sm,
    },
    backgroundGradient: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingHorizontal: FreudSpacing[4],
      paddingVertical: FreudSpacing[6],
    },
    mainContent: {
      flex: 1,
      paddingRight: FreudSpacing[4],
    },
    greetingContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: FreudSpacing[1],
    },
    timeEmoji: {
      fontSize: FreudTypography.sizes.lg,
      marginRight: FreudSpacing[2],
    },
    greeting: {
      fontSize: FreudTypography.sizes.base,
      fontWeight: FreudTypography.weights.medium,
      lineHeight: FreudTypography.sizes.base * FreudTypography.lineHeights.normal,
    },
    userName: {
      fontSize: FreudTypography.sizes["3xl"],
      fontWeight: FreudTypography.weights.bold,
      lineHeight: FreudTypography.sizes["3xl"] * FreudTypography.lineHeights.tight,
      marginBottom: FreudSpacing[2],
    },
    subtitle: {
      fontSize: FreudTypography.sizes.sm,
      fontWeight: FreudTypography.weights.normal,
      lineHeight: FreudTypography.sizes.sm * FreudTypography.lineHeights.relaxed,
      opacity: 0.8,
    },
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: FreudSpacing[2],
    },
    avatarButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: FreudColors.mindfulBrown[70],
      justifyContent: "center",
      alignItems: "center",
      ...FreudShadows.md,
    },
    avatarText: {
      fontSize: FreudTypography.sizes.xl,
      fontWeight: FreudTypography.weights.bold,
      color: "#FFFFFF",
    },
    emergencyButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: FreudColors.empathyOrange[60],
      justifyContent: "center",
      alignItems: "center",
      ...FreudShadows.md,
    },
    emergencyText: {
      fontSize: FreudTypography.sizes.xl,
    },
  });

WelcomeHeader.displayName = 'WelcomeHeader';

export default WelcomeHeader;
