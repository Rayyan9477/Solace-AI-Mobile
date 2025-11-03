/**
 * Network Error Screen - Connection Problem Handling
 * Based on ui-designs/Dark-mode/🔒 Error & Other Utilities.png
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@theme/ThemeProvider';

export const NetworkErrorScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const handleRetry = () => {
    // Retry logic would go here
    console.log('Retrying connection...');
  };

  const handleGoOffline = () => {
    // Navigate to offline mode
    navigation.goBack();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    illustration: {
      fontSize: 120,
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: '800',
      color: theme.colors.text.primary,
      marginBottom: 12,
      textAlign: 'center',
    },
    message: {
      fontSize: 16,
      lineHeight: 24,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginBottom: 32,
      paddingHorizontal: 20,
    },
    retryButton: {
      backgroundColor: theme.colors.orange['60'],
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 48,
      marginBottom: 12,
    },
    retryButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    offlineButton: {
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 48,
    },
    offlineButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.text.primary,
    },
    tipCard: {
      backgroundColor: theme.colors.blue['20'],
      borderRadius: 16,
      padding: 16,
      marginTop: 32,
    },
    tipTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    tipText: {
      fontSize: 13,
      lineHeight: 18,
      color: theme.colors.text.secondary,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.illustration}>📡</Text>
      <Text style={styles.title}>No Internet Connection</Text>
      <Text style={styles.message}>
        Please check your network settings and try again. Some features may be available offline.
      </Text>

      <TouchableOpacity
        style={styles.retryButton}
        onPress={handleRetry}
        accessible
        accessibilityLabel="Retry connection"
        accessibilityRole="button"
      >
        <Text style={styles.retryButtonText}>Retry Connection</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.offlineButton}
        onPress={handleGoOffline}
        accessible
        accessibilityLabel="Continue offline"
        accessibilityRole="button"
      >
        <Text style={styles.offlineButtonText}>Continue Offline</Text>
      </TouchableOpacity>

      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>💡 Troubleshooting Tips</Text>
        <Text style={styles.tipText}>
          • Check if Wi-Fi or mobile data is enabled{'\n'}
          • Try toggling airplane mode on/off{'\n'}
          • Restart your device if the issue persists
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default NetworkErrorScreen;
