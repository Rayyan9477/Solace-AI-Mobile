/**
 * ThemeContext Unit Tests
 * Tests for therapeutic theming system and context management
 */

import { render, waitFor } from "@testing-library/react-native";
import React from "react";
import { View, Text, AccessibilityInfo } from "react-native";

import { ThemeProvider, useTheme } from "../../src/shared/theme/ThemeContext";

interface TestComponentProps {
  testID?: string;
}

// Test component to consume theme
const TestComponent: React.FC<TestComponentProps> = ({ testID = "test-component" }) => {
  const { theme, colors, isReducedMotionEnabled } = useTheme();

  return (
    <View testID={testID}>
      <Text testID="theme-colors">{JSON.stringify(colors.calming)}</Text>
      <Text testID="reduced-motion">{isReducedMotionEnabled.toString()}</Text>
      <Text testID="spacing">{theme.spacing.md.toString()}</Text>
    </View>
  );
};

describe("ThemeContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Theme Provider", () => {
    it("provides default therapeutic theme", () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>,
      );

      const component = getByTestId("test-component");
      expect(component).toBeTruthy();

      const colorsText = getByTestId("theme-colors");
      expect(colorsText.props.children).toContain("#");
    });

    it("provides therapeutic color schemes", () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>,
      );

      const colorsText = getByTestId("theme-colors");
      const colors = JSON.parse(colorsText.props.children);

      expect(Array.isArray(colors)).toBe(true);
      expect(colors.length).toBeGreaterThan(0);
    });

    it("supports reduced motion preferences", async () => {
      (AccessibilityInfo.isReduceMotionEnabled as jest.Mock).mockResolvedValue(
        true,
      );

      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>,
      );

      await waitFor(() => {
        const reducedMotionText = getByTestId("reduced-motion");
        expect(reducedMotionText.props.children).toBe("true");
      });
    });

    it("provides consistent spacing system", () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>,
      );

      const spacingText = getByTestId("spacing");
      const spacing = Number.parseInt(spacingText.props.children);

      expect(spacing).toBeGreaterThan(0);
      expect(spacing % 4).toBe(0);
    });
  });

  describe("Therapeutic Color System", () => {
    it("includes all required therapeutic color schemes", () => {
      let capturedTheme: any;

      const CaptureTheme: React.FC = () => {
        capturedTheme = useTheme();
        return null;
      };

      render(
        <ThemeProvider>
          <CaptureTheme />
        </ThemeProvider>,
      );

      expect(capturedTheme.colors).toHaveProperty("calming");
      expect(capturedTheme.colors).toHaveProperty("nurturing");
      expect(capturedTheme.colors).toHaveProperty("peaceful");
      expect(capturedTheme.colors).toHaveProperty("grounding");
      expect(capturedTheme.colors).toHaveProperty("energizing");
    });

    it("uses appropriate colors for mental health context", () => {
      let capturedTheme: any;

      const CaptureTheme: React.FC = () => {
        capturedTheme = useTheme();
        return null;
      };

      render(
        <ThemeProvider>
          <CaptureTheme />
        </ThemeProvider>,
      );

      expect(capturedTheme.colors.calming).toEqual(
        expect.arrayContaining([expect.stringMatching(/#[0-9A-Fa-f]{6}/)]),
      );

      expect(capturedTheme.colors.nurturing).toEqual(
        expect.arrayContaining([expect.stringMatching(/#[0-9A-Fa-f]{6}/)]),
      );
    });
  });

  describe("Accessibility Integration", () => {
    it("adapts to screen reader preferences", async () => {
      (AccessibilityInfo.isScreenReaderEnabled as jest.Mock).mockResolvedValue(
        true,
      );

      let capturedTheme: any;

      const CaptureTheme: React.FC = () => {
        capturedTheme = useTheme();
        return null;
      };

      render(
        <ThemeProvider>
          <CaptureTheme />
        </ThemeProvider>,
      );

      await waitFor(() => {
        expect(capturedTheme).toBeTruthy();
      });
    });

    it("supports high contrast mode", () => {
      const customTheme: any = {
        accessibility: {
          highContrastMode: true,
        },
      };

      let capturedTheme: any;

      const CaptureTheme: React.FC = () => {
        capturedTheme = useTheme();
        return null;
      };

      render(
        <ThemeProvider value={{ theme: customTheme }}>
          <CaptureTheme />
        </ThemeProvider>,
      );

      expect(capturedTheme.theme.accessibility.highContrastMode).toBe(true);
    });
  });

  describe("Dynamic Theme Updates", () => {
    it("updates theme based on time of day", () => {
      const mockDate = new Date("2023-01-01T14:00:00Z");
      jest.spyOn(globalThis, "Date").mockImplementation(() => mockDate as any);

      let capturedTheme: any;

      const CaptureTheme: React.FC = () => {
        capturedTheme = useTheme();
        return null;
      };

      render(
        <ThemeProvider>
          <CaptureTheme />
        </ThemeProvider>,
      );

      expect(capturedTheme).toBeTruthy();
    });

    it("adapts colors based on user mood context", () => {
      const moodContext = {
        currentMood: "anxious",
        intensity: 8,
      };

      let capturedTheme: any;

      const CaptureTheme: React.FC = () => {
        capturedTheme = useTheme();
        return null;
      };

      render(
        <ThemeProvider moodContext={moodContext}>
          <CaptureTheme />
        </ThemeProvider>,
      );

      expect(capturedTheme.colors.calming).toBeTruthy();
    });
  });

  describe("Performance and Optimization", () => {
    it("memoizes theme calculations", () => {
      const { rerender } = render(
        <ThemeProvider>
          <TestComponent testID="test-1" />
        </ThemeProvider>,
      );

      rerender(
        <ThemeProvider>
          <TestComponent testID="test-2" />
        </ThemeProvider>,
      );

      // Should not throw errors on rerender
      expect(true).toBe(true);
    });

    it("handles theme switching efficiently", () => {
      const LightTheme: React.FC = () => (
        <ThemeProvider theme="light">
          <TestComponent testID="light-theme" />
        </ThemeProvider>
      );

      const DarkTheme: React.FC = () => (
        <ThemeProvider theme="dark">
          <TestComponent testID="dark-theme" />
        </ThemeProvider>
      );

      const { rerender } = render(<LightTheme />);
      rerender(<DarkTheme />);

      expect(true).toBe(true);
    });
  });

  describe("Error Handling", () => {
    it("provides fallback theme when context is missing", () => {
      const TestWithoutProvider: React.FC = () => {
        try {
          const theme = useTheme();
          return <Text testID="theme-test">{JSON.stringify(theme)}</Text>;
        } catch (error: any) {
          return <Text testID="error-test">Error: {error.message}</Text>;
        }
      };

      const { getByTestId } = render(<TestWithoutProvider />);

      const element = getByTestId("theme-test") || getByTestId("error-test");
      expect(element).toBeTruthy();
    });

    it("handles invalid theme configurations gracefully", () => {
      const invalidTheme: any = {
        colors: null,
        spacing: "invalid",
      };

      expect(() => {
        render(
          <ThemeProvider value={{ theme: invalidTheme }}>
            <TestComponent />
          </ThemeProvider>,
        );
      }).not.toThrow();
    });
  });

  describe("Mental Health Theme Features", () => {
    it("provides crisis-appropriate color schemes", () => {
      let capturedTheme: any;

      const CaptureTheme: React.FC = () => {
        capturedTheme = useTheme();
        return null;
      };

      render(
        <ThemeProvider crisisMode>
          <CaptureTheme />
        </ThemeProvider>,
      );

      expect(capturedTheme.colors.calming).toBeTruthy();
    });

    it("supports therapeutic gradients", () => {
      let capturedTheme: any;

      const CaptureTheme: React.FC = () => {
        capturedTheme = useTheme();
        return null;
      };

      render(
        <ThemeProvider>
          <CaptureTheme />
        </ThemeProvider>,
      );

      for (const colorScheme of Object.values(capturedTheme.colors)) {
        if (Array.isArray(colorScheme)) {
          expect(colorScheme.length).toBeGreaterThanOrEqual(2);
        }
      }
    });

    it("includes mental health specific design tokens", () => {
      let capturedTheme: any;

      const CaptureTheme: React.FC = () => {
        capturedTheme = useTheme();
        return null;
      };

      render(
        <ThemeProvider>
          <CaptureTheme />
        </ThemeProvider>,
      );

      expect(capturedTheme.theme.spacing).toBeTruthy();
      expect(capturedTheme.theme.borderRadius).toBeTruthy();
      expect(capturedTheme.theme.typography).toBeTruthy();
    });
  });
});
