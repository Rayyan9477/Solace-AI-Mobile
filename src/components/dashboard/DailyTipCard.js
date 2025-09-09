import React, { memo } from "react";
import { Text, StyleSheet } from "react-native";

import FreudDesignSystem, {
  FreudSpacing,
  FreudTypography,
} from "../../shared/theme/FreudDesignSystem";
import { useTheme } from "../../shared/theme/UnifiedThemeProvider";
import { OptimizedWisdomCard } from "../ui/OptimizedCard";

/**
 * DailyTipCard - Optimized component for displaying therapeutic tips
 *
 * Performance Optimizations:
 * - Memoized component
 * - Uses OptimizedCard with cached gradients
 * - Minimal re-renders
 */
const DailyTipCard = memo(({ tip, onRefresh }) => {
  const { isDarkMode } = useTheme();

  if (!tip) return null;

  return (
    <OptimizedWisdomCard
      title="Daily Therapeutic Insight"
      subtitle={tip.category}
      icon={tip.icon}
      iconColor={tip.color}
      onPress={onRefresh}
      accessibilityLabel={`Daily tip: ${tip.tip}`}
      accessibilityHint="Double tap to get a new daily tip"
      testID="daily-tip-card"
    >
      <Text
        style={[
          styles.tipText,
          {
            color: isDarkMode
              ? FreudDesignSystem.themes.dark.colors.text.primary
              : FreudDesignSystem.themes.light.colors.text.primary,
          },
        ]}
      >
        {tip.tip}
      </Text>
    </OptimizedWisdomCard>
  );
});

DailyTipCard.displayName = "DailyTipCard";

const styles = StyleSheet.create({
  tipText: {
    fontSize: FreudTypography.sizes.base,
    lineHeight:
      FreudTypography.sizes.base * FreudTypography.lineHeights.relaxed,
    fontWeight: FreudTypography.weights.normal,
  },
});

export default DailyTipCard;
