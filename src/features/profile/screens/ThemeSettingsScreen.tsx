import { logger } from "@shared/utils/logger";

/**
 * Theme Settings Screen - Color Palette Customization
 * Allows users to select from preset color palettes and customize app appearance
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import { useResponsive } from "@shared/hooks/useResponsive";
import {
  presetColorPalettes,
  saveCustomColors,
  CustomColors,
} from "@shared/theme/customColors";

type PaletteKey = keyof typeof presetColorPalettes;

export const ThemeSettingsScreen = () => {
  const { theme, isDark, customColors, setCustomColors, resetCustomColors } =
    useTheme();
  const navigation = useNavigation();
  const { isWeb, getMaxContentWidth, getContainerPadding } = useResponsive();

  const [selectedPalette, setSelectedPalette] = useState<PaletteKey | null>(
    null,
  );
  const [hasChanges, setHasChanges] = useState(false);

  // Determine currently active palette on mount
  useEffect(() => {
    if (!customColors) {
      setSelectedPalette("default");
    } else {
      // Find which preset matches the current custom colors
      const currentPrimary = isDark
        ? customColors.dark?.primary
        : customColors.light?.primary;

      const matchingPreset = Object.entries(presetColorPalettes).find(
        ([key, palette]) => {
          const presetPrimary = isDark
            ? palette.dark.primary
            : palette.light.primary;
          return presetPrimary === currentPrimary;
        },
      );

      setSelectedPalette(
        matchingPreset ? (matchingPreset[0] as PaletteKey) : "default",
      );
    }
  }, [customColors, isDark]);

  const handleSelectPalette = (paletteKey: PaletteKey) => {
    setSelectedPalette(paletteKey);
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    try {
      if (!selectedPalette) return;

      const palette = presetColorPalettes[selectedPalette];
      const newCustomColors: CustomColors = {
        light: palette.light,
        dark: palette.dark,
      };

      await saveCustomColors(newCustomColors);
      setCustomColors(newCustomColors);
      setHasChanges(false);

      Alert.alert(
        "Theme Saved",
        `${palette.name} has been applied successfully!`,
        [{ text: "OK" }],
      );
    } catch (error) {
      logger.error("Failed to save theme:", error);
      Alert.alert("Error", "Failed to save theme settings. Please try again.", [
        { text: "OK" },
      ]);
    }
  };

  const handleResetToDefault = () => {
    Alert.alert(
      "Reset Theme",
      "Are you sure you want to reset to the default Mindful Brown theme?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              await resetCustomColors();
              setSelectedPalette("default");
              setHasChanges(false);
              Alert.alert("Theme Reset", "Default theme has been restored.", [
                { text: "OK" },
              ]);
            } catch (error) {
              logger.error("Failed to reset theme:", error);
              Alert.alert("Error", "Failed to reset theme. Please try again.", [
                { text: "OK" },
              ]);
            }
          },
        },
      ],
    );
  };

  const maxWidth = getMaxContentWidth();
  const contentMaxWidth = isWeb ? Math.min(maxWidth, 800) : "100%";
  const containerPadding = getContainerPadding();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    scrollContent: {
      flexGrow: 1,
    },
    innerContainer: {
      width: "100%",
      alignItems: "center",
    },
    contentWrapper: {
      width: "100%",
      maxWidth: contentMaxWidth,
      paddingHorizontal: containerPadding,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.brown[30],
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.brown[20],
      justifyContent: "center",
      alignItems: "center",
    },
    backButtonText: {
      fontSize: 20,
      color: theme.colors.text.primary,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    headerSpacer: {
      width: 40,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.secondary,
      marginBottom: 12,
      paddingHorizontal: 4,
    },
    sectionDescription: {
      fontSize: 14,
      fontWeight: "500",
      color: theme.colors.text.tertiary,
      marginBottom: 16,
      paddingHorizontal: 4,
      lineHeight: 20,
    },
    paletteCard: {
      backgroundColor: theme.colors.brown[20],
      borderRadius: 16,
      padding: 20,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: "transparent",
    },
    paletteCardSelected: {
      borderColor: theme.colors.brown[70],
      backgroundColor: theme.colors.brown[30],
    },
    paletteHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    paletteInfo: {
      flex: 1,
    },
    paletteName: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    paletteMode: {
      fontSize: 13,
      fontWeight: "500",
      color: theme.colors.text.secondary,
    },
    selectedBadge: {
      backgroundColor: theme.colors.brown[70],
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    selectedBadgeText: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.colors.brown[10],
    },
    colorPreview: {
      flexDirection: "row",
      gap: 12,
    },
    colorSwatch: {
      width: 48,
      height: 48,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.brown[40],
    },
    colorLabel: {
      fontSize: 11,
      fontWeight: "600",
      color: theme.colors.text.tertiary,
      marginTop: 4,
      textAlign: "center",
    },
    buttonContainer: {
      gap: 12,
      marginTop: 8,
    },
    saveButton: {
      backgroundColor: theme.colors.brown[70],
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: "center",
    },
    saveButtonDisabled: {
      backgroundColor: theme.colors.brown[40],
      opacity: 0.5,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.brown[10],
    },
    resetButton: {
      backgroundColor: theme.colors.brown[30],
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.brown[50],
    },
    resetButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    footer: {
      paddingHorizontal: 20,
      paddingBottom: 24,
    },
    footerNote: {
      fontSize: 12,
      fontWeight: "500",
      color: theme.colors.text.tertiary,
      textAlign: "center",
      lineHeight: 18,
      marginTop: 16,
    },
  });

  const renderPaletteCard = (
    paletteKey: PaletteKey,
    palette: typeof presetColorPalettes.default,
  ) => {
    const isSelected = selectedPalette === paletteKey;
    const colors = isDark ? palette.dark : palette.light;

    return (
      <TouchableOpacity
        key={paletteKey}
        style={[styles.paletteCard, isSelected && styles.paletteCardSelected]}
        onPress={() => handleSelectPalette(paletteKey)}
        accessible
        accessibilityLabel={`Select ${palette.name} theme`}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
      >
        <View style={styles.paletteHeader}>
          <View style={styles.paletteInfo}>
            <Text style={styles.paletteName}>{palette.name}</Text>
            <Text style={styles.paletteMode}>
              {isDark ? "Dark Mode Preview" : "Light Mode Preview"}
            </Text>
          </View>
          {isSelected && (
            <View style={styles.selectedBadge}>
              <Text style={styles.selectedBadgeText}>✓ Selected</Text>
            </View>
          )}
        </View>

        <View style={styles.colorPreview}>
          {colors.primary && (
            <View>
              <View
                style={[
                  styles.colorSwatch,
                  { backgroundColor: colors.primary },
                ]}
              />
              <Text style={styles.colorLabel}>Primary</Text>
            </View>
          )}
          {colors.secondary && (
            <View>
              <View
                style={[
                  styles.colorSwatch,
                  { backgroundColor: colors.secondary },
                ]}
              />
              <Text style={styles.colorLabel}>Secondary</Text>
            </View>
          )}
          {colors.accent && (
            <View>
              <View
                style={[styles.colorSwatch, { backgroundColor: colors.accent }]}
              />
              <Text style={styles.colorLabel}>Accent</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessible
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Theme Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.innerContainer}>
          <View style={styles.contentWrapper}>
            {/* Introduction Section */}
            <View style={[styles.section, { marginTop: 24 }]}>
              <Text style={styles.sectionTitle}>Choose Your Color Palette</Text>
              <Text style={styles.sectionDescription}>
                Select a therapeutic color palette that resonates with your mood
                and preferences. Each palette is designed to promote calmness
                and mental well-being.
              </Text>
            </View>

            {/* Palette Options */}
            <View style={styles.section}>
              {Object.entries(presetColorPalettes).map(([key, palette]) =>
                renderPaletteCard(key as PaletteKey, palette),
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.footer}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    !hasChanges && styles.saveButtonDisabled,
                  ]}
                  onPress={handleSaveChanges}
                  disabled={!hasChanges}
                  accessible
                  accessibilityLabel="Save theme changes"
                  accessibilityRole="button"
                  accessibilityState={{ disabled: !hasChanges }}
                >
                  <Text style={styles.saveButtonText}>
                    {hasChanges ? "Save Changes ✓" : "No Changes"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={handleResetToDefault}
                  accessible
                  accessibilityLabel="Reset to default theme"
                  accessibilityRole="button"
                >
                  <Text style={styles.resetButtonText}>
                    Reset to Default Theme
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.footerNote}>
                Theme changes will be applied immediately after saving. Your
                preference will be remembered across app sessions.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ThemeSettingsScreen;
