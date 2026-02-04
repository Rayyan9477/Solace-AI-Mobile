/**
 * CustomAIInstructionsScreen Component
 * @description Screen for customizing AI interaction preferences
 * @task Task 3.7.13: Custom AI Instructions Screen (Screen 65)
 * @phase Phase 3C: Refactored to use theme tokens
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
import { palette } from "../../../shared/theme";

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
              placeholderTextColor={palette.gray[500]}
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
    backgroundColor: palette.brown[900],
    flexDirection: "row",
    paddingBottom: 32,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
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
    fontSize: 20,
    fontWeight: "600",
  },
  characterCount: {
    alignItems: "flex-end",
    marginTop: 8,
  },
  characterCountText: {
    color: palette.gray[500],
    fontSize: 12,
  },
  checkmark: {
    color: palette.olive[500],
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
  },
  container: {
    backgroundColor: palette.brown[900],
    flex: 1,
    paddingTop: 60,
  },
  description: {
    color: palette.gray[400],
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
    color: palette.white,
    fontSize: 18,
    fontWeight: "700",
  },
  headerTitleContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  inputContainer: {
    backgroundColor: palette.brown[800],
    borderColor: palette.brown[700],
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
  },
  instructionsInput: {
    color: palette.white,
    fontSize: 15,
    minHeight: 120,
    padding: 16,
  },
  resetButton: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderRadius: 12,
    justifyContent: "center",
    marginRight: 12,
    minHeight: 44,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  resetText: {
    color: palette.gray[400],
    fontSize: 14,
    fontWeight: "500",
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: palette.olive[500],
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
    color: palette.white,
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
    color: palette.gray[500],
    fontSize: 13,
    marginTop: 4,
  },
  sectionTitle: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "600",
  },
  styleLabel: {
    color: palette.gray[400],
    fontSize: 14,
    fontWeight: "500",
  },
  styleLabelSelected: {
    color: palette.white,
  },
  styleOption: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderColor: palette.brown[700],
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
    backgroundColor: palette.brown[700],
    borderColor: palette.olive[500],
  },
  stylesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },
  tipsContainer: {
    backgroundColor: palette.brown[800],
    borderRadius: 12,
    padding: 16,
  },
  tipsText: {
    color: palette.gray[400],
    fontSize: 13,
    lineHeight: 22,
  },
  tipsTitle: {
    color: palette.white,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  unsavedDot: {
    color: palette.onboarding.step2,
    fontSize: 10,
  },
  unsavedIndicator: {
    marginLeft: 8,
  },
});

export default CustomAIInstructionsScreen;
