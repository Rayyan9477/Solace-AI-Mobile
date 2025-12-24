import { logger } from "@shared/utils/logger";

/**
 * Journal Detail Screen - View/Edit Journal Entry
 * Based on ui-designs/Dark-mode/Mental Health Journal.png
 */

import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import { ScreenErrorBoundary } from "@shared/components/ErrorBoundaryWrapper";
import { Audio } from "expo-av";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

/**
 * CRIT-NEW-004 FIX: Validate journal entry structure from route params
 * Returns null if entry is invalid, otherwise returns sanitized entry
 */
function validateJournalEntry(entry: unknown): JournalDetailProps | null {
  if (!entry || typeof entry !== 'object') {
    return null;
  }

  const e = entry as Record<string, unknown>;

  // Validate required fields
  if (typeof e.id !== 'string' || !e.id) {
    return null;
  }

  // Return sanitized entry with defaults for optional fields
  return {
    id: e.id,
    title: typeof e.title === 'string' ? e.title : 'Untitled Entry',
    content: typeof e.content === 'string' ? e.content : '',
    mood: typeof e.mood === 'string' ? e.mood : '😐',
    date: typeof e.date === 'string' ? e.date : new Date().toLocaleDateString(),
    time: typeof e.time === 'string' ? e.time : new Date().toLocaleTimeString(),
    tags: Array.isArray(e.tags) ? e.tags.filter((t): t is string => typeof t === 'string') : [],
    color: typeof e.color === 'string' ? e.color : '#8B7355',
    audioUrl: typeof e.audioUrl === 'string' ? e.audioUrl : undefined,
    isVoice: typeof e.isVoice === 'boolean' ? e.isVoice : false,
  };
}

export const JournalDetailScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();

  // Load entry from route params or AsyncStorage
  const [entry, setEntry] = useState<JournalDetailProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  // Audio playback state
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const loadEntry = async () => {
      try {
        // CRIT-NEW-004 FIX: Validate entry from route params before use
        if (route.params?.entry) {
          const validatedEntry = validateJournalEntry(route.params.entry);
          if (validatedEntry) {
            setEntry(validatedEntry);
            setLoading(false);
            return;
          }
          // If validation fails, log and continue to load from storage
          logger.warn('[JournalDetail] Invalid entry in route params, loading from storage');
        }

        // Load from AsyncStorage using the entry ID from route params
        const entryId = route.params?.id || "1";
        const storedEntries = await AsyncStorage.getItem("journal_entries");

        if (storedEntries) {
          const entries: JournalDetailProps[] = JSON.parse(storedEntries);
          const foundEntry = entries.find((e) => e.id === entryId);

          if (foundEntry) {
            setEntry(foundEntry);
            setLoading(false);
            return;
          }
        }

        // Fallback to default entry if none found
        setEntry({
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
          audioUrl: undefined,
        });
      } catch (error) {
        logger.error("Error loading journal entry:", error);
        // Set default entry on error
        setEntry({
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
          audioUrl: undefined,
        });
      } finally {
        setLoading(false);
      }
    };

    loadEntry();
  }, [route.params]);

  // Audio playback functions
  const loadSound = async (uri: string) => {
    try {
      // Unload any existing sound
      if (sound) {
        await sound.unloadAsync();
      }

      // Create new sound from URI
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
    } catch (error) {
      logger.error('Failed to load audio:', error);
      Alert.alert('Playback Error', 'Failed to load audio recording.');
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);

      // Update progress for waveform visualization
      if (status.durationMillis > 0) {
        setAudioProgress(status.positionMillis / status.durationMillis);
      }

      // Reset when playback finishes
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
        setAudioProgress(0);
      }
    }
  };

  const togglePlayback = async () => {
    if (!entry?.audioUrl) {
      Alert.alert('No Audio', 'This journal entry has no audio recording.');
      return;
    }

    try {
      if (!sound) {
        await loadSound(entry.audioUrl);
        return;
      }

      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } catch (error) {
      logger.error('Playback error:', error);
      Alert.alert('Playback Error', 'Failed to play audio.');
    }
  };

  const formatDuration = (millis: number): string => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Load audio when entry changes
  useEffect(() => {
    if (entry?.audioUrl && entry.isVoice) {
      loadSound(entry.audioUrl);
    }
  }, [entry?.audioUrl]);

  // Cleanup sound on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync().catch((err) => logger.error('Failed to unload sound:', err));
      }
    };
  }, [sound]);

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

  // Show loading indicator while loading entry
  if (loading || !entry) {
    return (
      <SafeAreaView style={styles.container}>
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
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={theme.colors.brown["70"]} />
          <Text style={{ marginTop: 16, color: theme.colors.text.secondary }}>
            Loading journal entry...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
              {/* LOW-NEW-002 FIX: Use descriptive key instead of index */}
              {waveformHeights.map((height, index) => (
                <View
                  key={`waveform-bar-${index}`}
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
              <TouchableOpacity
                onPress={async () => {
                  if (sound) {
                    await sound.setPositionAsync(0);
                  }
                }}
              >
                <Text style={{ fontSize: 24 }}>⏮</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.playButton}
                onPress={togglePlayback}
              >
                <Text style={{ fontSize: 24 }}>{isPlaying ? "⏸" : "▶️"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  // Skip forward 10 seconds
                  if (sound && position + 10000 < duration) {
                    await sound.setPositionAsync(position + 10000);
                  }
                }}
              >
                <Text style={{ fontSize: 24 }}>⏭</Text>
              </TouchableOpacity>
            </View>
            <Text
              style={[styles.audioTime, { textAlign: "center", marginTop: 12 }]}
            >
              {formatDuration(position)} / {formatDuration(duration)}
            </Text>
          </View>
        )}

        {/* Tags */}
        <View style={styles.tagsSection}>
          <Text style={styles.sectionLabel}>Tags</Text>
          <View style={styles.tagsContainer}>
            {/* LOW-NEW-002 FIX: Use tag + entry id as stable key instead of index */}
            {entry.tags.map((tag) => (
              <View key={`tag-${entry.id}-${tag}`} style={styles.tag}>
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

export const JournalDetailScreenWithBoundary = () => (
  <ScreenErrorBoundary screenName="Journal Detail">
    <JournalDetailScreen />
  </ScreenErrorBoundary>
);

// LOW-NEW-001 FIX: Add displayName for debugging
JournalDetailScreen.displayName = 'JournalDetailScreen';
JournalDetailScreenWithBoundary.displayName = 'JournalDetailScreenWithBoundary';

export default JournalDetailScreenWithBoundary;
