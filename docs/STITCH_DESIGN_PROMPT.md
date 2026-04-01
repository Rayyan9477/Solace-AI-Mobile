# Solace AI Mobile - Complete Google Stitch Design Prompt

## Instructions
Copy each batch into Google Stitch (stitch.withgoogle.com) with "App" mode selected.
Generate in batches of 5-6 screens. Wait for each batch to complete before starting the next.

---

## DESIGN SYSTEM (include at the top of every batch)

```
DESIGN SYSTEM FOR ALL SCREENS:
App name: "Solace AI" - a premium AI mental health companion

COLOR PALETTE (Deep Indigo + Sage + Warm Coral):
- Background base: #0F1219 (deep blue-black, NOT brown)
- Background raised: #171C28 (card surfaces, slightly lighter)
- Background overlay: #1E2436 (modals, elevated panels)
- Background inset: #0A0D14 (inputs, wells, sunken areas)
- Primary accent: #7C9A92 (muted sage green - calming, therapeutic)
- Secondary accent: #E8826A (warm coral - CTAs, energy, warmth)
- Tertiary accent: #8B7EC8 (soft lavender - mindfulness, contemplation)
- Text primary: #EDF2F7 (warm off-white, not pure white)
- Text secondary: #8B95A5 (cool gray, 6:1 contrast on base)
- Text muted: #5A6478 (subtle labels, 4.5:1 on base)
- Border: rgba(255,255,255,0.08) (subtle separation)
- Border focus: #7C9A92 (sage accent ring)
- Success: #4ADE80 (fresh green)
- Warning: #FBBF24 (warm amber)
- Error: #F87171 (soft red)
- Crisis: #FDA4AF (rose pink - urgent but not alarming)

TYPOGRAPHY: Inter font family. Headings: semibold 600. Body: regular 400.
RADIUS: 14px cards, 24px pill buttons, 8px inputs
ICONS: Outline-style minimalist vector icons only. No emoji. Consistent 2px stroke.
CARDS: Frosted glass/glassmorphism - semi-transparent with subtle white border and backdrop blur
DEPTH: Layered surfaces (base < raised < overlay) - NOT flat, NOT heavy shadows
AESTHETIC: Think Linear app meets Calm app. Clean, spacious, intentional. Generous whitespace. NOT generic "vibe coded" AI slop. Sophisticated, editorial, restrained.
DEVICE: Mobile 390x844
```

---

## BATCH 1: Auth Flow (6 screens)

```
[PASTE DESIGN SYSTEM ABOVE FIRST, THEN:]

Design 6 mobile screens for the auth flow:

SCREEN 1 - SPLASH:
Minimal. Deep #0F1219 background. Centered: app logo mark - an abstract interlocking shape in sage #7C9A92, simple and geometric (NOT dots, NOT generic). Below: "Solace AI" wordmark in #EDF2F7, letter-spaced, Inter semibold. Subtle radial gradient glow behind logo. Nothing else. Premium, confident, quiet.

SCREEN 2 - WELCOME:
Deep background. Top third: abstract generative art illustration - soft flowing gradient mesh in sage, coral, and lavender tones (organic shapes, NOT concentric circles). Center: "Find your calm." large heading in off-white. Subtitle: "AI-powered mental health support, personalized for you." in gray #8B95A5. Bottom: "Get Started" pill button in coral #E8826A with white text. Small "Already have an account? Sign In" link in sage.

SCREEN 3 - ONBOARDING CAROUSEL (Step 1 of 4):
Top half: sage green tinted illustration area with a clean vector illustration of a person meditating (minimal line art, NOT cartoon). Dot indicator: 4 dots, first filled sage. Bottom half dark: "Personalized AI Therapy" heading. "Evidence-based techniques adapted to your personality and needs." body text in gray. Next arrow button (coral circle, white arrow).

SCREEN 4 - SIGN IN:
Clean form screen. Top: "Welcome back" heading, "Sign in to continue your journey" subtitle in gray. Glassmorphism card containing: Email input (mail icon, dark inset background #0A0D14, sage border on focus), Password input (lock icon, eye toggle). "Sign In" button full width coral #E8826A. Divider: "or continue with". Social row: 3 glass-style circles - Apple logo, Google logo, GitHub logo (minimal, monochrome). "New here? Create account" link. "Forgot password?" link in muted text.

SCREEN 5 - SIGN UP:
Similar to Sign In. "Create your account" heading. "Start your mental wellness journey" subtitle. Inputs: Full name, Email, Password, Confirm password - all with outline icons (person, mail, lock, shield). Password strength bar (segmented: gray > coral > amber > sage/green). "Create Account" coral button. Social signup row. "Already have an account? Sign In" link.

SCREEN 6 - FORGOT PASSWORD:
Back chevron top-left. "Reset password" heading. "Choose how you'd like to reset your password" subtitle. 3 glass cards as radio options: Shield icon + "Two-factor auth", Key icon + "Email link", Lock icon + "Authenticator app". Selected card has sage border glow. "Send Reset Link" coral button at bottom.
```

---

## BATCH 2: Onboarding & Assessment (6 screens)

```
[PASTE DESIGN SYSTEM FIRST, THEN:]

Continue Solace AI app design. 6 onboarding/assessment screens:

SCREEN 7 - PROFILE SETUP:
Header: Back chevron + "Profile Setup" + step indicator "1 of 4". Avatar circle with camera overlay icon. Form fields (inset dark inputs): Full Name (person icon), Date of Birth (calendar icon), Gender (3 pill toggles: Male/Female/Other). Account type selector: 3 minimal cards "Patient | Therapist | Professional". Continue button coral.

SCREEN 8 - PASSWORD & SECURITY:
"Secure your account" heading. Password input with strength meter - animated segmented bar below (red/orange/amber/green segments). Requirement checklist: each item with checkmark (green) or x (muted) icons - "8+ characters", "Uppercase letter", "Number", "Special character". Biometric toggle switch: "Enable Face ID / Fingerprint". Continue button.

SCREEN 9 - OTP VERIFICATION:
"Verify your identity" heading. "Enter the 4-digit code sent to your phone" subtitle. 4 individual digit boxes - focused one has sage border glow, filled ones show dots. Subtle countdown timer "Resend in 0:28". "Verify" coral button. "Didn't receive code? Resend" link in sage.

SCREEN 10 - ASSESSMENT INTRO:
Centered layout. Top: brain/head icon in a sage-tinted circle. "Mental Health Assessment" heading. "14 questions, 5-7 minutes" info chips (glass cards with clipboard icon + timer icon). "Your responses are private and confidential" with shield icon, prominent text (NOT muted). "Start Assessment" coral button. Progress dots at bottom.

SCREEN 11 - ASSESSMENT QUESTION (Radio):
Top bar: circular progress ring (sage fill, shows 29%) + "Question 4 of 14". Question: "How have you been feeling lately?" in large text. 4 option cards (glass cards, full width, stacked): Each has left icon + label + right radio indicator. "Mostly good" (sun icon), "Neutral" (minus-circle icon), "Stressed" (alert icon), "Low mood" (cloud-rain icon). Selected card: sage border, filled radio. Disabled "Continue" button at bottom.

SCREEN 12 - ASSESSMENT RESULTS:
"Assessment Complete" heading centered. Large score ring: animated gradient border (sage to coral based on score), "68" large number centered, "Mental Health Score" label, "Moderate" status badge in amber. Score Breakdown card: 3 horizontal bars - Mood & Emotions (65), Stress Management (72), Lifestyle & Support (67). Recommendations card: 3 bullet items with lightbulb icons. Two buttons: "View Details" glass outline, "Continue" coral filled.
```

---

## BATCH 3: Main Dashboard & Tabs (6 screens)

```
[PASTE DESIGN SYSTEM FIRST, THEN:]

6 main app screens with bottom tab navigation:

SCREEN 13 - HOME DASHBOARD:
Top: "Tue, 1 Apr" small label. Row: avatar with sage ring + "Good morning, Rayyan" + notification bell icon. Search bar (glass, search icon + "Search anything..."). 
HERO CARD: Large glassmorphism card - Solace Score circular gauge (sage gradient ring, "72" centered, "Mentally Stable" label in sage). 
METRIC GRID: 2x3 grid of glass mini-cards: Mood (face icon + "Good"), Mindful (body icon + "2.5 Hrs"), Sleep (moon icon + "85%"), Journal (book icon + "3"), Stress (gauge icon + "2/5"), Streak (flame icon + "7 days"). 
AI SECTION: "AI Therapy" card with coral accent strip, "5 sessions this week" stat, "New Session" button. 
BOTTOM TAB BAR: 5 tabs - Home (filled), Mood, Chat, Journal, Profile. Clean icons, sage active color.

SCREEN 14 - MOOD TRACKER:
Tab: Mood active. NO back button. 
HERO: Gradient header (sage-to-dark, curved bottom). "Mood Tracker" title. Large custom mood illustration (line-art happy face with gradient fill, NOT emoji). "Happy" label.
CONTENT: "This Week" section. 7-day mood bar chart (bars colored by mood: sage=good, amber=neutral, coral=low). Filter button.
FAB: Coral floating action button with "+" icon, bottom-right, elevated shadow.

SCREEN 15 - AI CHAT LIST:
Tab: Chat active. NO back button.
HEADER: "AI Therapy" title, search icon right.
TAB SWITCHER: Pill toggles "Active | Archived".
CONVERSATION LIST: 4 conversation cards - each: left icon (chat bubble with gradient), title "Anxiety Management", preview "Let's work on your breathing...", timestamp "2h ago", unread dot indicator.
EMPTY STATE (if no conversations): Illustration of chat bubbles, "Start your first session" heading, "Begin a conversation with your AI therapist" subtitle, "New Session" coral button.
FAB: Coral "+" button.

SCREEN 16 - ACTIVE CHAT:
Full screen (no tab bar). Header: back chevron, "AI Therapist" title, 3-dot menu. 
Messages: User messages right-aligned (coral background, white text, rounded). AI messages left-aligned (glass card background, sage avatar chip icon). 
AI message includes: "I understand you're feeling anxious. Let's try a grounding exercise together. Can you name 5 things you can see around you?" 
Typing indicator: 3 animated dots in glass card.
Input bar: attach icon, glass input "Type a message...", mic icon, send arrow icon (coral when text entered).

SCREEN 17 - JOURNAL DASHBOARD:
Tab: Journal active. NO back button.
HERO: Lavender-to-dark gradient header, curved bottom. "Journal" title. Large "12" count + "Entries this month".
STATS CARD: Glass card with mini line chart, "Mood Trend" label, legend dots (sage=positive, amber=neutral, coral=negative).
RECENT ENTRIES: Cards with date, mood dot, title preview, word count. 
FAB: Coral "+" button.

SCREEN 18 - PROFILE & SETTINGS:
Tab: Profile active. 
HEADER: Avatar circle (sage ring, camera edit overlay). "Rayyan Ahmed" name. "Premium" badge in lavender. Stats row: 3 columns (Age: 24, Sessions: 15, Streak: 7 days).
METRIC CARDS: 2 cards side-by-side - "Solace Score: 72, Stable" (sage), "Mood: Happy" (coral).
SETTINGS MENU: Glass container with rounded corners. Menu items each with: icon left (outline, sage), label, chevron right. Items: Account, Personal Info, Notifications, Privacy & Security, Linked Devices, Language, Help Center, Feedback, Invite Friends, About. "Sign Out" button at bottom (glass with red text).
```

---

## BATCH 4: Mood, Sleep & Stress Features (6 screens)

```
[PASTE DESIGN SYSTEM FIRST, THEN:]

6 feature screens:

SCREEN 19 - MOOD SELECTOR (Full Screen):
Full screen (no tab bar). Back button. "How are you feeling?" heading.
5 mood options as large tappable cards arranged in a row: each a circle with custom illustrated face (minimal line art, gradient fills matching emotion color - NOT emoji):
- Depressed (muted blue circle)
- Sad (cool gray circle)  
- Neutral (soft amber circle)
- Happy (warm sage circle)
- Overjoyed (bright coral circle)
Selected: enlarged with sage ring highlight and label below.
"Log Mood" coral button at bottom with checkmark icon.

SCREEN 20 - MOOD HISTORY:
Back chevron + "Mood History" + filter funnel icon.
Tab switcher: "History | AI Insights".
Timeline list: entries with date header, mood cards showing time, mood icon, brief note. Biometric data: heart-rate icon + "72 bpm", energy icon + "Medium".
Bottom toolbar: settings gear, coral FAB "+", edit pencil.
EMPTY STATE: "No entries yet" with illustration, "Start tracking your mood" subtitle.

SCREEN 21 - SLEEP DASHBOARD:
Back chevron + "Sleep" title. 
Sleep quality gauge: large circular ring (lavender gradient fill showing 78%).
Metric row: 3 glass cards - "Time in Bed: 7h 32m" (bed icon), "Deep Sleep: 2h 15m" (moon icon), "REM: 1h 48m" (brain icon).
Weekly chart: bar chart showing hours per night, 7 days.
"Log Sleep" coral button.

SCREEN 22 - STRESS DASHBOARD:
Back chevron + "Stress Management" title.
Stress gauge: horizontal scale 1-5 with selected level highlighted (coral for high, sage for low). Current: "Level 3 - Moderate".
STRESSOR BREAKDOWN: Glass card with horizontal bar chart - "Work 45%", "Relationships 25%", "Health 20%", "Finance 10%".
COPING STRATEGIES: 3 cards with technique name + "Start" button (breathing, journaling, meditation).
Weekly trend: small line chart showing stress over 7 days.

SCREEN 23 - BREATHING EXERCISE (Immersive):
Full screen, no chrome. Deep dark background with subtle gradient.
Center: Large breathing circle - pulsing concentric rings that expand/contract. Outer ring lavender at 30% opacity, middle ring sage at 50%, inner ring solid sage.
"Breathe In" instruction text (fades to "Hold" then "Breathe Out").
Timer: "3:45 remaining" in muted text.
Progress bar at very bottom (thin, sage fill).
Minimal controls: Pause (circle with pause icon), Stop (X icon). Both glass-style.

SCREEN 24 - CRISIS SUPPORT:
URGENT OVERLAY on dark scrim. 
Glass card in center with soft red/rose tint border.
Heart icon in rose circle at top.
"We're here for you" heading. "It seems like you might be going through a difficult time. Here are some resources that can help." body text.
Resource cards: "988 Suicide & Crisis Lifeline" (phone icon, tap-to-call), "Crisis Text Line - Text 741741" (message icon), "International Resources" (globe icon).
"I'm okay, dismiss" text link at bottom.
"Talk to someone now" coral button.
```

---

## BATCH 5: Chat Features & Voice (6 screens)

```
[PASTE DESIGN SYSTEM FIRST, THEN:]

6 chat and communication screens:

SCREEN 25 - NEW CONVERSATION:
Back chevron + "New Session" title.
"What would you like to work on?" heading.
Topic cards in a grid: 6 glass cards each with icon + label - "Anxiety" (alert-circle), "Depression" (cloud), "Stress" (activity), "Relationships" (people), "Sleep" (moon), "Self-Growth" (trending-up). Selected card: sage border.
"Communication Style" section: 3 pill buttons "Casual | Supportive | Professional".
Title input: glass field "Name this session..." 
"Start Session" coral button.

SCREEN 26 - VOICE RECORDING:
Full screen dark. Center: large mic icon in pulsing sage circle (recording animation - concentric ripples).
Waveform visualization below mic (horizontal sound wave bars in sage).
Duration: "0:12" elapsed time.
Controls row: Cancel (X in glass circle), Record/Pause (large coral circle), Send (checkmark in glass circle).
"Tap to stop recording" hint text.

SCREEN 27 - EXPRESSION ANALYSIS:
Back chevron + "Expression Analysis" title.
Camera preview area (dark placeholder with face outline guide).
Analysis results card below: "Detected Emotion: Calm" with confidence bar (82%).
Metrics: 4 mini items - "Relaxation" (sage bar), "Focus" (lavender bar), "Energy" (coral bar), "Stress" (amber bar).
"Save Analysis" coral button.

SCREEN 28 - DAILY QUOTE:
Full screen, immersive. Deep background with subtle radial gradient (lavender center glow).
Large quotation mark icon in sage, top.
Quote text: "Every storm runs out of rain." in large italic serif-style text.
Attribution: "— Maya Angelou" in muted text.
Action row: bookmark icon, share icon, heart icon (tappable, sage when saved), refresh icon.
"New Quote" ghost button at bottom.

SCREEN 29 - MONTHLY REPORT:
Back chevron + "March Report" title + share icon.
Overview card: 4 metrics in a row - "Mood: Good" (happy icon), "Sleep: 7.2h" (moon icon), "Sessions: 12" (chat icon), "Streak: 23 days" (flame icon).
Mood chart: line graph showing 30-day mood trend.
Insights section: 3 insight cards each with icon (checkmark=positive green, warning=amber concern, lightbulb=suggestion). Example: "Your mood improved 15% this month", "Sleep quality dipped mid-month", "Try morning meditation for better focus".
"Download PDF" glass button with download icon.

SCREEN 30 - BOOK RECOMMENDATIONS:
Back chevron + "Recommended Reading" title.
Book cards: horizontal scrollable cards, each with: colored cover placeholder (sage/coral/lavender tints), title "The Anxiety Toolkit", author, star rating "4.5", "Save" bookmark icon.
Categories: pill filters "All | Anxiety | Depression | Mindfulness | Self-Help".
AI message card at bottom: "Based on your recent sessions, these books may help with managing work stress."
```

---

## BATCH 6: Profile, Settings & Utility Screens (6 screens)

```
[PASTE DESIGN SYSTEM FIRST, THEN:]

6 profile, settings, and utility screens:

SCREEN 31 - ACCOUNT SETTINGS:
Back chevron + "Account Settings". 
Sections with glass container cards:
GENERAL: Theme toggle (Light/Dark), Language selector (English with chevron), Notification preferences (chevron).
PRIVACY: Data sharing toggle, Analytics toggle, Delete conversation history (red text).
SECURITY: Change password (chevron), Two-factor auth toggle (sage when on), Linked devices (chevron).
DANGER ZONE: red-bordered glass card - "Delete Account" with warning text.

SCREEN 32 - NOTIFICATION SETTINGS:
Back chevron + "Notifications" title.
Toggle sections in glass cards:
DAILY REMINDERS: "Mood check-in" toggle + time picker "9:00 AM", "Journal prompt" toggle + time picker "8:00 PM", "Meditation reminder" toggle.
INSIGHTS: "Weekly summary" toggle, "Score changes" toggle, "AI suggestions" toggle.
ALERTS: "Crisis support" toggle (locked on, can't disable), "Session reminders" toggle.
Push/Email/SMS channel toggles at bottom.

SCREEN 33 - HELP CENTER:
Back chevron + "Help Center" title. Search bar at top (glass, search icon).
FAQ sections: expandable accordion cards. "Getting Started", "AI Therapy", "Privacy & Security", "Billing", "Account".
Each FAQ item: question text + chevron (rotates on expand), answer text revealed below.
"Contact Support" card at bottom: "Live Chat" button (coral), "Email Us" ghost button.

SCREEN 34 - NOTIFICATIONS INBOX:
Back chevron + "Notifications" title.
Date headers: "Today", "Yesterday", "This Week".
Notification cards: each with left icon (colored circle: sage for insights, coral for reminders, lavender for achievements), title, description preview, timestamp, unread blue dot.
Examples: "Your Solace Score increased to 75!", "Time for your evening mood check-in", "7-day streak achieved!".
Swipe actions: mark read, archive.

SCREEN 35 - COMMUNITY FEED:
Back chevron + "Community" title + new post icon.
Feed cards: each with anonymous avatar, username, timestamp, post text, mood tag pills, engagement row (heart icon + count, comment icon + count, share icon).
Floating new post button (coral FAB).
Filter pills at top: "All | Anxiety | Depression | Recovery | Mindfulness".

SCREEN 36 - ERROR / EMPTY STATE:
Full screen utility screen.
Centered layout: large illustration (abstract 404/error shape in muted colors).
"Something went wrong" heading.
"We couldn't load this page. Please check your connection and try again." body text in gray.
"Try Again" coral button. "Go Home" ghost button below.
```

---

## BATCH 7: Remaining Feature Screens (6 screens)

```
[PASTE DESIGN SYSTEM FIRST, THEN:]

6 additional feature screens:

SCREEN 37 - THERAPY SESSION DETAIL:
Back chevron + "Session #12" title + share icon.
Session card: "CBT - Anxiety Management", date "Mar 28, 2026", duration "45 min".
Treatment plan progress bar (sage fill, 65%).
Homework section: 3 items with checkboxes - "Practice 5-4-3-2-1 grounding", "Journal about triggers", "10 min breathing exercise".
Session notes: expandable text area with AI summary.
"Continue Session" coral button.

SCREEN 38 - JOURNAL ENTRY COMPOSER:
Full screen (no tab bar). Header: back chevron, "New Entry" title, save icon (checkmark).
Mood selector strip: 5 small circles at top (same mood faces as mood selector, smaller).
Title input: large text "Give this entry a title...".
Rich text area: large writing space with placeholder "What's on your mind today?". 
Toolbar at bottom: bold, italic, list, mood tag, attach image icons.
Subtle word count "0 words" bottom right.

SCREEN 39 - JOURNAL ENTRY DETAIL:
Back chevron + "Mar 28, 2026" title.
Mood badge: "Happy" with face icon and sage background pill.
Entry title in large text.
Entry body text with proper typography (16px, 1.6 line height).
Metadata footer: word count, time spent, heart rate if available.
Action row: edit pencil, delete trash, share icons.

SCREEN 40 - MINDFULNESS DASHBOARD:
Back chevron + "Mindfulness" title.
Stats hero: "12.5 hours" total mindfulness time, "23 sessions" count.
Quick start cards: 3 glass cards - "Breathing" (4 min, wind icon), "Body Scan" (10 min, body icon), "Meditation" (15 min, brain icon). Each with "Start" button.
Soundscapes section: horizontal scroll of ambient sound cards (Rain, Ocean, Forest, White Noise).
Weekly chart: bar chart of daily mindfulness minutes.

SCREEN 41 - RESOURCES HUB:
Back chevron + "Resources" title.
Category pills: "All | Articles | Courses | Videos".
Featured card: large glass card with article image placeholder, "Understanding Anxiety: A Complete Guide", "8 min read", bookmark icon.
Article list: cards with thumbnail, title, reading time, category tag.
Course section: horizontal scroll of course cards with progress indicators.

SCREEN 42 - SEARCH:
Search bar at top (auto-focused, sage border). 
Recent searches: pills with X to remove.
Results sections: "Conversations" (chat cards), "Journal Entries" (entry cards), "Articles" (article cards), "Community Posts" (post cards).
Filter row: "All | Chats | Journal | Resources | Community".
NO RESULTS state: magnifying glass illustration, "No results for [query]", "Try different keywords" suggestion.
```

---

## COLOR PALETTE RATIONALE

### Why NOT brown/tan (what we had before):
- Brown/tan is the #1 most overused "AI wellness app" palette in 2025-2026
- Every AI design tool defaults to warm brown/gold = instant "vibe slop" identification
- Feels dated, like a 2023 Dribbble shot, not a shipping product

### Why Deep Indigo + Sage + Coral:
- **Deep blue-black (#0F1219)** is the industry standard for premium dark UIs (Linear, GitHub, Figma, Arc) — it's what users expect from quality software
- **Sage green (#7C9A92)** is clinically calming — research shows blue-green hues reduce anxiety — and it's distinctive from the brown/gold cliche
- **Warm coral (#E8826A)** provides energy and warmth for CTAs without being aggressive (softer than orange, warmer than red)
- **Lavender (#8B7EC8)** adds depth for mindfulness features and creates a complete triad
- The combination is **recognizably different** from Calm (blue), Headspace (orange), BetterHelp (teal), and every brown/gold AI app

### Surface hierarchy follows the dark mode best practice:
- 4% lightness steps between surface levels
- Borders at 8% white opacity (not colored borders)
- Text contrast validated: primary 15:1, secondary 6:1, muted 4.5:1

---

## BACKEND SERVICES REFERENCE (for functional accuracy)

| Service | Key Functionality | Screens Using It |
|---------|------------------|-----------------|
| **User Service** | Auth, JWT, profiles, preferences | 1-6, 7-9, 18, 31-32 |
| **Orchestrator** | Chat pipeline, WebSocket, multi-agent AI | 15-16, 25-26, 29 |
| **Therapy** | CBT/Mindfulness sessions, homework, treatment plans | 16, 37, 40 |
| **Personality** | Big Five + MBTI, style adaptation | 7, 11, 25 |
| **Diagnosis** | GAD-7, PHQ-9, PSS assessments, scoring | 10-12 |
| **Safety** | Crisis detection, 988 resources, content filtering | 24, 16 (banner) |
| **Memory** | Conversation memory, vector search, context | 15-16, 29 |
| **Notification** | Push/email/SMS, reminders, templates | 32, 34 |
| **Analytics** | Dashboard metrics, reports, mood/sleep/stress trends | 13, 14, 17, 19-22, 29 |
| **Config** | Feature flags, app config | All screens (feature gates) |

---

## TOTAL SCREENS: 42 across 7 batches
Covering all major user flows: Auth (6) + Onboarding/Assessment (6) + Main Tabs (6) + Features (6) + Chat/Voice (6) + Settings/Utility (6) + Remaining (6)
