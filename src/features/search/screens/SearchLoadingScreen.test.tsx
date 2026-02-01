/**
 * SearchLoadingScreen Tests
 * @description Tests for the global search loading state screen
 * @task Task 3.15.1: Search Loading Screen (Screen 129)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SearchLoadingScreen } from "./SearchLoadingScreen";

const defaultProps = {
  query: "",
  onBack: jest.fn(),
  onFilterPress: jest.fn(),
  onQueryChange: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<SearchLoadingScreen {...defaultProps} {...overrides} />);
}

beforeEach(() => jest.clearAllMocks());

describe("SearchLoadingScreen", () => {
  // ── Rendering ──────────────────────────────────────────
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("search-loading-screen")).toBeTruthy();
  });

  it("renders the header with title 'Search'", () => {
    const { getByText } = renderScreen();
    expect(getByText("Search")).toBeTruthy();
  });

  it("renders the back button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("renders the search bar", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("search-bar")).toBeTruthy();
  });

  it("renders the search input with placeholder 'Search Solace...'", () => {
    const { getByPlaceholderText } = renderScreen();
    expect(getByPlaceholderText("Search Solace...")).toBeTruthy();
  });

  it("renders the filter icon button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("filter-button")).toBeTruthy();
  });

  it("renders the loading spinner", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("loading-spinner")).toBeTruthy();
  });

  it("renders 'Loading...' text", () => {
    const { getByText } = renderScreen();
    expect(getByText("Loading...")).toBeTruthy();
  });

  // ── Search Input ───────────────────────────────────────
  it("displays the current query value in the input", () => {
    const { getByTestId } = renderScreen({ query: "Meditation" });
    expect(getByTestId("search-input").props.value).toBe("Meditation");
  });

  // ── Callbacks ──────────────────────────────────────────
  it("calls onBack when back button is pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls onFilterPress when filter button is pressed", () => {
    const onFilterPress = jest.fn();
    const { getByTestId } = renderScreen({ onFilterPress });
    fireEvent.press(getByTestId("filter-button"));
    expect(onFilterPress).toHaveBeenCalledTimes(1);
  });

  it("calls onQueryChange when text is entered", () => {
    const onQueryChange = jest.fn();
    const { getByTestId } = renderScreen({ onQueryChange });
    fireEvent.changeText(getByTestId("search-input"), "mood");
    expect(onQueryChange).toHaveBeenCalledWith("mood");
  });

  // ── Accessibility ──────────────────────────────────────
  it("back button has accessibilityLabel 'Go back'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button").props.accessibilityLabel).toBe("Go back");
  });

  it("back button has accessibilityRole 'button'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button").props.accessibilityRole).toBe("button");
  });

  it("filter button has accessibilityLabel 'Filter'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("filter-button").props.accessibilityLabel).toBe(
      "Filter",
    );
  });

  it("search input has accessibilityLabel 'Search'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("search-input").props.accessibilityLabel).toBe("Search");
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

  it("filter button meets 44×44 minimum touch target", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("filter-button").props.style),
    );
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
    expect(style.minWidth).toBeGreaterThanOrEqual(44);
  });

  // ── Styling ────────────────────────────────────────────
  it("applies dark background to the container", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("search-loading-screen").props.style),
    );
    expect(style.backgroundColor).toBe("#1C1410");
  });

  // ── Branding ───────────────────────────────────────────
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
