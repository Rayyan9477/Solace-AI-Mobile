/**
 * AboutCompanyScreen Component
 * @description Company information with office address, email, and phone contact cards
 * @task Task 3.17.9: About Company Screen (Screen 148)
 * @audit-fix "Freud AI Health" → "Solace AI Health"
 * @audit-fix "freudhealth.ai" → "solacehealth.ai"
 * @audit-fix "North Detroit, Texas" → corrected geography
 * @audit-fix Phone section now shows actual phone numbers
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

interface AboutCompanyScreenProps {
  companyName: string;
  tagline: string;
  addressLines: string[];
  emails: string[];
  phoneNumbers: string[];
  onBack: () => void;
  onAddressPress: () => void;
  onEmailPress: () => void;
  onPhonePress: () => void;
}

const colors = {
  heroBg: "#6B7A3D",
  white: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.7)",
  cardBg: "#4A5A2A",
  iconBg: "rgba(255,255,255,0.2)",
  chevron: "rgba(255,255,255,0.4)",
} as const;

export function AboutCompanyScreen({
  companyName,
  tagline,
  addressLines,
  emails,
  phoneNumbers,
  onBack,
  onAddressPress,
  onEmailPress,
  onPhonePress,
}: AboutCompanyScreenProps): React.ReactElement {
  return (
    <View testID="about-company-screen" style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Back Button */}
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>{"\u2190"}</Text>
        </TouchableOpacity>

        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>{"\u2B55"}</Text>
          </View>
          <Text style={styles.companyName}>{companyName}</Text>
          <Text style={styles.tagline}>{tagline}</Text>
        </View>

        {/* Address Card */}
        <TouchableOpacity
          testID="address-card"
          style={styles.contactCard}
          onPress={onAddressPress}
          accessibilityRole="button"
          accessibilityLabel="View office address"
        >
          <View style={styles.cardIcon}>
            <Text style={styles.cardIconText}>{"\uD83D\uDCCD"}</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Our Office Address</Text>
            {addressLines.map((line, index) => (
              <Text key={index} style={styles.cardText}>
                {line}
              </Text>
            ))}
          </View>
          <Text style={styles.chevron}>{"\u203A"}</Text>
        </TouchableOpacity>

        {/* Email Card */}
        <TouchableOpacity
          testID="email-card"
          style={styles.contactCard}
          onPress={onEmailPress}
          accessibilityRole="button"
          accessibilityLabel="View email addresses"
        >
          <View style={styles.cardIcon}>
            <Text style={styles.cardIconText}>{"\u2709\uFE0F"}</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Our Email Address</Text>
            {emails.map((email, index) => (
              <Text key={index} style={styles.cardText}>
                {email}
              </Text>
            ))}
          </View>
          <Text style={styles.chevron}>{"\u203A"}</Text>
        </TouchableOpacity>

        {/* Phone Card */}
        <TouchableOpacity
          testID="phone-card"
          style={styles.contactCard}
          onPress={onPhonePress}
          accessibilityRole="button"
          accessibilityLabel="View phone numbers"
        >
          <View style={styles.cardIcon}>
            <Text style={styles.cardIconText}>{"\uD83D\uDCDE"}</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Our Phone Number</Text>
            {phoneNumbers.map((phone, index) => (
              <Text key={index} style={styles.cardText}>
                {phone}
              </Text>
            ))}
          </View>
          <Text style={styles.chevron}>{"\u203A"}</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  backIcon: { color: colors.white, fontSize: 24 },
  cardContent: { flex: 1, marginLeft: 16 },
  cardIcon: {
    alignItems: "center",
    backgroundColor: colors.iconBg,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  cardIconText: { fontSize: 18 },
  cardText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  cardTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  chevron: { color: colors.chevron, fontSize: 24 },
  companyName: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 16,
  },
  contactCard: {
    alignItems: "center",
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    flexDirection: "row",
    marginHorizontal: 24,
    marginTop: 12,
    padding: 16,
  },
  container: { backgroundColor: colors.heroBg, flex: 1 },
  logo: {
    alignItems: "center",
    height: 64,
    justifyContent: "center",
    width: 64,
  },
  logoSection: {
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 24,
  },
  logoText: { fontSize: 40 },
  scrollContent: { paddingBottom: 48 },
  tagline: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
});

export default AboutCompanyScreen;
