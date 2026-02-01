/**
 * NewPostComposerScreen Tests
 * @task Task 3.14.4: New Post Composer Screen (Screen 122)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { NewPostComposerScreen } from "./NewPostComposerScreen";

const defaultPostTypes = [
  { id: "story", label: "Story" },
  { id: "regular", label: "Regular" },
  { id: "reel", label: "Reel" },
];

const defaultProps = {
  username: "Sarah K.",
  totalPosts: "25 Total Posts",
  rating: "87%",
  content: "This is my first mindfulness post!",
  characterCount: 38,
  maxCharacters: 300,
  postTypes: defaultPostTypes,
  selectedPostTypeId: "regular",
  isPrivate: false,
  onBack: jest.fn(),
  onContentChange: jest.fn(),
  onPostTypeSelect: jest.fn(),
  onCameraPress: jest.fn(),
  onMicPress: jest.fn(),
  onEmojiPress: jest.fn(),
  onPrivacyToggle: jest.fn(),
  onSaveDraft: jest.fn(),
  onPost: jest.fn(),
};

describe("NewPostComposerScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  // --- Container ---
  it("renders the screen container", () => {
    const { getByTestId } = render(<NewPostComposerScreen {...defaultProps} />);
    expect(getByTestId("new-post-composer-screen")).toBeTruthy();
  });

  it("renders as a full-screen flex container", () => {
    const { getByTestId } = render(<NewPostComposerScreen {...defaultProps} />);
    const flat = Object.assign({}, ...[].concat(getByTestId("new-post-composer-screen").props.style));
    expect(flat.flex).toBe(1);
  });

  // --- Header ---
  it("renders the back button", () => {
    const { getByTestId } = render(<NewPostComposerScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<NewPostComposerScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
  });

  it("back button has accessibilityRole button", () => {
    const { getByTestId } = render(<NewPostComposerScreen {...defaultProps} />);
    expect(getByTestId("back-button").props.accessibilityRole).toBe("button");
  });

  it("back button meets minimum touch target size", () => {
    const { getByTestId } = render(<NewPostComposerScreen {...defaultProps} />);
    const flat = Object.assign({}, ...[].concat(getByTestId("back-button").props.style));
    expect(flat.minHeight).toBeGreaterThanOrEqual(44);
    expect(flat.minWidth).toBeGreaterThanOrEqual(44);
  });

  // --- Post Content Section ---
  it("displays 'Post Content' section title", () => {
    const { getByText } = render(<NewPostComposerScreen {...defaultProps} />);
    expect(getByText("Post Content")).toBeTruthy();
  });

  it("displays the username", () => {
    const { getByText } = render(<NewPostComposerScreen {...defaultProps} />);
    expect(getByText("Sarah K.")).toBeTruthy();
  });

  it("renders the text input", () => {
    const { getByTestId } = render(<NewPostComposerScreen {...defaultProps} />);
    expect(getByTestId("post-text-input")).toBeTruthy();
  });

  it("displays the character counter", () => {
    const { getByText } = render(<NewPostComposerScreen {...defaultProps} />);
    expect(getByText("38/300")).toBeTruthy();
  });

  // --- Input Toolbar ---
  it("renders the camera button", () => {
    const { getByTestId } = render(<NewPostComposerScreen {...defaultProps} />);
    expect(getByTestId("camera-button")).toBeTruthy();
  });

  it("calls onCameraPress when camera is pressed", () => {
    const { getByTestId } = render(<NewPostComposerScreen {...defaultProps} />);
    fireEvent.press(getByTestId("camera-button"));
    expect(defaultProps.onCameraPress).toHaveBeenCalledTimes(1);
  });

  it("renders the mic button", () => {
    const { getByTestId } = render(<NewPostComposerScreen {...defaultProps} />);
    expect(getByTestId("mic-button")).toBeTruthy();
  });

  it("renders the emoji button", () => {
    const { getByTestId } = render(<NewPostComposerScreen {...defaultProps} />);
    expect(getByTestId("emoji-button")).toBeTruthy();
  });

  // --- Post Type Section ---
  it("displays 'Post Type' section header", () => {
    const { getByText } = render(<NewPostComposerScreen {...defaultProps} />);
    expect(getByText("Post Type")).toBeTruthy();
  });

  it("renders all post type pills", () => {
    const { getByTestId } = render(<NewPostComposerScreen {...defaultProps} />);
    defaultPostTypes.forEach((type) => {
      expect(getByTestId(`post-type-${type.id}`)).toBeTruthy();
    });
  });

  it("calls onPostTypeSelect when type is pressed", () => {
    const { getByTestId } = render(<NewPostComposerScreen {...defaultProps} />);
    fireEvent.press(getByTestId("post-type-story"));
    expect(defaultProps.onPostTypeSelect).toHaveBeenCalledWith("story");
  });

  // --- Privacy Toggle ---
  it("displays 'Hide from Community?' label", () => {
    const { getByText } = render(<NewPostComposerScreen {...defaultProps} />);
    expect(getByText("Hide from Community?")).toBeTruthy();
  });

  it("renders the privacy toggle", () => {
    const { getByTestId } = render(<NewPostComposerScreen {...defaultProps} />);
    expect(getByTestId("privacy-toggle")).toBeTruthy();
  });

  it("calls onPrivacyToggle when toggle is pressed", () => {
    const { getByTestId } = render(<NewPostComposerScreen {...defaultProps} />);
    fireEvent.press(getByTestId("privacy-toggle"));
    expect(defaultProps.onPrivacyToggle).toHaveBeenCalledTimes(1);
  });

  // --- Action Buttons ---
  it("renders the Save As Draft button", () => {
    const { getByTestId } = render(<NewPostComposerScreen {...defaultProps} />);
    expect(getByTestId("save-draft-button")).toBeTruthy();
  });

  it("calls onSaveDraft when draft button is pressed", () => {
    const { getByTestId } = render(<NewPostComposerScreen {...defaultProps} />);
    fireEvent.press(getByTestId("save-draft-button"));
    expect(defaultProps.onSaveDraft).toHaveBeenCalledTimes(1);
  });

  it("renders the Post button", () => {
    const { getByTestId } = render(<NewPostComposerScreen {...defaultProps} />);
    expect(getByTestId("post-button")).toBeTruthy();
  });

  it("calls onPost when post button is pressed", () => {
    const { getByTestId } = render(<NewPostComposerScreen {...defaultProps} />);
    fireEvent.press(getByTestId("post-button"));
    expect(defaultProps.onPost).toHaveBeenCalledTimes(1);
  });

  it("Post button has accessibilityRole button", () => {
    const { getByTestId } = render(<NewPostComposerScreen {...defaultProps} />);
    expect(getByTestId("post-button").props.accessibilityRole).toBe("button");
  });

  it("Post button meets minimum touch target size", () => {
    const { getByTestId } = render(<NewPostComposerScreen {...defaultProps} />);
    const flat = Object.assign({}, ...[].concat(getByTestId("post-button").props.style));
    expect(flat.minHeight).toBeGreaterThanOrEqual(44);
  });

  // --- Branding ---
  it("does not contain any Freud branding", () => {
    const { queryByText } = render(<NewPostComposerScreen {...defaultProps} />);
    expect(queryByText(/freud/i)).toBeNull();
  });
});
