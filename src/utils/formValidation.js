/**
 * Comprehensive Form Validation System
 * 
 * Provides accessible, mental health-focused form validation with:
 * - WCAG 2.1 AA compliant error messaging
 * - Mental health sensitive validation patterns
 * - Real-time and submission validation
 * - Screen reader optimized announcements
 * - Therapeutic language for error messages
 */

import { FocusManagement } from './accessibility';

// Therapeutic validation messages for mental health contexts
const THERAPEUTIC_MESSAGES = {
  // General validation messages with supportive tone
  required: (field) => `Please share your ${field.toLowerCase()} when you're ready.`,
  email: 'Please enter a valid email address so we can stay connected.',
  password: 'Your password should be at least 8 characters to keep your information secure.',
  passwordMatch: 'Please make sure both passwords match for your security.',
  
  // Mental health specific messages
  mood: {
    required: 'Please select how you\'re feeling right now. There are no wrong answers.',
    intensity: 'Please rate the intensity of your mood from 1 to 10.',
  },
  
  therapy: {
    sessionNotes: 'Feel free to share your thoughts when you\'re comfortable.',
    goals: 'What would you like to work on today? Take your time.',
    feelings: 'Describe your feelings in your own words, at your own pace.',
  },
  
  assessment: {
    question: (questionNum) => `Please answer question ${questionNum} when you\'re ready.`,
    scale: 'Please select a rating that best describes your experience.',
    frequency: 'How often have you experienced this? Please select an option.',
  },
  
  journal: {
    entry: 'Write as much or as little as feels right for you today.',
    mood: 'How are you feeling as you write this entry?',
    gratitude: 'What are you grateful for today? Even small things count.',
  },
  
  crisis: {
    contact: 'Please provide emergency contact information for your safety.',
    plan: 'Having a safety plan helps us support you better.',
  },
};

// Validation rule types
export const VALIDATION_TYPES = {
  REQUIRED: 'required',
  EMAIL: 'email',
  PASSWORD: 'password',
  PASSWORD_CONFIRMATION: 'passwordConfirmation',
  PHONE: 'phone',
  MIN_LENGTH: 'minLength',
  MAX_LENGTH: 'maxLength',
  PATTERN: 'pattern',
  CUSTOM: 'custom',
  // Mental health specific
  MOOD_SCALE: 'moodScale',
  THERAPY_NOTES: 'therapyNotes',
  ASSESSMENT_ANSWER: 'assessmentAnswer',
  CRISIS_PLAN: 'crisisPlan',
};

// Mental health form contexts
export const FORM_CONTEXTS = {
  THERAPY: 'therapy',
  MOOD_TRACKER: 'moodTracker',
  ASSESSMENT: 'assessment',
  JOURNAL: 'journal',
  CRISIS_SUPPORT: 'crisisSupport',
  PROFILE: 'profile',
  AUTH: 'auth',
};

class FormValidator {
  constructor(context = FORM_CONTEXTS.PROFILE, options = {}) {
    this.context = context;
    this.options = {
      // Validation behavior
      validateOnChange: true,
      validateOnBlur: true,
      validateOnSubmit: true,
      
      // Accessibility options
      announceErrors: true,
      announceSuccess: false,
      liveRegion: 'polite', // 'polite' or 'assertive'
      
      // Mental health specific options
      useTherapeuticLanguage: true,
      gentleValidation: true, // Less aggressive error messaging
      supportiveMessaging: true,
      
      // Timing options
      debounceDelay: 300,
      errorDisplayDelay: 500,
      
      ...options,
    };
    
    this.errors = {};
    this.touched = {};
    this.isValidating = {};
    this.debounceTimers = {};
  }

  // Define validation rules
  static RULES = {
    [VALIDATION_TYPES.REQUIRED]: {
      validate: (value) => {
        if (typeof value === 'string') return value.trim().length > 0;
        if (Array.isArray(value)) return value.length > 0;
        return value !== null && value !== undefined;
      },
      message: (field, context) => {
        if (context === FORM_CONTEXTS.THERAPY) {
          return THERAPEUTIC_MESSAGES.therapy[field] || THERAPEUTIC_MESSAGES.required(field);
        }
        if (context === FORM_CONTEXTS.MOOD_TRACKER) {
          return THERAPEUTIC_MESSAGES.mood.required;
        }
        if (context === FORM_CONTEXTS.ASSESSMENT) {
          return THERAPEUTIC_MESSAGES.assessment.question();
        }
        return THERAPEUTIC_MESSAGES.required(field);
      },
    },

    [VALIDATION_TYPES.EMAIL]: {
      validate: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !value || emailRegex.test(value);
      },
      message: () => THERAPEUTIC_MESSAGES.email,
    },

    [VALIDATION_TYPES.PASSWORD]: {
      validate: (value) => {
        return !value || (value.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value));
      },
      message: () => 'Password must be at least 8 characters with uppercase, lowercase, and number.',
    },

    [VALIDATION_TYPES.PASSWORD_CONFIRMATION]: {
      validate: (value, allValues, params) => {
        return !value || value === allValues[params.passwordField];
      },
      message: () => THERAPEUTIC_MESSAGES.passwordMatch,
    },

    [VALIDATION_TYPES.PHONE]: {
      validate: (value) => {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return !value || phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''));
      },
      message: () => 'Please enter a valid phone number.',
    },

    [VALIDATION_TYPES.MIN_LENGTH]: {
      validate: (value, allValues, params) => {
        return !value || value.length >= params.length;
      },
      message: (field, context, params) => {
        if (context === FORM_CONTEXTS.THERAPY || context === FORM_CONTEXTS.JOURNAL) {
          return `Feel free to write more when you're ready (minimum ${params.length} characters).`;
        }
        return `Please enter at least ${params.length} characters.`;
      },
    },

    [VALIDATION_TYPES.MAX_LENGTH]: {
      validate: (value, allValues, params) => {
        return !value || value.length <= params.length;
      },
      message: (field, context, params) => {
        if (context === FORM_CONTEXTS.THERAPY || context === FORM_CONTEXTS.JOURNAL) {
          return `You can use up to ${params.length} characters. Feel free to be concise.`;
        }
        return `Please keep to ${params.length} characters or less.`;
      },
    },

    [VALIDATION_TYPES.MOOD_SCALE]: {
      validate: (value) => {
        const num = parseFloat(value);
        return !isNaN(num) && num >= 1 && num <= 10;
      },
      message: () => THERAPEUTIC_MESSAGES.mood.intensity,
    },

    [VALIDATION_TYPES.THERAPY_NOTES]: {
      validate: (value) => {
        return !value || (value.trim().length >= 10 && value.trim().length <= 2000);
      },
      message: () => THERAPEUTIC_MESSAGES.therapy.sessionNotes,
    },

    [VALIDATION_TYPES.ASSESSMENT_ANSWER]: {
      validate: (value) => {
        return value !== null && value !== undefined && value !== '';
      },
      message: (field, context, params) => 
        THERAPEUTIC_MESSAGES.assessment.question(params.questionNumber),
    },

    [VALIDATION_TYPES.CRISIS_PLAN]: {
      validate: (value) => {
        return value && value.trim().length >= 20;
      },
      message: () => THERAPEUTIC_MESSAGES.crisis.plan,
    },

    [VALIDATION_TYPES.CUSTOM]: {
      validate: (value, allValues, params) => {
        return params.validator(value, allValues);
      },
      message: (field, context, params) => params.message,
    },
  };

  // Validate a single field
  validateField(fieldName, value, allValues = {}, rules = []) {
    const errors = [];
    
    for (const rule of rules) {
      const ruleDefinition = FormValidator.RULES[rule.type];
      if (!ruleDefinition) {
        console.warn(`Unknown validation rule: ${rule.type}`);
        continue;
      }

      const isValid = ruleDefinition.validate(value, allValues, rule.params);
      if (!isValid) {
        const message = ruleDefinition.message(fieldName, this.context, rule.params);
        errors.push({
          type: rule.type,
          message,
          severity: rule.severity || 'error',
        });
        
        // Only show first error in gentle validation mode
        if (this.options.gentleValidation) {
          break;
        }
      }
    }

    return errors;
  }

  // Validate entire form
  validateForm(values, schema) {
    const formErrors = {};
    let isValid = true;

    Object.keys(schema).forEach(fieldName => {
      const fieldRules = schema[fieldName];
      const fieldValue = values[fieldName];
      const fieldErrors = this.validateField(fieldName, fieldValue, values, fieldRules);

      if (fieldErrors.length > 0) {
        formErrors[fieldName] = fieldErrors;
        isValid = false;
      }
    });

    this.errors = formErrors;
    return { isValid, errors: formErrors };
  }

  // Real-time field validation with debouncing
  validateFieldRealTime(fieldName, value, allValues, rules) {
    // Clear existing timer
    if (this.debounceTimers[fieldName]) {
      clearTimeout(this.debounceTimers[fieldName]);
    }

    // Set validating state
    this.isValidating[fieldName] = true;

    // Debounce validation
    this.debounceTimers[fieldName] = setTimeout(() => {
      const fieldErrors = this.validateField(fieldName, value, allValues, rules);
      
      // Update errors
      if (fieldErrors.length > 0) {
        this.errors[fieldName] = fieldErrors;
      } else {
        delete this.errors[fieldName];
      }

      // Clear validating state
      this.isValidating[fieldName] = false;

      // Announce errors to screen readers
      if (this.options.announceErrors && fieldErrors.length > 0) {
        const message = fieldErrors[0].message;
        FocusManagement.announceForScreenReader(
          `Validation error: ${message}`,
          this.options.liveRegion
        );
      }

    }, this.options.debounceDelay);
  }

  // Mark field as touched
  markFieldTouched(fieldName) {
    this.touched[fieldName] = true;
  }

  // Check if field should show errors
  shouldShowError(fieldName) {
    return this.touched[fieldName] && this.errors[fieldName];
  }

  // Get error message for field
  getFieldError(fieldName) {
    const fieldErrors = this.errors[fieldName];
    return fieldErrors && fieldErrors.length > 0 ? fieldErrors[0].message : null;
  }

  // Get all errors for field
  getFieldErrors(fieldName) {
    return this.errors[fieldName] || [];
  }

  // Check if form has any errors
  hasErrors() {
    return Object.keys(this.errors).length > 0;
  }

  // Get all form errors
  getAllErrors() {
    return this.errors;
  }

  // Clear all errors
  clearErrors() {
    this.errors = {};
    this.touched = {};
  }

  // Clear specific field error
  clearFieldError(fieldName) {
    delete this.errors[fieldName];
  }

  // Get accessibility props for input field
  getFieldAccessibilityProps(fieldName, label) {
    const error = this.getFieldError(fieldName);
    const hasError = !!error;

    return {
      accessibilityLabel: label,
      accessibilityInvalid: hasError,
      accessibilityErrorMessage: error,
      accessibilityRequired: this.isFieldRequired(fieldName),
      // Enhanced accessibility for mental health forms
      accessibilityHint: this.getContextualHint(fieldName),
    };
  }

  // Check if field is required
  isFieldRequired(fieldName) {
    // This would be determined by the validation rules
    return false; // Placeholder
  }

  // Get contextual accessibility hints
  getContextualHint(fieldName) {
    switch (this.context) {
      case FORM_CONTEXTS.THERAPY:
        return 'Take your time and share what feels comfortable to you.';
      case FORM_CONTEXTS.MOOD_TRACKER:
        return 'Choose the option that best represents how you\'re feeling.';
      case FORM_CONTEXTS.ASSESSMENT:
        return 'Answer honestly - there are no right or wrong responses.';
      case FORM_CONTEXTS.JOURNAL:
        return 'Write freely about your thoughts and experiences.';
      case FORM_CONTEXTS.CRISIS_SUPPORT:
        return 'This information helps us provide you with appropriate support.';
      default:
        return 'Enter the requested information.';
    }
  }

  // Announce validation summary
  announceValidationSummary() {
    if (!this.options.announceErrors) return;

    const errorCount = Object.keys(this.errors).length;
    if (errorCount === 0) {
      if (this.options.announceSuccess) {
        FocusManagement.announceForScreenReader(
          'Form validation passed. All fields are complete.',
          'polite'
        );
      }
    } else {
      const message = `Form has ${errorCount} error${errorCount > 1 ? 's' : ''}. Please review the highlighted fields.`;
      FocusManagement.announceForScreenReader(message, 'assertive');
    }
  }
}

// Predefined validation schemas for common mental health forms

export const VALIDATION_SCHEMAS = {
  // Therapy session form
  THERAPY_SESSION: {
    sessionGoals: [
      { type: VALIDATION_TYPES.REQUIRED },
      { type: VALIDATION_TYPES.MIN_LENGTH, params: { length: 10 } },
    ],
    currentMood: [
      { type: VALIDATION_TYPES.REQUIRED },
      { type: VALIDATION_TYPES.MOOD_SCALE },
    ],
    sessionNotes: [
      { type: VALIDATION_TYPES.THERAPY_NOTES },
    ],
  },

  // Mood tracking form
  MOOD_TRACKER: {
    mood: [
      { type: VALIDATION_TYPES.REQUIRED },
    ],
    intensity: [
      { type: VALIDATION_TYPES.REQUIRED },
      { type: VALIDATION_TYPES.MOOD_SCALE },
    ],
    activities: [], // Optional
    notes: [
      { type: VALIDATION_TYPES.MAX_LENGTH, params: { length: 500 } },
    ],
  },

  // Assessment form
  MENTAL_HEALTH_ASSESSMENT: {
    // Dynamic validation based on question types
  },

  // Journal entry form
  JOURNAL_ENTRY: {
    title: [
      { type: VALIDATION_TYPES.MAX_LENGTH, params: { length: 100 } },
    ],
    content: [
      { type: VALIDATION_TYPES.MIN_LENGTH, params: { length: 10 } },
      { type: VALIDATION_TYPES.MAX_LENGTH, params: { length: 5000 } },
    ],
    mood: [
      { type: VALIDATION_TYPES.MOOD_SCALE },
    ],
  },

  // Crisis support form
  CRISIS_SUPPORT: {
    emergencyContact: [
      { type: VALIDATION_TYPES.REQUIRED },
      { type: VALIDATION_TYPES.PHONE },
    ],
    safetyPlan: [
      { type: VALIDATION_TYPES.REQUIRED },
      { type: VALIDATION_TYPES.CRISIS_PLAN },
    ],
  },

  // Authentication forms
  SIGN_IN: {
    email: [
      { type: VALIDATION_TYPES.REQUIRED },
      { type: VALIDATION_TYPES.EMAIL },
    ],
    password: [
      { type: VALIDATION_TYPES.REQUIRED },
    ],
  },

  REGISTER: {
    email: [
      { type: VALIDATION_TYPES.REQUIRED },
      { type: VALIDATION_TYPES.EMAIL },
    ],
    password: [
      { type: VALIDATION_TYPES.REQUIRED },
      { type: VALIDATION_TYPES.PASSWORD },
    ],
    confirmPassword: [
      { type: VALIDATION_TYPES.REQUIRED },
      { type: VALIDATION_TYPES.PASSWORD_CONFIRMATION, params: { passwordField: 'password' } },
    ],
    agreeToTerms: [
      { type: VALIDATION_TYPES.REQUIRED },
    ],
  },
};

// Export utility functions
export const createValidator = (context, options) => new FormValidator(context, options);

export const validateField = (fieldName, value, rules, context = FORM_CONTEXTS.PROFILE) => {
  const validator = new FormValidator(context);
  return validator.validateField(fieldName, value, {}, rules);
};

export const validateForm = (values, schema, context = FORM_CONTEXTS.PROFILE) => {
  const validator = new FormValidator(context);
  return validator.validateForm(values, schema);
};

export default FormValidator;