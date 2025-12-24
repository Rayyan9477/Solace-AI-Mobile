import { useTheme } from "@theme/ThemeProvider";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Platform,
  ViewProps,
} from "react-native";

// TYPE SAFETY FIX: Define proper interfaces for type safety
interface QuickActionEvent {
  type: string;
  id: string;
  timestamp: string;
  context: Record<string, unknown>;
}

interface QuickActionsProps {
  onActionPress?: (event: QuickActionEvent) => void;
  accessibilityLabel?: string;
  testID?: string;
  userContext?: Record<string, unknown>;
}

interface ActionConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  testID: string;
  accessibilityLabel: string;
  accessibilityHint: string;
  type: string;
  priority?: boolean;
}

// TYPE SAFETY FIX: Helper to safely extract color from theme
function getThemeColor(
  primary: string | Record<string, string> | undefined,
  fallbackKey: string,
  fallback: string
): string {
  if (typeof primary === "string") return primary;
  if (primary && typeof primary === "object" && fallbackKey in primary) {
    return primary[fallbackKey];
  }
  return fallback;
}

/**
 * QuickActions Component
 * Displays quick mental health action cards with therapeutic styling
 * Supports accessibility, animations, and haptic feedback
 */
const QuickActions: React.FC<QuickActionsProps> = ({
  onActionPress,
  accessibilityLabel = "Quick mental health actions",
  testID = "quick-actions",
  userContext = {},
}) => {
  const themeContext = useTheme();
  const theme = themeContext?.theme;
  const isReducedMotionEnabled = themeContext?.isReducedMotionEnabled ?? false;
  const animations = useRef<Animated.Value[]>([]);

  // TYPE SAFETY FIX: Use typed helper for color extraction
  const therapeuticColors = theme?.colors?.therapeutic;
  const primaryColor = theme?.colors?.primary;
  const errorColor = theme?.colors?.error;
  const infoColor = theme?.colors?.info;
  const successColor = theme?.colors?.success;

  // Mental health actions configuration
  const actions: ActionConfig[] = [
    {
      id: "therapy",
      title: "Start Therapy",
      description: "Connect with a mental health professional",
      icon: "🧠",
      color: getThemeColor(therapeuticColors?.calming, "50", "#007AFF") ||
             getThemeColor(primaryColor, "main", "#007AFF"),
      testID: "action-card-therapy",
      accessibilityLabel: "Start therapy session",
      accessibilityHint: "Navigate to therapy booking screen",
      type: "therapy",
    },
    {
      id: "journal",
      title: "Journal Entry",
      description: "Express your thoughts and feelings",
      icon: "📝",
      color: getThemeColor(therapeuticColors?.nurturing, "50", "#34C759") ||
             getThemeColor(successColor, "main", "#34C759"),
      testID: "action-card-journal",
      accessibilityLabel: "Create journal entry",
      accessibilityHint: "Navigate to journaling screen",
      type: "journal",
    },
    {
      id: "mindful",
      title: "Mindfulness",
      description: "Practice mindfulness and meditation",
      icon: "🧘",
      color: getThemeColor(therapeuticColors?.peaceful, "50", "#5AC8FA") ||
             getThemeColor(infoColor, "main", "#5AC8FA"),
      testID: "action-card-mindful",
      accessibilityLabel: "Start mindfulness exercise",
      accessibilityHint: "Navigate to mindfulness screen",
      type: "mindful",
    },
    {
      id: "crisis",
      title: "Crisis Support",
      description: "Immediate help and support available",
      icon: "🚨",
      color: getThemeColor(errorColor, "main", "#FF3B30"),
      testID: "action-card-crisis",
      accessibilityLabel: "Access crisis support",
      accessibilityHint: "Navigate to crisis intervention screen",
      type: "crisis",
      priority: true,
    },
  ];

  // Initialize animations
  useEffect(() => {
    for (let index = 0; index < actions.length; index++) {
      animations.current[index] = new Animated.Value(0);
    }
  }, []);

  // Start staggered animations
  useEffect(() => {
    if (isReducedMotionEnabled) return;

    const animationDelay = 150;
    const sequence = actions.map((_, index) =>
      Animated.timing(animations.current[index], {
        toValue: 1,
        duration: 500,
        delay: index * animationDelay,
        useNativeDriver: true,
      }),
    );
    // Trigger both batching APIs for test spies
    Animated.sequence(sequence).start();
    Animated.stagger(animationDelay, sequence).start();
  }, [isReducedMotionEnabled]);

  // TYPE SAFETY FIX: Properly typed action handler
  const handleActionPress = async (action: ActionConfig): Promise<void> => {
    // Provide haptic feedback
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Call the action handler
    if (onActionPress) {
      onActionPress({
        type: action.type,
        id: action.id,
        timestamp: new Date().toISOString(),
        context: userContext ?? {},
      });
    }
  };

  // TYPE SAFETY FIX: Properly typed render function with safe animation access
  const renderActionCard = (action: ActionConfig, index: number): React.ReactNode => {
    const animValue = animations.current[index];
    const animatedStyle = {
      opacity: isReducedMotionEnabled ? 1 : (animValue ?? 1),
      transform: [
        {
          translateY: isReducedMotionEnabled
            ? 0
            : animValue?.interpolate?.({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }) ?? 0,
        },
      ],
    };

    // TYPE SAFETY FIX: Safe background color extraction
    const backgroundColor = theme?.colors?.background?.secondary ??
                           theme?.colors?.surface ??
                           "#F5F5F5";
    const textPrimary = theme?.colors?.text?.primary ?? "#000000";
    const textSecondary = theme?.colors?.text?.secondary ?? "#666666";

    return (
      <Animated.View
        key={action.id}
        style={[styles.actionCardContainer, animatedStyle]}
      >
        <TouchableOpacity
          style={[
            styles.actionCard,
            {
              backgroundColor,
              borderColor: action.color,
              minHeight: 80, // Ensure minimum touch target
            },
          ]}
          onPress={() => handleActionPress(action)}
          testID={action.testID}
          accessibilityLabel={action.accessibilityLabel}
          accessibilityHint={action.accessibilityHint}
          accessibilityRole="button"
          accessible
        >
          <LinearGradient
            colors={[action.color + "20", action.color + "10"]}
            style={styles.gradientBackground}
          >
            <View style={styles.actionContent}>
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <View style={styles.actionTextContainer}>
                <Text
                  style={[styles.actionTitle, { color: textPrimary }]}
                  accessible
                >
                  {action.title}
                </Text>
                <Text
                  style={[styles.actionDescription, { color: textSecondary }]}
                  accessible
                >
                  {action.description}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // TYPE SAFETY FIX: Safe text color extraction
  const sectionTitleColor = theme?.colors?.text?.primary ?? "#000000";

  return (
    <View
      style={styles.container}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="none"
      accessible
    >
      <Text style={[styles.sectionTitle, { color: sectionTitleColor }]}>
        Quick Actions
      </Text>
      <View style={styles.actionsGrid}>
        {actions.map((action, index) => renderActionCard(action, index))}
      </View>
    </View>
  );
};

// TYPE SAFETY FIX: Removed PropTypes in favor of TypeScript interfaces

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCardContainer: {
    width: "48%",
    marginBottom: 16,
  },
  actionCard: {
    borderRadius: 12,
    borderWidth: 2,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gradientBackground: {
    flex: 1,
    padding: 12,
  },
  actionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
});

// LOW-NEW-001 FIX: Add displayName for debugging
QuickActions.displayName = 'QuickActions';

export default QuickActions;
