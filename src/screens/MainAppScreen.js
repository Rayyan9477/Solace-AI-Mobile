import React, { useEffect } from 'react';
import AppNavigator from '../navigation/AppNavigator';
import { View, AccessibilityInfo } from 'react-native';

// Minimal wrapper used only in tests to provide a stable import path
// AppNavigator itself is rendered inside a NavigationContainer by tests' wrappers
const MainAppScreen = () => {
  useEffect(() => {
    const p = AccessibilityInfo?.isScreenReaderEnabled?.();
    if (p != null && typeof p.then === 'function') {
      p.catch(() => {});
    }
  }, []);

  return (
    <View testID="main-app-screen" style={{ flex: 1 }} accessible accessibilityRole="summary" accessibilityLabel="Main Application Screen">
      {/* Use lightweight AppNavigator to avoid NavigationContainer conflicts under test mocks */}
      <AppNavigator />
    </View>
  );
};

export default MainAppScreen;
