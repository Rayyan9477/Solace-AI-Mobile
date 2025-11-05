/**
 * Input Sanitization Utilities
 * Provides comprehensive input sanitization for security and data integrity
 */

/**
 * Remove HTML tags and script content from input
 */
export const sanitizeHtml = (input: string): string => {
  if (typeof input !== "string") return "";

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();
};

/**
 * Remove SQL injection patterns
 */
export const sanitizeSql = (input: string): string => {
  if (typeof input !== "string") return "";

  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
    /(--|\bOR\b\s+\d+\s*=\s*\d+|\bAND\b\s+\d+\s*=\s*\d+)/gi,
    /(['";])/g,
  ];

  let sanitized = input;
  sqlPatterns.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, "");
  });

  return sanitized.trim();
};

/**
 * Sanitize email address
 */
export const sanitizeEmail = (email: string): string => {
  if (typeof email !== "string") return "";

  return email
    .toLowerCase()
    .trim()
    .replace(/[^\w.@+-]/g, "")
    .substring(0, 254);
};

/**
 * Sanitize user name (alphanumeric, spaces, hyphens, apostrophes)
 */
export const sanitizeName = (name: string): string => {
  if (typeof name !== "string") return "";

  return name
    .trim()
    .replace(/[^a-zA-Z\s'-]/g, "")
    .replace(/\s+/g, " ")
    .substring(0, 100);
};

/**
 * Sanitize free-form text (chat, journal, notes)
 * Allows most characters but removes dangerous patterns
 * Enhanced to prevent XSS, steganography, and homograph attacks
 */
export const sanitizeText = (
  text: string,
  maxLength: number = 5000,
): string => {
  if (typeof text !== "string") return "";

  let sanitized = text;

  // 1. Remove control characters (except newline, tab, carriage return)
  sanitized = sanitized.replace(
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g,
    "",
  );

  // 2. Remove zero-width characters (used for steganography)
  sanitized = sanitized.replace(/[\u200B-\u200D\u2060\uFEFF]/g, "");

  // 3. Unicode normalization to prevent homograph attacks
  sanitized = sanitized.normalize("NFKC");

  // 4. Remove ALL HTML tags (not just script tags)
  sanitized = sanitized.replace(/<[^>]+>/g, "");

  // 5. Remove dangerous protocols
  sanitized = sanitized
    .replace(/javascript:/gi, "")
    .replace(/data:text\/html/gi, "")
    .replace(/vbscript:/gi, "")
    .replace(/file:/gi, "")
    .replace(/about:/gi, "");

  // 6. Remove inline event handlers
  sanitized = sanitized.replace(/on\w+\s*=/gi, "");

  // 7. Trim and enforce length
  return sanitized.trim().substring(0, maxLength);
};

/**
 * Sanitize numeric input
 */
export const sanitizeNumber = (
  input: string | number,
  min?: number,
  max?: number,
): number | null => {
  const num = typeof input === "number" ? input : parseFloat(input);

  if (isNaN(num) || !isFinite(num)) return null;

  let sanitized = num;
  if (min !== undefined && sanitized < min) sanitized = min;
  if (max !== undefined && sanitized > max) sanitized = max;

  return sanitized;
};

/**
 * Sanitize mood intensity (1-10)
 */
export const sanitizeMoodIntensity = (intensity: string | number): number => {
  const sanitized = sanitizeNumber(intensity, 1, 10);
  return sanitized ?? 5;
};

/**
 * Sanitize URL/link input
 */
export const sanitizeUrl = (url: string): string => {
  if (typeof url !== "string") return "";

  try {
    const urlObj = new URL(url.trim());

    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return "";
    }

    return urlObj.toString().substring(0, 2048);
  } catch {
    return "";
  }
};

/**
 * Sanitize phone number
 */
export const sanitizePhone = (phone: string): string => {
  if (typeof phone !== "string") return "";

  return phone
    .replace(/[^\d+()-\s]/g, "")
    .trim()
    .substring(0, 20);
};

/**
 * Sanitize search query
 */
export const sanitizeSearchQuery = (query: string): string => {
  if (typeof query !== "string") return "";

  return query
    .trim()
    .replace(/[<>'"]/g, "")
    .substring(0, 200);
};

/**
 * Sanitize JSON input
 */
export const sanitizeJson = (input: string): any => {
  if (typeof input !== "string") return null;

  try {
    const parsed = JSON.parse(input);

    if (typeof parsed === "object" && parsed !== null) {
      return sanitizeObject(parsed);
    }

    return parsed;
  } catch {
    return null;
  }
};

/**
 * Recursively sanitize object properties
 */
export const sanitizeObject = (
  obj: any,
  maxDepth: number = 10,
  currentDepth: number = 0,
): any => {
  if (currentDepth >= maxDepth) return null;

  if (typeof obj !== "object" || obj === null) {
    if (typeof obj === "string") {
      return sanitizeText(obj);
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj
      .slice(0, 1000)
      .map((item) => sanitizeObject(item, maxDepth, currentDepth + 1));
  }

  const sanitized: any = {};
  const keys = Object.keys(obj).slice(0, 100);

  for (const key of keys) {
    const sanitizedKey = sanitizeName(key);
    if (sanitizedKey) {
      sanitized[sanitizedKey] = sanitizeObject(
        obj[key],
        maxDepth,
        currentDepth + 1,
      );
    }
  }

  return sanitized;
};

/**
 * Sanitize file name
 */
export const sanitizeFileName = (fileName: string): string => {
  if (typeof fileName !== "string") return "";

  return fileName
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/\.{2,}/g, ".")
    .substring(0, 255);
};

/**
 * Comprehensive input sanitizer with type detection
 */
export const sanitizeInput = (input: any, type: string = "text"): any => {
  switch (type) {
    case "email":
      return sanitizeEmail(input);
    case "name":
      return sanitizeName(input);
    case "text":
      return sanitizeText(input);
    case "number":
      return sanitizeNumber(input);
    case "url":
      return sanitizeUrl(input);
    case "phone":
      return sanitizePhone(input);
    case "search":
      return sanitizeSearchQuery(input);
    case "html":
      return sanitizeHtml(input);
    case "json":
      return sanitizeJson(input);
    case "filename":
      return sanitizeFileName(input);
    case "mood":
      return sanitizeMoodIntensity(input);
    default:
      return sanitizeText(input);
  }
};

/**
 * Escape special characters for safe display
 */
export const escapeSpecialChars = (input: string): string => {
  if (typeof input !== "string") return "";

  const escapeMap: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };

  return input.replace(/[&<>"'/]/g, (char) => escapeMap[char] || char);
};
