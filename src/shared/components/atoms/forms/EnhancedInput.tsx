/**
 * Enhanced Input Component with Form Validation
 *
 * Provides comprehensive form input functionality with:
 * - Integrated validation with therapeutic messaging
 * - Cross-platform keyboard handling
 * - Enhanced accessibility support
 * - Mental health form optimizations
 * - Real-time validation feedback
 */

import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  Text,
  TextInput,
  Animated,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";

// MED-015 FIX: Import MaterialCommunityIcons for accessible password visibility icons
import { MaterialCommunityIcons } from "../../../expo/vector-icons";
import { useTheme } from "../../../theme/ThemeContext";
import {
  TouchTargetHelpers,
  WCAG_CONSTANTS,
  FocusManagement,
  createFormInputAccessibility,
} from "../../../utils/accessibility";
import {
  createValidator,
  FORM_CONTEXTS,
  VALIDATION_TYPES,
} from "../../../utils/formValidation";

const EnhancedInput = forwardRef(
  (
    {
      // Basic input props
      label,
      value = "",
      onChangeText,
      onBlur,
      onFocus,
      placeholder,
      secureTextEntry = false,
      keyboardType = "default",
      returnKeyType = "done",
      multiline = false,
      numberOfLines = 1,
      maxLength,
      autoCapitalize = "none",
      autoCorrect = true,
      autoComplete = "off",
      textContentType,

      // Validation props
      validationRules = [],
      formContext = FORM_CONTEXTS.PROFILE,
      validateOnChange = true,
      validateOnBlur = true,
      showValidationOnTouch = true,

      // Styling props
      variant = "outlined",
      size = "medium",
      disabled = false,
      error: externalError,
      helperText,
      leftIcon,
      rightIcon,

      // Mental health specific props
      isTherapyInput = false,
      isMoodInput = false,
      isAssessmentInput = false,
      isCrisisInput = false,

      // Accessibility props
      accessibilityLabel,
      accessibilityHint,
      accessibilityRequired = false,

      // Animation props
      animated = true,

      // Callback props
      onValidationChange,
      onFocusChange,

      // Other props
      testID,
      style,
      ...props
    },
    ref,
  ) => {
    const { theme, isReducedMotionEnabled } = useTheme();
    const inputRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const [validationError, setValidationError] = useState(null);
    const [isValidating, setIsValidating] = useState(false);
    const [isSecureVisible, setIsSecureVisible] = useState(!secureTextEntry);

    // Animation values
    const focusAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
    const errorAnim = useRef(new Animated.Value(0)).current;
    const validationTimer = useRef<NodeJS.Timeout | null>(null);

    // CRIT-006 FIX: Cleanup validation timer on unmount to prevent memory leaks
    useEffect(() => {
      return () => {
        if (validationTimer.current) {
          clearTimeout(validationTimer.current);
          validationTimer.current = null;
        }
      };
    }, []);

    // Create validator instance
    const validator = useRef(
      createValidator(formContext, {
        validateOnChange,
        validateOnBlur,
        useTherapeuticLanguage:
          isTherapyInput || isMoodInput || isAssessmentInput,
        gentleValidation: isTherapyInput || isMoodInput,
        supportiveMessaging: true,
      }),
    ).current;

    // Expose input methods to parent
    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
      clear: () => {
        onChangeText?.("");
        setValidationError(null);
      },
      validate: () => validateInput(value),
      getValue: () => value,
      getError: () => validationError || externalError,
      isFocused: () => isFocused,
    }));

    // Handle focus animations
    useEffect(() => {
      if (!animated || isReducedMotionEnabled) return;

      Animated.timing(focusAnim, {
        toValue: isFocused || value ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }, [isFocused, value, animated, isReducedMotionEnabled]);

    // Handle error animations
    useEffect(() => {
      if (!animated || isReducedMotionEnabled) return;

      const hasError = !!(validationError || externalError);
      Animated.timing(errorAnim, {
        toValue: hasError ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }, [validationError, externalError, animated, isReducedMotionEnabled]);

    // Validate input value
    const validateInput = (inputValue, allValues = {}) => {
      if (validationRules.length === 0) return null;

      const errors = validator.validateField(
        "input",
        inputValue,
        allValues,
        validationRules,
      );
      const error = errors.length > 0 ? errors[0].message : null;

      setValidationError(error);
      onValidationChange?.(error, errors);

      return error;
    };

    // Handle text change with validation
    const handleChangeText = (text) => {
      onChangeText?.(text);

      if (validateOnChange && isTouched) {
        // Clear existing validation timer
        if (validationTimer.current) {
          clearTimeout(validationTimer.current);
        }

        // Debounce validation
        setIsValidating(true);
        validationTimer.current = setTimeout(() => {
          validateInput(text);
          setIsValidating(false);
        }, 300);
      }
    };

    // Handle focus
    const handleFocus = (event) => {
      setIsFocused(true);
      onFocus?.(event);
      onFocusChange?.(inputRef.current, true);

      // Announce focus for mental health contexts
      if (isTherapyInput) {
        FocusManagement.announceForScreenReader(
          "Therapy input focused. Share your thoughts when you're ready.",
          "polite",
        );
      } else if (isMoodInput) {
        FocusManagement.announceForScreenReader(
          "Mood input focused. Describe how you're feeling.",
          "polite",
        );
      } else if (isAssessmentInput) {
        FocusManagement.announceForScreenReader(
          "Assessment input focused. Answer honestly at your own pace.",
          "polite",
        );
      } else if (isCrisisInput) {
        FocusManagement.announceForScreenReader(
          "Crisis support input focused. This information helps us support you.",
          "polite",
        );
      }
    };

    // Handle blur
    const handleBlur = (event) => {
      setIsFocused(false);
      setIsTouched(true);
      onBlur?.(event);
      onFocusChange?.(inputRef.current, false);

      if (validateOnBlur) {
        validateInput(value);
      }
    };

    // Get input style based on variant and state
    const getInputStyles = () => {
      const hasError = !!(validationError || externalError);
      const baseStyles = {
        outlined: {
          borderWidth: 1,
          borderRadius: 8,
          backgroundColor: theme.colors.background.surface,
        },
        filled: {
          borderWidth: 0,
          borderRadius: 8,
          backgroundColor: theme.colors.background.secondary,
        },
        underlined: {
          borderWidth: 0,
          borderBottomWidth: 2,
          borderRadius: 0,
          backgroundColor: "transparent",
        },
      };

      const sizeStyles = {
        small: {
          paddingHorizontal: 12,
          paddingVertical: 8,
          fontSize: 14,
          minHeight: 40,
        },
        medium: {
          paddingHorizontal: 16,
          paddingVertical: 12,
          fontSize: 16,
          minHeight: 48,
        },
        large: {
          paddingHorizontal: 20,
          paddingVertical: 16,
          fontSize: 18,
          minHeight: 56,
        },
      };

      const borderColor = hasError
        ? theme.colors.error["500"]
        : isFocused
          ? theme.colors.primary["500"]
          : theme.colors.border.primary;

      return {
        ...baseStyles[variant],
        ...sizeStyles[size],
        borderColor,
        opacity: disabled ? 0.6 : 1,
      };
    };

    // Get mental health specific styling
    const getMentalHealthStyles = () => {
      if (isTherapyInput) {
        return {
          backgroundColor:
            theme.colors.therapeutic?.calm || theme.colors.background.primary,
          borderColor:
            theme.colors.therapeutic?.calm || theme.colors.primary["300"],
        };
      }

      if (isMoodInput) {
        return {
          backgroundColor:
            theme.colors.therapeutic?.nurturing ||
            theme.colors.background.primary,
          borderColor:
            theme.colors.therapeutic?.nurturing ||
            theme.colors.secondary["300"],
        };
      }

      if (isAssessmentInput) {
        return {
          backgroundColor:
            theme.colors.therapeutic?.peaceful ||
            theme.colors.background.primary,
          borderColor:
            theme.colors.therapeutic?.peaceful || theme.colors.primary["200"],
        };
      }

      if (isCrisisInput) {
        return {
          backgroundColor:
            theme.colors.error["50"] || theme.colors.background.primary,
          borderColor: theme.colors.error["300"],
        };
      }

      return {};
    };

    // Get accessibility props
    const getAccessibilityProps = () => {
      const hasError = !!(validationError || externalError);
      const errorMessage = validationError || externalError;

      return {
        accessible: true,
        accessibilityLabel: accessibilityLabel || label || placeholder,
        accessibilityHint: accessibilityHint || getContextualHint(),
        accessibilityRequired,
        accessibilityInvalid: hasError,
        accessibilityErrorMessage: errorMessage,
        accessibilityState: {
          disabled,
          invalid: hasError,
        },
      };
    };

    // Get contextual accessibility hints
    const getContextualHint = () => {
      if (isTherapyInput)
        return "Share your therapeutic insights and thoughts here.";
      if (isMoodInput) return "Describe your current mood and feelings.";
      if (isAssessmentInput)
        return "Provide your response to this assessment question.";
      if (isCrisisInput)
        return "This information helps us provide appropriate support.";
      return "Enter the requested information.";
    };

    // Handle secure text visibility toggle
    const toggleSecureTextEntry = () => {
      setIsSecureVisible(!isSecureVisible);
      FocusManagement.announceForScreenReader(
        `Password ${isSecureVisible ? "hidden" : "visible"}`,
        "polite",
      );
    };

    // Get enhanced touch target for icons
    const { style: iconTouchTarget } =
      TouchTargetHelpers.ensureMinimumTouchTarget({
        width: 32,
        height: 32,
      });

    const inputStyles = getInputStyles();
    const mentalHealthStyles = getMentalHealthStyles();
    const hasError = !!(validationError || externalError);
    const errorMessage = validationError || externalError;

    return (
      <View style={[styles.container, style]}>
        {/* Floating Label */}
        {label && (
          <Animated.Text
            style={[
              styles.label,
              {
                color: hasError
                  ? theme.colors.error["500"]
                  : animated
                    ? focusAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                          theme.colors.text.secondary,
                          theme.colors.primary["500"],
                        ],
                      })
                    : theme.colors.text.primary,
                fontSize: animated
                  ? focusAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [16, 12],
                    })
                  : 12,
                transform: animated
                  ? [
                      {
                        translateY: focusAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -8],
                        }),
                      },
                    ]
                  : [],
              },
            ]}
          >
            {label}
            {accessibilityRequired && <Text style={styles.required}> *</Text>}
          </Animated.Text>
        )}

        {/* Input Container */}
        <View
          style={[
            styles.inputContainer,
            inputStyles,
            mentalHealthStyles,
            isFocused && styles.focused,
            hasError && styles.error,
          ]}
        >
          {/* Left Icon */}
          {leftIcon && (
            <View style={[styles.iconContainer, iconTouchTarget]}>
              {leftIcon}
            </View>
          )}

          {/* Text Input */}
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={handleChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={isFocused ? placeholder : ""}
            placeholderTextColor={theme.colors.text.placeholder}
            secureTextEntry={secureTextEntry && !isSecureVisible}
            keyboardType={keyboardType}
            returnKeyType={returnKeyType}
            multiline={multiline}
            numberOfLines={numberOfLines}
            maxLength={maxLength}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            autoComplete={autoComplete}
            textContentType={textContentType}
            editable={!disabled}
            style={[
              styles.input,
              {
                color: theme.colors.text.primary,
                fontSize: inputStyles.fontSize,
                textAlignVertical: multiline ? "top" : "center",
              },
            ]}
            {...getAccessibilityProps()}
            testID={testID}
            {...props}
          />

          {/* Right Icon / Secure Text Toggle */}
          {(rightIcon || secureTextEntry) && (
            <Pressable
              onPress={secureTextEntry ? toggleSecureTextEntry : undefined}
              style={[styles.iconContainer, iconTouchTarget]}
              accessible
              accessibilityRole="button"
              accessibilityLabel={
                secureTextEntry
                  ? `${isSecureVisible ? "Hide" : "Show"} password`
                  : "Action button"
              }
              accessibilityHint={
                secureTextEntry
                  ? "Double tap to toggle password visibility"
                  : "Double tap to perform action"
              }
            >
              {secureTextEntry ? (
                // MED-015 FIX: Use MaterialCommunityIcons instead of emojis for accessibility
                // Emojis may not be properly announced by screen readers
                <MaterialCommunityIcons
                  name={isSecureVisible ? "eye" : "eye-off"}
                  size={22}
                  color={theme.colors.primary["500"]}
                  accessibilityElementsHidden={true}
                  importantForAccessibility="no-hide-descendants"
                />
              ) : (
                rightIcon
              )}
            </Pressable>
          )}
        </View>

        {/* Helper Text / Error Message */}
        <Animated.View
          style={[
            styles.bottomContainer,
            {
              opacity: animated
                ? errorAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [helperText ? 1 : 0, 1],
                  })
                : 1,
              transform: animated
                ? [
                    {
                      translateY: errorAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -2],
                      }),
                    },
                  ]
                : [],
            },
          ]}
        >
          {(errorMessage || helperText) && (
            <Text
              style={[
                styles.helperText,
                {
                  color: errorMessage
                    ? theme.colors.error["500"]
                    : theme.colors.text.secondary,
                },
              ]}
              accessibilityRole={errorMessage ? "alert" : "text"}
              accessibilityLiveRegion={errorMessage ? "assertive" : "none"}
            >
              {errorMessage || helperText}
            </Text>
          )}

          {/* Character Count */}
          {maxLength && (
            <Text
              style={[
                styles.characterCount,
                {
                  color:
                    (value?.length || 0) > maxLength * 0.9
                      ? theme.colors.warning["500"]
                      : theme.colors.text.secondary,
                },
              ]}
              accessibilityLabel={`${value?.length || 0} of ${maxLength} characters`}
            >
              {value?.length || 0}/{maxLength}
            </Text>
          )}
        </Animated.View>

        {/* Validation Status Indicator */}
        {isValidating && (
          <View style={styles.validationIndicator}>
            <Text
              style={[
                styles.validationText,
                { color: theme.colors.primary["500"] },
              ]}
            >
              Validating...
            </Text>
          </View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: "500",
  },
  required: {
    color: "#ef4444",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  focused: {
    shadowColor: "#0066cc",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  error: {
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === "ios" ? 0 : 4,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 4,
    minHeight: 20,
  },
  helperText: {
    fontSize: 12,
    fontWeight: "400",
    flex: 1,
    lineHeight: 16,
  },
  characterCount: {
    fontSize: 12,
    fontWeight: "400",
    marginLeft: 8,
  },
  validationIndicator: {
    position: "absolute",
    top: -2,
    right: 8,
  },
  validationText: {
    fontSize: 10,
    fontWeight: "600",
  },
});

EnhancedInput.displayName = "EnhancedInput";

export default EnhancedInput;
