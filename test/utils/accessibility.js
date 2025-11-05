// Accessibility testing utilities used by Jest tests
// These are lightweight implementations intended for the test environment.

import { AccessibilityInfo } from "react-native";

// Align constant names with tests; keep legacy alias for backward compatibility
export const WCAG_CONSTANTS = {
  TOUCH_TARGET_MIN_SIZE: 44,
  COLOR_CONTRAST_AA_NORMAL: 4.5,
  COLOR_CONTRAST_AA_LARGE: 3,
  // legacy alias used by older helpers
  MIN_TOUCH_TARGET: 44,
};

export const TouchTargetHelpers = {
  validateTouchTarget({ width, height, minWidth, minHeight, spacing }) {
    const w = minWidth ?? width ?? 0;
    const h = minHeight ?? height ?? 0;
    const isValid =
      w >= WCAG_CONSTANTS.TOUCH_TARGET_MIN_SIZE &&
      h >= WCAG_CONSTANTS.TOUCH_TARGET_MIN_SIZE;
    const recommendations = [];
    if (w < WCAG_CONSTANTS.TOUCH_TARGET_MIN_SIZE) {
      recommendations.push(
        `Increase width to at least ${WCAG_CONSTANTS.TOUCH_TARGET_MIN_SIZE}px`,
      );
    }
    if (h < WCAG_CONSTANTS.TOUCH_TARGET_MIN_SIZE) {
      recommendations.push(
        `Increase height to at least ${WCAG_CONSTANTS.TOUCH_TARGET_MIN_SIZE}px`,
      );
    }
    if (spacing != null && spacing < 8) {
      recommendations.push("Increase spacing between touch targets to >= 8px");
    }
    return { isValid, recommendations };
  },
  ensureMinimumTouchTarget(style = {}) {
    const min = WCAG_CONSTANTS.TOUCH_TARGET_MIN_SIZE;
    const newStyle = { ...style };
    if ((style.width || 0) < min) newStyle.minWidth = min;
    if ((style.height || 0) < min) newStyle.minHeight = min;
    const hitSlop = { top: 8, bottom: 8, left: 8, right: 8 };
    return { style: newStyle, hitSlop };
  },
};

// Simple contrast ratio approximation used only in tests
const _contrast = (fg, bg) => {
  const toRGB = (hex) =>
    (hex || "")
      .replace("#", "")
      .match(/.{2}/g)
      ?.map((x) => parseInt(x, 16) / 255) || [0, 0, 0];
  const luminance = ([r, g, b]) => {
    const a = [r, g, b].map((v) =>
      v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4),
    );
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  };
  const L1 = luminance(toRGB(fg));
  const L2 = luminance(toRGB(bg));
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Number(ratio.toFixed(2));
};

export const AccessibilityValidators = {
  validateColorContrast: (fg, bg, fontSize, isBold, level) => {
    const ratio = _contrast(fg, bg);
    const isLargeText =
      Number(fontSize) >= 18 || (isBold && Number(fontSize) >= 14);
    const requiredRatio = isLargeText
      ? WCAG_CONSTANTS.COLOR_CONTRAST_AA_LARGE
      : WCAG_CONSTANTS.COLOR_CONTRAST_AA_NORMAL;
    return {
      ratio,
      isLargeText,
      requiredRatio,
      passes: ratio >= requiredRatio,
    };
  },
  validateAccessibilityLabel: (label) => ({
    hasLabel: !!label,
    isDescriptive: typeof label === "string" && label.trim().length >= 4,
    isTooShort:
      typeof label === "string" &&
      label.trim().length > 0 &&
      label.trim().length < 3,
    isEmpty: !label || label.trim().length === 0,
  }),
  validateTouchTarget: (width, height) => ({
    isValid:
      Number(width) >= WCAG_CONSTANTS.TOUCH_TARGET_MIN_SIZE &&
      Number(height) >= WCAG_CONSTANTS.TOUCH_TARGET_MIN_SIZE,
  }),
  validateAnimationDuration: (ms) => ({
    isValid: Number(ms) <= 5000,
  }),
};

export class FocusManagement {
  setFocusToElement(element) {
    try {
      // In RN tests, setAccessibilityFocus is mocked in jest.setup.js
      AccessibilityInfo.setAccessibilityFocus &&
        AccessibilityInfo.setAccessibilityFocus(element);
    } catch (err) {
      // Swallow in non-native environments but record at debug level for diagnostics
      if (
        typeof console !== "undefined" &&
        typeof console.debug === "function"
      ) {
        console.debug("setAccessibilityFocus not available:", err);
      }
    }
  }
}

export class MentalHealthAccessibility {
  validateMentalHealthCompliance({
    hasEmergencyAccess,
    usesGentleLanguage,
    supportsReducedMotion,
    providesProgressFeedback,
  }) {
    const checks = [
      !!hasEmergencyAccess,
      !!usesGentleLanguage,
      !!supportsReducedMotion,
      !!providesProgressFeedback,
    ];
    const isCompliant = checks.every(Boolean);
    return {
      isCompliant,
      details: {
        hasEmergencyAccess: !!hasEmergencyAccess,
        usesGentleLanguage: !!usesGentleLanguage,
        supportsReducedMotion: !!supportsReducedMotion,
        providesProgressFeedback: !!providesProgressFeedback,
      },
    };
  }
}

export default {
  WCAG_CONSTANTS,
  AccessibilityValidators,
  TouchTargetHelpers,
  FocusManagement,
  MentalHealthAccessibility,
};
