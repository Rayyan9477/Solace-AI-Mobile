/**
 * StressorSelectorScreen Tests
 * @description Tests for TDD implementation of Screen 99
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { StressorSelectorScreen } from "./StressorSelectorScreen";

const defaultStressors = [
  { id: "work", label: "Work" },
  { id: "life", label: "Life" },
  { id: "relationship", label: "Relationship" },
  { id: "loneliness", label: "Loneliness" },
  { id: "finance", label: "Financial" },
  { id: "kids", label: "Kids" },
  { id: "other", label: "Other" },
];

const defaultProps = {
  stressors: defaultStressors,
  selectedStressorId: "loneliness",
  impactLevel: "Very High",
  onBack: jest.fn(),
  onStressorSelect: jest.fn(),
  onContinue: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<StressorSelectorScreen {...defaultProps} {...overrides} />);
}

describe("StressorSelectorScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Rendering
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("stressor-selector-screen")).toBeTruthy();
  });

  it("renders as a full-screen flex container", () => {
    const { getByTestId } = renderScreen();
    const container = getByTestId("stressor-selector-screen");
    expect(container.props.style).toEqual(expect.objectContaining({ flex: 1 }));
  });

  it("has dark background color", () => {
    const { getByTestId } = renderScreen();
    const container = getByTestId("stressor-selector-screen");
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
    expect(getByText("Select Stressors")).toBeTruthy();
  });

  it("title is white", () => {
    const { getByTestId } = renderScreen();
    const title = getByTestId("screen-title");
    const flatStyle = Object.assign({}, ...[].concat(title.props.style));
    expect(flatStyle.color).toBe("#FFFFFF");
  });

  // Subtitle - grammar fix applied: "impact" not "impacts"
  it("displays the subtitle with correct grammar", () => {
    const { getByText } = renderScreen();
    expect(
      getByText(
        "Our AI will decide how your stressor will impact your life in general.",
      ),
    ).toBeTruthy();
  });

  it("subtitle does NOT contain the grammar error 'impacts'", () => {
    const { getByTestId } = renderScreen();
    const subtitle = getByTestId("subtitle-text");
    expect(subtitle.props.children).not.toContain("impacts");
  });

  // Bubble Selector
  it("renders the bubble selector area", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("bubble-selector")).toBeTruthy();
  });

  it("renders a bubble for each stressor", () => {
    const { getByTestId } = renderScreen();
    defaultStressors.forEach((s) => {
      expect(getByTestId(`stressor-bubble-${s.id}`)).toBeTruthy();
    });
  });

  it("displays full label for each stressor (not truncated)", () => {
    const { getByText } = renderScreen();
    defaultStressors.forEach((s) => {
      expect(getByText(s.label)).toBeTruthy();
    });
  });

  it("calls onStressorSelect when a bubble is pressed", () => {
    const onStressorSelect = jest.fn();
    const { getByTestId } = renderScreen({ onStressorSelect });
    fireEvent.press(getByTestId("stressor-bubble-work"));
    expect(onStressorSelect).toHaveBeenCalledWith("work");
  });

  it("bubbles have accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(
      getByTestId("stressor-bubble-loneliness").props.accessibilityRole,
    ).toBe("button");
  });

  it("bubbles have accessibility labels", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("stressor-bubble-work").props.accessibilityLabel).toBe(
      "Select Work stressor",
    );
  });

  it("selected bubble has green background", () => {
    const { getByTestId } = renderScreen({ selectedStressorId: "loneliness" });
    const bubble = getByTestId("stressor-bubble-loneliness");
    const flatStyle = Object.assign({}, ...[].concat(bubble.props.style));
    expect(flatStyle.backgroundColor).toBe("#9AAD5C");
  });

  it("unselected bubble has brown background", () => {
    const { getByTestId } = renderScreen({ selectedStressorId: "loneliness" });
    const bubble = getByTestId("stressor-bubble-work");
    const flatStyle = Object.assign({}, ...[].concat(bubble.props.style));
    expect(flatStyle.backgroundColor).toBe("#3D2E23");
  });

  it("selected bubble is larger than unselected", () => {
    const { getByTestId } = renderScreen({ selectedStressorId: "loneliness" });
    const selected = getByTestId("stressor-bubble-loneliness");
    const unselected = getByTestId("stressor-bubble-work");
    const selectedStyle = Object.assign({}, ...[].concat(selected.props.style));
    const unselectedStyle = Object.assign(
      {},
      ...[].concat(unselected.props.style),
    );
    expect(selectedStyle.width).toBeGreaterThan(unselectedStyle.width);
    expect(selectedStyle.height).toBeGreaterThan(unselectedStyle.height);
  });

  // Impact Banner
  it("renders the impact banner", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("impact-banner")).toBeTruthy();
  });

  it("displays the impact level in the banner", () => {
    const { getByText } = renderScreen();
    expect(getByText(/Life Impact: Very High/)).toBeTruthy();
  });

  it("renders the warning icon in the banner", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("impact-warning-icon")).toBeTruthy();
  });

  it("impact banner has orange background", () => {
    const { getByTestId } = renderScreen();
    const banner = getByTestId("impact-banner");
    const flatStyle = Object.assign({}, ...[].concat(banner.props.style));
    expect(flatStyle.backgroundColor).toBe("#E8853A");
  });

  it("updates impact level text when prop changes", () => {
    const { getByText } = renderScreen({ impactLevel: "Low" });
    expect(getByText(/Life Impact: Low/)).toBeTruthy();
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
      "Continue to next step",
    );
  });

  it("continue button has brown/tan background", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("continue-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.backgroundColor).toBe("#C4A574");
  });

  it("continue button meets minimum touch target size", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("continue-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.minHeight).toBeGreaterThanOrEqual(44);
  });

  // Dynamic selection
  it("highlights work bubble when selected", () => {
    const { getByTestId } = renderScreen({ selectedStressorId: "work" });
    const workBubble = getByTestId("stressor-bubble-work");
    const lonelyBubble = getByTestId("stressor-bubble-loneliness");
    const workStyle = Object.assign({}, ...[].concat(workBubble.props.style));
    const lonelyStyle = Object.assign(
      {},
      ...[].concat(lonelyBubble.props.style),
    );
    expect(workStyle.backgroundColor).toBe("#9AAD5C");
    expect(lonelyStyle.backgroundColor).toBe("#3D2E23");
  });

  // Branding
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
