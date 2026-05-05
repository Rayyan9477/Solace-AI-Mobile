/**
 * SearchResultsScreen Tests — prototype v4.2 #36 reskin (Sprint 9).
 * ≥15 behavior-style tests covering search bar, count, filters, and section
 * rows.
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import {
  SearchResultsScreen,
  DEFAULT_SEARCH_RESULTS,
} from "./SearchResultsScreen";

const makeProps = (overrides = {}) => ({
  onBack: jest.fn(),
  onClear: jest.fn(),
  onQueryChange: jest.fn(),
  onCategoryChange: jest.fn(),
  onResultPress: jest.fn(),
  ...overrides,
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("SearchResultsScreen", () => {
  // 1. Root container
  it("renders the screen container", () => {
    const { getByTestId } = render(<SearchResultsScreen {...makeProps()} />);
    expect(getByTestId("search-results-screen")).toBeTruthy();
  });

  // 2. Default query in input
  it("renders default query 'anxiety' in the input", () => {
    const { getByTestId } = render(<SearchResultsScreen {...makeProps()} />);
    expect(getByTestId("search-input").props.value).toBe("anxiety");
  });

  // 3. Custom query
  it("respects a custom query prop", () => {
    const { getByTestId } = render(
      <SearchResultsScreen {...makeProps()} query="sleep" />,
    );
    expect(getByTestId("search-input").props.value).toBe("sleep");
  });

  // 4. Back press
  it("calls onBack when back pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = render(
      <SearchResultsScreen {...makeProps({ onBack })} />,
    );
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  // 5. Clear press
  it("calls onClear when clear pressed", () => {
    const onClear = jest.fn();
    const { getByTestId } = render(
      <SearchResultsScreen {...makeProps({ onClear })} />,
    );
    fireEvent.press(getByTestId("clear-button"));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  // 6. onQueryChange fires
  it("calls onQueryChange when typing in input", () => {
    const onQueryChange = jest.fn();
    const { getByTestId } = render(
      <SearchResultsScreen {...makeProps({ onQueryChange })} />,
    );
    fireEvent.changeText(getByTestId("search-input"), "stress");
    expect(onQueryChange).toHaveBeenCalledWith("stress");
  });

  // 7. Result count line
  it("renders the bracket result-count line", () => {
    const { getByText } = render(<SearchResultsScreen {...makeProps()} />);
    expect(getByText(/24 RESULTS FOR "ANXIETY"/)).toBeTruthy();
  });

  // 8. Result count is announced live
  it("result count line is a polite live region", () => {
    const { getByTestId } = render(<SearchResultsScreen {...makeProps()} />);
    expect(getByTestId("results-count").props.accessibilityLiveRegion).toBe(
      "polite",
    );
  });

  // 9. Category pills render
  it("renders the category pills tablist", () => {
    const { getByTestId } = render(<SearchResultsScreen {...makeProps()} />);
    expect(getByTestId("category-pills")).toBeTruthy();
  });

  // 10. Each category pill renders
  it("renders all 5 category labels", () => {
    const { getAllByText } = render(<SearchResultsScreen {...makeProps()} />);
    expect(getAllByText(/All/).length).toBeGreaterThan(0);
    expect(getAllByText(/Chats/).length).toBeGreaterThan(0);
    expect(getAllByText(/Journal/).length).toBeGreaterThan(0);
    expect(getAllByText(/Practices/).length).toBeGreaterThan(0);
    expect(getAllByText(/Articles/).length).toBeGreaterThan(0);
  });

  // 11. Category change fires callback
  it("calls onCategoryChange when a pill pressed", () => {
    const onCategoryChange = jest.fn();
    const { getAllByText } = render(
      <SearchResultsScreen {...makeProps({ onCategoryChange })} />,
    );
    // First "Practices" is the pill, second is the section heading. Press pill.
    fireEvent.press(getAllByText(/Practices/)[0]);
    expect(onCategoryChange).toHaveBeenCalledWith("practices");
  });

  // 12. Three sections render
  it("renders Practices, Journal, and Articles sections", () => {
    const { getByTestId } = render(<SearchResultsScreen {...makeProps()} />);
    expect(getByTestId("practices-section")).toBeTruthy();
    expect(getByTestId("journal-section")).toBeTruthy();
    expect(getByTestId("articles-section")).toBeTruthy();
  });

  // 13. Practice rows render
  it("renders both default practice result rows", () => {
    const { getByTestId } = render(<SearchResultsScreen {...makeProps()} />);
    expect(getByTestId("result-row-practice-478")).toBeTruthy();
    expect(getByTestId("result-row-practice-body-scan")).toBeTruthy();
  });

  // 14. Practice result press
  it("calls onResultPress with id and 'practice' when a practice row pressed", () => {
    const onResultPress = jest.fn();
    const { getByTestId } = render(
      <SearchResultsScreen {...makeProps({ onResultPress })} />,
    );
    fireEvent.press(getByTestId("result-row-practice-478"));
    expect(onResultPress).toHaveBeenCalledWith("practice-478", "practice");
  });

  // 15. Journal row press
  it("calls onResultPress with 'journal' type when journal row pressed", () => {
    const onResultPress = jest.fn();
    const { getByTestId } = render(
      <SearchResultsScreen {...makeProps({ onResultPress })} />,
    );
    fireEvent.press(getByTestId("result-row-journal-apr-3"));
    expect(onResultPress).toHaveBeenCalledWith("journal-apr-3", "journal");
  });

  // 16. Article row press
  it("calls onResultPress with 'article' type when article row pressed", () => {
    const onResultPress = jest.fn();
    const { getByTestId } = render(
      <SearchResultsScreen {...makeProps({ onResultPress })} />,
    );
    fireEvent.press(getByTestId("result-row-article-triggers"));
    expect(onResultPress).toHaveBeenCalledWith("article-triggers", "article");
  });

  // 17. All-N section links render
  it("renders the All-N link buttons for each section", () => {
    const { getByTestId } = render(<SearchResultsScreen {...makeProps()} />);
    expect(getByTestId("practices-all-link")).toBeTruthy();
    expect(getByTestId("journal-all-link")).toBeTruthy();
    expect(getByTestId("articles-all-link")).toBeTruthy();
  });

  // 18. All-N link redirects to category
  it("All-N link routes to its category via onCategoryChange", () => {
    const onCategoryChange = jest.fn();
    const { getByTestId } = render(
      <SearchResultsScreen {...makeProps({ onCategoryChange })} />,
    );
    fireEvent.press(getByTestId("practices-all-link"));
    expect(onCategoryChange).toHaveBeenCalledWith("practices");
  });

  // 19. Journal mood + article read-time render
  it("renders journal mood and article read-time", () => {
    const { getByText } = render(<SearchResultsScreen {...makeProps()} />);
    expect(getByText("Stressed")).toBeTruthy();
    expect(getByText(/6 min read/)).toBeTruthy();
  });

  // 20. Touch target — back
  it("back button meets 44pt minimum touch target", () => {
    const { getByTestId } = render(<SearchResultsScreen {...makeProps()} />);
    const { StyleSheet } = require("react-native");
    const flat = StyleSheet.flatten(getByTestId("back-button").props.style);
    expect(flat.height).toBeGreaterThanOrEqual(44);
    expect(flat.width).toBeGreaterThanOrEqual(44);
  });

  // 21. Default search results sanity
  it("DEFAULT_SEARCH_RESULTS exposes 24 total results", () => {
    expect(DEFAULT_SEARCH_RESULTS.totalCount).toBe(24);
    expect(DEFAULT_SEARCH_RESULTS.categoryCounts.practices).toBe(7);
  });

  // 22. Branding — no Freud
  it("does not contain any Freud branding", () => {
    const { queryByText } = render(<SearchResultsScreen {...makeProps()} />);
    expect(queryByText(/freud/i)).toBeNull();
  });
});
