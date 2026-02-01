/**
 * HelpCenterScreen Tests
 * @description Tests for FAQ accordion + Live Chat tabs
 * @task Task 3.17.10: Help Center Screen (Screen 149)
 * @audit-fix "freud.ai" → "Solace" in FAQ questions
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { HelpCenterScreen } from "./HelpCenterScreen";

const defaultProps = {
  activeTab: "faq" as const,
  searchQuery: "",
  faqs: [
    {
      id: "1",
      question: "What is Solace?",
      answer: "Solace is an advanced mental health chatbot app.",
      isExpanded: true,
    },
    {
      id: "2",
      question: "How does Solace AI work?",
      answer: "Solace AI uses machine learning.",
      isExpanded: false,
    },
    {
      id: "3",
      question: "Is Solace a replacement for professional therapy?",
      answer: "No, it is a supplement.",
      isExpanded: false,
    },
    {
      id: "4",
      question: "How do I access Solace?",
      answer: "Download from the app store.",
      isExpanded: false,
    },
    {
      id: "5",
      question: "Is Solace free to use?",
      answer: "Basic features are free.",
      isExpanded: false,
    },
    {
      id: "6",
      question: "Is my data secure?",
      answer: "Yes, we use encryption.",
      isExpanded: false,
    },
  ],
  onBack: jest.fn(),
  onTabSelect: jest.fn(),
  onSearchChange: jest.fn(),
  onFaqToggle: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<HelpCenterScreen {...defaultProps} {...overrides} />);
}

beforeEach(() => jest.clearAllMocks());

describe("HelpCenterScreen", () => {
  // ── Rendering ──────────────────────────────────────────
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("help-center-screen")).toBeTruthy();
  });

  it("renders the back button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("renders 'Help Center' title", () => {
    const { getByText } = renderScreen();
    expect(getByText("Help Center")).toBeTruthy();
  });

  it("renders FAQ and Live Chat tabs", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("tab-faq")).toBeTruthy();
    expect(getByTestId("tab-live-chat")).toBeTruthy();
  });

  it("renders the search bar", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("search-input")).toBeTruthy();
  });

  it("renders FAQ questions", () => {
    const { getByText } = renderScreen();
    expect(getByText("What is Solace?")).toBeTruthy();
    expect(getByText("How does Solace AI work?")).toBeTruthy();
    expect(getByText("Is my data secure?")).toBeTruthy();
  });

  it("renders expanded FAQ answer", () => {
    const { getByText } = renderScreen();
    expect(getByText(/advanced mental health chatbot/)).toBeTruthy();
  });

  it("does not render collapsed FAQ answers", () => {
    const { queryByText } = renderScreen();
    expect(queryByText("Solace AI uses machine learning.")).toBeNull();
  });

  // ── Audit Fix ──────────────────────────────────────────
  it("uses 'Solace' not 'freud.ai' in FAQ questions", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud\.ai/i)).toBeNull();
    expect(queryByText(/freud/i)).toBeNull();
  });

  // ── Callbacks ──────────────────────────────────────────
  it("calls onBack when back button is pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls onTabSelect when Live Chat tab is pressed", () => {
    const onTabSelect = jest.fn();
    const { getByTestId } = renderScreen({ onTabSelect });
    fireEvent.press(getByTestId("tab-live-chat"));
    expect(onTabSelect).toHaveBeenCalledWith("live-chat");
  });

  it("calls onFaqToggle when FAQ item is pressed", () => {
    const onFaqToggle = jest.fn();
    const { getByTestId } = renderScreen({ onFaqToggle });
    fireEvent.press(getByTestId("faq-2"));
    expect(onFaqToggle).toHaveBeenCalledWith("2");
  });

  it("calls onSearchChange when search text changes", () => {
    const onSearchChange = jest.fn();
    const { getByTestId } = renderScreen({ onSearchChange });
    fireEvent.changeText(getByTestId("search-input"), "data");
    expect(onSearchChange).toHaveBeenCalledWith("data");
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

  // ── Styling ────────────────────────────────────────────
  it("applies dark background to the container", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("help-center-screen").props.style),
    );
    expect(style.backgroundColor).toBe("#1C1410");
  });

  // ── Branding ───────────────────────────────────────────
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
