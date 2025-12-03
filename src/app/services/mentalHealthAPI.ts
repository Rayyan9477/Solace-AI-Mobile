/**
 * Mental Health API Service
 * Handles all mental health related API calls including mood, assessment, journal, etc.
 */

import { logger } from "@shared/utils/logger";
import apiCache from "./apiCache";
import tokenService from "./tokenService";
import { API_CONFIG } from "../../shared/config/environment";

// ==================== TYPES ====================

interface MoodEntry {
  id?: string;
  mood: string;
  intensity: number;
  timestamp: string;
  notes?: string;
  activities?: string[];
  triggers?: string[];
}

interface AssessmentResult {
  id?: string;
  score: number;
  categories: {
    mentalClarity: number;
    emotionalBalance: number;
    stressManagement: number;
    sleepQuality: number;
  };
  answers: Record<number, any>;
  recommendations: string[];
  timestamp: string;
}

interface JournalEntry {
  id?: string;
  title: string;
  content?: string;
  audioUrl?: string;
  mood: string;
  tags: string[];
  timestamp: string;
  isVoice: boolean;
}

interface DashboardData {
  mentalHealthScore: number;
  streakDays: number;
  todaysMood?: MoodEntry;
  weeklyMoodTrend: MoodEntry[];
  recentAssessments: AssessmentResult[];
  upcomingActivities: any[];
  insights: string[];
}

interface TherapySession {
  id?: string;
  type: string;
  duration: number;
  notes: string;
  timestamp: string;
  therapistId?: string;
}

// ==================== HELPER FUNCTIONS ====================

// HIGH-004 FIX: Default timeout for API calls (30 seconds)
const DEFAULT_API_TIMEOUT = 30000;

async function authenticatedFetch(
  url: string,
  options: any = {},
  timeout: number = DEFAULT_API_TIMEOUT
): Promise<any> {
  const tokens = await tokenService.getTokens();

  const headers: any = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (tokens?.accessToken) {
    headers["Authorization"] = `Bearer ${tokens.accessToken}`;
  }

  // HIGH-004 FIX: Add timeout using AbortController to prevent hanging requests
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms: ${url}`);
    }

    throw error;
  }
}

// ==================== MOOD API ====================

export const moodAPI = {
  /**
   * Create a new mood entry
   */
  async createMoodEntry(entry: MoodEntry): Promise<MoodEntry> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/mood/entries`, {
      method: "POST",
      body: JSON.stringify(entry),
    });
  },

  /**
   * Get mood entries for a date range
   */
  async getMoodEntries(startDate?: string, endDate?: string): Promise<MoodEntry[]> {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const url = `${API_CONFIG.baseURL}/mood/entries${params.toString() ? `?${params}` : ""}`;
    return await authenticatedFetch(url);
  },

  /**
   * Get mood statistics
   */
  async getMoodStats(period: "week" | "month" | "year" = "month"): Promise<any> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/mood/stats?period=${period}`);
  },

  /**
   * Update a mood entry
   */
  async updateMoodEntry(id: string, entry: Partial<MoodEntry>): Promise<MoodEntry> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/mood/entries/${id}`, {
      method: "PUT",
      body: JSON.stringify(entry),
    });
  },

  /**
   * Delete a mood entry
   */
  async deleteMoodEntry(id: string): Promise<void> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/mood/entries/${id}`, {
      method: "DELETE",
    });
  },

  /**
   * Get mood trends and analytics
   */
  async getMoodTrends(): Promise<any> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/mood/trends`);
  },
};

// ==================== ASSESSMENT API ====================

export const assessmentAPI = {
  /**
   * Submit assessment answers and get results
   */
  async submitAssessment(answers: Record<number, any>): Promise<AssessmentResult> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/assessments`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    });
  },

  /**
   * Get assessment history
   */
  async getAssessmentHistory(limit: number = 10): Promise<AssessmentResult[]> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/assessments?limit=${limit}`);
  },

  /**
   * Get specific assessment by ID
   */
  async getAssessment(id: string): Promise<AssessmentResult> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/assessments/${id}`);
  },

  /**
   * Get assessment recommendations
   */
  async getRecommendations(): Promise<string[]> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/assessments/recommendations`);
  },
};

// ==================== JOURNAL API ====================

export const journalAPI = {
  /**
   * Create a new journal entry
   */
  async createEntry(entry: JournalEntry): Promise<JournalEntry> {
    const formData = new FormData();

    // Add text fields
    formData.append("title", entry.title);
    if (entry.content) formData.append("content", entry.content);
    formData.append("mood", entry.mood);
    formData.append("tags", JSON.stringify(entry.tags));
    formData.append("isVoice", String(entry.isVoice));

    // Add audio file if present
    if (entry.audioUrl && entry.audioUrl.startsWith("file://")) {
      const audioFile = {
        uri: entry.audioUrl,
        name: "audio.m4a",
        type: "audio/m4a",
      } as any;
      formData.append("audio", audioFile);
    }

    return await authenticatedFetch(`${API_CONFIG.baseURL}/journal/entries`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });
  },

  /**
   * Get journal entries
   */
  async getEntries(page: number = 1, limit: number = 20): Promise<JournalEntry[]> {
    return await authenticatedFetch(
      `${API_CONFIG.baseURL}/journal/entries?page=${page}&limit=${limit}`
    );
  },

  /**
   * Get specific journal entry
   */
  async getEntry(id: string): Promise<JournalEntry> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/journal/entries/${id}`);
  },

  /**
   * Update journal entry
   */
  async updateEntry(id: string, entry: Partial<JournalEntry>): Promise<JournalEntry> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/journal/entries/${id}`, {
      method: "PUT",
      body: JSON.stringify(entry),
    });
  },

  /**
   * Delete journal entry
   */
  async deleteEntry(id: string): Promise<void> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/journal/entries/${id}`, {
      method: "DELETE",
    });
  },

  /**
   * Search journal entries
   */
  async searchEntries(query: string): Promise<JournalEntry[]> {
    return await authenticatedFetch(
      `${API_CONFIG.baseURL}/journal/search?q=${encodeURIComponent(query)}`
    );
  },
};

// ==================== DASHBOARD API ====================

export const dashboardAPI = {
  /**
   * Get dashboard data
   */
  async getDashboardData(): Promise<DashboardData> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/dashboard`);
  },

  /**
   * Get mental health score details
   */
  async getMentalHealthScore(): Promise<any> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/dashboard/mental-health-score`);
  },

  /**
   * Get upcoming activities
   */
  async getUpcomingActivities(): Promise<any[]> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/dashboard/activities`);
  },

  /**
   * Get personalized insights
   */
  async getInsights(): Promise<string[]> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/dashboard/insights`);
  },

  /**
   * Get streak information
   */
  async getStreakInfo(): Promise<any> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/dashboard/streak`);
  },
};

// ==================== THERAPY API ====================

export const therapyAPI = {
  /**
   * Create therapy session record
   */
  async createSession(session: TherapySession): Promise<TherapySession> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/therapy/sessions`, {
      method: "POST",
      body: JSON.stringify(session),
    });
  },

  /**
   * Get therapy sessions
   */
  async getSessions(limit: number = 10): Promise<TherapySession[]> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/therapy/sessions?limit=${limit}`);
  },

  /**
   * Get therapist recommendations
   */
  async getTherapistRecommendations(): Promise<any[]> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/therapy/recommendations`);
  },

  /**
   * Schedule therapy appointment
   */
  async scheduleAppointment(appointmentData: any): Promise<any> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/therapy/appointments`, {
      method: "POST",
      body: JSON.stringify(appointmentData),
    });
  },
};

// ==================== COMMUNITY API ====================

export const communityAPI = {
  /**
   * Get community posts
   */
  async getPosts(page: number = 1, limit: number = 20): Promise<any[]> {
    return await authenticatedFetch(
      `${API_CONFIG.baseURL}/community/posts?page=${page}&limit=${limit}`
    );
  },

  /**
   * Create a new post
   */
  async createPost(post: any): Promise<any> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/community/posts`, {
      method: "POST",
      body: JSON.stringify(post),
    });
  },

  /**
   * Get support groups
   */
  async getSupportGroups(): Promise<any[]> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/community/support-groups`);
  },

  /**
   * Join support group
   */
  async joinGroup(groupId: string): Promise<any> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/community/support-groups/${groupId}/join`, {
      method: "POST",
    });
  },

  /**
   * Get community events
   */
  async getEvents(): Promise<any[]> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/community/events`);
  },
};

// ==================== MINDFULNESS API ====================

export const mindfulnessAPI = {
  /**
   * Get meditation sessions
   */
  async getMeditationSessions(): Promise<any[]> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/mindfulness/meditations`);
  },

  /**
   * Start meditation session
   */
  async startMeditation(sessionId: string): Promise<any> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/mindfulness/meditations/${sessionId}/start`, {
      method: "POST",
    });
  },

  /**
   * Complete meditation session
   */
  async completeMeditation(sessionId: string, duration: number): Promise<any> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/mindfulness/meditations/${sessionId}/complete`, {
      method: "POST",
      body: JSON.stringify({ duration }),
    });
  },

  /**
   * Get breathing exercises
   */
  async getBreathingExercises(): Promise<any[]> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/mindfulness/breathing-exercises`);
  },

  /**
   * Get mindfulness statistics
   */
  async getMindfulnessStats(): Promise<any> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/mindfulness/stats`);
  },
};

// ==================== EMERGENCY API ====================

export const emergencyAPI = {
  /**
   * Get emergency contacts
   */
  async getEmergencyContacts(): Promise<any[]> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/emergency/contacts`);
  },

  /**
   * Add emergency contact
   */
  async addEmergencyContact(contact: any): Promise<any> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/emergency/contacts`, {
      method: "POST",
      body: JSON.stringify(contact),
    });
  },

  /**
   * Trigger emergency alert
   */
  async triggerEmergencyAlert(location?: any): Promise<any> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/emergency/alert`, {
      method: "POST",
      body: JSON.stringify({ location }),
    });
  },

  /**
   * Get crisis resources
   */
  async getCrisisResources(): Promise<any[]> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/emergency/crisis-resources`);
  },
};

// ==================== EXPORT ALL APIS ====================

const mentalHealthAPI = {
  mood: moodAPI,
  assessment: assessmentAPI,
  journal: journalAPI,
  dashboard: dashboardAPI,
  therapy: therapyAPI,
  community: communityAPI,
  mindfulness: mindfulnessAPI,
  emergency: emergencyAPI,
};

export default mentalHealthAPI;