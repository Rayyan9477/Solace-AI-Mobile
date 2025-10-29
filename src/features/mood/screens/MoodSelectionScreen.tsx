/**
 * Mood Selection Screen - Select current mood
 * Based on ui-designs/Dark-mode/Mood Tracker.png
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@theme/ThemeProvider';

type MoodType = 'depressed' | 'sad' | 'neutral' | 'happy' | 'overjoyed';

interface MoodOption {
  type: MoodType;
  emoji: string;
  label: string;
  description: string;
  backgroundColor: string;
  textColor: string;
}

const MOODS: MoodOption[] = [
  {
    type: 'depressed',
    emoji: '😭',
    label: 'Depressed',
    description: "I'm feeling Depressed",
    backgroundColor: '#8B7DA8',
    textColor: '#FFFFFF',
  },
  {
    type: 'sad',
    emoji: '😔',
    label: 'Sad',
    description: "I'm feeling Sad",
    backgroundColor: '#C96100',
    textColor: '#FFFFFF',
  },
  {
    type: 'neutral',
    emoji: '😐',
    label: 'Neutral',
    description: "I'm feeling Neutral",
    backgroundColor: '#8B7B6F',
    textColor: '#FFFFFF',
  },
  {
    type: 'happy',
    emoji: '😊',
    label: 'Happy',
    description: "I'm feeling Happy",
    backgroundColor: '#F5C563',
    textColor: '#4A3D2B',
  },
  {
    type: 'overjoyed',
    emoji: '😄',
    label: 'Overjoyed',
    description: "I'm feeling Overjoyed!",
    backgroundColor: '#98B068',
    textColor: '#FFFFFF',
  },
];

export const MoodSelectionScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [scaleAnim] = useState(new Animated.Value(1));

  const currentMood = MOODS.find(m => m.type === selectedMood);
  const backgroundColor = currentMood?.backgroundColor || theme.colors.background.primary;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 32,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    title: {
      fontSize: 28,
      fontWeight: '800',
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: 60,
    },
    emojiContainer: {
      width: 180,
      height: 180,
      borderRadius: 90,
      backgroundColor: 'rgba(255,255,255,0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 32,
    },
    emoji: {
      fontSize: 100,
    },
    moodLabel: {
      fontSize: 24,
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: 80,
    },
    intensityIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 40,
    },
    dot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: 'rgba(255,255,255,0.3)',
    },
    dotActive: {
      backgroundColor: '#FFFFFF',
      width: 16,
      height: 16,
      borderRadius: 8,
    },
    footer: {
      padding: 20,
    },
    setMoodButton: {
      backgroundColor: 'rgba(255,255,255,0.9)',
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
    },
    setMoodButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: backgroundColor,
    },
    gestureHint: {
      position: 'absolute',
      bottom: 120,
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    gestureText: {
      fontSize: 12,
      fontWeight: '600',
      color: 'rgba(255,255,255,0.7)',
    },
  });

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSetMood = () => {
    if (selectedMood) {
      navigation.navigate('MoodStats', { mood: selectedMood });
    }
  };

  // Swipe through moods
  const handleSwipe = (direction: 'left' | 'right') => {
    if (!selectedMood) {
      setSelectedMood('neutral');
      return;
    }

    const currentIndex = MOODS.findIndex(m => m.type === selectedMood);
    let nextIndex = direction === 'right' ? currentIndex + 1 : currentIndex - 1;

    if (nextIndex < 0) nextIndex = MOODS.length - 1;
    if (nextIndex >= MOODS.length) nextIndex = 0;

    handleMoodSelect(MOODS[nextIndex].type);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 20, color: '#FFFFFF' }}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>How are you feeling this day?</Text>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>{currentMood?.emoji || '😐'}</Text>
          </View>
        </Animated.View>

        <Text style={styles.moodLabel}>{currentMood?.description || "Select your mood"}</Text>

        {/* Intensity Indicator */}
        <View style={styles.intensityIndicator}>
          {MOODS.map((mood, index) => {
            const moodIndex = MOODS.findIndex(m => m.type === selectedMood);
            return (
              <TouchableOpacity
                key={mood.type}
                onPress={() => handleMoodSelect(mood.type)}
              >
                <View style={[
                  styles.dot,
                  index === moodIndex && styles.dotActive,
                ]} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Gesture Hint */}
      <View style={styles.gestureHint}>
        <Text style={styles.gestureText}>← Swipe to change mood →</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.setMoodButton}
          onPress={handleSetMood}
          disabled={!selectedMood}
        >
          <Text style={styles.setMoodButtonText}>Set Mood</Text>
          <Text style={styles.setMoodButtonText}>✓</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MoodSelectionScreen;
