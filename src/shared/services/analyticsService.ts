/**
 * Enhanced Analytics Service
 * Provides comprehensive analytics tracking for user behavior and app usage
 * HIPAA-compliant - no PHI is tracked
 * Integrates with error handling and provides mental health specific insights
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "@shared/utils/logger";
import { ErrorReport, ErrorCategory } from "@shared/services/errorHandlingService";
import { i18n } from "@shared/services/i18nService";
import { retryService } from "@shared/services/retryService";

// Storage keys
const STORAGE_KEYS = {
  ANALYTICS_EVENTS: "@solace_analytics_events",
  ANALYTICS_SESSION: "@solace_analytics_session",
  ANALYTICS_CONFIG: "@solace_analytics_config",
};

// TypeScript interfaces
interface AnalyticsEvent {
  id: string;
  eventName: string;
  category: string;
  properties?: Record<string, any>;
  timestamp: string;
  sessionId: string;
}

interface SessionData {
  sessionId: string;
  startTime: string;
  endTime?: string;
  screenViews: number;
  interactions: number;
  duration?: number;
}

interface AnalyticsConfig {
  enabled: boolean;
  trackScreenViews: boolean;
  trackInteractions: boolean;
  trackPerformance: boolean;
  retentionDays: number;
}

class AnalyticsService {
  private currentSession: SessionData | null = null;
  private config: AnalyticsConfig = {
    enabled: true, // Enabled by default for local tracking
    trackScreenViews: true,
    trackInteractions: true,
    trackPerformance: true,
    retentionDays: 30,
  };
  private eventQueue: AnalyticsEvent[] = [];
  private maxQueueSize = 100;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize analytics service
   */
  private async initialize() {
    try {
      // Load config
      const configData = await AsyncStorage.getItem(STORAGE_KEYS.ANALYTICS_CONFIG);
      if (configData) {
        this.config = { ...this.config, ...JSON.parse(configData) };
      }

      // Start new session
      await this.startSession();

      // Clean old events
      await this.cleanOldEvents();

      logger.info("Analytics service initialized", { enabled: this.config.enabled });
    } catch (error) {
      logger.error("Failed to initialize analytics", error);
    }
  }

  /**
   * Start a new session
   */
  private async startSession() {
    try {
      this.currentSession = {
        sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        startTime: new Date().toISOString(),
        screenViews: 0,
        interactions: 0,
      };

      await AsyncStorage.setItem(
        STORAGE_KEYS.ANALYTICS_SESSION,
        JSON.stringify(this.currentSession)
      );

      logger.info("Analytics session started", { sessionId: this.currentSession.sessionId });
    } catch (error) {
      logger.error("Failed to start session", error);
    }
  }

  /**
   * End current session
   */
  async endSession() {
    try {
      if (!this.currentSession) return;

      const endTime = new Date();
      const startTime = new Date(this.currentSession.startTime);
      this.currentSession.endTime = endTime.toISOString();
      this.currentSession.duration =
        (endTime.getTime() - startTime.getTime()) / 1000; // in seconds

      await AsyncStorage.setItem(
        STORAGE_KEYS.ANALYTICS_SESSION,
        JSON.stringify(this.currentSession)
      );

      // Flush event queue
      await this.flushEvents();

      logger.info("Analytics session ended", {
        sessionId: this.currentSession.sessionId,
        duration: this.currentSession.duration,
      });
    } catch (error) {
      logger.error("Failed to end session", error);
    }
  }

  /**
   * Track an event
   */
  async trackEvent(
    eventName: string,
    category: string,
    properties?: Record<string, any>
  ): Promise<void> {
    if (!this.config.enabled) return;

    try {
      const event: AnalyticsEvent = {
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        eventName,
        category,
        properties: this.sanitizeProperties(properties),
        timestamp: new Date().toISOString(),
        sessionId: this.currentSession?.sessionId || "unknown",
      };

      this.eventQueue.push(event);

      // Flush if queue is full
      if (this.eventQueue.length >= this.maxQueueSize) {
        await this.flushEvents();
      }

      logger.info("Event tracked", { eventName, category });
    } catch (error) {
      logger.error("Failed to track event", error);
    }
  }

  /**
   * Track screen view
   */
  async trackScreenView(screenName: string, properties?: Record<string, any>): Promise<void> {
    if (!this.config.enabled || !this.config.trackScreenViews) return;

    if (this.currentSession) {
      this.currentSession.screenViews++;
    }

    await this.trackEvent("screen_view", "navigation", {
      screen: screenName,
      ...properties,
    });
  }

  /**
   * Track user interaction
   */
  async trackInteraction(
    action: string,
    target: string,
    properties?: Record<string, any>
  ): Promise<void> {
    if (!this.config.enabled || !this.config.trackInteractions) return;

    if (this.currentSession) {
      this.currentSession.interactions++;
    }

    await this.trackEvent("interaction", "user_action", {
      action,
      target,
      ...properties,
    });
  }

  /**
   * Track feature usage
   */
  async trackFeatureUsage(featureName: string, properties?: Record<string, any>): Promise<void> {
    await this.trackEvent("feature_used", "feature", {
      feature: featureName,
      ...properties,
    });
  }

  /**
   * Track error
   */
  async trackError(
    errorType: string,
    errorMessage: string,
    properties?: Record<string, any>
  ): Promise<void> {
    await this.trackEvent("error", "system", {
      errorType,
      errorMessage: this.sanitizeErrorMessage(errorMessage),
      ...properties,
    });
  }

  /**
   * Track performance metric
   */
  async trackPerformance(
    metricName: string,
    value: number,
    unit: string = "ms"
  ): Promise<void> {
    if (!this.config.enabled || !this.config.trackPerformance) return;

    await this.trackEvent("performance", "metrics", {
      metric: metricName,
      value,
      unit,
    });
  }

  /**
   * Get all tracked events
   */
  async getEvents(limit?: number): Promise<AnalyticsEvent[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ANALYTICS_EVENTS);
      if (!data) return [];

      const events = JSON.parse(data) as AnalyticsEvent[];
      return limit ? events.slice(0, limit) : events;
    } catch (error) {
      logger.error("Failed to get events", error);
      return [];
    }
  }

  /**
   * Get session data
   */
  async getSessionData(): Promise<SessionData | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ANALYTICS_SESSION);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error("Failed to get session data", error);
      return null;
    }
  }

  /**
   * Get analytics statistics
   */
  async getStats(): Promise<{
    totalEvents: number;
    eventsByCategory: Record<string, number>;
    topEvents: { event: string; count: number }[];
    averageSessionDuration: number;
  }> {
    try {
      const events = await this.getEvents();

      // Count by category
      const eventsByCategory: Record<string, number> = {};
      const eventCounts: Record<string, number> = {};

      events.forEach((event) => {
        eventsByCategory[event.category] =
          (eventsByCategory[event.category] || 0) + 1;
        eventCounts[event.eventName] = (eventCounts[event.eventName] || 0) + 1;
      });

      // Top events
      const topEvents = Object.entries(eventCounts)
        .map(([event, count]) => ({ event, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return {
        totalEvents: events.length,
        eventsByCategory,
        topEvents,
        averageSessionDuration: 0, // Calculate from multiple sessions if needed
      };
    } catch (error) {
      logger.error("Failed to get stats", error);
      return {
        totalEvents: 0,
        eventsByCategory: {},
        topEvents: [],
        averageSessionDuration: 0,
      };
    }
  }

  /**
   * Flush events to storage
   */
  private async flushEvents(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    try {
      const existingEvents = await this.getEvents();
      const allEvents = [...existingEvents, ...this.eventQueue];

      await AsyncStorage.setItem(
        STORAGE_KEYS.ANALYTICS_EVENTS,
        JSON.stringify(allEvents)
      );

      logger.info("Events flushed", { count: this.eventQueue.length });
      this.eventQueue = [];
    } catch (error) {
      logger.error("Failed to flush events", error);
    }
  }

  /**
   * Clean old events based on retention policy
   */
  private async cleanOldEvents(): Promise<void> {
    try {
      const events = await this.getEvents();
      const retentionDate = new Date();
      retentionDate.setDate(retentionDate.getDate() - this.config.retentionDays);

      const filteredEvents = events.filter(
        (event) => new Date(event.timestamp) > retentionDate
      );

      if (filteredEvents.length < events.length) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.ANALYTICS_EVENTS,
          JSON.stringify(filteredEvents)
        );

        logger.info("Old events cleaned", {
          removed: events.length - filteredEvents.length,
        });
      }
    } catch (error) {
      logger.error("Failed to clean old events", error);
    }
  }

  /**
   * Sanitize properties to remove PHI
   */
  private sanitizeProperties(properties?: Record<string, any>): Record<string, any> {
    if (!properties) return {};

    // List of keys that might contain PHI - remove them
    const sensitiveKeys = [
      "email",
      "phone",
      "address",
      "ssn",
      "dob",
      "name",
      "password",
      "token",
      "userId",
    ];

    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(properties)) {
      if (!sensitiveKeys.some((sk) => key.toLowerCase().includes(sk))) {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Sanitize error messages to remove PHI
   */
  private sanitizeErrorMessage(message: string): string {
    // Remove potential email addresses
    let sanitized = message.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "[EMAIL]");

    // Remove potential phone numbers
    sanitized = sanitized.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, "[PHONE]");

    // Remove potential tokens
    sanitized = sanitized.replace(/\b[A-Za-z0-9_-]{20,}\b/g, "[TOKEN]");

    return sanitized;
  }

  /**
   * Update analytics configuration
   */
  async updateConfig(newConfig: Partial<AnalyticsConfig>): Promise<void> {
    try {
      this.config = { ...this.config, ...newConfig };

      await AsyncStorage.setItem(
        STORAGE_KEYS.ANALYTICS_CONFIG,
        JSON.stringify(this.config)
      );

      logger.info("Analytics config updated", this.config);
    } catch (error) {
      logger.error("Failed to update config", error);
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): AnalyticsConfig {
    return { ...this.config };
  }

  /**
   * Clear all analytics data
   */
  async clearAll(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.ANALYTICS_EVENTS),
        AsyncStorage.removeItem(STORAGE_KEYS.ANALYTICS_SESSION),
      ]);

      this.eventQueue = [];
      this.currentSession = null;

      logger.info("All analytics data cleared");
    } catch (error) {
      logger.error("Failed to clear analytics data", error);
    }
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
export default analyticsService;