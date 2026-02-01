/**
 * PersonalInformationScreen Tests
 * @description Tests for personal information editor screen
 * @task Task 3.17.4: Personal Information Screen (Screen 143)
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { PersonalInformationScreen } from "./PersonalInformationScreen";

const defaultProps = {
  dateOfBirth: "Jun 24, 2001",
  gender: "Female",
  location: "New York, USA",
  accountType: "patient" as const,
  weightValue: 65,
  weightMin: 30,
  weightMax: 150,
  weightUnit: "kg",
  onBack: jest.fn(),
  onAvatarPress: jest.fn(),
  onDateOfBirthPress: jest.fn(),
  onGenderPress: jest.fn(),
  onLocationPress: jest.fn(),
  onAccountTypeSelect: jest.fn(),
  onWeightChange: jest.fn(),
  onSave: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<PersonalInformationScreen {...defaultProps} {...overrides} />);
}

beforeEach(() => jest.clearAllMocks());

describe("PersonalInformationScreen", () => {
  // ── Rendering ──────────────────────────────────────────
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("personal-information-screen")).toBeTruthy();
  });

  it("renders the back button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("renders the 'Personal Information' title", () => {
    const { getByText } = renderScreen();
    expect(getByText("Personal Information")).toBeTruthy();
  });

  it("renders the avatar section", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("avatar-editor")).toBeTruthy();
  });

  it("renders the date of birth field", () => {
    const { getByText } = renderScreen();
    expect(getByText("Date of Birth")).toBeTruthy();
    expect(getByText("Jun 24, 2001")).toBeTruthy();
  });

  it("renders the gender field", () => {
    const { getByText } = renderScreen();
    expect(getByText("Gender")).toBeTruthy();
    expect(getByText("Female")).toBeTruthy();
  });

  it("renders the location field", () => {
    const { getByText } = renderScreen();
    expect(getByText("Location")).toBeTruthy();
    expect(getByText("New York, USA")).toBeTruthy();
  });

  it("renders account type selector", () => {
    const { getByText } = renderScreen();
    expect(getByText("Account Type")).toBeTruthy();
    expect(getByText("Psychiatrist")).toBeTruthy();
    expect(getByText("Patient")).toBeTruthy();
    expect(getByText("Professional")).toBeTruthy();
  });

  it("renders the selected account type as active", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("account-type-patient")).toBeTruthy();
  });

  it("renders weight slider section", () => {
    const { getByText } = renderScreen();
    expect(getByText("Weight")).toBeTruthy();
    expect(getByText("65 kg")).toBeTruthy();
  });

  it("renders the weight range labels", () => {
    const { getByText } = renderScreen();
    expect(getByText("30 kg")).toBeTruthy();
    expect(getByText("150 kg")).toBeTruthy();
  });

  it("renders the save button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("save-button")).toBeTruthy();
  });

  it("renders save button text", () => {
    const { getByText } = renderScreen();
    expect(getByText(/Save Settings/)).toBeTruthy();
  });

  // ── Callbacks ──────────────────────────────────────────
  it("calls onBack when back button is pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls onAvatarPress when avatar is pressed", () => {
    const onAvatarPress = jest.fn();
    const { getByTestId } = renderScreen({ onAvatarPress });
    fireEvent.press(getByTestId("avatar-editor"));
    expect(onAvatarPress).toHaveBeenCalledTimes(1);
  });

  it("calls onDateOfBirthPress when date field is pressed", () => {
    const onDateOfBirthPress = jest.fn();
    const { getByTestId } = renderScreen({ onDateOfBirthPress });
    fireEvent.press(getByTestId("field-date-of-birth"));
    expect(onDateOfBirthPress).toHaveBeenCalledTimes(1);
  });

  it("calls onGenderPress when gender field is pressed", () => {
    const onGenderPress = jest.fn();
    const { getByTestId } = renderScreen({ onGenderPress });
    fireEvent.press(getByTestId("field-gender"));
    expect(onGenderPress).toHaveBeenCalledTimes(1);
  });

  it("calls onLocationPress when location field is pressed", () => {
    const onLocationPress = jest.fn();
    const { getByTestId } = renderScreen({ onLocationPress });
    fireEvent.press(getByTestId("field-location"));
    expect(onLocationPress).toHaveBeenCalledTimes(1);
  });

  it("calls onAccountTypeSelect when account type is pressed", () => {
    const onAccountTypeSelect = jest.fn();
    const { getByTestId } = renderScreen({ onAccountTypeSelect });
    fireEvent.press(getByTestId("account-type-psychiatrist"));
    expect(onAccountTypeSelect).toHaveBeenCalledWith("psychiatrist");
  });

  it("calls onSave when save button is pressed", () => {
    const onSave = jest.fn();
    const { getByTestId } = renderScreen({ onSave });
    fireEvent.press(getByTestId("save-button"));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  // ── Accessibility ──────────────────────────────────────
  it("back button has accessibilityLabel 'Go back'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button").props.accessibilityLabel).toBe("Go back");
  });

  it("save button has accessibilityRole 'button'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("save-button").props.accessibilityRole).toBe("button");
  });

  it("back button meets 44×44 minimum touch target", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("back-button").props.style),
    );
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
    expect(style.minWidth).toBeGreaterThanOrEqual(44);
  });

  it("save button meets 44px minimum touch height", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("save-button").props.style),
    );
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
  });

  // ── Styling ────────────────────────────────────────────
  it("applies dark background to the container", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("personal-information-screen").props.style),
    );
    expect(style.backgroundColor).toBe("#1C1410");
  });

  // ── Branding ───────────────────────────────────────────
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
