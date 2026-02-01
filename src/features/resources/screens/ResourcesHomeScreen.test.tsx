/**
 * ResourcesHomeScreen Tests
 * @description Tests for TDD implementation of Screen 112
 * @audit-fix Replaced "Freud App" with "Solace App" per branding guidelines
 * @audit-fix Replaced "Dr. Hannibal Lector" with "Dr. Sarah Mitchell"
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { ResourcesHomeScreen } from "./ResourcesHomeScreen";

const defaultArticles = [
  {
    id: "1",
    title: "Will meditation help you get out from the rat race?",
    category: "Mental Health",
    views: "5,241",
    likes: "987",
    comments: "22",
  },
  {
    id: "2",
    title: "Will meditation get out from the stress?",
    category: "Stress",
    views: "5,241",
    likes: "987",
    comments: "91",
  },
];

const defaultCourses = [
  {
    id: "1",
    title: "Mindfulness 101",
    instructor: "Dr. Sarah Mitchell",
    rating: "4.5",
    views: "200K",
    lessons: "23",
  },
  {
    id: "2",
    title: "Indian Meditation",
    instructor: "By Alan Watts",
    rating: "3.5",
    views: "185K",
    lessons: "44",
  },
  {
    id: "3",
    title: "African Meditation",
    instructor: "By Clayton Hughes",
    rating: "4.5",
    views: "200K",
    lessons: "23",
  },
];

const defaultProps = {
  articleCount: "185",
  courseCount: "512",
  featuredTitle: "Solace App: Your Pocket Therapist for Mental Wellness",
  featuredCategory: "Mental Health",
  articles: defaultArticles,
  courses: defaultCourses,
  onBack: jest.fn(),
  onFeaturedPress: jest.fn(),
  onFeaturedOptions: jest.fn(),
  onSeeAllArticles: jest.fn(),
  onArticlePress: jest.fn(),
  onSeeAllCourses: jest.fn(),
  onCoursePress: jest.fn(),
  onAddPress: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<ResourcesHomeScreen {...defaultProps} {...overrides} />);
}

describe("ResourcesHomeScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Rendering
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("resources-home-screen")).toBeTruthy();
  });

  it("renders as a full-screen flex container", () => {
    const { getByTestId } = renderScreen();
    const container = getByTestId("resources-home-screen");
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

  // Title
  it("displays 'Our Resources' title", () => {
    const { getByText } = renderScreen();
    expect(getByText("Our Resources")).toBeTruthy();
  });

  // Stats Row
  it("displays article count", () => {
    const { getByText } = renderScreen();
    expect(getByText(/185 Articles/)).toBeTruthy();
  });

  it("displays course count", () => {
    const { getByText } = renderScreen();
    expect(getByText(/512 Courses/)).toBeTruthy();
  });

  // Featured Resource
  it("renders the featured resource section", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("featured-resource")).toBeTruthy();
  });

  it("displays 'Featured Resource' label", () => {
    const { getByText } = renderScreen();
    expect(getByText("Featured Resource")).toBeTruthy();
  });

  it("displays featured title", () => {
    const { getByText } = renderScreen();
    expect(
      getByText("Solace App: Your Pocket Therapist for Mental Wellness"),
    ).toBeTruthy();
  });

  it("displays featured category badge", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("featured-category-badge")).toBeTruthy();
  });

  it("calls onFeaturedPress when featured card is pressed", () => {
    const onFeaturedPress = jest.fn();
    const { getByTestId } = renderScreen({ onFeaturedPress });
    fireEvent.press(getByTestId("featured-resource"));
    expect(onFeaturedPress).toHaveBeenCalledTimes(1);
  });

  it("renders the featured options button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("featured-options-button")).toBeTruthy();
  });

  it("calls onFeaturedOptions when options button is pressed", () => {
    const onFeaturedOptions = jest.fn();
    const { getByTestId } = renderScreen({ onFeaturedOptions });
    fireEvent.press(getByTestId("featured-options-button"));
    expect(onFeaturedOptions).toHaveBeenCalledTimes(1);
  });

  // Articles Section
  it("displays 'Our Articles' section header", () => {
    const { getByText } = renderScreen();
    expect(getByText("Our Articles")).toBeTruthy();
  });

  it("renders 'See All' link for articles", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("see-all-articles")).toBeTruthy();
  });

  it("calls onSeeAllArticles when See All is pressed", () => {
    const onSeeAllArticles = jest.fn();
    const { getByTestId } = renderScreen({ onSeeAllArticles });
    fireEvent.press(getByTestId("see-all-articles"));
    expect(onSeeAllArticles).toHaveBeenCalledTimes(1);
  });

  it("renders article cards", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("article-card-1")).toBeTruthy();
    expect(getByTestId("article-card-2")).toBeTruthy();
  });

  it("displays article titles", () => {
    const { getByText } = renderScreen();
    expect(
      getByText("Will meditation help you get out from the rat race?"),
    ).toBeTruthy();
  });

  it("calls onArticlePress when article card is pressed", () => {
    const onArticlePress = jest.fn();
    const { getByTestId } = renderScreen({ onArticlePress });
    fireEvent.press(getByTestId("article-card-1"));
    expect(onArticlePress).toHaveBeenCalledWith("1");
  });

  // Courses Section
  it("displays 'Our Courses' section header", () => {
    const { getByText } = renderScreen();
    expect(getByText("Our Courses")).toBeTruthy();
  });

  it("renders course rows", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("course-row-1")).toBeTruthy();
    expect(getByTestId("course-row-2")).toBeTruthy();
    expect(getByTestId("course-row-3")).toBeTruthy();
  });

  it("displays course titles", () => {
    const { getByText } = renderScreen();
    expect(getByText("Mindfulness 101")).toBeTruthy();
    expect(getByText("Indian Meditation")).toBeTruthy();
    expect(getByText("African Meditation")).toBeTruthy();
  });

  it("calls onCoursePress when course row is pressed", () => {
    const onCoursePress = jest.fn();
    const { getByTestId } = renderScreen({ onCoursePress });
    fireEvent.press(getByTestId("course-row-1"));
    expect(onCoursePress).toHaveBeenCalledWith("1");
  });

  it("course rows have accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("course-row-1").props.accessibilityRole).toBe("button");
  });

  // FAB
  it("renders the add button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("add-button")).toBeTruthy();
  });

  it("calls onAddPress when add button is pressed", () => {
    const onAddPress = jest.fn();
    const { getByTestId } = renderScreen({ onAddPress });
    fireEvent.press(getByTestId("add-button"));
    expect(onAddPress).toHaveBeenCalledTimes(1);
  });

  it("add button has accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("add-button").props.accessibilityRole).toBe("button");
  });

  it("add button meets minimum touch target size", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("add-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.minHeight).toBeGreaterThanOrEqual(44);
    expect(flatStyle.minWidth).toBeGreaterThanOrEqual(44);
  });

  // Branding
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });

  it("does not contain inappropriate instructor names", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/hannibal/i)).toBeNull();
    expect(queryByText(/lector/i)).toBeNull();
  });
});
