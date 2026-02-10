/**
 * HelpCenterScreen Component
 * @description FAQ accordion with search and Live Chat tab navigation
 * @task Task 3.17.10: Help Center Screen (Screen 149)
 * @phase Phase 3C: Refactored to use theme tokens
 * @audit-fix "freud.ai" → "Solace" in FAQ questions
 */

import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { palette } from "../../../shared/theme";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  isExpanded: boolean;
}

interface HelpCenterScreenProps {
  activeTab: "faq" | "live-chat";
  searchQuery: string;
  faqs: FAQItem[];
  onBack: () => void;
  onTabSelect: (tab: "faq" | "live-chat") => void;
  onSearchChange: (text: string) => void;
  onFaqToggle: (id: string) => void;
}

const localColors = {
  background: palette.brown[900],
  white: palette.white,
  cardBg: palette.brown[800],
  textSecondary: `${palette.white}${palette.alpha[60]}`,
  tabBg: palette.brown[800],
  tabSelected: palette.tan[500],
  tabSelectedText: palette.brown[900],
  searchBg: palette.brown[800],
  chevron: `${palette.white}${palette.alpha[30]}`,
} as const;

export function HelpCenterScreen({
  activeTab,
  searchQuery,
  faqs,
  onBack,
  onTabSelect,
  onSearchChange,
  onFaqToggle,
}: HelpCenterScreenProps): React.ReactElement {
  return (
    <View testID="help-center-screen" style={styles.container}>
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

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          testID="search-input"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Where can I find..."
          placeholderTextColor={localColors.textSecondary}
          accessibilityLabel="Search FAQs"
        />
      </View>

      {/* FAQ List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {faqs.map((faq) => (
          <TouchableOpacity
            key={faq.id}
            testID={`faq-${faq.id}`}
            style={styles.faqItem}
            onPress={() => onFaqToggle(faq.id)}
            accessibilityRole="button"
            accessibilityLabel={faq.question}
          >
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Text style={styles.faqChevron}>
                {faq.isExpanded ? "\u2303" : "\u2304"}
              </Text>
            </View>
            {faq.isExpanded && (
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  backIcon: { color: localColors.white, fontSize: 24 },
  container: { backgroundColor: localColors.background, flex: 1 },
  faqAnswer: {
    color: localColors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
  },
  faqChevron: { color: localColors.chevron, fontSize: 18 },
  faqHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  faqItem: {
    backgroundColor: localColors.cardBg,
    borderRadius: 12,
    marginHorizontal: 24,
    marginTop: 8,
    padding: 16,
  },
  faqQuestion: {
    color: localColors.white,
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    marginRight: 12,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTitle: {
    color: localColors.white,
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 12,
  },
  scrollContent: { paddingBottom: 48 },
  searchContainer: {
    marginTop: 16,
    paddingHorizontal: 24,
  },
  searchInput: {
    backgroundColor: localColors.searchBg,
    borderRadius: 12,
    color: localColors.white,
    fontSize: 15,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tab: {
    alignItems: "center",
    backgroundColor: localColors.tabBg,
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
  tabSelected: { backgroundColor: localColors.tabSelected },
  tabText: { color: localColors.white, fontSize: 14, fontWeight: "600" },
  tabTextSelected: { color: localColors.tabSelectedText },
});

export default HelpCenterScreen;
