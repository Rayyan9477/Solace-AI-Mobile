import React from 'react';
import { Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { motion } from 'framer-motion/native';

const AnimatedText = motion(Text);

export const Typography = ({
  variant = 'bodyMedium',
  children,
  therapeuticColor,
  color,
  align = 'left',
  animationType = 'default',
  style,
  ...props
}) => {
  const theme = useTheme();

  const getTextColor = () => {
    if (color) return color;
    if (therapeuticColor && theme.colors[therapeuticColor]) {
      return theme.colors[therapeuticColor][60];
    }
    return theme.colors.onSurface;
  };

  const getAnimationProps = () => {
    switch (animationType) {
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.4 }
        };
      case 'slide':
        return {
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.3 }
        };
      case 'bounce':
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          transition: { type: 'spring', stiffness: 500, damping: 20 }
        };
      default:
        return {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3 }
        };
    }
  };

  const animationProps = getAnimationProps();

  return (
    <AnimatedText
      {...animationProps}
      style={[
        theme.fonts[variant],
        {
          color: getTextColor(),
          textAlign: align
        },
        style
      ]}
      {...props}
    >
      {children}
    </AnimatedText>
  );
};

export const Heading = ({ level = 1, children, ...props }) => {
  const variantMap = {
    1: 'headingExtraLarge',
    2: 'headingLarge',
    3: 'headingMedium',
    4: 'headingSmall'
  };

  return (
    <Typography
      variant={variantMap[level] || 'headingSmall'}
      animationType="bounce"
      {...props}
    >
      {children}
    </Typography>
  );
};

export const Body = ({ size = 'medium', children, ...props }) => {
  const variantMap = {
    large: 'bodyLarge',
    medium: 'bodyMedium',
    small: 'bodySmall'
  };

  return (
    <Typography
      variant={variantMap[size]}
      animationType="fade"
      {...props}
    >
      {children}
    </Typography>
  );
};

export const Label = ({ size = 'medium', children, ...props }) => {
  const variantMap = {
    large: 'labelLarge',
    medium: 'labelMedium',
    small: 'labelSmall'
  };

  return (
    <Typography
      variant={variantMap[size]}
      animationType="slide"
      {...props}
    >
      {children}
    </Typography>
  );
};

export const TherapeuticText = ({
  emotion = 'calm',
  children,
  emphasize = false,
  ...props
}) => {
  const emotionColorMap = {
    calm: 'serenityGreen',
    stress: 'empathyOrange',
    anxiety: 'zenYellow',
    depression: 'kindPurple',
    positive: 'serenityGreen',
    negative: 'empathyOrange'
  };

  return (
    <Typography
      therapeuticColor={emotionColorMap[emotion]}
      variant={emphasize ? 'headingSmall' : 'bodyMedium'}
      animationType="bounce"
      {...props}
    >
      {children}
    </Typography>
  );
};

export default Typography;