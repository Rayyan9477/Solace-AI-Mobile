# UI Audit Documentation - Batch 2

## Welcome/Onboarding Feature Carousel (Steps 1-5)

**Audit Date**: 2026-01-09
**Source**: `ui-designs/Dark-mode/Welcome Screen/`
**Screens Covered**: 5 (Welcome_Screen_02 through Welcome_Screen_06)

---

## Batch 2 Overview

| # | Screen | Route Name | Step | Feature Highlighted |
|---|--------|-----------|------|---------------------|
| 6 | Welcome_Screen_02 | `OnboardingStep1` | 1 | AI Personalization |
| 7 | Welcome_Screen_03 | `OnboardingStep2` | 2 | Mood Tracking |
| 8 | Welcome_Screen_04 | `OnboardingStep3` | 3 | Journaling & Chatbot |
| 9 | Welcome_Screen_05 | `OnboardingStep4` | 4 | Mindful Resources |
| 10 | Welcome_Screen_06 | `OnboardingStep5` | 5 | Community Support |

---

## Onboarding Navigation Flow

```
Welcome Screen (01)
    │
    ▼ "Get Started"
┌────────────────┐
│ Step 1         │ Personalize Mental Health
│ (Olive Green)  │
└───────┬────────┘
        │ →
        ▼
┌────────────────┐
│ Step 2         │ Mood Tracking
│ (Orange)       │
└───────┬────────┘
        │ →
        ▼
┌────────────────┐
│ Step 3         │ Journaling & Chatbot
│ (Gray)         │
└───────┬────────┘
        │ →
        ▼
┌────────────────┐
│ Step 4         │ Mindful Resources
│ (Golden)       │
└───────┬────────┘
        │ →
        ▼
┌────────────────┐
│ Step 5         │ Community Support
│ (Purple)       │
└───────┬────────┘
        │ Complete
        ▼
   Sign Up / Sign In
```

---

## Shared Layout Structure

All 5 onboarding screens share this identical structure:

```
Screen
 └── Full Screen Container
      ├── Illustration Section (~60% height)
      │    ├── Step Badge (pill shape, top center)
      │    ├── Themed Background (color varies)
      │    └── Feature Illustration (unique per step)
      └── Content Panel (~40% height, dark brown)
           ├── Progress Indicator (5 segments)
           ├── Feature Title (with highlighted keyword)
           └── Circle Arrow Button (navigation)
```

---

## Onboarding Color Themes

| Step | Theme Color | Hex (Approx) | Emotion |
|------|-------------|--------------|---------|
| 1 | Olive Green | #6B7B3A | Calm, Natural |
| 2 | Orange/Amber | #E8853A | Emotional, Warm |
| 3 | Gray/Muted | #6B6B6B | Focused, Neutral |
| 4 | Golden/Mustard | #C4A535 | Joyful, Energetic |
| 5 | Purple/Lavender | #7B68B5 | Supportive, Loving |

---

# Screen 6: `Welcome_Screen_Screen_02.png`

## 1. Purpose

- **User goal**: Learn about the app's personalization feature
- **Primary actions**: Tap arrow to proceed to next step
- **When/why**: First step of the onboarding carousel explaining AI-powered mental health personalization

---

## 2. UI Structure (Visual Only)

```
Screen
 └── Full Screen Container
      ├── Illustration Section (olive green background ~60%)
      │    ├── Step Badge "Step One" (pill shape, top center)
      │    ├── Decorative Background (layered green shapes)
      │    └── Character Illustration
      │         └── Person meditating with hands together
      │              (curly dark hair, eyes closed, green clothing)
      └── Content Panel (dark brown, bottom ~40%)
           ├── Progress Indicator (horizontal bar, step 1 of 5)
           ├── Title Text
           │    ├── "Personalize Your Mental"
           │    ├── "Health State" (highlighted/accent color)
           │    └── "With AI"
           └── Navigation Button (circular, tan, right arrow)
```

**Components:**

| Element | Displayed Content | User Interactions | Reusable |
|---------|------------------|-------------------|----------|
| Step Badge | "Step One" in pill shape | None | Yes |
| Character Illustration | Meditative person illustration | None | No (unique) |
| Progress Indicator | Horizontal segmented bar | None | Yes |
| Title | "Personalize Your Mental Health State With AI" | None | Yes |
| Arrow Button | Circular button with → icon | Tap to next | Yes |

---

## 3. Component List

| Component Name | UI Responsibility | Reusable | Props (name: type) |
|----------------|-------------------|----------|-------------------|
| OnboardingContainer | Full-screen split layout | Yes | illustrationBg: string |
| StepBadge | Pill-shaped step indicator | Yes | stepNumber: number, label: string |
| OnboardingIllustration | Large feature illustration | No | source: ImageSource |
| ContentPanel | Dark brown bottom section | Yes | children: ReactNode |
| ProgressBar | Segmented horizontal progress | Yes | currentStep: number, totalSteps: number |
| OnboardingTitle | Title with highlighted word | Yes | text: string, highlightedWords: string[] |
| CircleArrowButton | Circular navigation button | Yes | onPress: function, direction: 'left' \| 'right' |

---

## 4. Responsibility Split

### UI Layer
- Render split layout (illustration top, content bottom)
- Display step badge positioned at top center
- Render illustration with proper aspect ratio
- Display progress bar showing step 1 of 5
- Render title with "Health State" in accent color
- Position arrow button centered at bottom

### Logic Layer
- Track current onboarding step
- Handle navigation to next step
- Update progress bar state
- Track onboarding completion for analytics

---

## 5. State Definition

```
Local State:
- None (controlled by parent)

Shared / Global State:
- currentOnboardingStep: number
- totalOnboardingSteps: number (5)

Derived State:
- progressPercentage: number (currentStep / totalSteps)
- isLastStep: boolean
```

---

## 6. Data Models

```typescript
interface OnboardingStep {
  id: number;
  stepLabel: string;
  title: string;
  highlightedWords: string[];
  illustrationSource: ImageSource;
  backgroundColor: string;
}
```

---

## 7. Navigation

- **Route name**: `OnboardingStep1` or `Onboarding` with param `step=1`
- **Incoming parameters**: step: number (optional, defaults to 1)
- **Outgoing targets**:
  - → `OnboardingStep2` (Screen 07) via arrow button
  - → `Welcome` via back gesture (if supported)
- **Trigger conditions**: User taps arrow button

---

## 8. UI States & Edge Cases

- **Loading**: N/A (static content)
- **Swipe gesture**: May support horizontal swipe to navigate
- **Accessibility**:
  - Step badge announces "Step 1 of 5"
  - Arrow button needs accessible label "Next step"
  - Illustration needs descriptive alt text

---

## 9. Implementation Breakdown

```
Step 1: Create OnboardingContainer with split layout (60/40)
Step 2: Create StepBadge component with pill styling
Step 3: Position illustration with olive green background
Step 4: Create ContentPanel with dark brown background
Step 5: Create ProgressBar with 5 segments, first active
Step 6: Create OnboardingTitle with highlight support
Step 7: Create CircleArrowButton positioned center-bottom
Step 8: Wire navigation to next step
Step 9: Add swipe gesture support (optional)
```

---

## 10. Open Issues

- [ ] Swipe navigation support (left/right)
- [ ] Back navigation behavior (skip to welcome? Previous step?)
- [ ] Illustration asset format (SVG/PNG/Lottie)
- [ ] Progress bar animation between steps
- [ ] Exact green shades for background layers

---

---

# Screen 7: `Welcome_Screen_Screen_03.png`

## 1. Purpose

- **User goal**: Learn about the app's mood tracking feature
- **Primary actions**: Tap arrow to proceed to next step
- **When/why**: Second step of onboarding explaining intelligent mood tracking and emotion insights

---

## 2. UI Structure (Visual Only)

```
Screen
 └── Full Screen Container
      ├── Illustration Section (orange/amber background ~60%)
      │    ├── Step Badge "Step Two" (pill shape, top center)
      │    ├── Decorative Background (orange gradient shapes)
      │    └── Character Illustration
      │         ├── Person crying/emotional (hand on face, tears)
      │         └── Floating Mood Emojis
      │              ├── Purple distressed face (top right)
      │              ├── Tan/beige neutral face (right)
      │              └── White sad face (left)
      └── Content Panel (dark brown, bottom ~40%)
           ├── Progress Indicator (step 2 of 5)
           ├── Title Text
           │    ├── "Intelligent" (highlighted/italic)
           │    ├── "Mood Tracking"
           │    └── "& Emotion Insights"
           └── Navigation Button (circular arrow)
```

**Components:**

| Element | Displayed Content | User Interactions | Reusable |
|---------|------------------|-------------------|----------|
| Step Badge | "Step Two" in pill shape | None | Yes |
| Character Illustration | Crying/emotional person | None | No (unique) |
| Mood Emoji Icons | 3 emotion faces floating | None | Yes |
| Progress Indicator | Step 2 highlighted | None | Yes |
| Title | "Intelligent Mood Tracking & Emotion Insights" | None | Yes |
| Arrow Button | Circular right arrow | Tap to next | Yes |

---

## 3. Component List

| Component Name | UI Responsibility | Reusable | Props (name: type) |
|----------------|-------------------|----------|-------------------|
| OnboardingContainer | Full-screen split layout | Yes | illustrationBg: string |
| StepBadge | Pill-shaped step indicator | Yes | stepNumber: number, label: string |
| OnboardingIllustration | Large feature illustration | No | source: ImageSource |
| MoodEmojiIcon | Circular emoji face | Yes | emotion: string, size: number, position: object |
| ContentPanel | Dark brown bottom section | Yes | children: ReactNode |
| ProgressBar | Segmented progress (2/5) | Yes | currentStep: number, totalSteps: number |
| OnboardingTitle | Title with "Intelligent" italic | Yes | text: string, highlightedWords: string[], highlightStyle: 'italic' \| 'color' |
| CircleArrowButton | Circular navigation button | Yes | onPress: function |

---

## 4. Responsibility Split

### UI Layer
- Render orange/amber background with gradient shapes
- Display step badge at top
- Render emotional character with floating mood emojis
- Position mood emojis at specific locations around character
- Display progress bar at step 2
- Render title with "Intelligent" in italic/accent style

### Logic Layer
- Track current step (2)
- Handle next step navigation
- Animate floating emojis (if applicable)

---

## 5. State Definition

```
Local State:
- None (controlled by parent)

Shared / Global State:
- currentOnboardingStep: number (2)

Derived State:
- isCurrentStep: boolean
```

---

## 6. Data Models

```typescript
interface MoodEmoji {
  id: string;
  emotion: 'distressed' | 'sad' | 'neutral' | 'happy' | 'excited';
  position: { x: number, y: number };
  size: number;
  color: string;
}
```

---

## 7. Navigation

- **Route name**: `OnboardingStep2` or `Onboarding` with param `step=2`
- **Incoming parameters**: step: number
- **Outgoing targets**:
  - → `OnboardingStep3` (Screen 08) via arrow button
  - ← `OnboardingStep1` via back/swipe
- **Trigger conditions**: User taps arrow button or swipes

---

## 8. UI States & Edge Cases

- **Animation**: Floating emojis may have subtle float/bob animation
- **Accessibility**:
  - Emojis need alt text ("sad face", "distressed face", etc.)
  - Progress announces "Step 2 of 5"

---

## 9. Implementation Breakdown

```
Step 1: Reuse OnboardingContainer with orange background (#E8853A)
Step 2: Position StepBadge with "Step Two"
Step 3: Render character illustration
Step 4: Create MoodEmojiIcon components with absolute positioning
Step 5: Position 3 emojis around character
Step 6: Update ProgressBar to step 2
Step 7: Render title with "Intelligent" italic styling
Step 8: Wire navigation
```

---

## 10. Open Issues

- [ ] Emoji animation (floating/bobbing effect?)
- [ ] Exact emoji designs (custom or standard?)
- [ ] Orange background gradient specifics
- [ ] Whether emojis are tappable/interactive

---

---

# Screen 8: `Welcome_Screen_Screen_04.png`

## 1. Purpose

- **User goal**: Learn about AI journaling and therapy chatbot features
- **Primary actions**: Tap arrow to proceed to next step
- **When/why**: Third step of onboarding explaining journaling and AI chatbot features

---

## 2. UI Structure (Visual Only)

```
Screen
 └── Full Screen Container
      ├── Illustration Section (gray/muted background ~60%)
      │    ├── Step Badge "Step Three" (pill shape, top center)
      │    ├── Decorative Elements (sparkles/stars)
      │    └── Character Illustration
      │         └── Person writing in journal/notebook
      │              (peaceful expression, pen in hand, gray clothing)
      └── Content Panel (dark brown, bottom ~40%)
           ├── Progress Indicator (step 3 of 5)
           ├── Title Text
           │    ├── "AI"
           │    ├── "Mental" (highlighted/accent)
           │    ├── "Journaling &"
           │    └── "AI Therapy Chatbot"
           └── Navigation Button (circular arrow)
```

**Components:**

| Element | Displayed Content | User Interactions | Reusable |
|---------|------------------|-------------------|----------|
| Step Badge | "Step Three" | None | Yes |
| Character Illustration | Person writing in journal | None | No (unique) |
| Sparkle Decorations | Star/sparkle shapes | None | Yes |
| Progress Indicator | Step 3 highlighted | None | Yes |
| Title | "AI Mental Journaling & AI Therapy Chatbot" | None | Yes |
| Arrow Button | Circular right arrow | Tap to next | Yes |

---

## 3. Component List

| Component Name | UI Responsibility | Reusable | Props (name: type) |
|----------------|-------------------|----------|-------------------|
| OnboardingContainer | Full-screen split layout | Yes | illustrationBg: string |
| StepBadge | "Step Three" pill | Yes | stepNumber: number, label: string |
| OnboardingIllustration | Journal writing scene | No | source: ImageSource |
| SparkleDecoration | Decorative sparkle/star | Yes | size: number, position: object, color: string |
| ContentPanel | Dark brown section | Yes | children: ReactNode |
| ProgressBar | Step 3 of 5 | Yes | currentStep: number, totalSteps: number |
| OnboardingTitle | Title with "Mental" highlighted | Yes | text: string, highlightedWords: string[] |
| CircleArrowButton | Navigation button | Yes | onPress: function |

---

## 4. Responsibility Split

### UI Layer
- Render gray/muted background
- Display step badge "Step Three"
- Render journaling illustration with sparkle decorations
- Display progress at step 3
- Render title with "Mental" in accent color

### Logic Layer
- Track current step (3)
- Handle navigation to step 4

---

## 5. State Definition

```
Local State:
- None

Shared / Global State:
- currentOnboardingStep: number (3)

Derived State:
- None
```

---

## 6. Data Models

```typescript
// Same OnboardingStep interface
// Sparkle positions can be defined in step data
interface SparkleConfig {
  positions: Array<{ x: number, y: number, size: number }>;
}
```

---

## 7. Navigation

- **Route name**: `OnboardingStep3` or `Onboarding` with param `step=3`
- **Incoming parameters**: step: number
- **Outgoing targets**:
  - → `OnboardingStep4` (Screen 09) via arrow
  - ← `OnboardingStep2` via back
- **Trigger conditions**: Arrow tap or swipe

---

## 8. UI States & Edge Cases

- **Animation**: Sparkles may twinkle/animate
- **Accessibility**: Illustration alt text: "Person peacefully writing in a journal"

---

## 9. Implementation Breakdown

```
Step 1: Reuse OnboardingContainer with gray background (#6B6B6B or similar)
Step 2: Position StepBadge "Step Three"
Step 3: Render journaling illustration
Step 4: Add SparkleDecoration components at specified positions
Step 5: Update ProgressBar to step 3
Step 6: Render title with "Mental" highlighted
Step 7: Wire navigation to step 4
```

---

## 10. Open Issues

- [ ] Exact gray color values
- [ ] Sparkle animation (twinkle effect?)
- [ ] Number of sparkles and exact positions

---

---

# Screen 9: `Welcome_Screen_Screen_05.png`

## 1. Purpose

- **User goal**: Learn about mindful resources feature
- **Primary actions**: Tap arrow to proceed to next step
- **When/why**: Fourth step of onboarding explaining happiness-focused mindful resources

---

## 2. UI Structure (Visual Only)

```
Screen
 └── Full Screen Container
      ├── Illustration Section (golden/mustard background ~60%)
      │    ├── Step Badge "Step Four" (pill shape, top center)
      │    ├── Decorative Background (wavy golden shapes)
      │    └── Character Illustration
      │         └── Person with arms spread wide in joy
      │              (flowing dark hair, yellow/golden dress, happy expression)
      └── Content Panel (dark brown, bottom ~40%)
           ├── Progress Indicator (step 4 of 5)
           ├── Title Text
           │    ├── "Mindful"
           │    ├── "Resources" (highlighted/accent)
           │    ├── "That"
           │    └── "Makes You Happy"
           └── Navigation Button (circular arrow)
```

**Components:**

| Element | Displayed Content | User Interactions | Reusable |
|---------|------------------|-------------------|----------|
| Step Badge | "Step Four" | None | Yes |
| Character Illustration | Joyful person with open arms | None | No (unique) |
| Wavy Background | Golden wavy decorative shapes | None | No |
| Progress Indicator | Step 4 highlighted | None | Yes |
| Title | "Mindful Resources That Makes You Happy" | None | Yes |
| Arrow Button | Circular right arrow | Tap to next | Yes |

---

## 3. Component List

| Component Name | UI Responsibility | Reusable | Props (name: type) |
|----------------|-------------------|----------|-------------------|
| OnboardingContainer | Full-screen split layout | Yes | illustrationBg: string |
| StepBadge | "Step Four" pill | Yes | stepNumber: number, label: string |
| OnboardingIllustration | Joyful person scene | No | source: ImageSource |
| ContentPanel | Dark brown section | Yes | children: ReactNode |
| ProgressBar | Step 4 of 5 | Yes | currentStep: number, totalSteps: number |
| OnboardingTitle | Title with "Resources" highlighted | Yes | text: string, highlightedWords: string[] |
| CircleArrowButton | Navigation button | Yes | onPress: function |

---

## 4. Responsibility Split

### UI Layer
- Render golden/mustard background with wavy shapes
- Display step badge "Step Four"
- Render joyful character illustration
- Display progress at step 4
- Render title with "Resources" in accent color

### Logic Layer
- Track current step (4)
- Handle navigation to final step

---

## 5. State Definition

```
Local State:
- None

Shared / Global State:
- currentOnboardingStep: number (4)

Derived State:
- isNearEnd: boolean (for potential pre-loading)
```

---

## 6. Data Models

```typescript
// Same OnboardingStep interface with golden theme
```

---

## 7. Navigation

- **Route name**: `OnboardingStep4` or `Onboarding` with param `step=4`
- **Incoming parameters**: step: number
- **Outgoing targets**:
  - → `OnboardingStep5` (Screen 10) via arrow
  - ← `OnboardingStep3` via back
- **Trigger conditions**: Arrow tap or swipe

---

## 8. UI States & Edge Cases

- **Animation**: Character may have subtle animation (hair flowing?)
- **Accessibility**: Alt text: "Person spreading arms joyfully"

---

## 9. Implementation Breakdown

```
Step 1: Reuse OnboardingContainer with golden background (#C4A535 or similar)
Step 2: Add wavy background shapes/pattern
Step 3: Position StepBadge "Step Four"
Step 4: Render joyful character illustration
Step 5: Update ProgressBar to step 4
Step 6: Render title with "Resources" highlighted
Step 7: Wire navigation to step 5
```

---

## 10. Open Issues

- [ ] Exact golden/mustard color palette
- [ ] Wavy background implementation (SVG path? Image?)
- [ ] Character hair animation (if any)

---

---

# Screen 10: `Welcome_Screen_Screen_06.png`

## 1. Purpose

- **User goal**: Learn about community support feature; complete onboarding
- **Primary actions**: Tap arrow to complete onboarding and proceed to sign-up/main flow
- **When/why**: Final step of onboarding explaining community features; transitions to authentication

---

## 2. UI Structure (Visual Only)

```
Screen
 └── Full Screen Container
      ├── Illustration Section (purple/lavender background ~60%)
      │    ├── Step Badge "Step Five" (pill shape, top center)
      │    ├── Decorative Background (purple gradient shapes)
      │    └── Community Illustration
      │         └── Multiple hands holding a heart together
      │              (diverse skin tones, purple heart, jewelry/bracelets)
      └── Content Panel (dark brown, bottom ~40%)
           ├── Progress Indicator (step 5 of 5 - complete)
           ├── Title Text
           │    ├── "Loving & Supportive"
           │    └── "Community" (highlighted/accent)
           └── Navigation Button (circular arrow - may be "complete" variant)
```

**Components:**

| Element | Displayed Content | User Interactions | Reusable |
|---------|------------------|-------------------|----------|
| Step Badge | "Step Five" | None | Yes |
| Community Illustration | Multiple hands holding purple heart | None | No (unique) |
| Progress Indicator | Step 5 complete (full) | None | Yes |
| Title | "Loving & Supportive Community" | None | Yes |
| Arrow Button | Final navigation/complete button | Tap to finish | Yes |

---

## 3. Component List

| Component Name | UI Responsibility | Reusable | Props (name: type) |
|----------------|-------------------|----------|-------------------|
| OnboardingContainer | Full-screen split layout | Yes | illustrationBg: string |
| StepBadge | "Step Five" pill | Yes | stepNumber: number, label: string |
| OnboardingIllustration | Community hands illustration | No | source: ImageSource |
| ContentPanel | Dark brown section | Yes | children: ReactNode |
| ProgressBar | Step 5 of 5 (complete) | Yes | currentStep: number, totalSteps: number |
| OnboardingTitle | Title with "Community" highlighted | Yes | text: string, highlightedWords: string[] |
| CircleArrowButton | Complete/finish button | Yes | onPress: function, variant?: 'next' \| 'complete' |

---

## 4. Responsibility Split

### UI Layer
- Render purple/lavender background
- Display final step badge "Step Five"
- Render community hands illustration
- Display progress bar at 100% (step 5 of 5)
- Render title with "Community" in accent color
- May show different button state for "complete"

### Logic Layer
- Mark onboarding as complete
- Store completion flag in persistent storage
- Navigate to sign-up or main authentication flow
- Track onboarding completion analytics

---

## 5. State Definition

```
Local State:
- None

Shared / Global State:
- currentOnboardingStep: number (5)
- hasCompletedOnboarding: boolean (set to true on exit)

Async State:
- onboardingCompletionSave: 'idle' | 'saving' | 'saved'

Derived State:
- isLastStep: boolean (true)
- canComplete: boolean
```

---

## 6. Data Models

```typescript
interface OnboardingCompletion {
  completedAt: timestamp;
  stepsViewed: number[];
  skipped: boolean;
}
```

---

## 7. Navigation

- **Route name**: `OnboardingStep5` or `Onboarding` with param `step=5`
- **Incoming parameters**: step: number
- **Outgoing targets**:
  - → `SignUp` or `SignIn` (authentication flow) via arrow/complete button
  - ← `OnboardingStep4` via back
- **Trigger conditions**:
  - User taps arrow/complete button
  - Marks onboarding as complete before navigating

---

## 8. UI States & Edge Cases

- **Complete state**: Button may change appearance (checkmark? Different color?)
- **Saving**: Brief loading while saving completion status
- **Accessibility**:
  - Alt text: "Multiple hands of different skin tones holding a purple heart together"
  - Progress announces "Step 5 of 5, onboarding complete"

---

## 9. Implementation Breakdown

```
Step 1: Reuse OnboardingContainer with purple background (#7B68B5 or similar)
Step 2: Position StepBadge "Step Five"
Step 3: Render community hands illustration
Step 4: Update ProgressBar to step 5 (full/complete state)
Step 5: Render title with "Community" highlighted
Step 6: Configure button for completion action
Step 7: Wire completion logic (save flag, navigate)
Step 8: Handle navigation to authentication flow
```

---

## 10. Open Issues

- [ ] Button variant for final step (same or different?)
- [ ] Exact purple color palette
- [ ] Where to navigate after completion (SignUp vs SignIn vs choice screen)
- [ ] Onboarding skip option (should there be one?)
- [ ] Diverse hand representation accuracy

---

---

## Shared Components for Onboarding (Batch 2)

### OnboardingContainer

```typescript
interface OnboardingContainerProps {
  illustrationBgColor: string;
  children: ReactNode; // Illustration content
  contentPanelChildren: ReactNode; // Bottom panel content
  illustrationHeightRatio?: number; // default 0.6
}
```

### StepBadge

```typescript
interface StepBadgeProps {
  stepNumber: number;
  label?: string; // e.g., "Step One", auto-generated if not provided
  variant?: 'light' | 'dark';
}
```

### ProgressBar

```typescript
interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  activeColor?: string;
  inactiveColor?: string;
  animated?: boolean;
}
```

### OnboardingTitle

```typescript
interface OnboardingTitleProps {
  parts: Array<{
    text: string;
    highlighted?: boolean;
    style?: 'normal' | 'italic';
  }>;
  // OR simpler version:
  text: string;
  highlightedWords: string[];
  highlightColor?: string;
}
```

### CircleArrowButton

```typescript
interface CircleArrowButtonProps {
  onPress: () => void;
  direction?: 'left' | 'right';
  variant?: 'next' | 'complete';
  disabled?: boolean;
  size?: number;
  backgroundColor?: string;
}
```

---

## Onboarding Data Structure

```typescript
const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    stepLabel: 'Step One',
    title: 'Personalize Your Mental Health State With AI',
    highlightedWords: ['Health State'],
    illustrationSource: require('./illustrations/step1-meditation.png'),
    backgroundColor: '#6B7B3A',
  },
  {
    id: 2,
    stepLabel: 'Step Two',
    title: 'Intelligent Mood Tracking & Emotion Insights',
    highlightedWords: ['Intelligent'],
    highlightStyle: 'italic',
    illustrationSource: require('./illustrations/step2-emotions.png'),
    backgroundColor: '#E8853A',
  },
  {
    id: 3,
    stepLabel: 'Step Three',
    title: 'AI Mental Journaling & AI Therapy Chatbot',
    highlightedWords: ['Mental'],
    illustrationSource: require('./illustrations/step3-journaling.png'),
    backgroundColor: '#6B6B6B',
  },
  {
    id: 4,
    stepLabel: 'Step Four',
    title: 'Mindful Resources That Makes You Happy',
    highlightedWords: ['Resources'],
    illustrationSource: require('./illustrations/step4-joyful.png'),
    backgroundColor: '#C4A535',
  },
  {
    id: 5,
    stepLabel: 'Step Five',
    title: 'Loving & Supportive Community',
    highlightedWords: ['Community'],
    illustrationSource: require('./illustrations/step5-community.png'),
    backgroundColor: '#7B68B5',
  },
];
```

---

## Implementation Recommendations

### Single Screen vs Multiple Screens

**Recommended**: Single `OnboardingScreen` with step parameter

```typescript
// Navigation setup
<Stack.Screen
  name="Onboarding"
  component={OnboardingScreen}
  initialParams={{ step: 1 }}
/>

// Usage
navigation.navigate('Onboarding', { step: 2 });
```

### Gesture Support

Consider implementing:
- Horizontal swipe left/right between steps
- Swipe velocity detection for smooth transitions
- Page indicator dots as alternative to progress bar

### Animation Suggestions

- Fade/slide transition between steps
- Progress bar animated fill
- Floating emoji bob animation (Step 2)
- Sparkle twinkle animation (Step 3)

---

## Next Batch Preview

**Batch 3** will cover:
- Sign_In_&_Sign_Up_Screen_01.png
- Sign_In_&_Sign_Up_Screen_02.png
- Sign_In_&_Sign_Up_Screen_03.png
- Sign_In_&_Sign_Up_Screen_04.png
- Profile_Setup_&_Completion_Screen_01.png (if only 4 sign-in screens)
