/**
 * New Conversation Screen - Setup New AI Therapy Chat
 * Configure AI model, conversation style, and therapy goals
 */

import { MentalHealthIcon } from "@components/icons";
import { useTheme } from "@theme/ThemeProvider";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Switch,
} from "react-native";

type AIModel = "gpt-4" | "gpt-3-5" | "claude" | "palm2";
type ConversationStyle = "casual" | "formal" | "fun";

export const NewConversationScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const [topicName, setTopicName] = useState("");
  const [aiModel, setAIModel] = useState<AIModel>("gpt-4");
  const [warmingMode, setWarmingMode] = useState(true);
  const [startedModel, setStartedModel] = useState(true);
  const [conversationStyle, setConversationStyle] =
    useState<ConversationStyle>("casual");
  const [therapyGoal, setTherapyGoal] = useState<string>("stress");
  const [makeChatPublic, setMakeChatPublic] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 20,
      paddingTop: 8,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
    saveButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 120,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    inputWrapper: {
      borderWidth: 1.5,
      borderColor: theme.colors.border.primary,
      borderRadius: 24,
      backgroundColor: theme.colors.background.secondary,
      paddingHorizontal: 20,
      paddingVertical: 14,
      flexDirection: "row",
      alignItems: "center",
    },
    inputIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text.primary,
      paddingVertical: 0,
    },
    dropdown: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1.5,
      borderColor: theme.colors.border.primary,
      borderRadius: 24,
      backgroundColor: theme.colors.background.secondary,
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    dropdownLabel: {
      fontSize: 16,
      color: theme.colors.text.primary,
      fontWeight: "500",
    },
    modelGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    modelCard: {
      flex: 1,
      minWidth: "47%",
      borderWidth: 1.5,
      borderColor: theme.colors.border.primary,
      borderRadius: 16,
      padding: 16,
      backgroundColor: theme.colors.background.secondary,
    },
    modelCardSelected: {
      borderColor: theme.colors.green["40"],
      backgroundColor: theme.colors.green["10"],
    },
    modelIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
    modelName: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    modelSelected: {
      color: theme.colors.green["60"],
    },
    modelDescription: {
      fontSize: 11,
      color: theme.colors.text.secondary,
    },
    checkIcon: {
      position: "absolute",
      top: 8,
      right: 8,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.colors.green["40"],
      justifyContent: "center",
      alignItems: "center",
    },
    conversationStyleContainer: {
      flexDirection: "row",
      gap: 12,
    },
    styleChip: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 24,
      borderWidth: 1.5,
      borderColor: theme.colors.border.primary,
      backgroundColor: theme.colors.background.secondary,
    },
    styleChipSelected: {
      backgroundColor: theme.colors.orange["40"],
      borderColor: theme.colors.orange["40"],
    },
    styleChipText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    styleChipTextSelected: {
      color: "#FFFFFF",
    },
    settingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    settingLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: theme.colors.text.primary,
    },
    goalContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    goalChip: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: theme.colors.background.secondary,
      borderWidth: 1.5,
      borderColor: theme.colors.border.primary,
    },
    goalChipSelected: {
      backgroundColor: theme.colors.green["20"],
      borderColor: theme.colors.green["40"],
    },
    goalChipText: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text.secondary,
      marginLeft: 6,
    },
    goalChipTextSelected: {
      color: theme.colors.green["60"],
    },
    createButton: {
      position: "absolute",
      bottom: 24,
      left: 20,
      right: 20,
      backgroundColor: theme.colors.orange["40"],
      borderRadius: 24,
      paddingVertical: 16,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      ...theme.getShadow("lg"),
    },
    createButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#FFFFFF",
      marginLeft: 8,
    },
  });

  const aiModels = [
    {
      id: "gpt-4",
      name: "GPT-4",
      description: "Most advanced",
      icon: "🧠",
      color: theme.colors.green["20"],
    },
    {
      id: "gpt-3-5",
      name: "GPT-3.5",
      description: "Fast & efficient",
      icon: "⚡",
      color: theme.colors.blue["20"],
    },
    {
      id: "claude",
      name: "Claude",
      description: "Thoughtful",
      icon: "🎭",
      color: theme.colors.purple["20"],
    },
    {
      id: "palm2",
      name: "PaLM2",
      description: "Balanced",
      icon: "🌴",
      color: theme.colors.yellow["20"],
    },
  ];

  const therapyGoals = [
    { id: "stress", label: "Reduce Stress Level", icon: "😤" },
    { id: "anxiety", label: "Manage Anxiety", icon: "😰" },
    { id: "depression", label: "Combat Depression", icon: "😢" },
    { id: "sleep", label: "Improve Sleep", icon: "😴" },
    { id: "relationships", label: "Better Relationships", icon: "❤️" },
    { id: "productivity", label: "Boost Productivity", icon: "💪" },
  ];

  const handleCreate = () => {
    navigation.navigate("Chat", {
      topicName,
      aiModel,
      conversationStyle,
      therapyGoal,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={theme.isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MentalHealthIcon
            name="ChevronLeft"
            size={24}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>New Conversation</Text>

        <TouchableOpacity style={styles.saveButton}>
          <MentalHealthIcon
            name="MoreVertical"
            size={24}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Topic Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Topic Name</Text>
          <View style={styles.inputWrapper}>
            <MentalHealthIcon
              name="AlertCircle"
              size={20}
              color={theme.colors.text.tertiary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              value={topicName}
              onChangeText={setTopicName}
              placeholder="Worrying Life Choices, I'm Sad"
              placeholderTextColor={theme.colors.text.tertiary}
            />
          </View>
        </View>

        {/* AI Model */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Model</Text>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownLabel}>doctor_ai_v2.0RE_v1.v17</Text>
            <MentalHealthIcon
              name="ChevronDown"
              size={20}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>
        </View>

        {/* AI LLM Chatbots */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI LLM Chatbots</Text>
          <View style={styles.modelGrid}>
            {aiModels.map((model) => (
              <TouchableOpacity
                key={model.id}
                style={[
                  styles.modelCard,
                  aiModel === model.id && styles.modelCardSelected,
                ]}
                onPress={() => setAIModel(model.id as AIModel)}
              >
                <View
                  style={[styles.modelIcon, { backgroundColor: model.color }]}
                >
                  <Text style={{ fontSize: 24 }}>{model.icon}</Text>
                </View>
                <Text
                  style={[
                    styles.modelName,
                    aiModel === model.id && styles.modelSelected,
                  ]}
                >
                  {model.name}
                </Text>
                <Text style={styles.modelDescription}>{model.description}</Text>
                {aiModel === model.id && (
                  <View style={styles.checkIcon}>
                    <Text style={{ color: "#FFFFFF", fontSize: 12 }}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preferred Users */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Users</Text>
          <View style={styles.dropdown}>
            <Text style={styles.dropdownLabel}>Select up to 10 Attendees</Text>
            <MentalHealthIcon
              name="ChevronDown"
              size={20}
              color={theme.colors.text.primary}
            />
          </View>
        </View>

        {/* Conversation Icon */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conversation Icon</Text>
          <View style={styles.goalContainer}>
            {/* LOW-NEW-002 FIX: Use emoji as stable key instead of index */}
            {["😀", "🤔", "😌", "😊"].map((emoji) => (
              <TouchableOpacity key={`emoji-${emoji}`} style={styles.goalChip}>
                <Text style={{ fontSize: 20 }}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Conversation Style */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conversation Style</Text>
          <View style={styles.conversationStyleContainer}>
            <TouchableOpacity
              style={[
                styles.styleChip,
                conversationStyle === "casual" && styles.styleChipSelected,
              ]}
              onPress={() => setConversationStyle("casual")}
            >
              <Text
                style={[
                  styles.styleChipText,
                  conversationStyle === "casual" &&
                    styles.styleChipTextSelected,
                ]}
              >
                🙂 Casual
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.styleChip,
                conversationStyle === "formal" && styles.styleChipSelected,
              ]}
              onPress={() => setConversationStyle("formal")}
            >
              <Text
                style={[
                  styles.styleChipText,
                  conversationStyle === "formal" &&
                    styles.styleChipTextSelected,
                ]}
              >
                👔 Formal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.styleChip,
                conversationStyle === "fun" && styles.styleChipSelected,
              ]}
              onPress={() => setConversationStyle("fun")}
            >
              <Text
                style={[
                  styles.styleChipText,
                  conversationStyle === "fun" && styles.styleChipTextSelected,
                ]}
              >
                🎉 Fun
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Therapy Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Therapy Goals</Text>
          <View style={styles.goalContainer}>
            {therapyGoals.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.goalChip,
                  therapyGoal === goal.id && styles.goalChipSelected,
                ]}
                onPress={() => setTherapyGoal(goal.id)}
              >
                <Text style={{ fontSize: 16 }}>{goal.icon}</Text>
                <Text
                  style={[
                    styles.goalChipText,
                    therapyGoal === goal.id && styles.goalChipTextSelected,
                  ]}
                >
                  {goal.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Privacy & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Make Chat Public</Text>
            <Switch
              value={makeChatPublic}
              onValueChange={setMakeChatPublic}
              trackColor={{
                false: theme.colors.border.primary,
                true: theme.colors.green["40"],
              }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </ScrollView>

      {/* Create Button */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreate}
        disabled={!topicName.trim()}
      >
        <MentalHealthIcon name="Plus" size={24} color="#FFFFFF" />
        <Text style={styles.createButtonText}>Create Conversation</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// LOW-NEW-001 FIX: Add displayName for debugging
NewConversationScreen.displayName = 'NewConversationScreen';

export default NewConversationScreen;
