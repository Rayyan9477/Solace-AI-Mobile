import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useDispatch } from "react-redux";

import { MentalHealthIcon, ActionIcon } from "../../components/icons";
import { useTheme } from "../../contexts/ThemeContext";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from "../../styles/theme";
import { MentalHealthAccessibility } from "../../utils/accessibility";

const { width, height } = Dimensions.get("window");

const EnhancedMoodTrackerScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMood, setSelectedMood] = useState(null);
  const [intensity, setIntensity] = useState(3);
  const [notes, setNotes] = useState("");
  const [activities, setActivities] = useState([]);
  const [triggers, setTriggers] = useState([]);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentStep + 1) / 4,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentStep, progressAnim]);

  const moods = [
    {
      id: "happy",
      emoji: "😊",
      label: "Happy",
      color: theme.colors.therapeutic.energizing[500],
      description: "Feeling joyful and content",
    },
    {
      id: "calm",
      emoji: "😌",
      label: "Calm",
      color: theme.colors.therapeutic.peaceful[500],
      description: "Peaceful and relaxed",
    },
    {
      id: "excited",
      emoji: "🤩",
      label: "Excited",
      color: theme.colors.therapeutic.energizing[600],
      description: "Energetic and enthusiastic",
    },
    {
      id: "neutral",
      emoji: "😐",
      label: "Neutral",
      color: theme.colors.gray[500],
      description: "Neither positive nor negative",
    },
    {
      id: "tired",
      emoji: "😴",
      label: "Tired",
      color: theme.colors.therapeutic.grounding[400],
      description: "Feeling exhausted or weary",
    },
    {
      id: "anxious",
      emoji: "😰",
      label: "Anxious",
      color: theme.colors.warning[500],
      description: "Worried or nervous",
    },
    {
      id: "sad",
      emoji: "😢",
      label: "Sad",
      color: theme.colors.therapeutic.calming[600],
      description: "Feeling down or melancholy",
    },
    {
      id: "angry",
      emoji: "😠",
      label: "Angry",
      color: theme.colors.error[500],
      description: "Frustrated or irritated",
    },
  ];

  const commonActivities = [
    { id: "work", label: "Work", icon: "💼" },
    { id: "exercise", label: "Exercise", icon: "🏃" },
    { id: "socializing", label: "Socializing", icon: "👥" },
    { id: "relaxing", label: "Relaxing", icon: "🛋️" },
    { id: "studying", label: "Studying", icon: "📚" },
    { id: "family", label: "Family Time", icon: "👨‍👩‍👧‍👦" },
    { id: "hobbies", label: "Hobbies", icon: "🎨" },
    { id: "meditation", label: "Meditation", icon: "🧘" },
  ];

  const commonTriggers = [
    { id: "stress", label: "Stress", icon: "😤" },
    { id: "lack_sleep", label: "Lack of Sleep", icon: "😴" },
    { id: "conflict", label: "Conflict", icon: "⚡" },
    { id: "change", label: "Change", icon: "🔄" },
    { id: "pressure", label: "Pressure", icon: "⏰" },
    { id: "loneliness", label: "Loneliness", icon: "😔" },
    { id: "health", label: "Health Issues", icon: "🏥" },
    { id: "weather", label: "Weather", icon: "🌧️" },
  ];

  const handleNext = useCallback(() => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      Animated.timing(slideAnim, {
        toValue: 30,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [currentStep, slideAnim]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      Animated.timing(slideAnim, {
        toValue: -30,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [currentStep, slideAnim]);

  const handleSave = useCallback(async () => {
    try {
      const moodEntry = {
        id: Date.now().toString(),
        mood: selectedMood,
        intensity,
        notes,
        activities,
        triggers,
        timestamp: new Date().toISOString(),
      };

      // Dispatch to Redux store
      // For now, we'll simulate the Redux dispatch
      // In a real app, you would import and use the actual mood slice actions
      // dispatch(saveMoodEntry(moodEntry));

      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 500));

      Alert.alert(
        "Mood Saved! 🎉",
        "Thank you for checking in with yourself. Your mood has been recorded.",
        [
          {
            text: "View Insights",
            onPress: () => navigation.navigate("Dashboard"),
          },
          {
            text: "Done",
            onPress: () => navigation.goBack(),
            style: "cancel",
          },
        ],
      );
    } catch (error) {
      Alert.alert("Error", "Unable to save your mood entry. Please try again.");
    }
  }, [selectedMood, intensity, notes, activities, triggers, navigation]);

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedMood !== null;
      case 1:
        return true; // Intensity always has a value
      case 2:
        return true; // Activities are optional
      case 3:
        return true; // Notes are optional
      default:
        return false;
    }
  };

  const getStepName = (stepIndex) => {
    const stepNames = ['Mood Selection', 'Intensity Rating', 'Activities', 'Notes & Triggers'];
    return stepNames[stepIndex] || 'Unknown Step';
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View
        style={[
          styles.progressBar,
          { backgroundColor: theme.colors.gray[200] },
        ]}
        accessible={true}
        accessibilityRole="progressbar"
        accessibilityLabel="Mood check-in progress"
        accessibilityValue={{
          min: 0,
          max: 4,
          now: currentStep + 1,
          text: `Step ${currentStep + 1} of 4: ${getStepName(currentStep)}`
        }}
        accessibilityHint="Progress through mood check-in steps"
      >
        <Animated.View
          style={[
            styles.progressFill,
            {
              backgroundColor: theme.colors.therapeutic.calming[500],
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
          importantForAccessibility="no"
        />
      </View>
      <Text
        style={[styles.progressText, { color: theme.colors.text.secondary }]}
        accessibilityRole="text"
      >
        Step {currentStep + 1} of 4: {getStepName(currentStep)}
      </Text>
    </View>
  );

  const renderMoodSelection = () => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={[styles.stepTitle, { color: theme.colors.text.primary }]}>
        How are you feeling right now?
      </Text>
      <Text
        style={[styles.stepSubtitle, { color: theme.colors.text.secondary }]}
      >
        Choose the mood that best describes your current emotional state
      </Text>

      <View style={styles.moodGrid}>
        {moods.map((mood, index) => (
          <Animated.View
            key={mood.id}
            style={{
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 30],
                    outputRange: [0, 30 + index * 5],
                  }),
                },
              ],
            }}
          >
            <TouchableOpacity
              style={[
                styles.moodCard,
                selectedMood === mood.id && {
                  backgroundColor: mood.color + "20",
                  borderColor: mood.color,
                  borderWidth: 2,
                },
              ]}
              onPress={() => setSelectedMood(mood.id)}
              activeOpacity={0.8}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`${mood.label}: ${mood.description}`}
              accessibilityState={{ selected: selectedMood === mood.id }}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text
                style={[styles.moodLabel, { color: theme.colors.text.primary }]}
              >
                {mood.label}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );

  const renderIntensitySelection = () => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={[styles.stepTitle, { color: theme.colors.text.primary }]}>
        How intense is this feeling?
      </Text>
      <Text
        style={[styles.stepSubtitle, { color: theme.colors.text.secondary }]}
      >
        Rate the intensity of your{" "}
        {selectedMood
          ? moods.find((m) => m.id === selectedMood)?.label
          : "mood"}{" "}
        from 1 (mild) to 5 (very intense)
      </Text>

      <View style={styles.intensityContainer}>
        <View style={styles.intensityScale}>
          {[1, 2, 3, 4, 5].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.intensityDot,
                {
                  backgroundColor:
                    intensity >= level
                      ? theme.colors.therapeutic.calming[500]
                      : theme.colors.gray[300],
                },
              ]}
              onPress={() => {
                setIntensity(level);
                // Announce intensity change for screen readers
                const intensityLabels = ['Very mild', 'Mild', 'Moderate', 'Strong', 'Very intense'];
                if (AccessibilityInfo) {
                  AccessibilityInfo.announceForAccessibility(
                    `Intensity set to ${intensityLabels[level - 1] || level} out of 5`
                  );
                }
              }}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`Intensity level ${level} out of 5`}
              accessibilityHint={`Set mood intensity to ${level}`}
              accessibilityState={{ selected: intensity === level }}
              testID={`intensity-dot-${level}`}
            />
          ))}
        </View>
        <View style={styles.intensityLabels}>
          <Text
            style={[
              styles.intensityLabel,
              { color: theme.colors.text.tertiary },
            ]}
          >
            Mild
          </Text>
          <Text
            style={[
              styles.intensityLabel,
              { color: theme.colors.text.tertiary },
            ]}
          >
            Very Intense
          </Text>
        </View>
        <Text
          style={[styles.intensityValue, { color: theme.colors.text.primary }]}
        >
          Current: {intensity}/5
        </Text>
      </View>
    </Animated.View>
  );

  const renderActivitySelection = () => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={[styles.stepTitle, { color: theme.colors.text.primary }]}>
        What have you been doing?
      </Text>
      <Text
        style={[styles.stepSubtitle, { color: theme.colors.text.secondary }]}
      >
        Select any activities that might be related to your current mood
        (optional)
      </Text>

      <View style={styles.optionsGrid}>
        {commonActivities.map((activity) => (
          <TouchableOpacity
            key={activity.id}
            style={[
              styles.optionCard,
              activities.includes(activity.id) && {
                backgroundColor: theme.colors.therapeutic.nurturing[100],
                borderColor: theme.colors.therapeutic.nurturing[400],
                borderWidth: 2,
              },
            ]}
            onPress={() => {
              if (activities.includes(activity.id)) {
                setActivities(activities.filter((a) => a !== activity.id));
              } else {
                setActivities([...activities, activity.id]);
              }
            }}
            activeOpacity={0.8}
            accessible
            accessibilityRole="button"
            accessibilityLabel={activity.label}
            accessibilityState={{ selected: activities.includes(activity.id) }}
          >
            <Text style={styles.optionIcon}>{activity.icon}</Text>
            <Text
              style={[styles.optionLabel, { color: theme.colors.text.primary }]}
            >
              {activity.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  const renderNotesInput = () => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={[styles.stepTitle, { color: theme.colors.text.primary }]}>
        Anything else you'd like to note?
      </Text>
      <Text
        style={[styles.stepSubtitle, { color: theme.colors.text.secondary }]}
      >
        Add any thoughts, observations, or context about your mood (optional)
      </Text>

      <View style={styles.notesContainer}>
        <TextInput
          style={[
            styles.notesInput,
            {
              backgroundColor: theme.colors.background.secondary,
              color: theme.colors.text.primary,
              borderColor: theme.colors.gray[300],
            },
          ]}
          value={notes}
          onChangeText={setNotes}
          placeholder="What's on your mind? Any thoughts about your mood today..."
          placeholderTextColor={theme.colors.text.tertiary}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          accessible
          accessibilityLabel="Mood notes"
          accessibilityHint="Add any additional thoughts about your mood"
        />
      </View>

      {/* Triggers Section */}
      <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
        Any potential triggers?
      </Text>
      <View style={styles.optionsGrid}>
        {commonTriggers.map((trigger) => (
          <TouchableOpacity
            key={trigger.id}
            style={[
              styles.optionCard,
              styles.triggerCard,
              triggers.includes(trigger.id) && {
                backgroundColor: theme.colors.warning[100],
                borderColor: theme.colors.warning[400],
                borderWidth: 2,
              },
            ]}
            onPress={() => {
              if (triggers.includes(trigger.id)) {
                setTriggers(triggers.filter((t) => t !== trigger.id));
              } else {
                setTriggers([...triggers, trigger.id]);
              }
            }}
            activeOpacity={0.8}
            accessible
            accessibilityRole="button"
            accessibilityLabel={trigger.label}
            accessibilityState={{ selected: triggers.includes(trigger.id) }}
          >
            <Text style={styles.optionIcon}>{trigger.icon}</Text>
            <Text
              style={[styles.optionLabel, { color: theme.colors.text.primary }]}
            >
              {trigger.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return renderMoodSelection();
      case 1:
        return renderIntensitySelection();
      case 2:
        return renderActivitySelection();
      case 3:
        return renderNotesInput();
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient
        colors={[
          theme.colors.therapeutic.calming[100],
          theme.colors.background.primary,
        ]}
        style={styles.backgroundGradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ActionIcon name="Back" size="md" colorScheme="primary" />
          </TouchableOpacity>
          <Text
            style={[styles.headerTitle, { color: theme.colors.text.primary }]}
          >
            Mood Check-in
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderStep()}
        </ScrollView>

        {/* Navigation */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[
              styles.navButton,
              styles.previousButton,
              currentStep === 0 && styles.disabledButton,
            ]}
            onPress={handlePrevious}
            disabled={currentStep === 0}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Previous step"
          >
            <Text
              style={[
                styles.navButtonText,
                {
                  color:
                    currentStep === 0
                      ? theme.colors.text.tertiary
                      : theme.colors.text.primary,
                },
              ]}
            >
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              styles.nextButton,
              !canProceed() && styles.disabledButton,
            ]}
            onPress={currentStep === 3 ? handleSave : handleNext}
            disabled={!canProceed()}
            accessible
            accessibilityRole="button"
            accessibilityLabel={
              currentStep === 3 ? "Save mood entry" : "Next step"
            }
          >
            <LinearGradient
              colors={
                canProceed()
                  ? [
                      theme.colors.therapeutic.calming[500],
                      theme.colors.therapeutic.peaceful[500],
                    ]
                  : [theme.colors.gray[300], theme.colors.gray[400]]
              }
              style={styles.nextButtonGradient}
            >
              <Text
                style={[styles.nextButtonText, { color: colors.text.inverse }]}
              >
                {currentStep === 3 ? "Save" : "Next"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing[5],
    paddingTop: spacing[12],
    paddingBottom: spacing[4],
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: {
    width: 44,
  },
  progressContainer: {
    paddingHorizontal: spacing[5],
    marginBottom: spacing[6],
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: spacing[2],
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[6],
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: typography.sizes["2xl"],
    fontWeight: typography.weights.bold,
    lineHeight: typography.lineHeights["2xl"],
    marginBottom: spacing[2],
    textAlign: "center",
  },
  stepSubtitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.base,
    textAlign: "center",
    marginBottom: spacing[8],
    paddingHorizontal: spacing[4],
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: spacing[3],
  },
  moodCard: {
    width: (width - spacing[10] - spacing[6]) / 4,
    aspectRatio: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: borderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
    ...shadows.sm,
  },
  moodEmoji: {
    fontSize: typography.sizes["3xl"],
    marginBottom: spacing[1],
  },
  moodLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semiBold,
    textAlign: "center",
  },
  intensityContainer: {
    alignItems: "center",
  },
  intensityScale: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[4],
    marginBottom: spacing[2],
  },
  intensityDot: {
    width: 44, // WCAG compliant touch target
    height: 44,
    borderRadius: 22,
    ...shadows.sm,
  },
  intensityLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: spacing[4],
  },
  intensityLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  intensityValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[3],
  },
  optionCard: {
    minWidth: (width - spacing[10] - spacing[6]) / 3,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: borderRadius.md,
    padding: spacing[3],
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
    ...shadows.sm,
  },
  triggerCard: {
    minWidth: (width - spacing[10] - spacing[6]) / 4,
  },
  optionIcon: {
    fontSize: typography.sizes.xl,
    marginBottom: spacing[1],
  },
  optionLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
    marginTop: spacing[6],
    marginBottom: spacing[4],
  },
  notesContainer: {
    marginBottom: spacing[6],
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing[4],
    fontSize: typography.sizes.base,
    lineHeight: typography.lineHeights.base,
    minHeight: 120,
    ...shadows.sm,
  },
  navigationContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    gap: spacing[3],
  },
  navButton: {
    flex: 1,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: borderRadius.lg,
  },
  previousButton: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  nextButton: {
    overflow: "hidden",
  },
  nextButtonGradient: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semiBold,
  },
  nextButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
  },
});

export default EnhancedMoodTrackerScreen;
