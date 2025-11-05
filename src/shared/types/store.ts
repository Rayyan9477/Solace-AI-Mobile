/**
 * Redux Store Type Definitions
 * Comprehensive type definitions for the Solace AI Redux store
 */

// =============================================================================
// Common Types
// =============================================================================

export interface AsyncState {
  loading: boolean;
  error: string | null;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export type LoadingStatus = "idle" | "loading" | "succeeded" | "failed";

// =============================================================================
// Auth Slice Types
// =============================================================================

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  userType: "user" | "professional";
  verified: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthState extends AsyncState {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  sessionExpiry: number | null;
}

// =============================================================================
// User Slice Types
// =============================================================================

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface UserProfile {
  id: string | null;
  name: string;
  email: string;
  avatar: string | null;
  phoneNumber: string;
  dateOfBirth: string;
  emergencyContact: EmergencyContact;
}

export interface NotificationPreferences {
  moodReminders: boolean;
  chatMessages: boolean;
  assessmentReminders: boolean;
  wellnessContent: boolean;
  crisisAlerts: boolean;
}

export interface ThemePreferences {
  mode: "light" | "dark" | "auto";
  reducedMotion: boolean;
  fontSize: "small" | "medium" | "large";
  highContrast: boolean;
}

export interface PrivacyPreferences {
  shareData: boolean;
  analyticsEnabled: boolean;
  crashReportsEnabled: boolean;
}

export interface UserPreferences {
  notifications: NotificationPreferences;
  theme: ThemePreferences;
  privacy: PrivacyPreferences;
}

export interface UserStats {
  totalMoodEntries: number;
  currentStreak: number;
  longestStreak: number;
  assessmentsCompleted: number;
  chatSessions: number;
  lastActive: string;
}

export interface UserState extends AsyncState {
  profile: UserProfile;
  preferences: UserPreferences;
  stats: UserStats;
}

// =============================================================================
// Mood Slice Types
// =============================================================================

export type MoodType =
  | "happy"
  | "sad"
  | "anxious"
  | "calm"
  | "energetic"
  | "tired"
  | "angry"
  | "neutral";

export interface MoodEntry {
  id: string;
  mood: MoodType;
  intensity: number; // 1-10 scale
  notes?: string;
  activities?: string[];
  timestamp: string;
  userId: string;
  _offline?: boolean;
}

export interface WeeklyStats {
  averageIntensity: number;
  mostCommonMood: MoodType | null;
  totalEntries: number;
  moodDistribution?: Record<MoodType, number>;
}

export interface MoodInsight {
  id: string;
  type: "pattern" | "suggestion" | "achievement";
  title: string;
  description: string;
  date: string;
  data?: any;
}

export interface MoodState extends AsyncState {
  currentMood: MoodEntry | null;
  moodHistory: MoodEntry[];
  weeklyStats: WeeklyStats;
  insights: MoodInsight[];
}

// =============================================================================
// Assessment Slice Types
// =============================================================================

export type AssessmentType = "phq9" | "gad7" | string;

export interface AssessmentQuestion {
  id: string;
  text: string;
  type: "scale" | "multiple-choice" | "text";
  scale?: {
    min: number;
    max: number;
    labels: string[];
  };
  options?: string[];
}

export interface Assessment {
  id: AssessmentType;
  title: string;
  description: string;
  questions: AssessmentQuestion[];
  duration?: string;
  icon?: string;
}

export interface AssessmentResult {
  id: string;
  assessmentId: AssessmentType;
  responses: Record<string, number | string>;
  totalScore: number;
  completedAt: string;
  severity: "Minimal" | "Mild" | "Moderate" | "Severe";
  recommendations: string[];
  _offline?: boolean;
}

export interface AvailableAssessment {
  id: AssessmentType;
  title: string;
  description: string;
  duration: string;
  icon: string;
}

export interface AssessmentState extends AsyncState {
  currentAssessment: Assessment | null;
  currentQuestion: number;
  responses: Record<string, number | string>;
  assessmentHistory: AssessmentResult[];
  availableAssessments: AvailableAssessment[];
}

// =============================================================================
// Chat Slice Types
// =============================================================================

export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  metadata?: {
    mood?: MoodType;
    sentiment?: number;
    topics?: string[];
  };
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  context?: {
    currentMood?: MoodType;
    recentAssessments?: string[];
  };
}

export interface ChatState extends AsyncState {
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  isTyping: boolean;
  suggestions: string[];
}

// =============================================================================
// Therapy Slice Types
// =============================================================================

export interface TherapyResource {
  id: string;
  type: "article" | "video" | "meditation" | "exercise";
  title: string;
  description: string;
  duration?: number;
  url?: string;
  category: string;
  tags: string[];
}

export interface TherapySession {
  id: string;
  type: "cbt" | "mindfulness" | "breathing";
  title: string;
  completedAt: string;
  duration: number;
  notes?: string;
}

export interface TherapyGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number; // 0-100
  status: "active" | "completed" | "paused";
  createdAt: string;
}

export interface TherapyState extends AsyncState {
  resources: TherapyResource[];
  sessions: TherapySession[];
  goals: TherapyGoal[];
  recommendations: TherapyResource[];
}

// =============================================================================
// Root State
// =============================================================================

export interface RootState {
  auth: AuthState;
  user: UserState;
  mood: MoodState;
  assessment: AssessmentState;
  chat: ChatState;
  therapy: TherapyState;
}

// =============================================================================
// Action Types
// =============================================================================

export interface AsyncThunkConfig {
  state: RootState;
  rejectValue: string;
}

// Redux action creator types
export type AppDispatch = any; // Will be inferred from store

// Selector types
export type RootStateSelector<T> = (state: RootState) => T;

// =============================================================================
// Utility Types
// =============================================================================

// Extract slice state type
export type SliceState<K extends keyof RootState> = RootState[K];

// Extract entity from state
export type EntityType<S extends { [key: string]: any[] }> = S extends {
  [key: string]: (infer T)[];
}
  ? T
  : never;

// Pagination helper
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// API Error type
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

// Thunk response types
export type ThunkSuccess<T> = {
  payload: T;
  meta: {
    requestId: string;
    requestStatus: "fulfilled";
  };
};

export type ThunkError = {
  payload: string;
  error: {
    message: string;
  };
  meta: {
    requestId: string;
    requestStatus: "rejected";
  };
};

// =============================================================================
// Store Configuration Types
// =============================================================================

export interface StoreConfig {
  persist?: {
    whitelist?: (keyof RootState)[];
    blacklist?: (keyof RootState)[];
    timeout?: number;
  };
  middleware?: {
    serializableCheck?: boolean;
    immutableCheck?: boolean;
  };
}

// Redux Persist types
export interface PersistConfig {
  key: string;
  storage: any;
  whitelist?: string[];
  blacklist?: string[];
  timeout?: number;
}

export interface PersistedState<T> {
  _persist: {
    version: number;
    rehydrated: boolean;
  };
  state: T;
}
