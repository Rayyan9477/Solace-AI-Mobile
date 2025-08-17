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

const NewPostScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const [postContent, setPostContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

  // Categories matching the design
  const categories = [
    {
      id: "support",
      name: "Support Request",
      emoji: "🤗",
      color: "#FF9800",
      description: "Ask for help and support",
    },
    {
      id: "progress",
      name: "Progress",
      emoji: "🌱",
      color: "#4CAF50",
      description: "Share your journey and wins",
    },
    {
      id: "wisdom",
      name: "Daily Wisdom",
      emoji: "💡",
      color: "#2196F3",
      description: "Share insights and tips",
    },
    {
      id: "events",
      name: "Events",
      emoji: "📅",
      color: "#9C27B0",
      description: "Community events and activities",
    },
    {
      id: "questions",
      name: "Questions",
      emoji: "❓",
      color: "#607D8B",
      description: "Ask questions to the community",
    },
    {
      id: "gratitude",
      name: "Gratitude",
      emoji: "🙏",
      color: "#795548",
      description: "Share what you're thankful for",
    },
  ];

  // Moods for sharing emotional context
  const moods = [
    { id: "happy", emoji: "😊", name: "Happy", color: "#4CAF50" },
    { id: "hopeful", emoji: "🌟", name: "Hopeful", color: "#FFC107" },
    { id: "calm", emoji: "😌", name: "Calm", color: "#2196F3" },
    { id: "grateful", emoji: "🙏", name: "Grateful", color: "#795548" },
    { id: "anxious", emoji: "😰", name: "Anxious", color: "#FF9800" },
    { id: "sad", emoji: "😢", name: "Sad", color: "#607D8B" },
    { id: "overwhelmed", emoji: "😵‍💫", name: "Overwhelmed", color: "#F44336" },
    { id: "neutral", emoji: "😐", name: "Neutral", color: "#9E9E9E" },
  ];

  const prompts = [
    "What's been on your mind lately?",
    "Share something positive from your day",
    "What support do you need right now?",
    "What advice would you give to someone in your situation?",
    "Describe a moment that brought you peace today",
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (showSuccessModal) {
      Animated.sequence([
        Animated.timing(successAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(successAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowSuccessModal(false);
        navigation.navigate("Community");
      });
    }
  }, [showSuccessModal]);

  const handlePost = () => {
    if (!postContent.trim() && !selectedMood) {
      Alert.alert(
        "Please add content",
        "Write something or select a mood to share with the community.",
      );
      return;
    }

    if (!selectedCategory) {
      Alert.alert(
        "Please select a category",
        "Choose a category that best fits your post.",
      );
      return;
    }

    // Simulate posting
    setShowSuccessModal(true);
  };

  const handlePromptSelect = (prompt) => {
    setPostContent(prompt + "\n\n");
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
            Add New Post
          </Text>

          <TouchableOpacity
            style={[
              styles.postButton,
              {
                backgroundColor:
                  (postContent.trim() || selectedMood) && selectedCategory
                    ? theme.colors.primary[500]
                    : theme.colors.background.secondary,
              },
            ]}
            onPress={handlePost}
            disabled={
              !(postContent.trim() || selectedMood) || !selectedCategory
            }
          >
            <Text
              style={[
                styles.postButtonText,
                {
                  color:
                    (postContent.trim() || selectedMood) && selectedCategory
                      ? theme.colors.text.inverse
                      : theme.colors.text.quaternary,
                },
              ]}
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View
            style={[styles.animatedContainer, { opacity: fadeAnim }]}
          >
            {/* Anonymous Toggle */}
            <View
              style={[
                styles.anonymousSection,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <View style={styles.anonymousInfo}>
                <Text
                  style={[
                    styles.anonymousTitle,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Share Anonymously
                </Text>
                <Text
                  style={[
                    styles.anonymousDescription,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  Your identity will be hidden from other users
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.toggleSwitch,
                  {
                    backgroundColor: isAnonymous
                      ? theme.colors.primary[500]
                      : theme.colors.background.secondary,
                  },
                ]}
                onPress={() => setIsAnonymous(!isAnonymous)}
              >
                <View
                  style={[
                    styles.toggleKnob,
                    {
                      backgroundColor: theme.colors.text.inverse,
                      transform: [{ translateX: isAnonymous ? 20 : 0 }],
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>

            {/* Category Selection */}
            <View
              style={[
                styles.sectionCard,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                Choose Category
              </Text>

              {selectedCategory ? (
                <TouchableOpacity
                  style={[
                    styles.selectedCategory,
                    {
                      backgroundColor: selectedCategory.color + "20",
                      borderColor: selectedCategory.color,
                    },
                  ]}
                  onPress={() => setShowCategorySelector(true)}
                >
                  <Text style={styles.categoryEmoji}>
                    {selectedCategory.emoji}
                  </Text>
                  <View style={styles.categoryInfo}>
                    <Text
                      style={[
                        styles.categoryName,
                        { color: theme.colors.text.primary },
                      ]}
                    >
                      {selectedCategory.name}
                    </Text>
                    <Text
                      style={[
                        styles.categoryDescription,
                        { color: theme.colors.text.secondary },
                      ]}
                    >
                      {selectedCategory.description}
                    </Text>
                  </View>
                  <NavigationIcon
                    name="Home"
                    size={16}
                    color={theme.colors.text.secondary}
                    variant="outline"
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.selectButton,
                    { backgroundColor: theme.colors.background.secondary },
                  ]}
                  onPress={() => setShowCategorySelector(true)}
                >
                  <Text
                    style={[
                      styles.selectButtonText,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    Select Category
                  </Text>
                  <NavigationIcon
                    name="Home"
                    size={16}
                    color={theme.colors.text.secondary}
                    variant="outline"
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Content Input */}
            <View
              style={[
                styles.sectionCard,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                Share Your Thoughts
              </Text>

              <TextInput
                style={[
                  styles.contentInput,
                  {
                    backgroundColor: theme.colors.background.secondary,
                    color: theme.colors.text.primary,
                    borderColor: theme.colors.border.primary,
                  },
                ]}
                placeholder="What's on your mind? Share your thoughts, feelings, or ask for support..."
                placeholderTextColor={theme.colors.text.quaternary}
                multiline
                numberOfLines={6}
                value={postContent}
                onChangeText={setPostContent}
                textAlignVertical="top"
                maxLength={1000}
              />

              <View style={styles.inputFooter}>
                <Text
                  style={[
                    styles.characterCount,
                    { color: theme.colors.text.quaternary },
                  ]}
                >
                  {postContent.length}/1000
                </Text>
              </View>
            </View>

            {/* Writing Prompts */}
            <View
              style={[
                styles.sectionCard,
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
                {prompts.map((prompt, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.promptButton,
                      { backgroundColor: theme.colors.background.secondary },
                    ]}
                    onPress={() => handlePromptSelect(prompt)}
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

            {/* Mood Selection */}
            <View
              style={[
                styles.sectionCard,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                How are you feeling? (Optional)
              </Text>

              {selectedMood ? (
                <TouchableOpacity
                  style={[
                    styles.selectedMood,
                    {
                      backgroundColor: selectedMood.color + "20",
                      borderColor: selectedMood.color,
                    },
                  ]}
                  onPress={() => setShowMoodSelector(true)}
                >
                  <Text style={styles.moodEmoji}>{selectedMood.emoji}</Text>
                  <Text
                    style={[
                      styles.moodName,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    {selectedMood.name}
                  </Text>
                  <NavigationIcon
                    name="Home"
                    size={16}
                    color={theme.colors.text.secondary}
                    variant="outline"
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.selectButton,
                    { backgroundColor: theme.colors.background.secondary },
                  ]}
                  onPress={() => setShowMoodSelector(true)}
                >
                  <Text
                    style={[
                      styles.selectButtonText,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    Add Mood (Optional)
                  </Text>
                  <NavigationIcon
                    name="Home"
                    size={16}
                    color={theme.colors.text.secondary}
                    variant="outline"
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Preview Card */}
            {(postContent.trim() || selectedMood) && selectedCategory && (
              <View
                style={[
                  styles.previewCard,
                  { backgroundColor: theme.colors.background.primary },
                ]}
              >
                <Text
                  style={[
                    styles.previewTitle,
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
                  <View style={styles.previewHeader}>
                    <Text style={styles.previewAvatar}>
                      {isAnonymous ? "🙎‍♂️" : "👤"}
                    </Text>
                    <View style={styles.previewInfo}>
                      <Text
                        style={[
                          styles.previewAuthor,
                          { color: theme.colors.text.primary },
                        ]}
                      >
                        {isAnonymous ? "Anonymous User" : "You"}
                      </Text>
                      <Text
                        style={[
                          styles.previewTime,
                          { color: theme.colors.text.quaternary },
                        ]}
                      >
                        Just now
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.previewCategory,
                        { backgroundColor: selectedCategory.color },
                      ]}
                    >
                      <Text
                        style={[
                          styles.previewCategoryText,
                          { color: theme.colors.text.inverse },
                        ]}
                      >
                        {selectedCategory.name}
                      </Text>
                    </View>
                  </View>

                  {selectedMood && (
                    <View style={styles.previewMoodContainer}>
                      <Text style={styles.previewMoodEmoji}>
                        {selectedMood.emoji}
                      </Text>
                      <Text
                        style={[
                          styles.previewMoodText,
                          { color: theme.colors.text.secondary },
                        ]}
                      >
                        Feeling {selectedMood.name}
                      </Text>
                    </View>
                  )}

                  {postContent.trim() ? (
                    <Text
                      style={[
                        styles.previewText,
                        { color: theme.colors.text.primary },
                      ]}
                    >
                      {postContent}
                    </Text>
                  ) : (
                    <Text
                      style={[
                        styles.previewPlaceholder,
                        { color: theme.colors.text.quaternary },
                      ]}
                    >
                      Mood-only post
                    </Text>
                  )}
                </View>
              </View>
            )}
          </Animated.View>
        </ScrollView>

        {/* Category Selection Modal */}
        <Modal
          visible={showCategorySelector}
          transparent
          animationType="slide"
          onRequestClose={() => setShowCategorySelector(false)}
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
                  style={[
                    styles.modalTitle,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Select Category
                </Text>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowCategorySelector(false)}
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
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryOption,
                      {
                        backgroundColor:
                          selectedCategory?.id === category.id
                            ? category.color + "20"
                            : theme.colors.background.secondary,
                        borderColor:
                          selectedCategory?.id === category.id
                            ? category.color
                            : "transparent",
                      },
                    ]}
                    onPress={() => {
                      setSelectedCategory(category);
                      setShowCategorySelector(false);
                    }}
                  >
                    <Text style={styles.categoryOptionEmoji}>
                      {category.emoji}
                    </Text>
                    <View style={styles.categoryOptionInfo}>
                      <Text
                        style={[
                          styles.categoryOptionName,
                          { color: theme.colors.text.primary },
                        ]}
                      >
                        {category.name}
                      </Text>
                      <Text
                        style={[
                          styles.categoryOptionDescription,
                          { color: theme.colors.text.secondary },
                        ]}
                      >
                        {category.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Mood Selection Modal */}
        <Modal
          visible={showMoodSelector}
          transparent
          animationType="slide"
          onRequestClose={() => setShowMoodSelector(false)}
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
                  style={[
                    styles.modalTitle,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  How are you feeling?
                </Text>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowMoodSelector(false)}
                >
                  <NavigationIcon
                    name="Home"
                    size={24}
                    color={theme.colors.text.primary}
                    variant="outline"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.moodGrid}>
                {moods.map((mood) => (
                  <TouchableOpacity
                    key={mood.id}
                    style={[
                      styles.moodOption,
                      {
                        backgroundColor:
                          selectedMood?.id === mood.id
                            ? mood.color + "20"
                            : theme.colors.background.secondary,
                        borderColor:
                          selectedMood?.id === mood.id
                            ? mood.color
                            : "transparent",
                      },
                    ]}
                    onPress={() => {
                      setSelectedMood(mood);
                      setShowMoodSelector(false);
                    }}
                  >
                    <Text style={styles.moodOptionEmoji}>{mood.emoji}</Text>
                    <Text
                      style={[
                        styles.moodOptionName,
                        { color: theme.colors.text.primary },
                      ]}
                    >
                      {mood.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[
                  styles.clearMoodButton,
                  { backgroundColor: theme.colors.background.secondary },
                ]}
                onPress={() => {
                  setSelectedMood(null);
                  setShowMoodSelector(false);
                }}
              >
                <Text
                  style={[
                    styles.clearMoodText,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  No mood selected
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Success Modal */}
        <Modal visible={showSuccessModal} transparent animationType="fade">
          <View style={styles.successOverlay}>
            <Animated.View
              style={[
                styles.successModal,
                {
                  backgroundColor: theme.colors.background.primary,
                  opacity: successAnim,
                  transform: [
                    {
                      scale: successAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <LinearGradient
                colors={[theme.colors.success[400], theme.colors.success[500]]}
                style={styles.successIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.successEmoji}>✓</Text>
              </LinearGradient>

              <Text
                style={[
                  styles.successTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                Post Successful!
              </Text>

              <Text
                style={[
                  styles.successMessage,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Your post has been shared with the community. Thank you for
                contributing to our supportive environment.
              </Text>
            </Animated.View>
          </View>
        </Modal>
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
  postButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  postButtonText: {
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
  anonymousSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  anonymousInfo: {
    flex: 1,
  },
  anonymousTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  anonymousDescription: {
    fontSize: 14,
  },
  toggleSwitch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  sectionCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  selectedCategory: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "500",
  },
  categoryDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  selectButtonText: {
    fontSize: 16,
  },
  contentInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    marginBottom: 8,
  },
  inputFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  characterCount: {
    fontSize: 12,
  },
  promptButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 12,
    maxWidth: 200,
  },
  promptText: {
    fontSize: 14,
    textAlign: "center",
  },
  selectedMood: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  moodEmoji: {
    fontSize: 24,
  },
  moodName: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  previewCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  previewContent: {
    borderRadius: 12,
    padding: 16,
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  previewAvatar: {
    fontSize: 24,
  },
  previewInfo: {
    flex: 1,
  },
  previewAuthor: {
    fontSize: 16,
    fontWeight: "600",
  },
  previewTime: {
    fontSize: 12,
    marginTop: 2,
  },
  previewCategory: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  previewCategoryText: {
    fontSize: 10,
    fontWeight: "500",
  },
  previewMoodContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  previewMoodEmoji: {
    fontSize: 16,
  },
  previewMoodText: {
    fontSize: 14,
  },
  previewText: {
    fontSize: 16,
    lineHeight: 22,
  },
  previewPlaceholder: {
    fontSize: 16,
    fontStyle: "italic",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
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
  categoryOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
    borderWidth: 1,
  },
  categoryOptionEmoji: {
    fontSize: 24,
  },
  categoryOptionInfo: {
    flex: 1,
  },
  categoryOptionName: {
    fontSize: 16,
    fontWeight: "500",
  },
  categoryOptionDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingHorizontal: 20,
  },
  moodOption: {
    width: (width - 80) / 4,
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  moodOptionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  moodOptionName: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  clearMoodButton: {
    margin: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  clearMoodText: {
    fontSize: 14,
    fontWeight: "500",
  },
  successOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  successModal: {
    width: width * 0.8,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  successEmoji: {
    fontSize: 32,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default NewPostScreen;
