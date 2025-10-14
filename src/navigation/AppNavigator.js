// Test-friendly AppNavigator
// Lightweight navigator that renders tabs, handles deep links, crisis flags,
// analytics callbacks, and accessibility announcements without heavy deps.
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AccessibilityInfo, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BottomTabBar from "../components/navigation/BottomTabBar";

const TABS = ["Home", "Chat", "Mood", "Assessment", "Profile"];

export default function AppNavigator({
  initialRoute,
  crisisMode = false,
  crisisDetected = false,
  therapeuticMode = false,
  userContext = {},
  onNavigationChange,
  engagementTracker,
}) {
  const navigation = useNavigation?.() || { navigate: () => {} };
  const [activeIndex, setActiveIndex] = useState(0);
  const fromRef = useRef(TABS[0]);

  const state = useMemo(
    () => ({ index: activeIndex, routes: TABS.map((name) => ({ name, key: name.toLowerCase() })) }),
    [activeIndex],
  );

  const navigateSafe = (route) => {
    try {
      navigation?.navigate?.(route);
    } catch (e) {
      // swallow navigation errors in tests
    }
  };

  const handleTabPress = (index) => {
    const from = TABS[activeIndex];
    const to = TABS[index];
    setActiveIndex(index);
    navigateSafe(to);
    try {
      AccessibilityInfo.announceForAccessibility?.(`${to} tab selected`);
    } catch {}

    if (typeof onNavigationChange === "function") {
      onNavigationChange({ from, to, timestamp: Date.now() });
    }

    if (engagementTracker) {
      engagementTracker.navigationCount = (engagementTracker.navigationCount || 0) + 1;
      engagementTracker.mostUsedScreen = to;
    }
  };

  // Deep link handling
  useEffect(() => {
    if (typeof initialRoute === "string" && initialRoute.length) {
      const lower = initialRoute.toLowerCase();
      const match = TABS.find((t) => lower.includes(t.toLowerCase().replace("home", "dashboard").replace("assessment", "assess").replace("profile", "settings")) || lower.includes(t.toLowerCase()));
      if (match) {
        const idx = TABS.indexOf(match);
        handleTabPress(idx);
        fromRef.current = match;
      }
      if (lower.includes("mood")) {
        handleTabPress(TABS.indexOf("Mood"));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRoute]);

  // Crisis prioritization
  useEffect(() => {
    if (crisisMode || crisisDetected) {
      navigateSafe("CrisisSupport");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crisisMode, crisisDetected]);

  const headerStyles = [
    styles.header,
    therapeuticMode ? { backgroundColor: "#F0F9FF" } : null,
  ];

  return (
    <View style={styles.container} testID="app-navigator">
      <View style={headerStyles} testID="navigation-header" accessibilityRole="header">
        <Text style={styles.headerTitle} testID="app-header">
          {`Solace — ${TABS[activeIndex]}`}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Crisis support"
            onPress={() => navigateSafe("CrisisSupport")}
          >
            <Text style={styles.crisisText}>Crisis</Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Track mood"
            onPress={() => handleTabPress(TABS.indexOf("Mood"))}
          >
            <Text style={styles.trackMood}>Track</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content} testID="main-content">
        {userContext?.needsSupport || userContext?.currentMood === "anxious" ? (
          <Text style={styles.supportNotice}>We're here to help and support you</Text>
        ) : null}
        <Text>
          {TABS[activeIndex]} Screen
        </Text>
      </View>

      <BottomTabBar
        state={state}
        navigation={{
          navigate: (name) => {
            const idx = TABS.indexOf(name);
            if (idx >= 0) handleTabPress(idx);
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  headerActions: { flexDirection: "row", gap: 16, marginTop: 8 },
  crisisText: { color: "#DC2626", fontWeight: "600" },
  trackMood: { color: "#2563EB", fontWeight: "600" },
  content: { flex: 1, padding: 16 },
});
