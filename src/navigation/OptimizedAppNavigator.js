import React, { Suspense, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

import { NavigationIcon, IconPresets } from '../components/icons';
import { useTheme } from '../contexts/ThemeContext';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';
import { 
  createScreenBundle, 
  withSuspense, 
  preloadComponent,
  LoadingComponent,
  withPerformanceTracking 
} from '../utils/bundleOptimization';

// Critical screens loaded immediately (small and essential)
import SplashScreen from '../screens/SplashScreen';

// Lazy loaded screens with performance tracking
const CoverPageScreen = withPerformanceTracking(
  createScreenBundle('CoverPageScreen', () => import('../screens/CoverPageScreen')),
  'CoverPageScreen'
);

const MainAppScreen = withPerformanceTracking(
  createScreenBundle('MainAppScreen', () => import('../screens/MainAppScreen')),
  'MainAppScreen'
);

// Authentication screens bundle
const SignInScreen = createScreenBundle('SignInScreen', () => import('../screens/auth/SignInScreen'));
const RegisterScreen = createScreenBundle('RegisterScreen', () => import('../screens/auth/RegisterScreen'));
const OnboardingScreen = createScreenBundle('OnboardingScreen', () => import('../screens/auth/OnboardingScreen'));

// Chat screens bundle
const ChatScreen = createScreenBundle('ChatScreen', () => import('../screens/chat/ChatScreen'));

// Assessment screens bundle  
const AssessmentScreen = createScreenBundle('AssessmentScreen', () => import('../screens/assessment/AssessmentScreen'));

// Mood tracking bundle
const EnhancedMoodTrackerScreen = createScreenBundle('EnhancedMoodTrackerScreen', () => import('../screens/mood/EnhancedMoodTrackerScreen'));

// Profile screens bundle
const ProfileScreen = createScreenBundle('ProfileScreen', () => import('../screens/profile/ProfileScreen'));
const DesignSystemScreen = createScreenBundle('DesignSystemScreen', () => import('../screens/DesignSystemScreen'));
const NotificationsScreen = createScreenBundle('NotificationsScreen', () => import('../screens/settings/NotificationsScreen'));

// Wellness screens bundle (largest screens - highest priority for lazy loading)
const MindfulResourcesScreen = createScreenBundle('MindfulResourcesScreen', () => import('../screens/wellness/MindfulResourcesScreen'));
const MindfulHoursScreen = createScreenBundle('MindfulHoursScreen', () => import('../screens/wellness/MindfulHoursScreen'));
const SleepQualityScreen = createScreenBundle('SleepQualityScreen', () => import('../screens/wellness/SleepQualityScreen'));
const StressManagementScreen = createScreenBundle('StressManagementScreen', () => import('../screens/wellness/StressManagementScreen'));
const TherapyScreen = createScreenBundle('TherapyScreen', () => import('../screens/therapy/TherapyScreen'));
const TherapyTestScreen = createScreenBundle('TherapyTestScreen', () => import('../screens/therapy/TherapyTestScreen'));

// Utility screens bundle
const SearchScreen = createScreenBundle('SearchScreen', () => import('../screens/search/SearchScreen'));
const ErrorUtilitiesScreen = createScreenBundle('ErrorUtilitiesScreen', () => import('../screens/utils/ErrorUtilitiesScreen'));

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
// Optimized Loading Component with therapeutic design
const OptimizedLoadingComponent = ({ theme, message = 'Loading...' }) => (
  <LoadingComponent theme={theme} message={message} />
);

// Auth Stack with lazy loading
const AuthStack = () => {
  const { theme } = useTheme();
  const { performanceMetrics } = usePerformanceMonitor('AuthStack');

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background.primary,
        },
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="SignIn"
        component={withSuspense(SignInScreen, 'Loading Sign In...', OptimizedLoadingComponent)}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={withSuspense(RegisterScreen, 'Loading Registration...', OptimizedLoadingComponent)}
        options={{ title: 'Create Account' }}
      />
    </Stack.Navigator>
  );
};

// Profile Stack with lazy loading
const ProfileStack = () => {
  const { theme } = useTheme();
  const { performanceMetrics } = usePerformanceMonitor('ProfileStack');

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background.primary,
        },
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={withSuspense(ProfileScreen, 'Loading Profile...', OptimizedLoadingComponent)}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen
        name="DesignSystem"
        component={withSuspense(DesignSystemScreen, 'Loading Design System...', OptimizedLoadingComponent)}
        options={{ title: 'Design System', headerShown: false }}
      />
      <Stack.Screen
        name="Notifications"
        component={withSuspense(NotificationsScreen, 'Loading Notifications...', OptimizedLoadingComponent)}
        options={{ title: 'Notifications', headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Wellness Stack with lazy loading and preloading
const WellnessStack = () => {
  const { theme } = useTheme();
  const { performanceMetrics } = usePerformanceMonitor('WellnessStack');

  // Preload therapy screen since it's commonly accessed from wellness
  useEffect(() => {
    const preloadTimer = setTimeout(() => {
      preloadComponent(() => import('../screens/therapy/TherapyScreen'), 'TherapyScreen');
    }, 2000);

    return () => clearTimeout(preloadTimer);
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background.primary,
        },
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="MindfulResources"
        component={withSuspense(MindfulResourcesScreen, 'Loading Wellness Hub...', OptimizedLoadingComponent)}
        options={{ title: 'Wellness Hub', headerShown: false }}
      />
      <Stack.Screen
        name="MindfulHours"
        component={withSuspense(MindfulHoursScreen, 'Loading Mindful Hours...', OptimizedLoadingComponent)}
        options={{ title: 'Mindful Hours', headerShown: false }}
      />
      <Stack.Screen
        name="SleepQuality"
        component={withSuspense(SleepQualityScreen, 'Loading Sleep Quality...', OptimizedLoadingComponent)}
        options={{ title: 'Sleep Quality', headerShown: false }}
      />
      <Stack.Screen
        name="StressManagement"
        component={withSuspense(StressManagementScreen, 'Loading Stress Management...', OptimizedLoadingComponent)}
        options={{ title: 'Stress Management', headerShown: false }}
      />
      <Stack.Screen
        name="Therapy"
        component={withSuspense(TherapyScreen, 'Loading Therapy Session...', OptimizedLoadingComponent)}
        options={{ title: 'Therapy Session', headerShown: false }}
      />
      <Stack.Screen
        name="TherapyTest"
        component={withSuspense(TherapyTestScreen, 'Loading Therapy Test...', OptimizedLoadingComponent)}
        options={{ title: 'Therapy System Test', headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Utility Stack with lazy loading
const UtilityStack = () => {
  const { theme } = useTheme();
  const { performanceMetrics } = usePerformanceMonitor('UtilityStack');

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background.primary,
        },
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Search"
        component={withSuspense(SearchScreen, 'Loading Search...', OptimizedLoadingComponent)}
        options={{ title: 'Search', headerShown: false }}
      />
      <Stack.Screen
        name="ErrorUtilities"
        component={withSuspense(ErrorUtilitiesScreen, 'Loading Help & Support...', OptimizedLoadingComponent)}
        options={{ title: 'Help & Support', headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Main Tabs with performance optimization
const MainTabs = () => {
  const { theme } = useTheme();
  const { performanceMetrics } = usePerformanceMonitor('MainTabs');

  // Preload commonly accessed screens after initial render
  useEffect(() => {
    const preloadSequence = async () => {
      // Wait for initial render to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Preload in order of likelihood to be accessed
      const preloadOrder = [
        { component: () => import('../screens/chat/ChatScreen'), name: 'ChatScreen' },
        { component: () => import('../screens/mood/EnhancedMoodTrackerScreen'), name: 'MoodTrackerScreen' },
        { component: () => import('../screens/assessment/AssessmentScreen'), name: 'AssessmentScreen' },
      ];

      for (const { component, name } of preloadOrder) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Stagger preloads
        preloadComponent(component, name);
      }
    };

    preloadSequence();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Cover') {
            iconName = 'Welcome';
          } else if (route.name === 'Home') {
            iconName = 'Home';
          } else if (route.name === 'Chat') {
            iconName = 'Chat';
          } else if (route.name === 'Mood') {
            iconName = 'Mood';
          } else if (route.name === 'Assessment') {
            iconName = 'Assessment';
          } else if (route.name === 'Wellness') {
            iconName = 'Mindfulness';
          } else if (route.name === 'Utilities') {
            iconName = 'Settings';
          } else if (route.name === 'Profile') {
            iconName = 'Profile';
          }

          return (
            <NavigationIcon
              name={iconName}
              size={size}
              color={color}
              variant={focused ? 'filled' : 'outline'}
              {...IconPresets.tabBar}
            />
          );
        },
        tabBarActiveTintColor: theme.colors.primary[500],
        tabBarInactiveTintColor: theme.colors.gray[500],
        tabBarStyle: {
          backgroundColor: theme.colors.background.primary,
          borderTopColor: theme.colors.gray[200],
          paddingVertical: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 8,
        },
        headerStyle: {
          backgroundColor: theme.colors.background.primary,
        },
        headerTintColor: theme.colors.text.primary,
        lazy: true, // Enable lazy loading for tab screens
        unmountOnBlur: false, // Keep screens mounted for better UX
      })}
    >
      <Tab.Screen
        name="Cover"
        component={withSuspense(CoverPageScreen, 'Loading Welcome...', OptimizedLoadingComponent)}
        options={{ title: 'Welcome', headerShown: false }}
      />
      <Tab.Screen
        name="Home"
        component={withSuspense(MainAppScreen, 'Loading Dashboard...', OptimizedLoadingComponent)}
        options={{ title: 'Dashboard', headerShown: false }}
      />
      <Tab.Screen
        name="Chat"
        component={withSuspense(ChatScreen, 'Loading Chat...', OptimizedLoadingComponent)}
        options={{ title: 'Chat' }}
      />
      <Tab.Screen
        name="Mood"
        component={withSuspense(EnhancedMoodTrackerScreen, 'Loading Mood Tracker...', OptimizedLoadingComponent)}
        options={{ title: 'Mood', headerShown: false }}
      />
      <Tab.Screen
        name="Assessment"
        component={withSuspense(AssessmentScreen, 'Loading Assessment...', OptimizedLoadingComponent)}
        options={{ title: 'Assessment' }}
      />
      <Tab.Screen
        name="Wellness"
        component={WellnessStack}
        options={{ title: 'Wellness', headerShown: false }}
      />
      <Tab.Screen
        name="Utilities"
        component={UtilityStack}
        options={{ title: 'Tools', headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ title: 'Profile', headerShown: false }}
      />
    </Tab.Navigator>
  );
};

// Main App Navigator with performance monitoring
const OptimizedAppNavigator = () => {
  const { isAuthenticated, onboardingCompleted } = useSelector((state) => state.auth);
  const [isAppReady, setIsAppReady] = React.useState(false);
  const { performanceMetrics, memoryInfo } = usePerformanceMonitor('AppNavigator');

  // App initialization with performance tracking
  React.useEffect(() => {
    const initializeApp = async () => {
      const startTime = performance.now();
      
      // Simulate app initialization
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const endTime = performance.now();
      
      if (__DEV__) {
        console.log(`🚀 App initialized in ${(endTime - startTime).toFixed(2)}ms`);
        console.log(`📊 Initial memory usage: ${memoryInfo.percentage}%`);
      }
      
      setIsAppReady(true);
    };

    initializeApp();
  }, []);

  // Performance monitoring in development
  useEffect(() => {
    if (__DEV__ && performanceMetrics.renderCount > 0) {
      console.log('📊 App Navigator Performance:', {
        renders: performanceMetrics.renderCount,
        lastRender: `${performanceMetrics.renderTime.toFixed(2)}ms`,
        memory: `${memoryInfo.percentage}%`,
      });
    }
  }, [performanceMetrics, memoryInfo]);

  if (!isAppReady) {
    return <SplashScreen />;
  }

  if (!onboardingCompleted) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="Onboarding" 
          component={withSuspense(OnboardingScreen, 'Loading Onboarding...', OptimizedLoadingComponent)}
        />
      </Stack.Navigator>
    );
  }

  if (!isAuthenticated) {
    return <AuthStack />;
  }

  return (
    <Suspense fallback={<OptimizedLoadingComponent message="Loading App..." />}>
      <MainTabs />
    </Suspense>
  );
};

export default OptimizedAppNavigator;