/**
 * PaywallScreen Tests — prototype v4.2 #38
 * Covers: render, snapshot, copy, feature rows, plan cards,
 * selection state, callbacks, a11y, 44pt touch targets.
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import {
  PaywallScreen,
  DEFAULT_FEATURES,
  DEFAULT_PLANS,
  type PaywallScreenProps,
} from "./PaywallScreen";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const baseProps: PaywallScreenProps = {
  selectedPlanId: "annual",
  onPlanChange: jest.fn(),
  onClose: jest.fn(),
  onStartTrial: jest.fn(),
  onTermsPress: jest.fn(),
  onPrivacyPress: jest.fn(),
};

function renderScreen(overrides: Partial<PaywallScreenProps> = {}) {
  return render(<PaywallScreen {...baseProps} {...overrides} />);
}

beforeEach(() => jest.clearAllMocks());

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("PaywallScreen", () => {
  // 1. Render
  it("renders without crashing", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("paywall-screen")).toBeTruthy();
  });

  // 2. Snapshot
  it("matches snapshot", () => {
    const tree = renderScreen();
    expect(tree.toJSON()).toMatchSnapshot();
  });

  // 3. Bracket "SOLACE PLUS" present
  it('renders the "[ SOLACE PLUS ]" bracket label', () => {
    const { getByText } = renderScreen();
    expect(getByText("[ SOLACE PLUS ]")).toBeTruthy();
  });

  // 4. Title "Your fullest practice" present
  it('renders the title containing "Your fullest"', () => {
    const { getByText } = renderScreen();
    // React Native nests Text, getByText with exact=false matches partial content
    expect(getByText(/Your fullest/)).toBeTruthy();
  });

  it('renders "practice" in the title', () => {
    const { getByText } = renderScreen();
    expect(getByText("practice")).toBeTruthy();
  });

  // 5. All 5 default feature labels render
  it("renders all 5 default feature labels", () => {
    const { getByText } = renderScreen();
    for (const feature of DEFAULT_FEATURES) {
      expect(getByText(feature.label)).toBeTruthy();
    }
  });

  // 6. Both plan cards render
  it("renders both plan cards", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("plan-card-annual")).toBeTruthy();
    expect(getByTestId("plan-card-monthly")).toBeTruthy();
  });

  // 7. Annual plan is selected by default
  it("annual plan card has accessibilityState selected=true when selectedPlanId='annual'", () => {
    const { getByTestId } = renderScreen({ selectedPlanId: "annual" });
    const annualCard = getByTestId("plan-card-annual");
    expect(annualCard.props.accessibilityState).toEqual(
      expect.objectContaining({ selected: true }),
    );
  });

  it("monthly plan card has accessibilityState selected=false when selectedPlanId='annual'", () => {
    const { getByTestId } = renderScreen({ selectedPlanId: "annual" });
    const monthlyCard = getByTestId("plan-card-monthly");
    expect(monthlyCard.props.accessibilityState).toEqual(
      expect.objectContaining({ selected: false }),
    );
  });

  // 8. Tapping monthly plan calls onPlanChange("monthly")
  it("calls onPlanChange('monthly') when monthly plan card is pressed", () => {
    const onPlanChange = jest.fn();
    const { getByTestId } = renderScreen({ onPlanChange });
    fireEvent.press(getByTestId("plan-card-monthly"));
    expect(onPlanChange).toHaveBeenCalledWith("monthly");
    expect(onPlanChange).toHaveBeenCalledTimes(1);
  });

  // 9. Selected plan shows accessibilityState={{ selected: true }}
  it("selected plan (monthly) shows accessibilityState selected=true", () => {
    const { getByTestId } = renderScreen({ selectedPlanId: "monthly" });
    const monthlyCard = getByTestId("plan-card-monthly");
    expect(monthlyCard.props.accessibilityState).toEqual(
      expect.objectContaining({ selected: true }),
    );
  });

  // 10. Annual plan shows the SAVE 60% badge
  it('annual plan shows the "SAVE 60%" badge', () => {
    const { getByText } = renderScreen();
    expect(getByText("SAVE 60%")).toBeTruthy();
  });

  // 11. Start free trial CTA testID="start-trial-button"
  it("start-trial-button testID is present", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("start-trial-button")).toBeTruthy();
  });

  // 12. CTA press calls onStartTrial
  it("pressing start-trial-button calls onStartTrial", () => {
    const onStartTrial = jest.fn();
    const { getByTestId } = renderScreen({ onStartTrial });
    fireEvent.press(getByTestId("start-trial-button"));
    expect(onStartTrial).toHaveBeenCalledTimes(1);
  });

  // 13. Close button calls onClose
  it("pressing close button calls onClose", () => {
    const onClose = jest.fn();
    const { getByTestId } = renderScreen({ onClose });
    fireEvent.press(getByTestId("close-button"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // 14. CTA accessibilityLabel + role
  it("start-trial-button has accessibilityRole='button'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("start-trial-button").props.accessibilityRole).toBe(
      "button",
    );
  });

  it("start-trial-button has accessibilityLabel='Start free trial'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("start-trial-button").props.accessibilityLabel).toBe(
      "Start free trial",
    );
  });

  // 15. CTA 44pt minimum
  it("start-trial-button meets 44pt minimum touch target", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("start-trial-button");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawStyle: any = btn.props.style;
    const flatStyle = Array.isArray(rawStyle)
      ? Object.assign({}, ...rawStyle)
      : rawStyle ?? {};
    expect(flatStyle.minHeight).toBeGreaterThanOrEqual(44);
  });

  // 16. onTermsPress / onPrivacyPress invoked when their links are tapped
  it("tapping Terms link calls onTermsPress", () => {
    const onTermsPress = jest.fn();
    const { getByTestId } = renderScreen({ onTermsPress });
    fireEvent.press(getByTestId("terms-link"));
    expect(onTermsPress).toHaveBeenCalledTimes(1);
  });

  it("tapping Privacy link calls onPrivacyPress", () => {
    const onPrivacyPress = jest.fn();
    const { getByTestId } = renderScreen({ onPrivacyPress });
    fireEvent.press(getByTestId("privacy-link"));
    expect(onPrivacyPress).toHaveBeenCalledTimes(1);
  });

  // 17. Custom features prop overrides defaults
  it("custom features prop overrides default feature list", () => {
    const customFeatures = [
      { id: "custom-1", label: "Custom Feature One" },
      { id: "custom-2", label: "Custom Feature Two" },
    ];
    const { getByText, queryByText } = renderScreen({
      features: customFeatures,
    });
    expect(getByText("Custom Feature One")).toBeTruthy();
    expect(getByText("Custom Feature Two")).toBeTruthy();
    // Default features should not appear
    expect(queryByText("Unlimited AI conversations")).toBeNull();
  });

  // Additional: plan accessibilityRole="radio"
  it("plan cards have accessibilityRole='radio'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("plan-card-annual").props.accessibilityRole).toBe(
      "radio",
    );
    expect(getByTestId("plan-card-monthly").props.accessibilityRole).toBe(
      "radio",
    );
  });

  // Additional: subtitle present
  it('renders the subtitle "Unlock everything Solace can offer"', () => {
    const { getByText } = renderScreen();
    expect(getByText("Unlock everything Solace can offer")).toBeTruthy();
  });

  // Additional: custom plans prop
  it("custom plans prop overrides default plans", () => {
    const customPlans = [
      { id: "annual" as const, bracket: "YEARLY", price: "$39.99/year" },
    ];
    const { getByText, queryByTestId } = renderScreen({ plans: customPlans });
    expect(getByText("[ YEARLY ]")).toBeTruthy();
    expect(queryByTestId("plan-card-monthly")).toBeNull();
  });
});
