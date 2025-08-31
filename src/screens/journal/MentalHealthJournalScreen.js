import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  SafeAreaView,
  Modal,
  Alert,
} from "react-native";

import { MentalHealthIcon, NavigationIcon } from "../../components/icons";
import { FreudLogo, ThemedFreudIcon } from "../../components/icons/FreudIcons";
import FreudButton from "../../components/ui/FreudButton";
import { useTheme } from "../../shared/theme/ThemeContext";
import { freudTheme } from "../../shared/theme/freudTheme";

const { width, height } = Dimensions.get("window");

const MentalHealthJournalScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const [currentView, setCurrentView] = useState("overview"); // overview, new-entry, history
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [journalText, setJournalText] = useState("");
  const [selectedMood, setSelectedMood] = useState(null);
  const [entryType, setEntryType] = useState("text"); // text, voice, guided
  const [isRecording, setIsRecording] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Mock data - in real app this would come from API/state
  const journalData = {
    stats: {
      totalEntries: 34,
      thisMonth: 8,
      streak: 5,
      averageWordsPerEntry: 127,
      mostActiveDay: "Sunday",
      totalWords: 4318,
    },
    recentEntries: [
      {
        id: 1,
        title: "Feeling grateful today",
        content:
          "Today was a wonderful day. I felt grateful for the small moments...",
        mood: "Happy",
        moodEmoji: "😊",
        date: new Date("2024-01-20"),
        wordCount: 156,
        type: "text",
      },
      {
        id: 2,
        title: "Anxiety about tomorrow",
        content:
          "I'm feeling anxious about the presentation tomorrow. Need to practice more...",
        mood: "Anxious",
        moodEmoji: "😰",
        date: new Date("2024-01-19"),
        wordCount: 89,
        type: "text",
      },
      {
        id: 3,
        title: "Voice entry - Reflection",
        content:
          "Voice recording about daily reflection and mindfulness practice.",
        mood: "Calm",
        moodEmoji: "😌",
        date: new Date("2024-01-18"),
        duration: "2:34",
        type: "voice",
      },
      {
        id: 4,
        title: "Challenging day",
        content:
          "Today was difficult. I struggled with motivation and felt overwhelmed...",
        mood: "Sad",
        moodEmoji: "😢",
        date: new Date("2024-01-17"),
        wordCount: 203,
        type: "text",
      },
    ],
    prompts: [
      "What am I grateful for today?",
      "How did I handle stress today?",
      "What made me feel happy today?",
      "What challenged me today and how did I overcome it?",
      "What did I learn about myself today?",
      "How can I be kinder to myself tomorrow?",
    ],
  };

  const moods = [
    { id: "happy", name: "Happy", emoji: "😊", color: "#FFE066" },
    { id: "sad", name: "Sad", emoji: "😢", color: "#87CEEB" },
    { id: "anxious", name: "Anxious", emoji: "😰", color: "#DDA0DD" },
    { id: "calm", name: "Calm", emoji: "😌", color: "#98FB98" },
    { id: "angry", name: "Angry", emoji: "😠", color: "#FFA07A" },
    { id: "excited", name: "Excited", emoji: "🤩", color: "#FFB6C1" },
    { id: "neutral", name: "Neutral", emoji: "😐", color: "#D3D3D3" },
  ];

  const entryTypes = [
    {
      id: "text",
      title: "Text Entry",
      description: "Write your thoughts and feelings",
      icon: "Journal",
      color: freudTheme.colors.green[60],
    },
    {
      id: "voice",
      title: "Voice Entry",
      description: "Record your thoughts with voice",
      icon: "Heart",
      color: freudTheme.colors.brown[60],
    },
    {
      id: "guided",
      title: "Guided Journal",
      description: "Follow prompts for structured reflection",
      icon: "Brain",
      color: freudTheme.colors.orange[60],
    },
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSaveEntry = () => {
    if (!journalText.trim() && entryType === "text") {
      Alert.alert("Empty Entry", "Please write something before saving.");
      return;
    }

    // Save journal entry logic here
    Alert.alert("Success", "Journal entry saved successfully!", [
      { text: "OK", onPress: () => setShowNewEntry(false) },
    ]);

    // Reset form
    setJournalText("");
    setSelectedMood(null);
    setEntryType("text");
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    // Voice recording logic would go here
    setTimeout(() => {
      setIsRecording(false);
      Alert.alert("Recording Complete", "Voice entry recorded successfully!");
    }, 3000);
  };

  const renderOverview = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Journal Statistics */}
        <View
          style={[
            styles.statsCard,
            { backgroundColor: theme.colors.background.primary },
          ]}
        >
          <Text
            style={[styles.cardTitle, { color: theme.colors.text.primary }]}
          >
            Journal Statistics
          </Text>

          <View style={styles.mainStatContainer}>
            <LinearGradient
              colors={[
                freudTheme.colors.brown[60],
                freudTheme.colors.brown[50],
              ]}
              style={styles.mainStatGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text
                style={[
                  styles.mainStatNumber,
                  { color: theme.colors.text.inverse },
                ]}
              >
                {journalData.stats.totalEntries}
              </Text>
              <Text
                style={[
                  styles.mainStatLabel,
                  { color: theme.colors.text.inverse },
                ]}
              >
                Journals this year
              </Text>
            </LinearGradient>
          </View>

          <View style={styles.statsGrid}>
            <StatItem
              title="This Month"
              value={journalData.stats.thisMonth}
              color={freudTheme.colors.green[60]}
              theme={theme}
            />
            <StatItem
              title="Current Streak"
              value={`${journalData.stats.streak} days`}
              color={freudTheme.colors.orange[60]}
              theme={theme}
            />
            <StatItem
              title="Avg Words"
              value={journalData.stats.averageWordsPerEntry}
              color={freudTheme.colors.purple[60]}
              theme={theme}
            />
            <StatItem
              title="Total Words"
              value={journalData.stats.totalWords.toLocaleString()}
              color={freudTheme.colors.yellow[60]}
              theme={theme}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View
          style={[
            styles.quickActionsCard,
            { backgroundColor: theme.colors.background.primary },
          ]}
        >
          <Text
            style={[styles.cardTitle, { color: theme.colors.text.primary }]}
          >
            New Journal Entry
          </Text>

          <View style={styles.entryTypesGrid}>
            {entryTypes.map((type, index) => (
              <EntryTypeCard
                key={type.id}
                type={type}
                theme={theme}
                onPress={() => {
                  setEntryType(type.id);
                  setShowNewEntry(true);
                }}
                delay={index * 100}
              />
            ))}
          </View>
        </View>

        {/* Recent Entries */}
        <View
          style={[
            styles.recentEntriesCard,
            { backgroundColor: theme.colors.background.primary },
          ]}
        >
          <View style={styles.recentEntriesHeader}>
            <Text
              style={[styles.cardTitle, { color: theme.colors.text.primary }]}
            >
              Recent Entries
            </Text>
            <TouchableOpacity onPress={() => setCurrentView("history")}>
              <Text
                style={[
                  styles.seeAllText,
                  { color: theme.colors.primary[500] },
                ]}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {journalData.recentEntries.slice(0, 3).map((entry, index) => (
            <RecentEntryCard
              key={entry.id}
              entry={entry}
              theme={theme}
              delay={index * 100}
            />
          ))}
        </View>

        {/* Journal Prompts */}
        <View
          style={[
            styles.promptsCard,
            { backgroundColor: theme.colors.background.primary },
          ]}
        >
          <Text
            style={[styles.cardTitle, { color: theme.colors.text.primary }]}
          >
            Writing Prompts
          </Text>
          <Text
            style={[
              styles.promptsSubtitle,
              { color: theme.colors.text.secondary },
            ]}
          >
            Need inspiration? Try one of these prompts
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.promptsScroll}
          >
            {journalData.prompts.map((prompt, index) => (
              <PromptCard
                key={index}
                prompt={prompt}
                theme={theme}
                onPress={() => {
                  setJournalText(prompt + "\n\n");
                  setEntryType("text");
                  setShowNewEntry(true);
                }}
                delay={index * 50}
              />
            ))}
          </ScrollView>
        </View>
      </Animated.View>
    </ScrollView>
  );

  const renderHistory = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.historyContainer}>
        <Text style={[styles.pageTitle, { color: theme.colors.text.primary }]}>
          Journal History
        </Text>

        {journalData.recentEntries.map((entry, index) => (
          <HistoryEntryCard
            key={entry.id}
            entry={entry}
            theme={theme}
            delay={index * 100}
          />
        ))}
      </View>
    </ScrollView>
  );

  const renderNewEntryModal = () => (
    <Modal
      visible={showNewEntry}
      transparent
      animationType="slide"
      onRequestClose={() => setShowNewEntry(false)}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme.colors.background.primary },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text
              style={[styles.modalTitle, { color: theme.colors.text.primary }]}
            >
              {entryType === "text"
                ? "New Text Entry"
                : entryType === "voice"
                  ? "New Voice Entry"
                  : "Guided Journal"}
            </Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowNewEntry(false)}
            >
              <ThemedFreudIcon
                name="close"
                size={24}
                color={freudTheme.colors.text.primary}
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.entryContent}>
            {/* Mood Selection */}
            <View style={styles.moodSection}>
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
                style={styles.moodScroll}
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

            {/* Entry Content */}
            {entryType === "text" && (
              <View style={styles.textEntrySection}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  What's on your mind?
                </Text>
                <TextInput
                  style={[
                    styles.journalTextInput,
                    {
                      backgroundColor: theme.colors.background.secondary,
                      color: theme.colors.text.primary,
                      borderColor: theme.colors.border.primary,
                    },
                  ]}
                  placeholder="Start writing your thoughts..."
                  placeholderTextColor={theme.colors.text.placeholder}
                  value={journalText}
                  onChangeText={setJournalText}
                  multiline
                  numberOfLines={10}
                  textAlignVertical="top"
                />
                <Text
                  style={[
                    styles.wordCount,
                    { color: theme.colors.text.tertiary },
                  ]}
                >
                  {
                    journalText.split(" ").filter((word) => word.length > 0)
                      .length
                  }{" "}
                  words
                </Text>
              </View>
            )}

            {entryType === "voice" && (
              <View style={styles.voiceEntrySection}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Record your thoughts
                </Text>
                <View style={styles.voiceRecordingContainer}>
                  <TouchableOpacity
                    style={[
                      styles.recordButton,
                      {
                        backgroundColor: isRecording
                          ? theme.colors.error[500]
                          : theme.colors.primary[500],
                      },
                    ]}
                    onPress={startVoiceRecording}
                    disabled={isRecording}
                  >
                    <ThemedFreudIcon
                      name="therapy"
                      size={32}
                      color={freudTheme.colors.text.inverse}
                    />
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.recordingText,
                      { color: theme.colors.text.secondary },
                    ]}
                  >
                    {isRecording ? "Recording..." : "Tap to start recording"}
                  </Text>
                </View>
              </View>
            )}

            {entryType === "guided" && (
              <View style={styles.guidedEntrySection}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Guided Reflection
                </Text>
                <View
                  style={[
                    styles.promptContainer,
                    { backgroundColor: theme.colors.therapeutic.calming[100] },
                  ]}
                >
                  <Text
                    style={[
                      styles.currentPrompt,
                      { color: theme.colors.therapeutic.calming[700] },
                    ]}
                  >
                    {journalData.prompts[0]}
                  </Text>
                </View>
                <TextInput
                  style={[
                    styles.journalTextInput,
                    {
                      backgroundColor: theme.colors.background.secondary,
                      color: theme.colors.text.primary,
                      borderColor: theme.colors.border.primary,
                    },
                  ]}
                  placeholder="Reflect on this prompt..."
                  placeholderTextColor={theme.colors.text.placeholder}
                  value={journalText}
                  onChangeText={setJournalText}
                  multiline
                  numberOfLines={8}
                  textAlignVertical="top"
                />
              </View>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <FreudButton
              title="Save Entry"
              variant="primary"
              size="large"
              fullWidth
              onPress={handleSaveEntry}
              icon={
                <ThemedFreudIcon
                  name="heart"
                  size={20}
                  color={freudTheme.colors.text.inverse}
                />
              }
              iconPosition="right"
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  const backgroundColors = isDarkMode
    ? [
        theme.colors.dark.background.primary,
        theme.colors.dark.background.secondary,
      ]
    : [freudTheme.colors.brown[20], freudTheme.colors.brown[10]];

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
            onPress={() => {
              if (currentView !== "overview") {
                setCurrentView("overview");
              } else {
                navigation.goBack();
              }
            }}
          >
            <ThemedFreudIcon
              name="chevron-left"
              size={24}
              color={freudTheme.colors.text.primary}
            />
          </TouchableOpacity>

          <Text
            style={[styles.headerTitle, { color: theme.colors.text.primary }]}
          >
            {currentView === "overview"
              ? "Mental Health Journal"
              : "Journal History"}
          </Text>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowNewEntry(true)}
          >
            <ThemedFreudIcon
              name="journal"
              size={24}
              color={freudTheme.colors.text.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Content */}
        {currentView === "overview" && renderOverview()}
        {currentView === "history" && renderHistory()}

        {/* New Entry Modal */}
        {renderNewEntryModal()}
      </LinearGradient>
    </SafeAreaView>
  );
};

const StatItem = ({ title, value, color, theme }) => (
  <View style={styles.statItem}>
    <View style={[styles.statIndicator, { backgroundColor: color }]} />
    <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
      {value}
    </Text>
    <Text style={[styles.statTitle, { color: theme.colors.text.secondary }]}>
      {title}
    </Text>
  </View>
);

const EntryTypeCard = ({ type, theme, onPress, delay }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay,
      useNativeDriver: true,
    }).start();
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.entryTypeCard,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.entryTypeButton,
          { backgroundColor: theme.colors.background.secondary },
        ]}
        onPress={onPress}
      >
        <View style={[styles.entryTypeIcon, { backgroundColor: type.color }]}>
          <MentalHealthIcon
            name={type.icon}
            size={24}
            color={theme.colors.text.inverse}
            variant="filled"
          />
        </View>
        <Text
          style={[styles.entryTypeTitle, { color: theme.colors.text.primary }]}
        >
          {type.title}
        </Text>
        <Text
          style={[
            styles.entryTypeDescription,
            { color: theme.colors.text.secondary },
          ]}
        >
          {type.description}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const RecentEntryCard = ({ entry, theme, delay }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay,
      useNativeDriver: true,
    }).start();
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.recentEntryCard,
        {
          backgroundColor: theme.colors.background.secondary,
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={styles.entryHeader}>
        <Text style={styles.entryMood}>{entry.moodEmoji}</Text>
        <View style={styles.entryMeta}>
          <Text
            style={[styles.entryTitle, { color: theme.colors.text.primary }]}
          >
            {entry.title}
          </Text>
          <Text
            style={[styles.entryDate, { color: theme.colors.text.tertiary }]}
          >
            {entry.date.toLocaleDateString([], {
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>
        <View style={styles.entryStats}>
          {entry.type === "text" ? (
            <Text
              style={[
                styles.entryStat,
                { color: theme.colors.text.quaternary },
              ]}
            >
              {entry.wordCount} words
            </Text>
          ) : (
            <Text
              style={[
                styles.entryStat,
                { color: theme.colors.text.quaternary },
              ]}
            >
              {entry.duration}
            </Text>
          )}
        </View>
      </View>
      <Text
        style={[styles.entryPreview, { color: theme.colors.text.secondary }]}
        numberOfLines={2}
      >
        {entry.content}
      </Text>
    </Animated.View>
  );
};

const PromptCard = ({ prompt, theme, onPress, delay }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay,
      useNativeDriver: true,
    }).start();
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.promptCard,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.promptButton,
          { backgroundColor: theme.colors.background.secondary },
        ]}
        onPress={onPress}
      >
        <Text style={[styles.promptText, { color: theme.colors.text.primary }]}>
          {prompt}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const HistoryEntryCard = ({ entry, theme, delay }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay,
      useNativeDriver: true,
    }).start();
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.historyEntryCard,
        {
          backgroundColor: theme.colors.background.secondary,
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={styles.historyEntryHeader}>
        <Text style={styles.historyEntryMood}>{entry.moodEmoji}</Text>
        <View style={styles.historyEntryMeta}>
          <Text
            style={[
              styles.historyEntryTitle,
              { color: theme.colors.text.primary },
            ]}
          >
            {entry.title}
          </Text>
          <Text
            style={[
              styles.historyEntryDate,
              { color: theme.colors.text.secondary },
            ]}
          >
            {entry.date.toLocaleDateString([], {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
        <View style={styles.historyEntryType}>
          <MentalHealthIcon
            name={entry.type === "voice" ? "Heart" : "Journal"}
            size={16}
            color={theme.colors.text.quaternary}
            variant="outline"
          />
        </View>
      </View>
      <Text
        style={[
          styles.historyEntryContent,
          { color: theme.colors.text.secondary },
        ]}
        numberOfLines={3}
      >
        {entry.content}
      </Text>
      <View style={styles.historyEntryFooter}>
        {entry.type === "text" ? (
          <Text
            style={[
              styles.historyEntryStat,
              { color: theme.colors.text.quaternary },
            ]}
          >
            {entry.wordCount} words
          </Text>
        ) : (
          <Text
            style={[
              styles.historyEntryStat,
              { color: theme.colors.text.quaternary },
            ]}
          >
            {entry.duration}
          </Text>
        )}
      </View>
    </Animated.View>
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
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  animatedContainer: {
    paddingBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  statsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  mainStatContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  mainStatGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  mainStatNumber: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 4,
  },
  mainStatLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statItem: {
    width: (width - 80) / 2,
    alignItems: "center",
    marginBottom: 16,
  },
  statIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    textAlign: "center",
  },
  quickActionsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  entryTypesGrid: {
    gap: 12,
  },
  entryTypeCard: {
    marginBottom: 8,
  },
  entryTypeButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
  entryTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  entryTypeTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
    flex: 1,
  },
  entryTypeDescription: {
    fontSize: 12,
    flex: 1,
  },
  recentEntriesCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentEntriesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "500",
  },
  recentEntryCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  entryMood: {
    fontSize: 24,
    marginRight: 12,
  },
  entryMeta: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  entryDate: {
    fontSize: 11,
  },
  entryStats: {
    alignItems: "flex-end",
  },
  entryStat: {
    fontSize: 10,
  },
  entryPreview: {
    fontSize: 12,
    lineHeight: 16,
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
  promptsSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  promptsScroll: {
    marginHorizontal: -8,
  },
  promptCard: {
    marginHorizontal: 8,
  },
  promptButton: {
    width: 200,
    padding: 16,
    borderRadius: 12,
  },
  promptText: {
    fontSize: 14,
    lineHeight: 20,
  },
  historyContainer: {
    paddingVertical: 20,
  },
  historyEntryCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  historyEntryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  historyEntryMood: {
    fontSize: 32,
    marginRight: 12,
  },
  historyEntryMeta: {
    flex: 1,
  },
  historyEntryTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  historyEntryDate: {
    fontSize: 12,
  },
  historyEntryType: {
    alignItems: "center",
  },
  historyEntryContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  historyEntryFooter: {
    alignItems: "flex-end",
  },
  historyEntryStat: {
    fontSize: 11,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.9,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalCloseButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  entryContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  moodSection: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  moodScroll: {
    marginHorizontal: -8,
  },
  moodButton: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginHorizontal: 8,
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
  textEntrySection: {
    marginVertical: 20,
  },
  journalTextInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 200,
    marginBottom: 8,
  },
  wordCount: {
    fontSize: 12,
    textAlign: "right",
  },
  voiceEntrySection: {
    marginVertical: 20,
    alignItems: "center",
  },
  voiceRecordingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  recordingText: {
    fontSize: 14,
  },
  guidedEntrySection: {
    marginVertical: 20,
  },
  promptContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  currentPrompt: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default MentalHealthJournalScreen;
