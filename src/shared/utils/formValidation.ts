/**
 * Comprehensive Form Validation System
 * Enhanced with TypeScript, mental health validators, and async validation
 */

import { logger } from '@shared/utils/logger';

// ============ TYPES ============

export interface ValidationRule {
  type: string;
  value?: string | number | boolean | RegExp;
  message?: string | ((value: unknown) => string);
  validator?: (value: unknown, formData?: Record<string, unknown>) => boolean | Promise<boolean>;
}

export interface ValidationError {
  type: string;
  message: string;
}

export interface FieldValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, ValidationError[]>;
}

// ============ CONSTANTS ============

export const VALIDATION_TYPES = {
  REQUIRED: "REQUIRED",
  EMAIL: "EMAIL",
  MIN_LENGTH: "MIN_LENGTH",
  MAX_LENGTH: "MAX_LENGTH",
  MIN: "MIN",
  MAX: "MAX",
  PATTERN: "PATTERN",
  MOOD_SCALE: "MOOD_SCALE",
  PASSWORD: "PASSWORD",
  PASSWORD_STRENGTH: "PASSWORD_STRENGTH",
  MATCH: "MATCH",
  PHONE: "PHONE",
  DATE: "DATE",
  FUTURE_DATE: "FUTURE_DATE",
  PAST_DATE: "PAST_DATE",
  MIN_AGE: "MIN_AGE",
  URL: "URL",
  NUMBER: "NUMBER",
  INTEGER: "INTEGER",
  CUSTOM: "CUSTOM",
  ASYNC: "ASYNC",
  CRISIS_CONTENT: "CRISIS_CONTENT",
} as const;

export const FORM_CONTEXTS = {
  THERAPY: "THERAPY",
  MOOD: "MOOD",
  ASSESSMENT: "ASSESSMENT",
  PROFILE: "PROFILE",
  AUTH: "AUTH",
  JOURNAL: "JOURNAL",
  FEEDBACK: "FEEDBACK",
  DEFAULT: "DEFAULT",
} as const;

// ============ REGEX PATTERNS ============

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^(\+1)?[-.\s]?\(?[2-9]\d{2}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

const PASSWORD_PATTERNS = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  special: /[!@#$%^&*(),.?":{}|<>]/,
};

// ============ VALIDATION SCHEMAS ============

export const VALIDATION_SCHEMAS = {
  REGISTER: {
    name: [
      { type: VALIDATION_TYPES.REQUIRED },
      { type: VALIDATION_TYPES.MIN_LENGTH, value: 2 },
      { type: VALIDATION_TYPES.MAX_LENGTH, value: 50 },
    ],
    email: [
      { type: VALIDATION_TYPES.REQUIRED },
      { type: VALIDATION_TYPES.EMAIL },
    ],
    password: [
      { type: VALIDATION_TYPES.REQUIRED },
      { type: VALIDATION_TYPES.PASSWORD_STRENGTH },
    ],
    confirmPassword: [
      { type: VALIDATION_TYPES.REQUIRED },
      { type: VALIDATION_TYPES.MATCH, value: 'password', message: 'Passwords do not match' },
    ],
    dateOfBirth: [
      { type: VALIDATION_TYPES.PAST_DATE },
      { type: VALIDATION_TYPES.MIN_AGE, value: 13 },
    ],
    agreeToTerms: [{ type: VALIDATION_TYPES.REQUIRED }],
    agreeToPrivacy: [{ type: VALIDATION_TYPES.REQUIRED }],
  },
  LOGIN: {
    email: [
      { type: VALIDATION_TYPES.REQUIRED },
      { type: VALIDATION_TYPES.EMAIL },
    ],
    password: [
      { type: VALIDATION_TYPES.REQUIRED },
      { type: VALIDATION_TYPES.MIN_LENGTH, value: 8 },
    ],
  },
  PROFILE: {
    name: [
      { type: VALIDATION_TYPES.REQUIRED },
      { type: VALIDATION_TYPES.MIN_LENGTH, value: 2 },
      { type: VALIDATION_TYPES.MAX_LENGTH, value: 50 },
    ],
    email: [
      { type: VALIDATION_TYPES.REQUIRED },
      { type: VALIDATION_TYPES.EMAIL },
    ],
    phoneNumber: [
      { type: VALIDATION_TYPES.PHONE },
    ],
    dateOfBirth: [
      { type: VALIDATION_TYPES.PAST_DATE },
      { type: VALIDATION_TYPES.MIN_AGE, value: 13 },
    ],
    bio: [
      { type: VALIDATION_TYPES.MAX_LENGTH, value: 500 },
    ],
  },
  MOOD_ENTRY: {
    mood: [
      { type: VALIDATION_TYPES.REQUIRED, message: 'Please select a mood' },
    ],
    intensity: [
      { type: VALIDATION_TYPES.REQUIRED },
      { type: VALIDATION_TYPES.MOOD_SCALE },
    ],
    notes: [
      { type: VALIDATION_TYPES.MAX_LENGTH, value: 500 },
      { type: VALIDATION_TYPES.CRISIS_CONTENT },
    ],
    activities: [
      { type: VALIDATION_TYPES.MAX_LENGTH, value: 10, message: 'Select up to 10 activities' },
    ],
  },
  JOURNAL_ENTRY: {
    title: [
      { type: VALIDATION_TYPES.REQUIRED },
      { type: VALIDATION_TYPES.MIN_LENGTH, value: 3 },
      { type: VALIDATION_TYPES.MAX_LENGTH, value: 100 },
    ],
    content: [
      { type: VALIDATION_TYPES.REQUIRED },
      { type: VALIDATION_TYPES.MIN_LENGTH, value: 10 },
      { type: VALIDATION_TYPES.MAX_LENGTH, value: 5000 },
      { type: VALIDATION_TYPES.CRISIS_CONTENT },
    ],
    tags: [
      { type: VALIDATION_TYPES.MAX_LENGTH, value: 10, message: 'Add up to 10 tags' },
    ],
  },
  ASSESSMENT: {
    responses: [
      { type: VALIDATION_TYPES.REQUIRED },
      { type: VALIDATION_TYPES.MIN_LENGTH, value: 10, message: 'Please answer all questions' },
    ],
  },
  FEEDBACK: {
    type: [
      { type: VALIDATION_TYPES.REQUIRED },
    ],
    message: [
      { type: VALIDATION_TYPES.REQUIRED },
      { type: VALIDATION_TYPES.MIN_LENGTH, value: 10 },
      { type: VALIDATION_TYPES.MAX_LENGTH, value: 1000 },
    ],
    email: [
      { type: VALIDATION_TYPES.EMAIL },
    ],
  },
  default: {},
};
// ============ VALIDATION ENGINE ============

/**
 * Enhanced validation rules runner with comprehensive validators
 */
const runRules = async (
  fieldName: string,
  value: any,
  rules: ValidationRule[] = [],
  context: string = FORM_CONTEXTS.DEFAULT,
  formData: any = {}
): Promise<ValidationError[]> => {
  const errors: ValidationError[] = [];

  for (const rule of rules) {
    let errorMessage: string | null = null;

    switch (rule.type) {
      case VALIDATION_TYPES.REQUIRED:
        if (value === undefined || value === null ||
            (typeof value === 'string' && value.trim() === '') ||
            (Array.isArray(value) && value.length === 0)) {
          errorMessage = rule.message || 'This field is required';
        }
        break;

      case VALIDATION_TYPES.EMAIL:
        if (value && !EMAIL_REGEX.test(String(value).trim())) {
          errorMessage = rule.message || 'Please enter a valid email address';
        }
        break;

      case VALIDATION_TYPES.MIN_LENGTH:
        const minLen = rule.value || 0;
        if (value && String(value).length < minLen) {
          errorMessage = rule.message || `Must be at least ${minLen} characters`;
        }
        break;

      case VALIDATION_TYPES.MAX_LENGTH:
        const maxLen = rule.value || 999999;
        if (value && String(value).length > maxLen) {
          errorMessage = rule.message || `Must be no more than ${maxLen} characters`;
        }
        break;

      case VALIDATION_TYPES.MIN:
        const minVal = rule.value || 0;
        if (value !== null && value !== undefined && Number(value) < minVal) {
          errorMessage = rule.message || `Must be at least ${minVal}`;
        }
        break;

      case VALIDATION_TYPES.MAX:
        const maxVal = rule.value || 999999;
        if (value !== null && value !== undefined && Number(value) > maxVal) {
          errorMessage = rule.message || `Must be no more than ${maxVal}`;
        }
        break;

      case VALIDATION_TYPES.PATTERN:
        if (value && rule.value && !rule.value.test(String(value))) {
          errorMessage = rule.message || 'Invalid format';
        }
        break;

      case VALIDATION_TYPES.MOOD_SCALE:
        const num = Number(value);
        if (isNaN(num) || num < 1 || num > 10) {
          errorMessage = rule.message || 'Mood intensity must be between 1 and 10';
        }
        break;

      case VALIDATION_TYPES.PASSWORD:
        const pwd = String(value || '');
        if (pwd.length < 8) {
          errorMessage = rule.message || 'Password must be at least 8 characters';
        }
        break;

      case VALIDATION_TYPES.PASSWORD_STRENGTH:
        const pass = String(value || '');
        const errors: string[] = [];
        if (pass.length < 8) errors.push('8+ characters');
        if (!PASSWORD_PATTERNS.uppercase.test(pass)) errors.push('uppercase letter');
        if (!PASSWORD_PATTERNS.lowercase.test(pass)) errors.push('lowercase letter');
        if (!PASSWORD_PATTERNS.number.test(pass)) errors.push('number');
        if (!PASSWORD_PATTERNS.special.test(pass)) errors.push('special character');

        if (errors.length > 0) {
          errorMessage = rule.message || `Password must contain: ${errors.join(', ')}`;
        }
        break;

      case VALIDATION_TYPES.MATCH:
        const matchField = rule.value;
        if (formData && formData[matchField] !== value) {
          errorMessage = rule.message || `Does not match ${matchField}`;
        }
        break;

      case VALIDATION_TYPES.PHONE:
        if (value && !PHONE_REGEX.test(String(value))) {
          errorMessage = rule.message || 'Please enter a valid phone number';
        }
        break;

      case VALIDATION_TYPES.DATE:
        if (value) {
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            errorMessage = rule.message || 'Please enter a valid date';
          }
        }
        break;

      case VALIDATION_TYPES.FUTURE_DATE:
        if (value) {
          const date = new Date(value);
          if (date <= new Date()) {
            errorMessage = rule.message || 'Please select a future date';
          }
        }
        break;

      case VALIDATION_TYPES.PAST_DATE:
        if (value) {
          const date = new Date(value);
          if (date >= new Date()) {
            errorMessage = rule.message || 'Please select a past date';
          }
        }
        break;

      case VALIDATION_TYPES.MIN_AGE:
        if (value && rule.value) {
          const birthDate = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          const actualAge = monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
            ? age - 1 : age;

          if (actualAge < rule.value) {
            errorMessage = rule.message || `You must be at least ${rule.value} years old`;
          }
        }
        break;

      case VALIDATION_TYPES.URL:
        if (value && !URL_REGEX.test(String(value))) {
          errorMessage = rule.message || 'Please enter a valid URL';
        }
        break;

      case VALIDATION_TYPES.NUMBER:
        if (value !== null && value !== undefined && value !== '') {
          if (isNaN(value) || !isFinite(value)) {
            errorMessage = rule.message || 'Please enter a valid number';
          }
        }
        break;

      case VALIDATION_TYPES.INTEGER:
        if (value !== null && value !== undefined && value !== '') {
          if (!Number.isInteger(Number(value))) {
            errorMessage = rule.message || 'Please enter a whole number';
          }
        }
        break;

      case VALIDATION_TYPES.CRISIS_CONTENT:
        if (value && detectCrisisContent(String(value)).hasCrisisContent) {
          const severity = detectCrisisContent(String(value)).severity;
          if (severity === 'high') {
            errorMessage = null; // Don't block, but trigger crisis support
            logger.warn('Crisis content detected in form', { fieldName, severity });
          }
        }
        break;

      case VALIDATION_TYPES.CUSTOM:
        if (rule.validator) {
          try {
            const isValid = await rule.validator(value, formData);
            if (!isValid) {
              errorMessage = typeof rule.message === 'function'
                ? rule.message(value)
                : rule.message || 'Validation failed';
            }
          } catch (error) {
            logger.error('Custom validation error:', error);
            errorMessage = 'Validation error occurred';
          }
        }
        break;

      case VALIDATION_TYPES.ASYNC:
        // Async validation would be handled here
        break;
    }

    if (errorMessage) {
      // Apply therapeutic language for therapy context
      if (context === FORM_CONTEXTS.THERAPY) {
        errorMessage = `${errorMessage} — when you're ready`;
      }

      errors.push({
        type: rule.type,
        message: errorMessage,
      });

      // Stop on first error for required fields
      if (rule.type === VALIDATION_TYPES.REQUIRED) {
        break;
      }
    }
  }

  return errors;
};

/**
 * Detect crisis content in text
 */
function detectCrisisContent(text: string): {
  hasCrisisContent: boolean;
  severity: 'low' | 'medium' | 'high';
} {
  if (!text) {
    return { hasCrisisContent: false, severity: 'low' };
  }

  const highSeverityKeywords = [
    'suicide', 'kill myself', 'end it all', 'hurt myself',
    'self harm', 'cutting', 'overdose', 'not worth living'
  ];

  const mediumSeverityKeywords = [
    'hopeless', 'worthless', 'want to die', 'can\'t go on',
    'no point', 'give up'
  ];

  const lowerText = text.toLowerCase();

  if (highSeverityKeywords.some(keyword => lowerText.includes(keyword))) {
    return { hasCrisisContent: true, severity: 'high' };
  }

  if (mediumSeverityKeywords.some(keyword => lowerText.includes(keyword))) {
    return { hasCrisisContent: true, severity: 'medium' };
  }

  return { hasCrisisContent: false, severity: 'low' };
}

// ============ PUBLIC API ============

/**
 * Create a validator with a specific context
 */
export const createValidator = (
  context = FORM_CONTEXTS.DEFAULT,
  options: any = {}
) => ({
  validateField: async (
    fieldName: string,
    value: any,
    formData: any = {},
    rules: ValidationRule[] = []
  ) => runRules(fieldName, value, rules, context, formData),

  validateForm: async (
    formValues: Record<string, any>,
    schema: Record<string, ValidationRule[]> = {}
  ): Promise<FormValidationResult> => {
    const errors: Record<string, ValidationError[]> = {};
    let isValid = true;

    for (const [key, rules] of Object.entries(schema)) {
      const fieldErrors = await runRules(key, formValues[key], rules, context, formValues);
      if (fieldErrors.length > 0) {
        isValid = false;
        errors[key] = fieldErrors;
      }
    }

    return { isValid, errors };
  },
});

/**
 * Validate a single field
 */
export const validateField = async (
  fieldName: string,
  value: any,
  rules: ValidationRule[] = [],
  formData: any = {}
): Promise<FieldValidationResult> => {
  const errors = await runRules(fieldName, value, rules, FORM_CONTEXTS.DEFAULT, formData);
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate an entire form
 */
export const validateForm = async (
  formValues: Record<string, any>,
  schema: Record<string, ValidationRule[]> = {},
  context = FORM_CONTEXTS.DEFAULT
): Promise<FormValidationResult> => {
  const errors: Record<string, ValidationError[]> = {};
  let isValid = true;

  for (const [key, rules] of Object.entries(schema)) {
    const fieldErrors = await runRules(key, formValues[key], rules, context, formValues);
    if (fieldErrors.length > 0) {
      isValid = false;
      errors[key] = fieldErrors;
    }
  }

  return { isValid, errors };
};

/**
 * Get first error message for a field
 */
export const getFieldError = (
  errors: Record<string, ValidationError[]>,
  fieldName: string
): string | null => {
  const fieldErrors = errors[fieldName];
  return fieldErrors && fieldErrors.length > 0 ? fieldErrors[0].message : null;
};

/**
 * Check if field has any errors
 */
export const hasFieldError = (
  errors: Record<string, ValidationError[]>,
  fieldName: string
): boolean => {
  return errors[fieldName] && errors[fieldName].length > 0;
};

/**
 * Clear field errors
 */
export const clearFieldErrors = (
  errors: Record<string, ValidationError[]>,
  fieldName: string
): Record<string, ValidationError[]> => {
  const newErrors = { ...errors };
  delete newErrors[fieldName];
  return newErrors;
};

/**
 * Custom hook for form validation (to be used in components)
 */
export const useFormValidation = (
  initialValues: Record<string, any> = {},
  validationSchema: Record<string, ValidationRule[]> = {},
  context = FORM_CONTEXTS.DEFAULT
) => {
  // This would be implemented as a React hook
  // Returns values, errors, handleChange, handleSubmit, etc.
  // Placeholder for now as it requires React imports
};

// Export everything for convenience
export default {
  VALIDATION_TYPES,
  FORM_CONTEXTS,
  VALIDATION_SCHEMAS,
  createValidator,
  validateField,
  validateForm,
  getFieldError,
  hasFieldError,
  clearFieldErrors,
  detectCrisisContent,
};
