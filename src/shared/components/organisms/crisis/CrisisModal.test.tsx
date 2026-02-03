/**
 * CrisisModal Tests
 * @description Comprehensive test suite for SAFETY-CRITICAL CrisisModal component
 */

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Linking, Alert } from "react-native";
import { CrisisModal } from "./CrisisModal";

// Mock React Native modules
jest.mock("react-native/Libraries/Linking/Linking", () => ({
  canOpenURL: jest.fn(),
  openURL: jest.fn(),
}));

jest.spyOn(Alert, "alert");

describe("CrisisModal", () => {
  const defaultProps = {
    visible: true,
    onDismiss: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (Linking.canOpenURL as jest.Mock).mockResolvedValue(true);
    (Linking.openURL as jest.Mock).mockResolvedValue(true);
  });

  describe("Visibility", () => {
    it("should render when visible is true", () => {
      const { getByText } = render(<CrisisModal {...defaultProps} />);
      expect(getByText("You're Not Alone")).toBeTruthy();
    });

    it("should not render modal content when visible is false", () => {
      const { queryByText } = render(<CrisisModal {...defaultProps} visible={false} />);
      expect(queryByText("You're Not Alone")).toBeNull();
    });
  });

  describe("Crisis Resources", () => {
    it("should display all 3 crisis resources", () => {
      const { getByText } = render(<CrisisModal {...defaultProps} />);

      expect(getByText("988 Suicide & Crisis Lifeline")).toBeTruthy();
      expect(getByText("Crisis Text Line")).toBeTruthy();
      expect(getByText("International Resources")).toBeTruthy();
    });

    it("should show 24/7 availability badges", () => {
      const { getAllByText } = render(<CrisisModal {...defaultProps} />);

      const badges = getAllByText("24/7 Available");
      expect(badges).toHaveLength(3);
    });

    it("should display correct button text for each resource", () => {
      const { getByText } = render(<CrisisModal {...defaultProps} />);

      expect(getByText("Call 988 Now")).toBeTruthy();
      expect(getByText("Text HOME to 741741")).toBeTruthy();
      expect(getByText("View International Resources")).toBeTruthy();
    });
  });

  describe("Resource Interaction", () => {
    it("should call 988 when phone resource is pressed", async () => {
      const { getByText } = render(<CrisisModal {...defaultProps} />);

      const callButton = getByText("Call 988 Now");
      fireEvent.press(callButton);

      await waitFor(() => {
        expect(Linking.canOpenURL).toHaveBeenCalledWith("tel:988");
        expect(Linking.openURL).toHaveBeenCalledWith("tel:988");
      });
    });

    it("should open SMS with HOME message when text resource is pressed", async () => {
      const { getByText } = render(<CrisisModal {...defaultProps} />);

      const textButton = getByText("Text HOME to 741741");
      fireEvent.press(textButton);

      await waitFor(() => {
        expect(Linking.canOpenURL).toHaveBeenCalledWith("sms:741741?body=HOME");
        expect(Linking.openURL).toHaveBeenCalledWith("sms:741741?body=HOME");
      });
    });

    it("should open international resources URL when pressed", async () => {
      const { getByText } = render(<CrisisModal {...defaultProps} />);

      const urlButton = getByText("View International Resources");
      fireEvent.press(urlButton);

      await waitFor(() => {
        expect(Linking.canOpenURL).toHaveBeenCalledWith("https://findahelpline.com");
        expect(Linking.openURL).toHaveBeenCalledWith("https://findahelpline.com");
      });
    });

    it("should show alert when resource cannot be opened", async () => {
      (Linking.canOpenURL as jest.Mock).mockResolvedValue(false);

      const { getByText } = render(<CrisisModal {...defaultProps} />);

      const callButton = getByText("Call 988 Now");
      fireEvent.press(callButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          "Unable to Open",
          expect.stringContaining("988 Suicide & Crisis Lifeline")
        );
      });
    });

    it("should handle errors gracefully when opening resources", async () => {
      (Linking.openURL as jest.Mock).mockRejectedValue(new Error("Test error"));

      const { getByText } = render(<CrisisModal {...defaultProps} />);

      const callButton = getByText("Call 988 Now");
      fireEvent.press(callButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          "Error",
          expect.stringContaining("Unable to open")
        );
      });
    });
  });

  describe("Acknowledgment Flow", () => {
    it("should show acknowledge button when requireAcknowledge is true", () => {
      const { getByText } = render(
        <CrisisModal {...defaultProps} requireAcknowledge />
      );

      expect(getByText("I Understand")).toBeTruthy();
    });

    it("should not show close button initially when requireAcknowledge is true", () => {
      const { queryByText } = render(
        <CrisisModal {...defaultProps} requireAcknowledge />
      );

      expect(queryByText("Close")).toBeNull();
    });

    it("should show close button after acknowledging", () => {
      const { getByText } = render(
        <CrisisModal {...defaultProps} requireAcknowledge />
      );

      const acknowledgeButton = getByText("I Understand");
      fireEvent.press(acknowledgeButton);

      expect(getByText("Close")).toBeTruthy();
      expect(getByText("✓ Resources Acknowledged")).toBeTruthy();
    });

    it("should call onDismiss when close button is pressed after acknowledgment", () => {
      const onDismiss = jest.fn();
      const { getByText } = render(
        <CrisisModal {...defaultProps} onDismiss={onDismiss} requireAcknowledge />
      );

      // Acknowledge first
      const acknowledgeButton = getByText("I Understand");
      fireEvent.press(acknowledgeButton);

      // Then close
      const closeButton = getByText("Close");
      fireEvent.press(closeButton);

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it("should show close button immediately when requireAcknowledge is false", () => {
      const { getByText } = render(
        <CrisisModal {...defaultProps} requireAcknowledge={false} />
      );

      expect(getByText("Close")).toBeTruthy();
    });
  });

  describe("Contextual Messaging", () => {
    it("should show assessment-specific message when triggered from assessment", () => {
      const { getByText } = render(
        <CrisisModal {...defaultProps} triggerSource="assessment" />
      );

      expect(getByText("We noticed you might be going through a difficult time.")).toBeTruthy();
    });

    it("should show journal-specific message when triggered from journal", () => {
      const { getByText } = render(
        <CrisisModal {...defaultProps} triggerSource="journal" />
      );

      expect(getByText("Thank you for sharing your feelings with us.")).toBeTruthy();
    });

    it("should show chat-specific message when triggered from chat", () => {
      const { getByText } = render(
        <CrisisModal {...defaultProps} triggerSource="chat" />
      );

      expect(getByText("We're here to support you through difficult moments.")).toBeTruthy();
    });

    it("should show score-specific message when triggered from score", () => {
      const { getByText } = render(
        <CrisisModal {...defaultProps} triggerSource="score" />
      );

      expect(getByText("Your wellbeing is important to us.")).toBeTruthy();
    });

    it("should show custom message when provided", () => {
      const customMessage = "Custom support message for testing";
      const { getByText } = render(
        <CrisisModal {...defaultProps} customMessage={customMessage} />
      );

      expect(getByText(customMessage)).toBeTruthy();
    });
  });

  describe("Emergency Information", () => {
    it("should display 911 emergency information", () => {
      const { getByText } = render(<CrisisModal {...defaultProps} />);

      expect(getByText(/If you're in immediate danger/)).toBeTruthy();
      expect(getByText("911")).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("should have alert role on overlay", () => {
      const { getByLabelText } = render(<CrisisModal {...defaultProps} />);

      expect(getByLabelText("Crisis support resources available")).toBeTruthy();
    });

    it("should have proper accessibility labels on resource buttons", () => {
      const { getByLabelText } = render(<CrisisModal {...defaultProps} />);

      expect(
        getByLabelText(/Call 988 Now.*24\/7 confidential support/)
      ).toBeTruthy();
    });

    it("should have proper accessibility hint on resources", () => {
      const { getByA11yHint } = render(<CrisisModal {...defaultProps} />);

      expect(getByA11yHint("Activates to connect with crisis support")).toBeTruthy();
    });

    it("should announce acknowledgment state", () => {
      const { getByLabelText, getByText } = render(
        <CrisisModal {...defaultProps} requireAcknowledge />
      );

      // Initial state
      expect(
        getByLabelText("I understand these resources are available")
      ).toBeTruthy();

      // After acknowledging
      const acknowledgeButton = getByText("I Understand");
      fireEvent.press(acknowledgeButton);

      expect(
        getByLabelText("Resources acknowledged. You can now close this dialog.")
      ).toBeTruthy();
    });
  });

  describe("Safety Requirements", () => {
    it("should not use triggering language in UI", () => {
      const { queryByText } = render(<CrisisModal {...defaultProps} />);

      // Verify NO presence of triggering words
      expect(queryByText(/suicidal/i)).toBeNull();
      expect(queryByText(/kill/i)).toBeNull();
      expect(queryByText(/die/i)).toBeNull();
      expect(queryByText(/hurt yourself/i)).toBeNull();
    });

    it("should use supportive language throughout", () => {
      const { getByText } = render(<CrisisModal {...defaultProps} />);

      expect(getByText("You're Not Alone")).toBeTruthy();
      expect(getByText(/You deserve support/)).toBeTruthy();
      expect(getByText(/help is just a call or text away/)).toBeTruthy();
    });

    it("should render with testID for automation", () => {
      const { getByTestId } = render(
        <CrisisModal {...defaultProps} testID="crisis-modal" />
      );

      expect(getByTestId("crisis-modal")).toBeTruthy();
      expect(getByTestId("crisis-modal-resource-0")).toBeTruthy();
      expect(getByTestId("crisis-modal-resource-1")).toBeTruthy();
      expect(getByTestId("crisis-modal-resource-2")).toBeTruthy();
    });
  });

  describe("Modal Behavior", () => {
    it("should reset acknowledgment state when reopened", () => {
      const { getByText, rerender } = render(
        <CrisisModal {...defaultProps} requireAcknowledge />
      );

      // Acknowledge
      const acknowledgeButton = getByText("I Understand");
      fireEvent.press(acknowledgeButton);

      // Close
      const closeButton = getByText("Close");
      fireEvent.press(closeButton);

      // Reopen
      rerender(<CrisisModal {...defaultProps} requireAcknowledge visible={true} />);

      // Should be back to unacknowledged state
      expect(getByText("I Understand")).toBeTruthy();
    });

    it("should prevent dismissal before acknowledgment when required", () => {
      const onDismiss = jest.fn();
      const { getByText, queryByText } = render(
        <CrisisModal {...defaultProps} onDismiss={onDismiss} requireAcknowledge />
      );

      // Try to close without acknowledging (close button should not exist)
      expect(queryByText("Close")).toBeNull();
      expect(onDismiss).not.toHaveBeenCalled();
    });
  });

  describe("Visual Elements", () => {
    it("should render heart icon", () => {
      const { getByText } = render(<CrisisModal {...defaultProps} />);

      expect(getByText("❤️")).toBeTruthy();
    });

    it("should render all main sections", () => {
      const { getByText } = render(<CrisisModal {...defaultProps} />);

      // Header
      expect(getByText("You're Not Alone")).toBeTruthy();

      // Support message
      expect(getByText(/thoughts of distress/)).toBeTruthy();

      // Resources (all 3)
      expect(getByText("988 Suicide & Crisis Lifeline")).toBeTruthy();

      // Emergency info
      expect(getByText(/immediate danger/)).toBeTruthy();
    });
  });
});
