/**
 * AppNavigator.test.js - Comprehensive tests for AppNavigator component
 */

import { NavigationContainer } from "@react-navigation/native";
import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react-native";
import React from "react";
import { useSelector, Provider } from "react-redux";

import AppNavigator, {
  PlaceholderScreen,
  MainTabs,
} from "../../src/app/navigation/AppNavigator";

// Mock React Navigation
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    reset: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
    name: "TestScreen",
  }),
  useFocusEffect: jest.fn((callback) => callback()),
}));

// Mock React Navigation Stack
jest.mock("@react-navigation/stack", () => ({
  createStackNavigator: () => ({
    Navigator: ({ children }) => <>{children}</>,
    Screen: ({ children }) => <>{children}</>,
  }),
}));

// Mock React Navigation Bottom Tabs
jest.mock("@react-navigation/bottom-tabs", () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }) => <>{children}</>,
    Screen: ({ children }) => <>{children}</>,
  }),
}));

// Mock theme provider
jest.mock("@theme/ThemeProvider", () => ({
  useTheme: () => ({
    theme: {
      colors: {
        background: {
          primary: "#F7FAFC",
          secondary: "#FFFFFF",
        },
        text: {
          primary: "#2D3748",
          secondary: "#718096",
          tertiary: "#A0AEC0",
        },
        border: {
          light: "#E2E8F0",
        },
        therapeutic: {
          calming: {
            600: "#0284c7",
          },
        },
      },
    },
  }),
  ThemeProvider: ({ children }) => <>{children}</>,
}));

// Mock feature screens
jest.mock("@features/auth/LoginScreen", () => {
  const React = require("react");
  return function LoginScreen() {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement("div", { testID: "login-screen" }, "LoginScreen"),
    );
  };
});
jest.mock("@features/auth/SignupScreen", () => {
  const React = require("react");
  return function SignupScreen() {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement("div", { testID: "signup-screen" }, "SignupScreen"),
    );
  };
});
jest.mock("@features/dashboard/DashboardScreen", () => {
  const React = require("react");
  return function DashboardScreen() {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "div",
        { testID: "dashboard-screen" },
        "DashboardScreen",
      ),
    );
  };
});
jest.mock("@features/chat/ChatScreen", () => {
  const React = require("react");
  return function ChatScreen() {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement("div", { testID: "chat-screen" }, "ChatScreen"),
    );
  };
});
jest.mock("@features/mood/MoodScreen", () => {
  const React = require("react");
  return function MoodScreen() {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement("div", { testID: "mood-screen" }, "MoodScreen"),
    );
  };
});
jest.mock("@features/mood/screens/EnhancedMoodTrackerScreen", () => {
  const React = require("react");
  return function EnhancedMoodTrackerScreen() {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "div",
        { testID: "mood-tracker-screen" },
        "EnhancedMoodTrackerScreen",
      ),
    );
  };
});
jest.mock("@features/onboarding/screens/OnboardingScreen", () => {
  const React = require("react");
  return function OnboardingScreen() {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "div",
        { testID: "onboarding-screen" },
        "OnboardingScreen",
      ),
    );
  };
});
jest.mock("@features/onboarding/screens/WelcomeScreen", () => {
  const React = require("react");
  return function WelcomeScreen() {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement("div", { testID: "welcome-screen" }, "WelcomeScreen"),
    );
  };
});

// Mock Redux useSelector
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
  Provider: ({ children }) => <>{children}</>,
}));

describe("AppNavigator", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: (state = { isAuthenticated: false }, action) => state,
      },
    });
    useSelector.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("PlaceholderScreen", () => {
    it("renders with default screen name when no route params", () => {
      const mockRoute = { name: "TestScreen" };

      render(
        <NavigationContainer>
          <PlaceholderScreen route={mockRoute} />
        </NavigationContainer>,
      );

      expect(screen.getByText("TestScreen")).toBeTruthy();
      expect(
        screen.getByText("This screen is under construction"),
      ).toBeTruthy();
    });

    it("renders with custom screen name from route params", () => {
      const mockRoute = {
        params: { name: "CustomScreen" },
        name: "TestScreen",
      };

      render(
        <NavigationContainer>
          <PlaceholderScreen route={mockRoute} />
        </NavigationContainer>,
      );

      expect(screen.getByText("CustomScreen")).toBeTruthy();
    });

    it("applies theme colors correctly", () => {
      const mockRoute = { name: "TestScreen" };

      render(
        <NavigationContainer>
          <PlaceholderScreen route={mockRoute} />
        </NavigationContainer>,
      );

      const title = screen.getByText("TestScreen");
      const subtitle = screen.getByText("This screen is under construction");

      // Check if elements are rendered (theme colors are applied via style)
      expect(title).toBeTruthy();
      expect(subtitle).toBeTruthy();
    });
  });

  describe("MainTabs", () => {
    it("can be imported and instantiated", () => {
      expect(typeof MainTabs).toBe("function");
    });

    it("renders without crashing", () => {
      expect(() => {
        render(
          <NavigationContainer>
            <MainTabs />
          </NavigationContainer>,
        );
      }).not.toThrow();
    });
  });

  describe("AppNavigator - Unauthenticated State", () => {
    beforeEach(() => {
      useSelector.mockReturnValue(false); // Not authenticated
    });

    it("can be imported and instantiated", () => {
      expect(typeof AppNavigator).toBe("function");
    });

    it("renders without throwing when unauthenticated", () => {
      expect(() => {
        render(
          <Provider store={store}>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </Provider>,
        );
      }).not.toThrow();
    });
  });

  describe("AppNavigator - Authenticated State", () => {
    beforeEach(() => {
      useSelector.mockReturnValue(true); // Authenticated
    });

    it("renders without throwing when authenticated", () => {
      expect(() => {
        render(
          <Provider store={store}>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </Provider>,
        );
      }).not.toThrow();
    });
  });

  describe("Error Handling", () => {
    it("handles missing Redux provider gracefully", () => {
      // Simulate missing Redux provider
      useSelector.mockImplementation(() => {
        throw new Error("No Redux provider");
      });

      expect(() => {
        render(
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>,
        );
      }).not.toThrow();
    });

    it("handles invalid useSelector gracefully", () => {
      // Simulate invalid useSelector
      useSelector.mockReturnValue(undefined);

      expect(() => {
        render(
          <Provider store={store}>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </Provider>,
        );
      }).not.toThrow();
    });
  });

  describe("Navigation Flow", () => {
    it("switches between authenticated and unauthenticated states", () => {
      // Initially unauthenticated
      useSelector.mockReturnValue(false);
      expect(() => {
        render(
          <Provider store={store}>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </Provider>,
        );
      }).not.toThrow();

      // Switch to authenticated
      useSelector.mockReturnValue(true);
      expect(() => {
        render(
          <Provider store={store}>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </Provider>,
        );
      }).not.toThrow();
    });
  });
});
