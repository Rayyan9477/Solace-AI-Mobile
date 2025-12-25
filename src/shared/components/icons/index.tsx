/**
 * Icons Module - Central export for all icon components
 * Provides a single import point for icons across the app
 *
 * Professional SVG icons for a clean, consistent UI
 */

// Legacy icon components
export { default as MentalHealthIcon } from "./MentalHealthIcon";
export { default as NavigationIcon } from "./NavigationIcon";
export { FreudDiamondLogo, FreudLogo, SolaceLogo } from "./FreudIcons";

// Professional SVG Mood Icons (replacing emojis)
export {
  VeryHappyIcon,
  HappyIcon,
  NeutralIcon,
  SadIcon,
  VerySadIcon,
  AnxiousIcon,
  AngryIcon,
  ExcitedIcon,
  TiredIcon,
  CalmIcon,
  MoodIconMap,
  getMoodIcon,
} from "./MoodIcons";
export type { MoodType } from "./MoodIcons";

// Achievement Icons
export {
  TargetIcon,
  FireIcon,
  ClockIcon,
  SunIcon,
  LotusIcon,
  StrengthIcon,
  MoonIcon,
  CrownIcon,
  StarIcon,
  TrophyIcon,
  AchievementIconMap,
} from "./AchievementIcons";
export type { AchievementType } from "./AchievementIcons";

// Category Icons
export {
  BookIcon,
  MeditationIcon,
  BreathingIcon,
  SleepIcon,
  WaveIcon,
  HeadphonesIcon,
  ArticleIcon,
  VideoIcon,
  BrainIcon,
  HeartIcon,
  PeaceIcon,
  CategoryIconMap,
} from "./CategoryIcons";
export type { CategoryType } from "./CategoryIcons";

// Status Icons
export {
  CheckIcon,
  CelebrationIcon,
  SparkleIcon,
  PartyIcon,
  StarGlowIcon,
  WarningIcon,
  ErrorIcon,
  InfoIcon,
  ProgressIcon,
  TrendUpIcon,
  SelfCareIcon,
  StatusIconMap,
} from "./StatusIcons";
export type { StatusType } from "./StatusIcons";

// Re-export for convenience
export { default } from "./MentalHealthIcon";
