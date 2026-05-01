/**
 * CbtThoughtRecordScreen Tests — prototype v4.2 #27 (Sprint 8).
 *
 * Behavior-focused: render, mini-header, step counter, stepper, previous-step
 * card visibility, textarea wiring, distortion chip toggling (only on step 2),
 * back / next callbacks, a11y.
 */

jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () =>
  jest.requireActual("@/shared/theme/useTheme"),
);

import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import { ThemeProvider } from "@/shared/theme/useTheme";
import {
  CbtThoughtRecordScreen,
  type CbtThoughtRecordScreenProps,
} from "./CbtThoughtRecordScreen";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const baseProps: CbtThoughtRecordScreenProps = {
  currentStep: 2,
  situation:
    "I have a team meeting at 3 PM and I'll need to present an update.",
  thought: "I'm going to mess this up and everyone will judge me for it.",
  selectedDistortions: ["Catastrophizing", "Mind reading"],
  emotion: "",
  reframe: "",
  action: "",
  onTextChange: jest.fn(),
  onToggleDistortion: jest.fn(),
  onBack: jest.fn(),
  onNext: jest.fn(),
};

describe("CbtThoughtRecordScreen (v4.2 #27)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen container", () => {
    const { getByTestId } = renderWithTheme(
      <CbtThoughtRecordScreen {...baseProps} />,
    );
    expect(getByTestId("cbt-thought-record-screen")).toBeTruthy();
  });

  it("renders mini-header 'Thought record'", () => {
    const { getByText, getByTestId } = renderWithTheme(
      <CbtThoughtRecordScreen {...baseProps} />,
    );
    expect(getByTestId("mini-header-title")).toBeTruthy();
    expect(getByText("Thought record")).toBeTruthy();
  });

  it("renders the step counter '{n} of 5'", () => {
    const { getByTestId } = renderWithTheme(
      <CbtThoughtRecordScreen {...baseProps} currentStep={3} />,
    );
    expect(getByTestId("step-counter").props.children).toBe("3 of 5");
  });

  it("renders the editorial bracket kicker (aurora)", () => {
    const { getByText } = renderWithTheme(
      <CbtThoughtRecordScreen {...baseProps} />,
    );
    expect(getByText(/COGNITIVE BEHAVIORAL THERAPY/)).toBeTruthy();
  });

  it("renders the stepper organism", () => {
    const { getByTestId } = renderWithTheme(
      <CbtThoughtRecordScreen {...baseProps} />,
    );
    expect(getByTestId("cbt-stepper")).toBeTruthy();
  });

  it("hides previous-answer card on step 1", () => {
    const { queryByTestId } = renderWithTheme(
      <CbtThoughtRecordScreen {...baseProps} currentStep={1} />,
    );
    expect(queryByTestId("previous-answer-card")).toBeNull();
  });

  it("shows previous-answer card on step 2 when step 1 has data", () => {
    const { getByTestId } = renderWithTheme(
      <CbtThoughtRecordScreen
        {...baseProps}
        currentStep={2}
        situation="Big meeting later."
      />,
    );
    expect(getByTestId("previous-answer-card")).toBeTruthy();
  });

  it("hides previous-answer card on step 2 if step 1 is empty", () => {
    const { queryByTestId } = renderWithTheme(
      <CbtThoughtRecordScreen
        {...baseProps}
        currentStep={2}
        situation=""
      />,
    );
    expect(queryByTestId("previous-answer-card")).toBeNull();
  });

  it("renders the textarea with the current step's value", () => {
    const { getByTestId } = renderWithTheme(
      <CbtThoughtRecordScreen {...baseProps} />,
    );
    const input = getByTestId("thought-input");
    expect(input.props.value).toBe(
      "I'm going to mess this up and everyone will judge me for it.",
    );
  });

  it("invokes onTextChange with current field when textarea changes", () => {
    const onTextChange = jest.fn();
    const { getByTestId } = renderWithTheme(
      <CbtThoughtRecordScreen
        {...baseProps}
        currentStep={3}
        onTextChange={onTextChange}
      />,
    );
    fireEvent.changeText(getByTestId("thought-input"), "Anxious 8/10");
    expect(onTextChange).toHaveBeenCalledWith("emotion", "Anxious 8/10");
  });

  it("renders distortion chips only on step 2", () => {
    const { getByTestId } = renderWithTheme(
      <CbtThoughtRecordScreen {...baseProps} currentStep={2} />,
    );
    expect(getByTestId("distortion-chips")).toBeTruthy();
    expect(getByTestId("distortion-chip-Catastrophizing")).toBeTruthy();
  });

  it("does not render distortion chips on other steps", () => {
    const { queryByTestId } = renderWithTheme(
      <CbtThoughtRecordScreen {...baseProps} currentStep={3} />,
    );
    expect(queryByTestId("distortion-chips")).toBeNull();
    expect(queryByTestId("distortion-chip-Catastrophizing")).toBeNull();
  });

  it("marks selected distortions via accessibilityState", () => {
    const { getByTestId } = renderWithTheme(
      <CbtThoughtRecordScreen {...baseProps} />,
    );
    const selected = getByTestId("distortion-chip-Catastrophizing");
    const unselected = getByTestId("distortion-chip-Personalization");
    expect(selected.props.accessibilityState.selected).toBe(true);
    expect(unselected.props.accessibilityState.selected).toBe(false);
  });

  it("invokes onToggleDistortion with chip label when chip pressed", () => {
    const onToggleDistortion = jest.fn();
    const { getByTestId } = renderWithTheme(
      <CbtThoughtRecordScreen
        {...baseProps}
        onToggleDistortion={onToggleDistortion}
      />,
    );
    fireEvent.press(getByTestId("distortion-chip-Personalization"));
    expect(onToggleDistortion).toHaveBeenCalledWith("Personalization");
  });

  it("renders the back button with a11y", () => {
    const { getByTestId } = renderWithTheme(
      <CbtThoughtRecordScreen {...baseProps} />,
    );
    const btn = getByTestId("back-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Go back");
  });

  it("invokes onBack when back is pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderWithTheme(
      <CbtThoughtRecordScreen {...baseProps} onBack={onBack} />,
    );
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("renders the 'Next step' CTA", () => {
    const { getByTestId, getByText } = renderWithTheme(
      <CbtThoughtRecordScreen {...baseProps} />,
    );
    expect(getByTestId("next-step-button")).toBeTruthy();
    expect(getByText("Next step")).toBeTruthy();
  });

  it("invokes onNext when CTA pressed", () => {
    const onNext = jest.fn();
    const { getByTestId } = renderWithTheme(
      <CbtThoughtRecordScreen {...baseProps} onNext={onNext} />,
    );
    fireEvent.press(getByTestId("next-step-button"));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("step copy changes per step (step 4 = reframe)", () => {
    const { getByTestId } = renderWithTheme(
      <CbtThoughtRecordScreen {...baseProps} currentStep={4} />,
    );
    const prompt = getByTestId("question-prompt").props.children;
    expect(String(prompt)).toMatch(/friend/i);
  });

  it("renders the headline 'Let's examine that thought.'", () => {
    const { getByTestId } = renderWithTheme(
      <CbtThoughtRecordScreen {...baseProps} />,
    );
    const text = JSON.stringify(getByTestId("headline").props.children);
    expect(text).toContain("examine");
    expect(text).toContain("that thought");
  });
});
