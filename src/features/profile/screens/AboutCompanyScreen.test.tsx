/**
 * AboutCompanyScreen Tests
 * @description Tests for company info, contact cards
 * @task Task 3.17.9: About Company Screen (Screen 148)
 * @audit-fix "Freud AI Health" → "Solace AI Health"
 * @audit-fix "freudhealth.ai" → "solacehealth.ai"
 * @audit-fix "North Detroit, Texas" → corrected geography
 * @audit-fix Phone section shows actual phone numbers
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { AboutCompanyScreen } from "./AboutCompanyScreen";

const defaultProps = {
  companyName: "Solace AI Health",
  tagline: "AI Mental Health Therapy Since 2025",
  addressLines: [
    "Turing Tower, Innovation Avenue",
    "San Francisco, California",
    "United States 94105",
  ],
  emails: ["info@solacehealth.ai", "inquiry@solacehealth.ai"],
  phoneNumbers: ["+1 (415) 555-0142", "+1 (415) 555-0198"],
  onBack: jest.fn(),
  onAddressPress: jest.fn(),
  onEmailPress: jest.fn(),
  onPhonePress: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<AboutCompanyScreen {...defaultProps} {...overrides} />);
}

beforeEach(() => jest.clearAllMocks());

describe("AboutCompanyScreen", () => {
  // ── Rendering ──────────────────────────────────────────
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("about-company-screen")).toBeTruthy();
  });

  it("renders the company name", () => {
    const { getByText } = renderScreen();
    expect(getByText("Solace AI Health")).toBeTruthy();
  });

  it("renders the tagline", () => {
    const { getByText } = renderScreen();
    expect(getByText("AI Mental Health Therapy Since 2025")).toBeTruthy();
  });

  it("renders the address card", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("address-card")).toBeTruthy();
  });

  it("renders address title", () => {
    const { getByText } = renderScreen();
    expect(getByText("Our Office Address")).toBeTruthy();
  });

  it("renders address lines", () => {
    const { getByText } = renderScreen();
    expect(getByText(/Turing Tower/)).toBeTruthy();
    expect(getByText(/San Francisco/)).toBeTruthy();
  });

  it("renders the email card", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("email-card")).toBeTruthy();
  });

  it("renders email title", () => {
    const { getByText } = renderScreen();
    expect(getByText("Our Email Address")).toBeTruthy();
  });

  it("renders email addresses", () => {
    const { getByText } = renderScreen();
    expect(getByText("info@solacehealth.ai")).toBeTruthy();
    expect(getByText("inquiry@solacehealth.ai")).toBeTruthy();
  });

  it("renders the phone card", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("phone-card")).toBeTruthy();
  });

  it("renders phone title", () => {
    const { getByText } = renderScreen();
    expect(getByText("Our Phone Number")).toBeTruthy();
  });

  it("renders phone numbers (not addresses)", () => {
    const { getByText } = renderScreen();
    expect(getByText("+1 (415) 555-0142")).toBeTruthy();
    expect(getByText("+1 (415) 555-0198")).toBeTruthy();
  });

  // ── Audit Fixes ────────────────────────────────────────
  it("uses 'Solace AI Health' not 'Freud AI Health'", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/Freud AI Health/)).toBeNull();
  });

  it("uses 'solacehealth.ai' not 'freudhealth.ai'", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freudhealth/)).toBeNull();
  });

  it("does not show 'North Detroit, Texas'", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/North Detroit/)).toBeNull();
  });

  // ── Callbacks ──────────────────────────────────────────
  it("calls onBack when navigating back", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls onAddressPress when address card is pressed", () => {
    const onAddressPress = jest.fn();
    const { getByTestId } = renderScreen({ onAddressPress });
    fireEvent.press(getByTestId("address-card"));
    expect(onAddressPress).toHaveBeenCalledTimes(1);
  });

  it("calls onEmailPress when email card is pressed", () => {
    const onEmailPress = jest.fn();
    const { getByTestId } = renderScreen({ onEmailPress });
    fireEvent.press(getByTestId("email-card"));
    expect(onEmailPress).toHaveBeenCalledTimes(1);
  });

  it("calls onPhonePress when phone card is pressed", () => {
    const onPhonePress = jest.fn();
    const { getByTestId } = renderScreen({ onPhonePress });
    fireEvent.press(getByTestId("phone-card"));
    expect(onPhonePress).toHaveBeenCalledTimes(1);
  });

  // ── Accessibility ──────────────────────────────────────
  it("back button has accessibilityLabel 'Go back'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button").props.accessibilityLabel).toBe("Go back");
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

  // ── Branding ───────────────────────────────────────────
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
