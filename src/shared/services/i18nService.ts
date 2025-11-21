/**
 * Internationalization (i18n) Service
 * Comprehensive multi-language support with mental health focused translations
 *
 * Features:
 * - Multiple language support
 * - Dynamic language switching
 * - Fallback language support
 * - Pluralization rules
 * - Date/time formatting
 * - Number formatting
 * - RTL language support
 * - Persistent language preferences
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager, NativeModules, Platform } from 'react-native';
import { logger } from '@shared/utils/logger';

// ============ TYPES ============

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'zh' | 'ja' | 'ar' | 'hi' | 'ru';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  rtl: boolean;
  dateFormat: string;
  timeFormat: string;
  numberFormat: {
    decimal: string;
    thousands: string;
    currency: string;
  };
}

export interface TranslationKeys {
  // Common
  common: {
    yes: string;
    no: string;
    ok: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    submit: string;
    loading: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    retry: string;
    refresh: string;
    search: string;
    filter: string;
    sort: string;
    share: string;
    today: string;
    yesterday: string;
    tomorrow: string;
    week: string;
    month: string;
    year: string;
  };

  // Auth
  auth: {
    signIn: string;
    signUp: string;
    signOut: string;
    forgotPassword: string;
    resetPassword: string;
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    username: string;
    rememberMe: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    orSignInWith: string;
    termsAndConditions: string;
    privacyPolicy: string;
    biometricLogin: string;
    verifyEmail: string;
    verificationCode: string;
  };

  // Mental Health
  mentalHealth: {
    mood: string;
    moodTracker: string;
    howAreYouFeeling: string;
    selectMood: string;
    moodIntensity: string;
    addNotes: string;
    activities: string;
    triggers: string;
    symptoms: string;
    copingStrategies: string;
    journal: string;
    journalEntry: string;
    writeYourThoughts: string;
    assessment: string;
    takeAssessment: string;
    viewResults: string;
    therapist: string;
    bookSession: string;
    upcomingSession: string;
    crisis: string;
    crisisSupport: string;
    needHelp: string;
    emergencyContacts: string;
    breathingExercise: string;
    meditation: string;
    mindfulness: string;
    relaxation: string;
    groundingTechnique: string;
  };

  // Moods
  moods: {
    happy: string;
    sad: string;
    anxious: string;
    angry: string;
    calm: string;
    excited: string;
    stressed: string;
    confused: string;
    hopeful: string;
    grateful: string;
    lonely: string;
    overwhelmed: string;
    content: string;
    frustrated: string;
    worried: string;
    peaceful: string;
  };

  // Navigation
  navigation: {
    home: string;
    dashboard: string;
    profile: string;
    settings: string;
    notifications: string;
    help: string;
    about: string;
    feedback: string;
    moodTracker: string;
    journal: string;
    assessments: string;
    therapy: string;
    community: string;
    resources: string;
    emergency: string;
  };

  // Settings
  settings: {
    general: string;
    account: string;
    privacy: string;
    security: string;
    notifications: string;
    language: string;
    theme: string;
    darkMode: string;
    lightMode: string;
    autoMode: string;
    dataAndStorage: string;
    backup: string;
    restore: string;
    export: string;
    deleteAccount: string;
    changePassword: string;
    twoFactorAuth: string;
    blockedUsers: string;
  };

  // Messages
  messages: {
    welcomeBack: string;
    goodMorning: string;
    goodAfternoon: string;
    goodEvening: string;
    checkInReminder: string;
    streakMessage: string;
    progressMessage: string;
    encouragement: string;
    validationMessage: string;
    crisisDetected: string;
    helpAvailable: string;
    sessionReminder: string;
    medicationReminder: string;
  };

  // Errors
  errors: {
    general: string;
    network: string;
    authentication: string;
    validation: string;
    notFound: string;
    serverError: string;
    timeout: string;
    offline: string;
    invalidInput: string;
    requiredField: string;
    emailInvalid: string;
    passwordWeak: string;
    passwordMismatch: string;
    userNotFound: string;
    incorrectPassword: string;
    accountLocked: string;
    sessionExpired: string;
  };

  // Therapeutic phrases
  therapeutic: {
    itsOkayToFeel: string;
    youAreNotAlone: string;
    takingCareOfYourself: string;
    oneStepAtATime: string;
    beKindToYourself: string;
    progressNotPerfection: string;
    healingTakesTime: string;
    youMatter: string;
    yourFeelingsAreValid: string;
    reachOut: string;
    tomorrowIsNewDay: string;
    breathe: string;
    groundYourself: string;
    safeSpace: string;
  };
}

export interface PluralizationRule {
  zero?: string;
  one: string;
  few?: string;
  many?: string;
  other: string;
}

// ============ CONSTANTS ============

const STORAGE_KEY = 'user_language';
const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

// Language configurations
const LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    rtl: false,
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: 'USD',
    },
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    rtl: false,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    numberFormat: {
      decimal: ',',
      thousands: '.',
      currency: 'EUR',
    },
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    rtl: false,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    numberFormat: {
      decimal: ',',
      thousands: ' ',
      currency: 'EUR',
    },
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    rtl: false,
    dateFormat: 'DD.MM.YYYY',
    timeFormat: '24h',
    numberFormat: {
      decimal: ',',
      thousands: '.',
      currency: 'EUR',
    },
  },
  pt: {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    rtl: false,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    numberFormat: {
      decimal: ',',
      thousands: '.',
      currency: 'BRL',
    },
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    rtl: false,
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: 'CNY',
    },
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    rtl: false,
    dateFormat: 'YYYY/MM/DD',
    timeFormat: '24h',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: 'JPY',
    },
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    rtl: true,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    numberFormat: {
      decimal: ',',
      thousands: '.',
      currency: 'SAR',
    },
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    rtl: false,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: 'INR',
    },
  },
  ru: {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    rtl: false,
    dateFormat: 'DD.MM.YYYY',
    timeFormat: '24h',
    numberFormat: {
      decimal: ',',
      thousands: ' ',
      currency: 'RUB',
    },
  },
};

// ============ I18N SERVICE CLASS ============

class I18nService {
  private currentLanguage: SupportedLanguage = DEFAULT_LANGUAGE;
  private translations: Map<SupportedLanguage, TranslationKeys> = new Map();
  private listeners: Set<(lang: SupportedLanguage) => void> = new Set();

  constructor() {
    this.initializeLanguage();
    this.loadTranslations();
  }

  // ============ INITIALIZATION ============

  private async initializeLanguage(): Promise<void> {
    try {
      // Try to get saved language preference
      const savedLanguage = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedLanguage && this.isValidLanguage(savedLanguage)) {
        this.currentLanguage = savedLanguage as SupportedLanguage;
      } else {
        // Get device language
        const deviceLanguage = this.getDeviceLanguage();
        if (this.isValidLanguage(deviceLanguage)) {
          this.currentLanguage = deviceLanguage as SupportedLanguage;
        }
      }

      // Apply RTL settings if needed
      const config = LANGUAGES[this.currentLanguage];
      if (config.rtl !== I18nManager.isRTL) {
        I18nManager.forceRTL(config.rtl);
      }

      logger.info('Language initialized', { language: this.currentLanguage });
    } catch (error) {
      logger.error('Failed to initialize language', error);
    }
  }

  private getDeviceLanguage(): string {
    let deviceLanguage = 'en';

    if (Platform.OS === 'ios') {
      deviceLanguage =
        NativeModules.SettingsManager?.settings?.AppleLocale ||
        NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] ||
        'en';
    } else if (Platform.OS === 'android') {
      deviceLanguage = NativeModules.I18nManager?.localeIdentifier || 'en';
    }

    // Extract language code (e.g., 'en' from 'en-US')
    return deviceLanguage.split(/[-_]/)[0].toLowerCase();
  }

  private isValidLanguage(code: string): boolean {
    return Object.keys(LANGUAGES).includes(code);
  }

  private loadTranslations(): void {
    // Load all translation files
    // In a real app, these would be imported from separate JSON files
    // For now, we'll load English translations inline
    this.loadEnglishTranslations();
    this.loadSpanishTranslations();
    // ... load other languages
  }

  private loadEnglishTranslations(): void {
    const en: TranslationKeys = {
      common: {
        yes: 'Yes',
        no: 'No',
        ok: 'OK',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        close: 'Close',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        submit: 'Submit',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        warning: 'Warning',
        info: 'Information',
        retry: 'Retry',
        refresh: 'Refresh',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        share: 'Share',
        today: 'Today',
        yesterday: 'Yesterday',
        tomorrow: 'Tomorrow',
        week: 'Week',
        month: 'Month',
        year: 'Year',
      },
      auth: {
        signIn: 'Sign In',
        signUp: 'Sign Up',
        signOut: 'Sign Out',
        forgotPassword: 'Forgot Password?',
        resetPassword: 'Reset Password',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        name: 'Name',
        username: 'Username',
        rememberMe: 'Remember Me',
        alreadyHaveAccount: 'Already have an account?',
        dontHaveAccount: "Don't have an account?",
        orSignInWith: 'Or sign in with',
        termsAndConditions: 'Terms and Conditions',
        privacyPolicy: 'Privacy Policy',
        biometricLogin: 'Use Biometric Login',
        verifyEmail: 'Verify Email',
        verificationCode: 'Verification Code',
      },
      mentalHealth: {
        mood: 'Mood',
        moodTracker: 'Mood Tracker',
        howAreYouFeeling: 'How are you feeling?',
        selectMood: 'Select your mood',
        moodIntensity: 'Mood intensity',
        addNotes: 'Add notes (optional)',
        activities: 'Activities',
        triggers: 'Triggers',
        symptoms: 'Symptoms',
        copingStrategies: 'Coping Strategies',
        journal: 'Journal',
        journalEntry: 'Journal Entry',
        writeYourThoughts: 'Write your thoughts...',
        assessment: 'Assessment',
        takeAssessment: 'Take Assessment',
        viewResults: 'View Results',
        therapist: 'Therapist',
        bookSession: 'Book Session',
        upcomingSession: 'Upcoming Session',
        crisis: 'Crisis',
        crisisSupport: 'Crisis Support',
        needHelp: 'Need immediate help?',
        emergencyContacts: 'Emergency Contacts',
        breathingExercise: 'Breathing Exercise',
        meditation: 'Meditation',
        mindfulness: 'Mindfulness',
        relaxation: 'Relaxation',
        groundingTechnique: 'Grounding Technique',
      },
      moods: {
        happy: 'Happy',
        sad: 'Sad',
        anxious: 'Anxious',
        angry: 'Angry',
        calm: 'Calm',
        excited: 'Excited',
        stressed: 'Stressed',
        confused: 'Confused',
        hopeful: 'Hopeful',
        grateful: 'Grateful',
        lonely: 'Lonely',
        overwhelmed: 'Overwhelmed',
        content: 'Content',
        frustrated: 'Frustrated',
        worried: 'Worried',
        peaceful: 'Peaceful',
      },
      navigation: {
        home: 'Home',
        dashboard: 'Dashboard',
        profile: 'Profile',
        settings: 'Settings',
        notifications: 'Notifications',
        help: 'Help',
        about: 'About',
        feedback: 'Feedback',
        moodTracker: 'Mood Tracker',
        journal: 'Journal',
        assessments: 'Assessments',
        therapy: 'Therapy',
        community: 'Community',
        resources: 'Resources',
        emergency: 'Emergency',
      },
      settings: {
        general: 'General',
        account: 'Account',
        privacy: 'Privacy',
        security: 'Security',
        notifications: 'Notifications',
        language: 'Language',
        theme: 'Theme',
        darkMode: 'Dark Mode',
        lightMode: 'Light Mode',
        autoMode: 'Auto',
        dataAndStorage: 'Data & Storage',
        backup: 'Backup',
        restore: 'Restore',
        export: 'Export Data',
        deleteAccount: 'Delete Account',
        changePassword: 'Change Password',
        twoFactorAuth: 'Two-Factor Authentication',
        blockedUsers: 'Blocked Users',
      },
      messages: {
        welcomeBack: 'Welcome back!',
        goodMorning: 'Good morning',
        goodAfternoon: 'Good afternoon',
        goodEvening: 'Good evening',
        checkInReminder: "It's time for your daily check-in",
        streakMessage: 'Great job! You have a {{count}} day streak',
        progressMessage: 'You are making progress',
        encouragement: 'Keep going, you are doing great!',
        validationMessage: 'Your feelings are valid',
        crisisDetected: 'We noticed you might be going through a difficult time',
        helpAvailable: 'Help is available',
        sessionReminder: 'You have a session in {{time}}',
        medicationReminder: 'Time to take your medication',
      },
      errors: {
        general: 'Something went wrong',
        network: 'Network error. Please check your connection',
        authentication: 'Authentication failed',
        validation: 'Please check your input',
        notFound: 'Not found',
        serverError: 'Server error. Please try again later',
        timeout: 'Request timed out',
        offline: 'You appear to be offline',
        invalidInput: 'Invalid input',
        requiredField: 'This field is required',
        emailInvalid: 'Please enter a valid email address',
        passwordWeak: 'Password is too weak',
        passwordMismatch: 'Passwords do not match',
        userNotFound: 'User not found',
        incorrectPassword: 'Incorrect password',
        accountLocked: 'Account has been locked',
        sessionExpired: 'Your session has expired',
      },
      therapeutic: {
        itsOkayToFeel: "It's okay to feel this way",
        youAreNotAlone: 'You are not alone',
        takingCareOfYourself: 'Taking care of yourself is important',
        oneStepAtATime: 'One step at a time',
        beKindToYourself: 'Be kind to yourself',
        progressNotPerfection: 'Progress, not perfection',
        healingTakesTime: 'Healing takes time',
        youMatter: 'You matter',
        yourFeelingsAreValid: 'Your feelings are valid',
        reachOut: "It's okay to reach out for help",
        tomorrowIsNewDay: 'Tomorrow is a new day',
        breathe: 'Take a deep breath',
        groundYourself: 'Ground yourself in this moment',
        safeSpace: 'This is your safe space',
      },
    };

    this.translations.set('en', en);
  }

  private loadSpanishTranslations(): void {
    const es: TranslationKeys = {
      common: {
        yes: 'Sí',
        no: 'No',
        ok: 'OK',
        cancel: 'Cancelar',
        save: 'Guardar',
        delete: 'Eliminar',
        edit: 'Editar',
        close: 'Cerrar',
        back: 'Atrás',
        next: 'Siguiente',
        previous: 'Anterior',
        submit: 'Enviar',
        loading: 'Cargando...',
        error: 'Error',
        success: 'Éxito',
        warning: 'Advertencia',
        info: 'Información',
        retry: 'Reintentar',
        refresh: 'Actualizar',
        search: 'Buscar',
        filter: 'Filtrar',
        sort: 'Ordenar',
        share: 'Compartir',
        today: 'Hoy',
        yesterday: 'Ayer',
        tomorrow: 'Mañana',
        week: 'Semana',
        month: 'Mes',
        year: 'Año',
      },
      auth: {
        signIn: 'Iniciar Sesión',
        signUp: 'Registrarse',
        signOut: 'Cerrar Sesión',
        forgotPassword: '¿Olvidó su Contraseña?',
        resetPassword: 'Restablecer Contraseña',
        email: 'Correo Electrónico',
        password: 'Contraseña',
        confirmPassword: 'Confirmar Contraseña',
        name: 'Nombre',
        username: 'Nombre de Usuario',
        rememberMe: 'Recuérdame',
        alreadyHaveAccount: '¿Ya tienes una cuenta?',
        dontHaveAccount: '¿No tienes una cuenta?',
        orSignInWith: 'O inicia sesión con',
        termsAndConditions: 'Términos y Condiciones',
        privacyPolicy: 'Política de Privacidad',
        biometricLogin: 'Usar Login Biométrico',
        verifyEmail: 'Verificar Correo',
        verificationCode: 'Código de Verificación',
      },
      mentalHealth: {
        mood: 'Estado de Ánimo',
        moodTracker: 'Rastreador de Ánimo',
        howAreYouFeeling: '¿Cómo te sientes?',
        selectMood: 'Selecciona tu estado de ánimo',
        moodIntensity: 'Intensidad del ánimo',
        addNotes: 'Agregar notas (opcional)',
        activities: 'Actividades',
        triggers: 'Desencadenantes',
        symptoms: 'Síntomas',
        copingStrategies: 'Estrategias de Afrontamiento',
        journal: 'Diario',
        journalEntry: 'Entrada del Diario',
        writeYourThoughts: 'Escribe tus pensamientos...',
        assessment: 'Evaluación',
        takeAssessment: 'Realizar Evaluación',
        viewResults: 'Ver Resultados',
        therapist: 'Terapeuta',
        bookSession: 'Reservar Sesión',
        upcomingSession: 'Próxima Sesión',
        crisis: 'Crisis',
        crisisSupport: 'Apoyo en Crisis',
        needHelp: '¿Necesitas ayuda inmediata?',
        emergencyContacts: 'Contactos de Emergencia',
        breathingExercise: 'Ejercicio de Respiración',
        meditation: 'Meditación',
        mindfulness: 'Atención Plena',
        relaxation: 'Relajación',
        groundingTechnique: 'Técnica de Anclaje',
      },
      moods: {
        happy: 'Feliz',
        sad: 'Triste',
        anxious: 'Ansioso',
        angry: 'Enojado',
        calm: 'Tranquilo',
        excited: 'Emocionado',
        stressed: 'Estresado',
        confused: 'Confundido',
        hopeful: 'Esperanzado',
        grateful: 'Agradecido',
        lonely: 'Solo',
        overwhelmed: 'Abrumado',
        content: 'Contento',
        frustrated: 'Frustrado',
        worried: 'Preocupado',
        peaceful: 'Pacífico',
      },
      navigation: {
        home: 'Inicio',
        dashboard: 'Panel',
        profile: 'Perfil',
        settings: 'Configuración',
        notifications: 'Notificaciones',
        help: 'Ayuda',
        about: 'Acerca de',
        feedback: 'Comentarios',
        moodTracker: 'Rastreador de Ánimo',
        journal: 'Diario',
        assessments: 'Evaluaciones',
        therapy: 'Terapia',
        community: 'Comunidad',
        resources: 'Recursos',
        emergency: 'Emergencia',
      },
      settings: {
        general: 'General',
        account: 'Cuenta',
        privacy: 'Privacidad',
        security: 'Seguridad',
        notifications: 'Notificaciones',
        language: 'Idioma',
        theme: 'Tema',
        darkMode: 'Modo Oscuro',
        lightMode: 'Modo Claro',
        autoMode: 'Automático',
        dataAndStorage: 'Datos y Almacenamiento',
        backup: 'Respaldo',
        restore: 'Restaurar',
        export: 'Exportar Datos',
        deleteAccount: 'Eliminar Cuenta',
        changePassword: 'Cambiar Contraseña',
        twoFactorAuth: 'Autenticación de Dos Factores',
        blockedUsers: 'Usuarios Bloqueados',
      },
      messages: {
        welcomeBack: '¡Bienvenido de vuelta!',
        goodMorning: 'Buenos días',
        goodAfternoon: 'Buenas tardes',
        goodEvening: 'Buenas noches',
        checkInReminder: 'Es hora de tu registro diario',
        streakMessage: '¡Excelente! Tienes una racha de {{count}} días',
        progressMessage: 'Estás progresando',
        encouragement: '¡Sigue así, lo estás haciendo genial!',
        validationMessage: 'Tus sentimientos son válidos',
        crisisDetected: 'Notamos que podrías estar pasando por un momento difícil',
        helpAvailable: 'Hay ayuda disponible',
        sessionReminder: 'Tienes una sesión en {{time}}',
        medicationReminder: 'Hora de tomar tu medicación',
      },
      errors: {
        general: 'Algo salió mal',
        network: 'Error de red. Por favor verifica tu conexión',
        authentication: 'Autenticación fallida',
        validation: 'Por favor verifica tu entrada',
        notFound: 'No encontrado',
        serverError: 'Error del servidor. Por favor intenta más tarde',
        timeout: 'La solicitud expiró',
        offline: 'Parece que estás sin conexión',
        invalidInput: 'Entrada inválida',
        requiredField: 'Este campo es requerido',
        emailInvalid: 'Por favor ingresa un correo electrónico válido',
        passwordWeak: 'La contraseña es muy débil',
        passwordMismatch: 'Las contraseñas no coinciden',
        userNotFound: 'Usuario no encontrado',
        incorrectPassword: 'Contraseña incorrecta',
        accountLocked: 'La cuenta ha sido bloqueada',
        sessionExpired: 'Tu sesión ha expirado',
      },
      therapeutic: {
        itsOkayToFeel: 'Está bien sentirse así',
        youAreNotAlone: 'No estás solo',
        takingCareOfYourself: 'Cuidarte a ti mismo es importante',
        oneStepAtATime: 'Un paso a la vez',
        beKindToYourself: 'Sé amable contigo mismo',
        progressNotPerfection: 'Progreso, no perfección',
        healingTakesTime: 'La sanación toma tiempo',
        youMatter: 'Tú importas',
        yourFeelingsAreValid: 'Tus sentimientos son válidos',
        reachOut: 'Está bien pedir ayuda',
        tomorrowIsNewDay: 'Mañana es un nuevo día',
        breathe: 'Respira profundamente',
        groundYourself: 'Ancláte en este momento',
        safeSpace: 'Este es tu espacio seguro',
      },
    };

    this.translations.set('es', es);
  }

  // ============ PUBLIC API ============

  /**
   * Get current language
   */
  getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  /**
   * Get language configuration
   */
  getLanguageConfig(): LanguageConfig {
    return LANGUAGES[this.currentLanguage];
  }

  /**
   * Get available languages
   */
  getAvailableLanguages(): LanguageConfig[] {
    return Object.values(LANGUAGES);
  }

  /**
   * Change language
   */
  async changeLanguage(language: SupportedLanguage): Promise<void> {
    if (!this.isValidLanguage(language)) {
      logger.warn('Invalid language code', { language });
      return;
    }

    const previousLanguage = this.currentLanguage;
    this.currentLanguage = language;

    // Save preference
    await AsyncStorage.setItem(STORAGE_KEY, language);

    // Apply RTL settings
    const config = LANGUAGES[language];
    if (config.rtl !== I18nManager.isRTL) {
      I18nManager.forceRTL(config.rtl);
      // Note: App will need to restart for RTL changes to take effect
    }

    // Notify listeners
    this.listeners.forEach(listener => listener(language));

    logger.info('Language changed', { from: previousLanguage, to: language });
  }

  /**
   * Subscribe to language changes
   */
  onLanguageChange(listener: (lang: SupportedLanguage) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Translate a key
   */
  t(key: string, params?: Record<string, any>): string {
    const translations = this.translations.get(this.currentLanguage);
    if (!translations) {
      logger.warn('Translations not loaded for language', { language: this.currentLanguage });
      return key;
    }

    // Navigate nested keys (e.g., 'common.yes')
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English
        const fallback = this.getFallbackTranslation(key);
        if (fallback) return this.interpolate(fallback, params);
        return key;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    return this.interpolate(value, params);
  }

  private getFallbackTranslation(key: string): string | null {
    const translations = this.translations.get('en');
    if (!translations) return null;

    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return null;
      }
    }

    return typeof value === 'string' ? value : null;
  }

  private interpolate(template: string, params?: Record<string, any>): string {
    if (!params) return template;

    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key]?.toString() || match;
    });
  }

  /**
   * Format number
   */
  formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
    const config = LANGUAGES[this.currentLanguage];
    const locale = this.getLocaleString();

    try {
      return new Intl.NumberFormat(locale, options).format(value);
    } catch (error) {
      logger.error('Number formatting failed', error);
      return value.toString();
    }
  }

  /**
   * Format currency
   */
  formatCurrency(value: number, currency?: string): string {
    const config = LANGUAGES[this.currentLanguage];
    const locale = this.getLocaleString();

    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency || config.numberFormat.currency,
      }).format(value);
    } catch (error) {
      logger.error('Currency formatting failed', error);
      return value.toString();
    }
  }

  /**
   * Format date
   */
  formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    const locale = this.getLocaleString();

    try {
      return new Intl.DateTimeFormat(locale, options).format(date);
    } catch (error) {
      logger.error('Date formatting failed', error);
      return date.toString();
    }
  }

  /**
   * Format time
   */
  formatTime(date: Date, options?: Intl.DateTimeFormatOptions): string {
    const config = LANGUAGES[this.currentLanguage];
    const locale = this.getLocaleString();

    const defaultOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: config.timeFormat === '12h',
    };

    try {
      return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(date);
    } catch (error) {
      logger.error('Time formatting failed', error);
      return date.toString();
    }
  }

  /**
   * Get relative time (e.g., "2 hours ago")
   */
  getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) {
      if (diffDay === 1) return this.t('common.yesterday');
      if (diffDay < 7) return `${diffDay} ${this.t('common.days')} ago`;
      if (diffDay < 30) return `${Math.floor(diffDay / 7)} ${this.t('common.weeks')} ago`;
      return this.formatDate(date);
    }

    if (diffHour > 0) {
      return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
    }

    if (diffMin > 0) {
      return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
    }

    return 'Just now';
  }

  private getLocaleString(): string {
    const config = LANGUAGES[this.currentLanguage];

    // Map language codes to locale strings
    const localeMap: Record<SupportedLanguage, string> = {
      en: 'en-US',
      es: 'es-ES',
      fr: 'fr-FR',
      de: 'de-DE',
      pt: 'pt-BR',
      zh: 'zh-CN',
      ja: 'ja-JP',
      ar: 'ar-SA',
      hi: 'hi-IN',
      ru: 'ru-RU',
    };

    return localeMap[config.code];
  }

  /**
   * Check if current language is RTL
   */
  isRTL(): boolean {
    return LANGUAGES[this.currentLanguage].rtl;
  }
}

// ============ EXPORTS ============

export const i18n = new I18nService();

// Convenience function for translations
export const t = (key: string, params?: Record<string, any>) => i18n.t(key, params);

export default i18n;