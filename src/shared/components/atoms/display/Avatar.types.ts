/**
 * Avatar Component Types
 * @description Type definitions for the Avatar component
 * @task Task 2.2.3: Avatar Component
 */

import type { ViewStyle, ImageSourcePropType } from "react-native";

/**
 * Avatar size type
 */
export type AvatarSize = "sm" | "md" | "lg" | "xl";

/**
 * Avatar status type for online indicators
 */
export type AvatarStatus = "online" | "offline" | "away" | "busy";

/**
 * Avatar component props
 */
export interface AvatarProps {
  /** Image source for avatar */
  source?: ImageSourcePropType;

  /** Name for generating initials fallback */
  name?: string;

  /** Avatar size */
  size?: AvatarSize;

  /** Online status indicator */
  status?: AvatarStatus;

  /** Show status indicator */
  showStatus?: boolean;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label for screen readers */
  accessibilityLabel?: string;

  /** Additional styles */
  style?: ViewStyle;
}
