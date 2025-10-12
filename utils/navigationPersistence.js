import AsyncStorage from '@react-native-async-storage/async-storage';

const NAV_STATE_KEY = 'NAVIGATION_STATE';
const SESSION_DATA_KEY = 'SESSION_DATA';

export const saveNavigationState = async (state) => {
  await AsyncStorage.setItem(NAV_STATE_KEY, JSON.stringify(state ?? {}));
};

export const restoreNavigationState = async () => {
  const raw = await AsyncStorage.getItem(NAV_STATE_KEY);
  return raw ? JSON.parse(raw) : undefined;
};

export const clearNavigationState = async () => {
  await AsyncStorage.removeItem(NAV_STATE_KEY);
};

export const saveSessionData = async (data) => {
  await AsyncStorage.setItem(SESSION_DATA_KEY, JSON.stringify(data ?? {}));
};

export const restoreSessionData = async () => {
  const raw = await AsyncStorage.getItem(SESSION_DATA_KEY);
  return raw ? JSON.parse(raw) : undefined;
};

export const NavigationPersistence = {
  saveNavigationState,
  restoreNavigationState,
  clearNavigationState,
  saveSessionData,
  restoreSessionData,
};
