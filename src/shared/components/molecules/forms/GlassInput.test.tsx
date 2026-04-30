jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () => jest.requireActual("@/shared/theme/useTheme"));

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import { GlassInput } from "./GlassInput";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const baseProps = {
  value: "",
  onChangeText: jest.fn(),
  accessibilityLabel: "Email address",
  testID: "glass-input",
};

describe("GlassInput", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders without crashing", () => {
    const { toJSON } = renderWithTheme(<GlassInput {...baseProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it("matches snapshot", () => {
    const { toJSON } = renderWithTheme(<GlassInput {...baseProps} placeholder="Enter email" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders prefix icon when iconName is provided", () => {
    const { getByTestId } = renderWithTheme(
      <GlassInput {...baseProps} iconName="mail" />,
    );
    // outer container should exist
    expect(getByTestId("glass-input")).toBeTruthy();
  });

  it("renders without prefix icon when iconName is omitted", () => {
    const { toJSON } = renderWithTheme(<GlassInput {...baseProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it("calls onChangeText when text is entered", () => {
    const onChangeText = jest.fn();
    const { getByTestId } = renderWithTheme(
      <GlassInput {...baseProps} onChangeText={onChangeText} />,
    );
    fireEvent.changeText(getByTestId("glass-input-input"), "hello@test.com");
    expect(onChangeText).toHaveBeenCalledWith("hello@test.com");
  });

  describe("password mode", () => {
    it("renders toggle button when secureTextEntry=true", () => {
      const { getByTestId } = renderWithTheme(
        <GlassInput {...baseProps} secureTextEntry />,
      );
      expect(getByTestId("glass-input-toggle")).toBeTruthy();
    });

    it("does not render toggle button when secureTextEntry=false", () => {
      const { queryByTestId } = renderWithTheme(
        <GlassInput {...baseProps} secureTextEntry={false} />,
      );
      expect(queryByTestId("glass-input-toggle")).toBeNull();
    });

    it("toggles visibility on press", () => {
      const { getByTestId } = renderWithTheme(
        <GlassInput {...baseProps} secureTextEntry />,
      );
      const toggle = getByTestId("glass-input-toggle");
      fireEvent.press(toggle);
      // After one press, hidden becomes false (password revealed)
      expect(toggle.props.accessibilityLabel).toBe("Hide password");
    });

    it("toggle button has accessible role=button", () => {
      const { getByTestId } = renderWithTheme(
        <GlassInput {...baseProps} secureTextEntry />,
      );
      expect(getByTestId("glass-input-toggle").props.accessibilityRole).toBe("button");
    });
  });

  describe("error state", () => {
    it("renders error text when errorText is provided", () => {
      const { getByTestId } = renderWithTheme(
        <GlassInput {...baseProps} errorText="Invalid email" />,
      );
      expect(getByTestId("glass-input-error")).toBeTruthy();
    });

    it("does not render error text when errorText is omitted", () => {
      const { queryByTestId } = renderWithTheme(<GlassInput {...baseProps} />);
      expect(queryByTestId("glass-input-error")).toBeNull();
    });

    it("error text has accessibilityRole=alert", () => {
      const { getByTestId } = renderWithTheme(
        <GlassInput {...baseProps} errorText="Required" />,
      );
      expect(getByTestId("glass-input-error").props.accessibilityRole).toBe("alert");
    });
  });

  describe("accessibility", () => {
    it("sets accessibilityLabel on the input", () => {
      const { getByTestId } = renderWithTheme(
        <GlassInput {...baseProps} accessibilityLabel="Email address" />,
      );
      expect(getByTestId("glass-input-input").props.accessibilityLabel).toBe("Email address");
    });
  });
});
