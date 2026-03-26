/**
 * OnboardingIllustration Component
 * @description Branded circular illustration for each onboarding step.
 *
 * Renders three concentric circles with a themed Ionicons icon at the centre.
 * All colours come from the app's design-system palette — no external SVG
 * library required.
 *
 * Usage:
 * ```tsx
 * <OnboardingIllustration step={1} size={220} />
 * ```
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
/** Convert hex + alpha to rgba string without external dependency. */
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OnboardingIllustrationProps {
  /** Which onboarding step to render (1–5). */
  step: 1 | 2 | 3 | 4 | 5;
  /** Diameter of the outermost circle. Defaults to 220. */
  size?: number;
}

// ---------------------------------------------------------------------------
// Step configuration
// ---------------------------------------------------------------------------

interface StepConfig {
  /** Base hex colour for this step. */
  color: string;
  /** Ionicons icon name. */
  icon: string;
  /** Accessible label for the illustration. */
  label: string;
}

const STEP_CONFIG: Record<1 | 2 | 3 | 4 | 5, StepConfig> = {
  1: {
    color: "#6B7B3A", // palette.onboarding.step1 – olive green
    icon: "person-outline",
    label: "Personalise your mental health with AI",
  },
  2: {
    color: "#E8853A", // palette.onboarding.step2 – orange
    icon: "heart-outline",
    label: "Intelligent mood tracking",
  },
  3: {
    color: "#5B8A9A", // teal-shifted variant of step3 gray for visual richness
    icon: "journal-outline",
    label: "AI mental journaling",
  },
  4: {
    color: "#C4A535", // palette.onboarding.step4 – gold
    icon: "leaf-outline",
    label: "Mindful resources",
  },
  5: {
    color: "#7B68B5", // palette.onboarding.step5 – purple
    icon: "people-outline",
    label: "Loving and supportive community",
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * OnboardingIllustration
 *
 * Three concentric circles centred on a theme colour with a matching icon:
 *   - Outer ring  → 40 % opacity fill
 *   - Middle ring → 60 % opacity fill
 *   - Inner disc  → solid fill with the icon
 */
export function OnboardingIllustration({
  step,
  size = 220,
}: OnboardingIllustrationProps): React.ReactElement {
  const { color, icon, label } = STEP_CONFIG[step];

  // Derived sizes — keep proportions regardless of `size` prop.
  const outerSize = size;
  const middleSize = size * 0.7;
  const innerSize = size * 0.4;
  const iconSize = innerSize * 0.52;

  return (
    <View
      style={[styles.root, { width: outerSize, height: outerSize }]}
      accessibilityLabel={label}
      accessibilityRole="image"
    >
      {/* Outer circle — 40 % opacity */}
      <View
        style={[
          styles.circle,
          {
            width: outerSize,
            height: outerSize,
            borderRadius: outerSize / 2,
            backgroundColor: hexToRgba(color, 0.4),
          },
        ]}
      />

      {/* Middle circle — 60 % opacity */}
      <View
        style={[
          styles.circle,
          styles.centred,
          {
            width: middleSize,
            height: middleSize,
            borderRadius: middleSize / 2,
            backgroundColor: hexToRgba(color, 0.6),
          },
        ]}
      />

      {/* Inner disc — solid + icon */}
      <View
        style={[
          styles.circle,
          styles.centred,
          styles.innerDisc,
          {
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
            backgroundColor: color,
          },
        ]}
      >
        <Icon name={icon} size={iconSize} color="#FFFFFF" />
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    position: "absolute",
  },
  centred: {
    // Centred inside the root View via absolute positioning + auto-margin.
    // Works because alignItems/justifyContent on the parent centres the
    // absolute children relative to the root bounds.
    alignSelf: "center",
  },
  innerDisc: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default OnboardingIllustration;
