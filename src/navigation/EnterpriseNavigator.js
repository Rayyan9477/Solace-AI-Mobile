import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import { TherapeuticPageTransition } from '../design-system/animations/TherapeuticAnimations';

// Screens
import EnterpriseMainScreen from '../screens/EnterpriseMainScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import MoodScreen from '../screens/mood/MoodTrackerScreen';
import AssessmentScreen from '../screens/assessment/AssessmentScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import WellnessScreen from '../screens/wellness/WellnessScreen';

// Auth Screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.serenityGreen[60],
        tabBarInactiveTintColor: theme.colors.optimisticGray[60],
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
          borderTopWidth: 1,
          elevation: 8,
          shadowOpacity: 0.1,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: -2 },
          paddingBottom: 8,
          paddingTop: 8,
          height: 70
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Urbanist-Medium',
          marginTop: 4
        },
        tabBarIconStyle: {
          marginTop: 4
        }
      }}
    >
      <Tab.Screen
        name="Home"
        component={EnterpriseMainScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
          tabBarLabel: "Home"
        }}
      />
      <Tab.Screen
        name="Mood"
        component={MoodScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="heart" size={size} color={color} />
          ),
          tabBarLabel: "Mood"
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="chat" size={size} color={color} />
          ),
          tabBarLabel: "Therapy"
        }}
      />
      <Tab.Screen
        name="Wellness"
        component={WellnessScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="meditation" size={size} color={color} />
          ),
          tabBarLabel: "Wellness"
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
          tabBarLabel: "Profile"
        }}
      />
    </Tab.Navigator>
  );
};

const AuthStackNavigator = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
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
            overlayStyle: {
              opacity: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
              }),
            },
          };
        },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
};

const MainStackNavigator = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'card',
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateY: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.height, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="Assessment" component={AssessmentScreen} />
    </Stack.Navigator>
  );
};

const RootNavigator = ({ isAuthenticated }) => {
  return (
    <NavigationContainer>
      <TherapeuticPageTransition>
        {isAuthenticated ? <MainStackNavigator /> : <AuthStackNavigator />}
      </TherapeuticPageTransition>
    </NavigationContainer>
  );
};

// Simple Icon component fallback
const Icon = ({ name, size = 24, color = '#000' }) => {
  const iconMap = {
    home: '🏠',
    heart: '💚',
    chat: '💬',
    meditation: '🧘',
    account: '👤'
  };

  return (
    <div style={{
      fontSize: size,
      color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {iconMap[name] || '●'}
    </div>
  );
};

export default RootNavigator;