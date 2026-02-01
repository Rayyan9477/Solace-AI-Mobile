/**
 * NotificationSettingsScreen Component
 * @description Notification preferences with toggle groups for chatbot,
 *   sound, vibration, and misc notifications
 * @task Task 3.17.5: Notification Settings Screen (Screen 144)
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

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

const colors = {
  background: "#1C1410",
  white: "#FFFFFF",
  cardBg: "#2A1F18",
  textSecondary: "rgba(255,255,255,0.6)",
  toggleOn: "#9AAD5C",
  toggleOff: "#3D2E23",
  chevron: "rgba(255,255,255,0.3)",
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
              accessibilityRole="button"
              accessibilityLabel="Toggle Sound"
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
              accessibilityRole="button"
              accessibilityLabel="Toggle Vibration"
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
              accessibilityRole="button"
              accessibilityLabel="Toggle Resources"
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
  backIcon: { color: colors.white, fontSize: 24 },
  chevron: { color: colors.chevron, fontSize: 24 },
  container: { backgroundColor: colors.background, flex: 1 },
  description: {
    color: colors.textSecondary,
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
    color: colors.white,
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 12,
  },
  itemValue: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  scrollContent: { paddingBottom: 48 },
  section: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    color: colors.white,
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
    color: colors.white,
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
  },
  toggleOff: { backgroundColor: colors.toggleOff },
  toggleOn: { backgroundColor: colors.toggleOn },
  toggleRow: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 12,
    minHeight: 44,
  },
  toggleThumb: {
    backgroundColor: colors.white,
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
