/**
 * Typography Components - Semantic text components
 * Provides consistent typography throughout the app
 */

import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { typography, TypographyVariant } from '../../theme/typography';
import { colors } from '../../theme/colors';

export interface TypographyProps {
  children: React.ReactNode;
  variant?: TypographyVariant;
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  numberOfLines?: number;
  style?: TextStyle;
  accessibilityLabel?: string;
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body',
  color,
  align = 'left',
  numberOfLines,
  style,
  accessibilityLabel,
}) => {
  const textStyle = [
    typography[variant],
    { color: color || colors.semantic.onSurface },
    { textAlign: align },
    style,
  ];

  return (
    <Text
      style={textStyle}
      numberOfLines={numberOfLines}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="text"
    >
      {children}
    </Text>
  );
};

// Specialized Typography Components
export const Display: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="display" {...props} />
);

export const H1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h1" {...props} />
);

export const H2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h2" {...props} />
);

export const H3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h3" {...props} />
);

export const H4: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h4" {...props} />
);

export const Body: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body" {...props} />
);

export const BodyLarge: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="bodyLarge" {...props} />
);

export const BodySmall: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="bodySmall" {...props} />
);

export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="caption" {...props} />
);

export const Overline: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="overline" {...props} />
);

export const Label: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="labelMedium" {...props} />
);

export const LabelLarge: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="labelLarge" {...props} />
);

export const LabelSmall: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="labelSmall" {...props} />
);

export default Typography;
