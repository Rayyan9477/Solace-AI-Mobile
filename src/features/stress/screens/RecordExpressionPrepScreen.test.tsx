/**
 * RecordExpressionPrepScreen Tests
 * @description Tests for TDD implementation of Screen 100
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { RecordExpressionPrepScreen } from "./RecordExpressionPrepScreen";

const defaultRequirements = [
  { id: "lighting", label: "Brightly Lit Room", icon: "\u2600\uFE0F" },
  { id: "expression", label: "Clear Face Expression", icon: "\uD83D\uDCCD" },
  { id: "stillness", label: "Stay Still", icon: "\uD83D\uDE0A" },
  { id: "camera", label: "720P Camera", icon: "\uD83D\uDCF7" },
];

const defaultProps = {
  requirements: defaultRequirements,
  onBack: jest.fn(),
  onSkip: jest.fn(),
  onContinue: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(
    <RecordExpressionPrepScreen {...defaultProps} {...overrides} />,
  );
}

describe("RecordExpressionPrepScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Rendering
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("record-expression-prep-screen")).toBeTruthy();
  });

  it("renders as a full-screen flex container", () => {
    const { getByTestId } = renderScreen();
    const container = getByTestId("record-expression-prep-screen");
    expect(container.props.style).toEqual(expect.objectContaining({ flex: 1 }));
  });

  it("has dark background color", () => {
    const { getByTestId } = renderScreen();
    const container = getByTestId("record-expression-prep-screen");
    expect(container.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#1C1410" }),
    );
  });

  // Back Button
  it("renders the back button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("back button has accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button").props.accessibilityRole).toBe("button");
  });

  it("back button has accessibilityLabel", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button").props.accessibilityLabel).toBe("Go back");
  });

  it("back button meets minimum touch target size", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("back-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.minHeight).toBeGreaterThanOrEqual(44);
    expect(flatStyle.minWidth).toBeGreaterThanOrEqual(44);
  });

  // Title
  it("displays the screen title", () => {
    const { getByText } = renderScreen();
    expect(getByText("Record Expression")).toBeTruthy();
  });

  it("title is white", () => {
    const { getByTestId } = renderScreen();
    const title = getByTestId("screen-title");
    const flatStyle = Object.assign({}, ...[].concat(title.props.style));
    expect(flatStyle.color).toBe("#FFFFFF");
  });

  // Subtitle
  it("displays the subtitle text", () => {
    const { getByText } = renderScreen();
    expect(
      getByText(/Let's analyze face expression for better stress AI analysis/),
    ).toBeTruthy();
  });

  // Requirement Cards
  it("renders a card for each requirement", () => {
    const { getByTestId } = renderScreen();
    defaultRequirements.forEach((req) => {
      expect(getByTestId(`requirement-card-${req.id}`)).toBeTruthy();
    });
  });

  it("displays the label for each requirement", () => {
    const { getByText } = renderScreen();
    defaultRequirements.forEach((req) => {
      expect(getByText(req.label)).toBeTruthy();
    });
  });

  it("renders the icon for each requirement", () => {
    const { getByTestId } = renderScreen();
    defaultRequirements.forEach((req) => {
      expect(getByTestId(`requirement-icon-${req.id}`)).toBeTruthy();
    });
  });

  it("requirement cards have brown background", () => {
    const { getByTestId } = renderScreen();
    const card = getByTestId("requirement-card-lighting");
    const flatStyle = Object.assign({}, ...[].concat(card.props.style));
    expect(flatStyle.backgroundColor).toBe("#2A1F18");
  });

  it("requirement labels are white", () => {
    const { getByTestId } = renderScreen();
    const label = getByTestId("requirement-label-lighting");
    const flatStyle = Object.assign({}, ...[].concat(label.props.style));
    expect(flatStyle.color).toBe("#FFFFFF");
  });

  // Skip Button
  it("renders the skip button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("skip-button")).toBeTruthy();
  });

  it("skip button displays correct text", () => {
    const { getByText } = renderScreen();
    expect(getByText(/Skip This Step/)).toBeTruthy();
  });

  it("calls onSkip when skip button is pressed", () => {
    const onSkip = jest.fn();
    const { getByTestId } = renderScreen({ onSkip });
    fireEvent.press(getByTestId("skip-button"));
    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it("skip button has accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("skip-button").props.accessibilityRole).toBe("button");
  });

  it("skip button has accessibilityLabel", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("skip-button").props.accessibilityLabel).toBe(
      "Skip this step",
    );
  });

  it("skip button has orange background", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("skip-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.backgroundColor).toBe("#E8853A");
  });

  it("skip button meets minimum touch target size", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("skip-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.minHeight).toBeGreaterThanOrEqual(44);
  });

  // Continue Button
  it("renders the continue button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("continue-button")).toBeTruthy();
  });

  it("continue button displays correct text", () => {
    const { getByText } = renderScreen();
    expect(getByText(/Continue/)).toBeTruthy();
  });

  it("calls onContinue when continue button is pressed", () => {
    const onContinue = jest.fn();
    const { getByTestId } = renderScreen({ onContinue });
    fireEvent.press(getByTestId("continue-button"));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it("continue button has accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("continue-button").props.accessibilityRole).toBe(
      "button",
    );
  });

  it("continue button has accessibilityLabel", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("continue-button").props.accessibilityLabel).toBe(
      "Continue to camera",
    );
  });

  it("continue button has olive green background", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("continue-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.backgroundColor).toBe("#9AAD5C");
  });

  it("continue button meets minimum touch target size", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("continue-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.minHeight).toBeGreaterThanOrEqual(44);
  });

  // Branding
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
