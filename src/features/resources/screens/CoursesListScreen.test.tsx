/**
 * CoursesListScreen Tests
 * @description Tests for TDD implementation of Screen 114
 * @audit-fix Replaced "Dr. Hannibal Lector" with "Dr. Sarah Mitchell"
 * @audit-fix Replaced "Clayton Biggsby" with "Clayton Hughes"
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { CoursesListScreen } from "./CoursesListScreen";

const defaultFilters = [
  { id: "health", label: "Health" },
  { id: "meditation", label: "Meditation" },
  { id: "stress", label: "Stress" },
  { id: "anxiety", label: "Anxiety" },
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
    instructor: "Clayton Hughes",
    rating: "4.5",
    views: "200K",
    lessons: "23",
  },
];

const defaultProps = {
  filters: defaultFilters,
  selectedFilterId: "health",
  featuredTitle: "Gratefulness in Nature",
  featuredInstructor: "By Ananyan U. Wu",
  featuredDuration: "15:00",
  courses: defaultCourses,
  onBack: jest.fn(),
  onFilterSelect: jest.fn(),
  onFeaturedPlay: jest.fn(),
  onSeeAllCourses: jest.fn(),
  onCoursePress: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<CoursesListScreen {...defaultProps} {...overrides} />);
}

describe("CoursesListScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Rendering
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("courses-list-screen")).toBeTruthy();
  });

  it("renders as a full-screen flex container", () => {
    const { getByTestId } = renderScreen();
    const container = getByTestId("courses-list-screen");
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

  it("displays 'Our Courses' title", () => {
    const { getByText } = renderScreen();
    expect(getByText("Our Courses")).toBeTruthy();
  });

  // Filter Chips
  it("renders filter chips", () => {
    const { getByTestId } = renderScreen();
    defaultFilters.forEach((f) => {
      expect(getByTestId(`filter-chip-${f.id}`)).toBeTruthy();
    });
  });

  it("displays filter labels", () => {
    const { getByText } = renderScreen();
    expect(getByText("Health")).toBeTruthy();
    expect(getByText("Meditation")).toBeTruthy();
    expect(getByText("Stress")).toBeTruthy();
  });

  it("selected filter has orange background", () => {
    const { getByTestId } = renderScreen();
    const chip = getByTestId("filter-chip-health");
    const flatStyle = Object.assign({}, ...[].concat(chip.props.style));
    expect(flatStyle.backgroundColor).toBe("#E8853A");
  });

  it("unselected filter has dark background", () => {
    const { getByTestId } = renderScreen();
    const chip = getByTestId("filter-chip-meditation");
    const flatStyle = Object.assign({}, ...[].concat(chip.props.style));
    expect(flatStyle.backgroundColor).toBe("#2A1F18");
  });

  it("calls onFilterSelect when chip is pressed", () => {
    const onFilterSelect = jest.fn();
    const { getByTestId } = renderScreen({ onFilterSelect });
    fireEvent.press(getByTestId("filter-chip-meditation"));
    expect(onFilterSelect).toHaveBeenCalledWith("meditation");
  });

  it("filter chips have accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("filter-chip-health").props.accessibilityRole).toBe(
      "button",
    );
  });

  // Featured Course
  it("renders the featured course section", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("featured-course")).toBeTruthy();
  });

  it("displays 'Featured Course' label", () => {
    const { getByText } = renderScreen();
    expect(getByText("Featured Course")).toBeTruthy();
  });

  it("displays featured title", () => {
    const { getByText } = renderScreen();
    expect(getByText("Gratefulness in Nature")).toBeTruthy();
  });

  it("displays featured instructor", () => {
    const { getByText } = renderScreen();
    expect(getByText("By Ananyan U. Wu")).toBeTruthy();
  });

  it("displays featured duration", () => {
    const { getByText } = renderScreen();
    expect(getByText("15:00")).toBeTruthy();
  });

  it("renders the play button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("featured-play-button")).toBeTruthy();
  });

  it("calls onFeaturedPlay when play button is pressed", () => {
    const onFeaturedPlay = jest.fn();
    const { getByTestId } = renderScreen({ onFeaturedPlay });
    fireEvent.press(getByTestId("featured-play-button"));
    expect(onFeaturedPlay).toHaveBeenCalledTimes(1);
  });

  it("play button has accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("featured-play-button").props.accessibilityRole).toBe(
      "button",
    );
  });

  it("play button meets minimum touch target size", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("featured-play-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.minHeight).toBeGreaterThanOrEqual(44);
    expect(flatStyle.minWidth).toBeGreaterThanOrEqual(44);
  });

  // All Courses
  it("displays 'All Courses' section header", () => {
    const { getByText } = renderScreen();
    expect(getByText("All Courses")).toBeTruthy();
  });

  it("renders 'See All' link", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("see-all-courses")).toBeTruthy();
  });

  it("renders course rows", () => {
    const { getByTestId } = renderScreen();
    defaultCourses.forEach((c) => {
      expect(getByTestId(`course-row-${c.id}`)).toBeTruthy();
    });
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

  // Branding
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });

  it("does not contain inappropriate instructor names", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/hannibal/i)).toBeNull();
    expect(queryByText(/lector/i)).toBeNull();
    expect(queryByText(/biggsby/i)).toBeNull();
  });
});
