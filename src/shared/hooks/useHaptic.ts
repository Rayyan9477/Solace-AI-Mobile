/**
 * useHaptic Hook
 * Provides haptic feedback functions that respect reduced motion settings.
 * Uses expo-haptics for native haptic feedback.
 */
import { useCallback } from "react";
import { Platform } from "react-native";
import { useReducedMotion } from "./useReducedMotion";

// Lazy import to avoid crash on web where expo-haptics isn't available
let Haptics: any = null;
try {
  Haptics = require("expo-haptics");
} catch {
  // expo-haptics not available (web platform)
}

export function useHaptic() {
  const reduceMotion = useReducedMotion();

  const light = useCallback(() => {
    if (reduceMotion || !Haptics || Platform.OS === "web") return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [reduceMotion]);

  const medium = useCallback(() => {
    if (reduceMotion || !Haptics || Platform.OS === "web") return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [reduceMotion]);

  const heavy = useCallback(() => {
    if (reduceMotion || !Haptics || Platform.OS === "web") return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }, [reduceMotion]);

  const success = useCallback(() => {
    if (reduceMotion || !Haptics || Platform.OS === "web") return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [reduceMotion]);

  const warning = useCallback(() => {
    if (reduceMotion || !Haptics || Platform.OS === "web") return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }, [reduceMotion]);

  const error = useCallback(() => {
    if (reduceMotion || !Haptics || Platform.OS === "web") return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }, [reduceMotion]);

  return { light, medium, heavy, success, warning, error };
}
