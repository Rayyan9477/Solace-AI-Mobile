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

// Performance and Accessibility - Simplified
// import { usePerformanceOptimizer } from "../utils/PerformanceOptimizer"; // Temporarily disabled
// import { useAccessibility } from "../utils/AccessibilityEnhancer"; // Temporarily disabled

// Simple Components - Temporarily using basic components
const DailyInsights = ({ insights }) => (
  <View style={{ padding: 16, backgroundColor: "#f0f9ff", borderRadius: 8, margin: 8 }}>
    <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>Daily Insights</Text>
    <Text>Your mental health journey continues...</Text>
  </View>
);

const DailyTipCard = ({ tip, onRefresh }) => (
  <TouchableOpacity 
    style={{ padding: 16, backgroundColor: "#e0f2fe", borderRadius: 8, margin: 8 }}
    onPress={onRefresh}
  >
    <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>{tip?.category || "Daily Tip"}</Text>
    <Text style={{ fontSize: 14, lineHeight: 20 }}>{tip?.tip || "Take a moment to breathe deeply and center yourself."}</Text>
  </TouchableOpacity>
);

const WelcomeSection = ({ children }) => <View style={{ margin: 8 }}>{children}</View>;
const MoodSection = ({ children }) => <View style={{ margin: 8 }}>{children}</View>;
const ActionsSection = ({ children }) => <View style={{ margin: 8 }}>{children}</View>;
const InsightsSection = ({ children }) => <View style={{ margin: 8 }}>{children}</View>;
const ProgressSection = ({ children }) => <View style={{ margin: 8 }}>{children}</View>;
const ActivitySection = ({ children }) => <View style={{ margin: 8 }}>{children}</View>;

const MoodCheckIn = ({ currentMood, onCheckIn }) => (
  <TouchableOpacity 
    style={{ padding: 16, backgroundColor: "#dcfce7", borderRadius: 8 }}
    onPress={onCheckIn}
  >
    <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>Mood Check-in</Text>
    <Text style={{ fontSize: 14 }}>How are you feeling today?</Text>
    <View style={{ flexDirection: "row", marginTop: 12, gap: 8 }}>
      {["😢", "😕", "😐", "🙂", "😊"].map((emoji, index) => (
        <TouchableOpacity key={index} style={{ padding: 8 }}>
          <Text style={{ fontSize: 24 }}>{emoji}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </TouchableOpacity>
);

const ProgressOverview = ({ weeklyStats, userStats }) => (
  <View style={{ padding: 16, backgroundColor: "#fef3c7", borderRadius: 8 }}>
    <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>Your Progress</Text>
    <Text style={{ fontSize: 14 }}>You're making great strides in your wellness journey!</Text>
  </View>
);

const QuickActions = ({ onStartChat, onTakeAssessment, onMoodTracker }) => (
  <View style={{ padding: 16 }}>
    <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16 }}>Quick Actions</Text>
    <View style={{ gap: 12 }}>
      <TouchableOpacity 
        style={{ padding: 12, backgroundColor: "#3b82f6", borderRadius: 8 }}
        onPress={onStartChat}
      >
        <Text style={{ color: "white", fontWeight: "600", textAlign: "center" }}>Start Chat Session</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={{ padding: 12, backgroundColor: "#10b981", borderRadius: 8 }}
        onPress={onTakeAssessment}
      >
        <Text style={{ color: "white", fontWeight: "600", textAlign: "center" }}>Take Assessment</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={{ padding: 12, backgroundColor: "#f59e0b", borderRadius: 8 }}
        onPress={onMoodTracker}
      >
        <Text style={{ color: "white", fontWeight: "600", textAlign: "center" }}>Track Mood</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const RecentActivity = ({ moodHistory, chatHistory }) => (
  <View style={{ padding: 16, backgroundColor: "#f3f4f6", borderRadius: 8 }}>
    <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>Recent Activity</Text>
    <Text style={{ fontSize: 14 }}>Your recent wellness activities...</Text>
  </View>
);

const WelcomeHeader = ({ greeting, userName, onProfilePress, onEmergencyPress }) => (
  <View style={{ padding: 20, backgroundColor: "#6366f1", borderRadius: 12 }}>
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, color: "white", marginBottom: 4 }}>{greeting}</Text>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "white", marginBottom: 8 }}>{userName}</Text>
        <Text style={{ fontSize: 14, color: "white", opacity: 0.9 }}>How are you feeling today?</Text>
      </View>
      <View style={{ gap: 8 }}>
        <TouchableOpacity 
          onPress={onProfilePress}
          style={{ width: 48, height: 48, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 24, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 18, color: "white" }}>👤</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={onEmergencyPress}
          style={{ width: 48, height: 48, backgroundColor: "#ef4444", borderRadius: 24, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 18, color: "white" }}>🚨</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const TherapyFAB = ({ onPress }) => (
  <TouchableOpacity 
    style={{ 
      position: "absolute", 
      bottom: 20, 
      right: 20, 
      width: 56, 
      height: 56, 
      backgroundColor: "#3b82f6", 
      borderRadius: 28, 
      justifyContent: "center", 
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    }}
    onPress={onPress}
  >
    <Text style={{ fontSize: 24, color: "white" }}>💬</Text>
  </TouchableOpacity>
);

// Theme and Design System
import { useTheme } from "../design-system/theme/ThemeProvider";
// Simple error boundary wrapper
const withErrorBoundary = (Component, options = {}) => {
  return React.forwardRef((props, ref) => {
    try {
      return <Component {...props} ref={ref} />;
    } catch (error) {
      console.error('Component error:', error);
      return options.fallback ? 
        options.fallback({ error, retry: () => window.location.reload() }) :
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 20 }}>Something went wrong</Text>
          <TouchableOpacity 
            onPress={() => window.location?.reload?.()}
            style={{ padding: 12, backgroundColor: '#3b82f6', borderRadius: 8 }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Reload</Text>
          </TouchableOpacity>
        </View>;
    }
  });
};

// Therapeutic Tips for daily wellness guidance
const THERAPEUTIC_TIPS = [
  {
    tip: "Take three deep breaths and notice how your body feels in this moment",
    category: "Mindfulness",
    icon: "Mindfulness",
    color: "#22c55e",
  },
  {
    tip: "Practice the 5-4-3-2-1 grounding technique to center yourself",
    category: "Grounding",
    icon: "Therapy",
    color: "#8b5cf6",
  },
  {
    tip: "Remember: it's okay to not be okay. Your feelings are valid",
    category: "Self-Compassion",
    icon: "Heart",
    color: "#f59e0b",
  },
  {
    tip: "Journal three things you're grateful for today",
    category: "Gratitude",
    icon: "Journal",
    color: "#10b981",
  },
  {
    tip: "Connect with someone you care about today",
    category: "Connection",
    icon: "Heart",
    color: "#6366f1",
  },
];

// Simple daily tip card component using therapeutic card variants

// Memoized tip refresh handler
const TipRefreshHandler = memo(({ onRefresh }) => {
  return { onRefresh };
});

TipRefreshHandler.displayName = "TipRefreshHandler";

const MainAppScreen = memo(() => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { theme, isDarkMode } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [currentTip, setCurrentTip] = useState(THERAPEUTIC_TIPS[0]);

  // Performance and accessibility hooks - Simplified
  const performance = {
    addAnimation: () => {},
    cleanup: () => {},
    measureAsyncOperation: async (name, fn) => await fn(),
    addSubscription: () => {},
  };
  const accessibility = {
    getAnimationDuration: (duration) => duration,
    announceLoadingStart: () => {},
    announceLoadingComplete: () => {},
    announceError: () => {},
  };

  // Simple animation for screen entrance
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Handle focus effect for screen
  useFocusEffect(
    useCallback(() => {
      const animation = Animated.timing(fadeAnim, {
        toValue: 1,
        duration: accessibility.getAnimationDuration(600),
        useNativeDriver: true,
      });
      
      performance.addAnimation(animation);
      animation.start();

      return () => {
        fadeAnim.setValue(0);
        performance.cleanup();
      };
    }, [fadeAnim, accessibility, performance]),
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

    performance.addSubscription(backHandler);

    return () => {
      performance.cleanup();
    };
  }, [navigation, performance]);

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
    accessibility.announceLoadingStart("Refreshing dashboard");
    
    try {
      setRefreshing(true);

      // Update therapeutic tip
      const randomTip =
        THERAPEUTIC_TIPS[Math.floor(Math.random() * THERAPEUTIC_TIPS.length)];
      setCurrentTip(randomTip);

      await performance.measureAsyncOperation('fetchData', fetchData);
      
      accessibility.announceLoadingComplete("Dashboard refreshed");
    } catch (error) {
      accessibility.announceError("Failed to refresh dashboard");
    } finally {
      setRefreshing(false);
    }
  }, [fetchData, performance, accessibility]);

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
          backgroundColor: theme.colors.background.primary,
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
              tintColor={theme.palette.therapeutic.growth}
              colors={[theme.palette.therapeutic.growth]}
              progressBackgroundColor={theme.colors.background.primary}
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

MainAppScreen.displayName = "MainAppScreen";

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
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  // Spacing
  bottomSpacing: {
    height: 80,
  },
});

MainAppScreen.displayName = "MainAppScreen";

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
