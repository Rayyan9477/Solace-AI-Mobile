jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () => jest.requireActual("@/shared/theme/useTheme"));

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import { ToggleRow } from "./ToggleRow";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const baseProps = {
  label: "Push Notifications",
  value: false,
  onValueChange: jest.fn(),
  testID: "toggle-row",
};

describe("ToggleRow", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders without crashing", () => {
    const { toJSON } = renderWithTheme(<ToggleRow {...baseProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it("matches snapshot (value=false)", () => {
    const { toJSON } = renderWithTheme(<ToggleRow {...baseProps} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("matches snapshot (value=true)", () => {
    const { toJSON } = renderWithTheme(
      <ToggleRow {...baseProps} value={true} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders label text", () => {
    const { getByText } = renderWithTheme(<ToggleRow {...baseProps} />);
    expect(getByText("Push Notifications")).toBeTruthy();
  });

  it("renders description when provided", () => {
    const { getByText } = renderWithTheme(
      <ToggleRow {...baseProps} description="Receive daily reminders" />,
    );
    expect(getByText("Receive daily reminders")).toBeTruthy();
  });

  it("does not render description when omitted", () => {
    const { queryByText } = renderWithTheme(<ToggleRow {...baseProps} />);
    expect(queryByText("Receive daily reminders")).toBeNull();
  });

  describe("interaction", () => {
    it("calls onValueChange with toggled value when row is pressed", () => {
      const onValueChange = jest.fn();
      const { getByTestId } = renderWithTheme(
        <ToggleRow {...baseProps} value={false} onValueChange={onValueChange} />,
      );
      fireEvent.press(getByTestId("toggle-row"));
      expect(onValueChange).toHaveBeenCalledWith(true);
    });

    it("calls onValueChange with false when value=true and row is pressed", () => {
      const onValueChange = jest.fn();
      const { getByTestId } = renderWithTheme(
        <ToggleRow {...baseProps} value={true} onValueChange={onValueChange} />,
      );
      fireEvent.press(getByTestId("toggle-row"));
      expect(onValueChange).toHaveBeenCalledWith(false);
    });

    it("does not call onValueChange when disabled", () => {
      const onValueChange = jest.fn();
      const { getByTestId } = renderWithTheme(
        <ToggleRow {...baseProps} disabled onValueChange={onValueChange} />,
      );
      fireEvent.press(getByTestId("toggle-row"));
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("has accessibilityRole=switch", () => {
      const { getByTestId } = renderWithTheme(<ToggleRow {...baseProps} />);
      expect(getByTestId("toggle-row").props.accessibilityRole).toBe("switch");
    });

    it("has accessibilityLabel equal to label prop", () => {
      const { getByTestId } = renderWithTheme(<ToggleRow {...baseProps} />);
      expect(getByTestId("toggle-row").props.accessibilityLabel).toBe(
        "Push Notifications",
      );
    });

    it("has accessibilityState.checked=false when value=false", () => {
      const { getByTestId } = renderWithTheme(
        <ToggleRow {...baseProps} value={false} />,
      );
      expect(getByTestId("toggle-row").props.accessibilityState.checked).toBe(
        false,
      );
    });

    it("has accessibilityState.checked=true when value=true", () => {
      const { getByTestId } = renderWithTheme(
        <ToggleRow {...baseProps} value={true} />,
      );
      expect(getByTestId("toggle-row").props.accessibilityState.checked).toBe(
        true,
      );
    });

    it("has accessibilityState.disabled=true when disabled", () => {
      const { getByTestId } = renderWithTheme(
        <ToggleRow {...baseProps} disabled />,
      );
      expect(getByTestId("toggle-row").props.accessibilityState.disabled).toBe(
        true,
      );
    });
  });
});
