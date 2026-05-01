/**
 * SplashScreen Tests — prototype v4.2 #13 (Sprint 7)
 */

jest.mock("expo-linear-gradient", () => {
  const { View } = require("react-native");
  return { LinearGradient: View };
});

import React from "react";
import { render, waitFor } from "@testing-library/react-native";

import { SplashScreen } from "./SplashScreen";

// Stable mock for useReducedMotion — can be overridden per test
const mockUseReducedMotion = jest.fn(() => false);
jest.mock("@/shared/hooks/useReducedMotion", () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}));

describe("SplashScreen", () => {
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseReducedMotion.mockReturnValue(false);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // 1. Renders
  it("renders without crashing", () => {
    const { getByTestId } = render(<SplashScreen onComplete={mockOnComplete} />);
    expect(getByTestId("splash-screen")).toBeTruthy();
  });

  // 2. Snapshot
  it("matches snapshot", () => {
    const tree = render(<SplashScreen onComplete={mockOnComplete} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // 3. Wordmark "Solace AI" present
  it("renders the 'Solace AI' wordmark text", () => {
    const { getByText } = render(<SplashScreen onComplete={mockOnComplete} />);
    expect(getByText("Solace AI")).toBeTruthy();
  });

  // 4. Bracket labels present
  it("renders both bracket labels (SOLACE and MENTAL HEALTH COMPANION)", () => {
    const { getByText } = render(<SplashScreen onComplete={mockOnComplete} />);
    expect(getByText("[ SOLACE ]")).toBeTruthy();
    expect(getByText("[ MENTAL HEALTH COMPANION ]")).toBeTruthy();
  });

  // 5. ConcentricRings rendered
  it("renders the concentric rings wrapper", () => {
    const { getByTestId } = render(<SplashScreen onComplete={mockOnComplete} />);
    expect(getByTestId("concentric-rings-wrapper")).toBeTruthy();
  });

  // 6. BreathingOrb rendered (uses includeHiddenElements since orb is a11y-hidden)
  it("renders the BreathingOrb", () => {
    const { getByTestId } = render(<SplashScreen onComplete={mockOnComplete} />);
    expect(getByTestId("breathing-orb", { includeHiddenElements: true })).toBeTruthy();
  });

  // 7. onComplete called after default 2s delay
  it("calls onComplete after the default 2000 ms delay", async () => {
    render(<SplashScreen onComplete={mockOnComplete} />);

    expect(mockOnComplete).not.toHaveBeenCalled();
    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });
  });

  // 8. Custom delay respected
  it("respects a custom delay prop", async () => {
    render(<SplashScreen onComplete={mockOnComplete} delay={1500} />);

    jest.advanceTimersByTime(1499);
    expect(mockOnComplete).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });
  });

  // 9. onComplete called only ONCE
  it("calls onComplete exactly once even if re-rendered", async () => {
    const { rerender } = render(<SplashScreen onComplete={mockOnComplete} delay={500} />);
    rerender(<SplashScreen onComplete={mockOnComplete} delay={500} />);

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });
  });

  // 10. Reduced motion: BreathingOrb renders in non-pulsing (static) path
  it("BreathingOrb still renders when reduced motion is enabled (static path)", () => {
    mockUseReducedMotion.mockReturnValue(true);
    // With reduced motion, BreathingOrb receives pulsing={false} and renders static.
    // The component still mounts; verify it remains in the tree.
    const { getByTestId } = render(<SplashScreen onComplete={mockOnComplete} />);
    expect(getByTestId("breathing-orb", { includeHiddenElements: true })).toBeTruthy();
    expect(getByTestId("concentric-rings-wrapper")).toBeTruthy();
  });
});
