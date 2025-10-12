export const VALIDATION_TYPES = {
  REQUIRED: 'REQUIRED',
  EMAIL: 'EMAIL',
  MIN_LENGTH: 'MIN_LENGTH',
};

export const FORM_CONTEXTS = {
  THERAPY: 'THERAPY',
  MOOD: 'MOOD',
  ASSESSMENT: 'ASSESSMENT',
};

export const VALIDATION_SCHEMAS = {
  default: [],
};

export const createValidator = (rules = []) => (value) => {
  for (const rule of rules) {
    if (rule.type === VALIDATION_TYPES.REQUIRED) {
      if (value === undefined || value === null || String(value).trim() === '') {
        return { valid: false, error: 'This field is required.' };
      }
    }
    if (rule.type === VALIDATION_TYPES.EMAIL) {
      const re = /[^@\s]+@[^@\s]+\.[^@\s]+/;
      if (value && !re.test(String(value))) {
        return { valid: false, error: 'Invalid email address.' };
      }
    }
    if (rule.type === VALIDATION_TYPES.MIN_LENGTH) {
      if (String(value).length < (rule.min || 0)) {
        return { valid: false, error: `Minimum length is ${rule.min}.` };
      }
    }
  }
  return { valid: true };
};

export const validateField = (value, rules = []) => createValidator(rules)(value);

export const validateForm = (formValues, schema = {}) => {
  const errors = {};
  let isValid = true;
  for (const key of Object.keys(schema)) {
    const res = validateField(formValues[key], schema[key]);
    if (!res.valid) {
      isValid = false;
      errors[key] = res.error;
    }
  }
  return { isValid, errors };
};
