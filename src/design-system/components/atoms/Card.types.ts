// TypeScript interfaces for Card components
export interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'filled' | 'outlined';
  therapeuticColor?: 'serenityGreen' | 'empathyOrange' | 'kindPurple' | 'zenYellow' | 'optimisticGray';
  gradient?: boolean;
  padding?: number;
  borderRadius?: number;
  animationType?: 'default' | 'hover' | 'slide' | 'fade';
  onPress?: () => void;
  style?: any;
}

export interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  avatar?: React.ReactNode;
  action?: React.ReactNode;
  style?: any;
}

export interface CardContentProps {
  children: React.ReactNode;
  style?: any;
}

export interface CardActionsProps {
  children: React.ReactNode;
  alignment?: 'left' | 'center' | 'right';
  style?: any;
}