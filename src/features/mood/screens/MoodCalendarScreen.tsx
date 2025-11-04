/**
 * Mood Calendar Screen - Visual Mood Tracking Over Time
 * Based on ui-designs/Dark-mode/Mood Tracker.png
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@theme/ThemeProvider';

const { width } = Dimensions.get('window');

interface DayMood {
  date: number;
  mood: string;
  emoji: string;
  intensity: number;
}

interface MonthData {
  month: string;
  year: number;
  days: (DayMood | null)[];
}

export const MoodCalendarScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const moodData: { [key: number]: DayMood } = {
    1: { date: 1, mood: 'Happy', emoji: '😊', intensity: 4 },
    3: { date: 3, mood: 'Sad', emoji: '😢', intensity: 2 },
    5: { date: 5, mood: 'Excited', emoji: '😄', intensity: 5 },
    7: { date: 7, mood: 'Neutral', emoji: '😐', intensity: 3 },
    10: { date: 10, mood: 'Happy', emoji: '😊', intensity: 4 },
    12: { date: 12, mood: 'Depressed', emoji: '😞', intensity: 1 },
    15: { date: 15, mood: 'Happy', emoji: '😊', intensity: 4 },
    18: { date: 18, mood: 'Excited', emoji: '😄', intensity: 5 },
    20: { date: 20, mood: 'Neutral', emoji: '😐', intensity: 3 },
    22: { date: 22, mood: 'Happy', emoji: '😊', intensity: 4 },
    25: { date: 25, mood: 'Sad', emoji: '😢', intensity: 2 },
    28: { date: 28, mood: 'Happy', emoji: '😊', intensity: 4 },
  };

  const getMoodColor = (intensity: number) => {
    if (intensity >= 5) return theme.colors.green['60'];
    if (intensity >= 4) return theme.colors.yellow['60'];
    if (intensity >= 3) return theme.colors.orange['60'];
    if (intensity >= 2) return theme.colors.red['40'];
    return theme.colors.purple['60'];
  };

  const generateCalendarDays = () => {
    const month = selectedMonth.getMonth();
    const year = selectedMonth.getFullYear();
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);

    const days: (DayMood | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(moodData[day] || null);
    }

    return days;
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedMonth);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedMonth(newDate);
  };

  const goToToday = () => {
    setSelectedMonth(new Date());
  };

  const handleDayPress = (day: DayMood) => {
    // TODO: Navigate to mood detail screen or show mood entry modal
    // navigation.navigate('MoodDetail', { date: day.date, mood: day.mood });
    if (__DEV__) {
      console.log('Day pressed:', day);
    }
  };

  const calendarDays = generateCalendarDays();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.gray['20'],
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text.primary,
    },
    todayButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: theme.colors.brown['60'],
      borderRadius: 12,
    },
    todayButtonText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    content: {
      flex: 1,
      padding: 20,
    },
    monthSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    monthButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.brown['10'],
      borderRadius: 20,
    },
    monthText: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text.primary,
    },
    calendarCard: {
      backgroundColor: theme.colors.brown['10'],
      borderRadius: 20,
      padding: 20,
      marginBottom: 24,
    },
    weekDaysRow: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    weekDay: {
      flex: 1,
      alignItems: 'center',
    },
    weekDayText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.text.secondary,
    },
    calendarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    dayCell: {
      width: `${100 / 7}%`,
      aspectRatio: 1,
      padding: 4,
    },
    dayButton: {
      flex: 1,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background.primary,
    },
    dayWithMood: {
      borderWidth: 2,
    },
    dayEmoji: {
      fontSize: 20,
      marginBottom: 2,
    },
    dayNumber: {
      fontSize: 10,
      fontWeight: '600',
      color: theme.colors.text.secondary,
    },
    emptyDay: {
      backgroundColor: 'transparent',
    },
    legend: {
      marginBottom: 24,
    },
    legendTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: 12,
    },
    legendRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    legendEmoji: {
      fontSize: 18,
    },
    legendLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.text.secondary,
    },
    statsCard: {
      backgroundColor: theme.colors.brown['10'],
      borderRadius: 16,
      padding: 20,
    },
    statsTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    statBox: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
    },
    statValue: {
      fontSize: 24,
      fontWeight: '800',
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
  });

  const moodCounts = Object.values(moodData).reduce((acc, day) => {
    acc[day.mood] = (acc[day.mood] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const totalDays = Object.keys(moodData).length;
  const averageMood = (
    Object.values(moodData).reduce((sum, day) => sum + day.intensity, 0) / totalDays
  ).toFixed(1);

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
        <Text style={styles.headerTitle}>Mood Calendar</Text>
        <TouchableOpacity
          style={styles.todayButton}
          onPress={goToToday}
          accessible
          accessibilityLabel="Go to today"
          accessibilityRole="button"
          accessibilityHint="Jumps to current month"
        >
          <Text style={styles.todayButtonText}>Today</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Month Selector */}
        <View style={styles.monthSelector}>
          <TouchableOpacity style={styles.monthButton} onPress={() => changeMonth('prev')}>
            <Text style={{ fontSize: 20 }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
          </Text>
          <TouchableOpacity style={styles.monthButton} onPress={() => changeMonth('next')}>
            <Text style={{ fontSize: 20 }}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar */}
        <View style={styles.calendarCard}>
          {/* Week Days Header */}
          <View style={styles.weekDaysRow}>
            {weekDays.map((day, index) => (
              <View key={index} style={styles.weekDay}>
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

              const moodColor = getMoodColor(day.intensity);

              return (
                <View key={index} style={styles.dayCell}>
                  <TouchableOpacity
                    style={[
                      styles.dayButton,
                      day && styles.dayWithMood,
                      { borderColor: moodColor },
                    ]}
                    onPress={() => handleDayPress(day)}
                    accessible
                    accessibilityLabel={`${day.mood} mood on day ${day.date}`}
                    accessibilityRole="button"
                    accessibilityHint="View mood details for this day"
                  >
                    <Text style={styles.dayEmoji}>{day.emoji}</Text>
                    <Text style={styles.dayNumber}>{day.date}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Mood Legend</Text>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <Text style={styles.legendEmoji}>😄</Text>
              <Text style={styles.legendLabel}>Excited</Text>
            </View>
            <View style={styles.legendItem}>
              <Text style={styles.legendEmoji}>😊</Text>
              <Text style={styles.legendLabel}>Happy</Text>
            </View>
            <View style={styles.legendItem}>
              <Text style={styles.legendEmoji}>😐</Text>
              <Text style={styles.legendLabel}>Neutral</Text>
            </View>
            <View style={styles.legendItem}>
              <Text style={styles.legendEmoji}>😢</Text>
              <Text style={styles.legendLabel}>Sad</Text>
            </View>
            <View style={styles.legendItem}>
              <Text style={styles.legendEmoji}>😞</Text>
              <Text style={styles.legendLabel}>Depressed</Text>
            </View>
          </View>
        </View>

        {/* Monthly Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Monthly Summary</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totalDays}</Text>
              <Text style={styles.statLabel}>Days Tracked</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{averageMood}</Text>
              <Text style={styles.statLabel}>Average Mood</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{moodCounts['Happy'] || 0}</Text>
              <Text style={styles.statLabel}>Happy Days</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MoodCalendarScreen;
