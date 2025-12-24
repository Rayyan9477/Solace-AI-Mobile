/**
 * ExerciseDetailScreen - Detailed view and guidance for a therapy exercise
 * Provides step-by-step instructions, timer, and completion tracking
 */

import { completeExercise } from "@app/store/slices/therapySlice";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import { useResponsive } from "@shared/hooks/useResponsive";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Animated,
} from "react-native";
import { useDispatch } from "react-redux";

interface ExerciseStep {
  step: number;
  title: string;
  instruction: string;
  duration?: number; // in seconds
}

interface TherapyExercise {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: number; // total duration in minutes
  difficulty: "Easy" | "Medium" | "Advanced";
  benefits: string[];
  steps: ExerciseStep[];
}

// Production-ready therapy exercises database
const THERAPY_EXERCISES: Record<string, TherapyExercise> = {
  "breathing-478": {
    id: "breathing-478",
    title: "4-7-8 Breathing Technique",
    category: "Breathing Exercise",
    description:
      "A powerful breathing technique to reduce anxiety and promote relaxation. This exercise helps activate your parasympathetic nervous system, inducing a state of calm.",
    duration: 5,
    difficulty: "Easy",
    benefits: [
      "Reduces anxiety and stress",
      "Improves sleep quality",
      "Lowers blood pressure",
      "Enhances focus and concentration",
    ],
    steps: [
      {
        step: 1,
        title: "Find Your Position",
        instruction:
          "Sit comfortably with your back straight. Place the tip of your tongue against the ridge of tissue behind your upper front teeth. Keep it there throughout the exercise.",
        duration: 30,
      },
      {
        step: 2,
        title: "Empty Your Lungs",
        instruction:
          "Exhale completely through your mouth, making a whoosh sound. This prepares your body for the breathing cycle.",
        duration: 5,
      },
      {
        step: 3,
        title: "Inhale (Count to 4)",
        instruction:
          "Close your mouth and inhale quietly through your nose while mentally counting to 4. Feel your lungs fill with air.",
        duration: 4,
      },
      {
        step: 4,
        title: "Hold (Count to 7)",
        instruction:
          "Hold your breath for a count of 7. This allows oxygen to fully circulate in your body.",
        duration: 7,
      },
      {
        step: 5,
        title: "Exhale (Count to 8)",
        instruction:
          "Exhale completely through your mouth, making a whoosh sound, for a count of 8. This completes one cycle.",
        duration: 8,
      },
      {
        step: 6,
        title: "Repeat the Cycle",
        instruction:
          "Repeat steps 3-5 for three more breath cycles (4 cycles total). With practice, you can extend to 8 cycles.",
        duration: 60,
      },
      {
        step: 7,
        title: "Return to Normal",
        instruction:
          "Return to normal breathing. Notice how your body feels more relaxed and your mind clearer.",
        duration: 20,
      },
    ],
  },
  "grounding-54321": {
    id: "grounding-54321",
    title: "5-4-3-2-1 Grounding Technique",
    category: "Grounding Exercise",
    description:
      "A sensory awareness technique to help you stay present and calm during moments of anxiety or stress. This exercise engages your five senses to ground you in the present moment.",
    duration: 7,
    difficulty: "Easy",
    benefits: [
      "Reduces anxiety and panic",
      "Grounds you in the present",
      "Interrupts negative thought patterns",
      "Can be done anywhere",
    ],
    steps: [
      {
        step: 1,
        title: "Acknowledge 5 Things You See",
        instruction:
          "Look around and identify 5 things you can see. Name them out loud or in your mind. Focus on details - colors, shapes, textures. Take your time with each one.",
        duration: 60,
      },
      {
        step: 2,
        title: "Acknowledge 4 Things You Can Touch",
        instruction:
          "Notice 4 things you can physically feel. This might be your feet on the ground, the texture of your clothing, or the temperature of the air. Touch them if possible.",
        duration: 60,
      },
      {
        step: 3,
        title: "Acknowledge 3 Things You Hear",
        instruction:
          "Listen carefully and identify 3 sounds. They can be external (birds, traffic) or internal (breathing, heartbeat). Don't judge them, just notice.",
        duration: 45,
      },
      {
        step: 4,
        title: "Acknowledge 2 Things You Can Smell",
        instruction:
          "Notice 2 scents. If you can't smell anything, think of your two favorite scents or walk to find something with a scent.",
        duration: 45,
      },
      {
        step: 5,
        title: "Acknowledge 1 Thing You Can Taste",
        instruction:
          "Focus on 1 thing you can taste. It might be the taste in your mouth, or you can take a sip of water or bite of food to engage this sense.",
        duration: 30,
      },
      {
        step: 6,
        title: "Take a Deep Breath",
        instruction:
          "Take a slow, deep breath and notice how you feel. Your anxiety should be reduced, and you should feel more grounded in the present.",
        duration: 30,
      },
    ],
  },
  "progressive-relaxation": {
    id: "progressive-relaxation",
    title: "Progressive Muscle Relaxation",
    category: "Relaxation Exercise",
    description:
      "A deep relaxation technique that involves tensing and then releasing different muscle groups. This helps you become aware of physical tension and learn to relax your body.",
    duration: 15,
    difficulty: "Medium",
    benefits: [
      "Reduces physical tension",
      "Improves sleep",
      "Decreases anxiety",
      "Helps identify stress in the body",
    ],
    steps: [
      {
        step: 1,
        title: "Find a Quiet Space",
        instruction:
          "Sit or lie down in a comfortable position. Close your eyes and take a few deep breaths to center yourself.",
        duration: 30,
      },
      {
        step: 2,
        title: "Start with Your Feet",
        instruction:
          "Tense the muscles in your feet by curling your toes. Hold for 5 seconds, feeling the tension. Then release and notice the difference for 10 seconds.",
        duration: 20,
      },
      {
        step: 3,
        title: "Move to Your Calves",
        instruction:
          "Tense your calf muscles by pointing your toes upward. Hold for 5 seconds, then release completely. Feel the wave of relaxation.",
        duration: 20,
      },
      {
        step: 4,
        title: "Tense Your Thighs",
        instruction:
          "Squeeze your thigh muscles. Hold the tension for 5 seconds. Release and let your legs feel heavy and relaxed.",
        duration: 20,
      },
      {
        step: 5,
        title: "Engage Your Core",
        instruction:
          "Tighten your stomach muscles as if bracing for impact. Hold for 5 seconds. Release and breathe deeply into your belly.",
        duration: 20,
      },
      {
        step: 6,
        title: "Tense Your Hands",
        instruction:
          "Make tight fists with both hands. Hold for 5 seconds, feeling the tension. Release and spread your fingers wide.",
        duration: 20,
      },
      {
        step: 7,
        title: "Tense Your Arms",
        instruction:
          "Bend your arms at the elbows and tense your biceps and forearms. Hold for 5 seconds, then let your arms drop and relax completely.",
        duration: 20,
      },
      {
        step: 8,
        title: "Raise Your Shoulders",
        instruction:
          "Lift your shoulders up toward your ears. Hold the tension for 5 seconds. Drop your shoulders and feel the release.",
        duration: 20,
      },
      {
        step: 9,
        title: "Tense Your Face",
        instruction:
          "Scrunch up your face - squeeze your eyes shut, wrinkle your nose. Hold for 5 seconds, then relax all facial muscles.",
        duration: 20,
      },
      {
        step: 10,
        title: "Full Body Scan",
        instruction:
          "Do a final scan of your body. Notice any remaining tension and consciously release it. Take 5 deep breaths and enjoy the feeling of complete relaxation.",
        duration: 60,
      },
    ],
  },
  "mindful-observation": {
    id: "mindful-observation",
    title: "Mindful Observation",
    category: "Mindfulness Exercise",
    description:
      "Practice being fully present by observing an object in detail. This exercise trains your mind to focus and reduces rumination.",
    duration: 10,
    difficulty: "Easy",
    benefits: [
      "Improves focus and concentration",
      "Reduces rumination",
      "Enhances present-moment awareness",
      "Calms racing thoughts",
    ],
    steps: [
      {
        step: 1,
        title: "Choose Your Object",
        instruction:
          "Select a natural object from your surroundings - a flower, leaf, stone, fruit, or any item that appeals to you.",
        duration: 15,
      },
      {
        step: 2,
        title: "Observe the Object",
        instruction:
          "Hold the object or place it in front of you. Look at it as if you've never seen anything like it before. Examine every aspect without judgment.",
        duration: 60,
      },
      {
        step: 3,
        title: "Notice Visual Details",
        instruction:
          "Observe the colors, patterns, textures, and shapes. Notice how light reflects off it. See the unique characteristics that make it one-of-a-kind.",
        duration: 90,
      },
      {
        step: 4,
        title: "Engage Other Senses",
        instruction:
          "If appropriate, touch the object. Notice the texture, temperature, weight. If edible, smell it. Engage as many senses as you can.",
        duration: 60,
      },
      {
        step: 5,
        title: "Notice Your Mind Wandering",
        instruction:
          "When your mind wanders, acknowledge it without judgment. Gently bring your attention back to the object. This is the practice.",
        duration: 60,
      },
      {
        step: 6,
        title: "Reflect on the Experience",
        instruction:
          "Take a moment to reflect. Notice how this focused attention has affected your mental state. You've just practiced mindfulness.",
        duration: 30,
      },
    ],
  },
  "body-scan": {
    id: "body-scan",
    title: "Body Scan Meditation",
    category: "Meditation Exercise",
    description:
      "A meditation practice that systematically focuses attention on different parts of your body. This builds awareness of physical sensations and promotes deep relaxation.",
    duration: 12,
    difficulty: "Medium",
    benefits: [
      "Develops body awareness",
      "Releases physical tension",
      "Improves mind-body connection",
      "Reduces chronic pain",
    ],
    steps: [
      {
        step: 1,
        title: "Get Comfortable",
        instruction:
          "Lie down on your back in a comfortable position. You can also sit if lying down makes you sleepy. Close your eyes.",
        duration: 30,
      },
      {
        step: 2,
        title: "Focus on Your Breath",
        instruction:
          "Take 5 deep breaths. Notice the sensation of breathing. Don't change your breath, just observe it naturally.",
        duration: 40,
      },
      {
        step: 3,
        title: "Scan Your Feet",
        instruction:
          "Bring attention to your feet. Notice any sensations - tingling, warmth, pressure, or perhaps no sensation at all. Just observe without judgment.",
        duration: 60,
      },
      {
        step: 4,
        title: "Move to Your Legs",
        instruction:
          "Shift focus to your calves, then knees, then thighs. Notice any tension or relaxation. Breathe into any areas of tightness.",
        duration: 90,
      },
      {
        step: 5,
        title: "Scan Your Torso",
        instruction:
          "Move attention to your pelvis, lower back, stomach, chest, and upper back. Notice your breath moving through your torso.",
        duration: 90,
      },
      {
        step: 6,
        title: "Notice Your Arms and Hands",
        instruction:
          "Bring awareness to your fingers, hands, forearms, elbows, and upper arms. Notice the weight of your arms.",
        duration: 60,
      },
      {
        step: 7,
        title: "Scan Your Neck and Head",
        instruction:
          "Focus on your neck, jaw, face, and scalp. These areas often hold tension. Soften any tightness you notice.",
        duration: 60,
      },
      {
        step: 8,
        title: "Full Body Awareness",
        instruction:
          "Expand your awareness to include your whole body. Notice the feeling of your body as a complete whole, lying here, breathing.",
        duration: 60,
      },
      {
        step: 9,
        title: "Gently Return",
        instruction:
          "Slowly begin to deepen your breath. Gently wiggle your fingers and toes. When ready, open your eyes and take your time getting up.",
        duration: 30,
      },
    ],
  },
};

/**
 * ExerciseDetailScreen Component
 * Interactive exercise guidance and completion
 */
const ExerciseDetailScreen = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  // CRIT-NEW-004 FIX: Validate exerciseId from route params
  const rawExerciseId = route.params?.exerciseId;
  const exerciseId = typeof rawExerciseId === 'string' && rawExerciseId ? rawExerciseId : null;
  const { isWeb, getMaxContentWidth, getContainerPadding } = useResponsive();

  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const progressAnim = useState(new Animated.Value(0))[0];

  // CRIT-NEW-004 FIX: Use validated exerciseId with fallback to default exercise
  const exercise =
    (exerciseId && THERAPY_EXERCISES[exerciseId]) || THERAPY_EXERCISES["breathing-478"];
  const currentStepData = exercise.steps[currentStep];
  const progress = ((currentStep + 1) / exercise.steps.length) * 100;

  const maxWidth = getMaxContentWidth();
  const contentMaxWidth = isWeb ? Math.min(maxWidth, 800) : "100%";
  const containerPadding = getContainerPadding();

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerActive && currentStepData?.duration) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev >= (currentStepData.duration || 0)) {
            setIsTimerActive(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, currentStep, currentStepData]);

  // Progress animation
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const handleNextStep = () => {
    if (currentStep < exercise.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setTimer(0);
      setIsTimerActive(false);
    } else {
      handleComplete();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setTimer(0);
      setIsTimerActive(false);
    }
  };

  const handleStartTimer = () => {
    setTimer(0);
    setIsTimerActive(true);
  };

  const handleComplete = () => {
    dispatch(completeExercise(exerciseId));
    setIsCompleted(true);

    Alert.alert(
      "Exercise Completed! 🎉",
      `Great job! You've completed ${exercise.title}. This is a significant step in your mental wellness journey.`,
      [
        {
          text: "View More Exercises",
          onPress: () => navigation.navigate("TherapyExercises"),
        },
        {
          text: "Back to Dashboard",
          onPress: () => navigation.navigate("Dashboard"),
        },
      ],
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    scrollContent: {
      flexGrow: 1,
    },
    innerContainer: {
      width: "100%",
      alignItems: "center",
    },
    contentWrapper: {
      width: "100%",
      maxWidth: contentMaxWidth,
      paddingHorizontal: containerPadding,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: theme.colors.brown[70],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.brown[60],
    },
    backButton: {
      padding: 8,
    },
    backButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.brown[10],
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.brown[10],
    },
    headerSpacer: {
      width: 60,
    },
    content: {
      paddingVertical: 16,
      gap: 16,
    },
    exerciseHeader: {
      backgroundColor: theme.colors.brown[20],
      borderRadius: 16,
      padding: 20,
    },
    exerciseTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    exerciseCategory: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.brown[70],
      marginBottom: 12,
    },
    exerciseDescription: {
      fontSize: 15,
      lineHeight: 22,
      color: theme.colors.text.secondary,
      marginBottom: 16,
    },
    metaRow: {
      flexDirection: "row",
      gap: 12,
      flexWrap: "wrap",
    },
    metaBadge: {
      backgroundColor: theme.colors.brown[30],
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    metaText: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
    progressContainer: {
      backgroundColor: theme.colors.brown[20],
      borderRadius: 16,
      padding: 20,
    },
    progressHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    progressText: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    progressPercentage: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.brown[70],
    },
    progressBarBackground: {
      height: 8,
      backgroundColor: theme.colors.brown[30],
      borderRadius: 4,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: theme.colors.brown[70],
      borderRadius: 4,
    },
    stepCard: {
      backgroundColor: theme.colors.brown[20],
      borderRadius: 16,
      padding: 20,
      minHeight: 200,
    },
    stepHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    stepNumber: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.brown[70],
    },
    stepTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 12,
      flex: 1,
    },
    timerContainer: {
      backgroundColor: theme.colors.brown[30],
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
    },
    timerText: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.brown[70],
    },
    stepInstruction: {
      fontSize: 16,
      lineHeight: 24,
      color: theme.colors.text.secondary,
      marginBottom: 20,
    },
    timerButton: {
      backgroundColor: theme.colors.brown[70],
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: "center",
    },
    timerButtonText: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.colors.brown[10],
    },
    navigationButtons: {
      flexDirection: "row",
      gap: 12,
    },
    navButton: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
      borderWidth: 2,
      borderColor: theme.colors.brown[50],
    },
    navButtonPrimary: {
      backgroundColor: theme.colors.brown[70],
      borderColor: theme.colors.brown[70],
    },
    navButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
    navButtonTextPrimary: {
      color: theme.colors.brown[10],
    },
    benefitsCard: {
      backgroundColor: theme.colors.brown[20],
      borderRadius: 16,
      padding: 20,
    },
    benefitsTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 12,
    },
    benefitItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    benefitIcon: {
      fontSize: 16,
      marginRight: 8,
    },
    benefitText: {
      fontSize: 15,
      lineHeight: 22,
      color: theme.colors.text.secondary,
      flex: 1,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessible
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exercise Guide</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.innerContainer}>
          <View style={styles.contentWrapper}>
            <View style={styles.content}>
              {/* Exercise Header */}
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                <Text style={styles.exerciseCategory}>{exercise.category}</Text>
                <Text style={styles.exerciseDescription}>
                  {exercise.description}
                </Text>
                <View style={styles.metaRow}>
                  <View style={styles.metaBadge}>
                    <Text style={styles.metaText}>
                      ⏱️ {exercise.duration} min
                    </Text>
                  </View>
                  <View style={styles.metaBadge}>
                    <Text style={styles.metaText}>
                      📊 {exercise.difficulty}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressText}>Your Progress</Text>
                  <Text style={styles.progressPercentage}>
                    {Math.round(progress)}%
                  </Text>
                </View>
                <View style={styles.progressBarBackground}>
                  <Animated.View
                    style={[
                      styles.progressBarFill,
                      {
                        width: progressAnim.interpolate({
                          inputRange: [0, 100],
                          outputRange: ["0%", "100%"],
                        }),
                      },
                    ]}
                  />
                </View>
              </View>

              {/* Current Step */}
              <View style={styles.stepCard}>
                <View style={styles.stepHeader}>
                  <Text style={styles.stepNumber}>
                    Step {currentStep + 1} of {exercise.steps.length}
                  </Text>
                  {currentStepData.duration && (
                    <View style={styles.timerContainer}>
                      <Text style={styles.timerText}>
                        {formatTime(
                          isTimerActive ? timer : currentStepData.duration,
                        )}
                      </Text>
                    </View>
                  )}
                </View>

                <Text style={styles.stepTitle}>{currentStepData.title}</Text>
                <Text style={styles.stepInstruction}>
                  {currentStepData.instruction}
                </Text>

                {currentStepData.duration && !isTimerActive && (
                  <TouchableOpacity
                    style={styles.timerButton}
                    onPress={handleStartTimer}
                    accessible
                    accessibilityLabel="Start timer for this step"
                    accessibilityRole="button"
                  >
                    <Text style={styles.timerButtonText}>
                      ▶️ Start Timer ({currentStepData.duration}s)
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Navigation Buttons */}
              <View style={styles.navigationButtons}>
                {currentStep > 0 && (
                  <TouchableOpacity
                    style={styles.navButton}
                    onPress={handlePreviousStep}
                    accessible
                    accessibilityLabel="Go to previous step"
                    accessibilityRole="button"
                  >
                    <Text style={styles.navButtonText}>← Previous</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.navButton, styles.navButtonPrimary]}
                  onPress={handleNextStep}
                  accessible
                  accessibilityLabel={
                    currentStep < exercise.steps.length - 1
                      ? "Go to next step"
                      : "Complete exercise"
                  }
                  accessibilityRole="button"
                >
                  <Text
                    style={[styles.navButtonText, styles.navButtonTextPrimary]}
                  >
                    {currentStep < exercise.steps.length - 1
                      ? "Next →"
                      : "Complete ✓"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Benefits */}
              <View style={styles.benefitsCard}>
                <Text style={styles.benefitsTitle}>
                  Benefits of This Exercise
                </Text>
                {/* LOW-NEW-002 FIX: Use benefit text as stable key instead of index */}
                {exercise.benefits.map((benefit) => (
                  <View key={`benefit-${benefit.substring(0, 25).replace(/\s/g, '-')}`} style={styles.benefitItem}>
                    <Text style={styles.benefitIcon}>✓</Text>
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// LOW-NEW-001 FIX: Add displayName for debugging
ExerciseDetailScreen.displayName = 'ExerciseDetailScreen';

export default ExerciseDetailScreen;
