/**
 * JournalEntryEditorScreen Component
 * @screen Screen 85: Journal Entry Editor
 * @audit batch-18-journal-final-sleep-start.md
 * @phase Phase 3C: Refactored to use theme tokens
 *
 * Visual ref: Mental_Health_Journal_Screen_08.png
 * - "Edit Journal" header with back button
 * - Large entry title + emoji ("Feeling Bad Again! 😡")
 * - Multi-paragraph editable content with keyword highlight (green)
 * - Undo (green) / Redo (brown) circular buttons
 * - "Tap to continue your journal!" prompt
 * - Bottom toolbar: Home (orange), Edit, Share, Settings
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { palette } from "../../../shared/theme";

interface JournalEntryEditorScreenProps {
  title: string;
  titleEmoji: string;
  content: string;
  highlightedText: string;
  onBack: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onHome: () => void;
  onEdit: () => void;
  onShare: () => void;
  onSettings: () => void;
}

export function JournalEntryEditorScreen({
  title,
  titleEmoji,
  content,
  highlightedText,
  onBack,
  onUndo,
  onRedo,
  onHome,
  onEdit,
  onShare,
  onSettings,
}: JournalEntryEditorScreenProps): React.ReactElement {
  /** Split content around the highlighted phrase for rendering */
  const renderContent = () => {
    if (!highlightedText || !content.includes(highlightedText)) {
      return <Text style={styles.contentText}>{content}</Text>;
    }

    const parts = content.split(highlightedText);
    return (
      <Text style={styles.contentText}>
        {parts[0]}
        <Text testID="text-highlight" style={styles.highlight}>
          {highlightedText}
        </Text>
        {parts[1]}
      </Text>
    );
  };

  return (
    <View testID="journal-entry-editor-screen" style={styles.container}>
      <ScrollView
        style={styles.scrollArea}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            testID="back-button"
            style={styles.backButton}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backIcon}>☽</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Journal</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Entry Title */}
        <Text style={styles.entryTitle}>
          {title} {titleEmoji}
        </Text>

        {/* Entry Content */}
        <View style={styles.contentContainer}>{renderContent()}</View>

        {/* Undo / Redo */}
        <View style={styles.editActions}>
          <TouchableOpacity
            testID="undo-button"
            style={[styles.actionButton, { backgroundColor: palette.olive[500] }]}
            onPress={onUndo}
            accessibilityRole="button"
            accessibilityLabel="Undo"
          >
            <Text style={styles.actionIcon}>↶</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="redo-button"
            style={[styles.actionButton, { backgroundColor: palette.brown[700] }]}
            onPress={onRedo}
            accessibilityRole="button"
            accessibilityLabel="Redo"
          >
            <Text style={styles.actionIcon}>↷</Text>
          </TouchableOpacity>
        </View>

        {/* Prompt */}
        <Text style={styles.promptText}>Tap to continue your journal!</Text>
      </ScrollView>

      {/* Bottom Toolbar */}
      <View testID="bottom-toolbar" style={styles.toolbar}>
        <TouchableOpacity
          testID="toolbar-home"
          style={[styles.toolbarButton, { backgroundColor: palette.onboarding.step2 }]}
          onPress={onHome}
          accessibilityRole="button"
          accessibilityLabel="Go to home"
        >
          <Text style={styles.toolbarIcon}>🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="toolbar-edit"
          style={styles.toolbarButton}
          onPress={onEdit}
          accessibilityRole="button"
          accessibilityLabel="Edit entry"
        >
          <Text style={styles.toolbarIcon}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="toolbar-share"
          style={styles.toolbarButton}
          onPress={onShare}
          accessibilityRole="button"
          accessibilityLabel="Share entry"
        >
          <Text style={styles.toolbarIcon}>↑</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="toolbar-settings"
          style={styles.toolbarButton}
          onPress={onSettings}
          accessibilityRole="button"
          accessibilityLabel="Journal settings"
        >
          <Text style={styles.toolbarIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: "center",
    borderRadius: 28,
    height: 56,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 56,
  },
  actionIcon: {
    color: palette.white,
    fontSize: 24,
  },
  backButton: {
    alignItems: "center",
    borderColor: `${palette.white}${palette.alpha[30]}`,
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 44,
  },
  backIcon: { color: palette.white, fontSize: 22 },
  container: {
    backgroundColor: palette.brown[900],
    flex: 1,
  },
  contentContainer: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  contentText: {
    color: palette.white,
    fontSize: 18,
    lineHeight: 28,
  },
  editActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 32,
    paddingHorizontal: 24,
  },
  entryTitle: {
    color: palette.white,
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 40,
    marginTop: 32,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  headerSpacer: { width: 44 },
  headerTitle: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "600",
  },
  highlight: {
    backgroundColor: palette.olive[500],
    borderRadius: 4,
    color: palette.white,
    fontWeight: "600",
  },
  promptText: {
    color: palette.gray[400],
    fontSize: 14,
    marginTop: 24,
    paddingHorizontal: 24,
    textAlign: "center",
  },
  scrollArea: {
    flex: 1,
  },
  toolbar: {
    backgroundColor: palette.brown[800],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 34,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  toolbarButton: {
    alignItems: "center",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 48,
  },
  toolbarIcon: {
    color: palette.white,
    fontSize: 20,
  },
});

export default JournalEntryEditorScreen;
