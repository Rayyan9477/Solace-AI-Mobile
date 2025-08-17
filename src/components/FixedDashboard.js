import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";

import { useFixedTheme } from "./FixedThemeProvider";
import Card from "./common/Card";
import Button from "./common/Button";
import LogoDisplay from "./LogoDisplay";

const FixedDashboard = ({ userName = "User" }) => {
  const { theme, isDarkMode } = useFixedTheme();

  const quickActions = [
    {
      id: 1,
      title: "Mood Check-in",
      description: "How are you feeling today?",
      icon: "😊",
      color: theme.colors.therapeutic?.zen?.[500] || "#EDA600",
    },
    {
      id: 2,
      title: "AI Chat",
      description: "Talk to your AI companion",
      icon: "💬",
      color: theme.colors.therapeutic?.empathy?.[500] || "#C96100",
    },
    {
      id: 3,
      title: "Breathing Exercise",
      description: "Take a moment to breathe",
      icon: "🧘",
      color: theme.colors.therapeutic?.kind?.[500] || "#6C53F3",
    },
    {
      id: 4,
      title: "Journal Entry",
      description: "Write down your thoughts",
      icon: "📝",
      color: theme.colors.primary || "#926247",
    },
  ];

  const insights = [
    {
      id: 1,
      title: "Weekly Progress",
      value: "85%",
      description: "You've completed 6 out of 7 daily check-ins this week",
    },
    {
      id: 2,
      title: "Mood Trend",
      value: "↗️",
      description: "Your mood has been improving over the past week",
    },
    {
      id: 3,
      title: "Mindful Minutes",
      value: "42",
      description: "Total minutes spent in mindfulness this week",
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background?.primary || "#FFFFFF" }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.background?.primary || "#FFFFFF"}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <LogoDisplay 
            size="small"
            showText={true}
            style={styles.logo}
          />
          
          <View style={styles.welcomeSection}>
            <Text style={[styles.welcomeText, { color: theme.colors.text?.secondary || "#6B7280" }]}>
              Welcome back,
            </Text>
            <Text style={[styles.userName, { color: theme.colors.text?.primary || "#111827" }]}>
              {userName}
            </Text>
          </View>
        </View>

        {/* Daily Quote/Motivation */}
        <Card style={styles.motivationCard} variant="elevated">
          <Text style={[styles.quoteText, { color: theme.colors.text?.primary || "#111827" }]}>
            "Every small step forward is progress worth celebrating."
          </Text>
          <Text style={[styles.quoteAuthor, { color: theme.colors.text?.secondary || "#6B7280" }]}>
            — Your AI Companion
          </Text>
        </Card>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text?.primary || "#111827" }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <Card
                key={action.id}
                style={[styles.quickActionCard, { backgroundColor: action.color + "10" }]}
                onPress={() => console.log(`Pressed ${action.title}`)}
                animated={true}
              >
                <Text style={styles.actionIcon}>{action.icon}</Text>
                <Text style={[styles.actionTitle, { color: theme.colors.text?.primary || "#111827" }]}>
                  {action.title}
                </Text>
                <Text style={[styles.actionDescription, { color: theme.colors.text?.secondary || "#6B7280" }]}>
                  {action.description}
                </Text>
              </Card>
            ))}
          </View>
        </View>

        {/* Insights */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text?.primary || "#111827" }]}>
            Your Insights
          </Text>
          {insights.map((insight) => (
            <Card key={insight.id} style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <Text style={[styles.insightTitle, { color: theme.colors.text?.primary || "#111827" }]}>
                  {insight.title}
                </Text>
                <Text style={[styles.insightValue, { color: theme.colors.primary || "#926247" }]}>
                  {insight.value}
                </Text>
              </View>
              <Text style={[styles.insightDescription, { color: theme.colors.text?.secondary || "#6B7280" }]}>
                {insight.description}
              </Text>
            </Card>
          ))}
        </View>

        {/* Emergency Support */}
        <Card style={[styles.emergencyCard, { borderColor: theme.colors.error || "#EF4444" }]}>
          <Text style={[styles.emergencyTitle, { color: theme.colors.error || "#EF4444" }]}>
            Need Immediate Support?
          </Text>
          <Text style={[styles.emergencyDescription, { color: theme.colors.text?.secondary || "#6B7280" }]}>
            If you're in crisis, please reach out for professional help immediately.
          </Text>
          <Button
            title="Crisis Resources"
            variant="outline"
            onPress={() => console.log("Crisis resources pressed")}
            style={[styles.emergencyButton, { borderColor: theme.colors.error || "#EF4444" }]}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    marginRight: 16,
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  motivationCard: {
    padding: 20,
    marginBottom: 24,
    alignItems: "center",
  },
  quoteText: {
    fontSize: 18,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 26,
  },
  quoteAuthor: {
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionCard: {
    width: "48%",
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
  insightCard: {
    padding: 16,
    marginBottom: 12,
  },
  insightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  insightValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  insightDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  emergencyCard: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emergencyDescription: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  emergencyButton: {
    paddingHorizontal: 24,
  },
});

export default FixedDashboard;