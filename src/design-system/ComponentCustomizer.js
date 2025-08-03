import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Slider,
  Switch,
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

const ComponentCustomizer = () => {
  const { theme } = useTheme();
  const { designTokens, updateTokens, resetToDefault } = useDesignSystem();

  const [customizations, setCustomizations] = useState({
    borderRadius: {
      small: designTokens.borderRadius.sm,
      medium: designTokens.borderRadius.md,
      large: designTokens.borderRadius.lg,
    },
    spacing: {
      small: designTokens.spacing[2],
      medium: designTokens.spacing[4],
      large: designTokens.spacing[6],
    },
    typography: {
      small: designTokens.typography.sizes.sm,
      medium: designTokens.typography.sizes.base,
      large: designTokens.typography.sizes.lg,
    },
    shadows: {
      enabled: true,
      intensity: 0.15,
    },
    animations: {
      enabled: true,
      speed: 250,
    },
  });

  const [previewComponent, setPreviewComponent] = useState("button");

  useEffect(() => {
    // Update design tokens when customizations change
    updateTokens({
      borderRadius: {
        sm: customizations.borderRadius.small,
        md: customizations.borderRadius.medium,
        lg: customizations.borderRadius.large,
      },
      spacing: {
        2: customizations.spacing.small,
        4: customizations.spacing.medium,
        6: customizations.spacing.large,
      },
      typography: {
        sizes: {
          sm: customizations.typography.small,
          base: customizations.typography.medium,
          lg: customizations.typography.large,
        },
      },
      animation: {
        timing: {
          base: customizations.animations.speed,
        },
      },
    });
  }, [customizations, updateTokens]);

  const handleCustomizationChange = (category, property, value) => {
    setCustomizations((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [property]: value,
      },
    }));
  };

  const resetCustomizations = () => {
    Alert.alert(
      "Reset Customizations",
      "Are you sure you want to reset all component customizations?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            resetToDefault();
            setCustomizations({
              borderRadius: {
                small: designTokens.borderRadius.sm,
                medium: designTokens.borderRadius.md,
                large: designTokens.borderRadius.lg,
              },
              spacing: {
                small: designTokens.spacing[2],
                medium: designTokens.spacing[4],
                large: designTokens.spacing[6],
              },
              typography: {
                small: designTokens.typography.sizes.sm,
                medium: designTokens.typography.sizes.base,
                large: designTokens.typography.sizes.lg,
              },
              shadows: {
                enabled: true,
                intensity: 0.15,
              },
              animations: {
                enabled: true,
                speed: 250,
              },
            });
            Alert.alert(
              "Reset Complete",
              "All customizations have been reset to default values.",
            );
          },
        },
      ],
    );
  };

  // Preview components
  const PreviewButton = () => (
    <TouchableOpacity
      style={[
        {
          backgroundColor: theme.colors.primary[500],
          paddingVertical: customizations.spacing.medium,
          paddingHorizontal: customizations.spacing.large,
          borderRadius: customizations.borderRadius.medium,
          alignItems: "center",
          marginVertical: spacing[2],
        },
        customizations.shadows.enabled && {
          ...shadows.md,
          shadowOpacity: customizations.shadows.intensity,
        },
      ]}
    >
      <Text
        style={{
          color: theme.colors.text.inverse,
          fontSize: customizations.typography.medium,
          fontWeight: typography.weights.semiBold,
        }}
      >
        Preview Button
      </Text>
    </TouchableOpacity>
  );

  const PreviewCard = () => (
    <View
      style={[
        {
          backgroundColor: theme.colors.background.primary,
          padding: customizations.spacing.large,
          borderRadius: customizations.borderRadius.large,
          marginVertical: spacing[2],
          borderWidth: 1,
          borderColor: theme.colors.border.primary,
        },
        customizations.shadows.enabled && {
          ...shadows.lg,
          shadowOpacity: customizations.shadows.intensity,
        },
      ]}
    >
      <Text
        style={{
          fontSize: customizations.typography.large,
          fontWeight: typography.weights.semiBold,
          color: theme.colors.text.primary,
          marginBottom: customizations.spacing.small,
        }}
      >
        Preview Card
      </Text>
      <Text
        style={{
          fontSize: customizations.typography.small,
          color: theme.colors.text.secondary,
          lineHeight: customizations.typography.small * 1.5,
        }}
      >
        This is a preview of how cards will look with your customizations
        applied.
      </Text>
    </View>
  );

  const PreviewInput = () => (
    <View
      style={{
        backgroundColor: theme.colors.background.secondary,
        paddingVertical: customizations.spacing.medium,
        paddingHorizontal: customizations.spacing.medium,
        borderRadius: customizations.borderRadius.small,
        borderWidth: 1,
        borderColor: theme.colors.border.primary,
        marginVertical: spacing[2],
      }}
    >
      <Text
        style={{
          fontSize: customizations.typography.medium,
          color: theme.colors.text.tertiary,
        }}
      >
        Preview input field...
      </Text>
    </View>
  );

  const CustomizationSlider = ({
    label,
    value,
    onValueChange,
    minimumValue = 0,
    maximumValue = 100,
    step = 1,
  }) => (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderHeader}>
        <Text
          style={[styles.sliderLabel, { color: theme.colors.text.primary }]}
        >
          {label}
        </Text>
        <Text
          style={[styles.sliderValue, { color: theme.colors.text.secondary }]}
        >
          {typeof value === "number" ? Math.round(value) : value}
        </Text>
      </View>
      <Slider
        style={styles.slider}
        value={value}
        onValueChange={onValueChange}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        minimumTrackTintColor={theme.colors.primary[500]}
        maximumTrackTintColor={theme.colors.gray[300]}
        thumbStyle={{ backgroundColor: theme.colors.primary[500] }}
      />
    </View>
  );

  const CustomizationSwitch = ({ label, value, onValueChange }) => (
    <View style={styles.switchContainer}>
      <Text style={[styles.switchLabel, { color: theme.colors.text.primary }]}>
        {label}
      </Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: theme.colors.gray[300],
          true: theme.colors.primary[500],
        }}
        thumbColor={value ? theme.colors.primary[500] : theme.colors.gray[400]}
      />
    </View>
  );

  const ComponentPreview = () => {
    switch (previewComponent) {
      case "button":
        return <PreviewButton />;
      case "card":
        return <PreviewCard />;
      case "input":
        return <PreviewInput />;
      default:
        return <PreviewButton />;
    }
  };

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
        <MentalHealthIcon name="Brain" size="lg" colorScheme="grounding" />
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Component Customization
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          Customize spacing, typography, and visual elements
        </Text>
      </View>

      {/* Preview Section */}
      <View style={styles.section}>
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
        >
          Live Preview
        </Text>

        {/* Component Selector */}
        <View style={styles.componentSelector}>
          {["button", "card", "input"].map((component) => (
            <TouchableOpacity
              key={component}
              style={[
                styles.componentSelectorButton,
                {
                  backgroundColor:
                    previewComponent === component
                      ? theme.colors.primary[500]
                      : theme.colors.background.secondary,
                  borderColor: theme.colors.border.primary,
                },
              ]}
              onPress={() => setPreviewComponent(component)}
            >
              <Text
                style={[
                  styles.componentSelectorText,
                  {
                    color:
                      previewComponent === component
                        ? theme.colors.text.inverse
                        : theme.colors.text.primary,
                  },
                ]}
              >
                {component.charAt(0).toUpperCase() + component.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Preview Component */}
        <View
          style={[
            styles.previewContainer,
            {
              backgroundColor: theme.colors.background.secondary,
              borderColor: theme.colors.border.primary,
            },
          ]}
        >
          <ComponentPreview />
        </View>
      </View>

      {/* Border Radius Customization */}
      <View style={styles.section}>
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
        >
          Border Radius
        </Text>

        <CustomizationSlider
          label="Small Components"
          value={customizations.borderRadius.small}
          onValueChange={(value) =>
            handleCustomizationChange("borderRadius", "small", value)
          }
          minimumValue={0}
          maximumValue={20}
          step={1}
        />

        <CustomizationSlider
          label="Medium Components"
          value={customizations.borderRadius.medium}
          onValueChange={(value) =>
            handleCustomizationChange("borderRadius", "medium", value)
          }
          minimumValue={0}
          maximumValue={30}
          step={1}
        />

        <CustomizationSlider
          label="Large Components"
          value={customizations.borderRadius.large}
          onValueChange={(value) =>
            handleCustomizationChange("borderRadius", "large", value)
          }
          minimumValue={0}
          maximumValue={40}
          step={1}
        />
      </View>

      {/* Spacing Customization */}
      <View style={styles.section}>
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
        >
          Spacing & Padding
        </Text>

        <CustomizationSlider
          label="Small Spacing"
          value={customizations.spacing.small}
          onValueChange={(value) =>
            handleCustomizationChange("spacing", "small", value)
          }
          minimumValue={4}
          maximumValue={16}
          step={2}
        />

        <CustomizationSlider
          label="Medium Spacing"
          value={customizations.spacing.medium}
          onValueChange={(value) =>
            handleCustomizationChange("spacing", "medium", value)
          }
          minimumValue={8}
          maximumValue={32}
          step={2}
        />

        <CustomizationSlider
          label="Large Spacing"
          value={customizations.spacing.large}
          onValueChange={(value) =>
            handleCustomizationChange("spacing", "large", value)
          }
          minimumValue={16}
          maximumValue={48}
          step={2}
        />
      </View>

      {/* Typography Customization */}
      <View style={styles.section}>
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
        >
          Typography Sizes
        </Text>

        <CustomizationSlider
          label="Small Text"
          value={customizations.typography.small}
          onValueChange={(value) =>
            handleCustomizationChange("typography", "small", value)
          }
          minimumValue={10}
          maximumValue={16}
          step={1}
        />

        <CustomizationSlider
          label="Medium Text"
          value={customizations.typography.medium}
          onValueChange={(value) =>
            handleCustomizationChange("typography", "medium", value)
          }
          minimumValue={14}
          maximumValue={20}
          step={1}
        />

        <CustomizationSlider
          label="Large Text"
          value={customizations.typography.large}
          onValueChange={(value) =>
            handleCustomizationChange("typography", "large", value)
          }
          minimumValue={16}
          maximumValue={24}
          step={1}
        />
      </View>

      {/* Visual Effects */}
      <View style={styles.section}>
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
        >
          Visual Effects
        </Text>

        <CustomizationSwitch
          label="Enable Shadows"
          value={customizations.shadows.enabled}
          onValueChange={(value) =>
            handleCustomizationChange("shadows", "enabled", value)
          }
        />

        {customizations.shadows.enabled && (
          <CustomizationSlider
            label="Shadow Intensity"
            value={customizations.shadows.intensity}
            onValueChange={(value) =>
              handleCustomizationChange("shadows", "intensity", value)
            }
            minimumValue={0.05}
            maximumValue={0.3}
            step={0.05}
          />
        )}

        <CustomizationSwitch
          label="Enable Animations"
          value={customizations.animations.enabled}
          onValueChange={(value) =>
            handleCustomizationChange("animations", "enabled", value)
          }
        />

        {customizations.animations.enabled && (
          <CustomizationSlider
            label="Animation Speed (ms)"
            value={customizations.animations.speed}
            onValueChange={(value) =>
              handleCustomizationChange("animations", "speed", value)
            }
            minimumValue={100}
            maximumValue={1000}
            step={50}
          />
        )}
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
          onPress={resetCustomizations}
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
            Reset All Customizations
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
  componentSelector: {
    flexDirection: "row",
    marginBottom: spacing[4],
    gap: spacing[2],
  },
  componentSelectorButton: {
    flex: 1,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.base,
    borderWidth: 1,
    alignItems: "center",
  },
  componentSelectorText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  previewContainer: {
    padding: spacing[6],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    minHeight: 120,
    justifyContent: "center",
  },
  sliderContainer: {
    marginBottom: spacing[6],
  },
  sliderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing[2],
  },
  sliderLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  sliderValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semiBold,
  },
  slider: {
    height: 40,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing[4],
    paddingVertical: spacing[2],
  },
  switchLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    flex: 1,
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

export default ComponentCustomizer;
