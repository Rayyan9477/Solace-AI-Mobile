/**
 * FilterSearchBottomSheet Tests
 * @description Tests for the search filter bottom sheet with category, date, and limit controls
 * @task Task 3.15.5: Filter Search Bottom Sheet (Screen 133)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { FilterSearchBottomSheet } from "./FilterSearchBottomSheet";

const mockCategories = [
  { id: "journal", label: "Journal", icon: "\uD83D\uDCD3" },
  { id: "sleep", label: "Sleep", icon: "\uD83D\uDECF" },
  { id: "community", label: "Community", icon: "\uD83D\uDC65" },
];

const defaultProps = {
  categories: mockCategories,
  selectedCategoryId: "sleep" as string | null,
  selectedDate: "25 January, 2025",
  minLimit: 20,
  maxLimit: 50,
  resultCount: 21,
  onCategorySelect: jest.fn(),
  onDatePress: jest.fn(),
  onLimitChange: jest.fn(),
  onApply: jest.fn(),
  onClose: jest.fn(),
};

function renderSheet(overrides = {}) {
  return render(<FilterSearchBottomSheet {...defaultProps} {...overrides} />);
}

beforeEach(() => jest.clearAllMocks());

describe("FilterSearchBottomSheet", () => {
  // ── Rendering ──────────────────────────────────────────
  it("renders the bottom sheet container", () => {
    const { getByTestId } = renderSheet();
    expect(getByTestId("filter-search-bottom-sheet")).toBeTruthy();
  });

  it("renders the title 'Filter Search Result'", () => {
    const { getByText } = renderSheet();
    expect(getByText("Filter Search Result")).toBeTruthy();
  });

  // ── Category Section ───────────────────────────────────
  it("renders the 'Search Category' section label", () => {
    const { getByText } = renderSheet();
    expect(getByText("Search Category")).toBeTruthy();
  });

  it("renders all category pills", () => {
    const { getByTestId } = renderSheet();
    mockCategories.forEach((cat) => {
      expect(getByTestId(`category-pill-${cat.id}`)).toBeTruthy();
    });
  });

  it("renders category pill labels", () => {
    const { getByText } = renderSheet();
    expect(getByText(/Journal/)).toBeTruthy();
    expect(getByText(/Sleep/)).toBeTruthy();
    expect(getByText(/Community/)).toBeTruthy();
  });

  it("highlights the selected category pill", () => {
    const { getByTestId } = renderSheet({ selectedCategoryId: "sleep" });
    const pill = getByTestId("category-pill-sleep");
    const style = Object.assign({}, ...[].concat(pill.props.style));
    expect(style.backgroundColor).toBeDefined();
  });

  // ── Date Section ───────────────────────────────────────
  it("renders the 'Search Date' section label", () => {
    const { getByText } = renderSheet();
    expect(getByText("Search Date")).toBeTruthy();
  });

  it("renders the date picker field", () => {
    const { getByTestId } = renderSheet();
    expect(getByTestId("date-picker-field")).toBeTruthy();
  });

  it("displays the selected date", () => {
    const { getByText } = renderSheet();
    expect(getByText("25 January, 2025")).toBeTruthy();
  });

  // ── Limit Section ─────────────────────────────────────
  it("renders the 'Search Limit' section label", () => {
    const { getByText } = renderSheet();
    expect(getByText("Search Limit")).toBeTruthy();
  });

  it("renders the limit slider", () => {
    const { getByTestId } = renderSheet();
    expect(getByTestId("limit-slider")).toBeTruthy();
  });

  it("displays min and max limit values", () => {
    const { getByText } = renderSheet();
    expect(getByText("20")).toBeTruthy();
    expect(getByText("50")).toBeTruthy();
  });

  // ── Apply Button ───────────────────────────────────────
  it("renders the apply button with result count", () => {
    const { getByTestId } = renderSheet();
    expect(getByTestId("apply-filter-button")).toBeTruthy();
  });

  it("displays the result count in the apply button", () => {
    const { getByText } = renderSheet();
    expect(getByText(/Filter Search Results \(21\)/)).toBeTruthy();
  });

  it("updates result count when prop changes", () => {
    const { getByText } = renderSheet({ resultCount: 0 });
    expect(getByText(/Filter Search Results \(0\)/)).toBeTruthy();
  });

  // ── Callbacks ──────────────────────────────────────────
  it("calls onCategorySelect with category id when pill pressed", () => {
    const onCategorySelect = jest.fn();
    const { getByTestId } = renderSheet({ onCategorySelect });
    fireEvent.press(getByTestId("category-pill-journal"));
    expect(onCategorySelect).toHaveBeenCalledWith("journal");
  });

  it("calls onDatePress when date picker is pressed", () => {
    const onDatePress = jest.fn();
    const { getByTestId } = renderSheet({ onDatePress });
    fireEvent.press(getByTestId("date-picker-field"));
    expect(onDatePress).toHaveBeenCalledTimes(1);
  });

  it("calls onApply when apply button is pressed", () => {
    const onApply = jest.fn();
    const { getByTestId } = renderSheet({ onApply });
    fireEvent.press(getByTestId("apply-filter-button"));
    expect(onApply).toHaveBeenCalledTimes(1);
  });

  // ── Accessibility ──────────────────────────────────────
  it("category pills have accessibilityRole 'button'", () => {
    const { getByTestId } = renderSheet();
    expect(getByTestId("category-pill-journal").props.accessibilityRole).toBe(
      "button",
    );
  });

  it("date picker has accessibilityLabel 'Select date'", () => {
    const { getByTestId } = renderSheet();
    expect(getByTestId("date-picker-field").props.accessibilityLabel).toBe(
      "Select date",
    );
  });

  it("apply button has accessibilityLabel with result count", () => {
    const { getByTestId } = renderSheet();
    expect(
      getByTestId("apply-filter-button").props.accessibilityLabel,
    ).toContain("21");
  });

  it("apply button meets 44px minimum touch height", () => {
    const { getByTestId } = renderSheet();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("apply-filter-button").props.style),
    );
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
  });

  // ── Styling ────────────────────────────────────────────
  it("applies bottom sheet background color", () => {
    const { getByTestId } = renderSheet();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("filter-search-bottom-sheet").props.style),
    );
    expect(style.backgroundColor).toBe("#2A1F18");
  });

  // ── Branding ───────────────────────────────────────────
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderSheet();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
