import { logger } from "@shared/utils/logger";

/**
 * Crisis Intervention Configuration
 * Centralized configuration for crisis detection keywords and resources
 *
 * This configuration can be:
 * - Updated remotely via API
 * - Modified per deployment environment
 * - Extended with additional keywords or resources
 */

/**
 * Crisis keywords organized by severity level
 * These keywords are used to detect potential crisis situations in user text
 */
export const CRISIS_KEYWORDS = {
  // Critical severity - immediate suicide-related terms
  critical: [
    "suicide",
    "kill myself",
    "end my life",
    "want to die",
    "better off dead",
    "not worth living",
    "end it all",
    "take my life",
  ],

  // High severity - self-harm and immediate danger
  high: [
    "hurt myself",
    "self harm",
    "cut myself",
    "harm myself",
    "punish myself",
  ],

  // Moderate severity - crisis indicators
  moderate: [
    "give up",
    "no hope",
    "cant go on",
    "can't take it",
    "overwhelming pain",
    "unbearable",
    "desperate",
    "trapped",
    "hopeless",
    "worthless",
    "no point living",
  ],

  // Urgency indicators - time-based danger signals
  urgency: ["right now", "tonight", "today", "plan to", "going to"],
};

/**
 * Keyword scoring weights for risk assessment
 */
export const KEYWORD_WEIGHTS = {
  critical: 10,
  high: 7,
  urgency: 5,
  moderate: 3,
};

/**
 * Dangerous keyword combinations that increase risk score
 * Format: [word1, word2]
 */
export const DANGEROUS_COMBINATIONS = [
  ["plan", "suicide"],
  ["tonight", "end"],
  ["ready", "die"],
  ["cant", "anymore"],
  ["give up", "life"],
  ["no point", "living"],
];

/**
 * Combination score bonus
 */
export const COMBINATION_SCORE = 8;

/**
 * Risk level thresholds based on total score
 */
export const RISK_THRESHOLDS = {
  critical: 15,
  high: 8,
  moderate: 4,
  low: 1,
};

/**
 * Emergency resources by country
 */
export const EMERGENCY_RESOURCES = {
  US: [
    {
      id: "suicide_prevention_lifeline",
      name: "988 Suicide & Crisis Lifeline",
      number: "988",
      description: "24/7 free and confidential crisis support",
      type: "voice",
      priority: 1,
      country: "US",
    },
    {
      id: "crisis_text_line",
      name: "Crisis Text Line",
      number: "741741",
      keyword: "HOME",
      description: "Text HOME to 741741 for crisis counseling",
      type: "text",
      priority: 2,
      country: "US",
    },
    {
      id: "emergency_services",
      name: "Emergency Services",
      number: "911",
      description: "For immediate life-threatening emergencies",
      type: "emergency",
      priority: 3,
      country: "US",
    },
    {
      id: "trevor_project",
      name: "The Trevor Project",
      number: "1-866-488-7386",
      description: "24/7 crisis support for LGBTQ+ youth",
      type: "voice",
      priority: 4,
      specialty: "lgbtq",
      country: "US",
    },
    {
      id: "veterans_crisis_line",
      name: "Veterans Crisis Line",
      number: "1-800-273-8255",
      description: "Crisis support for veterans and their families",
      type: "voice",
      priority: 5,
      specialty: "veterans",
      country: "US",
    },
  ],
};

/**
 * Support resources for non-crisis situations
 */
export const SUPPORT_RESOURCES = [
  {
    id: "samhsa_helpline",
    name: "SAMHSA National Helpline",
    number: "1-800-662-4357",
    description: "Treatment referral and information service",
    type: "voice",
    hours: "24/7",
  },
  {
    id: "warm_line",
    name: "Mental Health Warm Line",
    description: "Non-crisis peer support when you need someone to talk to",
    type: "resource",
    url: "https://warmline.org",
  },
  {
    id: "online_chat",
    name: "Crisis Chat",
    description: "Online crisis chat support",
    type: "chat",
    url: "https://suicidepreventionlifeline.org/chat",
  },
];

/**
 * Safety plan template structure
 */
export const SAFETY_PLAN_TEMPLATE = {
  warningSignsPersonal: [],
  warningSignsEnvironmental: [],
  copingStrategies: [],
  socialSupports: [],
  professionalContacts: [],
  safeEnvironment: [],
  emergencyContacts: [],
};

/**
 * Load crisis keywords from remote configuration (if available)
 * This allows updating keywords without app deployment
 *
 * @returns {Promise<Object>} Updated crisis configuration
 */
export async function loadRemoteCrisisConfig(
  apiUrl = process.env.EXPO_PUBLIC_API_URL,
) {
  try {
    if (!apiUrl) {
      return null;
    }

    const response = await global.fetch(`${apiUrl}/config/crisis-keywords`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const remoteConfig = await response.json();
      return remoteConfig;
    }
  } catch (error) {
    logger.warn(
      "Failed to load remote crisis config, using defaults:",
      error.message,
    );
  }

  return null;
}

/**
 * Merge remote configuration with local defaults
 *
 * @param {Object} remoteConfig - Configuration from remote source
 * @returns {Object} Merged configuration
 */
export function mergeCrisisConfig(remoteConfig) {
  if (!remoteConfig) {
    return {
      keywords: CRISIS_KEYWORDS,
      weights: KEYWORD_WEIGHTS,
      combinations: DANGEROUS_COMBINATIONS,
      thresholds: RISK_THRESHOLDS,
      resources: EMERGENCY_RESOURCES,
    };
  }

  return {
    keywords: { ...CRISIS_KEYWORDS, ...remoteConfig.keywords },
    weights: { ...KEYWORD_WEIGHTS, ...remoteConfig.weights },
    combinations: remoteConfig.combinations || DANGEROUS_COMBINATIONS,
    thresholds: { ...RISK_THRESHOLDS, ...remoteConfig.thresholds },
    resources: { ...EMERGENCY_RESOURCES, ...remoteConfig.resources },
  };
}
