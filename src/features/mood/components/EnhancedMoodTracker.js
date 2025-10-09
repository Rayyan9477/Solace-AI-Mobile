/**
 * Enhanced Mood Tracker Component
 * Matches Freud UI Kit design exactly with large emoji faces and gradient backgrounds
 * Features step-by-step mood tracking with therapeutic design principles
 */

import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { Card, Button, Chip, TextInput, ProgressBar } from "react-native-paper";

import { EnhancedMoodCard, MoodCardGrid } from "./EnhancedMoodCard";
import { TherapeuticButton } from "./TherapeuticButton";
import { Typography } from "@/design-system/components";
import { therapeuticColors } from "@ui/theme/MaterialTheme";
import {
  PageShaderBackground,
  MoodBasedShaderBackground,
} from "./PageShaderBackground";
import {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
} from "@theme/theme";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

/**
 * Enhanced Mood Tracking Steps Configuration
 */
const MoodTrackingSteps = {
  mood: {
    title: "How are you feeling?",
    subtitle: "Select your current mood",
    description:
      "Choose the emotion that best represents how you feel right now",
    therapeutic: "kind",
    gradient: FreudColors.kind.gradient,
    component: "MoodSelection",
  },
  intensity: {
    title: "How intense is this feeling?",
    subtitle: "Rate the intensity from 1 to 5",
    description: "1 is very mild, 5 is very intense",
    therapeutic: "zen",
    gradient: FreudColors.zen.gradient,
    component: "IntensityScale",
  },
  activities: {
    title: "What activities affected your mood?",
    subtitle: "Select relevant activities",
    description: "Choose activities that may have influenced how you feel",
    therapeutic: "empathy",
    gradient: FreudColors.empathy.gradient,
    component: "ActivitySelection",
  },
  notes: {
    title: "Additional thoughts or triggers?",
    subtitle: "Optional notes and reflections",
    description: "Share any thoughts, triggers, or context about your mood",
    therapeutic: "serenity",
    gradient: FreudColors.serenity.gradient,
    component: "NotesAndTriggers",
  },
  summary: {
    title: "Mood Entry Complete",
    subtitle: "Review your mood entry",
    description: "Your mood has been recorded. Here's a summary of your entry",
    therapeutic: "mindful",
    gradient: FreudColors.mindful.gradient,
    component: "MoodSummary",
  },
};

/**
 * Intensity Scale Configuration with therapeutic design
 */
const IntensityLevels = [
  {
    level: 1,
    label: "Very Mild",
    description: "Barely noticeable",
    color: FreudColors.serenity.light,
    gradient: [FreudColors.serenity.light, FreudColors.serenity.medium],
    emoji: "😐",
  },
  {
    level: 2,
    label: "Mild",
    description: "Slightly noticeable",
    color: FreudColors.zen.light,
    gradient: [FreudColors.zen.light, FreudColors.zen.medium],
    emoji: "🙂",
  },
  {
    level: 3,
    label: "Moderate",
    description: "Clearly present",
    color: FreudColors.empathy.light,
    gradient: [FreudColors.empathy.light, FreudColors.empathy.medium],
    emoji: "😊",
  },
  {
    level: 4,
    label: "Strong",
    description: "Very noticeable",
    color: FreudColors.kind.light,
    gradient: [FreudColors.kind.light, FreudColors.kind.medium],
    emoji: "😄",
  },
  {
    level: 5,
    label: "Very Strong",
    description: "Overwhelming",
    color: FreudColors.mindful.light,
    gradient: [FreudColors.mindful.light, FreudColors.mindful.medium],
    emoji: "🤩",
  },
];

/**
 * Activities that can affect mood
 */
const MoodActivities = [
  // Positive activities
  {
    id: "exercise",
    label: "Exercise",
    type: "positive",
    emoji: "🏃‍♀️",
    color: FreudColors.serenity,
  },
  {
    id: "meditation",
    label: "Meditation",
    type: "positive",
    emoji: "🧘‍♀️",
    color: FreudColors.mindful,
  },
  {
    id: "socializing",
    label: "Socializing",
    type: "positive",
    emoji: "👥",
    color: FreudColors.empathy,
  },
  {
    id: "nature",
    label: "Nature",
    type: "positive",
    emoji: "🌿",
    color: FreudColors.serenity,
  },
  {
    id: "music",
    label: "Music",
    type: "positive",
    emoji: "🎵",
    color: FreudColors.zen,
  },
  {
    id: "reading",
    label: "Reading",
    type: "positive",
    emoji: "📚",
    color: FreudColors.kind,
  },

  // Neutral activities
  {
    id: "work",
    label: "Work",
    type: "neutral",
    emoji: "💼",
    color: FreudColors.optimistic,
  },
  {
    id: "commute",
    label: "Commute",
    type: "neutral",
    emoji: "🚗",
    color: FreudColors.optimistic,
  },
  {
    id: "household",
    label: "Household Tasks",
    type: "neutral",
    emoji: "🏠",
    color: FreudColors.optimistic,
  },
  {
    id: "technology",
    label: "Screen Time",
    type: "neutral",
    emoji: "📱",
    color: FreudColors.optimistic,
  },

  // Potentially challenging activities
  {
    id: "conflict",
    label: "Conflict",
    type: "challenging",
    emoji: "⚡",
    color: FreudColors.empathy,
  },
  {
    id: "stress",
    label: "Stressful Event",
    type: "challenging",
    emoji: "😰",
    color: FreudColors.empathy,
  },
  {
    id: "isolation",
    label: "Being Alone",
    type: "challenging",
    emoji: "🚪",
    color: FreudColors.kind,
  },
  {
    id: "health",
    label: "Health Issues",
    type: "challenging",
    emoji: "🏥",
    color: FreudColors.mindful,
  },
];

/**
 * Common mood triggers
 */
const MoodTriggers = [
  "Relationship issues",
  "Work stress",
  "Financial concerns",
  "Health problems",
  "Family dynamics",
  "Social pressure",
  "Sleep issues",
  "Weather changes",
  "Hormonal changes",
  "News/media",
  "Past memories",
  "Future uncertainty",
  "Achievement pressure",
  "Social comparison",
  "Physical discomfort",
  "Other",
];

/**
 * Main Enhanced Mood Tracker Component
 */
export const EnhancedMoodTracker = ({
  onComplete,
  onCancel,
  initialStep = "mood",
  showProgress = true,
  animated = true,
  therapeutic = true,
  style = {},
  ...props
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [moodData, setMoodData] = useState({
    mood: null,
    intensity: null,
    activities: [],
    notes: "",
    triggers: [],
    timestamp: new Date(),
  });

  const stepKeys = Object.keys(MoodTrackingSteps);
  const currentStepIndex = stepKeys.indexOf(currentStep);
  const progress = (currentStepIndex + 1) / stepKeys.length;
  const stepConfig = MoodTrackingSteps[currentStep];

  // Animation references
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Animate step transitions
  useEffect(() => {
    if (!animated) return;

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: currentStepIndex * -screenWidth,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [currentStep, currentStepIndex, slideAnim, fadeAnim, animated]);

  // Navigation functions
  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < stepKeys.length) {
      setCurrentStep(stepKeys[nextIndex]);
    } else {
      handleComplete();
    }
  };

  const goToPreviousStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(stepKeys[prevIndex]);
    }
  };

  const handleComplete = () => {
    const completedEntry = {
      ...moodData,
      id: Date.now().toString(),
      completedAt: new Date(),
    };
    onComplete?.(completedEntry);
  };

  // Update mood data
  const updateMoodData = (updates) => {
    setMoodData((prev) => ({ ...prev, ...updates }));
  };

  // Validation for each step
  const isStepValid = () => {
    switch (currentStep) {
      case "mood":
        return moodData.mood !== null;
      case "intensity":
        return moodData.intensity !== null;
      case "activities":
        return true; // Optional step
      case "notes":
        return true; // Optional step
      case "summary":
        return true;
      default:
        return false;
    }
  };

  return (
    <PageShaderBackground
      shader="therapeutic"
      variant={stepConfig.therapeutic}
      intensity={0.3}
      style={[styles.container, style]}
    >
      {/* Progress Indicator */}
      {showProgress && (
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <TherapeuticText
              variant="caption"
              weight="medium"
              style={styles.progressLabel}
            >
              Step {currentStepIndex + 1} of {stepKeys.length}
            </TherapeuticText>
            <TherapeuticText variant="caption" style={styles.progressPercent}>
              {Math.round(progress * 100)}%
            </TherapeuticText>
          </View>
          <ProgressBar
            progress={progress}
            color={stepConfig.therapeutic}
            style={styles.progressBar}
          />
        </View>
      )}

      {/* Step Content Container */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Step Header */}
          <View style={styles.stepHeader}>
            <TherapeuticText
              variant="headline"
              weight="bold"
              align="center"
              therapeutic={stepConfig.therapeutic}
              style={styles.stepTitle}
            >
              {stepConfig.title}
            </TherapeuticText>
            <TherapeuticText
              variant="subtitle"
              align="center"
              therapeutic={stepConfig.therapeutic}
              style={styles.stepSubtitle}
            >
              {stepConfig.subtitle}
            </TherapeuticText>
            <TherapeuticText
              variant="body"
              align="center"
              style={styles.stepDescription}
            >
              {stepConfig.description}
            </TherapeuticText>
          </View>

          {/* Step Content */}
          <View style={styles.stepContent}>{renderStepComponent()}</View>
        </ScrollView>
      </Animated.View>

      {/* Navigation Controls */}
      <View style={styles.navigationContainer}>
        <View style={styles.navigationButtons}>
          {currentStepIndex > 0 && (
            <TherapeuticButton
              therapeutic={stepConfig.therapeutic}
              variant="outlined"
              size="medium"
              onPress={goToPreviousStep}
              style={styles.navButton}
            >
              Previous
            </TherapeuticButton>
          )}

          <TherapeuticButton
            therapeutic={stepConfig.therapeutic}
            variant="contained"
            size="medium"
            onPress={goToNextStep}
            disabled={!isStepValid()}
            style={[styles.navButton, styles.nextButton]}
          >
            {currentStep === "summary" ? "Complete" : "Next"}
          </TherapeuticButton>
        </View>
      </View>
    </PageShaderBackground>
  );

  // Render step-specific components
  function renderStepComponent() {
    switch (currentStep) {
      case "mood":
        return (
          <MoodSelection
            selectedMood={moodData.mood}
            onMoodSelect={(mood) => updateMoodData({ mood })}
            animated={animated}
          />
        );
      case "intensity":
        return (
          <IntensityScale
            selectedIntensity={moodData.intensity}
            onIntensitySelect={(intensity) => updateMoodData({ intensity })}
            mood={moodData.mood}
            animated={animated}
          />
        );
      case "activities":
        return (
          <ActivitySelection
            selectedActivities={moodData.activities}
            onActivitiesChange={(activities) => updateMoodData({ activities })}
            animated={animated}
          />
        );
      case "notes":
        return (
          <NotesAndTriggers
            notes={moodData.notes}
            triggers={moodData.triggers}
            onNotesChange={(notes) => updateMoodData({ notes })}
            onTriggersChange={(triggers) => updateMoodData({ triggers })}
            animated={animated}
          />
        );
      case "summary":
        return (
          <MoodSummary
            moodData={moodData}
            onEdit={(step) => setCurrentStep(step)}
            animated={animated}
          />
        );
      default:
        return null;
    }
  }
};

/**
 * Mood Selection Component
 */
const MoodSelection = ({ selectedMood, onMoodSelect, animated = true }) => {
  const moods = [
    "happy",
    "sad",
    "stressed",
    "calm",
    "anxious",
    "neutral",
    "excited",
    "tired",
    "content",
  ];

  return (
    <View style={styles.moodSelectionContainer}>
      <MoodCardGrid
        moods={moods}
        selectedMood={selectedMood}
        onMoodSelect={onMoodSelect}
        columns={3}
        cardSize="medium"
        variant="gradient"
        animated={animated}
        style={styles.moodGrid}
      />
    </View>
  );
};

/**
 * Intensity Scale Component
 */
const IntensityScale = ({
  selectedIntensity,
  onIntensitySelect,
  mood,
  animated = true,
}) => {
  return (
    <View style={styles.intensityContainer}>
      {IntensityLevels.map((level) => (
        <TouchableOpacity
          key={level.level}
          style={[
            styles.intensityOption,
            selectedIntensity === level.level && styles.selectedIntensity,
          ]}
          onPress={() => onIntensitySelect(level.level)}
        >
          <LinearGradient
            colors={level.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.intensityGradient,
              selectedIntensity === level.level && styles.selectedGradient,
            ]}
          >
            <Text style={styles.intensityEmoji}>{level.emoji}</Text>
            <TherapeuticText
              variant="body"
              weight="medium"
              style={styles.intensityLabel}
            >
              {level.label}
            </TherapeuticText>
            <TherapeuticText
              variant="caption"
              style={styles.intensityDescription}
            >
              {level.description}
            </TherapeuticText>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  );
};

/**
 * Activity Selection Component
 */
const ActivitySelection = ({
  selectedActivities,
  onActivitiesChange,
  animated = true,
}) => {
  const toggleActivity = (activityId) => {
    const newActivities = selectedActivities.includes(activityId)
      ? selectedActivities.filter((id) => id !== activityId)
      : [...selectedActivities, activityId];
    onActivitiesChange(newActivities);
  };

  return (
    <View style={styles.activitiesContainer}>
      {MoodActivities.map((activity) => (
        <Chip
          key={activity.id}
          selected={selectedActivities.includes(activity.id)}
          onPress={() => toggleActivity(activity.id)}
          style={[
            styles.activityChip,
            selectedActivities.includes(activity.id) && {
              backgroundColor: activity.color.light,
            },
          ]}
          textStyle={styles.activityChipText}
        >
          {activity.emoji} {activity.label}
        </Chip>
      ))}
    </View>
  );
};

/**
 * Notes and Triggers Component
 */
const NotesAndTriggers = ({
  notes,
  triggers,
  onNotesChange,
  onTriggersChange,
  animated = true,
}) => {
  const toggleTrigger = (trigger) => {
    const newTriggers = triggers.includes(trigger)
      ? triggers.filter((t) => t !== trigger)
      : [...triggers, trigger];
    onTriggersChange(newTriggers);
  };

  return (
    <View style={styles.notesContainer}>
      <TextInput
        label="Notes (optional)"
        mode="outlined"
        multiline
        numberOfLines={4}
        value={notes}
        onChangeText={onNotesChange}
        placeholder="Share your thoughts, feelings, or any context about your mood..."
        style={styles.notesInput}
      />

      <TherapeuticText
        variant="subtitle"
        weight="medium"
        style={styles.triggersTitle}
      >
        Possible Triggers (optional)
      </TherapeuticText>

      <View style={styles.triggersContainer}>
        {MoodTriggers.map((trigger) => (
          <Chip
            key={trigger}
            selected={triggers.includes(trigger)}
            onPress={() => toggleTrigger(trigger)}
            style={[
              styles.triggerChip,
              triggers.includes(trigger) && styles.selectedTriggerChip,
            ]}
            textStyle={styles.triggerChipText}
          >
            {trigger}
          </Chip>
        ))}
      </View>
    </View>
  );
};

/**
 * Mood Summary Component
 */
const MoodSummary = ({ moodData, onEdit, animated = true }) => {
  const formatDateTime = (date) => {
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <View style={styles.summaryContainer}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <TherapeuticText
            variant="title"
            weight="bold"
            style={styles.summaryTitle}
          >
            Mood Entry Summary
          </TherapeuticText>

          <View style={styles.summaryRow}>
            <TherapeuticText variant="body" weight="medium">
              Mood:
            </TherapeuticText>
            <TherapeuticText variant="body" style={styles.summaryValue}>
              {moodData.mood}{" "}
              {moodData.intensity ? `(${moodData.intensity}/5)` : ""}
            </TherapeuticText>
          </View>

          {moodData.activities.length > 0 && (
            <View style={styles.summaryRow}>
              <TherapeuticText variant="body" weight="medium">
                Activities:
              </TherapeuticText>
              <TherapeuticText variant="body" style={styles.summaryValue}>
                {moodData.activities.join(", ")}
              </TherapeuticText>
            </View>
          )}

          {moodData.triggers.length > 0 && (
            <View style={styles.summaryRow}>
              <TherapeuticText variant="body" weight="medium">
                Triggers:
              </TherapeuticText>
              <TherapeuticText variant="body" style={styles.summaryValue}>
                {moodData.triggers.join(", ")}
              </TherapeuticText>
            </View>
          )}

          {moodData.notes && (
            <View style={styles.summaryRow}>
              <TherapeuticText variant="body" weight="medium">
                Notes:
              </TherapeuticText>
              <TherapeuticText variant="body" style={styles.summaryValue}>
                {moodData.notes}
              </TherapeuticText>
            </View>
          )}

          <View style={styles.summaryRow}>
            <TherapeuticText variant="body" weight="medium">
              Time:
            </TherapeuticText>
            <TherapeuticText variant="body" style={styles.summaryValue}>
              {formatDateTime(moodData.timestamp)}
            </TherapeuticText>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing[2],
  },
  progressLabel: {
    opacity: 0.8,
  },
  progressPercent: {
    opacity: 0.6,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing[20],
  },
  stepHeader: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[6],
    alignItems: "center",
  },
  stepTitle: {
    marginBottom: spacing[2],
    textAlign: "center",
  },
  stepSubtitle: {
    marginBottom: spacing[3],
    textAlign: "center",
    opacity: 0.8,
  },
  stepDescription: {
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 20,
  },
  stepContent: {
    flex: 1,
    paddingHorizontal: spacing[4],
  },
  navigationContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    paddingBottom: Platform.OS === "ios" ? spacing[8] : spacing[4],
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navButton: {
    minWidth: 100,
  },
  nextButton: {
    marginLeft: "auto",
  },

  // Mood Selection Styles
  moodSelectionContainer: {
    flex: 1,
  },
  moodGrid: {
    justifyContent: "center",
  },

  // Intensity Scale Styles
  intensityContainer: {
    flex: 1,
    paddingVertical: spacing[4],
  },
  intensityOption: {
    marginBottom: spacing[3],
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    ...shadows.sm,
  },
  selectedIntensity: {
    ...shadows.md,
    transform: [{ scale: 1.02 }],
  },
  intensityGradient: {
    padding: spacing[4],
    alignItems: "center",
  },
  selectedGradient: {
    // Additional styling for selected intensity
  },
  intensityEmoji: {
    fontSize: 32,
    marginBottom: spacing[2],
  },
  intensityLabel: {
    marginBottom: spacing[1],
    textAlign: "center",
  },
  intensityDescription: {
    textAlign: "center",
    opacity: 0.8,
  },

  // Activity Selection Styles
  activitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingVertical: spacing[2],
  },
  activityChip: {
    margin: spacing[1],
  },
  activityChipText: {
    fontSize: typography.sizes.sm,
  },

  // Notes and Triggers Styles
  notesContainer: {
    flex: 1,
    paddingVertical: spacing[4],
  },
  notesInput: {
    marginBottom: spacing[6],
  },
  triggersTitle: {
    marginBottom: spacing[3],
  },
  triggersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  triggerChip: {
    margin: spacing[1],
    backgroundColor: colors.background.secondary,
  },
  selectedTriggerChip: {
    backgroundColor: colors.primary[100],
  },
  triggerChipText: {
    fontSize: typography.sizes.xs,
  },

  // Summary Styles
  summaryContainer: {
    flex: 1,
    paddingVertical: spacing[4],
  },
  summaryCard: {
    borderRadius: borderRadius.lg,
    ...shadows.base,
  },
  summaryTitle: {
    marginBottom: spacing[4],
    textAlign: "center",
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: spacing[3],
    alignItems: "flex-start",
  },
  summaryValue: {
    flex: 1,
    marginLeft: spacing[3],
    textAlign: "right",
  },
});

export default {
  EnhancedMoodTracker,
  MoodTrackingSteps,
  IntensityLevels,
  MoodActivities,
  MoodTriggers,
};
