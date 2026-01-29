/**
 * ConversationsDashboardScreen Component
 * @description Dashboard showing conversation stats, subscription tier, and upgrade options
 * @task Task 3.6.2: Conversations Dashboard Screen (Screen 48)
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

type SubscriptionTier = "Basic" | "Pro";
type SupportLevel = "Slow" | "Fast" | "24/7";

interface ConversationsDashboardScreenProps {
  totalConversations: number;
  remainingQuota: number;
  subscriptionTier: SubscriptionTier;
  supportLevel: SupportLevel;
  onBack: () => void;
  onFilter: () => void;
  onNewConversation: () => void;
  onSettings: () => void;
  onUpgrade: () => void;
}

export function ConversationsDashboardScreen({
  totalConversations,
  remainingQuota,
  subscriptionTier,
  supportLevel,
  onBack,
  onFilter,
  onNewConversation,
  onSettings,
  onUpgrade,
}: ConversationsDashboardScreenProps): React.ReactElement {
  const isBasicTier = subscriptionTier === "Basic";

  return (
    <View testID="conversations-dashboard-screen" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonIcon}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>My Conversations</Text>
        <View testID="subscription-badge" style={styles.subscriptionBadge}>
          <Text style={styles.subscriptionText}>{subscriptionTier}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Section */}
        <View style={styles.statsSection}>
          {/* Total Count */}
          <View testID="total-count" style={styles.totalCountContainer}>
            <Text style={styles.totalCountNumber}>{totalConversations}</Text>
            <Text style={styles.totalCountLabel}>Total Conversations</Text>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            {/* Quota Stat */}
            <View testID="quota-stat" style={styles.statItem}>
              <Text style={styles.statIcon}>💬</Text>
              <Text style={styles.statValue}>{remainingQuota}</Text>
              <Text style={styles.statLabel}>Left this month</Text>
            </View>

            {/* Support Stat */}
            <View testID="support-stat" style={styles.statItem}>
              <Text style={styles.statIcon}>📊</Text>
              <Text style={styles.statValue}>{supportLevel}</Text>
              <Text style={styles.statLabel}>Response & Support</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons Row */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            testID="filter-button"
            style={[styles.actionButton, styles.filterButton]}
            onPress={onFilter}
            accessibilityRole="button"
            accessibilityLabel="Filter conversations"
          >
            <Text style={styles.actionButtonIcon}>⚙️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="new-action-button"
            style={[styles.actionButton, styles.newButton]}
            onPress={onNewConversation}
            accessibilityRole="button"
            accessibilityLabel="Start new conversation"
          >
            <Text style={styles.newButtonIcon}>+</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="settings-button"
            style={[styles.actionButton, styles.settingsButton]}
            onPress={onSettings}
            accessibilityRole="button"
            accessibilityLabel="Chat settings"
          >
            <Text style={styles.actionButtonIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Upsell Card - Only for Basic tier */}
        {isBasicTier && (
          <View testID="upsell-card" style={styles.upsellCard}>
            <View style={styles.upsellContent}>
              <Text style={styles.upsellMascot}>🤖</Text>
              <View style={styles.upsellTextContent}>
                <Text style={styles.upsellTitle}>Upgrade to Pro!</Text>
                <View style={styles.benefitRow}>
                  <Text style={styles.benefitCheck}>✓</Text>
                  <Text style={styles.benefitText}>24/7 Live & Fast Support</Text>
                </View>
                <View style={styles.benefitRow}>
                  <Text style={styles.benefitCheck}>✓</Text>
                  <Text style={styles.benefitText}>Unlimited Conversations!</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              testID="go-pro-button"
              style={styles.goProButton}
              onPress={onUpgrade}
              accessibilityRole="button"
              accessibilityLabel="Upgrade to Pro"
            >
              <Text style={styles.goProButtonText}>Go Pro. Now!</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: "center",
    borderRadius: 28,
    height: 56,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 56,
  },
  actionButtonIcon: {
    fontSize: 24,
  },
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  backButton: {
    alignItems: "center",
    borderColor: "#3D2E23",
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 40,
  },
  backButtonIcon: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  benefitCheck: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  benefitRow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 4,
  },
  benefitText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  container: {
    backgroundColor: "#1C1410",
    flex: 1,
    paddingTop: 60,
  },
  filterButton: {
    backgroundColor: "#E8853A",
    marginRight: 16,
  },
  goProButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  goProButtonText: {
    color: "#2E7D32",
    fontSize: 14,
    fontWeight: "600",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 24,
  },
  newButton: {
    backgroundColor: "#FFFFFF",
    marginRight: 16,
  },
  newButtonIcon: {
    color: "#1C1410",
    fontSize: 28,
    fontWeight: "600",
  },
  screenTitle: {
    color: "#FFFFFF",
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 16,
  },
  scrollContent: {
    flex: 1,
    marginTop: 24,
  },
  settingsButton: {
    backgroundColor: "#9AAD5C",
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    color: "#94A3B8",
    fontSize: 12,
    textAlign: "center",
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 24,
  },
  statsSection: {
    alignItems: "center",
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  subscriptionBadge: {
    backgroundColor: "#2A1F19",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  subscriptionText: {
    color: "#C4A574",
    fontSize: 12,
    fontWeight: "600",
  },
  totalCountContainer: {
    alignItems: "center",
  },
  totalCountLabel: {
    color: "#94A3B8",
    fontSize: 14,
  },
  totalCountNumber: {
    color: "#FFFFFF",
    fontSize: 64,
    fontWeight: "700",
  },
  upsellCard: {
    backgroundColor: "#2E7D32",
    borderRadius: 20,
    marginHorizontal: 24,
    padding: 20,
  },
  upsellContent: {
    flexDirection: "row",
  },
  upsellMascot: {
    fontSize: 48,
    marginRight: 16,
  },
  upsellTextContent: {
    flex: 1,
  },
  upsellTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
});

export default ConversationsDashboardScreen;
