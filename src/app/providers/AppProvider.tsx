import { logger } from "@shared/utils/logger";

import { store, persistor } from "@app/store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightTheme, darkTheme } from "@theme/ThemeProvider";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  useColorScheme,
  AccessibilityInfo,
  Dimensions,
  Alert,
  Linking,
  Platform,
  AppState,
  View,
  Text,
  PixelRatio,
} from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// Type definitions
interface AccessibilityContextType {
  isScreenReaderEnabled: boolean;
  isReduceMotionEnabled: boolean;
  isHighContrastEnabled: boolean;
  fontScale: number;
  announceForAccessibility: (message: string) => void;
  setAccessibilityFocus: (reactTag: number) => void;
  toggleReduceMotion: () => void;
  toggleHighContrast: () => void;
}

interface SafetyPlan {
  immediateSteps?: string;
  [key: string]: any;
}

interface MentalHealthContextType {
  isCrisisMode: boolean;
  crisisLevel: string;
  emergencyContacts: any[];
  safetyPlan: SafetyPlan | null;
  isInTherapySession: boolean;
  sessionType: string | null;
  triggerCrisisMode: (level?: string, context?: any) => Promise<void>;
  exitCrisisMode: () => void;
  callEmergencyServices: () => void;
  contactCrisisHotline: () => void;
  updateSafetyPlan: (planData: SafetyPlan) => Promise<void>;
  executeSafetyPlan: () => void;
  startTherapySession: (type?: string) => void;
  endTherapySession: () => void;
}

interface PerformanceContextType {
  memoryUsage: number; // MED-NEW-009 FIX: -1 indicates measurement not available
  frameRate: number;
  renderTime: number;
  isLowMemoryMode: boolean;
  isOptimizedMode: boolean;
  backgroundTasksActive: boolean;
  // MED-NEW-009 FIX: Memory pressure level for diagnostics
  memoryPressureLevel: 'normal' | 'moderate' | 'critical';
  enableLowMemoryMode: () => void;
  disableLowMemoryMode: () => void;
  enableOptimizedMode: () => void;
  disableOptimizedMode: () => void;
  measureRenderTime: (componentName: string, renderFn: () => any) => any;
  cleanupMemory: () => void;
  // MED-NEW-009 FIX: Allow external sources to report memory pressure
  reportMemoryPressure: (level: 'normal' | 'moderate' | 'critical') => void;
}

// Accessibility Context
const AccessibilityContext = createContext<AccessibilityContextType>({
  isScreenReaderEnabled: false,
  isReduceMotionEnabled: false,
  isHighContrastEnabled: false,
  fontScale: 1,
  announceForAccessibility: () => {},
  setAccessibilityFocus: () => {},
  toggleReduceMotion: () => {},
  toggleHighContrast: () => {},
});

// Mental Health Context
const MentalHealthContext = createContext<MentalHealthContextType>({
  isCrisisMode: false,
  crisisLevel: "low",
  emergencyContacts: [],
  safetyPlan: null,
  isInTherapySession: false,
  sessionType: null,
  triggerCrisisMode: async () => {},
  exitCrisisMode: () => {},
  callEmergencyServices: () => {},
  contactCrisisHotline: () => {},
  updateSafetyPlan: async () => {},
  executeSafetyPlan: () => {},
  startTherapySession: () => {},
  endTherapySession: () => {},
});

// Performance Context
const PerformanceContext = createContext<PerformanceContextType>({
  memoryUsage: -1, // MED-NEW-009 FIX: Default to "not available"
  frameRate: 60,
  renderTime: 0,
  isLowMemoryMode: false,
  isOptimizedMode: false,
  backgroundTasksActive: false,
  memoryPressureLevel: 'normal',
  enableLowMemoryMode: () => {},
  disableLowMemoryMode: () => {},
  enableOptimizedMode: () => {},
  disableOptimizedMode: () => {},
  measureRenderTime: () => null,
  cleanupMemory: () => {},
  reportMemoryPressure: () => {},
});

// Hook exports
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider",
    );
  }
  return context;
};

export const useMentalHealth = () => {
  const context = useContext(MentalHealthContext);
  if (!context) {
    throw new Error(
      "useMentalHealth must be used within a MentalHealthProvider",
    );
  }
  return context;
};

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error("usePerformance must be used within a PerformanceProvider");
  }
  return context;
};

// Crisis intervention constants
const CRISIS_HOTLINES = {
  US: {
    suicide: "988",
    text: "741741",
    name: "National Suicide Prevention Lifeline",
  },
  emergency: "911",
};

const STORAGE_KEYS = {
  EMERGENCY_CONTACTS: "mental_health_emergency_contacts",
  SAFETY_PLAN: "mental_health_safety_plan",
  CRISIS_HISTORY: "mental_health_crisis_history",
};

const EnterpriseLoadingScreen: React.FC = () => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
    }}
  >
    <Text>Loading Solace AI...</Text>
  </View>
);

// Enhanced Provider Components
const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const [isReduceMotionEnabled, setIsReduceMotionEnabled] = useState(false);
  const [isHighContrastEnabled, setIsHighContrastEnabled] = useState(false);
  const [fontScale, setFontScale] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const checkAccessibilityFeatures = async () => {
      try {
        const [screenReader, reduceMotion] = await Promise.all([
          AccessibilityInfo.isScreenReaderEnabled(),
          AccessibilityInfo.isReduceMotionEnabled(),
        ]);

        if (isMounted) {
          setIsScreenReaderEnabled(screenReader);
          setIsReduceMotionEnabled(reduceMotion);
        }
      } catch (error) {
        logger.warn(
          "AccessibilityProvider: Failed to check accessibility features:",
          error,
        );
      }
    };

    // HIGH-010 FIX: Use PixelRatio.getFontScale() instead of Dimensions
    // Dimensions.get("window") does not have a fontScale property
    const updateFontScale = () => {
      if (isMounted) {
        const currentFontScale = PixelRatio.getFontScale();
        setFontScale(currentFontScale);
      }
    };

    checkAccessibilityFeatures();
    updateFontScale();

    const screenReaderSubscription = AccessibilityInfo.addEventListener(
      "screenReaderChanged",
      (enabled) => {
        if (isMounted) setIsScreenReaderEnabled(enabled);
      },
    );

    const reduceMotionSubscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      (enabled) => {
        if (isMounted) setIsReduceMotionEnabled(enabled);
      },
    );

    const dimensionsSubscription = Dimensions.addEventListener(
      "change",
      updateFontScale,
    );

    return () => {
      isMounted = false;
      screenReaderSubscription?.remove();
      reduceMotionSubscription?.remove();
      dimensionsSubscription?.remove();
    };
  }, []);

  const announceForAccessibility = useCallback(
    (message: string) => {
      if (isScreenReaderEnabled) {
        AccessibilityInfo.announceForAccessibility(message);
      }
    },
    [isScreenReaderEnabled],
  );

  const setAccessibilityFocus = useCallback(
    (reactTag: number) => {
      if (isScreenReaderEnabled && reactTag) {
        AccessibilityInfo.setAccessibilityFocus(reactTag);
      }
    },
    [isScreenReaderEnabled],
  );

  const toggleReduceMotion = useCallback(() => {
    setIsReduceMotionEnabled((prev) => !prev);
  }, []);

  const toggleHighContrast = useCallback(() => {
    setIsHighContrastEnabled((prev) => !prev);
  }, []);

  const value = {
    isScreenReaderEnabled,
    isReduceMotionEnabled,
    isHighContrastEnabled,
    fontScale,
    announceForAccessibility,
    setAccessibilityFocus,
    toggleReduceMotion,
    toggleHighContrast,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

const MentalHealthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isCrisisMode, setIsCrisisMode] = useState(false);
  const [crisisLevel, setCrisisLevel] = useState("low");
  const [emergencyContacts, setEmergencyContacts] = useState<any[]>([]);
  const [safetyPlan, setSafetyPlan] = useState<SafetyPlan | null>(null);
  const [isInTherapySession, setIsInTherapySession] = useState(false);
  const [sessionType, setSessionType] = useState<string | null>(null);

  useEffect(() => {
    // HIGH-001 FIX: Properly handle async function and track mount state
    let isMounted = true;

    const loadData = async () => {
      try {
        await loadStoredData();
      } catch (error) {
        if (isMounted) {
          logger.error("MentalHealthProvider: loadStoredData failed:", error);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const loadStoredData = async () => {
    try {
      const [contactsData, safetyPlanData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.EMERGENCY_CONTACTS),
        AsyncStorage.getItem(STORAGE_KEYS.SAFETY_PLAN),
      ]);

      if (contactsData) {
        setEmergencyContacts(JSON.parse(contactsData));
      }

      if (safetyPlanData) {
        setSafetyPlan(JSON.parse(safetyPlanData));
      }
    } catch (error) {
      logger.error("MentalHealthProvider: Failed to load stored data:", error);
    }
  };

  const triggerCrisisMode = useCallback(
    async (level = "medium", context = {}) => {
      logger.debug("🚨 MentalHealthProvider: Crisis mode triggered", {
        level,
        context,
      });
      setIsCrisisMode(true);
      setCrisisLevel(level);

      if (level === "critical") {
        Alert.alert(
          "Crisis Support Available",
          "We're here to help. You can speak with a crisis counselor right now.",
          [
            {
              text: "Call 988",
              onPress: () => contactCrisisHotline(),
              style: "default",
            },
            {
              text: "Emergency Services",
              onPress: () => callEmergencyServices(),
              style: "destructive",
            },
            {
              text: "Stay in App",
              style: "cancel",
            },
          ],
        );
      }
    },
    [isInTherapySession, sessionType],
  );

  const exitCrisisMode = useCallback(() => {
    logger.debug("✅ MentalHealthProvider: Exiting crisis mode");
    setIsCrisisMode(false);
    setCrisisLevel("low");
  }, []);

  // HIGH-001 FIX: Validate phone link availability before attempting to open
  // This prevents crashes on devices without phone capability (simulators, tablets)
  const callEmergencyServices = useCallback(async () => {
    const phoneNumber = `tel:${CRISIS_HOTLINES.emergency}`;

    try {
      const canOpen = await Linking.canOpenURL(phoneNumber);

      if (canOpen) {
        await Linking.openURL(phoneNumber);
      } else {
        // Device cannot make phone calls (simulator, tablet, etc.)
        logger.warn("Device cannot make phone calls - showing manual dial instructions");
        Alert.alert(
          "Phone Call Not Available",
          `This device cannot make phone calls. Please use another device to dial ${CRISIS_HOTLINES.emergency} for emergency services.`,
          [
            { text: "OK", style: "default" },
          ]
        );
      }
    } catch (error) {
      logger.error("Failed to open emergency dialer:", error);
      Alert.alert(
        "Unable to Call",
        `Please dial ${CRISIS_HOTLINES.emergency} directly for emergency services.`,
      );
    }
  }, []);

  // HIGH-001 FIX: Validate phone link availability before attempting to open
  const contactCrisisHotline = useCallback(async () => {
    const phoneNumber = `tel:${CRISIS_HOTLINES.US.suicide}`;

    try {
      const canOpen = await Linking.canOpenURL(phoneNumber);

      if (canOpen) {
        await Linking.openURL(phoneNumber);
      } else {
        // Device cannot make phone calls - offer text alternative
        logger.warn("Device cannot make phone calls - offering alternatives");
        Alert.alert(
          "Phone Call Not Available",
          `This device cannot make phone calls. You can:\n\n• Text HOME to ${CRISIS_HOTLINES.US.text}\n• Call ${CRISIS_HOTLINES.US.suicide} from another device\n• Visit 988lifeline.org for chat support`,
          [
            { text: "OK", style: "default" },
          ]
        );
      }
    } catch (error) {
      logger.error("Failed to open crisis hotline dialer:", error);
      Alert.alert(
        "Unable to Call",
        `Please dial ${CRISIS_HOTLINES.US.suicide} directly for the ${CRISIS_HOTLINES.US.name}.`,
      );
    }
  }, []);

  const updateSafetyPlan = useCallback(async (planData: any) => {
    try {
      setSafetyPlan(planData);
      await AsyncStorage.setItem(
        STORAGE_KEYS.SAFETY_PLAN,
        JSON.stringify(planData),
      );
    } catch (error) {
      logger.error(
        "MentalHealthProvider: Failed to update safety plan:",
        error,
      );
    }
  }, []);

  const executeSafetyPlan = useCallback(() => {
    if (!safetyPlan) {
      Alert.alert(
        "No Safety Plan",
        "You haven't created a safety plan yet. Would you like to create one now?",
      );
      return;
    }
    Alert.alert(
      "Safety Plan Activated",
      safetyPlan.immediateSteps || "Following your personalized safety plan...",
    );
  }, [safetyPlan]);

  const startTherapySession = useCallback((type = "chat") => {
    setIsInTherapySession(true);
    setSessionType(type);
  }, []);

  const endTherapySession = useCallback(() => {
    setIsInTherapySession(false);
    setSessionType(null);
  }, []);

  const value = {
    isCrisisMode,
    crisisLevel,
    emergencyContacts,
    safetyPlan,
    isInTherapySession,
    sessionType,
    triggerCrisisMode,
    exitCrisisMode,
    callEmergencyServices,
    contactCrisisHotline,
    updateSafetyPlan,
    executeSafetyPlan,
    startTherapySession,
    endTherapySession,
  };

  return (
    <MentalHealthContext.Provider value={value}>
      {children}
    </MentalHealthContext.Provider>
  );
};

const PerformanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // MED-NEW-009 FIX: Use -1 to indicate "not available" instead of fake values
  const [memoryUsage, setMemoryUsage] = useState(-1);
  const [frameRate, setFrameRate] = useState(60);
  const [renderTime, setRenderTime] = useState(0);
  const [isLowMemoryMode, setIsLowMemoryMode] = useState(false);
  const [isOptimizedMode, setIsOptimizedMode] = useState(false);
  const [backgroundTasksActive, setBackgroundTasksActive] = useState(false);
  // MED-NEW-009 FIX: Track memory pressure events instead of fake percentages
  const [memoryPressureLevel, setMemoryPressureLevel] = useState<'normal' | 'moderate' | 'critical'>('normal');
  // MED-NEW-009 FIX: Track estimated memory based on observable metrics
  const [renderCount, setRenderCount] = useState(0);
  const [slowRenderCount, setSlowRenderCount] = useState(0);

  useEffect(() => {
    // MED-NEW-009 FIX: Improved memory monitoring strategy
    // - Web: Use actual performance.memory API when available
    // - React Native: Use heuristics based on render performance and memory pressure signals
    // - Never report fake percentages - use -1 for "unavailable"
    const checkMemoryUsage = () => {
      let memoryPercent = -1; // -1 indicates measurement not available

      // Try to get actual memory info from performance API (web)
      if (typeof performance !== "undefined" && (performance as any).memory) {
        const memoryInfo = (performance as any).memory;
        if (memoryInfo.usedJSHeapSize && memoryInfo.jsHeapSizeLimit) {
          memoryPercent = (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100;
        }
      }
      // MED-NEW-009 FIX: For React Native, estimate based on performance metrics
      // This is more honest than hardcoded values
      else if (Platform.OS !== "web") {
        // Calculate estimated memory pressure from observable metrics:
        // - Slow render ratio indicates memory pressure
        // - Known low memory mode from OS triggers
        const slowRenderRatio = renderCount > 0 ? slowRenderCount / renderCount : 0;

        if (memoryPressureLevel === 'critical') {
          memoryPercent = 90; // OS reported critical memory
        } else if (memoryPressureLevel === 'moderate') {
          memoryPercent = 70; // OS reported moderate pressure
        } else if (slowRenderRatio > 0.3) {
          // More than 30% of renders are slow - likely memory pressure
          memoryPercent = 65;
        } else if (slowRenderRatio > 0.1) {
          // Some slow renders - moderate estimate
          memoryPercent = 45;
        } else {
          // No memory pressure indicators - report as unavailable
          // rather than guessing a number
          memoryPercent = -1;
        }
      }

      setMemoryUsage(memoryPercent);

      // Only trigger low memory mode if we have actual high usage data (not -1)
      if (memoryPercent >= 80 && !isLowMemoryMode) {
        logger.warn("⚠️ PerformanceProvider: High memory usage detected:", memoryPercent.toFixed(1) + "%");
        enableLowMemoryMode();
      } else if (memoryPercent > 0 && memoryPercent < 60 && isLowMemoryMode) {
        // MED-009 FIX: Auto-recover from low memory mode when usage drops
        disableLowMemoryMode();
      }
    };

    const memoryCheckInterval = setInterval(checkMemoryUsage, 30000);
    checkMemoryUsage();

    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState.match(/inactive|background/)) {
        setBackgroundTasksActive(true);
        enableOptimizedMode();
      } else if (nextAppState === "active") {
        setBackgroundTasksActive(false);
        cleanupMemory();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      clearInterval(memoryCheckInterval);
      subscription?.remove();
    };
  }, [isLowMemoryMode, memoryPressureLevel, renderCount, slowRenderCount]);

  const enableLowMemoryMode = useCallback(() => {
    setIsLowMemoryMode(true);
  }, []);

  const disableLowMemoryMode = useCallback(() => {
    setIsLowMemoryMode(false);
  }, []);

  const enableOptimizedMode = useCallback(() => {
    setIsOptimizedMode(true);
  }, []);

  const disableOptimizedMode = useCallback(() => {
    setIsOptimizedMode(false);
  }, []);

  // MED-NEW-009 FIX: Track render performance for memory pressure estimation
  const measureRenderTime = useCallback(
    (componentName: string, renderFn: () => any) => {
      const startTime = Date.now();
      const result = renderFn();
      const endTime = Date.now();
      const duration = endTime - startTime;
      setRenderTime(duration);

      // MED-NEW-009 FIX: Track slow renders for memory pressure estimation
      setRenderCount(prev => prev + 1);
      if (duration > 16) { // Slower than 60fps threshold
        setSlowRenderCount(prev => prev + 1);
      }

      return result;
    },
    [],
  );

  // MED-NEW-009 FIX: Method to report memory pressure from external sources
  const reportMemoryPressure = useCallback((level: 'normal' | 'moderate' | 'critical') => {
    logger.debug(`Memory pressure level changed to: ${level}`);
    setMemoryPressureLevel(level);
    if (level === 'critical') {
      enableLowMemoryMode();
    }
  }, []);

  const cleanupMemory = useCallback(() => {
    if (__DEV__ && global.gc) {
      global.gc();
    }
  }, []);

  const value = {
    memoryUsage,
    frameRate,
    renderTime,
    isLowMemoryMode,
    isOptimizedMode,
    backgroundTasksActive,
    // MED-NEW-009 FIX: Expose memory pressure level for better diagnostics
    memoryPressureLevel,
    enableLowMemoryMode,
    disableLowMemoryMode,
    enableOptimizedMode,
    // MED-NEW-009 FIX: Allow external components to report memory pressure
    reportMemoryPressure,
    disableOptimizedMode,
    measureRenderTime,
    cleanupMemory,
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={<EnterpriseLoadingScreen />} persistor={persistor}>
        <PaperProvider theme={(isDark ? darkTheme : lightTheme) as any}>
          <AccessibilityProvider>
            <MentalHealthProvider>
              <PerformanceProvider>{children}</PerformanceProvider>
            </MentalHealthProvider>
          </AccessibilityProvider>
        </PaperProvider>
      </PersistGate>
    </ReduxProvider>
  );
};

export default AppProvider;
// Re-export named hooks and contexts for stable imports
export { AccessibilityContext, MentalHealthContext, PerformanceContext };
