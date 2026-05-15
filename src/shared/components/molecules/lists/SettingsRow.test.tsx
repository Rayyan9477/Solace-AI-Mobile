jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () => jest.requireActual("@/shared/theme/useTheme"));

import React from "react";
import { Text } from "react-native";
import { render, fireEvent } from "@testing-library/react-native";

import { SettingsRow } from "./SettingsRow";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const baseProps = {
  iconName: "user",
  label: "Profile",
  testID: "settings-row",
};

describe("SettingsRow", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders without crashing", () => {
    const { toJSON } = renderWithTheme(<SettingsRow {...baseProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it("matches snapshot", () => {
    const { toJSON } = renderWithTheme(<SettingsRow {...baseProps} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders label text", () => {
    const { getByText } = renderWithTheme(<SettingsRow {...baseProps} />);
    expect(getByText("Profile")).toBeTruthy();
  });

  it("renders description when provided", () => {
    const { getByText } = renderWithTheme(
      <SettingsRow {...baseProps} description="Manage your profile details" />,
    );
    expect(getByText("Manage your profile details")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    const { getByTestId } = renderWithTheme(
      <SettingsRow {...baseProps} onPress={onPress} />,
    );
    fireEvent.press(getByTestId("settings-row"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  describe("right slot variants", () => {
    it("renders value text when value prop is provided", () => {
      const { getByText } = renderWithTheme(
        <SettingsRow {...baseProps} value="English" />,
      );
      expect(getByText("English")).toBeTruthy();
    });

    it("renders badge when badgeCount is provided", () => {
      const { getByText } = renderWithTheme(
        <SettingsRow {...baseProps} badgeCount={5} />,
      );
      expect(getByText("5")).toBeTruthy();
    });

    it("renders custom rightSlot when provided", () => {
      const { getByTestId } = renderWithTheme(
        <SettingsRow {...baseProps} rightSlot={<Text testID="custom-slot">Custom</Text>} />,
      );
      expect(getByTestId("custom-slot")).toBeTruthy();
    });
  });

  describe("destructive variant", () => {
    it("renders without crashing in destructive mode", () => {
      const { toJSON } = renderWithTheme(
        <SettingsRow {...baseProps} destructive />,
      );
      expect(toJSON()).toBeTruthy();
    });

    it("matches snapshot in destructive mode", () => {
      const { toJSON } = renderWithTheme(
        <SettingsRow {...baseProps} destructive label="Delete Account" />,
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe("hue variants", () => {
    it.each(["sage", "aurora", "peach", "lavender", "warm", "midnight"] as const)(
      "renders hue=%s without throwing",
      (hue) => {
        const { toJSON } = renderWithTheme(
          <SettingsRow {...baseProps} iconHue={hue} />,
        );
        expect(toJSON()).toBeTruthy();
      },
    );
  });

  describe("accessibility", () => {
    it("has accessibilityRole=button", () => {
      const { getByTestId } = renderWithTheme(<SettingsRow {...baseProps} />);
      expect(getByTestId("settings-row").props.accessibilityRole).toBe("button");
    });

    it("has accessibilityLabel equal to label", () => {
      const { getByTestId } = renderWithTheme(<SettingsRow {...baseProps} label="Privacy" />);
      expect(getByTestId("settings-row").props.accessibilityLabel).toBe("Privacy");
    });

    it("sets accessibilityHint when provided", () => {
      const { getByTestId } = renderWithTheme(
        <SettingsRow {...baseProps} accessibilityHint="Opens privacy settings" />,
      );
      expect(getByTestId("settings-row").props.accessibilityHint).toBe(
        "Opens privacy settings",
      );
    });
  });
});
