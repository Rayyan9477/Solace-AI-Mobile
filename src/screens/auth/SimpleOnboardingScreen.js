/**
 * Simple Onboarding Screen for Web Debugging
 * 
 * Minimal implementation to test if OnboardingScreen complexity is causing issues
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { useDispatch } from "react-redux";
import { useTheme } from "../../shared/theme/ThemeContext";
import { completeOnboarding, loginSuccess } from "../../store/slices/authSlice";

const SimpleOnboardingScreen = () => {
  const dispatch = useDispatch();
  const { theme } = useTheme();

  React.useEffect(() => {
    if (Platform.OS === 'web') {
      console.log('📱 SimpleOnboardingScreen: Component mounted successfully');
      console.log('📱 SimpleOnboardingScreen: Theme available:', !!theme);
      console.log('📱 SimpleOnboardingScreen: Dispatch available:', !!dispatch);
    }
  }, [theme, dispatch]);

  const handleGetStarted = () => {
    console.log('📱 SimpleOnboardingScreen: Get Started pressed');
    
    try {
      // Complete onboarding and automatically sign in for demo
      dispatch(completeOnboarding());
      dispatch(loginSuccess({ 
        user: { 
          id: 'demo_user', 
          name: 'Welcome User', 
          email: 'demo@solace.ai' 
        }, 
        token: 'demo_token_' + Date.now() 
      }));
      console.log('📱 SimpleOnboardingScreen: Auth actions dispatched successfully');
    } catch (error) {
      console.error('📱 SimpleOnboardingScreen: Error dispatching actions:', error);
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme?.colors?.background?.primary || '#ffffff',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme?.colors?.text?.primary || '#000000',
      textAlign: 'center',
      marginBottom: 16,
    },
    subtitle: {
      fontSize: 18,
      color: theme?.colors?.text?.secondary || '#666666',
      textAlign: 'center',
      marginBottom: 32,
      lineHeight: 24,
    },
    button: {
      backgroundColor: theme?.colors?.primary?.[500] || '#3b82f6',
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 12,
      minWidth: 200,
      alignItems: 'center',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    debugInfo: {
      position: 'absolute',
      top: 100,
      left: 20,
      right: 20,
      backgroundColor: 'rgba(0,0,0,0.1)',
      padding: 10,
      borderRadius: 8,
    },
    debugText: {
      fontSize: 12,
      color: theme?.colors?.text?.secondary || '#666666',
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {Platform.OS === 'web' && __DEV__ && (
        <View style={dynamicStyles.debugInfo}>
          <Text style={dynamicStyles.debugText}>
            ✅ Simple Onboarding Screen Loaded
          </Text>
          <Text style={dynamicStyles.debugText}>
            Theme: {theme ? '✅ Available' : '❌ Missing'}
          </Text>
          <Text style={dynamicStyles.debugText}>
            Platform: {Platform.OS}
          </Text>
        </View>
      )}

      <View style={dynamicStyles.content}>
        <Text style={dynamicStyles.title}>
          Welcome to Solace AI
        </Text>
        
        <Text style={dynamicStyles.subtitle}>
          Your empathetic digital confidant for mental wellness and growth.
        </Text>
        
        <TouchableOpacity
          style={dynamicStyles.button}
          onPress={handleGetStarted}
          accessibilityRole="button"
          accessibilityLabel="Get started with Solace AI"
        >
          <Text style={dynamicStyles.buttonText}>
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SimpleOnboardingScreen;