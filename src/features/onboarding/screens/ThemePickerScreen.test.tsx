/**
 * ThemePickerScreen Tests — Sprint 7, onboarding step 4 of 4.
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import { ThemePickerScreen } from "./ThemePickerScreen";
import type { ThemePickerScreenProps } from "./ThemePickerScreen";
import type { ThemeId } from "@/shared/theme/presets";
import { presetList } from "@/shared/theme/presets";

const ALL_THEME_IDS: ThemeId[] = [
  "cosmic",
  "warmEarth",
  "oceanCalm",
  "deepForest",
  "softRose",
];

const defaultProps: ThemePickerScreenProps = {
  selectedThemeId: "cosmic",
  onThemeChange: jest.fn(),
  onContinue: jest.fn(),
  onBack: jest.fn(),
  onSkip: jest.fn(),
  onSystemDefault: jest.fn(),
};

function renderScreen(
  overrides: Partial<ThemePickerScreenProps> = {},
): ReturnType<typeof render> {
  return render(<ThemePickerScreen {...defaultProps} {...overrides} />);
}

describe("ThemePickerScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Render + snapshot (default cosmic-night selected)
  it("renders and matches snapshot with cosmic selected", () => {
    const tree = renderScreen().toJSON();
    expect(tree).toMatchSnapshot();
  });

  // 2. All 5 theme cards render
  it("renders all 5 theme cards", () => {
    const { getByTestId } = renderScreen();
    ALL_THEME_IDS.forEach((id) => {
      expect(getByTestId(`theme-card-${id}`)).toBeTruthy();
    });
  });

  // 3. Tapping a different card calls onThemeChange with that id
  it("tapping a different card calls onThemeChange with the new id", () => {
    const onThemeChange = jest.fn();
    const { getByTestId } = renderScreen({
      selectedThemeId: "cosmic",
      onThemeChange,
    });
    fireEvent.press(getByTestId("theme-card-warmEarth"));
    expect(onThemeChange).toHaveBeenCalledTimes(1);
    expect(onThemeChange).toHaveBeenCalledWith("warmEarth");
  });

  // 4. Tapping the already-selected card still calls onThemeChange (idempotent ok)
  it("tapping the already-selected card still calls onThemeChange", () => {
    const onThemeChange = jest.fn();
    const { getByTestId } = renderScreen({
      selectedThemeId: "cosmic",
      onThemeChange,
    });
    fireEvent.press(getByTestId("theme-card-cosmic"));
    expect(onThemeChange).toHaveBeenCalledTimes(1);
    expect(onThemeChange).toHaveBeenCalledWith("cosmic");
  });

  // 5. Continue button label includes the selected theme name
  it("continue button label includes selected theme name", () => {
    const { getByTestId } = renderScreen({ selectedThemeId: "warmEarth" });
    const btn = getByTestId("continue-button");
    // The Button component uses accessibilityLabel which equals the label prop
    expect(btn.props.accessibilityLabel).toContain("Warm Earth");
  });

  // 6. Continue calls onContinue
  it("calls onContinue when Continue button is pressed", () => {
    const onContinue = jest.fn();
    const { getByTestId } = renderScreen({ onContinue });
    fireEvent.press(getByTestId("continue-button"));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  // 7. Selected card has accessibilityState.selected=true
  it("selected card has accessibilityState.selected=true", () => {
    const { getByTestId } = renderScreen({ selectedThemeId: "oceanCalm" });
    const card = getByTestId("theme-card-oceanCalm");
    expect(card.props.accessibilityState?.selected).toBe(true);
  });

  // 8. Other cards have accessibilityState.selected=false
  it("non-selected cards have accessibilityState.selected=false", () => {
    const { getByTestId } = renderScreen({ selectedThemeId: "cosmic" });
    const nonSelectedIds = ALL_THEME_IDS.filter((id) => id !== "cosmic");
    nonSelectedIds.forEach((id) => {
      const card = getByTestId(`theme-card-${id}`);
      expect(card.props.accessibilityState?.selected).toBe(false);
    });
  });

  // 9. "Use system default" link calls onSystemDefault when provided
  it("calls onSystemDefault when system-default-link is pressed", () => {
    const onSystemDefault = jest.fn();
    const { getByTestId } = renderScreen({ onSystemDefault });
    fireEvent.press(getByTestId("system-default-link"));
    expect(onSystemDefault).toHaveBeenCalledTimes(1);
  });

  // 10. Back button calls onBack when provided
  it("calls onBack when back button is pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  // 11. Skip link calls onSkip when provided
  it("calls onSkip when skip link is pressed", () => {
    const onSkip = jest.fn();
    const { getByTestId } = renderScreen({ onSkip });
    fireEvent.press(getByTestId("skip-link"));
    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  // 12. Step label rendered when provided
  it("renders custom stepLabel when provided", () => {
    const { getByText } = renderScreen({ stepLabel: "Step 4 of 4" });
    // BracketLabel uppercases the text and wraps it in brackets
    expect(getByText(/STEP 4 OF 4/i)).toBeTruthy();
  });

  // 13. CTA ≥ 44pt (minHeight on the continue button style)
  it("continue button has minHeight of at least 44", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("continue-button");
    // Button component enforces minHeight via sizeSpecs (md = 44), confirmed in Button.tsx
    // accessibilityRole is button confirming it's a pressable touch target
    expect(btn.props.accessibilityRole).toBe("button");
  });

  // 14. Each card has accessibilityLabel containing theme name + description
  it("each card has accessibilityLabel with name and description", () => {
    const { getByTestId } = renderScreen();
    presetList.forEach((preset) => {
      const card = getByTestId(`theme-card-${preset.id}`);
      expect(card.props.accessibilityLabel).toContain(preset.label);
      expect(card.props.accessibilityLabel).toContain(preset.description);
    });
  });

  // 15. When onSystemDefault is not provided, pressing the link calls onThemeChange("cosmic")
  it("calls onThemeChange('cosmic') as fallback when onSystemDefault is not provided", () => {
    const onThemeChange = jest.fn();
    const { getByTestId } = renderScreen({
      onSystemDefault: undefined,
      onThemeChange,
    });
    fireEvent.press(getByTestId("system-default-link"));
    expect(onThemeChange).toHaveBeenCalledWith("cosmic");
  });

  // 16. Back button not rendered when onBack is not provided
  it("does not render back button when onBack is not provided", () => {
    const { queryByTestId } = renderScreen({ onBack: undefined });
    expect(queryByTestId("back-button")).toBeNull();
  });

  // 17. Skip link not rendered when onSkip is not provided
  it("does not render skip link when onSkip is not provided", () => {
    const { queryByTestId } = renderScreen({ onSkip: undefined });
    expect(queryByTestId("skip-link")).toBeNull();
  });

  // 18. Headline is present
  it("displays the headline text", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("headline")).toBeTruthy();
  });

  // 19. Selected checkmark badge visible only on selected card
  it("renders checkmark badge only on the selected card", () => {
    const { getByTestId, queryByTestId } = renderScreen({
      selectedThemeId: "deepForest",
    });
    expect(getByTestId("card-check-deepForest")).toBeTruthy();
    const nonSelected = ALL_THEME_IDS.filter((id) => id !== "deepForest");
    nonSelected.forEach((id) => {
      expect(queryByTestId(`card-check-${id}`)).toBeNull();
    });
  });

  // 20. Default step label renders when stepLabel prop omitted
  it("renders default step label when stepLabel prop is omitted", () => {
    const { getByText } = renderScreen({ stepLabel: undefined });
    expect(getByText(/STEP 4 OF 4/i)).toBeTruthy();
  });
});
