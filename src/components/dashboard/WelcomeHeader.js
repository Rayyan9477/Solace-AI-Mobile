import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from "react-native";

import { useTheme } from "../../shared/theme/UnifiedThemeProvider";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from "../../shared/theme/theme";
import SimpleCard from "../ui/SimpleCard";

const WelcomeHeader = ({
  greeting,
  userName,
  onProfilePress,
  onEmergencyPress,
}) => {
  const { theme, isReducedMotionEnabled } = useTheme();
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
    <SimpleCard style={styles.container}>
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
          onPress={onProfilePress}
          style={styles.avatarButton}
          testID="profile-button"
          accessibilityLabel="View Profile"
          accessibilityHint="Double tap to view your profile"
        >
          <Text
            style={[styles.avatarText, { color: theme.colors.text.inverse }]}
          >
            {userName.charAt(0).toUpperCase()}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onEmergencyPress}
          style={styles.emergencyButton}
          testID="emergency-button"
          accessibilityLabel="Emergency Crisis Support"
          accessibilityHint="Double tap for immediate crisis support"
        >
          <Text style={styles.emergencyText}>🚨</Text>
        </TouchableOpacity>
      </Animated.View>
    </SimpleCard>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[6],
      marginHorizontal: spacing[4],
      marginBottom: spacing[4],
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
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.primary[500],
      justifyContent: "center",
      alignItems: "center",
      ...shadows.md,
    },
    avatarText: {
      fontSize: typography.sizes.xl,
      fontWeight: typography.weights.bold,
    },
    emergencyButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.error[500],
      justifyContent: "center",
      alignItems: "center",
      ...shadows.md,
    },
    emergencyText: {
      fontSize: typography.sizes.xl,
    },
  });

export default WelcomeHeader;
