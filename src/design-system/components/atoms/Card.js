import { motion } from "framer-motion/native";
import React from "react";
import { View } from "react-native";
import { Card as PaperCard, useTheme } from "react-native-paper";

const AnimatedCard = motion(PaperCard);
const AnimatedView = motion(View);

export const Card = ({
  children,
  variant = "elevated",
  therapeuticColor,
  gradient = false,
  padding = 16,
  borderRadius = 12,
  animationType = "default",
  onPress,
  style,
  ...props
}) => {
  const theme = useTheme();

  const getCardColors = () => {
    if (therapeuticColor && theme.colors[therapeuticColor]) {
      const colorPalette = theme.colors[therapeuticColor];
      return {
        backgroundColor: colorPalette[10],
        borderColor: colorPalette[30],
      };
    }
    return {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.outline,
    };
  };

  const getAnimationProps = () => {
    switch (animationType) {
      case "hover":
        return {
          whileHover: { scale: 1.02, y: -2 },
          whileTap: { scale: 0.98 },
          transition: { type: "spring", stiffness: 300, damping: 20 },
        };
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

  const cardColors = getCardColors();
  const animationProps = getAnimationProps();

  const CardComponent = onPress ? AnimatedCard : AnimatedView;

  return (
    <CardComponent
      mode={variant}
      onPress={onPress}
      {...animationProps}
      style={[
        {
          borderRadius,
          padding,
          ...cardColors,
          ...(variant === "outlined" && {
            borderWidth: 1,
            elevation: 0,
          }),
        },
        style,
      ]}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

export const CardHeader = ({ title, subtitle, avatar, action, style }) => {
  const theme = useTheme();

  return (
    <motion.View
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
        },
        style,
      ]}
    >
      {avatar && (
        <motion.View
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          style={{ marginRight: 12 }}
        >
          {avatar}
        </motion.View>
      )}
      <View style={{ flex: 1 }}>
        {title && (
          <motion.Text
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={[
              theme.fonts.headingSmall,
              { color: theme.colors.onSurface },
            ]}
          >
            {title}
          </motion.Text>
        )}
        {subtitle && (
          <motion.Text
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={[
              theme.fonts.bodyMedium,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {subtitle}
          </motion.Text>
        )}
      </View>
      {action && (
        <motion.View
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {action}
        </motion.View>
      )}
    </motion.View>
  );
};

export const CardContent = ({ children, style }) => {
  return (
    <motion.View
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      style={[{ flex: 1 }, style]}
    >
      {children}
    </motion.View>
  );
};

export const CardActions = ({ children, alignment = "right", style }) => {
  return (
    <motion.View
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      style={[
        {
          flexDirection: "row",
          justifyContent:
            alignment === "left"
              ? "flex-start"
              : alignment === "center"
                ? "center"
                : "flex-end",
          marginTop: 16,
          gap: 8,
        },
        style,
      ]}
    >
      {children}
    </motion.View>
  );
};

export default Card;
