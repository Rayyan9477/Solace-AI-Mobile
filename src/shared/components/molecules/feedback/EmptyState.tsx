/**
 * EmptyState Component
 * @description Displays placeholder content for empty or no-result states
 * @task Task 2.4.4: EmptyState Component (Sprint 2.4 - Molecules Content)
 *
 * Features:
 * - Icon or illustration display
 * - Title and description text
 * - Primary and secondary action buttons
 * - Multiple variants (default, compact, card)
 * - Full accessibility support
 */

import React, { useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import type {
  EmptyStateProps,
  EmptyStateVariant,
} from "./EmptyState.types";

/**
 * Color tokens (dark mode first)
 */
const colors = {
  // Text
  title: "#F1F5F9",
  description: "#94A3B8",

  // Buttons
  primaryButton: "#818CF8",
  primaryButtonText: "#FFFFFF",
  secondaryButton: "transparent",
  secondaryButtonText: "#818CF8",

  // Card
  cardBackground: "#2A2220",
};

/**
 * Variant configurations
 */
const variantConfig: Record<
  EmptyStateVariant,
  { padding: number; spacing: number; iconSize: number }
> = {
  compact: { padding: 16, spacing: 8, iconSize: 40 },
  default: { padding: 24, spacing: 12, iconSize: 64 },
  card: { padding: 24, spacing: 12, iconSize: 64 },
};

/**
 * EmptyState Component
 *
 * @example
 * ```tsx
 * // Basic empty state
 * <EmptyState title="No items found" />
 *
 * // With description and action
 * <EmptyState
 *   title="No results"
 *   description="Try adjusting your search criteria"
 *   action={{
 *     label: "Clear Filters",
 *     onPress: handleClearFilters,
 *   }}
 * />
 *
 * // With icon and both actions
 * <EmptyState
 *   icon={<SearchIcon />}
 *   title="No search results"
 *   description="We couldn't find anything matching your search"
 *   action={{
 *     label: "New Search",
 *     onPress: handleNewSearch,
 *   }}
 *   secondaryAction={{
 *     label: "Get Help",
 *     onPress: handleHelp,
 *   }}
 * />
 *
 * // Compact variant
 * <EmptyState
 *   title="No notifications"
 *   variant="compact"
 * />
 * ```
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  variant = "default",
  illustration,
  testID,
  accessibilityLabel,
  style,
}: EmptyStateProps): React.ReactElement {
  const config = variantConfig[variant];

  // Compute container styles
  const containerStyle = useMemo((): ViewStyle => {
    const baseStyle: ViewStyle = {
      padding: config.padding,
      alignItems: "center",
      justifyContent: "center",
    };

    if (variant === "card") {
      baseStyle.backgroundColor = colors.cardBackground;
      baseStyle.borderRadius = 16;
    }

    return baseStyle;
  }, [config, variant]);

  // Compute title styles
  const titleStyle = useMemo((): TextStyle => ({
    fontSize: variant === "compact" ? 16 : 18,
    fontWeight: "600",
    color: colors.title,
    textAlign: "center",
    marginTop: config.spacing,
  }), [variant, config.spacing]);

  // Compute description styles
  const descriptionStyle = useMemo((): TextStyle => ({
    fontSize: variant === "compact" ? 13 : 14,
    color: colors.description,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 20,
  }), [variant]);

  // Render visual element (illustration takes priority over icon)
  const renderVisual = () => {
    if (illustration) {
      return (
        <View style={styles.visualContainer}>
          {illustration}
        </View>
      );
    }

    if (icon) {
      return (
        <View style={styles.visualContainer}>
          {icon}
        </View>
      );
    }

    return null;
  };

  // Render action buttons
  const renderActions = () => {
    if (!action && !secondaryAction) return null;

    return (
      <View style={styles.actionsContainer}>
        {action && (
          <Pressable
            testID={testID ? `${testID}-action` : undefined}
            onPress={action.onPress}
            accessibilityRole="button"
            accessibilityLabel={action.label}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>
              {action.label}
            </Text>
          </Pressable>
        )}
        {secondaryAction && (
          <Pressable
            testID={testID ? `${testID}-secondary-action` : undefined}
            onPress={secondaryAction.onPress}
            accessibilityRole="button"
            accessibilityLabel={secondaryAction.label}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>
              {secondaryAction.label}
            </Text>
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <View
      testID={testID}
      accessibilityLabel={accessibilityLabel || title}
      style={[containerStyle, style]}
    >
      {renderVisual()}
      <Text style={titleStyle}>{title}</Text>
      {description && (
        <Text style={descriptionStyle}>{description}</Text>
      )}
      {renderActions()}
    </View>
  );
}

const styles = StyleSheet.create({
  visualContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  actionsContainer: {
    marginTop: 16,
    alignItems: "center",
    gap: 8,
  },
  primaryButton: {
    backgroundColor: colors.primaryButton,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  primaryButtonText: {
    color: colors.primaryButtonText,
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: colors.secondaryButton,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: colors.secondaryButtonText,
    fontSize: 14,
    fontWeight: "500",
  },
  buttonPressed: {
    opacity: 0.8,
  },
});

export default EmptyState;
