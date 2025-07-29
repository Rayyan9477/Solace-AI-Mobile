import React, { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { , Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { colors, typography, spacing, borderRadius, shadows } from '../../styles/theme';
import { logMood } from '../../store/slices/moodSlice';
import MoodSelector from '../../components/mood/MoodSelector';
import IntensitySlider from '../../components/mood/IntensitySlider';
import ActivitySelector from '../../components/mood/ActivitySelector';

const MoodTrackerScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { loading } = useSelector(state => state.mood);

  const [selectedMood, setSelectedMood] = useState(null);
  const [intensity, setIntensity] = useState(3);
  const [notes, setNotes] = useState('');
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  // Validation rules
  const validateForm = () => {
    const errors = {};

    // Mood validation
    if (!selectedMood) {
      errors.mood = 'Please select your mood';
    }

    // Intensity validation
    if (intensity < 1 || intensity > 5) {
      errors.intensity = 'Intensity must be between 1 and 5';
    }

    // Notes validation
    if (notes.length > 500) {
      errors.notes = 'Notes must be less than 500 characters';
    }

    // Check for meaningful content if notes are provided
    if (notes && notes.trim().length < 3 && notes.trim().length > 0) {
      errors.notes = 'Please provide meaningful notes or leave empty';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Real-time validation for notes
  const handleNotesChange = (text) => {
    setNotes(text);
    
    // Clear previous notes error if user is typing
    if (validationErrors.notes) {
      const newErrors = { ...validationErrors };
      delete newErrors.notes;
      setValidationErrors(newErrors);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      const errorMessage = Object.values(validationErrors).join('\n');
      Alert.alert('Please fix the following errors:', errorMessage);
      return;
    }

    try {
      await dispatch(logMood({
        mood: selectedMood,
        intensity,
        notes,
        activities: selectedActivities,
      })).unwrap();

      Alert.alert(
        'Mood Logged',
        'Your mood has been recorded successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to log mood. Please try again.');
    }
  };

  const handleActivityToggle = (activity) => {
    setSelectedActivities(prev => 
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  return (
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
>
<View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            How are you feeling?
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            Take a moment to check in with yourself
          </Text>
        </View>

        {/* Mood Selection */}
        <View style={[styles.section, { backgroundColor: theme.colors.background.secondary }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Select Your Mood
          </Text>
          <MoodSelector
            selectedMood={selectedMood}
            onMoodSelect={setSelectedMood}
          />
        </View>

        {/* Intensity Slider */}
        <View style={[styles.section, { backgroundColor: theme.colors.background.secondary }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            How intense is this feeling?
          </Text>
          <IntensitySlider
            value={intensity}
            onValueChange={setIntensity}
          />
        </View>

        {/* Activity Selection */}
        <View style={[styles.section, { backgroundColor: theme.colors.background.secondary }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            What activities have you been doing?
          </Text>
          <ActivitySelector
            selectedActivities={selectedActivities}
            onActivityToggle={handleActivityToggle}
          />
        </View>

        {/* Notes */}
        <View style={[styles.section, { backgroundColor: theme.colors.background.secondary }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Additional Notes (Optional)
          </Text>
          <TextInput
            style={[styles.notesInput, { 
              backgroundColor: theme.colors.background.primary,
              color: theme.colors.text.primary,
              borderColor: theme.colors.gray[300],
            }]}
            placeholder="What's on your mind? Any specific triggers or thoughts?"
            placeholderTextColor={theme.colors.text.tertiary}
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={handleNotesChange}
            textAlignVertical="top"
          />
          {validationErrors.notes && (
            <Text style={[styles.errorText, { color: theme.colors.error[500] }]}>
              {validationErrors.notes}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            { 
              backgroundColor: selectedMood ? theme.colors.primary[500] : theme.colors.gray[400],
              minWidth: 44, 
              minHeight: 44 
            }
          ]}
          onPress={() =
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="{loading ? 'Logging...' : 'Log Mood'}"
        accessibilityHint="Double tap to activate"
      > {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            handleSubmit();
          }}
          disabled={!selectedMood || loading}
          activeOpacity={0.8}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={loading ? 'Submitting mood entry' : 'Submit mood entry'}
          accessibilityHint="Save your current mood and notes"
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Logging...' : 'Log Mood'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
</KeyboardAvoidingView>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.theme.spacing[4],
  },
  header: {
    paddingVertical: theme.theme.spacing[6],
    alignItems: 'center',
  },
  title: {
    fontSize: theme.theme.typography.sizes['3xl'],
    fontWeight: '700',
    lineHeight: theme.theme.typography.lineHeights['3xl'],
    marginBottom: theme.theme.spacing[2],
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.theme.typography.sizes.base,
    fontWeight: '400',
    lineHeight: theme.theme.typography.lineHeights.base,
    textAlign: 'center',
  },
  section: {
    marginBottom: theme.theme.spacing[4],
    padding: theme.theme.spacing[4],
    borderRadius: theme.theme.borderRadius.md,
    ...theme.theme.shadows.base,
  },
  sectionTitle: {
    fontSize: theme.theme.typography.sizes.lg,
    fontWeight: '600',
    lineHeight: theme.theme.typography.lineHeights.lg,
    marginBottom: theme.theme.spacing[4],
  },
  notesInput: {
    minHeight: 100,
    padding: theme.theme.spacing[3],
    borderRadius: theme.theme.borderRadius.md,
    borderWidth: 1,
    fontSize: theme.theme.typography.sizes.base,
    lineHeight: theme.theme.typography.lineHeights.base,
  },
  footer: {
    paddingHorizontal: theme.theme.spacing[4],
    paddingVertical: theme.theme.spacing[4],
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
  },
  submitButton: {
    paddingVertical: theme.theme.spacing[4],
    paddingHorizontal: theme.theme.spacing[6],
    borderRadius: theme.theme.borderRadius.md,
    alignItems: 'center',
    ...theme.theme.shadows.base,
  },
  submitButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.theme.typography.sizes.base,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 14,
    marginTop: 8,
    marginLeft: 4,
  },
});

export default MoodTrackerScreen;
