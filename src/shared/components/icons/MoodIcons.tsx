/**
 * Mood Icons - Professional SVG icons for mood tracking
 * Replaces emoji usage with clean, consistent SVG icons
 */

import React from "react";
import Svg, { Path, Circle, G } from "react-native-svg";
import { StyleProp, ViewStyle } from "react-native";

interface IconProps {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

// Helper to create circular face base
const FaceBase: React.FC<{ size: number; color: string; children: React.ReactNode }> = ({
  size,
  color,
  children,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="11" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" />
    {children}
  </Svg>
);

export const VeryHappyIcon: React.FC<IconProps> = ({ size = 24, color = "#FFD700", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Circle cx="12" cy="12" r="11" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5" />
    {/* Eyes */}
    <Path d="M8 9.5C8 9.5 8.5 8 10 8C11.5 8 12 9.5 12 9.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <Path d="M12 9.5C12 9.5 12.5 8 14 8C15.5 8 16 9.5 16 9.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    {/* Big smile */}
    <Path d="M7 14C7 14 9 18 12 18C15 18 17 14 17 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </Svg>
);
VeryHappyIcon.displayName = "VeryHappyIcon";

export const HappyIcon: React.FC<IconProps> = ({ size = 24, color = "#98B068", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Circle cx="12" cy="12" r="11" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5" />
    {/* Eyes */}
    <Circle cx="9" cy="10" r="1.5" fill={color} />
    <Circle cx="15" cy="10" r="1.5" fill={color} />
    {/* Smile */}
    <Path d="M8 15C8 15 10 17 12 17C14 17 16 15 16 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </Svg>
);
HappyIcon.displayName = "HappyIcon";

export const NeutralIcon: React.FC<IconProps> = ({ size = 24, color = "#928D88", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Circle cx="12" cy="12" r="11" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5" />
    {/* Eyes */}
    <Circle cx="9" cy="10" r="1.5" fill={color} />
    <Circle cx="15" cy="10" r="1.5" fill={color} />
    {/* Straight mouth */}
    <Path d="M8 15H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);
NeutralIcon.displayName = "NeutralIcon";

export const SadIcon: React.FC<IconProps> = ({ size = 24, color = "#60A5FA", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Circle cx="12" cy="12" r="11" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5" />
    {/* Eyes */}
    <Circle cx="9" cy="10" r="1.5" fill={color} />
    <Circle cx="15" cy="10" r="1.5" fill={color} />
    {/* Frown */}
    <Path d="M8 17C8 17 10 15 12 15C14 15 16 17 16 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </Svg>
);
SadIcon.displayName = "SadIcon";

export const VerySadIcon: React.FC<IconProps> = ({ size = 24, color = "#3B82F6", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Circle cx="12" cy="12" r="11" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5" />
    {/* Crying eyes */}
    <Circle cx="9" cy="9" r="1.5" fill={color} />
    <Circle cx="15" cy="9" r="1.5" fill={color} />
    {/* Tear drops */}
    <Path d="M9 12V14" stroke={color} strokeWidth="1" strokeLinecap="round" />
    <Path d="M15 12V14" stroke={color} strokeWidth="1" strokeLinecap="round" />
    {/* Deep frown */}
    <Path d="M7 18C7 18 9 14 12 14C15 14 17 18 17 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </Svg>
);
VerySadIcon.displayName = "VerySadIcon";

export const AnxiousIcon: React.FC<IconProps> = ({ size = 24, color = "#ED7E1C", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Circle cx="12" cy="12" r="11" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5" />
    {/* Wide worried eyes */}
    <Circle cx="9" cy="10" r="2" fill={color} />
    <Circle cx="15" cy="10" r="2" fill={color} />
    {/* Worried mouth */}
    <Path d="M8 16C8 16 10 14 12 16C14 14 16 16 16 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    {/* Sweat drop */}
    <Path d="M17 6L18 9L17 9.5L16 9L17 6Z" fill={color} fillOpacity="0.5" />
  </Svg>
);
AnxiousIcon.displayName = "AnxiousIcon";

export const AngryIcon: React.FC<IconProps> = ({ size = 24, color = "#EF4444", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Circle cx="12" cy="12" r="11" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5" />
    {/* Angry eyebrows */}
    <Path d="M6 8L10 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M18 8L14 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    {/* Eyes */}
    <Circle cx="9" cy="11" r="1.5" fill={color} />
    <Circle cx="15" cy="11" r="1.5" fill={color} />
    {/* Angry mouth */}
    <Path d="M8 16L12 15L16 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </Svg>
);
AngryIcon.displayName = "AngryIcon";

export const ExcitedIcon: React.FC<IconProps> = ({ size = 24, color = "#8978F7", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Circle cx="12" cy="12" r="11" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5" />
    {/* Star eyes */}
    <Path d="M9 10L8 8.5L7 10L8.5 10L9 8.5L9.5 10L8 10L9 10Z" fill={color} />
    <Path d="M15 10L14 8.5L13 10L14.5 10L15 8.5L15.5 10L14 10L15 10Z" fill={color} />
    {/* Wide open smile */}
    <Path d="M7 14C7 14 9 19 12 19C15 19 17 14 17 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </Svg>
);
ExcitedIcon.displayName = "ExcitedIcon";

export const TiredIcon: React.FC<IconProps> = ({ size = 24, color = "#736B66", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Circle cx="12" cy="12" r="11" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5" />
    {/* Sleepy closed eyes */}
    <Path d="M7 10H11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M13 10H17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    {/* Yawning mouth */}
    <Circle cx="12" cy="16" r="2" fill="none" stroke={color} strokeWidth="1.5" />
    {/* Zzz */}
    <Path d="M17 5L19 5L17 7L19 7" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
TiredIcon.displayName = "TiredIcon";

export const CalmIcon: React.FC<IconProps> = ({ size = 24, color = "#7D944D", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Circle cx="12" cy="12" r="11" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5" />
    {/* Closed peaceful eyes */}
    <Path d="M7 10C7 10 8.5 11 10 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <Path d="M14 10C14 10 15.5 11 17 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    {/* Gentle smile */}
    <Path d="M9 15C9 15 10.5 16 12 16C13.5 16 15 15 15 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </Svg>
);
CalmIcon.displayName = "CalmIcon";

// Export a mapping for easy lookup
export const MoodIconMap = {
  "very-happy": VeryHappyIcon,
  happy: HappyIcon,
  neutral: NeutralIcon,
  sad: SadIcon,
  "very-sad": VerySadIcon,
  anxious: AnxiousIcon,
  angry: AngryIcon,
  excited: ExcitedIcon,
  tired: TiredIcon,
  calm: CalmIcon,
};

export type MoodType = keyof typeof MoodIconMap;

export const getMoodIcon = (mood: MoodType | string): React.FC<IconProps> => {
  const normalizedMood = mood.toLowerCase().replace(/\s+/g, "-") as MoodType;
  return MoodIconMap[normalizedMood] || NeutralIcon;
};

export default {
  VeryHappyIcon,
  HappyIcon,
  NeutralIcon,
  SadIcon,
  VerySadIcon,
  AnxiousIcon,
  AngryIcon,
  ExcitedIcon,
  TiredIcon,
  CalmIcon,
  MoodIconMap,
  getMoodIcon,
};
