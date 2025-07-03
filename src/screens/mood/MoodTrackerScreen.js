import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
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

  

  const handleSubmit = async () => {
    if (!selectedMood) {
      Alert.alert('Missing Information', 'Please select your mood first.');
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
            onChangeText={setNotes}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: selectedMood ? theme.colors.primary[500] : theme.colors.gray[400] }
          ]}
          onPress={handleSubmit}
          disabled={!selectedMood || loading}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Logging...' : 'Log Mood'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing[4],
  },
  header: {
    paddingVertical: theme.spacing[6],
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.sizes['3xl'],
    fontWeight: '700',
    lineHeight: theme.typography.lineHeights['3xl'],
    marginBottom: theme.spacing[2],
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: '400',
    lineHeight: theme.typography.lineHeights.base,
    textAlign: 'center',
  },
  section: {
    marginBottom: theme.spacing[4],
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.base,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '600',
    lineHeight: theme.typography.lineHeights.lg,
    marginBottom: theme.spacing[4],
  },
  notesInput: {
    minHeight: 100,
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    fontSize: theme.typography.sizes.base,
    lineHeight: theme.typography.lineHeights.base,
  },
  footer: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[4],
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
  },
  submitButton: {
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[6],
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    ...theme.shadows.base,
  },
  submitButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.base,
    fontWeight: '600',
  },
});

export default MoodTrackerScreen;
