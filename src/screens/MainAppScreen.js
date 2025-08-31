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
  Animated,
  Linking,
  SafeAreaView,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import LinearGradient from 'expo-linear-gradient';

// Icons and UI Components
import { MentalHealthIcon } from '../components/icons';
import TherapeuticCard, { MindfulCard, EmpathyCard, CalmingCard, WisdomCard } from '../components/ui/TherapeuticCard';
import FloatingActionButton, { TherapyFAB } from '../components/ui/FloatingActionButton';
import { withErrorBoundary } from '../utils/ErrorBoundary';

// Dashboard Components  
import DailyInsights from "../components/dashboard/DailyInsights";
import MoodCheckIn from "../components/dashboard/MoodCheckIn";
import ProgressOverview from "../components/dashboard/ProgressOverview";
import QuickActions from "../components/dashboard/QuickActions";
import RecentActivity from "../components/dashboard/RecentActivity";
import WelcomeHeader from "../components/dashboard/WelcomeHeader";

// Theme and Design System
import { useTheme } from "../shared/theme/ThemeContext";
import FreudDesignSystem, { 
  FreudColors, 
  FreudSpacing, 
  FreudTypography, 
  FreudShadows, 
  FreudBorderRadius 
} from '../shared/theme/FreudDesignSystem';

// Therapeutic Tips for daily wellness guidance
const THERAPEUTIC_TIPS = [
  {
    tip: "Take three deep breaths and notice how your body feels in this moment",
    category: "Mindfulness",
    icon: "Mindfulness",
    color: FreudColors.serenityGreen[50]
  },
  {
    tip: "Practice the 5-4-3-2-1 grounding technique to center yourself",
    category: "Grounding", 
    icon: "Therapy",
    color: FreudColors.mindfulBrown[50]
  },
  {
    tip: "Remember: it's okay to not be okay. Your feelings are valid",
    category: "Self-Compassion",
    icon: "Heart",
    color: FreudColors.kindPurple[50]
  },
  {
    tip: "Journal three things you're grateful for today",
    category: "Gratitude",
    icon: "Journal", 
    color: FreudColors.empathyOrange[50]
  },
  {
    tip: "Connect with someone you care about today",
    category: "Connection",
    icon: "Heart",
    color: FreudColors.zenYellow[50]
  },
];

// Simple daily tip card component using therapeutic card variants

// Daily tip card component using therapeutic card system
const DailyTipCard = ({ tip, isDarkMode }) => (
  <WisdomCard
    title="Daily Therapeutic Insight"
    subtitle={tip.category}
    icon={tip.icon}
    variant="gradient"
    gradientColors={[tip.color + '20', tip.color + '10']}
    iconColor={tip.color}
  >
    <Text style={[
      styles.tipText, 
      { color: isDarkMode ? FreudDesignSystem.themes.dark.colors.text.primary : FreudDesignSystem.themes.light.colors.text.primary }
    ]}>
      {tip.tip}
    </Text>
  </WisdomCard>
);

const MainAppScreen = () => {
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
      const randomTip = THERAPEUTIC_TIPS[Math.floor(Math.random() * THERAPEUTIC_TIPS.length)];
      setCurrentTip(randomTip);
      
      await fetchData();
    } catch (error) {
      // Error already handled in fetchData
    } finally {
      setRefreshing(false);
    }
  }, [fetchData]);

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
    const randomTip = THERAPEUTIC_TIPS[Math.floor(Math.random() * THERAPEUTIC_TIPS.length)];
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
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? FreudColors.optimisticGray[100] : '#FFFFFF' }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent={true}
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
              progressBackgroundColor={isDarkMode ? FreudColors.optimisticGray[90] : '#FFFFFF'}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Header */}
          <TherapeuticCard variant="elevated">
            <WelcomeHeader
              greeting={greeting}
              userName={user?.profile?.name || "Friend"}
              onProfilePress={handleViewProfile}
              onEmergencyPress={showEmergencyAlert}
            />
          </TherapeuticCard>

          {/* Daily Therapeutic Tip */}
          <DailyTipCard tip={currentTip} isDarkMode={isDarkMode} />

          {/* Mood Check-in */}
          <MindfulCard
            title="How are you feeling today?"
            subtitle="Take a moment to check in with yourself"
            icon="Heart"
          >
            <MoodCheckIn
              currentMood={mood?.currentMood}
              onCheckIn={handleMoodCheckIn}
              compact={true}
            />
          </MindfulCard>

          {/* Quick Actions */}
          <EmpathyCard>
            <QuickActions
              onStartChat={handleStartChat}
              onTakeAssessment={handleTakeAssessment}
              onMoodTracker={handleMoodCheckIn}
            />
          </EmpathyCard>

          {/* Daily Insights */}
          <CalmingCard
            title="Personal Insights"
            subtitle="Discover patterns in your wellbeing"
            icon="Insights"
          >
            <DailyInsights insights={mood?.insights} />
          </CalmingCard>

          {/* Progress Overview */}
          <MindfulCard
            title="Your Progress"
            subtitle="Celebrating your journey"
            icon="Brain"
          >
            <ProgressOverview
              weeklyStats={mood?.weeklyStats}
              userStats={user?.stats}
            />
          </MindfulCard>

          {/* Recent Activity */}
          <WisdomCard
            title="Recent Activity"
            subtitle="Your wellness timeline"
            icon="Journal"
          >
            <RecentActivity
              moodHistory={moodHistorySlice}
              chatHistory={chatHistorySlice}
            />
          </WisdomCard>

          {/* Bottom spacing for FAB */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </Animated.View>

      {/* Floating Action Button */}
      <TherapyFAB onPress={handleStartChat} />
    </SafeAreaView>
  );
};

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
  
  // Daily Tip Card
  tipText: {
    fontSize: FreudTypography.sizes.base,
    lineHeight: FreudTypography.sizes.base * FreudTypography.lineHeights.relaxed,
    fontWeight: FreudTypography.weights.normal,
  },
  
  // Spacing
  bottomSpacing: {
    height: 80,
  },
});

export default withErrorBoundary(MainAppScreen, {
  fallback: ({ error, retry, goHome }) => (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 20 }}>
        Something went wrong with the main dashboard
      </Text>
      <TouchableOpacity 
        onPress={retry}
        style={{ backgroundColor: '#007AFF', padding: 12, borderRadius: 8, marginBottom: 10 }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Try Again</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={goHome}
        style={{ backgroundColor: '#666', padding: 12, borderRadius: 8 }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Go Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
});

// Export therapeutic tips for use in other components
export { THERAPEUTIC_TIPS };