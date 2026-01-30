/**
 * CustomAIInstructionsScreen Component
 * @description Screen for customizing AI interaction preferences
 * @task Task 3.7.13: Custom AI Instructions Screen (Screen 65)
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";

interface CommunicationStyle {
  id: string;
  label: string;
  selected: boolean;
}

interface CustomAIInstructionsScreenProps {
  customInstructions: string;
  communicationStyles: CommunicationStyle[];
  hasUnsavedChanges: boolean;
  onBack: () => void;
  onSave: () => void;
  onInstructionsChange: (text: string) => void;
  onStyleChange: (styleId: string) => void;
  onReset: () => void;
}

const MAX_INSTRUCTIONS_LENGTH = 500;

export function CustomAIInstructionsScreen({
  customInstructions,
  communicationStyles,
  hasUnsavedChanges,
  onBack,
  onSave,
  onInstructionsChange,
  onStyleChange,
  onReset,
}: CustomAIInstructionsScreenProps): React.ReactElement {
  return (
    <View testID="custom-ai-instructions-screen" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Custom Instructions</Text>
          {hasUnsavedChanges && (
            <View testID="unsaved-indicator" style={styles.unsavedIndicator}>
              <Text style={styles.unsavedDot}>●</Text>
            </View>
          )}
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Description */}
        <Text style={styles.description}>
          Customize how Solace AI interacts with you. Add specific instructions
          or preferences to personalize your experience.
        </Text>

        {/* Instructions Input Section */}
        <View testID="instructions-section" style={styles.section}>
          <Text style={styles.sectionTitle}>Your Instructions</Text>
          <Text style={styles.sectionSubtitle}>
            Tell Solace AI what to focus on or how to respond to you
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              testID="instructions-input"
              style={styles.instructionsInput}
              value={customInstructions}
              onChangeText={onInstructionsChange}
              placeholder="e.g., Focus on my anxiety management, use simple language, remind me to breathe..."
              placeholderTextColor="#64748B"
              multiline
              maxLength={MAX_INSTRUCTIONS_LENGTH}
              textAlignVertical="top"
              accessibilityLabel="Custom instructions input"
            />
          </View>

          <View testID="character-count" style={styles.characterCount}>
            <Text style={styles.characterCountText}>
              {customInstructions.length}/{MAX_INSTRUCTIONS_LENGTH}
            </Text>
          </View>
        </View>

        {/* Communication Style Section */}
        <View testID="style-section" style={styles.section}>
          <Text style={styles.sectionTitle}>Communication Style</Text>
          <Text style={styles.sectionSubtitle}>
            Select the styles that best suit your preferences
          </Text>

          <View style={styles.stylesGrid}>
            {communicationStyles.map((style) => (
              <TouchableOpacity
                key={style.id}
                testID={`style-option-${style.id}`}
                style={[
                  styles.styleOption,
                  style.selected && styles.styleOptionSelected,
                ]}
                onPress={() => onStyleChange(style.id)}
                accessibilityRole="button"
                accessibilityLabel={`${style.label} style ${style.selected ? "selected" : ""}`}
                accessibilityState={{ selected: style.selected }}
              >
                <Text
                  style={[
                    styles.styleLabel,
                    style.selected && styles.styleLabelSelected,
                  ]}
                >
                  {style.label}
                </Text>
                {style.selected && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Tips</Text>
          <Text style={styles.tipsText}>
            • Be specific about your goals and preferences{"\n"}
            • Mention topics you want to focus on{"\n"}
            • Include any communication preferences
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          testID="reset-button"
          style={styles.resetButton}
          onPress={onReset}
          accessibilityRole="button"
          accessibilityLabel="Reset to defaults"
        >
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="save-button"
          style={[
            styles.saveButton,
            !hasUnsavedChanges && styles.saveButtonDisabled,
          ]}
          onPress={onSave}
          accessibilityRole="button"
          accessibilityLabel="Save instructions"
        >
          <Text style={styles.saveButtonText}>Save Instructions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionContainer: {
    backgroundColor: "#1C1410",
    flexDirection: "row",
    paddingBottom: 32,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  backButton: {
    alignItems: "center",
    borderColor: "#3D2E23",
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 40,
  },
  backButtonIcon: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
  characterCount: {
    alignItems: "flex-end",
    marginTop: 8,
  },
  characterCountText: {
    color: "#64748B",
    fontSize: 12,
  },
  checkmark: {
    color: "#9AAD5C",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
  },
  container: {
    backgroundColor: "#1C1410",
    flex: 1,
    paddingTop: 60,
  },
  description: {
    color: "#94A3B8",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  headerTitleContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  inputContainer: {
    backgroundColor: "#2A1F19",
    borderColor: "#3D2E23",
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
  },
  instructionsInput: {
    color: "#FFFFFF",
    fontSize: 15,
    minHeight: 120,
    padding: 16,
  },
  resetButton: {
    alignItems: "center",
    backgroundColor: "#2A1F19",
    borderRadius: 12,
    justifyContent: "center",
    marginRight: 12,
    minHeight: 44,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  resetText: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "500",
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: "#9AAD5C",
    borderRadius: 12,
    flex: 1,
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 12,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  scrollContent: {
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionSubtitle: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 4,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  styleLabel: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "500",
  },
  styleLabelSelected: {
    color: "#FFFFFF",
  },
  styleOption: {
    alignItems: "center",
    backgroundColor: "#2A1F19",
    borderColor: "#3D2E23",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
    marginRight: 8,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  styleOptionSelected: {
    backgroundColor: "#3D2E23",
    borderColor: "#9AAD5C",
  },
  stylesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },
  tipsContainer: {
    backgroundColor: "#2A1F19",
    borderRadius: 12,
    padding: 16,
  },
  tipsText: {
    color: "#94A3B8",
    fontSize: 13,
    lineHeight: 22,
  },
  tipsTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  unsavedDot: {
    color: "#E8853A",
    fontSize: 10,
  },
  unsavedIndicator: {
    marginLeft: 8,
  },
});

export default CustomAIInstructionsScreen;
