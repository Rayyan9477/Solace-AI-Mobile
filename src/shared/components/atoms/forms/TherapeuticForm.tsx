import Button from "@shared/components/atoms/buttons/TherapeuticButton";
import Input from "@shared/components/atoms/forms/EnhancedInput";
import { hapticUtils, styleUtils } from "@shared/utils/platformOptimizations";
import { useTheme } from "@theme/ThemeProvider";
import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

// Supportive validation messages for mental health context
const THERAPEUTIC_MESSAGES = {
  mood: {
    empty: "Take your time - what feeling resonates with you right now?",
    selected: "Thank you for sharing how you're feeling today",
  },
  intensity: {
    empty:
      "How strongly are you experiencing this feeling? There's no wrong answer",
    selected: "Your experience is valid, no matter the intensity",
  },
  notes: {
    empty: "Feel free to share as much or as little as you'd like",
    filled: "Thank you for opening up - your thoughts matter",
    maxLength:
      "You've shared a lot - that takes courage. You can continue if you'd like",
  },
  activity: {
    empty: "What activities have you been doing? Everything counts, even rest",
    selected: "It's great that you're aware of your activities",
  },
};

const ProgressIndicator = ({ current, total, label }) => {
  const { theme } = useTheme();
  const progress = (current / total) * 100;

  return (
    <View style={styles.progressContainer}>
      <Text
        style={[styles.progressLabel, { color: theme.colors.text.secondary }]}
      >
        Step {current} of {total}: {label}
      </Text>
      <View
        style={[
          styles.progressBar,
          { backgroundColor: theme.colors.gray["200"] },
        ]}
      >
        <Animated.View
          style={[
            styles.progressFill,
            {
              backgroundColor: theme.colors.therapeutic.calming[500],
              width: `${progress}%`,
            },
          ]}
        />
      </View>
    </View>
  );
};

const SupportiveMessage = ({ type, value, error }) => {
  const { theme } = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [type, value, error]);

  const getMessage = () => {
    if (error) return error;

    const messages = THERAPEUTIC_MESSAGES[type];
    if (!messages) return "";

    if (type === "notes") {
      if (!value || value.length === 0) return messages.empty;
      if (value.length > 200) return messages.maxLength;
      return messages.filled;
    }

    return value ? messages.selected : messages.empty;
  };

  const getMessageStyle = () => {
    if (error) {
      return {
        color: theme.colors.therapeutic.nurturing[600], // Softer than traditional error red
        backgroundColor: theme.colors.therapeutic.nurturing[50],
      };
    }

    return {
      color: theme.colors.therapeutic.calming[600],
      backgroundColor: theme.colors.therapeutic.calming[50],
    };
  };

  const message = getMessage();
  if (!message) return null;

  return (
    <Animated.View
      style={[
        styles.supportiveMessage,
        getMessageStyle(),
        { opacity: fadeAnim },
      ]}
    >
      <Text style={[styles.messageText, { color: getMessageStyle().color }]}>
        {message}
      </Text>
    </Animated.View>
  );
};

const TherapeuticFormField = ({
  type,
  label,
  value,
  onChangeText,
  error,
  required = false,
  multiline = false,
  placeholder,
  maxLength,
  children,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.fieldContainer}>
      <Text style={[styles.fieldLabel, { color: theme.colors.text.primary }]}>
        {label}
        {required && (
          <Text style={{ color: theme.colors.therapeutic.calming[500] }}>
            {" "}
            *
          </Text>
        )}
      </Text>

      {children || (
        <Input
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder || `Enter your ${label.toLowerCase()}`}
          multiline={multiline}
          maxLength={maxLength}
          error={error}
          style={styles.therapeuticInput}
          animated
        />
      )}

      <SupportiveMessage type={type} value={value} error={error} />
    </View>
  );
};

const EmergencyEscapeHatch = ({ onPress, visible = true }) => {
  const { theme } = useTheme();

  if (!visible) return null;

  return (
    <View style={styles.emergencyContainer}>
      <Button
        title="Need Help Now?"
        variant="outline"
        size="small"
        onPress={onPress}
        icon="🆘"
        hapticFeedback
        style={[
          styles.emergencyButton,
          {
            borderColor: theme.colors.therapeutic.nurturing[500],
            backgroundColor: theme.colors.therapeutic.nurturing[50],
          },
        ]}
        accessibilityLabel="Get immediate help and support"
        accessibilityHint="Double tap to access emergency resources and crisis support"
      />
    </View>
  );
};

const TherapeuticForm = ({
  title,
  currentStep = 1,
  totalSteps = 1,
  stepLabel,
  children,
  onSubmit,
  submitLabel = "Continue",
  showEmergencyEscape = true,
  onEmergencyPress,
  loading = false,
}) => {
  const { theme } = useTheme();

  const handleSubmit = useCallback(() => {
    hapticUtils.impact("light");
    onSubmit?.();
  }, [onSubmit]);

  const handleEmergencyPress = useCallback(() => {
    hapticUtils.notification("warning");
    onEmergencyPress?.();
  }, [onEmergencyPress]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      {totalSteps > 1 && (
        <ProgressIndicator
          current={currentStep}
          total={totalSteps}
          label={stepLabel}
        />
      )}

      {title && (
        <Text style={[styles.formTitle, { color: theme.colors.text.primary }]}>
          {title}
        </Text>
      )}

      <View style={styles.fieldsContainer}>{children}</View>

      <View style={styles.actionsContainer}>
        <Button
          title={submitLabel}
          onPress={handleSubmit}
          variant="primary"
          size="large"
          loading={loading}
          style={styles.submitButton}
          hapticFeedback
        />

        {showEmergencyEscape && (
          <EmergencyEscapeHatch
            onPress={handleEmergencyPress}
            visible={showEmergencyEscape}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressLabel: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
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
  formTitle: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 32,
  },
  fieldsContainer: {
    flex: 1,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    lineHeight: 24,
  },
  therapeuticInput: {
    marginBottom: 8,
  },
  supportiveMessage: {
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  actionsContainer: {
    paddingTop: 20,
  },
  submitButton: {
    marginBottom: 16,
  },
  emergencyContainer: {
    alignItems: "center",
  },
  emergencyButton: {
    minWidth: 160,
  },
});

// Export components for use
export default TherapeuticForm;
export {
  TherapeuticFormField,
  ProgressIndicator,
  SupportiveMessage,
  EmergencyEscapeHatch,
};
