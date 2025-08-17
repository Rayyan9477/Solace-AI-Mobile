import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { useSelector } from "react-redux";
import { View, Text, StyleSheet } from "react-native";

import NavigationInterfaceIcon from "../components/icons/NavigationInterfaceIcons";
import { IconPresets } from "../components/icons";
import { useTheme } from "../shared/theme/ThemeContext";

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
import TherapyScreen from "../screens/therapy/TherapyScreen";
import TherapyTestScreen from "../screens/therapy/TherapyTestScreen";

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

// Error boundary component for navigation failures
const NavigationErrorBoundary = ({ children }) => {
  const { theme } = useTheme();
  
  try {
    return children;
  } catch (error) {
    console.error('Navigation Error:', error);
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background.primary }]}>
        <Text style={[styles.errorText, { color: theme.colors.text.primary }]}>
          Navigation Error: Unable to load screen
        </Text>
        <Text style={[styles.errorSubtext, { color: theme.colors.text.secondary }]}>
          Please restart the app or contact support
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});

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
      <Stack.Screen
        name="Therapy"
        component={TherapyScreen}
        options={{ title: "Therapy Session", headerShown: false }}
      />
      <Stack.Screen
        name="TherapyTest"
        component={TherapyTestScreen}
        options={{ title: "Therapy System Test", headerShown: false }}
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
            iconName = "explore"; // Maps to ExploreIcon for welcome/discovery
          } else if (route.name === "Home") {
            iconName = "home"; // Maps to HomeIcon
          } else if (route.name === "Chat") {
            iconName = "chat"; // Maps to ChatIcon
          } else if (route.name === "Mood") {
            iconName = "dashboard"; // Maps to DashboardIcon for mood tracking
          } else if (route.name === "Assessment") {
            iconName = "discover"; // Maps to DiscoverIcon for assessment
          } else if (route.name === "Wellness") {
            iconName = "layout-grid"; // Maps to LayoutGridIcon for wellness hub
          } else if (route.name === "Utilities") {
            iconName = "menu-bars"; // Maps to MenuBarsIcon for utilities
          } else if (route.name === "Profile") {
            iconName = "profile"; // Maps to ProfileIcon
          }

          return (
            <NavigationInterfaceIcon
              name={iconName}
              size={size}
              color={color}
              variant={focused ? "filled" : "outline"}
              strokeWidth={IconPresets.tabBar.strokeWidth}
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
        options={{
          title: "Welcome",
          tabBarLabel: "Welcome",
          tabBarTestID: "tab-welcome",
          tabBarAccessibilityLabel: "Welcome",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Home"
        component={MainAppScreen}
        options={{
          title: "Dashboard",
          tabBarLabel: "Home",
          tabBarTestID: "tab-home",
          tabBarAccessibilityLabel: "Home",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: "Chat",
          tabBarLabel: "Chat",
          tabBarTestID: "tab-chat",
          tabBarAccessibilityLabel: "Chat",
        }}
      />
      <Tab.Screen
        name="Mood"
        component={EnhancedMoodTrackerScreen}
        options={{
          title: "Mood",
          tabBarLabel: "Mood",
          tabBarTestID: "tab-mood",
          tabBarAccessibilityLabel: "Mood",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Assessment"
        component={AssessmentScreen}
        options={{
          title: "Assessment",
          tabBarLabel: "Assessment",
          tabBarTestID: "tab-assessment",
          tabBarAccessibilityLabel: "Assessment",
        }}
      />
      <Tab.Screen
        name="Wellness"
        component={WellnessStack}
        options={{
          title: "Wellness",
          tabBarLabel: "Wellness",
          tabBarTestID: "tab-wellness",
          tabBarAccessibilityLabel: "Wellness",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Utilities"
        component={UtilityStack}
        options={{
          title: "Tools",
          tabBarLabel: "Utilities",
          tabBarTestID: "tab-utilities",
          tabBarAccessibilityLabel: "Utilities",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarTestID: "tab-profile",
          tabBarAccessibilityLabel: "Profile",
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated, onboardingCompleted, isLoading } = useSelector(
    (state) => state.auth,
  );

  // Show splash screen while loading
  if (isLoading) {
    return <SplashScreen />;
  }

  // Show onboarding if not completed
  if (!onboardingCompleted) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      </Stack.Navigator>
    );
  }

  // Show authentication screens if not authenticated
  if (!isAuthenticated) {
    return <AuthStack />;
  }

  // Show main app if authenticated and onboarding completed
  return <MainTabs />;
};

// Wrap the main navigator with error boundary
const SafeAppNavigator = () => {
  return (
    <NavigationErrorBoundary>
      <AppNavigator />
    </NavigationErrorBoundary>
  );
};

export default SafeAppNavigator;
