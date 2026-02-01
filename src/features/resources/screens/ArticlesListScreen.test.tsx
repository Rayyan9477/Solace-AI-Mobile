/**
 * ArticlesListScreen Tests
 * @description Tests for TDD implementation of Screen 113
 * @audit-fix Replaced "Freud App" with "Solace App" in article titles
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { ArticlesListScreen } from "./ArticlesListScreen";

const defaultCategories = [
  { id: "stress", label: "Stress", icon: "\u{1F9E0}" },
  { id: "anxiety", label: "Anxiety", icon: "\u{1F49C}" },
  { id: "health", label: "Health", icon: "\u{1F3E5}" },
  { id: "status", label: "Status", icon: "\u{1F4CC}" },
  { id: "healing", label: "Healing", icon: "\u{1F33F}" },
];

const defaultArticles = [
  {
    id: "1",
    title: "How Solace App Helps Mental Health Support",
    category: "AI/ML",
  },
  {
    id: "2",
    title: "Solace App: Your Pocket Therapist for Mental Wellness",
    category: "Mental Health",
  },
  {
    id: "3",
    title: "Exploring the Depths of Mental Health with Solace App",
    category: "Tips & Tricks",
  },
];

const defaultProps = {
  searchPlaceholder: "Search 2,152 articles...",
  searchQuery: "",
  categories: defaultCategories,
  selectedCategoryId: null as string | null,
  articles: defaultArticles,
  onBack: jest.fn(),
  onSearchChange: jest.fn(),
  onCategorySelect: jest.fn(),
  onSeeAllCategories: jest.fn(),
  onArticlePress: jest.fn(),
  onArticleOptions: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<ArticlesListScreen {...defaultProps} {...overrides} />);
}

describe("ArticlesListScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Rendering
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("articles-list-screen")).toBeTruthy();
  });

  it("renders as a full-screen flex container", () => {
    const { getByTestId } = renderScreen();
    const container = getByTestId("articles-list-screen");
    expect(container.props.style).toEqual(expect.objectContaining({ flex: 1 }));
  });

  // Header
  it("renders the back button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("back button has accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button").props.accessibilityRole).toBe("button");
  });

  it("back button has accessibilityLabel", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button").props.accessibilityLabel).toBe("Go back");
  });

  it("back button meets minimum touch target size", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("back-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.minHeight).toBeGreaterThanOrEqual(44);
    expect(flatStyle.minWidth).toBeGreaterThanOrEqual(44);
  });

  it("displays 'Our Articles' title", () => {
    const { getByText } = renderScreen();
    expect(getByText("Our Articles")).toBeTruthy();
  });

  // Search
  it("renders the search input", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("search-input")).toBeTruthy();
  });

  it("search input has placeholder text", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("search-input").props.placeholder).toBe(
      "Search 2,152 articles...",
    );
  });

  it("calls onSearchChange when text is entered", () => {
    const onSearchChange = jest.fn();
    const { getByTestId } = renderScreen({ onSearchChange });
    fireEvent.changeText(getByTestId("search-input"), "meditation");
    expect(onSearchChange).toHaveBeenCalledWith("meditation");
  });

  // Category Pills
  it("displays 'Suggested Category' section header", () => {
    const { getByText } = renderScreen();
    expect(getByText("Suggested Category")).toBeTruthy();
  });

  it("renders 'See All' for categories", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("see-all-categories")).toBeTruthy();
  });

  it("calls onSeeAllCategories when See All is pressed", () => {
    const onSeeAllCategories = jest.fn();
    const { getByTestId } = renderScreen({ onSeeAllCategories });
    fireEvent.press(getByTestId("see-all-categories"));
    expect(onSeeAllCategories).toHaveBeenCalledTimes(1);
  });

  it("renders category pills", () => {
    const { getByTestId } = renderScreen();
    defaultCategories.forEach((cat) => {
      expect(getByTestId(`category-pill-${cat.id}`)).toBeTruthy();
    });
  });

  it("displays category labels", () => {
    const { getByText } = renderScreen();
    expect(getByText("Stress")).toBeTruthy();
    expect(getByText("Anxiety")).toBeTruthy();
    expect(getByText("Health")).toBeTruthy();
  });

  it("calls onCategorySelect when pill is pressed", () => {
    const onCategorySelect = jest.fn();
    const { getByTestId } = renderScreen({ onCategorySelect });
    fireEvent.press(getByTestId("category-pill-stress"));
    expect(onCategorySelect).toHaveBeenCalledWith("stress");
  });

  it("category pills have accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("category-pill-stress").props.accessibilityRole).toBe(
      "button",
    );
  });

  // Articles Section
  it("displays 'All Articles' section header", () => {
    const { getByText } = renderScreen();
    expect(getByText("All Articles")).toBeTruthy();
  });

  it("renders article cards", () => {
    const { getByTestId } = renderScreen();
    defaultArticles.forEach((article) => {
      expect(getByTestId(`article-card-${article.id}`)).toBeTruthy();
    });
  });

  it("displays article titles", () => {
    const { getByText } = renderScreen();
    expect(
      getByText("How Solace App Helps Mental Health Support"),
    ).toBeTruthy();
  });

  it("displays article category badges", () => {
    const { getByText } = renderScreen();
    expect(getByText("AI/ML")).toBeTruthy();
    expect(getByText("Mental Health")).toBeTruthy();
    expect(getByText("Tips & Tricks")).toBeTruthy();
  });

  it("calls onArticlePress when article card is pressed", () => {
    const onArticlePress = jest.fn();
    const { getByTestId } = renderScreen({ onArticlePress });
    fireEvent.press(getByTestId("article-card-1"));
    expect(onArticlePress).toHaveBeenCalledWith("1");
  });

  it("article cards have accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("article-card-1").props.accessibilityRole).toBe(
      "button",
    );
  });

  // Branding
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
