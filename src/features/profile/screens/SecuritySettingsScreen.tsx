/**
 * SecuritySettingsScreen Component
 * @description Security authentication settings with 2FA, authenticator,
 *   Face ID, and biometric toggles
 * @task Task 3.17.6: Security Settings Screen (Screen 145)
 * @audit-fix "by by visiting" → "by visiting" (Issue #37)
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

interface SecurityOption {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

interface SecuritySettingsScreenProps {
  options: SecurityOption[];
  onBack: () => void;
  onToggle: (id: string, value: boolean) => void;
  onSave: () => void;
}

const colors = {
  background: "#1C1410",
  white: "#FFFFFF",
  cardBg: "#2A1F18",
  textSecondary: "rgba(255,255,255,0.6)",
  toggleOn: "#9AAD5C",
  toggleOff: "#3D2E23",
  ctaButtonBg: "#C4A574",
  ctaButtonText: "#1C1410",
} as const;

export function SecuritySettingsScreen({
  options,
  onBack,
  onToggle,
  onSave,
}: SecuritySettingsScreenProps): React.ReactElement {
  return (
    <View testID="security-settings-screen" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>{"\u2190"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security Settings</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {options.map((option) => (
          <View key={option.id} style={styles.optionCard}>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </View>
            <TouchableOpacity
              testID={`toggle-${option.id}`}
              style={[
                styles.toggle,
                option.enabled ? styles.toggleOn : styles.toggleOff,
              ]}
              onPress={() => onToggle(option.id, !option.enabled)}
              accessibilityRole="button"
              accessibilityLabel={`Toggle ${option.title}`}
            >
              <View
                style={[
                  styles.toggleThumb,
                  option.enabled && styles.toggleThumbActive,
                ]}
              />
            </TouchableOpacity>
          </View>
        ))}

        {/* Save Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            testID="save-button"
            style={styles.saveButton}
            onPress={onSave}
            accessibilityRole="button"
            accessibilityLabel="Save Settings"
          >
            <Text style={styles.saveButtonText}>Save Settings {"\u2713"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  backIcon: { color: colors.white, fontSize: 24 },
  container: { backgroundColor: colors.background, flex: 1 },
  footer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 12,
  },
  optionCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    flexDirection: "row",
    marginHorizontal: 24,
    marginTop: 12,
    padding: 16,
  },
  optionContent: { flex: 1, marginRight: 16 },
  optionDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
  },
  optionTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700",
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: colors.ctaButtonBg,
    borderRadius: 28,
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 16,
    width: "100%",
  },
  saveButtonText: {
    color: colors.ctaButtonText,
    fontSize: 16,
    fontWeight: "700",
  },
  scrollContent: { paddingBottom: 48, paddingTop: 12 },
  toggle: {
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    paddingHorizontal: 2,
    width: 52,
  },
  toggleOff: { backgroundColor: colors.toggleOff },
  toggleOn: { backgroundColor: colors.toggleOn },
  toggleThumb: {
    backgroundColor: colors.white,
    borderRadius: 14,
    height: 28,
    width: 28,
  },
  toggleThumbActive: { alignSelf: "flex-end" },
});

export default SecuritySettingsScreen;
