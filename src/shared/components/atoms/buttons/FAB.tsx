/**
 * FAB (Floating Action Button) Component
 * @description Reusable floating action button with animated press feedback
 * @phase Phase 3C: Shared atom to eliminate duplicated FAB implementations
 *
 * Replaces duplicated inline FAB code in:
 * - MoodDashboardScreen (positioned absolute, bottom-right)
 * - JournalDashboardScreen (inline within hero section)
 *
 * Features:
 * - Animated scale-down press effect via Pressable
 * - Ionicons icon (defaults to "add")
 * - Configurable size, background color, and icon color
 * - applyShadow('md') from shared theme
 * - Full accessibility support
 * - Accepts arbitrary style overrides for positioning
 */

import React from "react";
import {
  Pressable,
  StyleSheet,
  type ViewStyle,
  type StyleProp,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/Ionicons";
import { applyShadow } from "../../../theme/shadows";
import { palette } from "../../../theme";
import { useHaptic } from "../../../hooks/useHaptic";

/**
 * Props for the FAB component
 */
export interface FABProps {
  /** Callback invoked when the button is pressed */
  onPress?: () => void;
  /** Ionicons icon name (defaults to "add") */
  icon?: string;
  /** Diameter of the circular button in dp (defaults to 56) */
  size?: number;
  /** Background color of the button (defaults to orange accent) */
  color?: string;
  /** Color of the icon (defaults to white) */
  iconColor?: string;
  /** Additional style overrides — use for custom positioning */
  style?: StyleProp<ViewStyle>;
  /** testID for automated testing */
  testID?: string;
  /** Accessibility label (required for screen readers) */
  accessibilityLabel?: string;
}

/**
 * FAB Component
 *
 * Renders a circular action button with an Ionicons icon and animated
 * press feedback. Inherits `applyShadow('md')` from the theme shadow system.
 *
 * @example
 * // Absolute-positioned bottom-right FAB (mood dashboard style)
 * <FAB
 *   onPress={onAddMood}
 *   testID="add-mood-button"
 *   accessibilityLabel="Add mood entry"
 *   style={{ position: 'absolute', bottom: 32, right: 24 }}
 * />
 *
 * @example
 * // Inline centered FAB (journal dashboard style)
 * <FAB
 *   onPress={onAddJournal}
 *   color={palette.brown[700]}
 *   testID="add-journal-fab"
 *   accessibilityLabel="Add new journal entry"
 *   style={{ alignSelf: 'center', marginTop: 24 }}
 * />
 */
export function FAB({
  onPress,
  icon = "add",
  size = 56,
  color = palette.onboarding.step2,
  iconColor = palette.white,
  style,
  testID,
  accessibilityLabel,
}: FABProps): React.ReactElement {
  const radius = size / 2;
  // Icon size is roughly 60% of the button diameter, matching common FAB conventions
  const iconSize = Math.round(size * 0.5);
  const haptic = useHaptic();

  // Spring animation for press feedback
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  return (
    <Pressable
      testID={testID}
      onPress={() => { haptic.light(); onPress?.(); }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: color,
          // Minimum touch target per WCAG 2.5.5
          minWidth: Math.max(size, 44),
          minHeight: Math.max(size, 44),
        },
        applyShadow("md"),
        style,
      ]}
    >
      <Animated.View style={animatedStyle}>
        <Icon name={icon} size={iconSize} color={iconColor} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default FAB;
