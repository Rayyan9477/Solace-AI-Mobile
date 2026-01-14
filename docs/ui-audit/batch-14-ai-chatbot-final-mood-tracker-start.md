# Batch 14: AI Therapy Chatbot Final + Mood Tracker Start

**Screens Covered**: 65-69 (AI Chatbot 19-20 + Mood Tracker 1-3)
**Source Files**:
- `ui-designs/Dark-mode/🔒 AI Therapy Chatbot/AI_Therapy_Chatbot_Screen_19.png`, `...Screen_20.png`
- `ui-designs/Dark-mode/🔒 Mood Tracker/Mood_Tracker_Screen_01.png` through `...Screen_03.png`

---

## Screen 65: CustomAIInstructions

### 1. Purpose
Allows users to customize their AI therapy experience by selecting the underlying AI model, providing adaptive memory context about themselves, and specifying custom response preferences.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [Status Bar]                        9:41│
├─────────────────────────────────────────┤
│ (←)                                     │
│                                         │
│    Custom AI                            │
│    Instructions                         │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│ AI Model                            ⋮   │
│ ┌───────┬───────┬───────┬───────┬─────┐ │
│ │LLama3 │ PaLM2 │ GPT-4 │BingCh │Stab │ │
│ │  ✓    │       │       │  at   │ le  │ │
│ └───────┴───────┴───────┴───────┴─────┘ │
│                                         │
│ AI Adaptive Memory        [BETA]    ⋮   │
│ ┌─────────────────────────────────────┐ │
│ │ What would you like our AI to know │ │
│ │ about you to provide better        │ │
│ │ responses?                         │ │
│ │                                    │ │
│ │                                    │ │
│ │                          248/800 📋│ │
│ └─────────────────────────────────────┘ │
│                                         │
│ AI Custom Response        [BETA]    ⋮   │
│ ┌─────────────────────────────────────┐ │
│ │ What would you like our AI to know │ │
│ │ about you to provide better        │ │
│ │ responses?                         │ │
│ │                                    │ │
│ │                                    │ │
│ │                          255/800 📋│ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ☑ I agree to AI Terms & Conditions      │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │    Set Custom Instructions    ✓    │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Props/Config |
|-----------|-------------|--------------|
| BackButton | Top-left navigation | `onPress` |
| ScreenTitle | "Custom AI Instructions" | `text`, `size: 'large'` |
| SectionHeader | Section label with menu | `title`, `badge`, `onMenu` |
| BetaBadge | Orange "BETA" indicator | `text: 'BETA'` |
| AIModelSelector | Horizontal chip selection | `models`, `selectedModel`, `onSelect` |
| ModelChip | Individual model option | `label`, `isSelected`, `onPress` |
| LargeTextInput | Multi-line input with counter | `value`, `placeholder`, `maxLength`, `onChangeText` |
| CharacterCounter | Character count display | `current`, `max` |
| CopyButton | Copy to clipboard icon | `onPress` |
| CheckboxWithLabel | Terms agreement | `checked`, `label`, `onToggle` |
| PrimaryButton | Submit button | `label`, `icon`, `onPress`, `disabled` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render model selection chips horizontally
- Display text inputs with character counters
- Show beta badges on experimental features
- Handle checkbox toggle animation

**Logic (Container/Hooks)**:
- Validate character limits
- Save custom instructions to user profile
- Handle model selection persistence
- Manage terms agreement state

### 5. State Definition

```typescript
interface CustomAIInstructionsState {
  // Model Selection
  selectedModel: AIModel;
  availableModels: AIModel[];

  // Adaptive Memory
  adaptiveMemoryText: string;
  adaptiveMemoryCharCount: number;

  // Custom Response
  customResponseText: string;
  customResponseCharCount: number;

  // Terms
  termsAccepted: boolean;

  // Form State
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  errors: Record<string, string>;
}

type AIModel = 'llama3' | 'palm2' | 'gpt4' | 'bingchat' | 'stable';
```

### 6. Data Models

```typescript
interface CustomInstructions {
  id: string;
  userId: string;
  selectedModel: AIModel;
  adaptiveMemory: {
    text: string;
    lastUpdated: string;
  };
  customResponse: {
    text: string;
    lastUpdated: string;
  };
  termsAcceptedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface AIModel {
  id: string;
  name: string;
  displayName: string;
  isAvailable: boolean;
  isBeta: boolean;
  description?: string;
}
```

### 7. Navigation

| Action | Destination | Data Passed |
|--------|-------------|-------------|
| Back button | Previous screen | - |
| "Set Custom Instructions" | Previous screen (save) | `customInstructions` |
| Model menu (⋮) | ModelInfoModal | `model` |
| Terms link | TermsAndConditions | - |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| No model selected | Disable submit button |
| Character limit reached | Show warning color, prevent further input |
| Terms not accepted | Disable submit button |
| Saving in progress | Show loading spinner on button |
| Model unavailable | Gray out chip, show "Coming Soon" |
| Long text pasted | Truncate to max length, show warning |
| Unsaved changes | Confirm dialog on back navigation |

### 9. Implementation Breakdown

1. **AIModelSelector Component**
   - Horizontal ScrollView for chips
   - Single selection behavior
   - Highlight selected with green background
   - Show availability status

2. **LargeTextInput Component**
   - Multi-line TextInput
   - Real-time character counting
   - Copy to clipboard button
   - Placeholder text styling

3. **Beta Badge Component**
   - Orange pill-shaped badge
   - "BETA" text
   - Optional tooltip on tap

4. **Form Validation**
   - Check model selected
   - Validate character limits
   - Ensure terms accepted
   - Enable/disable submit button

### 10. Open Issues

| Issue | Priority | Notes |
|-------|----------|-------|
| Model availability | HIGH | Which models are actually available? LLama3 shown as default |
| "Stable" model truncated | LOW | UI shows "Stab" - ensure proper display |
| Adaptive Memory vs Custom Response | MEDIUM | What's the difference? Need clear documentation |
| Terms & Conditions | HIGH | Need actual terms document |
| Character limit rationale | LOW | Why 800? Adjust based on model context limits |

---

## Screen 66: DeleteAIConversation

### 1. Purpose
Confirmation modal for deleting an AI conversation, providing users with clear information about the action and the ability to restore within 30 days.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [Status Bar]                        9:41│
├─────────────────────────────────────────┤
│ (←)                                     │
│                                         │
│                                         │
│           ┌─────────────────┐           │
│          ╱                   ╲          │
│         │   [TRASH CAN       │          │
│         │    ILLUSTRATION]   │          │
│         │                    │          │
│         │   Papers flying    │          │
│         │   out of bin       │          │
│          ╲                   ╱          │
│           └─────────────────┘           │
│                                         │
│        Delete This AI                   │
│        Conversation?                    │
│                                         │
│    Don't worry, mate! You can still     │
│    restore the conversation within      │
│    30 days. 👍                          │
│                                         │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │          Cancel    ✕               │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │     Delete Conversation    🗑       │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Props/Config |
|-----------|-------------|--------------|
| BackButton | Top-left close | `onPress` |
| TrashIllustration | Animated trash can with papers | `animated: boolean` |
| ModalTitle | "Delete This AI Conversation?" | `text` |
| ModalSubtitle | Reassurance message | `text` |
| SecondaryButton | "Cancel" action | `label`, `icon: 'x'`, `onPress` |
| DangerButton | "Delete Conversation" action | `label`, `icon: 'trash'`, `onPress` |

### 4. Responsibility Split

**UI (Presentational)**:
- Display illustration with animation
- Render title and subtitle
- Show action buttons with proper styling
- Handle button press feedback

**Logic (Container/Hooks)**:
- Soft-delete conversation (mark as deleted)
- Schedule permanent deletion after 30 days
- Navigate back on cancel
- Show success toast on delete

### 5. State Definition

```typescript
interface DeleteConversationState {
  // Conversation
  conversationId: string;
  conversationTitle: string;

  // Action State
  isDeleting: boolean;
  deleteError: string | null;

  // Animation
  showAnimation: boolean;
}
```

### 6. Data Models

```typescript
interface DeletedConversation {
  conversationId: string;
  deletedAt: string;
  scheduledPermanentDeletionAt: string;  // deletedAt + 30 days
  canRestore: boolean;
  deletedBy: string;
}

interface ConversationDeletionResult {
  success: boolean;
  message: string;
  restoreDeadline: string;
}
```

### 7. Navigation

| Action | Destination | Data Passed |
|--------|-------------|-------------|
| Back button | Previous screen | - |
| "Cancel" | Previous screen | - |
| "Delete Conversation" | ConversationsDashboard | `deletedConversationId` |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Deleting in progress | Show loading spinner on delete button |
| Delete failed | Show error message, keep modal open |
| Delete successful | Navigate away, show success toast |
| Already deleted | Show "already deleted" message |
| Offline | Queue deletion, show pending indicator |

### 9. Implementation Breakdown

1. **TrashIllustration Component**
   - SVG or Lottie animation
   - Papers flying out effect
   - Brown/tan color scheme
   - Circular background

2. **Soft Delete Flow**
   - Mark conversation as deleted in database
   - Set restoration deadline (30 days)
   - Hide from main list
   - Add to "Recently Deleted" section

3. **Restoration Feature**
   - Separate screen for deleted items
   - Restore button per item
   - Clear permanent deletion warning

### 10. Open Issues

| Issue | Priority | Notes |
|-------|----------|-------|
| Restoration UI | MEDIUM | Where do users go to restore deleted conversations? |
| Permanent deletion job | HIGH | Backend scheduled job to permanently delete after 30 days |
| Offline handling | MEDIUM | How to handle delete when offline? |
| Undo feature | LOW | Should there be a quick undo after deletion? |

---

## Screen 67: MoodDashboard

### 1. Purpose
Main mood tracking dashboard showing the user's current mood state with a weekly statistics visualization, providing at-a-glance insight into mood patterns.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [Status Bar]                        9:41│
├─────────────────────────────────────────┤
│ (←)  Mood                               │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │
│ │    YELLOW/GOLDEN BACKGROUND         │ │
│ │    with decorative circles          │ │
│ │                                     │ │
│ │          ┌─────────┐                │ │
│ │          │  😊     │                │ │
│ │          │ (white  │                │ │
│ │          │  face)  │                │ │
│ │          └─────────┘                │ │
│ │                                     │ │
│ │            Happy                    │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│            ┌─────────┐                  │
│            │  ☰☰☰   │                  │
│            └─────────┘                  │
│                                         │
│ Mood Statistics                     ⋮   │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  │ │
│ │  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  │ │
│ │  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  │ │
│ │ ┌──┐┌──┐┌────┐┌────┐┌──┐┌──┐┌──┐  │ │
│ │ │😐││😊││ 😊 ││ 😄 ││😊││😐││😐│  │ │
│ │ │  ││  ││    ││    ││  ││  ││  │  │ │
│ │ └──┘└──┘└────┘└────┘└──┘└──┘└──┘  │ │
│ │ Mon Tue  Wed   Thu  Fri Sat Sun   │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Props/Config |
|-----------|-------------|--------------|
| HeaderWithBack | Back button + "Mood" title | `title`, `onBack` |
| MoodHeroSection | Colored background with mood display | `mood`, `backgroundColor` |
| DecorativeCircles | Background visual elements | `color`, `positions` |
| LargeMoodEmoji | Central mood face | `mood`, `size: 'large'` |
| MoodLabel | Text label for mood | `text` |
| FilterButton | Settings/filter icon | `onPress` |
| SectionHeader | "Mood Statistics" with menu | `title`, `onMenu` |
| WeeklyMoodChart | Bar chart with emoji indicators | `data`, `currentDay` |
| MoodBar | Individual day bar | `height`, `mood`, `emoji`, `dayLabel` |

### 4. Responsibility Split

**UI (Presentational)**:
- Display mood with appropriate color theme
- Render weekly bar chart with emojis
- Show decorative background elements
- Handle tap interactions on chart

**Logic (Container/Hooks)**:
- Fetch current mood state
- Load weekly mood history
- Calculate bar heights from mood values
- Handle mood update navigation

### 5. State Definition

```typescript
interface MoodDashboardState {
  // Current Mood
  currentMood: Mood;
  lastUpdated: string;

  // Weekly Data
  weeklyMoods: DailyMood[];
  selectedDay: string | null;

  // UI State
  isLoading: boolean;
  showFilterMenu: boolean;
}

interface DailyMood {
  date: string;
  dayOfWeek: string;
  mood: Mood;
  moodValue: number;        // 0-100 for bar height
  emoji: string;
}

type Mood = 'depressed' | 'sad' | 'neutral' | 'content' | 'happy' | 'elated';
```

### 6. Data Models

```typescript
interface MoodEntry {
  id: string;
  userId: string;
  mood: Mood;
  moodValue: number;
  timestamp: string;
  note?: string;
  triggers?: string[];
  location?: string;
}

interface MoodColorTheme {
  mood: Mood;
  backgroundColor: string;
  accentColor: string;
  emoji: string;
  label: string;
}

const MOOD_THEMES: MoodColorTheme[] = [
  { mood: 'happy', backgroundColor: '#F5C563', accentColor: '#E5B553', emoji: '😊', label: 'Happy' },
  { mood: 'depressed', backgroundColor: '#7B68B5', accentColor: '#6B58A5', emoji: '😵', label: 'Depressed' },
  // ... other moods
];
```

### 7. Navigation

| Action | Destination | Data Passed |
|--------|-------------|-------------|
| Back button | Home | - |
| Filter button | MoodFilterModal | - |
| Tap mood display | MoodSelector | `currentMood` |
| Tap chart bar | MoodDayDetail | `date`, `mood` |
| Menu (⋮) | MoodStatsOptions | - |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| No mood set today | Show prompt "How are you feeling?" |
| Loading data | Skeleton loader for chart |
| No history | Show empty state, encourage logging |
| Today highlighted | Special styling on current day bar |
| Missing days | Show placeholder bars |
| Tap on bar | Show tooltip with mood details |

### 9. Implementation Breakdown

1. **MoodHeroSection Component**
   - Dynamic background color based on mood
   - Large centered emoji
   - Mood label below
   - Decorative circles overlay

2. **WeeklyMoodChart Component**
   - 7 vertical bars for Mon-Sun
   - Bar height based on mood value
   - Emoji at top of each bar
   - Day labels at bottom
   - Grid lines for context

3. **Color Theming**
   - Yellow/golden for Happy
   - Purple for Depressed
   - Green for Elated
   - Gray for Neutral

### 10. Open Issues

| Issue | Priority | Notes |
|-------|----------|-------|
| Mood value mapping | MEDIUM | How do moods map to numerical values (0-100)? |
| Empty day handling | LOW | Show empty or zero-height bar for unlogged days? |
| Time of day | MEDIUM | Can users log multiple moods per day? |
| Color accessibility | HIGH | Ensure color contrast meets WCAG standards |

---

## Screen 68: MoodStatsDetail

### 1. Purpose
Detailed mood statistics view with a line graph showing mood trends over time, filtering options by time period, and a historical emoji calendar.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [Status Bar]                        9:41│
├─────────────────────────────────────────┤
│ (←)                                 📊  │
│                                         │
│    Mood Stats                           │
│    See your mood throught the day.      │
│                                         │
│ ┌─────┬───────┬────────┬───────┬──────┐ │
│ │1 Day│1 Week │ 1 Month│1 Year │All Ti│ │
│ └─────┴───────┴────────┴───────┴──────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ [Happy]                             │ │
│ │    ╱╲        [Neutral]              │ │
│ │   ╱  ╲      ╱╲                      │ │
│ │  ╱    ╲    ╱  ╲                     │ │
│ │ ╱      ╲  ╱    ╲                    │ │
│ │╱        ╲╱ [Depressed]              │ │
│ │                                     │ │
│ │ Mon Tue Wed Thu  Fri  Sat  Sun      │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Mood History            🔃 Newest ▼     │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 😊  😔  😊  😵  😐  😔  😊         │ │
│ │ Mon Tue Wed Thu Fri Sat Sun         │ │
│ └─────────────────────────────────────┘ │
│                                         │
│              ┌───┐                      │
│              │ + │                      │
│              └───┘                      │
│                                         │
│ ┌─────┬─────┬─────┬─────┐              │
│ │ 🏠  │     │     │ 📊  │              │
│ └─────┴─────┴─────┴─────┘              │
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Props/Config |
|-----------|-------------|--------------|
| HeaderWithAction | Back + chart icon | `title`, `onBack`, `actionIcon`, `onAction` |
| ScreenTitle | "Mood Stats" | `text` |
| ScreenSubtitle | Description text | `text` |
| TimeRangeSelector | Tab-style time filters | `options`, `selected`, `onSelect` |
| MoodLineChart | Trend visualization | `data`, `labels`, `annotations` |
| MoodAnnotation | Badge on chart points | `label`, `mood`, `position` |
| SectionHeader | "Mood History" with sort | `title`, `sortLabel`, `onSort` |
| EmojiCalendarRow | Week of mood emojis | `days`, `moods` |
| FloatingActionButton | Add mood entry | `onPress`, `icon: 'plus'` |
| BottomNavigationBar | App navigation | `activeTab`, `onNavigate` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render line chart with smooth curves
- Display mood annotations at key points
- Show time range filter tabs
- Render emoji calendar row

**Logic (Container/Hooks)**:
- Fetch mood data for selected time range
- Calculate chart data points
- Determine annotation placement
- Handle time range switching

### 5. State Definition

```typescript
interface MoodStatsDetailState {
  // Time Range
  selectedTimeRange: '1day' | '1week' | '1month' | '1year' | 'alltime';

  // Chart Data
  chartData: MoodDataPoint[];
  annotations: MoodAnnotation[];

  // History
  moodHistory: DailyMood[];
  historySortOrder: 'newest' | 'oldest';

  // UI State
  isLoading: boolean;
  selectedDataPoint: MoodDataPoint | null;
}

interface MoodDataPoint {
  date: string;
  value: number;
  mood: Mood;
}

interface MoodAnnotation {
  date: string;
  label: string;
  mood: Mood;
  x: number;
  y: number;
}
```

### 6. Data Models

```typescript
interface MoodStatistics {
  timeRange: string;
  averageMood: number;
  moodDistribution: Record<Mood, number>;
  trendDirection: 'improving' | 'stable' | 'declining';
  peakMood: { mood: Mood; date: string };
  lowestMood: { mood: Mood; date: string };
  streaks: MoodStreak[];
}

interface MoodStreak {
  mood: Mood;
  startDate: string;
  endDate: string;
  days: number;
}
```

### 7. Navigation

| Action | Destination | Data Passed |
|--------|-------------|-------------|
| Back button | MoodDashboard | - |
| Chart icon | ChartOptions | - |
| FAB (+) | MoodSelector | - |
| Time range tab | Stay (refresh data) | `timeRange` |
| Tap chart point | MoodDayDetail | `date`, `mood` |
| Bottom nav | Respective screens | - |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Loading data | Skeleton chart with placeholder |
| No data for range | "No mood data for this period" |
| Single data point | Show point without line |
| Many data points | Aggregate for readability |
| Tap on annotation | Show detailed tooltip |
| Switch time range | Animate chart transition |

### 9. Implementation Breakdown

1. **MoodLineChart Component**
   - SVG or react-native-chart-kit
   - Smooth bezier curves between points
   - Gradient fill below line
   - Touch-to-select data points

2. **TimeRangeSelector Component**
   - Horizontal tab layout
   - Selected state with border/background
   - Animated indicator

3. **MoodAnnotation Component**
   - Positioned badge on chart
   - Color matches mood
   - Label text (Happy, Neutral, Depressed)

4. **EmojiCalendarRow Component**
   - Horizontal row of 7 days
   - Emoji for each day's mood
   - Day label below emoji

### 10. Open Issues

| Issue | Priority | Notes |
|-------|----------|-------|
| **Typo "throught"** | **MEDIUM** | Should be "throughout" in subtitle |
| Chart library | HIGH | Which charting library? react-native-svg-charts? |
| Data aggregation | MEDIUM | How to show 1 year of data on small chart? |
| Annotation collision | LOW | Handle overlapping annotations |
| Performance | MEDIUM | Large datasets may slow rendering |

---

## Screen 69: MoodSelector

### 1. Purpose
Allows users to select and record their current mood using an intuitive curved slider interface with emoji feedback.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [Status Bar]                        9:41│
├─────────────────────────────────────────┤
│                                         │
│                                         │
│    How are you feeling                  │
│         this day?                       │
│                                         │
│                                         │
│                                         │
│           ┌─────────────┐               │
│           │             │               │
│           │     😵      │               │
│           │   (X eyes)  │               │
│           │             │               │
│           └─────────────┘               │
│                                         │
│      I'm Feeling Depressed              │
│                                         │
│                                         │
│                                         │
│    ●─────○─────○─────○─────○            │
│   ↑                                     │
│   selected                              │
│                                         │
│                                         │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │          Set Mood    ✓             │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ═══════════════════════════════════════ │
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Props/Config |
|-----------|-------------|--------------|
| ScreenTitle | "How are you feeling this day?" | `text`, `centered` |
| LargeMoodEmoji | Central feedback emoji | `mood`, `size: 'xlarge'`, `animated` |
| MoodLabel | "I'm Feeling [Mood]" | `mood`, `prefix` |
| CurvedMoodSlider | Arc-shaped selection | `value`, `onChange`, `points` |
| SliderPoint | Individual selectable point | `position`, `isSelected`, `onPress` |
| PrimaryButton | "Set Mood" action | `label`, `icon: 'check'`, `onPress` |
| HomeIndicator | iOS home gesture bar | - |

### 4. Responsibility Split

**UI (Presentational)**:
- Display full-screen mood color background
- Render curved slider with points
- Show emoji and label based on selection
- Animate transitions between moods

**Logic (Container/Hooks)**:
- Map slider position to mood value
- Save mood entry to database
- Update global mood state
- Navigate on save

### 5. State Definition

```typescript
interface MoodSelectorState {
  // Selection
  selectedMoodIndex: number;
  selectedMood: Mood;

  // UI
  backgroundColor: string;
  isAnimating: boolean;

  // Save
  isSaving: boolean;
  saveError: string | null;
}

const MOOD_SCALE: Mood[] = [
  'depressed',    // Index 0 (leftmost)
  'sad',          // Index 1
  'neutral',      // Index 2
  'content',      // Index 3
  'happy',        // Index 4 (rightmost)
];
```

### 6. Data Models

```typescript
interface MoodSelection {
  mood: Mood;
  moodIndex: number;
  emoji: string;
  label: string;
  backgroundColor: string;
}

const MOOD_CONFIG: Record<Mood, MoodSelection> = {
  depressed: {
    mood: 'depressed',
    moodIndex: 0,
    emoji: '😵',
    label: 'Depressed',
    backgroundColor: '#7B68B5',  // Purple
  },
  sad: {
    mood: 'sad',
    moodIndex: 1,
    emoji: '😢',
    label: 'Sad',
    backgroundColor: '#6B7B9B',  // Blue-gray
  },
  neutral: {
    mood: 'neutral',
    moodIndex: 2,
    emoji: '😐',
    label: 'Neutral',
    backgroundColor: '#9B9B9B',  // Gray
  },
  content: {
    mood: 'content',
    moodIndex: 3,
    emoji: '🙂',
    label: 'Content',
    backgroundColor: '#9BC56B',  // Light green
  },
  happy: {
    mood: 'happy',
    moodIndex: 4,
    emoji: '😊',
    label: 'Happy',
    backgroundColor: '#F5C563',  // Yellow/golden
  },
};
```

### 7. Navigation

| Action | Destination | Data Passed |
|--------|-------------|-------------|
| Set Mood | MoodDashboard | `moodEntry` |
| Back gesture | Previous screen | - |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Mood changing | Animate background color transition |
| Emoji changing | Scale/bounce animation |
| Saving mood | Show loading spinner on button |
| Save successful | Navigate back with success feedback |
| Save failed | Show error toast, keep selection |
| Offline | Queue for sync, show pending indicator |

### 9. Implementation Breakdown

1. **CurvedMoodSlider Component**
   - Arc/curve shape using SVG path
   - 5 selectable points along curve
   - Draggable selection indicator
   - Tap-to-select on points

2. **Mood Transition Animation**
   - Animated.timing for background color
   - Spring animation for emoji scale
   - Text fade for label change

3. **Background Color**
   - Full screen color based on mood
   - Smooth interpolation between colors
   - Match with MoodDashboard theme

4. **Save Flow**
   - Create MoodEntry object
   - Save to local storage
   - Sync to backend
   - Update dashboard

### 10. Open Issues

| Issue | Priority | Notes |
|-------|----------|-------|
| Slider curve shape | MEDIUM | Exact bezier curve for the arc |
| Number of moods | LOW | 5 points shown - is this final? |
| Time selection | MEDIUM | Can users backdate mood entries? |
| Additional context | MEDIUM | Option to add note/triggers? |
| Accessibility | HIGH | How do screen readers interact with curved slider? |

---

## New Components Identified (Batch 14)

| Component | First Seen | Reusable |
|-----------|------------|----------|
| AIModelSelector | Screen 65 | Yes - any AI model selection |
| ModelChip | Screen 65 | Yes - selectable options |
| BetaBadge | Screen 65 | Yes - feature flags |
| CharacterCounter | Screen 65 | Yes - text inputs with limits |
| TrashIllustration | Screen 66 | No - delete confirmation specific |
| DangerButton | Screen 66 | Yes - destructive actions |
| MoodHeroSection | Screen 67 | Yes - mood feature header |
| DecorativeCircles | Screen 67 | Yes - background decoration |
| LargeMoodEmoji | Screen 67 | Yes - mood displays |
| MoodLabel | Screen 67 | Yes - mood text |
| WeeklyMoodChart | Screen 67 | Yes - weekly visualizations |
| MoodBar | Screen 67 | Yes - chart bars |
| MoodLineChart | Screen 68 | Yes - trend visualization |
| TimeRangeSelector | Screen 68 | Yes - date filtering |
| MoodAnnotation | Screen 68 | Yes - chart labels |
| EmojiCalendarRow | Screen 68 | Yes - mood history |
| FloatingActionButton | Screen 68 | Yes - common FAB pattern |
| CurvedMoodSlider | Screen 69 | Yes - unique slider |
| SliderPoint | Screen 69 | Yes - slider interaction |

---

## Issues Identified (Batch 14)

### Issue #13: Typo in Mood Stats Subtitle (Screen 68)

**Location**: `batch-14-ai-chatbot-final-mood-tracker-start.md` - Screen 68
**Source**: `ui-designs/Dark-mode/🔒 Mood Tracker/Mood_Tracker_Screen_02.png`

**Problem**: Subtitle reads "See your mood throught the day." instead of "throughout"

**Required Action**:
- [ ] Fix typo: "throught" → "throughout"

---

## Summary

| Screen | Name | Key Features |
|--------|------|--------------|
| 65 | CustomAIInstructions | Model selection (LLama3/PaLM2/GPT-4), adaptive memory, custom response, 800 char limit |
| 66 | DeleteAIConversation | Trash illustration, 30-day restore period, cancel/delete buttons |
| 67 | MoodDashboard | Yellow "Happy" theme, large emoji, weekly bar chart with emoji indicators |
| 68 | MoodStatsDetail | Line graph with annotations, time range tabs, emoji calendar, FAB |
| 69 | MoodSelector | Purple "Depressed" theme, curved slider with 5 points, full-screen color |

**AI Therapy Chatbot: COMPLETE** (20/20 screens)
**Mood Tracker: Started** (3/11 screens)
**Total App Screens Documented**: 69/153
