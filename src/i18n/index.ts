import { logger } from "@shared/utils/logger";

/**
 * Internationalization (i18n) Configuration
 * Supports multiple languages with automatic locale detection
 */

import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import language resources
import en from './locales/en';
import es from './locales/es';
import fr from './locales/fr';
import de from './locales/de';
import pt from './locales/pt';
import zh from './locales/zh';
import ja from './locales/ja';
import ar from './locales/ar';

// Language resources
const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
  pt: { translation: pt },
  zh: { translation: zh },
  ja: { translation: ja },
  ar: { translation: ar },
};

// Supported languages configuration
export const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
];

// Language persistence service
class LanguageService {
  private readonly STORAGE_KEY = '@solace/language_preference';

  async getStoredLanguage(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.STORAGE_KEY);
    } catch (error) {
      logger.error('Failed to load language preference:', error);
      return null;
    }
  }

  async setStoredLanguage(language: string): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, language);
    } catch (error) {
      logger.error('Failed to save language preference:', error);
    }
  }

  async clearStoredLanguage(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      logger.error('Failed to clear language preference:', error);
    }
  }

  getDeviceLanguage(): string {
    const locale = Localization.locale;
    const languageCode = locale.split('-')[0];

    // Check if we support this language
    if (Object.keys(resources).includes(languageCode)) {
      return languageCode;
    }

    // Default to English
    return 'en';
  }

  isRTL(language: string): boolean {
    const lang = supportedLanguages.find(l => l.code === language);
    return lang?.rtl || false;
  }
}

export const languageService = new LanguageService();

// Initialize i18n
const initI18n = async () => {
  // Get stored language or use device language
  const storedLanguage = await languageService.getStoredLanguage();
  const defaultLanguage = storedLanguage || languageService.getDeviceLanguage();

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: defaultLanguage,
      fallbackLng: 'en',
      debug: __DEV__,

      interpolation: {
        escapeValue: false, // React already escapes values
      },

      react: {
        useSuspense: false,
      },

      // Cache configuration
      cache: {
        enabled: true,
        expirationTime: 7 * 24 * 60 * 60 * 1000, // 7 days
      },

      // Missing key handler
      saveMissing: true,
      missingKeyHandler: (lng, ns, key, fallbackValue) => {
        if (__DEV__) {
          logger.warn(`Missing translation: ${lng}:${key}`);
        }
      },

      // Plural configuration
      pluralSeparator: '_',
      contextSeparator: '_',

      // Formatting
      format: (value, format, lng) => {
        if (format === 'number') {
          return new Intl.NumberFormat(lng).format(value);
        }
        if (format === 'currency') {
          return new Intl.NumberFormat(lng, {
            style: 'currency',
            currency: 'USD', // This should be configurable
          }).format(value);
        }
        if (value instanceof Date) {
          if (format === 'short') {
            return new Intl.DateTimeFormat(lng).format(value);
          }
          if (format === 'long') {
            return new Intl.DateTimeFormat(lng, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }).format(value);
          }
          if (format === 'time') {
            return new Intl.DateTimeFormat(lng, {
              hour: '2-digit',
              minute: '2-digit',
            }).format(value);
          }
        }
        return value;
      },
    });
};

// Initialize on app start
initI18n();

// Export configured i18n instance
export default i18n;

// Helper hooks and utilities
export { useTranslation, Trans, Translation } from 'react-i18next';

// Type-safe translation keys
export type TranslationKeys = keyof typeof en;

// Helper function to change language
export const changeLanguage = async (language: string) => {
  try {
    await i18n.changeLanguage(language);
    await languageService.setStoredLanguage(language);

    // Update RTL if necessary
    const isRTL = languageService.isRTL(language);
    if (isRTL) {
      // This would need to be handled by the app's RTL configuration
      // For React Native, you might need to restart the app or use a library like react-native-restart
    }

    return true;
  } catch (error) {
    logger.error('Failed to change language:', error);
    return false;
  }
};

// Get current language info
export const getCurrentLanguageInfo = () => {
  const currentCode = i18n.language;
  return supportedLanguages.find(lang => lang.code === currentCode) || supportedLanguages[0];
};

// Format functions for common use cases
export const formatters = {
  formatNumber: (value: number) => {
    return new Intl.NumberFormat(i18n.language).format(value);
  },

  formatCurrency: (value: number, currency = 'USD') => {
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency,
    }).format(value);
  },

  formatDate: (date: Date | string, format: 'short' | 'long' | 'full' = 'short') => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    const options: Intl.DateTimeFormatOptions = {
      short: {},
      long: { year: 'numeric', month: 'long', day: 'numeric' },
      full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    }[format];

    return new Intl.DateTimeFormat(i18n.language, options).format(dateObj);
  },

  formatTime: (date: Date | string, includeSeconds = false) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      ...(includeSeconds && { second: '2-digit' }),
    };

    return new Intl.DateTimeFormat(i18n.language, options).format(dateObj);
  },

  formatRelativeTime: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return i18n.t('time.just_now');
    if (diffMins < 60) return i18n.t('time.minutes_ago', { count: diffMins });
    if (diffHours < 24) return i18n.t('time.hours_ago', { count: diffHours });
    if (diffDays < 7) return i18n.t('time.days_ago', { count: diffDays });

    return formatters.formatDate(dateObj);
  },

  formatPercentage: (value: number, decimals = 0) => {
    return new Intl.NumberFormat(i18n.language, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value / 100);
  },
};