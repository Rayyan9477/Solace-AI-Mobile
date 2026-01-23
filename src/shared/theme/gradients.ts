/**
 * Gradient Tokens
 * @description Therapeutic gradient presets for mental health application
 * @task Task 1.1.2: Add Gradient Definitions
 *
 * Provides calming, wellness-focused gradient definitions
 * compatible with expo-linear-gradient component.
 */

/**
 * Gradient direction type
 * Defines the flow direction of the gradient
 */
export type GradientDirection = "vertical" | "horizontal" | "diagonal";

/**
 * Gradient configuration interface
 * Defines the structure of each gradient preset
 */
export interface GradientConfig {
  /** Array of hex color values (minimum 2) */
  colors: string[];
  /** Direction of the gradient flow */
  direction: GradientDirection;
  /** Optional color stop positions (0-1), must match colors length */
  locations?: number[];
}

/**
 * Gradient preset names
 * Therapeutic presets designed for mental wellness context
 */
export type GradientPreset =
  | "morning"
  | "calming"
  | "energizing"
  | "grounding"
  | "therapeutic"
  | "crisis";

/**
 * Expo LinearGradient compatible props
 */
export interface LinearGradientProps {
  /** Array of colors for the gradient */
  colors: string[];
  /** Starting point of the gradient (normalized 0-1) */
  start: { x: number; y: number };
  /** Ending point of the gradient (normalized 0-1) */
  end: { x: number; y: number };
  /** Optional color stop positions */
  locations?: number[];
}

/**
 * Gradient presets object
 * Contains all therapeutic gradient definitions
 */
export const gradients: Record<GradientPreset, GradientConfig> = {
  /**
   * Morning gradient - warm, optimistic tones
   * Use for: Welcome screens, positive affirmations, new day features
   */
  morning: {
    colors: ["#FFF4E0", "#FFE8C2", "#F7F4F2"],
    direction: "vertical",
    locations: [0, 0.5, 1],
  },

  /**
   * Calming gradient - soft, peaceful tones
   * Use for: Meditation, breathing exercises, relaxation content
   */
  calming: {
    colors: ["#E5EAD7", "#DDD0FF", "#F0F1FF"],
    direction: "vertical",
    locations: [0, 0.5, 1],
  },

  /**
   * Energizing gradient - warm, vibrant tones
   * Use for: Activity prompts, motivation, achievement celebrations
   */
  energizing: {
    colors: ["#FFEEE2", "#FFE8C2", "#FFD88F"],
    direction: "diagonal",
    locations: [0, 0.5, 1],
  },

  /**
   * Grounding gradient - earthy, stable tones
   * Use for: Mindfulness exercises, journaling, reflection
   */
  grounding: {
    colors: ["#F7F4F2", "#E8D0D9", "#DDC2B8"],
    direction: "vertical",
    locations: [0, 0.5, 1],
  },

  /**
   * Therapeutic gradient - multi-palette calm
   * Use for: Therapy sessions, guided exercises, self-care
   */
  therapeutic: {
    colors: ["#F2F5EB", "#F0F1FF", "#F7F4F2"],
    direction: "horizontal",
    locations: [0, 0.5, 1],
  },

  /**
   * Crisis gradient - high-visibility safety gradient
   * Use for: Crisis alerts, emergency resources, urgent notifications
   * Designed for maximum visibility and immediate attention
   */
  crisis: {
    colors: ["#FEE2E2", "#FECACA", "#FCA5A5"],
    direction: "vertical",
    locations: [0, 0.5, 1],
  },
};

/**
 * Direction to coordinate mapping
 * Converts direction names to expo-linear-gradient start/end points
 */
const directionCoordinates: Record<
  GradientDirection,
  { start: { x: number; y: number }; end: { x: number; y: number } }
> = {
  /** Vertical: top to bottom */
  vertical: {
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
  /** Horizontal: left to right */
  horizontal: {
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
  },
  /** Diagonal: top-left to bottom-right */
  diagonal: {
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
};

/**
 * Get gradient props for expo-linear-gradient
 * Converts gradient config to LinearGradient component props
 *
 * @param preset - The gradient preset name
 * @returns LinearGradientProps compatible with expo-linear-gradient
 *
 * @example
 * ```tsx
 * import { LinearGradient } from 'expo-linear-gradient';
 * import { getGradientProps } from '@/shared/theme/gradients';
 *
 * function CalmingBackground({ children }) {
 *   return (
 *     <LinearGradient
 *       {...getGradientProps('calming')}
 *       style={{ flex: 1 }}
 *     >
 *       {children}
 *     </LinearGradient>
 *   );
 * }
 * ```
 */
export function getGradientProps(preset: GradientPreset): LinearGradientProps {
  const config = gradients[preset];
  const coordinates = directionCoordinates[config.direction];

  const props: LinearGradientProps = {
    colors: config.colors,
    start: coordinates.start,
    end: coordinates.end,
  };

  // Include locations if defined
  if (config.locations) {
    props.locations = config.locations;
  }

  return props;
}

export default gradients;
