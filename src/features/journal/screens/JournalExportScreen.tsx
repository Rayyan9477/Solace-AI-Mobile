/**
 * Journal Export Screen - Share or Backup Journal Data
 * Based on ui-designs/Dark-mode/🔒 Mental Health Journal.png
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
} from "react-native";

interface ExportOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  format: string;
}

export const JournalExportScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [selectedFormat, setSelectedFormat] = useState<string>("pdf");
  const [selectedRange, setSelectedRange] = useState<string>("all");

  const exportOptions: ExportOption[] = [
    {
      id: "pdf",
      title: "PDF Document",
      description: "Formatted document with all entries",
      icon: "📄",
      format: "PDF",
    },
    {
      id: "txt",
      title: "Text File",
      description: "Plain text format for easy reading",
      icon: "📝",
      format: "TXT",
    },
    {
      id: "json",
      title: "JSON Data",
      description: "Structured data for backup",
      icon: "💾",
      format: "JSON",
    },
    {
      id: "email",
      title: "Email",
      description: "Send entries to your email",
      icon: "📧",
      format: "EMAIL",
    },
  ];

  const dateRanges = [
    { id: "all", label: "All Entries", count: 245 },
    { id: "month", label: "Last Month", count: 28 },
    { id: "week", label: "Last Week", count: 7 },
    { id: "custom", label: "Custom Range", count: 0 },
  ];

  const stats = {
    totalEntries: 245,
    totalWords: 125430,
    averageLength: 512,
    oldestEntry: "Jan 15, 2023",
    newestEntry: "Oct 15, 2024",
  };

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
    statsCard: {
      backgroundColor: theme.colors.blue["20"],
      marginHorizontal: 20,
      marginTop: 20,
      borderRadius: 20,
      padding: 20,
    },
    statsTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 16,
    },
    statItem: {
      width: "47%",
    },
    statValue: {
      fontSize: 24,
      fontWeight: "800",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    section: {
      paddingHorizontal: 20,
      marginTop: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    exportCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "transparent",
    },
    exportCardSelected: {
      borderColor: theme.colors.orange["60"],
      backgroundColor: theme.colors.orange["10"],
    },
    exportIcon: {
      fontSize: 32,
      marginRight: 16,
    },
    exportInfo: {
      flex: 1,
    },
    exportTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    exportDescription: {
      fontSize: 13,
      lineHeight: 18,
      color: theme.colors.text.secondary,
    },
    exportFormat: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: theme.colors.orange["60"],
    },
    exportFormatText: {
      fontSize: 11,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    rangeCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 2,
      borderColor: "transparent",
    },
    rangeCardSelected: {
      borderColor: theme.colors.orange["60"],
      backgroundColor: theme.colors.orange["10"],
    },
    rangeInfo: {
      flex: 1,
    },
    rangeLabel: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    rangeCount: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    selectionBadge: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.colors.gray["40"],
      justifyContent: "center",
      alignItems: "center",
    },
    selectionBadgeSelected: {
      backgroundColor: theme.colors.orange["60"],
      borderColor: theme.colors.orange["60"],
    },
    selectionCheck: {
      fontSize: 14,
      color: "#FFFFFF",
    },
    privacyCard: {
      backgroundColor: theme.colors.purple["20"],
      marginHorizontal: 20,
      marginTop: 24,
      borderRadius: 16,
      padding: 16,
      flexDirection: "row",
      alignItems: "flex-start",
    },
    privacyIcon: {
      fontSize: 24,
      marginRight: 12,
    },
    privacyText: {
      flex: 1,
    },
    privacyTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    privacyDescription: {
      fontSize: 13,
      lineHeight: 18,
      color: theme.colors.text.secondary,
    },
    exportButton: {
      backgroundColor: theme.colors.orange["60"],
      borderRadius: 16,
      paddingVertical: 16,
      marginHorizontal: 20,
      marginVertical: 24,
      alignItems: "center",
    },
    exportButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
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
        <Text style={styles.headerTitle}>Export Journal</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Card */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Journal Summary</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalEntries}</Text>
              <Text style={styles.statLabel}>Total Entries</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {(stats.totalWords / 1000).toFixed(1)}k
              </Text>
              <Text style={styles.statLabel}>Total Words</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.averageLength}</Text>
              <Text style={styles.statLabel}>Avg Length</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>1.7y</Text>
              <Text style={styles.statLabel}>Time Span</Text>
            </View>
          </View>
        </View>

        {/* Export Format */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Format</Text>
          {exportOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.exportCard,
                selectedFormat === option.id && styles.exportCardSelected,
              ]}
              onPress={() => setSelectedFormat(option.id)}
            >
              <Text style={styles.exportIcon}>{option.icon}</Text>
              <View style={styles.exportInfo}>
                <Text style={styles.exportTitle}>{option.title}</Text>
                <Text style={styles.exportDescription}>
                  {option.description}
                </Text>
              </View>
              <View style={styles.exportFormat}>
                <Text style={styles.exportFormatText}>{option.format}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date Range */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date Range</Text>
          {dateRanges.map((range) => (
            <TouchableOpacity
              key={range.id}
              style={[
                styles.rangeCard,
                selectedRange === range.id && styles.rangeCardSelected,
              ]}
              onPress={() => setSelectedRange(range.id)}
            >
              <View style={styles.rangeInfo}>
                <Text style={styles.rangeLabel}>{range.label}</Text>
                {range.count > 0 && (
                  <Text style={styles.rangeCount}>{range.count} entries</Text>
                )}
              </View>
              <View
                style={[
                  styles.selectionBadge,
                  selectedRange === range.id && styles.selectionBadgeSelected,
                ]}
              >
                {selectedRange === range.id && (
                  <Text style={styles.selectionCheck}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyCard}>
          <Text style={styles.privacyIcon}>🔒</Text>
          <View style={styles.privacyText}>
            <Text style={styles.privacyTitle}>Privacy & Security</Text>
            <Text style={styles.privacyDescription}>
              Your journal entries are encrypted during export. We recommend
              using secure methods to share or store your data.
            </Text>
          </View>
        </View>

        {/* Export Button */}
        <TouchableOpacity style={styles.exportButton}>
          <Text style={styles.exportButtonText}>Export Journal 📤</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default JournalExportScreen;
