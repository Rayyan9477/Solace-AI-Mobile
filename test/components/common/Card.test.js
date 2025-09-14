import { render, fireEvent } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";

import Card from "../../../src/components/common/Card";

// Mock theme context
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
  },
};

const MockThemeProvider = ({ children }) => {
  return children;
};

// Mock useTheme hook
jest.mock("../../../src/contexts/ThemeContext", () => ({
  useTheme: () => ({ theme: mockTheme }),
}));

describe("Card Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with default props", () => {
    const { getByText } = render(
      <MockThemeProvider>
        <Card>
          <Text>Card Content</Text>
        </Card>
      </MockThemeProvider>,
    );

    expect(getByText("Card Content")).toBeTruthy();
  });

  it("renders with outlined variant", () => {
    const { getByText } = render(
      <MockThemeProvider>
        <Card variant="outlined">
          <Text>Outlined Card</Text>
        </Card>
      </MockThemeProvider>,
    );

    expect(getByText("Outlined Card")).toBeTruthy();
  });

  it("renders with flat variant", () => {
    const { getByText } = render(
      <MockThemeProvider>
        <Card variant="flat">
          <Text>Flat Card</Text>
        </Card>
      </MockThemeProvider>,
    );

    expect(getByText("Flat Card")).toBeTruthy();
  });

  it("renders with elevated variant", () => {
    const { getByText } = render(
      <MockThemeProvider>
        <Card variant="elevated">
          <Text>Elevated Card</Text>
        </Card>
      </MockThemeProvider>,
    );

    expect(getByText("Elevated Card")).toBeTruthy();
  });

  it("renders with filled variant", () => {
    const { getByText } = render(
      <MockThemeProvider>
        <Card variant="filled">
          <Text>Filled Card</Text>
        </Card>
      </MockThemeProvider>,
    );

    expect(getByText("Filled Card")).toBeTruthy();
  });

  it("handles press events when onPress is provided", () => {
    const mockOnPress = jest.fn();
    const { getByRole } = render(
      <MockThemeProvider>
        <Card onPress={mockOnPress}>
          <Text>Pressable Card</Text>
        </Card>
      </MockThemeProvider>,
    );

    const card = getByRole("button");
    fireEvent.press(card);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it("does not handle press when disabled", () => {
    const mockOnPress = jest.fn();
    const { getByRole } = render(
      <MockThemeProvider>
        <Card onPress={mockOnPress} disabled>
          <Text>Disabled Card</Text>
        </Card>
      </MockThemeProvider>,
    );

    const card = getByRole("button");
    fireEvent.press(card);
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it("applies correct accessibility props", () => {
    const { getByLabelText } = render(
      <MockThemeProvider>
        <Card accessibilityLabel="Test Card">
          <Text>Test Content</Text>
        </Card>
      </MockThemeProvider>,
    );

    expect(getByLabelText("Test Card")).toBeTruthy();
  });

  it("applies correct accessibility role when pressable", () => {
    const mockOnPress = jest.fn();
    const { getByRole } = render(
      <MockThemeProvider>
        <Card onPress={mockOnPress}>
          <Text>Pressable Card</Text>
        </Card>
      </MockThemeProvider>,
    );

    expect(getByRole("button")).toBeTruthy();
  });

  it("applies loading state correctly", () => {
    const mockOnPress = jest.fn();
    const { getByRole } = render(
      <MockThemeProvider>
        <Card onPress={mockOnPress} loading>
          <Text>Loading Card</Text>
        </Card>
      </MockThemeProvider>,
    );

    const card = getByRole("button");
    fireEvent.press(card);
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it("applies custom padding", () => {
    const { getByText } = render(
      <MockThemeProvider>
        <Card padding={20}>
          <Text>Custom Padding Card</Text>
        </Card>
      </MockThemeProvider>,
    );

    expect(getByText("Custom Padding Card")).toBeTruthy();
  });

  it("applies custom border radius", () => {
    const { getByText } = render(
      <MockThemeProvider>
        <Card borderRadius={16}>
          <Text>Custom Border Radius Card</Text>
        </Card>
      </MockThemeProvider>,
    );

    expect(getByText("Custom Border Radius Card")).toBeTruthy();
  });
});
