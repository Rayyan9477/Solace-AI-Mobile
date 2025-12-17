/**
 * Empty State Illustrations - Beautiful empty states for mental health app
 * Provides calm, supportive visuals when there's no content
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { H3, Body } from '../Typography';

export interface EmptyStateProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  message: string;
  iconColor?: string;
  action?: React.ReactNode;
}

/**
 * Empty State Component
 * Shows friendly illustrations and helpful messages
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  message,
  iconColor = colors.semantic.primary,
  action,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={icon}
          size={120}
          color={iconColor}
          style={styles.icon}
        />
      </View>
      <H3 align="center" style={styles.title}>
        {title}
      </H3>
      <Body align="center" color={colors.semantic.onSurfaceVariant} style={styles.message}>
        {message}
      </Body>
      {action && <View style={styles.actionContainer}>{action}</View>}
    </View>
  );
};

// LOW-008 FIX: Add displayName for debugging and React DevTools
EmptyState.displayName = "EmptyState";

/**
 * Predefined empty states for common scenarios
 */

// No journal entries
export const EmptyJournal: React.FC<{ action?: React.ReactNode }> = ({ action }) => (
  <EmptyState
    icon="book-open-page-variant-outline"
    title="No Entries Yet"
    message="Start your journaling journey. Writing helps process emotions and track your mental health progress."
    iconColor={colors.brown[60]}
    action={action}
  />
);
EmptyJournal.displayName = "EmptyJournal";

// No mood entries
export const EmptyMood: React.FC<{ action?: React.ReactNode }> = ({ action }) => (
  <EmptyState
    icon="emoticon-happy-outline"
    title="Track Your First Mood"
    message="Understanding your emotions is the first step. Start tracking your moods to identify patterns and triggers."
    iconColor={colors.green[60]}
    action={action}
  />
);
EmptyMood.displayName = "EmptyMood";

// No chat conversations
export const EmptyChat: React.FC<{ action?: React.ReactNode }> = ({ action }) => (
  <EmptyState
    icon="chat-outline"
    title="Start a Conversation"
    message="I'm here to listen and support you. Share your thoughts, feelings, or anything on your mind."
    iconColor={colors.purple[60]}
    action={action}
  />
);
EmptyChat.displayName = "EmptyChat";

// No mindfulness sessions
export const EmptyMindfulness: React.FC<{ action?: React.ReactNode }> = ({ action }) => (
  <EmptyState
    icon="meditation"
    title="Begin Your Practice"
    message="Mindfulness helps reduce stress and anxiety. Start your first meditation or breathing exercise today."
    iconColor={colors.teal[60]}
    action={action}
  />
);
EmptyMindfulness.displayName = "EmptyMindfulness";

// No community posts
export const EmptyCommunity: React.FC<{ action?: React.ReactNode }> = ({ action }) => (
  <EmptyState
    icon="account-group-outline"
    title="Join the Community"
    message="Connect with others on similar journeys. Share your story, find support, and build meaningful connections."
    iconColor={colors.pink[60]}
    action={action}
  />
);
EmptyCommunity.displayName = "EmptyCommunity";

// No search results
export const EmptySearch: React.FC<{ action?: React.ReactNode }> = ({ action }) => (
  <EmptyState
    icon="magnify"
    title="No Results Found"
    message="Try different keywords or explore our categories to find the resources you're looking for."
    iconColor={colors.gray[60]}
    action={action}
  />
);
EmptySearch.displayName = "EmptySearch";

// No notifications
export const EmptyNotifications: React.FC<{ action?: React.ReactNode }> = ({ action }) => (
  <EmptyState
    icon="bell-outline"
    title="All Caught Up"
    message="You're all set! We'll notify you when there's something new to check out."
    iconColor={colors.blue[60]}
    action={action}
  />
);
EmptyNotifications.displayName = "EmptyNotifications";

// Offline state
export const OfflineState: React.FC<{ action?: React.ReactNode }> = ({ action }) => (
  <EmptyState
    icon="cloud-off-outline"
    title="You're Offline"
    message="Some features require an internet connection. Please check your connection and try again."
    iconColor={colors.gray[60]}
    action={action}
  />
);
OfflineState.displayName = "OfflineState";

// Error state
export const ErrorState: React.FC<{ action?: React.ReactNode }> = ({ action }) => (
  <EmptyState
    icon="alert-circle-outline"
    title="Something Went Wrong"
    message="We encountered an unexpected error. Please try again or contact support if the problem persists."
    iconColor={colors.red[60]}
    action={action}
  />
);
ErrorState.displayName = "ErrorState";

// Loading state
export const LoadingState: React.FC = () => (
  <EmptyState
    icon="loading"
    title="Loading..."
    message="Please wait while we fetch your content."
    iconColor={colors.semantic.primary}
  />
);
LoadingState.displayName = "LoadingState";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  iconContainer: {
    marginBottom: spacing.lg,
    opacity: 0.8,
  },
  icon: {
    textAlign: 'center',
  },
  title: {
    marginBottom: spacing.md,
  },
  message: {
    marginBottom: spacing.xl,
    maxWidth: 400,
  },
  actionContainer: {
    marginTop: spacing.md,
  },
});

export default EmptyState;
