/**
 * App Infrastructure Demo - Showcases fixed components
 * Demonstrates the working UI without navigation complexity
 */
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

// Import fixed components
import { FixedThemeProvider, useFixedTheme } from "./components/FixedThemeProvider";
import FixedSplashScreen from "./components/FixedSplashScreen";
import FixedCoverScreen from "./components/FixedCoverScreen";
import FixedDashboard from "./components/FixedDashboard";
import FixedLoadingScreen from "./components/FixedLoadingScreen";

// Import mock data
import { mockUserData, mockFeatureFlags } from "./AppMockData";

type DemoScreen = "splash" | "cover" | "dashboard" | "loading";

const DemoContent = () => {
  const { theme, isDarkMode, toggleTheme } = useFixedTheme();
  const [currentScreen, setCurrentScreen] = useState<DemoScreen>("splash");
  const [isLoading, setIsLoading] = useState(false);

  // Auto-progress from splash to cover after delay
  useEffect(() => {
    if (currentScreen === "splash") {
      const timer = setTimeout(() => {
        setCurrentScreen("cover");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleScreenChange = (screen: DemoScreen) => {
    if (screen !== currentScreen) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentScreen(screen);
        setIsLoading(false);
      }, 500);
    }
  };

  const handleGetStarted = () => {
    handleScreenChange("dashboard");
  };

  const handleLearnMore = () => {
    console.log("Learn more pressed");
  };

  if (isLoading) {
    return <FixedLoadingScreen text="Switching screens..." />;
  }

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "splash":
        return (
          <FixedSplashScreen 
            onComplete={() => setCurrentScreen("cover")} 
          />
        );
      case "cover":
        return (
          <FixedCoverScreen 
            onGetStarted={handleGetStarted}
            onLearnMore={handleLearnMore}
          />
        );
      case "dashboard":
        return (
          <FixedDashboard 
            userName={mockUserData.name}
          />
        );
      case "loading":
        return (
          <FixedLoadingScreen text="Loading your personalized experience..." />
        );
      default:
        return <FixedSplashScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {renderCurrentScreen()}
      
      {/* Debug Controls */}
      {mockFeatureFlags.debugMode && (
        <View style={[
          styles.debugPanel, 
          { backgroundColor: theme.colors.background?.secondary || "#F9FAFB" }
        ]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[styles.debugButton, { backgroundColor: theme.colors.primary || "#926247" }]}
              onPress={() => handleScreenChange("splash")}
            >
              <Text style={styles.debugButtonText}>Splash</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.debugButton, { backgroundColor: theme.colors.primary || "#926247" }]}
              onPress={() => handleScreenChange("cover")}
            >
              <Text style={styles.debugButtonText}>Cover</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.debugButton, { backgroundColor: theme.colors.primary || "#926247" }]}
              onPress={() => handleScreenChange("dashboard")}
            >
              <Text style={styles.debugButtonText}>Dashboard</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.debugButton, { backgroundColor: theme.colors.primary || "#926247" }]}
              onPress={() => handleScreenChange("loading")}
            >
              <Text style={styles.debugButtonText}>Loading</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.debugButton, { backgroundColor: theme.colors.secondary || "#7DD44D" }]}
              onPress={toggleTheme}
            >
              <Text style={styles.debugButtonText}>
                {isDarkMode ? "Light" : "Dark"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const AppInfrastructureDemo = () => {
  return (
    <FixedThemeProvider>
      <DemoContent />
    </FixedThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  debugPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  debugButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 6,
  },
  debugButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default AppInfrastructureDemo;