/**
 * Enhanced Dashboard Component
 * Complete dashboard with page shaders, therapeutic animations, and Freud UI Kit design
 * Features floating action button, wellness tips, and comprehensive mental health interface
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  Platform,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, FAB, Avatar, IconButton, Snackbar } from 'react-native-paper';
import { EnhancedDashboardCard, DashboardCardGrid, QuickActionCards } from './EnhancedDashboardCard';
import { EnhancedMoodCard, MoodCardSlider } from './EnhancedMoodCard';
import { TherapeuticButton, TherapeuticText, FreudColors, FreudContainer } from './FreudUISystem';
import { TimeBasedShaderBackground, MoodBasedShaderBackground } from './PageShaderBackground';
import { useFreudTheme, useTherapeuticTheme, useTimeBasedTheme } from './FreudThemeProvider';
import { colors, spacing, borderRadius, shadows, typography } from '../../shared/theme/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * Wellness Tips Configuration
 */
const WellnessTips = {
  morning: [
    "Start your day with 3 deep breaths and set a positive intention",
    "Practice gratitude by naming 3 things you're thankful for",
    "Take a moment to stretch and connect with your body",
    "Drink a glass of water and nourish yourself mindfully",
    "Write down one goal for today and celebrate small wins",
  ],
  afternoon: [
    "Take a 5-minute break to step outside and feel the sun",
    "Practice mindful eating during your lunch break",
    "Connect with a friend or colleague - social connection heals",
    "Do a quick body scan to release tension",
    "Celebrate something you've accomplished today, however small",
  ],
  evening: [
    "Reflect on three positive moments from your day",
    "Practice gentle stretching or yoga to unwind",
    "Write in your journal or express your feelings",
    "Prepare for tomorrow with kindness to your future self",
    "Create a calming bedtime routine that nurtures you",
  ],
  night: [
    "Practice the 4-7-8 breathing technique for better sleep",
    "Express appreciation for your body and mind's hard work today",
    "Set aside worries - they'll still be there tomorrow if needed",
    "Use progressive muscle relaxation to release the day",
    "Send yourself loving-kindness as you prepare for rest",
  ],
};

/**
 * Dashboard Sections Configuration
 */
const DashboardSections = {
  quickActions: {
    title: 'Quick Actions',
    therapeutic: 'empathy',
    cards: ['moodTracker', 'emergency', 'meditation'],
    layout: 'horizontal',
  },
  dailyOverview: {
    title: 'Today\'s Overview',
    therapeutic: 'zen',
    cards: ['progress', 'insights', 'sessions'],
    layout: 'grid',
  },
  wellnessTools: {
    title: 'Wellness Tools',
    therapeutic: 'serenity',
    cards: ['journalEntry', 'community', 'meditation'],
    layout: 'grid',
  },
};

/**
 * Enhanced Dashboard Component
 */
export const EnhancedDashboard = ({
  user = { name: 'User', avatar: null },
  moodHistory = [],
  onNavigate,
  onMoodTrack,
  onEmergencyContact,
  refreshing = false,
  onRefresh,
  style = {},
  ...props
}) => {
  // Theme hooks
  const { theme } = useFreudTheme();
  const { current: therapeuticTheme, applyMoodTheme } = useTherapeuticTheme();
  const { timeOfDay } = useTimeBasedTheme();
  
  // State
  const [currentMood, setCurrentMood] = useState(null);
  const [showWellnessTip, setShowWellnessTip] = useState(true);
  const [currentTip, setCurrentTip] = useState(0);
  const [fabOpen, setFabOpen] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(-100)).current;
  const cardsAnim = useRef(new Animated.Value(50)).current;
  const tipAnim = useRef(new Animated.Value(0)).current;
  
  // Get wellness tips for current time
  const wellnessTips = WellnessTips[timeOfDay] || WellnessTips.morning;
  
  // Initialize animations
  useEffect(() => {
    Animated.stagger(200, [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(headerAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(cardsAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, headerAnim, cardsAnim]);
  
  // Wellness tip rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % wellnessTips.length);
    }, 10000); // Change tip every 10 seconds
    
    return () => clearInterval(interval);
  }, [wellnessTips.length]);
  
  // Animate wellness tip changes
  useEffect(() => {
    Animated.sequence([
      Animated.timing(tipAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(tipAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentTip, tipAnim]);
  
  // Handle mood selection
  const handleMoodSelect = (mood) => {
    setCurrentMood(mood);
    applyMoodTheme(mood);
    onMoodTrack?.(mood);
    showSnackbar(`Mood tracked: ${mood}`);
  };
  
  // Show snackbar message
  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };
  
  // Handle card press
  const handleCardPress = (cardType) => {
    switch (cardType) {
      case 'moodTracker':
        onNavigate?.('MoodTracker');
        break;
      case 'emergency':
        onEmergencyContact?.();
        break;
      case 'meditation':
        onNavigate?.('Meditation');
        break;
      case 'journalEntry':
        onNavigate?.('Journal');
        break;
      case 'insights':
        onNavigate?.('Insights');
        break;
      case 'progress':
        onNavigate?.('Progress');
        break;
      case 'sessions':
        onNavigate?.('Sessions');
        break;
      case 'community':
        onNavigate?.('Community');
        break;
      default:
        showSnackbar(`Opening ${cardType}...`);
    }
  };
  
  // FAB actions
  const fabActions = [
    {
      icon: 'plus',
      label: 'Quick Mood Check',
      onPress: () => onNavigate?.('QuickMoodCheck'),
      color: FreudColors.zen.medium,
    },
    {
      icon: 'meditation',
      label: 'Start Meditation',
      onPress: () => onNavigate?.('Meditation'),
      color: FreudColors.serenity.medium,
    },
    {
      icon: 'journal',
      label: 'Journal Entry',
      onPress: () => onNavigate?.('Journal'),
      color: FreudColors.empathy.medium,
    },
    {
      icon: 'help',
      label: 'Get Support',
      onPress: () => onEmergencyContact?.(),
      color: FreudColors.kind.medium,
    },
  ];
  
  return (
    <TimeBasedShaderBackground intensity={0.4} style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.dashboard,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
            />
          }
        >
          {/* Enhanced Header */}
          <Animated.View
            style={[
              styles.header,
              {
                transform: [{ translateY: headerAnim }],
              },
            ]}
          >
            <DashboardHeader
              user={user}
              timeOfDay={timeOfDay}
              onEmergencyPress={onEmergencyContact}
              therapeutic={therapeuticTheme}
            />
          </Animated.View>
          
          {/* Wellness Tip Card */}
          {showWellnessTip && (
            <Animated.View
              style={[
                styles.tipContainer,
                {
                  opacity: tipAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.8],
                  }),
                },
              ]}
            >
              <WellnessTipCard
                tip={wellnessTips[currentTip]}
                timeOfDay={timeOfDay}
                onDismiss={() => setShowWellnessTip(false)}
                therapeutic={therapeuticTheme}
              />
            </Animated.View>
          )}
          
          {/* Quick Mood Check */}
          <Animated.View
            style={[
              styles.moodSection,
              {
                transform: [{ translateY: cardsAnim }],
              },
            ]}
          >
            <SectionHeader
              title="How are you feeling right now?"
              therapeutic="kind"
            />
            <MoodCardSlider
              selectedMood={currentMood}
              onMoodSelect={handleMoodSelect}
              cardSize="small"
              variant="gradient"
              animated={true}
            />
          </Animated.View>
          
          {/* Dashboard Sections */}
          {Object.entries(DashboardSections).map(([key, section], index) => (
            <Animated.View
              key={key}
              style={[
                styles.section,
                {
                  transform: [
                    {
                      translateY: cardsAnim.interpolate({
                        inputRange: [0, 50],
                        outputRange: [0, 50 + index * 20],
                      }),
                    },
                  ],
                },
              ]}
            >
              <SectionHeader
                title={section.title}
                therapeutic={section.therapeutic}
              />
              
              {section.layout === 'horizontal' ? (
                <QuickActionCards
                  actions={section.cards}
                  onActionPress={handleCardPress}
                />
              ) : (
                <DashboardCardGrid
                  cards={section.cards}
                  onCardPress={handleCardPress}
                  columns={2}
                  cardSize="medium"
                  variant="gradient"
                  animated={true}
                />
              )}
            </Animated.View>
          ))}
          
          {/* Recent Activity Preview */}
          <Animated.View
            style={[
              styles.section,
              {
                transform: [{ translateY: cardsAnim }],
              },
            ]}
          >
            <RecentActivityPreview
              moodHistory={moodHistory}
              onViewAll={() => onNavigate?.('History')}
            />
          </Animated.View>
        </ScrollView>
        
        {/* Floating Action Button */}
        <FAB.Group
          open={fabOpen}
          visible={true}
          icon={fabOpen ? 'close' : 'plus'}
          actions={fabActions.map(action => ({
            ...action,
            icon: action.icon,
            onPress: () => {
              setFabOpen(false);
              action.onPress();
            },
          }))}
          onStateChange={({ open }) => setFabOpen(open)}
          style={styles.fab}
          theme={{
            colors: {
              primary: FreudColors.zen.medium,
              surface: FreudColors.zen.light,
            },
          }}
        />
      </Animated.View>
      
      {/* Snackbar for notifications */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </TimeBasedShaderBackground>
  );
};

/**
 * Enhanced Dashboard Header Component
 */
const DashboardHeader = ({ user, timeOfDay, onEmergencyPress, therapeutic }) => {
  const getGreeting = () => {
    const greetings = {
      morning: 'Good morning',
      afternoon: 'Good afternoon',
      evening: 'Good evening',
      night: 'Good night',
    };
    return greetings[timeOfDay] || 'Hello';
  };
  
  const getTimeEmoji = () => {
    const emojis = {
      morning: '🌅',
      afternoon: '☀️',
      evening: '🌇',
      night: '🌙',
    };
    return emojis[timeOfDay] || '👋';
  };
  
  return (
    <View style={styles.headerContent}>
      <View style={styles.userSection}>
        <Avatar.Text
          size={56}
          label={user.name[0].toUpperCase()}
          style={[
            styles.avatar,
            { backgroundColor: FreudColors[therapeutic]?.medium || FreudColors.mindful.medium },
          ]}
        />
        <View style={styles.greetingContainer}>
          <TherapeuticText
            variant="title"
            weight="bold"
            therapeutic={therapeutic}
            style={styles.greeting}
          >
            {getGreeting()}, {user.name}! {getTimeEmoji()}
          </TherapeuticText>
          <TherapeuticText
            variant="body"
            style={styles.subGreeting}
          >
            How can we support your wellbeing today?
          </TherapeuticText>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.emergencyButton}
        onPress={onEmergencyPress}
      >
        <LinearGradient
          colors={['#FF6B6B', '#FF8E8E']}
          style={styles.emergencyGradient}
        >
          <Text style={styles.emergencyText}>🆘</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

/**
 * Wellness Tip Card Component
 */
const WellnessTipCard = ({ tip, timeOfDay, onDismiss, therapeutic }) => {
  return (
    <Card style={styles.tipCard}>
      <LinearGradient
        colors={FreudColors[therapeutic]?.gradient || FreudColors.zen.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.tipGradient}
      >
        <Card.Content style={styles.tipContent}>
          <View style={styles.tipHeader}>
            <TherapeuticText variant="subtitle" weight="medium" style={styles.tipTitle}>
              💡 Wellness Tip
            </TherapeuticText>
            <IconButton
              icon="close"
              size={20}
              onPress={onDismiss}
              style={styles.tipDismiss}
            />
          </View>
          <TherapeuticText variant="body" style={styles.tipText}>
            {tip}
          </TherapeuticText>
        </Card.Content>
      </LinearGradient>
    </Card>
  );
};

/**
 * Section Header Component
 */
const SectionHeader = ({ title, therapeutic, showViewAll, onViewAll }) => {
  return (
    <View style={styles.sectionHeader}>
      <TherapeuticText
        variant="title"
        weight="semiBold"
        therapeutic={therapeutic}
        style={styles.sectionTitle}
      >
        {title}
      </TherapeuticText>
      {showViewAll && (
        <TouchableOpacity onPress={onViewAll}>
          <TherapeuticText
            variant="body"
            therapeutic={therapeutic}
            style={styles.viewAllText}
          >
            View All
          </TherapeuticText>
        </TouchableOpacity>
      )}
    </View>
  );
};

/**
 * Recent Activity Preview Component
 */
const RecentActivityPreview = ({ moodHistory, onViewAll }) => {
  const recentMoods = moodHistory.slice(0, 3);
  
  if (recentMoods.length === 0) {
    return null;
  }
  
  return (
    <View style={styles.activityPreview}>
      <SectionHeader
        title="Recent Activity"
        therapeutic="optimistic"
        showViewAll={true}
        onViewAll={onViewAll}
      />
      <Card style={styles.activityCard}>
        <Card.Content>
          {recentMoods.map((entry, index) => (
            <View key={entry.id || index} style={styles.activityItem}>
              <Text style={styles.activityEmoji}>
                {entry.mood === 'happy' ? '😊' : 
                 entry.mood === 'sad' ? '😢' : 
                 entry.mood === 'calm' ? '😌' : '😐'}
              </Text>
              <View style={styles.activityDetails}>
                <TherapeuticText variant="body" weight="medium">
                  {entry.mood}
                </TherapeuticText>
                <TherapeuticText variant="caption" style={styles.activityTime}>
                  {new Date(entry.timestamp).toLocaleDateString()}
                </TherapeuticText>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dashboard: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing[20], // Space for FAB
  },
  
  // Header Styles
  header: {
    paddingHorizontal: spacing[4],
    paddingTop: Platform.OS === 'ios' ? spacing[12] : spacing[8],
    paddingBottom: spacing[4],
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    marginRight: spacing[3],
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    marginBottom: spacing[1],
  },
  subGreeting: {
    opacity: 0.8,
    lineHeight: 18,
  },
  emergencyButton: {
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    ...shadows.sm,
  },
  emergencyGradient: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyText: {
    fontSize: 20,
  },
  
  // Tip Card Styles
  tipContainer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  tipCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  tipGradient: {
    width: '100%',
  },
  tipContent: {
    paddingVertical: spacing[3],
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  tipTitle: {
    color: '#FFFFFF',
  },
  tipDismiss: {
    margin: 0,
  },
  tipText: {
    color: '#FFFFFF',
    lineHeight: 20,
    opacity: 0.95,
  },
  
  // Section Styles
  section: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  sectionTitle: {
    flex: 1,
  },
  viewAllText: {
    opacity: 0.7,
  },
  
  // Mood Section Styles
  moodSection: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },
  
  // Activity Preview Styles
  activityPreview: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
  },
  activityCard: {
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border.secondary,
  },
  activityEmoji: {
    fontSize: 24,
    marginRight: spacing[3],
  },
  activityDetails: {
    flex: 1,
  },
  activityTime: {
    opacity: 0.6,
    marginTop: spacing[0.5],
  },
  
  // FAB Styles
  fab: {
    position: 'absolute',
    margin: spacing[4],
    right: 0,
    bottom: 0,
  },
  
  // Snackbar Styles
  snackbar: {
    marginBottom: spacing[20],
  },
});

export default {
  EnhancedDashboard,
  DashboardHeader,
  WellnessTipCard,
  SectionHeader,
  RecentActivityPreview,
  WellnessTips,
  DashboardSections,
};