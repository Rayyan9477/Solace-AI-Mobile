import { render, fireEvent, waitFor } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";
import React from "react";

import Button from "../../../src/components/common/Button";

jest.mock("expo-haptics");

// Mock the useTheme hook
jest.mock("../../../src/shared/theme/ThemeContext", () => ({
  useTheme: () => ({ theme: mockTheme }),
}));

const mockTheme = {
  colors: {
    background: {
      surface: "#FFFFFF",
      secondary: "#F5F5F5",
    },
    border: {
      main: "#E0E0E0",
    },
    shadow: "#000000",
    primary: {
      main: "#007AFF",
      light: "#E3F2FD",
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
      inverse: "#FFFFFF",
    },
  },
};

const MockThemeProvider = ({ children }) => {
  return children;
};

describe("Button Component", () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with default props", async () => {
    const { getByText, getByTestId } = render(
      <Button title="Test Button" onPress={mockOnPress} />,
    );

    const buttonText = getByText("Test Button");
    expect(buttonText).toBeTruthy();

    const button = getByTestId("button-Test Button");
    expect(button).toBeTruthy();
    expect(button.props.accessibilityState.disabled).toBe(false);
  });

  it("calls onPress and triggers haptics when pressed", async () => {
    const { getByTestId } = render(
      <Button title="Test Button" onPress={mockOnPress} />,
    );

    const button = getByTestId("button-Test Button");
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
    expect(Haptics.impactAsync).toHaveBeenCalledWith(
      Haptics.ImpactFeedbackStyle.Medium,
    );
  });

  it("disables the button when disabled prop is true", async () => {
    const { getByTestId } = render(
      <Button title="Test Button" onPress={mockOnPress} disabled />,
    );

    const button = getByTestId("button-Test Button");
    expect(button.props.accessibilityState.disabled).toBe(true);
    fireEvent.press(button);

    expect(mockOnPress).not.toHaveBeenCalled();
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });

  it("applies fullWidth style when fullWidth prop is true", async () => {
    const { getByTestId } = render(
      <Button title="Test Button" onPress={mockOnPress} fullWidth />,
    );

    const button = getByTestId("button-Test Button");
    // Convert style prop to array if it's not already
    const styles = Array.isArray(button.props.style)
      ? button.props.style.filter((style) => style !== false)
      : [button.props.style].filter((style) => style !== false);
    const hasFullWidth = styles.some(
      (style) => style && style.width === "100%",
    );
    expect(hasFullWidth).toBe(true);
  });

  it("renders different variants correctly", async () => {
    const variants = ["primary", "secondary", "outline", "text"];

    for (const variant of variants) {
      const { getByTestId } = render(
        <Button
          title={`${variant} Button`}
          onPress={mockOnPress}
          variant={variant}
        />,
      );

      const button = getByTestId(`button-${variant} Button`);
      expect(button).toBeTruthy();
    }
  });

  it("renders different sizes correctly", async () => {
    const sizes = ["small", "medium", "large"];

    for (const size of sizes) {
      const { getByTestId } = render(
        <Button title={`${size} Button`} onPress={mockOnPress} size={size} />,
      );

      const button = getByTestId(`button-${size} Button`);
      expect(button).toBeTruthy();
    }
  });

  it("sets correct accessibility props", async () => {
    const { getByTestId } = render(
      <Button
        title="Accessible Button"
        onPress={mockOnPress}
        accessibilityLabel="Custom Label"
        accessibilityHint="Custom Hint"
      />,
    );

    const button = getByTestId("button-Accessible Button");
    expect(button.props.accessibilityLabel).toBe("Custom Label");
    expect(button.props.accessibilityHint).toBe("Custom Hint");
  });
});
