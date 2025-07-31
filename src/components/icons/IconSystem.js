import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, Circle, Rect, Line, Polyline, Polygon } from 'react-native-svg';
import { useTheme } from '../../contexts/ThemeContext';
import { colors } from '../../styles/theme';

// Icon size presets
export const IconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
  '2xl': 48,
  '3xl': 56,
  '4xl': 64,
};

// Icon variants for mental health app
export const IconVariants = {
  OUTLINE: 'outline',
  FILLED: 'filled',
  DUOTONE: 'duotone',
  ROUNDED: 'rounded',
};

// Mental Health specific icon components
const MentalHealthIcons = {
  // Core mental health icons
  brain: (props) => (
    <Svg viewBox="0 0 24 24" {...props}>
      <Path
        d="M12 2C8.5 2 6 4.5 6 8c0 1.5.5 3 1.5 4.5L12 22l4.5-9.5C17.5 11 18 9.5 18 8c0-3.5-2.5-6-6-6z"
        fill={props.variant === IconVariants.FILLED ? props.color : 'none'}
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle
        cx="12"
        cy="8"
        r="3"
        fill={props.variant === IconVariants.FILLED ? props.color : 'none'}
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
      />
    </Svg>
  ),

  heart: (props) => (
    <Svg viewBox="0 0 24 24" {...props}>
      <Path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill={props.variant === IconVariants.FILLED ? props.color : 'none'}
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),

  mindfulness: (props) => (
    <Svg viewBox="0 0 24 24" {...props}>
      <Circle
        cx="12"
        cy="12"
        r="10"
        fill={props.variant === IconVariants.FILLED ? props.color + '20' : 'none'}
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
      />
      <Circle
        cx="12"
        cy="12"
        r="6"
        fill={props.variant === IconVariants.FILLED ? props.color + '40' : 'none'}
        stroke={props.color}
        strokeWidth={props.strokeWidth || 1.5}
      />
      <Circle
        cx="12"
        cy="12"
        r="2"
        fill={props.color}
      />
    </Svg>
  ),

  therapy: (props) => (
    <Svg viewBox="0 0 24 24" {...props}>
      <Path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        fill={props.variant === IconVariants.FILLED ? props.color : 'none'}
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="9" cy="9" r="2" fill={props.color} />
      <Circle cx="15" cy="9" r="2" fill={props.color} />
      <Path
        d="M8 13c1 1 3 1 4 0s3-1 4 0"
        fill="none"
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
      />
    </Svg>
  ),

  mood: (props) => (
    <Svg viewBox="0 0 24 24" {...props}>
      <Circle
        cx="12"
        cy="12"
        r="10"
        fill={props.variant === IconVariants.FILLED ? props.color : 'none'}
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
      />
      <Path
        d="M8 14s1.5 2 4 2 4-2 4-2"
        fill="none"
        stroke={props.variant === IconVariants.FILLED ? colors.background.primary : props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
      />
      <Line
        x1="9"
        y1="9"
        x2="9.01"
        y2="9"
        stroke={props.variant === IconVariants.FILLED ? colors.background.primary : props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
      />
      <Line
        x1="15"
        y1="9"
        x2="15.01"
        y2="9"
        stroke={props.variant === IconVariants.FILLED ? colors.background.primary : props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
      />
    </Svg>
  ),

  // UI Icons
  home: (props) => (
    <Svg viewBox="0 0 24 24" {...props}>
      <Path
        d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
        fill={props.variant === IconVariants.FILLED ? props.color : 'none'}
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Polyline
        points="9,22 9,12 15,12 15,22"
        fill={props.variant === IconVariants.FILLED ? colors.background.primary : 'none'}
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),

  chat: (props) => (
    <Svg viewBox="0 0 24 24" {...props}>
      <Path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
        fill={props.variant === IconVariants.FILLED ? props.color : 'none'}
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),

  assessment: (props) => (
    <Svg viewBox="0 0 24 24" {...props}>
      <Path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        fill={props.variant === IconVariants.FILLED ? props.color : 'none'}
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Polyline
        points="14,2 14,8 20,8"
        fill="none"
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line
        x1="16"
        y1="13"
        x2="8"
        y2="13"
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
      />
      <Line
        x1="16"
        y1="17"
        x2="8"
        y2="17"
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
      />
      <Polyline
        points="10,9 9,9 8,9"
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
      />
    </Svg>
  ),

  profile: (props) => (
    <Svg viewBox="0 0 24 24" {...props}>
      <Path
        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
        fill="none"
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle
        cx="12"
        cy="7"
        r="4"
        fill={props.variant === IconVariants.FILLED ? props.color : 'none'}
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
      />
    </Svg>
  ),

  settings: (props) => (
    <Svg viewBox="0 0 24 24" {...props}>
      <Circle
        cx="12"
        cy="12"
        r="3"
        fill={props.variant === IconVariants.FILLED ? props.color : 'none'}
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
      />
      <Path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
        fill="none"
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),

  // Action icons
  plus: (props) => (
    <Svg viewBox="0 0 24 24" {...props}>
      <Line
        x1="12"
        y1="5"
        x2="12"
        y2="19"
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
      />
      <Line
        x1="5"
        y1="12"
        x2="19"
        y2="12"
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
      />
    </Svg>
  ),

  chevronRight: (props) => (
    <Svg viewBox="0 0 24 24" {...props}>
      <Polyline
        points="9,18 15,12 9,6"
        fill="none"
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),

  chevronDown: (props) => (
    <Svg viewBox="0 0 24 24" {...props}>
      <Polyline
        points="6,9 12,15 18,9"
        fill="none"
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),

  close: (props) => (
    <Svg viewBox="0 0 24 24" {...props}>
      <Line
        x1="18"
        y1="6"
        x2="6"
        y2="18"
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
      />
      <Line
        x1="6"
        y1="6"
        x2="18"
        y2="18"
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
      />
    </Svg>
  ),

  // Status icons
  check: (props) => (
    <Svg viewBox="0 0 24 24" {...props}>
      <Polyline
        points="20,6 9,17 4,12"
        fill="none"
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),

  alert: (props) => (
    <Svg viewBox="0 0 24 24" {...props}>
      <Path
        d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
        fill={props.variant === IconVariants.FILLED ? props.color : 'none'}
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line
        x1="12"
        y1="9"
        x2="12"
        y2="13"
        stroke={props.variant === IconVariants.FILLED ? colors.background.primary : props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
      />
      <Line
        x1="12"
        y1="17"
        x2="12.01"
        y2="17"
        stroke={props.variant === IconVariants.FILLED ? colors.background.primary : props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
      />
    </Svg>
  ),

  info: (props) => (
    <Svg viewBox="0 0 24 24" {...props}>
      <Circle
        cx="12"
        cy="12"
        r="10"
        fill={props.variant === IconVariants.FILLED ? props.color : 'none'}
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
      />
      <Line
        x1="12"
        y1="16"
        x2="12"
        y2="12"
        stroke={props.variant === IconVariants.FILLED ? colors.background.primary : props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
      />
      <Line
        x1="12"
        y1="8"
        x2="12.01"
        y2="8"
        stroke={props.variant === IconVariants.FILLED ? colors.background.primary : props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
      />
    </Svg>
  ),

  // Therapeutic specific icons
  meditation: (props) => (
    <Svg viewBox="0 0 24 24" {...props}>
      <Circle
        cx="12"
        cy="8"
        r="4"
        fill={props.variant === IconVariants.FILLED ? props.color : 'none'}
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
      />
      <Path
        d="M8 14s-2 3-2 7h12c0-4-2-7-2-7"
        fill={props.variant === IconVariants.FILLED ? props.color : 'none'}
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 14l-2-2M18 14l2-2"
        fill="none"
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
      />
    </Svg>
  ),

  journal: (props) => (
    <Svg viewBox="0 0 24 24" {...props}>
      <Path
        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
        fill="none"
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
        fill={props.variant === IconVariants.FILLED ? props.color : 'none'}
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line
        x1="10"
        y1="7"
        x2="16"
        y2="7"
        stroke={props.variant === IconVariants.FILLED ? colors.background.primary : props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
      />
      <Line
        x1="10"
        y1="11"
        x2="16"
        y2="11"
        stroke={props.variant === IconVariants.FILLED ? colors.background.primary : props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
      />
    </Svg>
  ),

  insights: (props) => (
    <Svg viewBox="0 0 24 24" {...props}>
      <Polyline
        points="22,12 18,12 15,21 9,3 6,12 2,12"
        fill="none"
        stroke={props.color}
        strokeWidth={props.strokeWidth || 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
};

// Main Icon component
const Icon = ({
  name,
  size = 'md',
  color,
  variant = IconVariants.OUTLINE,
  strokeWidth = 2,
  style,
  ...props
}) => {
  const { theme } = useTheme();
  
  // Get size value
  const iconSize = typeof size === 'number' ? size : IconSizes[size];
  
  // Get color
  const iconColor = color || theme.colors.text.primary;
  
  // Get icon component
  const IconComponent = MentalHealthIcons[name];
  
  if (!IconComponent) {
    // Fallback for unknown icons
    return (
      <View
        style={[
          {
            width: iconSize,
            height: iconSize,
            backgroundColor: theme.colors.gray[200],
            borderRadius: 4,
            justifyContent: 'center',
            alignItems: 'center',
          },
          style,
        ]}
      >
        <Text style={{ fontSize: iconSize * 0.3, color: theme.colors.text.secondary }}>
          ?
        </Text>
      </View>
    );
  }
  
  return (
    <View style={[{ width: iconSize, height: iconSize }, style]}>
      <IconComponent
        width={iconSize}
        height={iconSize}
        color={iconColor}
        variant={variant}
        strokeWidth={strokeWidth}
        {...props}
      />
    </View>
  );
};

export default Icon;
export { MentalHealthIcons, IconVariants, IconSizes };