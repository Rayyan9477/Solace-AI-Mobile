/**
 * Input Sanitization Utilities for Solace AI Mental Health App
 * Provides comprehensive input validation and sanitization for user data
 * Follows OWASP guidelines for preventing XSS, injection attacks, and data integrity issues
 */

import CryptoJS from 'crypto-js';

// Common dangerous patterns that should be filtered
const DANGEROUS_PATTERNS = {
  // Script injection patterns
  SCRIPT_TAGS: /<script[^>]*>.*?<\/script>/gi,
  JAVASCRIPT_PROTOCOL: /javascript:/gi,
  DATA_PROTOCOL: /data:/gi,
  VBSCRIPT_PROTOCOL: /vbscript:/gi,
  
  // Event handlers
  EVENT_HANDLERS: /on\w+\s*=/gi,
  
  // HTML tags that could be dangerous
  DANGEROUS_TAGS: /<(iframe|object|embed|form|input|meta|link|style)[^>]*>/gi,
  
  // SQL injection patterns
  SQL_KEYWORDS: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
  
  // Common XSS patterns
  XSS_PATTERNS: /(<|&lt;)[\/]*script[^>]*>|javascript:|vbscript:|on\w+\s*=|<[^>]*style[^>]*=[^>]*expression[^>]*>|<[^>]*style[^>]*=[^>]*behavior[^>]*>/gi,
};

// Allowlisted HTML tags for rich text (mental health notes, etc.)
const ALLOWED_HTML_TAGS = ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'blockquote'];

// Common passwords to reject
const COMMON_PASSWORDS = [
  'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
  'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'iloveyou',
  'princess', 'dragon', 'sunshine', 'master', 'football', 'basketball'
];

/**
 * Sanitize general text input
 */
export const sanitizeText = (input, options = {}) => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  let sanitized = input;

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Normalize whitespace
  sanitized = sanitized.replace(/\s+/g, ' ').trim();

  // Remove dangerous patterns
  Object.values(DANGEROUS_PATTERNS).forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });

  // Length limiting
  const maxLength = options.maxLength || 10000;
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  // Remove leading/trailing dangerous characters
  sanitized = sanitized.replace(/^[<>&"']+|[<>&"']+$/g, '');

  return sanitized;
};

/**
 * Sanitize email addresses
 */
export const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return '';
  }

  // Basic email format validation and sanitization
  const sanitized = email.toLowerCase().trim();
  
  // Remove dangerous characters
  const cleaned = sanitized.replace(/[^a-z0-9@._-]/g, '');
  
  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  return emailRegex.test(cleaned) ? cleaned : '';
};

/**
 * Sanitize mental health notes (allows some formatting)
 */
export const sanitizeMentalHealthNotes = (notes, options = {}) => {
  if (!notes || typeof notes !== 'string') {
    return '';
  }

  let sanitized = notes;

  // Remove script tags and dangerous content
  sanitized = sanitized.replace(DANGEROUS_PATTERNS.SCRIPT_TAGS, '');
  sanitized = sanitized.replace(DANGEROUS_PATTERNS.XSS_PATTERNS, '');
  sanitized = sanitized.replace(DANGEROUS_PATTERNS.EVENT_HANDLERS, '');

  // Allow only specific HTML tags for formatting
  if (options.allowHtml) {
    const allowedTagsRegex = new RegExp(
      `<(?!\/?(?:${ALLOWED_HTML_TAGS.join('|')})\s*\/?>)[^>]+>`,
      'gi'
    );
    sanitized = sanitized.replace(allowedTagsRegex, '');
  } else {
    // Strip all HTML
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  }

  // Normalize whitespace but preserve line breaks
  sanitized = sanitized.replace(/[ \t]+/g, ' ');
  sanitized = sanitized.replace(/\n\s*\n/g, '\n\n');

  // Length limiting for mental health notes
  const maxLength = options.maxLength || 5000;
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized.trim();
};

/**
 * Validate and sanitize password
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      sanitized: '',
      errors: ['Password is required']
    };
  }

  const errors = [];
  
  // Length validation
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }
  
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }

  // Complexity validation
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUppercase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!hasLowercase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }
  
  if (!hasSpecialChars) {
    errors.push('Password must contain at least one special character');
  }

  // Check against common passwords
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
    errors.push('Password is too common, please choose a stronger password');
  }

  // Check for repeated characters
  if (/(.)\1{3,}/.test(password)) {
    errors.push('Password should not contain repeated characters');
  }

  return {
    isValid: errors.length === 0,
    sanitized: password, // Don't modify passwords
    errors
  };
};

/**
 * Sanitize mood tracking data
 */
export const sanitizeMoodData = (moodData) => {
  if (!moodData || typeof moodData !== 'object') {
    return {};
  }

  const sanitized = {};

  // Sanitize mood level (should be number between 1-10)
  if (typeof moodData.level === 'number' && moodData.level >= 1 && moodData.level <= 10) {
    sanitized.level = Math.floor(moodData.level);
  }

  // Sanitize mood type
  const allowedMoods = ['happy', 'sad', 'anxious', 'calm', 'angry', 'excited', 'tired', 'stressed', 'content', 'neutral'];
  if (typeof moodData.mood === 'string' && allowedMoods.includes(moodData.mood.toLowerCase())) {
    sanitized.mood = moodData.mood.toLowerCase();
  }

  // Sanitize notes
  if (moodData.notes) {
    sanitized.notes = sanitizeMentalHealthNotes(moodData.notes, { maxLength: 1000 });
  }

  // Sanitize tags/activities
  if (Array.isArray(moodData.activities)) {
    sanitized.activities = moodData.activities
      .map(activity => sanitizeText(activity, { maxLength: 50 }))
      .filter(activity => activity.length > 0)
      .slice(0, 10); // Limit to 10 activities
  }

  // Sanitize triggers
  if (Array.isArray(moodData.triggers)) {
    sanitized.triggers = moodData.triggers
      .map(trigger => sanitizeText(trigger, { maxLength: 100 }))
      .filter(trigger => trigger.length > 0)
      .slice(0, 5); // Limit to 5 triggers
  }

  return sanitized;
};

/**
 * Sanitize chat messages
 */
export const sanitizeChatMessage = (message) => {
  if (!message || typeof message !== 'string') {
    return '';
  }

  // Remove dangerous patterns
  let sanitized = sanitizeText(message, { maxLength: 2000 });

  // Additional chat-specific sanitization
  // Remove excessive punctuation
  sanitized = sanitized.replace(/[!?]{4,}/g, '!!!');
  sanitized = sanitized.replace(/\.{4,}/g, '...');

  // Remove excessive capital letters (but allow some for emphasis)
  sanitized = sanitized.replace(/[A-Z]{10,}/g, match => 
    match.charAt(0) + match.slice(1).toLowerCase()
  );

  return sanitized.trim();
};

/**
 * Sanitize search queries
 */
export const sanitizeSearchQuery = (query) => {
  if (!query || typeof query !== 'string') {
    return '';
  }

  let sanitized = query.trim();

  // Remove SQL injection patterns
  sanitized = sanitized.replace(DANGEROUS_PATTERNS.SQL_KEYWORDS, '');

  // Remove special characters that could be used for injection
  sanitized = sanitized.replace(/[<>&"'%;()+=]/g, '');

  // Limit length
  if (sanitized.length > 100) {
    sanitized = sanitized.substring(0, 100);
  }

  return sanitized;
};

/**
 * Sanitize file uploads (names and types)
 */
export const sanitizeFileUpload = (fileName, fileType) => {
  const sanitizedName = fileName
    ? fileName.replace(/[^a-zA-Z0-9._-]/g, '').substring(0, 255)
    : '';

  // Allowed file types for mental health app
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'audio/mpeg', 'audio/wav', 'audio/ogg',
    'text/plain', 'application/pdf'
  ];

  const isAllowedType = allowedTypes.includes(fileType);

  return {
    sanitizedName,
    isAllowedType,
    originalType: fileType
  };
};

/**
 * Sanitize URL inputs
 */
export const sanitizeUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return '';
  }

  try {
    const urlObj = new URL(url);
    
    // Only allow https and http protocols
    if (!['https:', 'http:'].includes(urlObj.protocol)) {
      return '';
    }

    // Remove dangerous parameters
    urlObj.searchParams.delete('javascript');
    urlObj.searchParams.delete('vbscript');

    return urlObj.toString();
  } catch (error) {
    return '';
  }
};

/**
 * Create hash for data integrity verification
 */
export const createDataHash = (data) => {
  try {
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    return CryptoJS.SHA256(dataString).toString(CryptoJS.enc.Hex);
  } catch (error) {
    console.error('Hash creation failed:', error);
    return null;
  }
};

/**
 * Verify data integrity using hash
 */
export const verifyDataIntegrity = (data, hash) => {
  try {
    const computedHash = createDataHash(data);
    return computedHash === hash;
  } catch (error) {
    console.error('Integrity verification failed:', error);
    return false;
  }
};

/**
 * Rate limiting helper for input validation
 */
export const createRateLimiter = (maxAttempts = 5, windowMs = 60000) => {
  const attempts = new Map();

  return (identifier) => {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old attempts
    for (const [key, timestamps] of attempts.entries()) {
      attempts.set(key, timestamps.filter(time => time > windowStart));
      if (attempts.get(key).length === 0) {
        attempts.delete(key);
      }
    }

    // Check current attempts
    const userAttempts = attempts.get(identifier) || [];
    
    if (userAttempts.length >= maxAttempts) {
      return false; // Rate limited
    }

    // Record this attempt
    userAttempts.push(now);
    attempts.set(identifier, userAttempts);
    
    return true; // Allowed
  };
};

// Export rate limiters for common use cases
export const loginRateLimiter = createRateLimiter(5, 300000); // 5 attempts per 5 minutes
export const messageRateLimiter = createRateLimiter(60, 60000); // 60 messages per minute
export const searchRateLimiter = createRateLimiter(100, 60000); // 100 searches per minute

/**
 * Comprehensive input sanitization function
 */
export const sanitizeInput = (input, type = 'text', options = {}) => {
  switch (type) {
    case 'email':
      return sanitizeEmail(input);
    case 'password':
      return validatePassword(input);
    case 'mental_health_notes':
      return sanitizeMentalHealthNotes(input, options);
    case 'mood_data':
      return sanitizeMoodData(input);
    case 'chat_message':
      return sanitizeChatMessage(input);
    case 'search_query':
      return sanitizeSearchQuery(input);
    case 'url':
      return sanitizeUrl(input);
    case 'text':
    default:
      return sanitizeText(input, options);
  }
};

export default {
  sanitizeInput,
  sanitizeText,
  sanitizeEmail,
  sanitizeMentalHealthNotes,
  validatePassword,
  sanitizeMoodData,
  sanitizeChatMessage,
  sanitizeSearchQuery,
  sanitizeFileUpload,
  sanitizeUrl,
  createDataHash,
  verifyDataIntegrity,
  loginRateLimiter,
  messageRateLimiter,
  searchRateLimiter,
};