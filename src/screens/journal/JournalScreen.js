import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";

import { MentalHealthIcon, NavigationIcon } from "../../components/icons";
import { useTheme } from "../../shared/theme/ThemeContext";

const JournalScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState("write");
  const [journalText, setJournalText] = useState("");
  const [mood, setMood] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [entries, setEntries] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const journalPrompts = [
    {
      id: "gratitude",
      title: "Gratitude Practice",
      prompt: "What are three things you're grateful for today?",
      icon: "Heart",
      color: theme.colors.therapeutic.nurturing[500],
    },
    {
      id: "reflection",
      title: "Daily Reflection",
      prompt:
        "How did today make you feel, and what did you learn about yourself?",
      icon: "Brain",
      color: theme.colors.therapeutic.calming[500],
    },
    {
      id: "challenges",
      title: "Overcoming Challenges",
      prompt: "What challenge did you face today, and how did you handle it?",
      icon: "Therapy",
      color: theme.colors.therapeutic.peaceful[500],
    },
    {
      id: "future",
      title: "Future Focus",
      prompt:
        "What are you looking forward to, and what steps will you take to get there?",
      icon: "Mindfulness",
      color: theme.colors.therapeutic.grounding[500],
    },
    {
      id: "emotions",
      title: "Emotional Check-in",
      prompt: "What emotions did you experience today? What triggered them?",
      icon: "Journal",
      color: theme.colors.therapeutic.energizing[500],
    },
  ];

  const moods = [
    {
      emoji: "😊",
      label: "Happy",
      value: "happy",
      color: theme.colors.therapeutic.nurturing[400],
    },
    {
      emoji: "😌",
      label: "Calm",
      value: "calm",
      color: theme.colors.therapeutic.peaceful[400],
    },
    {
      emoji: "😐",
      label: "Neutral",
      value: "neutral",
      color: theme.colors.gray[400],
    },
    {
      emoji: "😔",
      label: "Sad",
      value: "sad",
      color: theme.colors.therapeutic.calming[400],
    },
    {
      emoji: "😰",
      label: "Anxious",
      value: "anxious",
      color: theme.colors.warning[400],
    },
    {
      emoji: "😤",
      label: "Frustrated",
      value: "frustrated",
      color: theme.colors.error[400],
    },
  ];

  const mockEntries = [
    {
      id: "1",
      date: new Date(Date.now() - 86400000),
      mood: "happy",
      prompt: "Daily Reflection",
      content:
        "Today was a good day. I managed to complete all my tasks and felt productive. The morning walk really helped set a positive tone.",
      tags: ["productive", "exercise", "positive"],
    },
    {
      id: "2",
      date: new Date(Date.now() - 172800000),
      mood: "calm",
      prompt: "Gratitude Practice",
      content:
        "I'm grateful for my family's support, the beautiful weather, and having a job I enjoy. Sometimes it's the simple things that matter most.",
      tags: ["gratitude", "family", "nature"],
    },
  ];

  useEffect(() => {
    setEntries(mockEntries);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSaveEntry = () => {
    if (!journalText.trim()) {
      Alert.alert(
        "Entry Required",
        "Please write something before saving your journal entry.",
      );
      return;
    }

    const newEntry = {
      id: Date.now().toString(),
      date: new Date(),
      mood,
      prompt: selectedPrompt?.title || "Free Writing",
      content: journalText,
      tags: [],
    };

    setEntries((prev) => [newEntry, ...prev]);
    setJournalText("");
    setMood(null);
    setSelectedPrompt(null);

    Alert.alert(
      "Entry Saved!",
      "Your journal entry has been saved successfully.",
      [{ text: "OK" }],
    );
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getMoodEmoji = (moodValue) => {
    const moodObj = moods.find((m) => m.value === moodValue);
    return moodObj ? moodObj.emoji : "😐";
  };

  const renderWriteTab = () => (
    <KeyboardAvoidingView
      style={styles.writeContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.writeContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Prompt Selection */}
        <View style={styles.promptSection}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            Choose a prompt (optional)
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.promptsScroll}
          >
            {journalPrompts.map((prompt) => (
              <TouchableOpacity
                key={prompt.id}
                style={[
                  styles.promptCard,
                  {
                    backgroundColor:
                      selectedPrompt?.id === prompt.id
                        ? prompt.color
                        : theme.colors.background.secondary,
                  },
                ]}
                onPress={() => setSelectedPrompt(prompt)}
              >
                <MentalHealthIcon
                  name={prompt.icon}
                  size={20}
                  color={
                    selectedPrompt?.id === prompt.id
                      ? theme.colors.text.inverse
                      : prompt.color
                  }
                  variant="filled"
                />
                <Text
                  style={[
                    styles.promptTitle,
                    {
                      color:
                        selectedPrompt?.id === prompt.id
                          ? theme.colors.text.inverse
                          : theme.colors.text.primary,
                    },
                  ]}
                >
                  {prompt.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {selectedPrompt && (
            <View
              style={[
                styles.selectedPrompt,
                { backgroundColor: `${selectedPrompt.color}20` },
              ]}
            >
              <Text
                style={[styles.promptQuestion, { color: selectedPrompt.color }]}
              >
                {selectedPrompt.prompt}
              </Text>
            </View>
          )}
        </View>

        {/* Mood Selection */}
        <View style={styles.moodSection}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            How are you feeling?
          </Text>
          <View style={styles.moodsContainer}>
            {moods.map((moodOption) => (
              <TouchableOpacity
                key={moodOption.value}
                style={[
                  styles.moodButton,
                  {
                    backgroundColor:
                      mood === moodOption.value
                        ? moodOption.color
                        : theme.colors.background.secondary,
                  },
                ]}
                onPress={() => setMood(moodOption.value)}
              >
                <Text style={styles.moodEmoji}>{moodOption.emoji}</Text>
                <Text
                  style={[
                    styles.moodLabel,
                    {
                      color:
                        mood === moodOption.value
                          ? theme.colors.text.inverse
                          : theme.colors.text.secondary,
                    },
                  ]}
                >
                  {moodOption.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Journal Text Input */}
        <View style={styles.textInputSection}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            Your thoughts
          </Text>
          <TextInput
            style={[
              styles.journalInput,
              {
                backgroundColor: theme.colors.background.secondary,
                borderColor: theme.colors.gray[300],
                color: theme.colors.text.primary,
              },
            ]}
            placeholder={selectedPrompt?.prompt || "What's on your mind today?"}
            placeholderTextColor={theme.colors.text.tertiary}
            value={journalText}
            onChangeText={setJournalText}
            multiline
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            {
              backgroundColor: journalText.trim()
                ? theme.colors.therapeutic.calming[500]
                : theme.colors.gray[300],
            },
          ]}
          onPress={handleSaveEntry}
          disabled={!journalText.trim()}
        >
          <MentalHealthIcon
            name="Journal"
            size={20}
            color={theme.colors.text.inverse}
            variant="filled"
          />
          <Text
            style={[
              styles.saveButtonText,
              { color: theme.colors.text.inverse },
            ]}
          >
            Save Entry
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );

  const renderEntriesTab = () => (
    <ScrollView
      style={styles.entriesContainer}
      showsVerticalScrollIndicator={false}
    >
      {entries.length === 0 ? (
        <View style={styles.emptyState}>
          <MentalHealthIcon
            name="Journal"
            size={64}
            color={theme.colors.gray[400]}
            variant="outline"
          />
          <Text
            style={[
              styles.emptyStateTitle,
              { color: theme.colors.text.primary },
            ]}
          >
            No entries yet
          </Text>
          <Text
            style={[
              styles.emptyStateText,
              { color: theme.colors.text.secondary },
            ]}
          >
            Start writing your first journal entry to track your mental health
            journey.
          </Text>
          <TouchableOpacity
            style={[
              styles.startWritingButton,
              { backgroundColor: theme.colors.therapeutic.calming[500] },
            ]}
            onPress={() => setSelectedTab("write")}
          >
            <Text
              style={[
                styles.startWritingText,
                { color: theme.colors.text.inverse },
              ]}
            >
              Start Writing
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.entriesList}>
          {entries.map((entry) => (
            <JournalEntryCard
              key={entry.id}
              entry={entry}
              theme={theme}
              onPress={() => navigation.navigate("JournalEntry", { entry })}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[
          theme.colors.therapeutic.calming[50],
          theme.colors.therapeutic.peaceful[50],
          theme.colors.therapeutic.nurturing[50],
        ]}
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
            Mental Health Journal
          </Text>

          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => {
              /* Show journal tips */
            }}
          >
            <NavigationIcon
              name="Home"
              size={24}
              color={theme.colors.text.primary}
              variant="outline"
            />
          </TouchableOpacity>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabSelector}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              {
                backgroundColor:
                  selectedTab === "write"
                    ? theme.colors.therapeutic.calming[500]
                    : theme.colors.background.secondary,
              },
            ]}
            onPress={() => setSelectedTab("write")}
          >
            <Text
              style={[
                styles.tabButtonText,
                {
                  color:
                    selectedTab === "write"
                      ? theme.colors.text.inverse
                      : theme.colors.text.primary,
                },
              ]}
            >
              Write
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              {
                backgroundColor:
                  selectedTab === "entries"
                    ? theme.colors.therapeutic.calming[500]
                    : theme.colors.background.secondary,
              },
            ]}
            onPress={() => setSelectedTab("entries")}
          >
            <Text
              style={[
                styles.tabButtonText,
                {
                  color:
                    selectedTab === "entries"
                      ? theme.colors.text.inverse
                      : theme.colors.text.primary,
                },
              ]}
            >
              My Entries ({entries.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {selectedTab === "write" ? renderWriteTab() : renderEntriesTab()}
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const JournalEntryCard = ({ entry, theme, onPress }) => (
  <TouchableOpacity
    style={[
      styles.entryCard,
      { backgroundColor: theme.colors.background.primary },
    ]}
    onPress={onPress}
  >
    <View style={styles.entryHeader}>
      <View style={styles.entryDateMood}>
        <Text style={[styles.entryDate, { color: theme.colors.text.primary }]}>
          {formatDate(entry.date)}
        </Text>
        <Text style={styles.entryMood}>{getMoodEmoji(entry.mood)}</Text>
      </View>
      <Text
        style={[styles.entryPrompt, { color: theme.colors.text.secondary }]}
      >
        {entry.prompt}
      </Text>
    </View>

    <Text
      style={[styles.entryPreview, { color: theme.colors.text.secondary }]}
      numberOfLines={3}
    >
      {entry.content}
    </Text>

    {entry.tags && entry.tags.length > 0 && (
      <View style={styles.entryTags}>
        {entry.tags.slice(0, 3).map((tag, index) => (
          <View
            key={index}
            style={[
              styles.entryTag,
              { backgroundColor: theme.colors.therapeutic.calming[100] },
            ]}
          >
            <Text
              style={[
                styles.entryTagText,
                { color: theme.colors.therapeutic.calming[700] },
              ]}
            >
              {tag}
            </Text>
          </View>
        ))}
      </View>
    )}
  </TouchableOpacity>
);

const formatDate = (date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const getMoodEmoji = (moodValue) => {
  const moods = [
    { value: "happy", emoji: "😊" },
    { value: "calm", emoji: "😌" },
    { value: "neutral", emoji: "😐" },
    { value: "sad", emoji: "😔" },
    { value: "anxious", emoji: "😰" },
    { value: "frustrated", emoji: "😤" },
  ];
  const moodObj = moods.find((m) => m.value === moodValue);
  return moodObj ? moodObj.emoji : "😐";
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
  },
  helpButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  tabSelector: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  writeContainer: {
    flex: 1,
  },
  writeContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  promptSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  promptsScroll: {
    marginBottom: 12,
  },
  promptCard: {
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: "center",
    minWidth: 120,
  },
  promptTitle: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 8,
  },
  selectedPrompt: {
    borderRadius: 12,
    padding: 16,
  },
  promptQuestion: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  moodSection: {
    marginBottom: 24,
  },
  moodsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  moodButton: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
  },
  moodEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  textInputSection: {
    marginBottom: 20,
  },
  journalInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    height: 200,
    lineHeight: 24,
  },
  saveButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  entriesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  startWritingButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startWritingText: {
    fontSize: 14,
    fontWeight: "600",
  },
  entriesList: {
    paddingBottom: 20,
  },
  entryCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  entryDateMood: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  entryDate: {
    fontSize: 14,
    fontWeight: "600",
  },
  entryMood: {
    fontSize: 16,
  },
  entryPrompt: {
    fontSize: 12,
    fontWeight: "500",
  },
  entryPreview: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  entryTags: {
    flexDirection: "row",
    gap: 6,
  },
  entryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  entryTagText: {
    fontSize: 10,
    fontWeight: "500",
  },
});

export default JournalScreen;
