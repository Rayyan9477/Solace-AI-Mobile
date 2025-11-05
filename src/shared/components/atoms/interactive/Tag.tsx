import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { getTherapeuticColor } from "../../shared/theme/ColorPalette";
import { useTheme } from "../../shared/theme/ThemeContext";
import { MentalHealthIcon } from "../icons";

const Tag = ({
  label = "",
  variant = "default",
  size = "medium",
  icon,
  onPress,
  onRemove,
  selected = false,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const { theme } = useTheme();

  const getTagColors = () => {
    if (disabled) {
      return {
        background: theme.colors.gray["100"],
        text: theme.colors.gray["400"],
        border: theme.colors.gray["200"],
      };
    }

    const baseColors = {
      default: theme.colors.primary,
      calming: theme.colors.therapeutic.calming,
      nurturing: theme.colors.therapeutic.nurturing,
      peaceful: theme.colors.therapeutic.peaceful,
      grounding: theme.colors.therapeutic.grounding,
      energizing: theme.colors.therapeutic.energizing,
    };

    const colorSet = baseColors[variant] || baseColors.default;

    return {
      background: selected ? colorSet[500] : colorSet[50],
      text: selected ? theme.colors.background.primary : colorSet[700],
      border: colorSet[200],
    };
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          paddingHorizontal: 8,
          paddingVertical: 4,
          fontSize: 12,
          iconSize: 12,
        };
      case "large":
        return {
          paddingHorizontal: 16,
          paddingVertical: 8,
          fontSize: 16,
          iconSize: 18,
        };
      default: // medium
        return {
          paddingHorizontal: 12,
          paddingVertical: 6,
          fontSize: 14,
          iconSize: 16,
        };
    }
  };

  const colors = getTagColors();
  const sizeStyles = getSizeStyles();
  const isInteractive = onPress || onRemove;

  const TagContent = () => (
    <View
      style={[
        styles.tag,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          paddingVertical: sizeStyles.paddingVertical,
        },
      ]}
    >
      {icon && (
        <MentalHealthIcon
          name={icon}
          size={sizeStyles.iconSize}
          color={colors.text}
          variant={selected ? "filled" : "outline"}
          style={styles.icon}
        />
      )}

      <Text
        style={[
          styles.tagText,
          {
            color: colors.text,
            fontSize: sizeStyles.fontSize,
          },
        ]}
      >
        {label}
      </Text>

      {onRemove && (
        <TouchableOpacity
          onPress={onRemove}
          style={styles.removeButton}
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${label} tag`}
        >
          <Text style={[styles.removeIcon, { color: colors.text }]}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (isInteractive) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        accessibilityLabel={accessibilityLabel || label}
        accessibilityHint={accessibilityHint || `Tag: ${label}`}
      >
        <TagContent />
      </TouchableOpacity>
    );
  }

  return <TagContent />;
};

const TagGroup = ({
  tags = [],
  onTagPress,
  onTagRemove,
  selectedTags = [],
  variant = "default",
  size = "medium",
  maxTags,
  showMore = false,
  onShowMore,
}) => {
  const { theme } = useTheme();
  const displayTags = maxTags ? tags.slice(0, maxTags) : tags;
  const remainingCount = tags.length - displayTags.length;

  return (
    <View style={styles.tagGroup}>
      {displayTags.map((tag, index) => (
        <View key={tag.id || tag.label || index} style={styles.tagWrapper}>
          <Tag
            label={tag.label}
            variant={tag.variant || variant}
            size={size}
            icon={tag.icon}
            selected={selectedTags.includes(tag.id || tag.label)}
            onPress={() => onTagPress && onTagPress(tag)}
            onRemove={() => onTagRemove && onTagRemove(tag)}
            disabled={tag.disabled}
          />
        </View>
      ))}

      {remainingCount > 0 && (
        <TouchableOpacity
          style={[
            styles.tag,
            styles.moreTag,
            {
              backgroundColor: theme.colors.gray["100"],
              borderColor: theme.colors.gray["200"],
            },
          ]}
          onPress={onShowMore}
          accessibilityRole="button"
          accessibilityLabel={`Show ${remainingCount} more tags`}
        >
          <Text style={[styles.tagText, { color: theme.colors.gray["600"] }]}>
            +{remainingCount}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    alignSelf: "flex-start",
    minHeight: 28,
  },
  tagText: {
    fontWeight: "500",
    textAlign: "center",
  },
  icon: {
    marginRight: 6,
  },
  removeButton: {
    marginLeft: 6,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  removeIcon: {
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 14,
  },
  tagGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  tagWrapper: {
    marginRight: 8,
    marginBottom: 8,
  },
  moreTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});

// Export both individual Tag and TagGroup
export { TagGroup };
export default Tag;
