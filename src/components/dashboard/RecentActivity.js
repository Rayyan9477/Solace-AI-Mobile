import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { MentalHealthIcon, ActionIcon } from '../icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../styles/theme';

const RecentActivity = ({ moodHistory, chatHistory }) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // Sample data if none provided
  const sampleMoodHistory = moodHistory && moodHistory.length > 0 ? moodHistory : [
    {
      id: 1,
      mood: 'calm',
      notes: 'Had a good meditation session this morning.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      mood: 'happy',
      notes: 'Completed my daily walk and felt energized.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const sampleChatHistory = chatHistory && chatHistory.length > 0 ? chatHistory : [
    {
      id: 1,
      title: 'Anxiety Management',
      lastMessage: 'Thank you for the breathing exercises. They really helped.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    }
  ];

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const getMoodEmoji = (mood) => {
    const emojis = {
      happy: '😊',
      calm: '😌',
      anxious: '😰',
      sad: '😢',
      angry: '😠',
      neutral: '😐',
    };
    return emojis[mood] || '😐';
  };

  const MoodActivityItem = ({ mood, notes, timestamp, index }) => (
    <Animated.View 
      style={[
        styles.activityItem,
        {
          opacity: fadeAnim,
          transform: [{
            translateY: slideAnim.interpolate({
              inputRange: [0, 30],
              outputRange: [0, 30 + (index * 10)],
            })
          }],
        }
      ]}
    >
      <LinearGradient
        colors={[theme.colors.therapeutic.calming[100], theme.colors.therapeutic.calming[50]]}
        style={styles.activityCard}
      >
        <View style={[styles.activityIcon, { backgroundColor: theme.colors.therapeutic.nurturing[400] }]}>
          <Text style={styles.activityEmoji}>{getMoodEmoji(mood)}</Text>
        </View>
        <View style={styles.activityContent}>
          <Text style={[styles.activityTitle, { color: theme.colors.text.primary }]}>
            Mood: {mood.charAt(0).toUpperCase() + mood.slice(1)}
          </Text>
          <Text style={[styles.activitySubtitle, { color: theme.colors.text.secondary }]}>
            {notes && notes.length > 50 ? `${notes.substring(0, 50)}...` : notes || 'No notes'}
          </Text>
          <Text style={[styles.activityTime, { color: theme.colors.text.tertiary }]}>
            {formatTimeAgo(timestamp)}
          </Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const ChatActivityItem = ({ title, lastMessage, timestamp, index }) => (
    <Animated.View 
      style={[
        styles.activityItem,
        {
          opacity: fadeAnim,
          transform: [{
            translateY: slideAnim.interpolate({
              inputRange: [0, 30],
              outputRange: [0, 30 + (index * 10)],
            })
          }],
        }
      ]}
    >
      <LinearGradient
        colors={[theme.colors.therapeutic.peaceful[100], theme.colors.therapeutic.peaceful[50]]}
        style={styles.activityCard}
      >
        <View style={[styles.activityIcon, { backgroundColor: theme.colors.therapeutic.calming[400] }]}>
          <MentalHealthIcon
            name="Therapy"
            size="sm"
            color={colors.text.inverse}
          />
        </View>
        <View style={styles.activityContent}>
          <Text style={[styles.activityTitle, { color: theme.colors.text.primary }]}>
            {title || 'Chat Session'}
          </Text>
          <Text style={[styles.activitySubtitle, { color: theme.colors.text.secondary }]}>
            {lastMessage && lastMessage.length > 50 
              ? `${lastMessage.substring(0, 50)}...` 
              : lastMessage || 'Started a conversation'}
          </Text>
          <Text style={[styles.activityTime, { color: theme.colors.text.tertiary }]}>
            {formatTimeAgo(timestamp)}
          </Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const hasActivity = sampleMoodHistory.length > 0 || sampleChatHistory.length > 0;

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}
    >
      <LinearGradient
        colors={[theme.colors.background.primary, theme.colors.background.secondary]}
        style={[styles.cardBackground, shadows.lg]}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <MentalHealthIcon
              name="Journal"
              size="sm"
              colorScheme="peaceful"
              style={styles.titleIcon}
            />
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>
              Recent Activity
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.viewAllButton, { minWidth: 44, minHeight: 44 }]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="View All Activity"
            accessibilityHint="Double tap to view all recent activity"
          >
            <ActionIcon
              name="Next"
              size="xs"
              colorScheme="primary"
            />
            <Text style={[styles.viewAllText, { color: theme.colors.primary[500] }]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>

        {hasActivity ? (
          <View style={styles.activityList}>
            {sampleMoodHistory.map((mood, index) => (
              <MoodActivityItem
                key={`mood-${mood.id || index}`}
                mood={mood.mood}
                notes={mood.notes}
                timestamp={mood.timestamp}
                index={index}
              />
            ))}
            
            {sampleChatHistory.map((chat, index) => (
              <ChatActivityItem
                key={`chat-${chat.id || index}`}
                title={chat.title}
                lastMessage={chat.lastMessage}
                timestamp={chat.timestamp}
                index={index + sampleMoodHistory.length}
              />
            ))}
          </View>
        ) : (
          <Animated.View 
            style={[
              styles.noActivity,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <View style={styles.noActivityIconContainer}>
              <Text style={styles.noActivityEmoji}>📱</Text>
            </View>
            <Text style={[styles.noActivityTitle, { color: theme.colors.text.primary }]}>
              No Recent Activity
            </Text>
            <Text style={[styles.noActivitySubtitle, { color: theme.colors.text.secondary }]}>
              Start by checking in with your mood or having a chat
            </Text>
          </Animated.View>
        )}
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing[4],
    marginVertical: spacing[3],
  },
  cardBackground: {
    padding: spacing[5],
    borderRadius: borderRadius.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleIcon: {
    marginRight: spacing[2],
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
    lineHeight: typography.lineHeights.lg,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.md,
    gap: spacing[1],
  },
  viewAllText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  activityList: {
    gap: spacing[3],
  },
  activityItem: {
    marginBottom: spacing[2],
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
    ...shadows.sm,
  },
  activityEmoji: {
    fontSize: typography.sizes.lg,
  },
  activityContent: {
    flex: 1,
    paddingTop: spacing[1],
  },
  activityTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semiBold,
    lineHeight: typography.lineHeights.base,
    marginBottom: spacing[1],
  },
  activitySubtitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.sm,
    marginBottom: spacing[2],
    opacity: 0.8,
  },
  activityTime: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    lineHeight: typography.lineHeights.xs,
  },
  noActivity: {
    alignItems: 'center',
    paddingVertical: spacing[8],
  },
  noActivityIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  noActivityEmoji: {
    fontSize: typography.sizes['4xl'],
  },
  noActivityTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semiBold,
    lineHeight: typography.lineHeights.base,
    marginBottom: spacing[2],
  },
  noActivitySubtitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.sm,
    textAlign: 'center',
    paddingHorizontal: spacing[4],
    opacity: 0.8,
  },
});

export default RecentActivity;
