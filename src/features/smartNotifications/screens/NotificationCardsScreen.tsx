/**
 * Notification Cards Screen - Beautiful Notification Cards Display
 * Based on ui-designs/Dark-mode/Smart Notifications.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

interface NotificationCard {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  message: string;
  actionText: string;
  illustration: string;
  gradientColors: string[];
}

export const NotificationCardsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const notifications: NotificationCard[] = [
    {
      id: "1",
      type: "score",
      title: "Freud Score Increased",
      subtitle: "You're 24% happier compared to last month progress 🎉",
      message: "",
      actionText: "See Score 📊",
      illustration: "🏆",
      gradientColors: ["#2D5F3F", "#4A8C5F"],
    },
    {
      id: "2",
      type: "journal",
      title: "Journal Completed",
      subtitle:
        "You still need to complete 9 daily journal this month. Keep it up! ✨",
      message: "21/30",
      actionText: "See Journal 📖",
      illustration: "📔",
      gradientColors: ["#8B6914", "#B8941F"],
    },
    {
      id: "3",
      type: "therapy",
      title: "Therapy with Dr. Freud AI",
      subtitle: "Your therapy session with Dr. Freud AI is in 5m from now.",
      message: "05:25AM",
      actionText: "See Schedule 📅",
      illustration: "🧑‍⚕️",
      gradientColors: ["#8B4513", "#B8651F"],
    },
    {
      id: "4",
      type: "stress",
      title: "Neutral",
      subtitle: "Stress Decreased! You are now Neutral. Congrats!",
      message: "",
      actionText: "See Stress Level 😊",
      illustration: "🧘",
      gradientColors: ["#5B4F8B", "#7D6BB8"],
    },
    {
      id: "5",
      type: "meditation",
      title: "It's Time",
      subtitle:
        "Time for meditation session. Dr. Freud AI said you need to do it today! It has an 25m session.",
      message: "",
      actionText: "Let's Meditate →",
      illustration: "🧘‍♀️",
      gradientColors: ["#4A4A4A", "#6B6B6B"],
    },
    {
      id: "6",
      type: "sleep",
      title: "Sleep Quality Increased!",
      subtitle: "Your sleep quality is 55% better compared to last month!",
      message: "7h 50m",
      actionText: "See Sleep Quality ⭐",
      illustration: "😴",
      gradientColors: ["#704A33", "#8B6244"],
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.gray["20"],
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    content: {
      flex: 1,
    },
    cardsContainer: {
      paddingHorizontal: 20,
      paddingVertical: 24,
    },
    notificationCard: {
      borderRadius: 24,
      padding: 24,
      marginBottom: 16,
      minHeight: 280,
      justifyContent: "space-between",
    },
    cardIllustration: {
      fontSize: 120,
      textAlign: "center",
      marginVertical: 20,
    },
    cardContent: {
      alignItems: "center",
    },
    cardMessage: {
      fontSize: 48,
      fontWeight: "800",
      color: "#FFFFFF",
      marginBottom: 12,
      textAlign: "center",
    },
    cardTitle: {
      fontSize: 24,
      fontWeight: "800",
      color: "#FFFFFF",
      marginBottom: 8,
      textAlign: "center",
    },
    cardSubtitle: {
      fontSize: 14,
      fontWeight: "600",
      color: "rgba(255,255,255,0.9)",
      textAlign: "center",
      lineHeight: 20,
      marginBottom: 20,
    },
    actionButton: {
      backgroundColor: "rgba(255,255,255,0.2)",
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: 24,
      alignSelf: "center",
    },
    actionButtonText: {
      fontSize: 15,
      fontWeight: "700",
      color: "#FFFFFF",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessible
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Smart Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        pagingEnabled
        snapToInterval={width}
        decelerationRate="fast"
      >
        <View style={styles.cardsContainer}>
          {notifications.map((notification) => (
            <LinearGradient
              key={notification.id}
              colors={notification.gradientColors}
              style={styles.notificationCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.cardIllustration}>
                {notification.illustration}
              </Text>

              <View style={styles.cardContent}>
                {notification.message ? (
                  <Text style={styles.cardMessage}>{notification.message}</Text>
                ) : null}

                <Text style={styles.cardTitle}>{notification.title}</Text>
                <Text style={styles.cardSubtitle}>{notification.subtitle}</Text>

                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>
                    {notification.actionText}
                  </Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationCardsScreen;
