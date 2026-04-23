/**
 * Cosmic primitives — theme-aware atoms used to compose every prototype-v4.2
 * screen. These are the building blocks that know ONLY about the design
 * system (theme tokens + react-native-svg + expo-blur + expo-linear-gradient)
 * and nothing about features.
 *
 * Sprint 1: MoodFace, BracketLabel
 * Sprint 2: BreathingOrb, SmokeBlob, AuroraHairline, StatBar,
 *           GlassCard, GlassAuroraCard, HeroCard, RingProgress
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
