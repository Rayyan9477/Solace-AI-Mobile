/**
 * Enhanced Loading Screen - Therapeutic Mental Health Experience
 * Provides calming, supportive loading experience with breathing exercises
 */

import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
import { View, Text, Animated, Platform } from "react-native";

const EnhancedLoadingScreen = ({
  message = "Preparing your sanctuary...",
  stage = "initializing",
  progress = 0,
  showBreathingExercise = false,
  onEmergencyPress = null,
}) => {
  const [showEmergency, setShowEmergency] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState("inhale"); // inhale, hold, exhale
  const [currentTip, setCurrentTip] = useState(0);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.8)).current;
  const breathingAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Wellness tips for long loading
  const wellnessTips = [
    "Take a moment to notice your breathing",
    "You're taking a positive step for your mental health",
    "It's okay to feel however you're feeling right now",
    "Remember: You are worthy of care and support",
    "Every small step towards wellness matters",
    "You don't have to face challenges alone",
  ];

  // Stage messages
  const stageMessages = {
    initializing: "Setting up your safe space...",
    loading_storage: "Securing your personal data...",
    loading_services: "Connecting support systems...",
    loading_ui: "Preparing therapeutic interface...",
    finalizing: "Almost ready to support you...",
  };

  useEffect(() => {
    // Initial fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Start pulsing animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );
    pulseAnimation.start();

    // Show emergency button after 30 seconds
    const emergencyTimer = setTimeout(() => {
      setShowEmergency(true);
    }, 30000);

    return () => {
      pulseAnimation.stop();
      clearTimeout(emergencyTimer);
    };
  }, []);

  // Breathing exercise animation
  useEffect(() => {
    if (!showBreathingExercise) return;

    const breathingCycle = () => {
      // Inhale - 4 seconds
      setBreathingPhase("inhale");
      Animated.timing(breathingAnim, {
        toValue: 1.2,
        duration: 4000,
        useNativeDriver: true,
      }).start(() => {
        // Hold - 4 seconds
        setBreathingPhase("hold");
        setTimeout(() => {
          // Exhale - 6 seconds
          setBreathingPhase("exhale");
          Animated.timing(breathingAnim, {
            toValue: 0.8,
            duration: 6000,
            useNativeDriver: true,
          }).start(() => {
            setTimeout(breathingCycle, 1000); // 1 second pause before next cycle
          });
        }, 4000);
      });
    };

    breathingCycle();
  }, [showBreathingExercise]);

  // Progress animation
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  // Cycle wellness tips
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % wellnessTips.length);
    }, 5000);

    return () => clearInterval(tipInterval);
  }, []);

  const getTherapeuticGradient = () => {
    const hour = new Date().getHours();
    if (hour < 6) {
      return ["#1A1A2E", "#16213E"]; // Night calm
    } else if (hour < 12) {
      return ["#E3F2FD", "#BBDEFB"]; // Morning calm
    } else if (hour < 18) {
      return ["#F3E5F5", "#E1BEE7"]; // Afternoon serenity
    } else {
      return ["#E8F5E8", "#C8E6C9"]; // Evening peace
    }
  };

  const getBreathingText = () => {
    switch (breathingPhase) {
      case "inhale":
        return "Breathe in slowly...";
      case "hold":
        return "Hold gently...";
      case "exhale":
        return "Breathe out slowly...";
      default:
        return "Focus on your breath";
    }
  };

  const gradientColors = getTherapeuticGradient();
  const isDarkMode = new Date().getHours() < 6;

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: gradientColors[0],
        opacity: fadeAnim,
      }}
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        {/* Logo/Icon Section */}
        <Animated.View
          style={{
            transform: [
              { scale: showBreathingExercise ? breathingAnim : pulseAnim },
            ],
            marginBottom: 48,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 64,
              marginBottom: 16,
            }}
          >
            🧠
          </Text>

          <Text
            style={{
              fontSize: 28,
              fontWeight: "700",
              color: isDarkMode ? "#FFFFFF" : "#2E3A59",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Solace AI
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: isDarkMode ? "#B8C5D6" : "#64748B",
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            Your Mental Health Companion
          </Text>
        </Animated.View>

        {/* Progress Section */}
        <View
          style={{
            width: "100%",
            maxWidth: 300,
            marginBottom: 32,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: isDarkMode ? "#FFFFFF" : "#2E3A59",
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            {stageMessages[stage] || message}
          </Text>

          {/* Progress Bar */}
          <View
            style={{
              height: 4,
              backgroundColor: isDarkMode ? "#374151" : "#E5E7EB",
              borderRadius: 2,
              overflow: "hidden",
              marginBottom: 8,
            }}
          >
            <Animated.View
              style={{
                height: "100%",
                backgroundColor: isDarkMode ? "#60A5FA" : "#4F46E5",
                borderRadius: 2,
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              }}
            />
          </View>

          <Text
            style={{
              fontSize: 12,
              color: isDarkMode ? "#9CA3AF" : "#6B7280",
              textAlign: "center",
            }}
          >
            {Math.round(progress * 100)}% complete
          </Text>
        </View>

        {/* Breathing Exercise Section */}
        {showBreathingExercise && (
          <View
            style={{
              alignItems: "center",
              marginBottom: 32,
              padding: 24,
              backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
              borderRadius: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDarkMode ? 0.3 : 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: isDarkMode ? "#FFFFFF" : "#2E3A59",
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              Let's practice breathing together
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: isDarkMode ? "#60A5FA" : "#4F46E5",
                textAlign: "center",
                marginBottom: 16,
                minHeight: 24,
              }}
            >
              {getBreathingText()}
            </Text>

            <View
              style={{
                width: 8,
                height: 8,
                backgroundColor: isDarkMode ? "#60A5FA" : "#4F46E5",
                borderRadius: 4,
                opacity: 0.6,
              }}
            />
          </View>
        )}

        {/* Wellness Tip */}
        <View
          style={{
            backgroundColor: isDarkMode ? "#1F2937" : "#F8FAFC",
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            maxWidth: 350,
            borderWidth: 1,
            borderColor: isDarkMode ? "#374151" : "#E2E8F0",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: isDarkMode ? "#9CA3AF" : "#64748B",
              textAlign: "center",
              lineHeight: 20,
              fontStyle: "italic",
            }}
          >
            💡 {wellnessTips[currentTip]}
          </Text>
        </View>

        {/* Emergency Support Button */}
        {showEmergency && onEmergencyPress && (
          <Animated.View
            style={{
              opacity: fadeAnim,
              position: "absolute",
              bottom: 40,
              left: 24,
              right: 24,
            }}
          >
            <View
              style={{
                backgroundColor: "#F59E0B",
                borderRadius: 12,
                paddingVertical: 12,
                paddingHorizontal: 20,
                minHeight: 44,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 6,
              }}
              onStartShouldSetResponder={() => true}
              onResponderGrant={onEmergencyPress}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Access emergency mental health support"
              accessibilityHint="Available if you need immediate crisis support"
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 14,
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                🆘 Need Immediate Support?
              </Text>
            </View>

            {Platform.OS === "web" && (
              <Text
                style={{
                  fontSize: 11,
                  color: isDarkMode ? "#9CA3AF" : "#6B7280",
                  textAlign: "center",
                  marginTop: 6,
                  fontStyle: "italic",
                }}
              >
                Press Ctrl+Shift+H anytime
              </Text>
            )}
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
};

export default EnhancedLoadingScreen;
