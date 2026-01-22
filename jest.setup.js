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
