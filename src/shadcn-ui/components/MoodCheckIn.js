/**
 * Solace AI Mobile - shadcn UI Enhanced Mood Check-In Component
 * 
 * A comprehensive mood check-in component following shadcn UI patterns,
 * designed specifically for mental health applications with therapeutic focus.
 * 
 * Features:
 * - Mood selection with therapeutic color schemes
 * - Intensity slider with visual feedback
 * - Animated mood indicators and transitions
 * - Accessibility-first design with screen reader support
 * - Time-based contextual theming
 * - Progress tracking and mood history integration
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import PropTypes from 'prop-types';

import ShadcnCard, { CardHeader, CardTitle, CardContent, CardFooter } from './Card';
import ShadcnButton, { CalmingButton, NurturingButton } from './Button';
import { shadcnConfig } from '../config';
import { 
  colorUtils, 
  styleUtils, 
  animationUtils, 
  accessibilityUtils,
  themeUtils,
  platformUtils 
} from '../utils';
import { useTheme } from '../../contexts/ThemeContext';
import { MentalHealthIcon } from '../../components/icons';

const screenWidth = Dimensions.get('window').width;

// Mood options with therapeutic descriptions
const MOOD_OPTIONS = [
  {
    id: 'happy',
    label: 'Happy',
    emoji: '😊',
    description: 'Feeling joyful and content',
    color: '#fbbf24',
    therapeuticScheme: 'energizing',
  },
  {
    id: 'calm',
    label: 'Calm',
    emoji: '😌',
    description: 'Peaceful and relaxed',
    color: '#22c55e',
    therapeuticScheme: 'peaceful',
  },
  {
    id: 'anxious',
    label: 'Anxious',
    emoji: '😰',
    description: 'Worried or uneasy',
    color: '#f97316',
    therapeuticScheme: 'calming',
  },
  {
    id: 'sad',
    label: 'Sad',
    emoji: '😢',
    description: 'Feeling down or melancholy',
    color: '#3b82f6',
    therapeuticScheme: 'nurturing',
  },
  {
    id: 'excited',
    label: 'Excited',
    emoji: '🤩',
    description: 'Enthusiastic and energetic',
    color: '#a855f7',
    therapeuticScheme: 'energizing',
  },
  {
    id: 'tired',
    label: 'Tired',
    emoji: '😴',
    description: 'Feeling drained or weary',
    color: '#6b7280',
    therapeuticScheme: 'grounding',
  },
  {
    id: 'stressed',
    label: 'Stressed',
    emoji: '😤',
    description: 'Overwhelmed or pressured',
    color: '#dc2626',
    therapeuticScheme: 'calming',
  },
  {
    id: 'content',
    label: 'Content',
    emoji: '😊',
    description: 'Satisfied and at peace',
    color: '#059669',
    therapeuticScheme: 'peaceful',
  },
];

const INTENSITY_LEVELS = [
  { value: 1, label: 'Mild', description: 'Barely noticeable' },
  { value: 2, label: 'Light', description: 'Slightly present' },
  { value: 3, label: 'Moderate', description: 'Clearly felt' },
  { value: 4, label: 'Strong', description: 'Very noticeable' },
  { value: 5, label: 'Intense', description: 'Overwhelming' },
];

const ShadcnMoodCheckIn = ({
  currentMood,
  currentIntensity = 3,
  onMoodSelect,
  onIntensityChange,
  onSubmit,
  showIntensity = true,
  showHistory = true,
  animated = true,
  therapeuticMode = true,
  timeBasedTheming = true,
  accessibilityLabel,
  testID = 'shadcn-mood-checkin',
  style,
  ...props
}) => {
  const { theme, isReducedMotionEnabled } = useTheme();
  const [selectedMood, setSelectedMood] = useState(currentMood);
  const [intensity, setIntensity] = useState(currentIntensity);
  const [step, setStep] = useState(currentMood ? 'intensity' : 'mood');
  
  // Animation refs
  const containerAnimation = useRef(new Animated.Value(0)).current;
  const moodItemAnimations = useRef(
    MOOD_OPTIONS.map(() => new Animated.Value(0))
  ).current;
  const intensityAnimation = useRef(new Animated.Value(0)).current;
  const selectedMoodAnimation = useRef(new Animated.Value(1)).current;
  
  // Get time-based theme if enabled
  const timeBasedTheme = timeBasedTheming 
    ? themeUtils.getTimeBasedTheme('default')
    : shadcnConfig;
  
  useEffect(() => {
    if (animated && !isReducedMotionEnabled) {
      // Animate container entrance
      animationUtils.createGentleEntrance(containerAnimation).start();
      
      // Stagger mood item animations
      animationUtils.createStaggeredEntrance(moodItemAnimations, 100).start();
      
      // Animate intensity slider if showing
      if (step === 'intensity' && showIntensity) {
        animationUtils.createSoothingSlideIn(
          intensityAnimation,
          new Animated.Value(1)
        ).start();
      }
    } else {
      // Set all animations to final values
      containerAnimation.setValue(1);
      moodItemAnimations.forEach(anim => anim.setValue(1));
      intensityAnimation.setValue(1);
    }
  }, [step, animated, isReducedMotionEnabled]);
  
  // Handle mood selection
  const handleMoodSelect = (mood) => {
    if (platformUtils.supportsHaptics()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setSelectedMood(mood.id);
    
    // Animate selected mood
    if (!isReducedMotionEnabled) {
      Animated.sequence([
        Animated.timing(selectedMoodAnimation, {
          toValue: 1.1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(selectedMoodAnimation, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
    
    onMoodSelect?.(mood.id);
    
    // Move to intensity step if enabled
    if (showIntensity) {
      setTimeout(() => setStep('intensity'), 300);
    }
  };
  
  // Handle intensity change
  const handleIntensityChange = (newIntensity) => {
    if (platformUtils.supportsHaptics()) {
      Haptics.selectionAsync();
    }
    
    setIntensity(newIntensity);
    onIntensityChange?.(newIntensity);
  };
  
  // Handle submission
  const handleSubmit = () => {
    if (platformUtils.supportsHaptics()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    onSubmit?.({
      mood: selectedMood,
      intensity,
      timestamp: new Date().toISOString(),
    });
  };
  
  // Get selected mood data
  const getSelectedMoodData = () => {
    return MOOD_OPTIONS.find(mood => mood.id === selectedMood);
  };
  
  const selectedMoodData = getSelectedMoodData();
  
  // Render mood selection grid
  const renderMoodSelection = () => (
    <Animated.View style={{ opacity: containerAnimation }}>
      <CardHeader>
        <CardTitle therapeuticScheme="calming">
          How are you feeling?
        </CardTitle>
        <Text style={{
          fontSize: shadcnConfig.typography.sizes.sm.fontSize,
          color: shadcnConfig.colors.foreground.muted,
          marginTop: shadcnConfig.spacing[2],
        }}>
          Take a moment to reflect on your current emotional state
        </Text>
      </CardHeader>
      
      <CardContent>
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: shadcnConfig.spacing[3],
        }}>
          {MOOD_OPTIONS.map((mood, index) => (
            <Animated.View
              key={mood.id}
              style={{
                opacity: moodItemAnimations[index],
                transform: [{
                  scale: selectedMood === mood.id 
                    ? selectedMoodAnimation 
                    : moodItemAnimations[index]
                }],
              }}
            >
              <TouchableOpacity
                style={{
                  width: (screenWidth - 80) / 2 - shadcnConfig.spacing[3],
                  aspectRatio: 1,
                  borderRadius: shadcnConfig.borderRadius.xl,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: selectedMood === mood.id 
                    ? colorUtils.withOpacity(mood.color, 0.2)
                    : shadcnConfig.colors.background.muted,
                  borderWidth: selectedMood === mood.id ? 2 : 1,
                  borderColor: selectedMood === mood.id 
                    ? mood.color 
                    : shadcnConfig.colors.border.primary,
                  ...platformUtils.getPlatformShadow({
                    shadowOpacity: selectedMood === mood.id ? 0.15 : 0.05,
                    shadowRadius: selectedMood === mood.id ? 8 : 4,
                    elevation: selectedMood === mood.id ? 6 : 2,
                  }),
                }}
                onPress={() => handleMoodSelect(mood)}
                accessible
                accessibilityLabel={`${mood.label} mood - ${mood.description}`}
                accessibilityRole="button"
                testID={`mood-${mood.id}`}
              >
                <Text style={{
                  fontSize: 32,
                  marginBottom: shadcnConfig.spacing[2],
                }}>
                  {mood.emoji}
                </Text>
                <Text style={{
                  fontSize: shadcnConfig.typography.sizes.sm.fontSize,
                  fontWeight: shadcnConfig.typography.weights.semibold,
                  color: selectedMood === mood.id 
                    ? mood.color 
                    : shadcnConfig.colors.foreground.primary,
                  textAlign: 'center',
                  marginBottom: shadcnConfig.spacing[1],
                }}>
                  {mood.label}
                </Text>
                <Text style={{
                  fontSize: shadcnConfig.typography.sizes.xs.fontSize,
                  color: shadcnConfig.colors.foreground.muted,
                  textAlign: 'center',
                  paddingHorizontal: shadcnConfig.spacing[2],
                }}>
                  {mood.description}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </CardContent>
    </Animated.View>
  );
  
  // Render intensity selection
  const renderIntensitySelection = () => (
    <Animated.View style={{ opacity: intensityAnimation }}>
      <CardHeader>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: shadcnConfig.spacing[2],
        }}>
          {selectedMoodData && (
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colorUtils.withOpacity(selectedMoodData.color, 0.2),
              borderWidth: 2,
              borderColor: selectedMoodData.color,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: shadcnConfig.spacing[3],
            }}>
              <Text style={{ fontSize: 20 }}>
                {selectedMoodData.emoji}
              </Text>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <CardTitle therapeuticScheme={selectedMoodData?.therapeuticScheme}>
              How intense is this feeling?
            </CardTitle>
          </View>
        </View>
        <Text style={{
          fontSize: shadcnConfig.typography.sizes.sm.fontSize,
          color: shadcnConfig.colors.foreground.muted,
        }}>
          Rate the intensity from mild to overwhelming
        </Text>
      </CardHeader>
      
      <CardContent>
        {/* Intensity levels */}
        <View style={{ marginBottom: shadcnConfig.spacing[6] }}>
          {INTENSITY_LEVELS.map((level) => (
            <TouchableOpacity
              key={level.value}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: shadcnConfig.spacing[3],
                paddingHorizontal: shadcnConfig.spacing[4],
                borderRadius: shadcnConfig.borderRadius.lg,
                backgroundColor: intensity === level.value 
                  ? colorUtils.withOpacity(selectedMoodData?.color || '#3b82f6', 0.1)
                  : 'transparent',
                borderWidth: intensity === level.value ? 1 : 0,
                borderColor: intensity === level.value 
                  ? selectedMoodData?.color || '#3b82f6'
                  : 'transparent',
                marginBottom: shadcnConfig.spacing[2],
              }}
              onPress={() => handleIntensityChange(level.value)}
              accessible
              accessibilityLabel={`Intensity level ${level.value} - ${level.label}: ${level.description}`}
              accessibilityRole="button"
              testID={`intensity-${level.value}`}
            >
              <View style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: intensity === level.value 
                  ? selectedMoodData?.color || '#3b82f6'
                  : shadcnConfig.colors.border.primary,
                marginRight: shadcnConfig.spacing[3],
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                {intensity === level.value && (
                  <View style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'white',
                  }} />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: shadcnConfig.typography.sizes.base.fontSize,
                  fontWeight: shadcnConfig.typography.weights.medium,
                  color: intensity === level.value 
                    ? selectedMoodData?.color || '#3b82f6'
                    : shadcnConfig.colors.foreground.primary,
                  marginBottom: shadcnConfig.spacing[0.5],
                }}>
                  {level.label}
                </Text>
                <Text style={{
                  fontSize: shadcnConfig.typography.sizes.sm.fontSize,
                  color: shadcnConfig.colors.foreground.muted,
                }}>
                  {level.description}
                </Text>
              </View>
              <View style={{
                width: 20,
                height: 4,
                backgroundColor: intensity >= level.value 
                  ? selectedMoodData?.color || '#3b82f6'
                  : shadcnConfig.colors.border.primary,
                borderRadius: 2,
              }} />
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Visual intensity indicator */}
        <View style={{
          height: 8,
          backgroundColor: shadcnConfig.colors.background.muted,
          borderRadius: 4,
          overflow: 'hidden',
          marginBottom: shadcnConfig.spacing[4],
        }}>
          <Animated.View style={{
            height: '100%',
            width: `${(intensity / 5) * 100}%`,
            backgroundColor: selectedMoodData?.color || '#3b82f6',
            borderRadius: 4,
          }} />
        </View>
      </CardContent>
    </Animated.View>
  );
  
  // Render action buttons
  const renderActions = () => (
    <CardFooter>
      <View style={{
        flexDirection: 'row',
        gap: shadcnConfig.spacing[3],
        flex: 1,
      }}>
        {step === 'intensity' && (
          <ShadcnButton
            variant="outline"
            onPress={() => setStep('mood')}
            style={{ flex: 1 }}
          >
            Back
          </ShadcnButton>
        )}
        
        {selectedMood && (step !== 'intensity' || !showIntensity) && (
          <CalmingButton
            onPress={handleSubmit}
            style={{ flex: 1 }}
            gradient
          >
            Save Check-in
          </CalmingButton>
        )}
        
        {step === 'intensity' && showIntensity && (
          <NurturingButton
            onPress={handleSubmit}
            style={{ flex: 1 }}
            gradient
          >
            Complete Check-in
          </NurturingButton>
        )}
      </View>
    </CardFooter>
  );
  
  return (
    <ShadcnCard
      variant="elevated"
      size="large"
      therapeuticScheme={selectedMoodData?.therapeuticScheme || 'calming'}
      gradient={therapeuticMode}
      style={[
        {
          margin: shadcnConfig.spacing[4],
        },
        style,
      ]}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      {...props}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {step === 'mood' ? renderMoodSelection() : renderIntensitySelection()}
        {renderActions()}
      </ScrollView>
    </ShadcnCard>
  );
};

// Specialized mood check-in variants
export const QuickMoodCheckIn = (props) => (
  <ShadcnMoodCheckIn
    showIntensity={false}
    animated={false}
    {...props}
  />
);

export const DetailedMoodCheckIn = (props) => (
  <ShadcnMoodCheckIn
    showIntensity={true}
    showHistory={true}
    therapeuticMode={true}
    timeBasedTheming={true}
    {...props}
  />
);

export const SimpleMoodCheckIn = (props) => (
  <ShadcnMoodCheckIn
    showIntensity={false}
    showHistory={false}
    therapeuticMode={false}
    animated={false}
    {...props}
  />
);

// PropTypes
ShadcnMoodCheckIn.propTypes = {
  currentMood: PropTypes.string,
  currentIntensity: PropTypes.number,
  onMoodSelect: PropTypes.func,
  onIntensityChange: PropTypes.func,
  onSubmit: PropTypes.func,
  showIntensity: PropTypes.bool,
  showHistory: PropTypes.bool,
  animated: PropTypes.bool,
  therapeuticMode: PropTypes.bool,
  timeBasedTheming: PropTypes.bool,
  accessibilityLabel: PropTypes.string,
  testID: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default ShadcnMoodCheckIn;