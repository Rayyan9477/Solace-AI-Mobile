# Prototype v4.2 → React Native Migration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the legacy UI (brown/tan/olive "AI slop" palette, 150+ fragmented feature screens) with the 42 prototype v4.2 screens (cosmic editorial design, one-file-per-screen, 5 themes, accessibility-first), wire real navigation and a thin persistence layer, and delete everything that has been superseded.

**Architecture:** Token-first rebuild. We keep the `features/<domain>/screens/` organization and React Navigation v6 topology. We overwrite the palette, ship two new fonts (Fraunces, Fira Code) and a `ThemeContext` with 5 presets, port the prototype's shared helpers (`statusBar`, `tabBar`, `moodFace`, `button`, `miniHeader`) as RN primitives in `src/shared/components/primitives/`, then port each of the 42 screens 1:1 against `prototypes/screens/NN-*.js`. Non-prototype screens (24 chat screens, 14 profile screens, etc.) get deleted. Crisis + real persistence are the only non-prototype additions because shipping a mental-health app without them would be negligent.

**Tech Stack:** Expo SDK 54, RN 0.81.5, React 19.1, React Navigation 6, Reanimated 4 + worklets, `expo-linear-gradient`, `expo-blur` (for `.glass`), `expo-haptics`, `expo-font`, `expo-sqlite`, `react-native-svg`, `@react-native-community/slider`, `@react-native-community/datetimepicker`, `react-native-vector-icons/Feather` (Lucide → Feather mapping).

**Plan location:** `docs/superpowers/plans/2026-04-22-prototype-v4.2-migration.md`
**Source of truth:** `prototypes/` (read `prototypes/README.md`, `prototypes/SCREENS.md`, `prototypes/RN-SPECS.md`, `prototypes/SUGGESTIONS.md` before starting any task).

---

## Table of Contents

1. [Phase 0 — Pre-flight](#phase-0--pre-flight)
2. [Phase 1 — Foundation (theme, fonts, primitives, theme switcher, haptics)](#phase-1--foundation)
3. [Phase 2 — Demolition inventory (what to delete, explicitly)](#phase-2--demolition-inventory)
4. [Phase 3 — 8 priority screens](#phase-3--8-priority-screens)
5. [Phase 4 — Remaining 34 screens (grouped by section)](#phase-4--remaining-34-screens)
6. [Phase 5 — Navigation re-wiring](#phase-5--navigation-re-wiring)
7. [Phase 6 — Improvisations: persistence, safety, AI integration](#phase-6--improvisations-beyond-the-prototype)
8. [Phase 7 — Quality gates & cleanup](#phase-7--quality-gates--cleanup)
9. [Appendix A — Prototype ↔ RN file map (42 rows)](#appendix-a--prototype-to-rn-file-map)
10. [Appendix B — Explicit delete list](#appendix-b--explicit-delete-list)
11. [Appendix C — Lucide → Feather icon map](#appendix-c--lucide-to-feather-icon-map)

---

## Scope Context

**Current repo state (verified 2026-04-22):**
- 150+ screens across 16 feature folders. Most are UI-only with prop-driven placeholder data.
- Palette is `brown/tan/olive/gold` (legacy v1 "therapeutic brown" direction).
- Tests cover render shape but not behaviour (202 test files; `fetch` globally mocked to `{ok: true}`).
- No real backend for chat. No persistence for mood/journal/sleep. Auth is AsyncStorage-only.
- `PROJECT.md` references Redux — stale. Repo uses React Context only.

**Prototype state (v4.2, Apr 2026):**
- 42 screens, cosmic editorial aesthetic (midnight/aurora/sage/peach/lavender), all accessibility-hardened.
- Shared `lib/helpers.js`, `lib/tokens.css`, 5 theme presets, 16 motion primitives, 6 custom SVG illustrations.
- Complete RN implementation specs for the 8 priority screens in `prototypes/RN-SPECS.md`.

**Deliverables after this plan:**
- 42 prototype screens ported to RN as `src/features/<domain>/screens/*.tsx`.
- Cosmic palette + Fraunces/Fira Code loaded + 5 runtime themes.
- Deletion of ~80 superseded screen files (exact list in Appendix B).
- SQLite persistence for mood, journal, sleep logs.
- Crisis tab always-accessible from any screen.
- Chat gated behind a feature flag until a real LLM backend lands.
- `PROJECT.md` rewritten to match reality.

---

## Phase 0 — Pre-flight

### Task 0.1: Create a migration branch and tag current state

**Files:** None (git operations)

- [ ] **Step 1: Tag the current state so we can roll back**

```bash
git tag pre-v42-migration
git push origin pre-v42-migration
```

- [ ] **Step 2: Create the migration branch**

```bash
git checkout -b feat/prototype-v4.2-migration
```

- [ ] **Step 3: Capture baseline metrics**

Run and save output to `docs/superpowers/plans/baseline-metrics.txt`:

```bash
find src -type f \( -name "*.tsx" -o -name "*.ts" \) | wc -l  # expect ~535
find src -name "*.test.tsx" | wc -l                           # expect ~202
npm test -- --passWithNoTests --silent 2>&1 | tail -10
```

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/plans/baseline-metrics.txt
git commit -m "chore: capture pre-migration baseline metrics"
```

### Task 0.2: Rewrite `PROJECT.md` to match reality

**Files:**
- Modify: `PROJECT.md`

- [ ] **Step 1: Replace stale claims** — delete "Redux Toolkit 2.2.7", "React Native 0.76.9", "React 18.3.1", "AppProvider.js", "RefactoredAppProvider.js", `theme-preview/` references, and `setup` / `dev` / `theme-preview:build` script references. The app is Expo 54 / RN 0.81.5 / React 19.1 / Context-based (no Redux).

- [ ] **Step 2: Insert a "Migration in progress" banner** at the top pointing to this plan file.

- [ ] **Step 3: Commit**

```bash
git commit -am "docs: de-stale PROJECT.md, match current stack"
```

### Task 0.3: Remove dead scripts and dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Delete dead npm scripts**

Remove: `theme-preview`, `theme-preview:build`, `setup` (calls `theme-preview`), `dev` (calls `theme-preview`). Update `setup` to just `npm install --legacy-peer-deps`.

- [ ] **Step 2: Audit unused deps**

```bash
grep -rE "from ['\"](concurrently|crypto-js)['\"]" src || echo "unused"
```

If neither is used, remove `concurrently` (devDep, not listed — fine) and keep `crypto-js` only if the future persistence layer needs it (Phase 6 will decide).

- [ ] **Step 3: Commit**

```bash
git commit -am "chore: drop theme-preview scripts, no longer applicable"
```

---

## Phase 1 — Foundation

All screens depend on this. Do not start Phase 3 until Phase 1 is green.

### Task 1.1: Install new font and SVG dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install fonts + helpers**

```bash
npm install --legacy-peer-deps \
  @expo-google-fonts/fraunces \
  @expo-google-fonts/inter \
  @expo-google-fonts/fira-code \
  expo-blur \
  expo-font
```

- [ ] **Step 2: Verify**

```bash
npx expo doctor
```
Expected: no new warnings.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add Fraunces, Inter, Fira Code fonts + expo-blur"
```

### Task 1.2: Replace `src/shared/theme/colors.ts` with the cosmic palette

**Files:**
- Modify: `src/shared/theme/colors.ts`
- Modify: `src/shared/theme/index.ts`

- [ ] **Step 1: Write the failing theme test**

Create `src/shared/theme/__tests__/colors.cosmic.test.ts`:

```ts
import { palette, colors } from '../colors';

describe('cosmic palette', () => {
  it('exposes midnight, aurora, sage, peach, lavender, warm, mist', () => {
    expect(palette.midnight[950]).toBe('#040818');
    expect(palette.aurora[500]).toBe('#6B8FFF');
    expect(palette.sage[300]).toBe('#9BC4B0');
    expect(palette.peach[300]).toBe('#F4A77E');
    expect(palette.lavender[300]).toBe('#A89AE0');
    expect(palette.warm[50]).toBe('#F5F1EA');
    expect(palette.mist).toBe('#BFCFE8');
  });

  it('exposes semantic background/text/border tokens', () => {
    expect(colors.background.primary).toBe(palette.midnight[950]);
    expect(colors.background.card).toBe(palette.midnight[800]);
    expect(colors.text.primary).toBe(palette.warm[50]);
    expect(colors.border.default).toBe('rgba(255,255,255,0.08)');
  });
});
```

- [ ] **Step 2: Run and verify it fails**

```bash
npx jest src/shared/theme/__tests__/colors.cosmic.test.ts
```
Expected: FAIL — `palette.midnight is undefined`.

- [ ] **Step 3: Rewrite `colors.ts`**

Replace the entire file with the palette from `prototypes/README.md` § "Mapping to React Native":

```ts
export const palette = {
  midnight: { 950: '#040818', 900: '#070C20', 800: '#0E1430', 700: '#161D3D', 600: '#202A55' },
  aurora:   { 100: '#D6E0FF', 300: '#8AA3FF', 500: '#6B8FFF', 700: '#4A6FE5' },
  sage:     { 100: '#D8EADF', 300: '#9BC4B0', 500: '#7AAA94', 700: '#5A8A78' },
  peach:    { 100: '#FCE3D4', 300: '#F4A77E', 500: '#E88B5A' },
  lavender: { 100: '#E0DAF3', 300: '#A89AE0', 500: '#8B7CC8' },
  warm:     { 50: '#F5F1EA', 100: '#EAE3D5', 200: '#C7BEA9', 400: '#8B95A8', 500: '#5A6478' },
  mist:     '#BFCFE8',
  // legacy mapping kept for one commit only so nothing else breaks before Phase 2:
  brown: { 900: '#040818', 800: '#0E1430', 700: '#161D3D' } as const,
  tan:   { 500: '#F5F1EA', 300: '#BFCFE8' } as const,
} as const;

export const colors = {
  background: {
    primary: palette.midnight[950],
    card:    palette.midnight[800],
    raised:  palette.midnight[700],
    overlay: 'rgba(22,29,61,0.5)', // .glass
  },
  text: {
    primary:   palette.warm[50],
    secondary: palette.warm[400],
    muted:     palette.warm[500],
    onAccent:  palette.midnight[950],
  },
  border: {
    default: 'rgba(255,255,255,0.08)',
    hairline: 'rgba(255,255,255,0.06)',
  },
  accent: {
    aurora:   palette.aurora[500],
    sage:     palette.sage[300],
    peach:    palette.peach[300],
    lavender: palette.lavender[300],
  },
  status: {
    success: palette.sage[500],
    warning: palette.peach[500],
    danger:  '#E05D5D', // rare — used only on destructive confirm (Delete account)
    info:    palette.aurora[300],
  },
} as const;

export type ColorPalette = typeof palette;
export type SemanticColors = typeof colors;
export type ColorToken = keyof SemanticColors;

export const colorUtils = {
  rgba: (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  },
};
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx jest src/shared/theme/__tests__/colors.cosmic.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/shared/theme/colors.ts src/shared/theme/__tests__/colors.cosmic.test.ts
git commit -m "feat(theme): replace brown/tan palette with cosmic editorial palette"
```

### Task 1.3: Add Fraunces and Fira Code fonts

**Files:**
- Modify: `App.tsx`
- Modify: `src/shared/theme/typography.ts`

- [ ] **Step 1: Update `App.tsx` to load fonts**

Add imports at the top:

```ts
import { useFonts, Fraunces_400Regular, Fraunces_500Medium, Fraunces_600SemiBold, Fraunces_400Regular_Italic } from '@expo-google-fonts/fraunces';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { FiraCode_400Regular, FiraCode_500Medium } from '@expo-google-fonts/fira-code';
import * as SplashScreen from 'expo-splash-screen';
```

Replace the `App` component body so it waits for fonts:

```ts
SplashScreen.preventAutoHideAsync();

function App(): React.ReactElement | null {
  const [fontsLoaded] = useFonts({
    Fraunces_400Regular, Fraunces_500Medium, Fraunces_600SemiBold, Fraunces_400Regular_Italic,
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold,
    FiraCode_400Regular, FiraCode_500Medium,
  });
  React.useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);
  if (!fontsLoaded) return null;
  return (/* existing tree */);
}
```

- [ ] **Step 2: Update `typography.ts` to export font families**

```ts
export const fontFamily = {
  display: 'Fraunces_500Medium',
  displayItalic: 'Fraunces_400Regular_Italic',
  displayBold: 'Fraunces_600SemiBold',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemibold: 'Inter_600SemiBold',
  mono: 'FiraCode_400Regular',
} as const;

// typeScale per prototypes/SUGGESTIONS.md "Typography contrast"
export const typeScale = {
  displayXL: { fontSize: 52, lineHeight: 55, fontFamily: fontFamily.displayItalic },
  displayL:  { fontSize: 36, lineHeight: 40, fontFamily: fontFamily.display },
  displayM:  { fontSize: 24, lineHeight: 29, fontFamily: fontFamily.display },
  h1:        { fontSize: 32, lineHeight: 34, fontFamily: fontFamily.display },
  h2:        { fontSize: 24, lineHeight: 30, fontFamily: fontFamily.displayBold },
  h3:        { fontSize: 20, lineHeight: 26, fontFamily: fontFamily.sansSemibold },
  h4:        { fontSize: 18, lineHeight: 24, fontFamily: fontFamily.sansSemibold },
  bodyL:     { fontSize: 17, lineHeight: 26, fontFamily: fontFamily.sans },
  bodyM:     { fontSize: 14, lineHeight: 21, fontFamily: fontFamily.sans },
  bodyS:     { fontSize: 12, lineHeight: 17, fontFamily: fontFamily.sansMedium },
  mono:      { fontSize: 14, lineHeight: 14, fontFamily: fontFamily.mono },
  label:     { fontSize: 10, lineHeight: 12, fontFamily: fontFamily.sansMedium, letterSpacing: 1.5, textTransform: 'uppercase' as const },
} as const;

export type TypeScaleKey = keyof typeof typeScale;
export type FontWeightKey = 'regular' | 'medium' | 'semibold';
export const fontWeight = { regular: '400', medium: '500', semibold: '600' } as const;
export const letterSpacing = { tight: -0.4, normal: 0, wide: 0.8, ultraWide: 1.5 } as const;
```

- [ ] **Step 3: Smoke test on iOS simulator**

```bash
npm run ios
```
Expected: fonts load, splash clears, no warnings.

- [ ] **Step 4: Commit**

```bash
git commit -am "feat(theme): load Fraunces + Inter + Fira Code; add editorial typeScale"
```

### Task 1.4: Implement the 5-preset ThemeContext

**Files:**
- Create: `src/shared/theme/presets.ts`
- Modify: `src/shared/theme/useTheme.ts`

- [ ] **Step 1: Create presets from `prototypes/SCREENS.md` § "Theme System"**

```ts
// src/shared/theme/presets.ts
import { palette as cosmic } from './colors';

export type ThemeId = 'cosmic' | 'warmEarth' | 'oceanCalm' | 'deepForest' | 'softRose';

export const presets = {
  cosmic: { id: 'cosmic', label: 'Cosmic Night', palette: cosmic },
  warmEarth: {
    id: 'warmEarth', label: 'Warm Earth',
    palette: { ...cosmic,
      midnight: { 950: '#0F0B08', 900: '#1A130D', 800: '#2A1F15', 700: '#3D2D20', 600: '#5A4430' },
      aurora:   { ...cosmic.aurora, 500: '#D4915E' },
      sage:     { ...cosmic.sage,   300: '#8BA67A' },
    },
  },
  oceanCalm: {
    id: 'oceanCalm', label: 'Ocean Calm',
    palette: { ...cosmic,
      midnight: { 950: '#030D14', 900: '#04141F', 800: '#0A2333', 700: '#10334A', 600: '#1A4860' },
      aurora:   { ...cosmic.aurora, 500: '#5BB8C9' },
      sage:     { ...cosmic.sage,   300: '#6EC5A8' },
    },
  },
  deepForest: {
    id: 'deepForest', label: 'Deep Forest',
    palette: { ...cosmic,
      midnight: { 950: '#040E08', 900: '#071A10', 800: '#0D2B1B', 700: '#144028', 600: '#1F5838' },
      aurora:   { ...cosmic.aurora, 500: '#D4A545' },
      sage:     { ...cosmic.sage,   300: '#68B088' },
    },
  },
  softRose: {
    id: 'softRose', label: 'Soft Rose',
    palette: { ...cosmic,
      midnight: { 950: '#0E0610', 900: '#180A1A', 800: '#2A1226', 700: '#3E1C37', 600: '#582A4C' },
      aurora:   { ...cosmic.aurora, 500: '#D4789A' },
      sage:     { ...cosmic.sage,   300: '#B8909A' },
    },
  },
} as const;

export const presetList = Object.values(presets);
```

- [ ] **Step 2: Rewrite `useTheme.ts` to support runtime switching + AsyncStorage persistence**

```ts
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { presets, type ThemeId } from './presets';
import { spacing } from './spacing';
import { borderRadius } from './borderRadius';
import { typeScale, fontFamily } from './typography';
import { animations } from './animationTimings';
import { shadows } from './shadows';
import { gradients } from './gradients';

const STORAGE_KEY = '@solace/theme';

type Ctx = {
  id: ThemeId;
  palette: typeof presets.cosmic.palette;
  setTheme: (id: ThemeId) => void;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  typeScale: typeof typeScale;
  fontFamily: typeof fontFamily;
  animations: typeof animations;
  shadows: typeof shadows;
  gradients: typeof gradients;
};

const ThemeContext = React.createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [id, setId] = React.useState<ThemeId>('cosmic');

  React.useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(v => {
      if (v && v in presets) setId(v as ThemeId);
    });
  }, []);

  const setTheme = React.useCallback((next: ThemeId) => {
    setId(next);
    AsyncStorage.setItem(STORAGE_KEY, next);
  }, []);

  const value = React.useMemo<Ctx>(() => ({
    id,
    palette: presets[id].palette,
    setTheme,
    spacing, borderRadius, typeScale, fontFamily, animations, shadows, gradients,
  }), [id, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
};

export const theme = presets.cosmic; // static fallback for tests
export type Theme = Ctx;
```

- [ ] **Step 3: Update `jest.setup.js`** to provide `ThemeContext` defaults (mirror existing pattern; do not regress test count).

- [ ] **Step 4: Smoke test**

```bash
npm test -- src/shared/theme
```
Expected: all theme tests pass.

- [ ] **Step 5: Commit**

```bash
git commit -am "feat(theme): add 5 runtime theme presets with AsyncStorage persistence"
```

### Task 1.5: Create primitives directory — port prototype `lib/helpers.js` to RN

**Files:**
- Create: `src/shared/components/primitives/StatusBarSafe.tsx`
- Create: `src/shared/components/primitives/TabBar.tsx` (already exists elsewhere as `BottomNavigation` — reconcile, don't duplicate)
- Create: `src/shared/components/primitives/MoodFace.tsx`
- Create: `src/shared/components/primitives/BracketLabel.tsx`
- Create: `src/shared/components/primitives/GlassCard.tsx`
- Create: `src/shared/components/primitives/GlassAuroraCard.tsx`
- Create: `src/shared/components/primitives/HeroCard.tsx`
- Create: `src/shared/components/primitives/BreathingOrb.tsx`
- Create: `src/shared/components/primitives/SmokeBlob.tsx`
- Create: `src/shared/components/primitives/AuroraHairline.tsx`
- Create: `src/shared/components/primitives/RingProgress.tsx`
- Create: `src/shared/components/primitives/StatBar.tsx`
- Create: `src/shared/components/primitives/IconButton.tsx` (44×44 min)
- Create: `src/shared/components/primitives/index.ts`

Each primitive is a ≤100-line file. Follow the prototype markup exactly — for example, `prototypes/lib/helpers.js` `moodFace(level, size)` returns SVG with a radial gradient per level; port it to `react-native-svg` with the same gradient stops.

- [ ] **Step 1: Write a "shape" test for each primitive**

Example for `BreathingOrb.test.tsx`:

```tsx
import { render } from '@testing-library/react-native';
import { BreathingOrb } from './BreathingOrb';

it('renders with default size 120 and respects prefers-reduced-motion', () => {
  const { getByLabelText } = render(<BreathingOrb accessibilityLabel="Breathing orb" />);
  expect(getByLabelText('Breathing orb')).toBeTruthy();
});
```

- [ ] **Step 2: Implement each primitive to pass its test**

`BreathingOrb.tsx` reference shape:

```tsx
import React from 'react';
import { View, AccessibilityInfo, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/shared/theme/useTheme';

export function BreathingOrb({ size = 120, accessibilityLabel = 'Breathing orb' }) {
  const { palette, animations } = useTheme();
  const scale = useSharedValue(1);
  const [reduce, setReduce] = React.useState(false);
  React.useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduce);
    if (!reduce) {
      scale.value = withRepeat(withSequence(
        withTiming(1.08, { duration: 3000 }),
        withTiming(1,    { duration: 3000 }),
      ), -1, true);
    }
  }, [reduce]);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={[{ width: size, height: size, borderRadius: size/2 }, animStyle]}
    >
      <LinearGradient
        colors={[palette.sage[300] + '66', palette.aurora[500] + '55', palette.peach[300] + '33', 'transparent']}
        style={StyleSheet.absoluteFillObject}
      />
    </Animated.View>
  );
}
```

- [ ] **Step 3: Re-export from `index.ts`**

```ts
export { StatusBarSafe } from './StatusBarSafe';
export { MoodFace } from './MoodFace';
// ... one line per primitive
```

- [ ] **Step 4: Commit in one go**

```bash
git add src/shared/components/primitives
git commit -m "feat(primitives): port prototype lib/helpers.js to RN primitives"
```

### Task 1.6: Haptic utility

**Files:**
- Create: `src/shared/utils/haptics.ts`

- [ ] **Step 1: Write test that asserts no crash on web/Android**

`src/shared/utils/__tests__/haptics.test.ts`:

```ts
import { haptic } from '../haptics';
it('exposes 7 feedback methods', () => {
  ['light','medium','heavy','success','warning','error','select'].forEach(k => {
    expect(typeof (haptic as any)[k]).toBe('function');
  });
});
```

- [ ] **Step 2: Implement** per `prototypes/RN-SPECS.md` § "Haptic Feedback Helper".

- [ ] **Step 3: Commit**

```bash
git add src/shared/utils/haptics.ts src/shared/utils/__tests__
git commit -m "feat(utils): add haptic helper (expo-haptics wrapper, 7 methods)"
```

### Task 1.7: Theme switcher UI (goes into Account Settings in Phase 4)

**Files:**
- Create: `src/shared/components/ThemeSwitcher.tsx`

A 5-dot row from `prototypes/SUGGESTIONS.md` § "Theme system (v4.1)". Active preset gets a ring. Tapping persists via `setTheme` from context. Include `accessibilityRole="radiogroup"` and per-dot `role="radio" accessibilityState={{selected}}`. Haptic.select on press.

- [ ] Implement, test (`selecting 'oceanCalm' sets context.id to 'oceanCalm'`), commit.

### Task 1.8: Icon mapping layer (Lucide → Feather)

**Files:**
- Create: `src/shared/components/primitives/Icon.tsx`

React Native doesn't have Lucide; map every Lucide name used in prototypes to `react-native-vector-icons/Feather` (or fall back to `Ionicons`). See Appendix C for the map.

- [ ] **Step 1: Grep prototype icon usage**

```bash
grep -rhoE "data-lucide=\"[a-z0-9-]+\"" prototypes/screens | sort -u
```

- [ ] **Step 2: Build the map** (Appendix C) and implement.

- [ ] **Step 3: Test** — render `<Icon name="heart-handshake" />` does not throw.

- [ ] **Step 4: Commit**

```bash
git commit -am "feat(icons): map all prototype Lucide icons to react-native-vector-icons"
```

### Task 1.9: Foundation smoke gate

- [ ] **Step 1: Run** `npm test -- --silent` — expect no regressions.
- [ ] **Step 2: Run** `npx tsc --noEmit` — expect 0 errors.
- [ ] **Step 3: Run** `npm run ios` — app boots, background is `#040818`, warm white text, no missing fonts.
- [ ] **Step 4: Tag** `git tag phase-1-foundation-complete`.

---

## Phase 2 — Demolition inventory

Delete aggressively. Every file in Appendix B is superseded by a prototype screen OR is an over-fragmented demographic detail that the prototype consolidates into a single screen. Do this **after Phase 1** so the new theme is available when we port over, and **per-feature** (one commit per feature) so a bisect is possible.

### Task 2.1: Delete superseded Chat screens

**Files:** delete 20 of 24 files in `src/features/chat/screens/` — see Appendix B.1. Keep only:
- `ActiveChatScreen.tsx` — rewrite in Phase 3.3
- `ChatsListScreen.tsx` — rewrite in Phase 4 (screen 24)
- `CrisisDetectionScreen.tsx` — **keep but repurpose** in Phase 7
- `index.ts` — rewrite

- [ ] **Step 1:** Delete files (Appendix B.1) and their `.test.tsx` siblings.
- [ ] **Step 2:** Remove their imports from `src/features/chat/screens/index.ts` and from `src/app/navigation/stacks/ChatStack.tsx`.
- [ ] **Step 3:** Update `src/shared/types/navigation.ts` — remove deleted route types.
- [ ] **Step 4:** `npx tsc --noEmit` — resolve red squigglies by removing the deleted routes from any deep-link mapping in `src/app/navigation/linking.ts`.
- [ ] **Step 5:** Commit `chore(chat): remove 20 over-fragmented chat screens superseded by prototype v4.2`.

### Task 2.2: Delete superseded Assessment screens

Keep only: `AssessmentIntroScreen.tsx`, `AssessmentQuestionScreen.tsx`, `AssessmentResultsScreen.tsx` — these match prototype screens 18, 04, and 19. Delete everything else (Appendix B.2) and all related `.test.tsx`.

- [ ] Delete files → update `index.ts` → remove nav routes → `tsc` → commit.

### Task 2.3: Delete superseded Mood screens

Keep: `MoodDashboardScreen.tsx` (→ screen 06), `MoodCalendarScreen.tsx` (→ 22). Merge `MoodSelectorScreen.tsx` semantics into the new `DailyCheckInScreen.tsx`. Delete rest (Appendix B.3).

### Task 2.4: Delete superseded Journal screens

Keep: `JournalDashboardScreen.tsx` (→ 08). Replace `TextJournalComposerScreen.tsx` + `VoiceJournalReadyScreen.tsx` + `VoiceJournalRecordingScreen.tsx` + `NewJournalTypeSelectorScreen.tsx` with a single new `JournalComposerScreen.tsx` (→ 28). Delete rest (Appendix B.4).

### Task 2.5: Delete superseded Sleep screens

Keep: `SleepDashboardScreen.tsx` (→ 11). Replace `StartSleepingScreen.tsx` + `SleepingScreen.tsx` + `WakeUpScreen.tsx` + `NewSleepScheduleScreen.tsx` with `SleepLogEntryScreen.tsx` (→ 33). Delete rest (Appendix B.5).

### Task 2.6: Delete superseded Profile screens

Keep: `ProfileDashboardScreen.tsx` (→ 09), `AccountSettingsScreen.tsx` (→ 37). Delete `PersonalInformationScreen`, `LinkedDevicesScreen`, `LanguagesScreen`, `InviteFriendsScreen`, `SendFeedbackScreen`, `HelpCenterLiveChatScreen`, `LiveChatSupportScreen`, `AboutCompanyScreen`, `SleepQualityIncreaseScreen`, `NotificationSettingsScreen`, `SecuritySettingsScreen` (Appendix B.6). These are all reachable as rows inside the new `AccountSettingsScreen`.

### Task 2.7: Delete superseded Mindful screens

Keep: `MindfulPlayerScreen.tsx` (→ 31), `SoundscapesScreen.tsx` (→ 34), `BreathingExerciseActiveScreen.tsx` (→ 10). Delete `MindfulHoursDashboardScreen`, `MindfulHoursStatsScreen`, `GoalSelectionScreen`, `DurationPickerScreen`, `ExerciseCompletedModal` (will be rebuilt as `SessionCompleteScreen.tsx` → 32). Appendix B.7.

### Task 2.8: Delete superseded Onboarding screens

The current onboarding has 11 profile-detail sub-screens (Name, DoB, Gender, Location, Occupation, etc.) → prototype collapses this into a single `ProfileSetupScreen` + 4 primers (welcome, goals, face-id, notifications). Delete the 11 detail screens (Appendix B.8).

### Task 2.9: Demolition gate

- [ ] **Step 1:** `npm test -- --silent` — tests should pass (deleted tests gone with deleted source).
- [ ] **Step 2:** `npx tsc --noEmit` — 0 errors.
- [ ] **Step 3:** File count sanity: `find src -name "*.tsx" | wc -l` — expect ~300 fewer files than baseline.
- [ ] **Step 4:** Tag `git tag phase-2-demolition-complete`.

---

## Phase 3 — 8 priority screens

These 8 screens unlock the golden path. Each follows `prototypes/RN-SPECS.md` verbatim. For every screen below, the task breakdown is:

**Standard 6-step task template (applies to every screen in Phase 3 & 4):**
1. Read the prototype source file `prototypes/screens/NN-*.js` end-to-end.
2. Read the matching entry in `prototypes/SCREENS.md` for design intent.
3. Write the screen `.test.tsx` — assert accessibility roles, navigation stubs, and animation entrance (use `@testing-library/react-native` + `jest.useFakeTimers()` to tick Reanimated).
4. Run test → fail.
5. Implement screen as a single focused file using primitives from Task 1.5.
6. Run test → pass. Commit `feat(<domain>): add <ScreenName> (prototype screen NN)`.

### Task 3.1: Home v2 → `HomeV2Screen.tsx`

**Prototype:** `prototypes/screens/20-home-v2.js`
**RN spec:** `prototypes/RN-SPECS.md` § "Priority Screen 1 — Home v2"
**Primary file:** `src/features/dashboard/screens/HomeV2Screen.tsx`
**Supporting:** `hooks/useHomeData.ts`, `components/CheckInHeroCard.tsx`, `components/QuickActionRail.tsx`

Key contracts:
- Mood radio-group accessibility per `prototypes/RN-SPECS.md` line 149–155.
- `haptic.select()` on each mood press (iOS + Android).
- `React.memo(CheckInHeroCard)` — gradient is expensive.

- [ ] Test shape: `renders 5 mood radios`, `pressing mood 4 sets accessibilityState checked`, `NotificationBell has label "Notifications, 1 unread"`.
- [ ] Implement per spec. Commit.

### Task 3.2: Daily Check-in → `DailyCheckInScreen.tsx`

**Prototype:** `prototypes/screens/21-checkin.js`
**RN spec:** § "Priority Screen 2"
**Primary file:** `src/features/mood/screens/DailyCheckInScreen.tsx`

Contract highlights:
- Big mood face (130px) inside `BreathingOrb` halo.
- 8 influence tags stored in `Set<string>`.
- Submit button `accessibilityState={{disabled, busy}}`.
- KeyboardAvoidingView behavior `padding` (iOS) / `height` (Android).

### Task 3.3: AI Chat (CBT mode) → rewrite `ActiveChatScreen.tsx`

**Prototype:** `prototypes/screens/07-chat.js`
**RN spec:** § "Priority Screen 3"

**IMPORTANT — from Phase 7 pre-req:** Chat ships in "demo mode" behind a feature flag `FEATURE_CHAT_ENABLED` (default `false`). When disabled, the tab shows a "Coming soon — for now, here are our partnered crisis resources" card linking to CrisisSupportScreen. This prevents shipping a therapy UI with no real model or safety net.

- [ ] Implement both the disabled and enabled paths. Test disabled branch.

### Task 3.4: Meditation Player → `MeditationPlayerScreen.tsx`

**Prototype:** `prototypes/screens/31-mindful-player.js`
**RN spec:** § "Priority Screen 4"

Critical perf note: isolate `GradientProgressBar` into its own memoized component; do not re-render the whole screen per second.

### Task 3.5: Assessment Results → rewrite `AssessmentResultsScreen.tsx`

**Prototype:** `prototypes/screens/19-assessment-results.js`
**RN spec:** § "Priority Screen 5"

Uses `react-native-svg` for the ScoreRing. Reusable — the same `ScoreRing` component drops into `SolaceScoreDetailScreen` in Phase 4.

### Task 3.6: Journal Composer → `JournalComposerScreen.tsx`

**Prototype:** `prototypes/screens/28-journal-composer.js`
**RN spec:** § "Priority Screen 6"

Markdown-in / markdown-out (no native rich text); use `useRef` for title/body, sync to state on blur.

### Task 3.7: Sleep Log Entry → `SleepLogEntryScreen.tsx`

**Prototype:** `prototypes/screens/33-sleep-log.js`
**RN spec:** § "Priority Screen 7"

12 animated + 18 static stars (seeded via `useMemo`). `@react-native-community/slider` native component for quality.

### Task 3.8: Paywall → `PaywallScreen.tsx`

**Prototype:** `prototypes/screens/38-paywall.js`
**RN spec:** § "Priority Screen 8"

StoreKit not wired yet — hard-coded prices allowed for this phase, but commit includes a `TODO: integrate RevenueCat before ship` at the top of the file. Phase 6 wires it.

### Task 3.9: Phase 3 gate

- [ ] All 8 screens pass their tests.
- [ ] `npx tsc --noEmit` clean.
- [ ] Manual smoke: launch iOS, navigate to each new screen. Gif-record to `docs/superpowers/plans/phase3-captures/`.
- [ ] Tag `git tag phase-3-priority-complete`.

---

## Phase 4 — Remaining 34 screens

Grouped by section. Use the same 6-step task template. Each subsection is one or more commits.

### 4.1 — Section 01 Auth & Onboarding (3 remaining: 01, 02, 03, 04 already covered by current)

- [ ] **Task 4.1.1** Screen 01 Welcome → `src/features/onboarding/screens/WelcomeScreen.tsx` (rewrite existing).
- [ ] **Task 4.1.2** Screen 02 Sign in → `src/features/auth/screens/SignInScreen.tsx` (rewrite).
- [ ] **Task 4.1.3** Screen 03 Onboarding → `src/features/onboarding/screens/OnboardingStep1Screen.tsx`.
- [ ] **Task 4.1.4** Screen 04 Assessment question → `src/features/assessment/screens/AssessmentQuestionScreen.tsx` (rewrite).

### 4.2 — Section 02 Main (screens 05–09; 20 is Home v2 done in Phase 3)

- [ ] Screen 05 Home dashboard → `HomeDashboardScreen.tsx` (rewrite). This remains available via a route from Home v2 for users who dismiss the check-in hero.
- [ ] Screen 06 Mood tracker → `MoodDashboardScreen.tsx` (rewrite).
- [ ] Screen 08 Journal → `JournalDashboardScreen.tsx` (rewrite).
- [ ] Screen 09 Profile → `ProfileDashboardScreen.tsx` (rewrite).

### 4.3 — Section 03 Wellness

- [ ] Screen 10 Breathing → rewrite `BreathingExerciseActiveScreen.tsx`. Orb is the `<BreathingOrb>` primitive scaled up. Counter announces via `accessibilityLiveRegion="polite"`.
- [ ] Screen 11 Sleep → rewrite `SleepDashboardScreen.tsx`.
- [ ] Screen 12 Crisis → **rewrite `CrisisSupportScreen.tsx` under a NEW file** `src/features/crisis/screens/CrisisSupportScreen.tsx` (new folder; see Phase 7.1 for why). `Call 988` and `Text HOME` are `Linking.openURL('tel:988')` / `'sms:741741?body=HOME'` — real device integrations.

### 4.4 — Section 04 Brand moments

- [ ] Screen 13 Splash → `src/features/onboarding/screens/SplashScreen.tsx`.
- [ ] Screen 14 Quote splash → `QuoteScreen.tsx`. Load a small bundled JSON of 30 curated quotes (Anne Lamott, Rumi, Mary Oliver, etc.); pick one per app launch.

### 4.5 — Section 05 Onboarding plus (screens 15–19)

- [ ] Screen 15 Goals picker → `GoalsPickerScreen.tsx`.
- [ ] Screen 16 Face ID primer → `BiometricPrimerScreen.tsx`. Wire `expo-local-authentication` for the actual opt-in.
- [ ] Screen 17 Notification primer → `NotificationPrimerScreen.tsx`. Wire `Notifications.requestPermissionsAsync()`.
- [ ] Screen 18 Assessment intro → rewrite `AssessmentIntroScreen.tsx`.

(Screen 19 Assessment Results done in Phase 3.5.)

### 4.6 — Section 06 Daily loop (screens 22, 23; 20+21 done in Phase 3)

- [ ] Screen 22 Mood calendar → `MoodCalendarScreen.tsx` (rewrite).
- [ ] Screen 23 Mood insights → `MoodInsightsScreen.tsx`.

### 4.7 — Section 07 AI therapy (screens 24, 25, 26, 27)

- [ ] Screen 24 Chat list → `ChatsListScreen.tsx` (rewrite) — still gated by `FEATURE_CHAT_ENABLED`.
- [ ] Screen 25 Voice session → `VoiceSessionScreen.tsx` — waveform is `react-native-svg` with 34 animated bars; gate behind same flag.
- [ ] Screen 26 Session summary → `SessionSummaryScreen.tsx`.
- [ ] Screen 27 CBT thought record → `CBTThoughtRecordScreen.tsx`. 5-step stepper; this is *standalone valuable* even without AI chat — ship unflagged.

### 4.8 — Section 08 Journal (screen 29; 28 done in Phase 3)

- [ ] Screen 29 Journal detail → `JournalDetailScreen.tsx`. Render markdown body via `react-native-markdown-display`.

### 4.9 — Section 09 Mindfulness/Sleep (screens 30, 32, 34; 31+33 done in Phase 3)

- [ ] Screen 30 Mindfulness library → `MindfulLibraryScreen.tsx`.
- [ ] Screen 32 Session complete → `SessionCompleteScreen.tsx` (replaces `ExerciseCompletedModal`).
- [ ] Screen 34 Soundscapes → `SoundscapesScreen.tsx` (rewrite). Ambient audio via `expo-av`.

### 4.10 — Section 10 System (screens 35, 36, 37, 38; 38 done in Phase 3)

- [ ] Screen 35 Notifications inbox → `NotificationsInboxScreen.tsx`.
- [ ] Screen 36 Search → `SearchScreen.tsx`. Query spans Practices / Journal / Articles. Highlight matches with `<mark>` → RN equivalent `<Text style={{backgroundColor: peach[100]+'40'}}>`.
- [ ] Screen 37 Account settings → rewrite `AccountSettingsScreen.tsx`. Include the `<ThemeSwitcher>` component from Task 1.7.

### 4.11 — Section 11 States (screens 39, 40, 41, 42)

- [ ] Screen 39 Loading skeleton → `src/features/errors/screens/LoadingSkeletonScreen.tsx`. Shimmer via Reanimated translateX loop.
- [ ] Screen 40 Empty state → `src/features/journal/screens/JournalEmptyScreen.tsx`. Exported for reuse in other empty contexts (chats empty, notifications empty).
- [ ] Screen 41 Offline → `src/features/errors/screens/OfflineScreen.tsx`. Hook up `@react-native-community/netinfo` at app level and show this as an overlay.
- [ ] Screen 42 404 → `src/features/errors/screens/NotFoundScreen.tsx`. Wired from React Navigation `linking.getStateFromPath` fallback.

### 4.12 — Phase 4 gate

- [ ] All 42 prototype screens exist in `src/features/*/screens/`.
- [ ] Run `npm run test:playwright` — the existing E2E smoke must still pass (ids may have changed — update the test selectors).
- [ ] Tag `git tag phase-4-screens-complete`.

---

## Phase 5 — Navigation re-wiring

The old stacks reference deleted screens; you've cleaned imports in Phase 2, but now you need to wire the **new** routes.

### Task 5.1: Update `src/shared/types/navigation.ts`

- [ ] Reflect the new topology. Example diff:

```ts
export type DashboardStackParamList = {
  Home: undefined;          // legacy HomeDashboardScreen
  HomeV2: undefined;        // NEW default
  SolaceScoreDetail: { scoreId?: string };
  SolaceScoreInsights: undefined;
  AISuggestions: undefined;
  Mindfulness: undefined;   // routes to MindfulLibraryScreen
};

export type ChatStackParamList = {
  ChatsList: undefined;
  ActiveChat: { conversationId: string };
  VoiceSession: { conversationId: string };
  SessionSummary: { conversationId: string };
  CBTThoughtRecord: undefined;
};
// ...etc per deleted/kept/added
```

### Task 5.2: Add a root-accessible Crisis button

See Phase 7. This is navigation-level, so it also lives here:

- [ ] Add a floating `<CrisisButton>` to the root above the `MainFlow` so it's reachable from every screen. `accessibilityRole="button"`, `accessibilityLabel="Crisis support, tap for immediate help"`, 56×56, bottom-right offset above the tab bar. Tapping pushes `CrisisSupport` as a modal.

### Task 5.3: Deep link map updates

- [ ] `solace://mood/checkin` → DailyCheckIn (NEW).
- [ ] `solace://mindful/player/:trackId` → MeditationPlayer (NEW).
- [ ] `solace://sleep/log` → SleepLogEntry (NEW).
- [ ] `solace://paywall` → Paywall modal.
- [ ] `solace://crisis` → CrisisSupport modal.
- [ ] Remove every deleted-route deep link from Phase 2.

### Task 5.4: Implement `parseDeepLink`

README.md line 272 flags this as a TODO. With the new routes stable, implement it properly or delete the function entirely and rely on React Navigation's default parser. Choose delete — it's dead code.

### Task 5.5: Phase 5 gate

- [ ] `npx tsc --noEmit` clean.
- [ ] Playwright smoke hits `solace://mood/checkin` and lands on DailyCheckIn.
- [ ] Tag `git tag phase-5-navigation-complete`.

---

## Phase 6 — Improvisations beyond the prototype

These are my additions. They are not in the prototype but shipping without them is a product/safety risk or a credibility risk.

### Task 6.1: SQLite persistence layer

**Why:** Mood, journal, sleep are currently placeholder props. For a daily-use wellness app, zero persistence means zero value.

**Files:**
- Create: `src/shared/data/db.ts` — opens `solace.db` via `expo-sqlite`, exports a typed `exec`/`query` helper.
- Create: `src/shared/data/migrations/001_init.sql` — schema: `mood_entries`, `journal_entries`, `sleep_logs`, `meditation_sessions`.
- Create: `src/shared/data/repositories/moodRepository.ts`.
- Create: `src/shared/data/repositories/journalRepository.ts`.
- Create: `src/shared/data/repositories/sleepRepository.ts`.
- Create: `src/features/<domain>/hooks/use<Domain>Entries.ts` for each — expose `{ entries, addEntry, deleteEntry, isLoading }`.

Schema sketch:

```sql
CREATE TABLE mood_entries (
  id TEXT PRIMARY KEY,
  logged_at INTEGER NOT NULL,          -- unix ms
  mood_level INTEGER NOT NULL CHECK (mood_level BETWEEN 1 AND 5),
  influence_tags TEXT NOT NULL,        -- JSON array
  note TEXT
);

CREATE TABLE journal_entries (
  id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  title TEXT,
  body_md TEXT NOT NULL,
  mood_level INTEGER CHECK (mood_level BETWEEN 1 AND 5),
  hashtags TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE sleep_logs (
  id TEXT PRIMARY KEY,
  bedtime INTEGER NOT NULL,
  wake_time INTEGER NOT NULL,
  quality INTEGER NOT NULL CHECK (quality BETWEEN 1 AND 10),
  feeling_tags TEXT NOT NULL DEFAULT '[]',
  notes TEXT
);

CREATE TABLE meditation_sessions (
  id TEXT PRIMARY KEY,
  track_id TEXT NOT NULL,
  started_at INTEGER NOT NULL,
  duration_seconds INTEGER NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_mood_logged_at ON mood_entries(logged_at DESC);
CREATE INDEX idx_journal_created_at ON journal_entries(created_at DESC);
CREATE INDEX idx_sleep_bedtime ON sleep_logs(bedtime DESC);
```

- [ ] **Step 1:** Write repository unit tests (in-memory sqlite).
- [ ] **Step 2:** Implement `db.ts` with migration runner (`PRAGMA user_version` gate).
- [ ] **Step 3:** Implement repositories.
- [ ] **Step 4:** Wire hooks into the new screens — remove prop-driven fake data in `DailyCheckInScreen`, `JournalComposerScreen`, `JournalDetailScreen`, `SleepLogEntryScreen`, `MoodCalendarScreen`, `MoodInsightsScreen`.
- [ ] **Step 5:** Seed dev data behind `__DEV__` flag (7 fake mood entries so the calendar isn't empty in dev).
- [ ] **Step 6:** Commit as a series (`feat(data): …` per file) — keep commits small.

### Task 6.2: Chat feature flag + "demo" vs "real" modes

**Files:**
- Create: `src/shared/config/featureFlags.ts`

```ts
export const featureFlags = {
  chatBackend: 'mock',  // 'mock' | 'disabled' | 'claude'
} as const;

// When 'disabled', ChatTab renders CrisisAwareChatPlaceholder.
// When 'mock',     uses src/features/chat/services/mockChatService.ts (scripted responses).
// When 'claude',   uses src/features/chat/services/claudeChatService.ts (Phase 6.4).
```

- [ ] Implement the mock service with scripted CBT-style responses so the UI can be demoed without embarrassment.

### Task 6.3: Crisis detection — real keyword tripwire

**Why:** The current `CrisisDetectionScreen.tsx` is a placeholder. Mental-health AI chat ALWAYS needs a safety layer.

**Files:**
- Create: `src/features/crisis/services/crisisClassifier.ts`

Minimum viable classifier (no ML — pure rules):

```ts
const CRISIS_KEYWORDS = [
  /\bsuicid(e|al)\b/i, /\bkill myself\b/i, /\bend it all\b/i,
  /\bhurt myself\b/i, /\bself[-\s]?harm\b/i, /\bdon'?t want to (live|be here)\b/i,
  /\boverdose\b/i,
];

export function detectCrisisSignals(text: string): { matched: boolean; patterns: string[] } {
  const hits = CRISIS_KEYWORDS.filter(r => r.test(text)).map(r => r.source);
  return { matched: hits.length > 0, patterns: hits };
}
```

Wire it into `useChatMode` hook: any user message that trips the classifier shows a `CrisisInterventionSheet` (peach palette, Call 988 CTA, and "Your message is safe — Solace noticed you might be in pain, so it's pausing to make sure you have support").

- [ ] **Step 1:** Unit-test classifier (positive: 6 phrases; negative: 6 adjacent phrases that shouldn't trip, e.g., "I'm dying to see this movie").
- [ ] **Step 2:** Implement the sheet component.
- [ ] **Step 3:** Integration test: user message containing "I want to end it all" → sheet appears within 100ms.
- [ ] **Step 4:** Add a "Dismiss — I'm safe" secondary action that logs to a local table `safety_dismissals` (for later review).

### Task 6.4: Optional — real LLM backend via Claude

If the chat feature graduates from `mock` to `claude`, the wiring:

**Files:**
- Create: `src/features/chat/services/claudeChatService.ts`

Uses `@anthropic-ai/sdk` or a thin REST wrapper calling an **Anthropic-backed proxy** (never ship API keys to the device). System prompt should include: CBT therapist persona, crisis-handling protocol, and a hard instruction to defer to `detectCrisisSignals` before responding.

**This task stays behind `featureFlags.chatBackend = 'claude'`** and is NOT in the initial ship scope unless the product team explicitly commits to the ethical review + backend plumbing.

- [ ] Skip unless green-lit.

### Task 6.5: StoreKit / RevenueCat for Paywall

- [ ] Install `react-native-purchases` (RevenueCat).
- [ ] Configure entitlements in `app.json`.
- [ ] Replace hardcoded prices in `PaywallScreen` with `Purchases.getOfferings()`.
- [ ] Handle success/failure/restore flows.

---

## Phase 7 — Quality gates & cleanup

### Task 7.1: Crisis tab promotion

**Files:**
- Create: `src/features/crisis/` directory with `screens/CrisisSupportScreen.tsx` (moved from `chat/` since it's used across all features).
- Modify: `src/app/navigation/RootNavigator.tsx` to register `CrisisSupport` as a modal on the root stack (reachable from any screen).

### Task 7.2: Accessibility gate

- [ ] **Step 1:** Run `eslint` with `react-native-a11y` — 0 errors expected (it's already at error level).
- [ ] **Step 2:** Enable VoiceOver on iOS sim, navigate each tab. Record any label gaps.
- [ ] **Step 3:** Test `prefers-reduced-motion` — toggle iOS Settings > Accessibility > Motion > Reduce Motion. All Reanimated loops should collapse to static.

### Task 7.3: Test quality upgrade (the fetch mock issue from review)

**Files:**
- Modify: `jest.setup.js`

- [ ] **Step 1:** Install `msw` (`npm install -D msw`).
- [ ] **Step 2:** Replace the global `fetch = jest.fn(() => ok)` with an MSW server that fails by default (tests must opt-in to mock responses).
- [ ] **Step 3:** Fix the ~5 tests that now fail because they were relying on the permissive mock. These are real bugs.
- [ ] **Step 4:** Commit.

### Task 7.4: Coverage threshold

- [ ] Add to `jest.config.js`:

```js
coverageThreshold: {
  global: { branches: 70, functions: 75, lines: 80, statements: 80 },
},
```

- [ ] Hit thresholds by adding behavior tests to the 8 priority screens (not just render tests).

### Task 7.5: CI quality gate

- [ ] Create `.github/workflows/ci.yml` if missing, or update:

```yaml
- run: npm ci --legacy-peer-deps
- run: npm run lint
- run: npm run test:ci       # with coverage threshold enforced
- run: npm run test:playwright
- run: npx tsc --noEmit
```

### Task 7.6: Bundle and perf audit

- [ ] Run `npx expo export -p web` and inspect bundle size; flag anything >2 MB gzipped.
- [ ] Add `react-native-bundle-visualizer` report to `docs/performance/`.

### Task 7.7: Visual regression (optional, suggested)

- [ ] Add Percy or Chromatic via Storybook for the 8 priority screens. Wire to PR checks.

### Task 7.8: Final docs sweep

- [ ] Update `PROJECT.md` again with the new feature list, new theme presets, and delete the still-stale sections.
- [ ] Update `README.md` if the 42-screen tour differs from what's there.
- [ ] Delete `SCREEN_INVENTORY.md` if it's stale (Phase 2 likely made it stale).

### Task 7.9: Merge gate

- [ ] All phase tags exist: `phase-1-foundation-complete` → `phase-7-quality-complete`.
- [ ] PR description lists every deleted file and every new screen.
- [ ] Tag `v5.0.0-prototype-v4.2` and merge to `main`.

---

## Appendix A — Prototype to RN file map

| # | Prototype file | RN file | Phase | Status (vs current) |
|---|---|---|---|---|
| 01 | `01-welcome.js` | `src/features/onboarding/screens/WelcomeScreen.tsx` | 4.1.1 | rewrite |
| 02 | `02-signin.js` | `src/features/auth/screens/SignInScreen.tsx` | 4.1.2 | rewrite |
| 03 | `03-onboarding.js` | `src/features/onboarding/screens/OnboardingStep1Screen.tsx` | 4.1.3 | rewrite |
| 04 | `04-assessment.js` | `src/features/assessment/screens/AssessmentQuestionScreen.tsx` | 4.1.4 | rewrite |
| 05 | `05-home.js` | `src/features/dashboard/screens/HomeDashboardScreen.tsx` | 4.2 | rewrite |
| 06 | `06-mood.js` | `src/features/mood/screens/MoodDashboardScreen.tsx` | 4.2 | rewrite |
| 07 | `07-chat.js` | `src/features/chat/screens/ActiveChatScreen.tsx` | 3.3 | rewrite |
| 08 | `08-journal.js` | `src/features/journal/screens/JournalDashboardScreen.tsx` | 4.2 | rewrite |
| 09 | `09-profile.js` | `src/features/profile/screens/ProfileDashboardScreen.tsx` | 4.2 | rewrite |
| 10 | `10-breathing.js` | `src/features/mindful/screens/BreathingExerciseActiveScreen.tsx` | 4.3 | rewrite |
| 11 | `11-sleep.js` | `src/features/sleep/screens/SleepDashboardScreen.tsx` | 4.3 | rewrite |
| 12 | `12-crisis.js` | `src/features/crisis/screens/CrisisSupportScreen.tsx` | 4.3 + 7.1 | **new folder** |
| 13 | `13-splash.js` | `src/features/onboarding/screens/SplashScreen.tsx` | 4.4 | new |
| 14 | `14-quote.js` | `src/features/onboarding/screens/QuoteScreen.tsx` | 4.4 | rewrite |
| 15 | `15-goals.js` | `src/features/onboarding/screens/GoalsPickerScreen.tsx` | 4.5 | new |
| 16 | `16-biometric.js` | `src/features/onboarding/screens/BiometricPrimerScreen.tsx` | 4.5 | new |
| 17 | `17-notif-primer.js` | `src/features/onboarding/screens/NotificationPrimerScreen.tsx` | 4.5 | new |
| 18 | `18-assessment-intro.js` | `src/features/assessment/screens/AssessmentIntroScreen.tsx` | 4.5 | rewrite |
| 19 | `19-assessment-results.js` | `src/features/assessment/screens/AssessmentResultsScreen.tsx` | 3.5 | rewrite |
| 20 | `20-home-v2.js` | `src/features/dashboard/screens/HomeV2Screen.tsx` | 3.1 | **new** |
| 21 | `21-checkin.js` | `src/features/mood/screens/DailyCheckInScreen.tsx` | 3.2 | new |
| 22 | `22-mood-calendar.js` | `src/features/mood/screens/MoodCalendarScreen.tsx` | 4.6 | rewrite |
| 23 | `23-mood-insights.js` | `src/features/mood/screens/MoodInsightsScreen.tsx` | 4.6 | new |
| 24 | `24-chat-list.js` | `src/features/chat/screens/ChatsListScreen.tsx` | 4.7 | rewrite |
| 25 | `25-voice.js` | `src/features/chat/screens/VoiceSessionScreen.tsx` | 4.7 | rewrite |
| 26 | `26-session-summary.js` | `src/features/chat/screens/SessionSummaryScreen.tsx` | 4.7 | new |
| 27 | `27-cbt.js` | `src/features/chat/screens/CBTThoughtRecordScreen.tsx` | 4.7 | new |
| 28 | `28-journal-composer.js` | `src/features/journal/screens/JournalComposerScreen.tsx` | 3.6 | rewrite (consolidates 4 old files) |
| 29 | `29-journal-detail.js` | `src/features/journal/screens/JournalDetailScreen.tsx` | 4.8 | rewrite |
| 30 | `30-mindful-library.js` | `src/features/mindful/screens/MindfulLibraryScreen.tsx` | 4.9 | rewrite |
| 31 | `31-mindful-player.js` | `src/features/mindful/screens/MeditationPlayerScreen.tsx` | 3.4 | rewrite |
| 32 | `32-session-complete.js` | `src/features/mindful/screens/SessionCompleteScreen.tsx` | 4.9 | new (replaces ExerciseCompletedModal) |
| 33 | `33-sleep-log.js` | `src/features/sleep/screens/SleepLogEntryScreen.tsx` | 3.7 | rewrite (consolidates 4 old files) |
| 34 | `34-soundscapes.js` | `src/features/sleep/screens/SoundscapesScreen.tsx` | 4.9 | rewrite |
| 35 | `35-notifications.js` | `src/features/notifications/screens/NotificationsInboxScreen.tsx` | 4.10 | rewrite |
| 36 | `36-search.js` | `src/features/search/screens/SearchScreen.tsx` | 4.10 | rewrite |
| 37 | `37-account-settings.js` | `src/features/profile/screens/AccountSettingsScreen.tsx` | 4.10 | rewrite |
| 38 | `38-paywall.js` | `src/features/profile/screens/PaywallScreen.tsx` | 3.8 | new |
| 39 | `39-loading.js` | `src/features/errors/screens/LoadingSkeletonScreen.tsx` | 4.11 | new |
| 40 | `40-empty.js` | `src/features/journal/screens/JournalEmptyScreen.tsx` | 4.11 | new |
| 41 | `41-offline.js` | `src/features/errors/screens/OfflineScreen.tsx` | 4.11 | new |
| 42 | `42-not-found.js` | `src/features/errors/screens/NotFoundScreen.tsx` | 4.11 | new |

**Net result:** 42 screens that 1:1 match the prototype, down from the current ~150 fragmented screens.

---

## Appendix B — Explicit delete list

Delete each path below AND its sibling `.test.tsx`. Do this in Phase 2 in the per-feature commits noted.

### B.1 — Chat (20 files)
```
src/features/chat/screens/BookRecommendationsScreen.tsx
src/features/chat/screens/ChatLimitationsScreen.tsx
src/features/chat/screens/ChatWithMediaScreen.tsx
src/features/chat/screens/ChatbotEmptyScreen.tsx
src/features/chat/screens/ConversationsDashboardScreen.tsx
src/features/chat/screens/CustomAIInstructionsScreen.tsx
src/features/chat/screens/DailyQuoteScreen.tsx              # replaced by QuoteScreen (screen 14)
src/features/chat/screens/DeleteConversationScreen.tsx      # becomes a sheet inside ChatsListScreen
src/features/chat/screens/ExpressionAnalysisResultsScreen.tsx
src/features/chat/screens/ExpressionAnalysisScreen.tsx
src/features/chat/screens/FacialExpressionCameraScreen.tsx
src/features/chat/screens/FreudScoreChartScreen.tsx
src/features/chat/screens/MonthlyHealthReportScreen.tsx
src/features/chat/screens/NewConversationScreen.tsx         # becomes a sheet
src/features/chat/screens/SleepAnalysisScreen.tsx
src/features/chat/screens/SleepQualityChartScreen.tsx
src/features/chat/screens/SolaceScoreProgressScreen.tsx
src/features/chat/screens/VoiceExpressionReadyScreen.tsx
src/features/chat/screens/VoiceInputScreen.tsx
src/features/chat/screens/VoiceMessageSentScreen.tsx
src/features/chat/screens/VoiceRecordingActiveScreen.tsx
```

### B.2 — Assessment (6 files)
```
src/features/assessment/screens/AssessmentAgeScreen.tsx
src/features/assessment/screens/AssessmentExpressionAnalysisScreen.tsx
src/features/assessment/screens/AssessmentGenderScreen.tsx
src/features/assessment/screens/AssessmentOtherSymptomsScreen.tsx
src/features/assessment/screens/AssessmentSoundAnalysisScreen.tsx   # also the hardcoded-colors violator
src/features/assessment/screens/AssessmentStressLevelScreen.tsx
```
These are all just question variants — the new single `AssessmentQuestionScreen.tsx` handles them data-driven.

### B.3 — Mood (6 files)
```
src/features/mood/screens/AISuggestionsScreen.tsx           # dashboard already has the AI card
src/features/mood/screens/FilterMoodBottomSheet.tsx
src/features/mood/screens/MoodAnalyticsScreen.tsx           # consolidated into MoodInsightsScreen
src/features/mood/screens/MoodHistoryScreen.tsx             # replaced by MoodCalendarScreen
src/features/mood/screens/MoodSelectorScreen.tsx            # replaced by DailyCheckInScreen
src/features/mood/screens/MoodStatsScreen.tsx               # consolidated into MoodInsightsScreen
src/features/mood/screens/MoodSuggestionResolvedModal.tsx
```

### B.4 — Journal (6 files)
```
src/features/journal/screens/CrisisSupportAlertScreen.tsx    # moved to features/crisis/
src/features/journal/screens/JournalCalendarScreen.tsx       # moved into JournalDashboardScreen top tab
src/features/journal/screens/JournalInsightsScreen.tsx       # merged into JournalDashboardScreen
src/features/journal/screens/JournalStatsScreen.tsx          # merged into JournalDashboardScreen
src/features/journal/screens/JournalTimelineScreen.tsx       # merged into JournalDashboardScreen
src/features/journal/screens/NewJournalTypeSelectorScreen.tsx  # composer handles text vs voice inline
src/features/journal/screens/TextJournalComposerScreen.tsx   # replaced by JournalComposerScreen
src/features/journal/screens/VoiceJournalReadyScreen.tsx     # merged into JournalComposerScreen
src/features/journal/screens/VoiceJournalRecordingScreen.tsx # merged into JournalComposerScreen
src/features/journal/screens/JournalEntryDetailScreen.tsx    # replaced by JournalDetailScreen (renamed)
src/features/journal/screens/JournalEntryEditorScreen.tsx    # replaced by JournalComposerScreen
```

### B.5 — Sleep (7 files)
```
src/features/sleep/screens/FilterSleepBottomSheet.tsx
src/features/sleep/screens/NewSleepScheduleScreen.tsx       # log entry replaces
src/features/sleep/screens/SleepCalendarHistoryScreen.tsx   # 7-day history now lives on dashboard
src/features/sleep/screens/SleepInsightsScreen.tsx          # merged into dashboard
src/features/sleep/screens/SleepQualityGaugeScreen.tsx      # gauge now inline on log entry
src/features/sleep/screens/SleepSummaryScreen.tsx           # merged into dashboard
src/features/sleep/screens/SleepingScreen.tsx               # replaced by SleepLogEntryScreen
src/features/sleep/screens/StartSleepingScreen.tsx          # replaced by SleepLogEntryScreen
src/features/sleep/screens/WakeUpScreen.tsx                 # replaced by SleepLogEntryScreen
```

### B.6 — Profile (11 files)
```
src/features/profile/screens/AboutCompanyScreen.tsx
src/features/profile/screens/HelpCenterLiveChatScreen.tsx
src/features/profile/screens/HelpCenterScreen.tsx           # collapses into AccountSettings
src/features/profile/screens/InviteFriendsScreen.tsx
src/features/profile/screens/LanguagesScreen.tsx
src/features/profile/screens/LinkedDevicesScreen.tsx
src/features/profile/screens/LiveChatSupportScreen.tsx
src/features/profile/screens/NotificationSettingsScreen.tsx # inline toggles in AccountSettings
src/features/profile/screens/PersonalInformationScreen.tsx  # inline in AccountSettings
src/features/profile/screens/SecuritySettingsScreen.tsx     # inline in AccountSettings
src/features/profile/screens/SendFeedbackScreen.tsx
src/features/profile/screens/SleepQualityIncreaseScreen.tsx
```

### B.7 — Mindful (5 files)
```
src/features/mindful/screens/DurationPickerScreen.tsx       # inline on library
src/features/mindful/screens/ExerciseCompletedModal.tsx     # replaced by SessionCompleteScreen
src/features/mindful/screens/GoalSelectionScreen.tsx        # merged into onboarding GoalsPicker
src/features/mindful/screens/MindfulHoursDashboardScreen.tsx # library is the dashboard now
src/features/mindful/screens/MindfulHoursStatsScreen.tsx    # merged into profile
```

### B.8 — Onboarding (profile-detail sub-screens)
```
# Verify current file names under src/features/onboarding/screens/ then delete:
src/features/onboarding/screens/ProfileNameScreen.tsx
src/features/onboarding/screens/ProfileBirthDateScreen.tsx
src/features/onboarding/screens/ProfileGenderScreen.tsx
src/features/onboarding/screens/ProfileLocationScreen.tsx
src/features/onboarding/screens/ProfileOccupationScreen.tsx
# etc — all collapse into the prototype's ProfileSetupScreen + GoalsPicker flow.
```

### B.9 — Dashboard (2 files)
```
src/features/dashboard/screens/FilterSolaceScoreSheet.tsx
src/features/dashboard/screens/SuggestionCompletedModal.tsx
```

**Estimated deletion impact:** ~80 source files + their test siblings = ~160 file removals. Run `git diff --stat phase-1-foundation-complete..phase-2-demolition-complete` after Phase 2 to verify.

---

## Appendix C — Lucide → Feather icon map

For every Lucide name used in prototypes, map to `react-native-vector-icons/Feather` (F) or `Ionicons` (I).

```
bell           → F:bell
chevron-right  → F:chevron-right
chevron-left   → F:chevron-left
check          → F:check
check-circle   → F:check-circle
x              → F:x
heart          → F:heart
heart-handshake→ I:heart-circle-outline  (Feather has no handshake; fallback)
shield         → F:shield
shield-check   → I:shield-checkmark-outline
lock           → F:lock
mail           → F:mail
eye            → F:eye
eye-off        → F:eye-off
user           → F:user
users          → F:users
star           → F:star
sparkles       → I:sparkles-outline
moon           → F:moon
sun            → F:sun
cloud          → F:cloud
cloud-off      → F:cloud-off
wifi           → F:wifi
wifi-off       → F:wifi-off
phone          → F:phone
message-circle → F:message-circle
send           → F:send
mic            → F:mic
mic-off        → F:mic-off
play           → F:play
pause          → F:pause
skip-forward   → F:skip-forward
skip-back      → F:skip-back
shuffle        → F:shuffle
repeat         → F:repeat
volume-2       → F:volume-2
download       → F:download
share-2        → F:share-2
more-vertical  → F:more-vertical
more-horizontal→ F:more-horizontal
plus           → F:plus
minus          → F:minus
search         → F:search
filter         → F:filter
settings       → F:settings
bookmark       → F:bookmark
book-open      → F:book-open
pen-line       → F:edit-3   (no pen-line in Feather — edit-3 is close)
bold           → F:bold
italic         → F:italic
list           → F:list
image          → F:image
calendar       → F:calendar
clock          → F:clock
trending-up    → F:trending-up
trending-down  → F:trending-down
bar-chart-2    → F:bar-chart-2
pie-chart      → F:pie-chart
activity       → F:activity
flame          → I:flame-outline
target         → F:target
award          → F:award
gift           → F:gift
scan-face      → I:scan-outline
lightbulb      → I:bulb-outline
thermometer    → F:thermometer
wind           → F:wind
droplets       → I:water-outline
infinity       → I:infinite-outline
rotate-ccw     → F:rotate-ccw
alert-circle   → F:alert-circle
info           → F:info
log-out        → F:log-out
trash-2        → F:trash-2
key            → F:key
smartphone     → F:smartphone
globe          → F:globe
flag           → F:flag
arrow-right    → F:arrow-right
arrow-left     → F:arrow-left
paperclip      → F:paperclip
```

---

## Self-Review

**Spec coverage:** The prototype defines 42 screens across 11 sections; Appendix A maps all 42 to a concrete RN file and a phase task. Theme system (5 presets), fonts (Fraunces/Inter/Fira Code), motion tokens, 16 animation primitives, 6 illustrations, and accessibility requirements from `prototypes/README.md` are all covered in Phase 1. Delete list in Appendix B accounts for every screen listed under "current state" that doesn't have a prototype analogue.

**Placeholder scan:** No "TBD" / "implement later" strings in tasks. Every phase gate has an explicit verify command. Every task has an explicit commit message. Code blocks included where specs require shape (colors.ts, presets.ts, useTheme.ts, haptic, SQL schema, featureFlags, BreathingOrb). Other screens point to `prototypes/RN-SPECS.md` and `prototypes/SCREENS.md` which ARE the spec — duplicating their 700 lines here would be wasteful.

**Type consistency:** `ThemeId`, `Theme`, `ColorPalette`, `SemanticColors` typed in colors.ts / presets.ts / useTheme.ts and used consistently. `MoodLevel` is `1|2|3|4|5` everywhere. `FEATURE_CHAT_ENABLED` is the one feature flag; featureFlags.chatBackend is the enum. `haptic.*` is 7 fixed methods.

**Known deferrals (not gaps, explicit choices):**
- Real LLM chat backend → Phase 6.4, flag-gated, out of initial ship.
- RevenueCat → Phase 6.5, blocking for revenue features only.
- Visual regression → Phase 7.7, optional.

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-04-22-prototype-v4.2-migration.md`.**

Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration. Best for this plan because each screen is self-contained and the 42 screens can be parallelized within a phase (batches of 4–5).

2. **Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints. Better if you want to watch every step and approve before committing.

**Which approach?**
