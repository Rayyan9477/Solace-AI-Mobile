/**
 * Create Post Screen - Create new community post
 * Based on ui-designs/Dark-mode/Community Support.png
 */

import { logger } from "@shared/utils/logger";
import { useNavigation } from "@react-navigation/native";
import { sanitizeInput } from "@shared/utils/sanitization";
import { useTheme } from "@theme/ThemeProvider";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";

const MOODS = [
  { emoji: "😊", label: "Grateful" },
  { emoji: "💪", label: "Motivated" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😰", label: "Anxious" },
  { emoji: "🥰", label: "Loved" },
  { emoji: "😤", label: "Frustrated" },
];

const ACTIVITIES = [
  { icon: "💼", label: "Work" },
  { icon: "❤️", label: "Relationships" },
  { icon: "🏃", label: "Exercise" },
  { icon: "🎮", label: "Hobbies" },
  { icon: "🍽️", label: "Food" },
  { icon: "😴", label: "Sleep" },
  { icon: "🧘", label: "Mindfulness" },
  { icon: "👥", label: "Social" },
  { icon: "💡", label: "Therapy" },
];

export const CreatePostScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const [postContent, setPostContent] = useState("");
  const [postType, setPostType] = useState<"story" | "question" | "poll">(
    "story",
  );
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [hideFromCommunity, setHideFromCommunity] = useState(false);
  const [saveAsDraft, setSaveAsDraft] = useState(false);

  const handleCreatePost = () => {
    if (!postContent.trim()) {
      return;
    }

    // Post data ready for API/Redux integration
    const postData = {
      content: postContent,
      type: postType,
      mood: selectedMood,
      activities: selectedActivities,
      hideFromCommunity,
      isDraft: saveAsDraft,
      timestamp: new Date().toISOString(),
    };
    logger.debug("Creating post:", postData);

    // For now, show success and navigate back
    Alert.alert("Success", "Your post has been created successfully!", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
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
      borderBottomColor: theme.colors.brown["30"],
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.brown["20"],
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    headerRight: {
      width: 40,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    section: {
      marginBottom: 24,
    },
    sectionLabel: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.secondary,
      marginBottom: 12,
    },
    sectionSubtitle: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.tertiary,
      marginTop: 8,
    },
    typeSelector: {
      flexDirection: "row",
      gap: 12,
    },
    typeButton: {
      flex: 1,
      paddingVertical: 16,
      paddingHorizontal: 12,
      borderRadius: 16,
      alignItems: "center",
      backgroundColor: theme.colors.brown["20"],
      borderWidth: 2,
      borderColor: "transparent",
    },
    typeButtonActive: {
      backgroundColor: theme.colors.brown["70"],
      borderColor: theme.colors.brown["70"],
    },
    typeIcon: {
      fontSize: 24,
      marginBottom: 6,
    },
    typeText: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    typeTextActive: {
      color: theme.colors.background.secondary,
    },
    moodGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    moodButton: {
      width: 80,
      height: 80,
      borderRadius: 16,
      backgroundColor: theme.colors.brown["20"],
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "transparent",
    },
    moodButtonActive: {
      backgroundColor: theme.colors.brown["70"],
      borderColor: theme.colors.brown["70"],
    },
    moodEmoji: {
      fontSize: 32,
      marginBottom: 4,
    },
    moodLabel: {
      fontSize: 11,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    moodLabelActive: {
      color: theme.colors.background.secondary,
    },
    activityGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    activityButton: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 20,
      backgroundColor: theme.colors.brown["20"],
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      borderWidth: 2,
      borderColor: "transparent",
    },
    activityButtonActive: {
      backgroundColor: theme.colors.brown["70"],
      borderColor: theme.colors.brown["70"],
    },
    activityIcon: {
      fontSize: 18,
    },
    activityText: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    activityTextActive: {
      color: theme.colors.background.secondary,
    },
    textArea: {
      backgroundColor: theme.colors.brown["20"],
      borderRadius: 16,
      padding: 16,
      fontSize: 15,
      color: theme.colors.text.primary,
      minHeight: 150,
      textAlignVertical: "top",
      fontWeight: "500",
    },
    toggleOption: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.brown["20"],
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    },
    toggleLabel: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    toggleSubtext: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.tertiary,
      marginTop: 4,
    },
    switch: {
      width: 48,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.colors.brown["30"],
      justifyContent: "center",
      paddingHorizontal: 2,
    },
    switchActive: {
      backgroundColor: theme.colors.brown["70"],
    },
    switchThumb: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: "#FFFFFF",
    },
    footer: {
      padding: 20,
      gap: 12,
    },
    postButton: {
      backgroundColor: theme.colors.brown["70"],
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: "center",
    },
    postButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.background.secondary,
    },
    draftButton: {
      backgroundColor: theme.colors.brown["20"],
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: "center",
    },
    draftButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
  });

  const toggleActivity = (label: string) => {
    if (selectedActivities.includes(label)) {
      setSelectedActivities(selectedActivities.filter((a) => a !== label));
    } else {
      setSelectedActivities([...selectedActivities, label]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ fontSize: 20 }}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Post</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Post Type */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Post Type</Text>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                postType === "story" && styles.typeButtonActive,
              ]}
              onPress={() => setPostType("story")}
            >
              <Text style={styles.typeIcon}>📖</Text>
              <Text
                style={[
                  styles.typeText,
                  postType === "story" && styles.typeTextActive,
                ]}
              >
                Story
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                postType === "question" && styles.typeButtonActive,
              ]}
              onPress={() => setPostType("question")}
            >
              <Text style={styles.typeIcon}>❓</Text>
              <Text
                style={[
                  styles.typeText,
                  postType === "question" && styles.typeTextActive,
                ]}
              >
                Question
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                postType === "poll" && styles.typeButtonActive,
              ]}
              onPress={() => setPostType("poll")}
            >
              <Text style={styles.typeIcon}>📊</Text>
              <Text
                style={[
                  styles.typeText,
                  postType === "poll" && styles.typeTextActive,
                ]}
              >
                Poll
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionSubtitle}>See All</Text>
        </View>

        {/* Select Mood */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Add Metrics</Text>
          <View style={styles.moodGrid}>
            {MOODS.map((mood) => (
              <TouchableOpacity
                key={mood.label}
                style={[
                  styles.moodButton,
                  selectedMood === mood.label && styles.moodButtonActive,
                ]}
                onPress={() => setSelectedMood(mood.label)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text
                  style={[
                    styles.moodLabel,
                    selectedMood === mood.label && styles.moodLabelActive,
                  ]}
                >
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Add Activities</Text>
          <View style={styles.activityGrid}>
            {ACTIVITIES.map((activity) => (
              <TouchableOpacity
                key={activity.label}
                style={[
                  styles.activityButton,
                  selectedActivities.includes(activity.label) &&
                    styles.activityButtonActive,
                ]}
                onPress={() => toggleActivity(activity.label)}
              >
                <Text style={styles.activityIcon}>{activity.icon}</Text>
                <Text
                  style={[
                    styles.activityText,
                    selectedActivities.includes(activity.label) &&
                      styles.activityTextActive,
                  ]}
                >
                  {activity.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Post Content */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Post Content</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Share your story, ask a question, or start a discussion..."
            placeholderTextColor={theme.colors.text.tertiary}
            value={postContent}
            onChangeText={(text) => {
              // Sanitize input to prevent XSS attacks
              const sanitized = sanitizeInput(text);
              setPostContent(sanitized);
            }}
            multiline
            maxLength={10000}
          />
        </View>

        {/* Privacy Options */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.toggleOption}
            onPress={() => setHideFromCommunity(!hideFromCommunity)}
          >
            <View>
              <Text style={styles.toggleLabel}>Hide from Community?</Text>
              <Text style={styles.toggleSubtext}>
                This post will be private
              </Text>
            </View>
            <View
              style={[styles.switch, hideFromCommunity && styles.switchActive]}
            >
              <View
                style={[
                  styles.switchThumb,
                  { alignSelf: hideFromCommunity ? "flex-end" : "flex-start" },
                ]}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleOption}
            onPress={() => setSaveAsDraft(!saveAsDraft)}
          >
            <View>
              <Text style={styles.toggleLabel}>Save As Draft</Text>
            </View>
            <View style={[styles.switch, saveAsDraft && styles.switchActive]}>
              <View
                style={[
                  styles.switchThumb,
                  { alignSelf: saveAsDraft ? "flex-end" : "flex-start" },
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.postButton}
          onPress={handleCreatePost}
          accessible
          accessibilityLabel="Create post"
          accessibilityRole="button"
          accessibilityHint="Creates and publishes your post to the community"
        >
          <Text style={styles.postButtonText}>Post →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreatePostScreen;
