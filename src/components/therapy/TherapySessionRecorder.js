import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
  Platform,
} from "react-native";

import { useTheme } from "../../shared/theme/ThemeContext";
import { MentalHealthIcon } from "../icons";

const TherapySessionRecorder = ({
  onRecordingComplete,
  onRecordingStart,
  onRecordingStop,
  onRecordingCancel,
  sessionId,
  maxDuration = 300, // 5 minutes default
  disabled = false,
  style,
}) => {
  const { theme } = useTheme();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [duration, setDuration] = useState(0);
  const [recording, setRecording] = useState(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const animatedScale = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const durationInterval = useRef(null);

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
    };
  }, [recording]);

  useEffect(() => {
    if (isRecording) {
      // Start pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ).start();

      // Start duration counter
      durationInterval.current = setInterval(() => {
        setDuration((prev) => {
          const newDuration = prev + 1;
          if (newDuration >= maxDuration) {
            handleStopRecording();
            return maxDuration;
          }
          return newDuration;
        });
      }, 1000);
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
        durationInterval.current = null;
      }
    }
  }, [isRecording, maxDuration]);

  const ensurePermissions = async () => {
    if (permissionResponse?.status !== "granted") {
      const response = await requestPermission();
      if (response.status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Voice recording requires microphone access for therapy sessions. Please enable it in your device settings.",
          [{ text: "OK" }],
        );
        return false;
      }
    }
    return true;
  };

  const configureAudioSession = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
    } catch (error) {
      console.warn("Audio configuration warning:", error);
    }
  };

  const handleStartRecording = async () => {
    if (disabled || isRecording || isProcessing) return;

    try {
      const hasPermission = await ensurePermissions();
      if (!hasPermission) return;

      await configureAudioSession();

      // Haptic feedback
      if (Platform.OS === "ios") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      // Button animation
      Animated.sequence([
        Animated.timing(animatedScale, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(animatedScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      const recordingOptions = {
        android: {
          extension: ".m4a",
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: ".m4a",
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: "audio/webm",
          bitsPerSecond: 128000,
        },
      };

      const { recording: newRecording } =
        await Audio.Recording.createAsync(recordingOptions);

      setRecording(newRecording);
      setIsRecording(true);
      setDuration(0);

      onRecordingStart?.();
    } catch (error) {
      console.error("Failed to start recording:", error);
      Alert.alert(
        "Recording Error",
        "Unable to start voice recording. Please try again.",
        [{ text: "OK" }],
      );
    }
  };

  const handleStopRecording = async () => {
    if (!recording || !isRecording) return;

    try {
      setIsProcessing(true);

      // Haptic feedback
      if (Platform.OS === "ios") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      if (uri) {
        // Get file info
        const fileInfo = await FileSystem.getInfoAsync(uri);

        const recordingData = {
          uri,
          duration,
          size: fileInfo.size,
          sessionId,
          timestamp: new Date().toISOString(),
          format: Platform.select({
            ios: "m4a",
            android: "m4a",
            web: "webm",
          }),
        };

        onRecordingComplete?.(recordingData);
        onRecordingStop?.(recordingData);
      }

      setRecording(null);
      setIsRecording(false);
      setDuration(0);
    } catch (error) {
      console.error("Failed to stop recording:", error);
      Alert.alert(
        "Recording Error",
        "Unable to save voice recording. Please try again.",
        [{ text: "OK" }],
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelRecording = async () => {
    if (!recording || !isRecording) return;

    try {
      setIsProcessing(true);

      await recording.stopAndUnloadAsync();

      setRecording(null);
      setIsRecording(false);
      setDuration(0);

      onRecordingCancel?.();

      // Haptic feedback
      if (Platform.OS === "ios") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    } catch (error) {
      console.error("Failed to cancel recording:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = (duration / maxDuration) * 100;
  const isNearLimit = duration > maxDuration * 0.8;

  return (
    <View
      style={[styles.container, style]}
      data-testid="therapy-session-recorder"
    >
      {/* Recording Status */}
      {isRecording && (
        <View style={styles.statusContainer} data-testid="recording-status">
          <LinearGradient
            colors={[
              theme.colors.therapeutic.calming[50],
              theme.colors.therapeutic.peaceful[50],
            ]}
            style={styles.statusGradient}
          >
            <View style={styles.statusContent}>
              <View style={styles.recordingIndicator}>
                <Animated.View
                  style={[
                    styles.recordingDot,
                    {
                      backgroundColor: isNearLimit
                        ? theme.colors.warning[500]
                        : theme.colors.error[500],
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.recordingText,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  Recording...
                </Text>
              </View>

              <Text
                style={[
                  styles.durationText,
                  {
                    color: isNearLimit
                      ? theme.colors.warning[600]
                      : theme.colors.text.primary,
                  },
                ]}
                data-testid="recording-timer"
              >
                {formatDuration(duration)} / {formatDuration(maxDuration)}
              </Text>

              {/* Progress Bar */}
              <View
                style={[
                  styles.progressBar,
                  { backgroundColor: theme.colors.gray[200] },
                ]}
              >
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(progressPercentage, 100)}%`,
                      backgroundColor: isNearLimit
                        ? theme.colors.warning[500]
                        : theme.colors.therapeutic.calming[500],
                    },
                  ]}
                />
              </View>

              {/* Cancel Button */}
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  { backgroundColor: theme.colors.error[100] },
                ]}
                onPress={handleCancelRecording}
                disabled={isProcessing}
                accessibilityLabel="Cancel recording"
                accessibilityRole="button"
                data-testid="cancel-recording-button"
              >
                <MentalHealthIcon
                  name="Heart"
                  size={16}
                  color={theme.colors.error[600]}
                  variant="outline"
                />
                <Text
                  style={[
                    styles.cancelText,
                    { color: theme.colors.error[600] },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      )}

      {/* Main Recording Button */}
      <Animated.View style={{ transform: [{ scale: animatedScale }] }}>
        <TouchableOpacity
          style={[
            styles.recordButton,
            {
              backgroundColor: isRecording
                ? theme.colors.error[500]
                : theme.colors.therapeutic.calming[500],
            },
            disabled && styles.disabled,
          ]}
          onPress={isRecording ? handleStopRecording : handleStartRecording}
          disabled={disabled || isProcessing}
          accessibilityLabel={
            isRecording
              ? "Stop therapy session recording"
              : "Start therapy session recording"
          }
          accessibilityRole="button"
          accessibilityState={{
            disabled: disabled || isProcessing,
            selected: isRecording,
          }}
          accessibilityHint={
            isRecording
              ? "Double tap to stop and save your voice recording"
              : "Double tap to start recording your voice for the therapy session"
          }
          data-testid="record-button"
        >
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <MentalHealthIcon
              name={isRecording ? "Heart" : "Mindfulness"}
              size={32}
              color={theme.colors.text.inverse}
              variant={isRecording ? "filled" : "outline"}
            />
          </Animated.View>

          {isProcessing && (
            <View style={styles.processingOverlay}>
              <MentalHealthIcon
                name="Brain"
                size={24}
                color={theme.colors.text.inverse}
                variant="filled"
              />
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* Helper Text */}
      {!isRecording && !isProcessing && (
        <Text
          style={[styles.helperText, { color: theme.colors.text.tertiary }]}
        >
          Tap to share your thoughts through voice
        </Text>
      )}

      {isProcessing && (
        <Text
          style={[styles.helperText, { color: theme.colors.text.secondary }]}
        >
          Processing your recording...
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  statusContainer: {
    width: "100%",
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
  },
  statusGradient: {
    padding: 16,
  },
  statusContent: {
    alignItems: "center",
    gap: 12,
  },
  recordingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  recordingText: {
    fontSize: 14,
    fontWeight: "500",
  },
  durationText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  progressBar: {
    width: "100%",
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    minHeight: 44,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "500",
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    position: "relative",
  },
  processingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  helperText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
    fontWeight: "400",
  },
  disabled: {
    opacity: 0.6,
  },
});

export default TherapySessionRecorder;
