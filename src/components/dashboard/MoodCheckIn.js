import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'expo-linear-gradient';
import { useTheme } from "../../shared/theme/ThemeContext";
import FreudDesignSystem, { FreudColors, FreudShadows, FreudBorderRadius, FreudSpacing, FreudTypography } from '../../shared/theme/FreudDesignSystem';
import { TherapeuticGradient, GlassmorphismContainer } from '../shaders/PageShaders';
import { MicroInteractionButton, StaggeredListAnimation } from '../animations/AdvancedAnimations';
import { MentalHealthIcon } from '../icons';

const { width: screenWidth } = Dimensions.get('window');

const MOOD_OPTIONS = [
  { 
    id: 'joyful', 
    emoji: '😊', 
    label: 'Joyful', 
    description: 'Feeling bright and optimistic',
    color: FreudColors.zenYellow[40],
    gradientColors: [FreudColors.zenYellow[30], FreudColors.zenYellow[50]],
    icon: 'Heart'
  },
  { 
    id: 'calm', 
    emoji: '😌', 
    label: 'Calm', 
    description: 'Peaceful and centered',
    color: FreudColors.serenityGreen[40],
    gradientColors: [FreudColors.serenityGreen[30], FreudColors.serenityGreen[50]],
    icon: 'Mindfulness'
  },
  { 
    id: 'focused', 
    emoji: '🎯', 
    label: 'Focused', 
    description: 'Clear and concentrated',
    color: FreudColors.kindPurple[40],
    gradientColors: [FreudColors.kindPurple[30], FreudColors.kindPurple[50]],
    icon: 'Brain'
  },
  { 
    id: 'anxious', 
    emoji: '😰', 
    label: 'Anxious', 
    description: 'Feeling worried or unsettled',
    color: FreudColors.empathyOrange[40],
    gradientColors: [FreudColors.empathyOrange[30], FreudColors.empathyOrange[50]],
    icon: 'Therapy'
  },
  { 
    id: 'melancholy', 
    emoji: '😔', 
    label: 'Melancholy', 
    description: 'Feeling reflective and low',
    color: FreudColors.optimisticGray[50],
    gradientColors: [FreudColors.optimisticGray[40], FreudColors.optimisticGray[60]],
    icon: 'Journal'
  },
  { 
    id: 'energized', 
    emoji: '⚡', 
    label: 'Energized', 
    description: 'Full of vitality and motivation',
    color: FreudColors.empathyOrange[50],
    gradientColors: [FreudColors.empathyOrange[40], FreudColors.zenYellow[40]],
    icon: 'Insights'
  },
];

const MoodCheckIn = ({ 
  currentMood, 
  onCheckIn,
  accessibilityLabel,
  accessibilityHint,
  disabled = false,
  compact = false,
}) => {
  const { theme, isDarkMode } = useTheme();
  const [selectedMood, setSelectedMood] = useState(currentMood);
  const [isExpanded, setIsExpanded] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial entrance animation
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Breathing pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood.id);
    
    // Haptic feedback and scale animation
    const selectedMoodAnim = new Animated.Value(1);
    Animated.sequence([
      Animated.timing(selectedMoodAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(selectedMoodAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    
    onCheckIn?.(mood.id, mood);
  };

  const styles = createStyles(theme);

  if (compact) {
    return (
      <GlassmorphismContainer style={styles.compactContainer}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: fadeAnim }}>
          <View style={styles.compactHeader}>
            <MentalHealthIcon name="Heart" size={20} color={FreudColors.mindfulBrown[70]} />
            <Text style={[styles.compactTitle, { color: isDarkMode ? FreudDesignSystem.themes.dark.colors.text.primary : FreudDesignSystem.themes.light.colors.text.primary }]}>
              Quick Mood Check
            </Text>
          </View>
          <View style={styles.compactMoodGrid}>
            {MOOD_OPTIONS.slice(0, 3).map((mood, index) => (
              <Animatable.View
                key={mood.id}
                animation="bounceIn"
                delay={index * 100}
                duration={600}
              >
                <MicroInteractionButton
                  onPress={() => handleMoodSelect(mood)}
                  style={[
                    styles.compactMoodButton,
                    selectedMood === mood.id && styles.selectedCompactMoodButton,
                  ]}
                >
                  <LinearGradient
                    colors={mood.gradientColors}
                    style={styles.compactMoodGradient}
                  >
                    <Text style={styles.compactMoodEmoji}>{mood.emoji}</Text>
                  </LinearGradient>
                </MicroInteractionButton>
              </Animatable.View>
            ))}
          </View>
        </Animated.View>
      </GlassmorphismContainer>
    );
  }

  return (
    <TherapeuticGradient type="therapeutic" style={styles.container}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: fadeAnim }}>
        <GlassmorphismContainer style={styles.mainCard}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <View style={styles.header}>
              <View style={styles.headerIcon}>
                <MentalHealthIcon name="Heart" size={28} color={FreudColors.mindfulBrown[80]} />
              </View>
              <View style={styles.headerText}>
                <Text style={[styles.title, { 
                  color: isDarkMode ? FreudDesignSystem.themes.dark.colors.text.primary : FreudDesignSystem.themes.light.colors.text.primary 
                }]}>
                  How are you feeling today?
                </Text>
                <Text style={[styles.subtitle, { 
                  color: isDarkMode ? FreudDesignSystem.themes.dark.colors.text.secondary : FreudDesignSystem.themes.light.colors.text.secondary 
                }]}>
                  Take a moment to check in with yourself
                </Text>
              </View>
            </View>
          </Animated.View>

          <StaggeredListAnimation stagger={150} animation="slideInUp" style={styles.moodGrid}>
            {MOOD_OPTIONS.map((mood, index) => {
              const isSelected = selectedMood === mood.id;
              return (
                <View key={mood.id} style={styles.moodButtonContainer}>
                  <MicroInteractionButton
                    onPress={() => handleMoodSelect(mood)}
                    style={[
                      styles.moodButton,
                      isSelected && styles.selectedMoodButton,
                    ]}
                    disabled={disabled}
                  >
                    <LinearGradient
                      colors={mood.gradientColors}
                      style={[
                        styles.moodGradient,
                        isSelected && styles.selectedMoodGradient,
                      ]}
                      start={[0, 0]}
                      end={[1, 1]}
                    >
                      <View style={styles.moodContent}>
                        <MentalHealthIcon 
                          name={mood.icon} 
                          size={24} 
                          color="#FFFFFF" 
                          style={styles.moodIcon}
                        />
                        <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                        <Text style={styles.moodLabel}>{mood.label}</Text>
                        <Text style={styles.moodDescription}>{mood.description}</Text>
                      </View>
                    </LinearGradient>
                  </MicroInteractionButton>
                </View>
              );
            })}
          </StaggeredListAnimation>

          {selectedMood && (
            <Animatable.View 
              animation="slideInUp" 
              duration={600}
              style={styles.currentMoodContainer}
            >
              <LinearGradient
                colors={[FreudColors.serenityGreen[20], FreudColors.serenityGreen[10]]}
                style={styles.currentMoodGradient}
              >
                <View style={styles.currentMoodContent}>
                  <MentalHealthIcon name="Insights" size={20} color={FreudColors.serenityGreen[70]} />
                  <Text style={[styles.currentMoodText, { 
                    color: isDarkMode ? FreudDesignSystem.themes.dark.colors.text.primary : FreudDesignSystem.themes.light.colors.text.primary 
                  }]}>
                    Current mood: <Text style={{ fontWeight: FreudTypography.weights.bold }}>
                      {MOOD_OPTIONS.find(m => m.id === selectedMood)?.label || 'Unknown'}
                    </Text>
                  </Text>
                  <Text style={[styles.currentMoodDescription, { 
                    color: isDarkMode ? FreudDesignSystem.themes.dark.colors.text.secondary : FreudDesignSystem.themes.light.colors.text.secondary 
                  }]}>
                    {MOOD_OPTIONS.find(m => m.id === selectedMood)?.description || ''}
                  </Text>
                </View>
              </LinearGradient>
            </Animatable.View>
          )}
        </GlassmorphismContainer>
      </Animated.View>
    </TherapeuticGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: FreudSpacing[4],
    paddingVertical: FreudSpacing[6],
  },
  mainCard: {
    padding: FreudSpacing[6],
    borderRadius: FreudBorderRadius['2xl'],
    ...FreudShadows.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: FreudSpacing[6],
  },
  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: FreudBorderRadius.xl,
    backgroundColor: FreudColors.serenityGreen[10],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: FreudSpacing[4],
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: FreudTypography.sizes['2xl'],
    fontWeight: FreudTypography.weights.bold,
    fontFamily: FreudTypography.fontFamily.primary,
    lineHeight: FreudTypography.sizes['2xl'] * FreudTypography.lineHeights.tight,
    marginBottom: FreudSpacing[1],
  },
  subtitle: {
    fontSize: FreudTypography.sizes.base,
    fontWeight: FreudTypography.weights.normal,
    fontFamily: FreudTypography.fontFamily.primary,
    lineHeight: FreudTypography.sizes.base * FreudTypography.lineHeights.relaxed,
    opacity: 0.8,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: FreudSpacing[3],
  },
  moodButtonContainer: {
    width: (screenWidth - FreudSpacing[8] * 2 - FreudSpacing[3] * 2) / 3,
  },
  moodButton: {
    width: '100%',
    aspectRatio: 0.9,
    borderRadius: FreudBorderRadius.xl,
    overflow: 'hidden',
    ...FreudShadows.md,
  },
  moodGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: FreudSpacing[3],
  },
  selectedMoodButton: {
    transform: [{ scale: 1.05 }],
    ...FreudShadows.xl,
  },
  selectedMoodGradient: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  moodContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodIcon: {
    marginBottom: FreudSpacing[1],
  },
  moodEmoji: {
    fontSize: FreudTypography.sizes['2xl'],
    marginBottom: FreudSpacing[1],
  },
  moodLabel: {
    fontSize: FreudTypography.sizes.sm,
    fontWeight: FreudTypography.weights.bold,
    fontFamily: FreudTypography.fontFamily.primary,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: FreudSpacing[1],
  },
  moodDescription: {
    fontSize: FreudTypography.sizes.xs,
    fontWeight: FreudTypography.weights.normal,
    fontFamily: FreudTypography.fontFamily.primary,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: FreudTypography.sizes.xs * FreudTypography.lineHeights.tight,
  },
  currentMoodContainer: {
    marginTop: FreudSpacing[6],
    borderRadius: FreudBorderRadius.xl,
    overflow: 'hidden',
    ...FreudShadows.sm,
  },
  currentMoodGradient: {
    padding: FreudSpacing[4],
  },
  currentMoodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentMoodText: {
    fontSize: FreudTypography.sizes.base,
    fontWeight: FreudTypography.weights.medium,
    fontFamily: FreudTypography.fontFamily.primary,
    marginLeft: FreudSpacing[3],
    flex: 1,
  },
  currentMoodDescription: {
    fontSize: FreudTypography.sizes.sm,
    fontWeight: FreudTypography.weights.normal,
    fontFamily: FreudTypography.fontFamily.primary,
    marginLeft: FreudSpacing[3],
  },

  // Compact mode styles
  compactContainer: {
    padding: FreudSpacing[4],
    borderRadius: FreudBorderRadius.xl,
    margin: FreudSpacing[2],
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: FreudSpacing[3],
  },
  compactTitle: {
    fontSize: FreudTypography.sizes.base,
    fontWeight: FreudTypography.weights.semiBold,
    fontFamily: FreudTypography.fontFamily.primary,
    marginLeft: FreudSpacing[2],
  },
  compactMoodGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  compactMoodButton: {
    width: 50,
    height: 50,
    borderRadius: FreudBorderRadius.xl,
    overflow: 'hidden',
  },
  compactMoodGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactMoodEmoji: {
    fontSize: FreudTypography.sizes.lg,
  },
  selectedCompactMoodButton: {
    transform: [{ scale: 1.1 }],
    ...FreudShadows.md,
  },
});

export default MoodCheckIn;

// Export mood options for use in other components
export { MOOD_OPTIONS };