import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { colors, typography, spacing, borderRadius, shadows } from '../../styles/theme';

const RecentActivity = ({ moodHistory, chatHistory }) => {
  const { theme } = useTheme();
  

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

  const MoodActivityItem = ({ mood, notes, timestamp }) => (
    <View style={styles.activityItem}>
      <View style={styles.activityIcon}>
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
    </View>
  );

  const ChatActivityItem = ({ title, lastMessage, timestamp }) => (
    <View style={styles.activityItem}>
      <View style={styles.activityIcon}>
        <Text style={styles.activityEmoji}>💬</Text>
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
    </View>
  );

  const hasActivity = moodHistory.length > 0 || chatHistory.length > 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Recent Activity
        </Text>
        <TouchableOpacity style={[styles.viewAllButton, { minWidth: 44, minHeight: 44 }]}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="View All"
        accessibilityHint="Double tap to activate"
      >
          <Text style={[styles.viewAllText, { color: theme.colors.primary[500] }]}>
            View All
          </Text>
        </TouchableOpacity>
      </View>

      {hasActivity ? (
        <View style={styles.activityList}>
          {moodHistory.map((mood, index) => (
            <MoodActivityItem
              key={`mood-${mood.id || index}`}
              mood={mood.mood}
              notes={mood.notes}
              timestamp={mood.timestamp}
            />
          ))}
          
          {chatHistory.map((chat, index) => (
            <ChatActivityItem
              key={`chat-${chat.id || index}`}
              title={chat.title}
              lastMessage={chat.lastMessage}
              timestamp={chat.timestamp}
            />
          ))}
        </View>
      ) : (
        <View style={styles.noActivity}>
          <Text style={styles.noActivityEmoji}>📱</Text>
          <Text style={[styles.noActivityTitle, { color: theme.colors.text.primary }]}>
            No Recent Activity
          </Text>
          <Text style={[styles.noActivitySubtitle, { color: theme.colors.text.secondary }]}>
            Start by checking in with your mood or having a chat
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing[4],
    marginVertical: spacing[3],
    padding: spacing[4],
    borderRadius: borderRadius.md,
    ...shadows.base,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
    lineHeight: typography.lineHeights.lg,
  },
  viewAllButton: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
  },
  viewAllText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  activityList: {
    gap: spacing[3],
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing[2],
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
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
    marginBottom: spacing[1],
  },
  activityTime: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.xs,
  },
  noActivity: {
    alignItems: 'center',
    paddingVertical: spacing[8],
  },
  noActivityEmoji: {
    fontSize: typography.sizes['4xl'],
    marginBottom: spacing[3],
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
  },
});

export default RecentActivity;
