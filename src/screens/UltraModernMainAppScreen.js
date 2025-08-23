import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

// Enhanced Background System
import ContextualEnvironment from '../components/backgrounds/ContextualEnvironment';
import AmbientAnimations from '../components/backgrounds/AmbientAnimations';

// Modern Components
import ModernCard from '../components/modern/ModernCard';
import ModernButton from '../components/modern/ModernButton';

// Enhanced Dashboard Components
import MoodCheckIn from '../components/dashboard/MoodCheckIn';
import QuickActions from '../components/dashboard/QuickActions';
import WelcomeHeader from '../components/dashboard/WelcomeHeader';
import DailyInsights from '../components/dashboard/DailyInsights';
import ProgressOverview from '../components/dashboard/ProgressOverview';
import RecentActivity from '../components/dashboard/RecentActivity';

// Icons and Theme
import { MentalHealthIcon } from '../components/icons';
import { useTheme } from '../shared/theme/ThemeContext';
import {
  modernDarkColors,
  modernTypography,
  modernSpacing,
  modernBorderRadius,
  modernShadows,
  modernAnimations,
} from '../shared/theme/darkTheme';

const { width, height } = Dimensions.get('window');

// Ultra Modern Main App Screen - Advanced atmospheric backgrounds and effects
// Features contextual environments, ambient animations, and immersive experiences
const UltraModernMainAppScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [userState, setUserState] = useState('neutral');
  const [currentTime, setCurrentTime] = useState('evening');

  // Advanced animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const parallaxAnim = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  // Update time of day
  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) setCurrentTime('morning');
      else if (hour >= 12 && hour < 17) setCurrentTime('afternoon');
      else if (hour >= 17 && hour < 22) setCurrentTime('evening');
      else setCurrentTime('night');
    };

    updateTimeOfDay();
    const interval = setInterval(updateTimeOfDay, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Analyze user state based on recent interactions (mock implementation)
  useEffect(() => {
    // In a real app, this would analyze user behavior patterns
    const analyzeUserState = () => {
      const hour = new Date().getHours();
      if (hour < 9) setUserState('contemplative');
      else if (hour < 12) setUserState('motivated');
      else if (hour < 17) setUserState('focused');
      else if (hour < 20) setUserState('relaxed');
      else setUserState('peaceful');
    };

    analyzeUserState();
  }, []);

  // Enhanced focus effect with staggered animations
  useFocusEffect(
    useCallback(() => {
      Animated.stagger(150, [
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
    }, [fadeAnim, slideAnim])
  );

  // Redux state
  const { user, mood, chat, loading } = useSelector((state) => ({
    user: state.user || { profile: { name: 'Welcome' }, stats: {} },
    mood: state.mood || {
      currentMood: userState,
      insights: [],
      weeklyStats: {},
      moodHistory: [],
    },
    chat: state.chat || { conversations: [] },
    loading: state.mood?.loading || state.user?.loading || false,
  }));

  // Navigation handlers
  const handleMoodCheckIn = useCallback(() => {
    navigation.navigate('Mood');
  }, [navigation]);

  const handleStartChat = useCallback(() => {
    navigation.navigate('Chat');
  }, [navigation]);

  const handleTakeAssessment = useCallback(() => {
    navigation.navigate('Assessment');
  }, [navigation]);

  const handleViewProfile = useCallback(() => {
    navigation.navigate('Profile');
  }, [navigation]);

  const showEmergencyAlert = useCallback(() => {
    console.log('Emergency support activated');
  }, []);

  // Enhanced refresh with state analysis
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate data refresh and state analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  }, []);

  // Advanced parallax scroll handler
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
      listener: (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        parallaxAnim.setValue(offsetY);
        
        // Dynamic header opacity with smooth transition
        headerOpacity.setValue(Math.max(0.3, 1 - offsetY / 150));
      },
    }
  );

  // Time-based greeting with personality
  const getPersonalizedGreeting = () => {
    const hour = new Date().getHours();
    const greetings = {
      morning: ['Rise and shine', 'Good morning', 'Morning, sunshine'],
      afternoon: ['Good afternoon', 'Hope your day is going well', 'Afternoon check-in'],
      evening: ['Good evening', 'Winding down nicely', 'Evening reflections'],
      night: ['Good night', 'Time to unwind', 'Peaceful evening'],
    };
    
    const timeGreetings = greetings[currentTime] || greetings.evening;
    return timeGreetings[Math.floor(Math.random() * timeGreetings.length)];
  };

  // Enhanced Floating Action Button with contextual adaptation
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
                inputRange: [0, 200],
                outputRange: [0, -30],
                extrapolate: 'clamp',
              }),
            },
          ],
        },
      ]}
    >
      <ModernButton
        title={userState === 'stressed' ? 'Find Peace' : userState === 'motivated' ? 'Let\'s Talk' : 'Start Session'}
        variant="neon"
        size="large"
        animated={true}
        glowEffect={true}
        shaderEffect={true}
        morphEffect={true}
        icon="Therapy"
        onPress={handleStartChat}
        style={styles.fabButton}
        testID="contextual-therapy-fab"
        accessibilityLabel={`Start ${userState} therapy session`}
      />
    </Animated.View>
  );

  // Dynamic Wellness Insight Component
  const DynamicWellnessInsight = () => {
    const insights = {
      contemplative: {
        icon: '🧘',
        title: 'Mindful Reflection',
        tip: 'Your contemplative energy suggests deep introspection. Consider journaling your thoughts.',
        color: modernDarkColors.therapeutic.peaceful.primary,
        variant: 'zen',
      },
      motivated: {
        icon: '⚡',
        title: 'Energized Momentum',
        tip: 'Channel this positive energy into goal-setting or creative activities.',
        color: modernDarkColors.therapeutic.energizing.primary,
        variant: 'energy',
      },
      focused: {
        icon: '🎯',
        title: 'Laser Focus',
        tip: 'Your concentrated state is perfect for tackling important tasks.',
        color: modernDarkColors.therapeutic.calming.primary,
        variant: 'neural',
      },
      relaxed: {
        icon: '🌊',
        title: 'Flowing Ease',
        tip: 'Embrace this peaceful state and let creativity flow naturally.',
        color: modernDarkColors.therapeutic.nurturing.primary,
        variant: 'organic',
      },
      peaceful: {
        icon: '✨',
        title: 'Serene Balance',
        tip: 'Perfect time for meditation or connecting with loved ones.',
        color: modernDarkColors.therapeutic.peaceful.primary,
        variant: 'meditation',
      },
    };

    const currentInsight = insights[userState] || insights.peaceful;

    return (
      <ModernCard
        variant="holographic"
        elevation="floating"
        animated={true}
        glowEffect={true}
        shaderVariant="holographic"
        style={styles.insightCard}
      >
        <View style={styles.insightContent}>
          <View style={[styles.insightIcon, { backgroundColor: currentInsight.color + '20' }]}>
            <Text style={styles.insightEmoji}>{currentInsight.icon}</Text>
          </View>
          <View style={styles.insightText}>
            <Text style={[styles.insightTitle, { color: modernDarkColors.text.primary }]}>
              {currentInsight.title}
            </Text>
            <Text style={[styles.insightDescription, { color: modernDarkColors.text.secondary }]}>
              {currentInsight.tip}
            </Text>
            <View style={styles.insightMeta}>
              <Text style={[styles.insightTime, { color: modernDarkColors.text.tertiary }]}>
                {currentTime.charAt(0).toUpperCase() + currentTime.slice(1)} • Personalized for you
              </Text>
            </View>
          </View>
        </View>
      </ModernCard>
    );
  };

  // Contextual Quick Actions based on user state
  const ContextualQuickActions = () => {
    const actions = {
      stressed: [
        { title: 'Breathing Exercise', icon: 'Heart', color: 'calming' },
        { title: 'Emergency Support', icon: 'Brain', color: 'energizing' },
        { title: 'Calm Sounds', icon: 'Mindfulness', color: 'peaceful' },
      ],
      motivated: [
        { title: 'Goal Setting', icon: 'Therapy', color: 'energizing' },
        { title: 'Progress Review', icon: 'Heart', color: 'nurturing' },
        { title: 'Achievement Log', icon: 'Journal', color: 'calming' },
      ],
      peaceful: [
        { title: 'Meditation', icon: 'Mindfulness', color: 'peaceful' },
        { title: 'Gratitude Journal', icon: 'Journal', color: 'nurturing' },
        { title: 'Reflection', icon: 'Brain', color: 'grounding' },
      ],
    };

    const currentActions = actions[userState] || actions.peaceful;

    return (
      <ModernCard
        title="Suggested Actions"
        subtitle={`Tailored for your ${userState} state`}
        variant="neon"
        elevation="high"
        animated={true}
        glowEffect={true}
        interactive={true}
        shaderVariant="neural"
      >
        <View style={styles.contextualActions}>
          {currentActions.map((action, index) => (
            <ModernButton
              key={action.title}
              title={action.title}
              variant={index === 0 ? 'neural' : index === 1 ? 'glass' : 'ghost'}
              size="medium"
              animated={true}
              glowEffect={index === 0}
              icon={action.icon}
              onPress={() => console.log(`${action.title} selected`)}
              style={styles.contextualActionButton}
            />
          ))}
        </View>
      </ModernCard>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Contextual Environment Background */}
      <ContextualEnvironment
        context="dashboard"
        timeOfDay={currentTime}
        userState={userState}
        intensity={0.8}
        animated={true}
        interactive={true}
        adaptiveEffects={true}
        style={styles.environmentBackground}
      />

      {/* Ambient Animations Layer */}
      <AmbientAnimations
        variant="therapy"
        intensity={0.4}
        speed={1.0}
        therapeutic={true}
        breathingRate={4000}
        energyFlow={true}
        style={styles.ambientLayer}
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
                  inputRange: [0, 150],
                  outputRange: [0, -75],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}
      >
        <WelcomeHeader
          greeting={getPersonalizedGreeting()}
          userName={user?.profile?.name || 'Friend'}
          onProfilePress={handleViewProfile}
          onEmergencyPress={showEmergencyAlert}
        />
      </Animated.View>

      {/* Main Content with Enhanced Parallax */}
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
            progressBackgroundColor={modernDarkColors.background.surface}
          />
        }
      >
        <View style={styles.contentSpacing} />

        {/* Dynamic Wellness Insight */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <DynamicWellnessInsight />
        </Animated.View>

        {/* Enhanced Dashboard Grid */}
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
          {/* Mood Check-in with State Awareness */}
          <View style={styles.gridItem}>
            <MoodCheckIn
              currentMood={mood?.currentMood}
              onCheckIn={handleMoodCheckIn}
            />
          </View>

          {/* Contextual Quick Actions */}
          <View style={styles.gridItem}>
            <ContextualQuickActions />
          </View>

          {/* AI-Enhanced Daily Insights */}
          <View style={styles.gridItem}>
            <ModernCard
              title="AI Wellness Insights"
              subtitle="Personalized mental health analysis"
              variant="neural"
              elevation="high"
              animated={true}
              glowEffect={true}
              shaderVariant="neural"
            >
              <DailyInsights insights={mood?.insights} />
            </ModernCard>
          </View>

          {/* Dynamic Progress Visualization */}
          <View style={styles.gridItem}>
            <ModernCard
              title="Journey Visualization"
              subtitle="Your wellness evolution"
              variant="void"
              elevation="medium"
              animated={true}
              shaderVariant="quantum"
            >
              <ProgressOverview
                weeklyStats={mood?.weeklyStats}
                userStats={user?.stats}
              />
            </ModernCard>
          </View>

          {/* Contextual Recent Activity */}
          <View style={styles.gridItem}>
            <ModernCard
              title="Recent Insights"
              subtitle="Your wellness timeline"
              variant="glass"
              elevation="medium"
              animated={true}
              shaderVariant="holographic"
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

      {/* Enhanced Contextual FAB */}
      <EnhancedFAB />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: modernDarkColors.background.primary,
  },
  environmentBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  ambientLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  headerContainer: {
    zIndex: 15,
  },
  scrollView: {
    flex: 1,
    zIndex: 10,
  },
  scrollContent: {
    paddingHorizontal: modernSpacing[4],
  },
  contentSpacing: {
    height: modernSpacing[24], // Increased space for enhanced header
  },
  section: {
    marginBottom: modernSpacing[6],
  },
  insightCard: {
    marginBottom: modernSpacing[4],
  },
  insightContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: modernSpacing[4],
    borderWidth: 1,
    borderColor: modernDarkColors.border.glass,
  },
  insightEmoji: {
    fontSize: modernTypography.sizes['3xl'],
  },
  insightText: {
    flex: 1,
  },
  insightTitle: {
    fontSize: modernTypography.sizes.xl,
    fontWeight: modernTypography.weights.bold,
    fontFamily: modernTypography.fontFamily.display,
    marginBottom: modernSpacing[2],
    letterSpacing: modernTypography.letterSpacing.wide,
  },
  insightDescription: {
    fontSize: modernTypography.sizes.base,
    fontWeight: modernTypography.weights.normal,
    fontFamily: modernTypography.fontFamily.sans,
    lineHeight: modernTypography.lineHeights.base,
    marginBottom: modernSpacing[3],
    opacity: 0.9,
  },
  insightMeta: {
    borderTopWidth: 1,
    borderTopColor: modernDarkColors.border.glass,
    paddingTop: modernSpacing[2],
  },
  insightTime: {
    fontSize: modernTypography.sizes.xs,
    fontWeight: modernTypography.weights.medium,
    fontFamily: modernTypography.fontFamily.sans,
    letterSpacing: modernTypography.letterSpacing.wide,
    textTransform: 'uppercase',
    opacity: 0.7,
  },
  contextualActions: {
    gap: modernSpacing[3],
  },
  contextualActionButton: {
    marginVertical: modernSpacing[1],
  },
  dashboardGrid: {
    gap: modernSpacing[4],
  },
  gridItem: {
    marginBottom: modernSpacing[3],
  },
  fab: {
    position: 'absolute',
    right: modernSpacing[6],
    bottom: modernSpacing[8],
    zIndex: 25,
  },
  fabButton: {
    minWidth: 180,
    borderRadius: modernBorderRadius['2xl'],
    ...modernShadows.xl,
  },
  bottomSpacing: {
    height: modernSpacing[28],
  },
});

export default UltraModernMainAppScreen;