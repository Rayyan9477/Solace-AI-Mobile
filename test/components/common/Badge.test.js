import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import Badge from "../../../src/components/common/Badge";

// Mock theme context
const mockTheme = {
  colors: {
    primary: {
      light: "#E3F2FD",
      dark: "#1976D2",
    },
    success: {
      light: "#E8F5E8",
      dark: "#2E7D32",
    },
    warning: {
      light: "#FFF8E1",
      dark: "#F57C00",
    },
    error: {
      light: "#FFEBEE",
      dark: "#C62828",
    },
    info: {
      light: "#E1F5FE",
      dark: "#0277BD",
    },
  },
};

const MockThemeProvider = ({ children }) => {
  return children;
};

// Mock useTheme hook
jest.mock("../../shared/theme/ThemeContext", () => ({
  useTheme: () => ({ theme: mockTheme }),
}));

describe("Badge Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with default props", () => {
    const { getByText } = render(
      <MockThemeProvider>
        <Badge label="5" />
      </MockThemeProvider>,
    );

    expect(getByText("5")).toBeTruthy();
  });

  it("renders with different variants", () => {
    const variants = ["primary", "success", "warning", "error", "info"];

    variants.forEach((variant) => {
      const { getByText } = render(
        <MockThemeProvider>
          <Badge label="Test" variant={variant} />
        </MockThemeProvider>,
      );

      expect(getByText("Test")).toBeTruthy();
    });
  });

  it("renders with different sizes", () => {
    const sizes = ["small", "medium", "large"];

    sizes.forEach((size) => {
      const { getByText } = render(
        <MockThemeProvider>
          <Badge label="Test" size={size} />
        </MockThemeProvider>,
      );

      expect(getByText("Test")).toBeTruthy();
    });
  });

  it("renders dot variant correctly", () => {
    const { getByLabelText } = render(
      <MockThemeProvider>
        <Badge dot />
      </MockThemeProvider>,
    );

    const dotBadge = getByLabelText("Status indicator");
    expect(dotBadge).toBeTruthy();
  });

  it("renders with icon", () => {
    const { getByText } = render(
      <MockThemeProvider>
        <Badge label="5" icon="⭐" />
      </MockThemeProvider>,
    );

    expect(getByText("⭐")).toBeTruthy();
    expect(getByText("5")).toBeTruthy();
  });

  it("renders with icon on right", () => {
    const { getByText } = render(
      <MockThemeProvider>
        <Badge label="5" icon="⭐" iconPosition="right" />
      </MockThemeProvider>,
    );

    expect(getByText("⭐")).toBeTruthy();
    expect(getByText("5")).toBeTruthy();
  });

  it("handles press events when onPress is provided", () => {
    const mockOnPress = jest.fn();
    const { getByRole } = render(
      <MockThemeProvider>
        <Badge label="5" onPress={mockOnPress} />
      </MockThemeProvider>,
    );

    const badge = getByRole("button");
    fireEvent.press(badge);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it("renders as text role when no onPress is provided", () => {
    const { getByRole } = render(
      <MockThemeProvider>
        <Badge label="5" />
      </MockThemeProvider>,
    );

    expect(getByRole("text")).toBeTruthy();
  });

  it("renders as button role when onPress is provided", () => {
    const mockOnPress = jest.fn();
    const { getByRole } = render(
      <MockThemeProvider>
        <Badge label="5" onPress={mockOnPress} />
      </MockThemeProvider>,
    );

    expect(getByRole("button")).toBeTruthy();
  });

  it("formats numeric labels correctly with max limit", () => {
    const { getByText } = render(
      <MockThemeProvider>
        <Badge label={150} max={99} />
      </MockThemeProvider>,
    );

    expect(getByText("99+")).toBeTruthy();
  });

  it("does not format labels under max limit", () => {
    const { getByText } = render(
      <MockThemeProvider>
        <Badge label={50} max={99} />
      </MockThemeProvider>,
    );

    expect(getByText("50")).toBeTruthy();
  });

  it("renders with outline variant", () => {
    const { getByText } = render(
      <MockThemeProvider>
        <Badge label="Outline" outline />
      </MockThemeProvider>,
    );

    expect(getByText("Outline")).toBeTruthy();
  });

  it("applies correct accessibility label", () => {
    const { getByLabelText } = render(
      <MockThemeProvider>
        <Badge label="5" />
      </MockThemeProvider>,
    );

    expect(getByLabelText("5 badge")).toBeTruthy();
  });

  it("applies custom accessibility label", () => {
    const { getByLabelText } = render(
      <MockThemeProvider>
        <Badge label="5" accessibilityLabel="Custom label" />
      </MockThemeProvider>,
    );

    expect(getByLabelText("Custom label")).toBeTruthy();
  });
});
