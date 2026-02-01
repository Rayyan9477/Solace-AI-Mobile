/**
 * SoundscapesScreen Tests
 * @description Tests for TDD implementation of Screen 108
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { SoundscapesScreen } from "./SoundscapesScreen";

const defaultSoundscapes = [
  { id: "birds", name: "Birds" },
  { id: "zen", name: "Zen Garden" },
  { id: "stream", name: "Mountain Stream" },
  { id: "hiking", name: "Hiking Trail" },
];

const defaultProps = {
  soundscapes: defaultSoundscapes,
  selectedSoundscapeId: "zen",
  stepLabel: "3 of 3",
  searchQuery: "",
  onBack: jest.fn(),
  onSoundscapeSelect: jest.fn(),
  onSearchChange: jest.fn(),
  onContinue: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<SoundscapesScreen {...defaultProps} {...overrides} />);
}

describe("SoundscapesScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Rendering
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("soundscapes-screen")).toBeTruthy();
  });

  it("renders as a full-screen flex container", () => {
    const { getByTestId } = renderScreen();
    const container = getByTestId("soundscapes-screen");
    expect(container.props.style).toEqual(expect.objectContaining({ flex: 1 }));
  });

  it("has dark background color", () => {
    const { getByTestId } = renderScreen();
    const container = getByTestId("soundscapes-screen");
    expect(container.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#1C1410" }),
    );
  });

  // Header
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

  it("displays 'New Exercise' header title", () => {
    const { getByText } = renderScreen();
    expect(getByText("New Exercise")).toBeTruthy();
  });

  // Step Indicator
  it("displays the step indicator", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("step-indicator")).toBeTruthy();
  });

  it("step indicator shows correct step label", () => {
    const { getByText } = renderScreen();
    expect(getByText("3 of 3")).toBeTruthy();
  });

  // Section Title
  it("displays 'Select Soundscapes' title", () => {
    const { getByText } = renderScreen();
    expect(getByText("Select Soundscapes")).toBeTruthy();
  });

  it("section title is white and large", () => {
    const { getByTestId } = renderScreen();
    const title = getByTestId("section-title");
    const flatStyle = Object.assign({}, ...[].concat(title.props.style));
    expect(flatStyle.color).toBe("#FFFFFF");
    expect(flatStyle.fontSize).toBeGreaterThanOrEqual(24);
  });

  // Audio Waveform
  it("renders the audio waveform", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("audio-waveform")).toBeTruthy();
  });

  // Soundscape Chips
  it("renders a chip for each soundscape", () => {
    const { getByTestId } = renderScreen();
    defaultSoundscapes.forEach((s) => {
      expect(getByTestId(`soundscape-chip-${s.id}`)).toBeTruthy();
    });
  });

  it("displays soundscape names on chips", () => {
    const { getByText } = renderScreen();
    defaultSoundscapes.forEach((s) => {
      expect(getByText(s.name)).toBeTruthy();
    });
  });

  it("selected chip has orange background", () => {
    const { getByTestId } = renderScreen();
    const chip = getByTestId("soundscape-chip-zen");
    const flatStyle = Object.assign({}, ...[].concat(chip.props.style));
    expect(flatStyle.backgroundColor).toBe("#E8853A");
  });

  it("unselected chip has dark background", () => {
    const { getByTestId } = renderScreen();
    const chip = getByTestId("soundscape-chip-birds");
    const flatStyle = Object.assign({}, ...[].concat(chip.props.style));
    expect(flatStyle.backgroundColor).toBe("#2A1F18");
  });

  it("calls onSoundscapeSelect when chip is pressed", () => {
    const onSoundscapeSelect = jest.fn();
    const { getByTestId } = renderScreen({ onSoundscapeSelect });
    fireEvent.press(getByTestId("soundscape-chip-birds"));
    expect(onSoundscapeSelect).toHaveBeenCalledWith("birds");
  });

  it("chips have accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("soundscape-chip-birds").props.accessibilityRole).toBe(
      "button",
    );
  });

  it("chips meet minimum touch target size", () => {
    const { getByTestId } = renderScreen();
    const chip = getByTestId("soundscape-chip-birds");
    const flatStyle = Object.assign({}, ...[].concat(chip.props.style));
    expect(flatStyle.minHeight).toBeGreaterThanOrEqual(44);
  });

  // Search Input
  it("renders the search input", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("search-input")).toBeTruthy();
  });

  it("search input has placeholder text", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("search-input").props.placeholder).toBe(
      "Search Soundscapes",
    );
  });

  it("calls onSearchChange when text is entered", () => {
    const onSearchChange = jest.fn();
    const { getByTestId } = renderScreen({ onSearchChange });
    fireEvent.changeText(getByTestId("search-input"), "Birds");
    expect(onSearchChange).toHaveBeenCalledWith("Birds");
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
      "Continue to start exercise",
    );
  });

  it("continue button has tan background", () => {
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

  // Dynamic Props
  it("highlights different selected soundscape", () => {
    const { getByTestId } = renderScreen({ selectedSoundscapeId: "stream" });
    const chip = getByTestId("soundscape-chip-stream");
    const flatStyle = Object.assign({}, ...[].concat(chip.props.style));
    expect(flatStyle.backgroundColor).toBe("#E8853A");
  });

  // Branding
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
