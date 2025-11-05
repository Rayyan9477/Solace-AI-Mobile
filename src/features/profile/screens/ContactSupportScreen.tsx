/**
 * Contact Support Screen - Direct Support Channels
 * Based on ui-designs/Dark-mode/🔒 Profile Settings & Help Center.png
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

export const ContactSupportScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
    { id: "bug", name: "Bug Report", icon: "🐛" },
    { id: "feature", name: "Feature Request", icon: "💡" },
    { id: "account", name: "Account Issue", icon: "👤" },
    { id: "payment", name: "Billing", icon: "💳" },
    { id: "other", name: "Other", icon: "💬" },
  ];

  const supportChannels = [
    { id: "email", name: "Email Support", icon: "📧", response: "24 hours" },
    { id: "chat", name: "Live Chat", icon: "💬", response: "Instant" },
    { id: "phone", name: "Phone Support", icon: "📞", response: "1 hour" },
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
    section: {
      paddingHorizontal: 20,
      paddingTop: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    channelsRow: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 24,
    },
    channelCard: {
      flex: 1,
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
      alignItems: "center",
    },
    channelIcon: {
      fontSize: 32,
      marginBottom: 8,
    },
    channelName: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 4,
      textAlign: "center",
    },
    channelResponse: {
      fontSize: 11,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    categoriesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      marginBottom: 24,
    },
    categoryButton: {
      width: "48%",
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 12,
      padding: 12,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "transparent",
    },
    categoryButtonSelected: {
      borderColor: theme.colors.brown["60"],
      backgroundColor: theme.colors.brown["20"],
    },
    categoryIcon: {
      fontSize: 24,
      marginRight: 8,
    },
    categoryText: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    inputGroup: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    input: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 15,
      color: theme.colors.text.primary,
      borderWidth: 1,
      borderColor: theme.colors.gray["20"],
    },
    textArea: {
      height: 120,
      textAlignVertical: "top",
    },
    submitButton: {
      backgroundColor: theme.colors.brown["60"],
      borderRadius: 16,
      paddingVertical: 16,
      marginHorizontal: 20,
      marginVertical: 24,
      alignItems: "center",
    },
    submitButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    emergencyCard: {
      backgroundColor: theme.colors.red["20"],
      marginHorizontal: 20,
      marginTop: 20,
      borderRadius: 16,
      padding: 16,
    },
    emergencyTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    emergencyText: {
      fontSize: 13,
      lineHeight: 18,
      color: theme.colors.text.secondary,
      marginBottom: 12,
    },
    emergencyButton: {
      backgroundColor: theme.colors.red["60"],
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: "center",
    },
    emergencyButtonText: {
      fontSize: 14,
      fontWeight: "700",
      color: "#FFFFFF",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessible
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.emergencyCard}>
          <Text style={styles.emergencyTitle}>🚨 In Crisis?</Text>
          <Text style={styles.emergencyText}>
            If you're experiencing a mental health emergency, please contact
            emergency services immediately.
          </Text>
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => navigation.navigate("CrisisSupport")}
          >
            <Text style={styles.emergencyButtonText}>Get Crisis Support</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support Channels</Text>
          <View style={styles.channelsRow}>
            {supportChannels.map((channel) => (
              <TouchableOpacity key={channel.id} style={styles.channelCard}>
                <Text style={styles.channelIcon}>{channel.icon}</Text>
                <Text style={styles.channelName}>{channel.name}</Text>
                <Text style={styles.channelResponse}>{channel.response}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id &&
                    styles.categoryButtonSelected,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Subject</Text>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={setSubject}
              placeholder="Brief description of your issue"
              placeholderTextColor={theme.colors.text.tertiary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Message</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={message}
              onChangeText={setMessage}
              placeholder="Provide details about your issue..."
              placeholderTextColor={theme.colors.text.tertiary}
              multiline
            />
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Send Message 📤</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContactSupportScreen;
