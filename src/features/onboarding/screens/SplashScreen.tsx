/**
 * Splash Screen - Initial App Launch
 * Based on ui-designs/Dark-mode/Splash & Loading.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import { FreudDiamondLogo } from "@components/icons";
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, SafeAreaView, Animated } from "react-native";

const SplashScreenComponent = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    });

    animation.start();

    const timer = setTimeout(() => {
      navigation.replace("Welcome");
    }, 3000);

    return () => {
      clearTimeout(timer);
      fadeAnim.stopAnimation();
      animation.stop();
    };
  }, [fadeAnim, navigation]);

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

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
        <FreudDiamondLogo size={80} color={theme.colors.brown["50"]} />
        <Text style={styles.appName}>freud.ai</Text>
        <Text style={styles.tagline}>Your Mental Wellness Companion</Text>
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

export default SplashScreen;
