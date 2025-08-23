import { WebSafeLinearGradient as LinearGradient } from "../common/WebSafeLinearGradient";
import AdvancedShadersContainer from "../advanced/AdvancedShadersContainer";
import ModernButton from "../modern/ModernButton";
import { modernDarkColors, modernTypography, modernSpacing } from "../../shared/theme/darkTheme";
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
    <AdvancedShadersContainer
      variant="aurora"
      intensity={0.4}
      animated={true}
      interactive={false}
      glowEffect={true}
      style={styles.containerWrapper}
    >
      <LinearGradient
        colors={[
          modernDarkColors.background.primary + 'E6',
          modernDarkColors.background.secondary + 'CC',
          modernDarkColors.background.tertiary + 'B3',
        ]}
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
        <ModernButton
          title={userName.charAt(0).toUpperCase()}
          variant="glass"
          size="medium"
          animated={true}
          glowEffect={false}
          iconPosition="only"
          onPress={onProfilePress}
          style={styles.avatarButton}
          testID="profile-button"
        />

        <ModernButton
          title="🚨"
          variant="void"
          size="large"
          animated={true}
          glowEffect={true}
          shaderEffect={true}
          iconPosition="only"
          onPress={onEmergencyPress}
          style={styles.emergencyButton}
          testID="emergency-button"
          accessibilityLabel="Emergency Crisis Support"
          accessibilityHint="Double tap for immediate crisis support"
        />
      </Animated.View>
      </LinearGradient>
    </AdvancedShadersContainer>
  );
};

const createStyles = (theme) => StyleSheet.create({
  containerWrapper: {
    marginHorizontal: modernSpacing[2],
    marginVertical: modernSpacing[2],
  },
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: modernSpacing[6],
    paddingTop: modernSpacing[12],
    paddingBottom: modernSpacing[6],
    borderRadius: borderRadius.lg,
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
    fontSize: modernTypography.sizes.base,
    fontWeight: modernTypography.weights.medium,
    lineHeight: modernTypography.lineHeights.base,
    fontFamily: modernTypography.fontFamily.sans,
  },
  userName: {
    fontSize: modernTypography.sizes['3xl'],
    fontWeight: modernTypography.weights.black,
    lineHeight: modernTypography.lineHeights['3xl'],
    letterSpacing: modernTypography.letterSpacing.tight,
    marginBottom: modernSpacing[2],
    fontFamily: modernTypography.fontFamily.display,
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
  },
  emergencyButton: {
    width: 56,
    height: 56,
  },
});

export default WelcomeHeader;
