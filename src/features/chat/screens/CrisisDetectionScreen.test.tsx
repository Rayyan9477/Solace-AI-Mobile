/**
 * CrisisDetectionScreen Tests
 * @description Tests for crisis detection and professional referral interface
 * @task Task 3.7.2: Crisis Detection Screen (Screen 54)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { CrisisDetectionScreen } from "./CrisisDetectionScreen";

describe("CrisisDetectionScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnSearch = jest.fn();
  const mockOnSendMessage = jest.fn();
  const mockOnAttachment = jest.fn();
  const mockOnInputChange = jest.fn();
  const mockOnContactProfessional = jest.fn();
  const mockOnCallHotline = jest.fn();

  const mockProfessionals = [
    {
      id: "prof-1",
      name: "Dr. Sarah Mitchell",
      role: "Licensed Therapist" as const,
      rating: 4.8,
      verified: true,
      avatar: "https://example.com/avatar1.jpg",
      freeSession: true,
    },
    {
      id: "prof-2",
      name: "Dr. James Chen",
      role: "Clinical Psychologist" as const,
      rating: 4.6,
      verified: true,
      avatar: "https://example.com/avatar2.jpg",
      freeSession: false,
    },
  ];

  const mockMessages = [
    {
      id: "1",
      type: "user" as const,
      content: "I've been feeling really overwhelmed lately and I don't know what to do.",
      timestamp: new Date("2024-01-15T10:00:00"),
    },
    {
      id: "crisis-1",
      type: "crisis" as const,
      emotions: ["Overwhelmed", "Distressed"],
      severity: "high" as const,
    },
    {
      id: "2",
      type: "ai" as const,
      content:
        "I hear you, and I want you to know that what you're feeling matters. It's important to talk to a professional who can provide the support you deserve. I recommend speaking with one of these caring professionals.",
      timestamp: new Date("2024-01-15T10:01:00"),
      professionals: mockProfessionals,
    },
    {
      id: "3",
      type: "user" as const,
      content: "Thank you. I'll reach out to them.",
      timestamp: new Date("2024-01-15T10:02:00"),
    },
  ];

  const defaultProps = {
    chatsRemaining: 251,
    modelName: "GPT-5",
    messages: mockMessages,
    isAITyping: false,
    inputText: "",
    crisisActive: true,
    onBack: mockOnBack,
    onSearch: mockOnSearch,
    onSendMessage: mockOnSendMessage,
    onAttachment: mockOnAttachment,
    onInputChange: mockOnInputChange,
    onContactProfessional: mockOnContactProfessional,
    onCallHotline: mockOnCallHotline,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen container", () => {
    const { getByTestId } = render(<CrisisDetectionScreen {...defaultProps} />);
    expect(getByTestId("crisis-detection-screen")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(<CrisisDetectionScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<CrisisDetectionScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays Solace AI title", () => {
    const { getByText } = render(<CrisisDetectionScreen {...defaultProps} />);
    expect(getByText("Solace AI")).toBeTruthy();
  });

  it("displays chats remaining count", () => {
    const { getByText } = render(<CrisisDetectionScreen {...defaultProps} />);
    expect(getByText(/251 Chats Left/)).toBeTruthy();
  });

  it("displays model name", () => {
    const { getByText } = render(<CrisisDetectionScreen {...defaultProps} />);
    expect(getByText(/GPT-5/)).toBeTruthy();
  });

  it("displays search button", () => {
    const { getByTestId } = render(<CrisisDetectionScreen {...defaultProps} />);
    expect(getByTestId("search-button")).toBeTruthy();
  });

  it("calls onSearch when search button is pressed", () => {
    const { getByTestId } = render(<CrisisDetectionScreen {...defaultProps} />);
    fireEvent.press(getByTestId("search-button"));
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });

  it("displays message list", () => {
    const { getByTestId } = render(<CrisisDetectionScreen {...defaultProps} />);
    expect(getByTestId("message-list")).toBeTruthy();
  });

  it("displays user messages", () => {
    const { getByTestId } = render(<CrisisDetectionScreen {...defaultProps} />);
    expect(getByTestId("message-1")).toBeTruthy();
  });

  it("displays AI messages", () => {
    const { getByTestId } = render(<CrisisDetectionScreen {...defaultProps} />);
    expect(getByTestId("message-2")).toBeTruthy();
  });

  it("displays crisis alert badge", () => {
    const { getByTestId } = render(<CrisisDetectionScreen {...defaultProps} />);
    expect(getByTestId("crisis-badge-crisis-1")).toBeTruthy();
  });

  it("displays crisis emotions in badge", () => {
    const { getByText } = render(<CrisisDetectionScreen {...defaultProps} />);
    expect(getByText(/Overwhelmed/)).toBeTruthy();
    expect(getByText(/Distressed/)).toBeTruthy();
  });

  it("displays crisis support active text", () => {
    const { getByText } = render(<CrisisDetectionScreen {...defaultProps} />);
    expect(getByText(/Crisis Support Active/)).toBeTruthy();
  });

  it("crisis badge has orange/red color", () => {
    const { getByTestId } = render(<CrisisDetectionScreen {...defaultProps} />);
    const badge = getByTestId("crisis-badge-crisis-1");
    const styles = Array.isArray(badge.props.style)
      ? badge.props.style.flat()
      : [badge.props.style];
    const badgeStyles = styles.reduce(
      (acc: Record<string, unknown>, s: Record<string, unknown>) => ({
        ...acc,
        ...s,
      }),
      {}
    );
    expect(badgeStyles.backgroundColor).toBe("#E8853A");
  });

  it("displays professional cards", () => {
    const { getByTestId } = render(<CrisisDetectionScreen {...defaultProps} />);
    expect(getByTestId("professional-card-prof-1")).toBeTruthy();
    expect(getByTestId("professional-card-prof-2")).toBeTruthy();
  });

  it("displays professional names", () => {
    const { getByText } = render(<CrisisDetectionScreen {...defaultProps} />);
    expect(getByText("Dr. Sarah Mitchell")).toBeTruthy();
    expect(getByText("Dr. James Chen")).toBeTruthy();
  });

  it("displays professional roles", () => {
    const { getByText } = render(<CrisisDetectionScreen {...defaultProps} />);
    expect(getByText("Licensed Therapist")).toBeTruthy();
    expect(getByText("Clinical Psychologist")).toBeTruthy();
  });

  it("displays professional ratings", () => {
    const { getByText } = render(<CrisisDetectionScreen {...defaultProps} />);
    expect(getByText(/4.8/)).toBeTruthy();
    expect(getByText(/4.6/)).toBeTruthy();
  });

  it("displays verified badge for verified professionals", () => {
    const { getByTestId } = render(<CrisisDetectionScreen {...defaultProps} />);
    expect(getByTestId("verified-badge-prof-1")).toBeTruthy();
  });

  it("displays free session badge when available", () => {
    const { getByText } = render(<CrisisDetectionScreen {...defaultProps} />);
    expect(getByText(/Free Session/)).toBeTruthy();
  });

  it("calls onContactProfessional when professional card is pressed", () => {
    const { getByTestId } = render(<CrisisDetectionScreen {...defaultProps} />);
    fireEvent.press(getByTestId("professional-card-prof-1"));
    expect(mockOnContactProfessional).toHaveBeenCalledWith("prof-1");
  });

  it("displays crisis hotline information", () => {
    const { getByTestId } = render(<CrisisDetectionScreen {...defaultProps} />);
    expect(getByTestId("crisis-hotline-banner")).toBeTruthy();
  });

  it("displays 988 hotline number", () => {
    const { getByText } = render(<CrisisDetectionScreen {...defaultProps} />);
    expect(getByText(/988/)).toBeTruthy();
  });

  it("displays call hotline button", () => {
    const { getByTestId } = render(<CrisisDetectionScreen {...defaultProps} />);
    expect(getByTestId("call-hotline-button")).toBeTruthy();
  });

  it("opens crisis modal when hotline button is pressed", () => {
    const { getByTestId, getByText } = render(<CrisisDetectionScreen {...defaultProps} />);
    fireEvent.press(getByTestId("call-hotline-button"));
    expect(getByText("You're Not Alone")).toBeTruthy();
  });

  it("displays chat input area", () => {
    const { getByTestId } = render(<CrisisDetectionScreen {...defaultProps} />);
    expect(getByTestId("chat-input-area")).toBeTruthy();
  });

  it("displays attachment button", () => {
    const { getByTestId } = render(<CrisisDetectionScreen {...defaultProps} />);
    expect(getByTestId("attachment-button")).toBeTruthy();
  });

  it("calls onAttachment when attachment button is pressed", () => {
    const { getByTestId } = render(<CrisisDetectionScreen {...defaultProps} />);
    fireEvent.press(getByTestId("attachment-button"));
    expect(mockOnAttachment).toHaveBeenCalledTimes(1);
  });

  it("displays message input", () => {
    const { getByTestId } = render(<CrisisDetectionScreen {...defaultProps} />);
    expect(getByTestId("message-input")).toBeTruthy();
  });

  it("displays send button", () => {
    const { getByTestId } = render(<CrisisDetectionScreen {...defaultProps} />);
    expect(getByTestId("send-button")).toBeTruthy();
  });

  it("calls onSendMessage when send button is pressed", () => {
    const { getByTestId } = render(
      <CrisisDetectionScreen {...defaultProps} inputText="Hello" />
    );
    fireEvent.press(getByTestId("send-button"));
    expect(mockOnSendMessage).toHaveBeenCalledWith("Hello");
  });

  it("has dark background color", () => {
    const { getByTestId } = render(<CrisisDetectionScreen {...defaultProps} />);
    const container = getByTestId("crisis-detection-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("back button has minimum touch target size", () => {
    const { getByTestId } = render(<CrisisDetectionScreen {...defaultProps} />);
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

  it("professional card has minimum touch target size", () => {
    const { getByTestId } = render(<CrisisDetectionScreen {...defaultProps} />);
    const card = getByTestId("professional-card-prof-1");
    const styles = Array.isArray(card.props.style)
      ? card.props.style.flat()
      : [card.props.style];
    const cardStyles = styles.reduce(
      (acc: Record<string, unknown>, s: Record<string, unknown>) => ({
        ...acc,
        ...s,
      }),
      {}
    );
    expect(cardStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("back button has proper accessibility", () => {
    const { getByTestId } = render(<CrisisDetectionScreen {...defaultProps} />);
    const button = getByTestId("back-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Go back");
  });

  it("professional card has proper accessibility", () => {
    const { getByTestId } = render(<CrisisDetectionScreen {...defaultProps} />);
    const card = getByTestId("professional-card-prof-1");
    expect(card.props.accessibilityRole).toBe("button");
    expect(card.props.accessibilityLabel).toBe("Contact Dr. Sarah Mitchell");
  });

  it("call hotline button has proper accessibility", () => {
    const { getByTestId } = render(<CrisisDetectionScreen {...defaultProps} />);
    const button = getByTestId("call-hotline-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Access crisis support resources");
  });

  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(<CrisisDetectionScreen {...defaultProps} />);
    expect(queryByText(/freud/i)).toBeNull();
    expect(queryByText(/doctor freud/i)).toBeNull();
  });

  it("does not display inappropriate content", () => {
    const { queryByText } = render(<CrisisDetectionScreen {...defaultProps} />);
    expect(queryByText(/hannibal/i)).toBeNull();
    expect(queryByText(/liebert/i)).toBeNull();
  });

  it("uses supportive language", () => {
    const { getByText } = render(<CrisisDetectionScreen {...defaultProps} />);
    expect(getByText(/support you deserve/)).toBeTruthy();
  });

  it("displays AI avatar on AI messages", () => {
    const { getByTestId } = render(<CrisisDetectionScreen {...defaultProps} />);
    expect(getByTestId("ai-avatar-2")).toBeTruthy();
  });

  it("displays user avatar on user messages", () => {
    const { getByTestId } = render(<CrisisDetectionScreen {...defaultProps} />);
    expect(getByTestId("user-avatar-1")).toBeTruthy();
  });
});
