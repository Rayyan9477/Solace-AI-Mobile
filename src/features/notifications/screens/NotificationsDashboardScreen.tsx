/**
 * NotificationsDashboardScreen — prototype v4.2 #35 reskin (Sprint 9).
 *
 * Cosmic v4.2 inbox: miniHeader (back / "Notifications" / Mark all read), Fraunces
 * "Inbox" headline + peach unread count subtitle, FilterPills (All / Insights /
 * Reminders / Achievements), then bracket-grouped sections (Today / Yesterday /
 * Earlier this week) of glass notification rows with hue-tinted icon tiles.
 *
 * Maps to `prototypes/screens/35-notifications.js`.
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

import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import { ScreenContainer } from "@/shared/components/atoms/layout";
import { FilterPills } from "@/shared/components/molecules/navigation/FilterPills";
import {
  BracketLabel,
  GlassCard,
  IconTile,
  type IconTileHue,
} from "@/shared/components/primitives";
import { useTheme } from "@/shared/theme/useTheme";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type NotificationFilter =
  | "all"
  | "insights"
  | "reminders"
  | "achievements";

export interface NotificationItem {
  id: string;
  iconName: string;
  hue: IconTileHue;
  title: string;
  description: string;
  /** Time-ago string e.g. "3m", "2h", "6:30 PM". */
  time: string;
  unread?: boolean;
}

export interface NotificationGroup {
  id: string;
  /** Bracket label (Today / Yesterday / Earlier this week). */
  label: string;
  /** Whether the whole section renders at 65% opacity (read state). */
  faded?: boolean;
  items: NotificationItem[];
}

export interface NotificationsDashboardScreenProps {
  notifications?: NotificationGroup[];
  selectedFilter?: NotificationFilter;
  unreadCount?: number;
  onBack: () => void;
  onMarkAllRead?: () => void;
  onFilterChange?: (filter: NotificationFilter) => void;
  onNotificationPress?: (id: string) => void;
  /** @deprecated kept for legacy stack; no-op in v4.2 reskin. */
  onSettings?: () => void;
  /** @deprecated kept for legacy stack; no-op in v4.2 reskin. */
  onOptionsPress?: (sectionId: string) => void;
  /** @deprecated legacy section list. Ignored — use `notifications`. */
  sections?: unknown;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

export const DEFAULT_NOTIFICATIONS: NotificationGroup[] = [
  {
    id: "today",
    label: "Today",
    items: [
      {
        id: "score-up",
        iconName: "sparkles",
        hue: "sage",
        title: "Your Solace Score went up",
        description: "+5 points since last week. Keep going!",
        time: "3m",
        unread: true,
      },
      {
        id: "streak-23",
        iconName: "trending-up",
        hue: "peach",
        title: "Streak milestone: 23 days",
        description: "This is your longest streak yet.",
        time: "2h",
        unread: true,
      },
    ],
  },
  {
    id: "yesterday",
    label: "Yesterday",
    faded: true,
    items: [
      {
        id: "evening-checkin",
        iconName: "bell",
        hue: "lavender",
        title: "Evening check-in reminder",
        description: "How’s your day winding down?",
        time: "6:30 PM",
      },
      {
        id: "weekly-summary",
        iconName: "book-open",
        hue: "sage",
        title: "Your weekly summary is ready",
        description: "Review your mood patterns for the week",
        time: "9:00 AM",
      },
    ],
  },
  {
    id: "earlier",
    label: "Earlier this week",
    faded: true,
    items: [
      {
        id: "soundscape-unlocked",
        iconName: "gift",
        hue: "peach",
        title: "New soundscape unlocked",
        description: "“Tibetan singing bowl” is now available",
        time: "3 days ago",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Notification row
// ---------------------------------------------------------------------------

interface NotificationRowProps {
  item: NotificationItem;
  showTimeAgo: boolean;
  onPress: (id: string) => void;
}

function NotificationRow({
  item,
  showTimeAgo,
  onPress,
}: NotificationRowProps): React.ReactElement {
  const { palette, typography } = useTheme();

  const a11yLabel = `${item.title}. ${item.description}. ${item.time}${
    item.unread ? ", unread" : ""
  }.`;

  const timeText = showTimeAgo ? `${item.time} ago` : item.time;

  return (
    <TouchableOpacity
      testID={`notification-row-${item.id}`}
      onPress={() => onPress(item.id)}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      accessibilityState={{ selected: false }}
      activeOpacity={0.85}
      style={rowStyles.touchable}
    >
      <GlassCard radius={20} style={rowStyles.card}>
        {item.unread ? (
          <View
            testID={`unread-dot-${item.id}`}
            style={[
              rowStyles.unreadDot,
              { backgroundColor: palette.peach[300] },
            ]}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
        ) : null}

        <View style={rowStyles.inner}>
          <IconTile
            iconName={item.iconName}
            hue={item.hue}
            size={40}
            iconSize={16}
            style={rowStyles.iconTile}
          />
          <View style={rowStyles.body}>
            <Text
              style={[
                rowStyles.title,
                {
                  color: palette.warm[50],
                  fontFamily: typography.fontFamily.sansMedium,
                },
              ]}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <Text
              style={[rowStyles.description, { color: palette.warm[500] }]}
              numberOfLines={2}
            >
              {item.description}
            </Text>
            <Text
              testID={`notification-time-${item.id}`}
              style={[
                rowStyles.time,
                {
                  color: palette.warm[500],
                  fontFamily: typography.fontFamily.mono,
                },
              ]}
            >
              {timeText}
            </Text>
          </View>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function NotificationsDashboardScreen({
  notifications = DEFAULT_NOTIFICATIONS,
  selectedFilter = "all",
  unreadCount = 3,
  onBack,
  onMarkAllRead,
  onFilterChange,
  onNotificationPress,
  testID = "notifications-dashboard-screen",
  style,
}: NotificationsDashboardScreenProps): React.ReactElement {
  const { palette, typography } = useTheme();

  const filterPills = useMemo(
    () => [
      { id: "all", label: "All" },
      { id: "insights", label: "Insights" },
      { id: "reminders", label: "Reminders" },
      { id: "achievements", label: "Achievements" },
    ],
    [],
  );

  const handleNotificationPress = (id: string): void => {
    onNotificationPress?.(id);
  };

  const handleFilterChange = (id: string): void => {
    onFilterChange?.(id as NotificationFilter);
  };

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={style as ViewStyle | undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* miniHeader: back / "Notifications" / Mark all read */}
        <View style={styles.miniHeader}>
          <TouchableOpacity
            testID="back-button"
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
            style={[
              styles.iconButton,
              {
                backgroundColor: palette.midnight[800],
                borderColor: palette.midnight[600],
              },
            ]}
          >
            <AppIcon name="arrow-left" size={16} color={palette.warm[400]} />
          </TouchableOpacity>

          <BracketLabel variant="muted">Notifications</BracketLabel>

          <TouchableOpacity
            testID="mark-all-read-button"
            onPress={() => onMarkAllRead?.()}
            disabled={!onMarkAllRead}
            accessibilityRole="button"
            accessibilityLabel="Mark all notifications as read"
            hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
            style={styles.markAllButton}
          >
            <Text
              style={[
                styles.markAllText,
                {
                  color: palette.aurora[300],
                  fontFamily: typography.fontFamily.sansMedium,
                },
              ]}
            >
              Mark all read
            </Text>
          </TouchableOpacity>
        </View>

        {/* Inbox headline + subtitle */}
        <Text
          testID="inbox-headline"
          accessibilityRole="header"
          style={[
            styles.headline,
            {
              color: palette.warm[50],
              fontFamily: typography.fontFamily.displayRegular,
            },
          ]}
        >
          Inbox
        </Text>
        <Text
          testID="inbox-subtitle"
          style={[styles.subtitle, { color: palette.warm[400] }]}
        >
          <Text
            style={[
              styles.subtitleAccent,
              {
                color: palette.peach[300],
                fontFamily: typography.fontFamily.sansMedium,
              },
            ]}
          >
            {`${unreadCount} new`}
          </Text>
          {" · this week"}
        </Text>

        {/* Filter pills */}
        <View style={styles.filterRow}>
          <FilterPills
            testID="filter-pills"
            pills={filterPills}
            activeId={selectedFilter}
            onChange={handleFilterChange}
          />
        </View>

        {/* Sections */}
        {notifications.map((group) => (
          <View
            key={group.id}
            testID={`notification-group-${group.id}`}
            style={[styles.section, group.faded ? styles.sectionFaded : null]}
          >
            <View style={styles.sectionHeader}>
              <BracketLabel variant="muted">{group.label}</BracketLabel>
            </View>
            <View style={styles.list}>
              {group.items.map((item) => (
                <NotificationRow
                  key={item.id}
                  item={item}
                  showTimeAgo={group.id === "today"}
                  onPress={handleNotificationPress}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------
// Styles (alphabetically sorted)
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  filterRow: {
    marginBottom: 16,
    marginTop: 16,
  },
  headline: {
    fontSize: 30,
    fontWeight: "300",
    lineHeight: 34,
    marginTop: 16,
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
    gap: 8,
  },
  markAllButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  markAllText: {
    fontSize: 11,
  },
  miniHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  scroll: {
    paddingBottom: 80,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  section: {
    marginTop: 20,
  },
  sectionFaded: {
    opacity: 0.65,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    marginTop: 4,
  },
  subtitleAccent: {
    fontSize: 13,
  },
});

const rowStyles = StyleSheet.create({
  body: {
    flex: 1,
    minWidth: 0,
  },
  card: {
    minHeight: 76,
    paddingHorizontal: 16,
    paddingVertical: 14,
    position: "relative",
  },
  description: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    lineHeight: 14,
    marginTop: 2,
  },
  iconTile: {
    flexShrink: 0,
    marginRight: 12,
  },
  inner: {
    alignItems: "flex-start",
    flexDirection: "row",
  },
  time: {
    fontSize: 9,
    marginTop: 6,
  },
  title: {
    fontSize: 12,
    lineHeight: 16,
  },
  touchable: {
    width: "100%",
  },
  unreadDot: {
    borderRadius: 4,
    height: 8,
    position: "absolute",
    right: 14,
    top: 14,
    width: 8,
    zIndex: 2,
  },
});

export default NotificationsDashboardScreen;
