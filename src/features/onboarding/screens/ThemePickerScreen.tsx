/**
 * ThemePickerScreen — Sprint 7, onboarding step 4 of 4.
 *
 * Cosmic-editorial theme picker. Full-width vertical card list lets the user
 * preview each of the 5 runtime presets before selecting one.
 *
 * Maps to prototype v4.2 onboarding step 4.
 */

import React, { useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Button } from "@/shared/components/atoms/buttons/Button";
import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import { ScreenContainer } from "@/shared/components/atoms/layout";
import { BracketLabel } from "@/shared/components/primitives";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { presetList } from "@/shared/theme/presets";
import type { ThemeId, ThemePreset } from "@/shared/theme/presets";
import { useTheme } from "@/shared/theme/useTheme";

// ─── Public API ──────────────────────────────────────────────────────────────

export interface ThemePickerScreenProps {
  /** Currently-selected theme id (controlled) */
  selectedThemeId: ThemeId;
  onThemeChange: (id: ThemeId) => void;
  onContinue: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  onSystemDefault?: () => void;
  /** Step indicator e.g. "Step 4 of 4" */
  stepLabel?: string;
  testID?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Map a preset id to the BracketLabel accent variant */
function accentVariantForPreset(
  id: ThemeId,
): "aurora" | "peach" | "sage" | "muted" | "default" {
  const map: Record<
    ThemeId,
    "aurora" | "peach" | "sage" | "muted" | "default"
  > = {
    cosmic: "aurora",
    warmEarth: "peach",
    oceanCalm: "aurora",
    deepForest: "sage",
    softRose: "peach",
  };
  return map[id];
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface ColorSwatchProps {
  preset: ThemePreset;
}

/** 60×60 2×2 color swatch previewing the preset's 4 primary tokens */
function ColorSwatch({ preset }: ColorSwatchProps): React.ReactElement {
  const { palette: p } = preset;

  return (
    <View style={styles.swatchContainer} accessibilityElementsHidden>
      <View style={styles.swatchRow}>
        <View
          style={[styles.swatchCell, { backgroundColor: p.midnight[950] }]}
        />
        <View style={[styles.swatchCell, { backgroundColor: p.aurora[300] }]} />
      </View>
      <View style={styles.swatchRow}>
        <View style={[styles.swatchCell, { backgroundColor: p.sage[300] }]} />
        <View style={[styles.swatchCell, { backgroundColor: p.peach[300] }]} />
      </View>
    </View>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ThemePickerScreen({
  selectedThemeId,
  onThemeChange,
  onContinue,
  onBack,
  onSkip,
  onSystemDefault,
  stepLabel,
  testID = "theme-picker-screen",
}: ThemePickerScreenProps): React.ReactElement {
  const { palette } = useTheme();
  // Honor reduced motion preference
  useReducedMotion();

  const handleCardPress = useCallback(
    (id: ThemeId) => {
      onThemeChange(id);
    },
    [onThemeChange],
  );

  const handleSystemDefault = useCallback(() => {
    if (onSystemDefault) {
      onSystemDefault();
    } else {
      onThemeChange("cosmic");
    }
  }, [onSystemDefault, onThemeChange]);

  const selectedPreset = presetList.find((p) => p.id === selectedThemeId);
  const selectedLabel = selectedPreset?.label ?? "Theme";

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={styles.screen}
    >
      {/* Header row: back button · bracket · skip link */}
      <View style={styles.headerRow}>
        {onBack ? (
          <TouchableOpacity
            testID="back-button"
            style={[
              styles.backButton,
              {
                backgroundColor: palette.midnight[800],
                borderColor: palette.midnight[600],
              },
            ]}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
          >
            <AppIcon name="arrow-left" size={18} color={palette.warm[400]} />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerSpacer} />
        )}

        <View testID="step-label-wrapper">
          <BracketLabel variant="muted" style={styles.headerLabel}>
            {stepLabel ?? "STEP 4 OF 4"}
          </BracketLabel>
        </View>

        {onSkip ? (
          <TouchableOpacity
            testID="skip-link"
            style={styles.headerSkipLink}
            onPress={onSkip}
            accessibilityRole="button"
            accessibilityLabel="Skip theme selection"
            hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
          >
            <Text style={[styles.headerSkipText, { color: palette.warm[400] }]}>
              Skip
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero copy */}
        <View style={styles.hero}>
          <BracketLabel variant="peach" style={styles.themeBracket}>
            THEME
          </BracketLabel>

          <Text
            testID="headline"
            accessibilityRole="header"
            style={[styles.headline, { color: palette.warm[50] }]}
          >
            {"Your "}
            <Text style={styles.headlineItalic}>cosmic mood.</Text>
          </Text>

          <Text
            accessibilityRole="text"
            style={[styles.subtitleText, { color: palette.warm[400] }]}
          >
            Pick a vibe. You can change it any time in Settings.
          </Text>
        </View>

        {/* Theme card list */}
        <View
          testID="theme-card-list"
          style={styles.cardList}
          accessibilityRole="none"
        >
          {presetList.map((preset) => {
            const isSelected = preset.id === selectedThemeId;
            const accentVariant = accentVariantForPreset(preset.id);

            return (
              <TouchableOpacity
                key={preset.id}
                testID={`theme-card-${preset.id}`}
                style={[
                  styles.card,
                  {
                    backgroundColor: preset.palette.midnight[800],
                    borderColor: isSelected
                      ? preset.palette.aurora[300]
                      : "transparent",
                    borderWidth: 2,
                  },
                ]}
                onPress={() => handleCardPress(preset.id)}
                accessibilityRole="radio"
                accessibilityLabel={`${preset.label}: ${preset.description}`}
                accessibilityState={{ selected: isSelected }}
                activeOpacity={0.8}
              >
                {/* Selected checkmark badge — purely visual, card announces selected state */}
                {isSelected && (
                  <View
                    testID={`card-check-${preset.id}`}
                    style={[
                      styles.checkBadge,
                      { backgroundColor: palette.sage[300] },
                    ]}
                  >
                    <AppIcon
                      name="check"
                      size={10}
                      color={palette.midnight[950]}
                    />
                  </View>
                )}

                {/* Color swatch preview */}
                <ColorSwatch preset={preset} />

                {/* Text content */}
                <View style={styles.cardText}>
                  <BracketLabel
                    variant={accentVariant}
                    style={styles.cardBracket}
                  >
                    {preset.label.toUpperCase()}
                  </BracketLabel>

                  <Text
                    style={[
                      styles.cardName,
                      { color: preset.palette.warm[50] },
                    ]}
                    numberOfLines={1}
                  >
                    {preset.label}
                  </Text>

                  <Text
                    style={[
                      styles.cardDescription,
                      { color: preset.palette.warm[400] },
                    ]}
                    numberOfLines={2}
                  >
                    {preset.description}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky bottom CTA */}
      <View style={styles.bottomActions}>
        <Button
          testID="continue-button"
          label={`Continue with ${selectedLabel}`}
          variant="primary"
          fullWidth
          onPress={onContinue}
          accessibilityLabel={`Continue with ${selectedLabel}`}
          style={{
            ...styles.continueButton,
            backgroundColor: palette.sage[500],
          }}
          labelStyle={{ color: palette.midnight[950] }}
        />

        <TouchableOpacity
          testID="system-default-link"
          style={styles.systemDefaultLink}
          onPress={handleSystemDefault}
          accessibilityRole="button"
          accessibilityLabel="Use system default theme"
          hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
        >
          <Text
            style={[styles.systemDefaultText, { color: palette.warm[400] }]}
          >
            Use system default
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  bottomActions: {
    paddingBottom: 28,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  card: {
    alignItems: "center",
    borderRadius: 16,
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
    minHeight: 44,
    padding: 16,
  },
  cardBracket: {
    marginBottom: 4,
  },
  cardDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 16,
  },
  cardList: {
    paddingBottom: 8,
    paddingHorizontal: 24,
  },
  cardName: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 18,
    lineHeight: 22,
    marginBottom: 2,
  },
  cardText: {
    flex: 1,
    justifyContent: "center",
  },
  checkBadge: {
    alignItems: "center",
    borderRadius: 8,
    height: 18,
    justifyContent: "center",
    position: "absolute",
    right: 10,
    top: 10,
    width: 18,
    zIndex: 2,
  },
  continueButton: {
    borderRadius: 28,
    minHeight: 44,
  },
  headerLabel: {
    textAlign: "center",
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  headerSkipLink: {
    alignItems: "flex-end",
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  headerSkipText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  headerSpacer: {
    height: 44,
    width: 44,
  },
  headline: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 30,
    lineHeight: 36,
    marginBottom: 8,
    textAlign: "center",
  },
  headlineItalic: {
    fontFamily: "Fraunces_400Regular_Italic",
    fontStyle: "italic",
  },
  hero: {
    alignItems: "center",
    paddingBottom: 20,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  screen: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  subtitleText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 300,
    textAlign: "center",
  },
  swatchCell: {
    flex: 1,
  },
  swatchContainer: {
    borderRadius: 8,
    height: 60,
    overflow: "hidden",
    width: 60,
  },
  swatchRow: {
    flex: 1,
    flexDirection: "row",
  },
  systemDefaultLink: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    minHeight: 44,
  },
  systemDefaultText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  themeBracket: {
    marginBottom: 8,
    textAlign: "center",
  },
});

export default ThemePickerScreen;
