import React, { memo } from "react";
import { View, StyleSheet } from "react-native";

import { FreudSpacing } from "../../shared/theme/FreudDesignSystem";
import {
  OptimizedCard,
  OptimizedMindfulCard,
  OptimizedEmpathyCard,
  OptimizedCalmingCard,
  OptimizedWisdomCard,
} from "../ui/OptimizedCard";

/**
 * DashboardSection - Reusable container for dashboard content sections
 *
 * Performance Optimizations:
 * - Memoized component
 * - Efficient card variant selection
 * - Minimal prop drilling
 */

// Individual section components for better separation of concerns
export const WelcomeSection = memo(({ children, ...props }) => (
  <OptimizedCard variant="elevated" {...props}>
    {children}
  </OptimizedCard>
));

export const MoodSection = memo(({ children, ...props }) => (
  <OptimizedMindfulCard
    title="How are you feeling today?"
    subtitle="Take a moment to check in with yourself"
    icon="Heart"
    {...props}
  >
    {children}
  </OptimizedMindfulCard>
));

export const ActionsSection = memo(({ children, ...props }) => (
  <OptimizedEmpathyCard {...props}>{children}</OptimizedEmpathyCard>
));

export const InsightsSection = memo(({ children, ...props }) => (
  <OptimizedCalmingCard
    title="Personal Insights"
    subtitle="Discover patterns in your wellbeing"
    icon="Insights"
    {...props}
  >
    {children}
  </OptimizedCalmingCard>
));

export const ProgressSection = memo(({ children, ...props }) => (
  <OptimizedMindfulCard
    title="Your Progress"
    subtitle="Celebrating your journey"
    icon="Brain"
    {...props}
  >
    {children}
  </OptimizedMindfulCard>
));

export const ActivitySection = memo(({ children, ...props }) => (
  <OptimizedWisdomCard
    title="Recent Activity"
    subtitle="Your wellness timeline"
    icon="Journal"
    {...props}
  >
    {children}
  </OptimizedWisdomCard>
));

// Set display names for debugging
WelcomeSection.displayName = "WelcomeSection";
MoodSection.displayName = "MoodSection";
ActionsSection.displayName = "ActionsSection";
InsightsSection.displayName = "InsightsSection";
ProgressSection.displayName = "ProgressSection";
ActivitySection.displayName = "ActivitySection";

// Main dashboard section component
const DashboardSection = memo(
  ({ variant = "default", sectionType, children, style, ...props }) => {
    // Select the appropriate section component
    const getSectionComponent = () => {
      switch (sectionType) {
        case "welcome":
          return WelcomeSection;
        case "mood":
          return MoodSection;
        case "actions":
          return ActionsSection;
        case "insights":
          return InsightsSection;
        case "progress":
          return ProgressSection;
        case "activity":
          return ActivitySection;
        default:
          return OptimizedCard;
      }
    };

    const SectionComponent = getSectionComponent();

    return (
      <View style={[styles.section, style]}>
        <SectionComponent variant={variant} {...props}>
          {children}
        </SectionComponent>
      </View>
    );
  },
);

DashboardSection.displayName = "DashboardSection";

const styles = StyleSheet.create({
  section: {
    marginBottom: FreudSpacing[2],
  },
});

export default DashboardSection;
