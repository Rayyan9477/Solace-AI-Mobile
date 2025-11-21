/**
 * React Hook for Internationalization
 * Provides easy access to i18n features in React components
 */

import { useEffect, useState, useCallback } from 'react';
import { i18n, t, SupportedLanguage, TranslationKeys } from '@shared/services/i18nService';
import { logger } from '@shared/utils/logger';

// ============ HOOKS ============

/**
 * Main i18n hook for components
 */
export function useI18n() {
  const [language, setLanguage] = useState<SupportedLanguage>(i18n.getCurrentLanguage());
  const [isRTL, setIsRTL] = useState<boolean>(i18n.isRTL());

  useEffect(() => {
    // Subscribe to language changes
    const unsubscribe = i18n.onLanguageChange((newLang) => {
      setLanguage(newLang);
      setIsRTL(i18n.isRTL());
      logger.debug('Language changed in component', { language: newLang });
    });

    return unsubscribe;
  }, []);

  const changeLanguage = useCallback(async (lang: SupportedLanguage) => {
    await i18n.changeLanguage(lang);
  }, []);

  const translate = useCallback((key: string, params?: Record<string, any>) => {
    return t(key, params);
  }, [language]); // Re-create when language changes

  const formatNumber = useCallback((value: number, options?: Intl.NumberFormatOptions) => {
    return i18n.formatNumber(value, options);
  }, [language]);

  const formatCurrency = useCallback((value: number, currency?: string) => {
    return i18n.formatCurrency(value, currency);
  }, [language]);

  const formatDate = useCallback((date: Date, options?: Intl.DateTimeFormatOptions) => {
    return i18n.formatDate(date, options);
  }, [language]);

  const formatTime = useCallback((date: Date, options?: Intl.DateTimeFormatOptions) => {
    return i18n.formatTime(date, options);
  }, [language]);

  const getRelativeTime = useCallback((date: Date) => {
    return i18n.getRelativeTime(date);
  }, [language]);

  return {
    // Current state
    language,
    isRTL,

    // Translation
    t: translate,
    translate,

    // Language management
    changeLanguage,
    getAvailableLanguages: i18n.getAvailableLanguages.bind(i18n),
    getLanguageConfig: i18n.getLanguageConfig.bind(i18n),

    // Formatting
    formatNumber,
    formatCurrency,
    formatDate,
    formatTime,
    getRelativeTime,
  };
}

/**
 * Hook for accessing specific translation namespaces
 */
export function useTranslation(namespace: keyof TranslationKeys) {
  const { t: translate, language } = useI18n();

  const t = useCallback((key: string, params?: Record<string, any>) => {
    return translate(`${namespace}.${key}`, params);
  }, [namespace, translate, language]);

  return { t, language };
}

/**
 * Hook for therapeutic messages
 */
export function useTherapeuticMessages() {
  const { t: translate, language } = useI18n();

  const messages = {
    getEncouragement: () => {
      const encouragements = [
        'therapeutic.itsOkayToFeel',
        'therapeutic.youAreNotAlone',
        'therapeutic.oneStepAtATime',
        'therapeutic.beKindToYourself',
        'therapeutic.progressNotPerfection',
        'therapeutic.youMatter',
      ];
      const randomIndex = Math.floor(Math.random() * encouragements.length);
      return translate(encouragements[randomIndex]);
    },

    getValidation: () => translate('therapeutic.yourFeelingsAreValid'),

    getCrisisSupport: () => ({
      message: translate('therapeutic.youAreNotAlone'),
      helpText: translate('mentalHealth.needHelp'),
      action: translate('mentalHealth.crisisSupport'),
    }),

    getGroundingPrompt: () => translate('therapeutic.groundYourself'),

    getBreathingPrompt: () => translate('therapeutic.breathe'),
  };

  return messages;
}

/**
 * Hook for formatted messages with dynamic content
 */
export function useFormattedMessage() {
  const { t: translate, formatTime, formatDate } = useI18n();

  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return translate('messages.goodMorning');
    } else if (hour < 18) {
      return translate('messages.goodAfternoon');
    } else {
      return translate('messages.goodEvening');
    }
  }, [translate]);

  const getStreakMessage = useCallback((days: number) => {
    return translate('messages.streakMessage', { count: days });
  }, [translate]);

  const getSessionReminder = useCallback((sessionTime: Date) => {
    const time = formatTime(sessionTime);
    return translate('messages.sessionReminder', { time });
  }, [translate, formatTime]);

  const getCheckInReminder = useCallback(() => {
    return translate('messages.checkInReminder');
  }, [translate]);

  return {
    getGreeting,
    getStreakMessage,
    getSessionReminder,
    getCheckInReminder,
  };
}

/**
 * Hook for error messages
 */
export function useErrorMessages() {
  const { t: translate } = useI18n();

  const getErrorMessage = useCallback((error: any): string => {
    // Check for specific error types
    if (error?.code) {
      switch (error.code) {
        case 'NETWORK_ERROR':
          return translate('errors.network');
        case 'AUTH_FAILED':
          return translate('errors.authentication');
        case 'NOT_FOUND':
          return translate('errors.notFound');
        case 'TIMEOUT':
          return translate('errors.timeout');
        case 'OFFLINE':
          return translate('errors.offline');
        case 'SESSION_EXPIRED':
          return translate('errors.sessionExpired');
        default:
          break;
      }
    }

    // Check for validation errors
    if (error?.type === 'validation') {
      return translate('errors.validation');
    }

    // Check for server errors
    if (error?.status >= 500) {
      return translate('errors.serverError');
    }

    // Default error message
    return translate('errors.general');
  }, [translate]);

  const getFieldError = useCallback((fieldName: string, errorType: string): string => {
    const errorMap: Record<string, string> = {
      required: 'errors.requiredField',
      email: 'errors.emailInvalid',
      password: 'errors.passwordWeak',
      passwordMismatch: 'errors.passwordMismatch',
    };

    const key = errorMap[errorType];
    return key ? translate(key) : translate('errors.invalidInput');
  }, [translate]);

  return {
    getErrorMessage,
    getFieldError,
  };
}

/**
 * Hook for managing language preferences
 */
export function useLanguagePreference() {
  const { language, changeLanguage, getAvailableLanguages } = useI18n();
  const [isChanging, setIsChanging] = useState(false);

  const updateLanguage = useCallback(async (newLang: SupportedLanguage) => {
    setIsChanging(true);
    try {
      await changeLanguage(newLang);
      logger.info('Language preference updated', { language: newLang });
    } catch (error) {
      logger.error('Failed to update language preference', error);
      throw error;
    } finally {
      setIsChanging(false);
    }
  }, [changeLanguage]);

  return {
    currentLanguage: language,
    availableLanguages: getAvailableLanguages(),
    updateLanguage,
    isChanging,
  };
}

// ============ EXPORTS ============

export default useI18n;