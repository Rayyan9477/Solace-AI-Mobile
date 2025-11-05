export const VALIDATION_TYPES = {
  REQUIRED: "REQUIRED",
  EMAIL: "EMAIL",
  MIN_LENGTH: "MIN_LENGTH",
  MOOD_SCALE: "MOOD_SCALE",
  PASSWORD: "PASSWORD",
};

export const FORM_CONTEXTS = {
  THERAPY: "THERAPY",
  MOOD: "MOOD",
  ASSESSMENT: "ASSESSMENT",
  PROFILE: "PROFILE",
  AUTH: "AUTH",
};

export const VALIDATION_SCHEMAS = {
  REGISTER: {
    email: [
      { type: VALIDATION_TYPES.EMAIL },
      { type: VALIDATION_TYPES.REQUIRED },
    ],
    password: [
      { type: VALIDATION_TYPES.PASSWORD },
      { type: VALIDATION_TYPES.REQUIRED },
    ],
    confirmPassword: [{ type: VALIDATION_TYPES.REQUIRED }],
    agreeToTerms: [{ type: VALIDATION_TYPES.REQUIRED }],
  },
  default: {},
};
const runRules = (
  fieldName,
  value,
  rules = [],
  context = FORM_CONTEXTS.DEFAULT,
) => {
  const errors = [];
  for (const rule of rules) {
    if (rule.type === VALIDATION_TYPES.REQUIRED) {
      if (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
      ) {
        errors.push({
          type: VALIDATION_TYPES.REQUIRED,
          message: "This field is required.",
        });
      }
    }
    if (rule.type === VALIDATION_TYPES.EMAIL) {
      const re = /[^@\s]+@[^@\s]+\.[^@\s]+/;
      if (value && !re.test(String(value))) {
        errors.push({
          type: VALIDATION_TYPES.EMAIL,
          message: "Invalid email address.",
        });
      }
    }
    if (rule.type === VALIDATION_TYPES.MIN_LENGTH) {
      if (String(value).length < (rule.min || 0)) {
        errors.push({
          type: VALIDATION_TYPES.MIN_LENGTH,
          message: `Minimum length is ${rule.min}.`,
        });
      }
    }
    if (rule.type === VALIDATION_TYPES.MOOD_SCALE) {
      const num = Number(value);
      if (Number.isNaN(num) || num < 1 || num > 10) {
        errors.push({
          type: VALIDATION_TYPES.MOOD_SCALE,
          message: "Mood intensity must be between 1 and 10.",
        });
      }
    }
    if (rule.type === VALIDATION_TYPES.PASSWORD) {
      const v = String(value || "");
      const ok =
        v.length >= 8 && /[A-Z]/.test(v) && /[a-z]/.test(v) && /\d/.test(v);
      if (!ok) {
        errors.push({
          type: VALIDATION_TYPES.PASSWORD,
          message: "Password must be 8+ chars with upper, lower, and number.",
        });
      }
    }
  }
  // Therapeutic language for therapy context
  if (context === FORM_CONTEXTS.THERAPY && errors.length > 0) {
    errors[0].message = `${errors[0].message} — when you're ready.`;
  }
  return errors;
};

export const createValidator = (
  context = FORM_CONTEXTS.DEFAULT,
  options = {},
) => ({
  validateField: (fieldName, value, _form, rules = []) =>
    runRules(fieldName, value, rules, context),
});

export const validateField = (fieldName, value, rules = []) =>
  runRules(fieldName, value, rules);

export const validateForm = (
  formValues,
  schema = {},
  context = FORM_CONTEXTS.DEFAULT,
) => {
  const errors = {};
  let isValid = true;
  for (const key of Object.keys(schema)) {
    const fieldErrors = runRules(key, formValues[key], schema[key], context);
    if (fieldErrors.length > 0) {
      isValid = false;
      errors[key] = fieldErrors;
    }
  }
  return { isValid, errors };
};
