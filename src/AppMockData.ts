// Mock data for Solace AI Mobile App Infrastructure

// No mock data needed - this is an infrastructure debugging task
// Mock user data for dashboard
export const mockUserData = {
  name: "Alex",
  id: "user_123",
  joinDate: "2024-01-15",
  preferences: {
    theme: "light" as const,
    notifications: true,
    accessibility: {
      fontSize: "medium" as const,
      reduceMotion: false,
      highContrast: false,
    },
  },
};

// Mock app state for infrastructure testing
export const mockAppState = {
  isAuthenticated: true,
  onboardingCompleted: true,
  currentScreen: "dashboard" as const,
  loading: false,
  error: null,
};

// Mock theme preferences
export const mockThemePreferences = {
  mode: "light" as const,
  primaryColor: "#926247",
  secondaryColor: "#7DD44D",
  accessibility: {
    fontScale: 1,
    isReducedMotionEnabled: false,
    isHighContrastEnabled: false,
    isScreenReaderEnabled: false,
  },
};

// Mock navigation state
export const mockNavigationState = {
  currentTab: "Home" as const,
  history: ["Splash", "Cover", "Home"],
  canGoBack: true,
};

// Mock feature flags for testing infrastructure
export const mockFeatureFlags = {
  enableNewThemeSystem: true,
  enableFixedNavigation: true,
  enableImprovedLoading: true,
  enableAccessibilityFeatures: true,
  debugMode: true,
};

// Mock error states for testing
export const mockErrorStates = {
  themeLoadError: false,
  navigationError: false,
  storeError: false,
  componentError: false,
};

// Mock performance metrics
export const mockPerformanceMetrics = {
  appStartTime: 1200, // ms
  themeLoadTime: 150, // ms
  navigationSetupTime: 300, // ms
  firstRenderTime: 800, // ms
};

export default {
  mockUserData,
  mockAppState,
  mockThemePreferences,
  mockNavigationState,
  mockFeatureFlags,
  mockErrorStates,
  mockPerformanceMetrics,
};