/**
 * SearchAutocompleteScreen Tests
 * @description Tests for the search autocomplete suggestions screen
 * @task Task 3.15.2: Search Autocomplete Screen (Screen 130)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SearchAutocompleteScreen } from "./SearchAutocompleteScreen";

const mockSuggestions = [
  { id: "1", text: "Meditation Practice" },
  { id: "2", text: "Meditation Schedule" },
  { id: "3", text: "Meditation AI Suggestion" },
  { id: "4", text: "My Meditation" },
  { id: "5", text: "Medic" },
];

const defaultProps = {
  query: "Meditation sess",
  suggestions: mockSuggestions,
  highlightedIndex: 1,
  onBack: jest.fn(),
  onFilterPress: jest.fn(),
  onQueryChange: jest.fn(),
  onSuggestionPress: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(
    <SearchAutocompleteScreen {...defaultProps} {...overrides} />,
  );
}

beforeEach(() => jest.clearAllMocks());

describe("SearchAutocompleteScreen", () => {
  // ── Rendering ──────────────────────────────────────────
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("search-autocomplete-screen")).toBeTruthy();
  });

  it("renders the header with title 'Search'", () => {
    const { getByText } = renderScreen();
    expect(getByText("Search")).toBeTruthy();
  });

  it("renders the back button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("renders the search input with current query", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("search-input").props.value).toBe("Meditation sess");
  });

  it("renders the filter button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("filter-button")).toBeTruthy();
  });

  // ── Autocomplete Dropdown ──────────────────────────────
  it("renders the autocomplete dropdown", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("autocomplete-dropdown")).toBeTruthy();
  });

  it("renders all suggestion items", () => {
    const { getByText } = renderScreen();
    expect(getByText("Meditation Practice")).toBeTruthy();
    expect(getByText("Meditation Schedule")).toBeTruthy();
    expect(getByText("Meditation AI Suggestion")).toBeTruthy();
    expect(getByText("My Meditation")).toBeTruthy();
    expect(getByText("Medic")).toBeTruthy();
  });

  it("renders each suggestion with a testID", () => {
    const { getByTestId } = renderScreen();
    mockSuggestions.forEach((s) => {
      expect(getByTestId(`suggestion-${s.id}`)).toBeTruthy();
    });
  });

  it("highlights the suggestion at highlightedIndex", () => {
    const { getByTestId } = renderScreen({ highlightedIndex: 1 });
    const highlighted = getByTestId("suggestion-2");
    const style = Object.assign(
      {},
      ...[].concat(highlighted.props.style),
    );
    expect(style.backgroundColor).toBeDefined();
  });

  it("renders empty dropdown when no suggestions", () => {
    const { queryByTestId } = renderScreen({ suggestions: [] });
    expect(queryByTestId("suggestion-1")).toBeNull();
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

  it("calls onSuggestionPress with the suggestion when tapped", () => {
    const onSuggestionPress = jest.fn();
    const { getByTestId } = renderScreen({ onSuggestionPress });
    fireEvent.press(getByTestId("suggestion-1"));
    expect(onSuggestionPress).toHaveBeenCalledWith(mockSuggestions[0]);
  });

  it("calls onSuggestionPress with correct suggestion for each item", () => {
    const onSuggestionPress = jest.fn();
    const { getByTestId } = renderScreen({ onSuggestionPress });
    fireEvent.press(getByTestId("suggestion-3"));
    expect(onSuggestionPress).toHaveBeenCalledWith(mockSuggestions[2]);
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

  it("suggestion items have accessibilityRole 'button'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("suggestion-1").props.accessibilityRole).toBe("button");
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

  it("suggestion items meet 44px minimum touch height", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("suggestion-1").props.style),
    );
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
  });

  // ── Styling ────────────────────────────────────────────
  it("applies dark background to the container", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("search-autocomplete-screen").props.style),
    );
    expect(style.backgroundColor).toBe("#1C1410");
  });

  // ── Branding ───────────────────────────────────────────
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
