/**
 * LanguagesScreen Tests
 * @description Tests for language selection and bilingual toggle
 * @task Task 3.17.8: Languages Screen (Screen 147)
 * @audit-fix Incorrect language codes: IL→IT, IR→IE, EU removed, American→English (US)
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { LanguagesScreen } from "./LanguagesScreen";

const defaultProps = {
  selectedLanguageId: "ja-JP",
  bilingualEnabled: true,
  languages: [
    { id: "ja-JP", name: "Japanese", code: "JP" },
    { id: "it-IT", name: "Italian", code: "IT" },
    { id: "ar-SA", name: "Arabic", code: "AR" },
    { id: "en-US", name: "English (US)", code: "US" },
    { id: "en-GB", name: "English (UK)", code: "GB" },
    { id: "ga-IE", name: "Irish", code: "IE" },
  ],
  onBack: jest.fn(),
  onLanguageSelect: jest.fn(),
  onBilingualToggle: jest.fn(),
  onSave: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<LanguagesScreen {...defaultProps} {...overrides} />);
}

beforeEach(() => jest.clearAllMocks());

describe("LanguagesScreen", () => {
  // ── Rendering ──────────────────────────────────────────
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("languages-screen")).toBeTruthy();
  });

  it("renders the back button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("renders 'Languages' title", () => {
    const { getByText } = renderScreen();
    expect(getByText("Languages")).toBeTruthy();
  });

  it("renders 'Selected Language' section", () => {
    const { getByText } = renderScreen();
    expect(getByText("Selected Language")).toBeTruthy();
  });

  it("renders the selected language highlighted", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("language-ja-JP")).toBeTruthy();
  });

  it("renders 'Bilingual Feature' section with BETA badge", () => {
    const { getByText } = renderScreen();
    expect(getByText("Bilingual Feature")).toBeTruthy();
    expect(getByText("BETA")).toBeTruthy();
  });

  it("renders the bilingual toggle", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("toggle-bilingual")).toBeTruthy();
  });

  it("renders 'All Languages' section", () => {
    const { getByText } = renderScreen();
    expect(getByText("All Languages")).toBeTruthy();
  });

  it("renders all language options", () => {
    const { getAllByText, getByText } = renderScreen();
    expect(getAllByText("Japanese").length).toBeGreaterThanOrEqual(1);
    expect(getByText("Italian")).toBeTruthy();
    expect(getByText("Arabic")).toBeTruthy();
    expect(getByText("English (US)")).toBeTruthy();
    expect(getByText("English (UK)")).toBeTruthy();
    expect(getByText("Irish")).toBeTruthy();
  });

  it("renders save button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("save-button")).toBeTruthy();
  });

  // ── Audit Fixes ────────────────────────────────────────
  it("uses correct code IT for Italian (not IL)", () => {
    const { getByText } = renderScreen();
    expect(getByText("IT")).toBeTruthy();
  });

  it("uses correct code IE for Irish (not IR)", () => {
    const { getByText } = renderScreen();
    expect(getByText("IE")).toBeTruthy();
  });

  it("uses 'English (US)' not 'American'", () => {
    const { queryByText } = renderScreen();
    expect(queryByText("American")).toBeNull();
  });

  it("does not list 'European' as a language", () => {
    const { queryByText } = renderScreen();
    expect(queryByText("European")).toBeNull();
  });

  // ── Callbacks ──────────────────────────────────────────
  it("calls onBack when back button is pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls onLanguageSelect when language is pressed", () => {
    const onLanguageSelect = jest.fn();
    const { getByTestId } = renderScreen({ onLanguageSelect });
    fireEvent.press(getByTestId("language-it-IT"));
    expect(onLanguageSelect).toHaveBeenCalledWith("it-IT");
  });

  it("calls onBilingualToggle when toggle is pressed", () => {
    const onBilingualToggle = jest.fn();
    const { getByTestId } = renderScreen({ onBilingualToggle });
    fireEvent.press(getByTestId("toggle-bilingual"));
    expect(onBilingualToggle).toHaveBeenCalledTimes(1);
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

  it("back button meets 44×44 minimum touch target", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("back-button").props.style),
    );
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
    expect(style.minWidth).toBeGreaterThanOrEqual(44);
  });

  // ── Styling ────────────────────────────────────────────
  it("applies dark background to the container", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("languages-screen").props.style),
    );
    expect(style.backgroundColor).toBe("#1C1410");
  });

  // ── Branding ───────────────────────────────────────────
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
