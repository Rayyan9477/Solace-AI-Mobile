/**
 * CourseDetailScreen Tests
 * @task Task 3.13.5: Course Detail Screen (Screen 116)
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { CourseDetailScreen } from "./CourseDetailScreen";

const defaultLessons = [
  { id: "l1", title: "Meditation Intro", duration: "~10 Min", rating: "4.14" },
  { id: "l2", title: "Self Reflection", duration: "~15 Min", rating: "4.32" },
  { id: "l3", title: "First Session", duration: "~12 Min", rating: "4.08" },
];

const defaultProps = {
  title: "Mindfulness 101",
  categories: ["Course", "Freebie"],
  rating: "4.1",
  views: "19M",
  lessonCount: "423",
  instructorName: "Dr. Sarah Mitchell",
  isFollowing: false,
  description:
    "This course will teach you the basics of mindfulness meditation.",
  downloadSize: "1.2 GB Total",
  totalLessons: "10 Total",
  lessons: defaultLessons,
  onBack: jest.fn(),
  onFollow: jest.fn(),
  onDownload: jest.fn(),
  onLessonPress: jest.fn(),
  onGoPro: jest.fn(),
};

describe("CourseDetailScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  // --- Container ---
  it("renders the screen container", () => {
    const { getByTestId } = render(<CourseDetailScreen {...defaultProps} />);
    expect(getByTestId("course-detail-screen")).toBeTruthy();
  });

  it("renders as a full-screen flex container", () => {
    const { getByTestId } = render(<CourseDetailScreen {...defaultProps} />);
    const container = getByTestId("course-detail-screen");
    const flat = Object.assign({}, ...[].concat(container.props.style));
    expect(flat.flex).toBe(1);
  });

  // --- Header ---
  it("renders the back button", () => {
    const { getByTestId } = render(<CourseDetailScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<CourseDetailScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
  });

  it("back button has accessibilityRole button", () => {
    const { getByTestId } = render(<CourseDetailScreen {...defaultProps} />);
    expect(getByTestId("back-button").props.accessibilityRole).toBe("button");
  });

  it("back button has accessibilityLabel", () => {
    const { getByTestId } = render(<CourseDetailScreen {...defaultProps} />);
    expect(getByTestId("back-button").props.accessibilityLabel).toBeTruthy();
  });

  it("back button meets minimum touch target size", () => {
    const { getByTestId } = render(<CourseDetailScreen {...defaultProps} />);
    const flat = Object.assign(
      {},
      ...[].concat(getByTestId("back-button").props.style),
    );
    expect(flat.minHeight).toBeGreaterThanOrEqual(44);
    expect(flat.minWidth).toBeGreaterThanOrEqual(44);
  });

  it("displays 'Course Detail' header", () => {
    const { getByText } = render(<CourseDetailScreen {...defaultProps} />);
    expect(getByText("Course Detail")).toBeTruthy();
  });

  // --- Category Badges ---
  it("displays category badges", () => {
    const { getByText } = render(<CourseDetailScreen {...defaultProps} />);
    expect(getByText("Course")).toBeTruthy();
    expect(getByText("Freebie")).toBeTruthy();
  });

  // --- Course Title & Stats ---
  it("displays the course title", () => {
    const { getByText } = render(<CourseDetailScreen {...defaultProps} />);
    expect(getByText("Mindfulness 101")).toBeTruthy();
  });

  it("displays the rating", () => {
    const { getAllByText } = render(<CourseDetailScreen {...defaultProps} />);
    expect(getAllByText(/4\.1/).length).toBeGreaterThanOrEqual(1);
  });

  it("displays the view count", () => {
    const { getByText } = render(<CourseDetailScreen {...defaultProps} />);
    expect(getByText(/19M/)).toBeTruthy();
  });

  it("displays the lesson count in stats", () => {
    const { getByText } = render(<CourseDetailScreen {...defaultProps} />);
    expect(getByText(/423/)).toBeTruthy();
  });

  // --- Instructor Row ---
  it("displays the instructor name", () => {
    const { getByText } = render(<CourseDetailScreen {...defaultProps} />);
    expect(getByText(/Dr\. Sarah Mitchell/)).toBeTruthy();
  });

  it("renders the follow button", () => {
    const { getByTestId } = render(<CourseDetailScreen {...defaultProps} />);
    expect(getByTestId("follow-button")).toBeTruthy();
  });

  it("calls onFollow when follow button is pressed", () => {
    const { getByTestId } = render(<CourseDetailScreen {...defaultProps} />);
    fireEvent.press(getByTestId("follow-button"));
    expect(defaultProps.onFollow).toHaveBeenCalledTimes(1);
  });

  it("displays 'Following' when isFollowing is true", () => {
    const { getByText } = render(
      <CourseDetailScreen {...defaultProps} isFollowing />,
    );
    expect(getByText("Following")).toBeTruthy();
  });

  // --- Description ---
  it("displays course description", () => {
    const { getByText } = render(<CourseDetailScreen {...defaultProps} />);
    expect(getByText(defaultProps.description)).toBeTruthy();
  });

  // --- Download Section ---
  it("renders the download section", () => {
    const { getByTestId } = render(<CourseDetailScreen {...defaultProps} />);
    expect(getByTestId("download-section")).toBeTruthy();
  });

  it("displays download size", () => {
    const { getByText } = render(<CourseDetailScreen {...defaultProps} />);
    expect(getByText(/1\.2 GB Total/)).toBeTruthy();
  });

  it("calls onDownload when download is pressed", () => {
    const { getByTestId } = render(<CourseDetailScreen {...defaultProps} />);
    fireEvent.press(getByTestId("download-section"));
    expect(defaultProps.onDownload).toHaveBeenCalledTimes(1);
  });

  // --- Lesson List ---
  it("displays total lessons header", () => {
    const { getByText } = render(<CourseDetailScreen {...defaultProps} />);
    expect(getByText("10 Total")).toBeTruthy();
  });

  it("renders all lesson rows", () => {
    const { getByTestId } = render(<CourseDetailScreen {...defaultProps} />);
    defaultLessons.forEach((lesson) => {
      expect(getByTestId(`lesson-row-${lesson.id}`)).toBeTruthy();
    });
  });

  it("displays lesson titles", () => {
    const { getByText } = render(<CourseDetailScreen {...defaultProps} />);
    expect(getByText("Meditation Intro")).toBeTruthy();
    expect(getByText("Self Reflection")).toBeTruthy();
  });

  it("displays lesson durations", () => {
    const { getByText } = render(<CourseDetailScreen {...defaultProps} />);
    expect(getByText("~10 Min")).toBeTruthy();
  });

  it("calls onLessonPress with lesson id when pressed", () => {
    const { getByTestId } = render(<CourseDetailScreen {...defaultProps} />);
    fireEvent.press(getByTestId("lesson-row-l1"));
    expect(defaultProps.onLessonPress).toHaveBeenCalledWith("l1");
  });

  // --- Premium Paywall ---
  it("renders the premium paywall", () => {
    const { getByTestId } = render(<CourseDetailScreen {...defaultProps} />);
    expect(getByTestId("premium-paywall")).toBeTruthy();
  });

  it("displays 'Unlock the Full Course'", () => {
    const { getByText } = render(<CourseDetailScreen {...defaultProps} />);
    expect(getByText("Unlock the Full Course")).toBeTruthy();
  });

  it("renders the Go Pro button", () => {
    const { getByTestId } = render(<CourseDetailScreen {...defaultProps} />);
    expect(getByTestId("go-pro-button")).toBeTruthy();
  });

  it("calls onGoPro when Go Pro is pressed", () => {
    const { getByTestId } = render(<CourseDetailScreen {...defaultProps} />);
    fireEvent.press(getByTestId("go-pro-button"));
    expect(defaultProps.onGoPro).toHaveBeenCalledTimes(1);
  });

  it("Go Pro button has accessibilityRole button", () => {
    const { getByTestId } = render(<CourseDetailScreen {...defaultProps} />);
    expect(getByTestId("go-pro-button").props.accessibilityRole).toBe("button");
  });

  it("Go Pro button meets minimum touch target size", () => {
    const { getByTestId } = render(<CourseDetailScreen {...defaultProps} />);
    const flat = Object.assign(
      {},
      ...[].concat(getByTestId("go-pro-button").props.style),
    );
    expect(flat.minHeight).toBeGreaterThanOrEqual(44);
  });

  // --- Branding ---
  it("does not contain any Freud branding", () => {
    const { queryByText } = render(<CourseDetailScreen {...defaultProps} />);
    expect(queryByText(/freud/i)).toBeNull();
  });

  it("does not contain inappropriate instructor names", () => {
    const { queryByText } = render(<CourseDetailScreen {...defaultProps} />);
    expect(queryByText(/hannibal/i)).toBeNull();
    expect(queryByText(/lector/i)).toBeNull();
  });
});
