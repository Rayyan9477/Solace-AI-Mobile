import React, { useState, useRef, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  Alert,
} from "react-native";

import { useTheme } from "../../shared/theme/ThemeContext";
import { freudDarkTheme } from "../../shared/theme/freudDarkTheme";
import { FreudLogo } from "../../components/icons/FreudIcons";

const { width, height } = Dimensions.get("window");

const DarkHomeScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const [userName] = useState("Shinomiya");
  const [currentTime] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning";
    if (hour < 17) return "Afternoon";
    return "Evening";
  });

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Mental Health Score Data
  const [mentalHealthScore] = useState({
    current: 80,
    status: "Mentally Stable",
    trend: "positive",
    history: [65, 70, 75, 78, 80],
    color: freudDarkTheme.colors.status.success,
  });

  // Dashboard metrics
  const dashboardMetrics = [
    {
      id: "freud-score",
      title: "Freud Score",
      value: "80",
      subtitle: "Mentally Stable",
      icon: "🧠",
      color: freudDarkTheme.colors.status.success,
      bgColor: `${freudDarkTheme.colors.status.success}20`,
    },
    {
      id: "mood-range",
      title: "Mood Range",
      value: "76%",
      subtitle: "Stable Range",
      icon: "📊",
      color: freudDarkTheme.colors.accent.primary,
      bgColor: `${freudDarkTheme.colors.accent.primary}20`,
    },
    {
      id: "mindful-hours",
      title: "Mindful Hours",
      value: "2.5hrs",
      subtitle: "Today",
      icon: "🧘",
      color: freudDarkTheme.colors.header.primary,
      bgColor: `${freudDarkTheme.colors.header.primary}20`,
    },
    {
      id: "sleep-quality",
      title: "Sleep Quality",
      value: "8.2",
      subtitle: "Excellent (7-8h Avg)",
      icon: "😴",
      color: "#8E44AD",
      bgColor: "#8E44AD20",
    },
    {
      id: "mindful-journal",
      title: "Mindful Journal",
      value: "5",
      subtitle: "Entries this week",
      icon: "📝",
      color: freudDarkTheme.colors.accent.primary,
      bgColor: `${freudDarkTheme.colors.accent.primary}20`,
    },
    {
      id: "stress-level",
      title: "Stress Level",
      value: "Low",
      subtitle: "Level 2 (Normal)",
      icon: "💆",
      color: freudDarkTheme.colors.status.success,
      bgColor: `${freudDarkTheme.colors.status.success}20`,
    },
    {
      id: "mood-tracker",
      title: "Mood Tracker",
      value: "4.2",
      subtitle: "Happy → Energetic",
      icon: "😊",
      color: freudDarkTheme.colors.accent.light,
      bgColor: `${freudDarkTheme.colors.accent.light}20`,
    },
  ];

  // AI Therapy Stats
  const aiTherapyStats = {
    conversations: 2541,
    todayMinutes: 15,
    thisWeek: "45 This Week",
  };

  // Mindful Articles
  const mindfulArticles = [
    {
      id: 1,
      title: "Mental Health",
      subtitle: "Will meditation help you get out from the rut now?",
      readTime: "5-8 min",
      icon: "🧘",
      bgGradient: [freudDarkTheme.colors.header.primary, freudDarkTheme.colors.header.secondary],
    },
    {
      id: 2,
      title: "Mental Health",
      subtitle: "Will meditation helps you get out from the rut?",
      readTime: "8-10 min", 
      icon: "🧘",
      bgGradient: [freudDarkTheme.colors.header.primary, freudDarkTheme.colors.header.secondary],
    },
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View>
          <Text style={styles.greeting}>
            Good {currentTime}
          </Text>
          <Text style={styles.userName}>
            Hi, {userName}! 👋
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={() => navigation.navigate('Search')}
        >
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.statusText}>Search anything...</Text>
    </View>
  );

  const renderMentalHealthScore = () => (
    <View style={styles.scoreCard}>
      <LinearGradient
        colors={[freudDarkTheme.colors.header.primary, freudDarkTheme.colors.header.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.scoreGradient}
      >
        <View style={styles.scoreHeader}>
          <View style={styles.scoreInfo}>
            <Text style={styles.scoreTitle}>Freud Score</Text>
            <TouchableOpacity style={styles.scoreMenuButton}>
              <Text style={styles.scoreMenuText}>•••</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.scoreDisplay}>
          <Text style={styles.scoreValue}>{mentalHealthScore.current}</Text>
          <Text style={styles.scoreStatus}>{mentalHealthScore.status}</Text>
        </View>

        <TouchableOpacity style={styles.scoreHistoryButton}>
          <Text style={styles.scoreHistoryText}>Score History</Text>
          <Text style={styles.seeAllText}>See All →</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  const renderDashboardMetrics = () => (
    <View style={styles.metricsContainer}>
      <Text style={styles.metricsTitle}>Mental Health Metrics</Text>
      <View style={styles.metricsGrid}>
        {dashboardMetrics.map((metric) => (
          <TouchableOpacity
            key={metric.id}
            style={[styles.metricCard, { backgroundColor: metric.bgColor }]}
            onPress={() => handleMetricPress(metric)}
          >
            <View style={styles.metricHeader}>
              <Text style={styles.metricIcon}>{metric.icon}</Text>
              <Text style={[styles.metricValue, { color: metric.color }]}>
                {metric.value}
              </Text>
            </View>
            <Text style={styles.metricTitle}>{metric.title}</Text>
            <Text style={styles.metricSubtitle}>{metric.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderAITherapySection = () => (
    <TouchableOpacity 
      style={styles.therapyCard}
      onPress={() => navigation.navigate('Chat')}
    >
      <View style={styles.therapyHeader}>
        <Text style={styles.therapyTitle}>AI Therapy Chatbot</Text>
        <View style={styles.therapyStats}>
          <Text style={styles.therapyConversations}>{aiTherapyStats.conversations}</Text>
          <Text style={styles.therapyLabel}>Conversations</Text>
        </View>
      </View>
      
      <View style={styles.therapyContent}>
        <View style={styles.therapyAvatar}>
          <Text style={styles.avatarEmoji}>🤖</Text>
        </View>
        <View style={styles.therapyInfo}>
          <Text style={styles.therapyTime}>{aiTherapyStats.todayMinutes} Min This Session</Text>
          <Text style={styles.therapyWeek}>{aiTherapyStats.thisWeek}</Text>
        </View>
        <TouchableOpacity style={styles.therapyButton}>
          <Text style={styles.therapyButtonIcon}>💬</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderMindfulArticles = () => (
    <View style={styles.articlesContainer}>
      <View style={styles.articlesHeader}>
        <Text style={styles.articlesTitle}>Mindful Articles</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.articlesGrid}>
        {mindfulArticles.map((article) => (
          <TouchableOpacity
            key={article.id}
            style={styles.articleCard}
            onPress={() => handleArticlePress(article)}
          >
            <LinearGradient
              colors={article.bgGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.articleGradient}
            >
              <Text style={styles.articleIcon}>{article.icon}</Text>
              <View style={styles.articleContent}>
                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.articleSubtitle}>{article.subtitle}</Text>
                <Text style={styles.articleReadTime}>📖 {article.readTime}</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const handleMetricPress = (metric) => {
    switch (metric.id) {
      case "freud-score":
        navigation.navigate('MentalHealthScore');
        break;
      case "mood-tracker":
        navigation.navigate('Mood');
        break;
      case "mindful-hours":
        navigation.navigate('MindfulHours');
        break;
      case "sleep-quality":
        navigation.navigate('SleepQuality');
        break;
      case "mindful-journal":
        navigation.navigate('MentalHealthJournal');
        break;
      case "stress-level":
        navigation.navigate('StressManagement');
        break;
      default:
        Alert.alert("Coming Soon", `${metric.title} feature is under development`);
    }
  };

  const handleArticlePress = (article) => {
    Alert.alert("Article", `Opening: ${article.title}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          {renderHeader()}

          {/* Mental Health Score */}
          {renderMentalHealthScore()}

          {/* Dashboard Metrics */}
          {renderDashboardMetrics()}

          {/* AI Therapy Section */}
          {renderAITherapySection()}

          {/* Mindful Articles */}
          {renderMindfulArticles()}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: freudDarkTheme.colors.background.primary,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    padding: freudDarkTheme.spacing[6],
    paddingTop: 60,
  },

  // Header
  header: {
    marginBottom: freudDarkTheme.spacing[6],
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: freudDarkTheme.spacing[2],
  },
  greeting: {
    fontSize: freudDarkTheme.typography.sizes.base,
    color: freudDarkTheme.colors.text.tertiary,
    fontWeight: freudDarkTheme.typography.weights.normal,
  },
  userName: {
    fontSize: freudDarkTheme.typography.sizes["2xl"],
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.bold,
    marginTop: freudDarkTheme.spacing[1],
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: freudDarkTheme.colors.card.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...freudDarkTheme.shadows.sm,
  },
  searchIcon: {
    fontSize: 18,
  },
  statusText: {
    fontSize: freudDarkTheme.typography.sizes.sm,
    color: freudDarkTheme.colors.text.tertiary,
    marginTop: freudDarkTheme.spacing[2],
  },

  // Mental Health Score Card
  scoreCard: {
    marginBottom: freudDarkTheme.spacing[6],
    borderRadius: freudDarkTheme.borderRadius.xl,
    overflow: 'hidden',
    ...freudDarkTheme.shadows.md,
  },
  scoreGradient: {
    padding: freudDarkTheme.spacing[6],
  },
  scoreHeader: {
    marginBottom: freudDarkTheme.spacing[4],
  },
  scoreInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreTitle: {
    fontSize: freudDarkTheme.typography.sizes.lg,
    color: '#FFFFFF',
    fontWeight: freudDarkTheme.typography.weights.semibold,
  },
  scoreMenuButton: {
    padding: freudDarkTheme.spacing[2],
  },
  scoreMenuText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: freudDarkTheme.typography.weights.bold,
  },
  scoreDisplay: {
    alignItems: 'center',
    marginBottom: freudDarkTheme.spacing[6],
  },
  scoreValue: {
    fontSize: freudDarkTheme.typography.sizes["6xl"],
    color: '#FFFFFF',
    fontWeight: freudDarkTheme.typography.weights.bold,
    marginBottom: freudDarkTheme.spacing[2],
  },
  scoreStatus: {
    fontSize: freudDarkTheme.typography.sizes.lg,
    color: '#FFFFFF',
    fontWeight: freudDarkTheme.typography.weights.medium,
    opacity: 0.9,
  },
  scoreHistoryButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreHistoryText: {
    fontSize: freudDarkTheme.typography.sizes.base,
    color: '#FFFFFF',
    fontWeight: freudDarkTheme.typography.weights.medium,
  },
  seeAllText: {
    fontSize: freudDarkTheme.typography.sizes.sm,
    color: '#FFFFFF',
    opacity: 0.8,
    fontWeight: freudDarkTheme.typography.weights.medium,
  },

  // Metrics
  metricsContainer: {
    marginBottom: freudDarkTheme.spacing[6],
  },
  metricsTitle: {
    fontSize: freudDarkTheme.typography.sizes.lg,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.semibold,
    marginBottom: freudDarkTheme.spacing[4],
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: freudDarkTheme.spacing[3],
  },
  metricCard: {
    width: (width - (freudDarkTheme.spacing[6] * 2) - freudDarkTheme.spacing[3]) / 2,
    padding: freudDarkTheme.spacing[4],
    borderRadius: freudDarkTheme.borderRadius.lg,
    ...freudDarkTheme.shadows.sm,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: freudDarkTheme.spacing[2],
  },
  metricIcon: {
    fontSize: 24,
  },
  metricValue: {
    fontSize: freudDarkTheme.typography.sizes.xl,
    fontWeight: freudDarkTheme.typography.weights.bold,
  },
  metricTitle: {
    fontSize: freudDarkTheme.typography.sizes.sm,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.medium,
    marginBottom: freudDarkTheme.spacing[1],
  },
  metricSubtitle: {
    fontSize: freudDarkTheme.typography.sizes.xs,
    color: freudDarkTheme.colors.text.tertiary,
    fontWeight: freudDarkTheme.typography.weights.normal,
  },

  // AI Therapy Section
  therapyCard: {
    backgroundColor: freudDarkTheme.colors.card.background,
    borderRadius: freudDarkTheme.borderRadius.lg,
    padding: freudDarkTheme.spacing[4],
    marginBottom: freudDarkTheme.spacing[6],
    ...freudDarkTheme.shadows.md,
  },
  therapyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: freudDarkTheme.spacing[4],
  },
  therapyTitle: {
    fontSize: freudDarkTheme.typography.sizes.lg,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.semibold,
  },
  therapyStats: {
    alignItems: 'flex-end',
  },
  therapyConversations: {
    fontSize: freudDarkTheme.typography.sizes.xl,
    color: freudDarkTheme.colors.accent.primary,
    fontWeight: freudDarkTheme.typography.weights.bold,
  },
  therapyLabel: {
    fontSize: freudDarkTheme.typography.sizes.xs,
    color: freudDarkTheme.colors.text.tertiary,
  },
  therapyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  therapyAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: freudDarkTheme.colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: freudDarkTheme.spacing[4],
  },
  avatarEmoji: {
    fontSize: 24,
  },
  therapyInfo: {
    flex: 1,
  },
  therapyTime: {
    fontSize: freudDarkTheme.typography.sizes.base,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.medium,
    marginBottom: freudDarkTheme.spacing[1],
  },
  therapyWeek: {
    fontSize: freudDarkTheme.typography.sizes.sm,
    color: freudDarkTheme.colors.text.tertiary,
  },
  therapyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: freudDarkTheme.colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  therapyButtonIcon: {
    fontSize: 18,
  },

  // Articles
  articlesContainer: {
    marginBottom: freudDarkTheme.spacing[6],
  },
  articlesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: freudDarkTheme.spacing[4],
  },
  articlesTitle: {
    fontSize: freudDarkTheme.typography.sizes.lg,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.semibold,
  },
  articlesGrid: {
    gap: freudDarkTheme.spacing[3],
  },
  articleCard: {
    borderRadius: freudDarkTheme.borderRadius.lg,
    overflow: 'hidden',
    ...freudDarkTheme.shadows.sm,
  },
  articleGradient: {
    flexDirection: 'row',
    padding: freudDarkTheme.spacing[4],
    alignItems: 'center',
  },
  articleIcon: {
    fontSize: 32,
    marginRight: freudDarkTheme.spacing[4],
  },
  articleContent: {
    flex: 1,
  },
  articleTitle: {
    fontSize: freudDarkTheme.typography.sizes.base,
    color: '#FFFFFF',
    fontWeight: freudDarkTheme.typography.weights.semibold,
    marginBottom: freudDarkTheme.spacing[1],
  },
  articleSubtitle: {
    fontSize: freudDarkTheme.typography.sizes.sm,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: freudDarkTheme.spacing[2],
    lineHeight: freudDarkTheme.typography.sizes.sm * 1.4,
  },
  articleReadTime: {
    fontSize: freudDarkTheme.typography.sizes.xs,
    color: '#FFFFFF',
    opacity: 0.8,
    fontWeight: freudDarkTheme.typography.weights.medium,
  },
});

export default DarkHomeScreen;