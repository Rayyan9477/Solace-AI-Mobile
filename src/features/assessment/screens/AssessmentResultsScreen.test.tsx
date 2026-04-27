/**
 * AssessmentResultsScreen Tests — prototype v4.2 #19 reskin (Sprint 6).
 *
 * Verifies render, prop variants, navigation/interaction, and a11y for the
 * cosmic-editorial Assessment Results screen.
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AssessmentResultsScreen } from "./AssessmentResultsScreen";

describe("AssessmentResultsScreen (prototype v4.2)", () => {
  const onContinue = jest.fn();
  const onViewDetails = jest.fn();
  const onShare = jest.fn();

  const baseProps = {
    score: 68,
    category: "unstable" as const,
    breakdown: [
      { label: "Mood", score: 72, color: "#9BC4B0", note: "Feeling balanced" },
      { label: "Stress", score: 58, color: "#F4A77E", note: "A bit elevated" },
      { label: "Sleep", score: 81, color: "#A89AE0", note: "Sleeping well" },
      { label: "Social", score: 62, color: "#8AA3FF", note: "Could connect more" },
    ],
    recommendations: [
      { iconName: "wind", label: "Try the 4-7-8 breathing exercise", duration: "4 min" },
      { iconName: "book-open", label: "Journal about your stressors", duration: "10 min" },
      { iconName: "message-circle", label: "Talk to Solace about work", duration: "Now" },
    ],
    onContinue,
    onViewDetails,
  };

  beforeEach(() => {
    onContinue.mockClear();
    onViewDetails.mockClear();
    onShare.mockClear();
  });

  it("renders the screen", () => {
    const { getByTestId } = render(<AssessmentResultsScreen {...baseProps} />);
    expect(getByTestId("assessment-results-screen")).toBeTruthy();
  });

  it("matches snapshot", () => {
    const tree = render(<AssessmentResultsScreen {...baseProps} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders the bracket date label", () => {
    const { getByText } = render(
      <AssessmentResultsScreen {...baseProps} dateLabel="April 9 · 4 min ago" />,
    );
    // BracketLabel uppercases internally → "[ APRIL 9 · 4 MIN AGO ]"
    expect(getByText(/APRIL 9/)).toBeTruthy();
  });

  it("renders the score number inside the ring", () => {
    const { getByTestId } = render(<AssessmentResultsScreen {...baseProps} />);
    expect(getByTestId("score-value").props.children).toBe("68");
  });

  it("renders the score ring with progressbar a11y", () => {
    const { getByTestId } = render(<AssessmentResultsScreen {...baseProps} />);
    const ring = getByTestId("score-ring");
    expect(ring.props.accessibilityRole).toBe("progressbar");
    expect(ring.props.accessibilityValue).toMatchObject({ min: 0, max: 100, now: 68 });
  });

  it("renders the category bracket label", () => {
    const { getByText } = render(<AssessmentResultsScreen {...baseProps} />);
    expect(getByText(/MODERATE/)).toBeTruthy();
  });

  it("changes category label for healthy", () => {
    const { getByText } = render(
      <AssessmentResultsScreen {...baseProps} category="healthy" score={85} />,
    );
    expect(getByText(/EXCELLENT/)).toBeTruthy();
  });

  it("changes category label for critical", () => {
    const { getByText } = render(
      <AssessmentResultsScreen {...baseProps} category="critical" score={28} />,
    );
    expect(getByText(/NEEDS ATTENTION/)).toBeTruthy();
  });

  it("renders all 4 breakdown items", () => {
    const { getByText } = render(<AssessmentResultsScreen {...baseProps} />);
    expect(getByText("Mood")).toBeTruthy();
    expect(getByText("Stress")).toBeTruthy();
    expect(getByText("Sleep")).toBeTruthy();
    expect(getByText("Social")).toBeTruthy();
  });

  it("renders breakdown notes when provided", () => {
    const { getByText } = render(<AssessmentResultsScreen {...baseProps} />);
    expect(getByText("Feeling balanced")).toBeTruthy();
    expect(getByText("A bit elevated")).toBeTruthy();
  });

  it("renders recommendations section", () => {
    const { getByTestId } = render(<AssessmentResultsScreen {...baseProps} />);
    expect(getByTestId("recommendations-section")).toBeTruthy();
  });

  it("renders all 3 recommendation rows", () => {
    const { getByText } = render(<AssessmentResultsScreen {...baseProps} />);
    expect(getByText(/4-7-8 breathing exercise/)).toBeTruthy();
    expect(getByText(/Journal about your stressors/)).toBeTruthy();
    expect(getByText(/Talk to Solace about work/)).toBeTruthy();
  });

  it("renders the medical disclaimer", () => {
    const { getByTestId } = render(<AssessmentResultsScreen {...baseProps} />);
    const disclaimer = getByTestId("medical-disclaimer");
    expect(disclaimer.props.children).toMatch(/Not a medical diagnosis/);
  });

  it("calls onContinue when sticky CTA is pressed", () => {
    const { getByTestId } = render(<AssessmentResultsScreen {...baseProps} />);
    fireEvent.press(getByTestId("continue-button"));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it("calls onViewDetails when details link is pressed", () => {
    const { getByTestId } = render(<AssessmentResultsScreen {...baseProps} />);
    fireEvent.press(getByTestId("view-details-button"));
    expect(onViewDetails).toHaveBeenCalledTimes(1);
  });

  it("hides share button when onShare is omitted", () => {
    const { queryByTestId } = render(<AssessmentResultsScreen {...baseProps} />);
    expect(queryByTestId("share-button")).toBeNull();
  });

  it("shows + invokes share button when onShare is provided", () => {
    const { getByTestId } = render(
      <AssessmentResultsScreen {...baseProps} onShare={onShare} />,
    );
    fireEvent.press(getByTestId("share-button"));
    expect(onShare).toHaveBeenCalledTimes(1);
  });

  it("invokes a recommendation onPress when row is tapped", () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AssessmentResultsScreen
        {...baseProps}
        recommendations={[
          { iconName: "wind", label: "Breathe", duration: "4 min", onPress },
        ]}
      />,
    );
    fireEvent.press(getByTestId("rec-breathe"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("accepts legacy string[] recommendations and renders them", () => {
    const { getByText } = render(
      <AssessmentResultsScreen
        {...baseProps}
        recommendations={[
          "Continue your current wellness routine",
          "Add meditation to your daily practice",
        ]}
      />,
    );
    expect(getByText(/Continue your current wellness routine/)).toBeTruthy();
    expect(getByText(/Add meditation to your daily practice/)).toBeTruthy();
  });

  it("CTA has accessibility role + label", () => {
    const { getByTestId } = render(<AssessmentResultsScreen {...baseProps} />);
    const cta = getByTestId("continue-button");
    expect(cta.props.accessibilityLabel).toBe("Continue to Solace");
  });

  it("CTA meets 44pt minimum touch target", () => {
    const { getByTestId } = render(<AssessmentResultsScreen {...baseProps} />);
    const cta = getByTestId("continue-button");
    const flat = (Array.isArray(cta.props.style) ? cta.props.style.flat() : [cta.props.style])
      .filter(Boolean)
      .reduce((acc, s) => ({ ...acc, ...s }), {} as Record<string, unknown>);
    expect((flat.height as number) ?? (flat.minHeight as number)).toBeGreaterThanOrEqual(44);
  });
});
