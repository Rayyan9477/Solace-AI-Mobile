/**
 * ConcentricRings — nested SVG circles with theme-aware borders (prototype v4.2).
 *
 * Pure SVG decoration. No animation — place a BreathingOrb on top when pulsing
 * is desired. Used on Welcome (01), Onboarding (03), Breathing session (10),
 * Session Complete (32), and Empty State (40) screens.
 *
 * Each ring uses decreasing stroke opacity from outer (0.18) to inner (0.05)
 * so the visual radiates outward as depth.
 *
 * @example
 *   <ConcentricRings size={220} tint="aurora" rings={4}>
 *     <BreathingOrb size={80} />
 *   </ConcentricRings>
 */

import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { useTheme } from "@/shared/theme/useTheme";

export type ConcentricTint = "aurora" | "sage" | "lavender" | "peach";

export interface ConcentricRingsProps {
  /** Outer diameter in dp. Defaults to 220. */
  size?: number;
  /** Number of rings: 3-5. Defaults to 4. */
  rings?: number;
  /** Color family for the ring strokes. Defaults to "aurora". */
  tint?: ConcentricTint;
  /** Centered content (icon, score label, BreathingOrb, etc.). */
  children?: React.ReactNode;
  /** Optional outer style override. */
  style?: StyleProp<ViewStyle>;
  testID?: string;
  /** A11y label — if provided the element is announced as an image; otherwise hidden. */
  accessibilityLabel?: string;
}

/** Stroke opacities assigned from outermost ring inward. */
const RING_OPACITIES = [0.18, 0.12, 0.08, 0.05, 0.03] as const;

export function ConcentricRings({
  size = 220,
  rings = 4,
  tint = "aurora",
  children,
  style,
  testID,
  accessibilityLabel,
}: ConcentricRingsProps): React.ReactElement {
  const { palette } = useTheme();

  // Clamp rings to the supported 3-5 range.
  const ringCount = Math.min(5, Math.max(3, rings));

  // Derive the stroke color for each ring. We use two shades so it feels alive.
  const baseColor = palette[tint][300];
  const outerColor = palette[tint][500] ?? palette[tint][300];

  // The outermost ring fills the canvas; each inner ring steps inward by ringStep.
  const strokeWidth = Math.max(1, Math.round(size * 0.013));
  const padding = strokeWidth / 2;
  const outerRadius = size / 2 - padding;
  // Gap between consecutive ring radii so they don't overlap.
  const ringStep = (outerRadius - size * 0.1) / (ringCount - 1);

  const isAnnounced = !!accessibilityLabel;

  return (
    <View
      testID={testID}
      accessibilityRole={isAnnounced ? "image" : undefined}
      accessibilityLabel={accessibilityLabel}
      accessibilityElementsHidden={!isAnnounced}
      importantForAccessibility={isAnnounced ? "yes" : "no-hide-descendants"}
      style={[{ width: size, height: size }, styles.container, style]}
    >
      {/*
        The parent `View` above already carries `accessibilityElementsHidden`
        and `importantForAccessibility`, which is the authoritative gate.
        Re-passing those RN-only props to `Svg` is a no-op on native and a
        DOM-warning on web (react-native-svg spreads unknown props to the
        underlying `<svg>` element), so the inner `Svg` is left as-is.
      */}
      <Svg
        width={size}
        height={size}
        style={StyleSheet.absoluteFill}
      >
        {Array.from({ length: ringCount }, (_, i) => {
          const radius = outerRadius - i * ringStep;
          const opacity = RING_OPACITIES[i] ?? RING_OPACITIES[RING_OPACITIES.length - 1];
          // Alternate slightly between two hues for richer depth.
          const color = i % 2 === 0 ? outerColor : baseColor;
          return (
            <Circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={color}
              strokeOpacity={opacity}
              strokeWidth={strokeWidth}
              fill="none"
            />
          );
        })}
      </Svg>
      {children ? <View style={styles.center}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
