import { render } from "@testing-library/react-native";
import React from "react";
import Slider from "src/shared/components/atoms/Slider";

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
    text: {
      primary: "#2D3748",
      secondary: "#718096",
      inverse: "#FFFFFF",
    },
    therapeutic: {
      calming: {
        500: "#4A90E2",
      },
      energizing: {
        500: "#FF6B6B",
      },
    },
  },
  typography: {
    body: {
      fontSize: 16,
    },
  },
};

const MockThemeProvider = ({ children }) => {
  return children;
};

// Mock useTheme hook
jest.mock("src/shared/theme/ThemeContext", () => ({
  useTheme: () => ({
    theme: mockTheme,
    isDarkMode: false,
    isScreenReaderEnabled: false,
  }),
}));

// Mock ColorPalette - create a stub since the file doesn't exist
jest.mock(
  "src/shared/theme/ColorPalette",
  () => ({
    getTherapeuticColor: jest.fn(() => "#4A90E2"),
  }),
  { virtual: true },
);

describe("Slider Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with default props", () => {
    const { getByTestId } = render(
      <MockThemeProvider>
        <Slider testID="test-slider" />
      </MockThemeProvider>,
    );

    expect(getByTestId("test-slider")).toBeTruthy();
  });

  it("renders with custom value", () => {
    const { getByTestId } = render(
      <MockThemeProvider>
        <Slider value={75} testID="test-slider" />
      </MockThemeProvider>,
    );

    expect(getByTestId("test-slider")).toBeTruthy();
  });

  it("renders with different sizes", () => {
    const { getByTestId, rerender } = render(
      <MockThemeProvider>
        <Slider size="small" testID="test-slider" />
      </MockThemeProvider>,
    );

    expect(getByTestId("test-slider")).toBeTruthy();

    rerender(
      <MockThemeProvider>
        <Slider size="large" testID="test-slider" />
      </MockThemeProvider>,
    );

    expect(getByTestId("test-slider")).toBeTruthy();
  });

  it("renders as disabled", () => {
    const { getByTestId } = render(
      <MockThemeProvider>
        <Slider disabled testID="test-slider" />
      </MockThemeProvider>,
    );

    expect(getByTestId("test-slider")).toBeTruthy();
  });

  it("applies accessibility props", () => {
    const { getByLabelText } = render(
      <MockThemeProvider>
        <Slider
          accessibilityLabel="Mood intensity slider"
          testID="test-slider"
        />
      </MockThemeProvider>,
    );

    expect(getByLabelText("Mood intensity slider")).toBeTruthy();
  });
});
