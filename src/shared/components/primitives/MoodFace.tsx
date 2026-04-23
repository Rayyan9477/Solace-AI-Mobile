/**
 * MoodFace — 5-level therapeutic mood character (prototype v4.2)
 *
 * Ported 1:1 from `prototypes/lib/helpers.js` — same gradients, same eye/mouth
 * geometry, same inset highlight giving the face a physical, lit-from-above
 * quality. Used wherever the app asks "how are you right now?" — home check-in,
 * mood tracker, journal composer, daily check-in, session summary.
 *
 * Never use system emoji; never use a Lucide icon. This IS the brand mood glyph.
 *
 * @example
 *   <MoodFace level={4} size={60} />                    // Content, 60px
 *   <MoodFace level={1} size={130} />                    // Struggling, 130px
 *   <MoodFace level={3} size={40} selected interactive/> // radio-style element
 */

import React from "react";
import { View, StyleSheet, type AccessibilityRole } from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Line,
  Path,
  Stop,
} from "react-native-svg";

export type MoodLevel = 1 | 2 | 3 | 4 | 5;

interface FaceDef {
  label: string;
  gradient: readonly [string, string];
  renderFeatures: (stroke: string) => React.ReactNode;
}

/**
 * The 5 mood definitions — exact gradients and eye/mouth paths from the
 * prototype source. Do NOT tweak without updating prototypes/lib/helpers.js;
 * this glyph is a brand asset and must stay in sync across web + native.
 */
const FACES: Record<MoodLevel, FaceDef> = {
  5: {
    label: "Overjoyed",
    gradient: ["#F4A77E", "#E88B5A"], // peach-300 → peach-500
    renderFeatures: (stroke) => (
      <>
        <Circle cx={35} cy={42} r={4} fill={stroke} />
        <Circle cx={65} cy={42} r={4} fill={stroke} />
        <Path
          d="M30 58 Q50 78 70 58"
          stroke={stroke}
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
        />
      </>
    ),
  },
  4: {
    label: "Content",
    gradient: ["#9BC4B0", "#7AAA94"], // sage-300 → sage-500
    renderFeatures: (stroke) => (
      <>
        <Circle cx={36} cy={44} r={3.5} fill={stroke} />
        <Circle cx={64} cy={44} r={3.5} fill={stroke} />
        <Path
          d="M35 60 Q50 70 65 60"
          stroke={stroke}
          strokeWidth={3.5}
          fill="none"
          strokeLinecap="round"
        />
      </>
    ),
  },
  3: {
    label: "Neutral",
    gradient: ["#C7BEA9", "#8B95A8"], // warm-200 → warm-400
    renderFeatures: (stroke) => (
      <>
        <Circle cx={36} cy={44} r={3.5} fill={stroke} />
        <Circle cx={64} cy={44} r={3.5} fill={stroke} />
        <Line
          x1={35}
          y1={65}
          x2={65}
          y2={65}
          stroke={stroke}
          strokeWidth={3.5}
          strokeLinecap="round"
        />
      </>
    ),
  },
  2: {
    label: "Down",
    gradient: ["#A89AE0", "#8B7CC8"], // lavender-300 → lavender-500
    renderFeatures: (stroke) => (
      <>
        <Path
          d="M32 46 Q36 42 40 46"
          stroke={stroke}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M60 46 Q64 42 68 46"
          stroke={stroke}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M35 68 Q50 58 65 68"
          stroke={stroke}
          strokeWidth={3.5}
          fill="none"
          strokeLinecap="round"
        />
      </>
    ),
  },
  1: {
    label: "Struggling",
    gradient: ["#6B5BA8", "#3A4255"], // deep lavender → midnight
    renderFeatures: (stroke) => (
      <>
        <Line
          x1={32}
          y1={46}
          x2={40}
          y2={46}
          stroke={stroke}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <Line
          x1={60}
          y1={46}
          x2={68}
          y2={46}
          stroke={stroke}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <Path
          d="M32 70 Q50 58 68 70"
          stroke={stroke}
          strokeWidth={3.5}
          fill="none"
          strokeLinecap="round"
        />
        {/* Tear — subtle, lavender, never bright */}
        <Circle cx={76} cy={62} r={2.5} fill="#A89AE0" />
      </>
    ),
  },
};

export interface MoodFaceProps {
  /** Mood level 1–5 (1 = Struggling, 5 = Overjoyed) */
  level: MoodLevel;
  /** Diameter in dp. Defaults to 72. */
  size?: number;
  /** When true, mark as `selected` — interactive consumers show a ring outside. */
  selected?: boolean;
  /**
   * When true, announce as a `button` and expect external Pressable wrapping.
   * Without this, the glyph is a purely decorative `image` role.
   */
  interactive?: boolean;
  /** Override the default "<Label> mood" accessibility label */
  accessibilityLabel?: string;
}

export function MoodFace({
  level,
  size = 72,
  selected = false,
  interactive = false,
  accessibilityLabel,
}: MoodFaceProps): React.ReactElement {
  const face = FACES[level];
  const innerSize = size * 0.9;
  const role: AccessibilityRole = interactive ? "button" : "image";
  const label = accessibilityLabel ?? `${face.label} mood`;
  const gradientId = `moodFace-grad-${level}`;

  return (
    <View
      accessibilityRole={role}
      accessibilityLabel={label}
      accessibilityState={interactive ? { selected } : undefined}
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          <SvgLinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={face.gradient[0]} />
            <Stop offset="1" stopColor={face.gradient[1]} />
          </SvgLinearGradient>
        </Defs>
        <Circle cx={50} cy={50} r={50} fill={`url(#${gradientId})`} />
        {/* Inner highlight — very subtle lit-from-above effect */}
        <Circle
          cx={50}
          cy={42}
          r={48}
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth={0.5}
        />
      </Svg>
      <Svg width={innerSize} height={innerSize} viewBox="0 0 100 100">
        {face.renderFeatures("#040818")}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});

/** Exported for consumers that need to iterate the mood levels (e.g. radio groups). */
export const MOOD_LEVELS: readonly MoodLevel[] = [1, 2, 3, 4, 5];

/** Exported so screens can read the label without instantiating the component. */
export const MOOD_LABELS: Readonly<Record<MoodLevel, string>> = {
  1: FACES[1].label,
  2: FACES[2].label,
  3: FACES[3].label,
  4: FACES[4].label,
  5: FACES[5].label,
};
