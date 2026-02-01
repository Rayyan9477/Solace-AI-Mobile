/**
 * PersonalInformationScreen Component
 * @description Personal profile editor with avatar, form fields,
 *   account type radio, and weight slider
 * @task Task 3.17.4: Personal Information Screen (Screen 143)
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

type AccountType = "psychiatrist" | "patient" | "professional";

interface PersonalInformationScreenProps {
  dateOfBirth: string;
  gender: string;
  location: string;
  accountType: AccountType;
  weightValue: number;
  weightMin: number;
  weightMax: number;
  weightUnit: string;
  onBack: () => void;
  onAvatarPress: () => void;
  onDateOfBirthPress: () => void;
  onGenderPress: () => void;
  onLocationPress: () => void;
  onAccountTypeSelect: (type: AccountType) => void;
  onWeightChange: (value: number) => void;
  onSave: () => void;
}

const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: "psychiatrist", label: "Psychiatrist" },
  { value: "patient", label: "Patient" },
  { value: "professional", label: "Professional" },
];

const colors = {
  background: "#1C1410",
  white: "#FFFFFF",
  cardBg: "#2A1F18",
  textSecondary: "rgba(255,255,255,0.6)",
  pillBg: "#2A1F18",
  pillSelected: "#9AAD5C",
  ctaButtonBg: "#C4A574",
  ctaButtonText: "#1C1410",
  sliderTrack: "#3D2E23",
  sliderFill: "#C4A574",
  chevron: "rgba(255,255,255,0.3)",
} as const;

export function PersonalInformationScreen({
  dateOfBirth,
  gender,
  location,
  accountType,
  weightValue,
  weightMin,
  weightMax,
  weightUnit,
  onBack,
  onAvatarPress,
  onDateOfBirthPress,
  onGenderPress,
  onLocationPress,
  onAccountTypeSelect,
  onWeightChange,
  onSave,
}: PersonalInformationScreenProps): React.ReactElement {
  const weightFraction = (weightValue - weightMin) / (weightMax - weightMin);

  return (
    <View testID="personal-information-screen" style={styles.container}>
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
        <Text style={styles.headerTitle}>Personal Information</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Avatar */}
        <TouchableOpacity
          testID="avatar-editor"
          style={styles.avatarEditor}
          onPress={onAvatarPress}
          accessibilityRole="button"
          accessibilityLabel="Change avatar"
        >
          <View style={styles.avatar} />
          <View style={styles.editBadge}>
            <Text style={styles.editBadgeIcon}>{"\uD83D\uDCF7"}</Text>
          </View>
        </TouchableOpacity>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <TouchableOpacity
            testID="field-date-of-birth"
            style={styles.formField}
            onPress={onDateOfBirthPress}
            accessibilityRole="button"
            accessibilityLabel="Date of Birth"
          >
            <Text style={styles.fieldLabel}>Date of Birth</Text>
            <View style={styles.fieldValueRow}>
              <Text style={styles.fieldValue}>{dateOfBirth}</Text>
              <Text style={styles.chevron}>{"\u203A"}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            testID="field-gender"
            style={styles.formField}
            onPress={onGenderPress}
            accessibilityRole="button"
            accessibilityLabel="Gender"
          >
            <Text style={styles.fieldLabel}>Gender</Text>
            <View style={styles.fieldValueRow}>
              <Text style={styles.fieldValue}>{gender}</Text>
              <Text style={styles.chevron}>{"\u203A"}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            testID="field-location"
            style={styles.formField}
            onPress={onLocationPress}
            accessibilityRole="button"
            accessibilityLabel="Location"
          >
            <Text style={styles.fieldLabel}>Location</Text>
            <View style={styles.fieldValueRow}>
              <Text style={styles.fieldValue}>{location}</Text>
              <Text style={styles.chevron}>{"\u203A"}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Account Type */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Account Type</Text>
          <View style={styles.accountTypeRow}>
            {ACCOUNT_TYPES.map((type) => (
              <TouchableOpacity
                key={type.value}
                testID={`account-type-${type.value}`}
                style={[
                  styles.accountTypePill,
                  accountType === type.value && styles.accountTypePillSelected,
                ]}
                onPress={() => onAccountTypeSelect(type.value)}
                accessibilityRole="button"
                accessibilityLabel={type.label}
              >
                <Text style={styles.accountTypePillText}>{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Weight Slider */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Weight</Text>
          <Text style={styles.weightDisplay}>
            {weightValue} {weightUnit}
          </Text>
          <View style={styles.sliderTrack}>
            <View
              style={[styles.sliderFill, { width: `${weightFraction * 100}%` }]}
            />
          </View>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>
              {weightMin} {weightUnit}
            </Text>
            <Text style={styles.sliderLabel}>
              {weightMax} {weightUnit}
            </Text>
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            testID="save-button"
            style={styles.saveButton}
            onPress={onSave}
            accessibilityRole="button"
            accessibilityLabel="Save Settings"
          >
            <Text style={styles.saveButtonText}>Save Settings {"\u2713"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  accountTypePill: {
    backgroundColor: colors.pillBg,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  accountTypePillSelected: { backgroundColor: colors.pillSelected },
  accountTypePillText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "600",
  },
  accountTypeRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  avatar: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 48,
    height: 96,
    width: 96,
  },
  avatarEditor: {
    alignItems: "center",
    alignSelf: "center",
    marginTop: 24,
    position: "relative",
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  backIcon: { color: colors.white, fontSize: 24 },
  chevron: { color: colors.chevron, fontSize: 24 },
  container: { backgroundColor: colors.background, flex: 1 },
  editBadge: {
    backgroundColor: colors.ctaButtonBg,
    borderRadius: 14,
    bottom: 0,
    height: 28,
    position: "absolute",
    right: 0,
    width: 28,
  },
  editBadgeIcon: { fontSize: 14, textAlign: "center" },
  fieldLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  fieldValue: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "500",
  },
  fieldValueRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  footer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  formField: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    marginTop: 8,
    minHeight: 44,
    padding: 16,
  },
  formSection: {
    marginTop: 24,
    paddingHorizontal: 24,
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
  saveButton: {
    alignItems: "center",
    backgroundColor: colors.ctaButtonBg,
    borderRadius: 28,
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 16,
    width: "100%",
  },
  saveButtonText: {
    color: colors.ctaButtonText,
    fontSize: 16,
    fontWeight: "700",
  },
  scrollContent: { paddingBottom: 48 },
  section: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  sliderFill: {
    backgroundColor: colors.sliderFill,
    borderRadius: 4,
    height: "100%",
  },
  sliderLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  sliderTrack: {
    backgroundColor: colors.sliderTrack,
    borderRadius: 4,
    height: 8,
    marginTop: 16,
  },
  weightDisplay: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "700",
    marginTop: 8,
  },
});

export default PersonalInformationScreen;
