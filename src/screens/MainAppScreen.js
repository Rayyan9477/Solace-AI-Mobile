import React from 'react';
import AppNavigator from '../app/navigation/AppNavigator';
import { View } from 'react-native';

// Minimal wrapper used only in tests to provide a stable import path
// AppNavigator itself is rendered inside a NavigationContainer by tests' wrappers
const MainAppScreen = () => {
  return (
    <View testID="main-app-screen" style={{ flex: 1 }}>
      <AppNavigator />
    </View>
  );
};

export default MainAppScreen;
