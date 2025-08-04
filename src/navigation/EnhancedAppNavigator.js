/**
 * Enhanced App Navigator with Optimized Transitions
 * 
 * Provides smooth, flicker-free navigation with:
 * - Optimized screen transitions
 * - State persistence integration
 * - Mental health context awareness
 * - Accessibility-first navigation
 * - Performance optimizations
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Platform,
  StatusBar,
  Animated,
  Easing,
  BackHandler,
} from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';

import { useTheme } from '../contexts/ThemeContext';
import { NavigationIcon, IconPresets } from '../components/icons';
import { 
  saveNavigationState, 
  restoreNavigationState,
  saveAccessibilityHistory,
  handleDeepLink,
} from '../utils/navigationPersistence';
import { FocusManagement } from '../utils/accessibility';

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
import CoverPageScreen from '../screens/CoverPageScreen';
import TherapyScreen from '../screens/therapy/TherapyScreen';
import SearchScreen from '../screens/search/SearchScreen';
import NotificationsScreen from '../screens/settings/NotificationsScreen';
import MindfulResourcesScreen from '../screens/wellness/MindfulResourcesScreen';
import ErrorUtilitiesScreen from '../screens/utils/ErrorUtilitiesScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Custom transition configurations
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
    cardStyleInterpolator: ({ current, layouts }) => {
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
          opacity: current.progress.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0.8, 1],
          }),
        },
      };
    },
  },

  // Fast, smooth transitions for general navigation
  default: {
    ...TransitionPresets.SlideFromRightIOS,
    transitionSpec: {
      open: {
        animation: 'timing',
        config: {
          duration: 250,
          easing: Easing.out(Easing.poly(4)),
          useNativeDriver: true,
        },
      },
      close: {
        animation: 'timing',
        config: {
          duration: 200,
          easing: Easing.in(Easing.poly(4)),
          useNativeDriver: true,
        },
      },
    },
  },

  // Fade transition for modal-like screens
  fade: {
    transitionSpec: {
      open: {
        animation: 'timing',
        config: {
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        },
      },
      close: {
        animation: 'timing',
        config: {
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true,
        },
      },
    },
    cardStyleInterpolator: ({ current }) => {
      return {
        cardStyle: {
          opacity: current.progress,
        },
      };
    },
  },

  // No animation for tab switches to prevent flicker
  immediate: {
    transitionSpec: {
      open: {
        animation: 'timing',
        config: {
          duration: 0,
          useNativeDriver: true,
        },
      },
      close: {
        animation: 'timing',
        config: {
          duration: 0,
          useNativeDriver: true,
        },
      },
    },
    cardStyleInterpolator: () => ({ cardStyle: {} }),
  },
};

// Enhanced stack navigator with context-aware transitions
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

    // Modal screens get fade transitions
    if (['Settings', 'Profile', 'Help'].includes(routeName)) {
      return TransitionConfigs.fade;
    }

    return TransitionConfigs.default;
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
    // Dynamic transition based on route
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

// Auth stack with secure transitions
const AuthStack = () => {
  return (
    <EnhancedStack 
      initialRouteName="SignIn"
      transitionContext="auth"
    >
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{ 
          headerShown: false,
          gestureEnabled: false, // Prevent gesture-based navigation for security
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

// Therapy stack with gentle transitions
const TherapyStack = () => {
  return (
    <EnhancedStack 
      initialRouteName="TherapyMain"
      transitionContext="therapy"
    >
      <Stack.Screen
        name="TherapyMain"
        component={TherapyScreen}
        options={{ title: "Therapy Session", headerShown: false }}
      />
      <Stack.Screen
        name="MindfulResources"
        component={MindfulResourcesScreen}
        options={{ title: "Mindful Resources", headerShown: false }}
      />
    </EnhancedStack>
  );
};

// Profile stack with fade transitions
const ProfileStack = () => {
  return (
    <EnhancedStack 
      initialRouteName="ProfileMain"
      transitionContext="profile"
    >
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
    </EnhancedStack>
  );
};

// Utility stack for tools and help
const UtilityStack = () => {
  return (
    <EnhancedStack 
      initialRouteName="Search"
      transitionContext="utility"
    >
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: "Search", headerShown: false }}
      />
      <Stack.Screen
        name="Help"
        component={ErrorUtilitiesScreen}
        options={{ title: "Help & Support", headerShown: false }}
      />
    </EnhancedStack>
  );
};

// Enhanced tab navigator with optimized performance
const MainTabs = ({ onStateChange }) => {
  const { theme, isReducedMotionEnabled } = useTheme();
  const [activeRoute, setActiveRoute] = useState('Home');

  const handleTabPress = useCallback((route) => {
    // Prevent unnecessary re-renders
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
      'Cover': 'Welcome',
      'Home': 'Home',
      'Chat': 'Chat',
      'Mood': 'Mood',
      'Assessment': 'Assessment',
      'Therapy': 'Mindfulness',
      'Profile': 'Profile',
      'Utilities': 'Settings',
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
    // Optimize tab bar rendering
    lazy: true,
    tabBarHideOnKeyboard: Platform.OS === 'android',
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: (props) => getTabBarIcon({ route, ...props }),
        headerShown: false,
        // Prevent tab flicker with immediate transitions
        animationEnabled: !isReducedMotionEnabled,
        ...tabBarOptions,
      })}
      screenListeners={({ route }) => ({
        tabPress: () => handleTabPress(route),
        state: (e) => onStateChange?.(e.data.state),
      })}
    >
      <Tab.Screen
        name="Cover"
        component={CoverPageScreen}
        options={{ 
          title: "Welcome",
          tabBarAccessibilityLabel: "Welcome tab",
        }}
      />
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
        name="Therapy"
        component={TherapyStack}
        options={{ 
          title: "Therapy",
          tabBarAccessibilityLabel: "Therapy and wellness tab",
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
      <Tab.Screen
        name="Utilities"
        component={UtilityStack}
        options={{ 
          title: "Tools",
          tabBarAccessibilityLabel: "Search and help tools tab",
        }}
      />
    </Tab.Navigator>
  );
};

// Main app navigator with state persistence
const EnhancedAppNavigator = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { isAuthenticated, onboardingCompleted } = useSelector(state => state.auth);
  
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState();
  const navigationRef = useRef();
  const routeNameRef = useRef();
  
  // Performance optimization: track render count
  const renderCount = useRef(0);
  renderCount.current++;

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
        // Restore previous navigation state
        const restoredState = await restoreNavigationState();
        
        if (restoredState) {
          setInitialState(restoredState);
          
          // Announce restoration for accessibility
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

  // Handle Android back button
  useEffect(() => {
    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
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
  if (!isReady) {
    return <SplashScreen />;
  }

  // Show onboarding if not completed
  if (!onboardingCompleted) {
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
  if (!isAuthenticated) {
    return (
      <NavigationContainer theme={navigationTheme}>
        <AuthStack />
      </NavigationContainer>
    );
  }

  // Main app navigation
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
            Therapy: 'therapy',
            Profile: 'profile',
          },
        },
        subscribe: handleDeepLinkNavigation,
      }}
    >
      <MainTabs onStateChange={handleStateChange} />
    </NavigationContainer>
  );
};

export default EnhancedAppNavigator;