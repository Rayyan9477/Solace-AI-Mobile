import { useNavigation, useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

// Modern Components
import AdvancedShadersContainer from "../components/advanced/AdvancedShadersContainer";

// Enhanced Dashboard Components
import DailyInsights from "../components/dashboard/DailyInsights";
import MoodCheckIn from "../components/dashboard/MoodCheckIn";
import ProgressOverview from "../components/dashboard/ProgressOverview";
import QuickActions from "../components/dashboard/QuickActions";
import RecentActivity from "../components/dashboard/RecentActivity";
import WelcomeHeader from "../components/dashboard/WelcomeHeader";

// Icons and Theme
import { MentalHealthIcon } from "../components/icons";
import ModernButton from "../components/modern/ModernButton";
import ModernCard from "../components/modern/ModernCard";
import { useTheme } from "../shared/theme/ThemeContext";
import {
  modernDarkColors,
  modernTypography,
  modernSpacing,
  modernBorderRadius,
  modernShadows,
  modernAnimations,
} from "../shared/theme/darkTheme";

const { width, height } = Dimensions.get("window");

// Modern Main App Screen - Dark, Elegant, and Engaging
// Features advanced shader effects, micro-interactions, and premium design
const ModernMainAppScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  // Advanced animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const parallaxAnim = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  // Handle focus effect with sophisticated animations
  useFocusEffect(
    useCallback(() => {
      // Reset and start animations
      Animated.stagger(100, [
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: modernAnimations.timing.slow,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          ...modernAnimations.spring.gentle,
          useNativeDriver: true,
        }),
      ]).start();

      return () => {
        fadeAnim.setValue(0);
        slideAnim.setValue(30);
      };
    }, [fadeAnim, slideAnim]),
  );

  // Redux state
  const { user, mood, chat, loading } = useSelector((state) => ({
    user: state.user || { profile: { name: "Welcome" }, stats: {} },
    mood: state.mood || {
      currentMood: null,
      insights: [],
      weeklyStats: {},
      moodHistory: [],
    },
    chat: state.chat || { conversations: [] },
    loading: state.mood?.loading || state.user?.loading || false,
  }));

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

  const showEmergencyAlert = useCallback(() => {
    // Emergency alert implementation
    console.log("Emergency support activated");
  }, []);

  // Refresh handler
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  }, []);

  // Parallax scroll handler
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
      listener: (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        parallaxAnim.setValue(offsetY);

        // Header opacity based on scroll
        headerOpacity.setValue(Math.max(0, 1 - offsetY / 200));
      },
    },
  );

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Enhanced Floating Action Button
  const EnhancedFAB = () => (
    <Animated.View
      style={[
        styles.fab,
        {
          opacity: fadeAnim,
          transform: [
            { scale: fadeAnim },
            {
              translateY: parallaxAnim.interpolate({
                inputRange: [0, 100],
                outputRange: [0, -20],
                extrapolate: "clamp",
              }),
            },
          ],
        },
      ]}
    >
      <ModernButton
        title="Start Session"
        variant="neon"
        size="large"
        animated
        glowEffect
        shaderEffect
        morphEffect
        icon="Therapy"
        onPress={handleStartChat}
        style={styles.fabButton}
        testID="start-therapy-fab"
        accessibilityLabel="Start AI Therapy Session"
      />
    </Animated.View>
  );

  // Premium Wellness Tip Component
  const ModernWellnessTip = () => {
    const tips = [
      {
        icon: "🧠",
        title: "Neural Pathways",
        tip: "Practice mindful breathing to strengthen emotional regulation pathways",
        color: modernDarkColors.therapeutic.peaceful.primary,
      },
      {
        icon: "✨",
        title: "Quantum Healing",
        tip: "Small positive actions create ripples of wellbeing throughout your day",
        color: modernDarkColors.therapeutic.calming.primary,
      },
      {
        icon: "🌊",
        title: "Flow State",
        tip: "Embrace the present moment - it's where your power resides",
        color: modernDarkColors.therapeutic.nurturing.primary,
      },
      {
        icon: "🔮",
        title: "Inner Vision",
        tip: "Visualize your ideal mental state for 30 seconds",
        color: modernDarkColors.therapeutic.grounding.primary,
      },
    ];

    const [currentTip] = useState(
      tips[Math.floor(Math.random() * tips.length)],
    );

    return (
      <ModernCard
        variant="holographic"
        elevation="floating"
        animated
        glowEffect
        shaderVariant="holographic"
        style={styles.wellnessTipCard}
      >
        <View style={styles.wellnessTipContent}>
          <View
            style={[
              styles.wellnessTipIcon,
              { backgroundColor: currentTip.color + "20" },
            ]}
          >
            <Text style={styles.wellnessTipEmoji}>{currentTip.icon}</Text>
          </View>
          <View style={styles.wellnessTipText}>
            <Text
              style={[
                styles.wellnessTipTitle,
                { color: modernDarkColors.text.primary },
              ]}
            >
              {currentTip.title}
            </Text>
            <Text
              style={[
                styles.wellnessTipDescription,
                { color: modernDarkColors.text.secondary },
              ]}
            >
              {currentTip.tip}
            </Text>
          </View>
        </View>
      </ModernCard>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="light-content"
      />

      {/* Advanced background with shader effects */}
      <AdvancedShadersContainer
        variant="aurora"
        intensity={0.3}
        animated
        interactive={false}
        style={styles.backgroundShader}
      />

      {/* Animated Header */}
      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: headerOpacity,
            transform: [
              {
                translateY: parallaxAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: [0, -50],
                  extrapolate: "clamp",
                }),
              },
            ],
          },
        ]}
      >
        <WelcomeHeader
          greeting={getGreeting()}
          userName={user?.profile?.name || "Welcome"}
          onProfilePress={handleViewProfile}
          onEmergencyPress={showEmergencyAlert}
        />
      </Animated.View>

      {/* Main Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={modernDarkColors.accent.primary}
            colors={[modernDarkColors.accent.primary]}
          />
        }
      >
        <View style={styles.contentSpacing} />

        {/* Modern Wellness Tip */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ModernWellnessTip />
        </Animated.View>

        {/* Dashboard Grid */}
        <Animated.View
          style={[
            styles.dashboardGrid,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 30],
                    outputRange: [0, 40],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Mood Check-in */}
          <View style={styles.gridItem}>
            <MoodCheckIn
              currentMood={mood?.currentMood}
              onCheckIn={handleMoodCheckIn}
            />
          </View>

          {/* Quick Actions */}
          <View style={styles.gridItem}>
            <QuickActions
              onStartChat={handleStartChat}
              onTakeAssessment={handleTakeAssessment}
              onMoodTracker={handleMoodCheckIn}
            />
          </View>

          {/* Daily Insights */}
          <View style={styles.gridItem}>
            <ModernCard
              title="Neural Insights"
              subtitle="AI-powered mental wellness analysis"
              variant="neural"
              elevation="high"
              animated
              glowEffect
              shaderVariant="neural"
            >
              <DailyInsights insights={mood?.insights} />
            </ModernCard>
          </View>

          {/* Progress Overview */}
          <View style={styles.gridItem}>
            <ModernCard
              title="Quantum Progress"
              subtitle="Your wellness journey visualization"
              variant="void"
              elevation="medium"
              animated
              shaderVariant="quantum"
            >
              <ProgressOverview
                weeklyStats={mood?.weeklyStats}
                userStats={user?.stats}
              />
            </ModernCard>
          </View>

          {/* Recent Activity */}
          <View style={styles.gridItem}>
            <ModernCard
              title="Activity Stream"
              subtitle="Your recent wellness interactions"
              variant="glass"
              elevation="medium"
              animated
              shaderVariant="void"
            >
              <RecentActivity
                moodHistory={mood?.moodHistory?.slice(0, 3) || []}
                chatHistory={chat?.conversations?.slice(0, 2) || []}
              />
            </ModernCard>
          </View>
        </Animated.View>

        {/* Bottom spacing for FAB */}
        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>

      {/* Enhanced Floating Action Button */}
      <EnhancedFAB />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: modernDarkColors.background.primary,
  },
  backgroundShader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.6,
    zIndex: 0,
  },
  headerContainer: {
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
    zIndex: 5,
  },
  scrollContent: {
    paddingHorizontal: modernSpacing[4],
  },
  contentSpacing: {
    height: modernSpacing[20], // Space for header
  },
  section: {
    marginBottom: modernSpacing[6],
  },
  wellnessTipCard: {
    marginBottom: modernSpacing[4],
  },
  wellnessTipContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  wellnessTipIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: modernSpacing[4],
    borderWidth: 1,
    borderColor: modernDarkColors.border.glass,
  },
  wellnessTipEmoji: {
    fontSize: modernTypography.sizes["2xl"],
  },
  wellnessTipText: {
    flex: 1,
  },
  wellnessTipTitle: {
    fontSize: modernTypography.sizes.lg,
    fontWeight: modernTypography.weights.bold,
    fontFamily: modernTypography.fontFamily.display,
    marginBottom: modernSpacing[1],
    letterSpacing: modernTypography.letterSpacing.wide,
  },
  wellnessTipDescription: {
    fontSize: modernTypography.sizes.sm,
    fontWeight: modernTypography.weights.normal,
    fontFamily: modernTypography.fontFamily.sans,
    lineHeight: modernTypography.lineHeights.sm,
    opacity: 0.9,
  },
  dashboardGrid: {
    gap: modernSpacing[4],
  },
  gridItem: {
    marginBottom: modernSpacing[3],
  },
  fab: {
    position: "absolute",
    right: modernSpacing[6],
    bottom: modernSpacing[8],
    zIndex: 20,
  },
  fabButton: {
    minWidth: 160,
    borderRadius: modernBorderRadius["2xl"],
    ...modernShadows.xl,
  },
  bottomSpacing: {
    height: modernSpacing[24],
  },
});

export default ModernMainAppScreen;
