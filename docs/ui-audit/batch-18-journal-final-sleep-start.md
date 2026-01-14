# Batch 18: Mental Health Journal Final + Sleep Quality Start (Screens 8-9 + 1-3)

**Screens Covered**: 85-89 (Journal Edit, Crisis Alert + Sleep Dashboard, Gauge, Calendar)
**Source Files**:
- `ui-designs/Dark-mode/🔒 Mental Health Journal/Mental_Health_Journal_Screen_08.png` through `09.png`
- `ui-designs/Dark-mode/🔒 Sleep Quality/Sleep_Quality_Screen_01.png` through `03.png`

---

## Screen 85: JournalEntryEditor

### 1. Purpose
Full-screen editor for modifying existing journal entries with text formatting and keyword highlighting capabilities.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [9:41]                    [Signal][Batt]│
│                                         │
│  (◐) ← Back    Edit Journal             │
│                                         │
│                                         │
│  Feeling Bad                            │
│  Again! 😡                              │
│                                         │
│  I just felt so overwhelmed, you know?  │
│  It's like everything piled up at once. │
│                                         │
│  Maybe I'm just stressed about exams    │
│  and assignments. I try to stay positive│
│  but some days it's really hard. Do you │
│  have any tips on managing stress and   │
│  staying [calm in situations] like this?│
│         └─ highlighted in green         │
│                                         │
│     ┌─────┐   ┌─────┐                  │
│     │  ↶  │   │  ~  │                  │
│     └─────┘   └─────┘                  │
│    (green)   (brown)                    │
│                                         │
│  Tap to continue your journal!          │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  🏠    ✏️    ↑    ⚙️            │  │
│  │ (org)  (wht) (wht) (wht)         │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Variant/State |
|-----------|-------------|---------------|
| BackButton | Crescent moon | Default |
| ScreenTitle | "Edit Journal" | Header text, white |
| EntryTitle | Journal title with emoji | Large, white, bold |
| EntryContent | Editable body text | Multi-line, white |
| TextHighlight | Keyword highlight | Green background rectangle |
| UndoButton | Curved arrow icon | Green circular button |
| RedoButton | Wavy line icon | Brown circular button |
| PromptText | "Tap to continue your journal!" | Gray, small |
| BottomToolbar | Action buttons row | Fixed bottom |
| HomeButton | House icon | Orange circular background |
| EditButton | Pen icon | White icon |
| ShareButton | Upload/Share icon | White icon |
| SettingsButton | Sliders icon | White icon |

### 4. Responsibility Split

**UI Layer (Presentational)**:
- Display journal title and content
- Render text with highlighted keywords
- Show undo/redo buttons
- Display bottom toolbar with actions
- Handle tap interactions

**Logic Layer (Container/Hooks)**:
- Load journal entry data
- Track edit history for undo/redo
- Apply/remove text formatting
- Save changes automatically
- Handle navigation to other screens

### 5. State Definition

```typescript
interface JournalEntryEditorState {
  // Entry Data
  entryId: string;
  title: string;
  content: string;

  // Editor State
  highlights: TextHighlight[];
  editHistory: EditHistoryItem[];
  currentHistoryIndex: number;

  // UI State
  hasUnsavedChanges: boolean;
  isSaving: boolean;
}

interface TextHighlight {
  text: string;
  startIndex: number;
  endIndex: number;
  color: string; // e.g., "#9AAD5C" for green
}

interface EditHistoryItem {
  timestamp: Date;
  content: string;
  highlights: TextHighlight[];
}
```

### 6. Data Models

```typescript
interface JournalEntry {
  id: string;
  title: string;
  content: string;
  highlights: TextHighlight[];
  createdAt: Date;
  updatedAt: Date;
  mood: Mood;
  stressor?: string;
}
```

### 7. Navigation

| Action | Destination | Parameters |
|--------|-------------|------------|
| Back button | JournalTimelineList | - |
| Home button (toolbar) | Home dashboard | - |
| Edit button | Current screen | - |
| Share button | Share modal/sheet | `{ entryId: string }` |
| Settings button | Journal settings | - |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Loading entry | Show skeleton placeholder |
| Empty content | Show placeholder text |
| Undo available | Green undo button enabled |
| No undo history | Undo button disabled/grayed |
| Redo available | Redo button enabled |
| No redo history | Redo button disabled |
| Unsaved changes | Auto-save or show indicator |
| Long content | Scrollable text area |
| Highlighting text | User selection → highlight action |

### 9. Implementation Breakdown

1. **EntryContent Component**
   - Multi-line text display/edit
   - Support for styled text ranges
   - Tap to edit inline
   - Auto-expand as content grows

2. **TextHighlight Component**
   - Render colored background behind text
   - Multiple highlights supported
   - Potentially AI-detected keywords or user-selected

3. **UndoRedoControls Component**
   - Two circular buttons
   - Enable/disable based on history
   - Tap to navigate edit history

4. **BottomToolbar Component**
   - Four action buttons
   - Active button highlighted (orange home)
   - Consistent across journal screens

### 10. Open Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| 85-1 | Undo/Redo icons unclear | Low | Curved arrow and wavy line not standard undo/redo symbols |
| 85-2 | Edit mode indication | Medium | Is this always in edit mode or view mode? |
| 85-3 | Prompt text unclear | Low | "Tap to continue" - continue what? Add more text? |

---

## Screen 86: CrisisSupportAlert (CRITICAL ISSUE)

### 1. Purpose
Emergency modal that appears when AI detects suicidal language patterns in journal entries, providing immediate crisis support resources.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [9:41]                    [Signal][Batt]│
│                                         │
│ ┌───────────────────────────────────────┐│
│ │                                       ││
│ │  [Illustration: Stressed person]     ││
│ │  (woman with anxious expression)     ││
│ │  (decorative plant leaves)           ││
│ │                                       ││
│ │  Suicidal Mental Pattern             ││
│ │  Detected by AI!                     ││
│ │                                       ││
│ │  Our AI detected multiple account    ││
│ │  where you mentioned suicide on your ││
│ │  journal. Crisis support is now      ││
│ │  active.                             ││
│ │                                       ││
│ │  ┌─────────────────────────────────┐ ││
│ │  │ ⚠️ Crisis Support Now Active.  │ ││
│ │  └─────────────────────────────────┘ ││
│ │                                       ││
│ │  ┌─────────────────────────────────┐ ││
│ │  │ 📞 Call For Help!              │ ││
│ │  └─────────────────────────────────┘ ││
│ │                                       ││
│ │    ●                       ✕          ││
│ │ (brown)                  (white)     ││
│ └───────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Variant/State |
|-----------|-------------|---------------|
| ModalOverlay | Dark background overlay | Semi-transparent |
| AlertModal | White card container | Rounded corners |
| AlertIllustration | Anxious person graphic | Top section |
| AlertTitle | "Suicidal Mental Pattern Detected by AI!" | Bold, dark |
| AlertBody | Description text | Gray, multi-line |
| PrimaryActionButton | "Crisis Support Now Active." | Blue/purple, with warning icon |
| SecondaryActionButton | "Call For Help!" | Light purple, with phone icon |
| DismissButton | Brown circle with 0 | Bottom left |
| CloseButton | White circle with X | Bottom right |

### 4. Responsibility Split

**UI Layer (Presentational)**:
- Display modal overlay
- Show alert illustration
- Render warning message
- Display action buttons
- Handle button taps

**Logic Layer (Container/Hooks)**:
- AI pattern detection trigger
- Log crisis alert event
- Open crisis support resources
- Initiate phone call
- Track user response
- Send alert to support team

### 5. State Definition

```typescript
interface CrisisSupportAlertState {
  // Alert State
  isVisible: boolean;
  triggerReason: string; // What triggered the alert
  detectedPhrases: string[]; // Phrases that triggered detection

  // Action State
  crisisSupportActivated: boolean;
  emergencyContactsCalled: boolean;

  // Tracking
  alertShownAt: Date;
  userResponse: 'acknowledged' | 'called' | 'dismissed' | null;
}
```

### 6. Data Models

```typescript
interface CrisisAlert {
  id: string;
  userId: string;
  triggeredAt: Date;
  triggerSource: 'journal' | 'chat' | 'assessment';
  detectedPatterns: string[];
  severityLevel: 'low' | 'medium' | 'high' | 'critical';
  userResponse: CrisisAlertResponse | null;
  supportTeamNotified: boolean;
}

interface CrisisAlertResponse {
  action: 'acknowledged' | 'called_help' | 'dismissed';
  timestamp: Date;
}

// Crisis resources
interface CrisisResource {
  type: 'hotline' | 'chat' | 'emergency' | 'professional';
  name: string;
  phoneNumber?: string;
  url?: string;
  available24_7: boolean;
}
```

### 7. Navigation

| Action | Destination | Parameters |
|--------|-------------|------------|
| Crisis Support button | Crisis support screen | Activate resources |
| Call For Help button | Phone dialer | Emergency hotline number |
| Dismiss (0 button) | Previous screen | Log dismissal |
| Close (X button) | Previous screen | Log closure |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| First time shown | Maybe show tutorial/explanation |
| Repeat trigger | Escalate support level |
| Support already active | Update button text to "View Support" |
| Call initiated | Show confirmation, track call |
| Dismissed | Log event, maybe show follow-up later |
| User not responding | Consider additional escalation |

### 9. Implementation Breakdown

1. **AI Pattern Detection**
   - Scan journal text for crisis keywords
   - Use NLP to detect context
   - Threshold-based triggering
   - Avoid false positives

2. **CrisisAlert Modal**
   - Full-screen overlay
   - Cannot be easily dismissed
   - Persistent until action taken
   - Clear, empathetic messaging

3. **Crisis Support Integration**
   - Link to crisis resources screen
   - Hotline numbers (988, etc.)
   - Chat support options
   - Professional referrals

4. **Tracking and Logging**
   - Log every alert shown
   - Track user responses
   - Alert support team if needed
   - Follow-up mechanisms

### 10. Open Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| 86-1 | **CRITICAL: Using suicidal content as example** | **CRITICAL** | See Issue #18 in CRITICAL-ISSUES.md |
| 86-2 | "multiple account" typo | Medium | Should be "multiple accounts" or "instances" |
| 86-3 | Button text ambiguous | Medium | "Crisis Support Now Active" - is this status or action? |
| 86-4 | Legal compliance | Critical | Crisis detection features require legal review |
| 86-5 | Medical compliance | Critical | Needs clinical professional review |
| 86-6 | False positive handling | High | What if AI is wrong? |

---

## Screen 87: SleepDashboard

### 1. Purpose
Main dashboard for sleep tracking feature showing overall sleep score, quality assessment, and key sleep stage metrics.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [9:41]                    [Signal][Batt]│
│                                         │
│  (◐) ← Back    Sleep Quality            │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │         (decorative clouds)         ││
│  │                                     ││
│  │            20                       ││
│  │         (huge score)                ││
│  │                                     ││
│  │    You are Insomniac.               ││
│  │                                     ││
│  │         ┌─────┐                     ││
│  │         │  +  │ ← FAB               ││
│  │         └─────┘                     ││
│  └─────────────────────────────────────┘│
│  (purple gradient background)           │
│                                         │
│  Sleep Overview              See All    │
│                                         │
│  ┌──────────────┬──────────────────┐    │
│  │     Rem  🌙  │    Core  🛏️     │    │
│  │              │                  │    │
│  │    ●━━━━     │      ●━━━━       │    │
│  │     8.5h     │       7.8h       │    │
│  │   (green)    │     (orange)     │    │
│  └──────────────┴──────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Variant/State |
|-----------|-------------|---------------|
| BackButton | Crescent moon | White on purple |
| ScreenTitle | "Sleep Quality" | White text |
| HeroSection | Purple gradient card | Top section |
| DecorativeElements | Cloud shapes | Semi-transparent |
| SleepScoreDisplay | Large "20" number | White, huge font |
| StatusLabel | "You are Insomniac." | White text |
| FloatingActionButton | "+" button | Brown circular FAB |
| SectionHeader | "Sleep Overview" | With "See All" link |
| SeeAllLink | "See All" | Tan/beige color |
| SleepMetricCard | Rem/Core stats | Two-column grid |
| MetricIcon | Moon/Bed icons | White icons |
| MetricLabel | "Rem", "Core" | White text |
| CircularProgress | Ring progress indicator | Partial fill |
| MetricValue | "8.5h", "7.8h" | Large, centered |

### 4. Responsibility Split

**UI Layer (Presentational)**:
- Display sleep score prominently
- Show quality assessment label
- Render decorative background
- Display sleep stage metrics
- Show circular progress rings
- Position FAB button

**Logic Layer (Container/Hooks)**:
- Fetch sleep data for date range
- Calculate sleep score (0-100)
- Determine quality status (Insomniac, Poor, Fair, Good, Excellent)
- Break down REM vs Core sleep
- Handle navigation to details
- Trigger add sleep entry

### 5. State Definition

```typescript
interface SleepDashboardState {
  // Sleep Data
  sleepScore: number; // 0-100
  sleepQuality: SleepQuality;
  remSleep: number; // hours
  coreSleep: number; // hours
  totalSleep: number; // hours

  // Date Range
  dateRange: DateRange;

  // UI State
  isLoading: boolean;
}

type SleepQuality = 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Insomniac';

interface DateRange {
  startDate: Date;
  endDate: Date;
}
```

### 6. Data Models

```typescript
interface SleepData {
  date: Date;
  score: number; // 0-100
  quality: SleepQuality;
  breakdown: SleepBreakdown;
  totalHours: number;
}

interface SleepBreakdown {
  remSleep: number; // hours
  coreSleep: number; // hours
  lightSleep?: number;
  deepSleep?: number;
  awake?: number;
}

// Sleep score calculation
function calculateSleepQuality(score: number): SleepQuality {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  if (score >= 20) return 'Poor';
  return 'Insomniac';
}
```

### 7. Navigation

| Action | Destination | Parameters |
|--------|-------------|------------|
| Back button | Home dashboard | - |
| See All link | SleepDetailedView | - |
| FAB (+) button | AddSleepEntry | - |
| Rem card tap | RemSleepDetails | `{ type: 'rem' }` |
| Core card tap | CoreSleepDetails | `{ type: 'core' }` |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Loading | Show skeleton placeholders |
| No sleep data | Show "Track your first sleep" message |
| Excellent score (80+) | Green theme, positive message |
| Poor score (0-20) | Red/purple theme, supportive message |
| Missing breakdown | Show only total sleep |
| Zero sleep | Special handling, alert user |

### 9. Implementation Breakdown

1. **HeroSection Component**
   - Purple gradient background
   - Decorative cloud elements
   - Large centered score
   - Quality label
   - FAB overlay

2. **SleepScoreDisplay Component**
   - Huge number (20 in design)
   - Score 0-100 range
   - Color varies by score range
   - Animation on score change

3. **SleepMetricCard Component**
   - Icon with label
   - Circular progress ring
   - Hours value centered
   - Color coding:
     - Green for REM
     - Orange for Core

4. **Quality Assessment Logic**
   - Map score to quality label
   - Use thresholds
   - Color coordination
   - Supportive messaging

### 10. Open Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| 87-1 | Score seems backwards | Medium | Score of 20 labeled "Insomniac" suggests lower = worse, but typically higher = better |
| 87-2 | Sleep stage terminology | Low | "Core" vs "Deep" sleep - clarify standard terminology |
| 87-3 | Total hours not shown | Low | REM 8.5h + Core 7.8h = 16.3h total - unrealistic? |

---

## Screen 88: SleepQualityGauge

### 1. Purpose
Visualize sleep quality distribution using a fan/gauge chart showing breakdown of Normal, Core, REM, Irregular, and Insomniac sleep patterns.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [9:41]                    [Signal][Batt]│
│                                         │
│  (◐) ← Back                             │
│                                         │
│                                         │
│  Sleep Quality                          │
│  87% better from last month.            │
│                                         │
│  ● Normal   ● Core   ● REM              │
│  ● Irregular   ● Insomniac              │
│                                         │
│                                         │
│        ╱──────────────────╲              │
│       ╱ \   (green)     / ╲              │
│      ╱   \            /   ╲              │
│     ╱(ora)\         /(yel) ╲             │
│    ╱       ╲       ╱  (pur) ╲            │
│   ╱─────────●─────────────────╲          │
│  (Fan/gauge chart visualization)         │
│                                         │
│           ┌─────┐                        │
│           │ ≡≡  │  ← Chart icon          │
│           └─────┘                        │
│                                         │
│  (🏠)                          (⚙️)      │
│                                         │
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Variant/State |
|-----------|-------------|---------------|
| BackButton | Crescent moon | Default |
| ScreenTitle | "Sleep Quality" | Large, white |
| ImprovementStat | "87% better from last month." | Small, gray |
| LegendRow | Sleep type indicators | Colored dots + labels |
| LegendDot | Colored circle | 5 colors |
| LegendLabel | Type name | White text |
| GaugeChart | Fan-shaped visualization | Multi-segment |
| ChartSegment | Individual sleep type slice | Colored wedge |
| CenterButton | Chart icon in circle | White background |
| BottomNav | Home and Settings buttons | Fixed bottom |
| HomeButton | House icon | Brown circle |
| SettingsButton | Gear icon | Brown circle |

### 4. Responsibility Split

**UI Layer (Presentational)**:
- Render gauge/fan chart
- Display legend with color coding
- Show improvement statistic
- Position navigation buttons
- Handle segment interactions

**Logic Layer (Container/Hooks)**:
- Fetch sleep data for period
- Calculate percentages per type
- Compute month-over-month change
- Determine segment sizes
- Handle chart interactions
- Navigate to detailed views

### 5. State Definition

```typescript
interface SleepQualityGaugeState {
  // Sleep Distribution
  sleepDistribution: SleepTypeDistribution;

  // Comparison
  currentPeriodScore: number;
  previousPeriodScore: number;
  improvementPercentage: number;

  // UI State
  selectedSegment: SleepType | null;
  isLoading: boolean;
}

interface SleepTypeDistribution {
  normal: number; // percentage
  core: number;
  rem: number;
  irregular: number;
  insomniac: number;
}

type SleepType = 'normal' | 'core' | 'rem' | 'irregular' | 'insomniac';
```

### 6. Data Models

```typescript
interface SleepTypeData {
  type: SleepType;
  percentage: number;
  hours: number;
  color: string;
  label: string;
}

const sleepTypeColors: Record<SleepType, string> = {
  normal: '#9AAD5C',    // Green
  core: '#6B6B6B',      // Gray
  rem: '#C4A535',       // Yellow/Gold
  irregular: '#E8853A', // Orange
  insomniac: '#7B68B5'  // Purple
};

interface SleepPeriodComparison {
  currentPeriod: {
    startDate: Date;
    endDate: Date;
    averageScore: number;
  };
  previousPeriod: {
    startDate: Date;
    endDate: Date;
    averageScore: number;
  };
  improvementPercentage: number; // Positive = better
}
```

### 7. Navigation

| Action | Destination | Parameters |
|--------|-------------|------------|
| Back button | SleepDashboard | - |
| Home button | Home dashboard | - |
| Settings button | Sleep settings | - |
| Chart segment tap | SleepTypeDetail | `{ type: SleepType }` |
| Center button tap | Alternative view? | - |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Loading | Show loading spinner in chart center |
| No data | Empty gauge, message |
| All one type | Full gauge single color |
| Zero sleep | Special handling |
| Improvement positive | Green indicator, positive messaging |
| Improvement negative | Red indicator, "% worse" |
| First month | No comparison available |

### 9. Implementation Breakdown

1. **GaugeChart Component**
   - SVG-based fan chart
   - Multiple colored segments
   - Proportional to data percentages
   - Smooth transitions
   - Interactive segments

2. **Legend Component**
   - Five sleep types
   - Color dots matching chart
   - Two-row layout
   - Tap to highlight chart segment

3. **Improvement Statistic**
   - Calculate percentage change
   - Format as "87% better/worse"
   - Color-coded (green/red)
   - Month-over-month by default

4. **Chart Segment Calculation**
   - Convert percentages to angles
   - Start from bottom center
   - Fan out in order
   - Each segment proportional

### 10. Open Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| 88-1 | Chart center button purpose | Medium | What does the chart icon do? |
| 88-2 | Sleep type definitions | Medium | Clarify difference between Normal, Core, REM, Irregular, Insomniac |
| 88-3 | Percentage calculation | Low | What does "87% better" mean? Score increase or quality improvement? |

---

## Screen 89: SleepCalendarHistory

### 1. Purpose
Calendar view with date selector and chronological list of sleep entries, showing sleep duration, quality badges, and AI suggestions.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [9:41]                    [Signal][Batt]│
│                                         │
│  (◐) ← Back                             │
│                                         │
│  January 2025              < >          │
│                                         │
│  Mon Tue Wed Thu Fri Sat Sun            │
│  29  30  31  1   2   3   4              │
│  5   6   7  [8] [9] [10] 11 ← selected  │
│  12  13  14  15  16  17  18             │
│  19  20  21  22  23  24  25             │
│  26  27  28  29  30                     │
│  ● Schedule  ▲ Autosugg  ★ REM Stage   │
│                                         │
│  Sleep AI Suggestions      See All →    │
│  ┌─────────────────────────────────────┐│
│  │  80+                     →          ││
│  │  Sleep Patterns                     ││
│  └─────────────────────────────────────┘│
│                                         │
│  Sleep History              See All →   │
│                                         │
│  Jan  You slept for 4.2h   [Insomniac] │
│  12   ● No Suggestions              96  │
│                                         │
│  Jan  You slept for 1.3h       [Core]  │
│  11   ● Irregularity                88  │
│                                         │
│  Jan  You slept for 2.3h               │
│  10   ● No Suggestions                 │
│                                         │
│  Jan  You slept for 3.2h [Autosuggesti]│
│   9   ● 3 AI Suggestions           108  │
│                                         │
│  Jan  You slept for 8.2h       [Core]  │
│   9   ● 3 AI S.                   148  │
│         ┌───┐                           │
│         │ + │ ← FAB                     │
│         └───┘                           │
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Variant/State |
|-----------|-------------|---------------|
| BackButton | Crescent moon | Default |
| MonthHeader | "January 2025" | With prev/next arrows |
| MonthNavigator | < > arrows | Navigate months |
| CalendarGrid | 7-column grid | Days of month |
| DayCell | Individual date | Selected range (8-10 green) |
| CalendarLegend | Schedule, Autosugg, REM indicators | Bottom of calendar |
| SectionHeader | "Sleep AI Suggestions" | With "See All" link |
| SuggestionCard | "80+ Sleep Patterns" | Gray card with arrow |
| HistoryHeader | "Sleep History" | With "See All" link |
| SleepHistoryItem | Individual sleep entry | Date, duration, badge |
| DateLabel | "Jan 12", "Jan 11", etc. | Left column |
| SleepSummary | "You slept for 4.2h" | Main text |
| QualityBadge | "Insomniac", "Core", etc. | Colored pill badge |
| MetadataRow | Suggestions + heart rate | Small gray text |
| FloatingActionButton | "+" button | Green circular |

### 4. Responsibility Split

**UI Layer (Presentational)**:
- Render calendar grid with dates
- Show selected date range
- Display sleep history list
- Render quality badges
- Show AI suggestions
- Position FAB

**Logic Layer (Container/Hooks)**:
- Fetch sleep entries for month
- Handle date range selection
- Calculate daily indicators
- Load AI suggestions
- Navigate between months
- Handle entry taps

### 5. State Definition

```typescript
interface SleepCalendarHistoryState {
  // Calendar State
  currentMonth: Date;
  selectedDateRange: [Date, Date] | null;

  // Sleep Data
  sleepEntries: SleepEntry[];
  aiSuggestions: AISuggestion[];

  // UI State
  isLoading: boolean;
  calendarIndicators: Map<string, CalendarDayIndicator>; // date string -> indicator
}

interface CalendarDayIndicator {
  hasSchedule: boolean;
  hasAutoSuggestion: boolean;
  hasREMStage: boolean;
  sleepQuality?: SleepType;
}

interface SleepEntry {
  id: string;
  date: Date;
  duration: number; // hours
  quality: SleepType;
  suggestions: number; // count
  heartRate?: number; // bpm
  hasIrregularity: boolean;
}

interface AISuggestion {
  id: string;
  title: string;
  count: number; // "80+" patterns
  category: string;
}
```

### 6. Data Models

```typescript
interface SleepHistoryItem {
  id: string;
  date: Date;
  sleepDuration: number; // hours
  sleepQuality: SleepType;
  qualityBadge: {
    label: string;
    color: string;
  };
  aiSuggestionsCount: number;
  heartRate?: number;
  irregularityDetected: boolean;
}

// Sample data from design
const sampleSleepHistory: SleepHistoryItem[] = [
  {
    id: '1',
    date: new Date('2025-01-12'),
    sleepDuration: 4.2,
    sleepQuality: 'insomniac',
    qualityBadge: { label: 'Insomniac', color: '#7B68B5' },
    aiSuggestionsCount: 0,
    heartRate: 96,
    irregularityDetected: false
  },
  {
    id: '2',
    date: new Date('2025-01-11'),
    sleepDuration: 1.3,
    sleepQuality: 'core',
    qualityBadge: { label: 'Core', color: '#6B6B6B' },
    aiSuggestionsCount: 0,
    heartRate: 88,
    irregularityDetected: true
  },
  // ... more entries
];
```

### 7. Navigation

| Action | Destination | Parameters |
|--------|-------------|------------|
| Back button | SleepDashboard | - |
| Month arrows | Navigate calendar | `{ month: Date }` |
| Day cell tap | Select date | Update selected range |
| History item tap | SleepEntryDetail | `{ entryId: string }` |
| Suggestion card tap | AI Suggestions list | - |
| See All links | Respective detailed views | - |
| FAB (+) | AddSleepEntry | - |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Loading | Show skeleton calendar and list |
| No entries for month | Empty state message |
| Date range selected | Highlight range, filter history |
| Today's date | Highlight/bold in calendar |
| Future dates | Disabled or grayed out |
| Long history | Virtualized list for performance |
| Multiple entries per day | Group or show separately |

### 9. Implementation Breakdown

1. **CalendarGrid Component**
   - 7-column layout (Mon-Sun)
   - Dynamic month generation
   - Date range selection
   - Day indicators (schedule, autosugg, REM)
   - Color coding for sleep quality

2. **SleepHistoryList Component**
   - Chronological list
   - Date labels in left column
   - Sleep duration and quality
   - Colored badges
   - AI suggestions count
   - Heart rate display

3. **CalendarLegend Component**
   - Three indicator types
   - Schedule (dot)
   - Autosuggestion (triangle)
   - REM Stage (star)

4. **Date Range Selection**
   - Tap first date → start range
   - Tap second date → end range
   - Highlight all dates in between
   - Filter history by range

### 10. Open Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| 89-1 | Very low sleep durations | High | 1.3h, 2.3h, 4.2h all below healthy minimum - placeholder data issue |
| 89-2 | Date range behavior unclear | Medium | Days 8-10 selected - what happens? Filter history? |
| 89-3 | Multiple entries per day | Medium | Jan 9 has two entries - how are these handled? |
| 89-4 | Calendar legend truncation | Low | "Autosugg" truncated - need full text |
| 89-5 | Very high heart rates | Medium | 148 bpm during sleep is abnormally high |

---

## Cross-Screen Components (Batch 18)

### New Components Identified

| Component | Used In | Priority |
|-----------|---------|----------|
| KeywordHighlighter | Screen 85 | Medium |
| UndoRedoControls | Screen 85 | Low |
| JournalToolbar | Screen 85 | Medium |
| CrisisAlertModal | Screen 86 | **CRITICAL** |
| CrisisIllustration | Screen 86 | Medium |
| EmergencyActionButtons | Screen 86 | High |
| SleepScoreHero | Screen 87 | High |
| DecorativeBackground | Screen 87 | Low |
| SleepMetricCard | Screen 87 | High |
| CircularProgressRing | Screen 87 | High |
| GaugeChart | Screen 88 | High |
| FanChartSegment | Screen 88 | Medium |
| SleepTypeLegend | Screen 88 | Medium |
| MonthCalendarGrid | Screen 89 | High |
| CalendarDayCell | Screen 89 | Medium |
| CalendarDateRange | Screen 89 | Medium |
| SleepHistoryCard | Screen 89 | High |
| QualityBadgePill | Screen 89 | Medium |
| AISuggestionCard | Screen 89 | Medium |

### Shared Patterns

1. **Sleep Quality Color Coding**
   - Normal: Green (#9AAD5C)
   - Core: Gray (#6B6B6B)
   - REM: Yellow/Gold (#C4A535)
   - Irregular: Orange (#E8853A)
   - Insomniac: Purple (#7B68B5)

2. **Score-Based Assessment**
   - 0-100 scale common
   - Verbal labels (Insomniac, Poor, Fair, Good, Excellent)
   - Color-coded by severity

3. **Crisis Detection**
   - AI pattern recognition
   - Immediate modal alert
   - Emergency resources
   - Support team notification

---

## Critical Issues Found

### CRITICAL: Screen 86 - Crisis Detection Modal Content

**Issue**: The crisis alert modal itself uses suicidal language in the design placeholder:

**Title**: "Suicidal Mental Pattern Detected by AI!"
**Body**: "Our AI detected multiple account where you mentioned suicide on your journal."

**Risk Level**: **CRITICAL**

**Impact**:
- Using "suicidal" in the alert title is too direct and potentially triggering
- The feature itself is valuable but needs gentler, more clinical language
- "multiple account" is grammatically incorrect (should be "accounts" or "instances")
- Modal design is appropriate for severity but language needs refinement

**Required Actions**:
- [ ] Reword alert title to be supportive, not alarming
- [ ] Use clinical, gentle language
- [ ] Fix grammar errors
- [ ] Review with mental health professionals
- [ ] Ensure compliance with crisis intervention best practices

**Suggested Rewording**:
| Current | Suggested |
|---------|-----------|
| "Suicidal Mental Pattern Detected by AI!" | "We noticed you might be struggling" |
| "multiple account where you mentioned suicide" | "patterns in your entries that concern us" |

### Other Issues: Screen 89 - Unrealistic Sleep Data

**Issue**: Sleep history shows multiple very low sleep durations (1.3h, 2.3h, 4.2h) which are below healthy minimums.

**Additional Issue**: Heart rate of 148 bpm during sleep is abnormally high (normal is 40-60 bpm).

---

## Summary

| Screen | Name | Status | Critical Issues |
|--------|------|--------|-----------------|
| 85 | JournalEntryEditor | Documented | None |
| 86 | CrisisSupportAlert | Documented | **CRITICAL: Language** |
| 87 | SleepDashboard | Documented | None |
| 88 | SleepQualityGauge | Documented | None |
| 89 | SleepCalendarHistory | Documented | Unrealistic data |

**Total New Components**: 20
**Critical Issues**: 1 (Crisis alert language)
**Mental Health Journal**: COMPLETE (9/9) ✓
**Sleep Quality**: Started (3/10)
