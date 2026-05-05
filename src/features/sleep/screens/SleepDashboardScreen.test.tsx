/**
 * SleepDashboardScreen Tests — prototype v4.2 #11
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import { SleepDashboardScreen } from "./SleepDashboardScreen";

const baseProps = {
  onBack: jest.fn(),
  onLogSleep: jest.fn(),
  onMore: jest.fn(),
};

function renderScreen(overrides: Record<string, unknown> = {}) {
  return render(<SleepDashboardScreen {...baseProps} {...overrides} />);
}

describe("SleepDashboardScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("sleep-dashboard-screen")).toBeTruthy();
  });

  it("renders the night-sky gradient backdrop", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("night-sky-gradient")).toBeTruthy();
  });

  it("renders the decorative star field", () => {
    const { UNSAFE_root } = renderScreen();
    const found = UNSAFE_root.findAll(
      (n: { props: { testID?: string } }) => n.props.testID === "star-field",
    );
    expect(found.length).toBeGreaterThan(0);
  });

  it("renders the back button with a11y", () => {
    const { getByTestId } = renderScreen();
    const back = getByTestId("back-button");
    expect(back.props.accessibilityRole).toBe("button");
    expect(back.props.accessibilityLabel).toBe("Go back");
  });

  it("invokes onBack when back pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("renders the more options button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("more-button").props.accessibilityRole).toBe("button");
  });

  it("invokes onMore when more pressed", () => {
    const onMore = jest.fn();
    const { getByTestId } = renderScreen({ onMore });
    fireEvent.press(getByTestId("more-button"));
    expect(onMore).toHaveBeenCalledTimes(1);
  });

  it("renders default duration display", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("duration-display").props.accessibilityLabel).toBe(
      "7 hours 48 minutes",
    );
  });

  it("renders custom duration", () => {
    const { getByTestId } = renderScreen({
      lastNight: {
        durationMinutes: 6 * 60 + 12,
        qualityPercent: 70,
        bedtime: "12:00 AM",
        wakeTime: "6:12 AM",
        stages: { deep: 60, core: 200, rem: 50, awake: 62 },
      },
    });
    expect(getByTestId("duration-display").props.accessibilityLabel).toBe(
      "6 hours 12 minutes",
    );
  });

  it("renders the quality text", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("quality-text")).toBeTruthy();
  });

  it("renders the Sleep stages card", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("sleep-stages-card")).toBeTruthy();
    expect(getByTestId("sleep-stages-bar")).toBeTruthy();
  });

  it("renders the weekly history card", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("weekly-history-card")).toBeTruthy();
  });

  it("renders the log sleep CTA", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("log-sleep-button")).toBeTruthy();
  });

  it("invokes onLogSleep when CTA pressed", () => {
    const onLogSleep = jest.fn();
    const { getByTestId } = renderScreen({ onLogSleep });
    fireEvent.press(getByTestId("log-sleep-button"));
    expect(onLogSleep).toHaveBeenCalledTimes(1);
  });

  it("displays the section title 'Sleep stages'", () => {
    const { getByText } = renderScreen();
    expect(getByText("Sleep stages")).toBeTruthy();
  });

  it("displays the section title '7-day history'", () => {
    const { getByText } = renderScreen();
    expect(getByText("7-day history")).toBeTruthy();
  });

  it("displays the insight title", () => {
    const { getByText } = renderScreen();
    expect(getByText("Your best sleep this week")).toBeTruthy();
  });

  it("renders the bedtime / wake schedule mono caption", () => {
    const { getByText } = renderScreen();
    expect(getByText("11:14 PM — 7:02 AM")).toBeTruthy();
  });

  it("touch targets meet 44pt", () => {
    const { getByTestId } = renderScreen();
    for (const id of ["back-button", "more-button"]) {
      const node = getByTestId(id);
      const flat = Object.assign({}, ...[].concat(node.props.style));
      expect(flat.minHeight).toBeGreaterThanOrEqual(44);
      expect(flat.minWidth).toBeGreaterThanOrEqual(44);
    }
  });

  it("does not contain Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });

  it("disables more button when onMore is undefined", () => {
    const { getByTestId } = render(
      <SleepDashboardScreen onBack={jest.fn()} onLogSleep={jest.fn()} />,
    );
    expect(getByTestId("more-button").props.accessibilityState?.disabled).toBe(
      true,
    );
  });
});
