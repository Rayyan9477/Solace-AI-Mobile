/**
 * Solace AI Mobile - Minimal Working App with Proper Web Registration
 * Fixed React Native web rendering initialization
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { registerRootComponent } from 'expo';

const App = () => {
  console.log('✅ App component rendering');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Solace AI Mobile</Text>
        <Text style={styles.subtitle}>Mental Health Support App</Text>
        <Text style={styles.status}>✅ App is running successfully</Text>
        <Text style={styles.version}>Version: 1.0.0</Text>
        <Text style={styles.debug}>React Native Web: Working</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  status: {
    fontSize: 16,
    color: '#059669',
    textAlign: 'center',
    marginBottom: 10,
  },
  version: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 10,
  },
  debug: {
    fontSize: 12,
    color: '#3b82f6',
    textAlign: 'center',
  },
});

// Register the main component with Expo
registerRootComponent(App);

export default App;