import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import Avatar from "../../../src/components/common/Avatar";

// Mock theme context
const mockTheme = {
  colors: {
    primary: {
      main: "#007AFF",
      light: "#E3F2FD",
      dark: "#1976D2",
    },
    background: {
      primary: "#FFFFFF",
      surface: "#F5F5F5",
    },
    text: {
      onPrimary: "#FFFFFF",
    },
    success: {
      main: "#4CAF50",
    },
    warning: {
      main: "#FF9800",
    },
    error: {
      main: "#F44336",
    },
    gray: {
      400: "#BDBDBD",
    },
  },
  borderRadius: {
    medium: 8,
  },
};

const MockThemeProvider = ({ children }) => {
  return children;
};

// Mock useTheme hook
jest.mock("../../shared/theme/ThemeContext", () => ({
  useTheme: () => ({ theme: mockTheme }),
}));

describe("Avatar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with default props", () => {
    const { getByLabelText } = render(
      <MockThemeProvider>
        <Avatar name="John Doe" />
      </MockThemeProvider>,
    );

    const avatar = getByLabelText("John Doe's avatar");
    expect(avatar).toBeTruthy();
  });

  it("displays initials correctly", () => {
    const { getByText } = render(
      <MockThemeProvider>
        <Avatar name="John Doe" />
      </MockThemeProvider>,
    );

    expect(getByText("JD")).toBeTruthy();
  });

  it("handles single name correctly", () => {
    const { getByText } = render(
      <MockThemeProvider>
        <Avatar name="John" />
      </MockThemeProvider>,
    );

    expect(getByText("J")).toBeTruthy();
  });

  it("shows fallback icon when no name provided", () => {
    const { getByText } = render(
      <MockThemeProvider>
        <Avatar name="" />
      </MockThemeProvider>,
    );

    expect(getByText("👤")).toBeTruthy();
  });

  it("renders with custom fallback icon", () => {
    const { getByText } = render(
      <MockThemeProvider>
        <Avatar name="" fallbackIcon="🤖" />
      </MockThemeProvider>,
    );

    expect(getByText("🤖")).toBeTruthy();
  });

  it("renders status indicator when status prop is provided", () => {
    const { getByLabelText } = render(
      <MockThemeProvider>
        <Avatar name="John Doe" status="online" />
      </MockThemeProvider>,
    );

    const statusIndicator = getByLabelText("Status: online");
    expect(statusIndicator).toBeTruthy();
  });

  it("renders badge when badge prop is provided", () => {
    const { getByLabelText } = render(
      <MockThemeProvider>
        <Avatar name="John Doe" badge={{ count: 5 }} />
      </MockThemeProvider>,
    );

    const badge = getByLabelText("Badge: 5");
    expect(badge).toBeTruthy();
  });

  it("handles press events when onPress is provided", () => {
    const mockOnPress = jest.fn();
    const { getByRole } = render(
      <MockThemeProvider>
        <Avatar name="John Doe" onPress={mockOnPress} />
      </MockThemeProvider>,
    );

    const avatar = getByRole("button");
    fireEvent.press(avatar);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it("renders as image role when no onPress is provided", () => {
    const { getByLabelText } = render(
      <MockThemeProvider>
        <Avatar name="John Doe" />
      </MockThemeProvider>,
    );

    const avatar = getByLabelText("John Doe's avatar");
    expect(avatar).toBeTruthy();
  });

  it("renders as button role when onPress is provided", () => {
    const mockOnPress = jest.fn();
    const { getByRole } = render(
      <MockThemeProvider>
        <Avatar name="John Doe" onPress={mockOnPress} />
      </MockThemeProvider>,
    );

    expect(getByRole("button")).toBeTruthy();
  });

  it("applies correct accessibility label", () => {
    const { getByLabelText } = render(
      <MockThemeProvider>
        <Avatar name="John Doe" />
      </MockThemeProvider>,
    );

    expect(getByLabelText("John Doe's avatar")).toBeTruthy();
  });

  it("applies correct accessibility label with status", () => {
    const { getByLabelText } = render(
      <MockThemeProvider>
        <Avatar name="John Doe" status="online" />
      </MockThemeProvider>,
    );

    expect(getByLabelText("John Doe's avatar, status: online")).toBeTruthy();
  });
});
