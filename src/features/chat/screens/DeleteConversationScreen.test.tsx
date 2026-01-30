/**
 * DeleteConversationScreen Tests
 * @description Tests for delete conversation confirmation screen
 * @task Task 3.7.14: Delete Conversation Screen (Screen 66)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { DeleteConversationScreen } from "./DeleteConversationScreen";

describe("DeleteConversationScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnCancel = jest.fn();
  const mockOnConfirmDelete = jest.fn();

  const defaultProps = {
    conversationTitle: "Mental Health Check-in",
    messageCount: 24,
    createdAt: new Date("2024-01-10"),
    lastMessageAt: new Date("2024-01-15"),
    onBack: mockOnBack,
    onCancel: mockOnCancel,
    onConfirmDelete: mockOnConfirmDelete,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen container", () => {
    const { getByTestId } = render(
      <DeleteConversationScreen {...defaultProps} />
    );
    expect(getByTestId("delete-conversation-screen")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(
      <DeleteConversationScreen {...defaultProps} />
    );
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(
      <DeleteConversationScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays warning icon", () => {
    const { getByTestId } = render(
      <DeleteConversationScreen {...defaultProps} />
    );
    expect(getByTestId("warning-icon")).toBeTruthy();
  });

  it("displays delete title", () => {
    const { getByText } = render(
      <DeleteConversationScreen {...defaultProps} />
    );
    expect(getByText(/Delete Conversation/)).toBeTruthy();
  });

  it("displays warning message", () => {
    const { getByText } = render(
      <DeleteConversationScreen {...defaultProps} />
    );
    expect(getByText(/cannot be undone/i)).toBeTruthy();
  });

  it("displays conversation details card", () => {
    const { getByTestId } = render(
      <DeleteConversationScreen {...defaultProps} />
    );
    expect(getByTestId("conversation-details")).toBeTruthy();
  });

  it("displays conversation title", () => {
    const { getByText } = render(
      <DeleteConversationScreen {...defaultProps} />
    );
    expect(getByText("Mental Health Check-in")).toBeTruthy();
  });

  it("displays message count", () => {
    const { getByText } = render(
      <DeleteConversationScreen {...defaultProps} />
    );
    expect(getByText(/24 messages/i)).toBeTruthy();
  });

  it("displays what will be deleted section", () => {
    const { getByTestId } = render(
      <DeleteConversationScreen {...defaultProps} />
    );
    expect(getByTestId("deletion-info")).toBeTruthy();
  });

  it("lists items that will be deleted", () => {
    const { getByText } = render(
      <DeleteConversationScreen {...defaultProps} />
    );
    expect(getByText(/All messages in this conversation/)).toBeTruthy();
    expect(getByText(/Shared media and attachments/)).toBeTruthy();
  });

  it("displays cancel button", () => {
    const { getByTestId } = render(
      <DeleteConversationScreen {...defaultProps} />
    );
    expect(getByTestId("cancel-button")).toBeTruthy();
  });

  it("calls onCancel when cancel button is pressed", () => {
    const { getByTestId } = render(
      <DeleteConversationScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("cancel-button"));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("displays delete button", () => {
    const { getByTestId } = render(
      <DeleteConversationScreen {...defaultProps} />
    );
    expect(getByTestId("delete-button")).toBeTruthy();
  });

  it("calls onConfirmDelete when delete button is pressed", () => {
    const { getByTestId } = render(
      <DeleteConversationScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("delete-button"));
    expect(mockOnConfirmDelete).toHaveBeenCalledTimes(1);
  });

  it("delete button has destructive styling", () => {
    const { getByTestId } = render(
      <DeleteConversationScreen {...defaultProps} />
    );
    const button = getByTestId("delete-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce(
      (acc: Record<string, unknown>, s: Record<string, unknown>) => ({
        ...acc,
        ...s,
      }),
      {}
    );
    expect(buttonStyles.backgroundColor).toBe("#E8853A");
  });

  it("has dark background color", () => {
    const { getByTestId } = render(
      <DeleteConversationScreen {...defaultProps} />
    );
    const container = getByTestId("delete-conversation-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("back button has minimum touch target size", () => {
    const { getByTestId } = render(
      <DeleteConversationScreen {...defaultProps} />
    );
    const button = getByTestId("back-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce(
      (acc: Record<string, unknown>, s: Record<string, unknown>) => ({
        ...acc,
        ...s,
      }),
      {}
    );
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("delete button has minimum touch target size", () => {
    const { getByTestId } = render(
      <DeleteConversationScreen {...defaultProps} />
    );
    const button = getByTestId("delete-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce(
      (acc: Record<string, unknown>, s: Record<string, unknown>) => ({
        ...acc,
        ...s,
      }),
      {}
    );
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("back button has proper accessibility", () => {
    const { getByTestId } = render(
      <DeleteConversationScreen {...defaultProps} />
    );
    const button = getByTestId("back-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Go back");
  });

  it("cancel button has proper accessibility", () => {
    const { getByTestId } = render(
      <DeleteConversationScreen {...defaultProps} />
    );
    const button = getByTestId("cancel-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Cancel deletion");
  });

  it("delete button has proper accessibility", () => {
    const { getByTestId } = render(
      <DeleteConversationScreen {...defaultProps} />
    );
    const button = getByTestId("delete-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Delete conversation");
  });

  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(
      <DeleteConversationScreen {...defaultProps} />
    );
    expect(queryByText(/freud/i)).toBeNull();
    expect(queryByText(/doctor freud/i)).toBeNull();
  });
});
