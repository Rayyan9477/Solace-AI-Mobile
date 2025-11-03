/**
 * Splash Screen - Initial App Launch
 * Based on ui-designs/Dark-mode/Splash & Loading.png
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@theme/ThemeProvider';

export const SplashScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    logo: {
      fontSize: 80,
      marginBottom: 20,
    },
    appName: {
      fontSize: 32,
      fontWeight: '800',
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    tagline: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text.secondary,
      textAlign: 'center',
      paddingHorizontal: 40,
    },
    bottomSection: {
      position: 'absolute',
      bottom: 60,
      alignItems: 'center',
    },
    version: {
      fontSize: 12,
      fontWeight: '600',
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
        <Text style={styles.logo}>🧠</Text>
        <Text style={styles.appName}>Solace AI</Text>
        <Text style={styles.tagline}>Your Mental Wellness Companion</Text>
      </Animated.View>

      <View style={styles.bottomSection}>
        <Text style={styles.version}>Version 2.1.0</Text>
        <Text style={styles.copyright}>© 2024 Solace AI Team</Text>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;
