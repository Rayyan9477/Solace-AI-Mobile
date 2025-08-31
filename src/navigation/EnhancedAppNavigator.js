/**
 * Enhanced App Navigator with Freud UI Kit Design Integration
 * Matches design references exactly with Material UI, animations, and therapeutic theming
 */

import React, { useEffect, useState, useCallback } from 'react';
import { 
  Platform, 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  TouchableOpacity,
  StatusBar,
  SafeAreaView 
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { Provider as PaperProvider, Portal, Button } from 'react-native-paper';
import LinearGradient from 'expo-linear-gradient';
// Removed web-specific animation libraries (framer-motion, animejs)
// Using React Native's built-in Animated API instead

// Enhanced UI Components (simplified imports to avoid complex dependencies)
import { FreudThemeProvider } from '../components/ui/FreudThemeProvider';
import { PageShaderBackground } from '../components/ui/PageShaderBackground';
// Temporarily commented out complex components to fix blank screen
// import { EnhancedDashboard } from '../components/ui/EnhancedDashboard';
// import { EnhancedMoodTracker } from '../components/ui/EnhancedMoodTracker'; 
// import { FreudUIShowcase } from '../components/ui/FreudUIShowcase';

// Design System
import { FreudColors, FreudSpacing, FreudBorderRadius, FreudShadows } from '../shared/theme/FreudDesignSystem';
import { useTheme } from '../shared/theme/UnifiedThemeProvider';

// Icons with Freud design
import { NavigationIcon, MentalHealthIcon } from '../components/icons';

// Existing Screens (using working screens)
import CoverPageScreen from '../screens/CoverPageScreen';
import MainAppScreen from '../screens/MainAppScreen';
import EnhancedChatScreen from '../screens/chat/EnhancedChatScreen';
import EnhancedMoodTrackerScreen from '../screens/mood/EnhancedMoodTrackerScreen';
import AssessmentScreen from '../screens/assessment/AssessmentScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SplashScreen from '../screens/SplashScreen';
// Fallback component for debugging
import SimpleFallbackScreen from '../components/SimpleFallbackScreen';

// Auth Screens
import SignInScreen from '../screens/auth/SignInScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ProfessionalOnboardingScreen from '../screens/ProfessionalOnboardingScreen';

// Dark Mode Screens
import DarkHomeScreen from '../screens/home/DarkHomeScreen';
import DarkAITherapyChatScreen from '../screens/chat/DarkAITherapyChatScreen';
import DarkMoodTrackerScreen from '../screens/mood/DarkMoodTrackerScreen';
import DarkComprehensiveAssessmentScreen from '../screens/assessment/DarkComprehensiveAssessmentScreen';
import DarkProfileSettingsScreen from '../screens/profile/DarkProfileSettingsScreen';
import DarkWelcomeScreen from '../screens/DarkWelcomeScreen';
import DarkSplashScreen from '../screens/DarkSplashScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

/**
 * Animated Tab Bar Component with Freud Design
 */
const FreudAnimatedTabBar = ({ state, descriptors, navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const [focusedTab, setFocusedTab] = useState(0);
  const indicatorAnimation = new Animated.Value(0);

  // Animate tab indicator
  useEffect(() => {
    Animated.spring(indicatorAnimation, {
      toValue: state.index,
      useNativeDriver: true,
      tension: 120,
      friction: 8,
    }).start();
  }, [state.index]);

  // Tab configuration matching Freud UI Kit
  const tabConfig = {
    Cover: { 
      icon: 'explore', 
      color: FreudColors.zenYellow[60], 
      gradient: [FreudColors.zenYellow[20], FreudColors.zenYellow[10]],
      label: 'Welcome'
    },
    Home: { 
      icon: 'home', 
      color: FreudColors.serenityGreen[60], 
      gradient: [FreudColors.serenityGreen[20], FreudColors.serenityGreen[10]],
      label: 'Dashboard'
    },
    Chat: { 
      icon: 'chat', 
      color: FreudColors.empathyOrange[60], 
      gradient: [FreudColors.empathyOrange[20], FreudColors.empathyOrange[10]],
      label: 'Therapy'
    },
    Mood: { 
      icon: 'dashboard', 
      color: FreudColors.kindPurple[60], 
      gradient: [FreudColors.kindPurple[20], FreudColors.kindPurple[10]],
      label: 'Mood'
    },
    Assessment: { 
      icon: 'discover', 
      color: FreudColors.mindfulBrown[60], 
      gradient: [FreudColors.mindfulBrown[20], FreudColors.mindfulBrown[10]],
      label: 'Assessment'
    },
    Profile: { 
      icon: 'profile', 
      color: FreudColors.optimisticGray[60], 
      gradient: [FreudColors.optimisticGray[20], FreudColors.optimisticGray[10]],
      label: 'Profile'
    },
  };

  const tabWidth = 100 / state.routes.length;

  return (
    <View style={[
      styles.tabBarContainer, 
      { 
        backgroundColor: isDarkMode ? FreudColors.optimisticGray[100] : '#FFFFFF',
        borderTopColor: isDarkMode ? FreudColors.optimisticGray[80] : FreudColors.optimisticGray[20]
      }
    ]}>
      {/* Animated Indicator */}
      <Animated.View
        style={[
          styles.tabIndicator,
          {
            width: `${tabWidth}%`,
            transform: [{
              translateX: indicatorAnimation.interpolate({
                inputRange: [0, state.routes.length - 1],
                outputRange: [0, (state.routes.length - 1) * (100 / state.routes.length)],
                extrapolate: 'clamp',
              })
            }]
          }
        ]}
      >
        <LinearGradient
          colors={tabConfig[state.routes[state.index]?.name]?.gradient || [FreudColors.serenityGreen[20], FreudColors.serenityGreen[10]]}
          style={styles.indicatorGradient}
        />
      </Animated.View>

      {/* Tab Buttons */}
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const config = tabConfig[route.name] || tabConfig.Home;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // Native micro-interaction animation
            const scaleValue = new Animated.Value(1);
            Animated.sequence([
              Animated.timing(scaleValue, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
              }),
              Animated.timing(scaleValue, {
                toValue: 1.05,
                duration: 100,
                useNativeDriver: true,
              }),
              Animated.timing(scaleValue, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
              }),
            ]).start();
            
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            id={`tab-${index}`}
            onPress={onPress}
            style={[
              styles.tabButton,
              { 
                backgroundColor: isFocused 
                  ? `${config.color}15` 
                  : 'transparent' 
              }
            ]}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
          >
            <View style={styles.tabContent}>
              <NavigationIcon
                name={config.icon}
                size={isFocused ? 26 : 22}
                color={isFocused ? config.color : (isDarkMode ? FreudColors.optimisticGray[50] : FreudColors.optimisticGray[70])}
                variant={isFocused ? "filled" : "outline"}
              />
              <Text style={[
                styles.tabLabel,
                {
                  color: isFocused ? config.color : (isDarkMode ? FreudColors.optimisticGray[50] : FreudColors.optimisticGray[70]),
                  fontSize: isFocused ? 11 : 10,
                  fontWeight: isFocused ? '600' : '500'
                }
              ]}>
                {config.label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

/**
 * Therapeutic Theme Toggle FAB
 */
const ThemeToggleFAB = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = useCallback(() => {
    setIsAnimating(true);
    
    // Native animation for theme toggle
    const rotateValue = new Animated.Value(0);
    const scaleValue = new Animated.Value(1);
    
    Animated.parallel([
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setIsAnimating(false);
    });
    
    toggleTheme();
  }, [toggleTheme]);

  return (
    <TouchableOpacity
      id="theme-fab"
      onPress={handleToggle}
      style={[
        styles.themeFab,
        {
          backgroundColor: isDarkMode ? FreudColors.zenYellow[50] : FreudColors.kindPurple[60],
          ...FreudShadows.lg
        }
      ]}
      accessibilityLabel={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      accessibilityRole="button"
      disabled={isAnimating}
    >
      <Text style={styles.themeFabText}>
        {isDarkMode ? '☀️' : '🌙'}
      </Text>
    </TouchableOpacity>
  );
};

/**
 * Enhanced Tab Navigator with Freud Design
 */
const EnhancedMainTabs = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <>
      <Tab.Navigator
        tabBar={(props) => <FreudAnimatedTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tab.Screen
          name="Cover"
          component={isDarkMode ? DarkWelcomeScreen : CoverPageScreen}
          options={{
            tabBarAccessibilityLabel: "Welcome - App introduction and features",
          }}
        />
        <Tab.Screen
          name="Home"
          component={isDarkMode ? DarkHomeScreen : MainAppScreen}
          options={{
            tabBarAccessibilityLabel: "Dashboard - Mental health overview",
          }}
        />
        <Tab.Screen
          name="Chat"
          component={isDarkMode ? DarkAITherapyChatScreen : EnhancedChatScreen}
          options={{
            tabBarAccessibilityLabel: "Therapy Chat - AI support conversations",
          }}
        />
        <Tab.Screen
          name="Mood"
          component={isDarkMode ? DarkMoodTrackerScreen : EnhancedMoodTrackerScreen}
          options={{
            tabBarAccessibilityLabel: "Mood Tracker - Monitor emotional wellbeing",
          }}
        />
        <Tab.Screen
          name="Assessment"
          component={isDarkMode ? DarkComprehensiveAssessmentScreen : AssessmentScreen}
          options={{
            tabBarAccessibilityLabel: "Assessment - Mental health evaluation",
          }}
        />
        <Tab.Screen
          name="Profile"
          component={isDarkMode ? DarkProfileSettingsScreen : ProfileScreen}
          options={{
            tabBarAccessibilityLabel: "Profile - Account and settings",
          }}
        />
      </Tab.Navigator>
      
      <ThemeToggleFAB />
    </>
  );
};

/**
 * Authentication Stack with Freud Design
 */
const AuthStack = () => {
  const { isDarkMode } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: isDarkMode ? FreudColors.optimisticGray[100] : '#FFFFFF',
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
          },
        }),
      }}
    >
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

/**
 * Enhanced Loading Screen with Therapeutic Animation
 */
const EnhancedLoadingScreen = () => {
  const { isDarkMode } = useTheme();
  const [loadingProgress] = useState(new Animated.Value(0));

  useEffect(() => {
    // Breathing animation for loading
    const breatheAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(loadingProgress, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(loadingProgress, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    breatheAnimation.start();

    return () => breatheAnimation.stop();
  }, []);

  return (
    <PageShaderBackground 
      shader="therapeutic" 
      variant="calming"
      style={styles.loadingContainer}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      
      <Animated.View style={[
        styles.loadingContent,
        {
          transform: [{
            scale: loadingProgress.interpolate({
              inputRange: [0, 1],
              outputRange: [0.95, 1.05],
            })
          }],
          opacity: loadingProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.7, 1],
          })
        }
      ]}>
        <MentalHealthIcon 
          name="Brain" 
          size={80} 
          color={FreudColors.serenityGreen[60]} 
        />
        
        <Text style={[
          styles.loadingTitle,
          { color: isDarkMode ? FreudColors.optimisticGray[10] : FreudColors.mindfulBrown[90] }
        ]}>
          Solace AI
        </Text>
        
        <Text style={[
          styles.loadingSubtitle,
          { color: isDarkMode ? FreudColors.optimisticGray[30] : FreudColors.optimisticGray[70] }
        ]}>
          Your empathetic digital confidant
        </Text>
      </Animated.View>
    </PageShaderBackground>
  );
};

/**
 * Main App Navigator with Enhanced UX
 */
const EnhancedAppNavigator = () => {
  const authState = useSelector((state) => state.auth);
  const { isAuthenticated, onboardingCompleted, isLoading } = authState || {};
  
  // Add error handling for useTheme hook
  let isDarkMode = false;
  try {
    const theme = useTheme();
    isDarkMode = theme?.isDarkMode || false;
  } catch (error) {
    console.warn('Theme hook error:', error);
  }

  // Loading state with therapeutic animation
  if (isLoading) {
    return <EnhancedLoadingScreen />;
  }

  // Onboarding flow
  if (onboardingCompleted !== true) {
    const OnboardingComponent = isDarkMode ? DarkWelcomeScreen : ProfessionalOnboardingScreen;
    return (
      <FreudThemeProvider>
        <PageShaderBackground shader="therapeutic" variant="welcoming">
          <OnboardingComponent />
        </PageShaderBackground>
      </FreudThemeProvider>
    );
  }

  // Authentication flow
  if (isAuthenticated !== true) {
    return (
      <FreudThemeProvider>
        <AuthStack />
      </FreudThemeProvider>
    );
  }

  // Main app with enhanced navigation
  return (
    <FreudThemeProvider>
      <SafeAreaView style={styles.appContainer}>
        <StatusBar
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          backgroundColor="transparent"
          translucent
        />
        <EnhancedMainTabs />
      </SafeAreaView>
    </FreudThemeProvider>
  );
};

const styles = StyleSheet.create({
  // App Container
  appContainer: {
    flex: 1,
  },

  // Tab Bar Styles
  tabBarContainer: {
    flexDirection: 'row',
    height: 85,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 8,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    position: 'relative',
    ...FreudShadows.sm,
  },

  tabIndicator: {
    position: 'absolute',
    top: 0,
    height: 3,
    borderRadius: FreudBorderRadius.sm,
  },

  indicatorGradient: {
    flex: 1,
    borderRadius: FreudBorderRadius.sm,
  },

  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    borderRadius: FreudBorderRadius.lg,
    paddingVertical: 8,
  },

  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabLabel: {
    marginTop: 4,
    fontSize: 10,
    textAlign: 'center',
  },

  // Theme FAB
  themeFab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  themeFabText: {
    fontSize: 24,
  },

  // Loading Screen
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingContent: {
    alignItems: 'center',
    padding: FreudSpacing[8],
  },

  loadingTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginTop: FreudSpacing[6],
    marginBottom: FreudSpacing[2],
  },

  loadingSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default EnhancedAppNavigator;