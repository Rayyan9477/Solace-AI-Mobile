import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const MoodCheckIn = ({ currentMood, onCheckIn }) => {
  const { theme } = useTheme();

  const moodEmojis = {
    happy: '😊',
    calm: '😌',
    anxious: '😰',
    sad: '😢',
    angry: '😠',
    neutral: '😐',
  };

  const moodColors = {
    happy: theme.colors.mood.happy,
    calm: theme.colors.mood.calm,
    anxious: theme.colors.mood.anxious,
    sad: theme.colors.mood.sad,
    angry: theme.colors.mood.angry,
    neutral: theme.colors.mood.neutral,
  };

  const getCurrentMoodDisplay = () => {
    if (currentMood) {
      return {
        emoji: moodEmojis[currentMood],
        color: moodColors[currentMood],
        text: currentMood.charAt(0).toUpperCase() + currentMood.slice(1),
      };
    }
    return null;
  };

  const moodDisplay = getCurrentMoodDisplay();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Daily Mood Check-in
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          {moodDisplay ? 'Update your mood' : 'How are you feeling right now?'}
        </Text>
      </View>

      {moodDisplay && (
        <View style={styles.currentMoodContainer}>
          <View style={[styles.currentMoodIndicator, { backgroundColor: moodDisplay.color }]}>
            <Text style={styles.currentMoodEmoji}>{moodDisplay.emoji}</Text>
          </View>
          <Text style={[styles.currentMoodText, { color: theme.colors.text.primary }]}>
            Currently feeling {moodDisplay.text}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.checkInButton, { backgroundColor: theme.colors.primary[500] }]}
        onPress={onCheckIn}
        activeOpacity={0.8}
      >
        <Text style={[styles.checkInButtonText, { color: theme.colors.text.inverse }]}>
          {moodDisplay ? 'Update Mood' : 'Check In Now'}
        </Text>
        <Text style={styles.checkInButtonIcon}>📝</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  currentMoodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  currentMoodIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  currentMoodEmoji: {
    fontSize: 16,
  },
  currentMoodText: {
    fontSize: 14,
    fontWeight: '500',
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkInButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  checkInButtonIcon: {
    fontSize: 16,
  },
});

export default MoodCheckIn;
