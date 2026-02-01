/**
 * CoursePlayerScreen Tests
 * @task Task 3.13.6: Course Player Screen (Screen 117)
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { CoursePlayerScreen } from "./CoursePlayerScreen";

const defaultProps = {
  lessonTitle: "Mindfulness Meditation Intro",
  timerDisplay: "05:55",
  progress: 0.6,
  isPlaying: true,
  nextLessonTitle: "First Session Meditation",
  nextLessonDuration: "15min",
  nextLessonRating: "4.15",
  onBack: jest.fn(),
  onPlayPause: jest.fn(),
  onNextLesson: jest.fn(),
};

describe("CoursePlayerScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  // --- Container ---
  it("renders the screen container", () => {
    const { getByTestId } = render(<CoursePlayerScreen {...defaultProps} />);
    expect(getByTestId("course-player-screen")).toBeTruthy();
  });

  it("renders as a full-screen flex container", () => {
    const { getByTestId } = render(<CoursePlayerScreen {...defaultProps} />);
    const container = getByTestId("course-player-screen");
    const flat = Object.assign({}, ...[].concat(container.props.style));
    expect(flat.flex).toBe(1);
  });

  it("uses green background color", () => {
    const { getByTestId } = render(<CoursePlayerScreen {...defaultProps} />);
    const container = getByTestId("course-player-screen");
    const flat = Object.assign({}, ...[].concat(container.props.style));
    expect(flat.backgroundColor).toBe("#9AAD5C");
  });

  // --- Header ---
  it("renders the back button", () => {
    const { getByTestId } = render(<CoursePlayerScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<CoursePlayerScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
  });

  it("back button has accessibilityRole button", () => {
    const { getByTestId } = render(<CoursePlayerScreen {...defaultProps} />);
    expect(getByTestId("back-button").props.accessibilityRole).toBe("button");
  });

  it("back button has accessibilityLabel", () => {
    const { getByTestId } = render(<CoursePlayerScreen {...defaultProps} />);
    expect(getByTestId("back-button").props.accessibilityLabel).toBeTruthy();
  });

  it("back button meets minimum touch target size", () => {
    const { getByTestId } = render(<CoursePlayerScreen {...defaultProps} />);
    const flat = Object.assign(
      {},
      ...[].concat(getByTestId("back-button").props.style),
    );
    expect(flat.minHeight).toBeGreaterThanOrEqual(44);
    expect(flat.minWidth).toBeGreaterThanOrEqual(44);
  });

  it("displays 'Courses' header title", () => {
    const { getByText } = render(<CoursePlayerScreen {...defaultProps} />);
    expect(getByText("Courses")).toBeTruthy();
  });

  // --- Lesson Title ---
  it("displays the lesson title", () => {
    const { getByText } = render(<CoursePlayerScreen {...defaultProps} />);
    expect(getByText("Mindfulness Meditation Intro")).toBeTruthy();
  });

  // --- Progress Ring ---
  it("renders the circular progress ring", () => {
    const { getByTestId } = render(<CoursePlayerScreen {...defaultProps} />);
    expect(getByTestId("progress-ring")).toBeTruthy();
  });

  // --- Play/Pause Button ---
  it("renders the play-pause button", () => {
    const { getByTestId } = render(<CoursePlayerScreen {...defaultProps} />);
    expect(getByTestId("play-pause-button")).toBeTruthy();
  });

  it("calls onPlayPause when button is pressed", () => {
    const { getByTestId } = render(<CoursePlayerScreen {...defaultProps} />);
    fireEvent.press(getByTestId("play-pause-button"));
    expect(defaultProps.onPlayPause).toHaveBeenCalledTimes(1);
  });

  it("play-pause button has accessibilityRole button", () => {
    const { getByTestId } = render(<CoursePlayerScreen {...defaultProps} />);
    expect(getByTestId("play-pause-button").props.accessibilityRole).toBe(
      "button",
    );
  });

  it("shows Pause label when playing", () => {
    const { getByTestId } = render(
      <CoursePlayerScreen {...defaultProps} isPlaying />,
    );
    expect(getByTestId("play-pause-button").props.accessibilityLabel).toBe(
      "Pause",
    );
  });

  it("shows Play label when paused", () => {
    const { getByTestId } = render(
      <CoursePlayerScreen {...defaultProps} isPlaying={false} />,
    );
    expect(getByTestId("play-pause-button").props.accessibilityLabel).toBe(
      "Play",
    );
  });

  it("play-pause button meets minimum touch target size", () => {
    const { getByTestId } = render(<CoursePlayerScreen {...defaultProps} />);
    const flat = Object.assign(
      {},
      ...[].concat(getByTestId("play-pause-button").props.style),
    );
    expect(flat.minHeight).toBeGreaterThanOrEqual(44);
    expect(flat.minWidth).toBeGreaterThanOrEqual(44);
  });

  // --- Timer Display ---
  it("displays the timer", () => {
    const { getByTestId } = render(<CoursePlayerScreen {...defaultProps} />);
    expect(getByTestId("timer-display")).toBeTruthy();
  });

  it("shows the timer value", () => {
    const { getByText } = render(<CoursePlayerScreen {...defaultProps} />);
    expect(getByText("05:55")).toBeTruthy();
  });

  // --- Next Lesson Card ---
  it("renders the next lesson card", () => {
    const { getByTestId } = render(<CoursePlayerScreen {...defaultProps} />);
    expect(getByTestId("next-lesson-card")).toBeTruthy();
  });

  it("displays 'NEXT COURSE' label", () => {
    const { getByText } = render(<CoursePlayerScreen {...defaultProps} />);
    expect(getByText("NEXT COURSE")).toBeTruthy();
  });

  it("displays next lesson title", () => {
    const { getByText } = render(<CoursePlayerScreen {...defaultProps} />);
    expect(getByText("First Session Meditation")).toBeTruthy();
  });

  it("displays next lesson duration", () => {
    const { getByText } = render(<CoursePlayerScreen {...defaultProps} />);
    expect(getByText("15min")).toBeTruthy();
  });

  it("displays next lesson rating", () => {
    const { getByText } = render(<CoursePlayerScreen {...defaultProps} />);
    expect(getByText(/4\.15/)).toBeTruthy();
  });

  it("calls onNextLesson when next lesson card is pressed", () => {
    const { getByTestId } = render(<CoursePlayerScreen {...defaultProps} />);
    fireEvent.press(getByTestId("next-lesson-card"));
    expect(defaultProps.onNextLesson).toHaveBeenCalledTimes(1);
  });

  it("next lesson card has accessibilityRole button", () => {
    const { getByTestId } = render(<CoursePlayerScreen {...defaultProps} />);
    expect(getByTestId("next-lesson-card").props.accessibilityRole).toBe(
      "button",
    );
  });

  // --- Branding ---
  it("does not contain any Freud branding", () => {
    const { queryByText } = render(<CoursePlayerScreen {...defaultProps} />);
    expect(queryByText(/freud/i)).toBeNull();
  });
});
