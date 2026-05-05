/**
 * TextJournalComposerScreen — prototype v4.2 #28 Journal Composer reskin (Sprint 7).
 *
 * Visual ref: prototypes/screens/28-journal-composer.js
 * - Mood strip (5 MoodFace circles, aurora ring on selected)
 * - BracketLabel date+weather row
 * - Borderless Fraunces title input
 * - AuroraHairline divider
 * - SuggestionCard writing prompt (dismissible)
 * - Multiline body TextInput
 * - Scrollable HashtagChip row
 * - Sticky bottom toolbar (bold/italic/list/image/mic + word count)
 * - Floating peach FAB save button
 */

import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "@/shared/theme/useTheme";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { ScreenContainer } from "@/shared/components/atoms/layout";
import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import {
  AuroraHairline,
  BracketLabel,
  MoodFace,
  MOOD_LEVELS,
  type MoodLevel,
} from "@/shared/components/primitives";
import { HashtagChip } from "@/shared/components/molecules/chips/HashtagChip";
import { SuggestionCard } from "@/shared/components/molecules/cards/SuggestionCard";
import { detectCrisisSignals } from "@/features/chat/services/crisisClassifier";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TextJournalComposerScreenProps {
  /** Initial title */
  title: string;
  onTitleChange: (text: string) => void;
  /** Initial body */
  body: string;
  onBodyChange: (text: string) => void;
  /** Selected mood level (1-5 or null) */
  moodLevel: MoodLevel | null;
  onMoodLevelChange: (level: MoodLevel | null) => void;
  /** Selected hashtag labels */
  hashtags: string[];
  onHashtagsChange: (ids: string[]) => void;
  /** Available hashtag options */
  hashtagOptions?: string[];
  /** Optional date label, defaults to "Today" */
  dateLabel?: string;
  /** Optional weather suffix, e.g., "64°F ☀️" */
  weatherLabel?: string;
  /** Suggestion to show — null hides the suggestion card */
  suggestion?: { title: string; body: string } | null;
  onSuggestionDismiss?: () => void;
  onClose: () => void;
  onSave: () => void;
  /**
   * Invoked when the rule-based crisis classifier matches the journal body
   * on save (Sprint 9 8.4 wiring). The host typically navigates to
   * `CrisisModal`. Save is NOT blocked — both happen.
   */
  onCrisisDetected?: (body: string) => void;
  /** Toolbar handlers (optional — buttons render disabled if not provided) */
  onBoldPress?: () => void;
  onItalicPress?: () => void;
  onListPress?: () => void;
  onImagePress?: () => void;
  onMicPress?: () => void;
  testID?: string;
}

const DEFAULT_HASHTAG_OPTIONS = [
  "anxious",
  "hopeful",
  "tired",
  "grateful",
  "calm",
  "overwhelmed",
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TextJournalComposerScreen({
  title,
  onTitleChange,
  body,
  onBodyChange,
  moodLevel,
  onMoodLevelChange,
  hashtags,
  onHashtagsChange,
  hashtagOptions = DEFAULT_HASHTAG_OPTIONS,
  dateLabel = "Today",
  weatherLabel,
  suggestion,
  onSuggestionDismiss,
  onClose,
  onSave,
  onCrisisDetected,
  onBoldPress,
  onItalicPress,
  onListPress,
  onImagePress,
  onMicPress,
  testID = "text-journal-composer-screen",
}: TextJournalComposerScreenProps): React.ReactElement {
  const { palette } = useTheme();
  // Honor reduce-motion: ring opacity could be animated but we keep it static when requested
  const reducedMotion = useReducedMotion();

  const wordCount = useMemo(() => {
    const trimmed = body.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }, [body]);

  const dateWeatherLabel = weatherLabel
    ? `${dateLabel} · ${weatherLabel}`
    : dateLabel;

  function handleMoodPress(level: MoodLevel): void {
    onMoodLevelChange(moodLevel === level ? null : level);
  }

  function handleSave(): void {
    // Sprint 9 8.4 — rule-based crisis tripwire on journal save. Fires the
    // optional callback BEFORE the host's onSave so a CrisisModal can open
    // even if save persistence is async.
    if (onCrisisDetected) {
      const detection = detectCrisisSignals(body);
      if (detection.matched) {
        onCrisisDetected(body);
      }
    }
    onSave();
  }

  function handleHashtagPress(tag: string): void {
    if (hashtags.includes(tag)) {
      onHashtagsChange(hashtags.filter((t) => t !== tag));
    } else {
      onHashtagsChange([...hashtags, tag]);
    }
  }

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={styles.container}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                               */}
      {/* ------------------------------------------------------------------ */}
      <View style={[styles.header, { borderBottomColor: palette.midnight[800] }]}>
        <TouchableOpacity
          testID="close-button"
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close journal composer"
          style={styles.headerSideButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <AppIcon name="x" size={20} color={palette.warm[400]} />
        </TouchableOpacity>

        <BracketLabel variant="muted">New Entry</BracketLabel>

        <TouchableOpacity
          testID="header-save-button"
          onPress={handleSave}
          accessibilityRole="button"
          accessibilityLabel="Save entry"
          style={styles.headerSideButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[styles.headerSaveText, { color: palette.sage[300] }]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      {/* ------------------------------------------------------------------ */}
      {/* Scrollable content                                                   */}
      {/* ------------------------------------------------------------------ */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Mood strip */}
        <View
          testID="mood-strip"
          style={[styles.moodStrip, { backgroundColor: `${palette.midnight[800]}CC` }]}
          accessibilityRole="radiogroup"
          accessibilityLabel="Current mood"
        >
          <BracketLabel variant="muted" style={styles.moodStripLabel}>
            How are you right now?
          </BracketLabel>
          <View style={styles.moodRow}>
            {MOOD_LEVELS.map((level) => {
              const isSelected = moodLevel === level;
              return (
                <TouchableOpacity
                  key={level}
                  testID={`mood-level-${level}`}
                  onPress={() => handleMoodPress(level)}
                  accessibilityRole="radio"
                  accessibilityLabel={`Mood level ${level}`}
                  accessibilityState={{ selected: isSelected }}
                  style={[
                    styles.moodButton,
                    isSelected && styles.moodButtonSelected,
                    isSelected && { borderColor: palette.aurora[300] },
                  ]}
                >
                  <MoodFace level={level} size={44} selected={isSelected} interactive />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Date + weather row */}
        <BracketLabel variant="muted" style={styles.dateLabel}>
          {dateWeatherLabel}
        </BracketLabel>

        {/* Title input */}
        <TextInput
          testID="title-input"
          value={title}
          onChangeText={onTitleChange}
          placeholder="Title"
          placeholderTextColor={palette.warm[500]}
          style={[styles.titleInput, { color: palette.warm[50] }]}
          accessibilityLabel="Entry title"
          accessibilityRole="text"
          returnKeyType="next"
          blurOnSubmit={false}
        />

        {/* Divider */}
        <AuroraHairline style={styles.hairline} />

        {/* Suggestion card */}
        {suggestion != null ? (
          <View style={styles.suggestionCard}>
            <SuggestionCard
              testID="suggestion-card"
              iconName="lightbulb"
              iconHue="peach"
              title={suggestion.title}
              body={suggestion.body}
              variant="peach-border"
              onDismiss={onSuggestionDismiss}
            />
          </View>
        ) : null}

        {/* Body input */}
        <TextInput
          testID="body-input"
          value={body}
          onChangeText={onBodyChange}
          placeholder="What's on your mind?"
          placeholderTextColor={palette.warm[500]}
          multiline
          textAlignVertical="top"
          style={[styles.bodyInput, { color: palette.warm[100] }]}
          accessibilityLabel="Journal entry body"
          accessibilityRole="text"
        />

        {/* Hashtag chips */}
        <ScrollView
          testID="hashtag-scroll"
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hashtagRow}
          accessibilityLabel="Entry tags"
        >
          {hashtagOptions.map((tag) => (
            <HashtagChip
              key={tag}
              testID={`hashtag-chip-${tag}`}
              label={tag}
              selected={hashtags.includes(tag)}
              onPress={() => handleHashtagPress(tag)}
            />
          ))}
        </ScrollView>

        {/* Bottom padding so content clears the sticky toolbar */}
        <View style={styles.scrollBottomPad} />
      </ScrollView>

      {/* ------------------------------------------------------------------ */}
      {/* Sticky bottom toolbar                                                */}
      {/* ------------------------------------------------------------------ */}
      <View
        testID="toolbar"
        style={[
          styles.toolbar,
          {
            backgroundColor: `${palette.midnight[900]}F5`,
            borderTopColor: palette.midnight[700],
          },
        ]}
        accessibilityRole="none"
        accessibilityLabel="Formatting toolbar"
      >
        <TouchableOpacity
          testID="toolbar-bold"
          onPress={onBoldPress}
          disabled={!onBoldPress}
          accessibilityRole="button"
          accessibilityLabel="Bold"
          style={styles.toolbarButton}
        >
          <AppIcon name="bold" size={18} color={palette.warm[400]} />
        </TouchableOpacity>

        <TouchableOpacity
          testID="toolbar-italic"
          onPress={onItalicPress}
          disabled={!onItalicPress}
          accessibilityRole="button"
          accessibilityLabel="Italic"
          style={styles.toolbarButton}
        >
          <AppIcon name="italic" size={18} color={palette.warm[400]} />
        </TouchableOpacity>

        <TouchableOpacity
          testID="toolbar-list"
          onPress={onListPress}
          disabled={!onListPress}
          accessibilityRole="button"
          accessibilityLabel="List"
          style={styles.toolbarButton}
        >
          <AppIcon name="list" size={18} color={palette.warm[400]} />
        </TouchableOpacity>

        <TouchableOpacity
          testID="toolbar-image"
          onPress={onImagePress}
          disabled={!onImagePress}
          accessibilityRole="button"
          accessibilityLabel="Insert image"
          style={styles.toolbarButton}
        >
          <AppIcon name="image" size={18} color={palette.warm[400]} />
        </TouchableOpacity>

        <TouchableOpacity
          testID="toolbar-mic"
          onPress={onMicPress}
          disabled={!onMicPress}
          accessibilityRole="button"
          accessibilityLabel="Voice to text"
          style={styles.toolbarButton}
        >
          <AppIcon name="mic" size={18} color={palette.warm[400]} />
        </TouchableOpacity>

        <View style={styles.toolbarSpacer} />

        <Text
          testID="word-count"
          accessibilityLiveRegion="polite"
          style={[styles.wordCount, { color: palette.warm[500] }]}
        >
          {`${wordCount} word${wordCount === 1 ? "" : "s"}`}
        </Text>
      </View>

      {/* ------------------------------------------------------------------ */}
      {/* FAB save button                                                      */}
      {/* ------------------------------------------------------------------ */}
      <TouchableOpacity
        testID="save-button"
        onPress={handleSave}
        accessibilityRole="button"
        accessibilityLabel="Save journal entry"
        style={[
          styles.fab,
          {
            backgroundColor: palette.peach[300],
            shadowColor: palette.midnight[950],
            shadowOpacity: reducedMotion ? 0 : 0.3,
          },
        ]}
      >
        <AppIcon
          name="check"
          size={24}
          color={palette.midnight[950]}
          accessibilityLabel="Save"
        />
      </TouchableOpacity>
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------
// Styles — properties alphabetically sorted
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  bodyInput: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 24,
    minHeight: 200,
    paddingBottom: 16,
    paddingTop: 8,
  },
  container: {
    flex: 1,
  },
  dateLabel: {
    marginBottom: 16,
    marginTop: 12,
    textAlign: "center",
  },
  fab: {
    alignItems: "center",
    borderRadius: 28,
    bottom: 80,
    elevation: 6,
    height: 56,
    justifyContent: "center",
    position: "absolute",
    right: 24,
    shadowOffset: { height: 3, width: 0 },
    shadowRadius: 6,
    width: 56,
  },
  hairline: {
    marginBottom: 16,
    marginTop: 4,
  },
  hashtagRow: {
    columnGap: 8,
    flexDirection: "row",
    paddingHorizontal: 0,
    paddingVertical: 8,
  },
  header: {
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerSaveText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
  },
  headerSideButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  moodButton: {
    alignItems: "center",
    borderColor: "transparent",
    borderRadius: 26,
    borderWidth: 2,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    padding: 2,
  },
  moodButtonSelected: {
    borderWidth: 2,
  },
  moodRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  moodStrip: {
    borderRadius: 16,
    marginBottom: 4,
    padding: 12,
  },
  moodStripLabel: {
    marginBottom: 10,
    textAlign: "center",
  },
  scroll: {
    paddingBottom: 16,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  scrollBottomPad: {
    height: 100,
  },
  suggestionCard: {
    marginBottom: 16,
  },
  titleInput: {
    fontFamily: "Fraunces_500Medium",
    fontSize: 24,
    marginBottom: 8,
    paddingVertical: 4,
  },
  toolbar: {
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    bottom: 0,
    flexDirection: "row",
    left: 0,
    minHeight: 52,
    paddingHorizontal: 12,
    paddingVertical: 8,
    position: "absolute",
    right: 0,
  },
  toolbarButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  toolbarSpacer: {
    flex: 1,
  },
  wordCount: {
    fontFamily: "FiraCode_400Regular",
    fontSize: 10,
    paddingRight: 4,
  },
});

export default TextJournalComposerScreen;
