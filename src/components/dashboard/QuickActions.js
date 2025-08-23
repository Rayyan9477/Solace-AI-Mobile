import { WebSafeLinearGradient as LinearGradient } from "../common/WebSafeLinearGradient";
import ModernCard from "../modern/ModernCard";
import ModernButton from "../modern/ModernButton";
import { modernDarkColors } from "../../shared/theme/darkTheme";
import React, { useRef, useEffect, memo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";

import { useTheme } from "../../shared/theme/ThemeContext";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from "../../shared/theme/theme";
import { MentalHealthIcon, ActionIcon } from "../icons";

const QuickActions = ({ onStartChat, onTakeAssessment, onMoodTracker }) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const actions = [
    {
      id: "chat",
      title: "Start Chat",
      subtitle: "Talk to AI therapist",
      iconName: "Therapy",
      onPress: onStartChat,
      gradientColors: [
        theme.colors.therapeutic.calming[400],
        theme.colors.therapeutic.calming[600],
      ],
    },
    {
      id: "assessment",
      title: "Take Assessment",
      subtitle: "PHQ-9 or GAD-7",
      iconName: "Journal",
      onPress: onTakeAssessment,
      gradientColors: [
        theme.colors.therapeutic.grounding[400],
        theme.colors.therapeutic.grounding[600],
      ],
    },
    {
      id: "mood",
      title: "Track Mood",
      subtitle: "Log your feelings",
      iconName: "Heart",
      onPress: onMoodTracker,
      gradientColors: [
        theme.colors.therapeutic.nurturing[400],
        theme.colors.therapeutic.nurturing[600],
      ],
    },
  ];

  return (
    <ModernCard
      title="Quick Actions"
      subtitle="Start your wellness journey"
      variant="neon"
      elevation="high"
      animated={true}
      glowEffect={true}
      interactive={true}
      shaderVariant="holographic"
      style={styles.container}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >

        <View style={styles.actionsGrid}>
          {actions.map((action, index) => (
            <Animated.View
              key={action.id}
              style={{
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 30],
                      outputRange: [0, 30 + index * 10],
                    }),
                  },
                ],
              }}
            >
              <ModernButton
                title={action.title}
                variant={index === 0 ? "neon" : index === 1 ? "neural" : "glass"}
                size="medium"
                animated={true}
                glowEffect={index === 0}
                shaderEffect={index === 0}
                icon={action.iconName}
                onPress={action.onPress}
                style={styles.actionButton}
                testID={`quick-action-${action.id}`}
              />
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </ModernCard>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing[4],
    marginVertical: spacing[3],
  },
  actionsGrid: {
    gap: spacing[3],
  },
  actionButton: {
    marginVertical: spacing[1],
  },
});

export default memo(QuickActions);
