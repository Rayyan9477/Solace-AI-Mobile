/**
 * HelpCenterLiveChatScreen Component
 * @description Live chat entry point with welcome message and action button
 * @task Task 3.17.11: Help Center Live Chat Screen (Screen 150)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { palette } from "../../../shared/theme";

interface HelpCenterLiveChatScreenProps {
  activeTab: "faq" | "live-chat";
  onBack: () => void;
  onTabSelect: (tab: "faq" | "live-chat") => void;
  onStartLiveChat: () => void;
}

const colors = {
  background: palette.brown[900],
  white: palette.white,
  textSecondary: `${palette.white}${palette.alpha[60]}`,
  tabBg: "#2A1F18",
  tabSelected: palette.tan[500],
  tabSelectedText: palette.brown[900],
  illustrationBg: palette.onboarding.step5,
  ctaButtonBg: palette.tan[500],
  ctaButtonText: palette.brown[900],
} as const;

export function HelpCenterLiveChatScreen({
  activeTab,
  onBack,
  onTabSelect,
  onStartLiveChat,
}: HelpCenterLiveChatScreenProps): React.ReactElement {
  return (
    <View testID="help-center-live-chat-screen" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>{"\u2190"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          testID="tab-faq"
          style={[styles.tab, activeTab === "faq" && styles.tabSelected]}
          onPress={() => onTabSelect("faq")}
          accessibilityRole="button"
          accessibilityLabel="FAQ"
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "faq" && styles.tabTextSelected,
            ]}
          >
            FAQ
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="tab-live-chat"
          style={[styles.tab, activeTab === "live-chat" && styles.tabSelected]}
          onPress={() => onTabSelect("live-chat")}
          accessibilityRole="button"
          accessibilityLabel="Live Chat"
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "live-chat" && styles.tabTextSelected,
            ]}
          >
            Live Chat
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.contentSection}>
        <View testID="support-illustration" style={styles.illustration} />
        <Text style={styles.welcomeTitle}>We are here to help you!</Text>
        <Text style={styles.responseTime}>
          We aim to reply within a few minutes! {"\uD83E\uDD17"}
        </Text>
      </View>

      {/* Action Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          testID="live-chat-button"
          style={styles.ctaButton}
          onPress={onStartLiveChat}
          accessibilityRole="button"
          accessibilityLabel="Start Live Chat"
        >
          <Text style={styles.ctaButtonText}>Live Chat {"\uD83D\uDCAC"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  backIcon: { color: colors.white, fontSize: 24 },
  container: { backgroundColor: colors.background, flex: 1 },
  contentSection: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  ctaButton: {
    alignItems: "center",
    backgroundColor: colors.ctaButtonBg,
    borderRadius: 28,
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 16,
    width: "100%",
  },
  ctaButtonText: {
    color: colors.ctaButtonText,
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    paddingBottom: 48,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 12,
  },
  illustration: {
    backgroundColor: colors.illustrationBg,
    borderRadius: 80,
    height: 160,
    width: 160,
  },
  responseTime: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: 12,
    textAlign: "center",
  },
  tab: {
    alignItems: "center",
    backgroundColor: colors.tabBg,
    borderRadius: 20,
    flex: 1,
    paddingVertical: 10,
  },
  tabRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 24,
  },
  tabSelected: { backgroundColor: colors.tabSelected },
  tabText: { color: colors.white, fontSize: 14, fontWeight: "600" },
  tabTextSelected: { color: colors.tabSelectedText },
  welcomeTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 24,
    textAlign: "center",
  },
});

export default HelpCenterLiveChatScreen;
