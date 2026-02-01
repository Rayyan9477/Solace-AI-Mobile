/**
 * PostSuccessModal Tests
 * @task Task 3.14.5: Post Success Modal (Screen 123)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { PostSuccessModal } from "./PostSuccessModal";

const defaultProps = {
  message: "Your post has been published! Let's see it now!",
  onViewPost: jest.fn(),
  onClose: jest.fn(),
};

describe("PostSuccessModal", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders the modal container", () => {
    const { getByTestId } = render(<PostSuccessModal {...defaultProps} />);
    expect(getByTestId("post-success-modal")).toBeTruthy();
  });

  it("renders the illustration", () => {
    const { getByTestId } = render(<PostSuccessModal {...defaultProps} />);
    expect(getByTestId("success-illustration")).toBeTruthy();
  });

  it("displays 'Post Successful!' title", () => {
    const { getByText } = render(<PostSuccessModal {...defaultProps} />);
    expect(getByText("Post Successful!")).toBeTruthy();
  });

  it("displays the success message", () => {
    const { getByText } = render(<PostSuccessModal {...defaultProps} />);
    expect(getByText(defaultProps.message)).toBeTruthy();
  });

  it("renders the View Post button", () => {
    const { getByTestId } = render(<PostSuccessModal {...defaultProps} />);
    expect(getByTestId("view-post-button")).toBeTruthy();
  });

  it("displays 'See My Post' text", () => {
    const { getByText } = render(<PostSuccessModal {...defaultProps} />);
    expect(getByText(/See My Post/)).toBeTruthy();
  });

  it("calls onViewPost when button is pressed", () => {
    const { getByTestId } = render(<PostSuccessModal {...defaultProps} />);
    fireEvent.press(getByTestId("view-post-button"));
    expect(defaultProps.onViewPost).toHaveBeenCalledTimes(1);
  });

  it("View Post button has accessibilityRole button", () => {
    const { getByTestId } = render(<PostSuccessModal {...defaultProps} />);
    expect(getByTestId("view-post-button").props.accessibilityRole).toBe("button");
  });

  it("View Post button meets minimum touch target size", () => {
    const { getByTestId } = render(<PostSuccessModal {...defaultProps} />);
    const flat = Object.assign({}, ...[].concat(getByTestId("view-post-button").props.style));
    expect(flat.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("renders the close button", () => {
    const { getByTestId } = render(<PostSuccessModal {...defaultProps} />);
    expect(getByTestId("close-button")).toBeTruthy();
  });

  it("calls onClose when close button is pressed", () => {
    const { getByTestId } = render(<PostSuccessModal {...defaultProps} />);
    fireEvent.press(getByTestId("close-button"));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("close button has accessibilityRole button", () => {
    const { getByTestId } = render(<PostSuccessModal {...defaultProps} />);
    expect(getByTestId("close-button").props.accessibilityRole).toBe("button");
  });

  it("does not contain redundant 'posted a post' phrasing", () => {
    const { queryByText } = render(<PostSuccessModal {...defaultProps} />);
    expect(queryByText(/posted a post/i)).toBeNull();
  });

  it("does not contain any Freud branding", () => {
    const { queryByText } = render(<PostSuccessModal {...defaultProps} />);
    expect(queryByText(/freud/i)).toBeNull();
  });
});
