/**
 * ChatHeader — top navigation header for screen 07 AI Chat (prototype v4.2).
 *
 * Displays the Solace avatar (with AvatarRing), session title + status, and
 * back/phone/more action buttons. The accessibilityRole="header" signals the
 * start of the chat screen to screen readers.
 *
 * @task Sprint 5: Chat organisms — ChatHeader
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useTheme } from "@/shared/theme/useTheme";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { AvatarRing } from "@/shared/components/primitives";
import { AppIcon } from "@/shared/components/atoms/display/AppIcon";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ChatHeaderProps {
  /** Null/undefined → sage gradient ring with sparkles placeholder. */
  avatarUri?: string | null;
  /** Screen title. Defaults to "Solace". */
  title?: string;
  /** Status line. Defaults to "CBT mode · Online". */
  status?: string;
  onBack: () => void;
  onPhonePress?: () => void;
  onMorePress?: () => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ChatHeader({
  avatarUri,
  title = "Solace",
  status = "CBT mode · Online",
  onBack,
  onPhonePress,
  onMorePress,
  testID,
  style,
}: ChatHeaderProps): React.ReactElement {
  const { palette } = useTheme();
  // useReducedMotion consumed so consumers know the component respects it;
  // this component has no animation, but the hook is required per spec.
  useReducedMotion();

  return (
    <View
      testID={testID}
      accessibilityRole="header"
      style={[
        styles.container,
        { borderBottomColor: palette.midnight[700] },
        style,
      ]}
    >
      {/* Back button */}
      <TouchableOpacity
        testID={testID ? `${testID}-back` : undefined}
        style={styles.iconButton}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <AppIcon name="chevron-left" size={24} color={palette.warm[50]} />
      </TouchableOpacity>

      {/* Avatar + identity block */}
      <View style={styles.identity}>
        <AvatarRing size={36} ringWidth={2} glow={false} variant="sage-aurora-peach">
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              style={styles.avatarImage}
              accessibilityElementsHidden
            />
          ) : (
            <View
              style={[
                styles.avatarFallback,
                { backgroundColor: palette.sage[300] },
              ]}
            >
              <AppIcon name="sparkles" size={16} color={palette.midnight[950]} />
            </View>
          )}
        </AvatarRing>

        <View style={styles.textBlock}>
          <Text
            style={[
              styles.title,
              { color: palette.warm[50] },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.status,
              { color: palette.sage[300] },
            ]}
            numberOfLines={1}
          >
            {status}
          </Text>
        </View>
      </View>

      {/* Right actions */}
      <View style={styles.actions}>
        {onPhonePress && (
          <TouchableOpacity
            testID={testID ? `${testID}-phone` : undefined}
            style={styles.iconButton}
            onPress={onPhonePress}
            accessibilityRole="button"
            accessibilityLabel="Start phone call"
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            <AppIcon name="phone" size={22} color={palette.warm[100]} />
          </TouchableOpacity>
        )}

        {onMorePress && (
          <TouchableOpacity
            testID={testID ? `${testID}-more` : undefined}
            style={styles.iconButton}
            onPress={onMorePress}
            accessibilityRole="button"
            accessibilityLabel="More options"
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            <AppIcon name="more-vertical" size={22} color={palette.warm[100]} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  actions: {
    alignItems: "center",
    flexDirection: "row",
    marginLeft: "auto",
  },
  avatarFallback: {
    alignItems: "center",
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  avatarImage: {
    borderRadius: 16,
    height: 32,
    width: 32,
  },
  container: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    height: 64,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  identity: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    gap: 10,
    marginLeft: 4,
  },
  status: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 16,
  },
  textBlock: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontFamily: "Fraunces_500Medium",
    fontSize: 16,
    lineHeight: 20,
  },
});

export default ChatHeader;
