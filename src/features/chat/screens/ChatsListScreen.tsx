/**
 * ChatsListScreen — prototype v4.2 #24 Conversations list (Sprint 8).
 *
 * Cosmic v4.2 reskin of the chats list. Renders a peach FAB-anchored list of
 * past Solace sessions grouped by hue accent + filter pill row + optional
 * search. Each conversation is a glass card with a left vertical accent bar,
 * sparkles icon tile, title + unread dot, preview, and a footer of bracket
 * tag / msg count / time-ago in mono.
 *
 * Maps to `prototypes/screens/24-chat-list.js`.
 */

import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { ScreenContainer } from "@/shared/components/atoms/layout";
import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import {
  BracketLabel,
  GlassCard,
  SmokeBlob,
} from "@/shared/components/primitives";
import { FilterPills } from "@/shared/components/molecules/navigation/FilterPills";
import { useTheme } from "@/shared/theme/useTheme";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type ConversationFilter = "all" | "active" | "archived";

export type ConversationHue = "sage" | "lavender" | "peach" | "aurora";

export interface Conversation {
  id: string;
  title: string;
  preview: string;
  /** Bracket tag color hue (sage / lavender / peach / aurora) */
  hue: ConversationHue;
  /** Tag label (e.g. CBT, Mindfulness, Support, Sleep, Growth) */
  tag: string;
  /** Total message count */
  msgs: number;
  /** Time-ago label, e.g. "3m", "2h", "1d", "1w" */
  time: string;
  /** Whether the conversation has unread messages */
  unread?: boolean;
  /** Whether the conversation is archived (filtered by Archived pill) */
  archived?: boolean;
}

export interface ChatsListScreenProps {
  conversations?: Conversation[];
  selectedFilter?: ConversationFilter;
  onSearch: () => void;
  onNewConversation: () => void;
  onConversationPress: (id: string) => void;
  onFilterChange: (filter: ConversationFilter) => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

export const DEFAULT_CONVERSATIONS: Conversation[] = [
  {
    id: "work-stress",
    title: "Work stress & boundaries",
    preview: "Let us reframe that meeting…",
    hue: "sage",
    tag: "CBT",
    msgs: 12,
    time: "3m",
    unread: true,
  },
  {
    id: "morning-anxiety",
    title: "Morning anxiety routine",
    preview: "Try starting with 5 breaths before…",
    hue: "sage",
    tag: "Mindfulness",
    msgs: 8,
    time: "2h",
  },
  {
    id: "processing-breakup",
    title: "Processing the breakup",
    preview: "Grief takes time — that is okay.",
    hue: "lavender",
    tag: "Support",
    msgs: 34,
    time: "1d",
  },
  {
    id: "sleep-routine",
    title: "Sleep routine check-in",
    preview: "Your bedtime has improved by 20 min",
    hue: "lavender",
    tag: "Sleep",
    msgs: 6,
    time: "3d",
    archived: true,
  },
  {
    id: "interview-prep",
    title: "Handling the interview",
    preview: "Congratulations on getting to stage 3!",
    hue: "peach",
    tag: "Growth",
    msgs: 22,
    time: "1w",
    archived: true,
  },
];

// ---------------------------------------------------------------------------
// Conversation row
// ---------------------------------------------------------------------------

interface ConversationRowProps {
  item: Conversation;
  onPress: (id: string) => void;
}

function ConversationRow({
  item,
  onPress,
}: ConversationRowProps): React.ReactElement {
  const { palette } = useTheme();

  const hueColor = palette[item.hue][300];
  const accentBg = `${hueColor}33`;
  const tileBg = `${hueColor}1F`;
  const tileBorder = `${hueColor}4D`;
  const accentBar = `${hueColor}A6`;

  const a11yLabel = `${item.title}. ${item.tag} session, ${item.msgs} messages, ${item.time} ago${
    item.unread ? ", unread" : ""
  }.`;

  return (
    <TouchableOpacity
      testID={`conversation-row-${item.id}`}
      onPress={() => onPress(item.id)}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      activeOpacity={0.85}
      style={rowStyles.touchable}
      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
    >
      <GlassCard radius={20} style={rowStyles.card}>
        <View
          style={[rowStyles.accentBar, { backgroundColor: accentBar }]}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />

        <View style={rowStyles.inner}>
          <View
            testID={`conversation-icon-${item.id}`}
            style={[
              rowStyles.iconTile,
              { backgroundColor: tileBg, borderColor: tileBorder },
            ]}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <View style={[rowStyles.iconBg, { backgroundColor: accentBg }]} />
            <AppIcon name="sparkles" size={18} color={hueColor} />
          </View>

          <View style={rowStyles.body}>
            <View style={rowStyles.titleRow}>
              <Text
                style={[rowStyles.title, { color: palette.warm[50] }]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              {item.unread ? (
                <View
                  testID={`unread-dot-${item.id}`}
                  style={[
                    rowStyles.unreadDot,
                    { backgroundColor: palette.peach[300] },
                  ]}
                />
              ) : null}
            </View>

            <Text
              style={[rowStyles.preview, { color: palette.warm[400] }]}
              numberOfLines={1}
            >
              {item.preview}
            </Text>

            <View style={rowStyles.footerRow}>
              <Text
                testID={`conversation-tag-${item.id}`}
                style={[rowStyles.tag, { color: hueColor }]}
              >
                {`[ ${item.tag.toUpperCase()} ]`}
              </Text>
              <Text style={[rowStyles.dot, { color: palette.warm[500] }]}>·</Text>
              <Text
                style={[rowStyles.meta, { color: palette.warm[500] }]}
              >
                {`${item.msgs} msgs`}
              </Text>
              <Text
                style={[
                  rowStyles.meta,
                  rowStyles.metaRight,
                  { color: palette.warm[500] },
                ]}
              >
                {`${item.time} ago`}
              </Text>
            </View>
          </View>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export function ChatsListScreen({
  conversations = DEFAULT_CONVERSATIONS,
  selectedFilter = "all",
  onSearch,
  onNewConversation,
  onConversationPress,
  onFilterChange,
  testID = "chats-list-screen",
  style,
}: ChatsListScreenProps): React.ReactElement {
  const { palette, typography } = useTheme();
  useReducedMotion();

  const counts = useMemo(() => {
    const total = conversations.length;
    const archived = conversations.filter((c) => c.archived).length;
    const active = total - archived;
    return { all: total, active, archived };
  }, [conversations]);

  const filtered = useMemo(() => {
    if (selectedFilter === "active") {
      return conversations.filter((c) => !c.archived);
    }
    if (selectedFilter === "archived") {
      return conversations.filter((c) => c.archived);
    }
    return conversations;
  }, [conversations, selectedFilter]);

  const pills = [
    { id: "all", label: "All", count: counts.all },
    { id: "active", label: "Active", count: counts.active },
    { id: "archived", label: "Archived", count: counts.archived },
  ];

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={style as ViewStyle | undefined}
    >
      <SmokeBlob
        testID="ambient-blob"
        tint="lavender"
        size={360}
        opacity={0.18}
        style={styles.ambientBlob}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <BracketLabel variant="muted">Conversations</BracketLabel>
            <Text
              testID="header-title"
              accessibilityRole="header"
              style={[
                styles.title,
                {
                  color: palette.warm[50],
                  fontFamily: typography.fontFamily.display,
                },
              ]}
            >
              Your sessions
            </Text>
          </View>

          <TouchableOpacity
            testID="search-button"
            onPress={onSearch}
            accessibilityRole="button"
            accessibilityLabel="Search conversations"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={[
              styles.iconButton,
              {
                backgroundColor: palette.midnight[800],
                borderColor: palette.midnight[600],
              },
            ]}
          >
            <AppIcon name="search" size={18} color={palette.warm[100]} />
          </TouchableOpacity>
        </View>

        {/* Filter pills */}
        <View style={styles.pillsRow}>
          <FilterPills
            testID="filter-pills"
            pills={pills}
            activeId={selectedFilter}
            onChange={(id) => onFilterChange(id as ConversationFilter)}
          />
        </View>

        {/* Conversation list */}
        <View
          testID="conversation-list"
          accessibilityRole="list"
          accessibilityLabel="Conversation list"
          style={styles.list}
        >
          {filtered.length === 0 ? (
            <Text
              testID="empty-state-text"
              style={[styles.emptyText, { color: palette.warm[400] }]}
            >
              No conversations match this filter yet.
            </Text>
          ) : (
            filtered.map((item) => (
              <ConversationRow
                key={item.id}
                item={item}
                onPress={onConversationPress}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        testID="new-conversation-fab"
        onPress={onNewConversation}
        accessibilityRole="button"
        accessibilityLabel="Start a new conversation"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        activeOpacity={0.85}
        style={[
          styles.fab,
          { backgroundColor: palette.peach[300] },
        ]}
      >
        <AppIcon name="plus" size={24} color={palette.midnight[950]} />
      </TouchableOpacity>
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------
// Aliases
// ---------------------------------------------------------------------------

export const ConversationsListScreen = ChatsListScreen;

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  ambientBlob: {
    position: "absolute",
    right: -80,
    top: -60,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    paddingVertical: 32,
    textAlign: "center",
  },
  fab: {
    alignItems: "center",
    borderRadius: 28,
    bottom: 28,
    elevation: 6,
    height: 56,
    justifyContent: "center",
    position: "absolute",
    right: 24,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    width: 56,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerText: {
    flex: 1,
  },
  iconButton: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  list: {
    gap: 10,
    marginTop: 8,
  },
  pillsRow: {
    marginBottom: 12,
  },
  scroll: {
    paddingBottom: 120,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "300",
    lineHeight: 34,
    marginTop: 4,
  },
});

const rowStyles = StyleSheet.create({
  accentBar: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 4,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 4,
    bottom: 8,
    left: 0,
    position: "absolute",
    top: 8,
    width: 3,
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  card: {
    minHeight: 76,
    overflow: "hidden",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dot: {
    fontFamily: "Inter_400Regular",
    fontSize: 9,
    opacity: 0.5,
  },
  footerRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  iconBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    opacity: 0.4,
  },
  iconTile: {
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    marginLeft: 6,
    marginRight: 12,
    overflow: "hidden",
    width: 40,
  },
  inner: {
    alignItems: "center",
    flexDirection: "row",
  },
  meta: {
    fontFamily: "FiraCode_400Regular",
    fontSize: 9,
  },
  metaRight: {
    marginLeft: "auto",
  },
  preview: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    lineHeight: 14,
    marginBottom: 6,
  },
  tag: {
    fontFamily: "FiraCode_400Regular",
    fontSize: 9,
    fontWeight: "500",
    letterSpacing: 1,
  },
  title: {
    flex: 1,
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    lineHeight: 16,
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 4,
  },
  touchable: {
    width: "100%",
  },
  unreadDot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
});

export default ChatsListScreen;
