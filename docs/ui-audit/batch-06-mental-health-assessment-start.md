# Batch 6: Mental Health Assessment (Screens 1-5)

**Source**: `ui-designs/Dark-mode/Mental Health Assessment/` (individual screen files)
**Screens Covered**: 5 (Health Goal, Gender, Age, Weight, Mood)
**Global Screen Numbers**: 26-30

---

## Screen 26: AssessmentHealthGoal

### 1. Purpose
First screen of the 14-question mental health assessment flow. Captures the user's primary health goal or motivation for using the app to personalize their experience.

### 2. UI Structure (Visual Only)

```
[SafeAreaView - Dark Background #1C1410]
├── [StatusBar - Light content, 9:41]
│
├── [Header]
│   ├── [ProgressIndicator - Circular, partial fill]
│   ├── [Title: "Assessment"]
│   └── [StepCounter: "1 of 14"]
│
├── [QuestionArea]
│   └── [QuestionText: "What's your health goal for today?"]
│
├── [OptionsContainer - Vertical stack, gap ~16px]
│   ├── [SelectableOption - Default]
│   │   ├── [Icon: Heart/Love]
│   │   ├── [Label: "I wanna reduce stress"]
│   │   └── [RadioButton - Unchecked]
│   │
│   ├── [SelectableOption - Selected/Active]
│   │   ├── [Icon: Chat/Smiley]
│   │   ├── [Label: "I wanna try AI Therapy"]
│   │   └── [RadioButton - Checked]
│   │   └── [Background: Olive Green #9AAD5C]
│   │
│   ├── [SelectableOption - Default]
│   │   ├── [Icon: Flag]
│   │   ├── [Label: "I want to cope with trauma"]
│   │   └── [RadioButton - Unchecked]
│   │
│   ├── [SelectableOption - Default]
│   │   ├── [Icon: Smiley Face]
│   │   ├── [Label: "I want to be a better person"]
│   │   └── [RadioButton - Unchecked]
│   │
│   └── [SelectableOption - Default]
│       ├── [Icon: Gift/Box]
│       ├── [Label: "Just trying out the app, mate!"]
│       └── [RadioButton - Unchecked]
│
├── [Spacer]
│
└── [FooterArea]
    └── [ContinueButton - Tan/Beige #C4A574]
        ├── [Text: "Continue"]
        └── [Icon: Arrow right]
```

### 3. Component List

| Component | Variant/State | Props |
|-----------|---------------|-------|
| SafeAreaView | Dark background | `backgroundColor: #1C1410` |
| AssessmentHeader | Standard | `step: 1`, `totalSteps: 14`, `title: "Assessment"` |
| CircularProgress | Partial | `progress: 1/14`, `size: "small"` |
| QuestionText | Large | `text: "What's your health goal for today?"` |
| SelectableOption | Default | `icon`, `label`, `selected: false`, `onSelect: fn` |
| SelectableOption | Selected | `icon`, `label`, `selected: true`, `onSelect: fn` |
| ContinueButton | With arrow | `text: "Continue"`, `icon: "arrow-right"`, `onPress: fn` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render assessment header with progress
- Display question text
- Render 5 selectable option cards
- Show selected state (green background)
- Display continue button with arrow

**Logic (Container/Hook)**:
- Track selected option (single select)
- Validate selection before continue
- Save health goal to assessment state
- Navigate to next question
- Track assessment progress

### 5. State Definition

```typescript
interface AssessmentHealthGoalState {
  // Local State
  selectedGoal: HealthGoal | null;

  // Assessment Context
  currentStep: number;        // 1
  totalSteps: number;         // 14
}

type HealthGoal =
  | 'reduce_stress'
  | 'try_ai_therapy'
  | 'cope_with_trauma'
  | 'be_better_person'
  | 'just_trying';
```

### 6. Data Models

```typescript
interface HealthGoalOption {
  id: HealthGoal;
  icon: string;               // Icon name or component
  label: string;
  analyticsLabel?: string;
}

const HEALTH_GOAL_OPTIONS: HealthGoalOption[] = [
  { id: 'reduce_stress', icon: 'heart', label: 'I wanna reduce stress' },
  { id: 'try_ai_therapy', icon: 'chat-smile', label: 'I wanna try AI Therapy' },
  { id: 'cope_with_trauma', icon: 'flag', label: 'I want to cope with trauma' },
  { id: 'be_better_person', icon: 'smile', label: 'I want to be a better person' },
  { id: 'just_trying', icon: 'gift', label: 'Just trying out the app, mate!' },
];

interface AssessmentAnswer {
  questionId: string;
  questionType: 'single_select' | 'multi_select' | 'numeric' | 'scale' | 'text';
  value: any;
  answeredAt: Date;
}
```

### 7. Navigation

- **Entry Points**: FreudScore screens (after profile setup completion)
- **Exit Points**:
  - Continue: AssessmentGender screen (step 2)
  - Back: Should show confirmation modal (exit assessment?)
- **Deep Link**: N/A (part of assessment flow)

### 8. UI States & Edge Cases

| State | Visual Behavior |
|-------|-----------------|
| No selection | Continue button disabled or shows validation |
| Option selected | Selected option has green background, radio checked |
| Tap different option | Previous deselects, new option selects |
| Continue pressed | Navigate to step 2 |
| Back pressed | Show "Exit assessment?" confirmation |

### 9. Implementation Breakdown

1. **Phase 1: Assessment Shell**
   - Create AssessmentScreen wrapper component
   - Implement AssessmentHeader with progress
   - Create shared assessment navigation logic

2. **Phase 2: Question Layout**
   - Create SelectableOptionCard component
   - Implement single-select logic
   - Add icon support to options

3. **Phase 3: Flow Integration**
   - Wire up continue navigation
   - Save answer to assessment context
   - Implement back/exit handling

### 10. Open Issues

| Issue | Type | Notes |
|-------|------|-------|
| Can user go back from assessment? | UX | Need confirmation flow |
| Is selection required? | Validation | Can user skip this question? |
| Icon assets needed | Assets | Need 5 custom icons |
| "mate!" - localization | Copy | Informal language may need variants |

---

## Screen 27: AssessmentGender

### 1. Purpose
Second assessment question capturing user's gender identity with visual illustrations. Includes skip option for privacy-conscious users.

### 2. UI Structure (Visual Only)

```
[SafeAreaView - Dark Background #1C1410]
├── [StatusBar - Light content]
│
├── [Header]
│   ├── [ProgressIndicator - Circular, ~14% fill]
│   ├── [Title: "Assessment"]
│   └── [StepCounter: "2 of 14"]
│
├── [QuestionArea]
│   └── [QuestionText: "What's your official gender?"]
│
├── [GenderCardsContainer - Vertical stack]
│   ├── [GenderCard - Male]
│   │   ├── [Label: "I am Male" - Top left]
│   │   ├── [Illustration: Man with beard, green shirt]
│   │   ├── [GenderSymbol: Male symbol (bottom left)]
│   │   └── [Sparkle decorations]
│   │
│   └── [GenderCard - Female]
│       ├── [Label: "I am Female" - Top left]
│       ├── [Illustration: Woman with dark hair, orange top]
│       ├── [GenderSymbol: Female symbol (bottom left)]
│       └── [Sparkle decorations]
│
├── [SkipButton - Olive Green background]
│   ├── [Text: "Prefer to skip, thanks"]
│   └── [Icon: X/Close]
│
└── [FooterArea]
    └── [ContinueButton - Tan/Beige #C4A574]
        ├── [Text: "Continue"]
        └── [Icon: Arrow right]
```

### 3. Component List

| Component | Variant/State | Props |
|-----------|---------------|-------|
| SafeAreaView | Dark background | `backgroundColor: #1C1410` |
| AssessmentHeader | Standard | `step: 2`, `totalSteps: 14` |
| QuestionText | Large | `text: "What's your official gender?"` |
| GenderCard | Male/Unselected | `gender: "male"`, `selected: false`, `onSelect: fn` |
| GenderCard | Female/Unselected | `gender: "female"`, `selected: false`, `onSelect: fn` |
| SkipButton | Secondary | `text: "Prefer to skip, thanks"`, `icon: "x"`, `onPress: fn` |
| ContinueButton | With arrow | `text: "Continue"`, `onPress: fn` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render assessment header
- Display question text
- Render two large illustrated gender cards
- Show skip option button
- Display continue button

**Logic (Container/Hook)**:
- Track selected gender (or skipped)
- Handle card selection (mutually exclusive)
- Handle skip action
- Save to assessment state
- Navigate to next question

### 5. State Definition

```typescript
interface AssessmentGenderState {
  // Local State
  selectedGender: Gender | null;
  isSkipped: boolean;

  // Assessment Context
  currentStep: number;        // 2
}

type Gender = 'male' | 'female';
```

### 6. Data Models

```typescript
interface GenderOption {
  id: Gender;
  label: string;
  illustration: ImageSource;
  symbol: string;            // Unicode or icon name
}

const GENDER_OPTIONS: GenderOption[] = [
  {
    id: 'male',
    label: 'I am Male',
    illustration: require('./illustrations/male.png'),
    symbol: '\u2642'         // Male symbol
  },
  {
    id: 'female',
    label: 'I am Female',
    illustration: require('./illustrations/female.png'),
    symbol: '\u2640'         // Female symbol
  },
];
```

### 7. Navigation

- **Entry Points**: AssessmentHealthGoal (step 1)
- **Exit Points**:
  - Continue: AssessmentAge screen (step 3)
  - Skip: Also goes to AssessmentAge (with null value)
- **Deep Link**: N/A

### 8. UI States & Edge Cases

| State | Visual Behavior |
|-------|-----------------|
| No selection | Both cards unselected, continue enabled (skip allowed) |
| Male selected | Male card highlighted/bordered |
| Female selected | Female card highlighted/bordered |
| Skip pressed | Clear selection, proceed to next |
| Continue with selection | Save gender, proceed |
| Continue without selection | Treat as skipped |

### 9. Implementation Breakdown

1. **Phase 1: Card Component**
   - Create GenderCard component with illustration
   - Add selection state styling
   - Include gender symbol icon

2. **Phase 2: Layout**
   - Arrange two cards vertically
   - Add skip button below cards
   - Style selected state

3. **Phase 3: Logic**
   - Implement mutual exclusion
   - Handle skip flow
   - Wire up navigation

### 10. Open Issues

| Issue | Type | Notes |
|-------|------|-------|
| Non-binary/other options? | Inclusivity | Only shows Male/Female |
| "official gender" phrasing | Copy | May be confusing or inappropriate |
| Selected state styling | Design | Need visual indication for selection |
| Illustration assets | Assets | Need custom illustrations |

---

## Screen 28: AssessmentAge

### 1. Purpose
Third assessment question capturing user's age using a vertical scroll picker interface. Age is important for mental health assessment scoring.

### 2. UI Structure (Visual Only)

```
[SafeAreaView - Dark Background #1C1410]
├── [StatusBar - Light content]
│
├── [Header]
│   ├── [ProgressIndicator - Circular, ~21% fill]
│   ├── [Title: "Assessment"]
│   └── [StepCounter: "3 of 14"]
│
├── [QuestionArea]
│   └── [QuestionText: "What's your age?"]
│
├── [AgePickerContainer - Centered]
│   └── [VerticalAgePicker]
│       ├── [AgeNumber: "16" - Faded, small]
│       ├── [AgeNumber: "17" - Less faded, medium]
│       ├── [SelectedAgeContainer - Olive Green pill #9AAD5C]
│       │   └── [AgeNumber: "18" - Large, white, bold]
│       ├── [AgeNumber: "19" - Less faded, medium]
│       └── [AgeNumber: "20" - Faded, small]
│
├── [Spacer]
│
└── [FooterArea]
    └── [ContinueButton - Tan/Beige #C4A574]
        ├── [Text: "Continue"]
        └── [Icon: Arrow right]
```

### 3. Component List

| Component | Variant/State | Props |
|-----------|---------------|-------|
| SafeAreaView | Dark background | `backgroundColor: #1C1410` |
| AssessmentHeader | Standard | `step: 3`, `totalSteps: 14` |
| QuestionText | Large | `text: "What's your age?"` |
| VerticalAgePicker | Scroll picker | `value: number`, `min: number`, `max: number`, `onChange: fn` |
| SelectedValuePill | Highlighted | `backgroundColor: #9AAD5C` |
| ContinueButton | With arrow | `text: "Continue"`, `onPress: fn` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render assessment header
- Display question text
- Render vertical scroll picker
- Highlight selected age in green pill
- Apply fade effect to non-selected values
- Display continue button

**Logic (Container/Hook)**:
- Track selected age value
- Handle scroll/swipe gestures
- Validate age range (min/max)
- Save to assessment state
- Navigate to next question

### 5. State Definition

```typescript
interface AssessmentAgeState {
  // Local State
  selectedAge: number;        // Default: 18 or calculated from DOB if available

  // Picker Config
  minAge: number;             // e.g., 13 or 16
  maxAge: number;             // e.g., 100

  // Assessment Context
  currentStep: number;        // 3
}
```

### 6. Data Models

```typescript
interface AgePickerConfig {
  minAge: number;
  maxAge: number;
  defaultAge: number;
  visibleItems: number;       // Number of items visible above/below selection
}

const AGE_PICKER_CONFIG: AgePickerConfig = {
  minAge: 13,                 // Minimum age for app usage
  maxAge: 100,
  defaultAge: 18,
  visibleItems: 2,            // Shows 2 above and 2 below selected
};
```

### 7. Navigation

- **Entry Points**: AssessmentGender (step 2)
- **Exit Points**:
  - Continue: AssessmentWeight screen (step 4)
- **Deep Link**: N/A

### 8. UI States & Edge Cases

| State | Visual Behavior |
|-------|-----------------|
| Default | Age 18 selected (or user's age if known) |
| Scrolling | Smooth scroll animation, snap to nearest value |
| At min age | Cannot scroll below minimum |
| At max age | Cannot scroll above maximum |
| Continue pressed | Save age, navigate forward |

### 9. Implementation Breakdown

1. **Phase 1: Picker Component**
   - Create VerticalScrollPicker component
   - Implement scroll snap behavior
   - Add fade effect for non-selected items

2. **Phase 2: Selection Display**
   - Create highlighted pill container
   - Style selected value (large, bold, white)
   - Position pill in vertical center

3. **Phase 3: Integration**
   - Wire up scroll events to state
   - Implement min/max boundaries
   - Connect to assessment flow

### 10. Open Issues

| Issue | Type | Notes |
|-------|------|-------|
| Minimum age for app? | Legal | Need age verification policy |
| Pre-populate from profile? | UX | If user entered age in profile setup |
| Accessibility for scroll picker | A11y | Need alternative input method |
| Haptic feedback on scroll? | UX | Platform consideration |

---

## Screen 29: AssessmentWeight

### 1. Purpose
Fourth assessment question capturing user's weight with unit toggle (kg/lbs) and horizontal ruler slider. Weight data may be used for health recommendations.

### 2. UI Structure (Visual Only)

```
[SafeAreaView - Dark Background #1C1410]
├── [StatusBar - Light content]
│
├── [Header]
│   ├── [ProgressIndicator - Circular, ~28% fill]
│   ├── [Title: "Assessment"]
│   └── [StepCounter: "4 of 14"]
│
├── [QuestionArea]
│   └── [QuestionText: "What's your weight?"]
│
├── [UnitToggle - Segmented control]
│   ├── [ToggleOption: "kg" - Selected, Orange #E8853A]
│   └── [ToggleOption: "lbs" - Unselected, Dark]
│
├── [WeightDisplayArea - Centered]
│   └── [WeightValue]
│       ├── [Number: "128" - Very large, white]
│       └── [Unit: "kg" - Subscript, smaller]
│
├── [RulerSliderArea]
│   └── [HorizontalRulerSlider]
│       ├── [TickMarks - Vertical lines, varying heights]
│       ├── [Numbers: 126, 127, 128, 129]
│       ├── [CenterIndicator - Green vertical line]
│       └── [Current value highlight]
│
├── [Spacer]
│
└── [FooterArea]
    └── [ContinueButton - Tan/Beige #C4A574]
        ├── [Text: "Continue"]
        └── [Icon: Arrow right]
```

### 3. Component List

| Component | Variant/State | Props |
|-----------|---------------|-------|
| SafeAreaView | Dark background | `backgroundColor: #1C1410` |
| AssessmentHeader | Standard | `step: 4`, `totalSteps: 14` |
| QuestionText | Large | `text: "What's your weight?"` |
| SegmentedToggle | Two options | `options: ["kg", "lbs"]`, `selected: string`, `onChange: fn` |
| WeightDisplay | Large value | `value: number`, `unit: string` |
| HorizontalRulerSlider | Weight input | `value`, `min`, `max`, `step`, `onChange` |
| ContinueButton | With arrow | `text: "Continue"`, `onPress: fn` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render assessment header
- Display question text
- Render unit toggle (kg/lbs)
- Display large weight value with unit
- Render horizontal ruler slider with tick marks
- Show center indicator line
- Display continue button

**Logic (Container/Hook)**:
- Track weight value
- Track unit selection (kg/lbs)
- Convert between units when toggled
- Handle slider drag/scroll
- Validate weight range
- Save to assessment state

### 5. State Definition

```typescript
interface AssessmentWeightState {
  // Local State
  weightValue: number;        // Stored in selected unit
  weightUnit: 'kg' | 'lbs';

  // Slider Config
  minWeight: number;          // Unit-dependent
  maxWeight: number;          // Unit-dependent
  step: number;               // e.g., 1 or 0.5

  // Assessment Context
  currentStep: number;        // 4
}
```

### 6. Data Models

```typescript
interface WeightConfig {
  kg: {
    min: number;
    max: number;
    default: number;
    step: number;
  };
  lbs: {
    min: number;
    max: number;
    default: number;
    step: number;
  };
}

const WEIGHT_CONFIG: WeightConfig = {
  kg: {
    min: 30,
    max: 200,
    default: 70,
    step: 1,
  },
  lbs: {
    min: 66,
    max: 440,
    default: 154,
    step: 1,
  },
};

// Conversion helpers
const kgToLbs = (kg: number) => Math.round(kg * 2.20462);
const lbsToKg = (lbs: number) => Math.round(lbs / 2.20462);
```

### 7. Navigation

- **Entry Points**: AssessmentAge (step 3)
- **Exit Points**:
  - Continue: AssessmentMood screen (step 5)
- **Deep Link**: N/A

### 8. UI States & Edge Cases

| State | Visual Behavior |
|-------|-----------------|
| Default (kg) | "kg" toggle selected (orange), value in kg |
| Default (lbs) | "lbs" toggle selected, value in lbs |
| Toggle unit | Convert displayed value, update slider |
| Sliding ruler | Value updates smoothly |
| At min weight | Cannot slide below minimum |
| At max weight | Cannot slide above maximum |
| Continue pressed | Save weight + unit, navigate forward |

### 9. Implementation Breakdown

1. **Phase 1: Toggle Component**
   - Create SegmentedToggle component
   - Style selected state (orange background)
   - Handle toggle events

2. **Phase 2: Ruler Slider**
   - Create HorizontalRulerSlider component
   - Implement tick marks and numbers
   - Add center indicator line
   - Support drag/pan gestures

3. **Phase 3: Value Display**
   - Create large value display
   - Add unit label
   - Implement unit conversion logic

### 10. Open Issues

| Issue | Type | Notes |
|-------|------|-------|
| Pre-populate from profile? | UX | If user entered weight in profile setup |
| Decimal precision? | UX | Show 0.5 increments? |
| Skip option? | UX | Should weight be optional? |
| Haptic feedback? | UX | On slider movement |

---

## Screen 30: AssessmentMood

### 1. Purpose
Fifth assessment question capturing user's current emotional state using an interactive semicircular mood selector. This is a key input for mental health scoring.

### 2. UI Structure (Visual Only)

```
[SafeAreaView - Dark Background #1C1410]
├── [StatusBar - Light content]
│
├── [Header]
│   ├── [ProgressIndicator - Circular, ~35% fill]
│   ├── [Title: "Assessment"]
│   └── [StepCounter: "5 of 14"]
│
├── [QuestionArea]
│   └── [QuestionText: "How would you describe your mood?"]
│
├── [MoodDisplayArea - Centered]
│   ├── [MoodLabel: "I Feel Neutral."]
│   │
│   ├── [LargeMoodEmoji - Yellow neutral face]
│   │   └── [Emoji with straight mouth expression]
│   │
│   └── [SmallMoodIndicator - Below emoji]
│       └── [Curved smile/frown icon]
│
├── [MoodSelectorArea - Bottom portion]
│   └── [SemicircularMoodSelector]
│       ├── [Section 1 - Far left: Orange, Angry/Sad face]
│       ├── [Section 2 - Left: Orange-Yellow, Upset face]
│       ├── [Section 3 - Center: Yellow, Neutral face]
│       ├── [Section 4 - Right: Yellow-Green, Content face]
│       ├── [Section 5 - Far right: Green, Happy face]
│       └── [Pointer/Indicator - Brown triangle pointing to selection]
│
└── [HomeIndicator - Bottom]
```

### 3. Component List

| Component | Variant/State | Props |
|-----------|---------------|-------|
| SafeAreaView | Dark background | `backgroundColor: #1C1410` |
| AssessmentHeader | Standard | `step: 5`, `totalSteps: 14` |
| QuestionText | Large | `text: "How would you describe your mood?"` |
| MoodLabel | Dynamic | `text: string` based on selection |
| LargeMoodEmoji | Dynamic | `mood: MoodLevel` |
| SemicircularMoodSelector | Interactive | `value: MoodLevel`, `onChange: fn` |
| MoodSectionIndicator | Pointer | Shows current selection |

### 4. Responsibility Split

**UI (Presentational)**:
- Render assessment header
- Display question text
- Show dynamic mood label
- Display large emoji for current mood
- Render semicircular selector with gradient sections
- Show pointer/indicator at current position
- Each section has a face icon

**Logic (Container/Hook)**:
- Track mood value (1-5 scale or continuous)
- Handle drag/swipe on semicircle
- Update label and emoji based on selection
- Map position to mood level
- Save to assessment state
- Auto-continue or show continue button?

### 5. State Definition

```typescript
interface AssessmentMoodState {
  // Local State
  moodLevel: MoodLevel;       // 1-5 discrete or 0-1 continuous
  moodLabel: string;          // Derived from level

  // Assessment Context
  currentStep: number;        // 5
}

type MoodLevel = 1 | 2 | 3 | 4 | 5;
// 1 = Very Bad (Angry/Sad)
// 2 = Bad (Upset)
// 3 = Neutral
// 4 = Good (Content)
// 5 = Very Good (Happy)
```

### 6. Data Models

```typescript
interface MoodOption {
  level: MoodLevel;
  label: string;
  emoji: string;              // Emoji character or icon name
  color: string;              // Section color
  sectionAngle: number;       // Degrees on semicircle
}

const MOOD_OPTIONS: MoodOption[] = [
  { level: 1, label: 'I Feel Terrible.', emoji: 'angry', color: '#E8853A' },
  { level: 2, label: 'I Feel Bad.', emoji: 'sad', color: '#F4A460' },
  { level: 3, label: 'I Feel Neutral.', emoji: 'neutral', color: '#F0E68C' },
  { level: 4, label: 'I Feel Good.', emoji: 'content', color: '#9ACD32' },
  { level: 5, label: 'I Feel Great!', emoji: 'happy', color: '#9AAD5C' },
];

interface MoodSelectorConfig {
  radius: number;
  startAngle: number;         // 180 degrees (left)
  endAngle: number;           // 0 degrees (right)
  sections: number;           // 5 sections
}
```

### 7. Navigation

- **Entry Points**: AssessmentWeight (step 4)
- **Exit Points**:
  - Continue/Auto: AssessmentProfessionalHelp screen (step 6)
- **Deep Link**: N/A
- **Note**: No visible continue button - may auto-continue after selection or swipe up

### 8. UI States & Edge Cases

| State | Visual Behavior |
|-------|-----------------|
| Default | Neutral (level 3) selected, pointer at center |
| Dragging left | Move toward angry/sad, colors shift |
| Dragging right | Move toward happy, colors shift |
| Level 1 selected | Orange section, angry emoji, "I Feel Terrible." |
| Level 5 selected | Green section, happy emoji, "I Feel Great!" |
| Release after drag | Snap to nearest section |

### 9. Implementation Breakdown

1. **Phase 1: Emoji Display**
   - Create MoodEmoji component with all 5 states
   - Add smooth transition between states
   - Include small indicator icon below

2. **Phase 2: Semicircular Selector**
   - Create SemicircularMoodSelector component
   - Implement 5 colored sections with faces
   - Add draggable pointer indicator
   - Support pan/drag gestures

3. **Phase 3: State Sync**
   - Connect drag position to mood level
   - Update label and emoji reactively
   - Implement snap-to-section behavior

### 10. Open Issues

| Issue | Type | Notes |
|-------|------|-------|
| Continue button missing? | UI | Is it auto-continue or swipe gesture? |
| Continuous vs discrete? | UX | 5 levels or smooth gradient? |
| Gesture for navigation | UX | How does user proceed to next question? |
| Animation/transition | Polish | Smooth emoji morphing between states? |

---

## Cross-Screen Patterns

### Assessment Shell Component

All 14 assessment screens share a common shell:

```typescript
interface AssessmentScreenProps {
  step: number;
  totalSteps: number;
  question: string;
  children: React.ReactNode;
  onContinue: () => void;
  onBack?: () => void;
  showContinueButton?: boolean;  // Some screens may not show it
}

const AssessmentScreen: React.FC<AssessmentScreenProps> = ({
  step,
  totalSteps,
  question,
  children,
  onContinue,
  showContinueButton = true,
}) => (
  <SafeAreaView style={styles.container}>
    <AssessmentHeader step={step} totalSteps={totalSteps} />
    <QuestionText text={question} />
    {children}
    {showContinueButton && (
      <ContinueButton onPress={onContinue} />
    )}
  </SafeAreaView>
);
```

### Assessment Context/State

Shared state across all assessment questions:

```typescript
interface AssessmentState {
  currentStep: number;
  answers: Record<string, AssessmentAnswer>;
  startedAt: Date;
  completedAt?: Date;
}

interface AssessmentContextValue {
  state: AssessmentState;
  setAnswer: (questionId: string, value: any) => void;
  nextStep: () => void;
  previousStep: () => void;
  exitAssessment: () => void;
}
```

### New Components Identified

| Component | Description | Priority |
|-----------|-------------|----------|
| AssessmentHeader | Progress + title + step counter | High |
| SelectableOptionCard | Radio-style selectable card | High |
| GenderCard | Large illustrated gender option | Medium |
| VerticalScrollPicker | Age/number picker | Medium |
| HorizontalRulerSlider | Weight/numeric slider | Medium |
| SemicircularMoodSelector | Mood arc selector | High |
| MoodEmoji | Dynamic mood face | Medium |
| SegmentedToggle | kg/lbs toggle | High |

---

## Summary

| # | Screen Name | Key Components | Question Type |
|---|-------------|----------------|---------------|
| 26 | AssessmentHealthGoal | SelectableOptionCard x5 | Single select |
| 27 | AssessmentGender | GenderCard x2, SkipButton | Single select + skip |
| 28 | AssessmentAge | VerticalScrollPicker | Numeric picker |
| 29 | AssessmentWeight | SegmentedToggle, HorizontalRulerSlider | Numeric + unit |
| 30 | AssessmentMood | SemicircularMoodSelector, MoodEmoji | Scale/gradient |

**BATCH 6 COMPLETE - 5/14 Mental Health Assessment screens documented**

---

## Critical Notes

1. **Assessment Flow Architecture**: All 14 screens should share a common AssessmentScreen wrapper and use a shared AssessmentContext for state management.

2. **Back Navigation**: Need to clarify whether users can go back in the assessment and if answers are persisted.

3. **Skip/Optional Questions**: Gender has explicit skip option. Determine if other questions can be skipped.

4. **Mood Selector UX**: The semicircular mood selector is a key interaction. Ensure smooth animations and clear feedback. Continue button appears to be missing - need clarification on how user proceeds.

5. **Data Privacy**: Health data (weight, age, mood) needs careful handling per privacy regulations.
