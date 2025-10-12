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
} from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LoadingSpinner } from "../../ui/animations";
import { Container } from "../../ui/components/organisms";
import { lightTheme, darkTheme } from "../../ui/theme/MaterialTheme";
import { store, persistor } from "../store/store";

// Accessibility Context
const AccessibilityContext = createContext({
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
const MentalHealthContext = createContext({
  isCrisisMode: false,
  crisisLevel: "low",
  emergencyContacts: [],
  safetyPlan: null,
  isInTherapySession: false,
  sessionType: null,
  triggerCrisisMode: () => {},
  exitCrisisMode: () => {},
  callEmergencyServices: () => {},
  contactCrisisHotline: () => {},
  updateSafetyPlan: () => {},
  executeSafetyPlan: () => {},
  startTherapySession: () => {},
  endTherapySession: () => {},
});

// Performance Context
const PerformanceContext = createContext({
  memoryUsage: 0,
  frameRate: 60,
  renderTime: 0,
  isLowMemoryMode: false,
  isOptimizedMode: false,
  backgroundTasksActive: false,
  enableLowMemoryMode: () => {},
  disableLowMemoryMode: () => {},
  enableOptimizedMode: () => {},
  disableOptimizedMode: () => {},
  measureRenderTime: () => {},
  cleanupMemory: () => {},
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

const EnterpriseLoadingScreen = () => (
  <Container
    therapeuticColor="serenityGreen"
    animationType="fade"
    style={{
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <LoadingSpinner therapeuticColor="#7D944D" size={60} />
  </Container>
);

// Enhanced Provider Components
const AccessibilityProvider = ({ children }) => {
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
        console.warn(
          "AccessibilityProvider: Failed to check accessibility features:",
          error,
        );
      }
    };

    const updateFontScale = () => {
      if (isMounted) {
        const { fontScale: currentFontScale } = Dimensions.get("window");
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
    (message) => {
      if (isScreenReaderEnabled) {
        AccessibilityInfo.announceForAccessibility(message);
      }
    },
    [isScreenReaderEnabled],
  );

  const setAccessibilityFocus = useCallback(
    (reactTag) => {
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

const MentalHealthProvider = ({ children }) => {
  const [isCrisisMode, setIsCrisisMode] = useState(false);
  const [crisisLevel, setCrisisLevel] = useState("low");
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [safetyPlan, setSafetyPlan] = useState(null);
  const [isInTherapySession, setIsInTherapySession] = useState(false);
  const [sessionType, setSessionType] = useState(null);

  useEffect(() => {
    loadStoredData();
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
      console.error("MentalHealthProvider: Failed to load stored data:", error);
    }
  };

  const triggerCrisisMode = useCallback(
    async (level = "medium", context = {}) => {
      console.log("🚨 MentalHealthProvider: Crisis mode triggered", {
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
    console.log("✅ MentalHealthProvider: Exiting crisis mode");
    setIsCrisisMode(false);
    setCrisisLevel("low");
  }, []);

  const callEmergencyServices = useCallback(() => {
    const phoneNumber =
      Platform.OS === "ios"
        ? `tel:${CRISIS_HOTLINES.emergency}`
        : `tel:${CRISIS_HOTLINES.emergency}`;
    Linking.openURL(phoneNumber).catch((error) => {
      console.error("Failed to open emergency dialer:", error);
      Alert.alert(
        "Unable to Call",
        `Please dial ${CRISIS_HOTLINES.emergency} directly for emergency services.`,
      );
    });
  }, []);

  const contactCrisisHotline = useCallback(() => {
    const phoneNumber =
      Platform.OS === "ios"
        ? `tel:${CRISIS_HOTLINES.US.suicide}`
        : `tel:${CRISIS_HOTLINES.US.suicide}`;
    Linking.openURL(phoneNumber).catch((error) => {
      console.error("Failed to open crisis hotline dialer:", error);
      Alert.alert(
        "Unable to Call",
        `Please dial ${CRISIS_HOTLINES.US.suicide} directly for the ${CRISIS_HOTLINES.US.name}.`,
      );
    });
  }, []);

  const updateSafetyPlan = useCallback(async (planData) => {
    try {
      setSafetyPlan(planData);
      await AsyncStorage.setItem(
        STORAGE_KEYS.SAFETY_PLAN,
        JSON.stringify(planData),
      );
    } catch (error) {
      console.error(
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

const PerformanceProvider = ({ children }) => {
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [frameRate, setFrameRate] = useState(60);
  const [renderTime, setRenderTime] = useState(0);
  const [isLowMemoryMode, setIsLowMemoryMode] = useState(false);
  const [isOptimizedMode, setIsOptimizedMode] = useState(false);
  const [backgroundTasksActive, setBackgroundTasksActive] = useState(false);

  useEffect(() => {
    const checkMemoryUsage = () => {
      const simulatedMemoryUsage = Math.random() * 100;
      setMemoryUsage(simulatedMemoryUsage);

      if (simulatedMemoryUsage > 80 && !isLowMemoryMode) {
        console.warn("⚠️ PerformanceProvider: High memory usage detected");
        enableLowMemoryMode();
      }
    };

    const memoryCheckInterval = setInterval(checkMemoryUsage, 30000);
    checkMemoryUsage();

    const handleAppStateChange = (nextAppState) => {
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
  }, [isLowMemoryMode]);

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

  const measureRenderTime = useCallback((componentName, renderFn) => {
    const startTime = Date.now();
    const result = renderFn();
    const endTime = Date.now();
    const duration = endTime - startTime;
    setRenderTime(duration);
    return result;
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
    enableLowMemoryMode,
    disableLowMemoryMode,
    enableOptimizedMode,
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

export const AppProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={<EnterpriseLoadingScreen />} persistor={persistor}>
        <PaperProvider theme={isDark ? darkTheme : lightTheme}>
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
export {
  AccessibilityContext,
  MentalHealthContext,
  PerformanceContext,
};
