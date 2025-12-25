/**
 * Category Icons - Professional SVG icons for content categories
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

// Book/All Category Icon
export const BookIcon: React.FC<IconProps> = ({ size = 24, color = "#704A33", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Path
      d="M4 19.5A2.5 2.5 0 016.5 17H20"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M6.5 2H20V22H6.5A2.5 2.5 0 014 19.5V4.5A2.5 2.5 0 016.5 2Z"
      fill={color}
      fillOpacity="0.15"
      stroke={color}
      strokeWidth="1.5"
    />
    <Path d="M8 7H16" stroke={color} strokeWidth="1" strokeLinecap="round" />
    <Path d="M8 10H14" stroke={color} strokeWidth="1" strokeLinecap="round" />
  </Svg>
);
BookIcon.displayName = "BookIcon";

// Meditation Icon
export const MeditationIcon: React.FC<IconProps> = ({ size = 24, color = "#7D944D", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    {/* Person sitting */}
    <Circle cx="12" cy="5" r="2.5" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
    <Path
      d="M12 8V12"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Arms in meditation pose */}
    <Path
      d="M6 12C6 12 9 12 12 12C15 12 18 12 18 12"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Legs crossed */}
    <Path
      d="M8 20C8 20 10 16 12 16C14 16 16 20 16 20"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    <Path
      d="M5 18H9M15 18H19"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Svg>
);
MeditationIcon.displayName = "MeditationIcon";

// Breathing/Lungs Icon
export const BreathingIcon: React.FC<IconProps> = ({ size = 24, color = "#60A5FA", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    {/* Left lung */}
    <Path
      d="M8 8C6 10 5 14 6 18C7 20 8 20 9 20C10 20 10 19 10 17V8C10 6 9 4 8 4C7 4 8 6 8 8Z"
      fill={color}
      fillOpacity="0.2"
      stroke={color}
      strokeWidth="1.5"
    />
    {/* Right lung */}
    <Path
      d="M16 8C18 10 19 14 18 18C17 20 16 20 15 20C14 20 14 19 14 17V8C14 6 15 4 16 4C17 4 16 6 16 8Z"
      fill={color}
      fillOpacity="0.2"
      stroke={color}
      strokeWidth="1.5"
    />
    {/* Trachea */}
    <Path d="M12 2V8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M10 8H14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);
BreathingIcon.displayName = "BreathingIcon";

// Sleep Icon
export const SleepIcon: React.FC<IconProps> = ({ size = 24, color = "#5849A5", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    {/* Moon */}
    <Path
      d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
      fill={color}
      fillOpacity="0.3"
      stroke={color}
      strokeWidth="1.5"
    />
    {/* Zzz */}
    <Path d="M14 5H18L14 9H18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 1H19L16 4H19" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
SleepIcon.displayName = "SleepIcon";

// Wave/Stress Relief Icon
export const WaveIcon: React.FC<IconProps> = ({ size = 24, color = "#2DD4BF", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Path
      d="M2 12C4 10 6 10 8 12C10 14 12 14 14 12C16 10 18 10 20 12C22 14 24 14 26 12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <Path
      d="M2 16C4 14 6 14 8 16C10 18 12 18 14 16C16 14 18 14 20 16C22 18 24 18 26 16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
      opacity="0.5"
    />
    <Path
      d="M2 8C4 6 6 6 8 8C10 10 12 10 14 8C16 6 18 6 20 8C22 10 24 10 26 8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
      opacity="0.5"
    />
  </Svg>
);
WaveIcon.displayName = "WaveIcon";

// Headphones/Audio Icon
export const HeadphonesIcon: React.FC<IconProps> = ({ size = 24, color = "#8978F7", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Path
      d="M3 18V12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12V18"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    <Rect x="3" y="14" width="4" height="6" rx="2" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
    <Rect x="17" y="14" width="4" height="6" rx="2" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
  </Svg>
);
HeadphonesIcon.displayName = "HeadphonesIcon";

// Article/Document Icon
export const ArticleIcon: React.FC<IconProps> = ({ size = 24, color = "#704A33", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Rect x="4" y="2" width="16" height="20" rx="2" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" />
    <Path d="M8 6H16" stroke={color} strokeWidth="1" strokeLinecap="round" />
    <Path d="M8 10H16" stroke={color} strokeWidth="1" strokeLinecap="round" />
    <Path d="M8 14H12" stroke={color} strokeWidth="1" strokeLinecap="round" />
  </Svg>
);
ArticleIcon.displayName = "ArticleIcon";

// Video Icon
export const VideoIcon: React.FC<IconProps> = ({ size = 24, color = "#ED7E1C", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Rect x="2" y="4" width="20" height="16" rx="2" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" />
    <Path d="M10 8L16 12L10 16V8Z" fill={color} />
  </Svg>
);
VideoIcon.displayName = "VideoIcon";

// Brain/Mind Icon
export const BrainIcon: React.FC<IconProps> = ({ size = 24, color = "#8978F7", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    {/* Left hemisphere */}
    <Path
      d="M12 4C9 4 7 6 7 9C7 10 7 11 8 12C6 12 5 14 5 16C5 18 7 20 10 20H12V4Z"
      fill={color}
      fillOpacity="0.2"
      stroke={color}
      strokeWidth="1.5"
    />
    {/* Right hemisphere */}
    <Path
      d="M12 4C15 4 17 6 17 9C17 10 17 11 16 12C18 12 19 14 19 16C19 18 17 20 14 20H12V4Z"
      fill={color}
      fillOpacity="0.2"
      stroke={color}
      strokeWidth="1.5"
    />
    {/* Brain folds */}
    <Path d="M9 8C9 8 10 9 12 9" stroke={color} strokeWidth="1" strokeLinecap="round" />
    <Path d="M15 8C15 8 14 9 12 9" stroke={color} strokeWidth="1" strokeLinecap="round" />
    <Path d="M8 14C8 14 10 15 12 15" stroke={color} strokeWidth="1" strokeLinecap="round" />
    <Path d="M16 14C16 14 14 15 12 15" stroke={color} strokeWidth="1" strokeLinecap="round" />
  </Svg>
);
BrainIcon.displayName = "BrainIcon";

// Heart/Emotional Icon
export const HeartIcon: React.FC<IconProps> = ({ size = 24, color = "#EF4444", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Path
      d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z"
      fill={color}
      fillOpacity="0.3"
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);
HeartIcon.displayName = "HeartIcon";

// Peace/Solace Icon
export const PeaceIcon: React.FC<IconProps> = ({ size = 24, color = "#7D944D", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.15" />
    <Path d="M12 2V22" stroke={color} strokeWidth="1.5" />
    <Path d="M12 12L5 19" stroke={color} strokeWidth="1.5" />
    <Path d="M12 12L19 19" stroke={color} strokeWidth="1.5" />
  </Svg>
);
PeaceIcon.displayName = "PeaceIcon";

// Export mapping
export const CategoryIconMap = {
  book: BookIcon,
  meditation: MeditationIcon,
  breathing: BreathingIcon,
  sleep: SleepIcon,
  wave: WaveIcon,
  headphones: HeadphonesIcon,
  article: ArticleIcon,
  video: VideoIcon,
  brain: BrainIcon,
  heart: HeartIcon,
  peace: PeaceIcon,
};

export type CategoryType = keyof typeof CategoryIconMap;

export default {
  BookIcon,
  MeditationIcon,
  BreathingIcon,
  SleepIcon,
  WaveIcon,
  HeadphonesIcon,
  ArticleIcon,
  VideoIcon,
  BrainIcon,
  HeartIcon,
  PeaceIcon,
  CategoryIconMap,
};
