import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
  TextInput,
  Modal,
  Alert,
} from "react-native";

import { MentalHealthIcon, NavigationIcon } from "../../components/icons";
import { useTheme } from "../../shared/theme/ThemeContext";

const { width } = Dimensions.get("window");

const NewJournalScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const [selectedMood, setSelectedMood] = useState(null);
  const [journalText, setJournalText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  // Mock moods matching the design
  const moods = [
    { id: "happy", emoji: "😊", name: "Happy", color: "#4CAF50" },
    { id: "sad", emoji: "😢", name: "Sad", color: "#FF5722" },
    { id: "anxious", emoji: "😰", name: "Anxious", color: "#FF9800" },
    { id: "calm", emoji: "😌", name: "Calm", color: "#2196F3" },
    { id: "excited", emoji: "🤩", name: "Excited", color: "#E91E63" },
    { id: "tired", emoji: "😴", name: "Tired", color: "#9C27B0" },
  ];

  const journalPrompts = [
    "How are you feeling today?",
    "What made you smile today?",
    "What are you grateful for?",
    "Describe your current emotions",
    "What's on your mind?",
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      // Pulse animation for recording
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start();

      // Wave animation
      Animated.loop(
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      clearInterval(interval);
      pulseAnim.stopAnimation();
      waveAnim.stopAnimation();
    }

    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setShowVoiceModal(true);
    setRecordingTime(0);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setShowVoiceModal(false);
  };

  const handleSaveJournal = () => {
    if (!selectedMood && !journalText.trim()) {
      Alert.alert(
        "Please add some content",
        "Select a mood or write some text before saving.",
      );
      return;
    }

    // Save logic here
    Alert.alert(
      "Journal Saved!",
      "Your journal entry has been saved successfully.",
      [
        {
          text: "View Journals",
          onPress: () => navigation.navigate("MyJournals"),
        },
        {
          text: "Add Another",
          onPress: () => {
            setJournalText("");
            setSelectedMood(null);
          },
        },
      ],
    );
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const backgroundColors = isDarkMode
    ? [
        theme.colors.dark.background.primary,
        theme.colors.dark.background.secondary,
      ]
    : [
        theme.colors.therapeutic.calming[50],
        theme.colors.therapeutic.peaceful[50],
      ];

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <LinearGradient
        colors={backgroundColors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <NavigationIcon
              name="Home"
              size={24}
              color={theme.colors.text.primary}
              variant="outline"
            />
          </TouchableOpacity>

          <Text
            style={[styles.headerTitle, { color: theme.colors.text.primary }]}
          >
            New Mental Health Journal
          </Text>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveJournal}
          >
            <Text
              style={[
                styles.saveButtonText,
                { color: theme.colors.primary[500] },
              ]}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View
            style={[styles.animatedContainer, { opacity: fadeAnim }]}
          >
            {/* Mood Selector */}
            <View
              style={[
                styles.moodCard,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                How are you feeling?
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.moodSelector}
              >
                {moods.map((mood) => (
                  <TouchableOpacity
                    key={mood.id}
                    style={[
                      styles.moodButton,
                      {
                        backgroundColor:
                          selectedMood?.id === mood.id
                            ? mood.color
                            : theme.colors.background.secondary,
                        borderColor: mood.color,
                        borderWidth: selectedMood?.id === mood.id ? 0 : 1,
                      },
                    ]}
                    onPress={() => setSelectedMood(mood)}
                  >
                    <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                    <Text
                      style={[
                        styles.moodName,
                        {
                          color:
                            selectedMood?.id === mood.id
                              ? theme.colors.text.inverse
                              : theme.colors.text.primary,
                        },
                      ]}
                    >
                      {mood.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Journal Input */}
            <View
              style={[
                styles.journalCard,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                What's on your mind?
              </Text>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.journalInput,
                    {
                      backgroundColor: theme.colors.background.secondary,
                      color: theme.colors.text.primary,
                      borderColor: theme.colors.border.primary,
                    },
                  ]}
                  placeholder="Say anything that's on your mind..."
                  placeholderTextColor={theme.colors.text.quaternary}
                  multiline
                  numberOfLines={8}
                  value={journalText}
                  onChangeText={setJournalText}
                  textAlignVertical="top"
                />

                <View style={styles.inputActions}>
                  <TouchableOpacity
                    style={[
                      styles.voiceButton,
                      { backgroundColor: theme.colors.error[400] },
                    ]}
                    onPress={handleStartRecording}
                  >
                    <MentalHealthIcon
                      name="Heart"
                      size={20}
                      color={theme.colors.text.inverse}
                      variant="filled"
                    />
                    <Text
                      style={[
                        styles.voiceButtonText,
                        { color: theme.colors.text.inverse },
                      ]}
                    >
                      Voice Record
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Journal Prompts */}
            <View
              style={[
                styles.promptsCard,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                Need inspiration?
              </Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {journalPrompts.map((prompt, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.promptButton,
                      { backgroundColor: theme.colors.background.secondary },
                    ]}
                    onPress={() => setJournalText(prompt + "\n\n")}
                  >
                    <Text
                      style={[
                        styles.promptText,
                        { color: theme.colors.text.primary },
                      ]}
                    >
                      {prompt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Preview Card */}
            {(selectedMood || journalText) && (
              <View
                style={[
                  styles.previewCard,
                  { backgroundColor: theme.colors.background.primary },
                ]}
              >
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Preview
                </Text>

                <View
                  style={[
                    styles.previewContent,
                    { backgroundColor: theme.colors.background.secondary },
                  ]}
                >
                  {selectedMood && (
                    <View style={styles.previewMood}>
                      <Text style={styles.previewMoodEmoji}>
                        {selectedMood.emoji}
                      </Text>
                      <Text
                        style={[
                          styles.previewMoodName,
                          { color: theme.colors.text.primary },
                        ]}
                      >
                        Feeling {selectedMood.name}
                      </Text>
                    </View>
                  )}

                  {journalText ? (
                    <Text
                      style={[
                        styles.previewText,
                        { color: theme.colors.text.secondary },
                      ]}
                    >
                      {journalText}
                    </Text>
                  ) : (
                    <Text
                      style={[
                        styles.previewPlaceholder,
                        { color: theme.colors.text.quaternary },
                      ]}
                    >
                      Your journal entry will appear here...
                    </Text>
                  )}

                  <Text
                    style={[
                      styles.previewDate,
                      { color: theme.colors.text.quaternary },
                    ]}
                  >
                    {new Date().toLocaleDateString()} •{" "}
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              </View>
            )}
          </Animated.View>
        </ScrollView>

        {/* Voice Recording Modal */}
        <Modal
          visible={showVoiceModal}
          transparent
          animationType="slide"
          onRequestClose={handleStopRecording}
        >
          <View style={styles.modalOverlay}>
            <LinearGradient
              colors={["#FF5722", "#FF7043"]}
              style={styles.voiceModal}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text
                style={[
                  styles.voiceModalTitle,
                  { color: theme.colors.text.inverse },
                ]}
              >
                Recording Voice Memo
              </Text>

              <Animated.View
                style={[
                  styles.recordingIndicator,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              >
                <View style={styles.recordingDot} />
              </Animated.View>

              <Text
                style={[
                  styles.recordingTime,
                  { color: theme.colors.text.inverse },
                ]}
              >
                {formatTime(recordingTime)}
              </Text>

              {/* Audio Waves Animation */}
              <View style={styles.audioWaves}>
                {Array.from({ length: 5 }, (_, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.audioWave,
                      {
                        opacity: waveAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.3, 1],
                        }),
                        transform: [
                          {
                            scaleY: waveAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.5, 1 + Math.random() * 0.5],
                            }),
                          },
                        ],
                      },
                    ]}
                  />
                ))}
              </View>

              <Text
                style={[
                  styles.recordingHint,
                  { color: theme.colors.text.inverse },
                ]}
              >
                Say anything that's on your mind!
              </Text>

              <View style={styles.voiceActions}>
                <TouchableOpacity
                  style={[styles.voiceActionButton, styles.cancelButton]}
                  onPress={handleStopRecording}
                >
                  <Text
                    style={[
                      styles.voiceActionText,
                      { color: theme.colors.text.inverse },
                    ]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.voiceActionButton, styles.saveVoiceButton]}
                  onPress={() => {
                    handleStopRecording();
                    setJournalText(
                      (prev) =>
                        prev +
                        "\n\n[Voice memo recorded - " +
                        formatTime(recordingTime) +
                        "]",
                    );
                  }}
                >
                  <Text
                    style={[
                      styles.voiceActionText,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    Save Voice
                  </Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </Modal>

        {/* Bottom Action */}
        <View
          style={[
            styles.bottomAction,
            { backgroundColor: theme.colors.background.primary },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.createButton,
              { backgroundColor: theme.colors.primary[500] },
            ]}
            onPress={handleSaveJournal}
          >
            <MentalHealthIcon
              name="Journal"
              size={20}
              color={theme.colors.text.inverse}
              variant="filled"
            />
            <Text
              style={[
                styles.createButtonText,
                { color: theme.colors.text.inverse },
              ]}
            >
              Create Journal
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  animatedContainer: {
    paddingBottom: 20,
  },
  moodCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  moodSelector: {
    marginHorizontal: -8,
  },
  moodButton: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    alignItems: "center",
    minWidth: 80,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodName: {
    fontSize: 12,
    fontWeight: "500",
  },
  journalCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    gap: 12,
  },
  journalInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    borderWidth: 1,
  },
  inputActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  voiceButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  voiceButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  promptsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  promptButton: {
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    maxWidth: 200,
  },
  promptText: {
    fontSize: 14,
    textAlign: "center",
  },
  previewCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewContent: {
    borderRadius: 12,
    padding: 16,
  },
  previewMood: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  previewMoodEmoji: {
    fontSize: 20,
  },
  previewMoodName: {
    fontSize: 16,
    fontWeight: "500",
  },
  previewText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  previewPlaceholder: {
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 12,
  },
  previewDate: {
    fontSize: 12,
    textAlign: "right",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  voiceModal: {
    width: width * 0.8,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
  },
  voiceModalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 30,
  },
  recordingIndicator: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  recordingDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  recordingTime: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  audioWaves: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 40,
    gap: 4,
    marginBottom: 20,
  },
  audioWave: {
    width: 4,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 2,
    minHeight: 10,
    flex: 1,
  },
  recordingHint: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    opacity: 0.8,
  },
  voiceActions: {
    flexDirection: "row",
    gap: 16,
  },
  voiceActionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    minWidth: 100,
  },
  cancelButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  saveVoiceButton: {
    backgroundColor: "#FFFFFF",
  },
  voiceActionText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  bottomAction: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default NewJournalScreen;
