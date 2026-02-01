/**
 * SearchNoResultsScreen Tests
 * @description Tests for the search empty state / no results screen
 * @task Task 3.15.3: Search No Results Screen (Screen 131)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SearchNoResultsScreen } from "./SearchNoResultsScreen";

const defaultProps = {
  query: "nonexistent topic",
  onBack: jest.fn(),
  onFilterPress: jest.fn(),
  onQueryChange: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<SearchNoResultsScreen {...defaultProps} {...overrides} />);
}

beforeEach(() => jest.clearAllMocks());

describe("SearchNoResultsScreen", () => {
  // ── Rendering ──────────────────────────────────────────
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("search-no-results-screen")).toBeTruthy();
  });

  it("renders the header with title 'Search'", () => {
    const { getByText } = renderScreen();
    expect(getByText("Search")).toBeTruthy();
  });

  it("renders the back button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("renders the search bar with current query", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("search-input").props.value).toBe(
      "nonexistent topic",
    );
  });

  it("renders the filter button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("filter-button")).toBeTruthy();
  });

  // ── Empty State ────────────────────────────────────────
  it("renders the empty state illustration", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("empty-state-illustration")).toBeTruthy();
  });

  it("renders 'Not Found' title", () => {
    const { getByText } = renderScreen();
    expect(getByText(/Not Found/)).toBeTruthy();
  });

  it("renders the guidance message with correct spacing", () => {
    const { getByText } = renderScreen();
    // Audit fix: "found.404" → "found. 404" (Issue #29)
    expect(
      getByText(/cannot be found\. 404 Error/),
    ).toBeTruthy();
  });

  it("renders the full guidance message", () => {
    const { getByText } = renderScreen();
    expect(
      getByText(/please try another keyword or check again/),
    ).toBeTruthy();
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
    fireEvent.changeText(getByTestId("search-input"), "meditation");
    expect(onQueryChange).toHaveBeenCalledWith("meditation");
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
      ...[].concat(getByTestId("search-no-results-screen").props.style),
    );
    expect(style.backgroundColor).toBe("#1C1410");
  });

  // ── Branding ───────────────────────────────────────────
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
