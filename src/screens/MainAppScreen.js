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
  SafeAreaView,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'expo-linear-gradient';

// Enhanced UI Components
import { TherapeuticGradient, GlassmorphismContainer, FloatingParticles, OrganicBlobBackground } from '../components/shaders/PageShaders';
import { FloatingActionButton, StaggeredListAnimation, ParallaxBackground, TherapeuticBreathingAnimation } from '../components/animations/AdvancedAnimations';
import { TherapeuticCard, MindfulCard, EmpathyCard, GlassMorphCard } from '../components/ui/Card';
import { CalmingButton, NurturingButton, GroundingButton } from '../components/ui/Button';
import { MentalHealthIcon } from '../components/icons';
import SimpleCard from "../components/ui/SimpleCard";
import MentalHealthScoreWidget from "../components/ui/MentalHealthScoreWidget";

// Dashboard Components
import DailyInsights from "../components/dashboard/DailyInsights";
import MoodCheckIn from "../components/dashboard/MoodCheckIn";
import ProgressOverview from "../components/dashboard/ProgressOverview";
import QuickActions from "../components/dashboard/QuickActions";
import RecentActivity from "../components/dashboard/RecentActivity";
import WelcomeHeader from "../components/dashboard/WelcomeHeader";

// Theme and Utils
import { useTheme } from "../shared/theme/ThemeContext";
import FreudDesignSystem, { FreudColors, FreudSpacing, FreudTypography, FreudShadows, FreudBorderRadius } from '../shared/theme/FreudDesignSystem';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from "../shared/theme/theme";
import { 
  MentalHealthAccessibility, 
  MentalHealthAccessibilityHelpers 
} from "../utils/accessibility";

// Enhanced Therapeutic Tips
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
  {
    tip: "Progress isn't linear. Celebrate small wins along your journey",
    category: "Growth",
    icon: "Insights",
    color: FreudColors.serenityGreen[60]
  },
];

const { width, height } = Dimensions.get("window");

const MainAppScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { theme, isDarkMode } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [currentSection, setCurrentSection] = useState("dashboard");
  const [currentTip, setCurrentTip] = useState(THERAPEUTIC_TIPS[0]);
  const [isBreathingActive, setIsBreathingActive] = useState(false);

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
      
      // Update therapeutic tip
      setCurrentTip(getRandomTip());
      
      await fetchData();
      
      // Gentle success feedback
      Alert.alert(
        "✨ Refreshed",
        "Your wellness dashboard has been updated with fresh insights and support.",
        [{ text: "Thank you", style: "default" }],
        { userInterfaceStyle: isDarkMode ? 'dark' : 'light' }
      );
    } catch (error) {
      // Error already handled in fetchData
    } finally {
      setRefreshing(false);
    }
  }, [fetchData, isDarkMode]);

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
    // Announce emergency mode activation for screen readers
    MentalHealthAccessibilityHelpers.announceWithContext(
      "Emergency support activated. Crisis resources are now available.",
      "emergency"
    );

    Alert.alert(
      "🚨 Emergency Crisis Support",
      "If you are experiencing a mental health crisis, please contact:\n\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• Or call 911 for immediate assistance\n\nYou are not alone. Help is available 24/7.",
      [
        { 
          text: "Cancel", 
          style: "cancel",
          onPress: () => {
            MentalHealthAccessibilityHelpers.announceWithContext(
              "Emergency support closed. Remember, help is always available.",
              "emergency"
            );
          }
        },
        {
          text: "Call 988 Now",
          style: "default",
          onPress: async () => {
            try {
              MentalHealthAccessibilityHelpers.announceWithContext(
                "Calling crisis support hotline",
                "emergency"
              );
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
          text: "Crisis Chat",
          onPress: async () => {
            try {
              MentalHealthAccessibilityHelpers.announceWithContext(
                "Opening crisis text support",
                "emergency"
              );
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

  // Clean professional floating action button
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
        onPress={handleStartChat}
        style={styles.fabButton}
        testID="start-therapy-fab"
        accessibilityLabel="Start AI Therapy Session"
        accessibilityHint="Double tap to begin a private conversation with your AI therapist"
        activeOpacity={0.8}
      >
        <View style={styles.fabContent}>
          <ActionIcon
            name="plus"
            size={24}
            color="#FFFFFF"
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  // Get random therapeutic tip
  const getRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * THERAPEUTIC_TIPS.length);
    return THERAPEUTIC_TIPS[randomIndex];
  };

  // Enhanced therapeutic tips component
  const TherapeuticTipCard = () => {
    return (
      <TherapeuticCard
        title="Today's Therapeutic Insight"
        icon={currentTip.icon}
        style={styles.tipCard}
        elevation="lg"
      >
        <LinearGradient
          colors={[currentTip.color + '20', currentTip.color + '10']}
          style={styles.tipGradient}
        >
          <View style={styles.tipContent}>
            <Text style={[styles.tipCategory, {
              color: currentTip.color
            }]}>
              {currentTip.category.toUpperCase()}
            </Text>
            <Text style={[styles.tipText, {
              color: isDarkMode ? FreudDesignSystem.themes.dark.colors.text.primary : FreudDesignSystem.themes.light.colors.text.primary
            }]}>
              {currentTip.tip}
            </Text>
          </View>
        </LinearGradient>
      </TherapeuticCard>
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

  useEffect(() => {
    // Set initial therapeutic tip
    setCurrentTip(getRandomTip());
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent={true}
      />
      
      <OrganicBlobBackground
        blobCount={4}
        colors={[
          FreudColors.serenityGreen[10],
          FreudColors.kindPurple[10],
          FreudColors.empathyOrange[10],
          FreudColors.zenYellow[10],
        ]}
      >
        <FloatingParticles 
          particleCount={15}
          particleColor={FreudColors.serenityGreen[30]}
          particleSize={6}
        />
        
        <ParallaxBackground parallaxSpeed={0.3}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={FreudColors.serenityGreen[60]}
                colors={[FreudColors.serenityGreen[60], FreudColors.mindfulBrown[60]]}
                progressBackgroundColor={isDarkMode ? FreudColors.optimisticGray[90] : '#FFFFFF'}
                title="Refreshing your wellness dashboard..."
                titleColor={FreudColors.mindfulBrown[70]}
              />
            }
            showsVerticalScrollIndicator={false}
          >
            {/* Enhanced Welcome Header */}
            <Animatable.View 
              animation="fadeInDown" 
              duration={1000}
            >
              <GlassmorphismContainer style={styles.welcomeCard}>
                <WelcomeHeader
                  greeting={greeting}
                  userName={user?.profile?.name || "Friend"}
                  onProfilePress={handleViewProfile}
                  onEmergencyPress={showEmergencyAlert}
                  {...MentalHealthAccessibility.dashboard.welcomeMessage(
                    user?.profile?.name || "Friend",
                  )}
                />
              </GlassmorphismContainer>
            </Animatable.View>

            {/* Therapeutic Tip Card */}
            <Animatable.View 
              animation="slideInUp" 
              duration={1200} 
              delay={200}
            >
              <TherapeuticTipCard />
            </Animatable.View>

            {/* Mental Health Score Widget */}
            <Animatable.View 
              animation="zoomIn" 
              duration={1000} 
              delay={400}
              style={styles.scoreSection}
            >
              <GlassMorphCard style={styles.scoreCard}>
                <MentalHealthScoreWidget
                  score={user?.mentalHealthScore || 80}
                  animated={true}
                  showTrend={true}
                  trend="stable"
                  onPress={() => navigation.navigate("MentalHealthDetails")}
                />
              </GlassMorphCard>
            </Animatable.View>

            {/* Enhanced Dashboard Grid */}
            <StaggeredListAnimation stagger={150} animation="slideInUp">
              {/* Enhanced Mood Check-in */}
              <MindfulCard
                title="Mindful Check-In"
                subtitle="How are you feeling in this moment?"
                icon="Heart"
                style={styles.dashboardCard}
              >
                <View style={styles.moodCheckInContainer}>
                  <MoodCheckIn
                    currentMood={mood?.currentMood}
                    onCheckIn={(moodId, moodData) => {
                      // Enhanced mood handling
                      setCurrentSection('mood');
                      handleMoodCheckIn();
                    }}
                    compact={false}
                  />
                  
                  {/* Breathing Exercise Integration */}
                  <View style={styles.breathingContainer}>
                    <TherapeuticBreathingAnimation
                      isActive={isBreathingActive}
                      size={80}
                      duration={4000}
                      onCycleComplete={() => console.log('Breathing cycle complete')}
                    />
                    <GroundingButton
                      title={isBreathingActive ? "Stop Breathing" : "Start Breathing"}
                      onPress={() => setIsBreathingActive(!isBreathingActive)}
                      size="small"
                      icon="Mindfulness"
                      style={styles.breathingButton}
                    />
                  </View>
                </View>
              </MindfulCard>

              {/* Enhanced Quick Actions */}
              <EmpathyCard
                title="Quick Wellness Actions"
                subtitle="Choose what feels right for you today"
                icon="Therapy"
                style={styles.dashboardCard}
              >
                <QuickActions
                  onStartChat={handleStartChat}
                  onTakeAssessment={handleTakeAssessment}
                  onMoodTracker={handleMoodCheckIn}
                />
              </EmpathyCard>

              {/* Enhanced Insights */}
              <TherapeuticCard 
                title="Personal Insights"
                subtitle="Discover patterns in your wellbeing"
                icon="Insights"
                style={styles.dashboardCard}
              >
                <DailyInsights insights={mood?.insights} />
              </TherapeuticCard>

              {/* Enhanced Progress */}
              <MindfulCard
                title="Your Progress"
                subtitle="Celebrating your journey"
                icon="Heart"
                style={styles.dashboardCard}
              >
                <ProgressOverview
                  weeklyStats={mood?.weeklyStats}
                  userStats={user?.stats}
                />
              </MindfulCard>

              {/* Enhanced Activity */}
              <EmpathyCard
                title="Recent Activity"
                subtitle="Your wellness timeline" 
                icon="Journal"
                style={styles.dashboardCard}
              >
                <RecentActivity
                  moodHistory={moodHistorySlice}
                  chatHistory={chatHistorySlice}
                />
              </EmpathyCard>
            </StaggeredListAnimation>

            {/* Bottom spacing for FAB */}
            <View style={styles.bottomSpacing} />
          </ScrollView>
        </ParallaxBackground>

        {/* Enhanced Floating Action Button */}
        <FloatingActionButton
          onPress={handleStartChat}
          size={64}
          backgroundColor={FreudColors.mindfulBrown[90]}
          rippleColor={FreudColors.mindfulBrown[70]}
          style={styles.fab}
        >
          <View style={styles.fabContent}>
            <MentalHealthIcon name="Therapy" size={28} color="#FFFFFF" />
            <Text style={styles.fabLabel}>Dr. Freud</Text>
          </View>
        </FloatingActionButton>
      </OrganicBlobBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 140,
    paddingTop: FreudSpacing[4],
    paddingHorizontal: FreudSpacing[4],
  },
  
  // Welcome Section
  welcomeCard: {
    borderRadius: FreudBorderRadius['2xl'],
    padding: FreudSpacing[1],
    marginBottom: FreudSpacing[4],
    ...FreudShadows.md,
  },
  
  // Therapeutic Tip Card
  tipCard: {
    marginBottom: FreudSpacing[4],
    overflow: 'hidden',
  },
  tipGradient: {
    padding: FreudSpacing[4],
    borderRadius: FreudBorderRadius.xl,
  },
  tipContent: {
    alignItems: 'flex-start',
  },
  tipCategory: {
    fontSize: FreudTypography.sizes.xs,
    fontWeight: FreudTypography.weights.bold,
    fontFamily: FreudTypography.fontFamily.primary,
    letterSpacing: 1.2,
    marginBottom: FreudSpacing[2],
  },
  tipText: {
    fontSize: FreudTypography.sizes.base,
    lineHeight: FreudTypography.sizes.base * FreudTypography.lineHeights.relaxed,
    fontWeight: FreudTypography.weights.normal,
    fontFamily: FreudTypography.fontFamily.primary,
  },
  
  // Score Section
  scoreSection: {
    alignItems: 'center',
    marginBottom: FreudSpacing[6],
  },
  scoreCard: {
    padding: FreudSpacing[4],
    borderRadius: FreudBorderRadius['2xl'],
  },
  
  // Dashboard Cards
  dashboardCard: {
    marginBottom: FreudSpacing[4],
  },
  moodCheckInContainer: {
    paddingTop: FreudSpacing[2],
  },
  breathingContainer: {
    alignItems: 'center',
    marginTop: FreudSpacing[4],
    paddingTop: FreudSpacing[3],
    borderTopWidth: 1,
    borderTopColor: FreudColors.optimisticGray[20],
  },
  breathingButton: {
    marginTop: FreudSpacing[2],
  },
  
  // Floating Action Button
  fab: {
    position: 'absolute',
    bottom: FreudSpacing[8],
    right: FreudSpacing[6],
    zIndex: 1000,
  },
  fabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabLabel: {
    fontSize: FreudTypography.sizes.xs,
    fontWeight: FreudTypography.weights.bold,
    fontFamily: FreudTypography.fontFamily.primary,
    color: '#FFFFFF',
    marginTop: FreudSpacing[1],
    textAlign: 'center',
  },
  
  // Spacing
  bottomSpacing: {
    height: 160,
  },
});

export default MainAppScreen;

// Export therapeutic tips for use in other components
export { THERAPEUTIC_TIPS };
