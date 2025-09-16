// TypeScript interfaces for Typography components
export type TypographyVariant =
  | 'headingExtraLarge'
  | 'headingLarge'
  | 'headingMedium'
  | 'headingSmall'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall'
  | 'labelLarge'
  | 'labelMedium'
  | 'labelSmall';

export type TherapeuticColor =
  | 'serenityGreen'
  | 'empathyOrange'
  | 'kindPurple'
  | 'zenYellow'
  | 'optimisticGray';

export type AnimationType = 'default' | 'fade' | 'slide' | 'bounce';

export interface TypographyProps {
  variant?: TypographyVariant;
  children: React.ReactNode;
  therapeuticColor?: TherapeuticColor;
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  animationType?: AnimationType;
  style?: any;
}

export interface HeadingProps extends Omit<TypographyProps, 'variant'> {
  level?: 1 | 2 | 3 | 4;
}

export interface BodyProps extends Omit<TypographyProps, 'variant'> {
  size?: 'large' | 'medium' | 'small';
}

export interface LabelProps extends Omit<TypographyProps, 'variant'> {
  size?: 'large' | 'medium' | 'small';
}

export interface TherapeuticTextProps extends Omit<TypographyProps, 'therapeuticColor'> {
  emotion?: 'calm' | 'stress' | 'anxiety' | 'depression' | 'positive' | 'negative';
  emphasize?: boolean;
}