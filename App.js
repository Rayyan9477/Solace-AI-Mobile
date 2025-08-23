import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

// Simple screens
const HomeScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>🌸 Solace AI Mobile</Text>
    <Text style={styles.subtitle}>Welcome to Mental Health Support</Text>
    <Text style={styles.status}>✅ Home Screen Working</Text>
  </View>
);

const MoodScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>📊 Mood Tracker</Text>
    <Text style={styles.subtitle}>Track your emotional wellbeing</Text>
    <View style={styles.buttonContainer}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>Log Mood</Text>
      </View>
    </View>
  </View>
);

const ChatScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>💬 AI Therapy Chat</Text>
    <Text style={styles.subtitle}>Talk to your AI counselor</Text>
    <View style={styles.chatBox}>
      <Text style={styles.chatText}>Hello! How are you feeling today?</Text>
    </View>
  </View>
);

const ProfileScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>👤 Your Profile</Text>
    <Text style={styles.subtitle}>Personal settings and progress</Text>
    <Text style={styles.info}>🎯 Wellness Goals: In Progress</Text>
    <Text style={styles.info}>📈 Mood Streak: 7 days</Text>
  </View>
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#2d5aa0',
          paddingBottom: 8,
          height: 70,
        },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#a0c4ff',
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Mood" 
        component={MoodScreen}
        options={{
          tabBarLabel: 'Mood',
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          tabBarLabel: 'Chat',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d5aa0',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#5a7bc0',
    marginBottom: 24,
    textAlign: 'center',
  },
  status: {
    fontSize: 14,
    color: '#22c55e',
    marginBottom: 12,
    fontWeight: '600',
  },
  info: {
    fontSize: 14,
    color: '#2d5aa0',
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#2d5aa0',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  chatBox: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    minWidth: 200,
    borderLeftWidth: 4,
    borderLeftColor: '#2d5aa0',
  },
  chatText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export default App;