/**
 * Expo-Compatible App Navigator
 * Features cross-platform routing with Expo Router support
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, View, Text } from 'react-native';
import { useSelector } from 'react-redux';

// Feature screens
import { DashboardScreen } from '../features/dashboard';
import { ChatScreen } from '../features/chat';
import { MoodScreen } from '../features/mood';
import { LoginScreen, SignupScreen } from '../features/auth';

// Shared components
import { Icon } from '../shared/ui';
import { useTheme } from '../design-system/theme/ThemeProvider';
import { platform } from '../shared/utils/platform';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Main Tab Navigator
 * Bottom tabs for primary app navigation
 */
const TabNavigator = () => {
  const { theme, isDarkMode } = useTheme();

  const tabBarOptions = {
    tabBarStyle: {
      backgroundColor: theme.colors.background.primary,
      borderTopColor: theme.colors.border.primary,
      height: platform.select({
        ios: 90,
        android: 70,
        web: 60,
        default: 70,
      }),
      paddingBottom: platform.select({
        ios: 30,
        android: 10,
        web: 10,
        default: 10,
      }),
    },
    tabBarActiveTintColor: theme.palette.therapeutic.growth,
    tabBarInactiveTintColor: theme.colors.text.tertiary,
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: '500',
    },
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...tabBarOptions,
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Chat':
              iconName = focused ? 'chat' : 'chat-outline';
              break;
            case 'Mood':
              iconName = focused ? 'heart' : 'heart-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarAccessibilityLabel: 'Dashboard tab',
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarLabel: 'AI Chat',
          tabBarAccessibilityLabel: 'AI Chat tab',
        }}
      />
      <Tab.Screen
        name="Mood"
        component={MoodScreen}
        options={{
          tabBarLabel: 'Mood',
          tabBarAccessibilityLabel: 'Mood tracking tab',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarAccessibilityLabel: 'Profile tab',
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * Auth Stack Navigator
 * Authentication flow screens
 */
const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'transparent' },
        cardStyleInterpolator: platform.select({
          ios: ({ current, next, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
          android: ({ current }) => {
            return {
              cardStyle: {
                opacity: current.progress,
              },
            };
          },
          web: ({ current }) => {
            return {
              cardStyle: {
                opacity: current.progress,
              },
            };
          },
        }),
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
};

/**
 * Root App Navigator
 * Switches between auth and main app flows
 */
const AppNavigator = () => {
  // Get authentication state from Redux
  const authState = useSelector((state: any) => state.auth);
  const { isAuthenticated, onboardingCompleted, isLoading, authChecked } = authState || {};

  // Show loading if auth state hasn't been checked yet
  if (!authChecked || isLoading) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="Loading" 
          component={() => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text>Loading...</Text>
            </View>
          )} 
        />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: platform.isNative,
      }}
    >
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={TabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

// Placeholder for Profile screen
const ProfileScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile Screen - To be implemented</Text>
    </View>
  );
};

export default AppNavigator;