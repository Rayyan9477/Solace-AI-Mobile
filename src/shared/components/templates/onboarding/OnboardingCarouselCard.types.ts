/**
 * OnboardingCarouselCard Types
 * @description Type definitions for onboarding carousel card template
 */

import type { ImageSourcePropType, ViewStyle } from "react-native";

/**
 * Onboarding step data structure
 */
export interface OnboardingStepData {
  /** Step number (1-5) */
  stepNumber: number;
  /** Step label (e.g., "Step One") */
  stepLabel: string;
  /** Main title text */
  title: string;
  /** Words in title that should be highlighted */
  highlightedWords: string[];
  /** Illustration image source OR custom component */
  illustrationSource?: ImageSourcePropType;
  /** Custom illustration component (overrides illustrationSource) */
  illustrationComponent?: React.ReactElement;
  /** Background color for illustration section */
  backgroundColor: string;
  /** Total number of steps in the onboarding flow */
  totalSteps: number;
}

/**
 * OnboardingCarouselCard component props
 */
export interface OnboardingCarouselCardProps {
  /** Onboarding step data */
  stepData: OnboardingStepData;
  /** Callback when user taps arrow to proceed */
  onNext: () => void;
  /** Callback when user taps back (optional) */
  onBack?: () => void;
  /** Test ID for component */
  testID?: string;
  /** Custom styles */
  style?: ViewStyle;
}

/**
 * StepBadge component props
 */
export interface StepBadgeProps {
  /** Step number */
  stepNumber: number;
  /** Step label (auto-generated if not provided) */
  label?: string;
  /** Test ID */
  testID?: string;
  /** Custom styles */
  style?: ViewStyle;
}

/**
 * OnboardingProgressBar component props
 */
export interface OnboardingProgressBarProps {
  /** Current step (1-based) */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
  /** Active segment color */
  activeColor?: string;
  /** Inactive segment color */
  inactiveColor?: string;
  /** Test ID */
  testID?: string;
  /** Custom styles */
  style?: ViewStyle;
}

/**
 * OnboardingTitle component props
 */
export interface OnboardingTitleProps {
  /** Full title text */
  text: string;
  /** Words that should be highlighted */
  highlightedWords: string[];
  /** Highlight text color */
  highlightColor?: string;
  /** Test ID */
  testID?: string;
  /** Custom styles */
  style?: ViewStyle;
}

/**
 * CircleArrowButton component props
 */
export interface CircleArrowButtonProps {
  /** Button press handler */
  onPress: () => void;
  /** Arrow direction */
  direction?: "left" | "right";
  /** Button variant */
  variant?: "next" | "complete";
  /** Disabled state */
  disabled?: boolean;
  /** Button size (diameter) */
  size?: number;
  /** Background color */
  backgroundColor?: string;
  /** Icon color */
  iconColor?: string;
  /** Accessibility label */
  accessibilityLabel: string;
  /** Test ID */
  testID?: string;
  /** Custom styles */
  style?: ViewStyle;
}
