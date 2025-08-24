import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Vibration,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { freudDarkTheme } from '../../shared/theme/freudDarkTheme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Mindful data
const MINDFUL_HISTORY = [
  {
    id: 1,
    type: 'Deep Meditation',
    date: 'Today',
    duration: '45:00',
    progress: 90,
    color: freudDarkTheme.colors.status.success,
  },
  {
    id: 2,
    type: 'Balanced Sleep',
    date: 'Yesterday',
    duration: '20:00',
    progress: 75,
    color: '#8B5CF6',
  },
  {
    id: 3,
    type: 'Deep Meditation',
    date: '2 days ago',
    duration: '30:00',
    progress: 60,
    color: freudDarkTheme.colors.status.success,
  },
];

const MINDFUL_STATS = [
  { category: 'Breathing', time: '2.5h', percentage: 30, color: freudDarkTheme.colors.status.success },
  { category: 'Mindfulness', time: '1.5h', percentage: 17, color: freudDarkTheme.colors.accent.primary },
  { category: 'Relax', time: '3.5h', percentage: 42, color: '#8B5CF6' },
  { category: 'Sleep', time: '0.9h', percentage: 10, color: '#06B6D4' },
];

const EXERCISE_GOALS = [
  { id: 1, title: 'I want to gain more focus', description: 'Enhance concentration' },
  { id: 2, title: 'I want to sleep better', description: 'Improve sleep quality' },
  { id: 3, title: 'I want to build a stronger mindset', description: 'Mental resilience' },
  { id: 4, title: 'I want to conquer my anxiety', description: 'Anxiety management' },
  { id: 5, title: 'I want to enjoy the moment', description: 'Present awareness' },
  { id: 6, title: 'I want to be a happier person', description: 'Overall wellbeing' },
];

const SOUNDSCAPES = [
  { id: 1, name: 'Rain', icon: '🌧️', duration: '∞', color: '#06B6D4' },
  { id: 2, name: 'Zen Garden', icon: '🧘', duration: '∞', color: freudDarkTheme.colors.status.success },
  { id: 3, name: 'Mountain Stream', icon: '🏔️', duration: '∞', color: '#8B5CF6' },
  { id: 4, name: 'Ocean Waves', icon: '🌊', duration: '∞', color: '#0EA5E9' },
  { id: 5, name: 'Forest', icon: '🌲', duration: '∞', color: '#059669' },
  { id: 6, name: 'Thunderstorm', icon: '⛈️', duration: '∞', color: '#6366F1' },
];

export default function DarkMindfulHoursScreen() {
  const [currentView, setCurrentView] = useState('overview'); // 'overview', 'stats', 'newExercise', 'exerciseSetup', 'breathing', 'complete'
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [exerciseTime, setExerciseTime] = useState(25); // minutes
  const [selectedSoundscape, setSelectedSoundscape] = useState(1);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inhale'); // 'inhale', 'hold', 'exhale'
  const [breathingCount, setBreathingCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalHours] = useState(5.21);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const breathAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [currentView]);

  useEffect(() => {
    let breathingInterval;
    if (isBreathing) {
      breathingInterval = setInterval(() => {
        // Breathing pattern: 4s inhale, 2s hold, 6s exhale
        const cycle = breathingCount % 12;
        if (cycle < 4) {
          setBreathingPhase('inhale');
          Animated.timing(breathAnim, {
            toValue: 1.2,
            duration: 4000,
            useNativeDriver: true,
          }).start();
        } else if (cycle < 6) {
          setBreathingPhase('hold');
        } else {
          setBreathingPhase('exhale');
          Animated.timing(breathAnim, {
            toValue: 0.8,
            duration: 6000,
            useNativeDriver: true,
          }).start();
        }
        setBreathingCount(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(breathingInterval);
  }, [isBreathing, breathingCount]);

  const startBreathingExercise = () => {
    setCurrentView('breathing');
    setIsBreathing(true);
    setBreathingCount(0);
    setCurrentTime(0);
    
    // Start progress animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: exerciseTime * 60 * 1000, // Convert minutes to milliseconds
      useNativeDriver: false,
    }).start(() => {
      setIsBreathing(false);
      setCurrentView('complete');
    });

    // Start pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();
  };

  const stopBreathingExercise = () => {
    setIsBreathing(false);
    setCurrentView('overview');
    progressAnim.setValue(0);
    pulseAnim.setValue(1);
  };

  const renderOverview = () => (
    <Animated.ScrollView 
      style={[styles.container, { opacity: fadeAnim }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Main Stats Card */}
      <View style={styles.mainStatsCard}>
        <LinearGradient
          colors={[freudDarkTheme.colors.background.secondary, freudDarkTheme.colors.background.tertiary]}
          style={styles.mainStatsGradient}
        >
          <Text style={styles.mainStatsNumber}>{totalHours}</Text>
          <Text style={styles.mainStatsLabel}>Mindful Hours</Text>
          
          {/* Progress Circle */}
          <View style={styles.progressCircle}>
            <View style={styles.progressCircleOuter}>
              <View style={styles.progressCircleInner} />
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Action Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setCurrentView('newExercise')}>
        <LinearGradient
          colors={[freudDarkTheme.colors.accent.primary, '#F97316']}
          style={styles.addButtonGradient}
        >
          <Text style={styles.addButtonText}>+ </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* History Section */}
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Mindful Hour History</Text>
        {MINDFUL_HISTORY.map((item) => (
          <View key={item.id} style={styles.historyItem}>
            <LinearGradient
              colors={[freudDarkTheme.colors.background.secondary, freudDarkTheme.colors.background.tertiary]}
              style={styles.historyItemGradient}
            >
              <View style={styles.historyLeft}>
                <View style={[styles.historyIndicator, { backgroundColor: item.color }]} />
                <View>
                  <Text style={styles.historyTitle}>{item.type}</Text>
                  <Text style={styles.historyDate}>{item.date}</Text>
                </View>
              </View>
              <View style={styles.historyRight}>
                <Text style={styles.historyDuration}>{item.duration}</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${item.progress}%`, backgroundColor: item.color }]} />
                </View>
              </View>
            </LinearGradient>
          </View>
        ))}
      </View>

      {/* Quick Stats */}
      <TouchableOpacity style={styles.quickStatsButton} onPress={() => setCurrentView('stats')}>
        <Text style={styles.quickStatsText}>View Detailed Stats →</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacer} />
    </Animated.ScrollView>
  );

  const renderStats = () => (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentView('overview')}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mindful Hours Stats</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Total Hours */}
        <View style={styles.totalHoursCard}>
          <LinearGradient
            colors={[freudDarkTheme.colors.status.success, '#16A34A']}
            style={styles.totalHoursGradient}
          >
            <Text style={styles.totalHoursNumber}>8.2h</Text>
            <Text style={styles.totalHoursLabel}>Total</Text>
          </LinearGradient>
        </View>

        {/* Category Stats */}
        <View style={styles.categoryStats}>
          {MINDFUL_STATS.map((stat, index) => (
            <View key={stat.category} style={styles.categoryStatItem}>
              <View style={styles.categoryStatLeft}>
                <View style={[styles.categoryIndicator, { backgroundColor: stat.color }]} />
                <Text style={styles.categoryName}>{stat.category}</Text>
              </View>
              <View style={styles.categoryStatRight}>
                <Text style={styles.categoryTime}>{stat.time}</Text>
                <Text style={styles.categoryPercentage}>{stat.percentage}%</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Add Session Button */}
        <TouchableOpacity 
          style={styles.addSessionButton} 
          onPress={() => setCurrentView('newExercise')}
        >
          <LinearGradient
            colors={[freudDarkTheme.colors.accent.primary, '#F97316']}
            style={styles.addSessionGradient}
          >
            <Text style={styles.addSessionText}>+ Add New Session</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );

  const renderNewExercise = () => (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentView('overview')}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Exercise</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.questionTitle}>What's your mindful exercise goal?</Text>
        
        <View style={styles.goalsGrid}>
          {EXERCISE_GOALS.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              style={[
                styles.goalCard,
                selectedGoal === goal.id && styles.selectedGoalCard
              ]}
              onPress={() => setSelectedGoal(goal.id)}
            >
              <View style={styles.goalRadio}>
                <View style={[
                  styles.goalRadioInner,
                  selectedGoal === goal.id && styles.selectedGoalRadio
                ]} />
              </View>
              <View style={styles.goalContent}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalDescription}>{goal.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.continueButton, !selectedGoal && styles.disabledButton]}
          onPress={() => selectedGoal && setCurrentView('exerciseSetup')}
          disabled={!selectedGoal}
        >
          <LinearGradient
            colors={selectedGoal ? 
              [freudDarkTheme.colors.accent.primary, '#F97316'] : 
              ['#666', '#555']
            }
            style={styles.continueButtonGradient}
          >
            <Text style={styles.continueButtonText}>Continue →</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );

  const renderExerciseSetup = () => (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentView('newExercise')}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Exercise</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Time Selection */}
        <View style={styles.setupSection}>
          <Text style={styles.setupTitle}>How much time do you have for exercise?</Text>
          <View style={styles.timeSelector}>
            <Text style={styles.timeDisplay}>{exerciseTime}:00</Text>
            <Text style={styles.timeLabel}>Minutes</Text>
          </View>
          <View style={styles.timeControls}>
            <TouchableOpacity 
              style={styles.timeButton}
              onPress={() => setExerciseTime(Math.max(1, exerciseTime - 1))}
            >
              <Text style={styles.timeButtonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.timeButton}
              onPress={() => setExerciseTime(Math.min(60, exerciseTime + 1))}
            >
              <Text style={styles.timeButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Soundscape Selection */}
        <View style={styles.setupSection}>
          <Text style={styles.setupTitle}>Select Soundscapes</Text>
          <View style={styles.soundscapeGrid}>
            {SOUNDSCAPES.map((sound) => (
              <TouchableOpacity
                key={sound.id}
                style={[
                  styles.soundscapeCard,
                  selectedSoundscape === sound.id && styles.selectedSoundscapeCard
                ]}
                onPress={() => setSelectedSoundscape(sound.id)}
              >
                <Text style={styles.soundscapeIcon}>{sound.icon}</Text>
                <Text style={styles.soundscapeName}>{sound.name}</Text>
                <Text style={styles.soundscapeDuration}>{sound.duration}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={startBreathingExercise}>
          <LinearGradient
            colors={[freudDarkTheme.colors.accent.primary, '#F97316']}
            style={styles.startButtonGradient}
          >
            <Text style={styles.startButtonText}>Continue →</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );

  const renderBreathingExercise = () => (
    <Animated.View style={[styles.breathingContainer, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={breathingPhase === 'inhale' ? 
          ['#22C55E', '#16A34A'] : 
          breathingPhase === 'exhale' ?
          ['#F97316', '#EA580C'] :
          ['#8B5CF6', '#7C3AED']
        }
        style={styles.breathingGradient}
      >
        {/* Header */}
        <View style={styles.breathingHeader}>
          <TouchableOpacity onPress={stopBreathingExercise}>
            <Text style={styles.breathingBackButton}>×</Text>
          </TouchableOpacity>
        </View>

        {/* Progress */}
        <View style={styles.breathingProgress}>
          <Animated.View 
            style={[
              styles.breathingProgressBar,
              { 
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%']
                })
              }
            ]}
          />
        </View>

        {/* Breathing Circle */}
        <View style={styles.breathingCenter}>
          <Animated.View 
            style={[
              styles.breathingCircle,
              { 
                transform: [
                  { scale: breathAnim },
                  { scale: pulseAnim }
                ]
              }
            ]}
          >
            <View style={styles.breathingCircleInner}>
              <Text style={styles.breathingText}>
                {breathingPhase === 'inhale' ? 'Breathe In...' :
                 breathingPhase === 'hold' ? 'Hold...' :
                 'Breathe Out...'}
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* Controls */}
        <View style={styles.breathingControls}>
          <TouchableOpacity style={styles.breathingControlButton}>
            <Text style={styles.breathingControlIcon}>↻</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.breathingPlayButton}
            onPress={() => setIsBreathing(!isBreathing)}
          >
            <Text style={styles.breathingPlayIcon}>
              {isBreathing ? '⏸️' : '▶️'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.breathingControlButton}>
            <Text style={styles.breathingControlIcon}>↻</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const renderComplete = () => (
    <Animated.View style={[styles.completeContainer, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={[freudDarkTheme.colors.background.primary, freudDarkTheme.colors.background.secondary]}
        style={styles.completeGradient}
      >
        {/* Close Button */}
        <TouchableOpacity 
          style={styles.completeCloseButton}
          onPress={() => setCurrentView('overview')}
        >
          <Text style={styles.completeCloseText}>×</Text>
        </TouchableOpacity>

        {/* Success Content */}
        <View style={styles.completeContent}>
          <View style={styles.completeImageContainer}>
            <Text style={styles.completeEmoji}>🧘‍♀️</Text>
            <View style={styles.completeImageOverlay}>
              <Text style={styles.completeImageText}>💚</Text>
            </View>
          </View>
          
          <Text style={styles.completeTitle}>Exercise Completed!</Text>
          <Text style={styles.completeSubtitle}>
            My Friend Susee. 6.5 min completed!
          </Text>
          <Text style={styles.completeDescription}>
            Your mental health is improving. Congratulations for your commitment to wellbeing!
          </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={styles.completeButton}
          onPress={() => setCurrentView('overview')}
        >
          <LinearGradient
            colors={[freudDarkTheme.colors.accent.primary, '#F97316']}
            style={styles.completeButtonGradient}
          >
            <Text style={styles.completeButtonText}>Got It, Thanks!</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );

  return (
    <LinearGradient
      colors={[freudDarkTheme.colors.background.primary, freudDarkTheme.colors.background.secondary]}
      style={styles.screenContainer}
    >
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={
          currentView === 'breathing' ? '#22C55E' : 
          freudDarkTheme.colors.background.primary
        } 
      />
      <SafeAreaView style={styles.safeArea}>
        {/* Header for main views */}
        {(currentView === 'overview') && (
          <View style={styles.mainHeader}>
            <TouchableOpacity onPress={() => console.log('Go back')}>
              <Text style={styles.mainBackButton}>←</Text>
            </TouchableOpacity>
            <Text style={styles.mainHeaderTitle}>Mindful Hours</Text>
          </View>
        )}

        {currentView === 'overview' && renderOverview()}
        {currentView === 'stats' && renderStats()}
        {currentView === 'newExercise' && renderNewExercise()}
        {currentView === 'exerciseSetup' && renderExerciseSetup()}
        {currentView === 'breathing' && renderBreathingExercise()}
        {currentView === 'complete' && renderComplete()}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  mainBackButton: {
    fontSize: 24,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: '600',
    marginRight: 15,
  },
  mainHeaderTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: freudDarkTheme.colors.text.primary,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  backButton: {
    fontSize: 16,
    fontWeight: '600',
    color: freudDarkTheme.colors.accent.primary,
    marginRight: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: freudDarkTheme.colors.text.primary,
    flex: 1,
  },
  mainStatsCard: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  mainStatsGradient: {
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    position: 'relative',
  },
  mainStatsNumber: {
    fontSize: 60,
    fontWeight: '700',
    color: freudDarkTheme.colors.text.primary,
    marginBottom: 10,
  },
  mainStatsLabel: {
    fontSize: 18,
    color: freudDarkTheme.colors.text.secondary,
    opacity: 0.8,
  },
  progressCircle: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  progressCircleOuter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCircleInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: freudDarkTheme.colors.accent.primary,
  },
  addButton: {
    position: 'absolute',
    bottom: 100,
    left: 40,
    width: 56,
    height: 56,
    borderRadius: 28,
    zIndex: 10,
  },
  addButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: '300',
    color: '#FFFFFF',
  },
  historySection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: freudDarkTheme.colors.text.primary,
    marginBottom: 20,
  },
  historyItem: {
    marginBottom: 15,
  },
  historyItemGradient: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 15,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: freudDarkTheme.colors.text.primary,
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: freudDarkTheme.colors.text.secondary,
    opacity: 0.8,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyDuration: {
    fontSize: 16,
    fontWeight: '700',
    color: freudDarkTheme.colors.text.primary,
    marginBottom: 8,
  },
  progressBar: {
    width: 80,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  quickStatsButton: {
    marginTop: 30,
    alignItems: 'center',
    padding: 20,
  },
  quickStatsText: {
    fontSize: 16,
    fontWeight: '600',
    color: freudDarkTheme.colors.accent.primary,
  },
  bottomSpacer: {
    height: 120,
  },
  
  // Stats view styles
  totalHoursCard: {
    marginBottom: 30,
    alignItems: 'center',
  },
  totalHoursGradient: {
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    minWidth: 120,
  },
  totalHoursNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  totalHoursLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  categoryStats: {
    marginBottom: 30,
  },
  categoryStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: freudDarkTheme.colors.background.tertiary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  categoryStatLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 15,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: freudDarkTheme.colors.text.primary,
  },
  categoryStatRight: {
    alignItems: 'flex-end',
  },
  categoryTime: {
    fontSize: 18,
    fontWeight: '700',
    color: freudDarkTheme.colors.text.primary,
    marginBottom: 4,
  },
  categoryPercentage: {
    fontSize: 12,
    color: freudDarkTheme.colors.text.secondary,
    opacity: 0.8,
  },
  addSessionButton: {
    marginBottom: 30,
  },
  addSessionGradient: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  addSessionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // New exercise styles
  questionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: freudDarkTheme.colors.text.primary,
    textAlign: 'center',
    marginBottom: 30,
  },
  goalsGrid: {
    marginBottom: 30,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: freudDarkTheme.colors.background.tertiary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedGoalCard: {
    borderColor: freudDarkTheme.colors.accent.primary,
  },
  goalRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: freudDarkTheme.colors.text.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  goalRadioInner: {
    width: 0,
    height: 0,
    borderRadius: 5,
    backgroundColor: freudDarkTheme.colors.accent.primary,
  },
  selectedGoalRadio: {
    width: 10,
    height: 10,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: freudDarkTheme.colors.text.primary,
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
    color: freudDarkTheme.colors.text.secondary,
    opacity: 0.8,
  },
  continueButton: {
    marginBottom: 30,
  },
  disabledButton: {
    opacity: 0.5,
  },
  continueButtonGradient: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Exercise setup styles
  setupSection: {
    marginBottom: 40,
  },
  setupTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: freudDarkTheme.colors.text.primary,
    textAlign: 'center',
    marginBottom: 25,
  },
  timeSelector: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timeDisplay: {
    fontSize: 48,
    fontWeight: '700',
    color: freudDarkTheme.colors.accent.primary,
    marginBottom: 5,
  },
  timeLabel: {
    fontSize: 16,
    color: freudDarkTheme.colors.text.secondary,
    opacity: 0.8,
  },
  timeControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
  },
  timeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: freudDarkTheme.colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeButtonText: {
    fontSize: 24,
    fontWeight: '300',
    color: freudDarkTheme.colors.text.primary,
  },
  soundscapeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  soundscapeCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: freudDarkTheme.colors.background.tertiary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedSoundscapeCard: {
    borderColor: freudDarkTheme.colors.accent.primary,
  },
  soundscapeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  soundscapeName: {
    fontSize: 12,
    fontWeight: '600',
    color: freudDarkTheme.colors.text.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  soundscapeDuration: {
    fontSize: 10,
    color: freudDarkTheme.colors.text.secondary,
    opacity: 0.8,
  },
  startButton: {
    marginTop: 20,
    marginBottom: 30,
  },
  startButtonGradient: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Breathing exercise styles
  breathingContainer: {
    flex: 1,
  },
  breathingGradient: {
    flex: 1,
    paddingHorizontal: 20,
  },
  breathingHeader: {
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: 'flex-end',
  },
  breathingBackButton: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '300',
    padding: 10,
  },
  breathingProgress: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 40,
    overflow: 'hidden',
  },
  breathingProgressBar: {
    height: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  breathingCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  breathingCircleInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  breathingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
    gap: 40,
  },
  breathingControlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingControlIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  breathingPlayButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingPlayIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  
  // Complete screen styles
  completeContainer: {
    flex: 1,
  },
  completeGradient: {
    flex: 1,
    paddingHorizontal: 20,
  },
  completeCloseButton: {
    alignSelf: 'flex-end',
    padding: 10,
    paddingTop: 20,
  },
  completeCloseText: {
    fontSize: 24,
    color: freudDarkTheme.colors.text.secondary,
    fontWeight: '300',
  },
  completeContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  completeImageContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  completeEmoji: {
    fontSize: 80,
  },
  completeImageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: freudDarkTheme.colors.accent.primary,
    borderRadius: 20,
    padding: 8,
  },
  completeImageText: {
    fontSize: 20,
  },
  completeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: freudDarkTheme.colors.text.primary,
    textAlign: 'center',
    marginBottom: 15,
  },
  completeSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: freudDarkTheme.colors.accent.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  completeDescription: {
    fontSize: 16,
    color: freudDarkTheme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  completeButton: {
    marginBottom: 30,
  },
  completeButtonGradient: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});