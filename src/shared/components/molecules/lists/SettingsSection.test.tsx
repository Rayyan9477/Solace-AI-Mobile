jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () => jest.requireActual("@/shared/theme/useTheme"));

import React from "react";
import { Text } from "react-native";
import { render } from "@testing-library/react-native";

import { SettingsSection } from "./SettingsSection";
import { SettingsRow } from "./SettingsRow";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("SettingsSection", () => {
  it("renders without crashing", () => {
    const { toJSON } = renderWithTheme(
      <SettingsSection title="Account" testID="section">
        <SettingsRow iconName="user" label="Profile" />
      </SettingsSection>,
    );
    expect(toJSON()).toBeTruthy();
  });

  it("matches snapshot", () => {
    const { toJSON } = renderWithTheme(
      <SettingsSection title="Account">
        <SettingsRow iconName="user" label="Profile" />
        <SettingsRow iconName="lock" label="Security" />
      </SettingsSection>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders section title via BracketLabel", () => {
    const { getByText } = renderWithTheme(
      <SettingsSection title="ACCOUNT">
        <SettingsRow iconName="user" label="Profile" />
      </SettingsSection>,
    );
    // BracketLabel uppercases and wraps in brackets
    expect(getByText("[ ACCOUNT ]")).toBeTruthy();
  });

  it("renders all children", () => {
    const { getByText } = renderWithTheme(
      <SettingsSection title="Settings">
        <SettingsRow iconName="user" label="Profile" />
        <SettingsRow iconName="bell" label="Notifications" />
        <SettingsRow iconName="lock" label="Privacy" />
      </SettingsSection>,
    );
    expect(getByText("Profile")).toBeTruthy();
    expect(getByText("Notifications")).toBeTruthy();
    expect(getByText("Privacy")).toBeTruthy();
  });

  it("renders single child without hairline", () => {
    const { toJSON } = renderWithTheme(
      <SettingsSection title="Single">
        <Text>Only child</Text>
      </SettingsSection>,
    );
    expect(toJSON()).toBeTruthy();
  });

  it("renders multiple children with hairlines between them", () => {
    const { toJSON } = renderWithTheme(
      <SettingsSection title="Multi">
        <Text testID="child-1">Row 1</Text>
        <Text testID="child-2">Row 2</Text>
        <Text testID="child-3">Row 3</Text>
      </SettingsSection>,
    );
    expect(toJSON()).toBeTruthy();
  });

  describe("accessibility", () => {
    it("has accessibilityRole=list", () => {
      const { getByTestId } = renderWithTheme(
        <SettingsSection title="Account" testID="section">
          <SettingsRow iconName="user" label="Profile" />
        </SettingsSection>,
      );
      expect(getByTestId("section").props.accessibilityRole).toBe("list");
    });

    it("has accessibilityLabel equal to title", () => {
      const { getByTestId } = renderWithTheme(
        <SettingsSection title="Account" testID="section">
          <SettingsRow iconName="user" label="Profile" />
        </SettingsSection>,
      );
      expect(getByTestId("section").props.accessibilityLabel).toBe("Account");
    });
  });
});
