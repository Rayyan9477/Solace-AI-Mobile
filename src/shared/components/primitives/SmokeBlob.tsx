/**
 * SmokeBlob — ambient radial-gradient blob (prototype v4.2)
 *
 * Ports `.smoke` from `prototypes/lib/base.css`:
 *   background: radial-gradient(ellipse 60% 80% at 40% 40%, rgba(var(--ch-aurora),0.2), transparent 60%);
 *   filter: blur(40px);
 *
 * A Draper-inspired ethereal blob used behind hero surfaces (Welcome,
 * Splash, Voice session, Crisis). Decorative — never announced by SR.
 *
 * RN has no native radial gradient and no filter: blur on arbitrary views, so
 * we composite the effect with `react-native-svg` RadialGradient. The SVG
 * fill itself produces a soft falloff; an additional outer opacity tapers
 * the edge for the "smoke" feel without needing a true blur pass.
 *
 * @example
 *   <View>
 *     <SmokeBlob size={320} tint="aurora" opacity={0.6} style={{ top: -40, left: -40 }} />
 *     <HeroContent />
 *   </View>
 */

import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import Svg, {
  Defs,
  Ellipse,
  RadialGradient as SvgRadialGradient,
  Stop,
} from "react-native-svg";

import { useTheme } from "@/shared/theme/useTheme";

export type SmokeTint = "aurora" | "sage" | "peach" | "lavender";

export interface SmokeBlobProps {
  /** Diameter of the blob container in dp. Defaults to 280. */
  size?: number;
  /** Which cosmic hue to use for the soft center. Defaults to aurora. */
  tint?: SmokeTint;
  /** 0-1 — peak opacity at the blob's center. Defaults to 0.2 (subtle). */
  opacity?: number;
  /** Positioning style (absolute offsets etc.) */
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function SmokeBlob({
  size = 280,
  tint = "aurora",
  opacity = 0.2,
  style,
  testID,
}: SmokeBlobProps): React.ReactElement {
  const { palette } = useTheme();
  const tintHex = TINT_PALETTE[tint](palette);
  const gradientId = `smoke-${tint}-${size}`;

  return (
    <View
      testID={testID}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ width: size, height: size }, style]}
    >
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Defs>
          <SvgRadialGradient
            id={gradientId}
            cx="40%"
            cy="40%"
            rx="60%"
            ry="80%"
          >
            <Stop offset="0%" stopColor={tintHex} stopOpacity={opacity} />
            <Stop offset="50%" stopColor={tintHex} stopOpacity={opacity * 0.35} />
            <Stop offset="80%" stopColor={tintHex} stopOpacity={0} />
          </SvgRadialGradient>
        </Defs>
        <Ellipse
          cx={size / 2}
          cy={size / 2}
          rx={size / 2}
          ry={size / 2}
          fill={`url(#${gradientId})`}
        />
      </Svg>
    </View>
  );
}

const TINT_PALETTE: Readonly<Record<SmokeTint, (p: any) => string>> = {
  aurora: (p) => p.aurora[500],
  sage: (p) => p.sage[300],
  peach: (p) => p.peach[300],
  lavender: (p) => p.lavender[300],
};
