import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useDispatch } from 'react-redux';

import { 
  useTherapeuticEntrance, 
  useBreathingAnimation, 
  useMoodBasedAnimation,
  useGentlePress 
} from '../../animations/AdvancedAnimationSystem';
import { MentalHealthIcon } from '../icons';
import { useTheme } from '../../contexts/ThemeContext';
import { logMood } from '../../store/slices/moodSlice';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from '../../styles/theme';

const { width: screenWidth } = Dimensions.get('window');

/**
 * Enhanced Mood Check-In Component
 * Features advanced animations, haptic feedback, and therapeutic design
 */
const EnhancedMoodCheckIn = ({ 
  currentMood, 
  onMoodSelect,
  showIntensity = true,
  animated = true,
  therapeuticMode = true 
}) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [selectedMood, setSelectedMood] = useState(currentMood);
  const [selectedIntensity, setSelectedIntensity] = useState(3);
  const [isExpanded, setIsExpanded] = useState(false);

  // Advanced animations
  const entranceAnimations = useTherapeuticEntrance(3, 0);
  const breathingStyle = useBreathingAnimation(selectedMood || 'calming');
  const moodAnimationStyle = useMoodBasedAnimation(selectedMood);
  const pressAnimation = useGentlePress();

  // Therapeutic mood options with enhanced metadata
  const moodOptions = useMemo(() => [
    {
      id: 'joyful',
      label: 'Joyful',
      emoji: '😊',
      description: 'Feeling happy and content',
      color: theme.colors.mood.happy,
      intensity: [1, 2, 3, 4, 5],
      therapeuticMessage: 'Your joy is wonderful to see',
      icon: 'Heart'
    },
    {
      id: 'calm',
      label: 'Calm',
      emoji: '😌',
      description: 'Peaceful and relaxed',
      color: theme.colors.mood.calm,
      intensity: [1, 2, 3, 4, 5],
      therapeuticMessage: 'Finding calm is a beautiful achievement',
      icon: 'Mindfulness'
    },
    {
      id: 'energetic',
      label: 'Energetic',
      emoji: '🤩',
      description: 'Full of energy and motivation',
      color: theme.colors.mood.excited,
      intensity: [1, 2, 3, 4, 5],
      therapeuticMessage: 'Your energy is inspiring',
      icon: 'Brain'
    },
    {
      id: 'anxious',
      label: 'Anxious',
      emoji: '😰',
      description: 'Feeling worried or nervous',
      color: theme.colors.mood.anxious,
      intensity: [1, 2, 3, 4, 5],
      therapeuticMessage: 'It takes courage to acknowledge anxiety',
      icon: 'Heart'
    },
    {
      id: 'sad',
      label: 'Sad',
      emoji: '😢',
      description: 'Feeling down or melancholy',
      color: theme.colors.mood.sad,
      intensity: [1, 2, 3, 4, 5],
      therapeuticMessage: 'Your feelings are valid and important',
      icon: 'Heart'
    },
    {
      id: 'stressed',
      label: 'Stressed',
      emoji: '😤',
      description: 'Feeling overwhelmed or pressured',
      color: theme.colors.mood.stressed,
      intensity: [1, 2, 3, 4, 5],
      therapeuticMessage: 'Recognizing stress is the first step to managing it',
      icon: 'Brain'
    },
    {
      id: 'tired',
      label: 'Tired',
      emoji: '😴',
      description: 'Feeling fatigued or drained',
      color: theme.colors.mood.tired,
      intensity: [1, 2, 3, 4, 5],
      therapeuticMessage: 'Rest is essential for your wellbeing',
      icon: 'Mindfulness'
    },
    {
      id: 'neutral',
      label: 'Neutral',
      emoji: '😐',
      description: 'Feeling balanced or in-between',
      color: theme.colors.mood.neutral,
      intensity: [1, 2, 3, 4, 5],
      therapeuticMessage: 'Balance is a form of stability',
      icon: 'Heart'
    }
  ], [theme.colors.mood]);

  const selectedMoodData = useMemo(() => {
    return moodOptions.find(mood => mood.id === selectedMood);
  }, [selectedMood, moodOptions]);

  const handleMoodSelect = useCallback(async (moodId) => {
    // Haptic feedback
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setSelectedMood(moodId);
    setIsExpanded(true);

    if (onMoodSelect) {
      onMoodSelect(moodId);
    }
  }, [onMoodSelect]);

  const handleIntensitySelect = useCallback(async (intensity) => {
    // Haptic feedback
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setSelectedIntensity(intensity);
  }, []);

  const handleSaveMood = useCallback(async () => {
    if (!selectedMood) return;

    const moodData = {
      mood: selectedMood,
      intensity: selectedIntensity,
      timestamp: new Date().toISOString(),
      note: selectedMoodData?.therapeuticMessage || ''
    };

    // Dispatch to Redux store
    dispatch(logMood(moodData));

    // Success haptic feedback
    if (Platform.OS === 'ios') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    setIsExpanded(false);
  }, [selectedMood, selectedIntensity, selectedMoodData, dispatch]);

  const renderMoodOption = (mood, index) => (
    <Animated.View
      key={mood.id}
      style={[
        styles.moodOptionContainer,
        entranceAnimations[index] || {},
        selectedMood === mood.id && moodAnimationStyle
      ]}
    >
      <TouchableOpacity
        style={[
          styles.moodOption,
          {
            backgroundColor: selectedMood === mood.id 
              ? mood.color + '20' 
              : theme.colors.background.surface,
            borderColor: selectedMood === mood.id 
              ? mood.color 
              : theme.colors.gray[200],
            borderWidth: selectedMood === mood.id ? 2 : 1
          }
        ]}
        onPress={() => handleMoodSelect(mood.id)}
        activeOpacity={0.8}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`Select ${mood.label} mood`}
        accessibilityHint={mood.description}
        accessibilityState={{ selected: selectedMood === mood.id }}
        {...pressAnimation}
      >
        <LinearGradient
          colors={selectedMood === mood.id 
            ? [mood.color + '15', mood.color + '05'] 
            : [theme.colors.background.primary, theme.colors.background.secondary]
          }
          style={styles.moodOptionGradient}
        >
          <View style={styles.moodIconContainer}>
            <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            <MentalHealthIcon
              name={mood.icon}
              size="sm"
              color={selectedMood === mood.id ? mood.color : theme.colors.text.tertiary}
              style={styles.moodIcon}
            />
          </View>
          
          <View style={styles.moodTextContainer}>
            <Text
              style={[
                styles.moodLabel,
                { 
                  color: selectedMood === mood.id 
                    ? mood.color 
                    : theme.colors.text.primary 
                }
              ]}
            >
              {mood.label}
            </Text>
            <Text
              style={[
                styles.moodDescription,
                { color: theme.colors.text.secondary }
              ]}
            >
              {mood.description}
            </Text>
          </View>

          {selectedMood === mood.id && (
            <Animated.View style={[styles.selectedIndicator, breathingStyle]}>
              <LinearGradient
                colors={[mood.color, mood.color + '80']}
                style={styles.selectedIndicatorGradient}
              >
                <MentalHealthIcon
                  name="Heart"
                  size="xs"
                  color={colors.text.inverse}
                />
              </LinearGradient>
            </Animated.View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderIntensitySelector = () => {
    if (!selectedMoodData || !showIntensity) return null;

    return (
      <Animated.View 
        style={[
          styles.intensityContainer,
          entranceAnimations[1] || {}
        ]}
      >
        <LinearGradient
          colors={[
            theme.colors.background.primary,
            theme.colors.background.secondary
          ]}
          style={[styles.intensityCard, shadows.md]}
        >
          <View style={styles.intensityHeader}>
            <MentalHealthIcon
              name="Brain"
              size="sm"
              color={selectedMoodData.color}
              style={styles.intensityIcon}
            />
            <Text style={[styles.intensityTitle, { color: theme.colors.text.primary }]}>
              How intense is this feeling?
            </Text>
          </View>

          <View style={styles.intensityScale}>
            {[1, 2, 3, 4, 5].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.intensityDot,
                  {
                    backgroundColor: selectedIntensity >= level
                      ? selectedMoodData.color
                      : theme.colors.gray[200],
                    transform: [{ 
                      scale: selectedIntensity === level ? 1.2 : 1 
                    }]
                  }
                ]}
                onPress={() => handleIntensitySelect(level)}
                accessible
                accessibilityRole="button"
                accessibilityLabel={`Intensity level ${level} out of 5`}
                accessibilityState={{ selected: selectedIntensity === level }}
                {...pressAnimation}
              >
                {selectedIntensity >= level && (
                  <MentalHealthIcon
                    name="Heart"
                    size="xs"
                    color={colors.text.inverse}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.intensityLabels}>
            <Text style={[styles.intensityLabelText, { color: theme.colors.text.tertiary }]}>
              Mild
            </Text>
            <Text style={[styles.intensityLabelText, { color: theme.colors.text.tertiary }]}>
              Intense
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderTherapeuticMessage = () => {
    if (!selectedMoodData || !therapeuticMode) return null;

    return (
      <Animated.View 
        style={[
          styles.therapeuticMessageContainer,
          entranceAnimations[2] || {}
        ]}
      >
        <LinearGradient
          colors={[selectedMoodData.color + '10', selectedMoodData.color + '05']}
          style={styles.therapeuticMessageCard}
        >
          <MentalHealthIcon
            name="Heart"
            size="sm"
            color={selectedMoodData.color}
            style={styles.therapeuticIcon}
          />
          <Text
            style={[
              styles.therapeuticMessage,
              { color: theme.colors.text.primary }
            ]}
          >
            {selectedMoodData.therapeuticMessage}
          </Text>
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderSaveButton = () => {
    if (!selectedMood) return null;

    return (
      <Animated.View style={entranceAnimations[2] || {}}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveMood}
          activeOpacity={0.8}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Save mood entry"
          {...pressAnimation}
        >
          <LinearGradient
            colors={[
              selectedMoodData.color,
              selectedMoodData.color + 'CC'
            ]}
            style={styles.saveButtonGradient}
          >
            <MentalHealthIcon
              name="Heart"
              size="sm"
              color={colors.text.inverse}
              style={styles.saveButtonIcon}
            />
            <Text style={styles.saveButtonText}>
              Save Mood Entry
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, entranceAnimations[0] || {}]}>
        <LinearGradient
          colors={[
            theme.colors.background.primary,
            theme.colors.background.secondary
          ]}
          style={[styles.headerCard, shadows.lg]}
        >
          <View style={styles.headerContent}>
            <MentalHealthIcon
              name="Heart"
              size="md"
              colorScheme="nurturing"
              style={styles.headerIcon}
            />
            <View style={styles.headerText}>
              <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
                How are you feeling?
              </Text>
              <Text style={[styles.headerSubtitle, { color: theme.colors.text.secondary }]}>
                Your emotions are valid and important
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.moodGrid}>
          {moodOptions.map(renderMoodOption)}
        </View>

        {isExpanded && (
          <>
            {renderIntensitySelector()}
            {renderTherapeuticMessage()}
            {renderSaveButton()}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  header: {
    marginHorizontal: spacing[4],
    marginBottom: spacing[4]
  },
  headerCard: {
    borderRadius: borderRadius.xl,
    padding: spacing[5]
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerIcon: {
    marginRight: spacing[3]
  },
  headerText: {
    flex: 1
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
    lineHeight: typography.lineHeights.lg,
    marginBottom: spacing[1]
  },
  headerSubtitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.sm
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: spacing[10]
  },
  moodGrid: {
    paddingHorizontal: spacing[4],
    gap: spacing[3]
  },
  moodOptionContainer: {
    marginBottom: spacing[2]
  },
  moodOption: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm
  },
  moodOptionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    minHeight: 80
  },
  moodIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing[3]
  },
  moodEmoji: {
    fontSize: typography.sizes.xl,
    marginRight: spacing[2]
  },
  moodIcon: {
    opacity: 0.7
  },
  moodTextContainer: {
    flex: 1
  },
  moodLabel: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semiBold,
    lineHeight: typography.lineHeights.base,
    marginBottom: spacing[0.5]
  },
  moodDescription: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.sm
  },
  selectedIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden'
  },
  selectedIndicatorGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  intensityContainer: {
    marginHorizontal: spacing[4],
    marginTop: spacing[6]
  },
  intensityCard: {
    borderRadius: borderRadius.xl,
    padding: spacing[5]
  },
  intensityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4]
  },
  intensityIcon: {
    marginRight: spacing[2]
  },
  intensityTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    lineHeight: typography.lineHeights.base
  },
  intensityScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
    paddingHorizontal: spacing[4]
  },
  intensityDot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm
  },
  intensityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4]
  },
  intensityLabelText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium
  },
  therapeuticMessageContainer: {
    marginHorizontal: spacing[4],
    marginTop: spacing[4]
  },
  therapeuticMessageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderRadius: borderRadius.lg
  },
  therapeuticIcon: {
    marginRight: spacing[3]
  },
  therapeuticMessage: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    lineHeight: typography.lineHeights.sm,
    fontStyle: 'italic'
  },
  saveButton: {
    marginHorizontal: spacing[4],
    marginTop: spacing[6],
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.md
  },
  saveButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6]
  },
  saveButtonIcon: {
    marginRight: spacing[2]
  },
  saveButtonText: {
    color: colors.text.inverse,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semiBold,
    lineHeight: typography.lineHeights.base
  }
});

export default EnhancedMoodCheckIn;