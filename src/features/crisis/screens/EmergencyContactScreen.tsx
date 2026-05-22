/**
 * EmergencyContactScreen — cosmic v4.2 emergency contact form.
 *
 * Moved from `onboarding/screens/ProfileEmergencyContactScreen.tsx` during the
 * S9 crisis feature consolidation; previously stubbed as "Coming Soon". The
 * Sprint 14 audit (2026-05-18) implemented the real form so users can record
 * an emergency contact (name, relationship, phone) without leaving the
 * crisis flow. The data persists to the settings repository under the
 * `emergencyContact` key as a JSON object.
 */

import React, { useCallback, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { palette } from "../../../shared/theme";
import { ScreenContainer } from "../../../shared/components/atoms/layout";
import { useRepositories } from "../../../app/providers/RepositoryProvider";

const STORAGE_KEY = "emergencyContact";

interface EmergencyContact {
  readonly name: string;
  readonly relationship: string;
  readonly phone: string;
}

const DEFAULT_CONTACT: EmergencyContact = {
  name: "",
  relationship: "",
  phone: "",
};

const RELATIONSHIP_PRESETS = [
  "Parent",
  "Sibling",
  "Partner",
  "Friend",
  "Therapist",
  "Other",
] as const;

export function EmergencyContactScreen(): React.ReactElement {
  const navigation = useNavigation();
  const { settings, isReady } = useRepositories();

  const [contact, setContact] = useState<EmergencyContact>(DEFAULT_CONTACT);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    if (!isReady) return;
    let cancelled = false;
    void (async () => {
      const raw = await settings.getValue(STORAGE_KEY);
      if (cancelled || typeof raw !== "string") return;
      try {
        const parsed = JSON.parse(raw) as Partial<EmergencyContact>;
        setContact({
          name: parsed.name ?? "",
          relationship: parsed.relationship ?? "",
          phone: parsed.phone ?? "",
        });
      } catch {
        // Bad JSON — leave defaults so the user sees an empty form.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isReady, settings]);

  const handleSave = useCallback(async () => {
    if (!isReady || saving) return;
    setSaving(true);
    try {
      await settings.set({ key: STORAGE_KEY, value: JSON.stringify(contact) });
      setSavedAt(Date.now());
    } catch {
      // Persistence failure is silent — banner UX comes in a future sprint.
    } finally {
      setSaving(false);
    }
  }, [contact, isReady, saving, settings]);

  const canSave =
    contact.name.trim().length > 0 && contact.phone.trim().length > 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardWrap}
    >
      <ScreenContainer
        testID="emergency-contact-screen"
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity
            testID="back-button"
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.backIcon}>{"←"}</Text>
          </TouchableOpacity>
          <Text testID="kicker" style={styles.kicker}>{"[ CRISIS PLAN ]"}</Text>
          <View style={styles.spacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Who can we call</Text>
          <Text style={styles.italicTitle}>for you?</Text>
          <Text style={styles.body}>
            Pick one trusted person we can reach if our AI detects you may be
            in distress. Stored locally, encrypted on this device.
          </Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              testID="name-input"
              style={styles.input}
              placeholder="Their full name"
              placeholderTextColor={palette.warm[500]}
              value={contact.name}
              onChangeText={(name) =>
                setContact((c) => ({ ...c, name }))
              }
              accessibilityLabel="Emergency contact name"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Relationship</Text>
            <View style={styles.chipRow}>
              {RELATIONSHIP_PRESETS.map((preset) => {
                const selected = contact.relationship === preset;
                return (
                  <TouchableOpacity
                    key={preset}
                    testID={`relationship-${preset.toLowerCase()}`}
                    style={[styles.chip, selected && styles.chipSelected]}
                    onPress={() =>
                      setContact((c) => ({
                        ...c,
                        relationship: selected ? "" : preset,
                      }))
                    }
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    accessibilityLabel={`Relationship: ${preset}`}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected && styles.chipTextSelected,
                      ]}
                    >
                      {preset}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              testID="phone-input"
              style={styles.input}
              placeholder="+1 (555) 000-0000"
              placeholderTextColor={palette.warm[500]}
              value={contact.phone}
              onChangeText={(phone) =>
                setContact((c) => ({ ...c, phone }))
              }
              keyboardType="phone-pad"
              accessibilityLabel="Emergency contact phone number"
            />
          </View>

          {savedAt != null && (
            <Text testID="saved-banner" style={styles.savedBanner}>
              Saved {"✓"}
            </Text>
          )}
        </ScrollView>

        <TouchableOpacity
          testID="save-button"
          style={[
            styles.saveButton,
            !canSave && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={!canSave || saving}
          accessibilityRole="button"
          accessibilityLabel="Save emergency contact"
          accessibilityState={{ disabled: !canSave || saving }}
        >
          <Text style={styles.saveButtonText}>
            {saving ? "Saving…" : "Save contact"}
          </Text>
        </TouchableOpacity>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}

export default EmergencyContactScreen;

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    backgroundColor: palette.midnight[800],
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 44,
  },
  backIcon: {
    color: palette.warm[50],
    fontSize: 20,
  },
  body: {
    color: palette.warm[400],
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
  },
  chip: {
    backgroundColor: palette.midnight[800],
    borderColor: palette.midnight[600],
    borderRadius: 999,
    borderWidth: 1,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  chipSelected: {
    backgroundColor: palette.sage[300],
    borderColor: palette.sage[300],
  },
  chipText: {
    color: palette.warm[100],
    fontSize: 14,
    fontWeight: "500",
  },
  chipTextSelected: {
    color: palette.midnight[950],
    fontWeight: "600",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  fieldGroup: {
    marginTop: 20,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
  },
  input: {
    backgroundColor: palette.midnight[800],
    borderColor: palette.midnight[600],
    borderRadius: 12,
    borderWidth: 1,
    color: palette.warm[50],
    fontSize: 16,
    marginTop: 8,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  italicTitle: {
    color: palette.warm[50],
    fontFamily: "Fraunces_400Regular_Italic",
    fontSize: 30,
    fontWeight: "400",
    lineHeight: 36,
  },
  keyboardWrap: {
    backgroundColor: palette.midnight[950],
    flex: 1,
  },
  kicker: {
    color: palette.peach[300],
    fontFamily: "FiraCode_500Medium",
    fontSize: 11,
    letterSpacing: 1.5,
  },
  label: {
    color: palette.warm[400],
    fontFamily: "FiraCode_500Medium",
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: palette.peach[300],
    borderRadius: 999,
    justifyContent: "center",
    marginTop: 24,
    minHeight: 56,
    paddingVertical: 18,
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  saveButtonText: {
    color: palette.midnight[950],
    fontSize: 16,
    fontWeight: "700",
  },
  savedBanner: {
    color: palette.sage[300],
    fontSize: 14,
    marginTop: 16,
    textAlign: "center",
  },
  scroll: {
    paddingBottom: 24,
  },
  spacer: {
    width: 44,
  },
  title: {
    color: palette.warm[50],
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 30,
    fontWeight: "600",
    lineHeight: 36,
    marginTop: 24,
  },
});
