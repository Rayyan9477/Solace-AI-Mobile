# Batch 5: Profile Setup Completion (Screens 7-11)

**Source**: `ui-designs/Dark-mode/Profile Setup & Completion.png`
**Screens Covered**: 5 (Verification Setup, Compiling Data, Freud Score x3 states)
**Global Screen Numbers**: 21-25

---

## Screen 21: VerificationSetup

### 1. Purpose
Allow user to enable optional security/verification methods including biometric verification and app notification settings. This is the final configuration step before data compilation.

### 2. UI Structure (Visual Only)

```
[SafeAreaView - Dark Background #1C1410]
├── [StatusBar - Light content]
├── [Header]
│   ├── [BackButton - Left arrow icon]
│   └── [Title: "Verification Setup"]
│
├── [ContentArea - Centered]
│   ├── [IllustrationContainer]
│   │   └── [DocumentIllustration]
│   │       ├── [ID Card graphic with checkmark]
│   │       ├── [Person silhouette on card]
│   │       └── [Green checkmark overlay]
│   │
│   └── [OptionsContainer - Vertical stack]
│       ├── [OptionRow 1]
│       │   ├── [Checkbox - Checked/Green]
│       │   └── [Label: "Biometric Verification"]
│       │
│       └── [OptionRow 2]
│           ├── [Checkbox - Checked/Green]
│           └── [Label: "Enable Notification"]
│
├── [Spacer]
│
└── [FooterArea]
    └── [ContinueButton - Tan/Beige #C4A574]
        └── [Text: "Continue"]
```

### 3. Component List

| Component | Variant/State | Props |
|-----------|---------------|-------|
| SafeAreaView | Dark background | `backgroundColor: #1C1410` |
| BackButton | Icon only | `icon: "arrow-left"`, `onPress: fn` |
| ScreenTitle | Standard | `text: "Verification Setup"` |
| DocumentIllustration | With checkmark | Custom SVG/Image |
| CheckboxOption | Checked | `label`, `checked: boolean`, `onChange: fn` |
| CheckboxOption | Checked | `label`, `checked: boolean`, `onChange: fn` |
| PrimaryButton | Default | `text: "Continue"`, `onPress: fn` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render header with back button
- Display illustration graphic
- Render checkbox options with labels
- Display continue button
- Handle checkbox visual toggle states

**Logic (Container/Hook)**:
- Manage checkbox states (biometric, notification)
- Handle back navigation
- Handle continue action with selected options
- Save verification preferences to profile
- Request notification permissions if enabled

### 5. State Definition

```typescript
interface VerificationSetupState {
  // Local State
  biometricEnabled: boolean;      // Default: true (pre-checked)
  notificationEnabled: boolean;   // Default: true (pre-checked)
  isSubmitting: boolean;

  // Async State
  permissionStatus: 'idle' | 'requesting' | 'granted' | 'denied';
}
```

### 6. Data Models

```typescript
interface VerificationPreferences {
  biometricEnabled: boolean;
  notificationEnabled: boolean;
}

// Action payload
interface SaveVerificationAction {
  type: 'SAVE_VERIFICATION_PREFERENCES';
  payload: VerificationPreferences;
}
```

### 7. Navigation

- **Entry Points**: FingerprintSetup screen (after fingerprint setup)
- **Exit Points**:
  - Back: FingerprintSetup screen
  - Continue: CompilingData screen
- **Deep Link**: N/A (part of onboarding flow)

### 8. UI States & Edge Cases

| State | Visual Behavior |
|-------|-----------------|
| Default | Both checkboxes pre-checked |
| Biometric unchecked | First checkbox empty, second checked |
| Notification unchecked | First checkbox checked, second empty |
| Both unchecked | Both checkboxes empty (still allows continue) |
| Submitting | Button shows loading state |
| Permission denied | Show toast/alert about notification permission |

### 9. Implementation Breakdown

1. **Phase 1: Structure**
   - Create VerificationSetupScreen component
   - Add header with back navigation
   - Place illustration container

2. **Phase 2: Options**
   - Create CheckboxOption component (reusable)
   - Implement two checkbox options with labels
   - Wire up state management for checkboxes

3. **Phase 3: Actions**
   - Implement continue button
   - Add permission request logic for notifications
   - Navigate to CompilingData on success

### 10. Open Issues

| Issue | Type | Notes |
|-------|------|-------|
| What happens if biometric is enabled but device doesn't support it? | Logic | Need fallback behavior |
| Should notification permission be requested immediately or lazily? | Logic | UX decision needed |
| Are checkboxes required or optional? | Design | Can proceed with none checked? |

---

## Screen 22: CompilingData

### 1. Purpose
Transition/loading screen shown while the app compiles user profile data and calculates the initial Freud mental health score. Provides visual feedback during processing.

### 2. UI Structure (Visual Only)

```
[SafeAreaView - Dark Background #1C1410]
├── [StatusBar - Light content]
│
├── [ContentArea - Centered vertically]
│   ├── [MascotIllustration]
│   │   ├── [Character sitting in meditation pose]
│   │   ├── [Decorative waves/water element]
│   │   └── [Orange/tan color scheme]
│   │
│   ├── [Spacer - 24px]
│   │
│   ├── [StatusText]
│   │   └── [Text: "Compiling Data..."]
│   │
│   ├── [Spacer - 16px]
│   │
│   └── [LoadingIndicator]
│       └── [Spinner or progress animation]
│
└── [BottomArea - Optional decorative elements]
```

### 3. Component List

| Component | Variant/State | Props |
|-----------|---------------|-------|
| SafeAreaView | Dark background | `backgroundColor: #1C1410` |
| MascotIllustration | Meditation/Calm | Custom SVG/Image asset |
| StatusText | Centered, large | `text: "Compiling Data..."` |
| LoadingIndicator | Animated | `size: "medium"`, `color: #C4A574` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render mascot illustration
- Display status text
- Show loading animation
- Center content vertically

**Logic (Container/Hook)**:
- Trigger data compilation process
- Monitor compilation progress
- Handle compilation completion
- Navigate to appropriate score screen based on result
- Handle compilation errors

### 5. State Definition

```typescript
interface CompilingDataState {
  // Async State
  compilationStatus: 'idle' | 'compiling' | 'success' | 'error';
  progress: number;           // 0-100 if progress tracking needed
  errorMessage?: string;

  // Result State
  freudScore?: number;        // 0-100 score calculated
  scoreCategory?: 'healthy' | 'unstable' | 'critical';
}
```

### 6. Data Models

```typescript
interface CompilationResult {
  freudScore: number;
  scoreCategory: 'healthy' | 'unstable' | 'critical';
  assessmentDate: Date;
  recommendations?: string[];
}

// Score thresholds
const SCORE_THRESHOLDS = {
  healthy: { min: 70, max: 100 },
  unstable: { min: 30, max: 69 },
  critical: { min: 0, max: 29 }
};
```

### 7. Navigation

- **Entry Points**: VerificationSetup screen (after continue)
- **Exit Points**:
  - Auto-navigate to FreudScoreHealthy (score >= 70)
  - Auto-navigate to FreudScoreUnstable (score 30-69)
  - Auto-navigate to FreudScoreCritical (score < 30)
- **Deep Link**: N/A (transient screen)
- **Note**: No back navigation - this is an auto-transitioning screen

### 8. UI States & Edge Cases

| State | Visual Behavior |
|-------|-----------------|
| Compiling | Show spinner and "Compiling Data..." text |
| Success | Brief pause, then auto-navigate to score screen |
| Error | Show error message, retry option |
| Slow connection | Continue showing loading (consider timeout) |

### 9. Implementation Breakdown

1. **Phase 1: Structure**
   - Create CompilingDataScreen component
   - Add mascot illustration asset
   - Center content layout

2. **Phase 2: Loading State**
   - Implement loading indicator animation
   - Add status text

3. **Phase 3: Logic**
   - Trigger compilation API call on mount
   - Handle response and determine score category
   - Implement auto-navigation based on score

### 10. Open Issues

| Issue | Type | Notes |
|-------|------|-------|
| What data is being "compiled"? | Logic | Need API spec for compilation |
| Minimum display time? | UX | Should screen show for at least 2-3 seconds even if fast? |
| Error handling strategy | Logic | Retry? Go back? Show error screen? |
| Is progress trackable or indeterminate? | API | Determines spinner vs progress bar |

---

## Screen 23: FreudScoreHealthy

### 1. Purpose
Display the user's Freud mental health score when they are in the "healthy" category (score >= 70). Shows positive messaging and encouragement to proceed with the app.

### 2. UI Structure (Visual Only)

```
[SafeAreaView - Green/Teal Gradient Background]
├── [StatusBar - Light content]
│
├── [TopSection]
│   └── [PageTitle: "Your Freud Score"]
│
├── [ScoreDisplayArea - Centered]
│   ├── [CircularScoreContainer]
│   │   ├── [Circle background - White/Light with transparency]
│   │   ├── [ScoreNumber: "87" - Large, bold]
│   │   └── [Optional: ring/border decoration]
│   │
│   ├── [Spacer - 24px]
│   │
│   └── [MessageContainer]
│       ├── [PrimaryMessage: "You're mentally healthy"]
│       └── [SecondaryMessage: "Are you ready?"]
│
├── [Spacer]
│
└── [FooterArea]
    ├── [ScheduleButton - Secondary/Outline]
    │   └── [Text: "Schedule appointment"]
    │
    ├── [Spacer - 12px]
    │
    └── [ContinueButton - White/Primary]
        └── [Text: "Continue"]
```

### 3. Component List

| Component | Variant/State | Props |
|-----------|---------------|-------|
| SafeAreaView | Green gradient | `backgroundColor: gradient green/teal` |
| PageTitle | White text | `text: "Your Freud Score"` |
| CircularScoreDisplay | Healthy variant | `score: 87`, `variant: "healthy"` |
| MessageText | Primary | `text: "You're mentally healthy"` |
| MessageText | Secondary | `text: "Are you ready?"` |
| SecondaryButton | Outline/Ghost | `text: "Schedule appointment"`, `onPress: fn` |
| PrimaryButton | White on color | `text: "Continue"`, `onPress: fn` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render gradient background based on score category
- Display circular score container with number
- Show messaging text
- Render two action buttons
- Apply healthy color theme (green/teal)

**Logic (Container/Hook)**:
- Receive score from navigation params or global state
- Handle schedule appointment action
- Handle continue to main app action
- Track score viewing analytics

### 5. State Definition

```typescript
interface FreudScoreScreenState {
  // Props/Params
  score: number;                 // e.g., 87
  category: 'healthy';

  // Local State
  isScheduling: boolean;
  isContinuing: boolean;
}
```

### 6. Data Models

```typescript
interface FreudScoreDisplay {
  score: number;
  category: 'healthy' | 'unstable' | 'critical';
  primaryMessage: string;
  secondaryMessage: string;
  backgroundColor: string;
  actionButtons: ActionButton[];
}

// For healthy category
const healthyScoreConfig: FreudScoreDisplay = {
  score: 87,
  category: 'healthy',
  primaryMessage: "You're mentally healthy",
  secondaryMessage: "Are you ready?",
  backgroundColor: '#4A9E8C', // Green/teal
  actionButtons: [
    { type: 'secondary', text: 'Schedule appointment' },
    { type: 'primary', text: 'Continue' }
  ]
};
```

### 7. Navigation

- **Entry Points**: CompilingData screen (when score >= 70)
- **Exit Points**:
  - Schedule appointment: Appointment scheduling flow
  - Continue: Home/Main app screen
- **Deep Link**: N/A (part of onboarding flow)
- **Note**: No back navigation - score is final result of assessment

### 8. UI States & Edge Cases

| State | Visual Behavior |
|-------|-----------------|
| Default | Display score with healthy theme |
| Scheduling | Schedule button shows loading |
| Continuing | Continue button shows loading |
| Score edge (70) | Still shows healthy theme |

### 9. Implementation Breakdown

1. **Phase 1: Structure**
   - Create FreudScoreScreen component (shared across all categories)
   - Implement gradient background system
   - Create CircularScoreDisplay component

2. **Phase 2: Messaging**
   - Add dynamic messaging based on category
   - Position text elements

3. **Phase 3: Actions**
   - Implement two-button footer
   - Wire up navigation handlers
   - Add loading states for buttons

### 10. Open Issues

| Issue | Type | Notes |
|-------|------|-------|
| What does "Schedule appointment" do? | Logic | Opens calendar? External link? |
| Can user dismiss and see score later? | UX | Is score saved to profile? |
| Exact gradient colors | Design | Need precise color values |

---

## Screen 24: FreudScoreUnstable

### 1. Purpose
Display the user's Freud mental health score when they are in the "unstable" category (score 30-69). Shows concerned but supportive messaging and recommends professional consultation.

### 2. UI Structure (Visual Only)

```
[SafeAreaView - Orange/Amber Gradient Background]
├── [StatusBar - Light content]
│
├── [TopSection]
│   └── [PageTitle: "Your Freud Score"]
│
├── [ScoreDisplayArea - Centered]
│   ├── [CircularScoreContainer]
│   │   ├── [Circle background - White/Light with transparency]
│   │   ├── [ScoreNumber: "41" - Large, bold]
│   │   └── [Optional: ring/border decoration]
│   │
│   ├── [Spacer - 24px]
│   │
│   └── [MessageContainer]
│       ├── [PrimaryMessage: "You're mentally unstable"]
│       └── [SecondaryMessage: "Consult psychologist"]
│
├── [Spacer]
│
└── [FooterArea]
    ├── [ScheduleButton - Secondary/Outline]
    │   └── [Text: "Schedule appointment"]
    │
    ├── [Spacer - 12px]
    │
    └── [ContinueButton - White/Primary]
        └── [Text: "Continue"]
```

### 3. Component List

| Component | Variant/State | Props |
|-----------|---------------|-------|
| SafeAreaView | Orange gradient | `backgroundColor: gradient orange/amber` |
| PageTitle | White text | `text: "Your Freud Score"` |
| CircularScoreDisplay | Unstable variant | `score: 41`, `variant: "unstable"` |
| MessageText | Primary/Warning | `text: "You're mentally unstable"` |
| MessageText | Secondary | `text: "Consult psychologist"` |
| SecondaryButton | Outline/Ghost | `text: "Schedule appointment"`, `onPress: fn` |
| PrimaryButton | White on color | `text: "Continue"`, `onPress: fn` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render gradient background (orange/amber theme)
- Display circular score container with number
- Show warning-level messaging
- Render two action buttons
- Apply unstable color theme

**Logic (Container/Hook)**:
- Receive score from navigation params or global state
- Handle schedule appointment action (potentially prioritized)
- Handle continue action
- Track score viewing and any follow-up actions

### 5. State Definition

```typescript
interface FreudScoreScreenState {
  // Props/Params
  score: number;                 // e.g., 41
  category: 'unstable';

  // Local State
  isScheduling: boolean;
  isContinuing: boolean;
  hasAcknowledged: boolean;      // User acknowledged warning?
}
```

### 6. Data Models

```typescript
// For unstable category
const unstableScoreConfig: FreudScoreDisplay = {
  score: 41,
  category: 'unstable',
  primaryMessage: "You're mentally unstable",
  secondaryMessage: "Consult psychologist",
  backgroundColor: '#E8853A', // Orange/amber
  actionButtons: [
    { type: 'secondary', text: 'Schedule appointment' },
    { type: 'primary', text: 'Continue' }
  ]
};
```

### 7. Navigation

- **Entry Points**: CompilingData screen (when score 30-69)
- **Exit Points**:
  - Schedule appointment: Appointment scheduling flow (recommended)
  - Continue: Home/Main app screen
- **Deep Link**: N/A (part of onboarding flow)

### 8. UI States & Edge Cases

| State | Visual Behavior |
|-------|-----------------|
| Default | Display score with orange/warning theme |
| Scheduling | Schedule button shows loading |
| Continuing | Continue button shows loading |
| Score edge (30) | Still shows unstable theme |
| Score edge (69) | Still shows unstable theme |

### 9. Implementation Breakdown

1. **Phase 1: Reuse Structure**
   - Use same FreudScoreScreen component as healthy
   - Pass different category prop for theming
   - Apply orange gradient background

2. **Phase 2: Messaging**
   - Display warning-level messaging
   - Potentially add visual emphasis to "Schedule appointment"

3. **Phase 3: Actions**
   - Same button structure as healthy screen
   - Consider making schedule button more prominent

### 10. Open Issues

| Issue | Type | Notes |
|-------|------|-------|
| Should "Schedule appointment" be more prominent for unstable? | UX | Could swap button styles |
| "Mentally unstable" phrasing appropriate? | Copy | May need softer language |
| Any confirmation before continue? | UX | Should user acknowledge recommendation? |

---

## Screen 25: FreudScoreCritical

### 1. Purpose
Display the user's Freud mental health score when they are in the "critical" category (score < 30). Shows urgent messaging with immediate help resources and crisis hotline information.

### 2. UI Structure (Visual Only)

```
[SafeAreaView - Purple Gradient Background]
├── [StatusBar - Light content]
│
├── [TopSection]
│   └── [PageTitle: "Your Freud Score"]
│
├── [ScoreDisplayArea - Centered]
│   ├── [CircularScoreContainer]
│   │   ├── [Circle background - White/Light with transparency]
│   │   ├── [ScoreNumber: "16" - Large, bold]
│   │   └── [Optional: ring/border decoration]
│   │
│   ├── [Spacer - 24px]
│   │
│   └── [MessageContainer]
│       ├── [PrimaryMessage: "You're suicidal"]
│       └── [SecondaryMessage: "Please call hotline or loved ones"]
│
├── [Spacer]
│
└── [FooterArea]
    ├── [CallHotlineButton - Primary/Urgent]
    │   └── [Text: TBD - likely "Call Hotline" or "Get Help Now"]
    │
    ├── [Spacer - 12px]
    │
    └── [ContinueButton - Secondary]
        └── [Text: TBD]
```

### 3. Component List

| Component | Variant/State | Props |
|-----------|---------------|-------|
| SafeAreaView | Purple gradient | `backgroundColor: gradient purple` |
| PageTitle | White text | `text: "Your Freud Score"` |
| CircularScoreDisplay | Critical variant | `score: 16`, `variant: "critical"` |
| MessageText | Primary/Critical | `text: "You're suicidal"` |
| MessageText | Secondary/Urgent | `text: "Please call hotline or loved ones"` |
| PrimaryButton | Urgent variant | `text: TBD`, `onPress: fn`, `variant: "urgent"` |
| SecondaryButton | Standard | `text: TBD`, `onPress: fn` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render gradient background (purple/crisis theme)
- Display circular score container with number
- Show critical/urgent messaging
- Render crisis action buttons
- Apply critical color theme

**Logic (Container/Hook)**:
- Receive score from navigation params or global state
- Handle call hotline action (open phone dialer)
- Handle continue/alternative action
- Log critical score for follow-up
- Potentially trigger notification to emergency contacts

### 5. State Definition

```typescript
interface FreudScoreScreenState {
  // Props/Params
  score: number;                 // e.g., 16
  category: 'critical';

  // Local State
  isCallingHotline: boolean;
  hasDismissedWarning: boolean;

  // Crisis Resources
  hotlineNumber: string;
  emergencyContacts: Contact[];
}
```

### 6. Data Models

```typescript
// For critical category
const criticalScoreConfig: FreudScoreDisplay = {
  score: 16,
  category: 'critical',
  primaryMessage: "You're suicidal",
  secondaryMessage: "Please call hotline or loved ones",
  backgroundColor: '#7B68B5', // Purple
  actionButtons: [
    { type: 'urgent', text: 'Call Hotline' },
    { type: 'secondary', text: 'Continue' }
  ]
};

interface CrisisResources {
  hotlineNumber: string;           // e.g., "988" (US Suicide Hotline)
  localizedHotlines: HotlineInfo[];
  textLineNumber?: string;
  chatUrl?: string;
}
```

### 7. Navigation

- **Entry Points**: CompilingData screen (when score < 30)
- **Exit Points**:
  - Call Hotline: Opens phone dialer with hotline number
  - Continue: Home/Main app screen (with acknowledgment?)
- **Deep Link**: N/A (part of onboarding flow)
- **Special**: May need to prevent easy dismissal

### 8. UI States & Edge Cases

| State | Visual Behavior |
|-------|-----------------|
| Default | Display score with purple/critical theme |
| Calling hotline | Opens phone app with pre-filled number |
| Attempting continue | May show confirmation dialog |
| No phone capability (tablet) | Show text/chat alternatives |

### 9. Implementation Breakdown

1. **Phase 1: Reuse Structure**
   - Use same FreudScoreScreen component
   - Pass critical category prop for theming
   - Apply purple gradient background

2. **Phase 2: Crisis Messaging**
   - Display urgent messaging
   - Consider adding additional crisis resources
   - Add phone icon to hotline button

3. **Phase 3: Crisis Actions**
   - Implement Linking.openURL for phone call
   - Add confirmation before continue
   - Log critical score event

### 10. Open Issues

| Issue | Type | Notes |
|-------|------|-------|
| "You're suicidal" phrasing | Copy | CRITICAL - needs clinical review, may be harmful |
| Hotline number localization | Logic | Different numbers per country |
| Liability concerns | Legal | Need legal review for crisis messaging |
| Should continue be available? | UX | Or force call/text first? |
| Emergency contact notification | Feature | Auto-notify saved contacts? |
| In-app crisis chat option | Feature | Partner with crisis service? |

---

## Cross-Screen Patterns

### FreudScoreScreen Shared Component

All three score screens (Healthy, Unstable, Critical) should share a single component with category-based theming:

```typescript
interface FreudScoreScreenProps {
  score: number;
  category: 'healthy' | 'unstable' | 'critical';
}

const categoryThemes = {
  healthy: {
    gradient: ['#4A9E8C', '#3D8B7A'],
    primaryMessage: "You're mentally healthy",
    secondaryMessage: "Are you ready?",
  },
  unstable: {
    gradient: ['#E8853A', '#D4742E'],
    primaryMessage: "You're mentally unstable",
    secondaryMessage: "Consult psychologist",
  },
  critical: {
    gradient: ['#7B68B5', '#6A5AA0'],
    primaryMessage: "You're suicidal",
    secondaryMessage: "Please call hotline or loved ones",
  }
};
```

### New Components Identified

| Component | Description | Priority |
|-----------|-------------|----------|
| CheckboxOption | Labeled checkbox for settings | High |
| CircularScoreDisplay | Large score number in circle | High |
| GradientBackground | Themed gradient container | High |
| CrisisActionButton | Urgent-styled action button | Medium |
| LoadingTransition | Auto-transitioning loading screen | Medium |

---

## Summary

| # | Screen Name | Key Components | Complexity |
|---|-------------|----------------|------------|
| 21 | VerificationSetup | CheckboxOption, DocumentIllustration | Low |
| 22 | CompilingData | MascotIllustration, LoadingIndicator | Low |
| 23 | FreudScoreHealthy | CircularScoreDisplay, GradientBackground | Medium |
| 24 | FreudScoreUnstable | CircularScoreDisplay, GradientBackground | Medium |
| 25 | FreudScoreCritical | CircularScoreDisplay, GradientBackground, CrisisActionButton | Medium |

**BATCH 5 COMPLETE - Profile Setup & Completion flow fully documented**

---

## Critical Notes

1. **Crisis Messaging Review**: The "You're suicidal" messaging on the critical score screen requires immediate clinical and legal review. This phrasing could be harmful and needs to be revised by mental health professionals.

2. **Hotline Localization**: Crisis hotline numbers vary by country. Implementation must detect user locale and display appropriate local resources.

3. **Single Component Strategy**: All three score screens should be a single component with category-based theming to ensure consistency and reduce code duplication.

4. **Profile Setup Complete**: With Batch 5, all 11 Profile Setup & Completion screens are now documented. The next batch should proceed to Mental Health Assessment screens.
