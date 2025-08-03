import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { useSelector } from "react-redux";

import { NavigationIcon, IconPresets } from "../components/icons";
import { useTheme } from "../contexts/ThemeContext";

// Screens
import CoverPageScreen from "../screens/CoverPageScreen";
import DesignSystemScreen from "../screens/DesignSystemScreen";
import IconTestScreen from "../screens/IconTestScreen";
import MainAppScreen from "../screens/MainAppScreen";
import SplashScreen from "../screens/SplashScreen";
import AssessmentScreen from "../screens/assessment/AssessmentScreen";
import OnboardingScreen from "../screens/auth/OnboardingScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import SignInScreen from "../screens/auth/SignInScreen";
import ChatScreen from "../screens/chat/ChatScreen";
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import EnhancedMoodTrackerScreen from "../screens/mood/EnhancedMoodTrackerScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

// Wellness Screens
import SearchScreen from "../screens/search/SearchScreen";
import NotificationsScreen from "../screens/settings/NotificationsScreen";
import ErrorUtilitiesScreen from "../screens/utils/ErrorUtilitiesScreen";
import MindfulHoursScreen from "../screens/wellness/MindfulHoursScreen";
import MindfulResourcesScreen from "../screens/wellness/MindfulResourcesScreen";
import SleepQualityScreen from "../screens/wellness/SleepQualityScreen";
import StressManagementScreen from "../screens/wellness/StressManagementScreen";

// Utility Screens

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background.primary,
        },
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
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
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background.primary,
        },
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
      <Stack.Screen
        name="DesignSystem"
        component={DesignSystemScreen}
        options={{ title: "Design System", headerShown: false }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: "Notifications", headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const WellnessStack = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background.primary,
        },
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="MindfulResources"
        component={MindfulResourcesScreen}
        options={{ title: "Wellness Hub", headerShown: false }}
      />
      <Stack.Screen
        name="MindfulHours"
        component={MindfulHoursScreen}
        options={{ title: "Mindful Hours", headerShown: false }}
      />
      <Stack.Screen
        name="SleepQuality"
        component={SleepQualityScreen}
        options={{ title: "Sleep Quality", headerShown: false }}
      />
      <Stack.Screen
        name="StressManagement"
        component={StressManagementScreen}
        options={{ title: "Stress Management", headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const UtilityStack = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background.primary,
        },
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: "Search", headerShown: false }}
      />
      <Stack.Screen
        name="ErrorUtilities"
        component={ErrorUtilitiesScreen}
        options={{ title: "Help & Support", headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Cover") {
            iconName = "Welcome";
          } else if (route.name === "Home") {
            iconName = "Home";
          } else if (route.name === "Chat") {
            iconName = "Chat";
          } else if (route.name === "Mood") {
            iconName = "Mood";
          } else if (route.name === "Assessment") {
            iconName = "Assessment";
          } else if (route.name === "Wellness") {
            iconName = "Mindfulness";
          } else if (route.name === "Utilities") {
            iconName = "Settings";
          } else if (route.name === "Profile") {
            iconName = "Profile";
          } else if (route.name === "IconTest") {
            iconName = "Settings";
          }

          return (
            <NavigationIcon
              name={iconName}
              size={size}
              color={color}
              variant={focused ? "filled" : "outline"}
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
          fontWeight: "500",
          marginBottom: 8,
        },
        headerStyle: {
          backgroundColor: theme.colors.background.primary,
        },
        headerTintColor: theme.colors.text.primary,
      })}
    >
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
        component={ChatScreen}
        options={{ title: "Chat" }}
      />
      <Tab.Screen
        name="Mood"
        component={EnhancedMoodTrackerScreen}
        options={{ title: "Mood", headerShown: false }}
      />
      <Tab.Screen
        name="Assessment"
        component={AssessmentScreen}
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

const AppNavigator = () => {
  const { isAuthenticated, onboardingCompleted } = useSelector(
    (state) => state.auth,
  );
  const [isAppReady, setIsAppReady] = React.useState(false);

  React.useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 2000);

    return () => clearTimeout(timer);
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

export default AppNavigator;
