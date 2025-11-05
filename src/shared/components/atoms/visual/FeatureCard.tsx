import { useTheme } from "@theme/ThemeProvider";
import { motion } from "framer-motion";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card, Surface, IconButton } from "react-native-paper";

import {
  FreudColors,
  FreudSpacing,
  FreudTypography,
} from "../shared/theme/FreudDesignSystem";

const AnimatedCard = motion(Card);
const AnimatedSurface = motion(Surface);

const FeatureCard = ({
  icon,
  title,
  description,
  color = "serenityGreen",
  onPress,
  style = {},
  variant = "default",
  ...props
}) => {
  const { theme, isDarkMode } = useTheme();

  // Get therapeutic color based on variant
  const getTherapeuticColor = () => {
    const colorMap = {
      default: FreudColors.serenityGreen,
      calming: FreudColors.serenityGreen,
      nurturing: FreudColors.empathyOrange,
      grounding: FreudColors.mindfulBrown,
      energizing: FreudColors.zenYellow,
      peaceful: FreudColors.optimisticGray,
      therapeutic: FreudColors.kindPurple,
    };
    return colorMap[variant] || FreudColors.serenityGreen;
  };

  const therapeuticColor = getTherapeuticColor();

  return (
    <AnimatedCard
      mode="contained"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: 0.1,
      }}
      style={[styles.card, style]}
      onPress={onPress}
      {...props}
    >
      <Surface
        mode="flat"
        elevation={4}
        style={[
          styles.surface,
          {
            backgroundColor: isDarkMode ? therapeuticColor[90] : "#FFFFFF",
          },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: therapeuticColor[20],
            },
          ]}
        >
          <Text style={[styles.icon, { color: therapeuticColor[60] }]}>
            {icon}
          </Text>
        </View>

        <Text
          style={[
            styles.title,
            {
              color: isDarkMode ? therapeuticColor[10] : therapeuticColor[90],
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.description,
            {
              color: isDarkMode ? therapeuticColor[30] : therapeuticColor[70],
            },
          ]}
        >
          {description}
        </Text>
      </Surface>
    </AnimatedCard>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: FreudSpacing[2],
    flex: 1,
    minWidth: 160,
  },
  surface: {
    borderRadius: 20,
    padding: FreudSpacing[5],
    alignItems: "center",
    minHeight: 180,
    justifyContent: "center",
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: FreudSpacing[4],
  },
  icon: {
    fontSize: FreudTypography.sizes["2xl"],
  },
  title: {
    fontSize: FreudTypography.sizes.lg,
    fontWeight: FreudTypography.weights.bold,
    textAlign: "center",
    marginBottom: FreudSpacing[3],
    lineHeight: FreudTypography.sizes.lg * FreudTypography.lineHeights.tight,
  },
  description: {
    fontSize: FreudTypography.sizes.sm,
    lineHeight: FreudTypography.sizes.sm * FreudTypography.lineHeights.relaxed,
    textAlign: "center",
    fontWeight: FreudTypography.weights.normal,
  },
});

export default FeatureCard;
