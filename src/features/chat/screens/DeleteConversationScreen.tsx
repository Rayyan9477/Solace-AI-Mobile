/**
 * DeleteConversationScreen Component
 * @description Confirmation screen for deleting a conversation
 * @task Task 3.7.14: Delete Conversation Screen (Screen 66)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { palette } from "../../../shared/theme";

interface DeleteConversationScreenProps {
  conversationTitle: string;
  messageCount: number;
  createdAt: Date;
  lastMessageAt: Date;
  onBack: () => void;
  onCancel: () => void;
  onConfirmDelete: () => void;
}

export function DeleteConversationScreen({
  conversationTitle,
  messageCount,
  onBack,
  onCancel,
  onConfirmDelete,
}: DeleteConversationScreenProps): React.ReactElement {
  const deletionItems = [
    { id: "1", text: "All messages in this conversation" },
    { id: "2", text: "Shared media and attachments" },
    { id: "3", text: "AI insights and analysis data" },
  ];

  return (
    <View testID="delete-conversation-screen" style={styles.container}>
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
        <View style={styles.headerSpacer} />
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Warning Icon */}
        <View testID="warning-icon" style={styles.warningIconContainer}>
          <Text style={styles.warningIcon}>⚠️</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Delete Conversation?</Text>

        {/* Warning Message */}
        <Text style={styles.warningMessage}>
          This action cannot be undone. All messages and data associated with
          this conversation will be permanently deleted.
        </Text>

        {/* Conversation Details */}
        <View testID="conversation-details" style={styles.detailsCard}>
          <View style={styles.detailsIcon}>
            <Text style={styles.detailsIconText}>💬</Text>
          </View>
          <View style={styles.detailsContent}>
            <Text style={styles.detailsTitle}>{conversationTitle}</Text>
            <Text style={styles.detailsSubtitle}>{messageCount} messages</Text>
          </View>
        </View>

        {/* What will be deleted */}
        <View testID="deletion-info" style={styles.deletionInfoContainer}>
          <Text style={styles.deletionInfoTitle}>What will be deleted:</Text>
          {deletionItems.map((item) => (
            <View key={item.id} style={styles.deletionItem}>
              <Text style={styles.deletionBullet}>•</Text>
              <Text style={styles.deletionText}>{item.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          testID="cancel-button"
          style={styles.cancelButton}
          onPress={onCancel}
          accessibilityRole="button"
          accessibilityLabel="Cancel deletion"
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="delete-button"
          style={styles.deleteButton}
          onPress={onConfirmDelete}
          accessibilityRole="button"
          accessibilityLabel="Delete conversation"
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
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
  cancelButton: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderColor: palette.brown[700],
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    marginRight: 12,
    minHeight: 44,
    paddingVertical: 14,
  },
  cancelButtonText: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "600",
  },
  container: {
    backgroundColor: palette.brown[900],
    flex: 1,
    paddingTop: 60,
  },
  content: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  deleteButton: {
    alignItems: "center",
    backgroundColor: palette.onboarding.step2,
    borderRadius: 12,
    flex: 1,
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 14,
  },
  deleteButtonText: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "600",
  },
  deletionBullet: {
    color: palette.onboarding.step2,
    fontSize: 16,
    marginRight: 8,
  },
  deletionInfoContainer: {
    backgroundColor: palette.brown[800],
    borderColor: palette.brown[700],
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 24,
    padding: 16,
    width: "100%",
  },
  deletionInfoTitle: {
    color: palette.white,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  deletionItem: {
    alignItems: "flex-start",
    flexDirection: "row",
    marginBottom: 8,
  },
  deletionText: {
    color: palette.gray[400],
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  detailsCard: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderRadius: 12,
    flexDirection: "row",
    marginTop: 24,
    padding: 16,
    width: "100%",
  },
  detailsContent: {
    flex: 1,
  },
  detailsIcon: {
    alignItems: "center",
    backgroundColor: palette.brown[700],
    borderRadius: 12,
    height: 48,
    justifyContent: "center",
    marginRight: 12,
    width: 48,
  },
  detailsIconText: {
    fontSize: 20,
  },
  detailsSubtitle: {
    color: palette.gray[400],
    fontSize: 13,
    marginTop: 2,
  },
  detailsTitle: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "600",
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
  title: {
    color: palette.white,
    fontSize: 24,
    fontWeight: "700",
    marginTop: 16,
    textAlign: "center",
  },
  warningIcon: {
    fontSize: 48,
  },
  warningIconContainer: {
    alignItems: "center",
    backgroundColor: "rgba(232, 133, 58, 0.2)",
    borderRadius: 40,
    height: 80,
    justifyContent: "center",
    width: 80,
  },
  warningMessage: {
    color: palette.gray[400],
    fontSize: 15,
    lineHeight: 22,
    marginTop: 16,
    textAlign: "center",
  },
});

export default DeleteConversationScreen;
