/**
 * DeletePostModal Component
 * @description Confirmation dialog for post deletion with cancel/confirm actions
 * @task Task 3.14.9: Delete Post Modal (Screen 127)
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { palette } from "../../../shared/theme";

interface DeletePostModalProps {
  onCancel: () => void;
  onConfirm: () => void;
  onClose: () => void;
}

const localColors = {
  overlay: "rgba(0,0,0,0.7)",
  modalBg: palette.brown[800],
  white: palette.white,
  textSecondary: "rgba(255,255,255,0.6)",
  cancelBg: palette.brown[700],
  confirmBg: palette.accent.orange,
  confirmText: palette.white,
} as const;

export function DeletePostModal({
  onCancel,
  onConfirm,
  onClose,
}: DeletePostModalProps): React.ReactElement {
  return (
    <View testID="delete-post-modal" style={styles.overlay}>
      <View style={styles.modal}>
        <View testID="delete-illustration" style={styles.illustration} />
        <Text style={styles.title}>Delete Post?</Text>
        <Text style={styles.confirmationText}>
          Are you sure to delete your post?
        </Text>
        <TouchableOpacity
          testID="cancel-button"
          style={styles.cancelButton}
          onPress={onCancel}
          accessibilityRole="button"
          accessibilityLabel="Don't delete"
        >
          <Text style={styles.cancelText}>
            No, Don&apos;t Delete {"\u2715"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="confirm-delete-button"
          style={styles.confirmButton}
          onPress={onConfirm}
          accessibilityRole="button"
          accessibilityLabel="Confirm delete"
        >
          <Text style={styles.confirmText}>
            Yes, Delete {"\uD83D\uDDD1\uFE0F"}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        testID="close-button"
        style={styles.closeButton}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close"
      >
        <Text style={styles.closeIcon}>{"\u2715"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cancelButton: {
    alignItems: "center",
    backgroundColor: localColors.cancelBg,
    borderRadius: 24,
    justifyContent: "center",
    marginTop: 16,
    minHeight: 44,
    paddingVertical: 14,
    width: "100%",
  },
  cancelText: { color: localColors.white, fontSize: 15, fontWeight: "600" },
  closeButton: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    minHeight: 44,
    minWidth: 44,
  },
  closeIcon: { color: localColors.white, fontSize: 24 },
  confirmButton: {
    alignItems: "center",
    backgroundColor: localColors.confirmBg,
    borderRadius: 24,
    justifyContent: "center",
    marginTop: 8,
    minHeight: 44,
    paddingVertical: 14,
    width: "100%",
  },
  confirmText: { color: localColors.confirmText, fontSize: 15, fontWeight: "700" },
  confirmationText: {
    color: localColors.textSecondary,
    fontSize: 15,
    marginTop: 8,
    textAlign: "center",
  },
  illustration: {
    alignSelf: "center",
    borderRadius: 16,
    height: 140,
    width: 140,
  },
  modal: {
    alignItems: "center",
    backgroundColor: localColors.modalBg,
    borderRadius: 24,
    marginHorizontal: 32,
    padding: 32,
  },
  overlay: {
    alignItems: "center",
    backgroundColor: localColors.overlay,
    flex: 1,
    justifyContent: "center",
  },
  title: {
    color: localColors.white,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 20,
    textAlign: "center",
  },
});

export default DeletePostModal;
