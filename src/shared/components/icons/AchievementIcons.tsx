/**
 * Achievement Icons - Professional SVG icons for achievements and badges
 * Replaces emoji usage with clean, consistent SVG icons
 */

import React from "react";
import Svg, { Path, Circle, G, Rect, Polygon } from "react-native-svg";
import { StyleProp, ViewStyle } from "react-native";

interface IconProps {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

// Target/First Steps Icon
export const TargetIcon: React.FC<IconProps> = ({ size = 24, color = "#704A33", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" fill="none" />
    <Circle cx="12" cy="12" r="6" stroke={color} strokeWidth="1.5" fill="none" />
    <Circle cx="12" cy="12" r="2" fill={color} />
  </Svg>
);
TargetIcon.displayName = "TargetIcon";

// Fire/Streak Icon
export const FireIcon: React.FC<IconProps> = ({ size = 24, color = "#ED7E1C", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Path
      d="M12 2C12 2 8 6 8 10C8 12 9 14 12 15C10 13 10 11 12 8C14 11 14 13 12 15C15 14 16 12 16 10C16 6 12 2 12 2Z"
      fill={color}
      fillOpacity="0.3"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <Path
      d="M12 22C8 22 6 18 6 15C6 12 8 10 12 10C16 10 18 12 18 15C18 18 16 22 12 22Z"
      fill={color}
      fillOpacity="0.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </Svg>
);
FireIcon.displayName = "FireIcon";

// Clock/Hour Icon
export const ClockIcon: React.FC<IconProps> = ({ size = 24, color = "#6B5FC8", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" fill="none" />
    <Path d="M12 6V12L16 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
ClockIcon.displayName = "ClockIcon";

// Sun/Morning Icon
export const SunIcon: React.FC<IconProps> = ({ size = 24, color = "#FFB014", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Circle cx="12" cy="12" r="5" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
    <Path d="M12 2V4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M12 20V22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M4 12H2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M22 12H20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M5.64 5.64L6.7 6.7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M17.3 17.3L18.36 18.36" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M5.64 18.36L6.7 17.3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M17.3 6.7L18.36 5.64" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);
SunIcon.displayName = "SunIcon";

// Meditation/Lotus Icon
export const LotusIcon: React.FC<IconProps> = ({ size = 24, color = "#7D944D", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    {/* Center petal */}
    <Path
      d="M12 4C12 4 10 8 10 12C10 16 12 20 12 20C12 20 14 16 14 12C14 8 12 4 12 4Z"
      fill={color}
      fillOpacity="0.3"
      stroke={color}
      strokeWidth="1"
    />
    {/* Left petal */}
    <Path
      d="M4 12C4 12 8 10 12 12C16 14 20 12 20 12C20 12 16 14 12 14C8 14 4 12 4 12Z"
      fill={color}
      fillOpacity="0.3"
      stroke={color}
      strokeWidth="1"
    />
    {/* Right side petals */}
    <Path
      d="M6 6C6 6 8 10 12 12C12 12 10 8 6 6Z"
      fill={color}
      fillOpacity="0.2"
      stroke={color}
      strokeWidth="1"
    />
    <Path
      d="M18 6C18 6 16 10 12 12C12 12 14 8 18 6Z"
      fill={color}
      fillOpacity="0.2"
      stroke={color}
      strokeWidth="1"
    />
  </Svg>
);
LotusIcon.displayName = "LotusIcon";

// Strength/Flexed Arm Icon
export const StrengthIcon: React.FC<IconProps> = ({ size = 24, color = "#C96100", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Path
      d="M8 20V16C8 14 10 12 12 12C14 12 16 10 16 8V4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <Path
      d="M12 12C12 12 16 12 18 14C20 16 20 20 20 20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <Circle cx="16" cy="6" r="2" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
  </Svg>
);
StrengthIcon.displayName = "StrengthIcon";

// Moon/Evening Icon
export const MoonIcon: React.FC<IconProps> = ({ size = 24, color = "#5849A5", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Path
      d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
      fill={color}
      fillOpacity="0.3"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Stars */}
    <Circle cx="19" cy="6" r="0.5" fill={color} />
    <Circle cx="21" cy="9" r="0.5" fill={color} />
  </Svg>
);
MoonIcon.displayName = "MoonIcon";

// Crown/Legendary Icon
export const CrownIcon: React.FC<IconProps> = ({ size = 24, color = "#FFB014", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Path
      d="M3 18H21V20H3V18Z"
      fill={color}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M4 18L6 10L12 14L18 10L20 18H4Z"
      fill={color}
      fillOpacity="0.3"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="6" r="2" fill={color} fillOpacity="0.5" stroke={color} strokeWidth="1" />
    <Circle cx="6" cy="8" r="1.5" fill={color} fillOpacity="0.5" stroke={color} strokeWidth="1" />
    <Circle cx="18" cy="8" r="1.5" fill={color} fillOpacity="0.5" stroke={color} strokeWidth="1" />
  </Svg>
);
CrownIcon.displayName = "CrownIcon";

// Star Icon
export const StarIcon: React.FC<IconProps> = ({ size = 24, color = "#FFB014", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill={color}
      fillOpacity="0.3"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </Svg>
);
StarIcon.displayName = "StarIcon";

// Trophy Icon
export const TrophyIcon: React.FC<IconProps> = ({ size = 24, color = "#FFB014", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Path
      d="M8 21H16V19H8V21Z"
      fill={color}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12 19V15"
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7 3H17V11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11V3Z"
      fill={color}
      fillOpacity="0.3"
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7 7H4V9C4 10.66 5.34 12 7 12V7Z"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M17 7H20V9C20 10.66 18.66 12 17 12V7Z"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);
TrophyIcon.displayName = "TrophyIcon";

// Export mapping
export const AchievementIconMap = {
  target: TargetIcon,
  fire: FireIcon,
  clock: ClockIcon,
  sun: SunIcon,
  lotus: LotusIcon,
  strength: StrengthIcon,
  moon: MoonIcon,
  crown: CrownIcon,
  star: StarIcon,
  trophy: TrophyIcon,
};

export type AchievementType = keyof typeof AchievementIconMap;

export default {
  TargetIcon,
  FireIcon,
  ClockIcon,
  SunIcon,
  LotusIcon,
  StrengthIcon,
  MoonIcon,
  CrownIcon,
  StarIcon,
  TrophyIcon,
  AchievementIconMap,
};
