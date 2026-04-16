# Solace AI — Design Prototypes v4.0

Reference designs for the mobile redesign sprint. Self-contained HTML + Tailwind CDN + Lucide icons. **Zero build step.**

**v4.0 refresh (Apr 2026):** The prototype is now built as **one file per screen** (42 files), with shared helpers in `lib/` and an ES-module loader in `main.js`. Every screen was rewritten against a stricter design system with an accessibility-first pass (focus rings, 44px touch targets, `prefers-reduced-motion`, semantic HTML, ARIA labels). The cosmic editorial aesthetic is preserved, but each surface has been refined in isolation — the file-per-screen architecture makes it possible to iterate on one screen without fear of ripple effects.

**Theme system (v4.1):** All 42 screens support live theme switching between **5 presets** — Cosmic Night (default), Warm Earth, Ocean Calm, Deep Forest, and Soft Rose. Theme choice persists in `localStorage`. See [Theme system](#theme-system) below. Implementation reference for React Native: mirror the preset objects into a `ThemeContext`.

---

## Architecture

```
prototypes/
├── index.html                    minimal shell — loads fonts, Tailwind, Lucide, main.js
├── main.js                       ES module loader — imports all 42 screens + renders sections
├── sections.js                   section metadata (id, title, subtitle, screen ids)
├── lib/
│   ├── tokens.css                CSS custom properties — single source of truth
│   ├── base.css                  layered styles (glass, hero-card, buttons, animations)
│   ├── helpers.js                shared JS (phone, statusBar, tabBar, miniHeader, moodFace, button)
│   └── tailwind.config.js        Tailwind runtime config injected into the CDN
├── screens/                      ONE FILE PER SCREEN (42 files)
│   ├── 01-welcome.js             exports { id, label, section, render }
│   ├── 02-signin.js
│   ├── …
│   └── 42-not-found.js
├── exports/                      per-section Playwright captures
├── inspiration/                  reference screenshots (Draper, LangSmith, Wysa, …)
├── README.md
└── SUGGESTIONS.md
```

**Each screen file** follows a consistent schema:

```js
// screens/05-home.js
import { statusBar, tabBar } from '../lib/helpers.js';

export const screen = {
  id: 'home',
  label: 'Home dashboard',
  section: 'main',
  render: () => `
    ${statusBar}
    <div class="bg-midnight-950 h-full relative">
      <!-- refined markup -->
    </div>
    ${tabBar('home')}
  `,
};
```

**`main.js`** uses dynamic `import()` to load every module, groups them by section (defined in `sections.js`), and injects them into `#prototypes-root` — meaning the main HTML page stays under 100 lines.

### Why this architecture

| Aspect | Why |
|---|---|
| **Per-screen files** | Refinement can be focused on one screen without touching others; easier to diff changes; mirrors how React Native code will be organized. |
| **Shared `lib/helpers.js`** | `phone()`, `statusBar`, `tabBar()`, `moodFace()` stay DRY; every screen imports what it needs. |
| **CSS tokens separate from Tailwind** | Design tokens live in CSS custom properties (`--aurora-500`, `--touch-min`, `--dur-fast`) — Tailwind still works but the ground truth is `lib/tokens.css`. |
| **`sections.js` drives layout** | Reordering sections or moving a screen between sections is a one-line metadata change. |
| **ES modules, no bundler** | Works with any static server (`npx http-server -p 3030`), no node_modules, no watch step. |

---

## Run it

```bash
cd prototypes
npx http-server -p 3030
# open http://localhost:3030
```

That's it. Fonts, Tailwind, and Lucide load from CDN. All screen modules load via native `import()`.

---

## The 42 screens

### 01 — Auth & Onboarding (4)
1. **Welcome** — Editorial hero, floating gradient orbs, trust row with HIPAA/encryption/rating, primary CTA
2. **Sign in** — Glass form, "Forgot?" inline link, remember-me check, 3 social providers (Apple/Google/GitHub)
3. **Onboarding** — Concentric ring illustration, 4-step progress dots, editorial kicker + headline + CTA pair
4. **Assessment question** — 29% progress ring with "Solace is listening" chip, previous-answer context, 4 radio option cards

### 02 — Main Experience (5)
5. **Home dashboard** — Solace Score hero card, 2×2 metric grid with sage→aurora gradient bars, AI continue CTA, articles carousel
6. **Mood tracker** — Today's mood hero with custom SVG face, 7-day bar chart, 3 AI insight cards, peach FAB
7. **AI chat** — Solace avatar with online dot, user peach bubbles, reaction chips, embedded action cards
8. **Journal** — Mood-from-writing gradient line chart, 3 recent entries with mood-colored side bars
9. **Profile** — Gradient ring avatar, 3-up stats row, Account + Support settings sections

### 03 — Wellness (3)
10. **Breathing** — Animated concentric orb, `04` mono counter, cycle dots, restart/pause/settings controls
11. **Sleep** — Night sky background, `7h 48m` hero, gradient sleep-stages bar, 7-day history
12. **Crisis support** — Warm peach palette (not alarming), Call 988 CTA with phone FAB, Text HOME card, International, "Or talk to Solace" fallback

### 04 — Brand moments (2)
13. **Splash** — Layered concentric rings + breathing orb + Solace wordmark
14. **Quote splash** — Editorial Anne Lamott quote + progress bar loader

### 05 — Onboarding → First value (5)
15. **Goals picker** — 2×4 grid of multi-select goal chips with accent-colored selected states
16. **Face ID primer** — Optional biometric, scan-frame illustration, "2 seconds" chip
17. **Notification primer** — Stacked notification card preview, "gentle · you're in control" framing
18. **Assessment intro** — Shield-check icon, chips showing 5-7 min / Private / 14 questions
19. **Assessment results** — Big gradient score ring (68/100), 4 breakdown bars, 3 recommendation rows

### 06 — Daily loop (4)
20. **Home v2** — Now leads with "How are you right now?" (5 mood faces), Solace Score demoted to secondary tile
21. **Daily check-in** — Big mood face inside breathing orb halo, 5-level radio row, 8-influence tag picker
22. **Mood calendar** — Month heatmap grid with today ring + legend + summary
23. **Mood insights** — AI pattern hero card + mood × sleep scatter plot + 3 supporting insights

### 07 — AI therapy (4)
24. **Chat list** — 5 conversations with mood-colored side bars, tag + message count, FAB for new
25. **Voice session** — Pulsing avatar orb with double rings, gradient waveform, pause button
26. **Session summary** — Sparkle-decorated success ring, topic tags, techniques used, "small action for today"
27. **CBT thought record** — 5-step stepper (Situation → Thought → Emotion → Reframe → Action), distortion chips

### 08 — Journal (2)
28. **Journal composer** — Mood strip + writing prompt + editable body + tag chips + formatting toolbar
29. **Journal detail** — Large mood face + body text + "Solace noticed" AI insight + metadata footer (HR, weather)

### 09 — Mindfulness → sleep (5)
30. **Mindfulness library** — Featured cosmic gradient hero + 7 category pills + 6-item practice grid
31. **Meditation player** — 60×60 cosmic artwork, progress bar, 5-button transport, ambient audio toggle
32. **Session complete** — Success ring with 3 sparkles, "That's 10 minutes for yourself", 3 stat tiles
33. **Sleep log entry** — Night sky with stars, bedtime/woke time cards, quality slider, 6-feeling tags
34. **Soundscapes** — 6-tile grid with gradient art (rain, ocean, forest, noise, fire, bowl) + now playing mini

### 10 — System (4)
35. **Notifications inbox** — Grouped Today/Yesterday/Earlier with filter pills + unread dots
36. **Search** — "anxiety" query with 24 results, 5 category tabs, highlighted `<mark>anxi</mark>` matches
37. **Account settings** — Profile card + Account/Preferences/Privacy sections with toggle + danger zone
38. **Paywall** — Solace Plus hero, 5-feature list, annual ($4.99 SAVE 60%) vs monthly plans

### 11 — States (4)
39. **Loading skeleton** — Shimmering placeholder mirroring Home + breathing orb loader
40. **Empty state** — "Your story begins here", 3 writing prompts, "Write freely" peach CTA
41. **Offline** — Friendly dashed wifi-off icon, "Still available offline" chip row
42. **404** — Giant editorial 404 with breathing orb inside the zero

---

## Design system

### Color — Cosmic Editorial × Therapeutic palette

| Token | Hex | Use |
|---|---|---|
| `midnight-950` | `#040818` | Page background — deeper, bluer than v3; never pure black |
| `midnight-800` | `#0E1430` | Cards, raised surfaces |
| `midnight-700` | `#161D3D` | Modals, elevated panels |
| `aurora-300` | `#8AA3FF` | Cosmic blue accent — links, secondary CTAs, section kickers |
| `aurora-500` | `#6B8FFF` | Primary aurora — button fills, pulse glows |
| `sage-300` | `#9BC4B0` | Primary therapeutic accent — ring progress, primary CTAs |
| `sage-700` | `#5A8A78` | Sage gradient end |
| `peach-300` | `#F4A77E` | Energy accent — FAB, user chat bubble, streak |
| `lavender-300` | `#A89AE0` | Mindfulness, sleep, grief |
| `warm-50` | `#F5F1EA` | Primary text — warm off-white, never `#FFFFFF` |
| `warm-400` | `#8B95A8` | Secondary text |
| `warm-500` | `#5A6478` | Muted, captions, labels |
| `mist` | `#BFCFE8` | Breathing element highlight |

Borders use `rgba(255,255,255,0.06–0.08)` — never colored. Hero cards get a gradient edge via `hero-card::before`.

### Typography

- **Fraunces** (variable serif) — display headings, italic accents, the brand voice
- **Inter** (sans) — body, labels, UI
- **Fira Code** (mono) — numerical data, `[ BRACKET LABELS ]`, timestamps (LangSmith/Draper style)

### Spacing scale

All spacing uses a 4px base via `--sp-1` through `--sp-16`. Touch targets use `--touch-min: 44px` (iOS HIG minimum) or `--touch-comfy: 48px`.

### Motion tokens

| Token | Value | Use |
|---|---|---|
| `--dur-fast` | 150ms | micro-interactions, hover |
| `--dur-base` | 200ms | default transitions |
| `--dur-slow` | 300ms | modals, page transitions |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | entering |
| `--ease-in` | `cubic-bezier(0.55, 0, 1, 0.45)` | exiting |

`@media (prefers-reduced-motion: reduce)` collapses all animations to 0.01ms — respects user accessibility preferences app-wide.

### Components

- **`.glass`** — `rgba(22,29,61,0.5)` + 20px blur — default cards
- **`.glass-strong`** — 78% opacity + cosmic shadow — floating overlays
- **`.glass-aurora`** — gradient-tinted with aurora border — hero surface (one per screen)
- **`.hero-card`** — gradient hairline border via `::before` pseudo
- **`.btn-primary` / `.btn-sage` / `.btn-peach` / `.btn-aurora` / `.btn-lavender`** — gradient fills with inner highlight + warm shadow; all 48px minimum height
- **`.icon-btn`** — 44×44 minimum, focus-ring on keyboard
- **`.bracket-label`** — Fira Code uppercase tracked, wrapped in `[ ... ]`
- **`.aurora-hairline`** — 1px gradient divider
- **`.breath-orb`** — signature radial gradient with `animation: breathe 6s`
- **`.smoke`** — Draper-inspired ethereal blob
- **`.ring-progress`** — conic-gradient sage → aurora with `--p` custom prop
- **`.stat-bar`** — sage → aurora gradient progress bar
- **`.skel`** — shimmer loading placeholder
- **`.tab-btn`** — 44px hit area with active dot indicator

### Accessibility pass (v4)

- ✅ All interactive elements have **44×44px minimum** touch targets
- ✅ All icon buttons have `aria-label`
- ✅ Forms use `<label for>` or `<label>` wrapping; all inputs have accessible names
- ✅ Focus rings via `focus-visible` — blue aurora 2px outline
- ✅ Tab bar uses `<nav aria-label="Primary">` + `aria-current="page"`
- ✅ Progress bars have `role="progressbar"` with `aria-valuenow/min/max`
- ✅ Chat uses `role="log" aria-live="polite"`
- ✅ Radio groups use `role="radiogroup"` + `role="radio" aria-checked`
- ✅ Images use `role="img" aria-label` or `aria-hidden="true"` for decoration
- ✅ Custom SVG mood faces have descriptive labels ("Content mood")
- ✅ `prefers-reduced-motion` collapses all animations
- ✅ Color contrast: warm-50 on midnight-950 ≈ 15:1 (AAA)

---

## Mapping to React Native

When porting to the real app, this file-per-screen structure maps 1:1:

| Prototype | React Native equivalent |
|---|---|
| `screens/05-home.js` | `src/features/home/screens/HomeScreen.tsx` |
| `lib/helpers.js` → `tabBar()` | `src/app/navigation/MainTabNavigator.tsx` |
| `lib/helpers.js` → `phone()` | Not needed — real device is the frame |
| `lib/tokens.css` | `src/shared/theme/tokens.ts` |
| `.glass` CSS | `<BlurView intensity={20}>` from `expo-blur` |
| Lucide icons | `react-native-vector-icons/Feather` |
| Fraunces / Inter fonts | `@expo-google-fonts/fraunces` + `@expo-google-fonts/inter` |

Design tokens for the app:

```ts
// src/shared/theme/colors.ts
export const palette = {
  midnight: { 950: '#040818', 900: '#070C20', 800: '#0E1430', 700: '#161D3D', 600: '#202A55' },
  aurora:   { 100: '#D6E0FF', 300: '#8AA3FF', 500: '#6B8FFF', 700: '#4A6FE5' },
  sage:     { 100: '#D8EADF', 300: '#9BC4B0', 500: '#7AAA94', 700: '#5A8A78' },
  peach:    { 100: '#FCE3D4', 300: '#F4A77E', 500: '#E88B5A' },
  lavender: { 100: '#E0DAF3', 300: '#A89AE0', 500: '#8B7CC8' },
  warm:     { 50: '#F5F1EA', 100: '#EAE3D5', 200: '#C7BEA9', 400: '#8B95A8', 500: '#5A6478' },
  mist:     '#BFCFE8',
};

export const motion = {
  duration: { fast: 150, base: 200, slow: 300 },
  easing: {
    out: Easing.bezier(0.22, 1, 0.36, 1),
    in: Easing.bezier(0.55, 0, 1, 0.45),
  },
};

export const touch = { min: 44, comfy: 48 };
```

---

## Inspirations

- **Draper Associates** — `[ BRACKET LABELS ]`, deep midnight, ethereal smoke blobs, Fira Code editorial accent
- **LangSmith / LangChain** — monospace body type, clean geometric illustrations
- **Wysa** — therapist-led chat, multi-color category grid
- **Calm / Headspace** — gradient orbs, mindful color palettes
- **Linear** — precise dark surfaces
- **Arc browser** — glass overlays, soft accents
- **Refactoring UI** — spacing, restraint, hierarchy

Reference screenshots live in `inspiration/`.

---

## How to iterate

1. Edit a single file in `screens/` — for example `screens/07-chat.js`
2. Save and refresh `localhost:3030` — the ES module loader will pick up the change
3. No build step, no watch task, no bundler — just refresh

### Adding a new screen

1. Create `screens/NN-new-screen.js` with the standard export shape
2. Add the filename to the `ids` array in `main.js`
3. Add the screen id to the `screens` array of the correct section in `sections.js`

### Changing section order

Reorder entries in `sections.js` — that's it.

### Changing a token

Edit `lib/tokens.css` — all screens inherit automatically via CSS custom properties.

---

## Changelog

### v4.0 (Apr 2026) — Architecture refactor
- **File-per-screen** — 42 individual files under `screens/`
- **Shared `lib/`** — tokens, base styles, helpers, Tailwind config
- **ES module loader** — dynamic `import()` in `main.js`
- **Section metadata** — `sections.js` drives layout
- **Accessibility pass** — 44px touch targets, focus rings, ARIA labels, `prefers-reduced-motion`
- **Motion tokens** — consistent `--dur-*` and `--ease-*` tokens
- **Button refinement** — all buttons ≥48px, proper `focus-visible`
- **Form labels** — every input has `<label>`

### v3.0 (Apr 2026) — Editorial cosmic refresh
- Midnight + aurora palette, Fraunces × Inter × Fira Code, `[ BRACKET LABELS ]`, hero-card system

### v2.0 (Mar 2026) — 30 missing screens added
- Brand moments, assessment results, CBT, paywall, sleep log, soundscapes, all state screens

### v1.0 (Mar 2026) — 12 hero screens
- Welcome, sign in, onboarding, assessment, home, mood, chat, journal, profile, breathing, sleep, crisis
