/**
 * CbtStepper — 5-step progress stepper for screen 27 CBT Thought Record (prototype v4.2).
 *
 * Renders a horizontal row of numbered circles connected by lines. Completed
 * steps show a check mark in sage[300]; the current step uses aurora[500]
 * gradient with a ring; pending steps are outlined midnight[600].
 *
 * Only completed and current steps are pressable — pending steps render as
 * plain Views. The component exposes accessibilityRole="progressbar" on its
 * container with accessibilityValue for screen readers.
 *
 * @task Sprint 5: Chat organisms — CbtStepper
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useTheme } from "@/shared/theme/useTheme";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { AppIcon } from "@/shared/components/atoms/display/AppIcon";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CbtStep {
  /** Display label, e.g. "Situation". */
  label: string;
  /** Whether this step has been completed. */
  completed?: boolean;
}

export interface CbtStepperProps {
  /** Ordered step definitions. Typically 5. */
  steps: CbtStep[];
  /** Zero-based index of the currently active step. */
  currentIndex: number;
  /** Callback when a completed or current step is tapped. */
  onStepPress?: (index: number) => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface StepCircleProps {
  index: number;
  step: CbtStep;
  isCurrent: boolean;
  onPress?: () => void;
  testID?: string;
}

function StepCircle({
  index,
  step,
  isCurrent,
  onPress,
  testID,
}: StepCircleProps): React.ReactElement {
  const { palette } = useTheme();
  const isCompleted = !!step.completed;
  const isPressable = isCompleted || isCurrent;

  const circleContent = isCompleted ? (
    <AppIcon
      name="check"
      size={14}
      color={palette.warm[50]}
      accessibilityLabel={`Step ${index + 1} completed`}
    />
  ) : (
    <Text
      style={[
        styles.stepNumber,
        {
          color: isCurrent ? palette.warm[50] : palette.midnight[600],
        },
      ]}
    >
      {index + 1}
    </Text>
  );

  const circleInner = isCompleted ? (
    // Completed — solid sage[300]
    <View
      style={[styles.circle, { backgroundColor: palette.sage[300] }]}
      testID={testID ? `${testID}-circle` : undefined}
    >
      {circleContent}
    </View>
  ) : isCurrent ? (
    // Current — aurora gradient with 2px ring
    <View
      style={[
        styles.circle,
        styles.currentRing,
        { borderColor: hexToRgba(palette.aurora[500], 0.6) },
      ]}
      testID={testID ? `${testID}-circle` : undefined}
    >
      <LinearGradient
        colors={[palette.aurora[300], palette.aurora[700]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientFill}
      />
      <View style={styles.circleContent}>{circleContent}</View>
    </View>
  ) : (
    // Pending — outlined
    <View
      style={[
        styles.circle,
        styles.pendingCircle,
        { borderColor: palette.midnight[600] },
      ]}
      testID={testID ? `${testID}-circle` : undefined}
    >
      {circleContent}
    </View>
  );

  const labelEl = isCurrent ? (
    <Text
      style={[styles.stepLabel, { color: palette.warm[100] }]}
      numberOfLines={1}
    >
      {step.label}
    </Text>
  ) : null;

  if (isPressable && onPress) {
    return (
      <TouchableOpacity
        testID={testID}
        onPress={onPress}
        activeOpacity={0.75}
        accessibilityRole="button"
        accessibilityLabel={`${step.label}, step ${index + 1}${isCompleted ? ", completed" : ", current"}`}
        style={styles.stepContainer}
        hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
      >
        {circleInner}
        {labelEl}
      </TouchableOpacity>
    );
  }

  return (
    <View
      testID={testID}
      style={styles.stepContainer}
      accessibilityElementsHidden
    >
      {circleInner}
      {labelEl}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CbtStepper({
  steps,
  currentIndex,
  onStepPress,
  testID,
  style,
}: CbtStepperProps): React.ReactElement {
  const { palette } = useTheme();
  useReducedMotion();

  return (
    <View
      testID={testID}
      accessibilityRole="progressbar"
      accessibilityValue={{
        now: currentIndex + 1,
        min: 1,
        max: steps.length,
      }}
      accessibilityLabel={`Step ${currentIndex + 1} of ${steps.length}: ${steps[currentIndex]?.label ?? ""}`}
      style={[styles.container, style]}
    >
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const isCurrent = index === currentIndex;
        const isCompleted = !!step.completed;
        const prevCompleted = index > 0 && !!steps[index - 1]?.completed;

        // Connector line color: sage if the step to the left is completed
        const lineColor =
          prevCompleted || (index <= currentIndex && steps[index - 1]?.completed)
            ? palette.sage[300]
            : palette.midnight[600];

        return (
          <React.Fragment key={index}>
            {/* Connector line before this step (except the first) */}
            {index > 0 && (
              <View
                style={[styles.connectorLine, { backgroundColor: lineColor }]}
                accessibilityElementsHidden
              />
            )}

            <StepCircle
              index={index}
              step={step}
              isCurrent={isCurrent}
              onPress={
                (isCompleted || isCurrent) && onStepPress
                  ? () => onStepPress(index)
                  : undefined
              }
              testID={testID ? `${testID}-step-${index}` : undefined}
            />
          </React.Fragment>
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const CIRCLE_SIZE = 36;

const styles = StyleSheet.create({
  circle: {
    alignItems: "center",
    borderRadius: CIRCLE_SIZE / 2,
    height: CIRCLE_SIZE,
    justifyContent: "center",
    overflow: "hidden",
    width: CIRCLE_SIZE,
  },
  circleContent: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    zIndex: 1,
  },
  connectorLine: {
    flex: 1,
    height: 1,
    marginBottom: 4, // align with circle center (approx)
    marginTop: 18, // half circle size to center the line
  },
  container: {
    alignItems: "flex-start",
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  currentRing: {
    borderWidth: 2,
    overflow: "hidden",
  },
  gradientFill: {
    ...StyleSheet.absoluteFillObject,
  },
  pendingCircle: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  stepContainer: {
    alignItems: "center",
    minHeight: 44,
    minWidth: 44,
  },
  stepLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    lineHeight: 14,
    marginTop: 4,
    textAlign: "center",
  },
  stepNumber: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
  },
});

export default CbtStepper;
