/**
 * Minimal App Navigator - Simplified version to fix blank screen
 * Removes incompatible web libraries and complex dependencies
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';

// Basic screens
import SimpleCoverScreen from '../screens/SimpleCoverScreen';

// Simple fallback components
const SimpleScreen = ({ title, color = '#6366f1' }) => (
  <View style={[styles.screenContainer, { backgroundColor: color + '10' }]}>
    <Text style={[styles.screenTitle, { color }]}>{title}</Text>
    <Text style={styles.screenSubtitle}>Coming Soon</Text>
  </View>
);

const DashboardScreen = () => <SimpleScreen title="Dashboard" color="#10b981" />;
const ChatScreen = () => <SimpleScreen title="AI Therapy Chat" color="#f59e0b" />;
const MoodScreen = () => <SimpleScreen title="Mood Tracker" color="#8b5cf6" />;
const AssessmentScreen = () => <SimpleScreen title="Mental Health Assessment" color="#8b5cf6" />;
const ProfileScreen = () => <SimpleScreen title="Profile & Settings" color="#6b7280" />;

const Tab = createBottomTabNavigator();

const MinimalAppNavigator = () => {
  const authState = useSelector((state) => state?.auth || {});
  const { isAuthenticated = true, onboardingCompleted = true, isLoading = false } = authState;

  // Simple loading screen
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Solace AI...</Text>
      </View>
    );
  }

  // Skip auth for now to get app working
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#6b7280',
        tabBarIcon: ({ color, size }) => (
          <View style={[styles.tabIcon, { backgroundColor: color + '20' }]}>
            <Text style={[styles.tabIconText, { color }]}>
              {getTabIcon(route.name)}
            </Text>
          </View>
        ),
      })}
    >
      <Tab.Screen 
        name="Welcome" 
        component={SimpleCoverScreen}
        options={{ tabBarLabel: 'Welcome' }}
      />
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ tabBarLabel: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{ tabBarLabel: 'Therapy' }}
      />
      <Tab.Screen 
        name="Mood" 
        component={MoodScreen}
        options={{ tabBarLabel: 'Mood' }}
      />
      <Tab.Screen 
        name="Assessment" 
        component={AssessmentScreen}
        options={{ tabBarLabel: 'Assessment' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const getTabIcon = (routeName) => {
  const icons = {
    Welcome: '🌟',
    Dashboard: '🏠',
    Chat: '💬',
    Mood: '📊',
    Assessment: '📋',
    Profile: '👤',
  };
  return icons[routeName] || '•';
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  screenSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    fontSize: 18,
    color: '#6366f1',
    fontWeight: '600',
  },
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    height: 80,
    paddingBottom: 10,
    paddingTop: 8,
  },
  tabIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconText: {
    fontSize: 16,
  },
});

export default MinimalAppNavigator;