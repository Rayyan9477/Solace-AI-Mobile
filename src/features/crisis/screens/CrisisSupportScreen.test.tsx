/**
 * CrisisSupportScreen Tests — prototype v4.2 #12 (Sprint 9).
 * ≥15 behavior-style tests covering hero, three resources, AI fallback,
 * dismiss, and a11y.
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { CrisisSupportScreen } from "./CrisisSupportScreen";

const makeProps = (overrides = {}) => ({
  onClose: jest.fn(),
  onCallHotline: jest.fn(),
  onTextLine: jest.fn(),
  onInternational: jest.fn(),
  onStartChat: jest.fn(),
  onDismiss: jest.fn(),
  ...overrides,
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("CrisisSupportScreen", () => {
  // 1. Renders root container
  it("renders the screen container", () => {
    const { getByTestId } = render(<CrisisSupportScreen {...makeProps()} />);
    expect(getByTestId("crisis-support-screen")).toBeTruthy();
  });

  // 2. Headline
  it("renders the cosmic headline", () => {
    const { getByTestId } = render(<CrisisSupportScreen {...makeProps()} />);
    expect(getByTestId("crisis-headline")).toBeTruthy();
  });

  // 3. Subtitle
  it("renders the supportive subtitle", () => {
    const { getByText } = render(<CrisisSupportScreen {...makeProps()} />);
    expect(getByText(/Talk to someone right now/)).toBeTruthy();
  });

  // 4. Bracket label
  it("renders the 'You are not alone' bracket", () => {
    const { getByText } = render(<CrisisSupportScreen {...makeProps()} />);
    expect(getByText(/YOU ARE NOT ALONE/)).toBeTruthy();
  });

  // 5. Close button renders
  it("renders the close button", () => {
    const { getByTestId } = render(<CrisisSupportScreen {...makeProps()} />);
    expect(getByTestId("close-button")).toBeTruthy();
  });

  // 6. Close press
  it("calls onClose when close button pressed", () => {
    const onClose = jest.fn();
    const { getByTestId } = render(
      <CrisisSupportScreen {...makeProps({ onClose })} />,
    );
    fireEvent.press(getByTestId("close-button"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // 7. 988 hotline card renders
  it("renders the 988 hotline card", () => {
    const { getByTestId } = render(<CrisisSupportScreen {...makeProps()} />);
    expect(getByTestId("call-988-button")).toBeTruthy();
  });

  // 8. 988 callback
  it("calls onCallHotline when 988 card pressed", () => {
    const onCallHotline = jest.fn();
    const { getByTestId } = render(
      <CrisisSupportScreen {...makeProps({ onCallHotline })} />,
    );
    fireEvent.press(getByTestId("call-988-button"));
    expect(onCallHotline).toHaveBeenCalledTimes(1);
  });

  // 9. Text line button renders
  it("renders the 741741 text line card", () => {
    const { getByTestId } = render(<CrisisSupportScreen {...makeProps()} />);
    expect(getByTestId("text-line-button")).toBeTruthy();
  });

  // 10. Text line callback
  it("calls onTextLine when text line pressed", () => {
    const onTextLine = jest.fn();
    const { getByTestId } = render(
      <CrisisSupportScreen {...makeProps({ onTextLine })} />,
    );
    fireEvent.press(getByTestId("text-line-button"));
    expect(onTextLine).toHaveBeenCalledTimes(1);
  });

  // 11. International row renders
  it("renders the international resources card", () => {
    const { getByTestId } = render(<CrisisSupportScreen {...makeProps()} />);
    expect(getByTestId("international-button")).toBeTruthy();
  });

  // 12. International press
  it("calls onInternational when international card pressed", () => {
    const onInternational = jest.fn();
    const { getByTestId } = render(
      <CrisisSupportScreen {...makeProps({ onInternational })} />,
    );
    fireEvent.press(getByTestId("international-button"));
    expect(onInternational).toHaveBeenCalledTimes(1);
  });

  // 13. Talk to Solace card
  it("renders the Talk to Solace fallback card", () => {
    const { getByTestId } = render(<CrisisSupportScreen {...makeProps()} />);
    expect(getByTestId("talk-to-solace-card")).toBeTruthy();
  });

  // 14. Start chat callback
  it("calls onStartChat when start-chat pressed", () => {
    const onStartChat = jest.fn();
    const { getByTestId } = render(
      <CrisisSupportScreen {...makeProps({ onStartChat })} />,
    );
    fireEvent.press(getByTestId("start-chat-button"));
    expect(onStartChat).toHaveBeenCalledTimes(1);
  });

  // 15. Dismiss callback
  it("calls onDismiss when dismiss link pressed", () => {
    const onDismiss = jest.fn();
    const { getByTestId } = render(
      <CrisisSupportScreen {...makeProps({ onDismiss })} />,
    );
    fireEvent.press(getByTestId("dismiss-link"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  // 16. Close button accessibility
  it("close button is a button with descriptive label", () => {
    const { getByTestId } = render(<CrisisSupportScreen {...makeProps()} />);
    const btn = getByTestId("close-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toMatch(/close/i);
  });

  // 17. Touch target — close
  it("close button meets 44pt minimum touch target", () => {
    const { getByTestId } = render(<CrisisSupportScreen {...makeProps()} />);
    const { StyleSheet } = require("react-native");
    const flat = StyleSheet.flatten(getByTestId("close-button").props.style);
    expect(flat.height).toBeGreaterThanOrEqual(44);
    expect(flat.width).toBeGreaterThanOrEqual(44);
  });

  // 18. Headline a11y header role
  it("headline is announced as a header", () => {
    const { getByTestId } = render(<CrisisSupportScreen {...makeProps()} />);
    expect(getByTestId("crisis-headline").props.accessibilityRole).toBe(
      "header",
    );
  });

  // 19. Decorative blob is hidden from a11y
  it("decorative smoke blob is hidden from screen readers", () => {
    const { UNSAFE_root } = render(<CrisisSupportScreen {...makeProps()} />);
    // The decorative wrapper sets accessibilityElementsHidden and lives inside
    // the screen tree. Walk descendants and assert at least one such hidden
    // wrapper exists (smoke blob + linear gradient backdrop both qualify).
    const allElements = UNSAFE_root.findAll(
      (n: { props?: { accessibilityElementsHidden?: boolean } }) =>
        n.props?.accessibilityElementsHidden === true,
    );
    expect(allElements.length).toBeGreaterThan(0);
  });

  // 20. Branding — no Freud
  it("does not contain any Freud branding", () => {
    const { queryByText } = render(<CrisisSupportScreen {...makeProps()} />);
    expect(queryByText(/freud/i)).toBeNull();
  });
});
