/**
 * NewConversationScreen Tests
 * @description Tests for new conversation setup form
 * @task Task 3.6.4: New Conversation Screen (Screen 50)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { NewConversationScreen } from "./NewConversationScreen";

describe("NewConversationScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnTopicChange = jest.fn();
  const mockOnModelChange = jest.fn();
  const mockOnCheckpointsChange = jest.fn();
  const mockOnNameChange = jest.fn();
  const mockOnIconChange = jest.fn();
  const mockOnStyleChange = jest.fn();
  const mockOnGoalChange = jest.fn();
  const mockOnPrivacyChange = jest.fn();
  const mockOnCreate = jest.fn();

  const defaultProps = {
    topicName: "",
    aiModel: "solace_core_v1",
    selectedCheckpoints: ["GPT-4"],
    preferredName: "",
    selectedIcon: "icon1",
    communicationStyle: "formal" as const,
    therapyGoal: "reduce_stress",
    isPublic: false,
    isCreating: false,
    aiModels: [
      { id: "solace_core_v1", label: "Solace Core v1.0" },
      { id: "solace_pro_v1", label: "Solace Pro v1.0" },
    ],
    checkpointOptions: ["GPT-4", "GPT-5", "Llama2", "Claude", "PaLM3"],
    iconOptions: ["icon1", "icon2", "icon3", "icon4", "icon5", "icon6"],
    goalOptions: [
      { id: "reduce_stress", label: "Reduce Stress Level" },
      { id: "improve_sleep", label: "Improve Sleep Quality" },
      { id: "manage_anxiety", label: "Manage Anxiety" },
    ],
    onBack: mockOnBack,
    onTopicChange: mockOnTopicChange,
    onModelChange: mockOnModelChange,
    onCheckpointsChange: mockOnCheckpointsChange,
    onNameChange: mockOnNameChange,
    onIconChange: mockOnIconChange,
    onStyleChange: mockOnStyleChange,
    onGoalChange: mockOnGoalChange,
    onPrivacyChange: mockOnPrivacyChange,
    onCreate: mockOnCreate,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen container", () => {
    const { getByTestId } = render(<NewConversationScreen {...defaultProps} />);
    expect(getByTestId("new-conversation-screen")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(<NewConversationScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<NewConversationScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays the screen title", () => {
    const { getByText } = render(<NewConversationScreen {...defaultProps} />);
    expect(getByText("New Conversation")).toBeTruthy();
  });

  it("displays topic name input field", () => {
    const { getByTestId } = render(<NewConversationScreen {...defaultProps} />);
    expect(getByTestId("topic-name-input")).toBeTruthy();
  });

  it("displays Topic Name label", () => {
    const { getByText } = render(<NewConversationScreen {...defaultProps} />);
    expect(getByText("Topic Name")).toBeTruthy();
  });

  it("calls onTopicChange when topic is entered", () => {
    const { getByTestId } = render(<NewConversationScreen {...defaultProps} />);
    fireEvent.changeText(getByTestId("topic-name-input"), "My new topic");
    expect(mockOnTopicChange).toHaveBeenCalledWith("My new topic");
  });

  it("displays AI Model label", () => {
    const { getByText } = render(<NewConversationScreen {...defaultProps} />);
    expect(getByText("AI Model")).toBeTruthy();
  });

  it("displays AI model dropdown", () => {
    const { getByTestId } = render(<NewConversationScreen {...defaultProps} />);
    expect(getByTestId("ai-model-dropdown")).toBeTruthy();
  });

  it("displays AI LLM Checkpoints section", () => {
    const { getByText } = render(<NewConversationScreen {...defaultProps} />);
    expect(getByText("AI LLM Checkpoints")).toBeTruthy();
  });

  it("displays Select up to 3 hint", () => {
    const { getByText } = render(<NewConversationScreen {...defaultProps} />);
    expect(getByText(/Select up to 3/)).toBeTruthy();
  });

  it("displays checkpoint chips", () => {
    const { getByTestId } = render(<NewConversationScreen {...defaultProps} />);
    expect(getByTestId("checkpoint-GPT-4")).toBeTruthy();
    expect(getByTestId("checkpoint-GPT-5")).toBeTruthy();
  });

  it("calls onCheckpointsChange when chip is toggled", () => {
    const { getByTestId } = render(<NewConversationScreen {...defaultProps} />);
    fireEvent.press(getByTestId("checkpoint-GPT-5"));
    expect(mockOnCheckpointsChange).toHaveBeenCalled();
  });

  it("highlights selected checkpoint chips", () => {
    const { getByTestId } = render(<NewConversationScreen {...defaultProps} />);
    const chip = getByTestId("checkpoint-GPT-4");
    const styles = Array.isArray(chip.props.style)
      ? chip.props.style.flat()
      : [chip.props.style];
    const chipStyles = styles.reduce(
      (acc: Record<string, unknown>, s: Record<string, unknown>) => ({
        ...acc,
        ...s,
      }),
      {}
    );
    expect(chipStyles.backgroundColor).toBe("#9AAD5C");
  });

  it("displays Preferred Name input", () => {
    const { getByTestId, getByText } = render(
      <NewConversationScreen {...defaultProps} />
    );
    expect(getByText("Preferred Name")).toBeTruthy();
    expect(getByTestId("preferred-name-input")).toBeTruthy();
  });

  it("calls onNameChange when name is entered", () => {
    const { getByTestId } = render(<NewConversationScreen {...defaultProps} />);
    fireEvent.changeText(getByTestId("preferred-name-input"), "John");
    expect(mockOnNameChange).toHaveBeenCalledWith("John");
  });

  it("displays Conversation Icon section", () => {
    const { getByText } = render(<NewConversationScreen {...defaultProps} />);
    expect(getByText("Conversation Icon")).toBeTruthy();
  });

  it("displays icon options", () => {
    const { getByTestId } = render(<NewConversationScreen {...defaultProps} />);
    expect(getByTestId("icon-option-icon1")).toBeTruthy();
    expect(getByTestId("icon-option-icon2")).toBeTruthy();
  });

  it("calls onIconChange when icon is selected", () => {
    const { getByTestId } = render(<NewConversationScreen {...defaultProps} />);
    fireEvent.press(getByTestId("icon-option-icon2"));
    expect(mockOnIconChange).toHaveBeenCalledWith("icon2");
  });

  it("displays Communication Style section", () => {
    const { getByText } = render(<NewConversationScreen {...defaultProps} />);
    expect(getByText("Communication Style")).toBeTruthy();
  });

  it("displays style chips", () => {
    const { getByTestId } = render(<NewConversationScreen {...defaultProps} />);
    expect(getByTestId("style-casual")).toBeTruthy();
    expect(getByTestId("style-formal")).toBeTruthy();
    expect(getByTestId("style-fun")).toBeTruthy();
  });

  it("calls onStyleChange when style is selected", () => {
    const { getByTestId } = render(<NewConversationScreen {...defaultProps} />);
    fireEvent.press(getByTestId("style-casual"));
    expect(mockOnStyleChange).toHaveBeenCalledWith("casual");
  });

  it("highlights selected style chip", () => {
    const { getByTestId } = render(<NewConversationScreen {...defaultProps} />);
    const chip = getByTestId("style-formal");
    const styles = Array.isArray(chip.props.style)
      ? chip.props.style.flat()
      : [chip.props.style];
    const chipStyles = styles.reduce(
      (acc: Record<string, unknown>, s: Record<string, unknown>) => ({
        ...acc,
        ...s,
      }),
      {}
    );
    expect(chipStyles.backgroundColor).toBe("#9AAD5C");
  });

  it("displays Therapy Goals section", () => {
    const { getByText } = render(<NewConversationScreen {...defaultProps} />);
    expect(getByText("Therapy Goals")).toBeTruthy();
  });

  it("displays therapy goals dropdown", () => {
    const { getByTestId } = render(<NewConversationScreen {...defaultProps} />);
    expect(getByTestId("therapy-goals-dropdown")).toBeTruthy();
  });

  it("displays Privacy & Security section", () => {
    const { getByText } = render(<NewConversationScreen {...defaultProps} />);
    expect(getByText("Privacy & Security")).toBeTruthy();
  });

  it("displays Make Chat Public toggle", () => {
    const { getByTestId, getByText } = render(
      <NewConversationScreen {...defaultProps} />
    );
    expect(getByText("Make Chat Public")).toBeTruthy();
    expect(getByTestId("privacy-toggle")).toBeTruthy();
  });

  it("calls onPrivacyChange when toggle is pressed", () => {
    const { getByTestId } = render(<NewConversationScreen {...defaultProps} />);
    fireEvent(getByTestId("privacy-toggle"), "valueChange", true);
    expect(mockOnPrivacyChange).toHaveBeenCalledWith(true);
  });

  it("displays Create Conversation button", () => {
    const { getByTestId } = render(<NewConversationScreen {...defaultProps} />);
    expect(getByTestId("create-button")).toBeTruthy();
  });

  it("displays Create Conversation text on button", () => {
    const { getByText } = render(<NewConversationScreen {...defaultProps} />);
    expect(getByText("Create Conversation")).toBeTruthy();
  });

  it("calls onCreate when create button is pressed", () => {
    const { getByTestId } = render(<NewConversationScreen {...defaultProps} />);
    fireEvent.press(getByTestId("create-button"));
    expect(mockOnCreate).toHaveBeenCalledTimes(1);
  });

  it("displays lock icon on create button", () => {
    const { getByTestId } = render(<NewConversationScreen {...defaultProps} />);
    expect(getByTestId("create-button-icon")).toBeTruthy();
  });

  it("shows loading state when isCreating is true", () => {
    const { getByText } = render(
      <NewConversationScreen {...defaultProps} isCreating={true} />
    );
    expect(getByText("Creating...")).toBeTruthy();
  });

  it("disables create button when isCreating is true", () => {
    const { getByTestId } = render(
      <NewConversationScreen {...defaultProps} isCreating={true} />
    );
    const button = getByTestId("create-button");
    expect(button.props.accessibilityState?.disabled).toBe(true);
  });

  it("has dark background color", () => {
    const { getByTestId } = render(<NewConversationScreen {...defaultProps} />);
    const container = getByTestId("new-conversation-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("back button has minimum touch target size", () => {
    const { getByTestId } = render(<NewConversationScreen {...defaultProps} />);
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

  it("create button has minimum touch target size", () => {
    const { getByTestId } = render(<NewConversationScreen {...defaultProps} />);
    const button = getByTestId("create-button");
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
    const { getByTestId } = render(<NewConversationScreen {...defaultProps} />);
    const button = getByTestId("back-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Go back");
  });

  it("create button has proper accessibility", () => {
    const { getByTestId } = render(<NewConversationScreen {...defaultProps} />);
    const button = getByTestId("create-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Create new conversation");
  });

  it("create button has green background", () => {
    const { getByTestId } = render(<NewConversationScreen {...defaultProps} />);
    const button = getByTestId("create-button");
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
    expect(buttonStyles.backgroundColor).toBe("#9AAD5C");
  });

  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(<NewConversationScreen {...defaultProps} />);
    expect(queryByText(/freud/i)).toBeNull();
  });
});
