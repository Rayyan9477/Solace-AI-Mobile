import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import hapticFeedback from '../../utils/hapticFeedback';
import { colors, typography, spacing, borderRadius, shadows } from '../../styles/theme';

const MoodSelector = ({ selectedMood, onMoodSelect }) => {
  const { theme, accessibilitySettings } = useTheme();

  const handleMoodSelect = (moodId) => {
    // Trigger haptic feedback if enabled
    if (accessibilitySettings.hapticFeedback !== false) {
      hapticFeedback.moodSelected(moodId);
    }
    
    onMoodSelect(moodId);
  };
  

  const moods = [
    { id: 'happy', emoji: '😊', label: 'Happy', color: theme.colors.mood.happy },
    { id: 'calm', emoji: '😌', label: 'Calm', color: theme.colors.mood.calm },
    { id: 'neutral', emoji: '😐', label: 'Neutral', color: theme.colors.mood.neutral },
    { id: 'anxious', emoji: '😰', label: 'Anxious', color: theme.colors.mood.anxious },
    { id: 'sad', emoji: '😢', label: 'Sad', color: theme.colors.mood.sad },
    { id: 'angry', emoji: '😠', label: 'Angry', color: theme.colors.mood.angry },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.moodGrid}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.id}
            style={[
              styles.moodItem,
              {
                backgroundColor: selectedMood === mood.id ? mood.color : theme.colors.background.primary,
                borderColor: selectedMood === mood.id ? mood.color : theme.colors.gray[300],
              }
            ]}
            onPress={() => handleMoodSelect(mood.id)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Select ${mood.label} mood`}
            accessibilityHint={`Tap to select ${mood.label} as your current mood`}
            accessibilityState={{ selected: selectedMood === mood.id }}
            testID={`mood-selector-${mood.id}`}
          >
            <Text style={[
              styles.moodEmoji,
              { opacity: selectedMood === mood.id ? 1 : 0.7 }
            ]}>
              {mood.emoji}
            </Text>
            <Text style={[
              styles.moodLabel,
              {
                color: selectedMood === mood.id ? theme.colors.text.inverse : theme.colors.text.primary,
                fontWeight: selectedMood === mood.id ? '600' : '400',
              }
            ]}>
              {mood.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing[3],
  },
  moodItem: {
    width: 90,
    height: 90,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  moodEmoji: {
    fontSize: theme.typography.sizes['2xl'],
    marginBottom: theme.spacing[1],
  },
  moodLabel: {
    fontSize: theme.typography.sizes.sm,
    lineHeight: theme.typography.lineHeights.sm,
  },
});

export default MoodSelector;
