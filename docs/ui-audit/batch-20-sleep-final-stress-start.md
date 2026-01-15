# Batch 20: Sleep Quality Final + Stress Management Start (Screens 9-10 + 1-3)

**Screens Covered**: 95-99 (Sleep Insights, Filter + Stress Dashboard, Level Input, Stressor Selector)
**Source Files**:
- `ui-designs/Dark-mode/🔒 Sleep Quality/Sleep_Quality_Screen_09.png` through `10.png`
- `ui-designs/Dark-mode/🔒 Stress Management/Stress_Management_Screen_01.png` through `03.png`

---

## Screen 95: SleepInsights

### 1. Purpose
Analytics dashboard showing sleep patterns over time with timeline visualization, stage breakdown, and AI-powered improvement suggestions.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [9:41]                    [Signal][Batt]│
│                                         │
│  (◐) ← Back                             │
│                                         │
│  Sleep Insights                         │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ 1Day │[1Week]│1Month│1Year│All Time ││
│  └─────────────────────────────────────┘│
│                                         │
│        ┌─Sleep Irregularity─┐           │
│        ↓                                │
│  ━━━━━━━━━━━━━━━━━ ━━━━ ━━━            │
│  ▓▓▓▓▓▓ ▓▓▓▓▓▓▓▓▓ ████ ████            │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ████                 │
│  11:00  12:00  13:00  14:00  15:00      │
│                                         │
│  ● Core    ● REM    ● Post-REM          │
│                                         │
│  AI Suggestions              See All →  │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ 🌙 Loud Snoring                  > ││
│  │    Control your snoring!            ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │ 🐾 Pillow Improvement            > ││
│  │    Change your pillows              ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │ 🌡️ Temperature Adjustment        > ││
│  │    Increase your room temp          ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │ ⏰ Sleep Irregularity            > ││
│  │    Your sleep is irregular          ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │ ❤️ Heartbeat Irregularity        > ││
│  │    We detected heatbeat deviation   ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Variant/State |
|-----------|-------------|---------------|
| BackButton | Crescent moon | Default |
| ScreenTitle | "Sleep Insights" | Large, white |
| TimeRangeSelector | Period tabs | "1 Week" selected |
| TimeRangeTab | Individual tab | Active/inactive states |
| SleepTimelineChart | Horizontal timeline | Gantt-style bars |
| TimelineBar | Sleep stage bar | Color-coded by stage |
| IrregularityMarker | Callout label | Points to irregular period |
| TimeAxis | Hour labels | 11:00 to 15:00 |
| ChartLegend | Stage indicators | Core, REM, Post-REM with dots |
| SectionHeader | "AI Suggestions" | With "See All" link |
| SuggestionCard | Individual suggestion | Icon, title, description |
| SuggestionIcon | Colored circle with icon | Purple, yellow, blue variants |
| ChevronRight | Navigation indicator | Gray arrow |

### 4. Responsibility Split

**UI Layer (Presentational)**:
- Render time range selector tabs
- Display timeline chart with colored bars
- Show irregularity markers
- List AI suggestion cards
- Handle card tap interactions

**Logic Layer (Container/Hooks)**:
- Fetch sleep data for selected time range
- Process data into timeline format
- Identify irregularities in sleep pattern
- Generate/fetch AI suggestions
- Navigate to suggestion details

### 5. State Definition

```typescript
interface SleepInsightsState {
  // Time Range
  selectedRange: TimeRange;

  // Sleep Data
  sleepSessions: SleepTimelineEntry[];
  irregularities: IrregularityMarker[];

  // Suggestions
  suggestions: SleepSuggestion[];

  // UI State
  isLoading: boolean;
}

type TimeRange = '1Day' | '1Week' | '1Month' | '1Year' | 'AllTime';

interface SleepTimelineEntry {
  date: Date;
  startHour: number;
  endHour: number;
  stage: 'core' | 'rem' | 'post-rem';
}

interface IrregularityMarker {
  time: Date;
  type: 'gap' | 'timing' | 'duration';
  label: string;
}
```

### 6. Data Models

```typescript
interface SleepSuggestion {
  id: string;
  icon: IconType;
  iconColor: string;
  title: string;
  description: string;
  category: 'snoring' | 'environment' | 'timing' | 'health';
  priority: 'high' | 'medium' | 'low';
}

const suggestionsFromDesign: SleepSuggestion[] = [
  {
    id: '1',
    icon: 'moon',
    iconColor: '#7B68B5', // Purple
    title: 'Loud Snoring',
    description: 'Control your snoring!',
    category: 'snoring',
    priority: 'high'
  },
  {
    id: '2',
    icon: 'paw',
    iconColor: '#C4A535', // Yellow
    title: 'Pillow Improvement',
    description: 'Change your pillows',
    category: 'environment',
    priority: 'medium'
  },
  {
    id: '3',
    icon: 'thermometer',
    iconColor: '#4A9E8C', // Teal/Blue
    title: 'Temperature Adjustment',
    description: 'Increase your room temp',
    category: 'environment',
    priority: 'medium'
  },
  {
    id: '4',
    icon: 'clock',
    iconColor: '#C4A535', // Yellow
    title: 'Sleep Irregularity',
    description: 'Your sleep is irregular',
    category: 'timing',
    priority: 'high'
  },
  {
    id: '5',
    icon: 'heart',
    iconColor: '#7B68B5', // Purple
    title: 'Heartbeat Irregularity',
    description: 'We detected heartbeat deviation', // Fixed typo
    category: 'health',
    priority: 'high'
  }
];

// Sleep stage colors
const stageColors = {
  core: '#9AAD5C',      // Green
  rem: '#E8853A',       // Orange
  'post-rem': '#C4A535' // Yellow/Gold
};
```

### 7. Navigation

| Action | Destination | Parameters |
|--------|-------------|------------|
| Back button | SleepDashboard | - |
| Time range tab | Refresh data | `{ range: TimeRange }` |
| Suggestion card tap | SuggestionDetail | `{ suggestionId: string }` |
| See All link | AllSuggestions | - |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Loading | Show skeleton chart and cards |
| No data for range | "No sleep data" message |
| No suggestions | Hide suggestions section |
| Many suggestions | Scrollable list, "See All" shows count |
| Single day view | Show hourly breakdown |
| Year/All time view | Show daily/weekly aggregates |

### 9. Implementation Breakdown

1. **TimeRangeSelector Component**
   - Horizontal tab bar
   - 5 options: 1 Day, 1 Week, 1 Month, 1 Year, All Time
   - Active tab has background highlight
   - Tap to switch range

2. **SleepTimelineChart Component**
   - Horizontal Gantt-style chart
   - X-axis: Hours (or days for longer ranges)
   - Bars represent sleep sessions
   - Color-coded by sleep stage
   - Support for gaps (irregularities)

3. **IrregularityMarker Component**
   - Tooltip/callout pointing to chart
   - "Sleep Irregularity" label
   - Could be tap-expandable for details

4. **SuggestionCard Component**
   - Icon in colored circle (left)
   - Title and description (center)
   - Chevron right (right)
   - Tap to navigate to detail

### 10. Open Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| 95-1 | **Typo: "heatbeat"** | Medium | Should be "heartbeat" in last suggestion |
| 95-2 | Chart time range unclear | Low | Shows 11:00-15:00 - is this nap or error? |
| 95-3 | Icon semantics unclear | Low | Why paw icon for pillow improvement? |

---

## Screen 96: FilterSleepBottomSheet

### 1. Purpose
Filter modal for sleep history allowing users to narrow results by date range, duration, sleep type, and AI suggestion inclusion.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [9:41]                    [Signal][Batt]│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ (Yellow/tan background visible)     ││
│  └─────────────────────────────────────┘│
│                                         │
│  ╭─────────────────────────────────────╮│
│  │ ───────── (drag handle)             ││
│  │                                     ││
│  │ Filter Sleep                    (?) ││
│  │                                     ││
│  │ From                    To          ││
│  │ ┌──────────────┐  ┌──────────────┐ ││
│  │ │📅 2025/18/16 │  │📅 2025/18/16│ ││
│  │ └──────────────┘  └──────────────┘ ││
│  │                                     ││
│  │ Sleep Duration                      ││
│  │ ●━━━━━━━━●━━━━━━━━━━━━━━━━━━━━━○   ││
│  │ 1h       4h                         ││
│  │                                     ││
│  │ Sleep Type                          ││
│  │ [🐾] [ 🛏️] [ 🔒] [ 💤] [ 🌙] [⚙️] ││
│  │ (sel)                               ││
│  │                                     ││
│  │ Include AI Suggestion       ───○    ││
│  │                                     ││
│  │ ┌─────────────────────────────────┐ ││
│  │ │   Filter Mood (25)  ⚙️         │ ││
│  │ └─────────────────────────────────┘ ││
│  ╰─────────────────────────────────────╯│
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Variant/State |
|-----------|-------------|---------------|
| BottomSheet | Modal container | Draggable, dismissible |
| DragHandle | Gray bar at top | Standard iOS/Android pattern |
| SheetTitle | "Filter Sleep" | With help icon |
| HelpButton | Question mark circle | Top right |
| FormLabel | "From", "To", etc. | Gray, small |
| DatePickerField | Date input with calendar icon | Two instances |
| CalendarIcon | Calendar emoji | In date field |
| DualRangeSlider | Duration filter | 1h to 4h range |
| SliderHandle | Draggable handle | Two handles for range |
| SleepTypeSelector | Icon button row | 6 options, first selected |
| SleepTypeButton | Individual type icon | Active/inactive states |
| ToggleSwitch | AI suggestion toggle | OFF state |
| ApplyButton | "Filter Mood (25)" | Full-width, brown |
| FilterIcon | Adjustment sliders | In apply button |

### 4. Responsibility Split

**UI Layer (Presentational)**:
- Render bottom sheet with drag handle
- Display date pickers
- Show duration slider
- Render sleep type icons
- Display toggle switch
- Position apply button

**Logic Layer (Container/Hooks)**:
- Manage filter state
- Validate date range
- Apply filters to sleep data
- Calculate matching result count
- Dismiss sheet and return filters

### 5. State Definition

```typescript
interface FilterSleepState {
  // Date Range
  fromDate: Date;
  toDate: Date;

  // Duration Filter
  minDuration: number; // hours
  maxDuration: number; // hours

  // Type Filter
  selectedSleepTypes: SleepType[];

  // Options
  includeAISuggestions: boolean;

  // Results Preview
  matchingCount: number;
}

type SleepType = 'core' | 'rem' | 'light' | 'deep' | 'irregular' | 'settings';
```

### 6. Data Models

```typescript
interface SleepFilter {
  dateRange: {
    from: Date;
    to: Date;
  };
  durationRange: {
    min: number; // hours
    max: number; // hours
  };
  types: SleepType[];
  includeAISuggestions: boolean;
}

// Sleep type icons (from design - unclear mapping)
const sleepTypeIcons = [
  { type: 'core', icon: 'paw' },      // First (selected)
  { type: 'rem', icon: 'bed' },
  { type: 'light', icon: 'lock' },    // Lock icon unclear
  { type: 'deep', icon: 'sleep' },
  { type: 'irregular', icon: 'moon' },
  { type: 'settings', icon: 'gear' }  // Gear icon unclear
];
```

### 7. Navigation

| Action | Destination | Parameters |
|--------|-------------|------------|
| Drag down | Dismiss sheet | No filter applied |
| Apply button | Previous screen | `{ filters: SleepFilter }` |
| Help button | Filter help modal | - |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Invalid date range | Show error, disable apply |
| No matches | Show "(0)" in button, allow apply |
| All types selected | Equivalent to no filter |
| Sheet dismissed | Reset to previous filters |
| Date picker open | Native date picker modal |

### 9. Implementation Breakdown

1. **BottomSheet Component**
   - Draggable from handle
   - Snap points (partially open, fully open)
   - Dismiss on drag down past threshold
   - Background overlay

2. **DatePickerField Component**
   - Two instances: From and To
   - Calendar icon prefix
   - Tap opens native date picker
   - Format: YYYY/MM/DD

3. **DualRangeSlider Component**
   - Two draggable handles
   - Range: 1h to max (24h?)
   - Current selection: 1h to 4h
   - Labels at min/max handles

4. **SleepTypeSelector Component**
   - Horizontal row of 6 icons
   - First icon selected (orange background)
   - Multi-select capability
   - Icons represent sleep types

### 10. Open Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| 96-1 | **Invalid date format** | High | "2025/18/16" is impossible (no month 18) |
| 96-2 | **Wrong button label** | High | "Filter Mood" should be "Filter Sleep" |
| 96-3 | Sleep type icons unclear | Medium | What do paw, lock, gear represent? |
| 96-4 | Icon/type mapping missing | Medium | Need clear mapping for 6 icons |

---

## Screen 97: StressDashboard

### 1. Purpose
Main dashboard for stress tracking feature showing current stress level, primary stressor, and impact visualization.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [9:41]                    [Signal][Batt]│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ (◐) Stress Level                    ││
│  │                                     ││
│  │  (Orange gradient background)       ││
│  │  (Decorative triangles & circles)   ││
│  │                                     ││
│  │            3                        ││
│  │         (huge)                      ││
│  │                                     ││
│  │     Elevated Stress                 ││
│  │                                     ││
│  │           ┌───┐                     ││
│  │           │⚙️ │ ← Settings btn      ││
│  │           └───┘                     ││
│  └─────────────────────────────────────┘│
│                                         │
│  Stress Stats                See All →  │
│                                         │
│  ┌──────────────────┬──────────────────┐│
│  │ Stressor      ⚠️ │ Impact        🏳️││
│  │                  │                  ││
│  │ Loneliness       │ Very High        ││
│  │                  │                  ││
│  │ ▓▓▓▓▓▓▓▓        │    /\/\/\        ││
│  │ ▓▓▓▓▓▓          │   /      \       ││
│  │ ▓▓▓▓            │  /        \      ││
│  │ (bar chart)     │  (line chart)    ││
│  └──────────────────┴──────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Variant/State |
|-----------|-------------|---------------|
| HeroSection | Orange gradient background | Top half of screen |
| BackButton | Crescent moon | White on orange |
| FeatureLabel | "Stress Level" | White, next to back button |
| DecorativeShapes | Triangles, circles | Semi-transparent, scattered |
| StressScoreDisplay | Large "3" | White, huge font |
| StressLabel | "Elevated Stress" | White text |
| SettingsButton | Gear icon in brown circle | Bottom of hero section |
| SectionHeader | "Stress Stats" | With "See All" link |
| StatsCard | Two-column stat display | Side by side |
| StressorCard | Primary stressor info | Left card |
| ImpactCard | Impact level info | Right card |
| WarningIcon | Triangle with exclamation | In Stressor card |
| FlagIcon | Flag/banner icon | In Impact card |
| HorizontalBarChart | Stressor visualization | In Stressor card |
| LineChart | Impact trend | In Impact card |

### 4. Responsibility Split

**UI Layer (Presentational)**:
- Display orange hero section with decorations
- Show stress score and label
- Render settings button
- Display stats cards with charts
- Handle tap interactions

**Logic Layer (Container/Hooks)**:
- Fetch current stress level
- Determine stress label from score
- Load stressor and impact data
- Navigate to settings/details
- Update stats periodically

### 5. State Definition

```typescript
interface StressDashboardState {
  // Stress Level
  stressScore: number; // 1-5
  stressLabel: StressLevel;

  // Stats
  primaryStressor: string;
  impactLevel: ImpactLevel;
  stressorHistory: number[]; // for bar chart
  impactTrend: number[];     // for line chart

  // UI State
  isLoading: boolean;
}

type StressLevel = 'Low' | 'Mild' | 'Moderate' | 'Elevated' | 'High';
type ImpactLevel = 'Minimal' | 'Low' | 'Moderate' | 'High' | 'Very High';
```

### 6. Data Models

```typescript
interface StressData {
  currentScore: number;
  label: StressLevel;
  primaryStressor: Stressor;
  impact: {
    level: ImpactLevel;
    trend: 'improving' | 'stable' | 'worsening';
    history: ImpactDataPoint[];
  };
}

interface Stressor {
  name: string;
  frequency: number; // times reported
  lastReported: Date;
  severityHistory: number[];
}

// Score to label mapping
function getStressLabel(score: number): StressLevel {
  switch (score) {
    case 1: return 'Low';
    case 2: return 'Mild';
    case 3: return 'Moderate'; // or 'Elevated' as shown
    case 4: return 'Elevated';
    case 5: return 'High';
    default: return 'Moderate';
  }
}

// Note: Design shows "Elevated Stress" for score 3
// but "Moderate" would be more typical for middle score
```

### 7. Navigation

| Action | Destination | Parameters |
|--------|-------------|------------|
| Back button | Home dashboard | - |
| Settings button | StressSettings | - |
| See All link | StressHistory | - |
| Stressor card tap | StressorDetail | `{ stressor: string }` |
| Impact card tap | ImpactDetail | - |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Loading | Skeleton placeholders |
| No data | "Log your first stress check" message |
| Score 1 (Low) | Green/calm color scheme |
| Score 5 (High) | Red/urgent color scheme |
| No stressor logged | "No stressor identified" |
| Empty charts | "Not enough data" message |

### 9. Implementation Breakdown

1. **HeroSection Component**
   - Orange gradient background (#E8853A to darker)
   - Decorative SVG shapes (triangles, circles)
   - Overlaid content (back button, score, label)
   - Fixed height or percentage of screen

2. **StressScoreDisplay Component**
   - Very large number (1-5)
   - White color on orange background
   - Animated number change

3. **StressLabel Component**
   - Text description of score
   - Maps score to human-readable label
   - Centered below score

4. **StatsCards Component**
   - Two-column layout
   - Dark brown background
   - Each card has: title, icon, value, mini chart

5. **MiniBarChart / MiniLineChart**
   - Small visualizations in cards
   - Bar chart shows stressor frequency
   - Line chart shows impact trend over time

### 10. Open Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| 97-1 | Score 3 = "Elevated" inconsistency | Low | Typically "Elevated" would be 4, "Moderate" would be 3 |
| 97-2 | Chart data source unclear | Low | What time range do mini charts show? |

---

## Screen 98: StressLevelInput

### 1. Purpose
Interactive input screen for users to report their current stress level using a curved arc/gauge selector with 5 levels.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [9:41]                    [Signal][Batt]│
│                                         │
│  (◐) ← Back                             │
│                                         │
│                                         │
│  What's your stress                     │
│  level today?                           │
│                                         │
│                                         │
│                             ●           │
│                          /              │
│                       /                 │
│                    ●                    │
│                 /                       │
│              /                          │
│           ●  ← Selected (orange)        │
│          ↑                              │
│         ●      (Refresh icon inside)    │
│        /                                │
│       ●                           3     │
│      (Arc with 5 points)                │
│                               Moderate  │
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
| QuestionTitle | "What's your stress level today?" | Large, white, multi-line |
| ArcGauge | Curved selector with 5 points | Interactive |
| GaugePoint | Individual level point | Active (orange), Inactive (brown) |
| SelectedIndicator | Refresh icon in selected point | Shows current selection |
| LevelNumber | Large "3" | Displays selected value |
| LevelLabel | "Moderate" | Text description |
| ContinueButton | "Continue →" | Full-width, brown |

### 4. Responsibility Split

**UI Layer (Presentational)**:
- Render curved arc gauge
- Display 5 selectable points
- Highlight selected point
- Show level number and label
- Position continue button

**Logic Layer (Container/Hooks)**:
- Track selected stress level
- Map level to label
- Handle point selection
- Navigate to next screen
- Save stress level

### 5. State Definition

```typescript
interface StressLevelInputState {
  // Selection
  selectedLevel: number; // 1-5, default 3
  levelLabel: string;

  // UI State
  isSubmitting: boolean;
}
```

### 6. Data Models

```typescript
interface StressLevelOption {
  value: number;
  label: string;
  position: { x: number; y: number }; // Arc position
}

const stressLevels: StressLevelOption[] = [
  { value: 1, label: 'Low', position: { x: 20, y: 80 } },
  { value: 2, label: 'Mild', position: { x: 30, y: 60 } },
  { value: 3, label: 'Moderate', position: { x: 45, y: 45 } },
  { value: 4, label: 'Elevated', position: { x: 65, y: 35 } },
  { value: 5, label: 'High', position: { x: 85, y: 30 } }
];

// Arc positions increase in x and decrease in y as stress increases
// Creating a curved path from bottom-left to top-right
```

### 7. Navigation

| Action | Destination | Parameters |
|--------|-------------|------------|
| Back button | Previous screen | - |
| Continue button | StressorSelector | `{ level: number }` |
| Gauge point tap | Update selection | - |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Default | Level 3 selected |
| Point tapped | Animate to new selection |
| Dragging | Allow drag along arc |
| Continue tapped | Save and navigate |

### 9. Implementation Breakdown

1. **ArcGauge Component**
   - SVG-based curved path
   - 5 points positioned along arc
   - Arc curves from bottom-left to top-right
   - Connecting line segments between points

2. **GaugePoint Component**
   - Circular touchable element
   - Active: Orange with refresh icon
   - Inactive: Brown/gray, smaller
   - Tap or drag to select

3. **Level Display**
   - Large number on right side
   - Label below number
   - Updates in real-time with selection

4. **Arc Interaction**
   - Touch to select nearest point
   - Or drag along arc
   - Smooth animation between points

### 10. Open Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| 98-1 | Refresh icon purpose | Low | Why refresh icon in selected point? |
| 98-2 | Drag interaction unclear | Low | Can user drag along arc or only tap points? |

---

## Screen 99: StressorSelector

### 1. Purpose
Bubble-based selector for users to identify their primary stressor from common categories, with AI-powered impact assessment.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [9:41]                    [Signal][Batt]│
│                                         │
│  (◐) ← Back                             │
│                                         │
│  Select Stressors                       │
│                                         │
│  Our AI will decide how your stressor   │
│  will impacts your life in general.     │
│                                         │
│                                         │
│         ┌─────┐                         │
│         │Work │                         │
│         └─────┘        ┌─────┐          │
│                        │Life │          │
│  ┌─────┐               └─────┘          │
│  │nship│    ╭─────────────╮             │
│  └─────┘    │             │    ┌────┐   │
│             │ Loneliness  │    │ Fin│   │
│             │  (green)    │    └────┘   │
│             │             │             │
│  ┌─────┐    ╰─────────────╯             │
│  │Kids │                    ┌─────┐     │
│  └─────┘                    │Other│     │
│                             └─────┘     │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ ⚠️ Life Impact: Very High          ││
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
| ScreenTitle | "Select Stressors" | Large, white |
| SubtitleText | AI explanation | Gray, small |
| BubbleSelector | Floating bubble layout | Interactive |
| StressorBubble | Individual stressor option | Selected (green, large), Unselected (brown, small) |
| BubbleLabel | Stressor name | White text |
| ImpactBanner | "Life Impact: Very High" | Orange warning pill |
| WarningIcon | Triangle exclamation | In banner |
| ContinueButton | "Continue →" | Full-width, brown |

### 4. Responsibility Split

**UI Layer (Presentational)**:
- Render bubble layout
- Display selected bubble (enlarged, green)
- Show unselected bubbles (smaller, brown)
- Display impact assessment banner
- Handle bubble tap interactions

**Logic Layer (Container/Hooks)**:
- Track selected stressor(s)
- Fetch/calculate impact level
- Update banner based on selection
- Navigate to next screen
- Save stressor selection

### 5. State Definition

```typescript
interface StressorSelectorState {
  // Selection
  selectedStressor: string | null;
  availableStressors: StressorOption[];

  // Impact Assessment
  impactLevel: ImpactLevel;
  impactCalculating: boolean;

  // UI State
  isSubmitting: boolean;
}

interface StressorOption {
  id: string;
  label: string;
  position: BubblePosition;
  isSelected: boolean;
}

interface BubblePosition {
  x: number; // percentage from left
  y: number; // percentage from top
  size: 'small' | 'medium' | 'large';
}
```

### 6. Data Models

```typescript
type StressorCategory =
  | 'Work'
  | 'Life'
  | 'Relationship'
  | 'Kids'
  | 'Finance'
  | 'Loneliness'
  | 'Other';

const stressorOptions: StressorOption[] = [
  { id: 'work', label: 'Work', position: { x: 25, y: 20, size: 'small' } },
  { id: 'life', label: 'Life', position: { x: 70, y: 25, size: 'small' } },
  { id: 'relationship', label: 'Relationship', position: { x: 10, y: 40, size: 'small' } },
  { id: 'loneliness', label: 'Loneliness', position: { x: 45, y: 50, size: 'large' } }, // Selected
  { id: 'finance', label: 'Finance', position: { x: 80, y: 45, size: 'small' } },
  { id: 'kids', label: 'Kids', position: { x: 15, y: 65, size: 'small' } },
  { id: 'other', label: 'Other', position: { x: 75, y: 70, size: 'small' } }
];

// Impact level calculation (AI-based)
interface ImpactAssessment {
  stressor: string;
  level: ImpactLevel;
  factors: string[];
  recommendation?: string;
}
```

### 7. Navigation

| Action | Destination | Parameters |
|--------|-------------|------------|
| Back button | StressLevelInput | - |
| Bubble tap | Update selection | - |
| Continue button | StressDashboard or next step | `{ stressor: string, impact: ImpactLevel }` |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| No selection | Continue button disabled |
| Selection changed | Animate bubble sizes, recalculate impact |
| Impact calculating | Show loading in banner |
| Multi-select? | Design shows single select, but may support multi |
| Custom stressor | "Other" may open text input |

### 9. Implementation Breakdown

1. **BubbleSelector Component**
   - Absolute positioned bubbles
   - Organic/floating appearance
   - Selected bubble: Large, green background
   - Unselected bubbles: Small, brown background
   - Tap to select/deselect

2. **StressorBubble Component**
   - Circular or pill-shaped
   - Animated size change on selection
   - Color change on selection
   - Label centered within

3. **ImpactBanner Component**
   - Fixed position above continue button
   - Orange background
   - Warning icon + text
   - Updates based on selection

4. **Bubble Layout Algorithm**
   - Predefined positions or dynamic
   - Avoid overlapping
   - Selected bubble expands in place
   - Others may shift slightly

### 10. Open Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| 99-1 | **Grammar error** | Medium | "will impacts" should be "will impact" |
| 99-2 | Truncated labels | Medium | "nship" (Relationship), "Fin" (Finance) cut off |
| 99-3 | Single vs multi-select | Medium | Can user select multiple stressors? |
| 99-4 | "Other" behavior | Low | Does "Other" open a text input? |

---

## Cross-Screen Components (Batch 20)

### New Components Identified

| Component | Used In | Priority |
|-----------|---------|----------|
| TimeRangeSelector | Screen 95 | High |
| SleepTimelineChart | Screen 95 | High |
| IrregularityMarker | Screen 95 | Medium |
| SuggestionCard | Screen 95 | High |
| BottomSheetModal | Screen 96 | High |
| DualRangeSlider | Screen 96 | High |
| SleepTypeIconSelector | Screen 96 | Medium |
| StressHeroSection | Screen 97 | Medium |
| DecorativeShapesOverlay | Screen 97 | Low |
| MiniBarChart | Screen 97 | Medium |
| MiniLineChart | Screen 97 | Medium |
| StatsCardPair | Screen 97 | Medium |
| ArcGaugeSelector | Screen 98 | High |
| GaugePoint | Screen 98 | Medium |
| BubbleSelector | Screen 99 | High |
| StressorBubble | Screen 99 | Medium |
| ImpactBanner | Screen 99 | Medium |

### Shared Patterns

1. **Time Range Selection**
   - Horizontal tab bar
   - Options: 1 Day, 1 Week, 1 Month, 1 Year, All Time
   - Used in insights/analytics screens

2. **Arc/Curved Selectors**
   - Non-linear input method
   - Points along curved path
   - Visual feedback on selection

3. **Bubble/Floating Layouts**
   - Organic positioning
   - Variable bubble sizes
   - Selection-based resizing

4. **Impact Banners**
   - Warning/info display
   - Color-coded by severity
   - Positioned near action buttons

---

## Critical Issues Found

### Issue #19: Invalid Date in Filter Screen (Screen 96)

**Location**: `batch-20-sleep-final-stress-start.md` - Screen 96
**Source**: `ui-designs/Dark-mode/🔒 Sleep Quality/Sleep_Quality_Screen_10.png`

**Problem**: Date fields show "2025/18/16" which is an invalid date (no month 18).

**Additional Issues**:
- Button label says "Filter Mood (25)" but this is a Sleep filter
- Should be "Filter Sleep (25)"

**Required Action**:
- [ ] Fix date format to valid date (e.g., "2025/01/16")
- [ ] Correct button label from "Filter Mood" to "Filter Sleep"

---

### Issue #20: Grammar Error in Stressor Selector (Screen 99)

**Location**: `batch-20-sleep-final-stress-start.md` - Screen 99
**Source**: `ui-designs/Dark-mode/🔒 Stress Management/Stress_Management_Screen_03.png`

**Problem**: Subtitle text contains grammar error:

Current: "Our AI will decide how your stressor will **impacts** your life in general."
Correct: "Our AI will decide how your stressor will **impact** your life in general."

**Additional Issue**: Truncated bubble labels:
- "nship" → should be "Relationship"
- "Fin" → should be "Finance" or "Financial"

**Required Action**:
- [ ] Fix grammar: "impacts" → "impact"
- [ ] Ensure all bubble labels are fully visible

---

### Issue #21: Typo in Sleep Insights (Screen 95)

**Location**: `batch-20-sleep-final-stress-start.md` - Screen 95
**Source**: `ui-designs/Dark-mode/🔒 Sleep Quality/Sleep_Quality_Screen_09.png`

**Problem**: Heartbeat Irregularity suggestion contains typo:

Current: "We detected **heatbeat** deviation"
Correct: "We detected **heartbeat** deviation"

**Required Action**:
- [ ] Fix typo: "heatbeat" → "heartbeat"

---

## Summary

| Screen | Name | Status | Critical Issues |
|--------|------|--------|-----------------|
| 95 | SleepInsights | Documented | Typo: "heatbeat" |
| 96 | FilterSleepBottomSheet | Documented | Invalid date, wrong button label |
| 97 | StressDashboard | Documented | None |
| 98 | StressLevelInput | Documented | None |
| 99 | StressorSelector | Documented | Grammar error, truncated labels |

**Total New Components**: 17
**Critical Issues**: 3 (Issues #19, #20, #21)
**Sleep Quality**: COMPLETE (10/10) ✓
**Stress Management**: 3/7 done
