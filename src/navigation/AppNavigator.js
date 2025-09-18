import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";

// import { NavigationIcon, IconPresets } from "../components/icons";
// import { TouchOptimizations } from "../utils/mobileOptimizations";
// import { useMotionAccessibility } from "../utils/motionAccessibility";
// import { MentalHealthAccessibility } from "../utils/accessibility";

// Screen Imports - Light Mode
import CoverPageScreen from "../screens/CoverPageScreen";
import DesignSystemScreen from "../screens/DesignSystemScreen";
import MainAppScreen from "../screens/MainAppScreen";
import SplashScreen from "../screens/SplashScreen";
import WelcomeScreen from "../screens/WelcomeScreen";

// Assessment Screens
import AssessmentScreen from "../screens/assessment/AssessmentScreen";
import ComprehensiveAssessmentScreen from "../screens/assessment/ComprehensiveAssessmentScreen";

// Auth Screens
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import OnboardingScreen from "../screens/auth/OnboardingScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import SignInScreen from "../screens/auth/SignInScreen";
import SimpleOnboardingScreen from "../screens/auth/SimpleOnboardingScreen";

// Chat Screens
import ChatScreen from "../screens/chat/ChatScreen";
import EnhancedChatScreen from "../screens/chat/EnhancedChatScreen";

// Dashboard Screens
import DashboardScreen from "../screens/dashboard/DashboardScreen";

// Journal Screens
import JournalScreen from "../screens/journal/JournalScreen";
import MentalHealthJournalScreen from "../screens/journal/MentalHealthJournalScreen";

// Mood Screens
import EnhancedMoodTrackerScreen from "../screens/mood/EnhancedMoodTrackerScreen";
import MoodTrackerScreen from "../screens/mood/MoodTrackerScreen";

// Profile Screens
import ProfileScreen from "../screens/profile/ProfileScreen";
import ProfileSetupScreen from "../screens/profile/ProfileSetupScreen";

// Search Screens
import SearchScreen from "../screens/search/SearchScreen";

// Settings Screens
import NotificationsScreen from "../screens/settings/NotificationsScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";

// Therapy Screens
import TherapyScreen from "../screens/therapy/TherapyScreen";

// Utility Screens
import ErrorUtilitiesScreen from "../screens/utils/ErrorUtilitiesScreen";

// Wellness Screens
import MindfulHoursScreen from "../screens/wellness/MindfulHoursScreen";
import MindfulResourcesScreen from "../screens/wellness/MindfulResourcesScreen";
import SleepQualityScreen from "../screens/wellness/SleepQualityScreen";
import StressManagementScreen from "../screens/wellness/StressManagementScreen";

// Theme import
import { useTheme } from "../design-system/theme/ThemeProvider";
// Removed NavigationTester import - was causing navigation interference

// Utility Screens

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Enhanced theme-aware screen selector with fallbacks
const getThemeAwareScreen = (lightScreen, darkScreen, isDarkMode) => {
  try {
    const selectedScreen = isDarkMode ? darkScreen : lightScreen;
    if (!selectedScreen) {
      throw new Error("No screen available for theme");
    }
    return selectedScreen;
  } catch (error) {
    console.error("🚨 Error in getThemeAwareScreen:", error);
    // Return a simple placeholder instead of FallbackScreen
    return () => (
      <View>
        <Text>Loading Screen...</Text>
      </View>
    );
  }
};

// Enhanced Error Boundary component for navigation failures
class NavigationErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("🚨 Navigation Error Boundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
      hasError: true,
    });

    // Track error in development
    if (__DEV__) {
      console.log("📍 Error occurred in navigation component");
      console.log("Error:", error.message);
      console.log("Component Stack:", errorInfo.componentStack);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Get theme safely with fallback
      const theme = this.props.theme || {
        colors: {
          background: { primary: "#FFFFFF" },
          text: { primary: "#000000", secondary: "#666666" },
          primary: { 500: "#3B82F6" },
        },
      };

      return (
        <View
          style={[
            styles.errorContainer,
            { backgroundColor: theme.colors.background.primary },
          ]}
        >
          <Text
            style={[styles.errorText, { color: theme.colors.text.primary }]}
          >
            Navigation Error: Unable to load screen
          </Text>
          <Text
            style={[
              styles.errorSubtext,
              { color: theme.colors.text.secondary },
            ]}
          >
            {this.state.error?.message || "An unexpected error occurred"}
          </Text>
          <TouchableOpacity
            style={[
              styles.retryButton,
              { backgroundColor: theme.colors.primary[500] },
            ]}
            onPress={this.handleRetry}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
          {__DEV__ && (
            <Text
              style={[styles.debugInfo, { color: theme.colors.text.secondary }]}
            >
              Debug: {this.state.error?.stack?.substring(0, 200)}...
            </Text>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  errorSubtext: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  debugInfo: {
    fontSize: 10,
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    marginTop: 10,
  },
});

const AuthStack = () => {
  const { theme, isDarkMode } = useTheme();

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
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: "Reset Password" }}
      />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  const { theme, isDarkMode } = useTheme();

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
      <Stack.Screen
        name="ProfileSetup"
        component={ProfileSetupScreen}
        options={{ title: "Complete Profile", headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const WellnessStack = () => {
  const { theme, isDarkMode } = useTheme();

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
        name="Community"
        component={ChatScreen}
        options={{ title: "Community Support", headerShown: false }}
      />
      <Stack.Screen
        name="Journal"
        component={JournalScreen}
        options={{ title: "Mental Health Journal", headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const UtilityStack = () => {
  const { theme, isDarkMode } = useTheme();

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

// Theme Toggle Button Component
const ThemeToggleButton = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={{
        marginRight: 15,
        padding: 8,
        borderRadius: 20,
        backgroundColor: isDarkMode ? "#374151" : "#F3F4F6",
      }}
      accessibilityLabel={
        isDarkMode ? "Switch to light mode" : "Switch to dark mode"
      }
      accessibilityRole="button"
    >
      <Text style={{ fontSize: 16 }}>{isDarkMode ? "☀️" : "🌙"}</Text>
    </TouchableOpacity>
  );
};

const MainTabs = () => {
  const { theme, isDarkMode } = useTheme();
  // const motionUtils = useMotionAccessibility();
  // const optimalTouchTarget = TouchOptimizations.getOptimalTouchTarget();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconText;

          if (route.name === "Cover") {
            iconText = "🏠";
          } else if (route.name === "Home") {
            iconText = "🏠";
          } else if (route.name === "Chat") {
            iconText = "💬";
          } else if (route.name === "Mood") {
            iconText = "😊";
          } else if (route.name === "Assessment") {
            iconText = "📋";
          } else if (route.name === "Wellness") {
            iconText = "🧘";
          } else if (route.name === "Utilities") {
            iconText = "⚙️";
          } else if (route.name === "Profile") {
            iconText = "👤";
          }

          return <Text style={{ fontSize: size, color }}>{iconText}</Text>;
        },
        tabBarActiveTintColor: theme.colors.primary[500],
        tabBarInactiveTintColor: theme.colors.gray[500],
        tabBarStyle: {
          backgroundColor: theme.colors.background.primary,
          borderTopColor: theme.colors.gray[200],
          paddingVertical: 8,
          height: Math.max(70, 44 + 16), // Ensure adequate touch targets
        },
        tabBarAccessibilityRole: "tablist",
        tabBarAccessibilityLabel: "Main navigation tabs",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginBottom: 8,
        },
        headerStyle: {
          backgroundColor: theme.colors.background.primary,
        },
        headerTintColor: theme.colors.text.primary,
        headerRight: () => <ThemeToggleButton />,
      })}
    >
      <Tab.Screen
        name="Cover"
        component={CoverPageScreen}
        options={{
          title: "Welcome",
          tabBarLabel: "Welcome",
          tabBarTestID: "tab-welcome",
          tabBarAccessibilityLabel:
            "Welcome tab - App introduction and features",
          tabBarAccessibilityHint:
            "Double tap to view app welcome and features",
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
          tabBarAccessibilityLabel:
            "Home tab - Main dashboard with wellness overview",
          tabBarAccessibilityHint:
            "Double tap to access your mental health dashboard",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={EnhancedChatScreen}
        options={{
          title: "Chat",
          tabBarLabel: "Chat",
          tabBarTestID: "tab-chat",
          tabBarAccessibilityLabel: "Chat tab - AI therapy conversations",
          tabBarAccessibilityHint:
            "Double tap to start or continue therapy conversation",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Mood"
        component={EnhancedMoodTrackerScreen}
        options={{
          title: "Mood",
          tabBarLabel: "Mood",
          tabBarTestID: "tab-mood",
          tabBarAccessibilityLabel:
            "Mood tab - Track and monitor your emotional state",
          tabBarAccessibilityHint:
            "Double tap to record your current mood and feelings",
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
          tabBarAccessibilityLabel:
            "Assessment tab - Mental health evaluation and screening",
          tabBarAccessibilityHint:
            "Double tap to take mental health assessments",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Wellness"
        component={WellnessStack}
        options={{
          title: "Wellness",
          tabBarLabel: "Wellness",
          tabBarTestID: "tab-wellness",
          tabBarAccessibilityLabel:
            "Wellness tab - Mindfulness and stress management resources",
          tabBarAccessibilityHint:
            "Double tap to access wellness tools and resources",
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
          tabBarAccessibilityLabel:
            "Utilities tab - App tools and support features",
          tabBarAccessibilityHint:
            "Double tap to access app utilities and support",
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
          tabBarAccessibilityLabel:
            "Profile tab - Account settings and personal information",
          tabBarAccessibilityHint: "Double tap to view and edit your profile",
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const authState = useSelector((state) => state.auth);
  const { isAuthenticated, onboardingCompleted, isLoading, authChecked } =
    authState || {};
  const { isDarkMode } = useTheme();

  // Simplified navigation state logging (removed complex testing that could interfere)
  React.useEffect(() => {
    if (__DEV__) {
      console.log("🧭 AppNavigator: Auth state:", {
        isAuthenticated,
        onboardingCompleted,
        isLoading,
        authChecked,
        isDarkMode,
      });
      console.log("≡ƒº¡ AppNavigator: Navigation decision based on:", {
        authChecked,
        isLoading,
        isAuthenticated,
        onboardingCompleted,
      });
    }
  }, [
    authState,
    isAuthenticated,
    onboardingCompleted,
    isLoading,
    authChecked,
    isDarkMode,
  ]);

  // Replace FallbackScreen with simple loading view
  const LoadingScreen = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Loading...</Text>
    </View>
  );

  // Remove forcing and restore proper logic
  const renderScreen = () => {
    if (!authChecked) {
      return (
        <Stack.Screen
          name="AuthLoading"
          component={LoadingScreen}
          options={{ headerShown: false }}
        />
      );
    }

    if (isLoading) {
      return (
        <Stack.Screen
          name="AuthLoading"
          component={LoadingScreen}
          options={{ headerShown: false }}
        />
      );
    }

    if (!isAuthenticated) {
      return (
        <Stack.Screen
          name="Auth"
          component={AuthStack}
          options={{ headerShown: false }}
        />
      );
    }

    if (!onboardingCompleted) {
      return (
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
      );
    }

    return (
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{ headerShown: false }}
      />
    );
  };

  return (
    <NavigationErrorBoundary theme={isDarkMode ? null : null}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          animationEnabled: true,
        }}
      >
        {renderScreen()}
      </Stack.Navigator>
    </NavigationErrorBoundary>
  );
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
