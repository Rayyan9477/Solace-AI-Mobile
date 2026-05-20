/**
 * PracticeGridTile Tests — Sprint 5 (prototype v4.2)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { PracticeGridTile } from "./PracticeGridTile";

const defaultProps = {
  title: "4-7-8 Breathing",
  category: "BREATHING",
  durationMinutes: 5,
  onPress: jest.fn(),
  testID: "grid-tile",
};

describe("PracticeGridTile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    const { getByTestId } = render(<PracticeGridTile {...defaultProps} />);
    expect(getByTestId("grid-tile")).toBeTruthy();
  });

  it("matches snapshot", () => {
    const { toJSON } = render(<PracticeGridTile {...defaultProps} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders the title", () => {
    const { getByText } = render(<PracticeGridTile {...defaultProps} />);
    expect(getByText("4-7-8 Breathing")).toBeTruthy();
  });

  it("renders the category kicker", () => {
    const { getByText } = render(<PracticeGridTile {...defaultProps} />);
    expect(getByText("[ BREATHING ]")).toBeTruthy();
  });

  it("renders duration text", () => {
    const { getByText } = render(<PracticeGridTile {...defaultProps} />);
    expect(getByText(" 5 min")).toBeTruthy();
  });

  it("calls onPress when tapped", () => {
    const mockPress = jest.fn();
    const { getByTestId } = render(
      <PracticeGridTile {...defaultProps} onPress={mockPress} />,
    );
    fireEvent.press(getByTestId("grid-tile"));
    expect(mockPress).toHaveBeenCalledTimes(1);
  });

  it("has correct accessibilityRole", () => {
    const { getByTestId } = render(<PracticeGridTile {...defaultProps} />);
    expect(getByTestId("grid-tile").props.accessibilityRole).toBe("button");
  });

  it("has correct accessibilityLabel", () => {
    const { getByTestId } = render(<PracticeGridTile {...defaultProps} />);
    const label = getByTestId("grid-tile").props.accessibilityLabel;
    expect(label).toBe("4-7-8 Breathing, BREATHING, 5 minutes");
  });

  it("renders with sage variant without error", () => {
    const { getByTestId } = render(
      <PracticeGridTile {...defaultProps} variant="sage" />,
    );
    expect(getByTestId("grid-tile")).toBeTruthy();
  });

  it("renders with peach variant without error", () => {
    const { getByTestId } = render(
      <PracticeGridTile {...defaultProps} variant="peach" />,
    );
    expect(getByTestId("grid-tile")).toBeTruthy();
  });

  it("renders with lavender variant without error", () => {
    const { getByTestId } = render(
      <PracticeGridTile {...defaultProps} variant="lavender" />,
    );
    expect(getByTestId("grid-tile")).toBeTruthy();
  });

  it("renders with aurora variant without error", () => {
    const { getByTestId } = render(
      <PracticeGridTile {...defaultProps} variant="aurora" />,
    );
    expect(getByTestId("grid-tile")).toBeTruthy();
  });

  it("uses custom iconName without error", () => {
    const { getByTestId } = render(
      <PracticeGridTile {...defaultProps} iconName="moon" />,
    );
    expect(getByTestId("grid-tile")).toBeTruthy();
  });

  it("renders different durationMinutes correctly", () => {
    const { getByText } = render(
      <PracticeGridTile {...defaultProps} durationMinutes={20} />,
    );
    expect(getByText(" 20 min")).toBeTruthy();
  });
});
