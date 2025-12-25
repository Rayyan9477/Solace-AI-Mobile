/**
 * MentalHealthIcon Component
 * Wrapper for mental health related icons using react-native-vector-icons
 * Provides consistent icon usage across the app with mental health themes
 */

import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

/**
 * Icon mapping for mental health related icons
 * Maps semantic names to actual icon library icons
 */
const ICON_MAP = {
  // Mental Health Specific
  Brain: { library: MaterialCommunityIcons, name: "brain" },
  Heart: { library: Ionicons, name: "heart" },
  Therapy: { library: MaterialCommunityIcons, name: "account-heart" },
  Journal: { library: MaterialCommunityIcons, name: "book-open-page-variant" },
  Meditation: { library: MaterialCommunityIcons, name: "meditation" },

  // Navigation
  Home: { library: Ionicons, name: "home" },
  ArrowBack: { library: Ionicons, name: "arrow-back" },
  ArrowForward: { library: Ionicons, name: "arrow-forward" },
  Close: { library: Ionicons, name: "close" },
  Menu: { library: Ionicons, name: "menu" },
  ChevronLeft: { library: Ionicons, name: "chevron-back" },
  ChevronRight: { library: Ionicons, name: "chevron-forward" },
  ChevronUp: { library: Ionicons, name: "chevron-up" },
  ChevronDown: { library: Ionicons, name: "chevron-down" },
  Search: { library: Ionicons, name: "search" },

  // Actions
  Add: { library: Ionicons, name: "add" },
  Edit: { library: Ionicons, name: "create" },
  Delete: { library: Ionicons, name: "trash" },
  Save: { library: Ionicons, name: "save" },
  Share: { library: Ionicons, name: "share-social" },
  Send: { library: Ionicons, name: "send" },
  Mic: { library: Ionicons, name: "mic" },
  Eye: { library: Ionicons, name: "eye" },
  EyeOff: { library: Ionicons, name: "eye-off" },
  Lock: { library: Ionicons, name: "lock-closed" },

  // Status
  CheckCircle: { library: Ionicons, name: "checkmark-circle" },
  Warning: { library: Ionicons, name: "warning" },
  Info: { library: Ionicons, name: "information-circle" },
  Error: { library: Ionicons, name: "close-circle" },

  // Mood/Emotions
  Happy: { library: MaterialCommunityIcons, name: "emoticon-happy" },
  Sad: { library: MaterialCommunityIcons, name: "emoticon-sad" },
  Neutral: { library: MaterialCommunityIcons, name: "emoticon-neutral" },
  Anxious: { library: MaterialCommunityIcons, name: "emoticon-confused" },

  // Settings
  Settings: { library: Ionicons, name: "settings" },
  Profile: { library: Ionicons, name: "person" },
  Notifications: { library: Ionicons, name: "notifications" },

  // Communication
  Chat: { library: Ionicons, name: "chatbubbles" },
  Call: { library: Ionicons, name: "call" },
  Mail: { library: Ionicons, name: "mail" },

  // Time
  Calendar: { library: Ionicons, name: "calendar" },
  Clock: { library: Ionicons, name: "time" },

  // Default fallback
  Default: { library: MaterialCommunityIcons, name: "help-circle" },
};

/**
 * Icon name type - all valid icon names
 */
type IconName = keyof typeof ICON_MAP;

/**
 * MentalHealthIcon Props
 */
interface MentalHealthIconProps {
  name: IconName | string;
  size?: number;
  color?: string;
  variant?: 'filled' | 'outline';
  style?: StyleProp<ViewStyle>;
  [key: string]: any;
}

/**
 * MentalHealthIcon Component
 *
 * @param name - Semantic icon name from ICON_MAP
 * @param size - Icon size in pixels (default: 24)
 * @param color - Icon color (default: '#000000')
 * @param variant - Icon variant: 'filled', 'outline' (default: 'filled')
 * @param style - Additional styles
 */
const MentalHealthIcon: React.FC<MentalHealthIconProps> = ({
  name,
  size = 24,
  color = "#000000",
  variant = "filled",
  style,
  ...props
}) => {
  // Get icon config or use default
  const iconConfig = ICON_MAP[name] || ICON_MAP.Default;
  const IconComponent = iconConfig.library;

  // Handle outline variant for supported icons
  let iconName = iconConfig.name;
  if (variant === "outline" && iconName && !iconName.includes("-outline")) {
    iconName = `${iconName}-outline`;
  }

  return (
    <IconComponent
      name={iconName}
      size={size}
      color={color}
      style={style}
      {...props}
    />
  );
};

MentalHealthIcon.displayName = 'MentalHealthIcon';

export default MentalHealthIcon;
export { MentalHealthIcon, ICON_MAP };
export type { MentalHealthIconProps, IconName };
