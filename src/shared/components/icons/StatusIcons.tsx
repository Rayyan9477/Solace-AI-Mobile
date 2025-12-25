/**
 * Status Icons - Professional SVG icons for status and feedback
 * Replaces emoji usage with clean, consistent SVG icons
 */

import React from "react";
import Svg, { Path, Circle, G, Rect, Line } from "react-native-svg";
import { StyleProp, ViewStyle } from "react-native";

interface IconProps {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

// Checkmark/Success Icon
export const CheckIcon: React.FC<IconProps> = ({ size = 24, color = "#7D944D", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Circle cx="12" cy="12" r="10" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" />
    <Path d="M8 12L11 15L16 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);
CheckIcon.displayName = "CheckIcon";

// Celebration/Confetti Icon
export const CelebrationIcon: React.FC<IconProps> = ({ size = 24, color = "#FFB014", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    {/* Confetti cone */}
    <Path
      d="M4 22L8 12L14 18L4 22Z"
      fill={color}
      fillOpacity="0.3"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Confetti pieces */}
    <Circle cx="16" cy="8" r="1.5" fill={color} />
    <Circle cx="12" cy="5" r="1" fill="#8978F7" />
    <Circle cx="19" cy="12" r="1" fill="#ED7E1C" />
    <Rect x="14" y="3" width="2" height="2" fill="#7D944D" transform="rotate(45 15 4)" />
    <Rect x="18" cy="6" width="2" height="2" fill="#60A5FA" transform="rotate(30 19 7)" />
    <Path d="M10 8L12 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M16 14L18 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);
CelebrationIcon.displayName = "CelebrationIcon";

// Sparkle Icon
export const SparkleIcon: React.FC<IconProps> = ({ size = 24, color = "#FFB014", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    {/* Main sparkle */}
    <Path
      d="M12 2L14 8L20 10L14 12L12 18L10 12L4 10L10 8L12 2Z"
      fill={color}
      fillOpacity="0.3"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Small sparkles */}
    <Path d="M18 4L19 6L21 5L19 6L18 8L17 6L15 5L17 6L18 4Z" fill={color} stroke={color} strokeWidth="0.5" />
    <Path d="M5 16L6 18L8 17L6 18L5 20L4 18L2 17L4 18L5 16Z" fill={color} stroke={color} strokeWidth="0.5" />
  </Svg>
);
SparkleIcon.displayName = "SparkleIcon";

// Party Icon
export const PartyIcon: React.FC<IconProps> = ({ size = 24, color = "#8978F7", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    {/* Party popper */}
    <Path
      d="M3 20L5 14L10 19L3 20Z"
      fill={color}
      fillOpacity="0.3"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Streamers */}
    <Path d="M8 12C8 12 10 8 14 6" stroke="#FFB014" strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M10 15C10 15 14 12 18 11" stroke="#7D944D" strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M6 10C6 10 8 6 12 4" stroke="#ED7E1C" strokeWidth="1.5" strokeLinecap="round" />
    {/* Dots */}
    <Circle cx="16" cy="4" r="1.5" fill="#FFB014" />
    <Circle cx="20" cy="8" r="1" fill="#7D944D" />
    <Circle cx="18" cy="14" r="1.5" fill={color} />
    <Circle cx="14" cy="8" r="1" fill="#ED7E1C" />
  </Svg>
);
PartyIcon.displayName = "PartyIcon";

// Star Glow Icon
export const StarGlowIcon: React.FC<IconProps> = ({ size = 24, color = "#FFB014", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    {/* Outer glow */}
    <Circle cx="12" cy="12" r="10" fill={color} fillOpacity="0.1" />
    {/* Star */}
    <Path
      d="M12 4L13.7 9.5H19.5L14.9 13L16.5 18.5L12 15L7.5 18.5L9.1 13L4.5 9.5H10.3L12 4Z"
      fill={color}
      fillOpacity="0.3"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </Svg>
);
StarGlowIcon.displayName = "StarGlowIcon";

// Warning/Alert Icon
export const WarningIcon: React.FC<IconProps> = ({ size = 24, color = "#FFB014", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Path
      d="M12 3L22 20H2L12 3Z"
      fill={color}
      fillOpacity="0.15"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <Path d="M12 9V13" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="12" cy="17" r="1" fill={color} />
  </Svg>
);
WarningIcon.displayName = "WarningIcon";

// Error/Cross Icon
export const ErrorIcon: React.FC<IconProps> = ({ size = 24, color = "#EF4444", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Circle cx="12" cy="12" r="10" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" />
    <Path d="M8 8L16 16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M16 8L8 16" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);
ErrorIcon.displayName = "ErrorIcon";

// Info Icon
export const InfoIcon: React.FC<IconProps> = ({ size = 24, color = "#60A5FA", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Circle cx="12" cy="12" r="10" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" />
    <Circle cx="12" cy="7" r="1" fill={color} />
    <Path d="M12 10V17" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);
InfoIcon.displayName = "InfoIcon";

// Progress/Loading Icon
export const ProgressIcon: React.FC<IconProps> = ({ size = 24, color = "#704A33", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" strokeOpacity="0.3" fill="none" />
    <Path
      d="M12 2C17.52 2 22 6.48 22 12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
  </Svg>
);
ProgressIcon.displayName = "ProgressIcon";

// Trend Up Icon
export const TrendUpIcon: React.FC<IconProps> = ({ size = 24, color = "#7D944D", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Path
      d="M3 17L9 11L13 15L21 7"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path d="M17 7H21V11" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);
TrendUpIcon.displayName = "TrendUpIcon";

// Self-Care Icon
export const SelfCareIcon: React.FC<IconProps> = ({ size = 24, color = "#7D944D", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    {/* Spa/lotus base */}
    <Circle cx="12" cy="18" r="4" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5" />
    {/* Leaf elements */}
    <Path
      d="M12 14C12 14 8 10 8 6C8 2 12 2 12 2C12 2 16 2 16 6C16 10 12 14 12 14Z"
      fill={color}
      fillOpacity="0.3"
      stroke={color}
      strokeWidth="1.5"
    />
    <Path d="M12 2V14" stroke={color} strokeWidth="1" />
  </Svg>
);
SelfCareIcon.displayName = "SelfCareIcon";

// Export mapping
export const StatusIconMap = {
  check: CheckIcon,
  celebration: CelebrationIcon,
  sparkle: SparkleIcon,
  party: PartyIcon,
  starGlow: StarGlowIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
  progress: ProgressIcon,
  trendUp: TrendUpIcon,
  selfCare: SelfCareIcon,
};

export type StatusType = keyof typeof StatusIconMap;

export default {
  CheckIcon,
  CelebrationIcon,
  SparkleIcon,
  PartyIcon,
  StarGlowIcon,
  WarningIcon,
  ErrorIcon,
  InfoIcon,
  ProgressIcon,
  TrendUpIcon,
  SelfCareIcon,
  StatusIconMap,
};
