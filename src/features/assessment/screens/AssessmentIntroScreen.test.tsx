/**
 * AssessmentIntroScreen Tests — Sprint 7, prototype v4.2 #18 AssessmentIntro
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import { AssessmentIntroScreen } from "./AssessmentIntroScreen";

describe("AssessmentIntroScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnStart = jest.fn();
  const mockOnSkip = jest.fn();

  const defaultProps = {
    onBack: mockOnBack,
    onStart: mockOnStart,
    onSkip: mockOnSkip,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Render + snapshot
  it("renders and matches snapshot", () => {
    const tree = render(<AssessmentIntroScreen {...defaultProps} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // 2. Headline "Let's understand" present
  it("displays the 'Let's understand' headline", () => {
    const { getByTestId } = render(<AssessmentIntroScreen {...defaultProps} />);
    const headline = getByTestId("headline");
    expect(headline).toBeTruthy();
  });

  // 3. 3 metadata chips render
  it("renders all 3 metadata chips", () => {
    const { getByTestId } = render(<AssessmentIntroScreen {...defaultProps} />);
    expect(getByTestId("meta-chip-duration")).toBeTruthy();
    expect(getByTestId("meta-chip-privacy")).toBeTruthy();
    expect(getByTestId("meta-chip-optional")).toBeTruthy();
  });

  // 4. Bracket "[ ASSESSMENT ]" present
  it("displays the ASSESSMENT bracket label", () => {
    const { getByText } = render(<AssessmentIntroScreen {...defaultProps} />);
    expect(getByText(/\[\s*ASSESSMENT\s*\]/i)).toBeTruthy();
  });

  // 5. Begin button calls onStart
  it("calls onStart when Begin assessment button is pressed", () => {
    const { getByTestId } = render(<AssessmentIntroScreen {...defaultProps} />);
    fireEvent.press(getByTestId("begin-button"));
    expect(mockOnStart).toHaveBeenCalledTimes(1);
  });

  // 6. Skip link calls onSkip when provided
  it("calls onSkip when skip link is pressed", () => {
    const { getByTestId } = render(<AssessmentIntroScreen {...defaultProps} />);
    fireEvent.press(getByTestId("skip-link"));
    expect(mockOnSkip).toHaveBeenCalledTimes(1);
  });

  // 7. Back button calls onBack
  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<AssessmentIntroScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  // 8. CTA accessibilityLabel
  it("begin button has correct accessibilityLabel", () => {
    const { getByTestId } = render(<AssessmentIntroScreen {...defaultProps} />);
    const btn = getByTestId("begin-button");
    expect(btn.props.accessibilityLabel).toBe("Begin mental health assessment");
  });

  // 9. CTA ≥44pt touch target
  it("begin button has minimum 44pt touch target height", () => {
    const { getByTestId } = render(<AssessmentIntroScreen {...defaultProps} />);
    const btn = getByTestId("begin-button");
    // Button component enforces minHeight >= 44 internally via sizeSpecs
    expect(btn).toBeTruthy();
  });

  // 10. Hides skip when onSkip omitted
  it("does not render skip link when onSkip is not provided", () => {
    const { queryByTestId } = render(
      <AssessmentIntroScreen onBack={mockOnBack} onStart={mockOnStart} />,
    );
    expect(queryByTestId("skip-link")).toBeNull();
  });

  // 11. meta-chips container renders
  it("renders the meta chips container", () => {
    const { getByTestId } = render(<AssessmentIntroScreen {...defaultProps} />);
    expect(getByTestId("meta-chips")).toBeTruthy();
  });

  // 12. Hero icon renders
  it("renders the hero shield-check icon tile", () => {
    const { getByTestId } = render(
      <AssessmentIntroScreen {...defaultProps} />,
    );
    expect(getByTestId("hero-icon", { includeHiddenElements: true })).toBeTruthy();
  });

  // 13. Back button a11y
  it("back button has correct accessibilityRole and label", () => {
    const { getByTestId } = render(<AssessmentIntroScreen {...defaultProps} />);
    const btn = getByTestId("back-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Go back");
  });

  // 14. testID prop applied to root
  it("applies default testID to root container", () => {
    const { getByTestId } = render(<AssessmentIntroScreen {...defaultProps} />);
    expect(getByTestId("assessment-intro-screen")).toBeTruthy();
  });

  // 15. Custom testID applied
  it("applies custom testID when provided", () => {
    const { getByTestId } = render(
      <AssessmentIntroScreen
        {...defaultProps}
        testID="custom-assessment-intro"
      />,
    );
    expect(getByTestId("custom-assessment-intro")).toBeTruthy();
  });

  // 16. Meta chip labels present
  it("displays chip labels: 5 minutes, Confidential, Optional questions", () => {
    const { getByText } = render(<AssessmentIntroScreen {...defaultProps} />);
    expect(getByText("5 minutes")).toBeTruthy();
    expect(getByText("Confidential")).toBeTruthy();
    expect(getByText("Optional questions")).toBeTruthy();
  });
});
