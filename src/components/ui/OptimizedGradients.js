import { LinearGradient } from "expo-linear-gradient";
import React, { memo } from "react";
import { StyleSheet } from "react-native";

import {
  FreudColors,
  FreudBorderRadius,
} from "../../shared/theme/FreudDesignSystem";

/**
 * Optimized Gradient Components
 *
 * Performance Optimizations:
 * - Memoized components to prevent unnecessary re-renders
 * - Pre-defined gradient configurations
 * - Reusable gradient instances
 * - Reduced LinearGradient instantiation
 */

// Base optimized gradient component
const BaseGradient = memo(
  ({
    colors,
    start = [0, 0],
    end = [1, 1],
    style,
    children,
    borderRadius = FreudBorderRadius.xl,
  }) => (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      style={[
        {
          borderRadius,
          flex: 1,
        },
        style,
      ]}
    >
      {children}
    </LinearGradient>
  ),
);

BaseGradient.displayName = "BaseGradient";

// Therapeutic gradient presets - memoized for performance
export const TherapeuticGradients = {
  // Serenity Green - for mindfulness and calm content
  serenity: memo((props) => (
    <BaseGradient
      colors={[FreudColors.serenityGreen[20], FreudColors.serenityGreen[10]]}
      {...props}
    />
  )),

  // Empathy Orange - for supportive and warm content
  empathy: memo((props) => (
    <BaseGradient
      colors={[FreudColors.empathyOrange[20], FreudColors.empathyOrange[10]]}
      {...props}
    />
  )),

  // Kind Purple - for calming and soothing content
  calming: memo((props) => (
    <BaseGradient
      colors={[FreudColors.kindPurple[20], FreudColors.kindPurple[10]]}
      {...props}
    />
  )),

  // Mindful Brown - for wisdom and grounding content
  wisdom: memo((props) => (
    <BaseGradient
      colors={[FreudColors.mindfulBrown[20], FreudColors.mindfulBrown[10]]}
      {...props}
    />
  )),

  // Zen Yellow - for energizing and positive content
  energizing: memo((props) => (
    <BaseGradient
      colors={[FreudColors.zenYellow[20], FreudColors.zenYellow[10]]}
      {...props}
    />
  )),

  // Subtle gray - for neutral content
  subtle: memo((props) => (
    <BaseGradient
      colors={[
        FreudColors.optimisticGray[10],
        FreudColors.optimisticGray[5] || "#FAFAFA",
      ]}
      {...props}
    />
  )),
};

// Set display names for better debugging
TherapeuticGradients.serenity.displayName = "SerenityGradient";
TherapeuticGradients.empathy.displayName = "EmpathyGradient";
TherapeuticGradients.calming.displayName = "CalmingGradient";
TherapeuticGradients.wisdom.displayName = "WisdomGradient";
TherapeuticGradients.energizing.displayName = "EnergizingGradient";
TherapeuticGradients.subtle.displayName = "SubtleGradient";

// Mood-specific gradients for MoodCheckIn component
export const MoodGradients = {
  happy: memo((props) => (
    <BaseGradient
      colors={[FreudColors.zenYellow[40], FreudColors.zenYellow[60]]}
      {...props}
    />
  )),

  calm: memo((props) => (
    <BaseGradient
      colors={[FreudColors.serenityGreen[40], FreudColors.serenityGreen[60]]}
      {...props}
    />
  )),

  neutral: memo((props) => (
    <BaseGradient
      colors={[FreudColors.optimisticGray[40], FreudColors.optimisticGray[60]]}
      {...props}
    />
  )),

  anxious: memo((props) => (
    <BaseGradient
      colors={[FreudColors.empathyOrange[40], FreudColors.empathyOrange[60]]}
      {...props}
    />
  )),

  sad: memo((props) => (
    <BaseGradient
      colors={[FreudColors.kindPurple[40], FreudColors.kindPurple[60]]}
      {...props}
    />
  )),
};

// Set display names
MoodGradients.happy.displayName = "HappyMoodGradient";
MoodGradients.calm.displayName = "CalmMoodGradient";
MoodGradients.neutral.displayName = "NeutralMoodGradient";
MoodGradients.anxious.displayName = "AnxiousMoodGradient";
MoodGradients.sad.displayName = "SadMoodGradient";

// Action-specific gradients for QuickActions component
export const ActionGradients = {
  therapy: memo((props) => (
    <BaseGradient
      colors={[FreudColors.mindfulBrown[60], FreudColors.mindfulBrown[80]]}
      {...props}
    />
  )),

  assessment: memo((props) => (
    <BaseGradient
      colors={[FreudColors.kindPurple[50], FreudColors.kindPurple[70]]}
      {...props}
    />
  )),

  mood: memo((props) => (
    <BaseGradient
      colors={[FreudColors.serenityGreen[50], FreudColors.serenityGreen[70]]}
      {...props}
    />
  )),
};

// Set display names
ActionGradients.therapy.displayName = "TherapyActionGradient";
ActionGradients.assessment.displayName = "AssessmentActionGradient";
ActionGradients.mood.displayName = "MoodActionGradient";

// Time-based gradients for welcome header
export const TimeGradients = {
  morning: memo((props) => (
    <BaseGradient
      colors={[FreudColors.zenYellow[20], FreudColors.serenityGreen[20]]}
      {...props}
    />
  )),

  afternoon: memo((props) => (
    <BaseGradient
      colors={[FreudColors.serenityGreen[20], FreudColors.empathyOrange[15]]}
      {...props}
    />
  )),

  evening: memo((props) => (
    <BaseGradient
      colors={[FreudColors.kindPurple[20], FreudColors.mindfulBrown[15]]}
      {...props}
    />
  )),
};

// Set display names
TimeGradients.morning.displayName = "MorningTimeGradient";
TimeGradients.afternoon.displayName = "AfternoonTimeGradient";
TimeGradients.evening.displayName = "EveningTimeGradient";

// Utility function to get time-based gradient
export const getTimeBasedGradient = () => {
  const hour = new Date().getHours();
  if (hour < 12) return TimeGradients.morning;
  if (hour < 17) return TimeGradients.afternoon;
  return TimeGradients.evening;
};

// Main gradient component selector
export const OptimizedGradient = memo(
  ({ variant = "subtle", mood, action, timeBase = false, ...props }) => {
    // Time-based gradient selection
    if (timeBase) {
      const TimeGradient = getTimeBasedGradient();
      return <TimeGradient {...props} />;
    }

    // Mood-specific gradient selection
    if (mood && MoodGradients[mood]) {
      const MoodGradient = MoodGradients[mood];
      return <MoodGradient {...props} />;
    }

    // Action-specific gradient selection
    if (action && ActionGradients[action]) {
      const ActionGradient = ActionGradients[action];
      return <ActionGradient {...props} />;
    }

    // Therapeutic gradient selection
    if (TherapeuticGradients[variant]) {
      const TherapeuticGradient = TherapeuticGradients[variant];
      return <TherapeuticGradient {...props} />;
    }

    // Fallback to subtle gradient
    return <TherapeuticGradients.subtle {...props} />;
  },
);

OptimizedGradient.displayName = "OptimizedGradient";

// Performance utility - creates a cached gradient component
export const createCachedGradient = (colors, options = {}) => {
  const CachedGradient = memo((props) => (
    <BaseGradient colors={colors} {...options} {...props} />
  ));

  CachedGradient.displayName = "CachedGradient";
  return CachedGradient;
};

export default OptimizedGradient;
