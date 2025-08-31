import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";

import { useTheme } from "../../shared/theme/ThemeContext";
import { ActionIcon } from "../icons";

const FreudHeader = ({
  onBackPress,
  onSearchPress,
  onMenuPress,
  showBack = false,
  style,
  testID,
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background.primary,
      paddingTop: Platform.OS === "ios" ? 50 : StatusBar.currentHeight + 10,
      paddingBottom: theme.spacing[4], // 16px
      paddingHorizontal: theme.spacing[4], // 16px
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
      ...style,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: 44, // Minimum touch target
    },
    leftSection: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    rightSection: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing[2], // 8px
    },
    titleSection: {
      flex: 1,
      alignItems: "center",
      paddingHorizontal: theme.spacing[4],
    },
    title: {
      fontSize: theme.typography.sizes["2xl"], // 20px - matching Figma design
      fontWeight: theme.typography.weights.semiBold,
      color: theme.colors.primary[900], // Mindful Brown dark
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: theme.typography.sizes.sm, // 12px
      fontWeight: theme.typography.weights.medium,
      color: theme.colors.secondary[600], // Serenity Green
      marginTop: 2,
      letterSpacing: 0.25,
    },
    iconButton: {
      width: 44,
      height: 44,
      borderRadius: theme.borderRadius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
    },
    iconButtonPressed: {
      backgroundColor: theme.colors.gray[100],
    },
  });

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.header}>
        {/* Left Section */}
        <View style={styles.leftSection}>
          {showBack && onBackPress && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onBackPress}
              activeOpacity={0.7}
              testID="freud-header-back-button"
              accessibilityLabel="Go back"
              accessibilityRole="button"
            >
              <ActionIcon
                name="arrow-left"
                size={24}
                color={theme.colors.primary[700]}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Center Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Doctor Freud.AI</Text>
          <Text style={styles.subtitle}>GPT-5 BASED • CHECKPOINTS</Text>
        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>
          {onSearchPress && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onSearchPress}
              activeOpacity={0.7}
              testID="freud-header-search-button"
              accessibilityLabel="Search conversations"
              accessibilityRole="button"
            >
              <ActionIcon
                name="search"
                size={24}
                color={theme.colors.primary[700]}
              />
            </TouchableOpacity>
          )}

          {onMenuPress && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onMenuPress}
              activeOpacity={0.7}
              testID="freud-header-menu-button"
              accessibilityLabel="Open menu"
              accessibilityRole="button"
            >
              <ActionIcon
                name="menu"
                size={24}
                color={theme.colors.primary[700]}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default FreudHeader;
