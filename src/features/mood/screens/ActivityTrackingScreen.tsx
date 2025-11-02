import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@theme/ThemeProvider';

export const ActivityTrackingScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const activities = [
    { id: '1', name: 'Exercise', impact: 'Positive', icon: '🏃', count: 5 },
    { id: '2', name: 'Social Time', impact: 'Positive', icon: '👥', count: 8 },
    { id: '3', name: 'Work Stress', impact: 'Negative', icon: '💼', count: 12 },
    { id: '4', name: 'Sleep', impact: 'Positive', icon: '😴', count: 7 },
  ];

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background.primary },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: theme.colors.gray['20'] },
    backButton: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: theme.colors.text.primary, textAlign: 'center' },
    content: { padding: 20 },
    activityCard: { backgroundColor: theme.colors.brown['10'], borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
    activityIcon: { fontSize: 32, marginRight: 12 },
    activityInfo: { flex: 1 },
    activityName: { fontSize: 16, fontWeight: '700', color: theme.colors.text.primary },
    activityImpact: { fontSize: 13, color: theme.colors.text.secondary },
    activityCount: { fontSize: 20, fontWeight: '800', color: theme.colors.brown['80'] },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activity Tracking</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView style={styles.content}>
        {activities.map(activity => (
          <View key={activity.id} style={styles.activityCard}>
            <Text style={styles.activityIcon}>{activity.icon}</Text>
            <View style={styles.activityInfo}>
              <Text style={styles.activityName}>{activity.name}</Text>
              <Text style={styles.activityImpact}>{activity.impact} Impact</Text>
            </View>
            <Text style={styles.activityCount}>{activity.count}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ActivityTrackingScreen;
