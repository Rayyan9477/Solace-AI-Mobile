# Solace AI — Screen Catalog & Implementation Guide

Every screen in the prototype, with design notes, key components, and implementation instructions for the React Native build.

**42 screens** across **11 sections**. Each entry includes:
- Screenshot path (in `exports/screens/`)
- Source file (in `screens/`)
- Design intent — *why* the screen looks the way it does
- Key components to build
- Accessibility requirements
- Theme-aware elements (things that must react to color scheme changes)

---

## Section 01 — Auth & Onboarding

### 01. Welcome
- **Screenshot:** `exports/screens/phone-01-welcome.png`
- **Source:** `screens/01-welcome.js`
- **Intent:** First impression — establish brand voice (Fraunces italic), show the breathing orb signature, build trust immediately (HIPAA, encryption, 4.8 rating).
- **Key components:**
  - Solace logo mark (rounded-2xl gradient square with white dot center)
  - Breathing orb background (layered: sage + peach + lavender + aurora blobs)
  - `[ BRACKET LABEL ]` kicker above headline
  - Gradient text on "quiet within" (warm-50 → mist → aurora)
  - Trust row with shield + lock + star icons
  - Primary CTA (`btn-primary` — warm white gradient with inner highlight)
- **Accessibility:** Trust row icons have descriptive text, CTA is 48px tall, decorative orbs are `aria-hidden`
- **Theme-aware:** Background orbs use `--ch-sage`, `--ch-aurora`, `--ch-lavender`, `--ch-peach` channels

### 02. Sign in
- **Screenshot:** `exports/screens/phone-02-sign-in.png`
- **Source:** `screens/02-signin.js`
- **Intent:** Returning user flow — minimal friction. Glass form fields, social providers, remember-me.
- **Key components:**
  - Glass form inputs with icon prefix (mail, lock)
  - Inline "Forgot?" link (right-aligned above password field)
  - Remember-me checkbox (pre-checked)
  - `btn-sage` primary submit
  - `[ OR ]` bracket divider
  - 3-column social grid (Apple, Google inline SVG, GitHub inline SVG)
- **Accessibility:** `<label for>` on all inputs, `autocomplete` attributes, social buttons have `aria-label`, password toggle is 44px
- **Theme-aware:** Glass backgrounds, bracket labels, body background gradient

### 03. Onboarding
- **Screenshot:** `exports/screens/phone-03-onboarding.png`
- **Source:** `screens/03-onboarding.js`
- **Intent:** Step 1 of 4. Show the AI's personality with concentric ring illustration. Spark curiosity.
- **Key components:**
  - Concentric ring illustration (4 rings: aurora/8 → aurora/12 → sage/15 → sage/20 + inner gradient circle with sparkles icon)
  - Smoke + breath-orb ambient blobs
  - 4-step progress bar (active = aurora-300)
  - `[ 01 / 04 — PERSONALIZED AI ]` bracket kicker
  - Fraunces italic headline: "Therapy that *learns you.*"
  - Back/Next pair (text vs peach FAB)
- **Accessibility:** Progress bar has `role="progressbar"` with `aria-valuenow`, Skip button on illustration area
- **Theme-aware:** Ring borders, smoke blob, progress bar color

### 04. Assessment question
- **Screenshot:** `exports/screens/phone-04-assessment.png`
- **Source:** `screens/04-assessment.js`
- **Intent:** Question 4 of 14. Low-pressure, one question at a time, with context from previous answer.
- **Key components:**
  - Progress ring (conic-gradient, 29%)
  - "Solace is listening" chip (sparkles icon)
  - Previous-answer context chip ("Earlier you said: Neutral")
  - 4 radio option cards (icon + label + description + radio circle)
  - Selected state: sage background/border, filled radio with checkmark
  - Sticky bottom CTA with gradient fade
- **Accessibility:** `role="radiogroup"`, each option is `role="radio"` with `aria-checked`, 72px min-height per option
- **Theme-aware:** Ring progress gradient, selected state color, background mesh

---

## Section 02 — Main Experience

### 05. Home dashboard
- **Screenshot:** `exports/screens/phone-05-home-dashboard.png`
- **Source:** `screens/05-home.js`
- **Intent:** The hero screen. Show score + metrics + AI continuation + content — information-dense but not overwhelming.
- **Key components:**
  - `[ TUESDAY, APRIL 9 ]` date bracket + notification bell with red dot
  - Fraunces greeting: "Good morning, *Rayyan.*"
  - Solace Score hero card (`glass-aurora` + `hero-card` border) — 72/100 + ring progress + "+5 from last week" trend + aurora hairline divider + AI suggestion text
  - 2×2 metric grid (Sleep/Mindful/Stress/Streak) — each with icon + tracking label + display number + stat-bar or streak dots
  - AI continue CTA (gradient border card with breathing orb, sparkles avatar, session preview text)
  - "For you today" horizontal scroll carousel (3 article cards with gradient thumbnail + chip tag + title + reading time)
  - Tab bar with active "Home" dot indicator
- **Accessibility:** Score card has `aria-labelledby`, metrics are `role="group"`, articles are `role="list"`, bell has `aria-label` with unread count
- **Theme-aware:** Hero card aurora tint, stat-bar gradient, breathing orb, article thumbnails, mesh background

### 06. Mood tracker
- **Screenshot:** `exports/screens/phone-06-mood-tracker.png`
- **Source:** `screens/06-mood.js`
- **Intent:** Weekly mood at a glance. Today's mood hero + 7-day bar chart + AI insights.
- **Key components:**
  - Today's mood hero card (glass-strong with breath-orb) — "Content" in Fraunces italic 44px + custom SVG face illustration + trend indicator
  - 7-day bar chart (flex column bars with explicit 128px container height, today highlighted solid)
  - 3 insight cards (icon tile + title + description) — AI-analyzed label
  - Peach FAB for logging new mood
- **Accessibility:** Chart is `role="img"` with descriptive `aria-label`, insights are `<ul>` list items
- **Theme-aware:** Mood face gradient, chart bar colors, insight icon backgrounds

### 07. AI chat
- **Screenshot:** `exports/screens/phone-07-ai-chat.png`
- **Source:** `screens/07-chat.js`
- **Intent:** Active therapy session. Show conversation flow, in-chat actions, CBT mode indicator.
- **Key components:**
  - Header: Solace avatar (gradient) with online dot, "Always here · CBT mode", phone + more buttons
  - Message bubbles: AI = glass with rounded-tl-sm, User = peach gradient with shadow
  - "rumination" keyword highlight (sage-300 text)
  - Reaction chips ("This helped" / "Not quite")
  - Embedded action card (glass-aurora breathing exercise with play button)
  - Typing indicator (3 pulsing dots)
  - Input bar: glass rounded-full with attach + text + mic + send buttons
- **Accessibility:** Messages area is `role="log" aria-live="polite"`, typing indicator has `aria-label`, input has `<label>`, all icon buttons 44px
- **Theme-aware:** AI avatar gradient, user bubble gradient, action card aurora tint

### 08. Journal
- **Screenshot:** `exports/screens/phone-08-journal.png`
- **Source:** `screens/08-journal.js`
- **Intent:** Writing as therapy. Show trend, recent entries, encourage daily habit.
- **Key components:**
  - Mood-from-writing SVG line chart (gradient fill + gradient stroke: sage→aurora, pulsing endpoint dot)
  - AI badge chip on chart card
  - Recent entries list — each with colored left-edge bar (1px rounded-r), bracket date, mood tag, Fraunces title, preview text
  - Streak indicator (flame icon + "23-day streak")
  - Peach FAB (pen-line icon)
- **Accessibility:** Chart is `<figure>` with `<figcaption>`, entries are `<ul>` with `<li>` buttons
- **Theme-aware:** Line chart gradient, entry side-bar colors, breath-orb on chart card

### 09. Profile
- **Screenshot:** `exports/screens/phone-09-profile.png`
- **Source:** `screens/09-profile.js`
- **Intent:** Identity + stats + settings access. Clean, grouped, scannable.
- **Key components:**
  - Avatar ring (gradient sage→aurora→peach with aurora glow shadow)
  - 3-up stats row (Streak/Sessions/Mindful) — bracket labels
  - Settings sections (Account + Support) — glass card with dividers, icon tiles, chevrons
  - Badge indicators (notification count, language value)
  - Sign out button (peach text, danger style)
  - Version string in monospace
- **Accessibility:** Stats are `role="group"`, settings sections have `aria-labelledby`, camera button is 44px
- **Theme-aware:** Avatar gradient ring, icon tile backgrounds

---

## Section 03 — Wellness Features

### 10. Breathing exercise
- **Screenshot:** `exports/screens/phone-10-breathing.png`
- **Source:** `screens/10-breathing.js`
- **Intent:** Immersive, distraction-free. The screen IS the exercise — orb + counter + nothing else.
- **Key components:**
  - Full-screen mesh-bg with layered smoke + breath-orb
  - 4 concentric rings (aurora/18 → sage/22 → sage/32 → inner radial orb with glow shadow)
  - "Breathe in" text centered in the orb (Fraunces italic)
  - Monospace counter: `04` at 64px + `[ SECONDS ]` bracket label
  - Cycle progress dots (8 dots, 3 filled)
  - Remaining time: `2:45 remaining`
  - 3 control buttons (restart/pause/settings) — pause is btn-primary 68px
- **Accessibility:** Orb illustration has `aria-label`, counter is `aria-live="polite"`, cycle dots have `role="progressbar"`, all controls 52px+
- **Theme-aware:** All orbs and smoke use CSS channel vars, ring borders

### 11. Sleep dashboard
- **Screenshot:** `exports/screens/phone-11-sleep.png`
- **Source:** `screens/11-sleep.js`
- **Intent:** Night sky atmosphere. Hero duration + quality + stages + history.
- **Key components:**
  - Night gradient background (midnight-700 → midnight-800 → midnight-950)
  - Scattered star dots (24 random positions, varying sizes)
  - Hero card: `7h 48m` at 64px Fraunces + Quality 86% chip + time range monospace
  - Sleep stages bar (4-segment gradient: lavender/sage/peach/warm)
  - Stage breakdown grid (4 columns: dot + bracket label + mono value)
  - AI insight card (glass-aurora with sparkles)
  - 7-day history bars (96px height, lavender gradient, today = solid)
  - "Log tonight's sleep" btn-primary
- **Accessibility:** Stages bar is `role="img"` with per-segment labels, history is `role="img"`, all buttons 48px
- **Theme-aware:** Star colors, stage bar gradients, bar chart tones

### 12. Crisis support
- **Screenshot:** `exports/screens/phone-12-crisis-support.png`
- **Source:** `screens/12-crisis.js`
- **Intent:** Warm, never alarming. Immediate action (call/text), always available, non-judgmental AI fallback.
- **Key components:**
  - Warm plum gradient background (NOT red/alarming)
  - Soft peach halo around heart-handshake icon (blur 42px)
  - `[ YOU ARE NOT ALONE ]` bracket label in peach
  - 3 resource cards: Call 988 (peach hero-card with phone FAB), Text HOME (sage), International (aurora)
  - "Or talk to Solace" fallback card with AI avatar
  - "I'm okay, dismiss" text button at bottom
- **Accessibility:** Call 988 is an `<a href="tel:988">` (real link), all cards are 76px min-height, dismiss has adequate touch target
- **Theme-aware:** Peach halo gradient, card borders

---

## Section 04 — Brand Moments

### 13. Splash
- **Screenshot:** `exports/screens/phone-13-splash.png`
- **Source:** `screens/13-splash.js`
- **Intent:** 2-3 second brand moment. The breathing orb IS the logo.
- **Key components:** 5 concentric rings + central breath-orb + Solace wordmark + bracket tagline + version label
- **Theme-aware:** All rings and orb use channel vars

### 14. Quote splash
- **Screenshot:** `exports/screens/phone-14-quote-splash.png`
- **Source:** `screens/14-quote.js`
- **Intent:** Editorial loading moment. A curated quote while the app prepares.
- **Key components:** Anne Lamott quote in Fraunces italic, reversed quote icon, bracket author attribution, gradient progress bar loader, "Preparing your space" label
- **Theme-aware:** Background mesh, progress bar gradient

---

## Section 05 — Onboarding Plus

### 15. Goals picker
- **Screenshot:** `exports/screens/phone-15-goals-picker.png`
- **Source:** `screens/15-goals.js`
- **Key components:** 2×4 multi-select grid with accent-colored per-goal styling (each goal has its own hue), selected state with checkmark, "3 selected" count, sticky peach CTA

### 16. Face ID primer
- **Screenshot:** `exports/screens/phone-16-face-id-primer.png`
- **Source:** `screens/16-biometric.js`
- **Key components:** Scan frame illustration (dashed inner border + scan-face icon), "Optional · 2 seconds" chip, privacy-focused copy, primary + skip pair

### 17. Notification primer
- **Screenshot:** `exports/screens/phone-17-notifications-primer.png`
- **Source:** `screens/17-notif-primer.js`
- **Key components:** 3 stacked notification cards (parallax depth), "Gentle · You're in control" messaging, sage CTA + "Not now" secondary

### 18. Assessment intro
- **Screenshot:** `exports/screens/phone-18-assessment-intro.png`
- **Source:** `screens/18-assessment-intro.js`
- **Key components:** Shield-check icon with gradient glow, 3 metadata chips (5-7 min / Private / 14 questions), sage CTA, "Learn how we protect your data" link

### 19. Assessment results
- **Screenshot:** `exports/screens/phone-19-assessment-results.png`
- **Source:** `screens/19-assessment-results.js`
- **Key components:** Large SVG score ring (68/100, gradient stroke sage→aurora→lavender), 4 breakdown progress bars (each with hue-specific gradient), 3 recommendation rows, medical disclaimer, sage CTA

---

## Section 06 — Daily Loop

### 20. Home v2 (with check-in)
- **Screenshot:** `exports/screens/phone-20-home-v2-check-in.png`
- **Source:** `screens/20-home-v2.js`
- **Key components:** "How are you right now?" hero card (glass-aurora) with 5 moodFace radio buttons, compact Solace/Streak tiles, AI continue CTA with orb, practice carousel (3 cards)
- **Accessibility:** Mood faces are `role="radio"` with `aria-label` per level

### 21. Daily check-in
- **Screenshot:** `exports/screens/phone-21-daily-check-in.png`
- **Source:** `screens/21-checkin.js`
- **Key components:** Big moodFace (130px) inside breath-orb halo, "Content" label, 5-level mood radio row (40px faces), 8 influence tag chips (Work/Family/Sleep/Exercise/Food/Weather/Social/Alone), sage "Log this mood" CTA

### 22. Mood calendar
- **Screenshot:** `exports/screens/phone-22-mood-calendar.png`
- **Source:** `screens/22-mood-calendar.js`
- **Key components:** 7×5 month grid heatmap (5 mood colors, today ring highlight), legend strip (5 color squares + labels), month summary insight card

### 23. Mood insights
- **Screenshot:** `exports/screens/phone-23-mood-insights.png`
- **Source:** `screens/23-mood-insights.js`
- **Key components:** Hero pattern card ("You feel calmer after 7+ hours of sleep"), SVG scatter plot (Mood × Sleep, 12 dots color-coded by mood level, dashed trend line), 3 supporting insight cards

---

## Section 07 — AI Therapy

### 24. Conversations list
- **Screenshot:** `exports/screens/phone-24-conversations-list.png`
- **Source:** `screens/24-chat-list.js`
- **Key components:** All/Active/Archived pill tabs, 5 conversation cards (colored side bar + sparkles icon tile + title + preview + tag + msg count + time), unread dot, peach FAB

### 25. Voice session
- **Screenshot:** `exports/screens/phone-25-voice-session.png`
- **Source:** `screens/25-voice.js`
- **Key components:** Pulsing avatar (136px, double ring + outer breath-orb), "I'm listening..." Fraunces italic, gradient waveform (34 bars), 3 controls (keyboard/pause/done)

### 26. Session summary
- **Screenshot:** `exports/screens/phone-26-session-summary.png`
- **Source:** `screens/26-session-summary.js`
- **Key components:** Success ring (checkmark + 3 sparkle decorations), topic summary card with tag chips, techniques used list, "small action for today" peach card with schedule reminder CTA

### 27. CBT thought record
- **Screenshot:** `exports/screens/phone-27-cbt-thought-record.png`
- **Source:** `screens/27-cbt.js`
- **Key components:** 5-step progress stepper (Situation→Thought→Emotion→Reframe→Action), previous answer context card, current question hero card (peach border), textarea, cognitive distortion chips (Catastrophizing, Mind reading selected)

---

## Section 08 — Journal

### 28. Journal composer
- **Screenshot:** `exports/screens/phone-28-journal-composer.png`
- **Source:** `screens/28-journal-composer.js`
- **Key components:** Mood strip (5 faces as radio group), date+weather metadata, title input, writing prompt card (lightbulb icon, peach border, dismissible), rich text body, hashtag chips, formatting toolbar (bold/italic/list/image/mic) + word count

### 29. Journal detail
- **Screenshot:** `exports/screens/phone-29-journal-detail.png`
- **Source:** `screens/29-journal-detail.js`
- **Key components:** Mood face + bracket label + read time, Fraunces title, body text with em-dash list items, "Solace noticed" AI insight card (sage gradient border), hashtag chips, metadata footer (word count, heart rate, weather)

---

## Section 09 — Mindfulness & Sleep

### 30. Mindfulness library
- **Screenshot:** `exports/screens/phone-30-mindfulness-library.png`
- **Source:** `screens/30-mindful-library.js`
- **Key components:** Featured hero card (gradient sage→aurora→lavender, play button, "Monday reset meditation"), 7 category filter chips, 2×3 practice grid (each with hue glow, icon tile, title, monospace duration)

### 31. Meditation player
- **Screenshot:** `exports/screens/phone-31-meditation-player.png`
- **Source:** `screens/31-mindful-player.js`
- **Key components:** 60×60 cosmic artwork (gradient with blobs), bracket "MEDITATION · SARAH KIM" label, progress bar (sage→aurora gradient), 5-button transport (shuffle/back/play-pause/forward/repeat), 4 bottom actions (Rain/Favorite/Download/Share, all 44px)

### 32. Session complete
- **Screenshot:** `exports/screens/phone-32-session-complete.png`
- **Source:** `screens/32-session-complete.js`
- **Key components:** Celebration ring (double outer rings + gradient inner checkmark + 3 sparkle decorations), "That's 10 minutes for yourself" headline, 3 stat tiles (Total min/Streak/Mood points), "How do you feel now?" CTA

### 33. Sleep log entry
- **Screenshot:** `exports/screens/phone-33-sleep-log-entry.png`
- **Source:** `screens/33-sleep-log.js`
- **Key components:** Night sky background with scattered stars, bedtime/woke-up time cards (monospace), "7h 48m" hero duration, quality slider (lavender→sage gradient, white thumb), 6 feeling tags (Rested, Groggy, Anxious, Energized, Sore, Refreshed)

### 34. Soundscapes
- **Screenshot:** `exports/screens/phone-34-soundscapes.png`
- **Source:** `screens/34-soundscapes.js`
- **Key components:** Now-playing mini card (waveform thumbnail, pause button), 2×3 gradient tile grid (Rain, Ocean, Forest, Noise, Fire, Bowl — each with unique gradient + icon), active ring highlight

---

## Section 10 — System

### 35. Notifications inbox
- **Screenshot:** `exports/screens/phone-35-notifications-inbox.png`
- **Source:** `screens/35-notifications.js`
- **Key components:** "3 new" highlighted count, 4 filter pills (All/Insights/Reminders/Achievements), grouped Today/Yesterday/Earlier sections, unread dots, icon tiles with hue-specific backgrounds

### 36. Search
- **Screenshot:** `exports/screens/phone-36-search.png`
- **Source:** `screens/36-search.js`
- **Key components:** Glass search bar (aurora border highlight), "24 results" bracket counter, 5 category tabs with counts, search result sections (Practices/Journal/Articles), `<mark>` highlighted query matches, colored side-bar on journal results

### 37. Account settings
- **Screenshot:** `exports/screens/phone-37-account-settings.png`
- **Source:** `screens/37-account-settings.js`
- **Key components:** Profile card (avatar ring + email monospace + Plus badge chip), 3 settings sections (Account/Preferences/Privacy), Face ID toggle switch, "Delete account" danger row, sign out, version monospace

### 38. Paywall
- **Screenshot:** `exports/screens/phone-38-paywall.png`
- **Source:** `screens/38-paywall.js`
- **Key components:** Solace Plus icon with aurora glow halo, 5 feature rows (infinity/library/trending/moon/download), annual plan card (selected, sage border, SAVE 60% peach badge), monthly plan card, 7-day trial peach CTA, Terms/Privacy/Restore footer

---

## Section 11 — States

### 39. Loading skeleton
- **Screenshot:** `exports/screens/phone-39-loading-skeleton.png`
- **Source:** `screens/39-loading.js`
- **Key components:** Shimmer animation (`@keyframes shimmer` — 800px gradient slide, 1.6s linear infinite), skeleton shapes mirroring Home layout, breathing orb loader centered at bottom, "Preparing your space" bracket label

### 40. Empty state
- **Screenshot:** `exports/screens/phone-40-empty-state.png`
- **Source:** `screens/40-empty.js`
- **Key components:** Concentric ring illustration with book-open icon center + sparkle decorations, "Your story begins here" headline, 3 writing prompt suggestion cards (pen-line icon + text + chevron), "Write freely" peach CTA

### 41. Offline state
- **Screenshot:** `exports/screens/phone-41-offline-state.png`
- **Source:** `screens/41-offline.js`
- **Key components:** Dashed-border circle with wifi-off icon, friendly copy (not error language), "Try again" btn-primary, "Continue offline" text link, "Still available offline" chip row (Journal/Breathing/Sounds)

### 42. 404 Not found
- **Screenshot:** `exports/screens/phone-42-404-not-found.png`
- **Source:** `screens/42-not-found.js`
- **Key components:** Giant editorial "404" (140px, 8% opacity, tracking-tighter), breathing orb layered behind the number, "Let's get you *back to calm.*" headline, sage "Back home" CTA

---

## Theme System

All 42 screens support dynamic theme switching via CSS custom properties. The 5 presets are:

| Theme | Background | Accent | Sage | Character |
|---|---|---|---|---|
| **Cosmic Night** (default) | `#040818` | `#6B8FFF` | `#9BC4B0` | Deep midnight blue, aurora glow |
| **Warm Earth** | `#0F0B08` | `#D4915E` | `#8BA67A` | Walnut brown, terracotta, olive |
| **Ocean Calm** | `#030D14` | `#5BB8C9` | `#6EC5A8` | Deep sea, teal, seafoam |
| **Deep Forest** | `#040E08` | `#D4A545` | `#68B088` | Emerald, warm amber |
| **Soft Rose** | `#0E0610` | `#D4789A` | `#B8909A` | Plum, dusty rose, gold |

Theme switching works by overriding `--mn-*`, `--aurora-*`, `--sage-*`, `--peach-*`, `--lavender-*`, `--warm-*`, and `--ch-*` channel variables on `document.documentElement`. Persisted in `localStorage`.

**For React Native implementation:** map these presets to a `ThemeContext` that provides the active palette object to all components.

---

## Implementation Priority

Recommended build order for React Native:

1. **Home v2** (screen 20) — sets the emotional tone
2. **Daily check-in** (screen 21) — core daily ritual
3. **AI chat** (screen 07) — the therapy engine
4. **Mindful player** (screen 31) — immersive moment
5. **Assessment results** (screen 19) — first value delivery
6. **Journal composer** (screen 28) — self-reflection
7. **Sleep log** (screen 33) — health tracking
8. **Paywall** (screen 38) — revenue

These 8 screens cover the golden path. Remaining screens can be built in any order once the foundation is set.
