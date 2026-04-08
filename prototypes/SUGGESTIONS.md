# Solace AI — Design Critique, v2 Suggestions & v3 Refresh

---

## v3 refresh — what changed (Apr 2026)

The v2 prototypes were the right structure but rough on craftsmanship — the same Tailwind base recipe applied 42 times. v3 takes feedback ("each screen needs the same level of dedication") and rewrites every screen against a refined cosmic editorial design system inspired by **Draper Associates** and **LangSmith / LangChain**.

### What I added from Draper

- **Deeper midnight base** (`#040818` instead of `#0A0E1A`) — bluer, less neutral, lets the cosmic glow read
- **Smoke blobs** — `radial-gradient(ellipse, rgba(107,143,255,0.18), transparent 60%)` blurred 40px, used as ambient depth on hero screens (Splash, Voice session, Welcome, Crisis)
- **`[ BRACKET LABELS ]`** — Fira Code uppercase tracked labels wrapped in brackets, used as section markers and "navigation hints" throughout the app — directly inspired by Draper's `[ SUBMIT YOUR PITCH ]` / `[ LIMITED PARTNER INQUIRY ]` corner labels
- **Aurora hairlines** — 1px gradient dividers (transparent → aurora → transparent) replacing plain borders on dividers

### What I added from LangSmith

- **Fira Code as editorial accent** — LangSmith uses Fira Code for body copy itself (`Observe, evaluate, and deploy your agents.`). I kept Fraunces + Inter as the primary pairing but use Fira Code for: bracket labels, numerical data (scores, durations, message counts), file paths, and "small caps" feel
- **Cosmic blue accent** (`#6B8FFF`) — adds a third primary alongside sage/peach. Used for: link text, secondary CTAs, gradient highlights, and the new `glass-aurora` hero card
- **Cleaner geometric line illustrations** — concentric rings on Welcome, Onboarding, Empty State, Voice session, Sleep all use the same precise stroke language

### Design system v3 additions

- **`hero-card`** — wraps any card with a subtle gradient hairline border (`::before` pseudo-element with `mask-composite`). Used **once** per screen on the hero surface to establish hierarchy without resorting to color intensity.
- **`glass-aurora`** — gradient-tinted glass for the hero surface (cosmic blue tint at the top-left, midnight base)
- **`btn-primary` / `btn-sage` / `btn-peach` / `btn-aurora`** — gradient fills with proper inner highlight + warm outer shadow glow. Replaces flat `bg-warm-50` etc.
- **Refined breathing orb** — now layers cosmic blue into the radial gradient (was pure sage). It's subtler but reads as a "live brand mark" rather than just a calming graphic.
- **Phone frame** — bezel switched to titanium ring (3 layers of box-shadow) instead of matte plastic; deeper outer shadow for proper depth
- **Refined stat-bar** — sage → aurora gradient (was solid sage)
- **Refined ring-progress** — same sage → aurora gradient with cleaner inner shadow

### Per-screen craftsmanship pass

Every one of the 42 screens was rewritten from scratch using the v3 system. Notable highlights:

- **Welcome** — added trust row (HIPAA / encrypted), refined orb layering with peach/lavender/aurora tints
- **Sign in** — added "Forgot?" inline link, "Remember me" with checked state, divider with `[ OR ]` bracket label
- **Assessment question** — added previous-answer chip ("Earlier you said: Neutral"), Solace listening chip below the progress ring
- **Home dashboard** — Solace Score now uses `hero-card glass-aurora`; metric grid has sage→aurora stat bars; AI Therapy CTA has full hero treatment
- **Chat** — user bubble switched to peach gradient (warmer than corporate sage); reaction chips ("This helped" / "Not quite"); action card promoted to full hero card
- **Sleep dashboard** — night sky background with stars; sleep stages bar uses 4 distinct gradients
- **Crisis support** — heart icon now has soft orange halo (not alarming red); Call 988 button has a peach FAB
- **Splash (v2)** — 5 layered concentric rings, version label at the bottom
- **Daily check-in (v2)** — big mood face inside an orb halo, scale slider with active state
- **Voice session (v2)** — pulsing orb with double concentric rings; gradient waveform
- **Sleep log (v2)** — scattered stars; lavender quality slider with white thumb
- **Paywall (v2)** — feature list inside a hero card; annual plan with gradient tick mark + 60% save badge
- **Loading skeleton (v2)** — proper shimmer animation + breathing orb loader at the bottom

### Mood face glyphs

The 5-level `moodFace()` SVG helper got an inset highlight (`inset 0 5% 10% rgba(255,255,255,0.2)`) so the gradient circles look more like physical objects than flat illustrations.

---

## Original v1 critique (preserved for reference)

Based on reviewing v1 prototypes against fresh inspiration from Dribbble (freud, Nixtio, UI8, Awsmd), Daylio, Wysa, Calm, Linear, Arc and editorial dark-mode SaaS patterns.

---

## What's working in v1 ✅

1. **The palette is distinctive.** Sage/peach/lavender on deep ink stands apart from the brown-gold "AI slop" cliché.
2. **Fraunces + Inter pairing** immediately signals editorial quality — this is the single biggest "premium" lever.
3. **Glass cards with backdrop blur** read as modern without being trendy.
4. **Ring-progress gauge** (conic-gradient) on Solace Score is clean and easy to port.
5. **Warm off-white text** (`#F5F1EA`) instead of pure white reduces glare and feels human.
6. **Tab bar as a floating pill** vs. edge-to-edge is the right call for this palette.

---

## Problems & fixes 🔧

### P0 — Visual hierarchy

**Issue:** Every card uses the same glass treatment. Scanning the Home Dashboard, the eye doesn't know where to land first — Solace Score card and AI Therapy card fight for attention.

**Fix:**
- **One "hero" surface per screen** gets a strong treatment (gradient border, larger padding, or colored backdrop). Everything else uses plain `glass`.
- Use **size × spacing** as the hierarchy system, not color intensity.
- Add a clear baseline — `.card-hero` (large, accented), `.card` (default glass), `.card-compact` (metric tiles). Only three.

### P0 — Typography contrast needs more range

**Issue:** v1 jumps from `font-display text-3xl` to `text-xs` with nothing in between. The rhythm is too stepped.

**Fix:** Adopt a tighter type scale:
```
Display XL    52 / 1.05  Fraunces 300 italic → hero moments only (welcome, splash)
Display L     36 / 1.1   Fraunces 400 → screen titles
Display M     24 / 1.2   Fraunces 500 → section headings
Body L        17 / 1.5   Inter 400 → primary body
Body M        14 / 1.5   Inter 400 → default body
Body S        12 / 1.4   Inter 500 → captions, metadata
Mono M        14 / 1     JetBrains Mono → numerical data
Label         10 / 1     Inter 500, tracked 0.15em, uppercase → section labels
```

Use **at most 3 sizes per screen**. A common mistake in v1 is using 5+ text sizes on the home dashboard.

### P1 — Missing microinteractions in stills

**Issue:** Static prototypes but no indication of motion/state. Buttons look the same pressed/unpressed.

**Fix:** Add CSS-level state demos:
- `.button-primary:hover { transform: scale(0.98); opacity: 0.95; }`
- Pressed state with subtle inner shadow
- Indicate animated props in comments (e.g., `{/* Animates: y:0→-2, opacity:0→1, 200ms */}`)

### P1 — Mood face is an icon, not a character

**Issue:** v1 uses `lucide:smile` as the mood — feels abstract. Daylio, Wysa, Calm all use **custom illustrated mood characters** because they create emotional attachment.

**Fix:** Build 5 minimalist mood illustrations with a consistent visual language — even if they're just SVG shapes (gradient circle with line-art features). This is a **key brand asset** and pays off compounding interest.

```
Level 5 — Overjoyed:   bright peach gradient, wide curved smile
Level 4 — Content:     sage gradient, gentle upward curve
Level 3 — Neutral:     muted warm gradient, horizontal line
Level 2 — Down:        lavender gradient, slight downward
Level 1 — Struggling:  deep lavender + gray, closed eyes, drop
```

### P1 — Assessment question screen is functional but cold

**Issue:** Just a progress ring + radio cards. No sense that this is a human conversation.

**Fix:**
- Add a **small AI avatar/chip above the question** — makes it feel like Solace is asking, not a form
- Show the previous answer as a small chip ("you said: Neutral earlier")
- Smoother transitions between questions (implied with direction arrows)

### P2 — Home dashboard is metric-heavy, not emotional

**Issue:** The hero is a number (72/100). That's useful but cold. Headspace opens with "How are you today?" — emotional check-in first.

**Fix:** Add a **daily greeting card** above the Solace Score:
```
"How are you right now?"
[5 mood buttons inline, tappable]
```
Tapping jumps to the full mood logger. This makes the app feel like a companion, not a fitness tracker.

### P2 — Chat message design could be warmer

**Issue:** User bubble is a solid sage gradient — fine but a bit corporate. AI bubble is glass — fine.

**Fix:**
- Replace the solid user bubble with a **subtle peach gradient** (`linear-gradient(135deg, #F4A77E, #E88B5A)`) with dark text — warmer, still brand-consistent
- Add **reaction chips** on AI messages ("this helped" / "not quite") for training signal
- AI messages that trigger an action (breathing exercise) should have a **larger, more prominent card** rather than inline button

### P2 — Sleep screen lacks the hero moment

**Issue:** The duration card is fine but the screen feels like a dashboard, not a rest-oriented space.

**Fix:**
- Top third should feel like **night sky** — darker, with subtle star texture or gradient
- Sleep stages bar should **animate in** (we can indicate with dotted arrows)
- Add a "bedtime reminder" subtle ambient card: *"You usually sleep well when you're in bed by 10:45 PM"*

### P3 — No "signature" visual element

**Issue:** v1 is tasteful but doesn't have a single element someone would screenshot and share. Calm has the orange sun. Headspace has the orange blob. Linear has precise geometry.

**Fix:** Commit to the **breathing orb** as the brand signature. It already exists on the Welcome and Breathing screens. Pull it into:
- Splash screen (pulsing once, then settles)
- Home dashboard (tiny version in the AI therapy card as a live "heartbeat")
- Loading states (instead of spinners)
- Empty states (instead of illustrations)

It becomes a recognizable mark that says "Solace."

---

## Screens missing from v1 (building in Phase 4)

v1 only covered 12 screens. The full app has ~40 screen categories. Missing:

### Auth & Onboarding (add 4)
- **Splash / launch** (signature breathing orb, logo settling)
- **Quote splash** (Maya Angelou-style editorial quote while loading)
- **Profile setup wizard** (multi-step: name → DoB → gender → goals)
- **Goals picker** ("What would you like to work on?" — multi-select chips)
- **Biometric setup** (Face ID / fingerprint)
- **Permission primer** (notifications, health, camera — one card each)

### Assessment (add 2)
- **Assessment intro** (shield icon, "14 questions, 5 min, private")
- **Assessment results** (score ring, breakdown bars, recommendations, next action)

### Main experience (add 3)
- **Notifications inbox** (grouped by day, unread indicators)
- **Search** (recent + suggestions + live results)
- **Daily check-in** (5-mood quick log, optional note)

### Mood (add 3)
- **Mood history calendar** (month view, heatmap dots)
- **Mood log (full screen)** (big mood dial + intensity + activity + note)
- **Mood insights** (AI-generated patterns, correlations with sleep/weather)

### Chat (add 3)
- **Chat list / sessions history** (conversation cards with mood)
- **Voice session active** (waveform, pulse, stop button)
- **Session summary** (post-chat: what we discussed, techniques used, next step)

### Journal (add 3)
- **Entry composer** (rich text with mood tag, writing prompts)
- **Entry detail view** (full read, edit, delete)
- **Journal prompts library** ("Tell me about a time…")

### Mindfulness / Breathing (add 3)
- **Exercise library** (grid of sessions by duration, type, teacher)
- **Session player** (hero art, play controls, progress, timer)
- **Session complete** (celebration, stats, "log mood now?")

### Therapy / CBT (add 2)
- **Therapy session plan** (current module, progress, homework)
- **CBT thought record** (situation → thought → emotion → reframe)

### Sleep (add 2)
- **Sleep log entry** (bedtime/wake time dial, quality slider)
- **Sleep sounds / soundscapes** (list of ambient audio)

### Profile & settings (add 4)
- **Personal information edit**
- **Notification preferences**
- **Privacy & security**
- **Paywall / subscription** (plans, feature list, free trial CTA)

### System states (add 4)
- **Loading skeleton** (home dashboard shimmering)
- **Empty state** (journal with no entries)
- **Network error** (offline banner + retry)
- **404 / not found**

**Total new screens:** ~33

---

## Improved design tokens for v2

```ts
// Extending v1 tokens
export const tokens = {
  // Color adjustments
  sage: { ...v1.sage, 500: '#7AAA94' }, // slightly darker, more grounded
  peach: { ...v1.peach, 300: '#F0996B' }, // warmer, less orange

  // NEW semantic accents
  dusk: '#2D3748',       // between ink-700 and ink-600
  moonlight: '#E8E4DB',  // for sleep screen hero text
  ember: '#D97757',      // for crisis/urgent moments
  mist: '#BFCFD8',       // for watery/breathing elements

  // Gradient presets (re-usable)
  gradients: {
    dawn:    'linear-gradient(135deg, #F4A77E 0%, #E88B5A 100%)',
    meadow:  'linear-gradient(135deg, #9BC4B0 0%, #7AAA94 100%)',
    dusk:    'linear-gradient(135deg, #A89AE0 0%, #6B5BA8 100%)',
    night:   'linear-gradient(180deg, #1B2236 0%, #0A0E1A 100%)',
    aurora:  'linear-gradient(135deg, #9BC4B0 0%, #A89AE0 50%, #F4A77E 100%)',
    // Used for: aurora = hero welcome, meadow = primary CTA, dusk = mindfulness,
    //          dawn = energy CTA (FAB), night = sleep screens
  },

  // Elevation system (not shadows — use brightness)
  surfaces: {
    base:     '#0A0E1A',   // page background
    raised:   '#131826',   // cards (+3% L)
    overlay:  '#1B2236',   // modals (+6% L)
    inset:    '#060912',   // inputs, wells (-3% L)
  },

  // Typography scale (tightened)
  text: {
    displayXL: { size: 52, leading: 1.05, weight: 300, font: 'Fraunces', style: 'italic' },
    displayL:  { size: 36, leading: 1.10, weight: 400, font: 'Fraunces' },
    displayM:  { size: 24, leading: 1.20, weight: 500, font: 'Fraunces' },
    bodyL:     { size: 17, leading: 1.50, weight: 400, font: 'Inter' },
    bodyM:     { size: 14, leading: 1.50, weight: 400, font: 'Inter' },
    bodyS:     { size: 12, leading: 1.40, weight: 500, font: 'Inter' },
    mono:      { size: 14, leading: 1.00, weight: 400, font: 'JetBrains Mono' },
    label:     { size: 10, leading: 1.00, weight: 500, font: 'Inter', tracking: 0.15, case: 'upper' },
  },

  // Motion
  motion: {
    instant: '100ms cubic-bezier(0.4, 0, 1, 1)',
    fast:    '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal:  '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow:    '500ms cubic-bezier(0.4, 0, 0.2, 1)',
    breathe: '4000ms cubic-bezier(0.4, 0, 0.2, 1) infinite alternate',
    spring:  '400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },

  // Radius
  radius: {
    sm: 8,   // inputs, small chips
    md: 14,  // cards
    lg: 22,  // hero cards
    xl: 32,  // sheets, modals
    pill: 999,
  },
};
```

---

## Priority for v2 build

Building in this order so the most impactful screens come first:

**Tier 1 — Brand moments (do first):**
1. Splash with breathing orb signature
2. Welcome (polish v1)
3. Home dashboard (add daily check-in, rework hierarchy)
4. Chat (warmer bubbles, action cards)

**Tier 2 — Core loops:**
5. Mood log full-screen (with dial)
6. Mood history calendar (heatmap)
7. Journal entry composer
8. Breathing session player (polish v1)
9. Assessment results (new)

**Tier 3 — Completion (every route the user hits):**
10-40+. All the remaining screens listed above

This suggestions document is the north star for the v2 build — Phase 4.
