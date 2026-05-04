/**
 * PaywallScreen — prototype v4.2 #38 "Solace Plus" upgrade wall.
 *
 * Feature list + plan selector (annual/monthly) + 7-day free-trial CTA.
 * Maps to `prototypes/screens/38-paywall.js`.
 *
 * Canonical pattern: AssessmentResultsScreen (Sprint 6 reskin).
 */

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
import { BracketLabel, BreathingOrb, IconTile } from "@/shared/components/primitives";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { useTheme } from "@/shared/theme/useTheme";

// ─── Types ──────────────────────────────────────────────────────────────────

export type PlanId = "annual" | "monthly";

export interface PaywallFeature {
  id: string;
  label: string;
  iconName?: string;
  hue?: "sage" | "aurora" | "peach" | "lavender";
}

export interface PaywallPlan {
  id: PlanId;
  bracket: string;
  price: string;
  subPrice?: string;
  badge?: string;
  highlighted?: boolean;
}

export interface PaywallScreenProps {
  features?: PaywallFeature[];
  plans?: PaywallPlan[];
  selectedPlanId: PlanId;
  onPlanChange: (id: PlanId) => void;
  onClose: () => void;
  onStartTrial: () => void;
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

export const DEFAULT_FEATURES: PaywallFeature[] = [
  { id: "ai-chat", label: "Unlimited AI conversations" },
  { id: "cbt", label: "Personalized CBT thought records" },
  { id: "insights", label: "Advanced mood + sleep insights" },
  { id: "soundscapes", label: "Premium soundscapes & meditations" },
  { id: "crisis", label: "Priority crisis support" },
];

export const DEFAULT_PLANS: PaywallPlan[] = [
  {
    id: "annual",
    bracket: "ANNUAL",
    price: "$59.99/year",
    subPrice: "≈ $5/month",
    badge: "SAVE 60%",
    highlighted: true,
  },
  {
    id: "monthly",
    bracket: "MONTHLY",
    price: "$14.99/month",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function PaywallScreen({
  features = DEFAULT_FEATURES,
  plans = DEFAULT_PLANS,
  selectedPlanId,
  onPlanChange,
  onClose,
  onStartTrial,
  onTermsPress,
  onPrivacyPress,
  testID = "paywall-screen",
  style,
}: PaywallScreenProps): React.ReactElement {
  const { palette } = useTheme();
  const reducedMotion = useReducedMotion();

  const containerStyle = StyleSheet.flatten([styles.container, style]);

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={containerStyle}
    >
      {/* Close button */}
      <View style={styles.closeRow}>
        <TouchableOpacity
          testID="close-button"
          style={[
            styles.closeButton,
            {
              backgroundColor: palette.midnight[800],
              borderColor: palette.midnight[600],
            },
          ]}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <AppIcon name="x" size={16} color={palette.warm[400]} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero orb + icon */}
        <View style={styles.heroSection}>
          <View style={styles.orbWrapper} pointerEvents="none">
            <BreathingOrb
              size={160}
              tint="cool"
              pulsing={!reducedMotion}
            />
          </View>
          <View
            style={[
              styles.sparkleContainer,
              { backgroundColor: palette.aurora[300] },
            ]}
          >
            <AppIcon name="sparkles" size={28} color={palette.midnight[950]} />
          </View>
        </View>

        {/* Editorial kicker */}
        <BracketLabel
          variant="aurora"
          style={styles.kicker}
          announceAsLabel
        >
          SOLACE PLUS
        </BracketLabel>

        {/* Title */}
        <Text
          accessibilityRole="header"
          style={[styles.title, { color: palette.warm[50] }]}
        >
          Your fullest{"\n"}
          <Text style={styles.titleItalic}>practice</Text>
        </Text>

        {/* Subtitle */}
        <Text
          accessibilityRole="text"
          style={[styles.subtitle, { color: palette.warm[400] }]}
        >
          Unlock everything Solace can offer
        </Text>

        {/* Feature list */}
        <View
          style={[
            styles.featuresCard,
            {
              backgroundColor: palette.midnight[800],
              borderColor: palette.midnight[600],
            },
          ]}
          testID="features-list"
        >
          {features.map((feature) => (
            <View key={feature.id} style={styles.featureRow}>
              <IconTile
                iconName={feature.iconName ?? "check"}
                hue={feature.hue ?? "sage"}
                size={32}
                iconSize={15}
                variant="soft"
                shape="rounded"
              />
              <Text
                style={[styles.featureLabel, { color: palette.warm[50] }]}
              >
                {feature.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Plan cards */}
        <View style={styles.plansSection} accessibilityRole="radiogroup">
          {plans.map((plan) => {
            const isSelected = plan.id === selectedPlanId;

            return (
              <TouchableOpacity
                key={plan.id}
                testID={`plan-card-${plan.id}`}
                style={[
                  styles.planCard,
                  { backgroundColor: palette.midnight[800] },
                  isSelected
                    ? { borderColor: palette.sage[300], borderWidth: 2 }
                    : { borderColor: palette.midnight[600], borderWidth: 1 },
                ]}
                onPress={() => onPlanChange(plan.id)}
                accessibilityRole="radio"
                accessibilityLabel={`${plan.bracket} plan, ${plan.price}${plan.subPrice ? `, ${plan.subPrice}` : ""}`}
                accessibilityState={{ selected: isSelected }}
              >
                <View style={styles.planLeft}>
                  <BracketLabel
                    variant={isSelected ? "sage" : "muted"}
                    style={styles.planBracket}
                  >
                    {plan.bracket}
                  </BracketLabel>
                  <Text
                    style={[styles.planPrice, { color: palette.warm[50] }]}
                  >
                    {plan.price}
                  </Text>
                  {plan.subPrice ? (
                    <Text
                      style={[
                        styles.planSubPrice,
                        { color: palette.warm[500] },
                      ]}
                    >
                      {plan.subPrice}
                    </Text>
                  ) : null}
                </View>

                <View style={styles.planRight}>
                  {plan.badge ? (
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: palette.peach[300] },
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          { color: palette.midnight[950] },
                        ]}
                      >
                        {plan.badge}
                      </Text>
                    </View>
                  ) : null}
                  {/* Radio indicator */}
                  <View
                    style={[
                      styles.radioOuter,
                      isSelected
                        ? { backgroundColor: palette.sage[300], borderColor: palette.sage[300] }
                        : { borderColor: palette.warm[500] },
                    ]}
                  >
                    {isSelected ? (
                      <AppIcon
                        name="check"
                        size={12}
                        color={palette.midnight[950]}
                      />
                    ) : null}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Trial disclaimer */}
        <Text
          accessibilityRole="text"
          style={[styles.trialNote, { color: palette.warm[500] }]}
        >
          7-day free trial · Cancel anytime
        </Text>

        {/* Spacer so content clears sticky footer */}
        <View style={styles.footerSpacer} />
      </ScrollView>

      {/* Sticky bottom CTA */}
      <View
        style={[
          styles.stickyFooter,
          { backgroundColor: palette.midnight[950] },
        ]}
      >
        <TouchableOpacity
          testID="start-trial-button"
          style={[
            styles.ctaButton,
            { backgroundColor: palette.peach[300] },
          ]}
          onPress={onStartTrial}
          accessibilityRole="button"
          accessibilityLabel="Start free trial"
        >
          <Text style={[styles.ctaLabel, { color: palette.midnight[950] }]}>
            Start free trial
          </Text>
        </TouchableOpacity>

        {/* Legal links */}
        <View style={styles.legalRow}>
          <Text style={[styles.legalText, { color: palette.warm[500] }]}>
            By starting, you agree to{" "}
          </Text>
          <TouchableOpacity
            onPress={onTermsPress}
            accessibilityRole="link"
            accessibilityLabel="Terms"
            style={styles.legalLink}
            testID="terms-link"
          >
            <Text style={[styles.legalLinkText, { color: palette.aurora[300] }]}>
              Terms
            </Text>
          </TouchableOpacity>
          <Text style={[styles.legalText, { color: palette.warm[500] }]}>
            {" "}&amp;{" "}
          </Text>
          <TouchableOpacity
            onPress={onPrivacyPress}
            accessibilityRole="link"
            accessibilityLabel="Privacy"
            style={styles.legalLink}
            testID="privacy-link"
          >
            <Text style={[styles.legalLinkText, { color: palette.aurora[300] }]}>
              Privacy
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    fontFamily: "FiraCode_700Bold",
    fontSize: 9,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  closeButton: {
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 36,
  },
  closeRow: {
    alignItems: "flex-end",
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  container: {
    flex: 1,
  },
  ctaButton: {
    alignItems: "center",
    borderRadius: 14,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: 24,
    paddingVertical: 14,
    width: "100%",
  },
  ctaLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 17,
    letterSpacing: 0.2,
  },
  featureLabel: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 12,
  },
  featureRow: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 44,
    paddingVertical: 6,
  },
  featuresCard: {
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  footerSpacer: {
    height: 16,
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  kicker: {
    marginTop: 16,
    textAlign: "center",
  },
  legalLink: {
    justifyContent: "center",
    minHeight: 44,
  },
  legalLinkText: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    textDecorationLine: "underline",
  },
  legalRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 12,
    paddingHorizontal: 16,
  },
  legalText: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
  },
  orbWrapper: {
    alignItems: "center",
    height: 160,
    justifyContent: "center",
    width: 160,
  },
  planBracket: {
    marginBottom: 4,
  },
  planCard: {
    alignItems: "center",
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    minHeight: 80,
    padding: 20,
  },
  planLeft: {
    flex: 1,
  },
  planPrice: {
    fontFamily: "Fraunces_300Light",
    fontSize: 28,
    lineHeight: 32,
  },
  planRight: {
    alignItems: "center",
    justifyContent: "center",
  },
  planSubPrice: {
    fontFamily: "FiraCode_400Regular",
    fontSize: 11,
    marginTop: 2,
  },
  plansSection: {
    marginTop: 16,
  },
  radioOuter: {
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 2,
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  scroll: {
    paddingBottom: 0,
    paddingHorizontal: 24,
  },
  sparkleContainer: {
    alignItems: "center",
    borderRadius: 20,
    bottom: 16,
    height: 56,
    justifyContent: "center",
    position: "absolute",
    width: 56,
  },
  stickyFooter: {
    bottom: 0,
    left: 0,
    paddingBottom: 32,
    paddingHorizontal: 24,
    paddingTop: 12,
    position: "absolute",
    right: 0,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
    paddingHorizontal: 24,
    textAlign: "center",
  },
  title: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 30,
    lineHeight: 34,
    marginTop: 10,
    textAlign: "center",
  },
  titleItalic: {
    fontFamily: "Fraunces_400Regular_Italic",
    fontStyle: "italic",
  },
  trialNote: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    marginTop: 10,
    textAlign: "center",
  },
});

export default PaywallScreen;
