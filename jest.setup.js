import "react-native-gesture-handler/jestSetup";

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: "light",
    Medium: "medium",
    Heavy: "heavy",
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

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

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
  return {
    LinearGradient: React.View,
  };
});

global.window = {};
global.window = global;

// Mock React Native Animated module (updated path for newer RN versions)
jest.mock("react-native/Libraries/Animated/AnimatedImplementation", () => ({
  addWhitelistedStyleProp: jest.fn(),
  addWhitelistedTransformProp: jest.fn(),
  assertNativeAnimatedModule: jest.fn(),
}));

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
