import { motion } from "framer-motion";
import React, { useState } from "react";
import { View } from "react-native";
import {
  TextInput as PaperTextInput,
  HelperText,
  useTheme,
} from "react-native-paper";

const AnimatedView = motion(View);
const AnimatedTextInput = motion(PaperTextInput);

export const TextInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  error = false,
  helperText,
  therapeuticColor,
  variant = "outlined",
  size = "medium",
  animationType = "default",
  style,
  ...props
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const getInputColors = () => {
    if (therapeuticColor && theme.colors[therapeuticColor]) {
      const colorPalette = theme.colors[therapeuticColor];
      return {
        activeOutlineColor: colorPalette[60],
        outlineColor: colorPalette[40],
        activeUnderlineColor: colorPalette[60],
        underlineColor: colorPalette[40],
        placeholderTextColor: colorPalette[50],
        selectionColor: colorPalette[30],
      };
    }
    return {
      activeOutlineColor: theme.colors.primary,
      outlineColor: theme.colors.outline,
      activeUnderlineColor: theme.colors.primary,
      underlineColor: theme.colors.onSurfaceVariant,
      placeholderTextColor: theme.colors.onSurfaceVariant,
      selectionColor: theme.colors.primaryContainer,
    };
  };

  const getSizeProps = () => {
    switch (size) {
      case "small":
        return {
          contentStyle: { height: 40 },
          style: { fontSize: 12 },
        };
      case "large":
        return {
          contentStyle: { height: 64 },
          style: { fontSize: 16 },
        };
      default:
        return {
          contentStyle: { height: 56 },
          style: { fontSize: 14 },
        };
    }
  };

  const getAnimationProps = () => {
    switch (animationType) {
      case "slide":
        return {
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.3 },
        };
      case "fade":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.4 },
        };
      default:
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3 },
        };
    }
  };

  const inputColors = getInputColors();
  const sizeProps = getSizeProps();
  const animationProps = getAnimationProps();

  return (
    <AnimatedView {...animationProps} style={[{ marginBottom: 8 }, style]}>
      <AnimatedTextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        mode={variant}
        error={error}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...inputColors}
        {...sizeProps}
        style={[
          {
            backgroundColor: theme.colors.surface,
            borderRadius: variant === "outlined" ? 12 : 0,
          },
          sizeProps.style,
        ]}
        contentStyle={[
          sizeProps.contentStyle,
          {
            paddingHorizontal: 16,
          },
        ]}
        animate={{
          scale: isFocused ? 1.02 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        {...props}
      />
      {helperText && (
        <motion.View
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2 }}
        >
          <HelperText
            type={error ? "error" : "info"}
            visible={!!helperText}
            style={{
              color: error
                ? theme.colors.error
                : therapeuticColor && theme.colors[therapeuticColor]
                  ? theme.colors[therapeuticColor][60]
                  : theme.colors.onSurfaceVariant,
            }}
          >
            {helperText}
          </HelperText>
        </motion.View>
      )}
    </AnimatedView>
  );
};

export const SearchInput = ({
  value,
  onChangeText,
  onSubmit,
  placeholder = "Search...",
  therapeuticColor = "serenityGreen",
  style,
  ...props
}) => {
  const theme = useTheme();

  return (
    <motion.View
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={style}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        therapeuticColor={therapeuticColor}
        left={<PaperTextInput.Icon icon="magnify" />}
        right={
          value ? (
            <PaperTextInput.Icon
              icon="close"
              onPress={() => onChangeText("")}
            />
          ) : null
        }
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        {...props}
      />
    </motion.View>
  );
};

export const TextArea = ({
  value,
  onChangeText,
  placeholder,
  rows = 4,
  therapeuticColor,
  style,
  ...props
}) => {
  return (
    <motion.View
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        therapeuticColor={therapeuticColor}
        multiline
        numberOfLines={rows}
        style={[
          {
            minHeight: rows * 24,
            textAlignVertical: "top",
          },
          style,
        ]}
        {...props}
      />
    </motion.View>
  );
};

export default TextInput;
