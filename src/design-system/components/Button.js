import React from 'react';
import { Button as PaperButton } from 'react-native-paper';
import { motion } from 'framer-motion/native';
import { useTheme } from 'react-native-paper';

const AnimatedButton = motion(PaperButton);

export const Button = ({
  variant = 'filled',
  size = 'medium',
  children,
  onPress,
  disabled = false,
  icon,
  style,
  contentStyle,
  labelStyle,
  therapeuticColor,
  animationType = 'default',
  ...props
}) => {
  const theme = useTheme();

  const getButtonColors = () => {
    if (therapeuticColor && theme.colors[therapeuticColor]) {
      const colorPalette = theme.colors[therapeuticColor];
      switch (variant) {
        case 'filled':
          return {
            buttonColor: colorPalette[60],
            textColor: colorPalette[10]
          };
        case 'outlined':
          return {
            buttonColor: 'transparent',
            textColor: colorPalette[60]
          };
        case 'text':
          return {
            buttonColor: 'transparent',
            textColor: colorPalette[60]
          };
        default:
          return {};
      }
    }
    return {};
  };

  const getSizeProps = () => {
    switch (size) {
      case 'small':
        return {
          contentStyle: { height: 32, ...contentStyle },
          labelStyle: { fontSize: 12, ...labelStyle }
        };
      case 'large':
        return {
          contentStyle: { height: 56, ...contentStyle },
          labelStyle: { fontSize: 16, ...labelStyle }
        };
      default:
        return {
          contentStyle: { height: 40, ...contentStyle },
          labelStyle: { fontSize: 14, ...labelStyle }
        };
    }
  };

  const getAnimationProps = () => {
    switch (animationType) {
      case 'scale':
        return {
          whileTap: { scale: 0.95 },
          transition: { type: 'spring', stiffness: 400, damping: 17 }
        };
      case 'bounce':
        return {
          whileTap: { scale: 0.9 },
          transition: { type: 'spring', stiffness: 600, damping: 10 }
        };
      case 'slide':
        return {
          whileTap: { y: 2 },
          transition: { type: 'spring', stiffness: 400, damping: 17 }
        };
      default:
        return {
          whileTap: { scale: 0.98 },
          transition: { type: 'spring', stiffness: 300, damping: 20 }
        };
    }
  };

  const buttonColors = getButtonColors();
  const sizeProps = getSizeProps();
  const animationProps = getAnimationProps();

  return (
    <AnimatedButton
      mode={variant}
      onPress={onPress}
      disabled={disabled}
      icon={icon}
      {...buttonColors}
      {...sizeProps}
      {...animationProps}
      style={[
        {
          borderRadius: 12,
          ...(variant === 'outlined' && therapeuticColor && {
            borderColor: theme.colors[therapeuticColor]?.[60] || theme.colors.outline
          })
        },
        style
      ]}
      {...props}
    >
      {children}
    </AnimatedButton>
  );
};

export const ButtonGroup = ({ children, orientation = 'horizontal', spacing = 8, style }) => {
  return (
    <motion.View
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={[
        {
          flexDirection: orientation === 'horizontal' ? 'row' : 'column',
          gap: spacing,
          flexWrap: 'wrap'
        },
        style
      ]}
    >
      {children}
    </motion.View>
  );
};

export default Button;