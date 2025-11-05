// Lightweight testing utilities to satisfy accessibility tests

export default class AccessibilityTester {
  calculateContrastRatio(fg, bg) {
    // Very rough contrast approximation for tests (not production)
    const toRGB = (hex) =>
      hex
        .replace("#", "")
        .match(/.{2}/g)
        .map((x) => parseInt(x, 16) / 255);
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
  }

  validateAnimationAccessibility(config) {
    const results = [];
    // Reduced motion support
    results.push({
      test: "Reduced Motion Support",
      status: config.respectsReducedMotion ? "PASS" : "FAIL",
    });
    // Duration guidance (warn if > 5000ms)
    const duration = config.duration ?? 300;
    results.push({
      test: "Animation Duration",
      status: duration > 5000 ? "WARNING" : "PASS",
      actual: duration,
      expected: "≤5000ms",
    });
    return results;
  }

  testComponent(component, name) {
    const results = [];
    const { props = {} } = component || {};

    // Touch target size
    const minWidth = props?.style?.minWidth ?? 0;
    const minHeight = props?.style?.minHeight ?? 0;
    results.push({
      test: "Touch Target Size",
      status: minWidth >= 44 && minHeight >= 44 ? "PASS" : "FAIL",
    });

    // Accessibility label
    results.push({
      test: "Accessibility Label",
      status: props.accessibilityLabel ? "PASS" : "FAIL",
    });

    return results;
  }

  generateReport(testResults) {
    const summary = {
      totalComponents: testResults.length,
      totalTests: testResults.reduce((acc, c) => acc + c.results.length, 0),
      passedTests: testResults
        .flatMap((c) => c.results)
        .filter((r) => r.status === "PASS").length,
      failedTests: testResults
        .flatMap((c) => c.results)
        .filter((r) => r.status === "FAIL").length,
    };
    const recommendations = testResults
      .flatMap((c) => c.results)
      .filter((r) => r.status !== "PASS")
      .map((r) => r.message || "Review accessibility for failing tests");
    return { summary, recommendations };
  }

  cleanup() {}
}

export const MentalHealthAccessibilityTesting = {
  testMoodTracker(component) {
    const { props = {} } = component || {};
    return [
      {
        test: "Mood Label Present",
        status: props.accessibilityLabel ? "PASS" : "FAIL",
      },
      {
        test: "Mood Role",
        status: props.accessibilityRole ? "PASS" : "FAIL",
      },
    ];
  },
  testChatAccessibility(component) {
    const { props = {} } = component || {};
    const hasContext = props.accessibilityLabel
      ?.toLowerCase()
      .includes("message");
    return [
      { test: "Chat Message Context", status: hasContext ? "PASS" : "WARN" },
    ];
  },
  testAssessmentAccessibility(component) {
    const { props = {} } = component || {};
    const hasProgress = /question\s+\d+\s+of\s+\d+/i.test(
      props.accessibilityLabel || "",
    );
    return [
      { test: "Assessment Progress", status: hasProgress ? "PASS" : "WARN" },
    ];
  },
};

export const ACCESSIBILITY_TESTING_CONFIG = {
  minTouchTarget: 44,
  maxAnimationDurationMs: 5000,
};

// Also provide validators and helpers referenced by tests
export const WCAG_CONSTANTS = {
  TOUCH_TARGET_MIN_SIZE: 44,
  COLOR_CONTRAST_AA_NORMAL: 4.5,
  COLOR_CONTRAST_AA_LARGE: 3,
};

export const AccessibilityValidators = {
  validateColorContrast: (fg, bg, fontSize, isBold, level) => {
    const tester = new AccessibilityTester();
    const ratio = tester.calculateContrastRatio(fg, bg);
    const isLargeText = fontSize >= 18 || (isBold && fontSize >= 14);
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

export const TouchTargetHelpers = {
  ensureMinimumTouchTarget(style = {}) {
    const min = WCAG_CONSTANTS.TOUCH_TARGET_MIN_SIZE;
    const newStyle = { ...style };
    if ((style.width || 0) < min) newStyle.minWidth = min;
    if ((style.height || 0) < min) newStyle.minHeight = min;
    const hitSlop = { top: 8, bottom: 8, left: 8, right: 8 };
    return { style: newStyle, hitSlop };
  },
};
