/**
 * AppIcon Component
 * @description Reusable icon component wrapping react-native-vector-icons/Ionicons
 *
 * @example
 * ```tsx
 * import { AppIcon } from '@/shared/components/atoms/display';
 *
 * <AppIcon name="heart-outline" size={20} color={colors.text.accent} />
 * ```
 */

import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { colors } from "@/shared/theme";

export interface AppIconProps {
  /** Ionicons icon name (e.g. "heart-outline", "home", "chevron-forward") */
  name: string;
  /** Icon size in density-independent pixels */
  size?: number;
  /** Icon color - defaults to theme primary text color */
  color?: string;
  /** Optional style applied to the icon container */
  style?: StyleProp<ViewStyle>;
}

/**
 * AppIcon wraps Ionicons with sensible defaults tied to the design system theme.
 * Use this component everywhere an icon is needed to ensure consistent sizing
 * and color token usage.
 */
export const AppIcon: React.FC<AppIconProps> = ({
  name,
  size = 24,
  color = colors.text.primary,
  style,
}) => {
  return <Icon name={name} size={size} color={color} style={style} />;
};
