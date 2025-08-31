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
import ProfessionalOnboardingScreen from "../screens/ProfessionalOnboardingScreen";
import SplashScreen from "../screens/SplashScreen";
import AssessmentScreen from "../screens/assessment/AssessmentScreen";
import DarkComprehensiveAssessmentScreen from "../screens/assessment/DarkComprehensiveAssessmentScreen";
import DarkForgotPasswordScreen from "../screens/auth/DarkForgotPasswordScreen";
import DarkSignInScreen from "../screens/auth/DarkSignInScreen";
import DarkSignUpScreen from "../screens/auth/DarkSignUpScreen";
import OnboardingScreen from "../screens/auth/OnboardingScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import SignInScreen from "../screens/auth/SignInScreen";
import SimpleOnboardingScreen from "../screens/auth/SimpleOnboardingScreen";
import ChatScreen from "../screens/chat/ChatScreen";
import DarkAITherapyChatScreen from "../screens/chat/DarkAITherapyChatScreen";
import EnhancedChatScreen from "../screens/chat/EnhancedChatScreen";
import DarkCommunitySupportScreen from "../screens/community/DarkCommunitySupportScreen";
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import EnhancedMoodTrackerScreen from "../screens/mood/EnhancedMoodTrackerScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import TherapyScreen from "../screens/therapy/TherapyScreen";
import TherapyTestScreen from "../screens/therapy/TherapyTestScreen";

// Wellness Light Mode Screens
import SearchScreen from "../screens/search/SearchScreen";
import NotificationsScreen from "../screens/settings/NotificationsScreen";
import ErrorUtilitiesScreen from "../screens/utils/ErrorUtilitiesScreen";
import MindfulHoursScreen from "../screens/wellness/MindfulHoursScreen";
import MindfulResourcesScreen from "../screens/wellness/MindfulResourcesScreen";
import SleepQualityScreen from "../screens/wellness/SleepQualityScreen";
import StressManagementScreen from "../screens/wellness/StressManagementScreen";

// Dark Mode Screens

// Dark Mode Authentication

// Dark Mode Main Screens
import DarkHomeScreen from "../screens/home/DarkHomeScreen";
import DarkMentalHealthScoreScreen from "../screens/home/DarkMentalHealthScoreScreen";
import DarkMentalHealthJournalScreen from "../screens/journal/DarkMentalHealthJournalScreen";
import DarkMoodTrackerScreen from "../screens/mood/DarkMoodTrackerScreen";

// Dark Mode Profile & Settings
import DarkProfileSettingsScreen from "../screens/profile/DarkProfileSettingsScreen";
import DarkProfileSetupScreen from "../screens/profile/DarkProfileSetupScreen";
import DarkSearchScreen from "../screens/search/DarkSearchScreen";
import DarkSmartNotificationsScreen from "../screens/settings/DarkSmartNotificationsScreen";

// Dark Mode Wellness
import DarkSleepQualityScreen from "../screens/wellness/DarkSleepQualityScreen";
import DarkStressManagementScreen from "../screens/wellness/DarkStressManagementScreen";
import DarkMindfulHoursScreen from "../screens/mindfulness/DarkMindfulHoursScreen";
import DarkMindfulResourcesScreen from "../screens/mindfulness/DarkMindfulResourcesScreen";

// Dark Mode Community
import { useTheme } from "../shared/theme/ThemeContext";

// Utility Screens

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Theme-aware screen selector utility
const getThemeAwareScreen = (lightScreen, darkScreen, isDarkMode) => {
  return isDarkMode ? darkScreen : lightScreen;
};

// Error boundary component for navigation failures
const NavigationErrorBoundary = ({ children }) => {
  const { theme } = useTheme();

  try {
    return children;
  } catch (error) {
    console.error("Navigation Error:", error);
    return (
      <View
        style={[
          styles.errorContainer,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <Text style={[styles.errorText, { color: theme.colors.text.primary }]}>
          Navigation Error: Unable to load screen
        </Text>
        <Text
          style={[styles.errorSubtext, { color: theme.colors.text.secondary }]}
        >
          Please restart the app or contact support
        </Text>
      </View>
    );
  }
};

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
          SignInScreen,
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
          ProfileScreen,
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
          ChatScreen,
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

  // Enhanced debugging for web
  React.useEffect(() => {
    if (Platform.OS === "web") {
      console.log("🧭 AppNavigator: Auth state received:", authState);
      console.log("🧭 AppNavigator: isAuthenticated:", isAuthenticated);
      console.log("🧭 AppNavigator: onboardingCompleted:", onboardingCompleted);
      console.log("🧭 AppNavigator: isLoading:", isLoading);
      console.log(
        "🧭 AppNavigator: Will render:",
        isLoading
          ? "SplashScreen"
          : !onboardingCompleted
            ? "OnboardingScreen"
            : !isAuthenticated
              ? "AuthStack"
              : "MainTabs",
      );
    }
  }, [authState, isAuthenticated, onboardingCompleted, isLoading]);

  // Show splash screen while loading
  if (isLoading) {
    console.log("🧭 AppNavigator: Rendering SplashScreen (isLoading=true)");
    const SplashComponent = getThemeAwareScreen(
      SplashScreen,
      DarkSplashScreen,
      isDarkMode,
    );
    return <SplashComponent />;
  }

  // Show onboarding if not completed (handle undefined/null as false)
  if (onboardingCompleted !== true) {
    console.log(
      "🧭 AppNavigator: Rendering OnboardingScreen (onboardingCompleted=",
      onboardingCompleted,
      ")",
    );

    // Use theme-aware onboarding screens - Professional onboarding for all platforms
    const lightOnboardingComponent = ProfessionalOnboardingScreen;
    const OnboardingComponent = getThemeAwareScreen(
      lightOnboardingComponent,
      DarkWelcomeScreen,
      isDarkMode,
    );

    return (
      <NavigationErrorBoundary>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Onboarding" component={OnboardingComponent} />
        </Stack.Navigator>
      </NavigationErrorBoundary>
    );
  }

  // Show authentication screens if not authenticated (handle undefined/null as false)
  if (isAuthenticated !== true) {
    console.log(
      "🧭 AppNavigator: Rendering AuthStack (isAuthenticated=",
      isAuthenticated,
      ")",
    );
    return (
      <NavigationErrorBoundary>
        <AuthStack />
      </NavigationErrorBoundary>
    );
  }

  // Show main app if authenticated and onboarding completed
  console.log("🧭 AppNavigator: Rendering MainTabs (fully authenticated)");
  return (
    <NavigationErrorBoundary>
      <MainTabs />
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
