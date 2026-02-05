/**
 * Jest Setup for Solace AI Mobile Testing
 * Minimal setup for testing - will be extended as components are built
 */

// Mock useColorScheme hook for consistent test behavior
jest.mock("react-native/Libraries/Utilities/useColorScheme", () => ({
  default: jest.fn(() => "dark"),
}));

// Keep a stable reference to the real Date constructor
const __RealDate = Date;

function __ensureDateNow() {
  try {
    if (typeof Date.now !== "function") {
      Object.defineProperty(Date, "now", {
        configurable: true,
        writable: true,
        value: () => new __RealDate().getTime(),
      });
    }
  } catch {
    Date.now = () => new __RealDate().getTime();
  }
}

__ensureDateNow();

// Global fetch mock for API testing
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(""),
  }),
);

// Mock TurboModuleRegistry for React Native 0.76+ compatibility
jest.mock("react-native/Libraries/TurboModule/TurboModuleRegistry", () => ({
  getEnforcing: jest.fn((name) => {
    if (name === "SettingsManager") {
      return {
        settings: {},
        setSettings: jest.fn(),
        getSettings: jest.fn(() => ({})),
      };
    }
    if (name === "DeviceInfo") {
      return {
        getConstants: jest.fn(() => ({
          Dimensions: {
            window: { width: 375, height: 667, scale: 2, fontScale: 1 },
            screen: { width: 375, height: 667, scale: 2, fontScale: 1 },
          },
        })),
      };
    }
    if (name === "PlatformConstants") {
      return {
        getConstants: jest.fn(() => ({
          forceTouchAvailable: false,
          interfaceIdiom: "phone",
          osVersion: "14.0",
          systemName: "iOS",
        })),
      };
    }
    return null;
  }),
  get: jest.fn(() => null),
}));

// Mock NativeDeviceInfo
jest.mock("react-native/src/private/specs/modules/NativeDeviceInfo", () => ({
  getConstants: jest.fn(() => ({
    Dimensions: {
      window: { width: 375, height: 667, scale: 2, fontScale: 1 },
      screen: { width: 375, height: 667, scale: 2, fontScale: 1 },
    },
  })),
}));

// Mock NativeSettingsManager
jest.mock("react-native/Libraries/Settings/NativeSettingsManager", () => ({
  getConstants: jest.fn(() => ({
    settings: {},
  })),
}));

// Mock NativeEventEmitter
jest.mock("react-native/Libraries/EventEmitter/NativeEventEmitter", () => {
  function MockNativeEventEmitter() {
    this.listeners = {};
    this.addListener = jest.fn();
    this.removeListener = jest.fn();
    this.removeAllListeners = jest.fn();
    this.emit = jest.fn();
  }
  return MockNativeEventEmitter;
});

// Mock theme module to prevent undefined errors in tests
jest.mock("./src/shared/theme", () => ({
  palette: {
    brown: {
      900: "#1C1410",
      800: "#2A1F1A",
      700: "#3D2D24",
      600: "#57493D",
      500: "#78716C",
      400: "#A8A29E",
    },
    tan: {
      600: "#8B6F47",
      500: "#C4A574",
      400: "#D4B894",
      300: "#E0CAA4",
    },
    olive: {
      700: "#6B7B3A",
      600: "#8A9D52",
      550: "#8B9D4C",
      500: "#9AAD5C",
      450: "#A0B55C",
      400: "#AAB978",
      300: "#C4D19B",
    },
    gold: {
      500: "#C4A535",
      400: "#F5C563",
    },
    stone: {
      100: "#F5F5F4",
      200: "#E7E5E4",
      300: "#D6D3D1",
      400: "#A8A29E",
      500: "#78716C",
      600: "#44403C",
      700: "#3D3533",
      800: "#292524",
      900: "#1C1917",
    },
    red: {
      500: "#EF4444",
    },
    green: {
      500: "#22C55E",
      450: "#4A9E8C",
    },
    amber: {
      500: "#F59E0B",
      450: "#FFD93D",
    },
    orange: {
      500: "#E8853A",
      600: "#EA580C",
      700: "#C2410C",
    },
    blue: {
      500: "#3B82F6",
      600: "#2563EB",
    },
    purple: {
      500: "#A855F7",
      600: "#9333EA",
    },
    teal: {
      500: "#14B8A6",
    },
    pink: {
      500: "#EC4899",
    },
    yellow: {
      500: "#EAB308",
      400: "#FACC15",
      300: "#FDE047",
    },
    slate: {
      50: "#F8FAFC",
      100: "#F1F5F9",
      200: "#E2E8F0",
      300: "#CBD5E1",
      400: "#94A3B8",
      500: "#64748B",
      600: "#475569",
      700: "#334155",
      800: "#1E293B",
      900: "#0F172A",
    },
    background: {
      primary: "#1C1410",
      secondary: "#2A1F1A",
      tertiary: "#3D2E23",
      quaternary: "#4A3A2F",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#94A3B8",
      tertiary: "#64748B",
      disabled: "#475569",
      inverse: "#1C1410",
    },
    primary: {
      gold: "#C4A574",
    },
    accent: {
      orange: "#E8853A",
    },
    opacity: {
      white10: "rgba(255, 255, 255, 0.1)",
      white20: "rgba(255, 255, 255, 0.2)",
      black50: "rgba(0, 0, 0, 0.5)",
    },
    indigo: {
      500: "#6366F1",
      400: "#818CF8",
      300: "#A5B4FC",
      200: "#C7D2FE",
      100: "#E0E7FF",
    },
    white: "#FFFFFF",
    gray: {
      50: "#F8FAFC",
      100: "#F1F5F9",
      200: "#E2E8F0",
      300: "#CBD5E1",
      400: "#94A3B8",
      450: "#8A8A8A",
      500: "#64748B",
      600: "#475569",
      700: "#334155",
      800: "#1E293B",
      900: "#0F172A",
    },
    black: "#000000",
    alpha: {
      5: "0D",
      10: "1A",
      15: "26",
      20: "33",
      30: "4D",
      40: "66",
      50: "80",
      60: "99",
      70: "B3",
      80: "CC",
      90: "E6",
    },
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#818CF8",
    onboarding: {
      step1: "#6B7B3A",
      step2: "#E8853A",
      step3: "#6B6B6B",
      step4: "#C4A535",
      step5: "#7B68B5",
    },
  },
  colors: {
    background: {
      primary: "#1C1410",
      secondary: "#2A1F1A",
      tertiary: "#3D2E23",
      overlay: "rgba(0, 0, 0, 0.85)",
      elevated: "#57493D",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#94A3B8",
      tertiary: "#64748B",
      disabled: "#475569",
      inverse: "#1C1410",
      accent: "#C4A574",
      muted: "#A8A29E",
      error: "#EF4444",
      success: "#22C55E",
      warning: "#F59E0B",
      info: "#818CF8",
    },
    border: {
      default: "rgba(255, 255, 255, 0.1)",
      light: "rgba(255, 255, 255, 0.05)",
      medium: "rgba(255, 255, 255, 0.2)",
      heavy: "rgba(255, 255, 255, 0.3)",
      accent: "#C4A574",
      error: "#EF4444",
    },
    interactive: {
      default: "#C4A574",
      hover: "#D4B894",
      active: "#E0CAA4",
      disabled: "rgba(196, 165, 116, 0.3)",
      ghost: "rgba(255, 255, 255, 0.05)",
    },
    status: {
      success: {
        background: "rgba(34, 197, 94, 0.15)",
        border: "rgba(34, 197, 94, 0.3)",
        text: "#22C55E",
      },
      warning: {
        background: "rgba(245, 158, 11, 0.15)",
        border: "rgba(245, 158, 11, 0.3)",
        text: "#F59E0B",
      },
      error: {
        background: "rgba(239, 68, 68, 0.15)",
        border: "rgba(239, 68, 68, 0.3)",
        text: "#EF4444",
      },
      info: {
        background: "rgba(129, 140, 248, 0.15)",
        border: "rgba(129, 140, 248, 0.3)",
        text: "#818CF8",
      },
    },
    form: {
      background: "rgba(255, 255, 255, 0.05)",
      backgroundFocus: "rgba(255, 255, 255, 0.1)",
      border: "rgba(255, 255, 255, 0.2)",
      borderFocus: "#C4A574",
      borderError: "#EF4444",
      placeholder: "#64748B",
      label: "#94A3B8",
      error: "#EF4444",
    },
    badge: {
      default: {
        background: "#475569",
        text: "#E2E8F0",
      },
      success: {
        background: "rgba(34, 197, 94, 0.2)",
        text: "#22C55E",
      },
      warning: {
        background: "rgba(245, 158, 11, 0.2)",
        text: "#F59E0B",
      },
      error: {
        background: "rgba(239, 68, 68, 0.2)",
        text: "#EF4444",
      },
      info: {
        background: "rgba(129, 140, 248, 0.2)",
        text: "#818CF8",
      },
    },
    progress: {
      track: "#334155",
      fill: "#C4A574",
      success: "#22C55E",
      warning: "#F59E0B",
      error: "#EF4444",
    },
  },
  shadows: {},
  gradients: {},
  animations: {},
  zIndex: {},
}));
