/**
 * Voice Input Service
 * Handles speech-to-text and text-to-speech functionality
 * Using Expo Speech and Audio APIs
 */

import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import { logger } from "@shared/utils/logger";
import { Platform } from "react-native";

interface VoiceConfig {
  language?: string;
  pitch?: number;
  rate?: number;
  voice?: string;
}

interface SpeechOptions {
  language?: string;
  onStart?: () => void;
  onDone?: () => void;
  onStopped?: () => void;
  onError?: (error: any) => void;
}

class VoiceInputService {
  private isRecording: boolean = false;
  private recording: Audio.Recording | null = null;
  private isSpeaking: boolean = false;
  private defaultLanguage: string = "en-US";

  constructor() {
    this.initialize();
  }

  /**
   * Initialize audio permissions and settings
   */
  private async initialize() {
    try {
      // Request audio permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        logger.warn("Audio recording permission not granted");
      }

      // Configure audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
    } catch (error) {
      logger.error("Failed to initialize voice input service:", error);
    }
  }

  /**
   * Start recording audio for speech recognition
   * Note: This creates a recording that would need to be sent to a
   * speech recognition API (not included in Expo by default)
   */
  async startRecording(): Promise<boolean> {
    try {
      if (this.isRecording) {
        logger.warn("Recording already in progress");
        return false;
      }

      // Make sure audio is configured for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Create and start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      this.recording = recording;
      this.isRecording = true;

      logger.info("Voice recording started");
      return true;
    } catch (error) {
      logger.error("Failed to start recording:", error);
      this.isRecording = false;
      return false;
    }
  }

  /**
   * Stop recording and return the audio URI
   * In a production app, this URI would be sent to a speech-to-text API
   */
  async stopRecording(): Promise<{ uri: string | null; duration: number }> {
    try {
      if (!this.recording || !this.isRecording) {
        logger.warn("No active recording to stop");
        return { uri: null, duration: 0 };
      }

      // Stop and unload the recording
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      const status = await this.recording.getStatusAsync();

      this.recording = null;
      this.isRecording = false;

      logger.info("Voice recording stopped", {
        uri,
        duration: status.durationMillis,
      });

      return {
        uri: uri || null,
        duration: status.durationMillis || 0,
      };
    } catch (error) {
      logger.error("Failed to stop recording:", error);
      this.recording = null;
      this.isRecording = false;
      return { uri: null, duration: 0 };
    }
  }

  /**
   * Convert text to speech using Expo Speech API
   */
  async speakText(
    text: string,
    options?: SpeechOptions
  ): Promise<void> {
    try {
      if (this.isSpeaking) {
        await this.stopSpeaking();
      }

      const speechOptions: Speech.SpeechOptions = {
        language: options?.language || this.defaultLanguage,
        pitch: 1.0,
        rate: Platform.OS === "ios" ? 0.5 : 0.8, // iOS speaks faster by default
        onStart: () => {
          this.isSpeaking = true;
          options?.onStart?.();
        },
        onDone: () => {
          this.isSpeaking = false;
          options?.onDone?.();
        },
        onStopped: () => {
          this.isSpeaking = false;
          options?.onStopped?.();
        },
        onError: (error) => {
          this.isSpeaking = false;
          logger.error("Speech synthesis error:", error);
          options?.onError?.(error);
        },
      };

      await Speech.speak(text, speechOptions);
    } catch (error) {
      logger.error("Failed to speak text:", error);
      this.isSpeaking = false;
      throw error;
    }
  }

  /**
   * Stop text-to-speech
   */
  async stopSpeaking(): Promise<void> {
    try {
      if (this.isSpeaking) {
        await Speech.stop();
        this.isSpeaking = false;
      }
    } catch (error) {
      logger.error("Failed to stop speaking:", error);
      this.isSpeaking = false;
    }
  }

  /**
   * Check if currently recording
   */
  getIsRecording(): boolean {
    return this.isRecording;
  }

  /**
   * Check if currently speaking
   */
  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  /**
   * Set default language for speech
   */
  setDefaultLanguage(language: string) {
    this.defaultLanguage = language;
  }

  /**
   * Get available voices for text-to-speech
   */
  async getAvailableVoices(): Promise<Speech.Voice[]> {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      return voices;
    } catch (error) {
      logger.error("Failed to get available voices:", error);
      return [];
    }
  }

  /**
   * Simulate speech-to-text for demo purposes
   * In production, this would use a real speech recognition API
   */
  async simulateSpeechToText(duration: number): Promise<string> {
    // Demo responses based on recording duration
    const demoResponses = [
      "I'm feeling anxious about tomorrow",
      "I had a good day today",
      "Can you help me with stress management?",
      "I want to talk about my relationships",
      "I'm having trouble sleeping lately",
      "Work has been really overwhelming",
      "I feel better after our last conversation",
      "I need some coping strategies",
      "My mood has been up and down",
      "I'm grateful for this support",
    ];

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Return a random demo response
    const response =
      demoResponses[Math.floor(Math.random() * demoResponses.length)];

    logger.info("Simulated speech-to-text result:", response);
    return response;
  }

  /**
   * Clean up resources
   */
  async cleanup() {
    try {
      if (this.recording) {
        await this.stopRecording();
      }
      if (this.isSpeaking) {
        await this.stopSpeaking();
      }
    } catch (error) {
      logger.error("Error during voice service cleanup:", error);
    }
  }
}

// Export singleton instance
export const voiceInputService = new VoiceInputService();
export default voiceInputService;