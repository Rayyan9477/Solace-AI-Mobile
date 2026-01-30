/**
 * SleepSummaryScreen Tests
 * @description Tests for the sleep summary screen with total hours, multi-ring chart, stage breakdown, and Got It button
 * @task Task 3.10.4: Sleep Summary Screen (Screen 94)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SleepSummaryScreen } from "./SleepSummaryScreen";

describe("SleepSummaryScreen", () => {
  const mockOnGotIt = jest.fn();

  const defaultProps = {
    totalSleepHours: "8.25h",
    stages: [
      {
        type: "rem" as const,
        label: "REM",
        duration: "2.14h",
        color: "#9AAD5C",
        icon: "~",
      },
      {
        type: "core" as const,
        label: "Core",
        duration: "6.04h",
        color: "#E8853A",
        icon: "Zz",
      },
      {
        type: "post" as const,
        label: "Post",
        duration: "12min",
        color: "#6B6B6B",
        icon: "...",
      },
    ],
    onGotIt: mockOnGotIt,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- 1. Rendering ---
  it("renders the screen container", () => {
    const { getByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    expect(getByTestId("sleep-summary-screen")).toBeTruthy();
  });

  it("uses dark brown background color #1C1410", () => {
    const { getByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    const screen = getByTestId("sleep-summary-screen");
    expect(screen.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#1C1410" })
    );
  });

  it("renders as a full-screen flex container", () => {
    const { getByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    const screen = getByTestId("sleep-summary-screen");
    expect(screen.props.style).toEqual(
      expect.objectContaining({ flex: 1 })
    );
  });

  // --- 2. Title ---
  it("displays 'You Slept for' title text", () => {
    const { getByText } = render(<SleepSummaryScreen {...defaultProps} />);
    expect(getByText("You Slept for")).toBeTruthy();
  });

  it("renders the title with white color", () => {
    const { getByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    const title = getByTestId("sleep-summary-title");
    expect(title.props.style).toEqual(
      expect.objectContaining({ color: "#FFFFFF" })
    );
  });

  // --- 3. Total Sleep Display ---
  it("displays the total sleep hours value", () => {
    const { getByText } = render(<SleepSummaryScreen {...defaultProps} />);
    expect(getByText("8.25h")).toBeTruthy();
  });

  it("renders total sleep hours with testID", () => {
    const { getByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    expect(getByTestId("total-sleep-hours")).toBeTruthy();
  });

  it("renders total sleep hours in white color", () => {
    const { getByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    const totalHours = getByTestId("total-sleep-hours");
    expect(totalHours.props.style).toEqual(
      expect.objectContaining({ color: "#FFFFFF" })
    );
  });

  it("renders total sleep hours with bold font weight", () => {
    const { getByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    const totalHours = getByTestId("total-sleep-hours");
    expect(totalHours.props.style).toEqual(
      expect.objectContaining({ fontWeight: "800" })
    );
  });

  // --- 4. Multi-Ring Chart Container ---
  it("renders the multi-ring chart container", () => {
    const { getByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    expect(getByTestId("multi-ring-chart")).toBeTruthy();
  });

  // --- 5. Ring Segments ---
  it("renders the outer REM ring", () => {
    const { getByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    expect(getByTestId("ring-rem")).toBeTruthy();
  });

  it("renders the middle Core ring", () => {
    const { getByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    expect(getByTestId("ring-core")).toBeTruthy();
  });

  it("renders the inner Post ring", () => {
    const { getByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    expect(getByTestId("ring-post")).toBeTruthy();
  });

  it("renders ring track backgrounds", () => {
    const { getByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    expect(getByTestId("ring-track-rem")).toBeTruthy();
    expect(getByTestId("ring-track-core")).toBeTruthy();
    expect(getByTestId("ring-track-post")).toBeTruthy();
  });

  it("renders REM ring icon", () => {
    const { getByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    expect(getByTestId("ring-icon-rem")).toBeTruthy();
  });

  it("renders Core ring icon", () => {
    const { getByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    expect(getByTestId("ring-icon-core")).toBeTruthy();
  });

  it("renders Post ring icon", () => {
    const { getByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    expect(getByTestId("ring-icon-post")).toBeTruthy();
  });

  // --- 6. Stage Breakdown Cards ---
  it("renders three stage breakdown columns", () => {
    const { getByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    expect(getByTestId("stage-breakdown")).toBeTruthy();
  });

  it("renders the REM stage card", () => {
    const { getByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    expect(getByTestId("stage-card-rem")).toBeTruthy();
  });

  it("renders the Core stage card", () => {
    const { getByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    expect(getByTestId("stage-card-core")).toBeTruthy();
  });

  it("renders the Post stage card", () => {
    const { getByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    expect(getByTestId("stage-card-post")).toBeTruthy();
  });

  it("displays REM label text", () => {
    const { getByText } = render(<SleepSummaryScreen {...defaultProps} />);
    expect(getByText("REM")).toBeTruthy();
  });

  it("displays Core label text", () => {
    const { getByText } = render(<SleepSummaryScreen {...defaultProps} />);
    expect(getByText("Core")).toBeTruthy();
  });

  it("displays Post label text", () => {
    const { getByText } = render(<SleepSummaryScreen {...defaultProps} />);
    expect(getByText("Post")).toBeTruthy();
  });

  it("displays REM duration value", () => {
    const { getByText } = render(<SleepSummaryScreen {...defaultProps} />);
    expect(getByText("2.14h")).toBeTruthy();
  });

  it("displays Core duration value", () => {
    const { getByText } = render(<SleepSummaryScreen {...defaultProps} />);
    expect(getByText("6.04h")).toBeTruthy();
  });

  it("displays Post duration value", () => {
    const { getByText } = render(<SleepSummaryScreen {...defaultProps} />);
    expect(getByText("12min")).toBeTruthy();
  });

  // --- 7. Stage Icons (colored badges) ---
  it("renders the REM icon badge", () => {
    const { getByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    expect(getByTestId("stage-icon-rem")).toBeTruthy();
  });

  it("renders the Core icon badge", () => {
    const { getByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    expect(getByTestId("stage-icon-core")).toBeTruthy();
  });

  it("renders the Post icon badge", () => {
    const { getByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    expect(getByTestId("stage-icon-post")).toBeTruthy();
  });

  // --- 8. Got It Button ---
  it("renders the Got It button", () => {
    const { getByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    expect(getByTestId("got-it-button")).toBeTruthy();
  });

  it("displays 'Got It, Thanks!' button text", () => {
    const { getByText } = render(<SleepSummaryScreen {...defaultProps} />);
    expect(getByText(/Got It, Thanks!/)).toBeTruthy();
  });

  it("displays the arrow indicator on Got It button", () => {
    const { getByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    const button = getByTestId("got-it-button");
    expect(button).toBeTruthy();
  });

  it("calls onGotIt when Got It button is pressed", () => {
    const { getByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    fireEvent.press(getByTestId("got-it-button"));
    expect(mockOnGotIt).toHaveBeenCalledTimes(1);
  });

  it("renders Got It button with tan/brown background", () => {
    const { getByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    const button = getByTestId("got-it-button");
    expect(button.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#C4A574" })
    );
  });

  // --- 9. Accessibility ---
  it("Got It button has accessibilityRole button", () => {
    const { getByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    expect(getByTestId("got-it-button").props.accessibilityRole).toBe("button");
  });

  it("Got It button has accessibilityLabel", () => {
    const { getByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    expect(getByTestId("got-it-button").props.accessibilityLabel).toBe(
      "Got it, thanks"
    );
  });

  it("Got It button meets minimum touch target size", () => {
    const { getByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    const button = getByTestId("got-it-button");
    expect(button.props.style).toEqual(
      expect.objectContaining({ minHeight: 44 })
    );
  });

  // --- 10. Branding ---
  it("does not contain any Freud branding", () => {
    const { queryByText } = render(<SleepSummaryScreen {...defaultProps} />);
    expect(queryByText(/freud/i)).toBeNull();
  });

  it("does not contain Freud in any testID", () => {
    const { queryByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    expect(queryByTestId(/freud/i)).toBeNull();
  });

  // --- 11. Dynamic Data ---
  it("displays different total sleep hours", () => {
    const { getByText } = render(
      <SleepSummaryScreen
        {...defaultProps}
        totalSleepHours="6.50h"
      />
    );
    expect(getByText("6.50h")).toBeTruthy();
  });

  it("displays custom stage durations", () => {
    const customStages = [
      { type: "rem" as const, label: "REM", duration: "1.5h", color: "#9AAD5C", icon: "~" },
      { type: "core" as const, label: "Core", duration: "4.0h", color: "#E8853A", icon: "Zz" },
      { type: "post" as const, label: "Post", duration: "30min", color: "#6B6B6B", icon: "..." },
    ];
    const { getByText } = render(
      <SleepSummaryScreen
        {...defaultProps}
        totalSleepHours="5.50h"
        stages={customStages}
      />
    );
    expect(getByText("5.50h")).toBeTruthy();
    expect(getByText("1.5h")).toBeTruthy();
    expect(getByText("4.0h")).toBeTruthy();
    expect(getByText("30min")).toBeTruthy();
  });

  it("handles single-digit sleep hours", () => {
    const { getByText } = render(
      <SleepSummaryScreen {...defaultProps} totalSleepHours="3h" />
    );
    expect(getByText("3h")).toBeTruthy();
  });

  it("renders all stage cards dynamically from props", () => {
    const { getByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    defaultProps.stages.forEach((stage) => {
      expect(getByTestId(`stage-card-${stage.type}`)).toBeTruthy();
    });
  });

  it("renders all ring segments dynamically from props", () => {
    const { getByTestId } = render(<SleepSummaryScreen {...defaultProps} />);
    defaultProps.stages.forEach((stage) => {
      expect(getByTestId(`ring-${stage.type}`)).toBeTruthy();
    });
  });
});
