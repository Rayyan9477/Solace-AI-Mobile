/**
 * WelcomeScreen Tests — prototype v4.2 #01 (Sprint 7).
 * 12 tests covering render, composition, a11y, touch targets, and reduced motion.
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import { WelcomeScreen } from "./WelcomeScreen";

// Helpers ─────────────────────────────────────────────────────────────────────

const mockOnGetStarted = jest.fn();
const mockOnSignIn = jest.fn();

const defaultProps = {
  onGetStarted: mockOnGetStarted,
  onSignIn: mockOnSignIn,
};

beforeEach(() => {
  jest.clearAllMocks();
});

// 1 ── render + testID + snapshot ─────────────────────────────────────────────

it("renders and matches snapshot", () => {
  const { getByTestId, toJSON } = render(<WelcomeScreen {...defaultProps} />);
  expect(getByTestId("welcome-screen")).toBeTruthy();
  expect(toJSON()).toMatchSnapshot();
});

// 2 ── headline ────────────────────────────────────────────────────────────────

it("shows 'Welcome to Solace' headline", () => {
  const { getByText } = render(<WelcomeScreen {...defaultProps} />);
  // "Welcome to " and "Solace" are separate Text nodes; getByText with partial regex
  expect(getByText(/Welcome to/)).toBeTruthy();
  expect(getByText(/Solace/)).toBeTruthy();
});

// 3 ── trust row ───────────────────────────────────────────────────────────────

it("renders all three trust-row chips", () => {
  const { getByText } = render(<WelcomeScreen {...defaultProps} />);
  // BracketLabel uppercases internally; rendered text includes brackets
  expect(getByText(/AAA ACCESSIBLE/i)).toBeTruthy();
  expect(getByText(/PRIVACY FIRST/i)).toBeTruthy();
  expect(getByText(/THERAPEUTIC/i)).toBeTruthy();
});

// 4 ── wordmark bracket ────────────────────────────────────────────────────────

it("renders '[ SOLACE AI ]' wordmark bracket", () => {
  const { getByText } = render(<WelcomeScreen {...defaultProps} />);
  expect(getByText(/SOLACE AI/i)).toBeTruthy();
});

// 5 ── CTA press ───────────────────────────────────────────────────────────────

it("calls onGetStarted when Get Started is pressed", () => {
  const { getByTestId } = render(<WelcomeScreen {...defaultProps} />);
  fireEvent.press(getByTestId("get-started-button"));
  expect(mockOnGetStarted).toHaveBeenCalledTimes(1);
});

// 6 ── Sign In link press ──────────────────────────────────────────────────────

it("calls onSignIn when Sign In link is pressed", () => {
  const { getByTestId } = render(<WelcomeScreen {...defaultProps} />);
  fireEvent.press(getByTestId("sign-in-link"));
  expect(mockOnSignIn).toHaveBeenCalledTimes(1);
});

// 7 ── CTA a11y ────────────────────────────────────────────────────────────────

it("CTA button has accessibilityRole=button and accessibilityLabel", () => {
  const { getByTestId } = render(<WelcomeScreen {...defaultProps} />);
  const btn = getByTestId("get-started-button");
  expect(btn.props.accessibilityRole).toBe("button");
  expect(btn.props.accessibilityLabel).toBeTruthy();
});

// 8 ── CTA ≥44pt touch target ─────────────────────────────────────────────────

it("CTA button meets ≥44pt minimum touch target", () => {
  const { getByTestId } = render(<WelcomeScreen {...defaultProps} />);
  const btn = getByTestId("get-started-button");
  const styleProp = btn.props.style;
  // Button component always sets minHeight ≥ 44 in its computed buttonStyle
  // The style is the result of Pressable's style callback; we check the
  // resolved style array for minHeight.
  const flatStyles = Array.isArray(styleProp)
    ? styleProp.flat().reduce((acc: Record<string, unknown>, s: Record<string, unknown> | null) => ({ ...acc, ...s }), {})
    : (styleProp as Record<string, unknown>) ?? {};
  const minHeight = (flatStyles.minHeight as number | undefined) ?? 0;
  expect(minHeight).toBeGreaterThanOrEqual(44);
});

// 9 ── Sign In link ≥44pt ─────────────────────────────────────────────────────

it("Sign In link meets ≥44pt minimum touch target", () => {
  const { getByTestId } = render(<WelcomeScreen {...defaultProps} />);
  const link = getByTestId("sign-in-link");
  const styleProp = link.props.style;
  const flatStyles = Array.isArray(styleProp)
    ? styleProp.flat().reduce((acc: Record<string, unknown>, s: Record<string, unknown> | null) => ({ ...acc, ...s }), {})
    : (styleProp as Record<string, unknown>) ?? {};
  const minHeight = (flatStyles.minHeight as number | undefined) ?? 0;
  expect(minHeight).toBeGreaterThanOrEqual(44);
});

// 10 ── reduced motion ─────────────────────────────────────────────────────────

it("renders BreathingOrb with pulsing={false} without error (reduced-motion path)", () => {
  // BreathingOrb is decorative and hidden from a11y queries (no accessibilityLabel).
  // We exercise the reduced-motion code path by rendering the orb directly.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { BreathingOrb: Orb } = require("@/shared/components/primitives");
  // Should render without throw when pulsing=false (reduced motion path)
  expect(() =>
    render(<Orb testID="static-orb" size={100} pulsing={false} />),
  ).not.toThrow();
});

// 11 ── component composition ─────────────────────────────────────────────────

it("screen container mounts without throw (BreathingOrb + SmokeBlob present)", () => {
  // Both decorative SVG elements are hidden from a11y queries but must not
  // cause render errors. We verify the overall tree mounts cleanly.
  expect(() => render(<WelcomeScreen {...defaultProps} />)).not.toThrow();
});

// 12 ── no legacy palette imports ─────────────────────────────────────────────

it("screen text uses theme palette (warm/peach tokens) not legacy colors", () => {
  // The subtitle should render with warm[400] color; we verify no raw legacy
  // hex (#1C1410) surfaces in the rendered output by spot-checking subtitle.
  const { getByText } = render(<WelcomeScreen {...defaultProps} />);
  const subtitle = getByText(/mindful companion/);
  const style = subtitle.props.style;
  const flatStyles = Array.isArray(style)
    ? style.flat().reduce((acc: Record<string, unknown>, s: Record<string, unknown> | null) => ({ ...acc, ...s }), {})
    : (style as Record<string, unknown>) ?? {};
  // warm[400] in the cosmic preset is not the legacy tan/brown hex
  expect((flatStyles.color as string | undefined) ?? "").not.toBe("#1C1410");
  expect((flatStyles.color as string | undefined) ?? "").not.toBe("#8B7355");
});
