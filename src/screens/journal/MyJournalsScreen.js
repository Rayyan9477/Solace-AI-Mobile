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
  Modal,
  FlatList,
} from "react-native";

import { MentalHealthIcon, NavigationIcon } from "../../components/icons";
import { useTheme } from "../../contexts/ThemeContext";

const { width } = Dimensions.get("window");

const MyJournalsScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [filterType, setFilterType] = useState("all"); // all, text, voice, mood
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Mock journal entries matching the design
  const journalEntries = [
    {
      id: 1,
      title: "Feeling Bad Again! 😔",
      mood: { emoji: "😔", name: "Sad", color: "#FF5722" },
      content:
        "Today I had a hard time concentrating. I was just making random mistakes, why can't I can not...",
      type: "text",
      date: "2024-01-20",
      time: "14:30",
      category: "daily",
      reactions: ["😢", "💙", "🤗"],
      aiInsight:
        "This entry shows patterns of self-criticism. Consider practicing self-compassion.",
    },
    {
      id: 2,
      title: "Voice Memo - Morning Thoughts",
      mood: { emoji: "😊", name: "Happy", color: "#4CAF50" },
      content: "[Voice Recording - 2:45] Feeling grateful this morning...",
      type: "voice",
      date: "2024-01-19",
      time: "08:15",
      category: "morning",
      duration: "2:45",
      aiInsight:
        "Your morning entries tend to be more positive. Great start to the day!",
    },
    {
      id: 3,
      title: "Anxiety About Work Meeting",
      mood: { emoji: "😰", name: "Anxious", color: "#FF9800" },
      content:
        "Big presentation tomorrow. Feeling nervous but trying to stay positive. Practiced breathing exercises.",
      type: "text",
      date: "2024-01-18",
      time: "20:45",
      category: "work",
      reactions: ["😌", "💪", "✨"],
      aiInsight:
        "You handled anxiety well with breathing exercises. Keep using coping strategies.",
    },
    {
      id: 4,
      title: "Gratitude Practice",
      mood: { emoji: "😌", name: "Peaceful", color: "#2196F3" },
      content:
        "Three things I'm grateful for today: 1) Morning coffee with Sarah 2) Sunny weather 3) Finished the book I've been reading.",
      type: "text",
      date: "2024-01-17",
      time: "21:00",
      category: "gratitude",
      reactions: ["❤️", "🙏", "✨"],
      aiInsight:
        "Gratitude practices are excellent for mental health. Keep it up!",
    },
    {
      id: 5,
      title: "Weekend Reflection",
      mood: { emoji: "😊", name: "Content", color: "#4CAF50" },
      content:
        "Had a wonderful weekend with family. Feeling recharged and ready for the week ahead.",
      type: "text",
      date: "2024-01-16",
      time: "19:30",
      category: "weekend",
      reactions: ["😊", "👨‍👩‍👧‍👦", "💚"],
      aiInsight: "Family time appears to boost your mood significantly.",
    },
  ];

  const filterOptions = [
    { id: "all", label: "All Entries", icon: "Journal" },
    { id: "text", label: "Text", icon: "Brain" },
    { id: "voice", label: "Voice", icon: "Heart" },
    { id: "mood", label: "Mood Only", icon: "Mindfulness" },
  ];

  const filteredEntries = journalEntries.filter((entry) => {
    if (filterType === "all") return true;
    if (filterType === "text") return entry.type === "text";
    if (filterType === "voice") return entry.type === "voice";
    if (filterType === "mood") return entry.category === "mood";
    return true;
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleEntryPress = (entry) => {
    setSelectedEntry(entry);
    setShowEntryModal(true);
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
            My Journals
          </Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("NewJournal")}
          >
            <MentalHealthIcon
              name="Journal"
              size={24}
              color={theme.colors.text.primary}
              variant="outline"
            />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.filterTab,
                  {
                    backgroundColor:
                      filterType === option.id
                        ? theme.colors.primary[500]
                        : theme.colors.background.secondary,
                  },
                ]}
                onPress={() => setFilterType(option.id)}
              >
                <MentalHealthIcon
                  name={option.icon}
                  size={16}
                  color={
                    filterType === option.id
                      ? theme.colors.text.inverse
                      : theme.colors.text.primary
                  }
                  variant={filterType === option.id ? "filled" : "outline"}
                />
                <Text
                  style={[
                    styles.filterTabText,
                    {
                      color:
                        filterType === option.id
                          ? theme.colors.text.inverse
                          : theme.colors.text.primary,
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Journals List */}
        <FlatList
          data={filteredEntries}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item, index }) => (
            <JournalEntryCard
              entry={item}
              theme={theme}
              isDarkMode={isDarkMode}
              onPress={() => handleEntryPress(item)}
              delay={index * 100}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateEmoji}>📝</Text>
              <Text
                style={[
                  styles.emptyStateTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                No journals found
              </Text>
              <Text
                style={[
                  styles.emptyStateText,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Start writing your first journal entry
              </Text>
              <TouchableOpacity
                style={[
                  styles.emptyStateButton,
                  { backgroundColor: theme.colors.primary[500] },
                ]}
                onPress={() => navigation.navigate("NewJournal")}
              >
                <Text
                  style={[
                    styles.emptyStateButtonText,
                    { color: theme.colors.text.inverse },
                  ]}
                >
                  Create First Journal
                </Text>
              </TouchableOpacity>
            </View>
          }
        />

        {/* Journal Entry Detail Modal */}
        <Modal
          visible={showEntryModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowEntryModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              {selectedEntry && (
                <>
                  <View style={styles.modalHeader}>
                    <Text
                      style={[
                        styles.modalTitle,
                        { color: theme.colors.text.primary },
                      ]}
                    >
                      {selectedEntry.title}
                    </Text>
                    <TouchableOpacity
                      style={styles.modalCloseButton}
                      onPress={() => setShowEntryModal(false)}
                    >
                      <NavigationIcon
                        name="Home"
                        size={24}
                        color={theme.colors.text.primary}
                        variant="outline"
                      />
                    </TouchableOpacity>
                  </View>

                  <ScrollView style={styles.modalScroll}>
                    {/* Entry Header */}
                    <View style={styles.entryHeader}>
                      <View style={styles.entryMood}>
                        <Text style={styles.entryMoodEmoji}>
                          {selectedEntry.mood.emoji}
                        </Text>
                        <Text
                          style={[
                            styles.entryMoodName,
                            { color: theme.colors.text.primary },
                          ]}
                        >
                          {selectedEntry.mood.name}
                        </Text>
                      </View>
                      <View style={styles.entryDate}>
                        <Text
                          style={[
                            styles.entryDateText,
                            { color: theme.colors.text.secondary },
                          ]}
                        >
                          {selectedEntry.date} • {selectedEntry.time}
                        </Text>
                        <View
                          style={[
                            styles.entryTypeTag,
                            { backgroundColor: selectedEntry.mood.color },
                          ]}
                        >
                          <Text
                            style={[
                              styles.entryTypeText,
                              { color: theme.colors.text.inverse },
                            ]}
                          >
                            {selectedEntry.type}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Entry Content */}
                    <View
                      style={[
                        styles.entryContent,
                        { backgroundColor: theme.colors.background.secondary },
                      ]}
                    >
                      {selectedEntry.type === "voice" ? (
                        <View style={styles.voiceContent}>
                          <View
                            style={[
                              styles.voiceIcon,
                              { backgroundColor: theme.colors.primary[500] },
                            ]}
                          >
                            <MentalHealthIcon
                              name="Heart"
                              size={20}
                              color={theme.colors.text.inverse}
                              variant="filled"
                            />
                          </View>
                          <View style={styles.voiceInfo}>
                            <Text
                              style={[
                                styles.voiceTitle,
                                { color: theme.colors.text.primary },
                              ]}
                            >
                              Voice Recording
                            </Text>
                            <Text
                              style={[
                                styles.voiceDuration,
                                { color: theme.colors.text.secondary },
                              ]}
                            >
                              Duration: {selectedEntry.duration}
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={[
                              styles.playButton,
                              { backgroundColor: theme.colors.primary[500] },
                            ]}
                          >
                            <Text
                              style={[
                                styles.playButtonText,
                                { color: theme.colors.text.inverse },
                              ]}
                            >
                              ▶
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <Text
                          style={[
                            styles.entryText,
                            { color: theme.colors.text.primary },
                          ]}
                        >
                          {selectedEntry.content}
                        </Text>
                      )}
                    </View>

                    {/* AI Insight */}
                    <View
                      style={[
                        styles.aiInsightCard,
                        {
                          backgroundColor:
                            theme.colors.therapeutic.calming[100],
                        },
                      ]}
                    >
                      <View style={styles.aiInsightHeader}>
                        <View
                          style={[
                            styles.aiInsightIcon,
                            { backgroundColor: theme.colors.primary[500] },
                          ]}
                        >
                          <MentalHealthIcon
                            name="Brain"
                            size={16}
                            color={theme.colors.text.inverse}
                            variant="filled"
                          />
                        </View>
                        <Text
                          style={[
                            styles.aiInsightTitle,
                            { color: theme.colors.text.primary },
                          ]}
                        >
                          AI Insight
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.aiInsightText,
                          { color: theme.colors.text.secondary },
                        ]}
                      >
                        {selectedEntry.aiInsight}
                      </Text>
                    </View>

                    {/* Reactions */}
                    {selectedEntry.reactions && (
                      <View style={styles.reactionsSection}>
                        <Text
                          style={[
                            styles.reactionsTitle,
                            { color: theme.colors.text.primary },
                          ]}
                        >
                          Mood Reactions
                        </Text>
                        <View style={styles.reactions}>
                          {selectedEntry.reactions.map((reaction, index) => (
                            <View
                              key={index}
                              style={[
                                styles.reaction,
                                {
                                  backgroundColor:
                                    theme.colors.background.secondary,
                                },
                              ]}
                            >
                              <Text style={styles.reactionEmoji}>
                                {reaction}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </ScrollView>

                  {/* Modal Actions */}
                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={[
                        styles.modalActionButton,
                        { backgroundColor: theme.colors.background.secondary },
                      ]}
                      onPress={() => {
                        setShowEntryModal(false);
                        // Navigate to edit
                      }}
                    >
                      <Text
                        style={[
                          styles.modalActionText,
                          { color: theme.colors.text.primary },
                        ]}
                      >
                        Edit
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.modalActionButton,
                        { backgroundColor: theme.colors.primary[500] },
                      ]}
                      onPress={() => {
                        setShowEntryModal(false);
                        // Share functionality
                      }}
                    >
                      <Text
                        style={[
                          styles.modalActionText,
                          { color: theme.colors.text.inverse },
                        ]}
                      >
                        Share Insight
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
};

const JournalEntryCard = ({ entry, theme, isDarkMode, onPress, delay }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.entryCard,
        {
          backgroundColor: theme.colors.background.primary,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity style={styles.entryCardContent} onPress={onPress}>
        <View style={styles.entryCardHeader}>
          <View style={styles.entryCardMood}>
            <Text style={styles.entryCardMoodEmoji}>{entry.mood.emoji}</Text>
            <View style={styles.entryCardMoodInfo}>
              <Text
                style={[
                  styles.entryCardTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                {entry.title}
              </Text>
              <Text
                style={[styles.entryCardMoodName, { color: entry.mood.color }]}
              >
                {entry.mood.name}
              </Text>
            </View>
          </View>
          <View style={styles.entryCardDate}>
            <Text
              style={[
                styles.entryCardDateText,
                { color: theme.colors.text.quaternary },
              ]}
            >
              {entry.date}
            </Text>
            <Text
              style={[
                styles.entryCardTimeText,
                { color: theme.colors.text.quaternary },
              ]}
            >
              {entry.time}
            </Text>
          </View>
        </View>

        <Text
          style={[
            styles.entryCardContent,
            { color: theme.colors.text.secondary },
          ]}
          numberOfLines={2}
        >
          {entry.content}
        </Text>

        <View style={styles.entryCardFooter}>
          <View
            style={[
              styles.entryCardTypeTag,
              { backgroundColor: entry.mood.color },
            ]}
          >
            <Text
              style={[
                styles.entryCardTypeText,
                { color: theme.colors.text.inverse },
              ]}
            >
              {entry.type === "voice" ? `🎙️ ${entry.duration}` : "📝 Text"}
            </Text>
          </View>

          {entry.reactions && (
            <View style={styles.entryCardReactions}>
              {entry.reactions.slice(0, 3).map((reaction, index) => (
                <Text key={index} style={styles.entryCardReactionEmoji}>
                  {reaction}
                </Text>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
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
  addButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    gap: 6,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: "500",
  },
  listContainer: {
    padding: 20,
    paddingTop: 0,
  },
  entryCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  entryCardContent: {
    gap: 12,
  },
  entryCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  entryCardMood: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  entryCardMoodEmoji: {
    fontSize: 32,
  },
  entryCardMoodInfo: {
    flex: 1,
  },
  entryCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  entryCardMoodName: {
    fontSize: 12,
    fontWeight: "500",
  },
  entryCardDate: {
    alignItems: "flex-end",
  },
  entryCardDateText: {
    fontSize: 12,
  },
  entryCardTimeText: {
    fontSize: 10,
  },
  entryCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  entryCardTypeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  entryCardTypeText: {
    fontSize: 10,
    fontWeight: "500",
  },
  entryCardReactions: {
    flexDirection: "row",
    gap: 4,
  },
  entryCardReactionEmoji: {
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  emptyStateButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  emptyStateButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  modalCloseButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  modalScroll: {
    flex: 1,
    padding: 20,
  },
  entryHeader: {
    marginBottom: 16,
  },
  entryMood: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 12,
  },
  entryMoodEmoji: {
    fontSize: 32,
  },
  entryMoodName: {
    fontSize: 18,
    fontWeight: "600",
  },
  entryDate: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  entryDateText: {
    fontSize: 14,
  },
  entryTypeTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  entryTypeText: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
  },
  entryContent: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  entryText: {
    fontSize: 16,
    lineHeight: 24,
  },
  voiceContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  voiceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  voiceInfo: {
    flex: 1,
  },
  voiceTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  voiceDuration: {
    fontSize: 14,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  playButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  aiInsightCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  aiInsightHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  aiInsightIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  aiInsightTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  aiInsightText: {
    fontSize: 14,
    lineHeight: 20,
  },
  reactionsSection: {
    marginBottom: 16,
  },
  reactionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  reactions: {
    flexDirection: "row",
    gap: 8,
  },
  reaction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  reactionEmoji: {
    fontSize: 20,
  },
  modalActions: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
  },
  modalActionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  modalActionText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default MyJournalsScreen;
