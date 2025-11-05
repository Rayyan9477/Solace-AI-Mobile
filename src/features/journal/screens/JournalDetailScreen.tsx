/**
 * Journal Detail Screen - View/Edit Journal Entry
 * Based on ui-designs/Dark-mode/Mental Health Journal.png
 */

import { useNavigation, useRoute } from "@react-navigation/native";
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

interface JournalDetailProps {
  id: string;
  title: string;
  content: string;
  mood: string;
  date: string;
  time: string;
  tags: string[];
  color: string;
  audioUrl?: string;
  isVoice: boolean;
}

export const JournalDetailScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();

  // Mock data - in production this would come from Redux/API
  const [entry] = useState<JournalDetailProps>({
    id: "1",
    title: "Feeling Bad Again",
    content:
      "Today I had a hard time concentrating. I was very worried about making mistakes, very angry",
    mood: "😔",
    date: "Oct 22",
    time: "10:14 am",
    tags: ["Negative", "Regret"],
    color: "#C96100",
    isVoice: true,
    audioUrl: "mock-audio-url",
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

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
      borderBottomColor: theme.colors.brown["30"],
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.brown["20"],
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    moreButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      flex: 1,
      padding: 20,
    },
    dateSection: {
      marginBottom: 20,
    },
    date: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.secondary,
      marginBottom: 4,
    },
    title: {
      fontSize: 28,
      fontWeight: "800",
      color: theme.colors.text.primary,
      marginBottom: 12,
    },
    entryContent: {
      fontSize: 16,
      lineHeight: 24,
      color: theme.colors.text.primary,
      marginBottom: 24,
    },
    audioSection: {
      backgroundColor: theme.colors.brown["20"],
      borderRadius: 20,
      padding: 20,
      marginBottom: 24,
    },
    audioWaveform: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      height: 80,
      marginBottom: 16,
    },
    waveBar: {
      width: 4,
      backgroundColor: entry.color,
      borderRadius: 2,
      marginHorizontal: 2,
    },
    audioControls: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 20,
    },
    playButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.background.secondary,
      justifyContent: "center",
      alignItems: "center",
    },
    audioTime: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    tagsSection: {
      marginBottom: 24,
    },
    sectionLabel: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.secondary,
      marginBottom: 12,
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    tag: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: theme.colors.brown["20"],
    },
    tagText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
    moodSection: {
      marginBottom: 32,
    },
    moodDisplay: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    moodEmoji: {
      fontSize: 32,
    },
    moodLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
    footer: {
      padding: 20,
      gap: 12,
    },
    editButton: {
      backgroundColor: theme.colors.brown["70"],
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: "center",
    },
    editButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.background.secondary,
    },
    deleteButton: {
      backgroundColor: theme.colors.brown["20"],
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: "center",
    },
    deleteButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
  });

  const waveformHeights = [
    20, 35, 25, 45, 30, 50, 40, 35, 25, 40, 30, 45, 35, 25, 40,
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Journal</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Text style={{ fontSize: 20 }}>⋮</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Date & Title */}
        <View style={styles.dateSection}>
          <Text style={styles.date}>
            {entry.date} · {entry.time}
          </Text>
          <Text style={styles.title}>
            {entry.title} {entry.mood}
          </Text>
        </View>

        {/* Content */}
        <Text style={styles.entryContent}>{entry.content}</Text>

        {/* Voice Audio Player */}
        {entry.isVoice && (
          <View style={styles.audioSection}>
            <View style={styles.audioWaveform}>
              {waveformHeights.map((height, index) => (
                <View
                  key={index}
                  style={[
                    styles.waveBar,
                    {
                      height,
                      opacity:
                        index / waveformHeights.length <= audioProgress
                          ? 1
                          : 0.3,
                    },
                  ]}
                />
              ))}
            </View>
            <View style={styles.audioControls}>
              <TouchableOpacity onPress={() => setIsPlaying(!isPlaying)}>
                <Text style={{ fontSize: 24 }}>⏮</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => setIsPlaying(!isPlaying)}
              >
                <Text style={{ fontSize: 24 }}>{isPlaying ? "⏸" : "▶️"}</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={{ fontSize: 24 }}>⏭</Text>
              </TouchableOpacity>
            </View>
            <Text
              style={[styles.audioTime, { textAlign: "center", marginTop: 12 }]}
            >
              00:00 / 02:34
            </Text>
          </View>
        )}

        {/* Tags */}
        <View style={styles.tagsSection}>
          <Text style={styles.sectionLabel}>Tags</Text>
          <View style={styles.tagsContainer}>
            {entry.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Mood */}
        <View style={styles.moodSection}>
          <Text style={styles.sectionLabel}>Mood</Text>
          <View style={styles.moodDisplay}>
            <Text style={styles.moodEmoji}>{entry.mood}</Text>
            <Text style={styles.moodLabel}>Negative</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Journal Entry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete Entry</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default JournalDetailScreen;
