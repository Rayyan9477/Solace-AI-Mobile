/**
 * Splash Screen - Initial App Launch with 4-State Progression
 * Based on ui-designs/Dark-mode/Splash & Loading.png
 *
 * States:
 * 1. Loading - Initial app loading/initialization
 * 2. Authenticating - Checking user authentication status
 * 3. Syncing - Loading user data/syncing with backend
 * 4. Ready - Ready to navigate to appropriate screen
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import { FreudDiamondLogo } from "@components/icons";
import { ScreenErrorBoundary } from "@shared/components/ErrorBoundaryWrapper";
import { logger } from "@shared/utils/logger";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";

// Splash screen states
type SplashState = "loading" | "authenticating" | "syncing" | "ready";

interface StateConfig {
  message: string;
  icon: string;
  color: string;
  duration: number;
}

const STATE_CONFIGS: Record<SplashState, StateConfig> = {
  loading: {
    message: "Initializing...",
    icon: "🔄",
    color: "#98B068",
    duration: 800,
  },
  authenticating: {
    message: "Checking authentication...",
    icon: "🔐",
    color: "#ED7E1C",
    duration: 600,
  },
  syncing: {
    message: "Loading your data...",
    icon: "☁️",
    color: "#6B5FC8",
    duration: 800,
  },
  ready: {
    message: "Ready!",
    icon: "✨",
    color: "#98B068",
    duration: 500,
  },
};

const SplashScreenComponent = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  // Get auth state from Redux (set by AppInitializer via restoreAuthState)
  const authChecked = useSelector((state: any) => state.auth?.authChecked ?? false);
  const isAuthenticated = useSelector((state: any) => state.auth?.isAuthenticated ?? false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const stateMessageAnim = useRef(new Animated.Value(0)).current;

  // State
  const [currentState, setCurrentState] = useState<SplashState>("loading");
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Get current state config
  const stateConfig = STATE_CONFIGS[currentState];

  // Animate state message change
  const animateStateMessage = useCallback(() => {
    stateMessageAnim.setValue(0);
    Animated.timing(stateMessageAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [stateMessageAnim]);

  // State progression logic - visual animation
  useEffect(() => {
    let isMounted = true;

    const runStateProgression = async () => {
      try {
        // State 1: Loading - Initial fade in
        logger.debug("[SplashScreen] Starting state progression");
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();

        await new Promise(resolve => setTimeout(resolve, STATE_CONFIGS.loading.duration));
        if (!isMounted) return;

        // Update progress bar (25%)
        Animated.timing(progressAnim, {
          toValue: 0.25,
          duration: 300,
          useNativeDriver: false,
        }).start();

        // State 2: Authenticating (visual only - actual auth handled by Redux)
        setCurrentState("authenticating");
        animateStateMessage();

        await new Promise(resolve => setTimeout(resolve, STATE_CONFIGS.authenticating.duration));
        if (!isMounted) return;

        // Update progress bar (50%)
        Animated.timing(progressAnim, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: false,
        }).start();

        // State 3: Syncing
        setCurrentState("syncing");
        animateStateMessage();

        // Check onboarding status
        const onboardingComplete = await AsyncStorage.getItem("@onboarding_complete");
        if (isMounted) {
          setHasCompletedOnboarding(onboardingComplete === "true");
        }
        logger.debug("[SplashScreen] Onboarding status:", { complete: onboardingComplete === "true" });

        await new Promise(resolve => setTimeout(resolve, STATE_CONFIGS.syncing.duration));
        if (!isMounted) return;

        // Update progress bar (75%)
        Animated.timing(progressAnim, {
          toValue: 0.75,
          duration: 300,
          useNativeDriver: false,
        }).start();

        // State 4: Ready
        setCurrentState("ready");
        animateStateMessage();

        // Complete progress bar (100%)
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }).start();

        await new Promise(resolve => setTimeout(resolve, STATE_CONFIGS.ready.duration));
        if (!isMounted) return;

        setAnimationComplete(true);

      } catch (err) {
        logger.error("[SplashScreen] Error during initialization:", err);
        setError("Failed to initialize app. Please try again.");
        // Still mark animation complete after a delay even on error
        setTimeout(() => {
          if (isMounted) {
            setAnimationComplete(true);
          }
        }, 2000);
      }
    };

    runStateProgression();

    return () => {
      isMounted = false;
    };
  }, [fadeAnim, progressAnim, animateStateMessage]);

  // Navigate when both animation is complete and auth state is checked
  useEffect(() => {
    if (!animationComplete || !authChecked) return;

    // If authenticated, AppNavigator will switch to authenticated stack automatically
    // We just need to handle the unauthenticated cases here
    if (isAuthenticated) {
      // User is authenticated - AppNavigator will show MainTabs
      // No navigation needed as stack will change
      logger.info("[SplashScreen] User authenticated - AppNavigator will handle navigation");
      return;
    }

    // User is not authenticated - navigate within unauthenticated stack
    if (hasCompletedOnboarding === false || hasCompletedOnboarding === null) {
      // New user - show welcome/onboarding
      logger.info("[SplashScreen] Navigating to Welcome (new user)");
      navigation.replace("Welcome");
    } else {
      // Returning user but not authenticated - show login
      logger.info("[SplashScreen] Navigating to Login (returning user)");
      navigation.replace("Login");
    }
  }, [animationComplete, authChecked, isAuthenticated, hasCompletedOnboarding, navigation]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 40,
      gap: 20,
    },
    appName: {
      fontSize: 32,
      fontWeight: "800",
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    tagline: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text.secondary,
      textAlign: "center",
      paddingHorizontal: 40,
    },
    stateContainer: {
      alignItems: "center",
      marginTop: 40,
      minHeight: 80,
    },
    stateIcon: {
      fontSize: 24,
      marginBottom: 8,
    },
    stateMessage: {
      fontSize: 14,
      fontWeight: "500",
      color: theme.colors.text.secondary,
      marginBottom: 16,
    },
    progressContainer: {
      width: 200,
      height: 4,
      backgroundColor: theme.colors.gray?.["20"] || "rgba(255,255,255,0.1)",
      borderRadius: 2,
      overflow: "hidden",
    },
    progressBar: {
      height: "100%",
      borderRadius: 2,
    },
    stateIndicators: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 16,
      gap: 8,
    },
    stateDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    stateDotActive: {
      transform: [{ scale: 1.2 }],
    },
    errorContainer: {
      marginTop: 20,
      paddingHorizontal: 20,
    },
    errorText: {
      fontSize: 14,
      color: theme.colors.red?.["60"] || "#E57373",
      textAlign: "center",
    },
    bottomSection: {
      position: "absolute",
      bottom: 60,
      alignItems: "center",
    },
    version: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.tertiary,
      marginBottom: 8,
    },
    copyright: {
      fontSize: 11,
      color: theme.colors.text.tertiary,
    },
  });

  // Get state index for indicators
  const states: SplashState[] = ["loading", "authenticating", "syncing", "ready"];
  const currentStateIndex = states.indexOf(currentState);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
        <FreudDiamondLogo size={80} color={theme.colors.brown?.["50"] || stateConfig.color} />
        <Text style={styles.appName}>freud.ai</Text>
        <Text style={styles.tagline}>Your Mental Wellness Companion</Text>
      </Animated.View>

      {/* State progression indicator */}
      <Animated.View style={[styles.stateContainer, { opacity: fadeAnim }]}>
        <Animated.View style={{ opacity: stateMessageAnim }}>
          <Text style={styles.stateIcon}>{stateConfig.icon}</Text>
          <Text style={[styles.stateMessage, { color: stateConfig.color }]}>
            {stateConfig.message}
          </Text>
        </Animated.View>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                backgroundColor: stateConfig.color,
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>

        {/* State dots */}
        <View style={styles.stateIndicators}>
          {states.map((state, index) => (
            <View
              key={state}
              style={[
                styles.stateDot,
                {
                  backgroundColor:
                    index <= currentStateIndex
                      ? STATE_CONFIGS[state].color
                      : theme.colors.gray?.["40"] || "rgba(255,255,255,0.2)",
                },
                index === currentStateIndex && styles.stateDotActive,
              ]}
            />
          ))}
        </View>

        {/* Error message */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </Animated.View>

      <View style={styles.bottomSection}>
        <Text style={styles.version}>Version 2.1.0</Text>
        <Text style={styles.copyright}>© 2024 freud.ai</Text>
      </View>
    </SafeAreaView>
  );
};

export const SplashScreen = (props: any) => (
  <ScreenErrorBoundary screenName="Splash">
    <SplashScreenComponent {...props} />
  </ScreenErrorBoundary>
);

// LOW-NEW-001 FIX: Add displayName for debugging
SplashScreen.displayName = 'SplashScreen';
SplashScreenComponent.displayName = 'SplashScreenComponent';

export default SplashScreen;
