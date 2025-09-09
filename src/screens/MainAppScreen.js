import { useNavigation, useFocusEffect } from "@react-navigation/native";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  memo,
} from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
  BackHandler,
  StatusBar,
  Animated,
  Linking,
  SafeAreaView,
  Text,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

// Optimized Components
import DailyInsights from "../components/dashboard/DailyInsights";
import MoodCheckIn from "../components/dashboard/MoodCheckIn";
import ProgressOverview from "../components/dashboard/ProgressOverview";
import QuickActions from "../components/dashboard/QuickActions";
import RecentActivity from "../components/dashboard/RecentActivity";
import WelcomeHeader from "../components/dashboard/WelcomeHeader";
import DailyTipCard from "../components/dashboard/DailyTipCard";
import {
  WelcomeSection,
  MoodSection,
  ActionsSection,
  InsightsSection,
  ProgressSection,
  ActivitySection,
} from "../components/dashboard/DashboardSection";
import { TherapyFAB } from "../components/ui/FloatingActionButton";

// Theme and Design System
import FreudDesignSystem, {
  FreudColors,
  FreudSpacing,
} from "../shared/theme/FreudDesignSystem";
import { useTheme } from "../shared/theme/UnifiedThemeProvider";
import { withErrorBoundary } from "../utils/ErrorBoundary";

// Therapeutic Tips for daily wellness guidance
const THERAPEUTIC_TIPS = [
  {
    tip: "Take three deep breaths and notice how your body feels in this moment",
    category: "Mindfulness",
    icon: "Mindfulness",
    color: FreudColors.serenityGreen[50],
  },
  {
    tip: "Practice the 5-4-3-2-1 grounding technique to center yourself",
    category: "Grounding",
    icon: "Therapy",
    color: FreudColors.mindfulBrown[50],
  },
  {
    tip: "Remember: it's okay to not be okay. Your feelings are valid",
    category: "Self-Compassion",
    icon: "Heart",
    color: FreudColors.kindPurple[50],
  },
  {
    tip: "Journal three things you're grateful for today",
    category: "Gratitude",
    icon: "Journal",
    color: FreudColors.empathyOrange[50],
  },
  {
    tip: "Connect with someone you care about today",
    category: "Connection",
    icon: "Heart",
    color: FreudColors.zenYellow[50],
  },
];

// Simple daily tip card component using therapeutic card variants

// Memoized tip refresh handler
const TipRefreshHandler = memo(({ onRefresh }) => {
  return { onRefresh };
});

TipRefreshHandler.displayName = 'TipRefreshHandler';

const MainAppScreen = memo(() => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { theme, isDarkMode } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [currentTip, setCurrentTip] = useState(THERAPEUTIC_TIPS[0]);

  // Simple animation for screen entrance
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Handle focus effect for screen
  useFocusEffect(
    useCallback(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();

      return () => {
        fadeAnim.setValue(0);
      };
    }, [fadeAnim]),
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

  // Get user data from Redux store with fallbacks
  const { user, mood, chat } = useSelector((state) => ({
    user: state.user || { profile: { name: "Friend" }, stats: {} },
    mood: state.mood || {
      currentMood: null,
      insights: [],
      weeklyStats: {},
      moodHistory: [],
    },
    chat: state.chat || { conversations: [] },
  }));

  // Simple data fetch function
  const fetchData = useCallback(async () => {
    try {
      // Simulate data fetching
      await new Promise((resolve) => setTimeout(resolve, 800));
    } catch (error) {
      console.error("Failed to fetch app data:", error);
      Alert.alert(
        "Connection Error",
        "Unable to refresh your data. Please check your connection and try again.",
        [{ text: "OK", style: "cancel" }],
      );
    }
  }, []);

  // Handle refresh with gentle feedback
  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);

      // Update therapeutic tip
      const randomTip =
        THERAPEUTIC_TIPS[Math.floor(Math.random() * THERAPEUTIC_TIPS.length)];
      setCurrentTip(randomTip);

      await fetchData();
    } catch (error) {
      // Error already handled in fetchData
    } finally {
      setRefreshing(false);
    }
  }, [fetchData]);

  // Handle tip refresh separately for better performance
  const handleTipRefresh = useCallback(() => {
    const randomTip =
      THERAPEUTIC_TIPS[Math.floor(Math.random() * THERAPEUTIC_TIPS.length)];
    setCurrentTip(randomTip);
  }, []);

  // Navigation handlers
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

  // Emergency support handler
  const showEmergencyAlert = useCallback(() => {
    Alert.alert(
      "🚨 Emergency Crisis Support",
      "If you are experiencing a mental health crisis, please contact:\n\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• Or call 911 for immediate assistance\n\nYou are not alone. Help is available 24/7.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Call 988 Now",
          style: "default",
          onPress: async () => {
            try {
              const supported = await Linking.canOpenURL("tel:988");
              if (supported) {
                await Linking.openURL("tel:988");
              } else {
                Alert.alert(
                  "Unable to Call",
                  "Please dial 988 manually or contact emergency services.",
                );
              }
            } catch (error) {
              Alert.alert(
                "Call Error",
                "Please dial 988 manually for immediate assistance.",
              );
            }
          },
        },
      ],
    );
  }, []);

  // Time-based greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  // Initialize therapeutic tip on mount
  useEffect(() => {
    const randomTip =
      THERAPEUTIC_TIPS[Math.floor(Math.random() * THERAPEUTIC_TIPS.length)];
    setCurrentTip(randomTip);
  }, []);

  // Prepare sliced data for components
  const moodHistorySlice = useMemo(
    () => mood?.moodHistory?.slice(0, 3) || [],
    [mood.moodHistory],
  );
  const chatHistorySlice = useMemo(
    () => chat?.conversations?.slice(0, 2) || [],
    [chat.conversations],
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode
            ? FreudColors.optimisticGray[100]
            : "#FFFFFF",
        },
      ]}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={FreudColors.serenityGreen[60]}
              colors={[FreudColors.serenityGreen[60]]}
              progressBackgroundColor={
                isDarkMode ? FreudColors.optimisticGray[90] : "#FFFFFF"
              }
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Header */}
          <WelcomeSection>
            <WelcomeHeader
              greeting={greeting}
              userName={user?.profile?.name || "Friend"}
              onProfilePress={handleViewProfile}
              onEmergencyPress={showEmergencyAlert}
            />
          </WelcomeSection>

          {/* Daily Therapeutic Tip */}
          <DailyTipCard tip={currentTip} onRefresh={handleTipRefresh} />

          {/* Mood Check-in */}
          <MoodSection>
            <MoodCheckIn
              currentMood={mood?.currentMood}
              onCheckIn={handleMoodCheckIn}
              compact
            />
          </MoodSection>

          {/* Quick Actions */}
          <ActionsSection>
            <QuickActions
              onStartChat={handleStartChat}
              onTakeAssessment={handleTakeAssessment}
              onMoodTracker={handleMoodCheckIn}
            />
          </ActionsSection>

          {/* Daily Insights */}
          <InsightsSection>
            <DailyInsights insights={mood?.insights} />
          </InsightsSection>

          {/* Progress Overview */}
          <ProgressSection>
            <ProgressOverview
              weeklyStats={mood?.weeklyStats}
              userStats={user?.stats}
            />
          </ProgressSection>

          {/* Recent Activity */}
          <ActivitySection>
            <RecentActivity
              moodHistory={moodHistorySlice}
              chatHistory={chatHistorySlice}
            />
          </ActivitySection>

          {/* Bottom spacing for FAB */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </Animated.View>

      {/* Floating Action Button */}
      <TherapyFAB onPress={handleStartChat} />
    </SafeAreaView>
  );
});

MainAppScreen.displayName = 'MainAppScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
    paddingTop: FreudSpacing[2],
    paddingHorizontal: FreudSpacing[4],
  },
  // Spacing
  bottomSpacing: {
    height: 80,
  },
});

MainAppScreen.displayName = 'MainAppScreen';

export default withErrorBoundary(MainAppScreen, {
  fallback: ({ error, retry, goHome }) => (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 18, textAlign: "center", marginBottom: 20 }}>
        Something went wrong with the main dashboard
      </Text>
      <TouchableOpacity
        onPress={retry}
        style={{
          backgroundColor: "#007AFF",
          padding: 12,
          borderRadius: 8,
          marginBottom: 10,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Try Again</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={goHome}
        style={{ backgroundColor: "#666", padding: 12, borderRadius: 8 }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Go Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  ),
});

// Export therapeutic tips for use in other components
export { THERAPEUTIC_TIPS };
