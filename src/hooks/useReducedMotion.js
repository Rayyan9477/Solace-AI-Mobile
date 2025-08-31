import { useState, useEffect } from "react";
import { AccessibilityInfo } from "react-native";

/**
 * Hook to detect reduced motion preference
 * Respects user accessibility settings for motion sensitivity
 */
export const useReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const checkReducedMotion = async () => {
      try {
        const isReducedMotionEnabled =
          await AccessibilityInfo.isReduceMotionEnabled();
        setReducedMotion(isReducedMotionEnabled);
      } catch (error) {
        console.warn("Could not check reduced motion preference:", error);
        setReducedMotion(false);
      }
    };

    // Initial check
    checkReducedMotion();

    // Listen for changes
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReducedMotion,
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  return reducedMotion;
};
