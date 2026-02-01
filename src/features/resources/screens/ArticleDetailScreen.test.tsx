/**
 * ArticleDetailScreen Tests
 * @description Tests for TDD implementation of Screen 115
 * @audit-fix Replaced "Johann Liebert" with "Dr. Sarah Mitchell"
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { ArticleDetailScreen } from "./ArticleDetailScreen";

const defaultProps = {
  title: "What is Life? Why?",
  categories: ["Article", "Philosophy"],
  rating: "4.5",
  views: "200K",
  comments: "23",
  authorName: "Dr. Sarah Mitchell",
  isFollowing: false,
  contentPreview:
    "What is life? is a question that has intrigued philosophers, scientists, and thinkers throughout history.",
  onBack: jest.fn(),
  onFollow: jest.fn(),
  onGoPro: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<ArticleDetailScreen {...defaultProps} {...overrides} />);
}

describe("ArticleDetailScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("article-detail-screen")).toBeTruthy();
  });

  it("renders as a full-screen flex container", () => {
    const { getByTestId } = renderScreen();
    const container = getByTestId("article-detail-screen");
    expect(container.props.style).toEqual(expect.objectContaining({ flex: 1 }));
  });

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

  it("displays 'Article Detail' header", () => {
    const { getByText } = renderScreen();
    expect(getByText("Article Detail")).toBeTruthy();
  });

  it("displays category badges", () => {
    const { getByText } = renderScreen();
    expect(getByText("Article")).toBeTruthy();
    expect(getByText("Philosophy")).toBeTruthy();
  });

  it("displays the article title", () => {
    const { getByText } = renderScreen();
    expect(getByText("What is Life? Why?")).toBeTruthy();
  });

  it("displays the rating", () => {
    const { getByText } = renderScreen();
    expect(getByText(/4.5/)).toBeTruthy();
  });

  it("displays the view count", () => {
    const { getByText } = renderScreen();
    expect(getByText(/200K/)).toBeTruthy();
  });

  it("displays the author name", () => {
    const { getByText } = renderScreen();
    expect(getByText(/Dr. Sarah Mitchell/)).toBeTruthy();
  });

  it("renders the follow button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("follow-button")).toBeTruthy();
  });

  it("calls onFollow when follow button is pressed", () => {
    const onFollow = jest.fn();
    const { getByTestId } = renderScreen({ onFollow });
    fireEvent.press(getByTestId("follow-button"));
    expect(onFollow).toHaveBeenCalledTimes(1);
  });

  it("displays content preview", () => {
    const { getByText } = renderScreen();
    expect(getByText(/What is life/)).toBeTruthy();
  });

  it("renders the premium paywall", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("premium-paywall")).toBeTruthy();
  });

  it("displays 'Unlock the Full Article'", () => {
    const { getByText } = renderScreen();
    expect(getByText("Unlock the Full Article")).toBeTruthy();
  });

  it("renders the Go Pro button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("go-pro-button")).toBeTruthy();
  });

  it("calls onGoPro when Go Pro is pressed", () => {
    const onGoPro = jest.fn();
    const { getByTestId } = renderScreen({ onGoPro });
    fireEvent.press(getByTestId("go-pro-button"));
    expect(onGoPro).toHaveBeenCalledTimes(1);
  });

  it("Go Pro button has accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("go-pro-button").props.accessibilityRole).toBe("button");
  });

  it("Go Pro button meets minimum touch target size", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("go-pro-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });

  it("does not contain inappropriate author names", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/johann/i)).toBeNull();
    expect(queryByText(/liebert/i)).toBeNull();
  });
});
