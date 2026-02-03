/**
 * OnboardingCarouselCard Tests
 * @description Test suite for OnboardingCarouselCard template component
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { OnboardingCarouselCard } from "./OnboardingCarouselCard";
import type { OnboardingStepData } from "./OnboardingCarouselCard.types";

describe("OnboardingCarouselCard", () => {
  const mockOnNext = jest.fn();
  const mockOnBack = jest.fn();

  const defaultStepData: OnboardingStepData = {
    stepNumber: 1,
    stepLabel: "Step One",
    title: "Test Title With Highlighted",
    highlightedWords: ["Highlighted"],
    illustrationComponent: <></>,
    backgroundColor: "#6B7B3A",
    totalSteps: 5,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render all main components", () => {
      const { getByText, getByA11yRole } = render(
        <OnboardingCarouselCard
          stepData={defaultStepData}
          onNext={mockOnNext}
          testID="test-card"
        />
      );

      // Step badge
      expect(getByText("Step One")).toBeTruthy();

      // Progress bar
      expect(getByA11yRole("progressbar")).toBeTruthy();

      // Title
      expect(getByText(/Test Title With Highlighted/)).toBeTruthy();

      // Next button
      expect(getByText("→")).toBeTruthy();
    });

    it("should render with correct background color", () => {
      const { getByTestId } = render(
        <OnboardingCarouselCard
          stepData={defaultStepData}
          onNext={mockOnNext}
          testID="test-card"
        />
      );

      const illustrationSection = getByTestId("test-card-illustration-section");
      expect(illustrationSection.props.style).toContainEqual({
        backgroundColor: "#6B7B3A",
      });
    });

    it("should render illustration component when provided", () => {
      const TestIllustration = () => <></>;
      const stepData = {
        ...defaultStepData,
        illustrationComponent: <TestIllustration />,
      };

      const { getByTestId } = render(
        <OnboardingCarouselCard
          stepData={stepData}
          onNext={mockOnNext}
          testID="test-card"
        />
      );

      expect(getByTestId("test-card-illustration")).toBeTruthy();
    });
  });

  describe("Navigation", () => {
    it("should not show back button on first step", () => {
      const stepData = { ...defaultStepData, stepNumber: 1 };

      const { queryByLabelText } = render(
        <OnboardingCarouselCard
          stepData={stepData}
          onNext={mockOnNext}
          onBack={mockOnBack}
        />
      );

      expect(queryByLabelText("Previous step")).toBeNull();
    });

    it("should show back button on subsequent steps", () => {
      const stepData = { ...defaultStepData, stepNumber: 2 };

      const { getByLabelText } = render(
        <OnboardingCarouselCard
          stepData={stepData}
          onNext={mockOnNext}
          onBack={mockOnBack}
        />
      );

      expect(getByLabelText("Previous step")).toBeTruthy();
    });

    it("should call onNext when next button pressed", () => {
      const { getByLabelText } = render(
        <OnboardingCarouselCard
          stepData={defaultStepData}
          onNext={mockOnNext}
        />
      );

      const nextButton = getByLabelText("Next step");
      fireEvent.press(nextButton);

      expect(mockOnNext).toHaveBeenCalledTimes(1);
    });

    it("should call onBack when back button pressed", () => {
      const stepData = { ...defaultStepData, stepNumber: 2 };

      const { getByLabelText } = render(
        <OnboardingCarouselCard
          stepData={stepData}
          onNext={mockOnNext}
          onBack={mockOnBack}
        />
      );

      const backButton = getByLabelText("Previous step");
      fireEvent.press(backButton);

      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    it("should show complete label on last step", () => {
      const stepData = { ...defaultStepData, stepNumber: 5, totalSteps: 5 };

      const { getByLabelText } = render(
        <OnboardingCarouselCard
          stepData={stepData}
          onNext={mockOnNext}
        />
      );

      expect(getByLabelText("Complete onboarding")).toBeTruthy();
    });

    it("should show next label on non-last steps", () => {
      const stepData = { ...defaultStepData, stepNumber: 3 };

      const { getByLabelText } = render(
        <OnboardingCarouselCard
          stepData={stepData}
          onNext={mockOnNext}
        />
      );

      expect(getByLabelText("Next step")).toBeTruthy();
    });
  });

  describe("Progress Indication", () => {
    it("should show correct progress for each step", () => {
      const steps = [1, 2, 3, 4, 5];

      steps.forEach((step) => {
        const stepData = { ...defaultStepData, stepNumber: step };
        const { getByLabelText } = render(
          <OnboardingCarouselCard
            stepData={stepData}
            onNext={mockOnNext}
          />
        );

        expect(getByLabelText(`Step ${step} of 5`)).toBeTruthy();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper container accessibility label", () => {
      const { getByLabelText } = render(
        <OnboardingCarouselCard
          stepData={defaultStepData}
          onNext={mockOnNext}
        />
      );

      expect(getByLabelText("Onboarding step 1 of 5")).toBeTruthy();
    });

    it("should have accessible step badge", () => {
      const { getByLabelText } = render(
        <OnboardingCarouselCard
          stepData={defaultStepData}
          onNext={mockOnNext}
        />
      );

      expect(getByLabelText("Step One of 5")).toBeTruthy();
    });

    it("should have accessible progress bar", () => {
      const { getByA11yRole } = render(
        <OnboardingCarouselCard
          stepData={defaultStepData}
          onNext={mockOnNext}
        />
      );

      const progressBar = getByA11yRole("progressbar");
      expect(progressBar.props.accessibilityValue).toEqual({
        min: 1,
        max: 5,
        now: 1,
      });
    });

    it("should have accessible title", () => {
      const { getByA11yRole } = render(
        <OnboardingCarouselCard
          stepData={defaultStepData}
          onNext={mockOnNext}
        />
      );

      expect(getByA11yRole("header")).toBeTruthy();
    });

    it("should have accessible navigation buttons", () => {
      const stepData = { ...defaultStepData, stepNumber: 3 };

      const { getAllByA11yRole } = render(
        <OnboardingCarouselCard
          stepData={stepData}
          onNext={mockOnNext}
          onBack={mockOnBack}
        />
      );

      const buttons = getAllByA11yRole("button");
      expect(buttons.length).toBeGreaterThanOrEqual(2); // Back + Next
    });
  });

  describe("Layout", () => {
    it("should render illustration section with correct height ratio", () => {
      const { getByTestId } = render(
        <OnboardingCarouselCard
          stepData={defaultStepData}
          onNext={mockOnNext}
          testID="test-card"
        />
      );

      const illustrationSection = getByTestId("test-card-illustration-section");
      expect(illustrationSection.props.style).toContainEqual({ flex: 0.6 });
    });

    it("should render content panel with correct height ratio", () => {
      const { getByTestId } = render(
        <OnboardingCarouselCard
          stepData={defaultStepData}
          onNext={mockOnNext}
          testID="test-card"
        />
      );

      const contentPanel = getByTestId("test-card-content-panel");
      expect(contentPanel.props.style).toContainEqual({ flex: 0.4 });
    });
  });

  describe("TestID", () => {
    it("should render all sub-components with testIDs", () => {
      const { getByTestId } = render(
        <OnboardingCarouselCard
          stepData={defaultStepData}
          onNext={mockOnNext}
          testID="test-card"
        />
      );

      expect(getByTestId("test-card")).toBeTruthy();
      expect(getByTestId("test-card-illustration-section")).toBeTruthy();
      expect(getByTestId("test-card-step-badge")).toBeTruthy();
      expect(getByTestId("test-card-content-panel")).toBeTruthy();
      expect(getByTestId("test-card-progress")).toBeTruthy();
      expect(getByTestId("test-card-title")).toBeTruthy();
      expect(getByTestId("test-card-next-button")).toBeTruthy();
    });

    it("should render back button with testID when present", () => {
      const stepData = { ...defaultStepData, stepNumber: 2 };

      const { getByTestId } = render(
        <OnboardingCarouselCard
          stepData={stepData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          testID="test-card"
        />
      );

      expect(getByTestId("test-card-back-button")).toBeTruthy();
    });
  });

  describe("Edge Cases", () => {
    it("should handle step 1 of 1", () => {
      const stepData = { ...defaultStepData, stepNumber: 1, totalSteps: 1 };

      const { getByLabelText } = render(
        <OnboardingCarouselCard
          stepData={stepData}
          onNext={mockOnNext}
        />
      );

      // Should show as complete since it's both first and last
      expect(getByLabelText("Complete onboarding")).toBeTruthy();
    });

    it("should render without back callback", () => {
      const stepData = { ...defaultStepData, stepNumber: 2 };

      const { queryByLabelText } = render(
        <OnboardingCarouselCard
          stepData={stepData}
          onNext={mockOnNext}
          // No onBack provided
        />
      );

      // Should not show back button without callback
      expect(queryByLabelText("Previous step")).toBeNull();
    });
  });
});
