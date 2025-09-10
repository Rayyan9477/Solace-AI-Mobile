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

// Light Mode Screens
import CoverPageScreen from "../screens/CoverPageScreen";
import DarkModeShowcaseScreen from "../screens/DarkModeShowcaseScreen";
import DarkSplashScreen from "../screens/DarkSplashScreen";
import DarkWelcomeScreen from "../screens/DarkWelcomeScreen";
import DesignSystemScreen from "../screens/DesignSystemScreen";
import IconTestScreen from "../screens/IconTestScreen";
import MainAppScreen from "../screens/MainAppScreen";
import SplashScreen from "../screens/SplashScreen";
import AssessmentScreen from "../screens/assessment/AssessmentScreen";
import DarkComprehensiveAssessmentScreen from "../screens/assessment/DarkComprehensiveAssessmentScreen";
import DarkForgotPasswordScreen from "../screens/auth/DarkForgotPasswordScreen";
import DarkSignInScreen from "../screens/auth/DarkSignInScreen";
import DarkSignUpScreen from "../screens/auth/DarkSignUpScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import OnboardingScreen from "../screens/auth/OnboardingScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import SignInScreen from "../screens/auth/SignInScreen";
import SimpleOnboardingScreen from "../screens/auth/SimpleOnboardingScreen";
import ChatScreen from "../screens/chat/ChatScreen";
import DarkAITherapyChatScreen from "../screens/chat/DarkAITherapyChatScreen";
import EnhancedChatScreen from "../screens/chat/EnhancedChatScreen";
import DarkCommunitySupportScreen from "../screens/community/DarkCommunitySupportScreen";
import DashboardScreen from "../screens/dashboard/DashboardScreen";

// Wellness Light Mode Screens

// Dark Mode Screens

// Dark Mode Authentication

// Dark Mode Main Screens
import DarkHomeScreen from "../screens/home/DarkHomeScreen";
import DarkMentalHealthScoreScreen from "../screens/home/DarkMentalHealthScoreScreen";
import DarkMentalHealthJournalScreen from "../screens/journal/DarkMentalHealthJournalScreen";
import JournalScreen from "../screens/journal/JournalScreen";

// Dark Mode Profile & Settings

// Dark Mode Wellness
import DarkMindfulHoursScreen from "../screens/mindfulness/DarkMindfulHoursScreen";
import DarkMindfulResourcesScreen from "../screens/mindfulness/DarkMindfulResourcesScreen";
import DarkMoodTrackerScreen from "../screens/mood/DarkMoodTrackerScreen";
import EnhancedMoodTrackerScreen from "../screens/mood/EnhancedMoodTrackerScreen";
import DarkProfileSettingsScreen from "../screens/profile/DarkProfileSettingsScreen";
import DarkProfileSetupScreen from "../screens/profile/DarkProfileSetupScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import ProfileSetupScreen from "../screens/profile/ProfileSetupScreen";
import DarkSearchScreen from "../screens/search/DarkSearchScreen";
import SearchScreen from "../screens/search/SearchScreen";
import DarkSmartNotificationsScreen from "../screens/settings/DarkSmartNotificationsScreen";
import NotificationsScreen from "../screens/settings/NotificationsScreen";
import TherapyScreen from "../screens/therapy/TherapyScreen";
import TherapyTestScreen from "../screens/therapy/TherapyTestScreen";
import ErrorUtilitiesScreen from "../screens/utils/ErrorUtilitiesScreen";
import DarkSleepQualityScreen from "../screens/wellness/DarkSleepQualityScreen";
import DarkStressManagementScreen from "../screens/wellness/DarkStressManagementScreen";
import MindfulHoursScreen from "../screens/wellness/MindfulHoursScreen";
import MindfulResourcesScreen from "../screens/wellness/MindfulResourcesScreen";
import SleepQualityScreen from "../screens/wellness/SleepQualityScreen";
import StressManagementScreen from "../screens/wellness/StressManagementScreen";

// Dark Mode Community
import { useTheme } from "../shared/theme/UnifiedThemeProvider";
// Removed NavigationTester import - was causing navigation interference

// Utility Screens

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Enhanced theme-aware screen selector with fallbacks
const getThemeAwareScreen = (lightScreen, darkScreen, isDarkMode) => {
  try {
    // Validate screen components exist
    if (!lightScreen && !darkScreen) {
      console.warn("⚠️ No screens provided to getThemeAwareScreen");
      return ErrorFallbackScreen;
    }

    const selectedScreen = isDarkMode ? darkScreen : lightScreen;

    // If selected screen is missing, fallback to the other theme
    if (!selectedScreen) {
      console.warn(
        `⚠️ ${isDarkMode ? "Dark" : "Light"} screen missing, falling back to ${isDarkMode ? "light" : "dark"} screen`,
      );
      return isDarkMode ? lightScreen : darkScreen;
    }

    // If both screens exist, return the selected one
    return selectedScreen;
  } catch (error) {
    console.error("🚨 Error in getThemeAwareScreen:", error);
    return ErrorFallbackScreen;
  }
};

// Fallback screen component for missing screens
const ErrorFallbackScreen = () => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.errorContainer,
        { backgroundColor: theme?.colors?.background?.primary || "#FFFFFF" },
      ]}
    >
      <Text
        style={[
          styles.errorText,
          { color: theme?.colors?.text?.primary || "#000000" },
        ]}
      >
        Screen Not Available
      </Text>
      <Text
        style={[
          styles.errorSubtext,
          { color: theme?.colors?.text?.secondary || "#666666" },
        ]}
      >
        This screen is temporarily unavailable. Please try again later.
      </Text>
    </View>
  );
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
        component={getThemeAwareScreen(
          SignInScreen,
          DarkSignInScreen,
          isDarkMode,
        )}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={getThemeAwareScreen(
          RegisterScreen,
          DarkSignUpScreen,
          isDarkMode,
        )}
        options={{ title: "Create Account" }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={getThemeAwareScreen(
          ForgotPasswordScreen,
          DarkForgotPasswordScreen,
          isDarkMode,
        )}
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
        component={getThemeAwareScreen(
          ProfileScreen,
          DarkProfileSettingsScreen,
          isDarkMode,
        )}
        options={{ title: "Profile" }}
      />
      <Stack.Screen
        name="DesignSystem"
        component={DesignSystemScreen}
        options={{ title: "Design System", headerShown: false }}
      />
      <Stack.Screen
        name="Notifications"
        component={getThemeAwareScreen(
          NotificationsScreen,
          DarkSmartNotificationsScreen,
          isDarkMode,
        )}
        options={{ title: "Notifications", headerShown: false }}
      />
      <Stack.Screen
        name="ProfileSetup"
        component={getThemeAwareScreen(
          ProfileSetupScreen,
          DarkProfileSetupScreen,
          isDarkMode,
        )}
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
        component={getThemeAwareScreen(
          MindfulResourcesScreen,
          DarkMindfulResourcesScreen,
          isDarkMode,
        )}
        options={{ title: "Wellness Hub", headerShown: false }}
      />
      <Stack.Screen
        name="MindfulHours"
        component={getThemeAwareScreen(
          MindfulHoursScreen,
          DarkMindfulHoursScreen,
          isDarkMode,
        )}
        options={{ title: "Mindful Hours", headerShown: false }}
      />
      <Stack.Screen
        name="SleepQuality"
        component={getThemeAwareScreen(
          SleepQualityScreen,
          DarkSleepQualityScreen,
          isDarkMode,
        )}
        options={{ title: "Sleep Quality", headerShown: false }}
      />
      <Stack.Screen
        name="StressManagement"
        component={getThemeAwareScreen(
          StressManagementScreen,
          DarkStressManagementScreen,
          isDarkMode,
        )}
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
      <Stack.Screen
        name="Community"
        component={getThemeAwareScreen(
          ChatScreen,
          DarkCommunitySupportScreen,
          isDarkMode,
        )}
        options={{ title: "Community Support", headerShown: false }}
      />
      <Stack.Screen
        name="Journal"
        component={getThemeAwareScreen(
          JournalScreen,
          DarkMentalHealthJournalScreen,
          isDarkMode,
        )}
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
        component={getThemeAwareScreen(
          SearchScreen,
          DarkSearchScreen,
          isDarkMode,
        )}
        options={{ title: "Search", headerShown: false }}
      />
      <Stack.Screen
        name="ErrorUtilities"
        component={ErrorUtilitiesScreen}
        options={{ title: "Help & Support", headerShown: false }}
      />
      <Stack.Screen
        name="DarkModeShowcase"
        component={DarkModeShowcaseScreen}
        options={{ title: "Dark Mode Demo", headerShown: false }}
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
        component={getThemeAwareScreen(
          CoverPageScreen,
          DarkWelcomeScreen,
          isDarkMode,
        )}
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
        component={getThemeAwareScreen(
          MainAppScreen,
          DarkHomeScreen,
          isDarkMode,
        )}
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
        component={getThemeAwareScreen(
          EnhancedChatScreen,
          DarkAITherapyChatScreen,
          isDarkMode,
        )}
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
        component={getThemeAwareScreen(
          EnhancedMoodTrackerScreen,
          DarkMoodTrackerScreen,
          isDarkMode,
        )}
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
        component={getThemeAwareScreen(
          AssessmentScreen,
          DarkComprehensiveAssessmentScreen,
          isDarkMode,
        )}
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
  const { isAuthenticated, onboardingCompleted, isLoading } = authState || {};
  const { isDarkMode } = useTheme();

  // Simplified navigation state logging (removed complex testing that could interfere)
  React.useEffect(() => {
    if (__DEV__) {
      console.log("🧭 AppNavigator: Auth state:", {
        isAuthenticated,
        onboardingCompleted,
        isLoading,
        isDarkMode,
      });
    }
  }, [authState, isAuthenticated, onboardingCompleted, isLoading, isDarkMode]);

  // Emergency fallback: if auth state is undefined or invalid, show main app
  const shouldShowMainApp = () => {
    // If auth state is completely missing, default to main app
    if (!authState) {
      console.log("🆘 Auth state missing, showing main app as fallback");
      return true;
    }

    // If we're not loading and both conditions are false, show main app
    if (!isLoading && !onboardingCompleted && !isAuthenticated) {
      console.log("🆘 Both onboarding and auth are false, showing main app as fallback");
      return true;
    }

    // Normal flow
    return false;
  };

  const renderScreen = () => {
    // Emergency fallback for undefined auth state
    if (shouldShowMainApp()) {
      console.log("🆘 Using emergency navigation fallback");
      return <Stack.Screen name="Main" component={MainTabs} />;
    }

    // Normal navigation logic
    if (isLoading) {
      return (
        <Stack.Screen
          name="Splash"
          component={getThemeAwareScreen(
            SplashScreen,
            DarkSplashScreen,
            isDarkMode,
          )}
        />
      );
    }

    if (!onboardingCompleted) {
      return (
        <Stack.Screen
          name="Onboarding"
          component={getThemeAwareScreen(
            OnboardingScreen,
            DarkWelcomeScreen,
            isDarkMode,
          )}
        />
      );
    }

    if (!isAuthenticated) {
      return <Stack.Screen name="Auth" component={AuthStack} />;
    }

    return <Stack.Screen name="Main" component={MainTabs} />;
  };

  return (
    <NavigationErrorBoundary theme={isDarkMode ? null : null}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
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
