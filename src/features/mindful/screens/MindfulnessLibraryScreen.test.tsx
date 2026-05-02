/**
 * MindfulnessLibraryScreen Tests — prototype v4.2 #30
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import { MindfulnessLibraryScreen } from "./MindfulnessLibraryScreen";

const baseProps = {
  onSearch: jest.fn(),
  onCategoryChange: jest.fn(),
  onSelectSession: jest.fn(),
  onFeatured: jest.fn(),
};

function renderScreen(overrides: Record<string, unknown> = {}) {
  return render(<MindfulnessLibraryScreen {...baseProps} {...overrides} />);
}

describe("MindfulnessLibraryScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("mindfulness-library-screen")).toBeTruthy();
  });

  it("displays the headline 'Find your calm'", () => {
    const { getByText } = renderScreen();
    expect(getByText("Find your calm")).toBeTruthy();
  });

  it("renders the search button with a11y", () => {
    const { getByTestId } = renderScreen();
    const search = getByTestId("search-button");
    expect(search.props.accessibilityRole).toBe("button");
    expect(search.props.accessibilityLabel).toBe("Search practices");
  });

  it("invokes onSearch when search pressed", () => {
    const onSearch = jest.fn();
    const { getByTestId } = renderScreen({ onSearch });
    fireEvent.press(getByTestId("search-button"));
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it("renders the featured card with a11y label", () => {
    const { getByTestId } = renderScreen();
    const featured = getByTestId("featured-card");
    expect(featured.props.accessibilityRole).toBe("button");
    expect(featured.props.accessibilityLabel).toContain("Monday reset");
    expect(featured.props.accessibilityLabel).toContain("10 minutes");
  });

  it("invokes onFeatured when featured card pressed", () => {
    const onFeatured = jest.fn();
    const { getByTestId } = renderScreen({ onFeatured });
    fireEvent.press(getByTestId("featured-card"));
    expect(onFeatured).toHaveBeenCalledTimes(1);
  });

  it("renders all default categories", () => {
    const { getByTestId } = renderScreen();
    const ids = ["for-you", "quick", "sleep", "anxiety", "focus", "body-scan", "loving-kindness"];
    for (const id of ids) {
      expect(getByTestId(`category-${id}`)).toBeTruthy();
    }
  });

  it("marks selected category with selected state", () => {
    const { getByTestId } = renderScreen({ selectedCategory: "anxiety" });
    expect(getByTestId("category-anxiety").props.accessibilityState).toEqual(
      expect.objectContaining({ selected: true }),
    );
    expect(getByTestId("category-for-you").props.accessibilityState).toEqual(
      expect.objectContaining({ selected: false }),
    );
  });

  it("invokes onCategoryChange when a pill pressed", () => {
    const onCategoryChange = jest.fn();
    const { getByTestId } = renderScreen({ onCategoryChange });
    fireEvent.press(getByTestId("category-sleep"));
    expect(onCategoryChange).toHaveBeenCalledWith("sleep");
  });

  it("renders the 6 default sessions", () => {
    const { getByTestId } = renderScreen();
    const ids = ["breath-478", "body-scan", "loving-kindness", "noting", "wind-down", "quick-reset"];
    for (const id of ids) {
      expect(getByTestId(`session-${id}`)).toBeTruthy();
    }
  });

  it("invokes onSelectSession when a tile pressed", () => {
    const onSelectSession = jest.fn();
    const { getByTestId } = renderScreen({ onSelectSession });
    fireEvent.press(getByTestId("session-breath-478"));
    expect(onSelectSession).toHaveBeenCalledWith("breath-478");
  });

  it("session tile a11y label includes title and duration", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("session-breath-478").props.accessibilityLabel).toBe(
      "4-7-8 breath, 4 minutes",
    );
  });

  it("renders custom sessions when provided", () => {
    const custom = [
      { id: "test", title: "Test", durationMinutes: 7, hue: "sage" as const, iconName: "wind" },
    ];
    const { getByTestId, queryByTestId } = renderScreen({ sessions: custom });
    expect(getByTestId("session-test")).toBeTruthy();
    expect(queryByTestId("session-breath-478")).toBeNull();
  });

  it("uses custom featured prop", () => {
    const { getByText } = renderScreen({
      featured: { id: "x", title: "Custom hero", italicLine: "session", durationMinutes: 5, category: "Daily" },
    });
    expect(getByText("Custom hero")).toBeTruthy();
    expect(getByText("session")).toBeTruthy();
  });

  it("search button meets 44pt touch target", () => {
    const { getByTestId } = renderScreen();
    const flat = Object.assign({}, ...[].concat(getByTestId("search-button").props.style));
    expect(flat.minHeight).toBeGreaterThanOrEqual(44);
    expect(flat.minWidth).toBeGreaterThanOrEqual(44);
  });

  it("category pills meet 36pt min height", () => {
    const { getByTestId } = renderScreen();
    const flat = Object.assign({}, ...[].concat(getByTestId("category-sleep").props.style));
    expect(flat.minHeight).toBeGreaterThanOrEqual(36);
  });

  it("does not contain Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
