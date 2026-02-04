/**
 * AccountSettingsScreen Component
 * @description Comprehensive settings menu with sections for general,
 *   security, danger zone, and logout
 * @task Task 3.17.3: Account Settings Screen (Screen 142)
 * @phase Phase 3C: Refactored to use theme tokens
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

interface SettingsItemData {
  id: string;
  label: string;
  type: "navigation" | "toggle" | "value" | "destructive";
  value?: string;
  toggleValue?: boolean;
}

interface SettingsSection {
  id: string;
  title: string;
  items: SettingsItemData[];
}

interface AccountSettingsScreenProps {
  sections: SettingsSection[];
  onBack: () => void;
  onItemPress: (id: string) => void;
  onToggle: (id: string, value: boolean) => void;
}

const colors = {
  background: palette.brown[900],
  white: palette.white,
  cardBg: "#2A1F18",
  textSecondary: `${palette.white}${palette.alpha[60]}`,
  destructive: palette.onboarding.step2,
  toggleOn: palette.olive[500],
  toggleOff: palette.brown[700],
  chevron: `${palette.white}${palette.alpha[30]}`,
} as const;

export function AccountSettingsScreen({
  sections,
  onBack,
  onItemPress,
  onToggle,
}: AccountSettingsScreenProps): React.ReactElement {
  return (
    <View testID="account-settings-screen" style={styles.container}>
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
        <Text style={styles.headerTitle}>Account Settings</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {sections.map((section) => (
          <View key={section.id} style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                section.id === "danger" && styles.sectionTitleDestructive,
              ]}
            >
              {section.title}
            </Text>
            {section.items.map((item) => (
              <TouchableOpacity
                key={item.id}
                testID={`settings-item-${item.id}`}
                style={styles.settingsItem}
                onPress={() => {
                  if (item.type === "toggle") {
                    return;
                  }
                  onItemPress(item.id);
                }}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                disabled={item.type === "toggle"}
              >
                <Text
                  style={[
                    styles.itemLabel,
                    item.type === "destructive" && styles.itemLabelDestructive,
                  ]}
                >
                  {item.label}
                </Text>
                {item.type === "value" && (
                  <View style={styles.itemRight}>
                    <Text style={styles.itemValue}>{item.value}</Text>
                    <Text style={styles.chevron}>{"\u203A"}</Text>
                  </View>
                )}
                {item.type === "navigation" && (
                  <Text style={styles.chevron}>{"\u203A"}</Text>
                )}
                {item.type === "toggle" && (
                  <TouchableOpacity
                    testID={`toggle-${item.id}`}
                    style={[
                      styles.toggle,
                      item.toggleValue ? styles.toggleOn : styles.toggleOff,
                    ]}
                    onPress={() => onToggle(item.id, !item.toggleValue)}
                    accessibilityRole="button"
                    accessibilityLabel={`Toggle ${item.label}`}
                  >
                    <View
                      style={[
                        styles.toggleThumb,
                        item.toggleValue && styles.toggleThumbActive,
                      ]}
                    />
                  </TouchableOpacity>
                )}
                {item.type === "destructive" && (
                  <Text style={styles.chevron}>{"\u203A"}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
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
  chevron: { color: colors.chevron, fontSize: 24 },
  container: { backgroundColor: colors.background, flex: 1 },
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
  itemLabel: {
    color: colors.white,
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
  },
  itemLabelDestructive: { color: colors.destructive },
  itemRight: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  itemValue: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  scrollContent: { paddingBottom: 48 },
  section: { marginTop: 24, paddingHorizontal: 24 },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  sectionTitleDestructive: { color: colors.destructive },
  settingsItem: {
    alignItems: "center",
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    flexDirection: "row",
    marginTop: 4,
    minHeight: 52,
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

export default AccountSettingsScreen;
