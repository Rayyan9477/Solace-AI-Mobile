/**
 * Cosmic primitives — theme-aware atoms used to compose every prototype-v4.2
 * screen. These are the building blocks that know ONLY about the design
 * system (theme tokens + react-native-svg + expo-blur + expo-linear-gradient)
 * and nothing about features.
 *
 * Sprint 1: MoodFace, BracketLabel
 * Sprint 2: BreathingOrb, SmokeBlob, AuroraHairline, StatBar,
 *           GlassCard, GlassAuroraCard, HeroCard, RingProgress
 * Sprint 5: ConcentricRings, StarField, ScoreRing, AvatarRing,
 *           WaveformBars, SkeletonShimmer, IconTile
 */

// Mood + editorial
export { MoodFace, MOOD_LABELS, MOOD_LEVELS } from "./MoodFace";
export type { MoodFaceProps, MoodLevel } from "./MoodFace";

export { BracketLabel } from "./BracketLabel";
export type { BracketLabelProps, BracketLabelVariant } from "./BracketLabel";

// Signature brand element
export { BreathingOrb } from "./BreathingOrb";
export type { BreathingOrbProps, OrbTint } from "./BreathingOrb";

// Ambient depth
export { SmokeBlob } from "./SmokeBlob";
export type { SmokeBlobProps, SmokeTint } from "./SmokeBlob";

// Dividers
export { AuroraHairline } from "./AuroraHairline";
export type { AuroraHairlineProps } from "./AuroraHairline";

// Progress
export { StatBar } from "./StatBar";
export type { StatBarProps, StatBarVariant } from "./StatBar";

export { RingProgress } from "./RingProgress";
export type { RingProgressProps, RingVariant } from "./RingProgress";

// Surfaces
export { GlassCard } from "./GlassCard";
export type { GlassCardProps, GlassVariant } from "./GlassCard";

export { GlassAuroraCard } from "./GlassAuroraCard";
export type { GlassAuroraCardProps } from "./GlassAuroraCard";

export { HeroCard } from "./HeroCard";
export type { HeroCardProps } from "./HeroCard";

// Sprint 5 — cosmic scene primitives
export { ConcentricRings } from "./ConcentricRings";
export type { ConcentricRingsProps, ConcentricTint } from "./ConcentricRings";

export { StarField } from "./StarField";
export type { StarFieldProps } from "./StarField";

export { ScoreRing } from "./ScoreRing";
export type { ScoreRingProps } from "./ScoreRing";

export { AvatarRing } from "./AvatarRing";
export type { AvatarRingProps, AvatarRingVariant } from "./AvatarRing";

// Sprint 5 — voice, loading, icon utilities
export { WaveformBars } from "./WaveformBars";
export type { WaveformBarsProps } from "./WaveformBars";

export { SkeletonShimmer } from "./SkeletonShimmer";
export type { SkeletonShimmerProps } from "./SkeletonShimmer";

export { IconTile } from "./IconTile";
export type { IconTileProps, IconTileHue } from "./IconTile";

// Sprint 5 — chart primitives
export { LineChart } from "./LineChart";
export type { LineChartProps, LineChartPoint } from "./LineChart";

export { BarChart } from "./BarChart";
export type { BarChartProps, BarChartBar } from "./BarChart";

export { ScatterPlot } from "./ScatterPlot";
export type { ScatterPlotProps, ScatterPoint } from "./ScatterPlot";

export { HeatmapGrid } from "./HeatmapGrid";
export type { HeatmapGridProps, HeatmapCell } from "./HeatmapGrid";
