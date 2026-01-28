/**
 * ProfileSetupDetailsScreen Component
 * @description Profile details form during profile setup
 * @task Task 3.3.2: Profile Setup Details Screen (Screen 16)
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";

interface ProfileSetupDetailsScreenProps {
  onBack: () => void;
  onContinue: () => void;
  onEditPhoto: () => void;
  onGenderPress: () => void;
  onLocationPress: () => void;
}

type AccountType = "psychiatrist" | "patient" | "professional";

export function ProfileSetupDetailsScreen({
  onBack,
  onContinue,
  onEditPhoto,
  onGenderPress,
  onLocationPress,
}: ProfileSetupDetailsScreenProps): React.ReactElement {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState<AccountType>("patient");
  const [weight, setWeight] = useState(65);
  const [gender, setGender] = useState("Trans Female");
  const [location, setLocation] = useState("Tokyo, Japan");

  const accountTypes: { id: AccountType; label: string }[] = [
    { id: "psychiatrist", label: "Psychiatrist" },
    { id: "patient", label: "Patient" },
    { id: "professional", label: "Professional" },
  ];

  return (
    <View testID="profile-setup-details-screen" style={styles.container}>
      {/* Curved Header */}
      <View testID="curved-header" style={styles.curvedHeader}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            testID="back-button"
            style={styles.backButton}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backButtonIcon}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile Setup</Text>
        </View>
        {/* Decorative squiggles */}
        <View style={styles.squiggle1} />
        <View style={styles.squiggle2} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Photo Section */}
        <View style={styles.photoSection}>
          <View testID="profile-photo" style={styles.profilePhoto}>
            <Text style={styles.photoPlaceholder}>👤</Text>
          </View>
          <TouchableOpacity
            testID="edit-photo-button"
            style={styles.editPhotoButton}
            onPress={onEditPhoto}
            accessibilityRole="button"
            accessibilityLabel="Edit profile photo"
          >
            <Text style={styles.editPhotoIcon}>🔗</Text>
          </TouchableOpacity>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Full Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                testID="full-name-input"
                style={styles.textInput}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                placeholderTextColor="#8A8A8A"
                accessibilityLabel="Full name input"
              />
            </View>
          </View>

          {/* Email Address */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>@</Text>
              <TextInput
                testID="email-input"
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#8A8A8A"
                keyboardType="email-address"
                autoCapitalize="none"
                accessibilityLabel="Email address input"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                testID="password-input"
                style={styles.textInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#8A8A8A"
                secureTextEntry={!showPassword}
                accessibilityLabel="Password input"
              />
              <TouchableOpacity
                testID="password-toggle"
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? "Hide password" : "Show password"}
              >
                <Text style={styles.toggleIcon}>{showPassword ? "👁" : "👁‍🗨"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Account Type */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Account Type</Text>
            <View testID="account-type-selector" style={styles.pillSelector}>
              {accountTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.pill,
                    accountType === type.id && styles.pillSelected,
                  ]}
                  onPress={() => setAccountType(type.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: accountType === type.id }}
                >
                  <Text
                    style={[
                      styles.pillText,
                      accountType === type.id && styles.pillTextSelected,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Weight */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Weight</Text>
            <View testID="weight-slider" style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>50kg</Text>
              <View style={styles.sliderTrack}>
                <View
                  style={[
                    styles.sliderFill,
                    { width: `${((weight - 50) / 50) * 100}%` },
                  ]}
                />
                <View
                  style={[
                    styles.sliderThumb,
                    { left: `${((weight - 50) / 50) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.sliderValue}>{weight}kg</Text>
              <Text style={styles.sliderLabel}>100kg</Text>
            </View>
          </View>

          {/* Gender */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Gender</Text>
            <TouchableOpacity
              testID="gender-dropdown"
              style={styles.dropdown}
              onPress={onGenderPress}
              accessibilityRole="button"
              accessibilityLabel="Select gender"
            >
              <Text style={styles.dropdownIcon}>⚧</Text>
              <Text style={styles.dropdownText}>{gender}</Text>
              <Text style={styles.dropdownChevron}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Location */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Location</Text>
            <TouchableOpacity
              testID="location-dropdown"
              style={styles.dropdown}
              onPress={onLocationPress}
              accessibilityRole="button"
              accessibilityLabel="Select location"
            >
              <Text style={styles.dropdownIcon}>📍</Text>
              <Text style={styles.dropdownText}>{location}</Text>
              <Text style={styles.dropdownChevron}>▼</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          testID="continue-button"
          style={styles.continueButton}
          onPress={onContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue to next step"
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Text style={styles.continueButtonIcon}>→</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    borderColor: "#FFFFFF",
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
  container: {
    backgroundColor: "#1C1410",
    flex: 1,
  },
  continueButton: {
    alignItems: "center",
    backgroundColor: "#C4A574",
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 32,
    marginTop: 24,
    minHeight: 56,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  continueButtonIcon: {
    color: "#1C1410",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  continueButtonText: {
    color: "#1C1410",
    fontSize: 16,
    fontWeight: "600",
  },
  curvedHeader: {
    backgroundColor: "#9AAD5C",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    height: 140,
    overflow: "hidden",
    paddingHorizontal: 24,
    paddingTop: 60,
    position: "relative",
  },
  dropdown: {
    alignItems: "center",
    backgroundColor: "#2A2220",
    borderRadius: 12,
    flexDirection: "row",
    height: 56,
    paddingHorizontal: 16,
  },
  dropdownChevron: {
    color: "#8A8A8A",
    fontSize: 12,
  },
  dropdownIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  dropdownText: {
    color: "#FFFFFF",
    flex: 1,
    fontSize: 16,
  },
  editPhotoButton: {
    alignItems: "center",
    backgroundColor: "#C4A574",
    borderRadius: 16,
    bottom: 0,
    height: 32,
    justifyContent: "center",
    position: "absolute",
    right: 0,
    width: 32,
  },
  editPhotoIcon: {
    fontSize: 14,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  formSection: {
    paddingHorizontal: 24,
  },
  headerContent: {
    alignItems: "center",
    flexDirection: "row",
    zIndex: 1,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
  },
  inputContainer: {
    alignItems: "center",
    backgroundColor: "#2A2220",
    borderRadius: 12,
    flexDirection: "row",
    height: 56,
    paddingHorizontal: 16,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  passwordToggle: {
    padding: 8,
  },
  photoPlaceholder: {
    fontSize: 48,
  },
  photoSection: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: -50,
  },
  pill: {
    backgroundColor: "#2A2220",
    borderRadius: 20,
    marginRight: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  pillSelected: {
    backgroundColor: "#9AAD5C",
  },
  pillSelector: {
    flexDirection: "row",
  },
  pillText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  pillTextSelected: {
    color: "#1C1410",
  },
  profilePhoto: {
    alignItems: "center",
    backgroundColor: "#2A2220",
    borderColor: "#8B6F47",
    borderRadius: 50,
    borderWidth: 4,
    height: 100,
    justifyContent: "center",
    width: 100,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  scrollView: {
    flex: 1,
  },
  sliderContainer: {
    alignItems: "center",
    flexDirection: "row",
    height: 40,
  },
  sliderFill: {
    backgroundColor: "#9AAD5C",
    borderRadius: 4,
    height: 8,
    left: 0,
    position: "absolute",
  },
  sliderLabel: {
    color: "#8A8A8A",
    fontSize: 12,
    width: 40,
  },
  sliderThumb: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    elevation: 2,
    height: 24,
    marginLeft: -12,
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: 24,
  },
  sliderTrack: {
    backgroundColor: "#3D2E23",
    borderRadius: 4,
    flex: 1,
    height: 8,
    marginHorizontal: 8,
    position: "relative",
  },
  sliderValue: {
    color: "#9AAD5C",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
    width: 50,
  },
  squiggle1: {
    backgroundColor: "#8B9D4C",
    borderRadius: 20,
    height: 40,
    opacity: 0.3,
    position: "absolute",
    right: 40,
    top: 30,
    transform: [{ rotate: "45deg" }],
    width: 60,
  },
  squiggle2: {
    backgroundColor: "#A0B55C",
    borderRadius: 15,
    height: 30,
    opacity: 0.3,
    position: "absolute",
    right: 80,
    top: 60,
    transform: [{ rotate: "-30deg" }],
    width: 45,
  },
  textInput: {
    color: "#FFFFFF",
    flex: 1,
    fontSize: 16,
  },
  toggleIcon: {
    fontSize: 18,
  },
});

export default ProfileSetupDetailsScreen;
