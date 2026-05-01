/**
 * SessionSummaryScreen Tests — prototype v4.2 #26 (Sprint 8).
 *
 * Behavior-focused: render, hero, headline, topic card, technique list,
 * small-action card, share, schedule reminder, back-to-home callbacks, a11y.
 */

jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () =>
  jest.requireActual("@/shared/theme/useTheme"),
);

import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import { ThemeProvider } from "@/shared/theme/useTheme";
import {
  DEFAULT_TECHNIQUES,
  DEFAULT_TOPIC,
  SessionSummaryScreen,
  type SessionSummaryScreenProps,
} from "./SessionSummaryScreen";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const baseProps: SessionSummaryScreenProps = {
  onShare: jest.fn(),
  onScheduleReminder: jest.fn(),
  onBackToHome: jest.fn(),
};

describe("SessionSummaryScreen (v4.2 #26)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen container", () => {
    const { getByTestId } = renderWithTheme(
      <SessionSummaryScreen {...baseProps} />,
    );
    expect(getByTestId("session-summary-screen")).toBeTruthy();
  });

  it("renders the mini-header title 'Session complete'", () => {
    const { getByTestId, getByText } = renderWithTheme(
      <SessionSummaryScreen {...baseProps} />,
    );
    expect(getByTestId("mini-header-title")).toBeTruthy();
    expect(getByText("Session complete")).toBeTruthy();
  });

  it("renders the share button with a11y", () => {
    const { getByTestId } = renderWithTheme(
      <SessionSummaryScreen {...baseProps} />,
    );
    const btn = getByTestId("share-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Share summary");
  });

  it("invokes onShare when share is pressed", () => {
    const onShare = jest.fn();
    const { getByTestId } = renderWithTheme(
      <SessionSummaryScreen {...baseProps} onShare={onShare} />,
    );
    fireEvent.press(getByTestId("share-button"));
    expect(onShare).toHaveBeenCalledTimes(1);
  });

  it("renders the hero check ring", () => {
    const { getByTestId } = renderWithTheme(
      <SessionSummaryScreen {...baseProps} />,
    );
    expect(getByTestId("check-hero")).toBeTruthy();
  });

  it("renders the date and minutes bracket", () => {
    const { getByText } = renderWithTheme(
      <SessionSummaryScreen
        {...baseProps}
        sessionDate="April 9"
        sessionMinutes={14}
      />,
    );
    expect(getByText(/APRIL 9/)).toBeTruthy();
    expect(getByText(/14 MIN/)).toBeTruthy();
  });

  it("renders the well-done headline with first name", () => {
    const { getByText } = renderWithTheme(
      <SessionSummaryScreen {...baseProps} firstName="Alex" />,
    );
    expect(getByText("Alex.")).toBeTruthy();
  });

  it("uses default first name 'Rayyan' when prop omitted", () => {
    const { getByText } = renderWithTheme(
      <SessionSummaryScreen {...baseProps} />,
    );
    expect(getByText("Rayyan.")).toBeTruthy();
  });

  it("renders the topic card summary", () => {
    const { getByTestId } = renderWithTheme(
      <SessionSummaryScreen {...baseProps} />,
    );
    expect(getByTestId("topic-summary")).toBeTruthy();
    expect(getByTestId("topic-summary").props.children).toBe(
      DEFAULT_TOPIC.summary,
    );
  });

  it("renders all default topic tags", () => {
    const { getByTestId } = renderWithTheme(
      <SessionSummaryScreen {...baseProps} />,
    );
    DEFAULT_TOPIC.tags.forEach((tag) => {
      expect(getByTestId(`topic-tag-${tag}`)).toBeTruthy();
    });
  });

  it("renders the techniques card with all default techniques", () => {
    const { getByTestId } = renderWithTheme(
      <SessionSummaryScreen {...baseProps} />,
    );
    expect(getByTestId("techniques-card")).toBeTruthy();
    DEFAULT_TECHNIQUES.forEach((t) => {
      expect(getByTestId(`technique-${t.id}`)).toBeTruthy();
    });
  });

  it("renders technique name and caption text", () => {
    const { getByText } = renderWithTheme(
      <SessionSummaryScreen {...baseProps} />,
    );
    expect(getByText("Thought reframing")).toBeTruthy();
    expect(getByText("CBT technique")).toBeTruthy();
    expect(getByText("4-7-8 breathing")).toBeTruthy();
  });

  it("renders the small-action card", () => {
    const { getByTestId } = renderWithTheme(
      <SessionSummaryScreen {...baseProps} />,
    );
    expect(getByTestId("small-action-card")).toBeTruthy();
  });

  it("renders the schedule-reminder CTA", () => {
    const { getByTestId, getByText } = renderWithTheme(
      <SessionSummaryScreen {...baseProps} />,
    );
    expect(getByTestId("schedule-reminder-button")).toBeTruthy();
    expect(getByText("Schedule reminder")).toBeTruthy();
  });

  it("invokes onScheduleReminder when CTA pressed", () => {
    const onScheduleReminder = jest.fn();
    const { getByTestId } = renderWithTheme(
      <SessionSummaryScreen
        {...baseProps}
        onScheduleReminder={onScheduleReminder}
      />,
    );
    fireEvent.press(getByTestId("schedule-reminder-button"));
    expect(onScheduleReminder).toHaveBeenCalledTimes(1);
  });

  it("renders the bottom 'Back to home' CTA", () => {
    const { getByTestId, getByText } = renderWithTheme(
      <SessionSummaryScreen {...baseProps} />,
    );
    expect(getByTestId("back-to-home-button")).toBeTruthy();
    expect(getByText("Back to home")).toBeTruthy();
  });

  it("invokes onBackToHome when bottom CTA pressed", () => {
    const onBackToHome = jest.fn();
    const { getByTestId } = renderWithTheme(
      <SessionSummaryScreen {...baseProps} onBackToHome={onBackToHome} />,
    );
    fireEvent.press(getByTestId("back-to-home-button"));
    expect(onBackToHome).toHaveBeenCalledTimes(1);
  });

  it("supports overriding techniques via props", () => {
    const { getByTestId, queryByTestId } = renderWithTheme(
      <SessionSummaryScreen
        {...baseProps}
        techniques={[
          {
            id: "custom-1",
            iconName: "heart",
            hue: "peach",
            name: "Self compassion",
            caption: "ACT technique",
          },
        ]}
      />,
    );
    expect(getByTestId("technique-custom-1")).toBeTruthy();
    expect(queryByTestId("technique-thought-reframing")).toBeNull();
  });

  it("does not render legacy 'Freud' content", () => {
    const { queryByText } = renderWithTheme(
      <SessionSummaryScreen {...baseProps} />,
    );
    expect(queryByText(/freud/i)).toBeNull();
  });
});
