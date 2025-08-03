import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Dimensions,
} from "react-native";

import { useDesignSystem } from "./DesignSystemContext";
import { MentalHealthIcon, ActionIcon } from "../components/icons";
import { useTheme } from "../contexts/ThemeContext";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from "../styles/theme";

const { width } = Dimensions.get("window");

// Color manipulation utilities
const ColorUtils = {
  // Convert hex to HSL
  hexToHsl(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  },

  // Convert HSL to hex
  hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (c) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  },

  // Generate color scale from base color
  generateColorScale(baseHex) {
    const hsl = this.hexToHsl(baseHex);
    const scale = {};

    const shades = [
      { key: 50, l: 95 },
      { key: 100, l: 90 },
      { key: 200, l: 80 },
      { key: 300, l: 70 },
      { key: 400, l: 60 },
      { key: 500, l: hsl.l }, // Base color
      { key: 600, l: Math.max(hsl.l - 10, 10) },
      { key: 700, l: Math.max(hsl.l - 20, 10) },
      { key: 800, l: Math.max(hsl.l - 30, 5) },
      { key: 900, l: Math.max(hsl.l - 40, 5) },
    ];

    shades.forEach(({ key, l }) => {
      scale[key] = this.hslToHex(hsl.h, hsl.s, l);
    });

    return scale;
  },

  // Validate hex color
  isValidHex(hex) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  },
};

const ColorCustomizer = () => {
  const { theme } = useTheme();
  const {
    designTokens,
    currentTheme,
    updateTokens,
    setTheme,
    predefinedThemes,
    resetToDefault,
  } = useDesignSystem();

  const [activeColorType, setActiveColorType] = useState("primary");
  const [customColors, setCustomColors] = useState({});
  const [colorInput, setColorInput] = useState("");

  useEffect(() => {
    // Initialize with current colors
    setCustomColors({
      primary: designTokens.colors.primary[500],
      secondary: designTokens.colors.secondary[500],
      therapeutic: {
        calming: designTokens.colors.therapeutic.calming[500],
        nurturing: designTokens.colors.therapeutic.nurturing[500],
        peaceful: designTokens.colors.therapeutic.peaceful[500],
        grounding: designTokens.colors.therapeutic.grounding[500],
        energizing: designTokens.colors.therapeutic.energizing[500],
      },
    });
  }, [designTokens]);

  const handleColorChange = (colorType, newColor) => {
    if (!ColorUtils.isValidHex(newColor)) {
      Alert.alert(
        "Invalid Color",
        "Please enter a valid hex color (e.g., #FF5733)",
      );
      return;
    }

    const colorScale = ColorUtils.generateColorScale(newColor);
    const updatedColors = { ...customColors };

    if (colorType.includes(".")) {
      // Handle nested colors (e.g., 'therapeutic.calming')
      const [parent, child] = colorType.split(".");
      updatedColors[parent] = {
        ...updatedColors[parent],
        [child]: newColor,
      };
    } else {
      updatedColors[colorType] = newColor;
    }

    setCustomColors(updatedColors);

    // Update design tokens
    const tokenUpdates = {
      colors: {
        [colorType]: colorScale,
      },
    };

    updateTokens(tokenUpdates);
  };

  const applyPredefinedTheme = (themeName) => {
    setTheme(themeName);
    Alert.alert(
      "Theme Applied",
      `${predefinedThemes[themeName].name} theme has been applied successfully.`,
    );
  };

  const resetColors = () => {
    Alert.alert(
      "Reset Colors",
      "Are you sure you want to reset all colors to default?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            resetToDefault();
            Alert.alert(
              "Colors Reset",
              "All colors have been reset to default values.",
            );
          },
        },
      ],
    );
  };

  const ColorPicker = ({ label, colorKey, currentColor }) => (
    <View style={styles.colorPickerContainer}>
      <View style={styles.colorPickerHeader}>
        <Text style={[styles.colorLabel, { color: theme.colors.text.primary }]}>
          {label}
        </Text>
        <View
          style={[styles.colorPreview, { backgroundColor: currentColor }]}
        />
      </View>

      <TextInput
        style={[
          styles.colorInput,
          {
            backgroundColor: theme.colors.background.secondary,
            color: theme.colors.text.primary,
            borderColor: theme.colors.border.primary,
          },
        ]}
        value={colorKey === activeColorType ? colorInput : currentColor}
        onFocus={() => {
          setActiveColorType(colorKey);
          setColorInput(currentColor);
        }}
        onChangeText={(text) => {
          setColorInput(text);
          if (ColorUtils.isValidHex(text)) {
            handleColorChange(colorKey, text);
          }
        }}
        placeholder="#000000"
        placeholderTextColor={theme.colors.text.tertiary}
        autoCapitalize="none"
        maxLength={7}
      />
    </View>
  );

  const ThemeCard = ({ themeName, themeData }) => (
    <TouchableOpacity
      style={[
        styles.themeCard,
        {
          backgroundColor: theme.colors.background.primary,
          borderColor:
            currentTheme === themeName
              ? theme.colors.primary[500]
              : theme.colors.border.primary,
        },
        shadows.sm,
      ]}
      onPress={() => applyPredefinedTheme(themeName)}
    >
      <View style={styles.themePreview}>
        <View
          style={[
            styles.themeColorDot,
            { backgroundColor: themeData.primary[500] },
          ]}
        />
        <View
          style={[
            styles.themeColorDot,
            { backgroundColor: themeData.secondary[500] },
          ]}
        />
        <View
          style={[
            styles.themeColorDot,
            { backgroundColor: themeData.accent[500] },
          ]}
        />
      </View>

      <Text style={[styles.themeName, { color: theme.colors.text.primary }]}>
        {themeData.name}
      </Text>

      <Text
        style={[
          styles.themeDescription,
          { color: theme.colors.text.secondary },
        ]}
      >
        {themeData.description}
      </Text>

      {currentTheme === themeName && (
        <View style={styles.activeThemeBadge}>
          <ActionIcon name="Success" size="xs" colorScheme="success" />
          <Text
            style={[
              styles.activeThemeText,
              { color: theme.colors.success[600] },
            ]}
          >
            Active
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <MentalHealthIcon name="Brain" size="lg" colorScheme="calming" />
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Color Customization
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          Personalize your mental wellness experience
        </Text>
      </View>

      {/* Predefined Themes */}
      <View style={styles.section}>
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
        >
          Predefined Themes
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.themesContainer}
        >
          {Object.entries(predefinedThemes).map(([key, themeData]) => (
            <ThemeCard key={key} themeName={key} themeData={themeData} />
          ))}
        </ScrollView>
      </View>

      {/* Custom Colors */}
      <View style={styles.section}>
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
        >
          Custom Colors
        </Text>

        {/* Primary Colors */}
        <View style={styles.colorGroup}>
          <Text
            style={[
              styles.colorGroupTitle,
              { color: theme.colors.text.primary },
            ]}
          >
            Brand Colors
          </Text>

          <ColorPicker
            label="Primary Color"
            colorKey="primary"
            currentColor={designTokens.colors.primary[500]}
          />

          <ColorPicker
            label="Secondary Color"
            colorKey="secondary"
            currentColor={designTokens.colors.secondary[500]}
          />
        </View>

        {/* Therapeutic Colors */}
        <View style={styles.colorGroup}>
          <Text
            style={[
              styles.colorGroupTitle,
              { color: theme.colors.text.primary },
            ]}
          >
            Therapeutic Colors
          </Text>

          <ColorPicker
            label="Calming (Peace & Tranquility)"
            colorKey="therapeutic.calming"
            currentColor={designTokens.colors.therapeutic.calming[500]}
          />

          <ColorPicker
            label="Nurturing (Growth & Healing)"
            colorKey="therapeutic.nurturing"
            currentColor={designTokens.colors.therapeutic.nurturing[500]}
          />

          <ColorPicker
            label="Peaceful (Serenity & Balance)"
            colorKey="therapeutic.peaceful"
            currentColor={designTokens.colors.therapeutic.peaceful[500]}
          />

          <ColorPicker
            label="Grounding (Stability & Focus)"
            colorKey="therapeutic.grounding"
            currentColor={designTokens.colors.therapeutic.grounding[500]}
          />

          <ColorPicker
            label="Energizing (Motivation & Joy)"
            colorKey="therapeutic.energizing"
            currentColor={designTokens.colors.therapeutic.energizing[500]}
          />
        </View>
      </View>

      {/* Reset Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.resetButton,
            {
              backgroundColor: theme.colors.error[500],
            },
            shadows.sm,
          ]}
          onPress={resetColors}
        >
          <ActionIcon
            name="Close"
            size="sm"
            color={theme.colors.text.inverse}
          />
          <Text
            style={[
              styles.resetButtonText,
              { color: theme.colors.text.inverse },
            ]}
          >
            Reset to Default
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing[4],
    paddingBottom: spacing[8],
  },
  header: {
    alignItems: "center",
    marginBottom: spacing[8],
  },
  title: {
    fontSize: typography.sizes["2xl"],
    fontWeight: typography.weights.bold,
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },
  subtitle: {
    fontSize: typography.sizes.base,
    textAlign: "center",
    lineHeight: typography.lineHeights.lg,
  },
  section: {
    marginBottom: spacing[8],
  },
  sectionTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semiBold,
    marginBottom: spacing[6],
  },
  themesContainer: {
    paddingHorizontal: spacing[2],
  },
  themeCard: {
    width: 160,
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    marginHorizontal: spacing[2],
    alignItems: "center",
  },
  themePreview: {
    flexDirection: "row",
    marginBottom: spacing[3],
    gap: spacing[1],
  },
  themeColorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  themeName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semiBold,
    marginBottom: spacing[1],
    textAlign: "center",
  },
  themeDescription: {
    fontSize: typography.sizes.xs,
    textAlign: "center",
    lineHeight: typography.lineHeights.sm,
  },
  activeThemeBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing[2],
    gap: spacing[1],
  },
  activeThemeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  colorGroup: {
    marginBottom: spacing[6],
  },
  colorGroupTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    marginBottom: spacing[4],
  },
  colorPickerContainer: {
    marginBottom: spacing[4],
  },
  colorPickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing[2],
  },
  colorLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    flex: 1,
  },
  colorPreview: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.base,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  colorInput: {
    borderWidth: 1,
    borderRadius: borderRadius.base,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    fontSize: typography.sizes.sm,
    fontFamily: "monospace",
  },
  footer: {
    alignItems: "center",
    marginTop: spacing[4],
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
    borderRadius: borderRadius.lg,
    gap: spacing[2],
  },
  resetButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semiBold,
  },
});

export default ColorCustomizer;
