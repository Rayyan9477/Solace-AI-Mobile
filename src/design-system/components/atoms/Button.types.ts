// TypeScript interfaces for Button components
export interface ButtonProps {
  variant?: 'filled' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  icon?: string;
  therapeuticColor?: 'serenityGreen' | 'empathyOrange' | 'kindPurple' | 'zenYellow' | 'optimisticGray';
  animationType?: 'default' | 'scale' | 'bounce' | 'slide';
  style?: any;
  contentStyle?: any;
  labelStyle?: any;
}

export interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  spacing?: number;
  style?: any;
}