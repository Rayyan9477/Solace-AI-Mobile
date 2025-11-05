/**
 * Voice Search Screen - Speech-to-Text Search
 * Based on ui-designs/Dark-mode/🔒 Search Screen.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
} from "react-native";

export const VoiceSearchScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const pulseAnim = new Animated.Value(1);

  const startListening = () => {
    setIsListening(true);
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
  };

  const stopListening = () => {
    setIsListening(false);
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  const handleCancel = () => {
    stopListening();
    navigation.goBack();
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
      borderBottomColor: theme.colors.gray["20"],
    },
    cancelButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    cancelText: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.red["60"],
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 40,
    },
    microphoneContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.colors.purple["20"],
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 32,
    },
    microphoneIcon: {
      fontSize: 64,
    },
    statusText: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 8,
      textAlign: "center",
    },
    instructionText: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.text.secondary,
      textAlign: "center",
      marginBottom: 32,
    },
    transcriptContainer: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 20,
      width: "100%",
      minHeight: 80,
      marginBottom: 32,
    },
    transcriptText: {
      fontSize: 16,
      lineHeight: 24,
      color: theme.colors.text.primary,
      textAlign: "center",
    },
    transcriptPlaceholder: {
      fontSize: 14,
      color: theme.colors.text.tertiary,
      fontStyle: "italic",
      textAlign: "center",
    },
    buttonContainer: {
      width: "100%",
      gap: 12,
    },
    primaryButton: {
      backgroundColor: theme.colors.purple["60"],
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: "center",
    },
    primaryButtonActive: {
      backgroundColor: theme.colors.red["60"],
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    secondaryButton: {
      backgroundColor: theme.colors.brown["20"],
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: "center",
    },
    secondaryButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    tipsCard: {
      position: "absolute",
      bottom: 40,
      left: 20,
      right: 20,
      backgroundColor: theme.colors.blue["20"],
      borderRadius: 12,
      padding: 16,
    },
    tipsTitle: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    tipsList: {
      gap: 4,
    },
    tipText: {
      fontSize: 12,
      lineHeight: 18,
      color: theme.colors.text.secondary,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
          accessible
          accessibilityLabel="Cancel voice search"
          accessibilityRole="button"
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Voice Search</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.microphoneContainer,
            isListening && { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <Text style={styles.microphoneIcon}>🎤</Text>
        </Animated.View>

        <Text style={styles.statusText}>
          {isListening ? "Listening..." : "Tap to speak"}
        </Text>
        <Text style={styles.instructionText}>
          {isListening
            ? "Speak clearly and we'll search for you"
            : "Say what you want to search for"}
        </Text>

        {transcript ? (
          <View style={styles.transcriptContainer}>
            <Text style={styles.transcriptText}>{transcript}</Text>
          </View>
        ) : (
          <View style={styles.transcriptContainer}>
            <Text style={styles.transcriptPlaceholder}>
              Your words will appear here...
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              isListening && styles.primaryButtonActive,
            ]}
            onPress={isListening ? stopListening : startListening}
            accessible
            accessibilityLabel={
              isListening ? "Stop listening" : "Start listening"
            }
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>
              {isListening ? "Stop Listening" : "Start Listening"}
            </Text>
          </TouchableOpacity>

          {transcript && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() =>
                navigation.navigate("Search", { query: transcript })
              }
              accessible
              accessibilityLabel="Search with transcript"
              accessibilityRole="button"
            >
              <Text style={styles.secondaryButtonText}>Search</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {!isListening && (
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Tips for better results:</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tipText}>• Speak clearly and naturally</Text>
            <Text style={styles.tipText}>• Minimize background noise</Text>
            <Text style={styles.tipText}>• Use specific keywords</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default VoiceSearchScreen;
