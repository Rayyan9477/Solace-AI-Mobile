/**
 * Personal Information Screen - Edit User Profile Data
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

export const PersonalInformationScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [name, setName] = useState("Shinomiya Kaguya");
  const [email, setEmail] = useState("kaguya@example.com");
  const [phone, setPhone] = useState("+1 234 567 8900");
  const [dateOfBirth, setDateOfBirth] = useState("Jan 1, 2000");
  const [gender, setGender] = useState("Female");

  const avatars = ["👨", "👩", "🧑", "👴", "👵"];

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
      padding: 20,
    },
    avatarSection: {
      alignItems: "center",
      marginBottom: 32,
    },
    avatarLabel: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.secondary,
      marginBottom: 16,
    },
    avatarRow: {
      flexDirection: "row",
      gap: 12,
    },
    avatarButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.brown["20"],
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "transparent",
    },
    avatarButtonSelected: {
      borderColor: theme.colors.brown["60"],
      backgroundColor: theme.colors.brown["40"],
    },
    avatarEmoji: {
      fontSize: 32,
    },
    formSection: {
      marginBottom: 24,
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
    inputFocused: {
      borderColor: theme.colors.brown["60"],
    },
    saveButton: {
      backgroundColor: theme.colors.brown["60"],
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: "center",
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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
        <Text style={styles.headerTitle}>Personal Information</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar Selection */}
        <View style={styles.avatarSection}>
          <Text style={styles.avatarLabel}>Select Avatar</Text>
          <View style={styles.avatarRow}>
            {/* LOW-NEW-002 FIX: Use avatar emoji as stable key instead of index */}
            {avatars.map((avatar, index) => (
              <TouchableOpacity
                key={`avatar-${avatar}`}
                style={[
                  styles.avatarButton,
                  index === 1 && styles.avatarButtonSelected,
                ]}
              >
                <Text style={styles.avatarEmoji}>{avatar}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={theme.colors.text.tertiary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={theme.colors.text.tertiary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone"
              placeholderTextColor={theme.colors.text.tertiary}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Date of Birth</Text>
            <TextInput
              style={styles.input}
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder="Select date"
              placeholderTextColor={theme.colors.text.tertiary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Gender</Text>
            <TextInput
              style={styles.input}
              value={gender}
              onChangeText={setGender}
              placeholder="Select gender"
              placeholderTextColor={theme.colors.text.tertiary}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Changes ✓</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// LOW-NEW-001 FIX: Add displayName for debugging
PersonalInformationScreen.displayName = 'PersonalInformationScreen';

export default PersonalInformationScreen;
