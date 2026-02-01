/**
 * SendFeedbackScreen Tests
 * @description Tests for feedback form with category chips
 * @task Task 3.17.14: Send Feedback Screen (Screen 153)
 * @audit-fix "Which of the area" → "Which area" (Issue #41)
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { SendFeedbackScreen } from "./SendFeedbackScreen";

const defaultProps = {
  categories: [
    { id: "performance", label: "Performance", selected: false },
    { id: "bug", label: "Bug", selected: true },
    { id: "ui-ux", label: "UI/UX", selected: false },
    { id: "crashes", label: "Crashes", selected: false },
    { id: "loading", label: "Loading", selected: false },
    { id: "support", label: "Support", selected: true },
    { id: "navigation", label: "Navigation", selected: true },
    { id: "pricing", label: "Pricing Scheme", selected: false },
    { id: "other", label: "Other", selected: false },
    { id: "ai-ml", label: "AI/ML", selected: false },
    { id: "slow-response", label: "Slow Response", selected: true },
  ],
  onBack: jest.fn(),
  onCategoryToggle: jest.fn(),
  onSubmit: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<SendFeedbackScreen {...defaultProps} {...overrides} />);
}

beforeEach(() => jest.clearAllMocks());

describe("SendFeedbackScreen", () => {
  // ── Rendering ──────────────────────────────────────────
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("send-feedback-screen")).toBeTruthy();
  });

  it("renders the back button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("renders 'Send Feedback' title", () => {
    const { getByText } = renderScreen();
    expect(getByText("Send Feedback")).toBeTruthy();
  });

  it("renders question text with corrected grammar", () => {
    const { getByText } = renderScreen();
    expect(getByText(/Which area needs improvement/)).toBeTruthy();
  });

  it("renders all category chips", () => {
    const { getByText } = renderScreen();
    expect(getByText("Performance")).toBeTruthy();
    expect(getByText("Bug")).toBeTruthy();
    expect(getByText("UI/UX")).toBeTruthy();
    expect(getByText("Crashes")).toBeTruthy();
    expect(getByText("Loading")).toBeTruthy();
    expect(getByText("Support")).toBeTruthy();
    expect(getByText("Navigation")).toBeTruthy();
    expect(getByText("Pricing Scheme")).toBeTruthy();
    expect(getByText("Other")).toBeTruthy();
    expect(getByText("AI/ML")).toBeTruthy();
    expect(getByText("Slow Response")).toBeTruthy();
  });

  it("renders the submit button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("submit-button")).toBeTruthy();
  });

  it("renders the emoji indicator", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("emoji-indicator")).toBeTruthy();
  });

  // ── Audit Fix ──────────────────────────────────────────
  it("does not contain 'Which of the area'", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/Which of the area/)).toBeNull();
  });

  // ── Callbacks ──────────────────────────────────────────
  it("calls onBack when back button is pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls onCategoryToggle when chip is pressed", () => {
    const onCategoryToggle = jest.fn();
    const { getByTestId } = renderScreen({ onCategoryToggle });
    fireEvent.press(getByTestId("chip-performance"));
    expect(onCategoryToggle).toHaveBeenCalledWith("performance");
  });

  it("calls onSubmit when submit button is pressed", () => {
    const onSubmit = jest.fn();
    const { getByTestId } = renderScreen({ onSubmit });
    fireEvent.press(getByTestId("submit-button"));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  // ── Accessibility ──────────────────────────────────────
  it("back button has accessibilityLabel 'Go back'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button").props.accessibilityLabel).toBe("Go back");
  });

  it("back button meets 44×44 minimum touch target", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("back-button").props.style),
    );
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
    expect(style.minWidth).toBeGreaterThanOrEqual(44);
  });

  it("submit button meets 44px minimum touch height", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("submit-button").props.style),
    );
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
  });

  // ── Branding ───────────────────────────────────────────
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
