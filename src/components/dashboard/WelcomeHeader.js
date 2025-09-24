import React, { useRef, useEffect, memo, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from "react-native";
import { Card, Surface, Avatar, IconButton } from "react-native-paper";
import { motion } from "framer-motion/native";

import FreudDesignSystem, {
  FreudColors,
  FreudSpacing,
  FreudTypography,
  FreudShadows,
  FreudBorderRadius,
} from "../../shared/theme/FreudDesignSystem";
import { useTheme } from "../../shared/theme/UnifiedThemeProvider";
import { OptimizedGradient } from "../ui/OptimizedGradients";

const AnimatedCard = motion(Card);
const AnimatedSurface = motion(Surface);

const WelcomeHeader = memo(
  ({ greeting, userName, onProfilePress, onEmergencyPress }) => {
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
      <AnimatedCard
        mode="contained"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          delay: 0.2
        }}
        style={styles.container}
      >
        <Surface
          mode="flat"
          elevation={3}
          style={styles.surface}
        >
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
              <Avatar.Text
                size={52}
                label={userName.charAt(0).toUpperCase()}
                style={styles.avatarButton}
                labelStyle={styles.avatarText}
                onPress={handleProfilePress}
              />

              <IconButton
                icon="alert-circle"
                iconColor="#FFFFFF"
                size={28}
                mode="contained"
                containerColor={FreudColors.empathyOrange[60]}
                style={styles.emergencyButton}
                onPress={handleEmergencyPress}
                testID="emergency-button"
                accessibilityLabel="Emergency Crisis Support"
              />
            </Animated.View>
          </OptimizedGradient>
        </Surface>
      </AnimatedCard>
    );
  },
);

WelcomeHeader.displayName = "WelcomeHeader";

const createStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      marginBottom: FreudSpacing[4],
      marginHorizontal: FreudSpacing[3],
    },
    surface: {
      borderRadius: 24,
      overflow: "hidden",
    },
    backgroundGradient: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingHorizontal: FreudSpacing[5],
      paddingVertical: FreudSpacing[6],
    },
    mainContent: {
      flex: 1,
      paddingRight: FreudSpacing[4],
    },
    greetingContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: FreudSpacing[2],
    },
    timeEmoji: {
      fontSize: FreudTypography.sizes.xl,
      marginRight: FreudSpacing[3],
    },
    greeting: {
      fontSize: FreudTypography.sizes.lg,
      fontWeight: FreudTypography.weights.medium,
      lineHeight:
        FreudTypography.sizes.lg * FreudTypography.lineHeights.normal,
    },
    userName: {
      fontSize: FreudTypography.sizes["4xl"],
      fontWeight: FreudTypography.weights.bold,
      lineHeight:
        FreudTypography.sizes["4xl"] * FreudTypography.lineHeights.tight,
      marginBottom: FreudSpacing[3],
    },
    subtitle: {
      fontSize: FreudTypography.sizes.base,
      fontWeight: FreudTypography.weights.normal,
      lineHeight:
        FreudTypography.sizes.base * FreudTypography.lineHeights.relaxed,
      opacity: 0.8,
    },
    headerActions: {
      flexDirection: "column",
      alignItems: "center",
      gap: FreudSpacing[3],
    },
    avatarButton: {
      backgroundColor: FreudColors.mindfulBrown[70],
    },
    avatarText: {
      fontSize: FreudTypography.sizes.xl,
      fontWeight: FreudTypography.weights.bold,
      color: "#FFFFFF",
    },
    emergencyButton: {
      borderRadius: 28,
    },
  });

WelcomeHeader.displayName = "WelcomeHeader";

export default WelcomeHeader;
