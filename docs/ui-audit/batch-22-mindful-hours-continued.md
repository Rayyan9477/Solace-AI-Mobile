# Batch 22: Mindful Hours Continued (Screens 2-6)

**Screens Covered**: 105-109 (Stats, Goal Selection, Duration, Soundscapes, Player)
**Source Files**: `ui-designs/Dark-mode/🔒 Mindful Hours/Mindful_Hours_Screen_02.png` through `06.png`

---

## Screen 105: MindfulHoursStats

### 1. Purpose
Analytics view showing distribution of mindful activity hours across categories (Breathing, Mindfulness, Relax, Sleep) with donut chart visualization.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [9:41]                    [Signal][Batt]│
│                                         │
│  (◐)  Mindful Hours Stats               │
│                                         │
│                                         │
│           ╭───────────────╮             │
│          ╱   ╭─────────╮   ╲            │
│         │   ╱           ╲   │           │
│         │  │   8.21h    │   │           │
│         │  │   Total    │   │           │
│         │   ╲           ╱   │           │
│          ╲   ╰─────────╯   ╱            │
│           ╰───────────────╯             │
│       (Donut chart - green, brown,      │
│        yellow, orange segments)         │
│                                         │
│  ⚙️                              ⬇️    │
│ (settings)                   (download) │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ ● Breathing           2.5h    20%  ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │ ● Mindfulness         1.7h    17%  ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │ ● Relax               8h      40%  ││
│  └─────────────────────────────────────┘│
│  ┌───────────┬─────────────────────────┐│
│  │ ● Sleep   │ + │      8h      80%  ││
│  └───────────┴─────────────────────────┘│
│             (FAB overlaps)              │
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Variant/State |
|-----------|-------------|---------------|
| BackButton | Crescent moon | Default |
| ScreenTitle | "Mindful Hours Stats" | White, header |
| DonutChart | Ring visualization | 4 segments |
| ChartCenter | Total hours display | "8.21h Total" |
| ChartSegment | Individual category | Color-coded |
| SettingsButton | Gear icon | Bottom left |
| DownloadButton | Circle with arrow | Bottom right |
| CategoryRow | Activity breakdown | List item |
| CategoryDot | Colored indicator | Per category |
| CategoryLabel | Activity name | Left-aligned |
| CategoryHours | Time value | Right side |
| CategoryPercent | Percentage | Far right |
| FloatingActionButton | Plus button | Overlapping list |

### 4. Responsibility Split

**UI Layer (Presentational)**:
- Render donut chart with segments
- Display total in center
- Show category breakdown list
- Position action buttons
- Handle interactions

**Logic Layer (Container/Hooks)**:
- Fetch activity data by category
- Calculate totals and percentages
- Generate chart segment sizes
- Handle export/download
- Navigate to add new activity

### 5. State Definition

```typescript
interface MindfulHoursStatsState {
  // Data
  totalHours: number;
  categoryBreakdown: CategoryStats[];

  // UI State
  isLoading: boolean;
  selectedCategory: string | null;
}

interface CategoryStats {
  category: MindfulCategory;
  hours: number;
  percentage: number;
  color: string;
}

type MindfulCategory = 'Breathing' | 'Mindfulness' | 'Relax' | 'Sleep';
```

### 6. Data Models

```typescript
const categoryColors: Record<MindfulCategory, string> = {
  Breathing: '#9AAD5C',    // Green
  Mindfulness: '#E8853A',  // Orange
  Relax: '#C4A535',        // Yellow/Gold
  Sleep: '#E8853A'         // Orange (same as Mindfulness?)
};

// Data from design (NOTE: Has math issues)
const sampleStats: CategoryStats[] = [
  { category: 'Breathing', hours: 2.5, percentage: 20, color: '#9AAD5C' },
  { category: 'Mindfulness', hours: 1.7, percentage: 17, color: '#E8853A' },
  { category: 'Relax', hours: 8, percentage: 40, color: '#C4A535' },
  { category: 'Sleep', hours: 8, percentage: 80, color: '#E8853A' }
];

// Math check:
// Hours: 2.5 + 1.7 + 8 + 8 = 20.2h (but shows 8.21h total)
// Percentages: 20 + 17 + 40 + 80 = 157% (impossible)
```

### 7. Navigation

| Action | Destination | Parameters |
|--------|-------------|------------|
| Back button | MindfulHoursDashboard | - |
| Settings button | MindfulSettings | - |
| Download button | Export data | Generate report |
| FAB (+) button | NewExerciseGoal | - |
| Category row tap | CategoryDetail | `{ category: string }` |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Loading | Skeleton chart and list |
| No data | "Start tracking" message |
| Single category | Full ring in one color |
| Export in progress | Loading on download button |
| Long category names | Truncate with ellipsis |

### 9. Implementation Breakdown

1. **DonutChart Component**
   - SVG-based ring chart
   - Segments proportional to percentages
   - Hole in center for total display
   - Animated on load

2. **ChartCenter Component**
   - Positioned in donut hole
   - Large hour value
   - "Total" label below

3. **CategoryRow Component**
   - Colored dot indicator
   - Category name
   - Hours value
   - Percentage value
   - Tap for detail

### 10. Open Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| 105-1 | **Data inconsistency** | High | Hours don't sum to total (20.2h ≠ 8.21h) |
| 105-2 | **Percentages exceed 100%** | High | 20+17+40+80 = 157% |
| 105-3 | Same color for two categories | Low | Mindfulness and Sleep both orange |

---

## Screen 106: NewExerciseGoal

### 1. Purpose
First step of new mindful exercise wizard - selecting the user's primary goal for the exercise session.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [9:41]                    [Signal][Batt]│
│                                         │
│  (◐)  New Exercise            1 of 3    │
│                                         │
│    What's your mindful                  │
│    exercise goal?                       │
│                                         │
│  ┌──────────────┐  ┌──────────────┐    │
│  │      ○       │  │      ○       │    │
│  │              │  │              │    │
│  │   [target]   │  │   [moon]     │    │
│  │              │  │              │    │
│  │ I want to    │  │ I want to    │    │
│  │ gain more    │  │ sleep        │    │
│  │ focus        │  │ better       │    │
│  └──────────────┘  └──────────────┘    │
│                                         │
│  ┌──────────────┐  ┌──────────────┐    │
│  │      ●       │  │      ○       │    │
│  │  (selected)  │  │              │    │
│  │   [heart]    │  │  [person]    │    │
│  │   (green)    │  │              │    │
│  │ I want to    │  │ I want to    │    │
│  │ be a better  │  │ conquer my   │    │
│  │ person       │  │ trauma       │    │
│  └──────────────┘  └──────────────┘    │
│                                         │
│  ┌──────────────┐  ┌──────────────┐    │
│  │      ○       │  │      ○       │    │
│  │ I want to    │  │ I want to    │    │
│  │ enjoy        │  │ be a         │    │
│  └──────────────┘  └──────────────┘    │
│  (truncated)        (truncated)         │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │        Continue  →                  ││
│  └─────────────────────────────────────┘│
│                                         │
│           ●──────○──────○              │
│           (step indicator)              │
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Variant/State |
|-----------|-------------|---------------|
| BackButton | Crescent moon | Default |
| ScreenTitle | "New Exercise" | White, header |
| StepIndicator | "1 of 3" | Gray pill |
| QuestionTitle | Goal question | Large, white |
| GoalGrid | 2-column card grid | Scrollable |
| GoalCard | Individual goal option | Radio selection |
| RadioIndicator | Circle in corner | Selected/unselected |
| GoalIcon | Category icon | Centered in card |
| GoalLabel | Goal description | Below icon |
| ContinueButton | "Continue →" | Full-width, tan |
| ProgressDots | Step progress | Bottom center |

### 4. Responsibility Split

**UI Layer (Presentational)**:
- Render goal option cards in grid
- Show selection state with radio indicator
- Display icons for each goal
- Handle card tap for selection
- Position continue button

**Logic Layer (Container/Hooks)**:
- Track selected goal
- Validate selection before continue
- Navigate to next step
- Store goal in wizard state

### 5. State Definition

```typescript
interface NewExerciseGoalState {
  // Selection
  selectedGoal: ExerciseGoal | null;
  availableGoals: GoalOption[];

  // Wizard State
  currentStep: number; // 1 of 3

  // UI State
  isSubmitting: boolean;
}

interface GoalOption {
  id: string;
  label: string;
  icon: IconType;
  category: ExerciseGoal;
}

type ExerciseGoal =
  | 'focus'
  | 'sleep'
  | 'better_person'
  | 'trauma'
  | 'enjoyment'
  | 'other';
```

### 6. Data Models

```typescript
const exerciseGoals: GoalOption[] = [
  {
    id: 'focus',
    label: 'I want to gain more focus',
    icon: 'target',
    category: 'focus'
  },
  {
    id: 'sleep',
    label: 'I want to sleep better',
    icon: 'moon',
    category: 'sleep'
  },
  {
    id: 'better_person',
    label: 'I want to be a better person',
    icon: 'heart',
    category: 'better_person'
  },
  {
    id: 'trauma',
    label: 'I want to conquer my trauma',
    icon: 'person',
    category: 'trauma'
  },
  {
    id: 'enjoyment',
    label: 'I want to enjoy life more', // Full text assumed
    icon: 'smile',
    category: 'enjoyment'
  },
  {
    id: 'other',
    label: 'I want to be a better...',  // Full text unclear
    icon: 'meditation',
    category: 'other'
  }
];
```

### 7. Navigation

| Action | Destination | Parameters |
|--------|-------------|------------|
| Back button | MindfulHoursDashboard | Cancel wizard |
| Continue button | NewExerciseDuration | `{ goal: ExerciseGoal }` |
| Card tap | Update selection | - |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| No selection | Continue button disabled |
| Selection made | Card highlighted green, continue enabled |
| Many goals | Scrollable grid |
| Long text | Multi-line in card |

### 9. Implementation Breakdown

1. **GoalGrid Component**
   - 2-column layout
   - Scrollable if many options
   - Gap between cards

2. **GoalCard Component**
   - Brown background (unselected)
   - Green background (selected)
   - Radio indicator top-left
   - Icon centered
   - Label multi-line at bottom

3. **Step Indicator**
   - "1 of 3" text in pill
   - Progress dots at bottom

### 10. Open Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| 106-1 | Truncated goal labels | Medium | "I want to enjoy" and "I want to be a" cut off |
| 106-2 | Trauma as goal option | Low | Sensitive topic - may need clinical review |

---

## Screen 107: NewExerciseDuration

### 1. Purpose
Second step of wizard - selecting the duration for the mindful exercise session with time picker and sound preview.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [9:41]                    [Signal][Batt]│
│                                         │
│  (◐)  New Exercise            2 of 3    │
│                                         │
│                                         │
│    How much time do you                 │
│    have for exercise?                   │
│                                         │
│                                         │
│                                         │
│       ╭─────────────────────╮           │
│       │                     │           │
│       │       25:00         │           │
│       │                     │           │
│       ╰─────────────────────╯           │
│       (green pill/oval)                 │
│                                         │
│              Minutes                    │
│                                         │
│                                         │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ 🔊 Sound: Chirping Birds            ││
│  └─────────────────────────────────────┘│
│  (pill button)                          │
│                                         │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │        Continue  →                  ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Variant/State |
|-----------|-------------|---------------|
| BackButton | Crescent moon | Default |
| ScreenTitle | "New Exercise" | White, header |
| StepIndicator | "2 of 3" | Gray pill |
| QuestionTitle | Duration question | Large, white |
| TimePicker | Large time display | "25:00" in green pill |
| TimeLabel | "Minutes" | Below picker |
| SoundPreviewButton | Current sound selection | Pill with speaker icon |
| SoundIcon | Speaker symbol | In button |
| SoundLabel | "Chirping Birds" | In button |
| ContinueButton | "Continue →" | Full-width, tan |

### 4. Responsibility Split

**UI Layer (Presentational)**:
- Display time picker/display
- Show current sound selection
- Render continue button
- Handle interactions

**Logic Layer (Container/Hooks)**:
- Track selected duration
- Store sound selection
- Navigate between steps
- Validate time selection

### 5. State Definition

```typescript
interface NewExerciseDurationState {
  // Selection
  durationMinutes: number; // 25 default
  selectedSound: Soundscape;

  // Wizard State
  currentStep: number; // 2 of 3
  goal: ExerciseGoal; // From step 1

  // UI State
  isPickerOpen: boolean;
}
```

### 6. Data Models

```typescript
interface DurationOption {
  minutes: number;
  label: string;
}

const durationPresets: DurationOption[] = [
  { minutes: 5, label: '5 min' },
  { minutes: 10, label: '10 min' },
  { minutes: 15, label: '15 min' },
  { minutes: 20, label: '20 min' },
  { minutes: 25, label: '25 min' },
  { minutes: 30, label: '30 min' },
  { minutes: 45, label: '45 min' },
  { minutes: 60, label: '1 hour' }
];

// Format time for display
function formatDuration(minutes: number): string {
  return `${minutes}:00`;
}
```

### 7. Navigation

| Action | Destination | Parameters |
|--------|-------------|------------|
| Back button | NewExerciseGoal | Keep previous selection |
| Sound button | SoundscapeSelector | - |
| Time tap | Time picker modal | - |
| Continue button | SoundscapeSelector | `{ duration: number, sound: string }` |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Default | 25 minutes selected |
| Time picker open | Show picker modal/wheel |
| Custom time | Allow manual entry |
| No sound selected | Default to "Chirping Birds" |

### 9. Implementation Breakdown

1. **TimePicker Component**
   - Large green pill display
   - Tap to open picker
   - Show MM:SS format
   - Could use wheel picker or presets

2. **SoundPreviewButton Component**
   - Speaker icon
   - Current sound name
   - Tap to change selection
   - Could play preview on long-press

### 10. Open Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| 107-1 | Time picker behavior | Low | Is it a wheel, presets, or free entry? |
| 107-2 | Sound button navigation | Low | Does this go to step 3 or separate screen? |

---

## Screen 108: SoundscapeSelector

### 1. Purpose
Third and final step of wizard - selecting ambient soundscape for the exercise session with audio visualization and search.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [9:41]                    [Signal][Batt]│
│                                         │
│  (◐)  New Exercise            3 of 3    │
│                                         │
│                                         │
│        Select Soundscapes               │
│                                         │
│                                         │
│                                         │
│    ┌───────────────────────────────┐    │
│    │                               │    │
│    │    ▌▌▌▌▌████▌▌▌▌▌▌▌████▌▌▌   │    │
│    │    ▌▌▌█████████▌▌█████████▌  │    │
│    │    (Audio waveform visual)    │    │
│    │                               │    │
│    └───────────────────────────────┘    │
│                                         │
│  ┌─────┐ ┌────────────┐ ┌─────────────┐│
│  │Birds│ │ Zen Garden │ │Mountain Str.││
│  └─────┘ └────────────┘ └─────────────┘│
│  (gray)    (SELECTED)       (gray)      │
│           (orange bg)                   │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ 🔍 Search Soundscapes               ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │        Continue  →                  ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Variant/State |
|-----------|-------------|---------------|
| BackButton | Crescent moon | Default |
| ScreenTitle | "New Exercise" | White, header |
| StepIndicator | "3 of 3" | Gray pill |
| SectionTitle | "Select Soundscapes" | Large, white |
| AudioWaveform | Sound visualization | Animated bars |
| SoundscapeChips | Horizontal scroll | Chip buttons |
| SoundscapeChip | Individual option | Selected (orange) / Unselected |
| SearchInput | Search soundscapes | With magnifier icon |
| ContinueButton | "Continue →" | Full-width, tan |

### 4. Responsibility Split

**UI Layer (Presentational)**:
- Display audio waveform visualization
- Render soundscape chip options
- Show search input
- Handle chip selection
- Play audio preview

**Logic Layer (Container/Hooks)**:
- Fetch available soundscapes
- Handle search filtering
- Play audio preview on selection
- Store final selection
- Complete wizard and start session

### 5. State Definition

```typescript
interface SoundscapeSelectorState {
  // Selection
  selectedSoundscape: Soundscape | null;
  availableSoundscapes: Soundscape[];

  // Search
  searchQuery: string;
  filteredSoundscapes: Soundscape[];

  // Audio Preview
  isPlaying: boolean;
  previewAudioLevel: number[]; // For waveform

  // Wizard State
  currentStep: number; // 3 of 3
  goal: ExerciseGoal;
  duration: number;
}
```

### 6. Data Models

```typescript
interface Soundscape {
  id: string;
  name: string;
  category: SoundscapeCategory;
  audioUrl: string;
  duration?: number; // If has fixed length
  isLooping: boolean;
}

type SoundscapeCategory = 'nature' | 'ambient' | 'music' | 'meditation';

const availableSoundscapes: Soundscape[] = [
  { id: 'birds', name: 'Birds', category: 'nature', audioUrl: '...', isLooping: true },
  { id: 'zen', name: 'Zen Garden', category: 'ambient', audioUrl: '...', isLooping: true },
  { id: 'stream', name: 'Mountain Stream', category: 'nature', audioUrl: '...', isLooping: true },
  { id: 'hiking', name: 'Hiking Trail', category: 'nature', audioUrl: '...', isLooping: true },
  // ... more soundscapes
];
```

### 7. Navigation

| Action | Destination | Parameters |
|--------|-------------|------------|
| Back button | NewExerciseDuration | Keep selections |
| Chip tap | Update selection | Play preview |
| Search focus | Filter results | - |
| Continue button | BreathingExercisePlayer | Start session |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Loading soundscapes | Skeleton chips |
| No search results | "No soundscapes found" |
| Audio playing | Waveform animates |
| Audio paused | Waveform static |
| Many soundscapes | Horizontal scroll |

### 9. Implementation Breakdown

1. **AudioWaveform Component**
   - Vertical bars visualization
   - Animate based on audio levels
   - Brown/tan color scheme
   - Center-weighted layout

2. **SoundscapeChips Component**
   - Horizontal scrolling row
   - Single selection
   - Selected chip: Orange background
   - Unselected: Gray outline

3. **SearchInput Component**
   - Magnifier icon
   - Placeholder text
   - Filter soundscapes on type
   - Clear button when text present

### 10. Open Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| 108-1 | Truncated chip labels | Low | "Mountain Str." and "Hi..." cut off |
| 108-2 | Preview on selection | Low | Does audio preview play automatically? |

---

## Screen 109: BreathingExercisePlayer

### 1. Purpose
Active breathing exercise session player with guided instructions, ambient sound, progress tracking, and playback controls.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [9:41]                    [Signal][Batt]│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ 🔊 SOUND: CHIRPING BIRDS            ││
│  └─────────────────────────────────────┘│
│  (center, white on green)               │
│                                         │
│                                         │
│                                         │
│         ╭───────────────────╮           │
│        ╱   ╭─────────────╮   ╲          │
│       │   ╱               ╲   │         │
│       │  │   ╭─────────╮  │   │         │
│       │  │   │Breathe  │  │   │         │
│       │  │   │ In...   │  │   │         │
│       │  │   ╰─────────╯  │   │         │
│       │   ╲               ╱   │         │
│        ╲   ╰─────────────╯   ╱          │
│         ╰───────────────────╯           │
│    (Concentric circles - pulsing)       │
│                                         │
│                                         │
│                                         │
│  05:21 ━━━━━━●━━━━━━━━━━━━━━━━━ 25:00   │
│         (progress bar)                  │
│                                         │
│       ↺           ⏸           ↻        │
│    (rewind)    (pause)    (forward)     │
│                                         │
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Variant/State |
|-----------|-------------|---------------|
| SoundBadge | Current soundscape | "CHIRPING BIRDS" pill |
| SpeakerIcon | Audio indicator | In badge |
| BreathingCircle | Animated concentric rings | Pulsing animation |
| InstructionText | "Breathe In..." | Center of circles |
| ProgressBar | Session progress | With time labels |
| CurrentTime | Elapsed time | "05:21" left side |
| TotalTime | Session duration | "25:00" right side |
| ProgressIndicator | Position dot | On progress bar |
| PlaybackControls | Control buttons | Bottom row |
| RewindButton | Curved left arrow | Skip back |
| PauseButton | Pause icon in circle | Center, white |
| ForwardButton | Curved right arrow | Skip forward |

### 4. Responsibility Split

**UI Layer (Presentational)**:
- Full-screen green background
- Animated breathing circle
- Display instruction text
- Show progress bar
- Render playback controls

**Logic Layer (Container/Hooks)**:
- Manage breathing cycle timing
- Control audio playback
- Track session progress
- Handle pause/resume
- Update instruction text
- Save session on completion

### 5. State Definition

```typescript
interface BreathingExercisePlayerState {
  // Session Data
  sessionId: string;
  goal: ExerciseGoal;
  totalDuration: number; // seconds
  soundscape: Soundscape;

  // Progress
  elapsedTime: number; // seconds
  isPlaying: boolean;
  isPaused: boolean;

  // Breathing State
  breathingPhase: BreathingPhase;
  cycleCount: number;

  // Animation
  circleScale: number; // For pulsing
}

type BreathingPhase = 'breathe_in' | 'hold' | 'breathe_out' | 'rest';
```

### 6. Data Models

```typescript
interface BreathingCycle {
  breatheIn: number;  // seconds
  hold: number;       // seconds
  breatheOut: number; // seconds
  rest: number;       // seconds
}

// Common breathing patterns
const breathingPatterns: Record<string, BreathingCycle> = {
  relaxation: {
    breatheIn: 4,
    hold: 4,
    breatheOut: 4,
    rest: 2
  },
  box: {
    breatheIn: 4,
    hold: 4,
    breatheOut: 4,
    rest: 4
  },
  calm: {
    breatheIn: 4,
    hold: 7,
    breatheOut: 8,
    rest: 0
  }
};

interface SessionProgress {
  elapsed: number;
  total: number;
  percentage: number;
  formattedElapsed: string; // "05:21"
  formattedTotal: string;   // "25:00"
}
```

### 7. Navigation

| Action | Destination | Parameters |
|--------|-------------|------------|
| Pause button | Pause session | - |
| Rewind button | Skip back 15s | - |
| Forward button | Skip forward 15s | - |
| Session complete | SessionSummary | `{ session: Session }` |
| Swipe down / Back | Confirmation modal | Exit session? |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Playing | Circles pulsing, audio playing |
| Paused | Circles frozen, show play button |
| Breathe In | Circles expand, text updates |
| Hold | Circles hold, text "Hold..." |
| Breathe Out | Circles contract, text "Breathe Out..." |
| Session ending | "Last 30 seconds" notice |
| Session complete | Navigate to summary |

### 9. Implementation Breakdown

1. **BreathingCircle Component**
   - Concentric rings (3-4 levels)
   - Scale animation synced to breathing
   - Expand on inhale, contract on exhale
   - Smooth easing functions

2. **InstructionText Component**
   - "Breathe In..." / "Hold..." / "Breathe Out..."
   - Centered in circles
   - Fades/transitions between phases

3. **ProgressBar Component**
   - Horizontal track
   - Filled portion shows progress
   - Draggable dot for seeking
   - Time labels at ends

4. **PlaybackControls Component**
   - Three buttons: Rewind, Pause/Play, Forward
   - Pause button larger/prominent
   - Skip amount configurable (15s default)

5. **Breathing Animation Logic**
   - Timer-based cycle management
   - Sync animation scale to phase
   - Visual and audio coordination
   - Haptic feedback optional

### 10. Open Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| 109-1 | Skip amount unclear | Low | How many seconds do rewind/forward skip? |
| 109-2 | Exit handling | Low | How does user exit mid-session? |
| 109-3 | Breathing pattern source | Low | Is this configurable or fixed? |

---

## Cross-Screen Components (Batch 22)

### New Components Identified

| Component | Used In | Priority |
|-----------|---------|----------|
| DonutChart | Screen 105 | High |
| DonutSegment | Screen 105 | Medium |
| ChartCenterDisplay | Screen 105 | Medium |
| CategoryStatRow | Screen 105 | Medium |
| StepIndicatorPill | Screens 106-108 | Medium |
| GoalGrid | Screen 106 | Medium |
| GoalCard | Screen 106 | High |
| RadioIndicator | Screen 106 | Low |
| LargeDurationPicker | Screen 107 | High |
| SoundPreviewPill | Screen 107 | Medium |
| AudioWaveformLarge | Screen 108 | Medium |
| SoundscapeChip | Screen 108 | High |
| SoundscapeChipList | Screen 108 | Medium |
| SearchInputField | Screen 108 | Medium |
| BreathingCircleAnimation | Screen 109 | High |
| BreathingInstruction | Screen 109 | Medium |
| SessionProgressBar | Screen 109 | High |
| PlaybackControlsRow | Screen 109 | High |
| SkipButton | Screen 109 | Low |
| PausePlayButton | Screen 109 | Medium |

### Shared Patterns

1. **Wizard Flow (3 steps)**
   - Step indicator: "X of 3"
   - Progress dots at bottom
   - Continue button advances
   - Back button returns

2. **Audio/Sound Integration**
   - Soundscape selection
   - Preview playback
   - Ambient during session
   - Volume/sound controls

3. **Breathing Animation**
   - Concentric circle pattern
   - Pulsing on inhale/exhale
   - Instruction text overlay
   - Timing synchronization

---

## Summary

| Screen | Name | Status | Critical Issues |
|--------|------|--------|-----------------|
| 105 | MindfulHoursStats | Documented | **Data math errors** |
| 106 | NewExerciseGoal | Documented | Truncated labels |
| 107 | NewExerciseDuration | Documented | None |
| 108 | SoundscapeSelector | Documented | None |
| 109 | BreathingExercisePlayer | Documented | None |

**Total New Components**: 20
**Critical Issues**: 1 (Data inconsistency in stats)
**Minor Issues**: Truncated labels in goal selection
**Mindful Hours**: 6/8 done (2 remaining)
