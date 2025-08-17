import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
  BackHandler,
  StatusBar,
  Dimensions,
  Animated,
  Linking,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import DailyInsights from "../components/dashboard/DailyInsights";
import MoodCheckIn from "../components/dashboard/MoodCheckIn";
import ProgressOverview from "../components/dashboard/ProgressOverview";
import QuickActions from "../components/dashboard/QuickActions";
import RecentActivity from "../components/dashboard/RecentActivity";
import WelcomeHeader from "../components/dashboard/WelcomeHeader";
import {
  MentalHealthIcon,
  NavigationIcon,
  ActionIcon,
} from "../components/icons";
import { useTheme } from "../shared/theme/ThemeContext";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from "../shared/theme/theme";
import { MentalHealthAccessibility } from "../utils/accessibility";

// Enhanced Components

const { width, height } = Dimensions.get("window");

const MainAppScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [currentSection, setCurrentSection] = useState("dashboard");

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;

  // Handle focus effect for screen
  useFocusEffect(
    useCallback(() => {
      // Reset animations when screen comes into focus
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

      return () => {
        // Cleanup when screen loses focus
        fadeAnim.setValue(0);
        slideAnim.setValue(20);
      };
    }, [fadeAnim, slideAnim]),
  );

  // Handle hardware back button on Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
          return true;
        }
        return false;
      },
    );

    return () => backHandler.remove();
  }, [navigation]);

  const { user, mood, chat, loading } = useSelector((state) => ({
    user: state.user || { profile: { name: "Friend" }, stats: {} },
    mood: state.mood || {
      currentMood: null,
      insights: [],
      weeklyStats: {},
      moodHistory: [],
    },
    chat: state.chat || { conversations: [] },
    loading: state.mood?.loading || state.user?.loading || false,
  }));

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      // Simulate data fetching
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Failed to fetch app data:", error);
      setError(
        "Unable to load app data. Please check your connection and try again.",
      );
      Alert.alert(
        "Data Load Error",
        "We couldn't load your app data. Please check your internet connection and try again.",
        [
          { text: "Retry", onPress: () => fetchData() },
          { text: "OK", style: "cancel" },
        ],
      );
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      await fetchData();
    } catch (error) {
      // Error already handled in fetchData
    } finally {
      setRefreshing(false);
    }
  }, [fetchData]);

  const handleMoodCheckIn = useCallback(() => {
    navigation.navigate("Mood");
  }, [navigation]);

  const handleStartChat = useCallback(() => {
    navigation.navigate("Chat");
  }, [navigation]);

  const handleTakeAssessment = useCallback(() => {
    navigation.navigate("Assessment");
  }, [navigation]);

  const handleViewProfile = useCallback(() => {
    navigation.navigate("Profile");
  }, [navigation]);

  const showEmergencyAlert = useCallback(() => {
    Alert.alert(
      "Emergency Resources",
      "If you are experiencing a mental health crisis, please contact:\n\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• Or call 911 for immediate assistance",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Call 988",
          onPress: async () => {
            try {
              const supported = await Linking.canOpenURL("tel:988");
              if (supported) {
                await Linking.openURL("tel:988");
              } else {
                Alert.alert(
                  "Unable to Call",
                  "Your device cannot make phone calls. Please dial 988 manually or contact emergency services.",
                  [{ text: "OK" }],
                );
              }
            } catch (error) {
              console.error("Error making emergency call:", error);
              Alert.alert(
                "Call Error",
                "Unable to place call. Please dial 988 manually for immediate assistance.",
                [{ text: "OK" }],
              );
            }
          },
        },
        {
          text: "Text Crisis Line",
          onPress: async () => {
            try {
              const supported = await Linking.canOpenURL("sms:741741");
              if (supported) {
                await Linking.openURL("sms:741741?body=HOME");
              } else {
                Alert.alert(
                  "Unable to Text",
                  "Your device cannot send text messages. Please text HOME to 741741 manually.",
                  [{ text: "OK" }],
                );
              }
            } catch (error) {
              console.error("Error opening text messaging:", error);
              Alert.alert(
                "Text Error",
                "Unable to open messaging. Please text HOME to 741741 manually.",
                [{ text: "OK" }],
              );
            }
          },
        },
      ],
    );
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const getTimeBasedGradient = () => {
    const hour = new Date().getHours();
    if (hour < 12)
      return [
        theme.colors.therapeutic.energizing[200],
        theme.colors.therapeutic.calming[200],
      ];
    if (hour < 17)
      return [
        theme.colors.therapeutic.calming[200],
        theme.colors.therapeutic.peaceful[200],
      ];
    return [
      theme.colors.therapeutic.peaceful[300],
      theme.colors.therapeutic.grounding[200],
    ];
  };

  // Enhanced floating action button
  const FloatingActionButton = () => (
    <Animated.View
      style={[
        styles.fab,
        {
          opacity: fadeAnim,
          transform: [{ scale: fadeAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.fabButton}
        onPress={handleStartChat}
        activeOpacity={0.8}
        accessible
        accessibilityRole="button"
        accessibilityLabel="Start Chat"
        accessibilityHint="Double tap to start a new therapy session"
      >
        <LinearGradient
          colors={[
            theme.colors.therapeutic.calming[500],
            theme.colors.therapeutic.peaceful[500],
          ]}
          style={styles.fabGradient}
        >
          <MentalHealthIcon
            name="Therapy"
            size="lg"
            color={colors.text.inverse}
            variant="outline"
            strokeWidth={2}
          />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  // Enhanced wellness tips component
  const WellnessTips = () => {
    const tips = [
      {
        icon: "🌱",
        title: "Mindful Moment",
        tip: "Take 3 deep breaths and notice your surroundings",
      },
      {
        icon: "💧",
        title: "Stay Hydrated",
        tip: "Drink a glass of water to refresh your mind",
      },
      {
        icon: "🚶",
        title: "Move Gently",
        tip: "Take a short walk or do light stretching",
      },
      {
        icon: "📖",
        title: "Gratitude",
        tip: "Think of one thing you're grateful for today",
      },
    ];

    const [currentTip] = useState(
      tips[Math.floor(Math.random() * tips.length)],
    );

    return (
      <Animated.View
        style={[
          styles.wellnessTipContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={[
            theme.colors.therapeutic.nurturing[100],
            theme.colors.therapeutic.nurturing[50],
          ]}
          style={[styles.wellnessTipCard, shadows.md]}
        >
          <View style={styles.wellnessTipIcon}>
            <Text 
              style={styles.wellnessTipEmoji}
              accessibilityElementsHidden={true}
              importantForAccessibility="no"
            >
              {currentTip.icon}
            </Text>
          </View>
          <View style={styles.wellnessTipContent}>
            <Text
              style={[
                styles.wellnessTipTitle,
                { color: theme.colors.text.primary },
              ]}
            >
              {currentTip.title}
            </Text>
            <Text
              style={[
                styles.wellnessTipText,
                { color: theme.colors.text.secondary },
              ]}
            >
              {currentTip.tip}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  const moodHistorySlice = useMemo(
    () => mood?.moodHistory?.slice(0, 3) || [],
    [mood.moodHistory],
  );
  const chatHistorySlice = useMemo(
    () => chat?.conversations?.slice(0, 2) || [],
    [chat.conversations],
  );

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle={theme.isDark ? "light-content" : "dark-content"}
      />

      {/* Background Gradient */}
      <LinearGradient
        colors={getTimeBasedGradient()}
        style={styles.backgroundGradient}
      />

      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={loading || refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary[500]]}
              tintColor={theme.colors.primary[500]}
              progressBackgroundColor={theme.colors.background.primary}
              accessibilityLabel="Pull to refresh app content"
            />
          }
          showsVerticalScrollIndicator={false}
          accessibilityRole="scrollbar"
          accessibilityLabel="Main app content"
        >
          {/* Enhanced Welcome Header */}
          <WelcomeHeader
            greeting={greeting}
            userName={user?.profile?.name || "Friend"}
            onProfilePress={handleViewProfile}
            onEmergencyPress={showEmergencyAlert}
            {...MentalHealthAccessibility.dashboard.welcomeMessage(
              user?.profile?.name || "Friend",
            )}
          />

          {/* Wellness Tip of the Day */}
          <WellnessTips />

          {/* Mood Check-in */}
          <MoodCheckIn
            currentMood={mood?.currentMood}
            onCheckIn={handleMoodCheckIn}
          />

          {/* Daily Insights */}
          <DailyInsights insights={mood?.insights} />

          {/* Quick Actions */}
          <QuickActions
            onStartChat={handleStartChat}
            onTakeAssessment={handleTakeAssessment}
            onMoodTracker={handleMoodCheckIn}
          />

          {/* Progress Overview */}
          <ProgressOverview
            weeklyStats={mood?.weeklyStats}
            userStats={user?.stats}
          />

          {/* Recent Activity */}
          <RecentActivity
            moodHistory={moodHistorySlice}
            chatHistory={chatHistorySlice}
          />

          {/* Bottom spacing for FAB */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </Animated.View>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing[20],
  },
  wellnessTipContainer: {
    marginHorizontal: spacing[4],
    marginVertical: spacing[2],
  },
  wellnessTipCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing[4],
    borderRadius: borderRadius.lg,
  },
  wellnessTipIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing[3],
  },
  wellnessTipEmoji: {
    fontSize: typography.sizes["2xl"],
  },
  wellnessTipContent: {
    flex: 1,
  },
  wellnessTipTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semiBold,
    lineHeight: typography.lineHeights.base,
    marginBottom: spacing[1],
  },
  wellnessTipText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.sm,
    opacity: 0.8,
  },
  fab: {
    position: "absolute",
    right: spacing[5],
    bottom: spacing[8],
  },
  fabButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSpacing: {
    height: spacing[20],
  },
});

export default MainAppScreen;
