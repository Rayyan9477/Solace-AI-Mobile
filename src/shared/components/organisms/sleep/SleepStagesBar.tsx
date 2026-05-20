/**
 * SleepStagesBar — 4-segment horizontal bar showing sleep-stage breakdown.
 * (prototype v4.2, Sprint 5 — screen 11 Sleep dashboard)
 *
 * Renders proportional colored segments (awake / light / rem / deep) plus
 * optional labels underneath. Respects reduced-motion (no animation needed —
 * pure layout). Full a11y via accessibilityRole="progressbar".
 *
 * @example
 *   <SleepStagesBar
 *     stages={[
 *       { type: "awake", durationMinutes: 30 },
 *       { type: "light", durationMinutes: 90 },
 *       { type: "rem",   durationMinutes: 60 },
 *       { type: "deep",  durationMinutes: 120 },
 *     ]}
 *   />
 */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useTheme } from "@/shared/theme/useTheme";

export interface SleepStage {
  type: "awake" | "light" | "rem" | "deep";
  durationMinutes: number;
  /** Optional display label override. Falls back to type name. */
  label?: string;
}

export interface SleepStagesBarProps {
  stages: SleepStage[];
  /** Show small labels under each segment. Default true. */
  showLabels?: boolean;
  /** Bar height in dp. Default 12. */
  height?: number;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

export function SleepStagesBar({
  stages,
  showLabels = true,
  height = 12,
  testID,
  style,
}: SleepStagesBarProps): React.ReactElement {
  const { palette } = useTheme();

  const stageColorMap: Record<SleepStage["type"], string> = {
    awake: palette.peach[300],
    light: palette.aurora[300],
    rem: palette.lavender[300],
    deep: palette.sage[500],
  };

  const stageLabelMap: Record<SleepStage["type"], string> = {
    awake: "Awake",
    light: "Light",
    rem: "REM",
    deep: "Deep",
  };

  const total = stages.reduce((sum, s) => sum + s.durationMinutes, 0) || 1;

  const a11yLabel = stages
    .map((s) => `${s.durationMinutes} min ${s.label ?? stageLabelMap[s.type]}`)
    .join(", ");

  return (
    <View testID={testID} style={style}>
      {/* Segmented bar */}
      <View
        accessibilityRole="progressbar"
        accessibilityLabel={`Sleep stages: ${a11yLabel}`}
        style={[
          styles.track,
          {
            height,
            borderRadius: 999,
            backgroundColor: palette.midnight[700],
          },
        ]}
      >
        {stages.map((stage, i) => (
          <View
            key={`${stage.type}-${i}`}
            style={[
              styles.segment,
              {
                flex: stage.durationMinutes / total,
                backgroundColor: stageColorMap[stage.type],
                // Rounded ends on first and last segment
                borderTopLeftRadius: i === 0 ? 999 : 0,
                borderBottomLeftRadius: i === 0 ? 999 : 0,
                borderTopRightRadius: i === stages.length - 1 ? 999 : 0,
                borderBottomRightRadius: i === stages.length - 1 ? 999 : 0,
              },
            ]}
          />
        ))}
      </View>

      {/* Labels row */}
      {showLabels && (
        <View style={styles.labelsRow}>
          {stages.map((stage, i) => (
            <Text
              key={`label-${stage.type}-${i}`}
              style={[
                styles.label,
                {
                  flex: stage.durationMinutes / total,
                  color: stageColorMap[stage.type],
                },
              ]}
              numberOfLines={1}
            >
              {stage.label ?? stageLabelMap[stage.type]}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    textAlign: "center",
  },
  labelsRow: {
    flexDirection: "row",
    marginTop: 6,
  },
  segment: {
    height: "100%",
  },
  track: {
    flexDirection: "row",
    overflow: "hidden",
    width: "100%",
  },
});
