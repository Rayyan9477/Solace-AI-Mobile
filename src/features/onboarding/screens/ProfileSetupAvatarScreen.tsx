/**
 * ProfileSetupAvatarScreen Component
 * @description Avatar selection screen during profile setup
 * @task Task 3.3.1: Profile Setup Avatar Screen (Screen 15)
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface ProfileSetupAvatarScreenProps {
  onBack: () => void;
  onContinue: (avatarSource: string | null) => void;
  onUpload: () => void;
}

export function ProfileSetupAvatarScreen({
  onBack,
  onContinue,
  onUpload,
}: ProfileSetupAvatarScreenProps): React.ReactElement {
  return (
    <View testID="profile-setup-avatar-screen" style={styles.container}>
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
        <Text style={styles.headerTitle}>Profile Setup</Text>
      </View>

      {/* Avatar Selection Section */}
      <View testID="avatar-display" style={styles.avatarSection}>
        {/* Swipe Up Indicator */}
        <View testID="swipe-indicator-up" style={styles.swipeIndicator}>
          <Text style={styles.swipeIndicatorIcon}>▲</Text>
        </View>

        {/* Main Avatar Display */}
        <View testID="avatar-container" style={styles.avatarContainer}>
          <View style={styles.avatarInner}>
            {/* Placeholder avatar - pie chart pattern */}
            <View style={styles.avatarPlaceholder}>
              <View style={[styles.pieSegment, styles.pieSegment1]} />
              <View style={[styles.pieSegment, styles.pieSegment2]} />
              <View style={[styles.pieSegment, styles.pieSegment3]} />
              <View style={[styles.pieSegment, styles.pieSegment4]} />
            </View>
          </View>
        </View>

        {/* Swipe Down Indicator */}
        <View testID="swipe-indicator-down" style={styles.swipeIndicator}>
          <Text style={styles.swipeIndicatorIcon}>▼</Text>
        </View>

        {/* Decorative Circles */}
        <View testID="decorative-circles" style={styles.decorativeCircles}>
          <View style={[styles.decorativeCircle, styles.circleTopLeft]} />
          <View style={[styles.decorativeCircle, styles.circleTopRight]} />
          <View style={[styles.decorativeCircle, styles.circleBottomLeft]} />
          <View style={[styles.decorativeCircle, styles.circleBottomRight]} />
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        <Text style={styles.title}>Select your Avatar</Text>
        <Text style={styles.subtitle}>
          We have a set of customizable avatar. Or you can upload your own image
          from your local file.
        </Text>
      </View>

      {/* Upload Section */}
      <View style={styles.uploadSection}>
        <TouchableOpacity
          testID="upload-button"
          style={styles.uploadButton}
          onPress={onUpload}
          accessibilityRole="button"
          accessibilityLabel="Upload profile picture"
        >
          <Text style={styles.uploadButtonIcon}>+</Text>
        </TouchableOpacity>
        <Text style={styles.uploadLabel}>Or upload your profile</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: "center",
    borderColor: "#8B6F47",
    borderRadius: 100,
    borderWidth: 8,
    height: 200,
    justifyContent: "center",
    width: 200,
  },
  avatarInner: {
    alignItems: "center",
    backgroundColor: "#2A2220",
    borderRadius: 90,
    height: 180,
    justifyContent: "center",
    overflow: "hidden",
    width: 180,
  },
  avatarPlaceholder: {
    alignItems: "center",
    height: 120,
    justifyContent: "center",
    position: "relative",
    width: 120,
  },
  avatarSection: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    position: "relative",
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
  circleBottomLeft: {
    bottom: 20,
    left: -30,
  },
  circleBottomRight: {
    bottom: 20,
    right: -30,
  },
  circleTopLeft: {
    left: -30,
    top: 20,
  },
  circleTopRight: {
    right: -30,
    top: 20,
  },
  container: {
    backgroundColor: "#1C1410",
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  contentSection: {
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  decorativeCircle: {
    backgroundColor: "#2A2220",
    borderRadius: 40,
    height: 80,
    opacity: 0.5,
    position: "absolute",
    width: 80,
  },
  decorativeCircles: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 24,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
  },
  pieSegment: {
    backgroundColor: "#9AAD5C",
    borderRadius: 60,
    height: 60,
    position: "absolute",
    width: 60,
  },
  pieSegment1: {
    backgroundColor: "#9AAD5C",
    left: 0,
    top: 0,
  },
  pieSegment2: {
    backgroundColor: "#C4A574",
    right: 0,
    top: 0,
  },
  pieSegment3: {
    backgroundColor: "#8B6F47",
    bottom: 0,
    left: 0,
  },
  pieSegment4: {
    backgroundColor: "#3D2E23",
    bottom: 0,
    right: 0,
  },
  subtitle: {
    color: "#94A3B8",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 12,
    textAlign: "center",
  },
  swipeIndicator: {
    alignItems: "center",
    height: 30,
    justifyContent: "center",
    marginVertical: 8,
  },
  swipeIndicatorIcon: {
    color: "#8B6F47",
    fontSize: 16,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontStyle: "italic",
    fontWeight: "700",
  },
  uploadButton: {
    alignItems: "center",
    borderColor: "#8B6F47",
    borderRadius: 40,
    borderStyle: "dashed",
    borderWidth: 2,
    height: 80,
    justifyContent: "center",
    width: 80,
  },
  uploadButtonIcon: {
    color: "#8B6F47",
    fontSize: 32,
    fontWeight: "300",
  },
  uploadLabel: {
    color: "#94A3B8",
    fontSize: 14,
    marginTop: 12,
  },
  uploadSection: {
    alignItems: "center",
    marginBottom: 40,
  },
});

export default ProfileSetupAvatarScreen;
