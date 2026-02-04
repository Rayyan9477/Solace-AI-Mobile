/**
 * NewConversationScreen Component
 * @description Form for creating a new AI conversation with customization options
 * @task Task 3.6.4: New Conversation Screen (Screen 50)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Switch,
  StyleSheet,
  ScrollView,
} from "react-native";
import { palette } from "../../../shared/theme";

type CommunicationStyle = "casual" | "formal" | "fun";

interface ModelOption {
  id: string;
  label: string;
}

interface GoalOption {
  id: string;
  label: string;
}

interface NewConversationScreenProps {
  topicName: string;
  aiModel: string;
  selectedCheckpoints: string[];
  preferredName: string;
  selectedIcon: string;
  communicationStyle: CommunicationStyle;
  therapyGoal: string;
  isPublic: boolean;
  isCreating: boolean;
  aiModels: ModelOption[];
  checkpointOptions: string[];
  iconOptions: string[];
  goalOptions: GoalOption[];
  onBack: () => void;
  onTopicChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onCheckpointsChange: (checkpoints: string[]) => void;
  onNameChange: (value: string) => void;
  onIconChange: (icon: string) => void;
  onStyleChange: (style: CommunicationStyle) => void;
  onGoalChange: (goal: string) => void;
  onPrivacyChange: (value: boolean) => void;
  onCreate: () => void;
}

const ICON_EMOJIS: Record<string, string> = {
  icon1: "🌟",
  icon2: "🌙",
  icon3: "🌈",
  icon4: "🌿",
  icon5: "💫",
  icon6: "🎯",
};

const STYLE_ICONS: Record<CommunicationStyle, string> = {
  casual: "😊",
  formal: "👔",
  fun: "🎉",
};

export function NewConversationScreen({
  topicName,
  aiModel,
  selectedCheckpoints,
  preferredName,
  selectedIcon,
  communicationStyle,
  therapyGoal,
  isPublic,
  isCreating,
  aiModels,
  checkpointOptions,
  iconOptions,
  goalOptions,
  onBack,
  onTopicChange,
  onModelChange,
  onCheckpointsChange,
  onNameChange,
  onIconChange,
  onStyleChange,
  onGoalChange,
  onPrivacyChange,
  onCreate,
}: NewConversationScreenProps): React.ReactElement {
  const handleCheckpointToggle = (checkpoint: string) => {
    if (selectedCheckpoints.includes(checkpoint)) {
      onCheckpointsChange(selectedCheckpoints.filter((c) => c !== checkpoint));
    } else if (selectedCheckpoints.length < 3) {
      onCheckpointsChange([...selectedCheckpoints, checkpoint]);
    }
  };

  const selectedModel = aiModels.find((m) => m.id === aiModel);
  const selectedGoal = goalOptions.find((g) => g.id === therapyGoal);

  return (
    <View testID="new-conversation-screen" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonIcon}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>New Conversation</Text>
      </View>

      {/* Scrollable Form */}
      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Topic Name */}
        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Topic Name</Text>
          <TextInput
            testID="topic-name-input"
            style={styles.textInput}
            value={topicName}
            onChangeText={onTopicChange}
            placeholder="Enter conversation topic"
            placeholderTextColor={palette.gray[400]}
            accessibilityLabel="Topic name input"
          />
        </View>

        {/* AI Model */}
        <View style={styles.formSection}>
          <Text style={styles.formLabel}>AI Model</Text>
          <TouchableOpacity
            testID="ai-model-dropdown"
            style={styles.dropdown}
            onPress={() => onModelChange(aiModel)}
            accessibilityRole="button"
            accessibilityLabel="Select AI model"
          >
            <Text style={styles.dropdownText}>
              {selectedModel?.label || "Select model"}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* AI LLM Checkpoints */}
        <View style={styles.formSection}>
          <Text style={styles.formLabel}>AI LLM Checkpoints</Text>
          <Text style={styles.formHint}>Select up to 3</Text>
          <View style={styles.chipGrid}>
            {checkpointOptions.map((checkpoint) => (
              <TouchableOpacity
                key={checkpoint}
                testID={`checkpoint-${checkpoint}`}
                style={[
                  styles.chip,
                  selectedCheckpoints.includes(checkpoint) &&
                    styles.chipSelected,
                ]}
                onPress={() => handleCheckpointToggle(checkpoint)}
                accessibilityRole="checkbox"
                accessibilityState={{
                  checked: selectedCheckpoints.includes(checkpoint),
                }}
                accessibilityLabel={`${checkpoint} checkpoint`}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedCheckpoints.includes(checkpoint) &&
                      styles.chipTextSelected,
                  ]}
                >
                  {checkpoint}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preferred Name */}
        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Preferred Name</Text>
          <TextInput
            testID="preferred-name-input"
            style={styles.textInput}
            value={preferredName}
            onChangeText={onNameChange}
            placeholder="How should AI address you?"
            placeholderTextColor={palette.gray[400]}
            accessibilityLabel="Preferred name input"
          />
        </View>

        {/* Conversation Icon */}
        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Conversation Icon</Text>
          <View style={styles.iconRow}>
            {iconOptions.map((icon) => (
              <TouchableOpacity
                key={icon}
                testID={`icon-option-${icon}`}
                style={[
                  styles.iconOption,
                  selectedIcon === icon && styles.iconOptionSelected,
                ]}
                onPress={() => onIconChange(icon)}
                accessibilityRole="radio"
                accessibilityState={{ selected: selectedIcon === icon }}
                accessibilityLabel={`Select icon ${icon}`}
              >
                <Text style={styles.iconEmoji}>
                  {ICON_EMOJIS[icon] || "⭐"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Communication Style */}
        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Communication Style</Text>
          <View style={styles.styleRow}>
            {(["casual", "formal", "fun"] as CommunicationStyle[]).map(
              (style) => (
                <TouchableOpacity
                  key={style}
                  testID={`style-${style}`}
                  style={[
                    styles.styleChip,
                    communicationStyle === style && styles.styleChipSelected,
                  ]}
                  onPress={() => onStyleChange(style)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: communicationStyle === style }}
                  accessibilityLabel={`${style} communication style`}
                >
                  <Text style={styles.styleIcon}>{STYLE_ICONS[style]}</Text>
                  <Text
                    style={[
                      styles.styleText,
                      communicationStyle === style && styles.styleTextSelected,
                    ]}
                  >
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </View>

        {/* Therapy Goals */}
        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Therapy Goals</Text>
          <TouchableOpacity
            testID="therapy-goals-dropdown"
            style={styles.dropdown}
            onPress={() => onGoalChange(therapyGoal)}
            accessibilityRole="button"
            accessibilityLabel="Select therapy goal"
          >
            <Text style={styles.dropdownText}>
              {selectedGoal?.label || "Select goal"}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Privacy & Security */}
        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Privacy & Security</Text>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Make Chat Public</Text>
            <Switch
              testID="privacy-toggle"
              value={isPublic}
              onValueChange={onPrivacyChange}
              trackColor={{ false: palette.brown[700], true: palette.olive[500] }}
              thumbColor={isPublic ? palette.white : palette.gray[400]}
              accessibilityLabel="Make chat public toggle"
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer - Create Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          testID="create-button"
          style={styles.createButton}
          onPress={onCreate}
          disabled={isCreating}
          accessibilityRole="button"
          accessibilityLabel="Create new conversation"
          accessibilityState={{ disabled: isCreating }}
        >
          <Text style={styles.createButtonText}>
            {isCreating ? "Creating..." : "Create Conversation"}
          </Text>
          <Text testID="create-button-icon" style={styles.createButtonIcon}>
            🔒
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    borderColor: palette.brown[700],
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 40,
  },
  backButtonIcon: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "600",
  },
  chip: {
    backgroundColor: palette.brown[800],
    borderRadius: 16,
    marginBottom: 8,
    marginRight: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  chipSelected: {
    backgroundColor: palette.olive[500],
  },
  chipText: {
    color: palette.white,
    fontSize: 14,
  },
  chipTextSelected: {
    fontWeight: "600",
  },
  container: {
    backgroundColor: palette.brown[900],
    flex: 1,
    paddingTop: 60,
  },
  createButton: {
    alignItems: "center",
    backgroundColor: palette.olive[500],
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 56,
    paddingHorizontal: 24,
    paddingVertical: 16,
    width: "100%",
  },
  createButtonIcon: {
    fontSize: 18,
    marginLeft: 8,
  },
  createButtonText: {
    color: palette.brown[900],
    fontSize: 16,
    fontWeight: "600",
  },
  dropdown: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownIcon: {
    color: palette.gray[400],
    fontSize: 12,
  },
  dropdownText: {
    color: palette.white,
    fontSize: 14,
  },
  footer: {
    paddingBottom: 32,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  formHint: {
    color: palette.gray[400],
    fontSize: 12,
    marginTop: 4,
  },
  formLabel: {
    color: palette.white,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  formSection: {
    marginBottom: 24,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  iconEmoji: {
    fontSize: 24,
  },
  iconOption: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderRadius: 28,
    height: 56,
    justifyContent: "center",
    marginRight: 12,
    width: 56,
  },
  iconOptionSelected: {
    borderColor: palette.tan[500],
    borderWidth: 2,
  },
  iconRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  screenTitle: {
    color: palette.white,
    fontSize: 24,
    fontWeight: "700",
    marginTop: 16,
  },
  styleChip: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderRadius: 16,
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
  },
  styleChipSelected: {
    backgroundColor: palette.olive[500],
  },
  styleIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  styleRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  styleText: {
    color: palette.white,
    fontSize: 12,
  },
  styleTextSelected: {
    fontWeight: "600",
  },
  textInput: {
    backgroundColor: palette.brown[800],
    borderRadius: 12,
    color: palette.white,
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  toggleLabel: {
    color: palette.white,
    fontSize: 14,
  },
  toggleRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default NewConversationScreen;
