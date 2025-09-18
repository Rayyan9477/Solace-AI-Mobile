/**
 * Global App Types
 * Central location for app-wide TypeScript definitions
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  profile: UserProfile;
  preferences: UserPreferences;
}

export interface UserProfile {
  name: string;
  age?: number;
  location?: string;
  timezone?: string;
  emergencyContact?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  soundEnabled: boolean;
  reducedMotion: boolean;
  language: string;
  therapeuticMode: string;
}

export interface MoodEntry {
  id: string;
  userId: string;
  mood: MoodType;
  intensity: number;
  timestamp: string;
  notes?: string;
  activities?: string[];
  triggers?: string[];
}

export type MoodType =
  | 'happy'
  | 'sad'
  | 'anxious'
  | 'calm'
  | 'angry'
  | 'excited'
  | 'peaceful'
  | 'stressed'
  | 'energetic'
  | 'depressed';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  emotion?: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  type: 'image' | 'audio' | 'document';
  url: string;
  name: string;
  size: number;
}

export interface TherapySession {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  messages: ChatMessage[];
  summary?: string;
  insights?: string[];
  mood?: MoodEntry;
}

export interface NavigationProps {
  navigation: any;
  route: any;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  error: string;
  success: string;
  warning: string;
}

export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  stagger?: number;
}