/**
 * Journal Calendar Screen - Calendar View of Journal Entries
 * Based on ui-designs/Dark-mode/Mental Health Journal.png
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
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

interface JournalEntry {
  date: number;
  title: string;
  mood: string;
  emoji: string;
  preview: string;
}

export const JournalCalendarScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  const journalEntries: { [key: number]: JournalEntry } = {
    22: {
      date: 22,
      title: "Feeling Bad Again",
      mood: "Anxious",
      emoji: "😰",
      preview: "I felt so overwhelmed today...",
    },
    24: {
      date: 24,
      title: "Progress Today!",
      mood: "Happy",
      emoji: "😊",
      preview: "In grateful for the supportive phone call...",
    },
    26: {
      date: 26,
      title: "Get A Gift from my BF OMG!",
      mood: "Excited",
      emoji: "😄",
      preview: "I experienced pure joy today when...",
    },
    27: {
      date: 27,
      title: "Felt Bad, but it's OK",
      mood: "Neutral",
      emoji: "😐",
      preview: "I felt anxious today during the team...",
    },
    28: {
      date: 28,
      title: "Felt Sad & Glad. IDK what to do",
      mood: "Mixed",
      emoji: "😕",
      preview: "Feeling confused after hearing a...",
    },
    30: {
      date: 30,
      title: "I amazed and myself",
      mood: "Proud",
      emoji: "😌",
      preview: "An important day! Decided feeling...",
    },
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "Happy":
      case "Excited":
        return theme.colors.green["60"];
      case "Neutral":
      case "Proud":
        return theme.colors.yellow["60"];
      case "Mixed":
      case "Anxious":
        return theme.colors.orange["60"];
      case "Sad":
        return theme.colors.purple["60"];
      default:
        return theme.colors.gray["40"];
    }
  };

  const generateCalendarDays = () => {
    const month = selectedMonth.getMonth();
    const year = selectedMonth.getFullYear();
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);

    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const changeMonth = (direction: "prev" | "next") => {
    const newDate = new Date(selectedMonth);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedMonth(newDate);
    setSelectedDate(null);
  };

  const calendarDays = generateCalendarDays();
  const totalEntries = Object.keys(journalEntries).length;

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
    statsButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: theme.colors.brown["60"],
      borderRadius: 12,
    },
    statsButtonText: {
      fontSize: 12,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    content: {
      flex: 1,
      padding: 20,
    },
    summaryCard: {
      backgroundColor: theme.colors.orange["20"],
      borderRadius: 20,
      padding: 24,
      marginBottom: 24,
      alignItems: "center",
    },
    summaryNumber: {
      fontSize: 64,
      fontWeight: "800",
      color: theme.colors.orange["100"],
      marginBottom: 8,
    },
    summaryText: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.orange["80"],
    },
    monthSelector: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    monthButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 20,
    },
    monthText: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    calendarCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 20,
      padding: 20,
      marginBottom: 24,
    },
    weekDaysRow: {
      flexDirection: "row",
      marginBottom: 12,
    },
    weekDay: {
      flex: 1,
      alignItems: "center",
    },
    weekDayText: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.colors.text.secondary,
    },
    calendarGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    dayCell: {
      width: `${100 / 7}%`,
      aspectRatio: 1,
      padding: 4,
    },
    dayButton: {
      flex: 1,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background.primary,
    },
    dayWithEntry: {
      borderWidth: 2,
    },
    dayNumber: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
    dayDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      marginTop: 2,
    },
    emptyDay: {
      backgroundColor: "transparent",
    },
    selectedDay: {
      backgroundColor: theme.colors.brown["40"],
    },
    entryPreview: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    },
    entryHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    entryEmoji: {
      fontSize: 24,
      marginRight: 8,
    },
    entryTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      flex: 1,
    },
    entryMoodBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },
    entryMoodText: {
      fontSize: 11,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    entryPreviewText: {
      fontSize: 13,
      lineHeight: 18,
      color: theme.colors.text.secondary,
      marginBottom: 8,
    },
    entryDate: {
      fontSize: 11,
      fontWeight: "600",
      color: theme.colors.text.tertiary,
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: 40,
    },
    emptyIcon: {
      fontSize: 48,
      marginBottom: 12,
    },
    emptyText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.secondary,
      textAlign: "center",
    },
  });

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
        <Text style={styles.headerTitle}>Health Journal</Text>
        <TouchableOpacity style={styles.statsButton}>
          <Text style={styles.statsButtonText}>Stats</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{totalEntries}</Text>
          <Text style={styles.summaryText}>Journals this year</Text>
        </View>

        {/* Month Selector */}
        <View style={styles.monthSelector}>
          <TouchableOpacity
            style={styles.monthButton}
            onPress={() => changeMonth("prev")}
          >
            <Text style={{ fontSize: 20 }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
          </Text>
          <TouchableOpacity
            style={styles.monthButton}
            onPress={() => changeMonth("next")}
          >
            <Text style={{ fontSize: 20 }}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar */}
        <View style={styles.calendarCard}>
          {/* Week Days Header */}
          <View style={styles.weekDaysRow}>
            {/* LOW-NEW-002 FIX: Use day name as stable key instead of index */}
            {weekDays.map((day) => (
              <View key={`weekday-${day}`} style={styles.weekDay}>
                <Text style={styles.weekDayText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((day, index) => {
              if (!day) {
                return (
                  <View key={`empty-${index}`} style={styles.dayCell}>
                    <View style={[styles.dayButton, styles.emptyDay]} />
                  </View>
                );
              }

              const entry = journalEntries[day];
              const isSelected = selectedDate === day;

              return (
                <View key={`day-${day}`} style={styles.dayCell}>
                  <TouchableOpacity
                    style={[
                      styles.dayButton,
                      entry && styles.dayWithEntry,
                      isSelected && styles.selectedDay,
                      entry && { borderColor: getMoodColor(entry.mood) },
                    ]}
                    onPress={() => setSelectedDate(day)}
                  >
                    <Text style={styles.dayNumber}>{day}</Text>
                    {entry && (
                      <View
                        style={[
                          styles.dayDot,
                          { backgroundColor: getMoodColor(entry.mood) },
                        ]}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

        {/* Entry Preview */}
        {selectedDate && journalEntries[selectedDate] ? (
          <View style={styles.entryPreview}>
            <View style={styles.entryHeader}>
              <Text style={styles.entryEmoji}>
                {journalEntries[selectedDate].emoji}
              </Text>
              <Text style={styles.entryTitle}>
                {journalEntries[selectedDate].title}
              </Text>
              <View
                style={[
                  styles.entryMoodBadge,
                  {
                    backgroundColor: getMoodColor(
                      journalEntries[selectedDate].mood,
                    ),
                  },
                ]}
              >
                <Text style={styles.entryMoodText}>
                  {journalEntries[selectedDate].mood}
                </Text>
              </View>
            </View>
            <Text style={styles.entryPreviewText}>
              {journalEntries[selectedDate].preview}
            </Text>
            <Text style={styles.entryDate}>
              {monthNames[selectedMonth.getMonth()]} {selectedDate},{" "}
              {selectedMonth.getFullYear()}
            </Text>
          </View>
        ) : selectedDate ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📔</Text>
            <Text style={styles.emptyText}>No journal entry for this day</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

// LOW-NEW-001 FIX: Add displayName for debugging
JournalCalendarScreen.displayName = 'JournalCalendarScreen';

export default JournalCalendarScreen;
