# Solace AI Mobile - Deep UI UX Audit Findings

## 1. Audit Scope

- Date: 2026-03-31
- Artifact set reviewed: 35 final-audit screenshots
- Folders reviewed:
  - assessment (5)
  - auth (11)
  - chat (1)
  - dashboard (2)
  - journal (1)
  - mood (2)
  - onboarding (7)
  - profile (6)

## 2. Executive Summary

The product has a strong visual identity and a clear thematic direction, but the current UX quality is being held back by reliability and completion issues in key user journeys. The most important problems are not stylistic. They are funnel blockers, hard-failure states, and low-clarity interaction feedback.

### Overall Readout

- Brand cohesion: Strong
- Emotional design fit for mental wellness: Good
- Task completion reliability: Low due to multiple broken screens
- Information clarity: Medium
- Accessibility confidence: Medium to low
- Readiness for production trust experience: Not ready until P0 items are fixed

## 3. Top Strengths

1. Visual direction is distinctive and consistent with a calm-supportive mental health product.
2. The warm dark palette and card treatment are generally coherent across modules.
3. Assessment flow has a clear progress model and good pacing concept.
4. CTA styling is generally recognizable and consistent.
5. Profile dashboard entry layout is readable and discoverable.

## 4. Critical Issues (P0)

1. Hard-failure screens are present in multiple core paths.
   - Repeated pattern: "Something went wrong" + "Tap to retry" on dark background.
   - Affected areas: dashboard score detail, mood history, and five profile settings subpages.
   - Product impact: trust collapse, broken IA, and blocked user goals.

2. Onboarding contains dead-end "Coming Soon" pages.
   - Affected screens: profile welcome, emergency contact.
   - Product impact: onboarding completion drop, poor first-session confidence.

3. Disabled and non-interactive states are visually ambiguous.
   - Sign-in and assessment buttons can appear inactive without explicit guidance.
   - Product impact: hesitation, confusion, and conversion friction.

4. Mental health severity language is potentially stigmatizing.
   - Assessment result badge uses "Unstable".
   - Product impact: emotional harm risk and lower user trust.

## 5. Cross-Cutting UX Improvement Plan

### 5.1 Reliability and State Design

- Replace all generic error placeholders with state-specific variants:
  - Offline state
  - Timeout state
  - Server failure state
  - Empty-data state
  - Permission denied state
- Every non-happy state should include:
  - short reason
  - primary recovery action
  - secondary safe action (back or home)
  - optional status code hidden behind "details"

### 5.2 Funnel Completion and Conversion

- Remove "Coming Soon" screens from critical setup funnels.
- Where feature is unavailable, use one of:
  - lightweight fallback form
  - skip with explicit confirmation
  - deferred setup card on home/profile
- Add completion certainty messages after each setup milestone.

### 5.3 Forms and Input UX

- Add inline validation on blur and on submit.
- Add helper text below each field before errors occur.
- Replace icon-only social login row with explicit labels for accessibility.
- Password setup should display clear requirement checklist with live pass/fail updates.
- OTP should support:
  - auto-advance
  - paste full code
  - countdown for resend

### 5.4 Accessibility and Readability

- Raise contrast for disabled text, tertiary text, and body copy on dark cards.
- Ensure tap targets are at least 44px equivalent.
- Add visible focus states for keyboard or accessibility navigation contexts.
- Ensure icon-only controls have text labels for screen reader announcements.

### 5.5 Content and Emotional Safety

- Replace severity labels like "Unstable" with non-judgmental terms:
  - Needs Attention
  - Elevated Risk
  - Monitor Closely
- Recommendation copy should be action-oriented and time-boxed.
  - Example: "Try this 2-minute breathing exercise now"

### 5.6 Information Architecture

- Standardize top bar structure:
  - back or profile anchor on left
  - title in stable location
  - one primary contextual action on right
- Keep one primary CTA per screen, avoid competing actions in same visual weight.

### 5.7 Loading and Skeleton Strategy

- Skeletons should mimic eventual layout and include a short loading reason.
- If load exceeds threshold, show progress message and fallback options.
- Avoid full-screen "100%" loader with no transition explanation.

## 6. Detailed Findings by Screen

## 6.1 Assessment Flow

### assessment/01-concern.png

What works:
- Clear question and answer-card grouping.
- Progress indicator at top creates orientation.

Issues:
- Option cards do not provide strong selected state in static view.
- Continue button appears disabled without guidance.

Recommendations:
- Add selected-card fill or border and confirm check icon.
- Add hint text above button when disabled: "Select one option to continue".

Priority: P1

### assessment/02-age.png

What works:
- Wheel-style selector is visually distinctive.

Issues:
- Up and down affordances are weak and easy to miss.
- No range or rationale shown.

Recommendations:
- Add "Swipe to choose age" helper.
- Show allowed range and why age is requested.

Priority: P1

### assessment/03-mood.png

What works:
- Consistent question card pattern.

Issues:
- Similar option visuals reduce scan speed.
- No secondary descriptor under each mood option.

Recommendations:
- Add short descriptors for each mood state.
- Add stronger selected state and immediate haptic response.

Priority: P2

### assessment/04-stress.png

What works:
- Numeric scale is straightforward.
- Immediate interpreted label appears under slider.

Issues:
- Endpoints are not semantically labeled.
- Current selection meaning could be clearer.

Recommendations:
- Label endpoints with "Very low" and "Very high".
- Add legend for each number level.

Priority: P1

### assessment/05-results.png

What works:
- Good visual hierarchy on score, breakdown, and recommendations.
- Dual CTA allows detail exploration and continuation.

Issues:
- "Unstable" can feel stigmatizing.
- Recommendation list is useful but not action-prioritized.

Recommendations:
- Use supportive label taxonomy.
- Add immediate next-step CTAs under recommendations.
- Include confidence note: "Not a diagnosis" and crisis shortcut if threshold crossed.

Priority: P0

## 6.2 Auth Flow

### auth/01-welcome.png

What works:
- Strong hero simplicity and clear primary CTA.

Issues:
- Product value proposition is generic.

Recommendations:
- Add one concrete value line under subtitle.
  - Example: "Track mood, chat privately, and get personalized support plans".

Priority: P2

### auth/02-onboarding-step1.png to auth/06-onboarding-step5.png

What works:
- Step structure and progression dots are clear.

Issues:
- Palette shifts are dramatic across steps and can feel like different products.
- Minimal explanatory copy reduces perceived value transfer.

Recommendations:
- Keep a stable visual base and rotate accent colors only.
- Add one sentence under each title describing user benefit.
- Make previous and next controls consistent on every step.

Priority: P1

### auth/07-signup.png

What works:
- Form layout is clean and readable.

Issues:
- No inline password requirement hints before submission.
- Confirmation field does not indicate match state.

Recommendations:
- Add live checklist and match indicator.
- Add email formatting hints and immediate validation.

Priority: P1

### auth/08-signin.png

What works:
- Screen hierarchy is straightforward.

Issues:
- Disabled sign-in button has low clarity.
- Social icons are icon-only and may reduce accessibility.

Recommendations:
- Add helper text for disabled state.
- Add text labels or dedicated social buttons with provider name.

Priority: P1

### auth/09-forgot-password.png

What works:
- Recovery channel cards are easy to scan.

Issues:
- Option semantics are unclear ("Use 2FA", "Password", "Google Authenticator").

Recommendations:
- Rename options to clear outcomes.
  - Example: "Send reset link to email", "Use authenticator app", "Use backup codes".

Priority: P1

### auth/10-verification-sent.png

What works:
- Confirmation card has good focus and clear action hierarchy.

Issues:
- Button labels are confusing ("Re-Send Password" and "Send Password").

Recommendations:
- Use precise labels: "Resend verification code" and "Open email app".
- Add resend cooldown timer.

Priority: P1

### auth/11-loading.png

What works:
- Minimal loading visual style is on-brand.

Issues:
- No context for what is loading.
- "100%" may still remain on screen with no transition cue.

Recommendations:
- Add loading reason and next destination message.
- Auto transition with fallback "Continue" action if delayed.

Priority: P1

## 6.3 Onboarding Flow

### onboarding/01-profile-welcome.png

Issue:
- "Coming Soon" dead-end in active onboarding.

Recommendation:
- Replace with real first-step content or auto-skip with explanation.

Priority: P0

### onboarding/02-profile-setup.png

What works:
- Rich form captures profile setup in one place.

Issues:
- High field density risks fatigue.
- Account type chips include role ambiguity.
- Form may require keyboard-aware and step segmentation.

Recommendations:
- Split into two-step setup for readability.
- Clarify account roles and expected benefits per role.
- Add save draft and progress marker.

Priority: P1

### onboarding/03-password-setup.png

What works:
- Password strength area is present.

Issues:
- Requirement chips use red-x style but not enough context.
- Continue button appears active-looking despite unmet rules.

Recommendations:
- Use checklist with clear pass/fail states and short help text.
- Synchronize button enabled state with checklist completion.

Priority: P1

### onboarding/04-otp-entry.png

What works:
- OTP fields are visually clear.

Issues:
- No timer or input auto-behavior indicators shown.

Recommendations:
- Add timer, paste support, and auto-submit on full code.

Priority: P1

### onboarding/05-biometric.png

What works:
- Good trust-focused visual metaphor.

Issues:
- No fallback option if biometrics unavailable.

Recommendations:
- Add "Skip for now" and "Use PIN instead".
- Include short privacy statement.

Priority: P1

### onboarding/06-emergency-contact.png

Issue:
- "Coming Soon" dead-end in safety-critical area.

Recommendation:
- Provide minimum viable contact form immediately.

Priority: P0

### onboarding/07-assessment-intro.png

What works:
- Strong pre-assessment framing and expectation setup.

Issues:
- Could better reassure privacy and non-diagnostic nature.

Recommendations:
- Add brief data privacy note and optional skip explanation.

Priority: P2

## 6.4 Dashboard, Mood, Chat, Journal

### dashboard/01-home-dashboard.png

What works:
- Basic shell and sectioning are clear.

Issues:
- Heavy skeleton content appears as unresolved loading, reducing perceived completeness.

Recommendations:
- Replace long-lived skeletons with first-run seeded cards and actionable prompts.

Priority: P1

### dashboard/02-score-detail.png

Issue:
- Hard-failure screen.

Recommendation:
- Replace with robust error module and fallback summary card.

Priority: P0

### mood/01-mood-dashboard.png

What works:
- Emotion-centric hero and floating add button are intuitive.

Issues:
- Weekly mood chart appears placeholder-only.

Recommendations:
- Show sample trend line on first use and explain how to add first mood log.

Priority: P1

### mood/02-mood-history.png

Issue:
- Hard-failure screen.

Recommendation:
- Add recoverable history empty/error split state.

Priority: P0

### chat/01-chats-list.png

What works:
- Clear segmentation between recent and trash.

Issues:
- Empty state lacks direct first-action CTA.

Recommendations:
- Add "Start first conversation" button and one starter prompt shortcut.

Priority: P1

### journal/01-journal-dashboard.png

What works:
- Good zero-state framing and central add affordance.

Issues:
- Stats area is empty while still occupying large visual footprint.

Recommendations:
- Add first-entry templates and preview chips (mood, gratitude, reflection).

Priority: P1

## 6.5 Profile

### profile/01-profile-dashboard.png

What works:
- Clear settings menu and account summary layout.

Issues:
- Missing profile completeness guidance and data placeholders (age, weight, height).

Recommendations:
- Add profile completeness bar and one-tap edit shortcuts.

Priority: P2

### profile/02-account-settings.png
### profile/03-notification-settings.png
### profile/04-security-settings.png
### profile/05-help-center.png
### profile/06-about.png

Issue:
- Five settings destinations resolve to hard-failure screens.

Recommendations:
- Implement minimum viable pages for each route before exposing menu links.
- If backend is pending, show structured "Available soon" card with expected capability and return action.

Priority: P0

## 7. Accessibility Checklist for Immediate Pass

1. Contrast audit on all disabled text and tertiary labels.
2. Verify all icon-only controls have accessible names.
3. Ensure all toggles and segmented controls are screen-reader navigable.
4. Verify bottom nav labels remain legible under larger text settings.
5. Validate focus order on auth and onboarding forms.

## 8. Suggested Prioritized Delivery Roadmap

## Phase 1 (P0 Stabilization)

1. Fix all hard-failure destination pages and generic error placeholders.
2. Remove onboarding dead-ends and ensure complete path to app entry.
3. Replace stigmatizing assessment labels and add safe recommendation framing.

## Phase 2 (P1 Conversion and Usability)

1. Improve auth form validation, password guidance, and OTP behaviors.
2. Add actionable empty states for chat, journal, dashboard, and mood.
3. Improve disabled-state clarity and helper copy.

## Phase 3 (P2 Polish and Cohesion)

1. Harmonize onboarding visual transitions.
2. Tighten typography hierarchy and content readability.
3. Add micro-feedback patterns (haptic and motion) for selections and completion.

## 9. Success Metrics to Track After Improvements

1. Onboarding completion rate
2. Sign-up to first-session conversion
3. Error-screen encounter rate
4. Time to first meaningful action per tab
5. Retention after first 24 hours
6. Accessibility audit pass rate

## 10. Final Recommendation

The app can become a high-quality, emotionally supportive product quickly if reliability and funnel completion are handled first. Visual style already has a strong base. Focus immediate effort on state handling, setup completion, and actionable empty states to unlock both trust and usability gains.