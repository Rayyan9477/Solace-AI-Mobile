import React, { 
  useCallback, 
  useMemo, 
  useState, 
  useEffect, 
  useRef, 
  memo,
  Suspense 
} from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

// Performance hooks
import { 
  usePerformanceMonitor, 
  useMemoryLeakDetector,
  useRenderOptimization 
} from '../hooks/usePerformanceMonitor';

// Lazy loaded dashboard components for better performance
const LazyDailyInsights = React.lazy(() => import('../components/dashboard/DailyInsights'));
const LazyMoodCheckIn = React.lazy(() => import('../components/dashboard/MoodCheckIn'));
const LazyProgressOverview = React.lazy(() => import('../components/dashboard/ProgressOverview'));
const LazyQuickActions = React.lazy(() => import('../components/dashboard/QuickActions'));
const LazyRecentActivity = React.lazy(() => import('../components/dashboard/RecentActivity'));
const LazyWelcomeHeader = React.lazy(() => import('../components/dashboard/WelcomeHeader'));

// Icons and theme
import {
  MentalHealthIcon,
  NavigationIcon,
  ActionIcon,
} from '../components/icons';
import { useTheme } from '../contexts/ThemeContext';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from '../styles/theme';
import { MentalHealthAccessibility } from '../utils/accessibility';

// Static data
import { getTimeBasedWellnessTip } from '../constants/wellnessTips';

const { width, height } = Dimensions.get('window');

// Memoized loading component
const LoadingFallback = memo(({ message = 'Loading...' }) => {
  const { theme } = useTheme();
  
  return (
    <View style={styles.loadingContainer}>
      <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>
        {message}
      </Text>
    </View>
  );
});

// Optimized time-based gradient calculation with memoization
const useTimeBasedGradient = () => {
  const { theme } = useTheme();
  
  return useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return [
        theme.colors.therapeutic.energizing[200],
        theme.colors.therapeutic.calming[200],
      ];
    }
    if (hour < 17) {
      return [
        theme.colors.therapeutic.calming[200],
        theme.colors.therapeutic.peaceful[200],
      ];
    }
    return [
      theme.colors.therapeutic.peaceful[300],
      theme.colors.therapeutic.grounding[200],
    ];
  }, [theme, Math.floor(Date.now() / 3600000)]); // Recalculate hourly
};

// Memoized wellness tip component
const WellnessTipCard = memo(({ tip, theme, fadeAnim, slideAnim }) => {
  if (!tip) return null;

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
          <Text style={styles.wellnessTipEmoji}>{tip.icon}</Text>
        </View>
        <View style={styles.wellnessTipContent}>
          <Text
            style={[
              styles.wellnessTipTitle,
              { color: theme.colors.text.primary },
            ]}
          >
            {tip.title}
          </Text>
          <Text
            style={[
              styles.wellnessTipText,
              { color: theme.colors.text.secondary },
            ]}
          >
            {tip.tip}
          </Text>
          <Text
            style={[
              styles.wellnessTipDuration,
              { color: theme.colors.text.tertiary },
            ]}
          >
            {tip.duration}
          </Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
});

// Memoized floating action button
const FloatingActionButton = memo(({ 
  onPress, 
  theme, 
  fadeAnim 
}) => (
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
      onPress={onPress}
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
));

// Main optimized component
const OptimizedMainAppScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  
  // Performance monitoring
  const { performanceMetrics } = usePerformanceMonitor('OptimizedMainAppScreen');
  const { registerTimer, registerRef } = useMemoryLeakDetector('OptimizedMainAppScreen');
  const { memoizedCallback } = useRenderOptimization([]);

  // State management
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [wellnessTip, setWellnessTip] = useState(null);

  // Animation refs with proper cleanup
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  
  registerRef(fadeAnim);
  registerRef(slideAnim);

  // Memoized Redux selectors for better performance
  const user = useSelector(
    useCallback((state) => state.user || { 
      profile: { name: "Friend" }, 
      stats: {} 
    }, [])
  );
  
  const mood = useSelector(
    useCallback((state) => state.mood || {
      currentMood: null,
      insights: [],
      weeklyStats: {},
      moodHistory: [],
    }, [])
  );
  
  const chat = useSelector(
    useCallback((state) => state.chat || { 
      conversations: [] 
    }, [])
  );
  
  const loading = useSelector(
    useCallback((state) => 
      state.mood?.loading || state.user?.loading || false, [])
  );

  // Memoized calculations
  const timeBasedGradient = useTimeBasedGradient();
  
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, [Math.floor(Date.now() / 3600000)]); // Recalculate hourly

  const moodHistorySlice = useMemo(
    () => mood?.moodHistory?.slice(0, 3) || [],
    [mood.moodHistory]
  );
  
  const chatHistorySlice = useMemo(
    () => chat?.conversations?.slice(0, 2) || [],
    [chat.conversations]
  );

  // Initialize wellness tip
  useEffect(() => {
    setWellnessTip(getTimeBasedWellnessTip());
  }, []);

  // Focus effect with performance optimization
  useFocusEffect(
    memoizedCallback(() => {
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
    }, [fadeAnim, slideAnim])
  );

  // Hardware back button handler
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [navigation]);

  // Memoized event handlers
  const fetchData = memoizedCallback(async () => {
    try {
      setError(null);
      // Simulate data fetching
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to fetch app data:', error);
      setError(
        'Unable to load app data. Please check your connection and try again.'
      );
      Alert.alert(
        'Data Load Error',
        'We couldn\'t load your app data. Please check your internet connection and try again.',
        [
          { text: 'Retry', onPress: () => fetchData() },
          { text: 'OK', style: 'cancel' },
        ]
      );
    }
  }, []);

  const handleRefresh = memoizedCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      await fetchData();
      
      // Refresh wellness tip
      setWellnessTip(getTimeBasedWellnessTip());
    } catch (error) {
      // Error already handled in fetchData
    } finally {
      setRefreshing(false);
    }
  }, [fetchData]);

  const handleMoodCheckIn = memoizedCallback(() => {
    navigation.navigate('Mood');
  }, [navigation]);

  const handleStartChat = memoizedCallback(() => {
    navigation.navigate('Chat');
  }, [navigation]);

  const handleTakeAssessment = memoizedCallback(() => {
    navigation.navigate('Assessment');
  }, [navigation]);

  const handleViewProfile = memoizedCallback(() => {
    navigation.navigate('Profile');
  }, [navigation]);

  const showEmergencyAlert = memoizedCallback(() => {
    Alert.alert(
      'Emergency Resources',
      'If you are experiencing a mental health crisis, please contact:\n\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• Or call 911 for immediate assistance',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call 988',
          onPress: async () => {
            try {
              const supported = await Linking.canOpenURL('tel:988');
              if (supported) {
                await Linking.openURL('tel:988');
              } else {
                Alert.alert(
                  'Unable to Call',
                  'Your device cannot make phone calls. Please dial 988 manually or contact emergency services.',
                  [{ text: 'OK' }]
                );
              }
            } catch (error) {
              console.error('Error making emergency call:', error);
              Alert.alert(
                'Call Error',
                'Unable to place call. Please dial 988 manually for immediate assistance.',
                [{ text: 'OK' }]
              );
            }
          },
        },
        {
          text: 'Text Crisis Line',
          onPress: async () => {
            try {
              const supported = await Linking.canOpenURL('sms:741741');
              if (supported) {
                await Linking.openURL('sms:741741?body=HOME');
              } else {
                Alert.alert(
                  'Unable to Text',
                  'Your device cannot send text messages. Please text HOME to 741741 manually.',
                  [{ text: 'OK' }]
                );
              }
            } catch (error) {
              console.error('Error opening text messaging:', error);
              Alert.alert(
                'Text Error',
                'Unable to open messaging. Please text HOME to 741741 manually.',
                [{ text: 'OK' }]
              );
            }
          },
        },
      ]
    );
  }, []);

  // Initial data fetch
  useEffect(() => {
    const timerId = registerTimer(setTimeout(fetchData, 100));
    return () => clearTimeout(timerId);
  }, [fetchData, registerTimer]);

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
      />

      {/* Background Gradient */}
      <LinearGradient
        colors={timeBasedGradient}
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
          {/* Welcome Header - Lazy loaded */}
          <Suspense fallback={<LoadingFallback message="Loading header..." />}>
            <LazyWelcomeHeader
              greeting={greeting}
              userName={user?.profile?.name || 'Friend'}
              onProfilePress={handleViewProfile}
              onEmergencyPress={showEmergencyAlert}
              {...MentalHealthAccessibility.dashboard.welcomeMessage(
                user?.profile?.name || 'Friend'
              )}
            />
          </Suspense>

          {/* Wellness Tip */}
          <WellnessTipCard 
            tip={wellnessTip}
            theme={theme}
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
          />

          {/* Mood Check-in - Lazy loaded */}
          <Suspense fallback={<LoadingFallback message="Loading mood check-in..." />}>
            <LazyMoodCheckIn
              currentMood={mood?.currentMood}
              onCheckIn={handleMoodCheckIn}
            />
          </Suspense>

          {/* Daily Insights - Lazy loaded */}
          <Suspense fallback={<LoadingFallback message="Loading insights..." />}>
            <LazyDailyInsights insights={mood?.insights} />
          </Suspense>

          {/* Quick Actions - Lazy loaded */}
          <Suspense fallback={<LoadingFallback message="Loading actions..." />}>
            <LazyQuickActions
              onStartChat={handleStartChat}
              onTakeAssessment={handleTakeAssessment}
              onMoodTracker={handleMoodCheckIn}
            />
          </Suspense>

          {/* Progress Overview - Lazy loaded */}
          <Suspense fallback={<LoadingFallback message="Loading progress..." />}>
            <LazyProgressOverview
              weeklyStats={mood?.weeklyStats}
              userStats={user?.stats}
            />
          </Suspense>

          {/* Recent Activity - Lazy loaded */}
          <Suspense fallback={<LoadingFallback message="Loading activity..." />}>
            <LazyRecentActivity
              moodHistory={moodHistorySlice}
              chatHistory={chatHistorySlice}
            />
          </Suspense>

          {/* Bottom spacing for FAB */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </Animated.View>

      {/* Floating Action Button */}
      <FloatingActionButton
        onPress={handleStartChat}
        theme={theme}
        fadeAnim={fadeAnim}
      />

      {/* Performance monitoring in development */}
      {__DEV__ && (
        <View style={styles.perfMonitor}>
          <Text style={styles.perfText}>
            Renders: {performanceMetrics.renderCount} | 
            Last: {performanceMetrics.renderTime.toFixed(1)}ms
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
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
  loadingContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: spacing[4],
    marginVertical: spacing[2],
  },
  loadingText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  wellnessTipContainer: {
    marginHorizontal: spacing[4],
    marginVertical: spacing[2],
  },
  wellnessTipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderRadius: borderRadius.lg,
  },
  wellnessTipIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  wellnessTipEmoji: {
    fontSize: typography.sizes['2xl'],
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
    marginBottom: spacing[0.5],
  },
  wellnessTipDuration: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    opacity: 0.6,
  },
  fab: {
    position: 'absolute',
    right: spacing[5],
    bottom: spacing[8],
  },
  fabButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSpacing: {
    height: spacing[20],
  },
  perfMonitor: {
    position: 'absolute',
    bottom: 100,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    borderRadius: 4,
  },
  perfText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'monospace',
  },
});

export default memo(OptimizedMainAppScreen);