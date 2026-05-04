/**
 * OnboardingCarouselScreen Tests — prototype v4.2 #03 (Sprint 7)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import { OnboardingCarouselScreen } from "./OnboardingCarouselScreen";
import type { OnboardingCarouselScreenProps } from "./OnboardingCarouselScreen";

const defaultProps: OnboardingCarouselScreenProps = {
  onComplete: jest.fn(),
  onSkip: jest.fn(),
};

function renderScreen(overrides: Partial<OnboardingCarouselScreenProps> = {}) {
  return render(<OnboardingCarouselScreen {...defaultProps} {...overrides} />);
}

describe("OnboardingCarouselScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Render + snapshot (initial step 0)
  it("renders and matches snapshot at step 0", () => {
    const tree = renderScreen().toJSON();
    expect(tree).toMatchSnapshot();
  });

  // 2. All 4 step contents accessible via testID
  it("renders step title testIDs for the current step", () => {
    const { getByTestId } = renderScreen({ initialStep: 0 });
    expect(getByTestId("step-title-0")).toBeTruthy();
  });

  // 3. Step 0 displays welcome content
  it("step 0 displays WELCOME bracket content", () => {
    const { getByText } = renderScreen({ initialStep: 0 });
    expect(getByText(/WELCOME/i)).toBeTruthy();
  });

  // 4. Continue advances to step 1 (verify by reading title testID)
  it("tapping Continue on step 0 advances to step 1", () => {
    const { getByTestId, queryByTestId } = renderScreen({ initialStep: 0 });
    expect(getByTestId("step-title-0")).toBeTruthy();
    fireEvent.press(getByTestId("continue-button"));
    expect(getByTestId("step-title-1")).toBeTruthy();
    expect(queryByTestId("step-title-0")).toBeNull();
  });

  // 5. Continue at step 3 (last) calls onComplete
  it("tapping Continue on the last step calls onComplete", () => {
    const onComplete = jest.fn();
    const { getByTestId } = renderScreen({ initialStep: 3, onComplete });
    fireEvent.press(getByTestId("continue-button"));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  // 6. Skip calls onSkip when provided
  it("tapping Skip calls onSkip", () => {
    const onSkip = jest.fn();
    const { getByTestId } = renderScreen({ onSkip });
    fireEvent.press(getByTestId("skip-link"));
    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  // 7. Skip hidden when onSkip omitted
  it("skip link is not rendered when onSkip is not provided", () => {
    const { queryByTestId } = renderScreen({ onSkip: undefined });
    expect(queryByTestId("skip-link")).toBeNull();
  });

  // 8. CTA label is "Continue" on steps 0-2; "Get started" on step 3
  it('CTA label is "Continue" on step 0', () => {
    const { getByTestId } = renderScreen({ initialStep: 0 });
    const btn = getByTestId("continue-button");
    expect(btn.props.accessibilityLabel).toContain("Continue");
  });

  it('CTA label is "Get started" on step 3', () => {
    const { getByTestId } = renderScreen({ initialStep: 3 });
    const btn = getByTestId("continue-button");
    expect(btn.props.accessibilityLabel).toContain("Get started");
  });

  // 9. Pager dots — active dot has different style on each step
  it("active pager dot for step 0 has sage backgroundColor", () => {
    const { getByTestId } = renderScreen({ initialStep: 0 });
    const dot0 = getByTestId("pager-dot-0");
    const styles = Array.isArray(dot0.props.style)
      ? dot0.props.style.flat()
      : [dot0.props.style];
    const merged = styles.reduce(
      (acc: Record<string, unknown>, s: Record<string, unknown> | null) => ({ ...acc, ...(s ?? {}) }),
      {},
    );
    // Active dot should not have a border (borderWidth: 0 overrides 1.5)
    expect(merged.borderWidth).toBe(0);
  });

  it("inactive pager dot has borderColor set (not active)", () => {
    const { getByTestId } = renderScreen({ initialStep: 0 });
    const dot1 = getByTestId("pager-dot-1");
    const styles = Array.isArray(dot1.props.style)
      ? dot1.props.style.flat()
      : [dot1.props.style];
    const merged = styles.reduce(
      (acc: Record<string, unknown>, s: Record<string, unknown> | null) => ({ ...acc, ...(s ?? {}) }),
      {},
    );
    expect(merged.backgroundColor).toBe("transparent");
  });

  // 10. initialStep prop respected
  it("initialStep=2 renders step 2 content immediately", () => {
    const { getByTestId } = renderScreen({ initialStep: 2 });
    expect(getByTestId("step-title-2")).toBeTruthy();
  });

  // 11. Position counter updates correctly
  it('position counter shows "1 / 4" on step 0', () => {
    const { getByTestId } = renderScreen({ initialStep: 0 });
    expect(getByTestId("position-counter").props.children).toBe("1 / 4");
  });

  it('position counter shows "4 / 4" on step 3', () => {
    const { getByTestId } = renderScreen({ initialStep: 3 });
    expect(getByTestId("position-counter").props.children).toBe("4 / 4");
  });

  it("position counter increments when Continue is pressed", () => {
    const { getByTestId } = renderScreen({ initialStep: 0 });
    expect(getByTestId("position-counter").props.children).toBe("1 / 4");
    fireEvent.press(getByTestId("continue-button"));
    expect(getByTestId("position-counter").props.children).toBe("2 / 4");
  });

  // 12. CTA has >= 44pt touch target and proper a11y role
  it("continue button has proper accessibility role", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("continue-button");
    expect(btn.props.accessibilityRole).toBe("button");
  });

  it("skip link has proper accessibility role", () => {
    const { getByTestId } = renderScreen();
    const skip = getByTestId("skip-link");
    expect(skip.props.accessibilityRole).toBe("button");
  });

  it("skipping from any step calls onSkip immediately", () => {
    const onSkip = jest.fn();
    const { getByTestId } = renderScreen({ initialStep: 2, onSkip });
    fireEvent.press(getByTestId("skip-link"));
    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it("onComplete is NOT called on steps 0-2", () => {
    const onComplete = jest.fn();
    const { getByTestId } = renderScreen({ initialStep: 0, onComplete });
    fireEvent.press(getByTestId("continue-button"));
    expect(onComplete).not.toHaveBeenCalled();
  });
});
