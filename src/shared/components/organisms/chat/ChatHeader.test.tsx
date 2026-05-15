jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () => jest.requireActual("@/shared/theme/useTheme"));

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import { ChatHeader } from "./ChatHeader";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const noop = jest.fn();

describe("ChatHeader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    expect(() =>
      renderWithTheme(<ChatHeader onBack={noop} testID="header" />),
    ).not.toThrow();
  });

  it("renders a stable snapshot with defaults", () => {
    const { toJSON } = renderWithTheme(
      <ChatHeader onBack={noop} testID="header" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders a stable snapshot with avatarUri", () => {
    const { toJSON } = renderWithTheme(
      <ChatHeader
        onBack={noop}
        avatarUri="https://example.com/avatar.png"
        title="Solace"
        status="CBT mode · Online"
        onPhonePress={noop}
        onMorePress={noop}
        testID="header"
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  describe("default props", () => {
    it("shows default title 'Solace'", () => {
      const { getByText } = renderWithTheme(
        <ChatHeader onBack={noop} />,
      );
      expect(getByText("Solace")).toBeTruthy();
    });

    it("shows default status text", () => {
      const { getByText } = renderWithTheme(
        <ChatHeader onBack={noop} />,
      );
      expect(getByText("CBT mode · Online")).toBeTruthy();
    });
  });

  describe("custom props", () => {
    it("shows custom title", () => {
      const { getByText } = renderWithTheme(
        <ChatHeader onBack={noop} title="AI Companion" />,
      );
      expect(getByText("AI Companion")).toBeTruthy();
    });

    it("shows custom status", () => {
      const { getByText } = renderWithTheme(
        <ChatHeader onBack={noop} status="Offline" />,
      );
      expect(getByText("Offline")).toBeTruthy();
    });
  });

  describe("accessibility", () => {
    it("has accessibilityRole=header on the container", () => {
      const { getByTestId } = renderWithTheme(
        <ChatHeader onBack={noop} testID="header" />,
      );
      const node = getByTestId("header");
      expect(node.props.accessibilityRole).toBe("header");
    });

    it("back button has accessibilityRole=button and label", () => {
      const { getByLabelText } = renderWithTheme(
        <ChatHeader onBack={noop} />,
      );
      const btn = getByLabelText("Go back");
      expect(btn.props.accessibilityRole).toBe("button");
    });

    it("phone button has accessibilityRole=button when provided", () => {
      const { getByLabelText } = renderWithTheme(
        <ChatHeader onBack={noop} onPhonePress={noop} />,
      );
      const btn = getByLabelText("Start phone call");
      expect(btn.props.accessibilityRole).toBe("button");
    });

    it("more button has accessibilityRole=button when provided", () => {
      const { getByLabelText } = renderWithTheme(
        <ChatHeader onBack={noop} onMorePress={noop} />,
      );
      const btn = getByLabelText("More options");
      expect(btn.props.accessibilityRole).toBe("button");
    });
  });

  describe("interactions", () => {
    it("calls onBack when back button is pressed", () => {
      const onBack = jest.fn();
      const { getByLabelText } = renderWithTheme(
        <ChatHeader onBack={onBack} />,
      );
      fireEvent.press(getByLabelText("Go back"));
      expect(onBack).toHaveBeenCalledTimes(1);
    });

    it("calls onPhonePress when phone button is pressed", () => {
      const onPhone = jest.fn();
      const { getByLabelText } = renderWithTheme(
        <ChatHeader onBack={noop} onPhonePress={onPhone} />,
      );
      fireEvent.press(getByLabelText("Start phone call"));
      expect(onPhone).toHaveBeenCalledTimes(1);
    });

    it("calls onMorePress when more button is pressed", () => {
      const onMore = jest.fn();
      const { getByLabelText } = renderWithTheme(
        <ChatHeader onBack={noop} onMorePress={onMore} />,
      );
      fireEvent.press(getByLabelText("More options"));
      expect(onMore).toHaveBeenCalledTimes(1);
    });

    it("does not render phone button when onPhonePress is absent", () => {
      const { queryByLabelText } = renderWithTheme(
        <ChatHeader onBack={noop} />,
      );
      expect(queryByLabelText("Start phone call")).toBeNull();
    });

    it("does not render more button when onMorePress is absent", () => {
      const { queryByLabelText } = renderWithTheme(
        <ChatHeader onBack={noop} />,
      );
      expect(queryByLabelText("More options")).toBeNull();
    });
  });
});
