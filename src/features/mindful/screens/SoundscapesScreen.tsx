/**
 * SoundscapesScreen Component
 * @description Third step of new exercise wizard with audio waveform visualization,
 *   horizontal soundscape chips, search input, and continue button
 * @task Task 3.12.5: Soundscapes Screen (Screen 108)
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
} from "react-native";

interface SoundscapeOption {
  id: string;
  name: string;
}

interface SoundscapesScreenProps {
  soundscapes: SoundscapeOption[];
  selectedSoundscapeId: string | null;
  stepLabel: string;
  searchQuery: string;
  onBack: () => void;
  onSoundscapeSelect: (id: string) => void;
  onSearchChange: (query: string) => void;
  onContinue: () => void;
}

const colors = {
  background: "#1C1410",
  white: "#FFFFFF",
  chipBg: "#2A1F18",
  chipSelected: "#E8853A",
  continueBg: "#C4A574",
  searchBg: "#2A1F18",
  textSecondary: "rgba(255,255,255,0.6)",
  stepIndicator: "#9AAD5C",
  waveformBar: "rgba(255,255,255,0.3)",
  waveformBarActive: "#C4A574",
} as const;

// Waveform bar heights (decorative placeholder)
const WAVEFORM_BARS = [
  0.3, 0.5, 0.4, 0.7, 0.6, 0.9, 1.0, 0.8, 0.95, 0.7, 0.5, 0.8, 0.6, 0.4, 0.9,
  1.0, 0.85, 0.7, 0.5, 0.3, 0.6, 0.8, 0.4, 0.5, 0.3,
];

export function SoundscapesScreen({
  soundscapes,
  selectedSoundscapeId,
  stepLabel,
  searchQuery,
  onBack,
  onSoundscapeSelect,
  onSearchChange,
  onContinue,
}: SoundscapesScreenProps): React.ReactElement {
  return (
    <View testID="soundscapes-screen" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>{"\u263E"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Exercise</Text>
        <View style={styles.headerSpacer} />
        <Text testID="step-indicator" style={styles.stepIndicator}>
          {stepLabel}
        </Text>
      </View>

      {/* Section Title */}
      <Text testID="section-title" style={styles.sectionTitle}>
        Select Soundscapes
      </Text>

      {/* Audio Waveform */}
      <View testID="audio-waveform" style={styles.waveformContainer}>
        {WAVEFORM_BARS.map((height, index) => (
          <View
            key={index}
            style={[
              styles.waveformBar,
              {
                height: height * 120,
                backgroundColor:
                  index >= 8 && index <= 14
                    ? colors.waveformBarActive
                    : colors.waveformBar,
              },
            ]}
          />
        ))}
      </View>

      {/* Soundscape Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chipsContent}
      >
        {soundscapes.map((soundscape) => {
          const isSelected = soundscape.id === selectedSoundscapeId;
          return (
            <TouchableOpacity
              key={soundscape.id}
              testID={`soundscape-chip-${soundscape.id}`}
              style={[
                styles.chip,
                isSelected ? styles.chipSelected : styles.chipUnselected,
              ]}
              onPress={() => onSoundscapeSelect(soundscape.id)}
              accessibilityRole="button"
              accessibilityLabel={`Select ${soundscape.name} soundscape`}
            >
              <Text
                style={[styles.chipText, isSelected && styles.chipTextSelected]}
              >
                {soundscape.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Search Input */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>{"\uD83D\uDD0D"}</Text>
          <TextInput
            accessibilityLabel="Text input field"
            testID="search-input"
            style={styles.searchInput}
            placeholder="Search Soundscapes"
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={onSearchChange}
          />
        </View>
      </View>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          testID="continue-button"
          style={styles.continueButton}
          onPress={onContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue to start exercise"
          activeOpacity={0.8}
        >
          <Text style={styles.continueText}>Continue {"\u2192"}</Text>
        </TouchableOpacity>
      </View>
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
  backIcon: {
    color: colors.white,
    fontSize: 24,
  },
  chip: {
    borderRadius: 24,
    minHeight: 44,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  chipSelected: {
    backgroundColor: colors.chipSelected,
  },
  chipText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  chipTextSelected: {
    color: colors.white,
  },
  chipUnselected: {
    backgroundColor: colors.chipBg,
  },
  chipsContent: {
    gap: 8,
    paddingHorizontal: 24,
  },
  chipsScroll: {
    flexGrow: 0,
    marginTop: 16,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  continueButton: {
    alignItems: "center",
    backgroundColor: colors.continueBg,
    borderRadius: 28,
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 16,
    width: "100%",
  },
  continueText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    paddingBottom: 48,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerSpacer: {
    flex: 1,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  searchContainer: {
    alignItems: "center",
    backgroundColor: colors.searchBg,
    borderRadius: 24,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    color: colors.white,
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  searchSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 24,
    paddingHorizontal: 24,
  },
  stepIndicator: {
    color: colors.stepIndicator,
    fontSize: 14,
    fontWeight: "600",
  },
  waveformBar: {
    borderRadius: 3,
    width: 6,
  },
  waveformContainer: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
});

export default SoundscapesScreen;
