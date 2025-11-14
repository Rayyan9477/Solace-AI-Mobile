/**
 * Jest Setup for Mental Health App Testing
 * Enhanced setup with mental health specific mocks and utilities
 */

import "react-native-gesture-handler/jestSetup";

// Suppress specific React Native deprecation warnings that are not relevant to our codebase
const originalWarn = console.warn;
console.warn = (...args) => {
  const message = args.join(' ');
  // Suppress warnings about deprecated React Native components we're not using
  if (
    message.includes('ProgressBarAndroid has been extracted from react-native core') ||
    message.includes('Clipboard has been extracted from react-native core') ||
    message.includes('PushNotificationIOS has been extracted from react-native core')
  ) {
    return;
  }
  originalWarn.apply(console, args);
};

// Keep a stable reference to the real Date constructor for fallback usage
const __RealDate = Date;

function __ensureDateNow() {
  try {
    if (typeof Date.now !== 'function') {
      Object.defineProperty(Date, 'now', {
        configurable: true,
        writable: true,
        value: () => new __RealDate().getTime(),
      });
    }
  } catch {
    // last resort
    // eslint-disable-next-line no-undef
    Date.now = () => new __RealDate().getTime();
  }
}

// Enhanced Expo Haptics mock for mental health app
jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: "light",
    Medium: "medium",
    Heavy: "heavy",
  },
  NotificationFeedbackType: {
    Success: "success",
    Warning: "warning",
    Error: "error",
  },
}));

jest.mock("expo-speech", () => ({
  speak: jest.fn(),
  isSpeakingAsync: jest.fn(),
  stop: jest.fn(),
}));

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

jest.mock("@react-navigation/native", () => {
  const actual = jest.requireActual("@react-navigation/native");
  const React = require("react");
  const NavigationContainer = ({ children }) => React.createElement(React.Fragment, null, children);
  const useIsFocused = jest.fn(() => true);
  // Core mock navigation object we can reuse/override in individual tests
  const baseNavigation = { navigate: jest.fn(), goBack: jest.fn() };
  const useNavigation = jest.fn(() => baseNavigation);
  return {
    ...actual,
    NavigationContainer,
    useNavigation,
    useIsFocused,
    // expose for direct import overriding if a test wants to manipulate navigate without mockReturnValue
    __mockedNavigation: baseNavigation,
  };
});

// Mock additional animation and UI libraries
jest.mock("react-native-svg", () => {
  const React = require("react");
  return {
    default: React.View,
    Svg: React.View,
    G: React.View,
    Path: React.View,
    Circle: React.View,
    Rect: React.View,
    Line: React.View,
    Polyline: React.View,
    Polygon: React.View,
    Ellipse: React.View,
    Defs: React.View,
    LinearGradient: React.View,
    Stop: React.View,
    ClipPath: React.View,
  };
});

jest.mock("expo-linear-gradient", () => {
  const React = require("react");
  const { View } = require("react-native");
  const LinearGradient = React.forwardRef((props, ref) => React.createElement(View, { ref, ...props }));
  return { LinearGradient, default: LinearGradient };
});

// Mock StatusBar to avoid native calls in tests
jest.mock('react-native/Libraries/Components/StatusBar/StatusBar', () => {
  const React = require('react');
  const StatusBar = React.forwardRef((props, ref) => null);
  StatusBar.setTranslucent = jest.fn();
  StatusBar.setBackgroundColor = jest.fn();
  StatusBar.setBarStyle = jest.fn();
  return StatusBar;
});

// Mock icon/font libraries to avoid font loading issues in tests
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const Icon = (props) => React.createElement('Icon', props);
  return {
    Ionicons: Icon,
    MaterialIcons: Icon,
    FontAwesome: Icon,
    Entypo: Icon,
    Feather: Icon,
    MaterialCommunityIcons: Icon,
    default: Icon,
  };
});

jest.mock('expo-font', () => ({
  loadAsync: jest.fn(() => Promise.resolve()),
  isLoaded: jest.fn(() => true),
  isLoading: jest.fn(() => false),
  unloadAsync: jest.fn(() => Promise.resolve()),
}));

// Mock internal icon components used by the app
jest.mock('@components/icons', () => ({
  MentalHealthIcon: ({ children }) => children || null,
}));

jest.mock('@components/icons/FreudIcons', () => ({
  FreudLogo: ({ children }) => children || null,
}));

// Mental Health App Specific Setup
global.window = {};
global.window = global;

// Ensure Date.now is a function (some tests stub Date which can clobber now)
__ensureDateNow();
// Guard against tests that mock global Date constructor without now; re-attach now if missing
try {
  // eslint-disable-next-line no-undef
  __ensureDateNow();
} catch {}

// Re-attach Date.now before each test in case a test mocked global Date without preserving now
try {
  beforeEach(() => {
    __ensureDateNow();
  });
} catch {}

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

// Mock NativeDeviceInfo specifically
jest.mock("react-native/src/private/specs/modules/NativeDeviceInfo", () => ({
  getConstants: jest.fn(() => ({
    Dimensions: {
      window: { width: 375, height: 667, scale: 2, fontScale: 1 },
      screen: { width: 375, height: 667, scale: 2, fontScale: 1 },
    },
  })),
}));

// Mock Crisis Manager for safety testing
// jest.mock("./src/features/crisis/CrisisManager", () => {
//   return jest.fn().mockImplementation(() => ({
//     detectCrisis: jest.fn((text) => ({
//       isCrisis:
//         text.toLowerCase().includes("suicide") ||
//         text.toLowerCase().includes("hurt myself"),
//       severity: "high",
//       keywords: ["suicide", "hurt myself"].filter((k) =>
//         text.toLowerCase().includes(k),
//       ),
//       riskScore: 0.9,
//       timestamp: new Date().toISOString(),
//     })),
//     handleCrisisDetected: jest.fn(),
//     getEmergencyResources: jest.fn(() => [
//       {
//         id: "suicide_prevention_lifeline",
//         name: "988 Suicide & Crisis Lifeline",
//         number: "988",
//         type: "voice",
//         priority: 1,
//       },
//     ]),
//     callEmergencyService: jest.fn(),
//     logCrisisEvent: jest.fn(),
//   }));
// });

// Global fetch mock for API testing
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
);

// Make fetch available globally (for environments where it's not available)
if (typeof fetch === 'undefined') {
  globalThis.fetch = global.fetch;
}
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
);

// Mental health testing utilities
global.testUtils = {
  createMoodEntry: (mood = "happy", intensity = 7) => ({
    id: `mood-${Date.now()}`,
    mood,
    intensity,
    timestamp: new Date().toISOString(),
    activities: ["exercise"],
    notes: "Test mood entry",
  }),

  createCrisisScenario: (severity = "high") => ({
    text: "I feel hopeless",
    severity,
    keywords: ["hopeless"],
    isCrisis: true,
    riskScore: 0.8,
  }),
};

// Enhanced accessibility mocking
jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native");
  const React = require('react');

  return {
    ...RN,
    TouchableOpacity: React.forwardRef(({ style, onPress, onLongPress, accessible, ...props }, ref) => {
      const flat = RN.StyleSheet && RN.StyleSheet.flatten ? RN.StyleSheet.flatten(style) : style;
      const base = flat || {};
      const safeStyle = { padding: base.padding ?? 12, margin: base.margin ?? 8, ...base };
      const press = typeof onPress === 'function' ? onPress : () => {};
      const longPress = typeof onLongPress === 'function' ? onLongPress : press;
      return React.createElement(RN.View, { ref, style: safeStyle, onPress: press, onLongPress: longPress, accessible: accessible ?? true, ...props });
    }),
    Platform: {
      ...RN.Platform,
      OS: "ios",
      getConstants: jest.fn(() => ({
        isDisableAnimations: false,
        isTesting: true,
      })),
    },
    Animated: {
      // Minimal Animated mock to satisfy TouchableOpacity etc.
      Value: function (v) {
        this._value = v || 0;
        this.setValue = (nv) => (this._value = nv);
        this.interpolate = jest.fn(({ inputRange = [0, 1], outputRange = [0, 1] } = {}) => {
          try {
            const first = inputRange[0];
            const last = inputRange[inputRange.length - 1];
            if (this._value <= first) return outputRange[0];
            if (this._value >= last) return outputRange[outputRange.length - 1];
            // simple linear mapping for tests
            const ratio = (this._value - first) / (last - first || 1);
            const outFirst = outputRange[0];
            const outLast = outputRange[outputRange.length - 1];
            if (typeof outFirst === 'number' && typeof outLast === 'number') {
              return outFirst + ratio * (outLast - outFirst);
            }
            return outputRange[0];
          } catch {
            return outputRange && outputRange[0];
          }
        });
        this.stopAnimation = jest.fn();
        this.resetAnimation = jest.fn();
        this.addListener = jest.fn();
        this.removeAllListeners = jest.fn();
        return this;
      },
  timing: jest.fn(() => ({ start: (cb) => cb && cb(), stop: jest.fn() })),
      parallel: jest.fn((animations = []) => ({
        start: (cb) => {
          animations.forEach((a) => a && a.start && a.start());
          cb && cb();
        },
        stop: jest.fn(),
      })),
  sequence: jest.fn(() => ({ start: (cb) => cb && cb() })),
  stagger: jest.fn(() => ({ start: (cb) => cb && cb() })),
      spring: jest.fn(() => ({ start: (cb) => cb && cb() })),
      decay: jest.fn(() => ({ start: (cb) => cb && cb() })),
      event: jest.fn(),
      View: RN.View,
      createAnimatedComponent: (Component) => Component,
    },
    KeyboardAvoidingView: React.forwardRef(({ children, ...rest }, ref) =>
      // Render children directly; avoids event subscriptions and layout calculations
      React.createElement(React.Fragment, null, children)
    ),
    AccessibilityInfo: {
      isScreenReaderEnabled: jest.fn(() => Promise.resolve(false)),
      // resolve immediately to reduce act warnings in tests
      isReduceMotionEnabled: jest.fn(() => Promise.resolve(false)),
      announceForAccessibility: jest.fn(),
      setAccessibilityFocus: jest.fn(),
    },
    Dimensions: {
      ...RN.Dimensions,
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
      removeEventListener: jest.fn(),
      get: RN.Dimensions.get,
      set: RN.Dimensions.set || jest.fn(),
    },
    Keyboard: {
      addListener: jest.fn(() => ({ remove: jest.fn() })),
      removeListener: jest.fn(),
      dismiss: jest.fn(),
    },
    Alert: {
      alert: jest.fn(),
    },
    Linking: {
      openURL: jest.fn(() => Promise.resolve()),
      canOpenURL: jest.fn(() => Promise.resolve(true)),
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
      removeEventListener: jest.fn(),
      getInitialURL: jest.fn(() => Promise.resolve(null)),
    },
  };
});

// Legacy path compatibility removed - all code now in src/
// Tests should import directly from src/shared/theme/ThemeContext

// Mock React Native Animated module (updated path for newer RN versions)
jest.mock("react-native/Libraries/Animated/AnimatedImplementation", () => ({
  addWhitelistedStyleProp: jest.fn(),
  addWhitelistedTransformProp: jest.fn(),
  assertNativeAnimatedModule: jest.fn(),
  createAnimatedComponent: (Component) => Component,
}));

// Directly mock Animated module used by TouchableOpacity in RN 0.7x
jest.mock("react-native/Libraries/Animated/Animated", () => {
  const RN = jest.requireActual("react-native");
  const AnimatedMock = {
    Value: function (v) {
      this._value = v || 0;
      this.setValue = (nv) => (this._value = nv);
      this.interpolate = jest.fn(({ inputRange = [0, 1], outputRange = [0, 1] } = {}) => {
        try {
          const first = inputRange[0];
          const last = inputRange[inputRange.length - 1];
          if (this._value <= first) return outputRange[0];
          if (this._value >= last) return outputRange[outputRange.length - 1];
          const ratio = (this._value - first) / (last - first || 1);
          const outFirst = outputRange[0];
          const outLast = outputRange[outputRange.length - 1];
          if (typeof outFirst === 'number' && typeof outLast === 'number') {
            return outFirst + ratio * (outLast - outFirst);
          }
          return outputRange[0];
        } catch {
          return outputRange && outputRange[0];
        }
      });
      this.stopAnimation = jest.fn();
      this.resetAnimation = jest.fn();
      this.addListener = jest.fn();
      this.removeAllListeners = jest.fn();
      return this;
    },
  timing: jest.fn(() => ({ start: (cb) => cb && cb(), stop: jest.fn() })),
    parallel: jest.fn((animations = []) => ({
      start: (cb) => {
        animations.forEach((a) => a && a.start && a.start());
        cb && cb();
      },
      stop: jest.fn(),
    })),
  sequence: jest.fn(() => ({ start: (cb) => cb && cb() })),
  stagger: jest.fn(() => ({ start: (cb) => cb && cb() })),
    spring: jest.fn(() => ({ start: (cb) => cb && cb() })),
    decay: jest.fn(() => ({ start: (cb) => cb && cb() })),
    event: jest.fn(),
    View: RN.View,
    createAnimatedComponent: (Component) => Component,
  };
  return {
    __esModule: true,
    default: AnimatedMock,
    ...AnimatedMock,
  };
});

// Mock NativeSettingsManager used by react-native Settings.ios
jest.mock('react-native/Libraries/Settings/NativeSettingsManager', () => ({
  getConstants: jest.fn(() => ({
    settings: {},
  })),
}));

// Simplify KeyboardAvoidingView to avoid platform-specific event subscriptions in tests
// Important: Avoid requiring('react-native') here to prevent circular requires with the main RN mock
jest.mock('react-native/Libraries/Components/Keyboard/KeyboardAvoidingView', () => {
  const React = require('react');
  const KeyboardAvoidingView = React.forwardRef(({ children, ...rest }, ref) =>
    // Passthrough: render children directly to avoid RN-specific listeners/subscriptions in tests
    React.createElement(React.Fragment, null, children)
  );
  KeyboardAvoidingView.displayName = 'KeyboardAvoidingViewMock';
  return KeyboardAvoidingView;
});

// Additional React Native mocks for better compatibility
jest.mock("react-native/Libraries/EventEmitter/NativeEventEmitter", () => {
  class MockNativeEventEmitter {
    constructor() {
      this.listeners = {};
    }
    addListener = jest.fn();
    removeListener = jest.fn();
    removeAllListeners = jest.fn();
    emit = jest.fn();
  }
  return MockNativeEventEmitter;
});

// Mock NetInfo for network connectivity testing
jest.mock("@react-native-community/netinfo", () => ({
  fetch: jest.fn(() => Promise.resolve({ isConnected: true, isInternetReachable: true })),
  addEventListener: jest.fn(() => jest.fn()),
  useNetInfo: jest.fn(() => ({ isConnected: true, isInternetReachable: true })),
  NetInfoStateType: {
    unknown: 'unknown',
    none: 'none',
    cellular: 'cellular',
    wifi: 'wifi',
    bluetooth: 'bluetooth',
    ethernet: 'ethernet',
    wimax: 'wimax',
    vpn: 'vpn',
    other: 'other',
  },
}));

// Enhanced React Native Reanimated mock for better test compatibility
jest.mock("react-native-reanimated", () => {
  try {
    const Reanimated = require("react-native-reanimated/mock");

    // Core Reanimated setup
    Reanimated.default.call = () => {};

    // Add missing methods that tests might expect
    if (!Reanimated.default.createAnimatedComponent) {
      Reanimated.default.createAnimatedComponent = (component) => component;
    }

    // Mock additional Reanimated exports
    return {
      ...Reanimated,
      useSharedValue: jest.fn(() => ({ value: 0 })),
      useAnimatedStyle: jest.fn(() => ({})),
      withSpring: jest.fn((value) => value),
      withTiming: jest.fn((value) => value),
      runOnJS: jest.fn((fn) => fn),
      interpolate: jest.fn((value) => value),
      Extrapolate: { CLAMP: "clamp", EXTEND: "extend", IDENTITY: "identity" },
    };
  } catch (error) {
    // Fallback mock if react-native-reanimated/mock is not available
    return {
      default: {
        View: require("react-native").View,
        Text: require("react-native").Text,
        Image: require("react-native").Image,
        ScrollView: require("react-native").ScrollView,
        createAnimatedComponent: (component) => component,
        call: () => {},
      },
      useSharedValue: jest.fn(() => ({ value: 0 })),
      useAnimatedStyle: jest.fn(() => ({})),
      withSpring: jest.fn((value) => value),
      withTiming: jest.fn((value) => value),
      runOnJS: jest.fn((fn) => fn),
      interpolate: jest.fn((value) => value),
      Extrapolate: { CLAMP: "clamp", EXTEND: "extend", IDENTITY: "identity" },
    };
  }
});

// Patch: Make toContain support asymmetric matchers (array or string)
try {
  // eslint-disable-next-line no-undef
  expect.extend({
    toContain(received, expected) {
      const isArray = Array.isArray(received);
      const isString = typeof received === 'string';
      const isAsymmetric = expected && typeof expected.asymmetricMatch === 'function';

      if (!isArray && !isString) {
        return {
          pass: false,
          message: () => `toContain only works with arrays or strings. Received ${typeof received}`,
        };
      }

      if (isAsymmetric) {
        const pass = isArray
          ? received.some((item) => expected.asymmetricMatch(item))
          : expected.asymmetricMatch(received);
        return {
          pass,
          message: () =>
            pass
              ? `Expected value not to contain asymmetric match`
              : `Expected value to contain an item matching asymmetric matcher`,
        };
      }

      if (isArray) {
        const pass = received.includes(expected);
        return {
          pass,
          message: () =>
            pass
              ? `Expected array not to contain ${this.utils.printExpected(expected)}`
              : `Expected array to contain ${this.utils.printExpected(expected)}`,
        };
      }

      // string case
      const pass = received.includes(expected);
      return {
        pass,
        message: () =>
          pass
            ? `Expected string not to contain ${this.utils.printExpected(expected)}`
            : `Expected string to contain ${this.utils.printExpected(expected)}`,
      };
    },
  });
} catch {}

// Force override built-in toContain to support asymmetric matchers in this environment
try {
  const state = expect.getState();
  const originalToContain = state.matchers.toContain;
  state.matchers.toContain = function toContainPatched(received, expected) {
    const isAsymmetric = expected && typeof expected.asymmetricMatch === 'function';
    if (isAsymmetric) {
      const pass = Array.isArray(received)
        ? received.some((item) => expected.asymmetricMatch(item))
        : typeof received === 'string'
          ? expected.asymmetricMatch(received)
          : false;
      return {
        pass,
        message: () => pass
          ? 'Expected value not to contain an item matching asymmetric matcher'
          : 'Expected value to contain an item matching asymmetric matcher',
      };
    }
    return originalToContain.call(this, received, expected);
  };
} catch {}

// Patch Array.prototype.includes to handle asymmetric matchers (used by toContain)
try {
  const originalIncludes = Array.prototype.includes;
  // eslint-disable-next-line no-extend-native
  Array.prototype.includes = function patchedIncludes(searchElement, fromIndex) {
    const start = fromIndex || 0;
    if (searchElement && typeof searchElement.asymmetricMatch === 'function') {
      for (let i = start; i < this.length; i++) {
        if (searchElement.asymmetricMatch(this[i])) return true;
      }
      return false;
    }
    return originalIncludes.call(this, searchElement, fromIndex);
  };
} catch {}

// Patch Array.prototype.indexOf to handle asymmetric matchers
try {
  const originalIndexOf = Array.prototype.indexOf;
  // eslint-disable-next-line no-extend-native
  Array.prototype.indexOf = function patchedIndexOf(searchElement, fromIndex) {
    const start = fromIndex || 0;
    if (searchElement && typeof searchElement.asymmetricMatch === 'function') {
      for (let i = start; i < this.length; i++) {
        if (searchElement.asymmetricMatch(this[i])) return i;
      }
      return -1;
    }
    return originalIndexOf.call(this, searchElement, fromIndex);
  };
} catch {}
