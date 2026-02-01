/**
 * PostSuccessModal Component
 * @description Success confirmation modal after publishing a community post
 * @task Task 3.14.5: Post Success Modal (Screen 123)
 * @audit-fix "posted a post" → "Your post has been published!"
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface PostSuccessModalProps {
  message: string;
  onViewPost: () => void;
  onClose: () => void;
}

const colors = {
  overlay: "rgba(0,0,0,0.7)",
  modalBg: "#2A1F18",
  white: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.6)",
  ctaButtonBg: "#C4A574",
  ctaButtonText: "#1C1410",
} as const;

export function PostSuccessModal({
  message,
  onViewPost,
  onClose,
}: PostSuccessModalProps): React.ReactElement {
  return (
    <View testID="post-success-modal" style={styles.overlay}>
      <View style={styles.modal}>
        <View testID="success-illustration" style={styles.illustration} />
        <Text style={styles.title}>Post Successful!</Text>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity
          testID="view-post-button"
          style={styles.viewPostButton}
          onPress={onViewPost}
          accessibilityRole="button"
          accessibilityLabel="See my post"
        >
          <Text style={styles.viewPostText}>See My Post {"\u2192"}</Text>
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
  closeButton: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    minHeight: 44,
    minWidth: 44,
  },
  closeIcon: { color: colors.white, fontSize: 24 },
  illustration: {
    alignSelf: "center",
    borderRadius: 16,
    height: 160,
    width: 160,
  },
  message: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
    marginTop: 8,
    textAlign: "center",
  },
  modal: {
    backgroundColor: colors.modalBg,
    borderRadius: 24,
    marginHorizontal: 32,
    padding: 32,
  },
  overlay: {
    alignItems: "center",
    backgroundColor: colors.overlay,
    flex: 1,
    justifyContent: "center",
  },
  title: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "800",
    marginTop: 24,
    textAlign: "center",
  },
  viewPostButton: {
    alignItems: "center",
    backgroundColor: colors.ctaButtonBg,
    borderRadius: 24,
    justifyContent: "center",
    marginTop: 24,
    minHeight: 44,
    paddingVertical: 14,
  },
  viewPostText: {
    color: colors.ctaButtonText,
    fontSize: 16,
    fontWeight: "700",
  },
});

export default PostSuccessModal;
