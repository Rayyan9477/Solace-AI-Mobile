// Design System Type Definitions
// Note: Component type files not yet created
// export * from '../components/atoms/Button.types';
// export * from '../components/atoms/Card.types';
// export * from '../components/atoms/Input.types';
// export * from '../components/atoms/Typography.types';

// Common types used across design system
export type TherapeuticColorPalette =
  | 'serenityGreen'
  | 'empathyOrange'
  | 'kindPurple'
  | 'zenYellow'
  | 'optimisticGray';

export type AnimationMode = 'default' | 'gentle' | 'calm' | 'energetic' | 'soothing' | 'mindful';

export type ComponentSize = 'small' | 'medium' | 'large';

export type ComponentVariant = 'filled' | 'outlined' | 'text' | 'elevated';

// Animation system types
export interface TherapeuticAnimationProps {
  therapeuticMode?: 'calm' | 'stress' | 'anxiety' | 'depression';
  intensity?: 'gentle' | 'moderate' | 'active';
  duration?: number;
  delay?: number;
}

// Layout types
export interface LayoutProps {
  children: React.ReactNode;
  therapeuticColor?: TherapeuticColorPalette;
  gradient?: boolean;
  padding?: number;
  safe?: boolean;
  scrollable?: boolean;
  animationType?: 'default' | 'slide' | 'fade' | 'scale';
  style?: any;
}

// Mental health specific types
export type MoodType = 'happy' | 'sad' | 'anxious' | 'calm' | 'stressed' | 'excited' | 'angry' | 'peaceful';

export type EmotionIntensity = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface MentalHealthState {
  currentMood: MoodType;
  intensity: EmotionIntensity;
  timestamp: Date;
  notes?: string;
}