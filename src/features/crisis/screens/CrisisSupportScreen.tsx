/**
 * CrisisSupportScreen — prototype v4.2 #12 (Sprint 9).
 *
 * Modal-style crisis support surface. Soft warm peach palette (deliberately not
 * alarming red). Offers three direct resources (988 phone, 741741 SMS,
 * international) plus an "Or talk to Solace" AI fallback and a low-friction
 * dismiss link.
 *
 * Maps to `prototypes/screens/12-crisis.js`.
 */

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
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
import {
  BracketLabel,
  GlassCard,
  HeroCard,
  IconTile,
  SmokeBlob,
} from "@/shared/components/primitives";
import { useTheme } from "@/shared/theme/useTheme";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface CrisisSupportScreenProps {
  onClose: () => void;
  onCallHotline: () => void;
  onTextLine: () => void;
  onInternational: () => void;
  onStartChat: () => void;
  onDismiss: () => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CrisisSupportScreen({
  onClose,
  onCallHotline,
  onTextLine,
  onInternational,
  onStartChat,
  onDismiss,
  testID = "crisis-support-screen",
  style,
}: CrisisSupportScreenProps): React.ReactElement {
  const { palette, typography } = useTheme();

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={style as ViewStyle | undefined}
    >
      <LinearGradient
        colors={[
          palette.midnight[700],
          palette.midnight[800],
          palette.midnight[950],
        ]}
        locations={[0, 0.5, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />

      <View
        pointerEvents="none"
        style={styles.blobWrap}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <SmokeBlob
          testID="crisis-smoke-blob"
          tint="peach"
          size={320}
          opacity={0.32}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Top bar — close button right-aligned */}
        <View style={styles.topBar}>
          <TouchableOpacity
            testID="close-button"
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close crisis support"
            hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
            style={[
              styles.closeButton,
              {
                backgroundColor: palette.midnight[800],
                borderColor: palette.midnight[600],
              },
            ]}
          >
            <AppIcon name="x" size={18} color={palette.warm[100]} />
          </TouchableOpacity>
        </View>

        {/* Center stack */}
        <View style={styles.heroBlock}>
          <BracketLabel variant="peach">You are not alone</BracketLabel>

          <Text
            testID="crisis-headline"
            accessibilityRole="header"
            style={[
              styles.headline,
              {
                color: palette.warm[50],
                fontFamily: typography.fontFamily.displayRegular,
              },
            ]}
          >
            {"We’re here\n"}
            <Text
              style={[
                styles.headlineItalic,
                {
                  color: palette.warm[50],
                  fontFamily: typography.fontFamily.displayItalic,
                },
              ]}
            >
              for you.
            </Text>
          </Text>

          <Text
            testID="crisis-subtitle"
            style={[styles.subtitle, { color: palette.warm[400] }]}
          >
            Talk to someone right now — completely confidential, available 24/7.
          </Text>
        </View>

        {/* Resource cards */}
        <View style={styles.resources}>
          {/* 988 hotline — HeroCard with peach accent */}
          <HeroCard testID="resource-988-hero" radius={20}>
            <TouchableOpacity
              testID="call-988-button"
              onPress={onCallHotline}
              accessibilityRole="button"
              accessibilityLabel="Call 988, Suicide and Crisis Lifeline, 24/7"
              activeOpacity={0.85}
              style={[
                styles.resourceInner,
                { backgroundColor: palette.midnight[800] },
              ]}
            >
              <IconTile
                iconName="phone"
                hue="peach"
                size={48}
                iconSize={20}
                style={styles.resourceIcon}
              />
              <View style={styles.resourceBody}>
                <Text
                  style={[
                    styles.resourceTitle,
                    {
                      color: palette.warm[50],
                      fontFamily: typography.fontFamily.sansSemibold,
                    },
                  ]}
                >
                  {"Call "}
                  <Text
                    style={{ fontFamily: typography.fontFamily.monoMedium }}
                  >
                    988
                  </Text>
                </Text>
                <Text
                  style={[styles.resourceCaption, { color: palette.warm[400] }]}
                >
                  Suicide & Crisis Lifeline · 24/7
                </Text>
              </View>
              <View
                testID="call-988-fab"
                style={[
                  styles.peachFab,
                  { backgroundColor: palette.peach[300] },
                ]}
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              >
                <AppIcon name="phone" size={18} color={palette.midnight[950]} />
              </View>
            </TouchableOpacity>
          </HeroCard>

          {/* Text line 741741 */}
          <TouchableOpacity
            testID="text-line-button"
            onPress={onTextLine}
            accessibilityRole="button"
            accessibilityLabel="Text HOME to 741741, Crisis Text Line, free SMS"
            activeOpacity={0.85}
            style={styles.resourceTouchable}
          >
            <GlassCard radius={20} style={styles.glassResource}>
              <View style={styles.resourceInner}>
                <IconTile
                  iconName="message-square"
                  hue="sage"
                  size={48}
                  iconSize={20}
                  style={styles.resourceIcon}
                />
                <View style={styles.resourceBody}>
                  <Text
                    style={[
                      styles.resourceTitle,
                      {
                        color: palette.warm[50],
                        fontFamily: typography.fontFamily.sansMedium,
                      },
                    ]}
                  >
                    {"Text "}
                    <Text
                      style={{ fontFamily: typography.fontFamily.monoMedium }}
                    >
                      HOME
                    </Text>
                    {" to "}
                    <Text
                      style={{ fontFamily: typography.fontFamily.monoMedium }}
                    >
                      741741
                    </Text>
                  </Text>
                  <Text
                    style={[
                      styles.resourceCaption,
                      { color: palette.warm[400] },
                    ]}
                  >
                    Crisis Text Line · Free SMS
                  </Text>
                </View>
                <AppIcon
                  name="arrow-right"
                  size={16}
                  color={palette.warm[500]}
                />
              </View>
            </GlassCard>
          </TouchableOpacity>

          {/* International resources */}
          <TouchableOpacity
            testID="international-button"
            onPress={onInternational}
            accessibilityRole="button"
            accessibilityLabel="International resources, find help in your country"
            activeOpacity={0.85}
            style={styles.resourceTouchable}
          >
            <GlassCard radius={20} style={styles.glassResource}>
              <View style={styles.resourceInner}>
                <IconTile
                  iconName="globe"
                  hue="aurora"
                  size={48}
                  iconSize={20}
                  style={styles.resourceIcon}
                />
                <View style={styles.resourceBody}>
                  <Text
                    style={[
                      styles.resourceTitle,
                      {
                        color: palette.warm[50],
                        fontFamily: typography.fontFamily.sansMedium,
                      },
                    ]}
                  >
                    International resources
                  </Text>
                  <Text
                    style={[
                      styles.resourceCaption,
                      { color: palette.warm[400] },
                    ]}
                  >
                    Find help in your country
                  </Text>
                </View>
                <AppIcon
                  name="arrow-right"
                  size={16}
                  color={palette.warm[500]}
                />
              </View>
            </GlassCard>
          </TouchableOpacity>
        </View>

        {/* Talk to AI fallback */}
        <GlassCard
          testID="talk-to-solace-card"
          radius={20}
          style={styles.fallbackCard}
        >
          <View style={styles.fallbackRow}>
            <View
              style={styles.fallbackBadgeWrap}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              <LinearGradient
                colors={[
                  palette.sage[300],
                  palette.aurora[300],
                  palette.lavender[300],
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.fallbackBadge}
              />
              <View style={styles.fallbackBadgeIcon}>
                <AppIcon
                  name="sparkles"
                  size={16}
                  color={palette.midnight[950]}
                />
              </View>
            </View>
            <View style={styles.fallbackBody}>
              <Text
                style={[
                  styles.fallbackTitle,
                  {
                    color: palette.warm[50],
                    fontFamily: typography.fontFamily.sansMedium,
                  },
                ]}
              >
                Or talk to Solace
              </Text>
              <Text
                style={[styles.fallbackBodyText, { color: palette.warm[400] }]}
              >
                If you’re not ready for a person, I’m here to listen — no
                judgment.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            testID="start-chat-button"
            onPress={onStartChat}
            accessibilityRole="button"
            accessibilityLabel="Start a conversation with Solace"
            activeOpacity={0.85}
            style={[
              styles.startChatButton,
              {
                backgroundColor: palette.opacity.white08,
                borderColor: palette.opacity.white10,
              },
            ]}
          >
            <Text
              style={[
                styles.startChatLabel,
                {
                  color: palette.warm[50],
                  fontFamily: typography.fontFamily.sansMedium,
                },
              ]}
            >
              Start a conversation
            </Text>
          </TouchableOpacity>
        </GlassCard>

        {/* Dismiss link */}
        <TouchableOpacity
          testID="dismiss-link"
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="I am okay, dismiss"
          hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
          style={styles.dismissTouchable}
        >
          <Text style={[styles.dismissText, { color: palette.warm[500] }]}>
            I’m okay, dismiss
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------
// Styles (alphabetically sorted)
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  blobWrap: {
    alignItems: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  closeButton: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  dismissText: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    textAlign: "center",
  },
  dismissTouchable: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    minHeight: 44,
    paddingVertical: 10,
  },
  fallbackBadge: {
    borderRadius: 18,
    height: 36,
    width: 36,
  },
  fallbackBadgeIcon: {
    alignItems: "center",
    height: 36,
    justifyContent: "center",
    position: "absolute",
    width: 36,
  },
  fallbackBadgeWrap: {
    height: 36,
    width: 36,
  },
  fallbackBody: {
    flex: 1,
  },
  fallbackBodyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  fallbackCard: {
    marginTop: 16,
    padding: 16,
  },
  fallbackRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
  },
  fallbackTitle: {
    fontSize: 13,
  },
  glassResource: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headline: {
    fontSize: 34,
    fontWeight: "300",
    lineHeight: 38,
    marginTop: 12,
    textAlign: "center",
  },
  headlineItalic: {
    fontSize: 34,
    fontStyle: "italic",
    lineHeight: 38,
  },
  heroBlock: {
    alignItems: "center",
    marginTop: 8,
  },
  peachFab: {
    alignItems: "center",
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  resourceBody: {
    flex: 1,
  },
  resourceCaption: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    lineHeight: 14,
    marginTop: 2,
  },
  resourceIcon: {
    flexShrink: 0,
  },
  resourceInner: {
    alignItems: "center",
    borderRadius: 19,
    flexDirection: "row",
    gap: 14,
    minHeight: 76,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resourceTitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  resourceTouchable: {
    width: "100%",
  },
  resources: {
    gap: 12,
    marginTop: 28,
  },
  scroll: {
    paddingBottom: 36,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  startChatButton: {
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    marginTop: 14,
    minHeight: 44,
  },
  startChatLabel: {
    fontSize: 12,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 12,
    maxWidth: 280,
    textAlign: "center",
  },
  topBar: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 8,
  },
});

export default CrisisSupportScreen;
