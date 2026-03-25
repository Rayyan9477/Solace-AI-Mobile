/**
 * FacialExpressionCameraScreen Component
 * @description Camera interface for capturing facial expressions with biometric overlay
 * @task Task 3.7.6: Facial Expression Camera Screen (Screen 58)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { palette } from "../../../shared/theme";

type CameraFacing = "front" | "back";

interface FacialExpressionCameraScreenProps {
  cameraReady: boolean;
  cameraFacing: CameraFacing;
  faceDetected: boolean;
  heartRate: number | null;
  bloodPressureSys: number | null;
  bloodPressureDia: number | null;
  instructionText: string;
  onBack: () => void;
  onCapture: () => void;
  onGallery: () => void;
  onFlipCamera: () => void;
  onAnalyticsMode: () => void;
}

export function FacialExpressionCameraScreen({
  faceDetected,
  heartRate,
  bloodPressureSys,
  instructionText,
  onBack,
  onCapture,
  onGallery,
  onFlipCamera,
  onAnalyticsMode,
}: FacialExpressionCameraScreenProps): React.ReactElement {
  return (
    <View testID="facial-expression-camera-screen" style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        testID="back-button"
        style={styles.backButton}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Text style={styles.backButtonIcon}>←</Text>
      </TouchableOpacity>

      {/* Biometric Indicators */}
      <View style={styles.biometricsRow}>
        <View
          testID="heart-rate-indicator"
          style={[styles.biometricCard, styles.heartRateCard]}
        >
          <Icon name="checkmark-circle-outline" size={16} color={palette.olive[500]} style={styles.biometricIcon} />
          <Text style={styles.biometricValue}>{heartRate || "--"}</Text>
          <Text style={styles.biometricUnit}>bpm</Text>
        </View>
        <View
          testID="blood-pressure-indicator"
          style={[styles.biometricCard, styles.bloodPressureCard]}
        >
          <Icon name="radio-button-on-outline" size={16} color="#9A5CAD" style={styles.biometricIcon} />
          <Text style={styles.biometricValue}>{bloodPressureSys || "--"}</Text>
          <Text style={styles.biometricUnit}>sys</Text>
        </View>
      </View>

      {/* Camera Preview Area */}
      <View testID="camera-preview" style={styles.cameraPreview}>
        {/* Face Detection Overlay */}
        <View
          testID="face-detection-overlay"
          style={[
            styles.faceOverlay,
            { borderColor: faceDetected ? palette.olive[500] : palette.onboarding.step2 },
          ]}
        >
          <View style={styles.faceOverlayInner}>
            <Text style={styles.faceOverlayText}>
              {faceDetected ? "FACE DETECTED" : "POSITION FACE"}
            </Text>
          </View>
        </View>
      </View>

      {/* Instruction Banner */}
      <View testID="instruction-banner" style={styles.instructionBanner}>
        <Icon name="warning-outline" size={16} color={palette.brown[900]} />
        <Text style={styles.instructionText}>{instructionText}</Text>
      </View>

      {/* Camera Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.mainControls}>
          <TouchableOpacity
            testID="gallery-button"
            style={styles.controlButton}
            onPress={onGallery}
            accessibilityRole="button"
            accessibilityLabel="Open gallery"
          >
            <Icon name="image-outline" size={22} color={palette.white} />
          </TouchableOpacity>

          <TouchableOpacity
            testID="capture-button"
            style={styles.captureButton}
            onPress={onCapture}
            accessibilityRole="button"
            accessibilityLabel="Capture photo"
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          <TouchableOpacity
            testID="flip-camera-button"
            style={styles.controlButton}
            onPress={onFlipCamera}
            accessibilityRole="button"
            accessibilityLabel="Flip camera"
          >
            <Icon name="camera-reverse-outline" size={22} color={palette.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.modeControls}>
          <TouchableOpacity
            testID="camera-mode-button"
            style={[styles.modeButton, styles.modeButtonActive]}
            accessibilityRole="button"
            accessibilityLabel="Camera mode"
          >
            <Icon name="camera-outline" size={22} color={palette.white} />
          </TouchableOpacity>

          <TouchableOpacity
            testID="analytics-mode-button"
            style={styles.modeButton}
            onPress={onAnalyticsMode}
            accessibilityRole="button"
            accessibilityLabel="Analytics mode"
          >
            <Icon name="bar-chart-outline" size={22} color={palette.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    backgroundColor: "rgba(28, 20, 16, 0.6)",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    left: 24,
    minHeight: 44,
    minWidth: 44,
    position: "absolute",
    top: 60,
    width: 40,
    zIndex: 10,
  },
  backButtonIcon: {
    color: palette.white,
    fontSize: 20,
    fontWeight: "600",
  },
  biometricCard: {
    alignItems: "center",
    borderRadius: 12,
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  biometricIcon: {
    marginRight: 6,
  },
  biometricUnit: {
    color: palette.white,
    fontSize: 12,
    marginLeft: 4,
    opacity: 0.7,
  },
  biometricValue: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "700",
  },
  biometricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    left: 0,
    paddingHorizontal: 24,
    position: "absolute",
    right: 0,
    top: 120,
    zIndex: 10,
  },
  bloodPressureCard: {
    backgroundColor: "rgba(154, 92, 173, 0.3)",
  },
  cameraPreview: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    flex: 1,
    justifyContent: "center",
  },
  captureButton: {
    alignItems: "center",
    backgroundColor: palette.white,
    borderRadius: 35,
    height: 70,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 70,
  },
  captureButtonInner: {
    backgroundColor: palette.white,
    borderColor: palette.brown[900],
    borderRadius: 28,
    borderWidth: 3,
    height: 56,
    width: 56,
  },
  container: {
    backgroundColor: palette.brown[900],
    flex: 1,
  },
  controlButton: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 50,
  },
  controlsContainer: {
    backgroundColor: palette.brown[900],
    paddingBottom: 40,
    paddingTop: 24,
  },
  faceOverlay: {
    alignItems: "center",
    borderRadius: 100,
    borderStyle: "dashed",
    borderWidth: 3,
    height: 200,
    justifyContent: "center",
    width: 200,
  },
  faceOverlayInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  faceOverlayText: {
    color: palette.white,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    opacity: 0.7,
  },
  heartRateCard: {
    backgroundColor: "rgba(154, 173, 92, 0.3)",
  },
  instructionBanner: {
    alignItems: "center",
    backgroundColor: palette.tan[500],
    borderRadius: 12,
    flexDirection: "row",
    marginHorizontal: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: "absolute",
    bottom: 200,
    left: 0,
    right: 0,
  },
  instructionText: {
    color: palette.brown[900],
    flex: 1,
    fontSize: 13,
    marginLeft: 8,
  },
  mainControls: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  modeButton: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    marginHorizontal: 8,
    width: 50,
  },
  modeButtonActive: {
    backgroundColor: palette.brown[700],
    borderColor: palette.tan[500],
    borderWidth: 2,
  },
  modeControls: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default FacialExpressionCameraScreen;
