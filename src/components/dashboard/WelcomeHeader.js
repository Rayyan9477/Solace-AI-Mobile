import { WebSafeLinearGradient as LinearGradient } from "../common/WebSafeLinearGradient";
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

  const styles = createStyles(theme);

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
          style={[styles.avatarButton, theme.shadows.sm]}
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
          style={[styles.emergencyButton, theme.shadows.sm]}
          onPress={onEmergencyPress}
          activeOpacity={0.8}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Emergency Crisis Support"
          accessibilityHint="Double tap for immediate crisis support and emergency resources"
          accessibilityTraits={['button', 'startsMedia']}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          testID="emergency-button"
        >
          <LinearGradient
            colors={[theme.colors.error[400], theme.colors.error[600]]}
            style={styles.emergencyGradient}
          >
            <Text 
              style={styles.emergencyText}
              accessibilityElementsHidden={true}
              importantForAccessibility="no"
            >🚨</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: theme.theme.spacing[5],
    paddingTop: theme.spacing[12],
    paddingBottom: theme.spacing[6],
  },
  mainContent: {
    flex: 1,
    paddingRight: theme.spacing[4],
  },
  greetingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing[1],
  },
  timeEmoji: {
    fontSize: theme.typography.sizes.lg,
    marginRight: theme.spacing[2],
  },
  greeting: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium,
    lineHeight: theme.typography.lineHeights.base,
  },
  userName: {
    fontSize: theme.typography.sizes["3xl"],
    fontWeight: theme.typography.weights.bold,
    lineHeight: theme.typography.lineHeights["3xl"],
    marginBottom: theme.spacing[2],
  },
  subtitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.sm,
    opacity: 0.8,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing[2],
  },
  avatarButton: {
    borderRadius: theme.borderRadius.full,
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
    fontSize: theme.typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
  },
  emergencyButton: {
    borderRadius: theme.borderRadius.full,
    overflow: "hidden",
  },
  emergencyGradient: {
    minWidth: 56, // MENTAL_HEALTH_ACCESSIBILITY_CONSTANTS.CRISIS_BUTTON_MIN_SIZE
    minHeight: 56,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  emergencyText: {
    fontSize: theme.typography.sizes.sm,
  },
});

export default WelcomeHeader;
