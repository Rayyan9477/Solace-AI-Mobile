/**
 * Loading Screen - Data Loading Progress
 * Based on ui-designs/Dark-mode/Splash & Loading.png
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@theme/ThemeProvider';

interface LoadingScreenProps {
  message?: string;
  showProgress?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading...',
  showProgress = true,
}) => {
  const { theme } = useTheme();
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('Initializing...');

  const loadingMessages = [
    'Initializing...',
    'Loading your data...',
    'Setting up your profile...',
    'Almost there...',
  ];

  useEffect(() => {
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setCurrentMessage(loadingMessages[messageIndex]);
    }, 1500);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(messageInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [loadingMessages]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    iconContainer: {
      marginBottom: 32,
    },
    icon: {
      fontSize: 64,
    },
    loadingText: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: 8,
      textAlign: 'center',
    },
    messageText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text.secondary,
      marginBottom: 32,
      textAlign: 'center',
    },
    progressContainer: {
      width: '100%',
      height: 6,
      backgroundColor: theme.colors.brown['20'],
      borderRadius: 3,
      overflow: 'hidden',
      marginBottom: 16,
    },
    progressBar: {
      height: '100%',
      backgroundColor: theme.colors.purple['60'],
      borderRadius: 3,
    },
    progressText: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.colors.purple['60'],
      textAlign: 'center',
    },
    spinner: {
      marginTop: 20,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>⏳</Text>
      </View>

      <Text style={styles.loadingText}>{message}</Text>
      <Text style={styles.messageText}>{currentMessage}</Text>

      {showProgress && (
        <>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </>
      )}

      <ActivityIndicator
        size="large"
        color={theme.colors.purple['60']}
        style={styles.spinner}
      />
    </SafeAreaView>
  );
};

export default LoadingScreen;
