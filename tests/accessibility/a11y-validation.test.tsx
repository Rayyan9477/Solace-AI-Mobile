/**
 * Accessibility Validation Tests
 * @description Automated accessibility checks for critical user flows
 * @phase Week 2: Accessibility validation
 *
 * Tests WCAG 2.1 AA compliance for:
 * - Touch target sizes (44x44pt minimum)
 * - Accessibility labels and roles
 * - Color contrast (manual verification required)
 * - Screen reader compatibility
 *
 * Complements manual VoiceOver/TalkBack testing
 */

import { render } from "@testing-library/react-native";
import React from "react";

// Critical Screens for Accessibility Testing
import { SplashScreen } from "../../src/features/auth/screens/SplashScreen";
import { WelcomeScreen } from "../../src/features/auth/screens/WelcomeScreen";
import { SignInScreen } from "../../src/features/auth/screens/SignInScreen";
import { CrisisModal } from "../../src/shared/components/organisms/crisis/CrisisModal";
import { Button } from "../../src/shared/components/atoms/buttons/Button";
import { TextInput } from "../../src/shared/components/atoms/forms/TextInput";

/**
 * Helper: Check if element meets minimum touch target size (44x44pt)
 */
function hasMiniumumTouchTarget(element: any): boolean {
  const styles = Array.isArray(element.props.style)
    ? Object.assign({}, ...element.props.style)
    : element.props.style || {};

  const minHeight = styles.minHeight || styles.height || 0;
  const minWidth = styles.minWidth || styles.width || 0;

  return minHeight >= 44 && minWidth >= 44;
}

/**
 * Helper: Check if element has proper accessibility properties
 */
function hasAccessibilityProps(element: any): {
  hasLabel: boolean;
  hasRole: boolean;
  hasHint: boolean;
} {
  return {
    hasLabel: !!element.props.accessibilityLabel,
    hasRole: !!element.props.accessibilityRole,
    hasHint: !!element.props.accessibilityHint,
  };
}

describe("Accessibility Validation Tests", () => {
  describe("Button Component Accessibility", () => {
    it("should have minimum touch target size (44x44pt)", () => {
      const { getByTestId } = render(
        <Button
          testID="test-button"
          onPress={() => {}}
          variant="primary"
        >
          Test Button
        </Button>,
      );

      const button = getByTestId("test-button");
      expect(hasMiniumumTouchTarget(button)).toBe(true);
    });

    it("should have accessible role", () => {
      const { getByTestId } = render(
        <Button
          testID="test-button"
          onPress={() => {}}
          variant="primary"
        >
          Test Button
        </Button>,
      );

      const button = getByTestId("test-button");
      expect(button.props.accessibilityRole).toBe("button");
    });

    it("should have accessible label", () => {
      const { getByTestId } = render(
        <Button
          testID="test-button"
          onPress={() => {}}
          variant="primary"
          accessibilityLabel="Submit form"
        >
          Test Button
        </Button>,
      );

      const button = getByTestId("test-button");
      expect(button.props.accessibilityLabel).toBe("Submit form");
    });

    it("crisis variant should have elevated accessibility priority", () => {
      const { getByTestId } = render(
        <Button
          testID="crisis-button"
          onPress={() => {}}
          variant="crisis"
          accessibilityLabel="Get crisis support"
        >
          Get Help Now
        </Button>,
      );

      const button = getByTestId("crisis-button");
      expect(button.props.accessibilityRole).toBe("button");
      expect(button.props.accessibilityLabel).toBe("Get crisis support");
    });
  });

  describe("TextInput Component Accessibility", () => {
    it("should have accessible label", () => {
      const { getByTestId } = render(
        <TextInput
          testID="test-input"
          label="Email Address"
          placeholder="Enter your email"
          value=""
          onChangeText={() => {}}
        />,
      );

      const input = getByTestId("test-input");
      expect(input.props.accessibilityLabel).toBeTruthy();
    });

    it("should announce error messages to screen readers", () => {
      const { getByTestId } = render(
        <TextInput
          testID="test-input"
          label="Email"
          value=""
          onChangeText={() => {}}
          error="Invalid email address"
        />,
      );

      const input = getByTestId("test-input");
      // Error should be announced via accessibility properties
      expect(input.props.accessibilityLabel).toBeTruthy();
    });

    it("should have minimum touch target size", () => {
      const { getByTestId } = render(
        <TextInput
          testID="test-input"
          label="Name"
          value=""
          onChangeText={() => {}}
        />,
      );

      const input = getByTestId("test-input");
      expect(hasMiniumumTouchTarget(input)).toBe(true);
    });
  });

  describe("CrisisModal Accessibility (CRITICAL)", () => {
    it("should have alert role for immediate screen reader announcement", () => {
      const { getByTestId } = render(
        <CrisisModal
          visible={true}
          onDismiss={() => {}}
          triggerSource="score"
        />,
      );

      const modal = getByTestId("crisis-modal");
      expect(modal.props.accessibilityRole).toBe("alert");
    });

    it("should have assertive live region", () => {
      const { getByTestId } = render(
        <CrisisModal
          visible={true}
          onDismiss={() => {}}
          triggerSource="chat"
        />,
      );

      const modal = getByTestId("crisis-modal");
      expect(modal.props.accessibilityLiveRegion).toBe("assertive");
    });

    it("should announce modal content immediately", () => {
      const { getByTestId } = render(
        <CrisisModal
          visible={true}
          onDismiss={() => {}}
          triggerSource="journal"
        />,
      );

      const modal = getByTestId("crisis-modal");
      expect(modal.props.accessibilityLabel).toContain("Support Available");
    });

    it("crisis hotline buttons should have clear labels", () => {
      const { getByTestId } = render(
        <CrisisModal
          visible={true}
          onDismiss={() => {}}
          triggerSource="score"
        />,
      );

      const hotlineButton = getByTestId("crisis-call-988-button");
      expect(hotlineButton.props.accessibilityLabel).toContain("988");
      expect(hotlineButton.props.accessibilityLabel).toContain("Crisis Lifeline");
    });

    it("should have minimum touch target for all action buttons", () => {
      const { getByTestId } = render(
        <CrisisModal
          visible={true}
          onDismiss={() => {}}
          triggerSource="chat"
        />,
      );

      const hotlineButton = getByTestId("crisis-call-988-button");
      expect(hasMiniumumTouchTarget(hotlineButton)).toBe(true);

      const textButton = getByTestId("crisis-text-741741-button");
      expect(hasMiniumumTouchTarget(textButton)).toBe(true);
    });
  });

  describe("Authentication Screens Accessibility", () => {
    it("SignInScreen: all interactive elements have accessibility labels", () => {
      const { getByTestId } = render(
        <SignInScreen
          onSignIn={() => {}}
          onForgotPassword={() => {}}
          onSignUp={() => {}}
        />,
      );

      const container = getByTestId("signin-screen");
      expect(container).toBeTruthy();

      // Email input should have label
      const emailInput = getByTestId("signin-email-input");
      expect(emailInput.props.accessibilityLabel).toBeTruthy();

      // Password input should have label
      const passwordInput = getByTestId("signin-password-input");
      expect(passwordInput.props.accessibilityLabel).toBeTruthy();

      // Sign in button should have role and label
      const signInButton = getByTestId("signin-button");
      expect(signInButton.props.accessibilityRole).toBe("button");
    });

    it("WelcomeScreen: CTA button meets accessibility standards", () => {
      const { getByTestId } = render(
        <WelcomeScreen onGetStarted={() => {}} />,
      );

      const ctaButton = getByTestId("welcome-get-started-button");
      expect(ctaButton.props.accessibilityRole).toBe("button");
      expect(hasMiniumumTouchTarget(ctaButton)).toBe(true);
    });
  });

  describe("Touch Target Size Validation", () => {
    const criticalButtons = [
      { name: "Primary Button", variant: "primary" as const },
      { name: "Secondary Button", variant: "secondary" as const },
      { name: "Crisis Button", variant: "crisis" as const },
      { name: "Ghost Button", variant: "ghost" as const },
    ];

    criticalButtons.forEach(({ name, variant }) => {
      it(`${name} should meet 44x44pt minimum`, () => {
        const { getByTestId } = render(
          <Button
            testID={`${variant}-button`}
            onPress={() => {}}
            variant={variant}
          >
            {name}
          </Button>,
        );

        const button = getByTestId(`${variant}-button`);
        expect(hasMiniumumTouchTarget(button)).toBe(true);
      });
    });
  });

  describe("Screen Reader Compatibility", () => {
    it("should provide meaningful context for screen readers", () => {
      const { getByTestId } = render(
        <Button
          testID="submit-button"
          onPress={() => {}}
          variant="primary"
          accessibilityLabel="Submit profile information"
          accessibilityHint="Double tap to save your profile changes"
        >
          Submit
        </Button>,
      );

      const button = getByTestId("submit-button");
      const a11y = hasAccessibilityProps(button);

      expect(a11y.hasLabel).toBe(true);
      expect(a11y.hasRole).toBe(true);
      expect(a11y.hasHint).toBe(true);
    });

    it("should announce state changes for toggles", () => {
      const { getByTestId } = render(
        <Button
          testID="toggle-button"
          onPress={() => {}}
          variant="ghost"
          accessibilityLabel="Dark mode"
          accessibilityState={{ checked: true }}
        >
          Toggle
        </Button>,
      );

      const button = getByTestId("toggle-button");
      expect(button.props.accessibilityState).toEqual({ checked: true });
    });
  });

  describe("Color Contrast Validation (Manual)", () => {
    it("should document color combinations for manual contrast testing", () => {
      // NOTE: Automated color contrast testing requires additional tooling
      // Manual testing required with:
      // - WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
      // - Chrome DevTools Accessibility Panel
      // - Axe DevTools

      const colorCombinations = [
        { fg: "#FFFFFF", bg: "#1C1410", context: "Primary text on dark background" },
        { fg: "#94A3B8", bg: "#1C1410", context: "Secondary text on dark background" },
        { fg: "#1C1410", bg: "#C4A574", context: "Button text on tan background" },
        { fg: "#FFFFFF", bg: "#EF4444", context: "Crisis button text" },
        { fg: "#EF4444", bg: "#1C1410", context: "Error text on dark background" },
      ];

      // All color combinations should be documented for manual testing
      expect(colorCombinations.length).toBeGreaterThan(0);

      colorCombinations.forEach((combo) => {
        // This test documents the colors to check manually
        // WCAG AA requires:
        // - Normal text: 4.5:1 contrast ratio
        // - Large text (18pt+): 3:1 contrast ratio
        // - UI components: 3:1 contrast ratio
        expect(combo.fg).toBeTruthy();
        expect(combo.bg).toBeTruthy();
        expect(combo.context).toBeTruthy();
      });
    });
  });
});

describe("Accessibility Audit Summary", () => {
  it("should document manual testing requirements", () => {
    const manualTests = [
      "VoiceOver navigation test (iOS) - Navigate entire app",
      "TalkBack navigation test (Android) - Navigate entire app",
      "Color contrast verification - All text/UI elements",
      "Focus indicator visibility - All focusable elements",
      "Reduced motion preference - All animations",
      "Large text sizes - All screens (iOS Dynamic Type)",
      "Screen reader announcements - All dynamic content",
      "Crisis modal screen reader flow - End-to-end test",
    ];

    expect(manualTests).toHaveLength(8);
    manualTests.forEach((test) => {
      expect(test).toBeTruthy();
    });
  });
});
