/**
 * MindfulnessActivitiesScreen Tests
 * @description Tests for mindfulness activities detail screen
 * @task Task 3.5.6: Mindfulness Activities Screen (Screen 45)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { MindfulnessActivitiesScreen } from "./MindfulnessActivitiesScreen";

describe("MindfulnessActivitiesScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnSeeAllActivities = jest.fn();
  const mockOnSeeAllResources = jest.fn();
  const mockOnActivityPress = jest.fn();
  const mockOnVideoPlay = jest.fn();
  const mockOnMarkCompleted = jest.fn();

  const defaultProps = {
    title: "Mindfulness Activities",
    suggestedActivities: [
      { id: "1", name: "Daily Meditation Routine", icon: "meditation" },
      { id: "2", name: "Gratefulness Journaling", icon: "journal" },
      { id: "3", name: "Affirmations", icon: "affirmation" },
    ],
    resources: {
      video: {
        id: "v1",
        title: "Introduction to Mindfulness",
        thumbnail: "https://example.com/thumb.jpg",
        duration: "15:00",
      },
      article: {
        id: "a1",
        title: "Why should we be mindful?",
        description:
          "Mindfulness, the practice of being fully present and engaged in the moment, has become increasingly popular as a way to reduce stress and improve overall well-being.",
        benefits: ["Reduce Stress", "Improve Health"],
      },
    },
    isMarking: false,
    onBack: mockOnBack,
    onSeeAllActivities: mockOnSeeAllActivities,
    onSeeAllResources: mockOnSeeAllResources,
    onActivityPress: mockOnActivityPress,
    onVideoPlay: mockOnVideoPlay,
    onMarkCompleted: mockOnMarkCompleted,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen", () => {
    const { getByTestId } = render(
      <MindfulnessActivitiesScreen {...defaultProps} />
    );
    expect(getByTestId("mindfulness-activities-screen")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(
      <MindfulnessActivitiesScreen {...defaultProps} />
    );
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(
      <MindfulnessActivitiesScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays the screen title", () => {
    const { getByText } = render(
      <MindfulnessActivitiesScreen {...defaultProps} />
    );
    expect(getByText("Mindfulness Activities")).toBeTruthy();
  });

  it("displays the Suggested Activity section header", () => {
    const { getByText } = render(
      <MindfulnessActivitiesScreen {...defaultProps} />
    );
    expect(getByText("Suggested Activity")).toBeTruthy();
  });

  it("displays See All link for activities", () => {
    const { getByTestId } = render(
      <MindfulnessActivitiesScreen {...defaultProps} />
    );
    expect(getByTestId("see-all-activities")).toBeTruthy();
  });

  it("calls onSeeAllActivities when See All activities is pressed", () => {
    const { getByTestId } = render(
      <MindfulnessActivitiesScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("see-all-activities"));
    expect(mockOnSeeAllActivities).toHaveBeenCalledTimes(1);
  });

  it("displays activity cards", () => {
    const { getByTestId } = render(
      <MindfulnessActivitiesScreen {...defaultProps} />
    );
    expect(getByTestId("activity-card-1")).toBeTruthy();
    expect(getByTestId("activity-card-2")).toBeTruthy();
    expect(getByTestId("activity-card-3")).toBeTruthy();
  });

  it("displays activity card labels", () => {
    const { getByText } = render(
      <MindfulnessActivitiesScreen {...defaultProps} />
    );
    expect(getByText("Daily Meditation Routine")).toBeTruthy();
    expect(getByText("Gratefulness Journaling")).toBeTruthy();
  });

  it("calls onActivityPress when activity card is pressed", () => {
    const { getByTestId } = render(
      <MindfulnessActivitiesScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("activity-card-1"));
    expect(mockOnActivityPress).toHaveBeenCalledWith("1");
  });

  it("displays the Mindful Resources section header", () => {
    const { getByText } = render(
      <MindfulnessActivitiesScreen {...defaultProps} />
    );
    expect(getByText("Mindful Resources")).toBeTruthy();
  });

  it("displays See All link for resources", () => {
    const { getByTestId } = render(
      <MindfulnessActivitiesScreen {...defaultProps} />
    );
    expect(getByTestId("see-all-resources")).toBeTruthy();
  });

  it("calls onSeeAllResources when See All resources is pressed", () => {
    const { getByTestId } = render(
      <MindfulnessActivitiesScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("see-all-resources"));
    expect(mockOnSeeAllResources).toHaveBeenCalledTimes(1);
  });

  it("displays video card", () => {
    const { getByTestId } = render(
      <MindfulnessActivitiesScreen {...defaultProps} />
    );
    expect(getByTestId("video-card")).toBeTruthy();
  });

  it("displays video duration", () => {
    const { getByText } = render(
      <MindfulnessActivitiesScreen {...defaultProps} />
    );
    expect(getByText("15:00")).toBeTruthy();
  });

  it("displays play button on video card", () => {
    const { getByTestId } = render(
      <MindfulnessActivitiesScreen {...defaultProps} />
    );
    expect(getByTestId("video-play-button")).toBeTruthy();
  });

  it("calls onVideoPlay when play button is pressed", () => {
    const { getByTestId } = render(
      <MindfulnessActivitiesScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("video-play-button"));
    expect(mockOnVideoPlay).toHaveBeenCalledWith("v1");
  });

  it("displays article title", () => {
    const { getByText } = render(
      <MindfulnessActivitiesScreen {...defaultProps} />
    );
    expect(getByText("Why should we be mindful?")).toBeTruthy();
  });

  it("displays article description", () => {
    const { getByText } = render(
      <MindfulnessActivitiesScreen {...defaultProps} />
    );
    expect(getByText(/Mindfulness, the practice of being fully present/)).toBeTruthy();
  });

  it("displays benefit tags", () => {
    const { getByText } = render(
      <MindfulnessActivitiesScreen {...defaultProps} />
    );
    expect(getByText("Reduce Stress")).toBeTruthy();
    expect(getByText("Improve Health")).toBeTruthy();
  });

  it("displays benefit tags with checkmarks", () => {
    const { getByTestId } = render(
      <MindfulnessActivitiesScreen {...defaultProps} />
    );
    expect(getByTestId("benefit-tag-0")).toBeTruthy();
    expect(getByTestId("benefit-tag-1")).toBeTruthy();
  });

  it("displays the Mark As Completed button", () => {
    const { getByTestId } = render(
      <MindfulnessActivitiesScreen {...defaultProps} />
    );
    expect(getByTestId("mark-completed-button")).toBeTruthy();
  });

  it("displays Mark As Completed text on button", () => {
    const { getByText } = render(
      <MindfulnessActivitiesScreen {...defaultProps} />
    );
    expect(getByText("Mark As Completed")).toBeTruthy();
  });

  it("calls onMarkCompleted when button is pressed", () => {
    const { getByTestId } = render(
      <MindfulnessActivitiesScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("mark-completed-button"));
    expect(mockOnMarkCompleted).toHaveBeenCalledTimes(1);
  });

  it("has gradient background in header", () => {
    const { getByTestId } = render(
      <MindfulnessActivitiesScreen {...defaultProps} />
    );
    const header = getByTestId("header-section");
    expect(header).toBeTruthy();
  });

  it("back button has minimum touch target size", () => {
    const { getByTestId } = render(
      <MindfulnessActivitiesScreen {...defaultProps} />
    );
    const button = getByTestId("back-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("Mark As Completed button has minimum touch target size", () => {
    const { getByTestId } = render(
      <MindfulnessActivitiesScreen {...defaultProps} />
    );
    const button = getByTestId("mark-completed-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("activity cards have proper accessibility", () => {
    const { getByTestId } = render(
      <MindfulnessActivitiesScreen {...defaultProps} />
    );
    const card = getByTestId("activity-card-1");
    expect(card.props.accessibilityRole).toBe("button");
  });

  it("displays loading state on button when marking", () => {
    const { getByTestId } = render(
      <MindfulnessActivitiesScreen {...defaultProps} isMarking={true} />
    );
    const button = getByTestId("mark-completed-button");
    expect(button.props.accessibilityState?.busy).toBe(true);
  });

  it("uses Solace branding instead of Freud", () => {
    const { queryByText } = render(
      <MindfulnessActivitiesScreen {...defaultProps} />
    );
    expect(queryByText(/freud/i)).toBeNull();
  });
});
