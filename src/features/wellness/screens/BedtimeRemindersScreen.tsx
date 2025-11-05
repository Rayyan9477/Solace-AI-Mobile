/**
 * Bedtime Reminders Screen - Smart Notification Settings for Sleep
 * Based on ui-designs/Dark-mode/🔒 Sleep Quality.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
} from "react-native";

interface ReminderTime {
  id: string;
  label: string;
  time: string;
  enabled: boolean;
}

export const BedtimeRemindersScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const [smartReminders, setSmartReminders] = useState(true);
  const [windDownReminder, setWindDownReminder] = useState(true);
  const [bedtimeReminder, setBedtimeReminder] = useState(true);
  const [wakeUpReminder, setWakeUpReminder] = useState(false);

  const [selectedBedtime, setSelectedBedtime] = useState("22:00");
  const [selectedWakeTime, setSelectedWakeTime] = useState("06:00");

  const bedtimeOptions = [
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
    "00:00",
  ];

  const wakeTimeOptions = [
    "05:00",
    "05:30",
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.gray["20"],
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    content: {
      flex: 1,
    },
    infoCard: {
      backgroundColor: theme.colors.blue["20"],
      marginHorizontal: 20,
      marginTop: 20,
      borderRadius: 16,
      padding: 16,
      flexDirection: "row",
      alignItems: "flex-start",
    },
    infoIcon: {
      fontSize: 24,
      marginRight: 12,
    },
    infoText: {
      flex: 1,
      fontSize: 13,
      lineHeight: 18,
      color: theme.colors.text.primary,
    },
    section: {
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 12,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.secondary,
      textTransform: "uppercase",
      marginBottom: 16,
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.gray["20"],
    },
    settingLeft: {
      flex: 1,
      paddingRight: 12,
    },
    settingTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    settingDescription: {
      fontSize: 13,
      lineHeight: 18,
      color: theme.colors.text.secondary,
    },
    timePickerCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
    },
    timePickerTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    timePickerDisplay: {
      alignItems: "center",
      marginBottom: 20,
    },
    timePickerTime: {
      fontSize: 48,
      fontWeight: "800",
      color: theme.colors.purple["60"],
      marginBottom: 8,
    },
    timePickerLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    timeGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    timeButton: {
      width: "30%",
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: theme.colors.gray["20"],
      alignItems: "center",
    },
    timeButtonSelected: {
      backgroundColor: theme.colors.purple["60"],
    },
    timeButtonText: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    timeButtonTextSelected: {
      color: "#FFFFFF",
    },
    schedulePreview: {
      backgroundColor: theme.colors.purple["20"],
      marginHorizontal: 20,
      marginTop: 20,
      borderRadius: 16,
      padding: 20,
    },
    scheduleTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    scheduleItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    scheduleTime: {
      width: 80,
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.purple["80"],
    },
    scheduleDescription: {
      flex: 1,
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.text.primary,
    },
    scheduleIcon: {
      fontSize: 20,
      marginRight: 12,
    },
    saveButton: {
      backgroundColor: theme.colors.purple["60"],
      borderRadius: 16,
      paddingVertical: 16,
      marginHorizontal: 20,
      marginVertical: 24,
      alignItems: "center",
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
    },
  });

  const calculateWindDownTime = () => {
    const [hours, minutes] = selectedBedtime.split(":").map(Number);
    const windDownHour = hours - 1;
    return `${windDownHour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessible
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bedtime Reminders</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            Smart reminders help you maintain a consistent sleep schedule for
            better rest
          </Text>
        </View>

        {/* Reminder Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminder Settings</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>Smart Reminders</Text>
              <Text style={styles.settingDescription}>
                AI-optimized reminders based on your sleep patterns
              </Text>
            </View>
            <Switch
              value={smartReminders}
              onValueChange={setSmartReminders}
              trackColor={{
                false: theme.colors.gray["40"],
                true: theme.colors.purple["60"],
              }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>Wind Down Reminder</Text>
              <Text style={styles.settingDescription}>
                Reminds you 1 hour before bedtime to start winding down
              </Text>
            </View>
            <Switch
              value={windDownReminder}
              onValueChange={setWindDownReminder}
              trackColor={{
                false: theme.colors.gray["40"],
                true: theme.colors.purple["60"],
              }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>Bedtime Reminder</Text>
              <Text style={styles.settingDescription}>
                Notification at your scheduled bedtime
              </Text>
            </View>
            <Switch
              value={bedtimeReminder}
              onValueChange={setBedtimeReminder}
              trackColor={{
                false: theme.colors.gray["40"],
                true: theme.colors.purple["60"],
              }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>Wake Up Reminder</Text>
              <Text style={styles.settingDescription}>
                Gentle alarm at your scheduled wake time
              </Text>
            </View>
            <Switch
              value={wakeUpReminder}
              onValueChange={setWakeUpReminder}
              trackColor={{
                false: theme.colors.gray["40"],
                true: theme.colors.purple["60"],
              }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Bedtime Picker */}
        <View style={styles.section}>
          <View style={styles.timePickerCard}>
            <Text style={styles.timePickerTitle}>Bedtime</Text>
            <View style={styles.timePickerDisplay}>
              <Text style={styles.timePickerTime}>{selectedBedtime}</Text>
              <Text style={styles.timePickerLabel}>Target Bedtime</Text>
            </View>
            <View style={styles.timeGrid}>
              {bedtimeOptions.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeButton,
                    selectedBedtime === time && styles.timeButtonSelected,
                  ]}
                  onPress={() => setSelectedBedtime(time)}
                >
                  <Text
                    style={[
                      styles.timeButtonText,
                      selectedBedtime === time && styles.timeButtonTextSelected,
                    ]}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Wake Time Picker */}
          <View style={styles.timePickerCard}>
            <Text style={styles.timePickerTitle}>Wake Time</Text>
            <View style={styles.timePickerDisplay}>
              <Text style={styles.timePickerTime}>{selectedWakeTime}</Text>
              <Text style={styles.timePickerLabel}>Target Wake Time</Text>
            </View>
            <View style={styles.timeGrid}>
              {wakeTimeOptions.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeButton,
                    selectedWakeTime === time && styles.timeButtonSelected,
                  ]}
                  onPress={() => setSelectedWakeTime(time)}
                >
                  <Text
                    style={[
                      styles.timeButtonText,
                      selectedWakeTime === time &&
                        styles.timeButtonTextSelected,
                    ]}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Schedule Preview */}
        <View style={styles.schedulePreview}>
          <Text style={styles.scheduleTitle}>Your Sleep Schedule</Text>

          {windDownReminder && (
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleIcon}>🌙</Text>
              <Text style={styles.scheduleTime}>{calculateWindDownTime()}</Text>
              <Text style={styles.scheduleDescription}>Wind down reminder</Text>
            </View>
          )}

          {bedtimeReminder && (
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleIcon}>😴</Text>
              <Text style={styles.scheduleTime}>{selectedBedtime}</Text>
              <Text style={styles.scheduleDescription}>Time for bed</Text>
            </View>
          )}

          {wakeUpReminder && (
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleIcon}>☀️</Text>
              <Text style={styles.scheduleTime}>{selectedWakeTime}</Text>
              <Text style={styles.scheduleDescription}>Wake up time</Text>
            </View>
          )}
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Schedule ✓</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BedtimeRemindersScreen;
