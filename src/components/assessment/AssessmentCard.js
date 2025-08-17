import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { useTheme } from "../../shared/theme/ThemeContext";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from "../../shared/theme/theme";
import {
  MentalHealthAccessibility,
  createCardAccessibility,
} from "../../utils/accessibility";
import AccessibleTouchable from "../accessibility/AccessibleTouchable";

const AssessmentCard = ({
  title,
  description,
  duration,
  icon,
  onStart,
  onLearnMore,
  loading,
}) => {
  const { theme, isScreenReaderEnabled } = useTheme();
  const componentStyles = styles;

  return (
    <View
      style={[
        componentStyles.container,
        { backgroundColor: theme.colors.background.secondary },
      ]}
      {...createCardAccessibility(
        title,
        `${description}. Duration: ${duration}`,
        "Double tap to view assessment options",
      )}
    >
      <View style={componentStyles.header}>
        <Text style={componentStyles.icon} accessibilityElementsHidden>
          {icon}
        </Text>
        <View style={componentStyles.titleContainer}>
          <Text
            style={[
              componentStyles.title,
              { color: theme.colors.text.primary },
            ]}
            accessibilityRole="header"
            accessibilityLevel={3}
          >
            {title}
          </Text>
          <Text
            style={[
              componentStyles.duration,
              { color: theme.colors.text.secondary },
            ]}
            accessibilityRole="text"
            accessibilityLabel={`Assessment duration: ${duration}`}
          >
            {duration}
          </Text>
        </View>
      </View>

      <Text
        style={[
          componentStyles.description,
          { color: theme.colors.text.secondary },
        ]}
        accessibilityRole="text"
      >
        {description}
      </Text>

      <View
        style={componentStyles.actions}
        accessibilityRole="group"
        accessibilityLabel="Assessment actions"
      >
        <AccessibleTouchable
          style={[
            componentStyles.learnMoreButton,
            {
              backgroundColor: theme.colors.gray[200],
              minWidth: 44,
              minHeight: 44,
            },
          ]}
          onPress={onLearnMore}
          accessibilityLabel={`Learn more about ${title}`}
          accessibilityHint="Double tap to view detailed information about this assessment"
        >
          <Text
            style={[
              componentStyles.learnMoreText,
              { color: theme.colors.gray[700] },
            ]}
          >
            Learn More
          </Text>
        </AccessibleTouchable>

        <AccessibleTouchable
          style={[
            componentStyles.startButton,
            {
              backgroundColor: theme.colors.primary[500],
              minWidth: 44,
              minHeight: 44,
            },
          ]}
          onPress={onStart}
          disabled={loading}
          accessibilityLabel={
            loading ? "Assessment loading" : `Start ${title} assessment`
          }
          accessibilityHint={
            loading
              ? "Please wait while the assessment loads"
              : `Double tap to begin the ${title} assessment, estimated duration ${duration}`
          }
          accessibilityState={{
            disabled: loading,
            busy: loading,
          }}
        >
          <Text style={componentStyles.startButtonText}>
            {loading ? "Loading..." : "Start Assessment"}
          </Text>
        </AccessibleTouchable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing[4],
    borderRadius: borderRadius.md,
    marginBottom: spacing[4],
    ...shadows.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing[3],
  },
  icon: {
    fontSize: typography.sizes["2xl"],
    marginRight: spacing[3],
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
    lineHeight: typography.lineHeights.lg,
    marginBottom: spacing[1],
  },
  duration: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.sm,
  },
  description: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.base,
    marginBottom: spacing[4],
  },
  actions: {
    flexDirection: "row",
    gap: spacing[3],
  },
  learnMoreButton: {
    flex: 1,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.md,
    alignItems: "center",
    ...shadows.sm,
  },
  learnMoreText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semiBold,
  },
  startButton: {
    flex: 2,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.md,
    alignItems: "center",
    ...shadows.sm,
  },
  startButtonText: {
    color: colors.text.inverse,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semiBold,
  },
});

export default AssessmentCard;
