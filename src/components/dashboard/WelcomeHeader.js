import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from "react-native";

import { useTheme } from "../../shared/theme/ThemeContext";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from "../../shared/theme/theme";

const WelcomeHeader = ({
  greeting,
  userName,
  onProfilePress,
  onEmergencyPress,
}) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
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
  }, [fadeAnim, slideAnim]);

  const getTimeBasedEmoji = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "🌅";
    if (hour < 17) return "☀️";
    return "🌙";
  };

  const getTimeBasedGradient = () => {
    const hour = new Date().getHours();
    if (hour < 12)
      return [
        theme.colors.therapeutic.energizing[100],
        theme.colors.therapeutic.calming[100],
      ];
    if (hour < 17)
      return [
        theme.colors.therapeutic.calming[100],
        theme.colors.therapeutic.peaceful[100],
      ];
    return [
      theme.colors.therapeutic.peaceful[200],
      theme.colors.therapeutic.grounding[100],
    ];
  };

  return (
    <LinearGradient
      colors={getTimeBasedGradient()}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
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
          <Text style={styles.timeEmoji}>{getTimeBasedEmoji()}</Text>
          <Text style={[styles.greeting, { color: theme.colors.text.primary }]}>
            {greeting}
          </Text>
        </View>
        <Text style={[styles.userName, { color: theme.colors.text.primary }]}>
          {userName}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
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
          style={[styles.avatarButton, shadows.sm]}
          onPress={onProfilePress}
          activeOpacity={0.8}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Profile"
          accessibilityHint="Double tap to view your profile"
        >
          <LinearGradient
            colors={[theme.colors.primary[400], theme.colors.primary[600]]}
            style={styles.avatarGradient}
          >
            <Text
              style={[styles.avatarText, { color: theme.colors.text.inverse }]}
            >
              {userName.charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.emergencyButton, shadows.sm]}
          onPress={onEmergencyPress}
          activeOpacity={0.8}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Emergency Help"
          accessibilityHint="Double tap to access emergency support"
        >
          <LinearGradient
            colors={[theme.colors.error[400], theme.colors.error[600]]}
            style={styles.emergencyGradient}
          >
            <Text style={styles.emergencyText}>🚨</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: spacing[5],
    paddingTop: spacing[12],
    paddingBottom: spacing[6],
  },
  mainContent: {
    flex: 1,
    paddingRight: spacing[4],
  },
  greetingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing[1],
  },
  timeEmoji: {
    fontSize: typography.sizes.lg,
    marginRight: spacing[2],
  },
  greeting: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    lineHeight: typography.lineHeights.base,
  },
  userName: {
    fontSize: typography.sizes["3xl"],
    fontWeight: typography.weights.bold,
    lineHeight: typography.lineHeights["3xl"],
    marginBottom: spacing[2],
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.sm,
    opacity: 0.8,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  avatarButton: {
    borderRadius: borderRadius.full,
    overflow: "hidden",
  },
  avatarGradient: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
  },
  emergencyButton: {
    borderRadius: borderRadius.full,
    overflow: "hidden",
  },
  emergencyGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  emergencyText: {
    fontSize: typography.sizes.sm,
  },
});

export default WelcomeHeader;
