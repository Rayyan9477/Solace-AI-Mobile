/**
 * SecuritySettingsScreen Component
 * @description Security authentication settings with 2FA, authenticator,
 *   Face ID, and biometric toggles
 * @task Task 3.17.6: Security Settings Screen (Screen 145)
 * @phase Phase 3C: Refactored to use theme tokens
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
import { palette } from "../../../shared/theme";

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

const localColors = {
  background: palette.brown[900],
  white: palette.white,
  cardBg: palette.brown[800],
  textSecondary: `${palette.white}${palette.alpha[60]}`,
  toggleOn: palette.olive[500],
  toggleOff: palette.brown[700],
  ctaButtonBg: palette.tan[500],
  ctaButtonText: palette.brown[900],
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
  backIcon: { color: localColors.white, fontSize: 24 },
  container: { backgroundColor: localColors.background, flex: 1 },
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
    color: localColors.white,
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 12,
  },
  optionCard: {
    backgroundColor: localColors.cardBg,
    borderRadius: 16,
    flexDirection: "row",
    marginHorizontal: 24,
    marginTop: 12,
    padding: 16,
  },
  optionContent: { flex: 1, marginRight: 16 },
  optionDescription: {
    color: localColors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
  },
  optionTitle: {
    color: localColors.white,
    fontSize: 15,
    fontWeight: "700",
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: localColors.ctaButtonBg,
    borderRadius: 28,
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 16,
    width: "100%",
  },
  saveButtonText: {
    color: localColors.ctaButtonText,
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
  toggleOff: { backgroundColor: localColors.toggleOff },
  toggleOn: { backgroundColor: localColors.toggleOn },
  toggleThumb: {
    backgroundColor: localColors.white,
    borderRadius: 14,
    height: 28,
    width: 28,
  },
  toggleThumbActive: { alignSelf: "flex-end" },
});

export default SecuritySettingsScreen;
