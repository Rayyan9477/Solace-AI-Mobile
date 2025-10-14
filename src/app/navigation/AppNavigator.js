/**
 * AppNavigator - Main navigation configuration
 * Updated to work with feature-based architecture
 */

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector as useReduxSelector } from "react-redux";

// Feature-based screen imports
import LoginScreen from "@features/auth/LoginScreen";
import SignupScreen from "@features/auth/SignupScreen";
import DashboardScreen from "@features/dashboard/DashboardScreen";
import ChatScreen from "@features/chat/ChatScreen";
import MoodScreen from "@features/mood/MoodScreen";
import EnhancedMoodTrackerScreen from "@features/mood-tracking/EnhancedMoodTrackerScreen";
import OnboardingScreen from "@features/onboarding/screens/OnboardingScreen";
import WelcomeScreen from "@features/onboarding/screens/WelcomeScreen";

// Theme import
import { useTheme } from "@theme/ThemeProvider";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Fallback screen for missing screens
 */
const PlaceholderScreen = ({ route }) => {
  const { theme } = useTheme();
  const screenName = route?.params?.name || route?.name || "Screen";
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background?.primary || '#F7FAFC' }]}>
      <Text style={[styles.title, { color: theme.colors.text?.primary || '#2D3748' }]}>
        {screenName}
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.text?.secondary || '#718096' }]}>
        This screen is under construction
      </Text>
    </View>
  );
};

/**
 * Main Tab Navigator
 */
const MainTabs = () => {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background?.secondary || '#FFFFFF',
          borderTopColor: theme.colors.border?.light || '#E2E8F0',
        },
        tabBarActiveTintColor: theme.colors.therapeutic?.calming?.[600] || '#0284c7',
        tabBarInactiveTintColor: theme.colors.text?.tertiary || '#A0AEC0',
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Mood" 
        component={MoodScreen}
        options={{
          tabBarLabel: 'Mood',
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          tabBarLabel: 'Chat',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={PlaceholderScreen}
        initialParams={{ name: 'Profile' }}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * Main App Navigator
 */
const AppNavigator = () => {
  const { theme } = useTheme();
  // Safe selector: if no Provider is present in tests, assume unauthenticated
  let isAuthenticated = false;
  try {
    const selector = typeof useReduxSelector === 'function' ? useReduxSelector : null;
    if (selector) {
      isAuthenticated = selector((state) => state.auth?.isAuthenticated);
    }
  } catch {
    isAuthenticated = false;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { 
          backgroundColor: theme.colors.background?.primary || '#F7FAFC' 
        },
      }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="MoodTracker" component={EnhancedMoodTrackerScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AppNavigator;
