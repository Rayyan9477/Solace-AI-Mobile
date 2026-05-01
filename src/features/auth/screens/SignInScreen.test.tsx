/**
 * SignInScreen Tests — prototype v4.2 #02 (Sprint 7).
 * 12 tests covering render, inputs, interactions, loading, and error states.
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import { SignInScreen } from "./SignInScreen";

// Helpers ─────────────────────────────────────────────────────────────────────

const mockOnBack = jest.fn();
const mockOnSignIn = jest.fn();
const mockOnForgotPassword = jest.fn();
const mockOnSignUp = jest.fn();

const defaultProps = {
  onBack: mockOnBack,
  onSignIn: mockOnSignIn,
  onForgotPassword: mockOnForgotPassword,
  onSignUp: mockOnSignUp,
};

beforeEach(() => {
  jest.clearAllMocks();
});

// 1 ── render + snapshot ───────────────────────────────────────────────────────

it("renders and matches snapshot", () => {
  const { getByTestId, toJSON } = render(<SignInScreen {...defaultProps} />);
  expect(getByTestId("sign-in-screen")).toBeTruthy();
  expect(toJSON()).toMatchSnapshot();
});

// 2 ── headline ────────────────────────────────────────────────────────────────

it("shows 'Welcome back' headline", () => {
  const { getByText } = render(<SignInScreen {...defaultProps} />);
  expect(getByText(/Welcome back/i)).toBeTruthy();
});

// 3 ── email + password inputs ─────────────────────────────────────────────────

it("renders email and password GlassInputs", () => {
  const { getByTestId } = render(<SignInScreen {...defaultProps} />);
  // GlassInput exposes wrapper testID + ${testID}-input on the inner TextInput
  expect(getByTestId("email")).toBeTruthy();
  expect(getByTestId("password")).toBeTruthy();
  expect(getByTestId("email-input")).toBeTruthy();
  expect(getByTestId("password-input")).toBeTruthy();
});

// 4 ── email onChangeText ──────────────────────────────────────────────────────

it("fires onChangeText for email input", () => {
  const { getByTestId } = render(<SignInScreen {...defaultProps} />);
  // GlassInput wraps TextInput at testID="${testID}-input"
  const emailField = getByTestId("email-input");
  fireEvent.changeText(emailField, "user@test.com");
  expect(emailField.props.value).toBe("user@test.com");
});

// 5 ── password onChangeText ───────────────────────────────────────────────────

it("fires onChangeText for password input", () => {
  const { getByTestId } = render(<SignInScreen {...defaultProps} />);
  const passField = getByTestId("password-input");
  fireEvent.changeText(passField, "s3cr3t!");
  expect(passField.props.value).toBe("s3cr3t!");
});

// 6 ── Sign In button calls onSignIn(email, password) ─────────────────────────

it("calls onSignIn with current email and password on press", () => {
  const { getByTestId } = render(<SignInScreen {...defaultProps} />);
  fireEvent.changeText(getByTestId("email-input"), "a@b.com");
  fireEvent.changeText(getByTestId("password-input"), "pass123");
  fireEvent.press(getByTestId("sign-in-button"));
  expect(mockOnSignIn).toHaveBeenCalledWith("a@b.com", "pass123");
});

// 7 ── forgot password ─────────────────────────────────────────────────────────

it("calls onForgotPassword when forgot-password link is pressed", () => {
  const { getByTestId } = render(<SignInScreen {...defaultProps} />);
  fireEvent.press(getByTestId("forgot-password-link"));
  expect(mockOnForgotPassword).toHaveBeenCalledTimes(1);
});

// 8 ── sign up ─────────────────────────────────────────────────────────────────

it("calls onSignUp when Sign Up link is pressed", () => {
  const { getByTestId } = render(<SignInScreen {...defaultProps} />);
  fireEvent.press(getByTestId("sign-up-link"));
  expect(mockOnSignUp).toHaveBeenCalledTimes(1);
});

// 9 ── back button ─────────────────────────────────────────────────────────────

it("calls onBack when back button is pressed", () => {
  const { getByTestId } = render(<SignInScreen {...defaultProps} />);
  fireEvent.press(getByTestId("back-button"));
  expect(mockOnBack).toHaveBeenCalledTimes(1);
});

// 10 ── social buttons ─────────────────────────────────────────────────────────

it("renders google, apple, and github SocialButtons", () => {
  const { getByTestId } = render(<SignInScreen {...defaultProps} />);
  expect(getByTestId("social-google")).toBeTruthy();
  expect(getByTestId("social-apple")).toBeTruthy();
  expect(getByTestId("social-github")).toBeTruthy();
});

// 11 ── loading state ─────────────────────────────────────────────────────────

it("marks sign-in button as disabled in accessibilityState when loading=true", () => {
  const { getByTestId } = render(
    <SignInScreen {...defaultProps} loading={true} />,
  );
  const btn = getByTestId("sign-in-button");
  // Button passes accessibilityState={{ disabled: true, busy: true }} to Pressable
  expect(btn.props.accessibilityState?.disabled).toBe(true);
});

// 12 ── error message ─────────────────────────────────────────────────────────

it("renders errorMessage when provided", () => {
  const { getByTestId, getByText } = render(
    <SignInScreen {...defaultProps} errorMessage="Invalid credentials" />,
  );
  expect(getByTestId("error-message")).toBeTruthy();
  expect(getByText("Invalid credentials")).toBeTruthy();
});
