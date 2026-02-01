/**
 * SearchResultsScreen Tests
 * @description Tests for search results with category filters, sort, and result rows
 * @task Task 3.15.4: Search Results Screen (Screen 132)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SearchResultsScreen } from "./SearchResultsScreen";

const mockCategories = [
  { id: "sleep", label: "Sleep", icon: "\uD83D\uDECF" },
  { id: "mood", label: "Mood", icon: "\uD83D\uDE0A" },
  { id: "meditation", label: "Meditation", icon: "\uD83E\uDDD8" },
  { id: "health", label: "Health", icon: "\u2764\uFE0F" },
];

const mockResults = [
  {
    id: "r1",
    title: "My Mood History",
    categoryLabel: "In Mood & Emotions",
    iconColor: "#F4D03F",
  },
  {
    id: "r2",
    title: "Mood Improvements",
    categoryLabel: "In Resources & Videos",
    iconColor: "#E8853A",
  },
  {
    id: "r3",
    title: "Mood Journals",
    categoryLabel: "In Mental Health Journal",
    iconColor: "#8B4513",
  },
  {
    id: "r4",
    title: "AI Chatbot Mood Suggestions",
    categoryLabel: "In AI Therapy Chatbot",
    iconColor: "#7B68B5",
  },
  {
    id: "r5",
    title: "My Current Mood",
    categoryLabel: "In Mood & Emotions",
    iconColor: "#4A9E8C",
  },
];

const defaultProps = {
  query: "mood st",
  resultCount: 871,
  sortLabel: "Newest",
  categories: mockCategories,
  selectedCategoryId: "mood",
  results: mockResults,
  onBack: jest.fn(),
  onFilterPress: jest.fn(),
  onQueryChange: jest.fn(),
  onSortPress: jest.fn(),
  onCategorySelect: jest.fn(),
  onResultPress: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<SearchResultsScreen {...defaultProps} {...overrides} />);
}

beforeEach(() => jest.clearAllMocks());

describe("SearchResultsScreen", () => {
  // ── Rendering ──────────────────────────────────────────
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("search-results-screen")).toBeTruthy();
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
    expect(getByTestId("search-input").props.value).toBe("mood st");
  });

  it("renders the filter button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("filter-button")).toBeTruthy();
  });

  // ── Results Header ─────────────────────────────────────
  it("renders the result count", () => {
    const { getByText } = renderScreen();
    expect(getByText(/871 Results Found/)).toBeTruthy();
  });

  it("renders the sort dropdown button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("sort-button")).toBeTruthy();
  });

  it("displays the current sort label", () => {
    const { getByText } = renderScreen();
    expect(getByText(/Newest/)).toBeTruthy();
  });

  // ── Category Filters ──────────────────────────────────
  it("renders all category filter chips", () => {
    const { getByTestId } = renderScreen();
    mockCategories.forEach((cat) => {
      expect(getByTestId(`category-chip-${cat.id}`)).toBeTruthy();
    });
  });

  it("renders category labels", () => {
    const { getAllByText } = renderScreen();
    expect(getAllByText(/Sleep/).length).toBeGreaterThanOrEqual(1);
    expect(getAllByText(/Mood/).length).toBeGreaterThanOrEqual(1);
    expect(getAllByText(/Meditation/).length).toBeGreaterThanOrEqual(1);
    expect(getAllByText(/Health/).length).toBeGreaterThanOrEqual(1);
  });

  it("highlights the selected category", () => {
    const { getByTestId } = renderScreen({ selectedCategoryId: "mood" });
    const chip = getByTestId("category-chip-mood");
    const style = Object.assign({}, ...[].concat(chip.props.style));
    expect(style.backgroundColor).toBeDefined();
  });

  // ── Results List ───────────────────────────────────────
  it("renders all result rows", () => {
    const { getByTestId } = renderScreen();
    mockResults.forEach((r) => {
      expect(getByTestId(`result-row-${r.id}`)).toBeTruthy();
    });
  });

  it("renders result titles", () => {
    const { getByText } = renderScreen();
    expect(getByText("My Mood History")).toBeTruthy();
    expect(getByText("Mood Improvements")).toBeTruthy();
    expect(getByText("Mood Journals")).toBeTruthy();
    expect(getByText("AI Chatbot Mood Suggestions")).toBeTruthy();
    expect(getByText("My Current Mood")).toBeTruthy();
  });

  it("renders result category labels", () => {
    const { getAllByText, getByText } = renderScreen();
    expect(getAllByText("In Mood & Emotions").length).toBe(2);
    expect(getByText("In Resources & Videos")).toBeTruthy();
    expect(getByText("In Mental Health Journal")).toBeTruthy();
  });

  it("renders colored category icons for each result", () => {
    const { getByTestId } = renderScreen();
    const icon = getByTestId("result-icon-r1");
    const style = Object.assign({}, ...[].concat(icon.props.style));
    expect(style.backgroundColor).toBe("#F4D03F");
  });

  it("renders chevron for each result row", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("result-chevron-r1")).toBeTruthy();
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
    fireEvent.changeText(getByTestId("search-input"), "sleep");
    expect(onQueryChange).toHaveBeenCalledWith("sleep");
  });

  it("calls onSortPress when sort button is pressed", () => {
    const onSortPress = jest.fn();
    const { getByTestId } = renderScreen({ onSortPress });
    fireEvent.press(getByTestId("sort-button"));
    expect(onSortPress).toHaveBeenCalledTimes(1);
  });

  it("calls onCategorySelect with category id when chip pressed", () => {
    const onCategorySelect = jest.fn();
    const { getByTestId } = renderScreen({ onCategorySelect });
    fireEvent.press(getByTestId("category-chip-sleep"));
    expect(onCategorySelect).toHaveBeenCalledWith("sleep");
  });

  it("calls onResultPress with result when row pressed", () => {
    const onResultPress = jest.fn();
    const { getByTestId } = renderScreen({ onResultPress });
    fireEvent.press(getByTestId("result-row-r1"));
    expect(onResultPress).toHaveBeenCalledWith(mockResults[0]);
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

  it("category chips have accessibilityRole 'button'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("category-chip-mood").props.accessibilityRole).toBe(
      "button",
    );
  });

  it("result rows have accessibilityRole 'button'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("result-row-r1").props.accessibilityRole).toBe("button");
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

  it("result rows meet 44px minimum touch height", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("result-row-r1").props.style),
    );
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
  });

  // ── Styling ────────────────────────────────────────────
  it("applies dark background to the container", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("search-results-screen").props.style),
    );
    expect(style.backgroundColor).toBe("#1C1410");
  });

  // ── Branding ───────────────────────────────────────────
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
