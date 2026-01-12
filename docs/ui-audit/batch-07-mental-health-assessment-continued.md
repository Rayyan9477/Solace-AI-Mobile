# Batch 7: Mental Health Assessment (Screens 6-10)

**Source**: `ui-designs/Dark-mode/Mental Health Assessment/` (individual screen files)
**Screens Covered**: 5 (Professional Help, Physical Distress, Sleep Quality, Medications, Medication Specification)
**Global Screen Numbers**: 31-35

---

## Screen 31: AssessmentProfessionalHelp

### 1. Purpose
Sixth assessment question asking if the user has previously sought professional mental health help. This data helps understand user's familiarity with therapy and informs recommendations.

### 2. UI Structure (Visual Only)

```
[SafeAreaView - Dark Background #1C1410]
├── [StatusBar - Light content, 9:41]
│
├── [Header]
│   ├── [ProgressIndicator - Circular, ~42% fill]
│   ├── [Title: "Assessment"]
│   └── [StepCounter: "6 of 14"]
│
├── [QuestionArea]
│   └── [QuestionText: "Have you sought professional help before?"]
│
├── [IllustrationArea - Centered]
│   └── [ConfusedPersonIllustration]
│       ├── [CircularBackground - Gray/Olive toned]
│       ├── [Person figure - Orange/tan colored, seated pose]
│       ├── [Scribble/confusion lines above head - Dark squiggle]
│       ├── [Question marks - Purple "?" scattered around]
│       └── [Contemplative/worried expression]
│
├── [ButtonRow - Horizontal, 2 buttons]
│   ├── [YesButton - Olive Green #9AAD5C]
│   │   └── [Text: "Yes"]
│   │
│   └── [NoButton - Dark with border]
│       └── [Text: "No"]
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
| AssessmentHeader | Standard | `step: 6`, `totalSteps: 14` |
| QuestionText | Large | `text: "Have you sought professional help before?"` |
| ConfusedPersonIllustration | Static | Custom illustration asset |
| YesNoButtonGroup | Horizontal | `selected: 'yes' \| 'no' \| null`, `onChange: fn` |
| YesButton | Selected variant | `text: "Yes"`, `selected: boolean` |
| NoButton | Default variant | `text: "No"`, `selected: boolean` |
| ContinueButton | With arrow | `text: "Continue"`, `onPress: fn` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render assessment header with progress
- Display question text
- Render illustration in center
- Display Yes/No button row
- Show selected state (Yes is green when selected)
- Display continue button

**Logic (Container/Hook)**:
- Track Yes/No selection
- Validate selection before continue
- Save answer to assessment state
- Navigate to next question

### 5. State Definition

```typescript
interface AssessmentProfessionalHelpState {
  // Local State
  hasSoughtHelp: boolean | null;  // null = not selected

  // Assessment Context
  currentStep: number;            // 6
}
```

### 6. Data Models

```typescript
interface YesNoQuestion {
  questionId: string;
  questionText: string;
  illustration?: ImageSource;
  defaultValue?: boolean;
}

interface YesNoAnswer {
  questionId: 'professional_help';
  value: boolean;
  answeredAt: Date;
}
```

### 7. Navigation

- **Entry Points**: AssessmentMood (step 5)
- **Exit Points**:
  - Continue: AssessmentPhysicalDistress screen (step 7)
- **Deep Link**: N/A

### 8. UI States & Edge Cases

| State | Visual Behavior |
|-------|-----------------|
| No selection | Both buttons default style, continue may be disabled |
| Yes selected | Yes button green background, No button default |
| No selected | No button highlighted/bordered, Yes button default |
| Continue pressed | Save selection, navigate forward |

### 9. Implementation Breakdown

1. **Phase 1: Layout**
   - Create question layout with illustration
   - Position illustration in center
   - Add button row below illustration

2. **Phase 2: Yes/No Buttons**
   - Create YesNoButtonGroup component
   - Implement mutual exclusion
   - Style selected states

3. **Phase 3: Integration**
   - Wire up to assessment context
   - Navigate on continue

### 10. Open Issues

| Issue | Type | Notes |
|-------|------|-------|
| What counts as "professional help"? | UX | May need tooltip/clarification |
| Is selection required? | Validation | Can user skip? |
| Illustration asset needed | Assets | Custom confused person illustration |

---

## Screen 32: AssessmentPhysicalDistress

### 1. Purpose
Seventh assessment question asking about current physical pain or distress. Physical symptoms often correlate with mental health and inform holistic care recommendations.

### 2. UI Structure (Visual Only)

```
[SafeAreaView - Dark Background #1C1410]
├── [StatusBar - Light content]
│
├── [Header]
│   ├── [ProgressIndicator - Circular, ~50% fill]
│   ├── [Title: "Assessment"]
│   └── [StepCounter: "7 of 14"]
│
├── [QuestionArea]
│   └── [QuestionText: "Are you experiencing any physical distress?"]
│
├── [OptionsContainer - Vertical stack]
│   ├── [DistressOptionCard - Unselected]
│   │   ├── [IconContainer - Olive green circle]
│   │   │   └── [CheckmarkIcon - White checkmark]
│   │   ├── [TextContainer]
│   │   │   ├── [Title: "Yes, one or multiple"]
│   │   │   └── [Description: "I'm experiencing physical pain in different place over my body."]
│   │   └── [RadioButton - Right side, unchecked]
│   │
│   └── [DistressOptionCard - Selected, Olive Green background]
│       ├── [IconContainer - Dark circle]
│       │   └── [XIcon - White X]
│       ├── [TextContainer]
│       │   ├── [Title: "No Physical Pain At All"]
│       │   └── [Description: "I'm not experiencing any physical pain in my body at all :)"]
│       └── [RadioButton - Right side, checked/filled]
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
| AssessmentHeader | Standard | `step: 7`, `totalSteps: 14` |
| QuestionText | Large | `text: "Are you experiencing any physical distress?"` |
| DistressOptionCard | Unselected | `icon`, `title`, `description`, `selected: false` |
| DistressOptionCard | Selected | `icon`, `title`, `description`, `selected: true` |
| RadioButton | Checked/Unchecked | `checked: boolean` |
| ContinueButton | With arrow | `text: "Continue"`, `onPress: fn` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render assessment header
- Display question text
- Render two option cards with icons, titles, descriptions
- Show selected state (green background, filled radio)
- Display continue button

**Logic (Container/Hook)**:
- Track selected option (single select)
- Save answer to assessment state
- If "Yes" selected, may trigger follow-up questions
- Navigate to next question

### 5. State Definition

```typescript
interface AssessmentPhysicalDistressState {
  // Local State
  hasPhysicalDistress: boolean | null;

  // Assessment Context
  currentStep: number;            // 7
}
```

### 6. Data Models

```typescript
interface DistressOption {
  id: 'yes_distress' | 'no_distress';
  icon: 'check' | 'x';
  iconBackground: string;
  title: string;
  description: string;
}

const DISTRESS_OPTIONS: DistressOption[] = [
  {
    id: 'yes_distress',
    icon: 'check',
    iconBackground: '#9AAD5C',
    title: 'Yes, one or multiple',
    description: "I'm experiencing physical pain in different place over my body.",
  },
  {
    id: 'no_distress',
    icon: 'x',
    iconBackground: '#3D3D3D',
    title: 'No Physical Pain At All',
    description: "I'm not experiencing any physical pain in my body at all :)",
  },
];
```

### 7. Navigation

- **Entry Points**: AssessmentProfessionalHelp (step 6)
- **Exit Points**:
  - Continue: AssessmentSleepQuality screen (step 8)
- **Conditional**: If "Yes" selected, may show follow-up for pain location
- **Deep Link**: N/A

### 8. UI States & Edge Cases

| State | Visual Behavior |
|-------|-----------------|
| No selection | Both cards default, continue may be disabled |
| "Yes" selected | First card highlighted, second default |
| "No" selected | Second card green background, radio filled |
| Continue pressed | Save selection, navigate forward |

### 9. Implementation Breakdown

1. **Phase 1: Card Component**
   - Create DistressOptionCard component
   - Include icon container, text area, radio button
   - Support selected/unselected states

2. **Phase 2: Layout**
   - Stack two cards vertically
   - Add proper spacing

3. **Phase 3: Logic**
   - Implement single selection
   - Wire up to assessment flow

### 10. Open Issues

| Issue | Type | Notes |
|-------|------|-------|
| Grammar: "different place" | Copy | Should be "different places" |
| Follow-up for pain location? | Flow | If yes, ask where? |
| Smiley in description ":)" | Copy | Appropriate for health app? |

---

## Screen 33: AssessmentSleepQuality

### 1. Purpose
Eighth assessment question rating user's sleep quality with a vertical slider. Sleep is a critical factor in mental health assessment and scoring.

### 2. UI Structure (Visual Only)

```
[SafeAreaView - Dark Background #1C1410]
├── [StatusBar - Light content]
│
├── [Header]
│   ├── [ProgressIndicator - Circular, ~57% fill]
│   ├── [Title: "Assessment"]
│   └── [StepCounter: "8 of 14"]
│
├── [QuestionArea]
│   └── [QuestionText: "How would you rate your sleep quality?"]
│
├── [SleepSliderArea - Full width]
│   └── [VerticalSleepSlider]
│       ├── [Level 1 - Top]
│       │   ├── [Label: "Excellent"]
│       │   ├── [Sublabel: Clock icon + "7-9 HOURS"]
│       │   └── [Emoji: Green happy face with closed eyes]
│       │
│       ├── [Level 2]
│       │   ├── [Label: "Good"]
│       │   ├── [Sublabel: Clock icon + "6-7 HOURS"]
│       │   └── [Emoji: Yellow smile face]
│       │
│       ├── [Level 3]
│       │   ├── [Label: "Fair"]
│       │   ├── [Sublabel: Clock icon + "5 HOURS"]
│       │   └── [Emoji: Gray neutral face]
│       │
│       ├── [Level 4 - Currently Selected]
│       │   ├── [Label: "Poor"]
│       │   ├── [Sublabel: Clock icon + "3-4 HOURS"]
│       │   ├── [Emoji: Orange sad face]
│       │   └── [SliderThumb - Orange circular handle on track]
│       │
│       └── [Level 5 - Bottom]
│           ├── [Label: "Worst"]
│           ├── [Sublabel: Clock icon + "<3 HOURS"]
│           └── [Emoji: Purple distressed face with X eyes]
│
│       └── [SliderTrack - Vertical gradient bar, orange at bottom]
│
└── [HomeIndicator - No continue button visible]
```

### 3. Component List

| Component | Variant/State | Props |
|-----------|---------------|-------|
| SafeAreaView | Dark background | `backgroundColor: #1C1410` |
| AssessmentHeader | Standard | `step: 8`, `totalSteps: 14` |
| QuestionText | Large | `text: "How would you rate your sleep quality?"` |
| VerticalSleepSlider | Interactive | `value: SleepLevel`, `onChange: fn` |
| SleepLevelRow | Per level | `label`, `hours`, `emoji`, `isSelected` |
| SliderTrack | Vertical | Gradient bar with thumb |
| SliderThumb | Draggable | `position: number` |
| SleepEmoji | 5 variants | `level: 1-5` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render assessment header
- Display question text
- Render 5 sleep level rows with labels, hours, emojis
- Display vertical slider track with gradient
- Show draggable thumb at current position
- Highlight current selection

**Logic (Container/Hook)**:
- Track sleep quality level (1-5)
- Handle drag gestures on slider
- Snap to nearest level on release
- Save to assessment state
- Auto-continue or gesture to proceed

### 5. State Definition

```typescript
interface AssessmentSleepQualityState {
  // Local State
  sleepLevel: SleepLevel;         // 1-5, default might be 3 (Fair)
  isDragging: boolean;

  // Assessment Context
  currentStep: number;            // 8
}

type SleepLevel = 1 | 2 | 3 | 4 | 5;
// 1 = Worst (<3 hours)
// 2 = Poor (3-4 hours)
// 3 = Fair (5 hours)
// 4 = Good (6-7 hours)
// 5 = Excellent (7-9 hours)
```

### 6. Data Models

```typescript
interface SleepLevelOption {
  level: SleepLevel;
  label: string;
  hoursRange: string;
  emoji: SleepEmoji;
  emojiColor: string;
}

const SLEEP_LEVELS: SleepLevelOption[] = [
  { level: 5, label: 'Excellent', hoursRange: '7-9 HOURS', emoji: 'happy_closed', emojiColor: '#9AAD5C' },
  { level: 4, label: 'Good', hoursRange: '6-7 HOURS', emoji: 'smile', emojiColor: '#F4D03F' },
  { level: 3, label: 'Fair', hoursRange: '5 HOURS', emoji: 'neutral', emojiColor: '#9E9E9E' },
  { level: 2, label: 'Poor', hoursRange: '3-4 HOURS', emoji: 'sad', emojiColor: '#E8853A' },
  { level: 1, label: 'Worst', hoursRange: '<3 HOURS', emoji: 'distressed', emojiColor: '#7B68B5' },
];

type SleepEmoji = 'happy_closed' | 'smile' | 'neutral' | 'sad' | 'distressed';
```

### 7. Navigation

- **Entry Points**: AssessmentPhysicalDistress (step 7)
- **Exit Points**:
  - Auto/Gesture: AssessmentMedications screen (step 9)
- **Deep Link**: N/A
- **Note**: No visible continue button - may auto-continue after selection or use swipe gesture

### 8. UI States & Edge Cases

| State | Visual Behavior |
|-------|-----------------|
| Default | Thumb at middle (Fair) or based on typical sleep |
| Dragging up | Thumb moves toward Excellent, track fills green |
| Dragging down | Thumb moves toward Worst, track fills orange/purple |
| Release | Snap to nearest level |
| Level selected | Corresponding emoji highlighted |

### 9. Implementation Breakdown

1. **Phase 1: Level Rows**
   - Create SleepLevelRow component
   - Include label, hours badge, emoji
   - Position on left side

2. **Phase 2: Vertical Slider**
   - Create VerticalSlider component
   - Implement gradient track
   - Add draggable thumb
   - Support pan gestures

3. **Phase 3: Integration**
   - Sync thumb position with level
   - Implement snap behavior
   - Auto-continue logic

### 10. Open Issues

| Issue | Type | Notes |
|-------|------|-------|
| No continue button | UX | How does user proceed? Auto-continue? Swipe? |
| Inverted scale | UX | Top is best, bottom is worst - intuitive? |
| Sleep data validation | Logic | Compare stated hours vs quality label? |
| Haptic feedback | UX | Haptics on level change? |

---

## Screen 34: AssessmentMedications

### 1. Purpose
Ninth assessment question asking about medication usage with four options in a grid. Understanding medication use is crucial for mental health context and safety considerations.

### 2. UI Structure (Visual Only)

```
[SafeAreaView - Dark Background #1C1410]
├── [StatusBar - Light content]
│
├── [Header]
│   ├── [ProgressIndicator - Circular, ~64% fill]
│   ├── [Title: "Assessment"]
│   └── [StepCounter: "9 of 14"]
│
├── [QuestionArea]
│   └── [QuestionText: "Are you taking any medications?"]
│
├── [OptionsGrid - 2x2 layout]
│   ├── [Row 1]
│   │   ├── [MedicationOptionCard - Unselected]
│   │   │   ├── [Icon: Pill/Vial icon - top left]
│   │   │   └── [Label: "Prescribed Medications" - bottom left]
│   │   │
│   │   └── [MedicationOptionCard - Selected, Olive Green]
│   │       ├── [Icon: Pills/Supplements icon - top left]
│   │       └── [Label: "Over the Counter Supplements" - bottom left]
│   │
│   └── [Row 2]
│       ├── [MedicationOptionCard - Unselected]
│       │   ├── [Icon: Circle/None icon - top left]
│       │   └── [Label: "I'm not taking any" - bottom left]
│       │
│       └── [MedicationOptionCard - Unselected]
│           ├── [Icon: X icon - top left]
│           └── [Label: "Prefer not to say" - bottom left]
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
| AssessmentHeader | Standard | `step: 9`, `totalSteps: 14` |
| QuestionText | Large | `text: "Are you taking any medications?"` |
| MedicationOptionCard | Unselected | `icon`, `label`, `selected: false`, `onPress: fn` |
| MedicationOptionCard | Selected | `icon`, `label`, `selected: true`, `onPress: fn` |
| ContinueButton | With arrow | `text: "Continue"`, `onPress: fn` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render assessment header
- Display question text
- Render 2x2 grid of option cards
- Show selected state (green background)
- Display continue button

**Logic (Container/Hook)**:
- Track selected option(s) - may be multi-select or single
- Handle "Prefer not to say" as skip
- Determine if follow-up needed (if medications selected)
- Save to assessment state
- Navigate appropriately

### 5. State Definition

```typescript
interface AssessmentMedicationsState {
  // Local State
  selectedOption: MedicationOption | null;
  // OR for multi-select:
  // selectedOptions: MedicationOption[];

  // Assessment Context
  currentStep: number;            // 9
}

type MedicationOption =
  | 'prescribed'
  | 'over_counter'
  | 'none'
  | 'prefer_not_say';
```

### 6. Data Models

```typescript
interface MedicationOptionConfig {
  id: MedicationOption;
  icon: string;
  label: string;
  triggersFollowUp: boolean;
}

const MEDICATION_OPTIONS: MedicationOptionConfig[] = [
  {
    id: 'prescribed',
    icon: 'pill-vial',
    label: 'Prescribed Medications',
    triggersFollowUp: true,
  },
  {
    id: 'over_counter',
    icon: 'pills',
    label: 'Over the Counter Supplements',
    triggersFollowUp: true,
  },
  {
    id: 'none',
    icon: 'circle-slash',
    label: "I'm not taking any",
    triggersFollowUp: false,
  },
  {
    id: 'prefer_not_say',
    icon: 'x',
    label: 'Prefer not to say',
    triggersFollowUp: false,
  },
];
```

### 7. Navigation

- **Entry Points**: AssessmentSleepQuality (step 8)
- **Exit Points**:
  - If "Prescribed" or "OTC" selected: AssessmentMedicationSpecify screen (step 10)
  - If "None" or "Prefer not to say": Skip to step 11
- **Deep Link**: N/A

### 8. UI States & Edge Cases

| State | Visual Behavior |
|-------|-----------------|
| No selection | All cards default, continue disabled |
| One selected | Selected card green, others default |
| Multi-select? | TBD - may allow both prescribed + OTC |
| Continue pressed | Navigate based on selection |

### 9. Implementation Breakdown

1. **Phase 1: Grid Layout**
   - Create 2x2 grid container
   - Equal sizing for cards
   - Proper gap spacing

2. **Phase 2: Option Cards**
   - Create MedicationOptionCard component
   - Icon top-left, label bottom-left
   - Selected state styling

3. **Phase 3: Conditional Navigation**
   - Implement branching logic
   - Skip medication specification if not needed

### 10. Open Issues

| Issue | Type | Notes |
|-------|------|-------|
| Single or multi-select? | UX | Can user select both prescribed AND OTC? |
| Card aspect ratio | Design | Cards appear taller than wide |
| Icon assets | Assets | Need 4 custom icons |

---

## Screen 35: AssessmentMedicationSpecify

### 1. Purpose
Tenth assessment question - conditional follow-up for users who take medications. Provides searchable, alphabetized list for specifying which medications they take.

### 2. UI Structure (Visual Only)

```
[SafeAreaView - Dark Background #1C1410]
├── [StatusBar - Light content]
│
├── [Header]
│   ├── [ProgressIndicator - Circular, ~71% fill]
│   ├── [Title: "Assessment"]
│   └── [StepCounter: "10 of 14"]
│
├── [QuestionArea]
│   └── [QuestionText: "Please specify your medications!"]
│
├── [AlphabetNavBar - Horizontal scroll]
│   ├── [LetterButton: "A" - Selected, Orange circle]
│   ├── [LetterButton: "B" - Default]
│   ├── [LetterButton: "C" - Default]
│   ├── [LetterButton: "..." - Ellipsis]
│   ├── [LetterButton: "X" - Default]
│   ├── [LetterButton: "Y" - Default]
│   ├── [LetterButton: "Z" - Default]
│   └── [SearchIcon - Magnifying glass]
│
├── [MedicationList - Scrollable]
│   ├── [MedicationRow - Unselected]
│   │   ├── [Name: "Abilify"]
│   │   └── [RadioButton - Unchecked, right side]
│   │
│   ├── [MedicationRow - Unselected]
│   │   ├── [Name: "Abilify Maintena"]
│   │   └── [RadioButton - Unchecked]
│   │
│   ├── [MedicationRow - Selected, Olive Green background]
│   │   ├── [Name: "Abiraterone"]
│   │   └── [RadioButton - Checked/filled]
│   │
│   ├── [MedicationRow - Unselected]
│   │   ├── [Name: "Acetaminophen"]
│   │   └── [RadioButton - Unchecked]
│   │
│   └── [MedicationRow - Selected, Olive Green background]
│       ├── [Name: "Axpelliarmus"]
│       └── [RadioButton - Checked/filled]
│
├── [SelectedChipsArea]
│   ├── [Label: "Selected:"]
│   ├── [Chip: "Aspirin" with X to remove]
│   └── [Chip: "Ibuprofen" with X to remove]
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
| AssessmentHeader | Standard | `step: 10`, `totalSteps: 14` |
| QuestionText | Large | `text: "Please specify your medications!"` |
| AlphabetNavBar | Scrollable | `selectedLetter: string`, `onLetterSelect: fn`, `onSearch: fn` |
| LetterButton | Selected/Default | `letter: string`, `selected: boolean` |
| MedicationList | Scrollable | `items: Medication[]`, `selectedIds: string[]` |
| MedicationRow | Selectable | `name: string`, `selected: boolean`, `onToggle: fn` |
| SelectedChipsArea | Horizontal | `selectedItems: string[]`, `onRemove: fn` |
| RemovableChip | With X | `label: string`, `onRemove: fn` |
| ContinueButton | With arrow | `text: "Continue"`, `onPress: fn` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render assessment header
- Display question text
- Render alphabet navigation bar with search
- Display scrollable medication list
- Show selected/unselected row states
- Display selected chips at bottom
- Show continue button

**Logic (Container/Hook)**:
- Track selected medications (multi-select)
- Filter list by selected letter
- Handle search functionality
- Manage chip removal
- Load medication database
- Save to assessment state

### 5. State Definition

```typescript
interface AssessmentMedicationSpecifyState {
  // Local State
  selectedLetter: string;           // 'A' through 'Z'
  searchQuery: string;
  isSearching: boolean;
  selectedMedications: string[];    // Array of medication names/IDs

  // Data
  medications: Medication[];        // Full database
  filteredMedications: Medication[]; // Filtered by letter/search

  // Assessment Context
  currentStep: number;              // 10
}

interface Medication {
  id: string;
  name: string;
  category?: 'prescribed' | 'otc';
  commonUses?: string[];
}
```

### 6. Data Models

```typescript
interface MedicationDatabase {
  medications: Medication[];
  lastUpdated: Date;
}

// Example medications starting with 'A'
const SAMPLE_MEDICATIONS: Medication[] = [
  { id: 'abilify', name: 'Abilify' },
  { id: 'abilify_maintena', name: 'Abilify Maintena' },
  { id: 'abiraterone', name: 'Abiraterone' },
  { id: 'acetaminophen', name: 'Acetaminophen' },
  { id: 'aspirin', name: 'Aspirin' },
  { id: 'axpelliarmus', name: 'Axpelliarmus' }, // Note: fictional medication?
  // ... more medications
];

interface SelectedMedicationChip {
  id: string;
  name: string;
}
```

### 7. Navigation

- **Entry Points**: AssessmentMedications (step 9) - only if medications selected
- **Exit Points**:
  - Continue: AssessmentOtherSymptoms screen (step 11)
- **Deep Link**: N/A

### 8. UI States & Edge Cases

| State | Visual Behavior |
|-------|-----------------|
| Default | Letter 'A' selected, showing A medications |
| Letter selected | Filter list to medications starting with that letter |
| Search active | Show search input, filter by query |
| Medication selected | Row turns green, radio filled, add to chips |
| Chip removed | Remove from list selection |
| No medications for letter | Show empty state message |
| Many selected | Chips area scrolls horizontally |

### 9. Implementation Breakdown

1. **Phase 1: Alphabet Navigation**
   - Create AlphabetNavBar component
   - Horizontal scroll of letter buttons
   - Add search icon button
   - Handle letter selection

2. **Phase 2: Medication List**
   - Create scrollable FlatList
   - Implement MedicationRow component
   - Support multi-select
   - Filter by selected letter

3. **Phase 3: Selected Chips**
   - Create SelectedChipsArea component
   - Implement RemovableChip
   - Sync with list selection

4. **Phase 4: Search**
   - Implement search mode
   - Filter across all medications
   - Return to letter mode on cancel

### 10. Open Issues

| Issue | Type | Notes |
|-------|------|-------|
| "Axpelliarmus" | Data | Appears to be fictional (Harry Potter spell?) - placeholder? |
| Medication database source | Data | Need real medication database |
| How many can be selected? | UX | Any limit? |
| Search keyboard handling | UX | Dismiss keyboard on scroll? |
| Chips horizontal scroll | UI | If many selected, how to display? |
| Continue without selection | Validation | Can user skip if they said they take meds? |

---

## Cross-Screen Patterns

### Shared Assessment Components

```typescript
// Yes/No Button Pattern (Screen 31)
interface YesNoButtonGroupProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
  yesLabel?: string;
  noLabel?: string;
}

// Option Card with Description Pattern (Screen 32)
interface DetailedOptionCardProps {
  icon: IconType;
  iconBackground: string;
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}

// Grid Option Card Pattern (Screen 34)
interface GridOptionCardProps {
  icon: IconType;
  label: string;
  selected: boolean;
  onPress: () => void;
}
```

### Sleep Quality Slider Component

```typescript
interface VerticalSleepSliderProps {
  value: SleepLevel;
  onChange: (level: SleepLevel) => void;
  levels: SleepLevelOption[];
}

// Features:
// - Vertical drag gesture
// - Snap to levels
// - Gradient track
// - Emoji indicators
// - Hour labels
```

### Medication Selector Component

```typescript
interface MedicationSelectorProps {
  selectedMedications: string[];
  onSelectionChange: (medications: string[]) => void;
  medicationDatabase: Medication[];
}

// Features:
// - Alphabet navigation
// - Search functionality
// - Multi-select list
// - Selected chips display
// - Remove from chips
```

### New Components Identified

| Component | Description | Priority |
|-----------|-------------|----------|
| YesNoButtonGroup | Horizontal Yes/No buttons | High |
| DetailedOptionCard | Card with icon, title, description | High |
| VerticalSleepSlider | Sleep quality slider | High |
| SleepLevelRow | Label + hours + emoji row | Medium |
| GridOptionCard | Square card for 2x2 grid | High |
| AlphabetNavBar | A-Z navigation with search | Medium |
| MedicationRow | Selectable medication list item | Medium |
| RemovableChip | Selected item with X remove | High |
| SelectedChipsArea | Horizontal chip container | Medium |

---

## Summary

| # | Screen Name | Question Type | Key Components |
|---|-------------|---------------|----------------|
| 31 | AssessmentProfessionalHelp | Yes/No | YesNoButtonGroup, Illustration |
| 32 | AssessmentPhysicalDistress | Single select (2 detailed cards) | DetailedOptionCard |
| 33 | AssessmentSleepQuality | Vertical slider (5 levels) | VerticalSleepSlider, SleepEmoji |
| 34 | AssessmentMedications | Single/Multi select (2x2 grid) | GridOptionCard |
| 35 | AssessmentMedicationSpecify | Multi-select list + search | AlphabetNavBar, MedicationRow, RemovableChip |

**BATCH 7 COMPLETE - 10/14 Mental Health Assessment screens documented**

---

## Critical Notes

1. **Conditional Navigation**: Screen 34 (Medications) has branching logic - only show screen 35 if user selects prescribed or OTC medications.

2. **No Continue Button on Sleep Screen**: Screen 33 has no visible continue button. Need to clarify interaction pattern (auto-continue, swipe, or hidden button).

3. **Medication Database**: Screen 35 requires a real medication database. "Axpelliarmus" appears to be a placeholder/test entry.

4. **Multi-Select Considerations**: Screen 35 is clearly multi-select (shows multiple selected). Screen 34 might also benefit from multi-select (user might take both prescribed AND OTC).

5. **Grammar Issues**: Screen 32 has "different place" should be "different places".
