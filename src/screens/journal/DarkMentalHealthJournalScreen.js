import React, { useState, useRef, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  Alert,
  Modal,
} from "react-native";

import { useTheme } from "../../shared/theme/ThemeContext";
import { freudDarkTheme } from "../../shared/theme/freudDarkTheme";

const { width, height } = Dimensions.get("window");

const DarkMentalHealthJournalScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  
  // State management
  const [currentView, setCurrentView] = useState("overview"); // overview, new, detail
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);
  const [newEntryText, setNewEntryText] = useState("");
  const [selectedMood, setSelectedMood] = useState(null);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Journal stats
  const [journalStats] = useState({
    totalEntries: 34,
    thisYear: "Journals this year",
    streak: 5,
    weeklyEntries: [
      { day: "M", hasEntry: true, color: freudDarkTheme.colors.status.success },
      { day: "T", hasEntry: false, color: freudDarkTheme.colors.border.primary },
      { day: "W", hasEntry: true, color: freudDarkTheme.colors.accent.primary },
      { day: "T", hasEntry: false, color: freudDarkTheme.colors.border.primary },
      { day: "F", hasEntry: true, color: freudDarkTheme.colors.status.success },
      { day: "S", hasEntry: true, color: freudDarkTheme.colors.accent.primary },
      { day: "S", hasEntry: false, color: freudDarkTheme.colors.border.primary },
    ],
    monthlyStats: {
      current: 32,
      total: 81,
    }
  });

  // Sample journal entries
  const [journalEntries] = useState([
    {
      id: 1,
      date: "Today",
      title: "New Mental Health Journal",
      content: "Today I had a hard time concentrating. I think my negative thoughts started very early in the morning, because of the work mistakes, very angry.",
      mood: "😔",
      moodLabel: "Struggling",
      hasAudio: true,
      audioLength: "2:30",
      timestamp: new Date(),
      tags: ["work", "stress", "concentration"],
    },
    {
      id: 2,
      date: "Yesterday",
      title: "Feeling Bad Again!",
      content: "It's like everything goes all right at once. I can't seem to get out of this black down. Basically I'm going through a lot of anxiety and I need to resolve it effectively.",
      mood: "😰",
      moodLabel: "Anxious",
      hasAudio: false,
      timestamp: new Date(Date.now() - 86400000),
      tags: ["anxiety", "emotions"],
    },
    {
      id: 3,
      date: "Dec 15",
      title: "My Journals",
      content: "Today was better. I managed to complete my meditation session and felt more grounded.",
      mood: "😊",
      moodLabel: "Better",
      hasAudio: false,
      timestamp: new Date(Date.now() - 172800000),
      tags: ["meditation", "progress"],
    },
  ]);

  // Mood options for new entries
  const [moodOptions] = useState([
    { emoji: "😔", label: "Sad", color: "#6B46C1" },
    { emoji: "😰", label: "Anxious", color: "#DC2626" },
    { emoji: "😐", label: "Neutral", color: "#6B7280" },
    { emoji: "😊", label: "Happy", color: "#059669" },
    { emoji: "😁", label: "Great", color: "#0891B2" },
    { emoji: "🤔", label: "Confused", color: "#EA580C" },
  ]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>Mental Health Journal</Text>
      
      <TouchableOpacity style={styles.menuButton}>
        <Text style={styles.menuButtonText}>⋯</Text>
      </TouchableOpacity>
    </View>
  );

  const renderJournalStats = () => (
    <View style={styles.statsSection}>
      <View style={styles.statsCard}>
        <Text style={styles.statsNumber}>{journalStats.totalEntries}</Text>
        <Text style={styles.statsLabel}>{journalStats.thisYear}</Text>
        
        <View style={styles.weeklyProgress}>
          {journalStats.weeklyEntries.map((day, index) => (
            <View key={index} style={styles.weeklyDay}>
              <Text style={styles.weeklyDayLabel}>{day.day}</Text>
              <View 
                style={[
                  styles.weeklyDayIndicator,
                  { 
                    backgroundColor: day.hasEntry ? day.color : freudDarkTheme.colors.border.primary,
                    opacity: day.hasEntry ? 1 : 0.3,
                  }
                ]} 
              />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.detailStats}>
        <LinearGradient
          colors={[freudDarkTheme.colors.accent.primary, freudDarkTheme.colors.accent.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.detailStatsCard}
        >
          <Text style={styles.detailStatsNumber}>{journalStats.monthlyStats.current}</Text>
          <Text style={styles.detailStatsTotal}>/ {journalStats.monthlyStats.total}</Text>
          <Text style={styles.detailStatsLabel}>This journal</Text>
        </LinearGradient>
      </View>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActions}>
      <TouchableOpacity 
        style={styles.quickActionButton}
        onPress={() => setShowNewEntryModal(true)}
      >
        <Text style={styles.quickActionIcon}>📝</Text>
        <Text style={styles.quickActionText}>New Mental Health Journal</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.quickActionButton}>
        <Text style={styles.quickActionIcon}>🎤</Text>
        <Text style={styles.quickActionText}>Voice Journal</Text>
      </TouchableOpacity>
    </View>
  );

  const renderJournalEntries = () => (
    <View style={styles.entriesSection}>
      <View style={styles.entriesHeader}>
        <Text style={styles.entriesTitle}>My Journals</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {journalEntries.map((entry) => (
        <TouchableOpacity
          key={entry.id}
          style={styles.entryCard}
          onPress={() => handleEntryPress(entry)}
        >
          <View style={styles.entryHeader}>
            <View style={styles.entryMood}>
              <Text style={styles.entryMoodEmoji}>{entry.mood}</Text>
              <Text style={styles.entryMoodLabel}>{entry.moodLabel}</Text>
            </View>
            <Text style={styles.entryDate}>{entry.date}</Text>
          </View>
          
          <Text style={styles.entryTitle}>{entry.title}</Text>
          <Text style={styles.entryContent} numberOfLines={2}>
            {entry.content}
          </Text>
          
          <View style={styles.entryFooter}>
            {entry.hasAudio && (
              <View style={styles.audioIndicator}>
                <Text style={styles.audioIcon}>🎤</Text>
                <Text style={styles.audioLength}>{entry.audioLength}</Text>
              </View>
            )}
            <View style={styles.entryTags}>
              {entry.tags?.slice(0, 2).map((tag, index) => (
                <View key={index} style={styles.tagChip}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderNewEntryModal = () => (
    <Modal
      visible={showNewEntryModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setShowNewEntryModal(false)}
          >
            <Text style={styles.modalCloseText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Add New Journal</Text>
          <TouchableOpacity
            style={styles.modalSaveButton}
            onPress={handleSaveEntry}
          >
            <Text style={styles.modalSaveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Mood Selection */}
          <View style={styles.moodSection}>
            <Text style={styles.moodSectionTitle}>How are you feeling?</Text>
            <View style={styles.moodGrid}>
              {moodOptions.map((mood, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.moodOption,
                    selectedMood?.emoji === mood.emoji && styles.moodOptionSelected,
                    { borderColor: mood.color },
                  ]}
                  onPress={() => setSelectedMood(mood)}
                >
                  <Text style={styles.moodOptionEmoji}>{mood.emoji}</Text>
                  <Text style={styles.moodOptionLabel}>{mood.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Journal Input */}
          <View style={styles.journalInputSection}>
            <Text style={styles.journalInputTitle}>Say anything that's on your mind</Text>
            <TextInput
              style={styles.journalTextInput}
              placeholder="Write your thoughts here..."
              placeholderTextColor={freudDarkTheme.colors.text.placeholder}
              value={newEntryText}
              onChangeText={setNewEntryText}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Voice Recording */}
          <View style={styles.voiceSection}>
            <TouchableOpacity style={styles.voiceRecordButton}>
              <Text style={styles.voiceRecordIcon}>🎤</Text>
              <Text style={styles.voiceRecordText}>Tap to record voice note</Text>
            </TouchableOpacity>
          </View>

          {/* Additional Options */}
          <View style={styles.additionalOptions}>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionIcon}>🏷️</Text>
              <Text style={styles.optionText}>Add Tags</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionIcon}>📅</Text>
              <Text style={styles.optionText}>Set Reminder</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionIcon}>🔒</Text>
              <Text style={styles.optionText}>Private Entry</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  const handleEntryPress = (entry) => {
    setSelectedEntry(entry);
    // Navigate to detail view or show modal
    Alert.alert("Journal Entry", `Opening: ${entry.title}`);
  };

  const handleSaveEntry = () => {
    if (!newEntryText.trim() && !selectedMood) {
      Alert.alert("Error", "Please add some content or select a mood");
      return;
    }

    // Save logic here
    Alert.alert("Success", "Journal entry saved!");
    setShowNewEntryModal(false);
    setNewEntryText("");
    setSelectedMood(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          {renderHeader()}

          {/* Journal Stats */}
          {renderJournalStats()}

          {/* Quick Actions */}
          {renderQuickActions()}

          {/* Journal Entries */}
          {renderJournalEntries()}
        </Animated.View>
      </ScrollView>

      {/* New Entry Modal */}
      {renderNewEntryModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: freudDarkTheme.colors.background.primary,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: freudDarkTheme.spacing[6],
    paddingTop: 60,
    paddingBottom: freudDarkTheme.spacing[4],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: freudDarkTheme.colors.card.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.bold,
  },
  headerTitle: {
    fontSize: freudDarkTheme.typography.sizes.xl,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.semibold,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButtonText: {
    fontSize: 20,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.bold,
  },

  // Stats Section
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: freudDarkTheme.spacing[6],
    marginBottom: freudDarkTheme.spacing[6],
    gap: freudDarkTheme.spacing[4],
  },
  statsCard: {
    flex: 2,
    backgroundColor: freudDarkTheme.colors.card.background,
    borderRadius: freudDarkTheme.borderRadius.lg,
    padding: freudDarkTheme.spacing[6],
    ...freudDarkTheme.shadows.md,
  },
  statsNumber: {
    fontSize: freudDarkTheme.typography.sizes["4xl"],
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.bold,
    textAlign: 'center',
    marginBottom: freudDarkTheme.spacing[2],
  },
  statsLabel: {
    fontSize: freudDarkTheme.typography.sizes.sm,
    color: freudDarkTheme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: freudDarkTheme.spacing[4],
  },
  weeklyProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weeklyDay: {
    alignItems: 'center',
  },
  weeklyDayLabel: {
    fontSize: freudDarkTheme.typography.sizes.xs,
    color: freudDarkTheme.colors.text.tertiary,
    marginBottom: freudDarkTheme.spacing[1],
  },
  weeklyDayIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  detailStats: {
    flex: 1,
  },
  detailStatsCard: {
    flex: 1,
    borderRadius: freudDarkTheme.borderRadius.lg,
    padding: freudDarkTheme.spacing[4],
    justifyContent: 'center',
    alignItems: 'center',
    ...freudDarkTheme.shadows.md,
  },
  detailStatsNumber: {
    fontSize: freudDarkTheme.typography.sizes["2xl"],
    color: '#FFFFFF',
    fontWeight: freudDarkTheme.typography.weights.bold,
  },
  detailStatsTotal: {
    fontSize: freudDarkTheme.typography.sizes.base,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  detailStatsLabel: {
    fontSize: freudDarkTheme.typography.sizes.xs,
    color: '#FFFFFF',
    opacity: 0.7,
    marginTop: freudDarkTheme.spacing[1],
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: freudDarkTheme.spacing[6],
    marginBottom: freudDarkTheme.spacing[6],
    gap: freudDarkTheme.spacing[4],
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: freudDarkTheme.colors.card.background,
    borderRadius: freudDarkTheme.borderRadius.lg,
    padding: freudDarkTheme.spacing[4],
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...freudDarkTheme.shadows.sm,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: freudDarkTheme.spacing[2],
  },
  quickActionText: {
    fontSize: freudDarkTheme.typography.sizes.sm,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.medium,
    textAlign: 'center',
  },

  // Entries Section
  entriesSection: {
    paddingHorizontal: freudDarkTheme.spacing[6],
  },
  entriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: freudDarkTheme.spacing[4],
  },
  entriesTitle: {
    fontSize: freudDarkTheme.typography.sizes.lg,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.semibold,
  },
  seeAllText: {
    fontSize: freudDarkTheme.typography.sizes.sm,
    color: freudDarkTheme.colors.accent.primary,
    fontWeight: freudDarkTheme.typography.weights.medium,
  },
  entryCard: {
    backgroundColor: freudDarkTheme.colors.card.background,
    borderRadius: freudDarkTheme.borderRadius.lg,
    padding: freudDarkTheme.spacing[4],
    marginBottom: freudDarkTheme.spacing[4],
    ...freudDarkTheme.shadows.sm,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: freudDarkTheme.spacing[3],
  },
  entryMood: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entryMoodEmoji: {
    fontSize: 24,
    marginRight: freudDarkTheme.spacing[2],
  },
  entryMoodLabel: {
    fontSize: freudDarkTheme.typography.sizes.sm,
    color: freudDarkTheme.colors.text.secondary,
    fontWeight: freudDarkTheme.typography.weights.medium,
  },
  entryDate: {
    fontSize: freudDarkTheme.typography.sizes.sm,
    color: freudDarkTheme.colors.text.tertiary,
  },
  entryTitle: {
    fontSize: freudDarkTheme.typography.sizes.base,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.semibold,
    marginBottom: freudDarkTheme.spacing[2],
  },
  entryContent: {
    fontSize: freudDarkTheme.typography.sizes.sm,
    color: freudDarkTheme.colors.text.secondary,
    lineHeight: freudDarkTheme.typography.sizes.sm * 1.4,
    marginBottom: freudDarkTheme.spacing[3],
  },
  entryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  audioIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioIcon: {
    fontSize: 16,
    marginRight: freudDarkTheme.spacing[1],
  },
  audioLength: {
    fontSize: freudDarkTheme.typography.sizes.xs,
    color: freudDarkTheme.colors.text.tertiary,
  },
  entryTags: {
    flexDirection: 'row',
    gap: freudDarkTheme.spacing[2],
  },
  tagChip: {
    backgroundColor: freudDarkTheme.colors.background.tertiary,
    paddingHorizontal: freudDarkTheme.spacing[2],
    paddingVertical: freudDarkTheme.spacing[1],
    borderRadius: freudDarkTheme.borderRadius.sm,
  },
  tagText: {
    fontSize: freudDarkTheme.typography.sizes.xs,
    color: freudDarkTheme.colors.text.tertiary,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: freudDarkTheme.colors.background.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: freudDarkTheme.spacing[6],
    paddingTop: 60,
    paddingBottom: freudDarkTheme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: freudDarkTheme.colors.border.primary,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: freudDarkTheme.colors.card.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 18,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.bold,
  },
  modalTitle: {
    fontSize: freudDarkTheme.typography.sizes.lg,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.semibold,
  },
  modalSaveButton: {
    backgroundColor: freudDarkTheme.colors.accent.primary,
    paddingHorizontal: freudDarkTheme.spacing[4],
    paddingVertical: freudDarkTheme.spacing[2],
    borderRadius: freudDarkTheme.borderRadius.md,
  },
  modalSaveText: {
    fontSize: freudDarkTheme.typography.sizes.base,
    color: '#FFFFFF',
    fontWeight: freudDarkTheme.typography.weights.semibold,
  },
  modalContent: {
    flex: 1,
    padding: freudDarkTheme.spacing[6],
  },

  // Mood Selection
  moodSection: {
    marginBottom: freudDarkTheme.spacing[6],
  },
  moodSectionTitle: {
    fontSize: freudDarkTheme.typography.sizes.lg,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.semibold,
    marginBottom: freudDarkTheme.spacing[4],
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: freudDarkTheme.spacing[3],
  },
  moodOption: {
    width: (width - freudDarkTheme.spacing[6] * 2 - freudDarkTheme.spacing[3] * 2) / 3,
    backgroundColor: freudDarkTheme.colors.card.background,
    borderRadius: freudDarkTheme.borderRadius.lg,
    padding: freudDarkTheme.spacing[4],
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodOptionSelected: {
    borderWidth: 2,
  },
  moodOptionEmoji: {
    fontSize: 32,
    marginBottom: freudDarkTheme.spacing[2],
  },
  moodOptionLabel: {
    fontSize: freudDarkTheme.typography.sizes.sm,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.medium,
  },

  // Journal Input
  journalInputSection: {
    marginBottom: freudDarkTheme.spacing[6],
  },
  journalInputTitle: {
    fontSize: freudDarkTheme.typography.sizes.base,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.medium,
    marginBottom: freudDarkTheme.spacing[3],
  },
  journalTextInput: {
    backgroundColor: freudDarkTheme.colors.input.background,
    borderRadius: freudDarkTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: freudDarkTheme.colors.input.border,
    padding: freudDarkTheme.spacing[4],
    fontSize: freudDarkTheme.typography.sizes.base,
    color: freudDarkTheme.colors.input.text,
    minHeight: 150,
    textAlignVertical: 'top',
  },

  // Voice Section
  voiceSection: {
    marginBottom: freudDarkTheme.spacing[6],
  },
  voiceRecordButton: {
    backgroundColor: freudDarkTheme.colors.card.background,
    borderRadius: freudDarkTheme.borderRadius.lg,
    padding: freudDarkTheme.spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: freudDarkTheme.colors.border.primary,
    borderStyle: 'dashed',
  },
  voiceRecordIcon: {
    fontSize: 24,
    marginRight: freudDarkTheme.spacing[2],
  },
  voiceRecordText: {
    fontSize: freudDarkTheme.typography.sizes.base,
    color: freudDarkTheme.colors.text.secondary,
    fontWeight: freudDarkTheme.typography.weights.medium,
  },

  // Additional Options
  additionalOptions: {
    gap: freudDarkTheme.spacing[3],
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: freudDarkTheme.colors.card.background,
    borderRadius: freudDarkTheme.borderRadius.lg,
    padding: freudDarkTheme.spacing[4],
  },
  optionIcon: {
    fontSize: 20,
    marginRight: freudDarkTheme.spacing[3],
  },
  optionText: {
    fontSize: freudDarkTheme.typography.sizes.base,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.medium,
  },
});

export default DarkMentalHealthJournalScreen;