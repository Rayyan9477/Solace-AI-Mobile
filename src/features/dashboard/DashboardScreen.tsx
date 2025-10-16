/**
 * Dashboard Screen - Main Mental Health Dashboard
 * Central hub for user's mental health journey
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useTheme } from "@theme/ThemeProvider";

export const DashboardScreen = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    header: {
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.text.secondary,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    card: {
      backgroundColor: theme.colors.background.secondary,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      ...theme.getShadow('sm'),
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    cardContent: {
      fontSize: 14,
      color: theme.colors.text.secondary,
      lineHeight: 20,
    },
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {getGreeting()}, Friend
          </Text>
          <Text style={styles.subtitle}>
            How are you feeling today?
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Wellness</Text>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Mood Check-in</Text>
            <Text style={styles.cardContent}>
              Take a moment to reflect on your current emotional state
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Daily Mindfulness</Text>
            <Text style={styles.cardContent}>
              Start with 5 minutes of guided breathing
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Progress Overview</Text>
            <Text style={styles.cardContent}>
              See how you've been feeling this week
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Talk to AI Therapist</Text>
            <Text style={styles.cardContent}>
              Get personalized support and guidance
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Journal Entry</Text>
            <Text style={styles.cardContent}>
              Express your thoughts and feelings
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Crisis Support</Text>
            <Text style={styles.cardContent}>
              Access immediate help when you need it most
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
