/**
 * TextJournalComposerScreen Component
 * @screen Screen 83: Text Journal Composer
 * @audit batch-17-journal-continued.md
 * @phase Phase 3D: Integrated CrisisModal for crisis keyword detection
 *
 * Visual ref: Mental_Health_Journal_Screen_06.png
 * - "Add New Journal" title, Text/Voice tabs
 * - Journal title input, entry textarea with undo/redo
 * - Stress level slider (1-5), emotion selector, stressor chips
 * - "Create Journal +" CTA
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { CrisisModal } from "../../../shared/components/organisms/crisis";

const colors = {
  screenBg: "#1C1410",
  white: "#FFFFFF",
  subtitle: "#94A3B8",
  cardBg: "#2A1F19",
  cardBorder: "#3D2E23",
  tabActiveBg: "#3D2E23",
  tabInactiveBg: "transparent",
  tabActiveText: "#FFFFFF",
  tabInactiveText: "#94A3B8",
  sliderTrack: "#3D2E23",
  sliderFill: "#9AAD5C",
  emotionSelectedBorder: "#9AAD5C",
  stressorSelectedBg: "#9AAD5C",
  stressorDefaultBg: "transparent",
  stressorBorder: "#3D2E23",
  ctaBg: "#8B6914",
  undoBg: "#3D2E23",
  redoBg: "#3D2E23",
  highlightBg: "#E8853A",
  backBtnBorder: "rgba(255,255,255,0.3)",
} as const;

interface Emotion {
  id: string;
  emoji: string;
  selected: boolean;
}

interface Stressor {
  id: string;
  label: string;
  selected: boolean;
}

interface TextJournalComposerScreenProps {
  activeTab: "text" | "voice";
  title: string;
  content: string;
  stressLevel: number;
  emotions: Emotion[];
  stressors: Stressor[];
  crisisDetected?: boolean; // Crisis keywords detected in journal content
  onBack: () => void;
  onTitleChange: (text: string) => void;
  onContentChange: (text: string) => void;
  onStressLevelChange: (value: number) => void;
  onEmotionSelect: (id: string) => void;
  onStressorSelect: (id: string) => void;
  onCreate: () => void;
  onTabChange: (tab: "text" | "voice") => void;
  onUndo: () => void;
  onRedo: () => void;
}

export function TextJournalComposerScreen({
  activeTab,
  title,
  content,
  stressLevel,
  emotions,
  stressors,
  crisisDetected = false,
  onBack,
  onEmotionSelect,
  onStressorSelect,
  onCreate,
  onTabChange,
  onUndo,
  onRedo,
}: TextJournalComposerScreenProps): React.ReactElement {
  const [showCrisisModal, setShowCrisisModal] = useState(false);

  const handleAccessCrisisSupport = (): void => {
    setShowCrisisModal(true);
  };

  return (
    <View testID="text-journal-composer-screen" style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>☽</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.screenTitle}>Add New Journal</Text>

        {/* Tab Selector */}
        <View testID="tab-selector" style={styles.tabSelector}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "text" && styles.tabActive]}
            onPress={() => onTabChange("text")}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "text" && styles.tabTextActive,
              ]}
            >
              Text
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "voice" && styles.tabActive]}
            onPress={() => onTabChange("voice")}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "voice" && styles.tabTextActive,
              ]}
            >
              Voice
            </Text>
          </TouchableOpacity>
        </View>

        {/* Crisis Alert Banner - Shows when crisis keywords detected */}
        {crisisDetected && (
          <View testID="crisis-alert-banner" style={styles.crisisAlertBanner}>
            <View style={styles.crisisAlertContent}>
              <Text style={styles.crisisAlertIcon}>❤️‍🩹</Text>
              <View style={styles.crisisAlertText}>
                <Text style={styles.crisisAlertTitle}>Support Available</Text>
                <Text style={styles.crisisAlertDescription}>
                  We noticed you might need immediate support
                </Text>
              </View>
            </View>
            <TouchableOpacity
              testID="crisis-support-banner-button"
              style={styles.crisisAlertButton}
              onPress={handleAccessCrisisSupport}
              accessibilityRole="button"
              accessibilityLabel="Access crisis support resources"
            >
              <Text style={styles.crisisAlertButtonText}>Get Help Now</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Journal Title */}
        <Text style={styles.fieldLabel}>Journal Title</Text>
        <View style={styles.titleInput}>
          <Text style={styles.titleIcon}>📝</Text>
          <Text style={styles.titleValue}>{title}</Text>
        </View>

        {/* Write Your Entry */}
        <Text style={styles.fieldLabel}>Write Your Entry</Text>
        <View style={styles.entryBox}>
          <Text style={styles.entryContent}>{content}</Text>

          {/* Undo / Redo */}
          <View style={styles.editActions}>
            <TouchableOpacity
              testID="undo-button"
              style={styles.editButton}
              onPress={onUndo}
              accessibilityRole="button"
              accessibilityLabel="Undo"
            >
              <Text style={styles.editIcon}>↶</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="redo-button"
              style={[styles.editButton, { backgroundColor: colors.redoBg }]}
              onPress={onRedo}
              accessibilityRole="button"
              accessibilityLabel="Redo"
            >
              <Text style={styles.editIcon}>↷</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stress Level */}
        <Text style={styles.fieldLabel}>Stress Level</Text>
        <View style={styles.sliderContainer}>
          <View style={styles.sliderTrack}>
            <View
              style={[
                styles.sliderFill,
                { width: `${((stressLevel - 1) / 4) * 100}%` },
              ]}
            />
          </View>
          <View style={styles.scaleLabels}>
            <Text style={styles.scaleLabel}>1</Text>
            <Text style={styles.scaleLabel}>3</Text>
            <Text style={styles.scaleLabel}>5</Text>
          </View>
        </View>

        {/* Select Your Emotion */}
        <Text style={styles.fieldLabel}>Select Your Emotion</Text>
        <View style={styles.emotionRow}>
          {emotions.map((emotion) => (
            <TouchableOpacity
              key={emotion.id}
              testID={`emotion-${emotion.id}`}
              style={[
                styles.emotionCircle,
                emotion.selected && styles.emotionSelected,
              ]}
              onPress={() => onEmotionSelect(emotion.id)}
              accessibilityRole="button"
              accessibilityLabel={`Select ${emotion.id} emotion`}
            >
              <Text style={styles.emotionEmoji}>{emotion.emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Select Stressor */}
        <Text style={styles.fieldLabel}>Select Stressor</Text>
        <View style={styles.stressorRow}>
          {stressors.map((stressor) => (
            <TouchableOpacity
              key={stressor.id}
              testID={`stressor-${stressor.id}`}
              style={[
                styles.stressorChip,
                stressor.selected && styles.stressorChipSelected,
              ]}
              onPress={() => onStressorSelect(stressor.id)}
              accessibilityRole="button"
              accessibilityLabel={`Select ${stressor.label} stressor`}
            >
              <Text
                style={[
                  styles.stressorText,
                  stressor.selected && styles.stressorTextSelected,
                ]}
              >
                {stressor.label}
              </Text>
              <View
                style={[
                  styles.radioOuter,
                  stressor.selected && styles.radioOuterSelected,
                ]}
              >
                {stressor.selected && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Create Journal Button */}
        <TouchableOpacity
          testID="create-journal-button"
          style={styles.ctaButton}
          onPress={onCreate}
          accessibilityRole="button"
          accessibilityLabel="Create journal"
        >
          <Text style={styles.ctaText}>Create Journal  +</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Crisis Modal */}
      <CrisisModal
        visible={showCrisisModal}
        onDismiss={() => setShowCrisisModal(false)}
        triggerSource="journal"
        requireAcknowledge={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    borderColor: colors.backBtnBorder,
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 44,
  },
  backIcon: { color: colors.white, fontSize: 22 },
  container: {
    backgroundColor: colors.screenBg,
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  crisisAlertBanner: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderColor: "rgba(239, 68, 68, 0.3)",
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 16,
    padding: 16,
  },
  crisisAlertButton: {
    alignItems: "center",
    backgroundColor: "#EF4444",
    borderRadius: 8,
    justifyContent: "center",
    marginTop: 12,
    minHeight: 44,
    paddingVertical: 10,
  },
  crisisAlertButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  crisisAlertContent: {
    alignItems: "center",
    flexDirection: "row",
  },
  crisisAlertDescription: {
    color: "#FCA5A5",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  crisisAlertIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  crisisAlertText: {
    flex: 1,
  },
  crisisAlertTitle: {
    color: "#FCA5A5",
    fontSize: 15,
    fontWeight: "600",
  },
  ctaButton: {
    alignItems: "center",
    backgroundColor: colors.ctaBg,
    borderRadius: 16,
    marginBottom: 40,
    marginTop: 24,
    minHeight: 44,
    paddingVertical: 16,
  },
  ctaText: { color: colors.white, fontSize: 16, fontWeight: "700" },
  editActions: { flexDirection: "row", gap: 12, marginTop: 12 },
  editButton: {
    alignItems: "center",
    backgroundColor: colors.undoBg,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 40,
  },
  editIcon: { color: colors.white, fontSize: 18 },
  emotionCircle: {
    alignItems: "center",
    borderColor: "transparent",
    borderRadius: 28,
    borderWidth: 2,
    height: 56,
    justifyContent: "center",
    width: 56,
  },
  emotionEmoji: { fontSize: 28 },
  emotionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  emotionSelected: { borderColor: colors.emotionSelectedBorder },
  entryBox: {
    backgroundColor: colors.cardBg,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
    padding: 16,
  },
  entryContent: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 24,
  },
  fieldLabel: {
    color: colors.subtitle,
    fontSize: 13,
    fontWeight: "500",
    marginTop: 20,
  },
  radioInner: {
    backgroundColor: colors.white,
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  radioOuter: {
    alignItems: "center",
    borderColor: colors.stressorBorder,
    borderRadius: 10,
    borderWidth: 2,
    height: 20,
    justifyContent: "center",
    marginLeft: 8,
    width: 20,
  },
  radioOuterSelected: { borderColor: colors.white },
  scaleLabel: { color: colors.subtitle, fontSize: 12 },
  scaleLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  screenTitle: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "700",
    marginTop: 20,
  },
  sliderContainer: { marginTop: 12 },
  sliderFill: {
    backgroundColor: colors.sliderFill,
    borderRadius: 3,
    height: 6,
    left: 0,
    position: "absolute",
    top: 0,
  },
  sliderTrack: {
    backgroundColor: colors.sliderTrack,
    borderRadius: 3,
    height: 6,
    position: "relative",
  },
  stressorChip: {
    alignItems: "center",
    borderColor: colors.stressorBorder,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    marginRight: 8,
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  stressorChipSelected: {
    backgroundColor: colors.stressorSelectedBg,
    borderColor: colors.stressorSelectedBg,
  },
  stressorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  stressorText: { color: colors.subtitle, fontSize: 14 },
  stressorTextSelected: { color: colors.white, fontWeight: "600" },
  tab: {
    alignItems: "center",
    backgroundColor: colors.tabInactiveBg,
    borderRadius: 20,
    flex: 1,
    paddingVertical: 10,
  },
  tabActive: { backgroundColor: colors.tabActiveBg },
  tabSelector: {
    backgroundColor: colors.cardBg,
    borderRadius: 24,
    flexDirection: "row",
    marginTop: 16,
    padding: 4,
  },
  tabText: { color: colors.tabInactiveText, fontSize: 14, fontWeight: "600" },
  tabTextActive: { color: colors.tabActiveText },
  titleIcon: { fontSize: 18, marginRight: 8 },
  titleInput: {
    alignItems: "center",
    backgroundColor: colors.cardBg,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    marginTop: 8,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  titleValue: { color: colors.white, flex: 1, fontSize: 16 },
});

export default TextJournalComposerScreen;
