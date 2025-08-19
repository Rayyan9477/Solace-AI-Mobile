/**
 * Optimized App Navigator for Solace AI Mental Health App
 * 
 * Key Improvements:
 * - Reduced from 8 tabs to 5 essential tabs for better UX
 * - Crisis intervention navigation flows
 * - Mental health context-aware transitions
 * - Proper state persistence and deep linking
 * - Emergency access patterns throughout navigation
 * - Unified navigation system
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Platform,
  StatusBar,
  Animated,
  Easing,
  BackHandler,
  Alert,
  Linking,
} from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';

import { useTheme } from '../shared/theme/ThemeContext';
import { NavigationIcon, IconPresets } from '../components/icons';
import { FocusManagement } from '../shared/utils/accessibility';
import { 
  saveNavigationState, 
  restoreNavigationState,
  saveAccessibilityHistory,
  handleDeepLink,
  clearNavigationState,
} from '../utils/navigationPersistence';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import SignInScreen from '../screens/auth/SignInScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import MainAppScreen from '../screens/MainAppScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import EnhancedMoodTrackerScreen from '../screens/mood/EnhancedMoodTrackerScreen';
import AssessmentScreen from '../screens/assessment/AssessmentScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import TherapyScreen from '../screens/therapy/TherapyScreen';
import SearchScreen from '../screens/search/SearchScreen';
import NotificationsScreen from '../screens/settings/NotificationsScreen';
import MindfulResourcesScreen from '../screens/wellness/MindfulResourcesScreen';
import ErrorUtilitiesScreen from '../screens/utils/ErrorUtilitiesScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Mental health optimized transition configurations
const TransitionConfigs = {
  // Gentle transitions for mental health contexts
  therapy: {
    ...TransitionPresets.SlideFromRightIOS,
    transitionSpec: {
      open: {
        animation: 'timing',
        config: {
          duration: 400,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          useNativeDriver: true,
        },
      },
      close: {
        animation: 'timing',
        config: {
          duration: 350,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          useNativeDriver: true,
        },
      },
    },
    cardStyleInterpolator: ({ current, layouts }) => ({
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
        opacity: current.progress.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 0.8, 1],
        }),
      },
    }),
  },

  // Immediate transition for accessibility
  immediate: {
    transitionSpec: {
      open: { animation: 'timing', config: { duration: 0, useNativeDriver: true } },
      close: { animation: 'timing', config: { duration: 0, useNativeDriver: true } },
    },
    cardStyleInterpolator: () => ({ cardStyle: {} }),
  },
};

// Crisis intervention emergency alert
const showCrisisAlert = () => {
  Alert.alert(
    "🚨 Crisis Support",
    "If you're experiencing a mental health crisis:\n\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• Emergency Services: 911\n\nYou are not alone. Help is available 24/7.",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Call 988",
        onPress: async () => {
          try {
            const supported = await Linking.canOpenURL("tel:988");
            if (supported) {
              await Linking.openURL("tel:988");
            }
          } catch (error) {
            console.error("Error calling crisis line:", error);
          }
        },
      },
      {
        text: "Text Crisis Line",
        onPress: async () => {
          try {
            const supported = await Linking.canOpenURL("sms:741741");
            if (supported) {
              await Linking.openURL("sms:741741?body=HOME");
            }
          } catch (error) {
            console.error("Error texting crisis line:", error);
          }
        },
      },
    ],
    { cancelable: true }
  );
};

// Enhanced stack navigator with mental health context awareness
const EnhancedStack = ({ 
  initialRouteName, 
  screenOptions = {}, 
  children,
  transitionContext = 'default',
}) => {
  const { theme, isReducedMotionEnabled } = useTheme();
  const insets = useSafeAreaInsets();

  const getTransitionConfig = (routeName) => {
    if (isReducedMotionEnabled) {
      return TransitionConfigs.immediate;
    }

    // Mental health screens get gentle transitions
    if (['Therapy', 'MoodTracker', 'Assessment', 'Crisis'].includes(routeName)) {
      return TransitionConfigs.therapy;
    }

    return TransitionPresets.SlideFromRightIOS;
  };

  const enhancedScreenOptions = {
    headerStyle: {
      backgroundColor: theme.colors.background.primary,
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
    headerTintColor: theme.colors.text.primary,
    headerTitleStyle: {
      fontWeight: '600',
      fontSize: 18,
    },
    headerBackTitleVisible: false,
    // Emergency button in header for all screens
    headerRight: () => (
      <NavigationIcon
        name="Emergency"
        size="md"
        color={theme.colors.error[500]}
        onPress={showCrisisAlert}
        style={{ marginRight: 16 }}
        accessibilityLabel="Emergency crisis support"
        accessibilityHint="Double tap for immediate crisis resources"
      />
    ),
    ...screenOptions,
  };

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={({ route }) => ({
        ...enhancedScreenOptions,
        ...getTransitionConfig(route.name),
      })}
    >
      {children}
    </Stack.Navigator>
  );
};

// Auth stack with secure navigation
const AuthStack = () => {
  return (
    <EnhancedStack initialRouteName="SignIn" transitionContext="auth">
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{ 
          headerShown: false,
          gestureEnabled: false, // Security: prevent gesture navigation
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ 
          title: "Create Account",
          gestureEnabled: true,
        }}
      />
    </EnhancedStack>
  );
};

// Wellness and therapy stack
const WellnessStack = () => {
  return (
    <EnhancedStack initialRouteName="WellnessHub" transitionContext="therapy">
      <Stack.Screen
        name="WellnessHub"
        component={MindfulResourcesScreen}
        options={{ title: "Wellness Hub", headerShown: false }}
      />
      <Stack.Screen
        name="Therapy"
        component={TherapyScreen}
        options={{ title: "Therapy Session", headerShown: false }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: "Search Resources", headerShown: false }}
      />
    </EnhancedStack>
  );
};

// Profile and settings stack
const ProfileStack = () => {
  return (
    <EnhancedStack initialRouteName="ProfileMain" transitionContext="profile">
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: "Notifications", headerShown: false }}
      />
      <Stack.Screen
        name="Help"
        component={ErrorUtilitiesScreen}
        options={{ title: "Help & Support", headerShown: false }}
      />
    </EnhancedStack>
  );
};

// Optimized main tabs with only 5 essential tabs
const MainTabs = ({ onStateChange }) => {
  const { theme, isReducedMotionEnabled } = useTheme();
  const [activeRoute, setActiveRoute] = useState('Home');

  const handleTabPress = useCallback((route) => {
    if (route.name !== activeRoute) {
      setActiveRoute(route.name);
      
      // Save accessibility history
      saveAccessibilityHistory(route.name, 'TAB_PRESS', {
        previousRoute: activeRoute,
        timestamp: Date.now(),
      });

      // Announce tab change for screen readers
      FocusManagement.announceForScreenReader(
        `Navigated to ${route.name} tab`,
        'polite'
      );
    }
  }, [activeRoute]);

  const getTabBarIcon = useCallback(({ route, focused, color, size }) => {
    const iconMap = {
      'Home': 'Home',
      'Chat': 'Chat', 
      'Mood': 'Mood',
      'Assessment': 'Assessment',
      'Profile': 'Profile',
    };

    const iconName = iconMap[route.name] || 'Home';

    return (
      <NavigationIcon
        name={iconName}
        size={size}
        color={color}
        variant={focused ? 'filled' : 'outline'}
        {...IconPresets.tabBar}
      />
    );
  }, []);

  const tabBarOptions = {
    tabBarActiveTintColor: theme.colors.primary[500],
    tabBarInactiveTintColor: theme.colors.gray[500],
    tabBarStyle: {
      backgroundColor: theme.colors.background.primary,
      borderTopColor: theme.colors.border.primary,
      borderTopWidth: 1,
      paddingVertical: Platform.OS === 'ios' ? 8 : 4,
      height: Platform.OS === 'ios' ? 85 : 65,
      elevation: 8,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: '500',
      marginBottom: Platform.OS === 'ios' ? 0 : 4,
    },
    tabBarItemStyle: {
      paddingVertical: 4,
    },
    lazy: true,
    tabBarHideOnKeyboard: Platform.OS === 'android',
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: (props) => getTabBarIcon({ route, ...props }),
        headerShown: false,
        animationEnabled: !isReducedMotionEnabled,
        ...tabBarOptions,
      })}
      screenListeners={({ route }) => ({
        tabPress: () => handleTabPress(route),
        state: (e) => onStateChange?.(e.data.state),
      })}
    >
      <Tab.Screen
        name="Home"
        component={MainAppScreen}
        options={{ 
          title: "Home",
          tabBarAccessibilityLabel: "Home dashboard tab",
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{ 
          title: "Chat",
          tabBarAccessibilityLabel: "AI therapy chat tab",
        }}
      />
      <Tab.Screen
        name="Mood"
        component={EnhancedMoodTrackerScreen}
        options={{ 
          title: "Mood",
          tabBarAccessibilityLabel: "Mood tracking tab",
        }}
      />
      <Tab.Screen
        name="Assessment"
        component={AssessmentScreen}
        options={{ 
          title: "Assessment",
          tabBarAccessibilityLabel: "Mental health assessment tab",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ 
          title: "Profile",
          tabBarAccessibilityLabel: "Profile and settings tab",
        }}
      />
    </Tab.Navigator>
  );
};

// Main app navigator with comprehensive mental health navigation support
const OptimizedAppNavigator = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { isAuthenticated, onboardingCompleted, isLoading } = useSelector(state => state.auth || {});
  
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState();
  const navigationRef = useRef();
  const routeNameRef = useRef();

  // Create custom theme for navigation
  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.colors.primary[500],
      background: theme.colors.background.primary,
      card: theme.colors.background.surface,
      text: theme.colors.text.primary,
      border: theme.colors.border.primary,
      notification: theme.colors.primary[500],
    },
  };

  // Initialize navigation with state restoration
  useEffect(() => {
    const initializeNavigation = async () => {
      try {
        const restoredState = await restoreNavigationState();
        
        if (restoredState) {
          setInitialState(restoredState);
          FocusManagement.announceForScreenReader(
            'Navigation restored to your previous location',
            'polite'
          );
        }
      } catch (error) {
        console.error('Failed to restore navigation state:', error);
      } finally {
        setIsReady(true);
      }
    };

    initializeNavigation();
  }, []);

  // Handle navigation state changes
  const handleStateChange = useCallback(async (state) => {
    if (!state) return;

    // Save navigation state
    await saveNavigationState(state);

    // Track current route for accessibility
    const previousRouteName = routeNameRef.current;
    const currentRoute = state.routes[state.index];
    const currentRouteName = currentRoute?.name;

    if (previousRouteName !== currentRouteName) {
      routeNameRef.current = currentRouteName;
      
      // Save accessibility history
      await saveAccessibilityHistory(currentRouteName, 'NAVIGATION', {
        previousRoute: previousRouteName,
        routeParams: currentRoute?.params,
      });

      // Announce route change for screen readers
      if (currentRouteName) {
        FocusManagement.announceForScreenReader(
          `Navigated to ${currentRouteName} screen`,
          'polite'
        );
      }
    }
  }, []);

  // Handle deep links
  const handleDeepLinkNavigation = useCallback((url) => {
    if (!navigationRef.current) return;
    
    const success = handleDeepLink(url, navigationRef);
    if (success) {
      FocusManagement.announceForScreenReader(
        'Opened from external link',
        'polite'
      );
    }
  }, []);

  // Handle Android back button with mental health considerations
  useEffect(() => {
    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        const currentRoute = navigationRef.current?.getCurrentRoute();
        
        // Prevent back navigation from critical mental health screens
        if (['Crisis', 'Emergency', 'Assessment'].includes(currentRoute?.name)) {
          Alert.alert(
            "Navigation",
            "Are you sure you want to leave this screen?",
            [
              { text: "Stay", style: "cancel" },
              { 
                text: "Leave", 
                onPress: () => {
                  if (navigationRef.current?.canGoBack()) {
                    navigationRef.current.goBack();
                  }
                }
              },
            ]
          );
          return true;
        }

        if (navigationRef.current?.canGoBack()) {
          navigationRef.current.goBack();
          return true;
        }
        return false;
      });

      return () => backHandler.remove();
    }
  }, []);

  // Show splash screen while initializing
  if (!isReady || isLoading) {
    return <SplashScreen />;
  }

  // Show onboarding if not completed
  if (onboardingCompleted !== true) {
    return (
      <NavigationContainer theme={navigationTheme}>
        <EnhancedStack>
          <Stack.Screen 
            name="Onboarding" 
            component={OnboardingScreen}
            options={{ headerShown: false }}
          />
        </EnhancedStack>
      </NavigationContainer>
    );
  }

  // Show auth stack if not authenticated
  if (isAuthenticated !== true) {
    return (
      <NavigationContainer theme={navigationTheme}>
        <AuthStack />
      </NavigationContainer>
    );
  }

  // Main app navigation with crisis support
  return (
    <NavigationContainer
      ref={navigationRef}
      theme={navigationTheme}
      initialState={initialState}
      onStateChange={handleStateChange}
      onReady={() => {
        routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
      }}
      linking={{
        prefixes: ['solaceai://'],
        config: {
          screens: {
            Home: 'home',
            Chat: 'chat',
            Mood: 'mood',
            Assessment: 'assessment',
            Profile: 'profile',
            Crisis: 'crisis',
            Emergency: 'emergency',
          },
        },
        subscribe: handleDeepLinkNavigation,
      }}
    >
      <MainTabs onStateChange={handleStateChange} />
    </NavigationContainer>
  );
};

export default OptimizedAppNavigator;