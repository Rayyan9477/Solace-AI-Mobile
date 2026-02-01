/**
 * NewPostCategorySelectorScreen Tests
 * @task Task 3.14.3: New Post Category Selector Screen (Screen 121)
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { NewPostCategorySelectorScreen } from "./NewPostCategorySelectorScreen";

const defaultCategories = [
  { id: "self_care", name: "Self Care", icon: "\uD83E\uDDD1" },
  { id: "mindfulness", name: "Mindfulness", icon: "\uD83D\uDD14" },
  { id: "stories", name: "Stories", icon: "\uD83D\uDD52" },
  { id: "support", name: "Support", icon: "\uD83E\uDD1D" },
  { id: "creative", name: "Creative", icon: "\u270F\uFE0F" },
  { id: "therapy", name: "Therapy", icon: "\uD83C\uDFAF" },
  { id: "stress", name: "Stress", icon: "\uD83D\uDECB\uFE0F" },
  { id: "affirmation", name: "Affirmation", icon: "\uD83C\uDF0A" },
  { id: "awareness", name: "Awareness", icon: "\uD83C\uDFB2" },
];

const defaultProps = {
  categories: defaultCategories,
  selectedCategoryId: "creative",
  onBack: jest.fn(),
  onCategorySelect: jest.fn(),
  onContinue: jest.fn(),
};

describe("NewPostCategorySelectorScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  // --- Container ---
  it("renders the screen container", () => {
    const { getByTestId } = render(
      <NewPostCategorySelectorScreen {...defaultProps} />,
    );
    expect(getByTestId("new-post-category-screen")).toBeTruthy();
  });

  it("renders as a full-screen flex container", () => {
    const { getByTestId } = render(
      <NewPostCategorySelectorScreen {...defaultProps} />,
    );
    const flat = Object.assign(
      {},
      ...[].concat(getByTestId("new-post-category-screen").props.style),
    );
    expect(flat.flex).toBe(1);
  });

  // --- Header ---
  it("renders the back button", () => {
    const { getByTestId } = render(
      <NewPostCategorySelectorScreen {...defaultProps} />,
    );
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(
      <NewPostCategorySelectorScreen {...defaultProps} />,
    );
    fireEvent.press(getByTestId("back-button"));
    expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
  });

  it("back button has accessibilityRole button", () => {
    const { getByTestId } = render(
      <NewPostCategorySelectorScreen {...defaultProps} />,
    );
    expect(getByTestId("back-button").props.accessibilityRole).toBe("button");
  });

  it("back button meets minimum touch target size", () => {
    const { getByTestId } = render(
      <NewPostCategorySelectorScreen {...defaultProps} />,
    );
    const flat = Object.assign(
      {},
      ...[].concat(getByTestId("back-button").props.style),
    );
    expect(flat.minHeight).toBeGreaterThanOrEqual(44);
    expect(flat.minWidth).toBeGreaterThanOrEqual(44);
  });

  it("displays 'Community Post' badge", () => {
    const { getByText } = render(
      <NewPostCategorySelectorScreen {...defaultProps} />,
    );
    expect(getByText("Community Post")).toBeTruthy();
  });

  // --- Title ---
  it("displays 'Add New Post' title", () => {
    const { getByText } = render(
      <NewPostCategorySelectorScreen {...defaultProps} />,
    );
    expect(getByText("Add New Post")).toBeTruthy();
  });

  it("displays 'Select post category' subtitle", () => {
    const { getByText } = render(
      <NewPostCategorySelectorScreen {...defaultProps} />,
    );
    expect(getByText("Select post category")).toBeTruthy();
  });

  // --- Category Grid ---
  it("renders all category cards", () => {
    const { getByTestId } = render(
      <NewPostCategorySelectorScreen {...defaultProps} />,
    );
    defaultCategories.forEach((cat) => {
      expect(getByTestId(`category-card-${cat.id}`)).toBeTruthy();
    });
  });

  it("displays category names", () => {
    const { getByText } = render(
      <NewPostCategorySelectorScreen {...defaultProps} />,
    );
    expect(getByText("Self Care")).toBeTruthy();
    expect(getByText("Mindfulness")).toBeTruthy();
    expect(getByText("Creative")).toBeTruthy();
  });

  it("calls onCategorySelect when a card is pressed", () => {
    const { getByTestId } = render(
      <NewPostCategorySelectorScreen {...defaultProps} />,
    );
    fireEvent.press(getByTestId("category-card-support"));
    expect(defaultProps.onCategorySelect).toHaveBeenCalledWith("support");
  });

  it("category cards have accessibilityRole button", () => {
    const { getByTestId } = render(
      <NewPostCategorySelectorScreen {...defaultProps} />,
    );
    expect(getByTestId("category-card-self_care").props.accessibilityRole).toBe(
      "button",
    );
  });

  it("category cards meet minimum touch target size", () => {
    const { getByTestId } = render(
      <NewPostCategorySelectorScreen {...defaultProps} />,
    );
    const flat = Object.assign(
      {},
      ...[].concat(getByTestId("category-card-self_care").props.style),
    );
    expect(flat.minHeight).toBeGreaterThanOrEqual(44);
  });

  // --- Continue Button ---
  it("renders the Continue button", () => {
    const { getByTestId } = render(
      <NewPostCategorySelectorScreen {...defaultProps} />,
    );
    expect(getByTestId("continue-button")).toBeTruthy();
  });

  it("displays 'Continue' text", () => {
    const { getByText } = render(
      <NewPostCategorySelectorScreen {...defaultProps} />,
    );
    expect(getByText(/Continue/)).toBeTruthy();
  });

  it("calls onContinue when button is pressed", () => {
    const { getByTestId } = render(
      <NewPostCategorySelectorScreen {...defaultProps} />,
    );
    fireEvent.press(getByTestId("continue-button"));
    expect(defaultProps.onContinue).toHaveBeenCalledTimes(1);
  });

  it("Continue button has accessibilityRole button", () => {
    const { getByTestId } = render(
      <NewPostCategorySelectorScreen {...defaultProps} />,
    );
    expect(getByTestId("continue-button").props.accessibilityRole).toBe(
      "button",
    );
  });

  it("Continue button meets minimum touch target size", () => {
    const { getByTestId } = render(
      <NewPostCategorySelectorScreen {...defaultProps} />,
    );
    const flat = Object.assign(
      {},
      ...[].concat(getByTestId("continue-button").props.style),
    );
    expect(flat.minHeight).toBeGreaterThanOrEqual(44);
  });

  // --- Branding ---
  it("does not contain any Freud branding", () => {
    const { queryByText } = render(
      <NewPostCategorySelectorScreen {...defaultProps} />,
    );
    expect(queryByText(/freud/i)).toBeNull();
  });
});
