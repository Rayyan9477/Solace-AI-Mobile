import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

import { NavigationIcon, IconPresets } from "../components/icons";
import { useTheme } from "../contexts/ThemeContext";
import {
  LazyChatScreen,
  LazyAITherapyChatScreen,
  LazyTherapyScreen,
  LazyAssessmentScreen,
  LazyComprehensiveAssessmentScreen,
  LazyJournalScreen,
  LazyMentalHealthJournalScreen,
  LazyWellnessScreens,
  preloadCriticalComponents,
} from "../utils/LazyComponents";

// Import only critical components that need to be available immediately
import CoverPageScreen from "../screens/CoverPageScreen";
import MainAppScreen from "../screens/MainAppScreen";
import SplashScreen from "../screens/SplashScreen";
import OnboardingScreen from "../screens/auth/OnboardingScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import SignInScreen from "../screens/auth/SignInScreen";
import EnhancedMoodTrackerScreen from "../screens/mood/EnhancedMoodTrackerScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

// Lazy load non-critical utility screens
const LazyUtilityScreens = {
  Search: React.lazy(() => import("../screens/search/SearchScreen")),
  ErrorUtilities: React.lazy(() => import("../screens/utils/ErrorUtilitiesScreen")),
  Notifications: React.lazy(() => import("../screens/settings/NotificationsScreen")),
  DesignSystem: React.lazy(() => import("../screens/DesignSystemScreen")),
  IconTest: React.lazy(() => import("../screens/IconTestScreen")),
};

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Memoized navigation configurations
const useNavigationConfig = () => {
  const { theme } = useTheme();
  
  return useMemo(() => ({
    screenOptions: {
      headerStyle: {
        backgroundColor: theme.colors.background.primary,
      },
      headerTintColor: theme.colors.text.primary,
      headerTitleStyle: {
        fontWeight: "bold",
      },
    },
    tabBarOptions: {
      activeTintColor: theme.colors.primary[500],
      inactiveTintColor: theme.colors.gray[500],
      style: {
        backgroundColor: theme.colors.background.primary,
        borderTopColor: theme.colors.gray[200],
        paddingVertical: 8,
        height: 70,
      },
      labelStyle: {
        fontSize: 12,
        fontWeight: "500",
        marginBottom: 8,
      },
    },
  }), [theme]);
};

const AuthStack = () => {
  const config = useNavigationConfig();

  return (
    <Stack.Navigator screenOptions={config.screenOptions}>
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: "Create Account" }}
      />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  const config = useNavigationConfig();

  return (
    <Stack.Navigator screenOptions={config.screenOptions}>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
      <Stack.Screen
        name="DesignSystem"
        component={LazyUtilityScreens.DesignSystem}
        options={{ title: "Design System", headerShown: false }}
      />
      <Stack.Screen
        name="Notifications"
        component={LazyUtilityScreens.Notifications}
        options={{ title: "Notifications", headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const WellnessStack = () => {
  const config = useNavigationConfig();

  return (
    <Stack.Navigator screenOptions={config.screenOptions}>
      <Stack.Screen
        name="MindfulResources"
        component={LazyWellnessScreens.MindfulResources}
        options={{ title: "Wellness Hub", headerShown: false }}
      />
      <Stack.Screen
        name="MindfulHours"
        component={LazyWellnessScreens.MindfulHours}
        options={{ title: "Mindful Hours", headerShown: false }}
      />
      <Stack.Screen
        name="SleepQuality"
        component={LazyWellnessScreens.SleepQuality}
        options={{ title: "Sleep Quality", headerShown: false }}
      />
      <Stack.Screen
        name="StressManagement"
        component={LazyWellnessScreens.StressManagement}
        options={{ title: "Stress Management", headerShown: false }}
      />
      <Stack.Screen
        name="Therapy"
        component={LazyTherapyScreen}
        options={{ title: "Therapy Session", headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const UtilityStack = () => {
  const config = useNavigationConfig();

  return (
    <Stack.Navigator screenOptions={config.screenOptions}>
      <Stack.Screen
        name="Search"
        component={LazyUtilityScreens.Search}
        options={{ title: "Search", headerShown: false }}
      />
      <Stack.Screen
        name="ErrorUtilities"
        component={LazyUtilityScreens.ErrorUtilities}
        options={{ title: "Help & Support", headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Memoized tab icon component to prevent re-renders
const TabIcon = React.memo(({ route, focused, color, size }) => {
  const iconMap = {
    Cover: "Welcome",
    Home: "Home", 
    Chat: "Chat",
    Mood: "Mood",
    Assessment: "Assessment",
    Wellness: "Mindfulness",
    Utilities: "Settings",
    Profile: "Profile",
  };
  
  const iconName = iconMap[route.name];
  
  return (
    <NavigationIcon
      name={iconName}
      size={size}
      color={color}
      variant={focused ? "filled" : "outline"}
      {...IconPresets.tabBar}
    />
  );
});

const MainTabs = () => {
  const { theme } = useTheme();
  const config = useNavigationConfig();

  const tabScreenOptions = useMemo(() => ({
    tabBarIcon: ({ focused, color, size }) => (
      <TabIcon 
        route={{ name: route.name }} 
        focused={focused} 
        color={color} 
        size={size} 
      />
    ),
    ...config.tabBarOptions,
    headerStyle: {
      backgroundColor: theme.colors.background.primary,
    },
    headerTintColor: theme.colors.text.primary,
  }), [theme, config]);

  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen
        name="Cover"
        component={CoverPageScreen}
        options={{ title: "Welcome", headerShown: false }}
      />
      <Tab.Screen
        name="Home"
        component={MainAppScreen}
        options={{ title: "Dashboard", headerShown: false }}
      />
      <Tab.Screen
        name="Chat"
        component={LazyChatScreen}
        options={{ title: "Chat" }}
      />
      <Tab.Screen
        name="Mood"
        component={EnhancedMoodTrackerScreen}
        options={{ title: "Mood", headerShown: false }}
      />
      <Tab.Screen
        name="Assessment"
        component={LazyAssessmentScreen}
        options={{ title: "Assessment" }}
      />
      <Tab.Screen
        name="Wellness"
        component={WellnessStack}
        options={{ title: "Wellness", headerShown: false }}
      />
      <Tab.Screen
        name="Utilities"
        component={UtilityStack}
        options={{ title: "Tools", headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ title: "Profile", headerShown: false }}
      />
    </Tab.Navigator>
  );
};

const OptimizedAppNavigator = () => {
  const { isAuthenticated, onboardingCompleted } = useSelector(
    (state) => state.auth,
  );
  const [isAppReady, setIsAppReady] = React.useState(false);

  useEffect(() => {
    let mounted = true;
    
    const initializeApp = async () => {
      try {
        // Preload critical components
        await preloadCriticalComponents();
        
        // Simulate app initialization with preloading
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (mounted) {
          setIsAppReady(true);
        }
      } catch (error) {
        console.warn('App initialization warning:', error);
        if (mounted) {
          setIsAppReady(true);
        }
      }
    };

    initializeApp();
    
    return () => {
      mounted = false;
    };
  }, []);

  if (!isAppReady) {
    return <SplashScreen />;
  }

  if (!onboardingCompleted) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      </Stack.Navigator>
    );
  }

  if (!isAuthenticated) {
    return <AuthStack />;
  }

  return <MainTabs />;
};

export default OptimizedAppNavigator;