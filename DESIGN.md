# DESIGN.md

**Solace AI Mobile — Design System, Engineering Conventions & Execution Rules**

> This is the rulebook. Before implementing any screen, read this. Before reviewing a PR, check against this. Before dispatching a subagent, paste the relevant section into the prompt.
>
> Companion docs:
> - [`prototypes/README.md`](./prototypes/README.md) — prototype architecture
> - [`prototypes/SCREENS.md`](./prototypes/SCREENS.md) — per-screen design intent
> - [`prototypes/RN-SPECS.md`](./prototypes/RN-SPECS.md) — React Native implementation specs for 8 priority screens
> - [`docs/superpowers/plans/2026-04-22-prototype-v4.2-migration.md`](./docs/superpowers/plans/2026-04-22-prototype-v4.2-migration.md) — task-level plan
> - [`docs/superpowers/plans/2026-04-22-sprint-plan.md`](./docs/superpowers/plans/2026-04-22-sprint-plan.md) — sprint plan

---

## 0. Design DNA

### Mission
Solace is a **companion, not a clinician**. Every pixel should read as calm, warm, trustworthy, human — never clinical, alarming, or gamified. Therapeutic design, editorial craft, cosmic restraint.

### Design pillars

| Pillar | Meaning | Test |
|---|---|---|
| **Editorial** | Serif headlines, italic accents, magazine-grade hierarchy | Would this look at home in *The Atlantic*'s digital edition? |
| **Cosmic** | Deep midnight, aurora glow, ethereal blobs — never pure black, never neon | Does the background feel like night sky or like VS Code? It should feel like night sky. |
| **Therapeutic** | Sage/peach/lavender accents, warm off-white text, rounded everything | Would this feel safe at 3 AM during a panic attack? |
| **Restrained** | Max 3 accents per screen, max 3 font sizes per screen | Count them. If >3, cut. |
| **Signature** | The breathing orb is our mark — pull it into splash, loading, empty, crisis, chat AI avatar | Is the orb present or implied on every primary screen? |

### Anti-patterns (never ship these)

- ❌ Pure white text (`#FFFFFF`). Use `palette.warm[50]` (`#F5F1EA`).
- ❌ Pure black background. Use `palette.midnight[950]` (`#040818`).
- ❌ Flat solid button fills. Use gradient-filled `.btn-*` with inner highlight.
- ❌ Bright corporate accents (`#FF0000`, `#00FF00`). Only palette colors.
- ❌ System emoji for mood. We have custom SVG `MoodFace`.
- ❌ "Successful/Error/Warning" banners stacking at the top of the screen. Use toast (1 at a time) or inline.
- ❌ Crisis screens with red/alarm visuals. Crisis is peach + warm — never scary.
- ❌ Screens without a clear hero. One dominant element per screen.
- ❌ Numbers as headlines. Use numbers as supporting detail, emotions/questions as headlines.

---

## 1. Color system

### Base palette (Cosmic Night — default preset)

```ts
export const cosmic = {
  midnight: { 950: '#040818', 900: '#070C20', 800: '#0E1430', 700: '#161D3D', 600: '#202A55' },
  aurora:   { 100: '#D6E0FF', 300: '#8AA3FF', 500: '#6B8FFF', 700: '#4A6FE5' },
  sage:     { 100: '#D8EADF', 300: '#9BC4B0', 500: '#7AAA94', 700: '#5A8A78' },
  peach:    { 100: '#FCE3D4', 300: '#F4A77E', 500: '#E88B5A' },
  lavender: { 100: '#E0DAF3', 300: '#A89AE0', 500: '#8B7CC8' },
  warm:     { 50: '#F5F1EA', 100: '#EAE3D5', 200: '#C7BEA9', 400: '#8B95A8', 500: '#5A6478' },
  mist:     '#BFCFE8',
};
```

### Semantic tokens (never use raw palette in components — use these)

```ts
colors.background.primary   // page bg
colors.background.card       // raised surface
colors.background.raised     // modal
colors.background.overlay    // rgba glass
colors.text.primary          // warm-50
colors.text.secondary        // warm-400
colors.text.muted            // warm-500
colors.text.onAccent         // midnight-950 (for peach/sage CTAs)
colors.border.default        // rgba(255,255,255,0.08)
colors.border.hairline       // rgba(255,255,255,0.06)
colors.accent.aurora | sage | peach | lavender
colors.status.success | warning | danger | info
```

### Themes (5 presets, runtime switchable)

| Theme | Use case | Palette character |
|---|---|---|
| **Cosmic Night** *(default)* | Late-night calm, default shipping | Deep midnight, aurora blue accents |
| **Warm Earth** | Grounding, Pakistani/South-Asian vibe | Walnut brown, terracotta, olive |
| **Ocean Calm** | Water-therapy, anxiety | Deep sea, teal, seafoam |
| **Deep Forest** | Focus, meditation | Emerald, warm amber |
| **Soft Rose** | Gentle, self-compassion | Plum, dusty rose, gold |

Selected via theme picker during onboarding (Sprint 7) or in Account Settings. Persisted to AsyncStorage and Supabase `profiles.preferred_theme`. **Never hardcode a theme.**

### Contrast (AAA target)

| Text class | Minimum contrast | Example |
|---|---|---|
| Body (14–17px) | **7:1** | `warm-50` on `midnight-950` ≈ **15:1** ✅ |
| Large text (≥18px bold or ≥24px) | **4.5:1** | `warm-400` on `midnight-800` ≈ **6:1** ✅ |
| Non-text UI | **3:1** | Border/icon vs surface |

A script in `src/shared/theme/__tests__/contrast.test.ts` iterates every `{background, foreground}` pair used in the app and fails CI on any violation.

### Usage rules

1. **One hero tint per screen.** If Home v2 uses `aurora`, don't also load `sage` + `peach` + `lavender` at hero scale.
2. **Never mix gradients.** A button is `btn-sage` OR `btn-peach`, not both in one stack.
3. **Borders are achromatic.** White-at-6–8% alpha. Never a colored border except on `hero-card::before` gradient hairlines.
4. **Dark mode first.** Light mode is not in scope. Don't write theme-switch conditionals.

---

## 2. Typography

### Fonts

| Font | Use | Load via |
|---|---|---|
| **Fraunces** (variable serif) | Display headlines, italic accents, brand voice | `@expo-google-fonts/fraunces` |
| **Inter** (sans) | Body, labels, UI text | `@expo-google-fonts/inter` |
| **Fira Code** (mono) | Numerical data, `[ BRACKET LABELS ]`, timestamps, version strings | `@expo-google-fonts/fira-code` |

### Scale (use these tokens, never raw `fontSize`)

```ts
typeScale.displayXL  // 52/55  Fraunces italic — hero moments (splash, welcome)
typeScale.displayL   // 36/40  Fraunces       — screen titles
typeScale.displayM   // 24/29  Fraunces       — section headings
typeScale.h1         // 32/34  Fraunces       — primary screen heading
typeScale.h2         // 24/30  Fraunces semi  — card headings
typeScale.h3         // 20/26  Inter semi     — sub-headings
typeScale.h4         // 18/24  Inter semi     — emphasis
typeScale.bodyL      // 17/26  Inter          — primary body
typeScale.bodyM      // 14/21  Inter          — default body
typeScale.bodyS      // 12/17  Inter medium   — captions
typeScale.mono       // 14/14  Fira Code      — numbers, brackets
typeScale.label      // 10/12  Inter, tracked // uppercase — bracket labels
```

### Rules

- **Max 3 type sizes per screen.** Count them in PR review.
- **Headlines are Fraunces.** If an italic word is wanted, use Fraunces Italic (`fontFamily.displayItalic`).
- **Numbers are mono.** Score, duration, count, time, version — always `typeScale.mono`.
- **Bracket labels everywhere for section kickers.** `[ TUESDAY, APRIL 9 ]`, `[ YOUR STREAK ]` — Fira Code, uppercase, 1.5px tracking.
- **Never `fontWeight: 'bold'`.** Use font family tokens (`sansSemibold`, `displayBold`) — weight is tied to the loaded font file.

---

## 3. Spacing, layout & touch targets

### Base unit: **4px**

```ts
spacing.xxs  //  2
spacing.xs   //  4
spacing.sm   //  8
spacing.md   // 12
spacing.lg   // 16
spacing.xl   // 24
spacing.xxl  // 32
spacing.huge // 48
```

### Touch targets (WCAG AAA + iOS HIG + Material)

| Target | Min size | Comfortable |
|---|---|---|
| Icon button | 44×44 | 48×48 |
| Text button / CTA height | 48 | 56 |
| Tab bar icon | 44×44 (hit area) | visual can be 24×24 |
| Mood face (main) | ≥44 | 60 |
| Radio / checkbox hit | 44×44 | 48×48 |

### Layout rules

1. **Safe area insets are law.** Every screen uses `useSafeAreaInsets()`. Add insets to `paddingTop` and `paddingBottom`, never rely on defaults.
2. **Phone max content width = device width − 48.** 24px horizontal padding always.
3. **Hero cards:** 20–24px internal padding, `borderRadius: 24–28`.
4. **Glass cards:** 16px padding, `borderRadius: 20`.
5. **Compact cards (metric tiles):** 12–16px padding, `borderRadius: 16`.
6. **Corner radius scale:** `sm: 8`, `md: 14`, `lg: 22`, `xl: 32`, `pill: 999`.

---

## 4. Motion

### Tokens

```ts
animations.duration.fast  // 150ms — micro, hover
animations.duration.base  // 200ms — default
animations.duration.slow  // 300ms — modals, screen transitions

animations.easing.out     // cubic-bezier(0.22, 1, 0.36, 1) — enter
animations.easing.in      // cubic-bezier(0.55, 0, 1, 0.45) — exit
animations.easing.spring  // { damping: 18, stiffness: 300 }
```

### Reanimated spring presets

```ts
const SPRING_SNAPPY = { damping: 18, stiffness: 300 };  // buttons, toggles
const SPRING_GENTLE = { damping: 22, stiffness: 180 };  // cards entering
const SPRING_BOUNCE = { damping: 12, stiffness: 250 };  // mood face celebration
```

### 16 motion primitives (see `prototypes/lib/motion.css` for reference)
breathing-orb-pulse · concentric-ring-pulse · typing-dots-cascade · waveform-bars · streaming-cursor · staggered-reveal · card-entrance · slide-up-sheet · spring-scale-press · burst-sparkles · count-up · shimmer-skel · progress-fill · aurora-drift · smoke-drift · micro-shake-error

### Reduced-motion rule

Every Reanimated loop reads `AccessibilityInfo.isReduceMotionEnabled()` (or wraps in `useReducedMotion` hook) and collapses to static. **No exceptions.**

```ts
const reduce = useReducedMotion();
useEffect(() => {
  if (reduce) return;
  scale.value = withRepeat(/* ... */);
}, [reduce]);
```

### Never-do list

- ❌ No haptic without visible feedback.
- ❌ No animation >600ms (feels broken).
- ❌ No animation that can't be interrupted mid-flight.
- ❌ No spinner — use `BreathingOrb` at `size={80}` instead. The orb *is* the loading indicator.

---

## 5. Elevation & shadows

Dark-mode shadows are tricky — they absorb, not cast. Use **inner highlights + outer glow** instead of sharp drop shadows.

```ts
shadows.sm    // subtle card lift
shadows.md    // hero card
shadows.lg    // modal
shadows.glow  // gradient-tinted glow for CTAs (peach glow on peach CTA, aurora glow on aurora CTA)
```

`applyShadow('md')` returns the platform-correct style. **Never use `shadowColor: '#000'`.**

---

## 6. Gradients

### Presets (`getGradientProps(key)`)

```ts
gradients.darkHero   // midnight-800 → midnight-950, vertical — page hero bg
gradients.sageCta    // sage-300 → sage-500, 135° — primary CTA
gradients.peachCta   // peach-300 → peach-500, 135° — energy CTA, FAB, user bubble
gradients.auroraHero // aurora-300 → aurora-500, 135° — AI card highlights
gradients.lavenderSleep // lavender-300 → lavender-500
gradients.meadow     // sage-300 → aurora-500 — ring-progress, stat-bar
gradients.nightSky   // midnight-700 → midnight-800 → midnight-950, vertical — sleep screens
gradients.cosmicRainbow // sage → aurora → lavender → peach — Welcome hero, Session Complete
```

### Rules
- One hero gradient per screen. Secondary gradients are flat-alpha gradient hairlines only.
- Always pass `gradients.*` to `<LinearGradient {...getGradientProps('key')} />`. Never inline `colors={}`.

---

## 7. Signature elements

### The Breathing Orb

**This is the brand mark.** It shows up:
- Welcome hero (large, background)
- Splash / Quote (centerpiece)
- Home V2 AI card (small, 40–60px)
- Loading states (replaces spinners)
- Empty states (instead of random illustrations)
- Chat AI avatar (40px)
- 404 (inside the zero)
- Breathing exercise (full-screen, the exercise itself)

Every instance uses the `<BreathingOrb size={N} />` primitive. Do not duplicate.

### Mood Face family

5 custom SVG faces (Struggling, Down, Neutral, Content, Overjoyed), each with a theme-aware gradient. **Always** the `<MoodFace level={N} size={M} />` primitive. No system emoji. No Lucide icon.

### Bracket Labels

`[ SECTION NAME ]` in Fira Code, uppercase, 10px, 1.5px tracking, `text.muted` color. Use as section kickers above headlines and as navigation hints. This is from Draper Associates — it's our editorial signature.

---

## 8. Component hierarchy

```
src/shared/components/
├── primitives/     # Theme-aware atoms that know nothing about features
│   ├── BreathingOrb.tsx
│   ├── SmokeBlob.tsx
│   ├── MoodFace.tsx
│   ├── BracketLabel.tsx
│   ├── GlassCard.tsx
│   ├── GlassAuroraCard.tsx
│   ├── HeroCard.tsx
│   ├── AuroraHairline.tsx
│   ├── RingProgress.tsx
│   ├── StatBar.tsx
│   ├── StatusBarSafe.tsx
│   ├── IconButton.tsx
│   └── Icon.tsx  # Lucide → Feather mapping
├── atoms/          # Generic UI — Button, Input, Avatar, Badge, Text
├── molecules/      # Primitive + atom combos — Card, FormField, SearchBar, Toast
├── organisms/      # Domain-agnostic compositions — BottomNavigation, Header, Modal
```

Features compose from shared, not the other way around:

```
src/features/<domain>/
├── screens/        # One file per screen, matches prototype NN-name.js
├── components/     # Screen-specific components (domain-shaped)
├── hooks/          # use<Domain>Data, use<Feature>
├── services/       # domain logic, API clients, mock services
├── utils/          # pure helpers
└── index.ts        # re-export screens + public types
```

### Rules

1. **Primitives know nothing about features.** `BreathingOrb` never imports from `features/*`.
2. **Features never import from other features.** If feature A needs feature B's type, extract to `shared/types`.
3. **Screens never exceed 300 lines.** Extract components into `<domain>/components/`.
4. **One default export per file = the screen/component.** No barrel-of-screens files.
5. **Feature `index.ts` exports only screens + public types.** Internal components stay internal.

---

## 9. Accessibility (AAA, mandatory)

### Every interactive element

- `accessibilityRole` — button/radio/checkbox/link/tab/image/progressbar/header/list/listitem
- `accessibilityLabel` — describes the action ("Log mood", not "Mood button")
- `accessibilityState` — `{ selected, checked, disabled, busy, expanded }` as applicable
- `accessibilityHint` — the result of action, when non-obvious ("Opens the daily check-in screen")
- Minimum 44×44 hit area (use `hitSlop` if visual is smaller)

### Every dynamic region

- `accessibilityLiveRegion` — `'polite'` for score updates, new messages; `'assertive'` for crisis sheets, errors
- `accessibilityRole="log"` on message lists with `accessibilityLiveRegion="polite"` on the container

### Every form

- `<label>`-equivalent via `accessibilityLabel` on every input
- `accessibilityLabelledBy` when label is visual

### Every image/illustration

- Decorative: `accessibilityElementsHidden={true}` + `importantForAccessibility="no-hide-descendants"` (Android)
- Meaningful: `accessibilityRole="image"` + descriptive `accessibilityLabel`

### Color is never the only signal
If a tag is "selected", show it with border + icon + label AND color. Color alone is insufficient (colorblind users, AAA).

### Focus order
VoiceOver reading order follows visual reading order. Use `accessibilityViewIsModal` on modals so focus doesn't escape.

### CI gate
- `eslint-plugin-jsx-a11y` at error level.
- Custom script: for every `<Pressable>` or `<TouchableOpacity>` in `src/`, fail if missing `accessibilityRole` + `accessibilityLabel`.
- `axe-core` run against each screen's testing-library render tree.

---

## 10. File organization & naming

### Directory structure
```
src/
├── app/             # root concerns — AuthContext, navigation, App-level providers
├── features/        # domain modules (see § 8)
├── shared/          # cross-cutting
│   ├── components/  # primitives, atoms, molecules, organisms
│   ├── data/        # SQLite, repos, sync engine
│   ├── hooks/       # generic hooks
│   ├── services/    # audio, notifications, haptics-init
│   ├── theme/       # tokens, ThemeProvider
│   ├── types/       # global types
│   └── utils/       # pure helpers
```

### Naming

| Thing | Convention | Example |
|---|---|---|
| Component file | `PascalCase.tsx` | `MoodFace.tsx` |
| Component test | `PascalCase.test.tsx` | `MoodFace.test.tsx` |
| Component snapshot | auto | `__snapshots__/MoodFace.test.tsx.snap` |
| Hook file | `use<Thing>.ts` | `useMoodEntries.ts` |
| Hook test | `use<Thing>.test.ts` | `useMoodEntries.test.ts` |
| Service | `<domain>Service.ts` | `audioService.ts` |
| Screen | `<Name>Screen.tsx` | `HomeV2Screen.tsx` |
| Repository | `<domain>Repository.ts` | `moodRepository.ts` |
| Utility | `camelCase.ts` | `formatDate.ts` |
| Type file | `<Thing>.types.ts` | `Mood.types.ts` |

### Imports (enforced order)

```ts
// 1. React + RN core
import React from 'react';
import { View, StyleSheet } from 'react-native';

// 2. External deps
import Animated, { useSharedValue } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

// 3. Internal aliases — @/app, @/features, @/shared
import { useTheme } from '@/shared/theme';
import { BreathingOrb } from '@/shared/components/primitives';

// 4. Relative imports
import { useMoodEntries } from '../hooks/useMoodEntries';
import styles from './DailyCheckIn.styles';

// 5. Types (last, separate block)
import type { MoodLevel } from '@/shared/types/Mood.types';
```

**No default exports for shared primitives/hooks/services** — named exports only. Screens default-export the screen.

---

## 11. Testing standards

### Layers

| Layer | Tool | Coverage target |
|---|---|---|
| Primitive unit | Jest + RTL | 100% |
| Atom/molecule unit | Jest + RTL | 95% |
| Hook test | Jest + `@testing-library/react-hooks` | 90% |
| Screen integration | Jest + RTL + MSW | 90% |
| Repository | Jest + in-memory sqlite | 95% |
| E2E | Playwright (web) + Detox (native, later) | happy paths + 3 edge cases |
| Visual regression | Snapshot tests + optional Percy/Chromatic | every primitive + each screen in each theme |

### Test must assert behavior, not just render

❌ **Bad:**
```ts
it('renders', () => { render(<Button label="x" />); });
```

✅ **Good:**
```ts
it('submits check-in when mood + tag selected', async () => {
  const { getByRole, getByLabelText } = render(<DailyCheckInScreen />);
  fireEvent.press(getByLabelText('Mood level 4: Content'));
  fireEvent.press(getByLabelText('Influence: Sleep'));
  fireEvent.press(getByRole('button', { name: /log this mood/i }));
  await waitFor(() =>
    expect(moodRepository.getAll).toHaveReturnedWith(expect.arrayContaining([
      expect.objectContaining({ mood_level: 4, influence_tags: ['sleep'] }),
    ]))
  );
});
```

### Required assertions per screen test

- ✅ Renders without crash
- ✅ Key accessibility roles present
- ✅ User interaction triggers expected side effect (DB write / nav / state)
- ✅ Reduced-motion path: no animation loops active
- ✅ Theme isolation: render under `cosmic` AND `softRose` — layout stable

### Network — MSW always

```ts
// NEVER jest.mock('fetch'); — global blanket mocks hide bugs.
// ALWAYS:
server.use(
  rest.post('*/auth/v1/token', (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ access_token: 'mock', user: { id: 'u1' }})))
);
```

### Snapshot rules
- Snapshots for primitives + atoms.
- No snapshots for screens (too brittle) — assert specific nodes instead.
- Update snapshots only in PRs that explicitly change visuals.

---

## 12. Git workflow

### Branches

- `main` — always deployable; protected; squash merge only.
- `feat/sprint-N-<slice>` — per sprint slice or agent batch.
- `fix/<short-desc>` — bug fix off main.
- `chore/<short-desc>` — non-user-facing.

### Commit messages (Conventional Commits)

```
<type>(<scope>): <subject>

<body>

Refs: prototype screen NN (if applicable)
```

**Types:** `feat`, `fix`, `chore`, `refactor`, `perf`, `test`, `docs`, `style`, `build`, `ci`, `revert`.
**Scopes:** `theme`, `auth`, `chat`, `mood`, `journal`, `sleep`, `mindful`, `assessment`, `onboarding`, `nav`, `crisis`, `data`, `a11y`, `primitives`, `util`.

Examples:
- `feat(mood): add DailyCheckInScreen (prototype 21)`
- `chore(chat): delete 20 over-fragmented chat screens superseded by v4.2`
- `fix(theme): contrast failure on warm-400 over midnight-700`

### PR format

```
## What
<3-line summary>

## Screens (if UI)
Before: <link-to-old-screenshot-or-note-if-new>
After:  <screenshot-per-theme: cosmic | warmEarth | oceanCalm | deepForest | softRose>

## Checklist
- [ ] Matches prototype (screen NN) pixel intent
- [ ] Themed correctly across 5 presets
- [ ] a11y roles + labels + live regions
- [ ] Reduced-motion path tested
- [ ] Behavior test added (not render-only)
- [ ] Snapshot updated if primitives touched
- [ ] No hardcoded colors/fonts/spacing
- [ ] tsc clean, tests pass, coverage ≥90% on new files
- [ ] Commits follow Conventional Commits

Refs: prototype screen NN, plan task N.M
```

### Merge rule
- Squash on merge.
- Tag every sprint close: `sprint-N-complete`.
- Never force-push to `main`.

---

## 13. Subagent dispatch rules

You're a solo dev with multi-agent support. Use it.

### When to dispatch
- Multiple **independent** screens within a sprint (batch of 3–5).
- Parallel-safe demolition (per-feature delete sweeps).
- Research questions that'd eat the main context (doc hunts, API lookups).
- Coverage gap-filling across unrelated files.

### When NOT to dispatch
- Tasks that share state (navigation type edits + stack wiring should stay serial).
- Tasks where agent output needs heavy review (reviewing 5 agents at once means reviewing none).
- Anything with a crisis-safety dimension (crisis classifier, crisis UI — you review it line-by-line).

### Prompt template for a screen agent

```
You're building ONE React Native screen for the Solace AI Mobile app.

Repository: d:/Repo/Solace-AI-Mobile
Prototype source of truth: prototypes/screens/NN-<name>.js
Design intent: prototypes/SCREENS.md § "NN. <Name>"
RN spec (if priority): prototypes/RN-SPECS.md § "Priority Screen <K> — <Name>"
Execution rules: DESIGN.md — read sections 1, 2, 3, 4, 8, 9, 11 end-to-end before writing code.

Your task:
1. Create src/features/<domain>/screens/<Name>Screen.tsx (+ hooks + components as needed).
2. Use ONLY primitives from @/shared/components/primitives — do not duplicate.
3. Use ONLY theme tokens (@/shared/theme) — no hardcoded colors/fonts/spacing.
4. Behavior test in <Name>Screen.test.tsx asserting: a11y roles, primary user interaction, reduced-motion respected.
5. Follow Conventional Commits — one commit: `feat(<domain>): add <Name>Screen (prototype NN)`.

Constraints:
- File ≤300 lines.
- All strings human-written, no lorem ipsum.
- Animations use Reanimated v4 + worklets; springs are SPRING_SNAPPY/GENTLE/BOUNCE from DESIGN.md § 4.
- a11y AAA — every interactive element has role + label + state.
- Reduced-motion path: animations skip when useReducedMotion() returns true.
- Haptic on primary action (light), success on completion.

Report back: commit SHA + brief delta summary. Do NOT run tests — I'll do the test gate.
```

### Review after agents
After agent batch completes:
1. `npx tsc --noEmit` — must be clean.
2. `npm test -- <feature-path>` — must pass.
3. Spot-check 1 screen in full; skim the rest for DESIGN.md compliance (hardcoded colors? file length? a11y?).
4. If ≥2 agents made the same mistake, tighten the prompt for next batch.

---

## 14. Data & state rules

### State placement

| State | Where | Why |
|---|---|---|
| Server session | `supabase.auth` (proxied by AuthContext) | Single source |
| UI ephemeral (selected tab, modal open) | `useState` in screen | Local concern |
| Cross-screen UI (theme, locale) | Context | Rare + global |
| Persisted user data (mood, journal, sleep) | SQLite via repo + hook | Survive restart + sync-ready |
| Form state | `useReducer` or `react-hook-form` | Predictable |
| Derived data | `useMemo` | Keep cheap |
| **No Redux.** | — | Not needed; stale docs lie |

### Repository pattern

```ts
// src/shared/data/repositories/moodRepository.ts
export const moodRepository = {
  async add(entry: Omit<MoodEntry, 'id' | 'created_at' | 'sync_status'>): Promise<MoodEntry> { /* ... */ },
  async getAll(): Promise<MoodEntry[]> { /* ... */ },
  async getByDate(date: Date): Promise<MoodEntry | null> { /* ... */ },
  async getRange(start: Date, end: Date): Promise<MoodEntry[]> { /* ... */ },
  async delete(id: string): Promise<void> { /* ... */ },
};
```

Screens never touch SQLite directly — always via a repo. Hooks wrap the repo for React ergonomics + cache invalidation.

### Sync readiness (for future remote sync)

Every user-data table includes:
```sql
sync_status text default 'local',  -- 'local' | 'synced' | 'dirty'
remote_id   text,                   -- server uuid once synced
updated_at  integer not null,       -- unix ms, bumped on every write
```

Writes set `sync_status='local'`. Future sync sprint will flip to `'synced'` and fill `remote_id`.

---

## 15. Performance rules

- **FlatList over ScrollView** when list has 10+ items.
- **`React.memo` on any component that renders inside a list** or re-renders often.
- **`useCallback` on handlers passed to memoed children.**
- **`useMemo` for expensive derivations** (>5ms).
- **No `console.log` in production** — babel plugin `transform-remove-console` already configured.
- **Isolate per-tick renders.** e.g., a meditation progress bar ticking every second lives in its own component so the whole screen doesn't re-render.
- **Images:** `expo-image` with `contentFit` + `cachePolicy='memory-disk'`. Never RN `<Image>` for remote urls.
- **Bundle budget:** screen JS <200KB gzipped; flag in PR if exceeded.

---

## 16. Security rules

- **Never commit secrets.** `EXPO_PUBLIC_*` are client-visible — don't put service-role keys there.
- **Supabase RLS always on.** Every table `enable row level security`; policies are explicit.
- **AsyncStorage is not secure storage.** Sensitive keys (biometric secret, etc.) go in `expo-secure-store`.
- **Deep-link params are untrusted.** Validate `:entryId`, `:conversationId` as UUIDs before querying.
- **Crisis audit trail.** `safety_dismissals` table is local-only for now; retain locally and sync later with user consent.

---

## 17. Definition of Done (shipping gate)

Every merged PR satisfies:

- [ ] TypeScript: `npx tsc --noEmit` clean
- [ ] Lint: `npm run lint` clean (including a11y rules)
- [ ] Unit: new code ≥90% line, ≥85% branch coverage
- [ ] Visual: screenshot in PR shows the screen in all 5 themes
- [ ] Accessibility: VoiceOver walks the screen without dead ends; contrast audit passes
- [ ] Reduced-motion: animations collapse under reduced motion
- [ ] Prototype match: side-by-side with `prototypes/screens/NN-*.js` — same layout, components, kicker labels, CTA copy
- [ ] No hardcoded values: no raw hex, no raw font family, no raw spacing number
- [ ] Commit style: Conventional Commits, references prototype screen NN if applicable
- [ ] Docs: if contract changed (navigation types, repo API), doc updated

---

## 18. Quick reference cheatsheet (pin this)

```
Background        palette.midnight[950] (#040818)
Card              palette.midnight[800]
Text primary      palette.warm[50]
Text secondary    palette.warm[400]
Border            rgba(255,255,255,0.08)
Primary CTA       btn-sage (sage-300 → sage-500 gradient)
Energy CTA/FAB    btn-peach (peach-300 → peach-500)
AI/Link           btn-aurora (aurora-300 → aurora-500)
Sleep             btn-lavender

Display headline  Fraunces 32–52
Italic accent     Fraunces Italic
Section kicker    [ UPPER FIRA CODE TRACKED ]
Body              Inter 14–17
Numbers           Fira Code 14

Touch min         44×44
CTA height        48+
Page padding      24 horizontal

Breathe in/out    withRepeat(withSequence(withTiming(1.08,3000),withTiming(1,3000)),-1,true)
Press feedback    scale 1 → 0.92 → 1 (SPRING_SNAPPY → SPRING_BOUNCE)
Reduce motion     useReducedMotion() → skip loops

Every Pressable   accessibilityRole + accessibilityLabel
Every input       <label>-equivalent accessibilityLabel
Every modal       accessibilityViewIsModal
Every icon btn    44×44 hit area
```

---

## 19. When in doubt

- **Read the prototype source file.** It's always the answer.
- **Read `prototypes/SUGGESTIONS.md`** for the design rationale.
- **Read `prototypes/RN-SPECS.md`** for RN-specific decisions on the 8 priority screens.
- **Don't improvise pixels.** Match the prototype or propose a DESIGN.md amendment in a separate PR.
- **Don't improvise safety.** Crisis, auth, data persistence changes require explicit review.

---

*DESIGN.md is a living doc. Amendments land as PRs with rationale. Squash on merge. Version in the git log.*
