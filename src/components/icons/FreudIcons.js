/**
 * FreudIcons Component System
 * Mental health focused icon library based on Freud Design System
 * Includes Healthtech, General UI, Arrows & Directions icons
 */

import React from "react";
import Svg, {
  Path,
  Circle,
  Rect,
  Line,
  Polyline,
  Ellipse,
  Polygon,
} from "react-native-svg";

import { freudTheme } from "../../shared/theme/freudTheme";

// Base Icon Component
const FreudIcon = ({
  size = 24,
  color = freudTheme.colors.text.primary,
  strokeWidth = 2,
  children,
  ...props
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    {children}
  </Svg>
);

// Mental Health & Wellness Icons
export const BrainIcon = ({
  size = 24,
  color = freudTheme.colors.text.primary,
  strokeWidth = 2,
}) => (
  <FreudIcon size={size} color={color}>
    <Path
      d="M9.5 2C8.96 2 8.42 2.1 7.92 2.3C6.92 2.7 6.1 3.5 5.7 4.5C5.3 5.5 5.4 6.6 5.9 7.5L8 11.5L6.5 13.5C6.1 14.1 6 14.8 6.2 15.5C6.4 16.2 6.9 16.7 7.5 17C8.1 17.3 8.8 17.3 9.5 17C10.2 16.7 10.7 16.1 10.8 15.4L11 14L13 12L15 14L15.2 15.4C15.3 16.1 15.8 16.7 16.5 17C17.2 17.3 17.9 17.3 18.5 17C19.1 16.7 19.6 16.2 19.8 15.5C20 14.8 19.9 14.1 19.5 13.5L18 11.5L20.1 7.5C20.6 6.6 20.7 5.5 20.3 4.5C19.9 3.5 19.1 2.7 18.1 2.3C17.6 2.1 17.04 2 16.5 2C15.5 2 14.6 2.4 13.9 3.1L12 5L10.1 3.1C9.4 2.4 8.5 2 7.5 2H9.5Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </FreudIcon>
);

export const HeartIcon = ({
  size = 24,
  color = freudTheme.colors.text.primary,
  strokeWidth = 2,
}) => (
  <FreudIcon size={size} color={color}>
    <Path
      d="M20.84 4.61C20.32 4.09 19.69 3.68 19 3.41C18.31 3.14 17.58 3 16.84 3C16.1 3 15.37 3.14 14.68 3.41C13.99 3.68 13.36 4.09 12.84 4.61L12 5.45L11.16 4.61C10.12 3.57 8.69 3 7.16 3C5.63 3 4.2 3.57 3.16 4.61C2.12 5.65 1.55 7.08 1.55 8.61C1.55 10.14 2.12 11.57 3.16 12.61L12 21.45L20.84 12.61C21.88 11.57 22.45 10.14 22.45 8.61C22.45 7.08 21.88 5.65 20.84 4.61Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </FreudIcon>
);

export const MindfulnessIcon = ({
  size = 24,
  color = freudTheme.colors.text.primary,
  strokeWidth = 2,
}) => (
  <FreudIcon size={size} color={color}>
    <Circle
      cx="12"
      cy="12"
      r="10"
      stroke={color}
      strokeWidth={strokeWidth}
      fill="none"
    />
    <Circle
      cx="12"
      cy="12"
      r="6"
      stroke={color}
      strokeWidth={strokeWidth}
      fill="none"
    />
    <Circle
      cx="12"
      cy="12"
      r="2"
      stroke={color}
      strokeWidth={strokeWidth}
      fill="none"
    />
    <Path
      d="M12 2L12 6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M12 18L12 22"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M22 12L18 12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M6 12L2 12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </FreudIcon>
);

export const TherapyIcon = ({
  size = 24,
  color = freudTheme.colors.text.primary,
  strokeWidth = 2,
}) => (
  <FreudIcon size={size} color={color}>
    <Rect
      x="3"
      y="8"
      width="18"
      height="13"
      rx="2"
      ry="2"
      stroke={color}
      strokeWidth={strokeWidth}
      fill="none"
    />
    <Path
      d="M8 21V16C8 15.4 8.4 15 9 15H15C15.6 15 16 15.4 16 16V21"
      stroke={color}
      strokeWidth={strokeWidth}
      fill="none"
    />
    <Path
      d="M8 8V6C8 3.8 9.8 2 12 2C14.2 2 16 3.8 16 6V8"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <Circle cx="12" cy="11" r="1" fill={color} />
  </FreudIcon>
);

export const MeditationIcon = ({
  size = 24,
  color = freudTheme.colors.text.primary,
  strokeWidth = 2,
}) => (
  <FreudIcon size={size} color={color}>
    <Circle
      cx="12"
      cy="8"
      r="4"
      stroke={color}
      strokeWidth={strokeWidth}
      fill="none"
    />
    <Path
      d="M8 14C8 14 8 18 12 18C16 18 16 14 16 14"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M6 14L6 16C6 17.1 6.9 18 8 18"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M18 14L18 16C18 17.1 17.1 18 16 18"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Circle cx="9" cy="9" r="1" fill={color} />
    <Circle cx="15" cy="9" r="1" fill={color} />
  </FreudIcon>
);

export const JournalIcon = ({
  size = 24,
  color = freudTheme.colors.text.primary,
  strokeWidth = 2,
}) => (
  <FreudIcon size={size} color={color}>
    <Rect
      x="4"
      y="2"
      width="16"
      height="20"
      rx="2"
      ry="2"
      stroke={color}
      strokeWidth={strokeWidth}
      fill="none"
    />
    <Line
      x1="8"
      y1="6"
      x2="16"
      y2="6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Line
      x1="8"
      y1="10"
      x2="16"
      y2="10"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Line
      x1="8"
      y1="14"
      x2="13"
      y2="14"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </FreudIcon>
);

export const InsightsIcon = ({
  size = 24,
  color = freudTheme.colors.text.primary,
  strokeWidth = 2,
}) => (
  <FreudIcon size={size} color={color}>
    <Path
      d="M3 17L9 11L13 15L21 7"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21 7L16 7L16 12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="9" cy="11" r="1" fill={color} />
    <Circle cx="13" cy="15" r="1" fill={color} />
    <Circle cx="3" cy="17" r="1" fill={color} />
    <Circle cx="21" cy="7" r="1" fill={color} />
  </FreudIcon>
);

// Navigation Icons
export const HomeIcon = ({
  size = 24,
  color = freudTheme.colors.text.primary,
  strokeWidth = 2,
  filled = false,
}) => (
  <FreudIcon size={size} color={color}>
    <Path
      d="M3 9L12 2L21 9V20C21 20.5 20.8 21 20.4 21.4C20 21.8 19.5 22 19 22H5C4.5 22 4 21.8 3.6 21.4C3.2 21 3 20.5 3 20V9Z"
      stroke={color}
      strokeWidth={strokeWidth}
      fill={filled ? color : "none"}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 22V12H15V22"
      stroke={color}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </FreudIcon>
);

export const ChatIcon = ({
  size = 24,
  color = freudTheme.colors.text.primary,
  strokeWidth = 2,
  filled = false,
}) => (
  <FreudIcon size={size} color={color}>
    <Path
      d="M21 15C21 15.5 20.8 16 20.4 16.4C20 16.8 19.5 17 19 17H7L3 21V5C3 4.5 3.2 4 3.6 3.6C4 3.2 4.5 3 5 3H19C19.5 3 20 3.2 20.4 3.6C20.8 4 21 4.5 21 5V15Z"
      stroke={color}
      strokeWidth={strokeWidth}
      fill={filled ? color : "none"}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </FreudIcon>
);

export const MoodIcon = ({
  size = 24,
  color = freudTheme.colors.text.primary,
  strokeWidth = 2,
  filled = false,
}) => (
  <FreudIcon size={size} color={color}>
    <Circle
      cx="12"
      cy="12"
      r="10"
      stroke={color}
      strokeWidth={strokeWidth}
      fill={filled ? color : "none"}
    />
    <Path
      d="M8 14S9.5 16 12 16S16 14 16 14"
      stroke={filled ? "white" : color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line
      x1="9"
      y1="9"
      x2="9.01"
      y2="9"
      stroke={filled ? "white" : color}
      strokeWidth={strokeWidth + 1}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line
      x1="15"
      y1="9"
      x2="15.01"
      y2="9"
      stroke={filled ? "white" : color}
      strokeWidth={strokeWidth + 1}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </FreudIcon>
);

export const AssessmentIcon = ({
  size = 24,
  color = freudTheme.colors.text.primary,
  strokeWidth = 2,
  filled = false,
}) => (
  <FreudIcon size={size} color={color}>
    <Rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
      ry="2"
      stroke={color}
      strokeWidth={strokeWidth}
      fill={filled ? color : "none"}
    />
    <Path
      d="M9 9L11 11L15 7"
      stroke={filled ? "white" : color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </FreudIcon>
);

export const ProfileIcon = ({
  size = 24,
  color = freudTheme.colors.text.primary,
  strokeWidth = 2,
  filled = false,
}) => (
  <FreudIcon size={size} color={color}>
    <Path
      d="M20 21V19C20 17.9 19.6 16.8 18.8 16C18 15.2 16.9 14.8 15.8 14.8H8.2C7.1 14.8 6 15.2 5.2 16C4.4 16.8 4 17.9 4 19V21"
      stroke={color}
      strokeWidth={strokeWidth}
      fill="none"
    />
    <Circle
      cx="12"
      cy="7"
      r="4"
      stroke={color}
      strokeWidth={strokeWidth}
      fill={filled ? color : "none"}
    />
  </FreudIcon>
);

// Action Icons
export const PlusIcon = ({
  size = 24,
  color = freudTheme.colors.text.primary,
  strokeWidth = 2,
}) => (
  <FreudIcon size={size} color={color}>
    <Line
      x1="12"
      y1="5"
      x2="12"
      y2="19"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Line
      x1="5"
      y1="12"
      x2="19"
      y2="12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </FreudIcon>
);

export const ChevronRightIcon = ({
  size = 24,
  color = freudTheme.colors.text.primary,
  strokeWidth = 2,
}) => (
  <FreudIcon size={size} color={color}>
    <Polyline
      points="9,18 15,12 9,6"
      stroke={color}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </FreudIcon>
);

export const ChevronLeftIcon = ({
  size = 24,
  color = freudTheme.colors.text.primary,
  strokeWidth = 2,
}) => (
  <FreudIcon size={size} color={color}>
    <Polyline
      points="15,18 9,12 15,6"
      stroke={color}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </FreudIcon>
);

export const SearchIcon = ({
  size = 24,
  color = freudTheme.colors.text.primary,
  strokeWidth = 2,
}) => (
  <FreudIcon size={size} color={color}>
    <Circle
      cx="11"
      cy="11"
      r="8"
      stroke={color}
      strokeWidth={strokeWidth}
      fill="none"
    />
    <Path
      d="M21 21L16.65 16.65"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </FreudIcon>
);

export const SettingsIcon = ({
  size = 24,
  color = freudTheme.colors.text.primary,
  strokeWidth = 2,
}) => (
  <FreudIcon size={size} color={color}>
    <Circle
      cx="12"
      cy="12"
      r="3"
      stroke={color}
      strokeWidth={strokeWidth}
      fill="none"
    />
    <Path
      d="M19.4 15C19.2 15.4 19.1 15.7 19 16.1L20.4 17.1C20.6 17.3 20.7 17.6 20.6 17.9L19.6 19.9C19.5 20.2 19.2 20.3 18.9 20.2L17.3 19.6C17 19.8 16.6 20 16.2 20.1L16 21.8C16 22.1 15.8 22.3 15.5 22.3H13.5C13.2 22.3 13 22.1 13 21.8L12.8 20.1C12.4 20 12 19.8 11.7 19.6L10.1 20.2C9.8 20.3 9.5 20.2 9.4 19.9L8.4 17.9C8.3 17.6 8.4 17.3 8.6 17.1L10 16.1C9.9 15.7 9.8 15.4 9.6 15L8 14.4C7.7 14.3 7.5 14 7.5 13.7V11.7C7.5 11.4 7.7 11.1 8 11L9.6 10.4C9.8 10 9.9 9.6 10 9.3L8.6 8.3C8.4 8.1 8.3 7.8 8.4 7.5L9.4 5.5C9.5 5.2 9.8 5.1 10.1 5.2L11.7 5.8C12 5.6 12.4 5.4 12.8 5.3L13 3.6C13 3.3 13.2 3.1 13.5 3.1H15.5C15.8 3.1 16 3.3 16 3.6L16.2 5.3C16.6 5.4 17 5.6 17.3 5.8L18.9 5.2C19.2 5.1 19.5 5.2 19.6 5.5L20.6 7.5C20.7 7.8 20.6 8.1 20.4 8.3L19 9.3C19.1 9.7 19.2 10 19.4 10.4L21 11C21.3 11.1 21.5 11.4 21.5 11.7V13.7C21.5 14 21.3 14.3 21 14.4L19.4 15Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </FreudIcon>
);

// Freud Logo Component
export const FreudLogo = ({
  size = 48,
  primaryColor = freudTheme.colors.brown[80],
}) => (
  <FreudIcon size={size} color={primaryColor}>
    <Circle cx="12" cy="6" r="3" fill={primaryColor} />
    <Circle cx="6" cy="12" r="3" fill={primaryColor} />
    <Circle cx="18" cy="12" r="3" fill={primaryColor} />
    <Circle cx="12" cy="18" r="3" fill={primaryColor} />
    <Circle cx="12" cy="12" r="1.5" fill={primaryColor} />
  </FreudIcon>
);

// Icon wrapper with theme support
export const ThemedFreudIcon = ({
  name,
  variant = "outline",
  size = 24,
  color,
  ...props
}) => {
  const iconColor = color || freudTheme.colors.text.primary;
  const filled = variant === "filled";

  const icons = {
    brain: BrainIcon,
    heart: HeartIcon,
    mindfulness: MindfulnessIcon,
    therapy: TherapyIcon,
    meditation: MeditationIcon,
    journal: JournalIcon,
    insights: InsightsIcon,
    home: HomeIcon,
    chat: ChatIcon,
    mood: MoodIcon,
    assessment: AssessmentIcon,
    profile: ProfileIcon,
    plus: PlusIcon,
    "chevron-right": ChevronRightIcon,
    "chevron-left": ChevronLeftIcon,
    search: SearchIcon,
    settings: SettingsIcon,
    logo: FreudLogo,
  };

  const IconComponent = icons[name];

  if (!IconComponent) {
    console.warn(`FreudIcon: Icon "${name}" not found`);
    return null;
  }

  return (
    <IconComponent size={size} color={iconColor} filled={filled} {...props} />
  );
};

export default ThemedFreudIcon;
