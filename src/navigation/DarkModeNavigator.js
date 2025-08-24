import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity
} from 'react-native';

// Import all dark mode screens
import DarkSplashScreen, { 
  LogoDarkSplashScreen,
  ProgressDarkSplashScreen, 
  QuoteDarkSplashScreen,
  LoadingDarkSplashScreen 
} from '../screens/DarkSplashScreen';
import DarkWelcomeScreen from '../screens/DarkWelcomeScreen';
import DarkSignInScreen from '../screens/auth/DarkSignInScreen';
import DarkSignUpScreen from '../screens/auth/DarkSignUpScreen';
import DarkForgotPasswordScreen from '../screens/auth/DarkForgotPasswordScreen';
import DarkComprehensiveAssessmentScreen from '../screens/assessment/DarkComprehensiveAssessmentScreen';

// Import new dark mode screens
import DarkHomeScreen from '../screens/home/DarkHomeScreen';
import DarkMentalHealthScoreScreen from '../screens/home/DarkMentalHealthScoreScreen';
import DarkAITherapyChatScreen from '../screens/chat/DarkAITherapyChatScreen';
import DarkMentalHealthJournalScreen from '../screens/journal/DarkMentalHealthJournalScreen';
import DarkMoodTrackerScreen from '../screens/mood/DarkMoodTrackerScreen';
import DarkProfileSettingsScreen from '../screens/profile/DarkProfileSettingsScreen';
import DarkProfileSetupScreen from '../screens/profile/DarkProfileSetupScreen';
import DarkSearchScreen from '../screens/search/DarkSearchScreen';
import DarkSmartNotificationsScreen from '../screens/settings/DarkSmartNotificationsScreen';
import DarkSleepQualityScreen from '../screens/wellness/DarkSleepQualityScreen';
import DarkStressManagementScreen from '../screens/wellness/DarkStressManagementScreen';
import DarkMindfulHoursScreen from '../screens/mindfulness/DarkMindfulHoursScreen';
import DarkMindfulResourcesScreen from '../screens/mindfulness/DarkMindfulResourcesScreen';
import DarkCommunitySupportScreen from '../screens/community/DarkCommunitySupportScreen';
import DarkErrorUtilityScreens, { 
  NotFoundScreen, 
  NoInternetScreen, 
  InternalErrorScreen, 
  MaintenanceScreen, 
  NotAllowedScreen,
  DarkErrorShowcaseScreen 
} from '../screens/utility/DarkErrorUtilityScreens';

// Import theme and components
import { useTheme } from '../shared/theme/ThemeContext';
import { freudDarkTheme } from '../shared/theme/freudDarkTheme';

const Stack = createStackNavigator();

const DarkModeNavigator = ({ 
  onAuthComplete = () => {},
  onAssessmentComplete = () => {},
  startScreen = "DarkSplash" 
}) => {
  const { isDarkMode, theme } = useTheme();

  const screenOptions = {
    headerShown: false,
    gestureEnabled: true,
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
        },
      };
    },
  };

  const handleSplashComplete = (navigation) => {
    navigation.replace('DarkWelcome');
  };

  const handleWelcomeComplete = (navigation) => {
    navigation.replace('DarkSignIn');
  };

  const handleSignIn = (navigation, credentials) => {
    // Handle sign in logic here
    console.log('Sign in with:', credentials);
    onAuthComplete(credentials);
  };

  const handleSignUp = (navigation, userData) => {
    // Handle sign up logic here
    console.log('Sign up with:', userData);
    navigation.replace('DarkAssessment');
  };

  const handleAssessmentComplete = (navigation, assessmentData) => {
    // Handle assessment completion
    console.log('Assessment completed with:', assessmentData);
    onAssessmentComplete(assessmentData);
  };

  return (
    <Stack.Navigator
      initialRouteName={startScreen}
      screenOptions={screenOptions}
    >
      {/* Splash Screen Variants */}
      <Stack.Screen 
        name="DarkSplash" 
        options={{ gestureEnabled: false }}
      >
        {({ navigation }) => (
          <LogoDarkSplashScreen 
            onComplete={() => handleSplashComplete(navigation)}
            duration={3000}
          />
        )}
      </Stack.Screen>

      <Stack.Screen 
        name="DarkSplashProgress" 
        options={{ gestureEnabled: false }}
      >
        {({ navigation }) => (
          <ProgressDarkSplashScreen 
            onComplete={() => handleSplashComplete(navigation)}
            duration={3000}
          />
        )}
      </Stack.Screen>

      <Stack.Screen 
        name="DarkSplashQuote" 
        options={{ gestureEnabled: false }}
      >
        {({ navigation }) => (
          <QuoteDarkSplashScreen 
            onComplete={() => handleSplashComplete(navigation)}
            duration={4000}
          />
        )}
      </Stack.Screen>

      <Stack.Screen 
        name="DarkSplashLoading" 
        options={{ gestureEnabled: false }}
      >
        {({ navigation }) => (
          <LoadingDarkSplashScreen 
            onComplete={() => handleSplashComplete(navigation)}
            duration={3500}
          />
        )}
      </Stack.Screen>

      {/* Welcome/Onboarding Screen */}
      <Stack.Screen 
        name="DarkWelcome"
        options={{ gestureEnabled: false }}
      >
        {({ navigation }) => (
          <DarkWelcomeScreen 
            onComplete={() => handleWelcomeComplete(navigation)}
          />
        )}
      </Stack.Screen>

      {/* Authentication Screens */}
      <Stack.Screen name="DarkSignIn">
        {({ navigation }) => (
          <DarkSignInScreen 
            navigation={navigation}
            onSignIn={(credentials) => handleSignIn(navigation, credentials)}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="DarkSignUp">
        {({ navigation }) => (
          <DarkSignUpScreen 
            navigation={navigation}
            onSignUp={(userData) => handleSignUp(navigation, userData)}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="DarkForgotPassword">
        {({ navigation }) => (
          <DarkForgotPasswordScreen 
            navigation={navigation}
            onResetPassword={(resetData) => {
              console.log('Password reset:', resetData);
              navigation.goBack();
            }}
          />
        )}
      </Stack.Screen>

      {/* Assessment Screen */}
      <Stack.Screen 
        name="DarkAssessment"
        options={{ gestureEnabled: false }}
      >
        {({ navigation }) => (
          <DarkComprehensiveAssessmentScreen 
            navigation={navigation}
            onComplete={(assessmentData) => handleAssessmentComplete(navigation, assessmentData)}
          />
        )}
      </Stack.Screen>

      {/* Main App Screens */}
      <Stack.Screen name="DarkHome">
        {({ navigation }) => (
          <DarkHomeScreen navigation={navigation} />
        )}
      </Stack.Screen>

      <Stack.Screen name="DarkMentalHealthScore">
        {({ navigation }) => (
          <DarkMentalHealthScoreScreen navigation={navigation} />
        )}
      </Stack.Screen>

      <Stack.Screen name="DarkChat">
        {({ navigation }) => (
          <DarkAITherapyChatScreen navigation={navigation} />
        )}
      </Stack.Screen>

      <Stack.Screen name="DarkJournal">
        {({ navigation }) => (
          <DarkMentalHealthJournalScreen navigation={navigation} />
        )}
      </Stack.Screen>

      <Stack.Screen name="DarkMoodTracker">
        {({ navigation }) => (
          <DarkMoodTrackerScreen navigation={navigation} />
        )}
      </Stack.Screen>

      <Stack.Screen name="DarkProfile">
        {({ navigation }) => (
          <DarkProfileSettingsScreen navigation={navigation} />
        )}
      </Stack.Screen>

      <Stack.Screen name="DarkProfileSetup">
        {({ navigation }) => (
          <DarkProfileSetupScreen 
            navigation={navigation} 
            onComplete={() => navigation.navigate('DarkHome')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="DarkSearch">
        {({ navigation }) => (
          <DarkSearchScreen navigation={navigation} />
        )}
      </Stack.Screen>

      <Stack.Screen name="DarkNotifications">
        {({ navigation }) => (
          <DarkSmartNotificationsScreen navigation={navigation} />
        )}
      </Stack.Screen>

      <Stack.Screen name="DarkSleepQuality">
        {({ navigation }) => (
          <DarkSleepQualityScreen navigation={navigation} />
        )}
      </Stack.Screen>

      <Stack.Screen name="DarkStressManagement">
        {({ navigation }) => (
          <DarkStressManagementScreen navigation={navigation} />
        )}
      </Stack.Screen>

      <Stack.Screen name="DarkMindfulHours">
        {({ navigation }) => (
          <DarkMindfulHoursScreen navigation={navigation} />
        )}
      </Stack.Screen>

      <Stack.Screen name="DarkMindfulResources">
        {({ navigation }) => (
          <DarkMindfulResourcesScreen navigation={navigation} />
        )}
      </Stack.Screen>

      <Stack.Screen name="DarkCommunity">
        {({ navigation }) => (
          <DarkCommunitySupportScreen navigation={navigation} />
        )}
      </Stack.Screen>

      {/* Error & Utility Screens */}
      <Stack.Screen name="DarkNotFound">
        {({ navigation }) => (
          <NotFoundScreen onHomePress={() => navigation.navigate('DarkHome')} />
        )}
      </Stack.Screen>

      <Stack.Screen name="DarkNoInternet">
        {({ navigation }) => (
          <NoInternetScreen 
            onHomePress={() => navigation.navigate('DarkHome')}
            onRetry={() => console.log('Retry connection')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="DarkInternalError">
        {({ navigation }) => (
          <InternalErrorScreen onHomePress={() => navigation.navigate('DarkHome')} />
        )}
      </Stack.Screen>

      <Stack.Screen name="DarkMaintenance">
        {({ navigation }) => (
          <MaintenanceScreen onHomePress={() => navigation.navigate('DarkHome')} />
        )}
      </Stack.Screen>

      <Stack.Screen name="DarkNotAllowed">
        {({ navigation }) => (
          <NotAllowedScreen onHomePress={() => navigation.navigate('DarkHome')} />
        )}
      </Stack.Screen>

      <Stack.Screen name="DarkErrorShowcase">
        {({ navigation }) => (
          <DarkErrorShowcaseScreen />
        )}
      </Stack.Screen>

      {/* Demo Screen - Shows all dark mode components */}
      <Stack.Screen name="DarkDemo">
        {({ navigation }) => (
          <DarkModeDemo navigation={navigation} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

// Demo screen to showcase all dark mode components
const DarkModeDemo = ({ navigation }) => {
  const { theme } = useTheme();

  const demoOptions = [
    {
      title: "🏠 Home Dashboard",
      screen: "DarkHome",
      description: "Mental health dashboard with stats",
      color: freudDarkTheme.colors.accent.primary,
    },
    {
      title: "📊 Mental Health Score",
      screen: "DarkMentalHealthScore",
      description: "Detailed health metrics and insights",
      color: freudDarkTheme.colors.status.success,
    },
    {
      title: "💬 AI Therapy Chat",
      screen: "DarkChat",
      description: "Interactive therapy chat interface",
      color: freudDarkTheme.colors.header.primary,
    },
    {
      title: "📖 Mental Health Journal",
      screen: "DarkJournal",
      description: "Journal entries with mood tracking",
      color: "#8B9F6F",
    },
    {
      title: "😊 Mood Tracker",
      screen: "DarkMoodTracker",
      description: "Mood logging and statistics",
      color: "#F59E0B",
    },
    {
      title: "👤 Profile Settings",
      screen: "DarkProfile",
      description: "User settings and preferences",
      color: freudDarkTheme.colors.accent.primary,
    },
    {
      title: "👤 Profile Setup",
      screen: "DarkProfileSetup",
      description: "Complete user profile configuration",
      color: "#10B981",
    },
    {
      title: "🔍 Search Screen",
      screen: "DarkSearch",
      description: "Advanced search with filters",
      color: "#8B5CF6",
    },
    {
      title: "🔔 Smart Notifications",
      screen: "DarkNotifications",
      description: "Intelligent notification management",
      color: "#F59E0B",
    },
    {
      title: "😴 Sleep Quality",
      screen: "DarkSleepQuality",
      description: "Sleep tracking and insights",
      color: "#6366F1",
    },
    {
      title: "😰 Stress Management",
      screen: "DarkStressManagement",
      description: "Stress level assessment and tools",
      color: "#EF4444",
    },
    {
      title: "🧘 Mindful Hours",
      screen: "DarkMindfulHours",
      description: "Meditation tracking and timer",
      color: "#22C55E",
    },
    {
      title: "📚 Mindful Resources",
      screen: "DarkMindfulResources",
      description: "Educational content and courses",
      color: "#F97316",
    },
    {
      title: "👥 Community Support",
      screen: "DarkCommunity",
      description: "Connect with supportive community",
      color: "#06B6D4",
    },
    {
      title: "⚠️ Error Showcase",
      screen: "DarkErrorShowcase",
      description: "All error and utility screens",
      color: "#DC2626",
    },
    {
      title: "🎨 Logo Splash",
      screen: "DarkSplash",
      description: "Dark chocolate with logo animation",
      color: freudDarkTheme.colors.accent.primary,
    },
    {
      title: "⭕ Progress Splash", 
      screen: "DarkSplashProgress",
      description: "Circular progress animation",
      color: freudDarkTheme.colors.header.primary,
    },
    {
      title: "💭 Quote Splash",
      screen: "DarkSplashQuote", 
      description: "Orange background with inspiration",
      color: "#E67E22",
    },
    {
      title: "⏳ Loading Splash",
      screen: "DarkSplashLoading",
      description: "Green background with loading text",
      color: "#8B9F6F",
    },
    {
      title: "👋 Welcome Flow",
      screen: "DarkWelcome",
      description: "6-step onboarding experience",
      color: freudDarkTheme.colors.accent.primary,
    },
    {
      title: "🔐 Sign In",
      screen: "DarkSignIn",
      description: "Authentication with validation",
      color: freudDarkTheme.colors.header.primary,
    },
    {
      title: "📝 Sign Up",
      screen: "DarkSignUp", 
      description: "Registration form",
      color: freudDarkTheme.colors.header.primary,
    },
    {
      title: "🔑 Forgot Password",
      screen: "DarkForgotPassword",
      description: "Password reset flow",
      color: freudDarkTheme.colors.accent.primary,
    },
    {
      title: "📋 Assessment",
      screen: "DarkAssessment",
      description: "14-step mental health assessment",
      color: freudDarkTheme.colors.accent.primary,
    },
  ];

  return (
    <ScrollView 
      style={{ 
        flex: 1, 
        backgroundColor: freudDarkTheme.colors.background.primary 
      }}
      contentContainerStyle={{ 
        padding: freudDarkTheme.spacing[6] 
      }}
    >
      <Text style={{
        fontSize: freudDarkTheme.typography.sizes["3xl"],
        fontWeight: freudDarkTheme.typography.weights.bold,
        color: freudDarkTheme.colors.text.primary,
        textAlign: 'center',
        marginBottom: freudDarkTheme.spacing[8],
        marginTop: 60,
      }}>
        Dark Mode Demo
      </Text>

      {demoOptions.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={{
            backgroundColor: freudDarkTheme.colors.card.background,
            borderRadius: freudDarkTheme.borderRadius.lg,
            padding: freudDarkTheme.spacing[4],
            marginBottom: freudDarkTheme.spacing[4],
            borderLeftWidth: 4,
            borderLeftColor: option.color,
            ...freudDarkTheme.shadows.sm,
          }}
          onPress={() => navigation.navigate(option.screen)}
        >
          <Text style={{
            fontSize: freudDarkTheme.typography.sizes.lg,
            fontWeight: freudDarkTheme.typography.weights.semibold,
            color: freudDarkTheme.colors.text.primary,
            marginBottom: freudDarkTheme.spacing[1],
          }}>
            {option.title}
          </Text>
          <Text style={{
            fontSize: freudDarkTheme.typography.sizes.sm,
            color: freudDarkTheme.colors.text.secondary,
            lineHeight: freudDarkTheme.typography.sizes.sm * 1.4,
          }}>
            {option.description}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default DarkModeNavigator;