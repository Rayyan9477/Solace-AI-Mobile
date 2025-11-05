/**
 * Enhanced Dashboard Component - Simplified version
 * Basic dashboard interface without complex dependencies
 */

import { useTheme } from "@theme/ThemeProvider";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
  RefreshControl,
} from "react-native";
import { Card, FAB, Avatar, IconButton, Snackbar } from "react-native-paper";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const EnhancedDashboard = ({ navigation }) => {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors?.background?.primary || "#F7FAFC",
    },
    scrollView: {
      flex: 1,
    },
    header: {
      padding: 20,
      paddingTop: Platform.OS === "ios" ? 60 : 40,
      backgroundColor: theme.colors?.primary || "#007AFF",
    },
    headerText: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#FFFFFF",
      marginBottom: 8,
    },
    headerSubtext: {
      fontSize: 16,
      color: "#FFFFFF",
      opacity: 0.8,
    },
    content: {
      padding: 20,
    },
    card: {
      marginBottom: 16,
      padding: 16,
      backgroundColor: "#FFFFFF",
      borderRadius: 12,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors?.text?.primary || "#2D3748",
      marginBottom: 8,
    },
    cardContent: {
      fontSize: 14,
      color: theme.colors?.text?.secondary || "#718096",
      lineHeight: 20,
    },
    fab: {
      position: "absolute",
      margin: 16,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors?.primary || "#007AFF",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome to Solace AI</Text>
        <Text style={styles.headerSubtext}>Your mental health companion</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Mood Tracking</Text>
            <Text style={styles.cardContent}>
              Track your daily mood and emotional patterns to gain insights into
              your mental health journey.
            </Text>
          </Card>

          <Card style={styles.card}>
            <Text style={styles.cardTitle}>AI Therapy Chat</Text>
            <Text style={styles.cardContent}>
              Chat with our AI therapist for personalized support and guidance
              whenever you need it.
            </Text>
          </Card>

          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Mindfulness Resources</Text>
            <Text style={styles.cardContent}>
              Access guided meditations, breathing exercises, and mindfulness
              practices.
            </Text>
          </Card>

          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Mental Health Assessment</Text>
            <Text style={styles.cardContent}>
              Take comprehensive assessments to understand your mental health
              status and get personalized recommendations.
            </Text>
          </Card>
        </View>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setSnackbarVisible(true)}
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
      >
        Quick action triggered!
      </Snackbar>
    </View>
  );
};

export default EnhancedDashboard;
