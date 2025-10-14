// Accessibility testing utilities used by Jest tests
// These are lightweight implementations intended for the test environment.

import { AccessibilityInfo } from "react-native";

export const WCAG_CONSTANTS = {
  MIN_TOUCH_TARGET: 44,
};

export const TouchTargetHelpers = {
  validateTouchTarget({ width, height, minWidth, minHeight, spacing }) {
    const w = minWidth ?? width ?? 0;
    const h = minHeight ?? height ?? 0;
    const isValid = w >= WCAG_CONSTANTS.MIN_TOUCH_TARGET && h >= WCAG_CONSTANTS.MIN_TOUCH_TARGET;
    const recommendations = [];
    if (w < WCAG_CONSTANTS.MIN_TOUCH_TARGET) {
      recommendations.push(`Increase width to at least ${WCAG_CONSTANTS.MIN_TOUCH_TARGET}px`);
    }
    if (h < WCAG_CONSTANTS.MIN_TOUCH_TARGET) {
      recommendations.push(`Increase height to at least ${WCAG_CONSTANTS.MIN_TOUCH_TARGET}px`);
    }
    if (spacing != null && spacing < 8) {
      recommendations.push("Increase spacing between touch targets to >= 8px");
    }
    return { isValid, recommendations };
  },
};

export class FocusManagement {
  setFocusToElement(element) {
    try {
      // In RN tests, setAccessibilityFocus is mocked in jest.setup.js
      AccessibilityInfo.setAccessibilityFocus && AccessibilityInfo.setAccessibilityFocus(element);
    } catch (_) {
      // no-op in non-native environments
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
  TouchTargetHelpers,
  FocusManagement,
  MentalHealthAccessibility,
};