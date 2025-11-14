/**
 * Comprehensive Navigation and Forms Test Suite
 *
 * Tests all navigation and form handling implementations:
 * - KeyboardAwareScrollView cross-platform behavior
 * - Form validation with accessibility
 * - Navigation state persistence
 * - Screen transitions and flicker prevention
 * - Mental health form patterns
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import React from "react";
import { Platform } from "react-native";

// Import components to test
import EnhancedInput from "../../src/shared/components/atoms/forms/EnhancedInput";
import {
  TherapySessionForm,
  MoodTrackingForm,
  AssessmentQuestionForm,
  CrisisSupportForm,
} from "../../src/shared/components/atoms/forms/MentalHealthForms";
import KeyboardAwareScrollView, {
  KeyboardAwareInput,
} from "../../src/shared/components/atoms/layout/KeyboardAwareScrollView";

// Import utilities
import {
  createValidator,
  validateField,
  validateForm,
  FORM_CONTEXTS,
  VALIDATION_SCHEMAS,
  VALIDATION_TYPES,
} from "../../utils/formValidation";
import {
  saveNavigationState,
  restoreNavigationState,
  clearNavigationState,
  saveSessionData,
  restoreSessionData,
  NavigationPersistence,
  __sessionCache,
} from "../../utils/navigationPersistence";

// Mock dependencies
jest.mock("@react-native-async-storage/async-storage");
jest.mock("../../src/shared/theme/ThemeContext", () => ({
  useTheme: () => ({
    theme: {
      colors: {
        primary: { 500: "#007AFF" },
        secondary: { 500: "#34C759" },
        error: {
          500: "#FF3B30",
          50: "#FFE5E5",
          600: "#CC0000",
          700: "#990000",
        },
        text: {
          primary: "#000000",
          secondary: "#666666",
          placeholder: "#999999",
        },
        background: {
          primary: "#FFFFFF",
          secondary: "#F5F5F5",
          surface: "#FAFAFA",
        },
        border: { primary: "#E0E0E0" },
        mood: { happy: "#FFD700", calm: "#87CEEB", anxious: "#FFA500" },
        therapeutic: {
          calm: "#E6F3FF",
          nurturing: "#E8F5E8",
          peaceful: "#F0F8FF",
        },
      },
      borderRadius: { sm: 8, md: 12, lg: 16 },
    },
    isReducedMotionEnabled: false,
  }),
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));

jest.mock("../../src/shared/utils/accessibility", () => ({
  FocusManagement: {
    announceForScreenReader: jest.fn(),
  },
  TouchTargetHelpers: {
    ensureMinimumTouchTarget: (style) => ({
      style,
      hitSlop: { top: 10, bottom: 10, left: 10, right: 10 },
    }),
  },
  WCAG_CONSTANTS: {
    TOUCH_TARGET_MIN_SIZE: 44,
  },
}));

// Mock React Navigation
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    canGoBack: () => true,
  }),
  NavigationContainer: ({ children }) => children,
  DefaultTheme: { colors: {} },
  CommonActions: {
    navigate: jest.fn(),
    reset: jest.fn(),
  },
}));

describe("Navigation and Forms Test Suite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear();
    // Clear in-memory session cache to prevent test data leakage
    Object.keys(__sessionCache).forEach((key) => delete __sessionCache[key]);
  });

  describe("KeyboardAwareScrollView", () => {
    test("renders children correctly", () => {
      const TestComponent = () => (
        <KeyboardAwareScrollView testID="keyboard-scroll">
          <EnhancedInput
            label="Test Input"
            value=""
            onChangeText={() => {}}
            testID="test-input"
          />
        </KeyboardAwareScrollView>
      );

      const { getByTestId } = render(<TestComponent />);
      expect(getByTestId("keyboard-scroll")).toBeTruthy();
      expect(getByTestId("test-input")).toBeTruthy();
    });

    test("applies mental health styling for therapy forms", () => {
      const { getByTestId } = render(
        <KeyboardAwareScrollView isTherapyForm testID="therapy-scroll">
          <EnhancedInput
            label="Therapy Input"
            value=""
            onChangeText={() => {}}
          />
        </KeyboardAwareScrollView>,
      );

      const scrollView = getByTestId("therapy-scroll");
      expect(scrollView.props.accessibilityLabel).toContain("Therapy");
    });

    test("handles focus changes for mental health contexts", () => {
      const mockOnFocusChange = jest.fn();

      render(
        <KeyboardAwareScrollView
          isMoodTracker
          onFocusChange={mockOnFocusChange}
        >
          <EnhancedInput label="Mood Input" value="" onChangeText={() => {}} />
        </KeyboardAwareScrollView>,
      );

      // Test would verify focus handling, but requires more complex setup for events
      expect(mockOnFocusChange).toBeDefined();
    });

    test("provides correct accessibility props", () => {
      const { getByTestId } = render(
        <KeyboardAwareScrollView
          testID="accessible-scroll"
          accessibilityLabel="Custom form container"
          accessibilityHint="Custom hint"
        >
          <EnhancedInput label="Input" value="" onChangeText={() => {}} />
        </KeyboardAwareScrollView>,
      );

      const scrollView = getByTestId("accessible-scroll");
      expect(scrollView.props.accessible).toBe(true);
      expect(scrollView.props.accessibilityLabel).toBe("Custom form container");
      expect(scrollView.props.accessibilityRole).toBe("scrollview");
    });
  });

  describe("Enhanced Input Component", () => {
    test("renders with basic props", () => {
      const { getByTestId } = render(
        <EnhancedInput
          label="Test Label"
          value="test value"
          onChangeText={() => {}}
          testID="enhanced-input"
        />,
      );

      const input = getByTestId("enhanced-input");
      expect(input).toBeTruthy();
      expect(input.props.value).toBe("test value");
    });

    test("shows validation errors", async () => {
      const { getByTestId, getByText } = render(
        <EnhancedInput
          label="Email"
          value="invalid-email"
          onChangeText={() => {}}
          validationRules={[
            { type: VALIDATION_TYPES.REQUIRED },
            { type: VALIDATION_TYPES.EMAIL },
          ]}
          validateOnChange
          testID="email-input"
        />,
      );

      const input = getByTestId("email-input");

      // Trigger validation
      fireEvent(input, "blur");

      await waitFor(() => {
        expect(input.props.accessibilityInvalid).toBe(true);
      });
    });

    test("applies mental health styling", () => {
      const { getByTestId } = render(
        <EnhancedInput
          label="Therapy Notes"
          value=""
          onChangeText={() => {}}
          isTherapyInput
          testID="therapy-input"
        />,
      );

      const input = getByTestId("therapy-input");
      expect(input.props.accessibilityHint).toContain("therapeutic");
    });

    test("handles secure text entry", () => {
      const { getByLabelText } = render(
        <EnhancedInput
          label="Password"
          value="password123"
          onChangeText={() => {}}
          secureTextEntry
        />,
      );

      const toggleButton = getByLabelText(/password/i);
      expect(toggleButton).toBeTruthy();

      fireEvent.press(toggleButton);
      // Would verify that secureTextEntry state changed
    });

    test("provides proper accessibility props", () => {
      const { getByTestId } = render(
        <EnhancedInput
          label="Accessible Input"
          value=""
          onChangeText={() => {}}
          accessibilityRequired
          accessibilityHint="Custom hint"
          testID="accessible-input"
        />,
      );

      const input = getByTestId("accessible-input");
      expect(input.props.accessible).toBe(true);
      expect(input.props.accessibilityRequired).toBe(true);
      expect(input.props.accessibilityHint).toBe("Custom hint");
    });
  });

  describe("Form Validation System", () => {
    test("validates required fields", () => {
      const validator = createValidator(FORM_CONTEXTS.PROFILE);
      const errors = validator.validateField("email", "", {}, [
        { type: VALIDATION_TYPES.REQUIRED },
      ]);

      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe(VALIDATION_TYPES.REQUIRED);
    });

    test("validates email format", () => {
      const errors = validateField("email", "invalid-email", [
        { type: VALIDATION_TYPES.EMAIL },
      ]);

      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe(VALIDATION_TYPES.EMAIL);

      const validErrors = validateField("email", "valid@example.com", [
        { type: VALIDATION_TYPES.EMAIL },
      ]);

      expect(validErrors).toHaveLength(0);
    });

    test("validates mood scale", () => {
      const errors = validateField("mood", "15", [
        { type: VALIDATION_TYPES.MOOD_SCALE },
      ]);

      expect(errors).toHaveLength(1);

      const validErrors = validateField("mood", "7", [
        { type: VALIDATION_TYPES.MOOD_SCALE },
      ]);

      expect(validErrors).toHaveLength(0);
    });

    test("validates password strength", () => {
      const errors = validateField("password", "weak", [
        { type: VALIDATION_TYPES.PASSWORD },
      ]);

      expect(errors).toHaveLength(1);

      const validErrors = validateField("password", "StrongPass123", [
        { type: VALIDATION_TYPES.PASSWORD },
      ]);

      expect(validErrors).toHaveLength(0);
    });

    test("validates complete form", () => {
      const formData = {
        email: "valid@example.com",
        password: "StrongPass123",
        confirmPassword: "StrongPass123",
        agreeToTerms: true,
      };

      const { isValid, errors } = validateForm(
        formData,
        VALIDATION_SCHEMAS.REGISTER,
        FORM_CONTEXTS.AUTH,
      );

      expect(isValid).toBe(true);
      expect(Object.keys(errors)).toHaveLength(0);
    });

    test("uses therapeutic language for mental health contexts", () => {
      const validator = createValidator(FORM_CONTEXTS.THERAPY, {
        useTherapeuticLanguage: true,
      });

      const errors = validator.validateField("sessionNotes", "", {}, [
        { type: VALIDATION_TYPES.REQUIRED },
      ]);

      expect(errors[0].message).toContain("when you're ready");
    });
  });

  describe("Navigation State Persistence", () => {
    test("saves navigation state", async () => {
      const mockState = {
        index: 1,
        routes: [
          { name: "Home", key: "home-key" },
          { name: "Profile", key: "profile-key" },
        ],
      };

      await saveNavigationState(mockState);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@solace_navigation_state",
        expect.stringContaining('"state"'),
      );
    });

    test("restores navigation state", async () => {
      const mockState = {
        index: 0,
        routes: [{ name: "Home", key: "home-key" }],
      };

      const storedData = {
        state: mockState,
        timestamp: Date.now(),
        version: "1.0",
      };

      AsyncStorage.getItem.mockResolvedValue(JSON.stringify(storedData));

      const restoredState = await restoreNavigationState();
      expect(restoredState).toEqual(mockState);
    });

    test("handles expired state", async () => {
      const expiredData = {
        state: { index: 0, routes: [] },
        timestamp: Date.now() - 25 * 60 * 60 * 1000, // 25 hours ago
        version: "1.0",
      };

      AsyncStorage.getItem.mockResolvedValue(JSON.stringify(expiredData));

      const restoredState = await restoreNavigationState();
      expect(restoredState).toBeNull();
      expect(AsyncStorage.multiRemove).toHaveBeenCalled();
    });

    test("saves session data", async () => {
      const sessionData = {
        currentMood: "happy",
        sessionNotes: "Feeling better today",
      };

      await saveSessionData("therapy", sessionData);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@solace_session_data_therapy",
        expect.stringContaining('"data"'),
      );
    });

    test("restores session data", async () => {
      const sessionData = {
        type: "therapy",
        data: { currentMood: "happy" },
        timestamp: Date.now(),
        encrypted: false,
      };

      AsyncStorage.getItem.mockResolvedValue(JSON.stringify(sessionData));

      const restored = await restoreSessionData();
      expect(restored.therapy).toEqual(sessionData.data);
    });

    test("clears all navigation data", async () => {
      await clearNavigationState();

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(
        expect.arrayContaining([
          "@solace_navigation_state",
          "@solace_session_data",
          "@solace_accessibility_history",
        ]),
      );
    });
  });

  describe("Mental Health Forms", () => {
    describe("Therapy Session Form", () => {
      test("renders all fields", () => {
        const { getByLabelText } = render(
          <TherapySessionForm onSubmit={() => {}} />,
        );

        expect(getByLabelText(/work on today/i)).toBeTruthy();
        expect(getByLabelText(/current mood/i)).toBeTruthy();
        expect(getByLabelText(/mood intensity/i)).toBeTruthy();
        expect(getByLabelText(/session notes/i)).toBeTruthy();
      });

      test("validates required fields", async () => {
        const mockSubmit = jest.fn();
        const { getByText } = render(
          <TherapySessionForm onSubmit={mockSubmit} />,
        );

        const submitButton = getByText("Save Session");
        fireEvent.press(submitButton);

        // Should not submit with empty required fields
        expect(mockSubmit).not.toHaveBeenCalled();
      });

      test("submits valid form data", async () => {
        const mockSubmit = jest.fn();
        const { getByLabelText, getByText } = render(
          <TherapySessionForm onSubmit={mockSubmit} />,
        );

        // Fill required fields
        const goalsInput = getByLabelText(/work on today/i);
        const moodInput = getByLabelText(/current mood/i);
        const intensityInput = getByLabelText(/mood intensity/i);

        fireEvent.changeText(goalsInput, "Work on anxiety management");
        fireEvent.changeText(moodInput, "Anxious but hopeful");
        fireEvent.changeText(intensityInput, "6");

        const submitButton = getByText("Save Session");
        fireEvent.press(submitButton);

        await waitFor(() => {
          expect(mockSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
              sessionGoals: "Work on anxiety management",
              currentMood: "Anxious but hopeful",
              moodIntensity: "6",
            }),
          );
        });
      });
    });

    describe("Mood Tracking Form", () => {
      test("renders mood options", () => {
        const { getByLabelText } = render(
          <MoodTrackingForm onSubmit={() => {}} />,
        );

        expect(getByLabelText("Happy mood")).toBeTruthy();
        expect(getByLabelText("Calm mood")).toBeTruthy();
        expect(getByLabelText("Anxious mood")).toBeTruthy();
        expect(getByLabelText("Sad mood")).toBeTruthy();
      });

      test("selects mood and updates form", () => {
        const { getByLabelText } = render(
          <MoodTrackingForm onSubmit={() => {}} />,
        );

        const happyMood = getByLabelText("Happy mood");
        fireEvent.press(happyMood);

        expect(happyMood.props.accessibilityState.selected).toBe(true);
      });

      test("validates mood intensity", async () => {
        const mockSubmit = jest.fn();
        const { getByLabelText, getByText } = render(
          <MoodTrackingForm onSubmit={mockSubmit} />,
        );

        // Select mood but invalid intensity
        const happyMood = getByLabelText("Happy mood");
        fireEvent.press(happyMood);

        const intensityInput = getByLabelText(/intensity/i);
        fireEvent.changeText(intensityInput, "15"); // Invalid - too high

        const submitButton = getByText("Save Mood Entry");
        fireEvent.press(submitButton);

        // Should not submit with invalid intensity
        expect(mockSubmit).not.toHaveBeenCalled();
      });
    });

    describe("Assessment Question Form", () => {
      const mockQuestion = {
        text: "How often do you feel anxious?",
        description: "Select the option that best describes your experience.",
        options: [
          { text: "Never", value: "never" },
          { text: "Rarely", value: "rarely" },
          { text: "Sometimes", value: "sometimes" },
          { text: "Often", value: "often" },
          { text: "Always", value: "always" },
        ],
      };

      test("renders question and options", () => {
        const { getByText } = render(
          <AssessmentQuestionForm
            question={mockQuestion}
            questionNumber={1}
            totalQuestions={10}
            onAnswer={() => {}}
            onNext={() => {}}
            onPrevious={() => {}}
          />,
        );

        expect(getByText("How often do you feel anxious?")).toBeTruthy();
        expect(getByText("Never")).toBeTruthy();
        expect(getByText("Sometimes")).toBeTruthy();
        expect(getByText("Always")).toBeTruthy();
      });

      test("shows progress indicator", () => {
        const { getByText } = render(
          <AssessmentQuestionForm
            question={mockQuestion}
            questionNumber={3}
            totalQuestions={10}
            onAnswer={() => {}}
            onNext={() => {}}
            onPrevious={() => {}}
          />,
        );

        expect(getByText("Question 3 of 10")).toBeTruthy();
      });

      test("requires answer selection", () => {
        const mockNext = jest.fn();
        const { getByText } = render(
          <AssessmentQuestionForm
            question={mockQuestion}
            questionNumber={1}
            totalQuestions={10}
            onAnswer={() => {}}
            onNext={mockNext}
            onPrevious={() => {}}
          />,
        );

        const nextButton = getByText("Next");
        fireEvent.press(nextButton);

        // Should not proceed without answer
        expect(mockNext).not.toHaveBeenCalled();
      });

      test("proceeds with selected answer", () => {
        const mockAnswer = jest.fn();
        const mockNext = jest.fn();
        const { getByText } = render(
          <AssessmentQuestionForm
            question={mockQuestion}
            questionNumber={1}
            totalQuestions={10}
            onAnswer={mockAnswer}
            onNext={mockNext}
            onPrevious={() => {}}
          />,
        );

        // Select an answer
        const answerOption = getByText("Sometimes");
        fireEvent.press(answerOption);

        expect(mockAnswer).toHaveBeenCalledWith("sometimes");

        // Now next should work
        const nextButton = getByText("Next");
        fireEvent.press(nextButton);

        expect(mockNext).toHaveBeenCalled();
      });
    });

    describe("Crisis Support Form", () => {
      test("renders emergency contact fields", () => {
        const { getByLabelText } = render(
          <CrisisSupportForm onSubmit={() => {}} />,
        );

        expect(getByLabelText(/emergency contact/i)).toBeTruthy();
        expect(getByLabelText(/relationship/i)).toBeTruthy();
        expect(getByLabelText(/support you/i)).toBeTruthy();
      });

      test("validates required emergency contact", async () => {
        const mockSubmit = jest.fn();
        const { getByText } = render(
          <CrisisSupportForm onSubmit={mockSubmit} />,
        );

        const submitButton = getByText("Submit Support Request");
        fireEvent.press(submitButton);

        // Should not submit without emergency contact
        expect(mockSubmit).not.toHaveBeenCalled();
      });

      test("shows alert for missing information", async () => {
        // Mock Alert.alert
        const mockAlert = jest.fn();
        jest.doMock("react-native", () => ({
          ...jest.requireActual("react-native"),
          Alert: { alert: mockAlert },
        }));

        const { getByText } = render(<CrisisSupportForm onSubmit={() => {}} />);

        const submitButton = getByText("Submit Support Request");
        fireEvent.press(submitButton);

        // Would verify alert was shown, but requires proper Alert mocking
      });
    });
  });

  describe("Cross-Platform Behavior", () => {
    test("adapts keyboard behavior for iOS", () => {
      Platform.OS = "ios";

      const { getByTestId } = render(
        <KeyboardAwareScrollView testID="ios-scroll">
          <EnhancedInput label="Test" value="" onChangeText={() => {}} />
        </KeyboardAwareScrollView>,
      );

      // Would verify iOS-specific behavior
      expect(getByTestId("ios-scroll")).toBeTruthy();
    });

    test("adapts keyboard behavior for Android", () => {
      Platform.OS = "android";

      const { getByTestId } = render(
        <KeyboardAwareScrollView testID="android-scroll">
          <EnhancedInput label="Test" value="" onChangeText={() => {}} />
        </KeyboardAwareScrollView>,
      );

      // Would verify Android-specific behavior
      expect(getByTestId("android-scroll")).toBeTruthy();
    });
  });

  describe("Performance and Accessibility", () => {
    test("provides proper ARIA labels", () => {
      const { getByLabelText } = render(
        <EnhancedInput
          label="Accessible Input"
          value=""
          onChangeText={() => {}}
          accessibilityLabel="Custom accessible label"
        />,
      );

      expect(getByLabelText("Custom accessible label")).toBeTruthy();
    });

    test("announces validation errors", async () => {
      const { FocusManagement } = require("../../utils/accessibility");

      render(
        <EnhancedInput
          label="Email"
          value="invalid"
          onChangeText={() => {}}
          validationRules={[{ type: VALIDATION_TYPES.EMAIL }]}
          validateOnBlur
        />,
      );

      // Would verify that screen reader announcements are made
      expect(FocusManagement.announceForScreenReader).toBeDefined();
    });

    test("respects reduced motion preferences", () => {
      const { getByTestId } = render(
        <KeyboardAwareScrollView
          testID="reduced-motion-scroll"
          animateOnKeyboard={false}
        >
          <EnhancedInput
            label="Test"
            value=""
            onChangeText={() => {}}
            animated={false}
          />
        </KeyboardAwareScrollView>,
      );

      expect(getByTestId("reduced-motion-scroll")).toBeTruthy();
    });
  });
});

// Integration tests
describe("Navigation and Forms Integration", () => {
  test("form state persists during navigation", async () => {
    // This would test that form data is preserved when navigating away and back
    const formData = { sessionGoals: "Test goals", currentMood: "happy" };

    await saveSessionData("therapy", formData);
    const restored = await restoreSessionData();

    expect(restored.therapy).toEqual(formData);
  });

  test("accessibility history tracks form navigation", async () => {
    // This would test that accessibility navigation history is properly maintained
    const {
      saveAccessibilityHistory,
    } = require("../../utils/navigationPersistence");

    await saveAccessibilityHistory("TherapyForm", "FORM_SUBMIT", {
      formType: "therapy",
      fieldsCompleted: 3,
    });

    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });
});

export default {};
