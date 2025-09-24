// Animation System Types
export interface TherapeuticAnimationConfig {
  therapeuticMode?: 'calm' | 'stress' | 'anxiety' | 'depression' | 'positive' | 'negative';
  intensity?: 'gentle' | 'moderate' | 'active';
  duration?: number;
  delay?: number;
  repeat?: boolean | number;
}

export interface CounterAnimationProps {
  from: number;
  to: number;
  duration?: number;
  therapeuticMode?: 'calm' | 'energetic';
  onComplete?: () => void;
}

export interface FloatingElementProps {
  children: React.ReactNode;
  intensity?: 'gentle' | 'moderate' | 'active';
  delay?: number;
}

export interface PulseElementProps {
  children: React.ReactNode;
  therapeuticMode?: 'calm' | 'stress' | 'anxiety';
  size?: number;
}

export interface BreathingCircleProps {
  size?: number;
  therapeuticColor?: string;
}

export interface MoodWaveProps {
  width?: number;
  height?: number;
  therapeuticColor?: string;
}

export interface LoadingSpinnerProps {
  therapeuticColor?: string;
  size?: number;
}

export interface EmotionRippleProps {
  therapeuticColor?: string;
  size?: number;
}

export interface TherapeuticPageTransitionProps {
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
}

// Framer Motion variant types
export type FramerVariants = {
  [key: string]: {
    [key: string]: any;
  };
};

// Anime.js configuration types
export interface AnimeJSConfig {
  targets: any;
  duration?: number;
  easing?: string;
  delay?: number;
  direction?: 'normal' | 'reverse' | 'alternate';
  loop?: boolean | number;
  autoplay?: boolean;
  complete?: () => void;
  update?: (anim: any) => void;
}