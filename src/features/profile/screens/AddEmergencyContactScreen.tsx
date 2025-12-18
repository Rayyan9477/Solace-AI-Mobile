/**
 * Add Emergency Contact Screen - Add/Edit Emergency Contacts
 * For crisis support and safety features
 *
 * Uses secureStorage for encrypted storage of emergency contacts
 * Storage key must match CrisisManager for proper integration
 */

import { logger } from "@shared/utils/logger";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import secureStorage from "../../../app/services/secureStorage";

/** Storage key must match CrisisManager.ts for proper integration */
const EMERGENCY_CONTACTS_STORAGE_KEY = "emergency_contacts";

export const AddEmergencyContactScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const [contactName, setContactName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [relationship, setRelationship] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Validates phone number format
   * Accepts: +1234567890, (123) 456-7890, 123-456-7890, 1234567890
   */
  const validatePhoneNumber = useCallback((phone: string): boolean => {
    const phoneRegex = /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }, []);

  /**
   * Validates email format if provided
   */
  const validateEmail = useCallback((emailInput: string): boolean => {
    if (!emailInput) return true; // Optional field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailInput);
  }, []);

  const handleSave = async () => {
    // Validate required fields
    if (!contactName.trim()) {
      Alert.alert(
        "Required Field",
        "Please enter a contact name.",
        [{ text: "OK" }]
      );
      return;
    }

    if (!phoneNumber.trim()) {
      Alert.alert(
        "Required Field",
        "Please enter a phone number.",
        [{ text: "OK" }]
      );
      return;
    }

    // Validate phone number format
    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert(
        "Invalid Phone Number",
        "Please enter a valid phone number format.",
        [{ text: "OK" }]
      );
      return;
    }

    // Validate email if provided
    if (email && !validateEmail(email)) {
      Alert.alert(
        "Invalid Email",
        "Please enter a valid email address or leave it empty.",
        [{ text: "OK" }]
      );
      return;
    }

    setIsSaving(true);
    try {
      // Load existing contacts from secure storage
      let existingContacts: Array<{
        id: string;
        name: string;
        phoneNumber: string;
        relationship?: string;
        email?: string;
        createdAt: string;
      }> = [];

      const existingData = await secureStorage.getSecureData(EMERGENCY_CONTACTS_STORAGE_KEY);
      if (existingData) {
        const parsed = typeof existingData === 'string' ? JSON.parse(existingData) : existingData;
        existingContacts = Array.isArray(parsed) ? parsed : [];
      }

      // Check for duplicate phone number
      const isDuplicate = existingContacts.some(
        (contact) => contact.phoneNumber.replace(/\D/g, '') === phoneNumber.replace(/\D/g, '')
      );
      if (isDuplicate) {
        Alert.alert(
          "Duplicate Contact",
          "A contact with this phone number already exists.",
          [{ text: "OK" }]
        );
        setIsSaving(false);
        return;
      }

      // Create new contact with sanitized data
      const newContact = {
        id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: contactName.trim(),
        phoneNumber: phoneNumber.trim(),
        relationship: relationship || undefined,
        email: email.trim() || undefined,
        createdAt: new Date().toISOString(),
      };

      // Save updated contacts list to secure storage
      const updatedContacts = [...existingContacts, newContact];
      await secureStorage.storeSecureData(
        EMERGENCY_CONTACTS_STORAGE_KEY,
        JSON.stringify(updatedContacts)
      );

      logger.info("[AddEmergencyContact] Emergency contact saved successfully:", {
        contactId: newContact.id,
        name: newContact.name,
      });

      Alert.alert(
        "Contact Saved",
        `${contactName} has been added as an emergency contact. They can be reached quickly from the Crisis Support screen.`,
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      logger.error("[AddEmergencyContact] Failed to save emergency contact:", error);
      Alert.alert(
        "Save Failed",
        "Unable to save contact securely. Please check your device storage and try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsSaving(false);
    }
  };

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
      borderBottomColor: theme.colors.brown[30],
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.brown[20],
      justifyContent: "center",
      alignItems: "center",
    },
    backButtonText: {
      fontSize: 20,
      color: theme.colors.text.primary,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    headerSpacer: {
      width: 40,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    infoCard: {
      backgroundColor: theme.colors.blue[20],
      borderRadius: 16,
      padding: 16,
      marginBottom: 24,
    },
    infoText: {
      fontSize: 13,
      color: theme.colors.text.secondary,
      lineHeight: 20,
    },
    section: {
      marginBottom: 24,
    },
    label: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.secondary,
      marginBottom: 8,
    },
    required: {
      color: theme.colors.orange[40],
    },
    input: {
      backgroundColor: theme.colors.brown[20],
      borderRadius: 16,
      padding: 16,
      fontSize: 16,
      color: theme.colors.text.primary,
      borderWidth: 1,
      borderColor: theme.colors.brown[40],
    },
    relationshipOptions: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    relationshipChip: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: theme.colors.brown[20],
      borderWidth: 1,
      borderColor: theme.colors.brown[40],
    },
    relationshipChipSelected: {
      backgroundColor: theme.colors.brown[70],
      borderColor: theme.colors.brown[70],
    },
    relationshipChipText: {
      fontSize: 14,
      color: theme.colors.text.primary,
    },
    relationshipChipTextSelected: {
      color: theme.colors.brown[10],
      fontWeight: "700",
    },
    saveButton: {
      backgroundColor: theme.colors.brown[70],
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: "center",
      marginTop: 8,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.brown[10],
    },
  });

  const relationships = ["Family", "Friend", "Partner", "Therapist", "Other"];

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
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Emergency Contact</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            💡 Emergency contacts can be quickly reached during a crisis. This
            information is stored securely and used only when needed.
          </Text>
        </View>

        {/* Contact Name */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Contact Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={contactName}
            onChangeText={setContactName}
            placeholder="Enter contact name"
            placeholderTextColor={theme.colors.text.tertiary}
            accessible
            accessibilityLabel="Contact name input"
            accessibilityHint="Enter the emergency contact's full name"
          />
        </View>

        {/* Phone Number */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Phone Number <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="+1 (555) 123-4567"
            placeholderTextColor={theme.colors.text.tertiary}
            keyboardType="phone-pad"
            accessible
            accessibilityLabel="Phone number input"
            accessibilityHint="Enter the emergency contact's phone number"
          />
        </View>

        {/* Relationship */}
        <View style={styles.section}>
          <Text style={styles.label}>Relationship</Text>
          <View style={styles.relationshipOptions}>
            {relationships.map((rel) => (
              <TouchableOpacity
                key={rel}
                style={[
                  styles.relationshipChip,
                  relationship === rel && styles.relationshipChipSelected,
                ]}
                onPress={() => setRelationship(rel)}
                accessible
                accessibilityLabel={`Select ${rel} as relationship`}
                accessibilityRole="button"
                accessibilityState={{ selected: relationship === rel }}
              >
                <Text
                  style={[
                    styles.relationshipChipText,
                    relationship === rel && styles.relationshipChipTextSelected,
                  ]}
                >
                  {rel}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Email (Optional) */}
        <View style={styles.section}>
          <Text style={styles.label}>Email (Optional)</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="contact@example.com"
            placeholderTextColor={theme.colors.text.tertiary}
            keyboardType="email-address"
            autoCapitalize="none"
            accessible
            accessibilityLabel="Email input"
            accessibilityHint="Enter the emergency contact's email address"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          accessible
          accessibilityLabel="Save emergency contact"
          accessibilityRole="button"
        >
          <Text style={styles.saveButtonText}>Save Contact</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddEmergencyContactScreen;
