import AsyncStorage from '@react-native-async-storage/async-storage';

const NAV_STATE_KEY = '@solace_navigation_state';
const SESSION_DATA_KEY_PREFIX = '@solace_session_data';
const ACCESSIBILITY_HISTORY_KEY = '@solace_accessibility_history';
// In-memory session cache stores the latest data with timestamps per type
let __sessionCache = {};

export const saveNavigationState = async (state) => {
  const payload = {
    state,
    timestamp: Date.now(),
    version: '1.0',
  };
  await AsyncStorage.setItem(NAV_STATE_KEY, JSON.stringify(payload));
};

export const restoreNavigationState = async () => {
  const raw = await AsyncStorage.getItem(NAV_STATE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    const twentyFourHours = 24 * 60 * 60 * 1000;
    if (Date.now() - parsed.timestamp > twentyFourHours) {
      await AsyncStorage.multiRemove([NAV_STATE_KEY]);
      return null;
    }
    return parsed.state;
  } catch {
    return null;
  }
};

export const clearNavigationState = async () => {
  await AsyncStorage.multiRemove([
    NAV_STATE_KEY,
    SESSION_DATA_KEY_PREFIX,
    ACCESSIBILITY_HISTORY_KEY,
  ]);
};

export const saveSessionData = async (type, data) => {
  const key = `${SESSION_DATA_KEY_PREFIX}_${type}`;
  const now = Date.now();
  const payload = {
    type,
    data,
    timestamp: now,
    encrypted: false,
  };
  await AsyncStorage.setItem(key, JSON.stringify(payload));
  __sessionCache[type] = { data, timestamp: now };
};

export const restoreSessionData = async () => {
  const types = ['therapy', 'assessment', 'mood'];
  const keys = types.map((t) => `${SESSION_DATA_KEY_PREFIX}_${t}`);
  const result = {};

  // Read persisted storage for all types
  const persisted = {};
  for (const key of keys) {
    const raw = await AsyncStorage.getItem(key);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.type) {
          persisted[parsed.type] = { data: parsed.data, timestamp: parsed.timestamp ?? 0 };
        }
      } catch {
        // ignore malformed entries
      }
    }
  }

  // For each type, choose the freshest between in-memory and persisted
  for (const t of types) {
    const mem = __sessionCache[t];
    const memTs = mem?.timestamp ?? -1;
    const memData = mem?.data;
    const per = persisted[t];
    const perTs = per?.timestamp ?? -1;
    const perData = per?.data;

    if (memData != null || perData != null) {
      if (memTs >= perTs) {
        result[t] = memData ?? perData;
      } else {
        result[t] = perData ?? memData;
      }
    }
  }

  return result;
};

export const saveAccessibilityHistory = async (screen, action, metadata = {}) => {
  const entry = { screen, action, metadata, timestamp: Date.now() };
  await AsyncStorage.setItem(ACCESSIBILITY_HISTORY_KEY, JSON.stringify(entry));
};

export const NavigationPersistence = {
  saveNavigationState,
  restoreNavigationState,
  clearNavigationState,
  saveSessionData,
  restoreSessionData,
  saveAccessibilityHistory,
};
