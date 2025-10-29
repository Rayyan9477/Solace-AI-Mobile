/**
 * Journal Create Screen - Create New Journal Entry
 * Based on ui-designs/Dark-mode/Mental Health Journal.png
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from "@theme/ThemeProvider";

const MOODS = [
  { emoji: '😭', label: 'Sad', color: '#8B7DA8' },
  { emoji: '😤', label: 'Angry', color: '#C96100' },
  { emoji: '😐', label: 'Neutral', color: '#D4A574' },
  { emoji: '🙂', label: 'Happy', color: '#F5C563' },
  { emoji: '😊', label: 'Great', color: '#98B068' },
];

const TAGS = [
  'Gratitude', 'Growth', 'Goals', 'Family', 'Work', 'Health',
  'Stress', 'Anxiety', 'Depression', 'Therapy', 'Mindfulness',
  'Self-care', 'Relationships', 'Emotions', 'Progress', 'Setback'
];

export const JournalCreateScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const [journalType, setJournalType] = useState<'text' | 'voice'>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.brown[30],
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.brown[20],
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text.primary,
    },
    saveButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: theme.colors.brown[70],
    },
    saveButtonText: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.background.secondary,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    typeSelector: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 24,
    },
    typeButton: {
      flex: 1,
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 16,
      alignItems: 'center',
      backgroundColor: theme.colors.brown[20],
    },
    typeButtonActive: {
      backgroundColor: theme.colors.brown[70],
    },
    typeButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.text.primary,
    },
    typeButtonTextActive: {
      color: theme.colors.background.secondary,
    },
    section: {
      marginBottom: 24,
    },
    sectionLabel: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.text.secondary,
      marginBottom: 12,
    },
    input: {
      backgroundColor: theme.colors.brown[20],
      borderRadius: 16,
      padding: 16,
      fontSize: 16,
      color: theme.colors.text.primary,
      fontWeight: '600',
    },
    textArea: {
      minHeight: 200,
      textAlignVertical: 'top',
    },
    voiceRecorder: {
      backgroundColor: theme.colors.brown[20],
      borderRadius: 20,
      padding: 32,
      alignItems: 'center',
      minHeight: 300,
      justifyContent: 'center',
    },
    promptText: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text.primary,
      textAlign: 'center',
      marginBottom: 32,
    },
    recordButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.background.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    recordButtonActive: {
      backgroundColor: '#FF6B6B',
    },
    recordingTime: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    recordingLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text.secondary,
    },
    waveformContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 60,
      marginTop: 20,
    },
    waveBar: {
      width: 3,
      backgroundColor: theme.colors.brown[70],
      borderRadius: 2,
      marginHorizontal: 2,
    },
    moodSelector: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 8,
    },
    moodButton: {
      flex: 1,
      aspectRatio: 1,
      backgroundColor: theme.colors.brown[20],
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    moodButtonActive: {
      borderColor: theme.colors.brown[70],
    },
    moodEmoji: {
      fontSize: 32,
      marginBottom: 4,
    },
    moodLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.text.secondary,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    tagButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: theme.colors.brown[20],
      borderWidth: 1,
      borderColor: 'transparent',
    },
    tagButtonActive: {
      backgroundColor: theme.colors.brown[70],
      borderColor: theme.colors.brown[70],
    },
    tagText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    tagTextActive: {
      color: theme.colors.background.secondary,
    },
    footer: {
      padding: 20,
    },
    createButton: {
      backgroundColor: theme.colors.brown[70],
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: 'center',
    },
    createButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.background.secondary,
    },
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const waveformHeights = isRecording
    ? [15, 30, 20, 40, 25, 35, 30, 25, 35, 20, 30, 25, 40, 20, 30]
    : [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 20 }}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Journal</Text>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Type Selector */}
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, journalType === 'text' && styles.typeButtonActive]}
            onPress={() => setJournalType('text')}
          >
            <Text style={[styles.typeButtonText, journalType === 'text' && styles.typeButtonTextActive]}>
              📝 Text
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, journalType === 'voice' && styles.typeButtonActive]}
            onPress={() => setJournalType('voice')}
          >
            <Text style={[styles.typeButtonText, journalType === 'voice' && styles.typeButtonTextActive]}>
              🎤 Voice
            </Text>
          </TouchableOpacity>
        </View>

        {/* Journal Title */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Journal Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Feeling Bad Again"
            placeholderTextColor={theme.colors.text.tertiary}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Text/Voice Input */}
        {journalType === 'text' ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Write Your Entry</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="I had a bad day today, at school. It is fine I guess..."
              placeholderTextColor={theme.colors.text.tertiary}
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={10}
            />
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Voice Journal</Text>
            <View style={styles.voiceRecorder}>
              <Text style={styles.promptText}>Say anything that's on your mind!</Text>

              <TouchableOpacity
                style={[styles.recordButton, isRecording && styles.recordButtonActive]}
                onPress={() => setIsRecording(!isRecording)}
              >
                <Text style={{ fontSize: 32 }}>{isRecording ? '⏸' : '🎤'}</Text>
              </TouchableOpacity>

              {isRecording && (
                <>
                  <Text style={styles.recordingTime}>{formatTime(recordingTime)}</Text>
                  <Text style={styles.recordingLabel}>Recording...</Text>
                </>
              )}

              <View style={styles.waveformContainer}>
                {waveformHeights.map((height, index) => (
                  <View
                    key={index}
                    style={[styles.waveBar, { height }]}
                  />
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Mood Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Select Your Emotion</Text>
          <View style={styles.moodSelector}>
            {MOODS.map((mood) => (
              <TouchableOpacity
                key={mood.label}
                style={[
                  styles.moodButton,
                  selectedMood === mood.label && styles.moodButtonActive
                ]}
                onPress={() => setSelectedMood(mood.label)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={styles.moodLabel}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Select Session</Text>
          <View style={styles.tagsContainer}>
            {TAGS.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tagButton,
                  selectedTags.includes(tag) && styles.tagButtonActive
                ]}
                onPress={() => {
                  if (selectedTags.includes(tag)) {
                    setSelectedTags(selectedTags.filter(t => t !== tag));
                  } else {
                    setSelectedTags([...selectedTags, tag]);
                  }
                }}
              >
                <Text style={[
                  styles.tagText,
                  selectedTags.includes(tag) && styles.tagTextActive
                ]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonText}>Create Journal ✨</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default JournalCreateScreen;
