/**
 * FacialExpressionCameraScreen Component
 * @description Live camera view with biometric badges, face detection overlay,
 *   instruction banner, and camera controls for stress expression analysis
 * @task Task 3.11.5: Facial Expression Camera Screen (Screen 101)
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface FacialExpressionCameraScreenProps {
  heartRate: number;
  bloodPressureSys: number;
  instructionText: string;
  onSettingsPress: () => void;
  onCapture: () => void;
}

const colors = {
  background: "#1C1410",
  white: "#FFFFFF",
  heartGreen: "#4A9E8C",
  bpBlue: "#5B7BB5",
  bannerGold: "#C4A535",
  bannerText: "#1C1410",
  frameWhite: "rgba(255,255,255,0.8)",
  gridWhite: "rgba(255,255,255,0.3)",
  controlBg: "rgba(255,255,255,0.15)",
  controlBorder: "rgba(255,255,255,0.3)",
} as const;

export function FacialExpressionCameraScreen({
  heartRate,
  bloodPressureSys,
  instructionText,
  onSettingsPress,
  onCapture,
}: FacialExpressionCameraScreenProps): React.ReactElement {
  return (
    <View testID="facial-expression-camera-screen" style={styles.container}>
      {/* Camera Preview Placeholder */}
      <View testID="camera-preview" style={styles.cameraPreview}>
        {/* Biometric Badges */}
        <View style={styles.biometricRow}>
          <View testID="heart-rate-badge" style={styles.heartBadge}>
            <Text testID="heart-icon" style={styles.badgeIcon}>
              {"\u2665"}
            </Text>
            <Text style={styles.badgeText}>{heartRate} bpm</Text>
          </View>
          <View testID="blood-pressure-badge" style={styles.bpBadge}>
            <Text style={styles.badgeText}>{bloodPressureSys} sys</Text>
            <Text testID="droplet-icon" style={styles.badgeIcon}>
              {"\uD83D\uDCA7"}
            </Text>
          </View>
        </View>

        {/* Face Detection Overlay */}
        <View style={styles.faceFrameContainer}>
          <View testID="face-frame" style={styles.faceFrame}>
            {/* Grid Overlay */}
            <View testID="grid-overlay" style={styles.gridOverlay}>
              {/* Vertical lines */}
              <View style={[styles.gridLineVertical, { left: "33%" }]} />
              <View style={[styles.gridLineVertical, { left: "66%" }]} />
              {/* Horizontal lines */}
              <View style={[styles.gridLineHorizontal, { top: "33%" }]} />
              <View style={[styles.gridLineHorizontal, { top: "66%" }]} />
            </View>
          </View>
        </View>

        {/* Instruction Banner */}
        <View testID="instruction-banner" style={styles.instructionBanner}>
          <Text testID="banner-icon" style={styles.bannerIcon}>
            {"\u26A1"}
          </Text>
          <Text style={styles.bannerText}>{instructionText}</Text>
        </View>

        {/* Camera Controls */}
        <View testID="camera-controls" style={styles.cameraControls}>
          <View style={styles.controlPlaceholder} />
          <TouchableOpacity
            testID="capture-button"
            style={styles.captureButton}
            onPress={onCapture}
            accessibilityRole="button"
            accessibilityLabel="Capture expression"
          >
            <View style={styles.captureInner} />
          </TouchableOpacity>
          <TouchableOpacity
            testID="settings-button"
            style={styles.settingsButton}
            onPress={onSettingsPress}
            accessibilityRole="button"
            accessibilityLabel="Camera settings"
          >
            <Text style={styles.settingsIcon}>{"\uD83C\uDF9B\uFE0F"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeIcon: {
    color: colors.white,
    fontSize: 14,
  },
  badgeText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
    marginHorizontal: 4,
  },
  bannerIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  bannerText: {
    color: colors.bannerText,
    fontSize: 13,
    fontWeight: "600",
  },
  biometricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  bpBadge: {
    alignItems: "center",
    backgroundColor: colors.bpBlue,
    borderRadius: 20,
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cameraControls: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 32,
    paddingHorizontal: 40,
  },
  cameraPreview: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "space-between",
  },
  captureButton: {
    alignItems: "center",
    borderColor: colors.controlBorder,
    borderRadius: 35,
    borderWidth: 3,
    height: 70,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 70,
  },
  captureInner: {
    backgroundColor: colors.white,
    borderRadius: 26,
    height: 52,
    width: 52,
  },
  container: {
    flex: 1,
  },
  controlPlaceholder: {
    borderColor: colors.controlBorder,
    borderRadius: 24,
    borderWidth: 1,
    height: 48,
    width: 48,
  },
  faceFrame: {
    borderColor: colors.frameWhite,
    borderRadius: 120,
    borderWidth: 3,
    height: 240,
    overflow: "hidden",
    width: 240,
  },
  faceFrameContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  gridLineHorizontal: {
    backgroundColor: colors.gridWhite,
    height: 1,
    left: 0,
    position: "absolute",
    right: 0,
  },
  gridLineVertical: {
    backgroundColor: colors.gridWhite,
    bottom: 0,
    position: "absolute",
    top: 0,
    width: 1,
  },
  gridOverlay: {
    flex: 1,
    position: "relative",
  },
  heartBadge: {
    alignItems: "center",
    backgroundColor: colors.heartGreen,
    borderRadius: 20,
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  instructionBanner: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.bannerGold,
    borderRadius: 20,
    flexDirection: "row",
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  settingsButton: {
    alignItems: "center",
    borderColor: colors.controlBorder,
    borderRadius: 24,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 48,
  },
  settingsIcon: {
    fontSize: 20,
  },
});

export default FacialExpressionCameraScreen;
