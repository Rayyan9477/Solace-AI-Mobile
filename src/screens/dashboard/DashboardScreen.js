import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { MentalHealthAccessibility } from '../../utils/accessibility';
import { colors, typography, spacing, borderRadius, shadows } from '../../styles/theme';
import { fetchMoodHistory } from '../../store/slices/moodSlice';
import { fetchUserStats } from '../../store/slices/userSlice';

// Dashboard components
import WelcomeHeader from '../../components/dashboard/WelcomeHeader';
import MoodCheckIn from '../../components/dashboard/MoodCheckIn';
import DailyInsights from '../../components/dashboard/DailyInsights';
import QuickActions from '../../components/dashboard/QuickActions';
import ProgressOverview from '../../components/dashboard/ProgressOverview';
import RecentActivity from '../../components/dashboard/RecentActivity';

const DashboardScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  
  const { user, mood, chat, loading } = useSelector(state => ({
    user: state.user,
    mood: state.mood,
    chat: state.chat,
    loading: state.mood.loading || state.user.loading,
  }));

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchMoodHistory());
    dispatch(fetchUserStats());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchMoodHistory());
    dispatch(fetchUserStats());
  };

  const handleMoodCheckIn = () => {
    navigation.navigate('MoodTracker');
  };

  const handleStartChat = () => {
    navigation.navigate('Chat');
  };

  const handleTakeAssessment = () => {
    navigation.navigate('Assessment');
  };

  const handleViewProfile = () => {
    navigation.navigate('Profile');
  };

  const showEmergencyAlert = () => {
    Alert.alert(
      'Emergency Resources',
      'If you are experiencing a mental health crisis, please contact:\n\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• Or call 911 for immediate assistance',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call 988', onPress: () => {/* TODO: Implement phone call */} },
      ]
    );
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View 
      style={[styles.container, { backgroundColor: theme.colors.background.primary }]}
      accessibilityRole="main"
      accessibilityLabel="Dashboard screen"
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary[500]]}
            tintColor={theme.colors.primary[500]}
            accessibilityLabel="Pull to refresh dashboard"
          />
        }
        showsVerticalScrollIndicator={false}
        accessibilityRole="scrollbar"
        accessibilityLabel="Dashboard content"
      >
        {/* Welcome Header */}
        <WelcomeHeader
          greeting={getGreeting()}
          userName={user.profile.name || 'Friend'}
          onProfilePress={handleViewProfile}
          onEmergencyPress={showEmergencyAlert}
          {...MentalHealthAccessibility.dashboard.welcomeMessage(user.profile.name || 'Friend')}
        />

        {/* Mood Check-in */}
        <MoodCheckIn
          currentMood={mood.currentMood}
          onCheckIn={handleMoodCheckIn}
        />

        {/* Daily Insights */}
        <DailyInsights insights={mood.insights} />

        {/* Quick Actions */}
        <QuickActions
          onStartChat={handleStartChat}
          onTakeAssessment={handleTakeAssessment}
          onMoodTracker={handleMoodCheckIn}
        />

        {/* Progress Overview */}
        <ProgressOverview
          weeklyStats={mood.weeklyStats}
          userStats={user.stats}
        />

        {/* Recent Activity */}
        <RecentActivity
          moodHistory={mood.moodHistory.slice(0, 3)}
          chatHistory={chat.conversations.slice(0, 2)}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing[20],
  },
});

export default DashboardScreen;
