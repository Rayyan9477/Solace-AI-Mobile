# Solace AI Mobile - Master UI/UX Audit V2

**Date**: March 17, 2026
**Audit Team**: 8 specialized AI agents running in parallel
**Scope**: Full codebase analysis of ~155 screens, ~505 TypeScript files, 34,182 LOC
**Test Status**: 202/202 suites, 5,264/5,264 tests passing

---

## Executive Summary

The app has a well-structured codebase with comprehensive test coverage, but suffers from a **massive design system adoption gap**. The theme system defines tokens for colors, spacing, shadows, gradients, animations, typography, and border radius - but almost none of these tokens are actually consumed by feature screens. The result is an app that looks like a **prototype** rather than a polished product.

### The Numbers Tell the Story

| Design System Asset | Defined | Actually Used By Screens |
|---|---|---|
| Spacing tokens (10-level scale) | Yes | **0 of 150 screens (0%)** |
| Typography atom (12 variants) | Yes | **0 of 150 screens (0%)** |
| Shadow system (`applyShadow`) | Yes (5 levels) | **1 file (FAB.tsx)** |
| Gradient presets | Yes (10 presets) | **0 screens** (3 just added) |
| Animation tokens (durations, springs, easing) | Yes | **0 components** |
| Reanimated v4 | Installed | **0 components** (all use legacy Animated API) |
| Card component | Yes (3 variants) | **5 of 150 screens (3%)** |
| ScreenContainer (safe area) | Yes | **3 of 150 screens (2%)** |
| Header component | Yes (3 sizes, 3 variants) | **0 feature screens** |
| EmptyState component | Yes (3 variants) | **2 screens** (just added) |
| borderRadius tokens | Yes (just added) | **0 screens** |
| Skeleton loader | Yes | **0 screens** |

**Total issues identified: ~450+ across 8 audit categories**

---

## Category 1: EMOJI ICONS (241 remaining instances)

### Summary
- **52 production files** still use emoji characters as icons
- **183 HIGH priority** (interactive buttons, safety-critical, shared components)
- 5 core screens were already fixed in Phase 1

### Highest-Impact Files (shared components that cascade everywhere)
1. `MessageInput.tsx` - 📎 🎤 ➤ (every chat screen's input bar)
2. `Modal.tsx` - ✕ (every modal's close button)
3. `Toast.tsx` - ✓ ⚠ ✕ ℹ (all system notifications)
4. `SearchBar.tsx` - 🔍 ✕ (every search instance)
5. `ChatBubble.tsx` - 🤖 👤 ✓ ✓✓ (every chat message)
6. `MoodSelector.types.ts` + `MoodChart.types.ts` - 😵 😢 😐 🙂 😄 (all mood rendering)

### By Feature Area
| Area | Files | Instances | Priority |
|------|-------|-----------|----------|
| Chat screens | 15 | 82 | HIGH |
| Dashboard | 6 | 34 | HIGH |
| Onboarding/Nav | 7 | 30 | HIGH |
| Journal | 8 | 26 | HIGH |
| Mood | 5 | 14 | HIGH |
| Assessment | 4 | 9 | HIGH |
| Sleep | 3 | 8 | MEDIUM |
| Shared components | 10 | 22 | HIGH |
| Type definitions | 2 | 10 | HIGH |
| Auth (remaining) | 2 | 6 | HIGH |

---

## Category 2: TYPOGRAPHY (Zero design system adoption)

### Critical Findings
- **Text atom used by 0 of 150 screens** - every screen imports `Text` from `react-native` directly
- **23 distinct fontSize values** in use (only 12 defined in the typography scale)
- **5 different sizes for `headerTitle`**: 16, 18, 20, 28 across screens
- **5 different sizes for `sectionTitle`**: 13, 14, 16, 18, 28
- **`fontWeight: "800"`** used in 54 files but not defined in the design system
- **No custom font loaded** - expo-font plugin exists but unused; all text is system default
- **~50+ screens missing `lineHeight`** on body text
- **Label casing inconsistent**: UPPERCASE in 3 files, Title Case elsewhere, sentence case in others
- **`fontStyle: italic`** on titles in 10 files but absent from similar screens
- **5 different `letterSpacing` values** with no token system
- **Local `colors`/`localColors` shadow objects** in ~15 files overriding theme tokens

### Off-Scale Font Sizes (no design system match)
`13, 15, 22, 26, 36, 40, 48, 56, 60, 64, 72, 80, 120`

---

## Category 3: SPACING & LAYOUT (Zero design system adoption)

### Critical Findings
- **Spacing tokens used by 0 of 150 screens** - every padding/margin is a raw integer
- **1,119 hardcoded margin instances** across 144 files
- **395+ instances of `paddingHorizontal: 24`** across 133 files
- **70 screens use `paddingTop: 60` magic number** instead of ScreenContainer
- **Card component used by only 5 of 150 screens** - 72+ screens build inline card containers
- **`applyShadow()` used by only 1 file** (FAB.tsx) - 9 screen files duplicate shadow props inline
- **12+ distinct borderRadius values** used with no token references (8, 12, 14, 16, 20, 22, 24, 28, 30, 48, 80, 100)
- **Card shadows use opacity 0.25** while theme defines 0.12 for `md` level - inconsistent
- **Header horizontal padding varies**: 24 in 133 files, 20 in profile/settings stack

---

## Category 4: NAVIGATION & HEADERS

### Critical Findings
- **Shared Header component used by 0 feature screens** - fully built, completely unused
- **4 different back button glyphs**: `←`, `<`, `☽` (crescent moon), `\u2190`
- **Back buttons on 3 tab landing pages** (Mood, Chat, Journal) - they do nothing
- **Tab bar never hides on sub-screens** - visible on chat, voice recording, journal composer
- **~70 screens from 7 feature areas are completely orphaned** (not registered in any navigator): sleep, stress, mindful, notifications, community, resources, search
- **KeyboardAvoidingView missing from 24 of 27 form screens**
- **Back button touch targets vary**: 40x40 (some with hitSlop), some with no container at all
- **`ChatbotEmptyScreen` imported but never registered** in ChatStack
- **`TextJournalComposerScreen` registered 3 times** under different route names
- **`ProfileSetupWelcomeScreen` has back button** but is stack initial route (nowhere to go back to)

---

## Category 5: ACCESSIBILITY (WCAG 2.1 AA)

### CRITICAL Violations
1. **Zero reduced motion support** - 8+ files with looping animations, including `TypingIndicator` (indefinite bounce). No `AccessibilityInfo.isReduceMotionEnabled()` anywhere.
2. **Error messages lack live regions** - `SignInScreen`, `SignUpScreen`, `OTPEntryScreen`, `PasswordSetupScreen` render errors as plain `<Text>` without `accessibilityLiveRegion="assertive"`
3. **`CrisisSupportAlertScreen` missing `accessibilityRole="alert"`** - This is a crisis-critical screen. Compare with `CrisisModal` which correctly has it.
4. **Heading hierarchy absent from all ~150 screens** - Only 2 components use `accessibilityRole="header"` (`OnboardingTitle`, shared `Header`)

### HIGH Priority
5. **`palette.gray[500]` (#64748B) fails WCAG contrast** on brown[900] background (3.4:1, needs 4.5:1) - used as placeholder text and tertiary text theme-wide
6. **`palette.gray[600]` disabled text** fails even 3:1 large text ratio (2.3:1)
7. **Password toggles on `SignUpScreen`** missing `accessibilityLabel`
8. **Icons from recent Ionicons replacement** missing `importantForAccessibility="no"` for decorative instances
9. **OTP digit box** olive green (#9AAD5C) background with white text = 2.5:1 contrast - **fails WCAG AA**
10. **Custom sliders** in `TextJournalComposerScreen` and `FilterMoodBottomSheet` lack `accessibilityRole="adjustable"`
11. **Stress gauge points** are 20x20 with no hitSlop (below 44pt minimum)
12. **`CrisisSupportAlertScreen`** is a plain View, not a Modal - no focus trapping

---

## Category 6: ANIMATIONS & INTERACTIONS

### Critical Findings
- **Animation token system entirely unused** - 0 of ~195 files import `animationTimings` or `easingCurves`
- **Reanimated v4 installed but never used** - all animations on legacy `Animated` API; 3 components use `useNativeDriver: false` (JS thread animations)
- **Breathing exercise circle is completely static** - the `breathingCircle` animation preset was designed for it but never wired
- **Zero haptic feedback** anywhere - no `expo-haptics` usage
- **All press animations are synchronous snaps** - no easing/spring, just instant `scale: 0.96` on press
- **Modal/BottomSheet lose exit animation** - unmount before RN animation completes
- **ScoreCard gauge has no animated fill** on mount
- **Skeleton loader atom exists but unused** in any production screen
- **Checkbox/RadioButton** have no state transition animation
- **TabBar active indicator** changes instantaneously (no sliding/crossfade)
- **Inconsistent `activeOpacity`**: 0.2 (unset default), 0.7, 0.8, 1.0 across different components
- **`MoodSelectorScreen`** background color change on mood selection is instantaneous

---

## Category 7: PLACEHOLDER CONTENT & INCOMPLETE SCREENS

### Blocks User Flow (Severity 1)
- **11 "Coming Soon" stub screens** registered in navigation and reachable by users
- **5 empty `() => {}` handlers** in onboarding (OTP resend, avatar upload, appointment scheduling x2, view details)
- **6 commented-out modal route registrations** in RootNavigator (search, notifications, community, resources, sleep, stress)

### Visible Placeholders (Severity 2)
- **5 onboarding steps** show "Replace with actual image" dashed circle
- **WelcomeScreen mascot** is a hardware-chip Ionicon (placeholder)
- **3 blank illustration Views** in sleep/stress screens
- **Hardcoded chart data** in `StressDashboardScreen` (static bar widths 45%, 35%, etc.)
- **"Hi, User!"** default username on dashboard
- **"user@example.com"** fallback email in auth navigation

### Tech Debt (Severity 3)
- **"Freud Score Chart"** branding remnant (should be "Solace Score")
- **`parseDeepLink()` always returns null** (TODO stub)
- **Chat tab badge count** permanently undefined
- **Duplicate onboarding route registrations**
- **4 console.error/warn statements** in production code

---

## Category 8: COLOR CONSISTENCY

### Critical Findings
- **22 distinct hardcoded hex values** in production source across 16 files
- **Material Design green (#4CAF50, #2E7D32)** appears in 4 files - completely off-palette, jarring against brown/tan theme
- **`SolaceScoreDetailScreen` entire background** is Material green #2E7D32
- **Error text color inconsistent**: amber (warning token) in SignIn, white in SignUp, orange chip in OTP
- **Disabled state uses 4 different opacity values**: 0.3, 0.4, 0.5, and token-based
- **3 distinct border systems**: semantic tokens in auth, raw palette in onboarding, raw white in profile
- **20+ files use raw `rgba()` strings** that duplicate existing `palette.opacity.*` tokens
- **Missing opacity tokens**: `white60` (used in 20+ files), `white15`, `black60`, `black70`
- **#FF6B6B coral-red** in assessment screen (should be `palette.red[500]`)
- **Gradient hex values hardcoded** instead of referencing palette tokens

### Contrast Failures
| Element | Colors | Ratio | Required | Verdict |
|---------|--------|-------|----------|---------|
| Tertiary text on background | gray[500] on brown[900] | 3.4:1 | 4.5:1 | **FAIL** |
| Disabled text | gray[600] on brown[900] | 2.3:1 | 3.0:1 | **FAIL** |
| OTP digit (focused) | white on olive[500] | 2.5:1 | 4.5:1 | **FAIL** |
| Inactive OTP boxes | brown[800] on brown[900] | 1.3:1 | 3.0:1 | **FAIL** |

---

## PRIORITY MATRIX

### P0 - Ship Blockers (28 items)
1. 11 "Coming Soon" stub screens reachable by users
2. 5 onboarding carousel "Replace with actual image" placeholders
3. 5 empty `() => {}` onboarding handlers (safety-relevant: appointment scheduling)
4. `CrisisSupportAlertScreen` missing `accessibilityRole="alert"` and focus trap
5. Error messages without live regions on auth screens (4 screens)
6. Zero reduced motion support with looping animations
7. OTP digit box fails WCAG contrast (white on olive = 2.5:1)
8. Placeholder text (`gray[500]`) fails WCAG contrast app-wide (3.4:1)

### P1 - Major Quality (65+ items)
1. 241 remaining emoji icons across 52 files
2. Text atom used by 0 screens (all typography hardcoded)
3. Spacing tokens used by 0 screens (1,119 hardcoded margins)
4. 70 screens with `paddingTop: 60` magic number
5. Shared Header/Card/Skeleton/EmptyState components all unused
6. Animation/Reanimated system entirely unused
7. ~70 orphaned screens not in any navigator
8. Tab bar never hides on detail screens
9. Material green (#2E7D32, #4CAF50) off-palette colors
10. 24 form screens missing KeyboardAvoidingView
11. Zero haptic feedback
12. Missing heading hierarchy on all 150 screens

### P2 - Polish (100+ items)
1. 4 different back button glyphs
2. 5 different headerTitle sizes
3. Inconsistent label casing (UPPERCASE vs Title Case)
4. No custom font loaded
5. Card styling duplicated across 72+ screens
6. Shadow props duplicated in 14+ files
7. Disabled state opacity inconsistency (0.3/0.4/0.5)
8. Error text color inconsistency (amber/white/orange)
9. 3 distinct border color systems
10. Press animations are synchronous snaps (no easing)
11. Checkbox/RadioButton/TabBar have no transition animations
12. Breathing exercise circle is static
13. 20+ files with raw rgba() instead of opacity tokens

### P3 - Refinement (50+ items)
1. fontWeight: "800" in 54 files (not in design system)
2. 5 different letterSpacing values
3. fontStyle: italic inconsistently applied
4. Local `colors`/`localColors` shadow objects in ~15 files
5. "Freud Score Chart" branding remnant
6. 4 console statements in production code
7. Anime character names in test fixtures
8. parseDeepLink() stub returns null
9. Chat tab badge permanently undefined

---

## RECOMMENDED FIX ORDER

### Sprint 1: Safety & Accessibility
- Fix CrisisSupportAlertScreen accessibility
- Add live regions to error messages
- Fix WCAG contrast failures (gray[500], olive OTP box)
- Add reduced motion support
- Add heading roles to all screen titles

### Sprint 2: Design System Wiring
- Replace all 241 emoji icons with Ionicons
- Adopt ScreenContainer in all 70 `paddingTop: 60` screens
- Wire spacing tokens into the 10 highest-traffic screens
- Wire shadow system (`applyShadow`) into Card and all elevated surfaces
- Wire gradient presets into remaining headers

### Sprint 3: Component Adoption
- Adopt shared Header component across all screens
- Adopt Card component for all 72+ inline card containers
- Adopt Text atom for typography consistency
- Deploy EmptyState component on all data screens
- Deploy Skeleton loader on data-loading screens
- Add KeyboardAvoidingView to all form screens

### Sprint 4: Animation & Interaction
- Migrate from legacy Animated to Reanimated v4
- Wire animation tokens (durations, springs, easing)
- Add haptic feedback (expo-haptics)
- Animate breathing exercise circle
- Add press spring animations to Button/Card/FAB
- Add modal/bottom sheet exit animations
- Animate ScoreCard gauge fill

### Sprint 5: Navigation & Content
- Register orphaned screens in navigation stacks
- Implement 11 "Coming Soon" screens
- Wire empty onboarding handlers
- Hide tab bar on detail screens
- Unify back button component
- Fix "Freud" branding remnant
- Replace placeholder illustrations

### Sprint 6: Color & Polish
- Replace all 22 hardcoded hex values with palette tokens
- Replace all raw rgba() with opacity tokens
- Add missing opacity tokens (white60, white15, black60, black70)
- Standardize disabled state opacity
- Unify error text colors
- Unify border color systems
- Load custom font via expo-font

---

*Total issues: ~450+ across 8 categories*
*Estimated effort: 6 sprints*
*Test baseline: 5,264 tests passing - maintain throughout*
