/**
 * WelcomeScreen Tests
 * @description Tests for welcome screen entry point
 * @task Task 3.1.5: Welcome Screen
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { WelcomeScreen } from "./WelcomeScreen";

describe("WelcomeScreen", () => {
  const mockOnGetStarted = jest.fn();
  const mockOnSignIn = jest.fn();

  const defaultProps = {
    onGetStarted: mockOnGetStarted,
    onSignIn: mockOnSignIn,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the welcome screen", () => {
    const { getByTestId } = render(<WelcomeScreen {...defaultProps} />);
    expect(getByTestId("welcome-screen")).toBeTruthy();
  });

  it("displays the app logo", () => {
    const { getByTestId } = render(<WelcomeScreen {...defaultProps} />);
    expect(getByTestId("welcome-logo")).toBeTruthy();
  });

  it("displays the welcome title", () => {
    const { getByText } = render(<WelcomeScreen {...defaultProps} />);
    expect(getByText(/Welcome to the ultimate/)).toBeTruthy();
  });

  it("displays the brand name in title", () => {
    const { getByText } = render(<WelcomeScreen {...defaultProps} />);
    expect(getByText(/Solace/)).toBeTruthy();
  });

  it("displays the subtitle", () => {
    const { getByText } = render(<WelcomeScreen {...defaultProps} />);
    expect(getByText(/Your mindful mental health AI companion/)).toBeTruthy();
  });

  it("displays the Get Started button", () => {
    const { getByText } = render(<WelcomeScreen {...defaultProps} />);
    expect(getByText("Get Started")).toBeTruthy();
  });

  it("displays the Sign In link", () => {
    const { getByText } = render(<WelcomeScreen {...defaultProps} />);
    expect(getByText(/Sign In/)).toBeTruthy();
  });

  it("calls onGetStarted when Get Started button is pressed", () => {
    const { getByTestId } = render(<WelcomeScreen {...defaultProps} />);
    fireEvent.press(getByTestId("get-started-button"));
    expect(mockOnGetStarted).toHaveBeenCalledTimes(1);
  });

  it("calls onSignIn when Sign In link is pressed", () => {
    const { getByTestId } = render(<WelcomeScreen {...defaultProps} />);
    fireEvent.press(getByTestId("sign-in-link"));
    expect(mockOnSignIn).toHaveBeenCalledTimes(1);
  });

  it("has correct dark background color", () => {
    const { getByTestId } = render(<WelcomeScreen {...defaultProps} />);
    const container = getByTestId("welcome-screen");
    const styles = Array.isArray(container.props.style) ? container.props.style : [container.props.style];
    const hasBackgroundColor = styles.some((s) => s?.backgroundColor === "#1C1410");
    expect(hasBackgroundColor).toBe(true);
  });

  it("renders the illustration container", () => {
    const { getByTestId } = render(<WelcomeScreen {...defaultProps} />);
    expect(getByTestId("illustration-container")).toBeTruthy();
  });

  it("Get Started button has proper accessibility", () => {
    const { getByTestId } = render(<WelcomeScreen {...defaultProps} />);
    const button = getByTestId("get-started-button");
    expect(button.props.accessibilityRole).toBe("button");
  });

  it("Sign In link has proper accessibility", () => {
    const { getByTestId } = render(<WelcomeScreen {...defaultProps} />);
    const link = getByTestId("sign-in-link");
    expect(link.props.accessibilityRole).toBe("link");
  });

  it("Get Started button has minimum touch target size", () => {
    const { getByTestId } = render(<WelcomeScreen {...defaultProps} />);
    const button = getByTestId("get-started-button");
    const styles = Array.isArray(button.props.style) ? button.props.style.flat() : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });
});
