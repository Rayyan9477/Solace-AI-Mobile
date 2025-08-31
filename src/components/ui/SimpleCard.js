import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { useTheme } from "../../shared/theme/ThemeContext";

const SimpleCard = ({
  children,
  title,
  subtitle,
  onPress,
  style,
  contentStyle,
  elevated = true,
  testID,
  ...props
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.background.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[6], // 24px - matching Figma design
      ...(elevated && theme.shadows.sm), // Simple shadow only
      ...style,
    },
    pressable: {
      backgroundColor: theme.colors.background.card,
      borderRadius: theme.borderRadius.lg,
      ...(elevated && theme.shadows.sm),
      ...style,
    },
    content: {
      padding: theme.spacing[6], // 24px - matching Figma design
      ...contentStyle,
    },
    header: {
      marginBottom: title && subtitle ? theme.spacing[3] : theme.spacing[4],
    },
    title: {
      fontSize: theme.typography.sizes.xl, // 18px
      fontWeight: theme.typography.weights.semiBold,
      color: theme.colors.text.primary,
      marginBottom: subtitle ? theme.spacing[1] : 0,
      lineHeight: theme.typography.lineHeights.xl,
    },
    subtitle: {
      fontSize: theme.typography.sizes.base, // 14px
      fontWeight: theme.typography.weights.normal,
      color: theme.colors.text.secondary,
      lineHeight: theme.typography.lineHeights.base,
    },
  });

  const cardContent = (
    <>
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}
      {children}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={styles.pressable}
        onPress={onPress}
        activeOpacity={0.7}
        testID={testID}
        {...props}
      >
        <View style={styles.content}>{cardContent}</View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.card} testID={testID} {...props}>
      {cardContent}
    </View>
  );
};

export default SimpleCard;
