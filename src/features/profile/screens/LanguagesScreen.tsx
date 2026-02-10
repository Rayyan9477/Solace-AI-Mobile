/**
 * LanguagesScreen Component
 * @description Language selection with bilingual toggle (BETA)
 * @task Task 3.17.8: Languages Screen (Screen 147)
 * @phase Phase 3C: Refactored to use theme tokens
 * @audit-fix Incorrect language codes: IL→IT, IR→IE, EU removed, American→English (US)
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

interface LanguageItem {
  id: string;
  name: string;
  code: string;
}

interface LanguagesScreenProps {
  selectedLanguageId: string;
  bilingualEnabled: boolean;
  languages: LanguageItem[];
  onBack: () => void;
  onLanguageSelect: (id: string) => void;
  onBilingualToggle: () => void;
  onSave: () => void;
}

const localColors = {
  background: palette.brown[900],
  white: palette.white,
  cardBg: palette.brown[800],
  textSecondary: `${palette.white}${palette.alpha[60]}`,
  selectedBg: palette.olive[500],
  selectedText: palette.brown[900],
  toggleOn: palette.olive[500],
  toggleOff: palette.brown[700],
  betaBg: palette.onboarding.step2,
  ctaButtonBg: palette.tan[500],
  ctaButtonText: palette.brown[900],
  radioUnselected: palette.brown[700],
} as const;

export function LanguagesScreen({
  selectedLanguageId,
  bilingualEnabled,
  languages,
  onBack,
  onLanguageSelect,
  onBilingualToggle,
  onSave,
}: LanguagesScreenProps): React.ReactElement {
  const selectedLanguage = languages.find((l) => l.id === selectedLanguageId);

  return (
    <View testID="languages-screen" style={styles.container}>
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
        <Text style={styles.headerTitle}>Languages</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Selected Language */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selected Language</Text>
          {selectedLanguage && (
            <View style={styles.selectedRow}>
              <Text style={styles.selectedName}>{selectedLanguage.name}</Text>
              <Text style={styles.selectedCode}>({selectedLanguage.code})</Text>
            </View>
          )}
        </View>

        {/* Bilingual Feature */}
        <View style={styles.section}>
          <View style={styles.bilingualHeader}>
            <Text style={styles.sectionTitle}>Bilingual Feature</Text>
            <View style={styles.betaBadge}>
              <Text style={styles.betaBadgeText}>BETA</Text>
            </View>
          </View>
          <View style={styles.bilingualRow}>
            <Text style={styles.bilingualLabel}>Enable Bilingual</Text>
            <TouchableOpacity
              testID="toggle-bilingual"
              style={[
                styles.toggle,
                bilingualEnabled ? styles.toggleOn : styles.toggleOff,
              ]}
              onPress={onBilingualToggle}
              accessibilityRole="switch"
              accessibilityLabel="Bilingual"
              accessibilityState={{ checked: bilingualEnabled }}
            >
              <View
                style={[
                  styles.toggleThumb,
                  bilingualEnabled && styles.toggleThumbActive,
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* All Languages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Languages</Text>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.id}
              testID={`language-${lang.id}`}
              style={[
                styles.languageRow,
                selectedLanguageId === lang.id && styles.languageRowSelected,
              ]}
              onPress={() => onLanguageSelect(lang.id)}
              accessibilityRole="button"
              accessibilityLabel={lang.name}
            >
              <Text
                style={[
                  styles.languageName,
                  selectedLanguageId === lang.id && styles.languageNameSelected,
                ]}
              >
                {lang.name}
              </Text>
              <Text
                style={[
                  styles.languageCode,
                  selectedLanguageId === lang.id && styles.languageCodeSelected,
                ]}
              >
                {lang.code}
              </Text>
              <View
                style={[
                  styles.radio,
                  selectedLanguageId === lang.id && styles.radioSelected,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

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
  betaBadge: {
    backgroundColor: localColors.betaBg,
    borderRadius: 8,
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  betaBadgeText: {
    color: localColors.white,
    fontSize: 10,
    fontWeight: "700",
  },
  bilingualHeader: {
    alignItems: "center",
    flexDirection: "row",
  },
  bilingualLabel: {
    color: localColors.white,
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
  },
  bilingualRow: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 12,
  },
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
  languageCode: {
    color: localColors.textSecondary,
    fontSize: 13,
    marginRight: 12,
  },
  languageCodeSelected: { color: localColors.selectedText },
  languageName: {
    color: localColors.white,
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
  },
  languageNameSelected: { color: localColors.selectedText },
  languageRow: {
    alignItems: "center",
    backgroundColor: localColors.cardBg,
    borderRadius: 12,
    flexDirection: "row",
    marginTop: 8,
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  languageRowSelected: { backgroundColor: localColors.selectedBg },
  radio: {
    backgroundColor: localColors.radioUnselected,
    borderRadius: 10,
    height: 20,
    width: 20,
  },
  radioSelected: {
    backgroundColor: localColors.selectedText,
    borderColor: localColors.white,
    borderWidth: 2,
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
  scrollContent: { paddingBottom: 48 },
  section: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    color: localColors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  selectedCode: {
    color: localColors.textSecondary,
    fontSize: 15,
    marginLeft: 4,
  },
  selectedName: {
    color: localColors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  selectedRow: {
    alignItems: "center",
    backgroundColor: localColors.selectedBg,
    borderRadius: 12,
    flexDirection: "row",
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
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

export default LanguagesScreen;
