/**
 * TherapyPreferencesScreen - Therapy settings and preferences
 * Manages user preferences, emergency contacts, and crisis resources
 */

import {
  loadTherapyPreferences,
  saveTherapyPreferences,
  updatePreferences,
  addEmergencyContact,
  removeEmergencyContact,
  selectTherapyPreferences,
  selectPreferencesLoading,
} from "@app/store/slices/therapySlice";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

/**
 * TherapyPreferencesScreen Component
 * Manages therapy settings
 */
const TherapyPreferencesScreen = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const preferences = useSelector(selectTherapyPreferences);
  const loading = useSelector(selectPreferencesLoading);

  const [enableVoiceRecording, setEnableVoiceRecording] = useState(
    preferences.enableVoiceRecording,
  );
  const [sessionReminders, setSessionReminders] = useState(
    preferences.sessionReminders,
  );
  const [shareDataForResearch, setShareDataForResearch] = useState(
    preferences.shareDataForResearch,
  );
  const [reminderTime, setReminderTime] = useState(preferences.reminderTime);

  useEffect(() => {
    dispatch(loadTherapyPreferences());
  }, [dispatch]);

  useEffect(() => {
    setEnableVoiceRecording(preferences.enableVoiceRecording);
    setSessionReminders(preferences.sessionReminders);
    setShareDataForResearch(preferences.shareDataForResearch);
    setReminderTime(preferences.reminderTime);
  }, [preferences]);

  const handleSavePreferences = () => {
    const updatedPreferences = {
      ...preferences,
      enableVoiceRecording,
      sessionReminders,
      shareDataForResearch,
      reminderTime,
    };

    dispatch(saveTherapyPreferences(updatedPreferences));
    Alert.alert("Success", "Your preferences have been saved");
  };

  const handleAddEmergencyContact = () => {
    navigation.navigate("AddEmergencyContact");
  };

  const handleRemoveContact = (contactId: string) => {
    Alert.alert(
      "Remove Contact",
      "Are you sure you want to remove this emergency contact?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => dispatch(removeEmergencyContact(contactId)),
        },
      ],
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background?.primary || "#F7FAFC" },
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: theme.colors.brown?.[70] || "#704A33" },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessible
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.backButtonText,
              { color: theme.colors.background?.primary || "#FFF" },
            ]}
          >
            ← Back
          </Text>
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            { color: theme.colors.background?.primary || "#FFF" },
          ]}
        >
          Therapy Settings
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* General Settings */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.colors.background?.secondary || "#FFF",
              borderColor: theme.colors.border?.light || "#E2E8F0",
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.text?.primary || "#2D3748" },
            ]}
          >
            General Settings
          </Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text
                style={[
                  styles.settingLabel,
                  { color: theme.colors.text?.primary || "#2D3748" },
                ]}
              >
                Voice Recording
              </Text>
              <Text
                style={[
                  styles.settingDescription,
                  { color: theme.colors.text?.tertiary || "#A0AEC0" },
                ]}
              >
                Enable voice input for therapy sessions
              </Text>
            </View>
            <Switch
              value={enableVoiceRecording}
              onValueChange={setEnableVoiceRecording}
              trackColor={{
                false: theme.colors.gray?.[30] || "#CBD5E0",
                true: theme.colors.brown?.[50] || "#A67C5B",
              }}
              thumbColor={
                enableVoiceRecording
                  ? theme.colors.brown?.[70] || "#704A33"
                  : "#F7FAFC"
              }
            />
          </View>

          <View
            style={[
              styles.divider,
              { backgroundColor: theme.colors.border?.light || "#E2E8F0" },
            ]}
          />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text
                style={[
                  styles.settingLabel,
                  { color: theme.colors.text?.primary || "#2D3748" },
                ]}
              >
                Session Reminders
              </Text>
              <Text
                style={[
                  styles.settingDescription,
                  { color: theme.colors.text?.tertiary || "#A0AEC0" },
                ]}
              >
                Get daily reminders to check in
              </Text>
            </View>
            <Switch
              value={sessionReminders}
              onValueChange={setSessionReminders}
              trackColor={{
                false: theme.colors.gray?.[30] || "#CBD5E0",
                true: theme.colors.brown?.[50] || "#A67C5B",
              }}
              thumbColor={
                sessionReminders
                  ? theme.colors.brown?.[70] || "#704A33"
                  : "#F7FAFC"
              }
            />
          </View>

          {sessionReminders && (
            <View style={styles.settingRow}>
              <Text
                style={[
                  styles.settingLabel,
                  { color: theme.colors.text?.primary || "#2D3748" },
                ]}
              >
                Reminder Time
              </Text>
              <TextInput
                style={[
                  styles.timeInput,
                  {
                    backgroundColor:
                      theme.colors.background?.primary || "#F7FAFC",
                    borderColor: theme.colors.border?.light || "#E2E8F0",
                    color: theme.colors.text?.primary || "#2D3748",
                  },
                ]}
                value={reminderTime}
                onChangeText={setReminderTime}
                placeholder="19:00"
                placeholderTextColor={theme.colors.text?.tertiary || "#A0AEC0"}
              />
            </View>
          )}

          <View
            style={[
              styles.divider,
              { backgroundColor: theme.colors.border?.light || "#E2E8F0" },
            ]}
          />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text
                style={[
                  styles.settingLabel,
                  { color: theme.colors.text?.primary || "#2D3748" },
                ]}
              >
                Share for Research
              </Text>
              <Text
                style={[
                  styles.settingDescription,
                  { color: theme.colors.text?.tertiary || "#A0AEC0" },
                ]}
              >
                Help improve therapy with anonymous data
              </Text>
            </View>
            <Switch
              value={shareDataForResearch}
              onValueChange={setShareDataForResearch}
              trackColor={{
                false: theme.colors.gray?.[30] || "#CBD5E0",
                true: theme.colors.brown?.[50] || "#A67C5B",
              }}
              thumbColor={
                shareDataForResearch
                  ? theme.colors.brown?.[70] || "#704A33"
                  : "#F7FAFC"
              }
            />
          </View>
        </View>

        {/* Emergency Contacts */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.colors.background?.secondary || "#FFF",
              borderColor: theme.colors.border?.light || "#E2E8F0",
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.colors.text?.primary || "#2D3748" },
              ]}
            >
              Emergency Contacts
            </Text>
            <TouchableOpacity
              style={[
                styles.addButton,
                { backgroundColor: theme.colors.brown?.[70] || "#704A33" },
              ]}
              onPress={handleAddEmergencyContact}
              accessible
              accessibilityLabel="Add emergency contact"
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.addButtonText,
                  { color: theme.colors.background?.primary || "#FFF" },
                ]}
              >
                + Add
              </Text>
            </TouchableOpacity>
          </View>

          {preferences.emergencyContacts.length === 0 ? (
            <Text
              style={[
                styles.emptyText,
                { color: theme.colors.text?.tertiary || "#A0AEC0" },
              ]}
            >
              No emergency contacts added yet
            </Text>
          ) : (
            preferences.emergencyContacts.map((contact: any) => (
              <View
                key={contact.id}
                style={[
                  styles.contactCard,
                  { borderColor: theme.colors.border?.light || "#E2E8F0" },
                ]}
              >
                <View style={styles.contactInfo}>
                  <Text
                    style={[
                      styles.contactName,
                      { color: theme.colors.text?.primary || "#2D3748" },
                    ]}
                  >
                    {contact.name}
                  </Text>
                  <Text
                    style={[
                      styles.contactPhone,
                      { color: theme.colors.text?.secondary || "#718096" },
                    ]}
                  >
                    {contact.phone}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.removeButton,
                    { backgroundColor: theme.colors.orange?.[20] || "#FFF0E5" },
                  ]}
                  onPress={() => handleRemoveContact(contact.id)}
                  accessible
                  accessibilityLabel={`Remove ${contact.name}`}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.removeButtonText,
                      { color: theme.colors.orange?.[70] || "#E17B3A" },
                    ]}
                  >
                    Remove
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Crisis Resources */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.colors.background?.secondary || "#FFF",
              borderColor: theme.colors.border?.light || "#E2E8F0",
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.text?.primary || "#2D3748" },
            ]}
          >
            Crisis Resources
          </Text>

          {/* LOW-NEW-002 FIX: Use resource name as stable key instead of index */}
          {preferences.crisisResources.map((resource: any) => (
            <View
              key={`resource-${resource.name}`}
              style={[
                styles.resourceCard,
                { borderColor: theme.colors.border?.light || "#E2E8F0" },
              ]}
            >
              <Text
                style={[
                  styles.resourceName,
                  { color: theme.colors.text?.primary || "#2D3748" },
                ]}
              >
                {resource.name}
              </Text>
              <Text
                style={[
                  styles.resourceNumber,
                  { color: theme.colors.brown?.[70] || "#704A33" },
                ]}
              >
                {resource.number}
              </Text>
              <Text
                style={[
                  styles.resourceDescription,
                  { color: theme.colors.text?.secondary || "#718096" },
                ]}
              >
                {resource.description}
              </Text>
            </View>
          ))}
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: theme.colors.brown?.[70] || "#704A33" },
          ]}
          onPress={handleSavePreferences}
          disabled={loading}
          accessible
          accessibilityLabel="Save preferences"
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.saveButtonText,
              { color: theme.colors.background?.primary || "#FFF" },
            ]}
          >
            {loading ? "Saving..." : "Save Preferences"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  headerSpacer: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 20,
    paddingBottom: 40,
  },
  section: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  settingLeft: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  timeInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 16,
  },
  contactCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  removeButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  resourceCard: {
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 12,
  },
  resourceName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  resourceNumber: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  resourceDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

// LOW-NEW-001 FIX: Add displayName for debugging
TherapyPreferencesScreen.displayName = 'TherapyPreferencesScreen';

export default TherapyPreferencesScreen;
