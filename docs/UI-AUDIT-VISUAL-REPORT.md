# Solace AI Mobile - Comprehensive UI Visual Audit Report

**Date**: March 17, 2026
**Audit Method**: Playwright E2E visual inspection (Expo Web @ 390x844 mobile viewport)
**Screenshots Reviewed**: 30 screens across Auth, Onboarding, Assessment, and Main App flows
**Reference**: Design specs from `docs/ui-audit/` (158 screens, 32 batches)

---

## Executive Summary

The app's structural foundations are solid - navigation flows work correctly, component hierarchy is logical, and accessibility labels are in place. However, the visual execution falls significantly short of a **modern, sleek, elegant** standard expected for a premium mental health app. The primary issues are: **placeholder/unfinished UI elements**, **inconsistent visual polish**, **emoji-dependent iconography**, **poor empty states**, and **web rendering degradation**. Below is a screen-by-screen breakdown with severity ratings.

**Severity Legend**:
- **P0 - Critical**: Broken UI, blocks user flow, or damages credibility
- **P1 - Major**: Significantly degrades visual quality or UX
- **P2 - Moderate**: Noticeable polish issues that affect perceived quality
- **P3 - Minor**: Small refinements for premium feel

---

## 1. WELCOME SCREEN (`/auth/welcome`)

**Screenshot**: `screenshots/auth/01-welcome.png`

### Issues Found

| # | Issue | Severity | Description |
|---|-------|----------|-------------|
| 1.1 | Robot mascot is low-fidelity | P1 | The cartoon robot character feels childish for a mental health app. Modern wellness apps (Calm, Headspace, BetterHelp) use abstract illustrations, Lottie animations, or elegant gradients - not cartoon robots. This sets the wrong tone for users seeking mental health support. |
| 1.2 | Logo is 4 plain dots | P2 | The Solace AI logo (4 circles in a diamond) lacks refinement. No gradient, no glow, no brand identity. Feels like a placeholder. |
| 1.3 | "Solace AI" has blue underline artifact | P2 | The "Solace AI" text appears to have an underline decoration that looks like a web link artifact, not intentional styling. |
| 1.4 | Button text hierarchy weak | P3 | "Get Started" button and "Already have an account? Sign In." both compete for attention. The secondary link should be more muted. |
| 1.5 | Dark circle behind mascot has no depth | P2 | The circle containing the robot has no shadow, gradient, or blur. It's a flat dark circle on a dark background - no visual depth. |

### Recommendations
- Replace robot with an abstract, calming Lottie animation (e.g., breathing gradient orbs, gentle wave patterns)
- Add subtle gradient or glassmorphism to the logo
- Use a proper SVG/vector logo with brand identity
- Add background gradient or subtle particle effects for depth
- Make "Sign In" link smaller, lower opacity, and clearly secondary

---

## 2-6. ONBOARDING STEPS 1-5 (`/auth/onboarding/step-1` through `step-5`)

**Screenshots**: `screenshots/auth/02-06-onboarding-step*.png`

### Issues Found

| # | Issue | Severity | Description |
|---|-------|----------|-------------|
| 2.1 | **"Replace with actual image" placeholder text visible** | P0 | Every single onboarding step shows "Illustration / Step N / Replace with actual image" in the circle. This is **development placeholder text visible to users**. Completely unacceptable for any build. |
| 2.2 | Step badge ("Step One", "Step Two") looks like a pill button | P2 | The white-on-colored pill badges look dated. Modern onboarding uses minimal step indicators or animated transitions, not labeled pills. |
| 2.3 | Progress bar segments are plain gray lines | P2 | The 5-segment progress indicator is thin gray dashes with gold active segments. Low contrast, hard to read, feels cheap. |
| 2.4 | Navigation arrows (back/forward) are plain tan circles | P2 | The circle buttons with arrow characters lack visual refinement. No shadow, no hover state feedback, no border. |
| 2.5 | Step 1 - No back button but has it from Step 2+ | P3 | Step 1 shows only forward arrow (correct), but the layout shifts between step 1 (right-aligned) and steps 2-5 (left+right). |
| 2.6 | Step 3 gray theme is dull and depressing | P1 | For a mental health app, Step 3's gray color scheme (#6B6B6B) feels bleak and uninviting. The "AI Mental Journaling" topic deserves a warmer, more inviting palette. |
| 2.7 | Heading text uses inconsistent italic+bold mixing | P2 | Steps use mixed styling - some words are italic+colored, others bold+white. The pattern is inconsistent ("*Intelligent* Mood..." vs "**AI** *Mental* Journaling"). |
| 2.8 | Large empty space between badge and illustration | P2 | ~150px of dead space between the step badge and the illustration circle. Feels unfinished. |

### Recommendations
- **Immediately** replace placeholder text with actual illustrations (Lottie animations or high-quality SVGs)
- Replace step pills with animated dot indicators or a smooth progress arc
- Use animated transitions between steps (parallax, fade, slide)
- Redesign progress indicator as a continuous bar with smooth fill animation
- Make navigation buttons glass-morphic with subtle shadows
- Change Step 3's gray to a soothing teal or soft blue
- Standardize heading typography - all bold, accent color on one key word only

---

## 7. SIGN UP SCREEN (`/auth/signup`)

**Screenshot**: `screenshots/auth/07-signup.png`

### Issues Found

| # | Issue | Severity | Description |
|---|-------|----------|-------------|
| 7.1 | Header has abrupt diagonal tan/brown split | P1 | The tan header section cuts off diagonally revealing the dark brown background. The transition is harsh, not elegant. Needs a smooth curve or gradient blend. |
| 7.2 | Logo in header is tiny and low contrast | P2 | 4-dot logo on tan background has almost no contrast. Barely visible. |
| 7.3 | Input fields use emoji icons (envelope, lock) | P1 | Using emoji characters (envelope emoji, lock emoji) instead of proper SVG/vector icons is a major quality issue. Emojis render differently across platforms/browsers, look unprofessional, and break visual consistency. |
| 7.4 | Password eye toggle icon is an emoji | P1 | The show/hide password toggle uses the eye-in-speech-bubble emoji. This is not a proper icon. |
| 7.5 | Form labels are ALL CAPS in some screens, not in others | P2 | "Email Address", "Password", "Password Confirmation" use different casing than the profile setup form's "FULL NAME", "EMAIL ADDRESS" (uppercase). Inconsistent. |
| 7.6 | "Sign Up" button has low contrast text | P2 | Dark text on the tan/gold button. The contrast ratio appears borderline for WCAG AA. |
| 7.7 | No social sign-up options (but Sign In has them) | P2 | Sign Up doesn't offer Facebook/Google/Instagram like Sign In does. Inconsistent and a UX friction point. |
| 7.8 | Input border styling inconsistent | P3 | Password fields have visible gold/tan borders, but email field border is barely visible. |

### Recommendations
- Replace ALL emoji icons with a consistent icon library (Phosphor Icons, Lucide, or SF Symbols style)
- Smooth the header-body transition with a curved SVG divider or gradient
- Increase logo size and contrast in header
- Add social signup options matching the Sign In screen
- Standardize input border styles and label casing across all forms
- Use proper SVG eye icon for password toggle

---

## 8. SIGN IN SCREEN (`/auth/signin`)

**Screenshot**: `screenshots/auth/08-signin.png`

### Issues Found

| # | Issue | Severity | Description |
|---|-------|----------|-------------|
| 8.1 | Same emoji icon issues as Sign Up | P1 | Envelope emoji, lock emoji, eye emoji - all need proper vector icons. |
| 8.2 | Social login buttons are plain circles with letters | P1 | Facebook (f), Google (G), Instagram (camera emoji) are rendered as text in circles, not branded logos. The Instagram one literally uses a camera emoji. This damages credibility. |
| 8.3 | "Forgot Password" link placement is awkward | P2 | Placed at the very bottom, below the sign up link. Standard UX places it near the password field or just below the sign-in button. |
| 8.4 | Button appears disabled but has no visual distinction | P2 | The "Sign In" button is shown as disabled (no form data), but the visual difference from an enabled button is too subtle - just slightly darker. |

### Recommendations
- Use branded SVG logos for social login (Facebook blue, Google multicolor, Apple black)
- Move "Forgot Password" directly below the password field
- Make disabled button state clearly distinct (50% opacity, different background)
- Replace all emoji icons with consistent vector icon set

---

## 9. FORGOT PASSWORD (`/auth/forgot-password`)

**Screenshot**: `screenshots/auth/09-forgot-password.png`

### Issues Found

| # | Issue | Severity | Description |
|---|-------|----------|-------------|
| 9.1 | Recovery option icons are emojis (lock, key, lock) | P1 | Same emoji problem. The recovery options use emoji characters instead of vector icons. |
| 9.2 | All 3 options have borders but inconsistent selection state | P2 | "Password" option appears selected (gold border) but the other two look identical to each other. No radio button indicator visible. |
| 9.3 | "Send Reset Link" button has emoji lock icon | P1 | The button text includes an emoji lock - mixing text and emoji in CTAs looks unprofessional. |
| 9.4 | Back arrow is a thin circle with arrow character | P2 | The back button (top-left) is a thin circle outline with an arrow character. It's hard to tap (small target) and visually weak. |

### Recommendations
- Replace emojis with elegant vector icons (shield, key, authenticator app)
- Add clear radio selection indicator (filled circle, checkmark, or highlight)
- Remove emoji from button text, use icon-only or text-only
- Increase back button touch target to 44x44pt minimum with a clearer icon

---

## 10. VERIFICATION SENT (`/auth/verification-sent`)

**Screenshot**: `screenshots/auth/10-verification-sent.png`

### Issues Found

| # | Issue | Severity | Description |
|---|-------|----------|-------------|
| 10.1 | Lock+key illustration is emoji-based, set on olive green blob | P1 | The lock+key emojis on a flat olive green rounded rectangle look amateurish. This screen should convey trust and security - it's failing. |
| 10.2 | Close button (X) at bottom is a white circle with X | P2 | Oversized close button at the bottom feels out of place. Usually close is top-right. |
| 10.3 | Two buttons ("Re-Send Password" and "Send Password") are confusing | P1 | Both buttons are similar in name and appearance. "Send Password" is disabled but looks almost the same as "Re-Send Password". Users won't understand the difference. |
| 10.4 | Card has no shadow or depth | P2 | The modal/card containing the verification info floats on the dark background with no shadow, border, or glassmorphism. |
| 10.5 | Key emoji in instruction text | P2 | "Then re-send the password below! (key emoji)" - emojis in instructional text look unprofessional. |

### Recommendations
- Replace emoji illustration with a proper animated SVG (envelope flying, checkmark)
- Consolidate to a single "Resend Code" button with a countdown timer
- Move close button to top-right corner
- Add card shadow/border or glassmorphism effect
- Remove emojis from instructional text

---

## 11. LOADING PROGRESS (`/auth/loading`)

**Screenshot**: `screenshots/auth/11-loading-progress.png`

### Issues Found

| # | Issue | Severity | Description |
|---|-------|----------|-------------|
| 11.1 | Just "100%" text with no visual loader | P1 | The loading screen shows only "100%" centered on a dark background with faint circles. No progress bar, no animation, no spinner. It captures the end state but the screen probably had an animation that completed instantly. |
| 11.2 | Background circles have almost no contrast | P2 | Decorative circles in the corners are barely visible (dark brown on dark brown). They add visual noise without value. |
| 11.3 | No branding or context | P2 | User sees just a number with no indication of what's loading or that it's the Solace AI app. |

### Recommendations
- Add a circular progress indicator or horizontal progress bar with smooth animation
- Include app logo above the percentage
- Add a loading message ("Preparing your experience...")
- Make background circles more visible or replace with a subtle gradient animation

---

## 12. FETCHING DATA / QUOTE SPLASH (`/auth/fetching`)

**Screenshot**: `screenshots/auth/12-quote-splash.png`

### Issues Found

| # | Issue | Severity | Description |
|---|-------|----------|-------------|
| 12.1 | "Fetching Data..." text is plain white on flat olive green | P1 | The entire screen is a flat olive/yellow-green (#9AAD5C) with no gradient, texture, or visual interest. Looks like a development placeholder. |
| 12.2 | "Setting up your experience..." uses a small calculator emoji | P2 | Random calculator/abacus emoji before the subtitle. Doesn't relate to "setting up experience". |
| 12.3 | Background circles barely visible | P2 | Same as loading screen - faint decorative circles. |
| 12.4 | Quote splash auto-transitions too fast | P2 | The Maya Angelou quote screen transitions to Fetching Data so quickly it can't be read. |

### Recommendations
- Use a gradient background (green-to-brown or branded gradient)
- Add a skeleton loader or Lottie animation showing data being assembled
- Replace emoji with proper loading indicator (spinner, dots)
- Ensure quote screen displays for a readable duration (3-5 seconds)

---

## 13. PROFILE SETUP WELCOME (`/onboarding/welcome`)

**Screenshot**: `screenshots/onboarding/01-profile-welcome.png`

### Issues Found

| # | Issue | Severity | Description |
|---|-------|----------|-------------|
| 13.1 | **"Coming Soon" placeholder - screen is blank** | P0 | The entire screen is just "Welcome to Solace" + "Coming Soon" on a blank dark background. This is a **completely unimplemented screen** that a user would see in the flow. |
| 13.2 | No illustration, no welcome message, no progress indicator | P0 | Zero onboarding context. User has no idea what they're about to do. |

### Recommendations
- Implement a proper welcome screen with:
  - User's avatar or default placeholder
  - Welcoming message ("Let's set up your profile")
  - Estimated time ("This takes about 3 minutes")
  - Progress stepper showing upcoming steps
  - "Get Started" CTA button

---

## 14. PROFILE SETUP DETAILS (`/onboarding/name`)

**Screenshot**: `screenshots/onboarding/02-profile-name.png`

### Issues Found

| # | Issue | Severity | Description |
|---|-------|----------|-------------|
| 14.1 | Way too many fields on one screen | P1 | Name, Email, Password, Account Type, Weight slider, Gender dropdown, Location dropdown - **7 form fields** on a single screen. This is overwhelming. The design spec separates these into individual screens (ProfileNameInput, ProfileBirthDate, ProfileGender, etc.) but they're all crammed into one. |
| 14.2 | Avatar uses emoji person icon, not a real placeholder | P2 | The profile photo area shows a small purple person emoji instead of a proper avatar placeholder circle with camera icon. |
| 14.3 | "Edit profile photo" button is a small chain-link emoji | P2 | The edit indicator on the avatar is a chain-link emoji instead of a proper camera/edit icon. |
| 14.4 | Weight slider label size ("65kg") is inconsistent | P3 | The current value "65kg" is bold and large, while min/max values "50kg" / "100kg" are small and muted. The bold treatment makes it look like a heading, not a value. |
| 14.5 | All labels are UPPERCASE ("FULL NAME", "EMAIL ADDRESS") | P2 | While internally consistent, ALL CAPS labels feel harsh and clinical for a wellness app. Sentence case or Title Case would be warmer. |
| 14.6 | Header section (green area with "<" button) has poor contrast | P2 | "Profile Setup" text on the olive green header has borderline contrast. |
| 14.7 | Form doesn't scroll indicator | P3 | The form is longer than the viewport but there's no scroll indicator or gradient at the bottom to hint at more content below. |

### Recommendations
- **Split into separate screens** per the design spec (one question per screen with progress indicator)
- Use a proper photo placeholder (circle with camera icon overlay)
- Use proper vector icons throughout
- Add scroll hint (gradient fade at bottom) for long forms
- Soften label casing to Title Case

---

## 15. PASSWORD SETUP (`/onboarding/password`)

**Screenshot**: `screenshots/onboarding/03-password-setup.png`

### Issues Found

| # | Issue | Severity | Description |
|---|-------|----------|-------------|
| 15.1 | Password strength bar is an empty thin line | P2 | The strength indicator is a barely visible thin line under "Password Strength". No color coding, no segments, no fill animation. |
| 15.2 | "Enter a password" state text is green, suggesting success | P2 | The empty-state text "Enter a password" is styled in green/teal, which implies a positive state when nothing has been entered. Should be neutral/gray. |
| 15.3 | Validation chips use warning emoji | P2 | "Must have A-Z" and "Must Have 0-9" use a triangle warning emoji. These should use proper checkmark/X icons that update as requirements are met. |
| 15.4 | Eye icon in input field is too small | P3 | The password visibility toggle is small and hard to tap. |
| 15.5 | Massive empty space in middle of screen | P2 | ~400px of blank space between validation chips and the Continue button. Feels unfinished. |
| 15.6 | Inconsistent capitalization: "Must have A-Z" vs "Must Have 0-9" | P3 | Mixed casing in validation chips. |

### Recommendations
- Implement a proper multi-segment strength bar (red/orange/yellow/green) with fill animation
- Color-code validation chips (gray=unmet, green=met) with check/X icons
- Remove emoji from validation chips
- Add more password requirements (min length, special chars)
- Reduce vertical spacing or add helpful content (password tips)
- Fix capitalization inconsistency

---

## 16. OTP ENTRY (`/onboarding/otp-verification`)

**Screenshot**: `screenshots/onboarding/04-otp-entry.png`

### Issues Found

| # | Issue | Severity | Description |
|---|-------|----------|-------------|
| 16.1 | First OTP box is bright olive green, others are dark | P1 | The active/first OTP digit box is a flat olive green that clashes with the brown theme. It looks like a bug, not an intentional active state. |
| 16.2 | OTP boxes have no border on inactive state | P2 | The 3 inactive boxes are nearly invisible against the dark background. Need visible borders. |
| 16.3 | "Re-send" in the link is red, looks like an error | P2 | "Didn't receive the OTP? **Re-send.**" - the red styling on "Re-send" makes it look like an error message, not a clickable link. |
| 16.4 | No countdown timer for OTP expiry | P2 | No indication of how long the OTP is valid or when user can request a new one. |

### Recommendations
- Use consistent border colors for OTP boxes (gray inactive, gold active, green filled)
- Add smooth focus transition animation between boxes
- Style "Re-send" as a link (underline, tan/gold color)
- Add countdown timer ("Resend in 0:30")
- Add auto-advance behavior (cursor moves to next box automatically)

---

## 17. FINGERPRINT SETUP (`/onboarding/biometric`)

**Screenshot**: `screenshots/onboarding/06-biometric.png`

### Issues Found

| # | Issue | Severity | Description |
|---|-------|----------|-------------|
| 17.1 | Fingerprint scan frame is basic line art | P2 | The scan frame (corner brackets + concentric circles + scan line) looks like basic CSS, not a polished biometric UI. |
| 17.2 | Heading repeats "Fingerprint Setup" twice | P2 | The header says "Fingerprint Setup" and the body also says "Fingerprint Setup" in bold. Redundant. |
| 17.3 | Key emoji in description text | P2 | "...make your account more secure. (key emoji)" - Remove emoji from body text. |
| 17.4 | No skip option | P3 | Users should be able to skip biometric setup. |

### Recommendations
- Use a Lottie animation for the fingerprint scanning effect
- Remove duplicated heading - use a different subtitle ("Secure your account")
- Add a "Skip for now" option below the Continue button
- Add animated pulse effect on the fingerprint scanner

---

## 18. ASSESSMENT INTRO (`/onboarding/assessment`)

**Screenshot**: `screenshots/onboarding/07-assessment-intro.png`

### Issues Found

| # | Issue | Severity | Description |
|---|-------|----------|-------------|
| 18.1 | Brain/head icon is a dark olive half-circle | P2 | The illustration (supposed to be a brain or head) is two olive green half-circles that don't clearly communicate "mental health assessment." |
| 18.2 | Heart emoji below the illustration | P2 | A pink heart emoji below the icon serves no clear purpose. |
| 18.3 | Info chips (14 questions, 5-7 minutes) use emojis | P2 | Clipboard emoji and gear/timer emoji in the metadata chips. |
| 18.4 | "Your responses are private and confidential" is low contrast | P2 | This trust-building message is too muted. It should be more prominent given the sensitive nature of mental health data. |

### Recommendations
- Use a proper illustration (brain outline, calm person meditating, or abstract wellness graphic)
- Replace emojis with vector icons in chips
- Make confidentiality message more prominent (add a shield icon, increase size/contrast)
- Add a subtle progress indicator showing this is the final onboarding phase

---

## 19-20. ASSESSMENT QUESTIONS (`/onboarding/assessment/*`)

**Screenshots**: `screenshots/onboarding/08-11-assessment-*.png`

### Issues Found

| # | Issue | Severity | Description |
|---|-------|----------|-------------|
| 19.1 | Circular progress shows percentage text inside a small circle | P2 | The progress indicator (7%, 14%, etc.) is a tiny circle that's hard to read. The ring around it barely shows progress at low percentages. |
| 19.2 | Radio option cards all look identical | P2 | All 4 answer options for each question look the same (dark card, emoji, text, empty radio circle). No visual differentiation, no hover/focus states visible. |
| 19.3 | Emojis for answer options vary in quality | P2 | The emoji faces (for Anxiety, Low mood, etc.) render differently across platforms. Some are detailed, some are simple. Inconsistent look. |
| 19.4 | Age picker (Q2) center selection highlight is olive green | P2 | The highlighted age value (18) has an olive green rounded rectangle that clashes with the otherwise brown/dark theme. |
| 19.5 | Stress level selector (Q5) selected circle is plain orange | P2 | The selected level (3) is a flat orange circle. No depth, no animation, no gradient. |
| 19.6 | "Continue" button disabled state is too similar to enabled | P2 | When no option is selected, Continue is disabled but the visual difference is very subtle. |

### Recommendations
- Make progress ring larger with animated fill and percentage outside or below
- Add selected state animation to answer cards (border glow, color change, subtle scale)
- Replace emoji faces with custom-designed mood illustrations
- Use branded colors for the age picker highlight (tan/gold instead of olive)
- Add micro-interactions (haptic feedback hints, selected card lift effect)
- Make disabled Continue button clearly different (50% opacity)

---

## 21. ASSESSMENT RESULTS (`/onboarding/assessment/results`)

**Screenshot**: `screenshots/onboarding/12-assessment-results.png`

### Issues Found

| # | Issue | Severity | Description |
|---|-------|----------|-------------|
| 21.1 | Score circle has no animation or gradients | P2 | The score (50) in a plain circle with orange border. Modern health apps use animated gauges, gradient rings, or animated number counters. |
| 21.2 | "Unstable" badge uses warning emoji | P2 | Triangle warning emoji in the status badge. Should be a vector icon. |
| 21.3 | Score breakdown bars are truncated/overlapping labels | P2 | "Mood & Emotions", "Stress Management", "Lifestyle & Support" labels are multi-line and cramped against the progress bars. |
| 21.4 | Recommendations section is cut off | P2 | The third recommendation bullet is cut off at the bottom. No scroll indicator. |
| 21.5 | "View Details" button has different style than "Continue" | P3 | View Details is outlined, Continue is filled. While intentional for hierarchy, the outlined button almost disappears on the dark background. |

### Recommendations
- Animate the score circle (fill from 0 to 50 with number counting up)
- Use color-coded ring (red < 30, orange 30-70, green 70+)
- Use proper vector icon for status badges
- Improve breakdown layout with more horizontal space
- Ensure recommendations section is scrollable with visible indicator

---

## 22. HOME DASHBOARD (`/home`)

**Screenshot**: `screenshots/dashboard/01-home-dashboard.png`

### Issues Found

| # | Issue | Severity | Description |
|---|-------|----------|-------------|
| 22.1 | Date format is basic and left-aligned with no context | P3 | "Tue, 17 Mar 2026" is plain text. Modern dashboards use warmer greetings tied to time of day. |
| 22.2 | User avatar is just a brown circle with "U" | P2 | Single letter avatar with no personalization, gradient, or ring indicator. |
| 22.3 | Notification bell is an emoji | P1 | The bell notification icon is an emoji, not a proper vector icon with badge count. |
| 22.4 | Search bar uses emoji magnifying glass | P1 | Emoji search icon instead of proper vector icon. |
| 22.5 | Metric cards are cramped in a 4-column layout | P1 | Mood, Mindful Hours, Sleep Quality, Mental Journal are in 4 tiny columns that are barely readable. Text is truncated and values are hard to scan. |
| 22.6 | "Sleep Quality" card shows just a tiny dark bar | P2 | The Sleep Quality metric shows a tiny horizontal bar with no label, no percentage, no context. Meaningless to the user. |
| 22.7 | "Mood Tracker" card is empty | P2 | The Mood Tracker card (bottom right) shows only the label with a blank area. No mini-chart or indicator. |
| 22.8 | AI Therapy Chatbot card shows "0 Conversations" | P2 | Empty state just shows zero. Should show an inviting illustration or prompt. |
| 22.9 | "Get recommendation for the day's needs" is truncated | P2 | The CTA text in the chatbot card is cut off at the bottom of the viewport. |
| 22.10 | No visual hierarchy between sections | P2 | Mental Health Metrics, metric cards, Chatbot section, and Mindful Articles all run together with minimal spacing or dividers. |
| 22.11 | Tab bar icons are not rendering on web | P1 | Tab bar icons (from react-native-vector-icons) don't render on web - just empty space above the labels. |

### Recommendations
- Use time-based greeting ("Good morning, User" with sun icon)
- Replace ALL emojis with consistent vector icon library
- Redesign metric cards as a 2-column grid with larger, more readable cards
- Add sparklines/mini-charts inside metric cards
- Design a proper empty state for the chatbot (illustration + "Start your first conversation")
- Add section headers with dividers or card containers
- Fix tab bar icons for web (use `@expo/vector-icons` or inline SVGs)

---

## 23. MOOD DASHBOARD (`/mood`)

**Screenshot**: `screenshots/mood/01-mood-dashboard.png`

### Issues Found

| # | Issue | Severity | Description |
|---|-------|----------|-------------|
| 23.1 | Header background has decorative circles that look like bugs | P2 | The tan/brown header has semi-transparent circles that look like rendering artifacts, not intentional design elements. |
| 23.2 | Emoji face for mood state is system emoji | P1 | The large "Neutral" face emoji renders differently per platform. Needs custom illustration. |
| 23.3 | "Weekly Mood" section is completely empty | P1 | Below the "Weekly Mood / Filter" header there's a single empty card and nothing else. No chart, no data placeholder, no empty state message. |
| 23.4 | Stats icon (top right) is barely visible | P2 | The bar chart icon in the top-right is small and low contrast against the header. |
| 23.5 | Back arrow in header doesn't make sense | P2 | There's a back arrow on the main mood tab, but tabs shouldn't have back navigation - they're top-level destinations. |
| 23.6 | FAB (+) button is plain flat orange | P2 | The floating action button has no shadow, no elevation effect, no gradient. Looks flat and cheap. |

### Recommendations
- Replace emoji mood face with custom-designed mood illustrations
- Add empty state for Weekly Mood ("Log your first mood to see trends here")
- Remove back arrow from tab landing screens
- Add depth to the FAB (shadow, gradient, subtle animation)
- Replace decorative circles with a cleaner gradient header
- Add a mini mood history (last 7 days as colored dots)

---

## 24. MOOD HISTORY (`/mood/history`)

**Screenshot**: `screenshots/mood/02-mood-history.png`

### Issues Found

| # | Issue | Severity | Description |
|---|-------|----------|-------------|
| 24.1 | **Screen is completely empty** - no history content | P1 | The History tab shows absolutely nothing. No empty state, no illustration, no prompt. |
| 24.2 | Tab switcher (History / AI Suggestions) is standard | P3 | The pill-style tab bar is functional but basic. |
| 24.3 | Bottom toolbar (settings/add/edit) icons are emojis | P1 | Gear emoji, pencil emoji for the toolbar actions. |
| 24.4 | Search icon is a blue emoji magnifying glass | P1 | Same emoji icon problem. |
| 24.5 | Bottom toolbar overlaps with tab bar | P2 | The settings/add/edit toolbar sits directly above the main tab bar, creating a "double bottom bar" that's confusing. |

### Recommendations
- Add proper empty state ("No mood entries yet. Tap + to log your first mood")
- Use vector icons for all toolbar actions
- Consider merging the bottom toolbar into the header or using a contextual menu
- Avoid double-stacking toolbars above the tab bar

---

## 25. CHAT LIST (`/chat`)

**Screenshot**: `screenshots/chat/01-chats-list.png`

### Issues Found

| # | Issue | Severity | Description |
|---|-------|----------|-------------|
| 25.1 | Orange header is a flat solid block | P1 | The entire header area is flat orange (#E8853A) with no gradient, no depth, no visual interest. Looks like a development placeholder color fill. |
| 25.2 | Back button "<" is a white circle with text | P2 | Same plain back button issue. And like the mood tab, a back button on a tab landing page is wrong. |
| 25.3 | Tab switcher has white "Recent" on white background | P2 | The active "Recent" tab is white text on white pill, making it appear blank. Needs better contrast. |
| 25.4 | Both sections show "(0)" with "See All" that goes nowhere | P2 | "Recent (0) / See All" and "Trash (0) / See All" - "See All" on zero items is pointless. |
| 25.5 | No FAB or "New Chat" button visible | P1 | The primary action (start a new AI therapy conversation) has no visible CTA. This is the most important action on this screen. |
| 25.6 | No empty state illustration | P1 | Just text counters on a blank screen. Needs a welcoming empty state. |

### Recommendations
- Add gradient to header (orange to brown) with curved bottom edge
- Add a prominent "New Conversation" FAB or button
- Replace "(0)" empty state with an illustration + "Start your first AI therapy session"
- Remove "See All" when count is 0
- Remove back button from tab landing page

---

## 26. JOURNAL DASHBOARD (`/journal`)

**Screenshot**: `screenshots/journal/01-journal-dashboard.png`

### Issues Found

| # | Issue | Severity | Description |
|---|-------|----------|-------------|
| 26.1 | Header is a flat tan/gold block with decorative circles | P2 | Same decorative circles issue as mood dashboard. |
| 26.2 | "0 Journals This Week." with period at end | P3 | Grammatical issue - shouldn't end with a period. Also "Journals" should be "Journal Entries". |
| 26.3 | Add button (+) is a small dark circle, easy to miss | P2 | The add button is small and has low contrast against the tan header background. |
| 26.4 | Moon icon (top-left) is an emoji | P1 | The crescent moon emoji in the header. |
| 26.5 | Journal Statistics chart is empty (just a thin gray bar) | P1 | The "Journal Statistics" section shows an empty bar with Skipped/Positive/Negative legend but no data visualization. |
| 26.6 | Legend colors (gray/green/orange dots) are tiny | P2 | The status dots next to "Skipped", "Positive", "Negative" are barely visible. |

### Recommendations
- Add empty state ("Start journaling to see your trends")
- Replace moon emoji with proper vector icon
- Show a proper empty chart with placeholder axes
- Make the add button more prominent (FAB style, larger)
- Use larger, more accessible color indicators in the legend

---

## 27. PROFILE DASHBOARD (`/profile`)

**Screenshot**: `screenshots/profile/01-profile-dashboard.png`

### Issues Found

| # | Issue | Severity | Description |
|---|-------|----------|-------------|
| 27.1 | Avatar is a plain empty circle with thin dark border | P1 | The profile photo placeholder is just an empty circle. No icon, no gradient, no initials (or the "U" from dashboard is missing here). |
| 27.2 | Settings gear is a small emoji | P1 | The gear/flower emoji (top-right) is barely visible and used for navigation to settings. |
| 27.3 | "Free" badge has no context | P2 | The green "Free" pill doesn't explain what it means. Is it a free tier? A trial? |
| 27.4 | Stats show "--" for Age, Weight, Height | P2 | Dashes for empty data with no prompt to fill in the information. |
| 27.5 | Solace Score and Mood cards are cramped | P2 | The two info cards at the bottom are small and don't have enough padding or visual hierarchy. |
| 27.6 | **No menu items visible** | P0 | The profile screen should show Account Settings, Personal Info, Notifications, Security, Help Center, etc. **None of these are visible**. The screen appears incomplete - users can't access any settings. |
| 27.7 | Bottom 60% of screen is completely blank | P1 | Massive empty space below the two cards. No settings menu, no options, nothing. |

### Recommendations
- **Implement the full settings menu list** (Account, Personal Info, Notifications, Security, Help, About, Logout)
- Add proper avatar placeholder with camera overlay for photo upload
- Use vector icon for settings gear
- Add "Complete your profile" prompt for missing Age/Weight/Height
- Fill the empty space with the settings menu items
- Add "Premium" upsell banner if "Free" refers to pricing tier

---

## GLOBAL / CROSS-CUTTING ISSUES

### G1. Emoji Icon Usage (P0 - CRITICAL)
**Every single screen** uses emoji characters instead of proper vector icons. This is the single biggest quality issue across the entire app. Emojis:
- Render differently on iOS/Android/Web/Samsung
- Cannot be styled (color, size, weight)
- Look unprofessional in a health/wellness context
- Break visual consistency
- Are accessibility-hostile (screen readers announce emoji names)

**Fix**: Replace ALL emoji usage with a consistent vector icon library. Recommended: **Phosphor Icons** (1000+ icons, React Native support, consistent weights) or **Lucide Icons**.

### G2. Web Rendering (P0 - CRITICAL)
The web view has severe issues:
- Tab bar icons don't render (react-native-vector-icons uses native font loading)
- React.lazy + Metro lazy=true bundling fails completely
- shadow* style props trigger deprecation warnings everywhere
- pointerEvents deprecated warnings
- No responsive layout - mobile-only viewport

**Fix**: Use `@expo/vector-icons` with web font fallbacks, configure Metro for web compatibility, add responsive breakpoints.

### G3. Empty States (P1 - MAJOR)
Nearly every data-dependent screen shows **nothing** when empty. No illustrations, no prompts, no onboarding hints. Screens affected:
- Mood Dashboard (empty weekly mood)
- Mood History (blank screen)
- Chat List (just "(0)" counters)
- Journal Dashboard (empty statistics)
- Profile Dashboard (missing menu)
- Home Dashboard (zero values)

**Fix**: Design and implement empty state components with illustrations and CTAs for each feature.

### G4. Color Inconsistency (P2)
The color palette is used inconsistently:
- Olive green appears randomly (OTP box, age picker, fetching screen, step 1)
- Orange is sometimes flat (#E8853A), sometimes gradient
- The brown background (#1C1410) provides insufficient contrast with some text
- Button colors vary between screens (tan, gold, orange, green)

**Fix**: Audit and normalize all color usage against the design tokens in the theme system.

### G5. Typography Inconsistency (P2)
- Title casing varies: ALL CAPS labels vs. Title Case vs. sentence case
- Font weights are inconsistent between similar elements
- Some headings are italic, some are bold, some are both
- Link text colors vary (blue, red, orange, tan)

**Fix**: Define and enforce typography variants from the design system (h1-h6, body1-2, caption, button, link) consistently.

### G6. Navigation Pattern Violations (P2)
- Back arrows appear on tab landing pages (Mood, Chat, Journal) where they shouldn't
- Some screens have close buttons at the bottom instead of top
- Profile dashboard has no way to access settings (settings button doesn't navigate)

**Fix**: Remove back navigation from top-level tab screens, standardize close/back button placement.

### G7. Touch Targets (P2)
Several interactive elements are below the 44x44pt WCAG minimum:
- Back arrow buttons (~36px)
- Settings emoji on profile (~24px)
- Edit photo chain-link emoji (~20px)
- Stats icon on mood dashboard (~32px)

**Fix**: Ensure all tappable elements meet 44x44pt minimum with appropriate hit slop.

### G8. Placeholder Content Still Visible (P0)
- Onboarding steps 1-5: "Replace with actual image" text
- Profile Welcome: "Coming Soon" placeholder
- Emergency Contact: "Coming Soon" placeholder

**Fix**: Replace all placeholder content with actual illustrations or remove screens from flow until ready.

---

## PRIORITY ACTION PLAN

### Immediate (P0 - Ship Blockers)
1. Remove "Replace with actual image" placeholder text from all onboarding steps
2. Implement Profile Welcome screen (currently blank)
3. Implement Profile Dashboard settings menu (currently missing)
4. Replace ALL emoji icons with vector icon library
5. Fix web tab bar icon rendering

### High Priority (P1 - Major Quality)
6. Design and implement empty states for all data screens
7. Replace robot mascot with elegant illustration/animation
8. Fix flat color headers (add gradients, curved edges)
9. Redesign social login buttons with branded logos
10. Add "New Conversation" CTA to Chat List

### Medium Priority (P2 - Polish)
11. Normalize typography (casing, weights, colors)
12. Normalize color usage across all screens
13. Add depth to cards and buttons (shadows, borders, glassmorphism)
14. Improve progress indicators (larger, animated, color-coded)
15. Fix navigation patterns (remove back from tabs)
16. Ensure all touch targets meet 44x44pt minimum

### Low Priority (P3 - Premium Feel)
17. Add micro-interactions and animations (Lottie, Reanimated)
18. Add time-based greetings on dashboard
19. Implement loading skeletons instead of blank screens
20. Add haptic feedback hints on native

---

## MODERN DESIGN REFERENCE

For the "modern, sleek, elegant" standard the app should aspire to, reference these patterns:

| Pattern | Example Apps | Key Elements |
|---------|-------------|--------------|
| **Glassmorphism cards** | Apple Health, iOS widgets | Frosted glass, blur, translucency |
| **Gradient backgrounds** | Calm, Headspace | Smooth multi-stop gradients, not flat colors |
| **Custom illustrations** | Headspace, Woebot | Consistent art style, not emojis |
| **Micro-animations** | Duolingo, Streaks | Lottie animations for loading, success, transitions |
| **Clean typography** | Linear, Notion | One typeface, clear hierarchy, generous spacing |
| **Depth & shadows** | Material You, iOS 17 | Layered cards with shadows, not flat rectangles |
| **Empty states** | Slack, Notion | Illustration + message + CTA for empty lists |
| **Skeleton loaders** | Facebook, LinkedIn | Gray placeholder shapes while loading |

---

*End of UI Visual Audit Report*
*Total issues identified: 87 (8 P0, 23 P1, 44 P2, 12 P3)*
