/**
 * Help Center Screen - User Support and FAQ
 * Based on ui-designs/Dark-mode/Profile Settings & Help Center.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from "react-native";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const HelpCenterScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqCategories = [
    { id: "account", name: "Account", icon: "👤" },
    { id: "privacy", name: "Privacy", icon: "🔒" },
    { id: "features", name: "Features", icon: "⚡" },
    { id: "billing", name: "Billing", icon: "💳" },
  ];

  const faqs: FAQItem[] = [
    {
      id: "1",
      question: "How do I reset my password?",
      answer:
        "Go to Settings > Account > Change Password to reset your password.",
      category: "account",
    },
    {
      id: "2",
      question: "Is my data secure?",
      answer:
        "Yes, we use end-to-end encryption to protect all your mental health data.",
      category: "privacy",
    },
    {
      id: "3",
      question: "How does the AI therapy chatbot work?",
      answer:
        "Our AI chatbot uses advanced natural language processing to provide therapeutic support.",
      category: "features",
    },
    {
      id: "4",
      question: "Can I cancel my subscription?",
      answer: "Yes, you can cancel anytime from Settings > Subscription.",
      category: "billing",
    },
  ];

  const contactOptions = [
    { id: "email", name: "Email Support", icon: "📧", action: "Email" },
    { id: "chat", name: "Live Chat", icon: "💬", action: "Chat" },
    { id: "phone", name: "Phone Support", icon: "📞", action: "Call" },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.gray["20"],
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    content: {
      flex: 1,
    },
    searchSection: {
      padding: 20,
    },
    searchInput: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 14,
      color: theme.colors.text.primary,
    },
    categoriesSection: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    categoriesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    categoryCard: {
      flex: 1,
      minWidth: "47%",
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 20,
      alignItems: "center",
    },
    categoryIcon: {
      fontSize: 32,
      marginBottom: 8,
    },
    categoryName: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    faqSection: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    faqCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    },
    faqQuestion: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    faqAnswer: {
      fontSize: 13,
      lineHeight: 18,
      color: theme.colors.text.secondary,
    },
    contactSection: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    contactCard: {
      backgroundColor: theme.colors.green["20"],
      borderRadius: 16,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    contactIcon: {
      fontSize: 24,
      marginRight: 12,
    },
    contactInfo: {
      flex: 1,
    },
    contactName: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.green["100"],
    },
    contactArrow: {
      fontSize: 18,
      color: theme.colors.green["80"],
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for help..."
            placeholderTextColor={theme.colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Browse by Category</Text>
          <View style={styles.categoriesGrid}>
            {faqCategories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryCard}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqs.map((faq) => (
            <TouchableOpacity
              key={faq.id}
              style={styles.faqCard}
              onPress={() =>
                setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)
              }
            >
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              {expandedFAQ === faq.id && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          {contactOptions.map((option) => (
            <TouchableOpacity key={option.id} style={styles.contactCard}>
              <Text style={styles.contactIcon}>{option.icon}</Text>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{option.name}</Text>
              </View>
              <Text style={styles.contactArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpCenterScreen;
