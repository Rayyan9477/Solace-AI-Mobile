/**
 * NotificationSettingsScreen Component
 * @description Notification preferences with toggle groups for chatbot,
 *   sound, vibration, and misc notifications
 * @task Task 3.17.5: Notification Settings Screen (Screen 144)
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

interface ToggleItem {
  id: string;
  label: string;
  enabled: boolean;
}

interface MiscItem {
  id: string;
  label: string;
  type: "value" | "toggle";
  value?: string;
  enabled?: boolean;
}

interface NotificationSettingsScreenProps {
  chatbotToggles: ToggleItem[];
  soundEnabled: boolean;
  soundDescription: string;
  vibrationEnabled: boolean;
  vibrationDescription: string;
  miscItems: MiscItem[];
  resourcesEnabled: boolean;
  resourcesDescription: string;
  onBack: () => void;
  onToggle: (id: string, value: boolean) => void;
  onItemPress: (id: string) => void;
}

const localColors = {
  background: palette.brown[900],
  white: palette.white,
  cardBg: palette.brown[800],
  textSecondary: `${palette.white}${palette.alpha[60]}`,
  toggleOn: palette.olive[500],
  toggleOff: palette.brown[700],
  chevron: `${palette.white}${palette.alpha[30]}`,
} as const;

export function NotificationSettingsScreen({
  chatbotToggles,
  soundEnabled,
  soundDescription,
  vibrationEnabled,
  vibrationDescription,
  miscItems,
  resourcesEnabled,
  resourcesDescription,
  onBack,
  onToggle,
  onItemPress,
}: NotificationSettingsScreenProps): React.ReactElement {
  return (
    <View testID="notification-settings-screen" style={styles.container}>
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
        <Text style={styles.headerTitle}>Notification Settings</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Chatbot Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chatbot</Text>
          {chatbotToggles.map((item) => (
            <View key={item.id} style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>{item.label}</Text>
              <TouchableOpacity
                testID={`toggle-${item.id}`}
                style={[
                  styles.toggle,
                  item.enabled ? styles.toggleOn : styles.toggleOff,
                ]}
                onPress={() => onToggle(item.id, !item.enabled)}
                accessibilityRole="button"
                accessibilityLabel={`Toggle ${item.label}`}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    item.enabled && styles.toggleThumbActive,
                  ]}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Sound Section */}
        <View style={styles.section}>
          <View style={styles.descriptionToggleRow}>
            <View style={styles.descriptionContent}>
              <Text style={styles.sectionTitle}>Sound</Text>
              <Text style={styles.description}>{soundDescription}</Text>
            </View>
            <TouchableOpacity
              testID="toggle-sound"
              style={[
                styles.toggle,
                soundEnabled ? styles.toggleOn : styles.toggleOff,
              ]}
              onPress={() => onToggle("sound", !soundEnabled)}
              accessibilityRole="switch"
              accessibilityLabel="Sound"
              accessibilityState={{ checked: soundEnabled }}
            >
              <View
                style={[
                  styles.toggleThumb,
                  soundEnabled && styles.toggleThumbActive,
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Vibration Section */}
        <View style={styles.section}>
          <View style={styles.descriptionToggleRow}>
            <View style={styles.descriptionContent}>
              <Text style={styles.sectionTitle}>Vibration</Text>
              <Text style={styles.description}>{vibrationDescription}</Text>
            </View>
            <TouchableOpacity
              testID="toggle-vibration"
              style={[
                styles.toggle,
                vibrationEnabled ? styles.toggleOn : styles.toggleOff,
              ]}
              onPress={() => onToggle("vibration", !vibrationEnabled)}
              accessibilityRole="switch"
              accessibilityLabel="Vibration"
              accessibilityState={{ checked: vibrationEnabled }}
            >
              <View
                style={[
                  styles.toggleThumb,
                  vibrationEnabled && styles.toggleThumbActive,
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Misc Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Misc</Text>
          {miscItems.map((item) =>
            item.type === "value" ? (
              <TouchableOpacity
                key={item.id}
                testID={`item-${item.id}`}
                style={styles.toggleRow}
                onPress={() => onItemPress(item.id)}
                accessibilityRole="button"
                accessibilityLabel={item.label}
              >
                <Text style={styles.toggleLabel}>{item.label}</Text>
                <View style={styles.valueRow}>
                  <Text style={styles.itemValue}>{item.value}</Text>
                  <Text style={styles.chevron}>{"\u203A"}</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View key={item.id} style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>{item.label}</Text>
                <TouchableOpacity
                  testID={`toggle-${item.id}`}
                  style={[
                    styles.toggle,
                    item.enabled ? styles.toggleOn : styles.toggleOff,
                  ]}
                  onPress={() => onToggle(item.id, !item.enabled)}
                  accessibilityRole="button"
                  accessibilityLabel={`Toggle ${item.label}`}
                >
                  <View
                    style={[
                      styles.toggleThumb,
                      item.enabled && styles.toggleThumbActive,
                    ]}
                  />
                </TouchableOpacity>
              </View>
            ),
          )}
        </View>

        {/* Resources Section */}
        <View style={styles.section}>
          <View style={styles.descriptionToggleRow}>
            <View style={styles.descriptionContent}>
              <Text style={styles.sectionTitle}>Resources</Text>
              <Text style={styles.description}>{resourcesDescription}</Text>
            </View>
            <TouchableOpacity
              testID="toggle-resources"
              style={[
                styles.toggle,
                resourcesEnabled ? styles.toggleOn : styles.toggleOff,
              ]}
              onPress={() => onToggle("resources", !resourcesEnabled)}
              accessibilityRole="switch"
              accessibilityLabel="Resources"
              accessibilityState={{ checked: resourcesEnabled }}
            >
              <View
                style={[
                  styles.toggleThumb,
                  resourcesEnabled && styles.toggleThumbActive,
                ]}
              />
            </TouchableOpacity>
          </View>
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
  chevron: { color: localColors.chevron, fontSize: 24 },
  container: { backgroundColor: localColors.background, flex: 1 },
  description: {
    color: localColors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
  },
  descriptionContent: { flex: 1, marginRight: 16 },
  descriptionToggleRow: {
    alignItems: "center",
    flexDirection: "row",
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
  itemValue: {
    color: localColors.textSecondary,
    fontSize: 14,
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
  toggle: {
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    paddingHorizontal: 2,
    width: 52,
  },
  toggleLabel: {
    color: localColors.white,
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
  },
  toggleOff: { backgroundColor: localColors.toggleOff },
  toggleOn: { backgroundColor: localColors.toggleOn },
  toggleRow: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 12,
    minHeight: 44,
  },
  toggleThumb: {
    backgroundColor: localColors.white,
    borderRadius: 14,
    height: 28,
    width: 28,
  },
  toggleThumbActive: { alignSelf: "flex-end" },
  valueRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
});

export default NotificationSettingsScreen;
