/**
 * DeletePostModal Tests
 * @task Task 3.14.9: Delete Post Modal (Screen 127)
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { DeletePostModal } from "./DeletePostModal";

const defaultProps = {
  onCancel: jest.fn(),
  onConfirm: jest.fn(),
  onClose: jest.fn(),
};

describe("DeletePostModal", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders the modal container", () => {
    const { getByTestId } = render(<DeletePostModal {...defaultProps} />);
    expect(getByTestId("delete-post-modal")).toBeTruthy();
  });

  it("renders the illustration", () => {
    const { getByTestId } = render(<DeletePostModal {...defaultProps} />);
    expect(getByTestId("delete-illustration")).toBeTruthy();
  });

  it("displays 'Delete Post?' title", () => {
    const { getByText } = render(<DeletePostModal {...defaultProps} />);
    expect(getByText("Delete Post?")).toBeTruthy();
  });

  it("displays confirmation text", () => {
    const { getByText } = render(<DeletePostModal {...defaultProps} />);
    expect(getByText("Are you sure to delete your post?")).toBeTruthy();
  });

  it("renders the cancel button", () => {
    const { getByTestId } = render(<DeletePostModal {...defaultProps} />);
    expect(getByTestId("cancel-button")).toBeTruthy();
  });

  it("displays 'No, Don't Delete' text", () => {
    const { getByText } = render(<DeletePostModal {...defaultProps} />);
    expect(getByText(/No, Don't Delete/)).toBeTruthy();
  });

  it("calls onCancel when cancel is pressed", () => {
    const { getByTestId } = render(<DeletePostModal {...defaultProps} />);
    fireEvent.press(getByTestId("cancel-button"));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it("cancel button has accessibilityRole button", () => {
    const { getByTestId } = render(<DeletePostModal {...defaultProps} />);
    expect(getByTestId("cancel-button").props.accessibilityRole).toBe("button");
  });

  it("cancel button meets minimum touch target size", () => {
    const { getByTestId } = render(<DeletePostModal {...defaultProps} />);
    const flat = Object.assign(
      {},
      ...[].concat(getByTestId("cancel-button").props.style),
    );
    expect(flat.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("renders the confirm delete button", () => {
    const { getByTestId } = render(<DeletePostModal {...defaultProps} />);
    expect(getByTestId("confirm-delete-button")).toBeTruthy();
  });

  it("displays 'Yes, Delete' text", () => {
    const { getByText } = render(<DeletePostModal {...defaultProps} />);
    expect(getByText(/Yes, Delete/)).toBeTruthy();
  });

  it("calls onConfirm when confirm is pressed", () => {
    const { getByTestId } = render(<DeletePostModal {...defaultProps} />);
    fireEvent.press(getByTestId("confirm-delete-button"));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it("confirm button has accessibilityRole button", () => {
    const { getByTestId } = render(<DeletePostModal {...defaultProps} />);
    expect(getByTestId("confirm-delete-button").props.accessibilityRole).toBe(
      "button",
    );
  });

  it("confirm button meets minimum touch target size", () => {
    const { getByTestId } = render(<DeletePostModal {...defaultProps} />);
    const flat = Object.assign(
      {},
      ...[].concat(getByTestId("confirm-delete-button").props.style),
    );
    expect(flat.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("renders the close button", () => {
    const { getByTestId } = render(<DeletePostModal {...defaultProps} />);
    expect(getByTestId("close-button")).toBeTruthy();
  });

  it("calls onClose when close button is pressed", () => {
    const { getByTestId } = render(<DeletePostModal {...defaultProps} />);
    fireEvent.press(getByTestId("close-button"));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("does not contain any Freud branding", () => {
    const { queryByText } = render(<DeletePostModal {...defaultProps} />);
    expect(queryByText(/freud/i)).toBeNull();
  });
});
