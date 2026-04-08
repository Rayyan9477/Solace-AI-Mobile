# Solace AI — Design Prototypes v3.0

Reference designs for the mobile redesign sprint. Self-contained HTML + Tailwind + lucide icons. No build step.

**v3 refresh (Apr 2026):** Every one of the 42 screens was rewritten with the same level of craftsmanship and dedication. New cosmic editorial design system inspired by Draper Associates, LangSmith, Calm, Wysa, Linear and Arc. Key changes:

- New **midnight + aurora** palette — deeper, bluer base (`#040818`) with a cosmic blue accent (`#6B8FFF`) that complements the existing sage/peach/lavender system
- **Fraunces × Inter × Fira Code** typography pairing — Fira Code monospace for editorial labels and numerical data
- **`[ BRACKET LABELS ]`** — Draper-style typographic hint used as section markers throughout
- **Hero card system** — gradient-bordered hero surfaces (`hero-card` + `glass-aurora`) used once per screen for visual hierarchy
- **Refined breathing orb** — now has cosmic blue layered into the radial gradient, used as a recurring brand signature
- **Refined buttons** — `btn-primary`/`btn-sage`/`btn-peach`/`btn-aurora` with inner highlights and warm shadow glows
- **Aurora hairlines** — subtle gradient dividers (transparent → aurora → transparent) instead of plain borders
- **Cleaner v1 hero screens** — Sleep has stars, Crisis is warm peach (not alarming), bar charts now render correctly

## What's here

| Path | What it is |
|---|---|
| `index.html` | Main showcase — all 42 screens in phone frames, organized into 11 sections |
| `screens.js` | v1 hero screens (12) — refined to v3 system |
| `screens-v2.js` | v2 screens (30) covering every flow — refined to v3 system |
| `SUGGESTIONS.md` | Critique of v1 + v2 design system + v3 refinement notes |
| `screens/` | Per-screen PNG renders (42 total) |
| `inspiration/` | Reference screenshots (Draper, LangSmith, Wysa, Calmy, Dribbble, etc.) |
| `v3-section-*.png` | Per-section captures of the v3 refresh |

## Run it

```bash
cd prototypes
npx http-server -p 3030
# open http://localhost:3030
```

Tailwind and lucide load via CDN, so no install is needed.

## The 42 screens (v1 + v2)

### v1 — Hero screens (12)

#### 01 — Auth & Onboarding
1. **Welcome** — Editorial hero with floating gradient orbs, serif/sans pairing, single coral CTA
2. **Sign in** — Glassmorphism form, social row (Apple/Google/GitHub), no clutter
3. **Onboarding** — Concentric ring illustration + dot progress + content split
4. **Assessment question** — Circular percent ring, radio cards with icon + description, sticky CTA

#### 02 — Main experience
5. **Home dashboard** — Solace Score hero card, 2x2 metric tiles, AI continue card, mindful articles carousel
6. **Mood tracker** — Single-mood hero, 7-day bar chart, AI insight cards, peach FAB
7. **Chat** — Avatar-led AI messages with action cards, gradient user bubbles, glass input bar
8. **Journal** — AI-analyzed mood line chart, recent entries with mood dot chips
9. **Profile** — Gradient ring avatar, stat row, settings groups in glass containers

#### 03 — Wellness features
10. **Breathing** — Immersive concentric rings, mono counter, minimal controls
11. **Sleep** — Hero duration card, sleep stages bar with legend, weekly history bars
12. **Crisis support** — Soft rose accent (not alarming), 3 resource cards, AI fallback

### v2 — Every remaining screen (30)

#### 04 — Brand moments
13. **Splash** — Signature breathing orb with "Solace — a quiet companion"
14. **Quote splash** — Editorial loading moment with a curated quote

#### 05 — Onboarding → first value
15. **Goals picker** — Multi-select chips for what the user wants to work on
16. **Face ID primer** — Optional biometric with reassuring copy
17. **Notifications primer** — Stacked notification mockups, gentle tone
18. **Assessment intro** — Shield icon, chips showing time/privacy/count
19. **Assessment results** — Big gradient ring score, breakdown bars, 3 recommended actions

#### 06 — Daily loop (the hero flow)
20. **Home v2** — Now leads with emotional check-in (5 custom mood faces), not a number
21. **Daily check-in** — Full-screen mood logger with custom SVG faces, intensity slider, activity tags
22. **Mood calendar** — Month heatmap with color-coded daily dots + legend
23. **Mood insights** — AI pattern cards, mood × sleep scatter plot, correlation discoveries

#### 07 — AI therapy
24. **Chat list** — Session cards with tags, unread dots, message counts
25. **Voice session** — Pulsing orb, waveform, timer, pause/keyboard/confirm
26. **Session summary** — Success ring, topic tags, techniques used, small next action
27. **CBT thought record** — 5-step stepper, cognitive distortion chips, previous-answer context

#### 08 — Journal
28. **Journal composer** — Mood strip at top, writing prompt chip, rich text area, toolbar
29. **Journal entry detail** — Large mood face, body text, AI insight card, metadata footer

#### 09 — Mindfulness → sleep
30. **Mindfulness library** — Hero featured card + category pills + 6-item grid
31. **Meditation player** — Vertical art card, progress bar, Spotify-style controls
32. **Session complete** — Celebration ring with sparkles, stats grid, "How do you feel now?"
33. **Sleep log entry** — Night sky background with stars, time cards, quality slider, tag chips
34. **Soundscapes** — Grid of colorful ambient audio tiles with now-playing mini bar

#### 10 — System screens
35. **Notifications inbox** — Grouped by day, filter pills, unread indicators
36. **Search** — Live results by category with highlighted query matches
37. **Account settings** — Profile card + 3 settings groups + danger zone
38. **Paywall** — Gradient logo, 5-feature list, annual/monthly plan cards, 7-day trial

#### 11 — States
39. **Loading skeleton** — Shimmering placeholders + subtle breathing orb loader
40. **Empty state (journal)** — Breathing orb illustration + 3 suggested prompts
41. **Offline** — Friendly dashed icon + "Still available offline" chips
42. **404** — Editorial 404 with breathing orb inside the zero

## Design system

### Color (v3 palette: Cosmic Editorial × Therapeutic)

| Token | Hex | Use |
|---|---|---|
| `midnight-950` | `#040818` | Page background — deeper bluer ink, never pure black |
| `midnight-800` | `#0E1430` | Cards, raised surfaces |
| `midnight-700` | `#161D3D` | Modals, elevated panels |
| `aurora-300` | `#8AA3FF` | NEW — cosmic blue accent (links, secondary CTAs, gradients) |
| `aurora-500` | `#6B8FFF` | NEW — primary aurora |
| `sage-300` | `#9BC4B0` | Primary calm accent (CTAs, brand mark, gauges) |
| `sage-700` | `#5A8A78` | Sage hover/active |
| `peach-300` | `#F4A77E` | Energy CTA (FAB, highlights, streaks, user chat bubbles) |
| `lavender-300` | `#A89AE0` | Mindfulness, sleep, secondary accent |
| `warm-50` | `#F5F1EA` | Primary text — warm off-white, never `#FFFFFF` |
| `warm-400` | `#8B95A8` | Secondary text |
| `warm-500` | `#5A6478` | Muted, captions, labels |
| `mist` | `#BFCFE8` | Watery / breathing element accent |

Borders are always `rgba(255,255,255,0.06–0.08)` — never colored borders. Hero cards get a gradient edge via `hero-card::before`.

### Typography

- **Fraunces** (variable serif) — display headings, italic accents, the brand voice
- **Inter** — body, labels, UI
- **Fira Code** — numerical data, bracket labels, timestamps (LangSmith-style)

The serif × sans × mono triad kills the "generic AI app" look. Most wellness apps go all-Inter; we use Fraunces for emotional moments (`Find your *quiet within.*`), Inter for utility, and Fira Code for the editorial `[ BRACKET LABELS ]` and numerical data (scores, durations).

### Components (v3)

- **`.glass`** — `rgba(22,29,61,0.5)` + 20px blur + saturate(140%) — default cards
- **`.glass-strong`** — `0.78` opacity + cosmic shadow — floating overlays, hero stats
- **`.glass-aurora`** — gradient-tinted glass with aurora border (`rgba(107,143,255,0.18)`) — used for the **one** hero surface per screen
- **`.hero-card`** — adds a gradient hairline border via `::before` pseudo-element (sage → aurora → transparent)
- **`.btn-primary`** / **`.btn-sage`** / **`.btn-peach`** / **`.btn-aurora`** — gradient fills with inner highlight + warm shadow glow
- **`.bracket-label`** — Fira Code uppercase tracked label, wrapped in `[ ... ]` brackets (LangSmith / Draper style)
- **`.aurora-hairline`** — 1px gradient divider (transparent → aurora → transparent)
- **`.breath-orb`** — radial-gradient orb with cosmic blue layered into it; the brand signature
- **`.smoke`** — Draper-inspired ethereal blob, used as ambient background depth
- **`.ring-progress`** — conic-gradient with sage → aurora gradient, custom `--p` for fill

### Aesthetic principles

1. **Editorial > Generic** — Serif headlines, italic accents, generous spacing
2. **Layered depth, not heavy shadows** — Surface hierarchy (4% lightness steps), not drop shadows
3. **Warm off-white text** — `#F5F1EA`, never pure white. Reduces glare, feels human
4. **One emotional accent per screen** — Not every screen uses peach/lavender/sage. Pick the dominant feeling
5. **No emoji anywhere** — Lucide icons only, consistent stroke width
6. **Icons are decoration, not the message** — Always pair with text labels

## How to iterate

Each screen is a JS template literal in `screens.js`. To edit:

1. Find the screen const (e.g., `const homeScreen = ...`)
2. Edit the template literal (it's HTML with Tailwind classes)
3. Save and refresh `localhost:3030` — instant feedback

To add a new screen:

1. Add a new template literal at the bottom of `screens.js`
2. Add it to the `mounts` object at the end
3. Add a `<div id="screen-yourname"></div>` in `index.html` inside one of the sections

## Mapping to React Native

When ready to port to the actual app, the mapping is straightforward:

| Prototype | React Native equivalent |
|---|---|
| `<div class="glass">` | `<View style={glassStyle}>` (use BlurView from `expo-blur`) |
| Tailwind classes | StyleSheet objects in `src/shared/theme/` |
| `lucide` icons | `react-native-vector-icons/Feather` or `Ionicons` (already installed) |
| Fraunces font | `expo-font` + `@expo-google-fonts/fraunces` |
| Inter font | `@expo-google-fonts/inter` |

Tokens to add to `src/shared/theme/` (v3):

```ts
// src/shared/theme/colors.ts
export const palette = {
  midnight: { 950: '#040818', 900: '#070C20', 800: '#0E1430', 700: '#161D3D', 600: '#202A55' },
  aurora:   { 100: '#D6E0FF', 300: '#8AA3FF', 500: '#6B8FFF', 700: '#4A6FE5' },
  sage:     { 100: '#D8EADF', 300: '#9BC4B0', 500: '#7AAA94', 700: '#5A8A78' },
  peach:    { 100: '#FCE3D4', 300: '#F4A77E', 500: '#E88B5A' },
  lavender: { 100: '#E0DAF3', 300: '#A89AE0', 500: '#8B7CC8' },
  warm:     { 50: '#F5F1EA', 200: '#C7BEA9', 400: '#8B95A8', 500: '#5A6478' },
  mist:     '#BFCFE8',
};

export const fonts = {
  display: 'Fraunces',
  sans:    'Inter',
  mono:    'Fira Code',  // For numerical data and bracket labels
};
```

## Inspirations (v3)

The v3 refresh synthesizes patterns from:
- **Draper Associates** (ethereal smoke blobs, deep midnight blue, `[ BRACKET LABELS ]`, monospace navigation hints, Fira Code as editorial accent)
- **LangSmith / LangChain** (Fira Code monospace body text, Draper-style dot connections, clean light surfaces)
- **Wysa** (mascot-led chat, audio cards, multi-color category grid)
- **Calm / Headspace** (gradient orbs, mindful illustrations)
- **Linear** (precise dark surfaces, clean typography)
- **Arc** (glass overlays, soft accents)
- **Saaspo / cta.gallery** (sage-on-dark CTAs, subtle background art)
- **rebrand.gallery** (bold serif headlines as a brand differentiator)

See `inspiration/*.png` for the actual screenshots that informed each decision (`draper-hero.png`, `langsmith-hero.png` are the v3 anchors).

## Key improvements from v1 → v2 → v3

Based on `SUGGESTIONS.md`, v2 added 30 missing screens, and v3 (Apr 2026) refined every screen with the cosmic editorial system. The changelog table below documents the v1→v2 fixes; see `SUGGESTIONS.md` for the full v3 craftsmanship pass.

| Critique | Fix in v2 |
|---|---|
| Flat visual hierarchy | Home v2 has a clear hero (emotional check-in), score is secondary, AI continue tertiary |
| Missing custom mood characters | New `moodFace()` SVG helper generates 5 consistent illustrated faces |
| Assessment feels cold | Assessment intro has shield trust-moment, results has gradient ring + breakdown bars |
| Home is metric-heavy, not emotional | Home v2 opens with "How are you right now?" and 5 tappable mood faces |
| No signature visual | Breathing orb is now the Splash, Empty state, 404, and Loading indicator |
| No loading states | Full skeleton screen with shimmer + orb loader |
| No empty states | Journal first-time view with 3 prompt buttons and illustration |
| No paywall pattern | Full paywall with 5-feature list, annual/monthly plan cards |
| No CBT tooling | 5-step thought record with distortion chips and previous-answer context |
| Chat list missing | Conversation history with tags, unread dots, mood colors |
| No voice experience | Pulsing orb, waveform, timer, dedicated full-screen |
| Sleep feels like a dashboard | Sleep log has night sky background, stars, calming gradient |
| No mindfulness library | Grid with hero featured card and player with Spotify-like controls |
| No search | Full search with category tabs, highlighted matches, per-category results |

## Next steps

1. Review both v1 and v2 — `SUGGESTIONS.md` explains the reasoning
2. Pick the top 5 screens to implement first (recommended: Home v2, Daily check-in, Chat, Mindful player, Assessment results)
3. Decide on font licensing (Fraunces OFL, Inter OFL — both free via Google Fonts)
4. Port the design tokens into `src/shared/theme/` and build the new components
5. Use `screens-v2.js` as the living spec — each screen is a readable template literal that can be translated 1:1 to React Native
