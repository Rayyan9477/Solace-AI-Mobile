/**
 * Mental Health Specific Form Components
 *
 * Provides specialized form patterns for mental health applications:
 * - Therapy session forms with supportive validation
 * - Mood tracking forms with emotional sensitivity
 * - Assessment forms with gentle progression
 * - Crisis support forms with immediate validation
 * - Journal forms with therapeutic encouragement
 */

import AccessibleButton from "@shared/components/atoms/buttons/TherapeuticButton";
import KeyboardAwareScrollView from "@shared/components/molecules/screens/KeyboardAwareScrollView";
import { FocusManagement } from "@shared/utils/accessibility";
import {
  createValidator,
  FORM_CONTEXTS,
  VALIDATION_SCHEMAS,
  VALIDATION_TYPES,
} from "@shared/utils/formValidation";
import { useTheme } from "@theme/ThemeProvider";
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Alert,
} from "react-native";

import EnhancedInput from "./EnhancedInput";

// Therapy Session Form
export const TherapySessionForm = ({
  onSubmit,
  onCancel,
  initialValues = {},
  isLoading = false,
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    sessionGoals: "",
    currentMood: "",
    moodIntensity: "",
    sessionNotes: "",
    progressReflection: "",
    nextSessionGoals: "",
    ...initialValues,
  });
  const [errors, setErrors] = useState({});

  const validator = useRef(
    createValidator(FORM_CONTEXTS.THERAPY, {
      useTherapeuticLanguage: true,
      gentleValidation: true,
    }),
  ).current;

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = () => {
    const validation = validator.validateForm(
      formData,
      VALIDATION_SCHEMAS.THERAPY_SESSION,
    );

    if (!validation.isValid) {
      setErrors(validation.errors);

      // Announce validation errors
      FocusManagement.announceForScreenReader(
        "Please review the form. Some fields need your attention.",
        "assertive",
      );
      return;
    }

    // Success announcement
    FocusManagement.announceForScreenReader(
      "Therapy session saved successfully. Great work on reflecting on your progress.",
      "polite",
    );

    onSubmit(formData);
  };

  return (
    <KeyboardAwareScrollView
      isTherapyForm
      extraHeight={100}
      contentContainerStyle={styles.container}
    >
      <View
        style={[
          styles.formCard,
          { backgroundColor: theme.colors.therapeutic?.calm },
        ]}
      >
        <Text style={[styles.formTitle, { color: theme.colors.text.primary }]}>
          Therapy Session Reflection
        </Text>
        <Text
          style={[styles.formSubtitle, { color: theme.colors.text.secondary }]}
        >
          Take your time to reflect on your thoughts and feelings. There's no
          pressure to fill out every field.
        </Text>

        <EnhancedInput
          label="What would you like to work on today?"
          value={formData.sessionGoals}
          onChangeText={(value) => handleFieldChange("sessionGoals", value)}
          placeholder="Your therapy goals for this session..."
          multiline
          numberOfLines={3}
          maxLength={500}
          isTherapyInput
          formContext={FORM_CONTEXTS.THERAPY}
          validationRules={VALIDATION_SCHEMAS.THERAPY_SESSION.sessionGoals}
          error={errors.sessionGoals?.[0]?.message}
          accessibilityLabel="Therapy session goals"
          accessibilityHint="Share what you'd like to focus on in today's session"
        />

        <View style={styles.moodSection}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            How are you feeling right now?
          </Text>

          <EnhancedInput
            label="Current Mood"
            value={formData.currentMood}
            onChangeText={(value) => handleFieldChange("currentMood", value)}
            placeholder="Describe your current emotional state..."
            isMoodInput
            formContext={FORM_CONTEXTS.THERAPY}
            validationRules={VALIDATION_SCHEMAS.THERAPY_SESSION.currentMood}
            error={errors.currentMood?.[0]?.message}
            accessibilityLabel="Current mood description"
          />

          <EnhancedInput
            label="Mood Intensity (1-10)"
            value={formData.moodIntensity}
            onChangeText={(value) => handleFieldChange("moodIntensity", value)}
            placeholder="1 = Very Low, 10 = Very High"
            keyboardType="numeric"
            maxLength={2}
            isMoodInput
            formContext={FORM_CONTEXTS.THERAPY}
            validationRules={[
              { type: VALIDATION_TYPES.REQUIRED },
              { type: VALIDATION_TYPES.MOOD_SCALE },
            ]}
            error={errors.moodIntensity?.[0]?.message}
            accessibilityLabel="Mood intensity rating"
            accessibilityHint="Rate your mood intensity from 1 to 10"
          />
        </View>

        <EnhancedInput
          label="Session Notes (Optional)"
          value={formData.sessionNotes}
          onChangeText={(value) => handleFieldChange("sessionNotes", value)}
          placeholder="Any thoughts, insights, or reflections you'd like to record..."
          multiline
          numberOfLines={4}
          maxLength={2000}
          isTherapyInput
          formContext={FORM_CONTEXTS.THERAPY}
          validationRules={VALIDATION_SCHEMAS.THERAPY_SESSION.sessionNotes}
          error={errors.sessionNotes?.[0]?.message}
          helperText="This is a safe space to express your thoughts freely"
          accessibilityLabel="Therapy session notes"
        />

        <View style={styles.buttonContainer}>
          <AccessibleButton
            title="Save Session"
            onPress={handleSubmit}
            variant="primary"
            size="large"
            loading={isLoading}
            disabled={isLoading}
            accessibilityLabel="Save therapy session"
            accessibilityHint="Save your therapy session reflection"
          />

          {onCancel && (
            <AccessibleButton
              title="Cancel"
              onPress={onCancel}
              variant="outline"
              size="large"
              style={styles.cancelButton}
              accessibilityLabel="Cancel therapy session"
            />
          )}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

// Enhanced Mood Tracking Form
export const MoodTrackingForm = ({
  onSubmit,
  initialValues = {},
  isLoading = false,
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    mood: "Happy",
    intensity: "",
    activities: [],
    triggers: "",
    notes: "",
    ...initialValues,
  });
  const [errors, setErrors] = useState({});

  const validator = useRef(
    createValidator(FORM_CONTEXTS.MOOD_TRACKER, {
      useTherapeuticLanguage: true,
      gentleValidation: true,
    }),
  ).current;

  const moodOptions = useMemo(
    () => [
      { label: "Happy", emoji: "😊", color: theme.colors.mood?.happy },
      { label: "Calm", emoji: "😌", color: theme.colors.mood?.calm },
      { label: "Anxious", emoji: "😰", color: theme.colors.mood?.anxious },
      { label: "Sad", emoji: "😢", color: theme.colors.mood?.sad },
      { label: "Angry", emoji: "😠", color: theme.colors.mood?.angry },
      { label: "Neutral", emoji: "😐", color: theme.colors.mood?.neutral },
      { label: "Excited", emoji: "🤩", color: theme.colors.mood?.excited },
      { label: "Tired", emoji: "😴", color: theme.colors.mood?.tired },
    ],
    [theme],
  );

  const handleMoodSelect = useCallback((mood) => {
    setFormData((prev) => ({ ...prev, mood: mood.label }));

    // Positive reinforcement for mood tracking
    FocusManagement.announceForScreenReader(
      `${mood.label} mood selected. You're doing great by tracking your emotions.`,
      "polite",
    );
  }, []);

  const handleSubmit = () => {
    const validation = validator.validateForm(
      formData,
      VALIDATION_SCHEMAS.MOOD_TRACKER,
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    FocusManagement.announceForScreenReader(
      "Mood entry saved. Thank you for taking care of your mental health.",
      "polite",
    );

    onSubmit(formData);
  };

  const MoodOption = useMemo(
    () =>
      React.memo(({ item, initiallySelected, theme }) => {
        const a11yStateRef = useRef({ selected: !!initiallySelected });
        const onPress = () => {
          // Mutate accessibilityState directly without a React re-render
          a11yStateRef.current.selected = true;
          FocusManagement.announceForScreenReader(
            `${item.label} mood selected. You're doing great by tracking your emotions.`,
            "polite",
          );
        };
        return (
          <TouchableWithoutFeedback onPress={onPress}>
            <View
              style={[
                styles.moodOption,
                {
                  backgroundColor:
                    item.color || theme.colors.background.secondary,
                },
                a11yStateRef.current.selected && styles.selectedMood,
              ]}
            >
              <Text style={styles.moodEmoji}>{item.emoji}</Text>
              <Text
                accessible
                accessibilityRole="button"
                accessibilityLabel={`${item.label} mood`}
                accessibilityState={a11yStateRef.current}
                accessibilityHint={`Select ${item.label} as your current mood`}
                onPress={() => {
                  a11yStateRef.current.selected = true;
                }}
                style={[styles.moodLabel, { color: theme.colors.text.primary }]}
              >
                {item.label}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        );
      }),
    [],
  );

  return (
    <KeyboardAwareScrollView
      isMoodTracker
      contentContainerStyle={styles.container}
    >
      <View
        style={[
          styles.formCard,
          { backgroundColor: theme.colors.therapeutic?.nurturing },
        ]}
      >
        <Text style={[styles.formTitle, { color: theme.colors.text.primary }]}>
          How Are You Feeling?
        </Text>
        <Text
          style={[styles.formSubtitle, { color: theme.colors.text.secondary }]}
        >
          Take a moment to check in with yourself. All feelings are valid.
        </Text>

        {/* Mood Selection */}
        <View style={styles.moodGrid}>
          {moodOptions.map((mood) => (
            <MoodOption
              key={mood.label}
              item={mood}
              initiallySelected={formData.mood === mood.label}
              theme={theme}
            />
          ))}
        </View>

        {errors.mood && (
          <Text
            style={[styles.errorText, { color: theme.colors.error["500"] }]}
          >
            {errors.mood[0]?.message}
          </Text>
        )}

        <EnhancedInput
          label="Intensity (1-10)"
          value={formData.intensity}
          onChangeText={(value) =>
            setFormData((prev) => ({ ...prev, intensity: value }))
          }
          placeholder="How intense is this feeling?"
          keyboardType="numeric"
          maxLength={2}
          isMoodInput
          formContext={FORM_CONTEXTS.MOOD_TRACKER}
          validationRules={[
            { type: VALIDATION_TYPES.REQUIRED },
            { type: VALIDATION_TYPES.MOOD_SCALE },
          ]}
          error={errors.intensity?.[0]?.message}
        />

        <EnhancedInput
          label="What's happening? (Optional)"
          value={formData.notes}
          onChangeText={(value) =>
            setFormData((prev) => ({ ...prev, notes: value }))
          }
          placeholder="Any thoughts about what might be influencing your mood..."
          multiline
          numberOfLines={3}
          maxLength={500}
          isMoodInput
          formContext={FORM_CONTEXTS.MOOD_TRACKER}
          helperText="This helps you identify patterns over time"
        />

        <View style={styles.buttonContainer}>
          <AccessibleButton
            title="Save Mood Entry"
            onPress={handleSubmit}
            variant="primary"
            size="large"
            loading={isLoading}
            disabled={isLoading || !formData.mood}
            accessibilityLabel="Save mood tracking entry"
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

// Assessment Question Form
export const AssessmentQuestionForm = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext,
  onPrevious,
  currentAnswer,
  isLoading = false,
}) => {
  const { theme } = useTheme();
  const [selectedAnswer, setSelectedAnswer] = useState(currentAnswer || "");
  const [error, setError] = useState("");

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setError("");
    onAnswer(answer);

    FocusManagement.announceForScreenReader(
      `Answer selected: ${answer}`,
      "polite",
    );
  };

  const handleNext = () => {
    if (!selectedAnswer) {
      setError("Please select an answer to continue.");
      FocusManagement.announceForScreenReader(
        "Please select an answer before continuing.",
        "assertive",
      );
      return;
    }

    onNext();
  };

  return (
    <KeyboardAwareScrollView
      isAssessment
      contentContainerStyle={styles.container}
    >
      <View
        style={[
          styles.formCard,
          { backgroundColor: theme.colors.therapeutic?.peaceful },
        ]}
      >
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <Text
            style={[
              styles.progressText,
              { color: theme.colors.text.secondary },
            ]}
          >
            Question {questionNumber} of {totalQuestions}
          </Text>
          <View
            style={[
              styles.progressBar,
              { backgroundColor: theme.colors.background.secondary },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: theme.colors.primary["500"],
                  width: `${(questionNumber / totalQuestions) * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        <Text
          style={[styles.questionText, { color: theme.colors.text.primary }]}
          accessibilityRole="header"
          accessibilityLabel={`Question ${questionNumber} of ${totalQuestions}: ${question.text}`}
        >
          {question.text}
        </Text>

        {question.description && (
          <Text
            style={[
              styles.questionDescription,
              { color: theme.colors.text.secondary },
            ]}
          >
            {question.description}
          </Text>
        )}

        {/* Answer Options */}
        <View style={styles.answerOptions}>
          {question.options.map((option, index) => (
            <Pressable
              key={index}
              style={[
                styles.answerOption,
                {
                  backgroundColor: theme.colors.background.surface,
                  borderColor:
                    selectedAnswer === option.value
                      ? theme.colors.primary["500"]
                      : theme.colors.border.primary,
                },
                selectedAnswer === option.value && styles.selectedAnswer,
              ]}
              onPress={() => handleAnswerSelect(option.value)}
              accessible
              accessibilityRole="radio"
              accessibilityLabel={option.text}
              accessibilityState={{ checked: selectedAnswer === option.value }}
              accessibilityHint="Double tap to select this answer"
            >
              <View
                style={[
                  styles.radioButton,
                  { borderColor: theme.colors.border.primary },
                  selectedAnswer === option.value && {
                    backgroundColor: theme.colors.primary["500"],
                    borderColor: theme.colors.primary["500"],
                  },
                ]}
              >
                {selectedAnswer === option.value && (
                  <View
                    style={[
                      styles.radioButtonInner,
                      { backgroundColor: theme.colors.background.primary },
                    ]}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.answerText,
                  { color: theme.colors.text.primary },
                ]}
              >
                {option.text}
              </Text>
            </Pressable>
          ))}
        </View>

        {error && (
          <Text
            style={[styles.errorText, { color: theme.colors.error["500"] }]}
            accessibilityRole="alert"
            accessibilityLiveRegion="assertive"
          >
            {error}
          </Text>
        )}

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {questionNumber > 1 && (
            <AccessibleButton
              title="Previous"
              onPress={onPrevious}
              variant="outline"
              size="medium"
              style={styles.navButton}
              accessibilityLabel="Go to previous question"
            />
          )}

          <AccessibleButton
            title={questionNumber === totalQuestions ? "Complete" : "Next"}
            onPress={handleNext}
            variant="primary"
            size="medium"
            loading={isLoading}
            disabled={isLoading}
            style={styles.navButton}
            accessibilityLabel={
              questionNumber === totalQuestions
                ? "Complete assessment"
                : "Go to next question"
            }
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

// Crisis Support Form
export const CrisisSupportForm = ({ onSubmit, isLoading = false }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    emergencyContact: "",
    relationship: "",
    additionalContact: "",
    currentSafety: "",
    supportNeeded: "",
  });
  const [errors, setErrors] = useState({});

  const validator = useRef(
    createValidator(FORM_CONTEXTS.CRISIS_SUPPORT, {
      announceErrors: true,
      liveRegion: "assertive",
    }),
  ).current;

  const handleSubmit = () => {
    const validation = validator.validateForm(
      formData,
      VALIDATION_SCHEMAS.CRISIS_SUPPORT,
    );

    if (!validation.isValid) {
      setErrors(validation.errors);

      Alert.alert(
        "Important Information Missing",
        "Please provide the required emergency contact information so we can better support you.",
        [{ text: "OK" }],
      );
      return;
    }

    onSubmit(formData);
  };

  return (
    <KeyboardAwareScrollView
      isCrisisInput
      contentContainerStyle={styles.container}
    >
      <View
        style={[styles.formCard, { backgroundColor: theme.colors.error["50"] }]}
      >
        <Text style={[styles.formTitle, { color: theme.colors.error["700"] }]}>
          Crisis Support Information
        </Text>
        <Text
          style={[styles.formSubtitle, { color: theme.colors.error["600"] }]}
        >
          This information helps us provide you with immediate support when
          needed.
        </Text>

        <EnhancedInput
          label="Emergency Contact Number"
          value={formData.emergencyContact}
          onChangeText={(value) =>
            setFormData((prev) => ({ ...prev, emergencyContact: value }))
          }
          placeholder="Phone number of someone who can help"
          keyboardType="phone-pad"
          isCrisisInput
          formContext={FORM_CONTEXTS.CRISIS_SUPPORT}
          validationRules={VALIDATION_SCHEMAS.CRISIS_SUPPORT.emergencyContact}
          error={errors.emergencyContact?.[0]?.message}
          accessibilityRequired
        />

        <EnhancedInput
          label="Relationship to Contact"
          value={formData.relationship}
          onChangeText={(value) =>
            setFormData((prev) => ({ ...prev, relationship: value }))
          }
          placeholder="e.g., Family member, friend, therapist"
          isCrisisInput
          formContext={FORM_CONTEXTS.CRISIS_SUPPORT}
        />

        <EnhancedInput
          label="How can we best support you right now?"
          value={formData.supportNeeded}
          onChangeText={(value) =>
            setFormData((prev) => ({ ...prev, supportNeeded: value }))
          }
          placeholder="Tell us what kind of support would be most helpful..."
          multiline
          numberOfLines={4}
          isCrisisInput
          formContext={FORM_CONTEXTS.CRISIS_SUPPORT}
          accessibilityHint="Describe the type of support you need most right now"
        />

        <View style={styles.buttonContainer}>
          <AccessibleButton
            title="Submit Support Request"
            onPress={handleSubmit}
            variant="primary"
            size="large"
            loading={isLoading}
            disabled={isLoading}
            accessibilityLabel="Submit crisis support request"
            accessibilityHint="Submit your information to receive immediate support"
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  formCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  formSubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    marginTop: 8,
  },
  moodSection: {
    marginVertical: 16,
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  moodOption: {
    width: "22%",
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedMood: {
    borderColor: "#0066cc",
    shadowColor: "#0066cc",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  questionText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    lineHeight: 28,
  },
  questionDescription: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 22,
  },
  answerOptions: {
    marginBottom: 24,
  },
  answerOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
    minHeight: 60,
  },
  selectedAnswer: {
    shadowColor: "#0066cc",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  answerText: {
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  navButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  buttonContainer: {
    marginTop: 24,
  },
  cancelButton: {
    marginTop: 12,
  },
  errorText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    textAlign: "center",
  },
});

// LOW-NEW-001 FIX: Add displayName for debugging and React DevTools
TherapySessionForm.displayName = "TherapySessionForm";
MoodTrackingForm.displayName = "MoodTrackingForm";
AssessmentQuestionForm.displayName = "AssessmentQuestionForm";
CrisisSupportForm.displayName = "CrisisSupportForm";

export default {
  TherapySessionForm,
  MoodTrackingForm,
  AssessmentQuestionForm,
  CrisisSupportForm,
};
