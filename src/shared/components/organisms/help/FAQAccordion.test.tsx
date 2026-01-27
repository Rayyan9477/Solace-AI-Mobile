import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { FAQAccordion } from "./FAQAccordion";

describe("FAQAccordion", () => {
  const mockOnPress = jest.fn();

  const defaultProps = {
    id: "faq-1",
    question: "What is freud.ai?",
    answer: "Freud AI is an advanced mental health chatbot app that utilizes artificial intelligence to provide personalized support.",
    onPress: mockOnPress,
    testID: "faq-accordion",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component", () => {
    const { getByTestId } = render(<FAQAccordion {...defaultProps} />);
    expect(getByTestId("faq-accordion")).toBeTruthy();
  });

  it("displays the question", () => {
    const { getByText } = render(<FAQAccordion {...defaultProps} />);
    expect(getByText("What is freud.ai?")).toBeTruthy();
  });

  it("does not display answer when collapsed", () => {
    const { queryByText } = render(<FAQAccordion {...defaultProps} isExpanded={false} />);
    expect(queryByText("Freud AI is an advanced mental health chatbot app")).toBeNull();
  });

  it("displays answer when expanded", () => {
    const { getByText } = render(<FAQAccordion {...defaultProps} isExpanded={true} />);
    expect(getByText(/Freud AI is an advanced mental health chatbot app/)).toBeTruthy();
  });

  it("shows down chevron when collapsed", () => {
    const { getByText } = render(<FAQAccordion {...defaultProps} isExpanded={false} />);
    expect(getByText("⌄")).toBeTruthy();
  });

  it("shows up chevron when expanded", () => {
    const { getByText } = render(<FAQAccordion {...defaultProps} isExpanded={true} />);
    expect(getByText("⌃")).toBeTruthy();
  });

  it("calls onPress when tapped", () => {
    const { getByTestId } = render(<FAQAccordion {...defaultProps} />);
    fireEvent.press(getByTestId("faq-accordion"));
    expect(mockOnPress).toHaveBeenCalledWith("faq-1");
  });

  it("defaults to collapsed state", () => {
    const { queryByText } = render(<FAQAccordion {...defaultProps} />);
    expect(queryByText("Freud AI is an advanced mental health chatbot app")).toBeNull();
  });

  it("applies custom styles", () => {
    const customStyle = { marginTop: 20 };
    const { getByTestId } = render(<FAQAccordion {...defaultProps} style={customStyle} />);
    const accordion = getByTestId("faq-accordion");
    expect(accordion.props.style).toEqual(expect.objectContaining(customStyle));
  });

  it("has correct accessibility role", () => {
    const { getByTestId } = render(<FAQAccordion {...defaultProps} />);
    const accordion = getByTestId("faq-accordion");
    expect(accordion.props.accessibilityRole).toBe("button");
  });

  it("uses custom accessibilityLabel if provided", () => {
    const { getByTestId } = render(<FAQAccordion {...defaultProps} accessibilityLabel="Custom label" />);
    const accordion = getByTestId("faq-accordion");
    expect(accordion.props.accessibilityLabel).toBe("Custom label");
  });

  it("uses default accessibilityLabel based on question", () => {
    const { getByTestId } = render(<FAQAccordion {...defaultProps} />);
    const accordion = getByTestId("faq-accordion");
    expect(accordion.props.accessibilityLabel).toBe("FAQ: What is freud.ai?");
  });

  it("includes expanded state in accessibility state", () => {
    const { getByTestId } = render(<FAQAccordion {...defaultProps} isExpanded={true} />);
    const accordion = getByTestId("faq-accordion");
    expect(accordion.props.accessibilityState).toEqual({ expanded: true });
  });

  it("includes collapsed state in accessibility state", () => {
    const { getByTestId } = render(<FAQAccordion {...defaultProps} isExpanded={false} />);
    const accordion = getByTestId("faq-accordion");
    expect(accordion.props.accessibilityState).toEqual({ expanded: false });
  });

  it("renders answer text with proper styling when expanded", () => {
    const { getByTestId } = render(<FAQAccordion {...defaultProps} isExpanded={true} />);
    const answerText = getByTestId("answer-text");
    expect(answerText).toBeTruthy();
    expect(answerText.props.children).toBe(defaultProps.answer);
  });

  it("works without onPress handler", () => {
    const { getByTestId } = render(<FAQAccordion {...defaultProps} onPress={undefined} />);
    const accordion = getByTestId("faq-accordion");
    fireEvent.press(accordion);
    // Should not throw error
    expect(accordion).toBeTruthy();
  });
});
