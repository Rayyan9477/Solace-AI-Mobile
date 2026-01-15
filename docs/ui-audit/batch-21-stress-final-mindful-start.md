# Batch 21: Stress Management Final + Mindful Hours Start (Screens 4-7 + 1)

**Screens Covered**: 100-104 (Expression Recording, Camera, Confirmation, Stats + Mindful Dashboard)
**Source Files**:
- `ui-designs/Dark-mode/🔒 Stress Management/Stress_Management_Screen_04.png` through `07.png`
- `ui-designs/Dark-mode/🔒 Mindful Hours/Mindful_Hours_Screen_01.png`

---

## Screen 100: RecordExpressionPrep

### 1. Purpose
Pre-camera preparation screen explaining requirements for facial expression analysis to improve stress detection accuracy.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [9:41]                    [Signal][Batt]│
│                                         │
│  (◐) ← Back                             │
│                                         │
│  Record Expression                      │
│                                         │
│  Let's analyze face expression for      │
│  better stress AI analysis. Ensure      │
│  the following:                         │
│                                         │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ Brightly Lit Room              ☀️  ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ Clear Face Expression          📍  ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ Stay Still                     😊  ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ 720P Camera                    📷  ││
│  └─────────────────────────────────────┘│
│                                         │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │     Skip This Step  ✕               ││
│  └─────────────────────────────────────┘│
│  (orange)                               │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │     Continue  →                     ││
│  └─────────────────────────────────────┘│
│  (olive green)                          │
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Variant/State |
|-----------|-------------|---------------|
| BackButton | Crescent moon | Default |
| ScreenTitle | "Record Expression" | Large, white |
| SubtitleText | Explanation text | Gray, multi-line |
| RequirementCard | Individual requirement | Brown background |
| RequirementLabel | Requirement text | White |
| RequirementIcon | Status icon | Orange, right-aligned |
| SkipButton | "Skip This Step ✕" | Orange, full-width |
| ContinueButton | "Continue →" | Olive green, full-width |

### 4. Responsibility Split

**UI Layer (Presentational)**:
- Display requirement checklist cards
- Show icons for each requirement
- Render skip and continue buttons
- Handle button tap states

**Logic Layer (Container/Hooks)**:
- Check camera permission
- Validate camera resolution
- Detect lighting conditions (optional)
- Navigate to camera or skip
- Track analytics for skip rate

### 5. State Definition

```typescript
interface RecordExpressionPrepState {
  // Permission Status
  cameraPermissionGranted: boolean;
  cameraResolution: string;

  // Requirements Check (optional auto-detection)
  requirements: RequirementStatus[];

  // UI State
  isCheckingPermissions: boolean;
}

interface RequirementStatus {
  id: string;
  label: string;
  icon: IconType;
  isAutoChecked: boolean;
  isPassed: boolean | null; // null if not auto-checked
}
```

### 6. Data Models

```typescript
const expressionRequirements: RequirementStatus[] = [
  {
    id: 'lighting',
    label: 'Brightly Lit Room',
    icon: 'sun',
    isAutoChecked: false, // Manual check
    isPassed: null
  },
  {
    id: 'expression',
    label: 'Clear Face Expression',
    icon: 'pin',
    isAutoChecked: false,
    isPassed: null
  },
  {
    id: 'stillness',
    label: 'Stay Still',
    icon: 'face',
    isAutoChecked: false,
    isPassed: null
  },
  {
    id: 'camera',
    label: '720P Camera',
    icon: 'camera',
    isAutoChecked: true, // Can check device specs
    isPassed: null
  }
];
```

### 7. Navigation

| Action | Destination | Parameters |
|--------|-------------|------------|
| Back button | StressorSelector | - |
| Skip This Step | StressDashboard | `{ skippedExpression: true }` |
| Continue | FacialExpressionCamera | - |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Camera permission denied | Show permission request or disable Continue |
| Low resolution camera | Show warning but allow continue |
| All requirements shown | Static checklist (informational only) |
| Skip pressed | Navigate without camera analysis |

### 9. Implementation Breakdown

1. **RequirementCard Component**
   - Brown/dark background
   - Label text left-aligned
   - Icon right-aligned (orange color)
   - Consistent height and padding

2. **Button Pair**
   - Skip button: Orange, with X icon
   - Continue button: Olive green, with arrow
   - Stacked vertically

3. **Permission Flow**
   - On Continue tap, check camera permission
   - If denied, show system permission dialog
   - Handle denial gracefully

### 10. Open Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| 100-1 | Requirements static | Low | Are these auto-checked or just informational? |
| 100-2 | 720P specific | Low | What if device only supports 480P or 1080P? |

---

## Screen 101: FacialExpressionCamera

### 1. Purpose
Live camera view for capturing facial expression with real-time biometric indicators and face detection overlay for stress analysis.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [9:41]                    [Signal][Batt]│
│                                         │
│  ┌────────┐              ┌────────┐    │
│  │♡ 68bpm │              │134 sys 💧│  │
│  │(green) │              │ (blue)  │    │
│  └────────┘              └────────┘    │
│                                         │
│        ╭────────────────────╮           │
│       ╱                      ╲          │
│      │   ┼───────┼───────┼   │         │
│      │   │       │       │   │         │
│      │   │  [Face in      │   │         │
│      │   │   frame with   │   │         │
│      │   │   grid overlay]│   │         │
│      │   │       │       │   │         │
│      │   ┼───────┼───────┼   │         │
│       ╲                      ╱          │
│        ╰────────────────────╯           │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ ⚡ Stay still for better AI Analysis││
│  └─────────────────────────────────────┘│
│  (yellow/gold banner)                   │
│                                         │
│    ○           ⚙️            ○         │
│  (empty)    (settings)    (empty)       │
│                                         │
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Variant/State |
|-----------|-------------|---------------|
| CameraPreview | Full-screen camera feed | Live video |
| BiometricBadge | Heart rate indicator | Green pill, "68 bpm" |
| BloodPressureBadge | Blood pressure indicator | Blue pill, "134 sys" |
| HeartIcon | Heart symbol | In biometric badge |
| DropletIcon | Blood/pressure symbol | In BP badge |
| FaceDetectionOverlay | Circular frame with grid | White lines |
| FaceFrame | Circular boundary | Dashed or solid circle |
| GridLines | 3x3 grid over face | Alignment guides |
| InstructionBanner | "Stay still..." message | Yellow background |
| LightningIcon | Alert/tip indicator | In banner |
| CameraControls | Bottom button row | Three circular buttons |
| SettingsButton | Filter/adjustment icon | Center position |

### 4. Responsibility Split

**UI Layer (Presentational)**:
- Display camera feed fullscreen
- Render face detection overlay
- Show biometric readings
- Display instruction banner
- Position control buttons

**Logic Layer (Container/Hooks)**:
- Initialize camera stream
- Run face detection model
- Capture biometric data (from wearable?)
- Process expression analysis
- Capture image on trigger
- Send to AI for analysis

### 5. State Definition

```typescript
interface FacialExpressionCameraState {
  // Camera State
  isCameraActive: boolean;
  cameraFacing: 'front' | 'back';

  // Detection State
  faceDetected: boolean;
  facePosition: FacePosition | null;
  isStill: boolean;

  // Biometrics
  heartRate: number | null; // bpm
  bloodPressure: { systolic: number; diastolic?: number } | null;

  // Capture State
  isCapturing: boolean;
  capturedImage: string | null;
}

interface FacePosition {
  x: number;
  y: number;
  width: number;
  height: number;
  isWithinFrame: boolean;
}
```

### 6. Data Models

```typescript
interface BiometricReading {
  type: 'heartRate' | 'bloodPressure';
  value: number;
  unit: string;
  timestamp: Date;
  source: 'camera' | 'wearable' | 'manual';
}

interface ExpressionCapture {
  imageUri: string;
  faceDetected: boolean;
  biometrics: BiometricReading[];
  capturedAt: Date;
  qualityScore: number; // 0-100
}

// Blood pressure interpretation
// Normal: <120 systolic
// Elevated: 120-129
// High Stage 1: 130-139
// High Stage 2: 140+
// Design shows 134 sys = High Stage 1 (concerning)
```

### 7. Navigation

| Action | Destination | Parameters |
|--------|-------------|------------|
| (Auto-capture or button) | StressLevelConfirmation | `{ capture: ExpressionCapture }` |
| Settings button | Camera settings | - |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| No face detected | "Position your face in the frame" |
| Face too far | "Move closer" |
| Face moving | "Stay still" banner shown |
| Poor lighting | "Find better lighting" |
| Capture in progress | Show flash/shutter animation |
| Biometrics unavailable | Hide biometric badges |

### 9. Implementation Breakdown

1. **CameraPreview Component**
   - Full-screen camera feed
   - Front-facing by default
   - Handle camera lifecycle

2. **FaceDetectionOverlay Component**
   - SVG circle for face frame
   - 3x3 grid lines
   - Positioned in center
   - Updates based on face detection

3. **BiometricBadges Component**
   - Two pill-shaped badges at top
   - Heart rate: Green with heart icon
   - Blood pressure: Blue with droplet icon
   - Real-time updates

4. **InstructionBanner Component**
   - Yellow/gold background
   - Lightning icon + text
   - Dynamic based on detection state

### 10. Open Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| 101-1 | High blood pressure shown | Medium | 134 sys is Stage 1 hypertension - concerning placeholder |
| 101-2 | Biometric data source | Medium | How is BP measured from camera? Usually requires wearable |
| 101-3 | Auto-capture trigger | Low | When does capture happen? Button or auto? |
| 101-4 | Empty side buttons | Low | What are the left/right buttons for? |

---

## Screen 102: StressLevelConfirmation

### 1. Purpose
Success confirmation modal showing that stress level has been recorded and synced with the mental health journal and AI system.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [9:41]                    [Signal][Batt]│
│                                         │
│  (◐)  Stress Level                      │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │   [Illustration: Stressed person    ││
│  │    at desk with laptop, papers,     ││
│  │    lightning bolts, checkmark]      ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                         │
│  Stress Level Set to 3                  │
│                                         │
│  Stress condition updated to your       │
│  mental health journal. Data sent to    │
│  Doctor Freud AI.                       │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │   Got It, Thanks!  ✓                ││
│  └─────────────────────────────────────┘│
│  (brown/tan)                            │
│                                         │
│              ( ✕ )                      │
│            (close btn)                  │
│                                         │
│  ╭─────────────────────────────────────╮│
│  │ (Orange gradient wave decoration)   ││
│  ╰─────────────────────────────────────╯│
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Variant/State |
|-----------|-------------|---------------|
| BackButton | Crescent moon | Default |
| ScreenLabel | "Stress Level" | Header, next to back |
| SuccessIllustration | Stressed person at desk | Stylized artwork |
| CheckmarkOverlay | Success indicator | On illustration |
| SuccessTitle | "Stress Level Set to 3" | Large, white |
| SuccessMessage | Explanation text | Gray, multi-line |
| ConfirmButton | "Got It, Thanks! ✓" | Brown/tan, full-width |
| CloseButton | X in circle | Bottom center |
| WaveDecoration | Orange gradient waves | Bottom decoration |

### 4. Responsibility Split

**UI Layer (Presentational)**:
- Display success illustration
- Show confirmation message
- Render action buttons
- Display decorative elements

**Logic Layer (Container/Hooks)**:
- Save stress level to journal
- Sync data with Doctor Freud AI
- Handle confirmation navigation
- Track completion analytics

### 5. State Definition

```typescript
interface StressLevelConfirmationState {
  // Saved Data
  stressLevel: number;
  savedToJournal: boolean;
  sentToAI: boolean;

  // UI State
  isAnimating: boolean;
}
```

### 6. Data Models

```typescript
interface StressLogEntry {
  id: string;
  level: number; // 1-5
  label: string; // "Moderate", "Elevated", etc.
  stressor: string | null;
  expressionCapture?: ExpressionCapture;
  biometrics?: BiometricReading[];
  createdAt: Date;
  syncedToAI: boolean;
}
```

### 7. Navigation

| Action | Destination | Parameters |
|--------|-------------|------------|
| Back button | StressDashboard | - |
| Got It button | StressDashboard | - |
| Close (X) button | StressDashboard | - |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Save in progress | Show loading indicator |
| Save failed | Show retry option |
| AI sync failed | Show warning but allow continue |
| Animation complete | Enable buttons |

### 9. Implementation Breakdown

1. **SuccessIllustration Component**
   - Stylized illustration of stressed person
   - At desk with laptop
   - Lightning bolts indicating stress
   - Checkmark overlay for completion

2. **ConfirmButton Component**
   - Brown/tan background
   - "Got It, Thanks!" text
   - Checkmark icon
   - Full-width

3. **WaveDecoration Component**
   - Orange gradient waves
   - Bottom of screen
   - Decorative only

### 10. Open Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| 102-1 | Redundant close options | Low | Back button, Got It, and X button all do same thing |

---

## Screen 103: StressLevelStats

### 1. Purpose
Visualization of stress level distribution over time using a bubble chart showing frequency of each stress category.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [9:41]                    [Signal][Batt]│
│                                         │
│  (◐) ← Back               ⚙️ Settings   │
│                                         │
│  Stress Level Stats                     │
│                                         │
│  ● Calm   ● Normal   ● Elevated         │
│       ● Stressed   ● Extreme            │
│  (green)  (gray)   (yellow)             │
│         (orange)   (purple)             │
│                                         │
│                                         │
│            ┌─────────┐                  │
│            │   58    │ ← Orange         │
│            │(Stressed)│   (large)       │
│            └─────────┘                  │
│     ┌───┐              ┌───┐            │
│     │ 25│              │ 33│            │
│     │yel│              │gry│            │
│     └───┘              └───┘            │
│                                         │
│  ┌───────────────────────────┐          │
│  │                           │          │
│  │           97              │ ← Green  │
│  │         (Calm)            │  (largest)│
│  │                           │          │
│  └───────────────────────────┘          │
│                                         │
│        📅 Monthly ▼                     │
│                        ┌───┐            │
│                        │ 8 │ ← Purple   │
│                        │ext│   (small)  │
│                        └───┘            │
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Variant/State |
|-----------|-------------|---------------|
| BackButton | Crescent moon | Default |
| ScreenTitle | "Stress Level Stats" | Large, white |
| SettingsButton | Gear icon | Top right |
| StressLegend | 5-item color legend | Two rows |
| LegendDot | Colored circle | Per stress level |
| LegendLabel | Level name | Next to dot |
| BubbleChart | Size-proportional visualization | 5 bubbles |
| StressBubble | Individual stress count | Color-coded, sized |
| BubbleValue | Count number | White, centered |
| PeriodSelector | "Monthly ▼" dropdown | Bottom center |
| CalendarIcon | Calendar symbol | In selector |

### 4. Responsibility Split

**UI Layer (Presentational)**:
- Display legend with colors
- Render bubble chart
- Show count values in bubbles
- Handle period selector dropdown

**Logic Layer (Container/Hooks)**:
- Fetch stress data for period
- Calculate counts per level
- Determine bubble sizes
- Handle period change
- Navigate to settings

### 5. State Definition

```typescript
interface StressLevelStatsState {
  // Data
  stressCounts: StressLevelCount[];
  selectedPeriod: TimePeriod;

  // UI State
  isLoading: boolean;
  isPeriodSelectorOpen: boolean;
}

interface StressLevelCount {
  level: StressLevel;
  count: number;
  color: string;
  percentage: number;
}

type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';
```

### 6. Data Models

```typescript
type StressLevel = 'Calm' | 'Normal' | 'Elevated' | 'Stressed' | 'Extreme';

const stressLevelColors: Record<StressLevel, string> = {
  Calm: '#9AAD5C',     // Green
  Normal: '#6B6B6B',   // Gray
  Elevated: '#C4A535', // Yellow
  Stressed: '#E8853A', // Orange
  Extreme: '#7B68B5'   // Purple
};

// Data from design
const sampleStressStats: StressLevelCount[] = [
  { level: 'Calm', count: 97, color: '#9AAD5C', percentage: 43.7 },
  { level: 'Stressed', count: 58, color: '#E8853A', percentage: 26.1 },
  { level: 'Normal', count: 33, color: '#6B6B6B', percentage: 14.9 },
  { level: 'Elevated', count: 25, color: '#C4A535', percentage: 11.3 },
  { level: 'Extreme', count: 8, color: '#7B68B5', percentage: 3.6 }
];

// Total: 97 + 58 + 33 + 25 + 8 = 221 entries
```

### 7. Navigation

| Action | Destination | Parameters |
|--------|-------------|------------|
| Back button | Previous screen | - |
| Settings button | StressSettings | - |
| Period selector | Update chart | `{ period: TimePeriod }` |
| Bubble tap | Filtered list | `{ level: StressLevel }` |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Loading | Show skeleton bubbles |
| No data | "No stress data yet" message |
| Single entry | One bubble only |
| Zero count for level | Don't show that bubble |
| Period change | Animate bubble resize |

### 9. Implementation Breakdown

1. **StressLegend Component**
   - Two-row layout for 5 items
   - Colored dots with labels
   - Row 1: Calm, Normal, Elevated
   - Row 2: Stressed, Extreme

2. **BubbleChart Component**
   - Absolute positioning for bubbles
   - Size proportional to count
   - Color from stress level
   - Organic/floating layout

3. **StressBubble Component**
   - Circular shape
   - Background color by level
   - White number centered
   - Tap handler for filtering

4. **PeriodSelector Component**
   - Dropdown button
   - Calendar icon
   - "Monthly" text with down arrow
   - Opens period picker

### 10. Open Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| 103-1 | Typo: "Montlhy" | Medium | Should be "Monthly" (if visible in design) |
| 103-2 | Bubble positioning logic | Low | How are bubbles positioned? Random or algorithmic? |
| 103-3 | Tap interaction | Low | Can user tap bubbles for detail? |

---

## Screen 104: MindfulHoursDashboard

### 1. Purpose
Main dashboard for mindful hours feature showing total accumulated mindful time and history of meditation/relaxation sessions.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [9:41]                    [Signal][Batt]│
│                                         │
│  (◐) Mindful Hours                      │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │   (Gray decorative shapes)          ││
│  │                                     ││
│  │           5.21                      ││
│  │         (huge number)               ││
│  │                                     ││
│  │       Mindful Hours                 ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                         │
│           ┌───┐                         │
│           │ + │ ← FAB                   │
│           └───┘                         │
│                                         │
│  Mindful Hour History           (...)   │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ ● Deep Meditation      [Nature]    ││
│  │   ▓▓▓▓▓░░░░░░░░░░░░░░             ││
│  │   05:02            25:00            ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ ● Relaxed State    [Chirping bird] ││
│  │   ▓▓▓▓▓▓▓░░░░░░░░░░░░             ││
│  │   08:33            60:00            ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ ● Deep Meditation      [Fireplace] ││
│  │   (partially visible)               ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Variant/State |
|-----------|-------------|---------------|
| BackButton | Crescent moon | Default |
| FeatureTitle | "Mindful Hours" | White, header |
| HeroSection | Decorative background | Gray shapes |
| TotalHoursDisplay | "5.21" | Huge white number |
| HoursLabel | "Mindful Hours" | Below total |
| FloatingActionButton | Plus button | Brown circle |
| SectionHeader | "Mindful Hour History" | With menu icon |
| MoreOptionsButton | "..." menu | Top right of section |
| SessionCard | Individual session entry | Brown background |
| PlayButton | Circle play icon | Left side |
| SessionTitle | "Deep Meditation", etc. | White text |
| SoundBadge | "Nature", "Chirping bird" | Green/orange pill |
| ProgressBar | Session progress | Filled portion |
| TimeLabels | Start and end time | "05:02" to "25:00" |

### 4. Responsibility Split

**UI Layer (Presentational)**:
- Display total hours prominently
- Render decorative background
- Show session history list
- Display progress bars
- Handle scroll interactions

**Logic Layer (Container/Hooks)**:
- Calculate total mindful hours
- Fetch session history
- Track session progress
- Handle session playback
- Add new session
- Update progress in real-time

### 5. State Definition

```typescript
interface MindfulHoursDashboardState {
  // Summary
  totalHours: number; // 5.21

  // History
  sessions: MindfulSession[];

  // UI State
  isLoading: boolean;
  isPlaying: string | null; // Session ID currently playing
}

interface MindfulSession {
  id: string;
  title: string;
  type: 'meditation' | 'relaxation' | 'breathing' | 'sleep';
  soundscape: string; // "Nature", "Chirping bird", "Fireplace"
  durationMinutes: number; // Total duration
  progressMinutes: number; // Current progress
  completedAt?: Date;
  isComplete: boolean;
}
```

### 6. Data Models

```typescript
interface MindfulSession {
  id: string;
  title: string;
  type: SessionType;
  soundscape: Soundscape;
  duration: number; // minutes
  progress: number; // minutes completed
  startedAt: Date;
  completedAt?: Date;
}

type SessionType = 'Deep Meditation' | 'Relaxed State' | 'Breathing Exercise' | 'Sleep Story';

interface Soundscape {
  name: string;
  color: string; // Badge color
  audioUrl: string;
}

// Sessions from design
const sampleSessions: MindfulSession[] = [
  {
    id: '1',
    title: 'Deep Meditation',
    type: 'Deep Meditation',
    soundscape: { name: 'Nature', color: '#9AAD5C', audioUrl: '...' },
    duration: 25,
    progress: 5.03, // 05:02
    startedAt: new Date()
  },
  {
    id: '2',
    title: 'Relaxed State',
    type: 'Relaxed State',
    soundscape: { name: 'Chirping bird', color: '#9AAD5C', audioUrl: '...' },
    duration: 60,
    progress: 8.55, // 08:33
    startedAt: new Date()
  },
  {
    id: '3',
    title: 'Deep Meditation',
    type: 'Deep Meditation',
    soundscape: { name: 'Fireplace', color: '#E8853A', audioUrl: '...' },
    duration: 30, // Assumed
    progress: 0,
    startedAt: new Date()
  }
];
```

### 7. Navigation

| Action | Destination | Parameters |
|--------|-------------|------------|
| Back button | Home dashboard | - |
| FAB (+) button | NewMindfulSession | - |
| Menu (...) button | History options | Filter, delete, export |
| Session card tap | SessionPlayer | `{ sessionId: string }` |
| Play button | Resume session | `{ sessionId: string }` |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Loading | Skeleton cards |
| No sessions | "Start your first session" message |
| Session playing | Show play/pause state |
| Long history | Virtualized scroll list |
| Session complete | Show checkmark, green progress bar |

### 9. Implementation Breakdown

1. **HeroSection Component**
   - Decorative gray shapes (abstract)
   - Large number display
   - "Mindful Hours" label
   - Could animate on load

2. **TotalHoursDisplay Component**
   - Very large font size
   - Format as X.XX hours
   - Updates when sessions complete

3. **SessionCard Component**
   - Play button (circle with play icon)
   - Title text
   - Soundscape badge (colored pill)
   - Progress bar
   - Time labels (current / total)

4. **ProgressBar Component**
   - Filled portion shows progress
   - Current time left, total time right
   - Color: brown fill, dark background

### 10. Open Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| 104-1 | Time format inconsistent | Low | "05:02" vs "25:00" - is this elapsed vs total? |
| 104-2 | Progress calculation | Low | 05:02 out of 25:00 = ~20% but bar shows ~25% |
| 104-3 | Incomplete sessions | Low | What happens to sessions not finished? |

---

## Cross-Screen Components (Batch 21)

### New Components Identified

| Component | Used In | Priority |
|-----------|---------|----------|
| RequirementChecklist | Screen 100 | Medium |
| RequirementCard | Screen 100 | Low |
| CameraPreviewFull | Screen 101 | High |
| FaceDetectionOverlay | Screen 101 | High |
| BiometricBadgePill | Screen 101 | Medium |
| GridOverlay | Screen 101 | Low |
| InstructionBanner | Screen 101 | Medium |
| SuccessIllustration | Screen 102 | Low |
| WaveDecoration | Screen 102 | Low |
| StressLegend | Screen 103 | Medium |
| BubbleChart | Screen 103 | High |
| StressBubble | Screen 103 | Medium |
| PeriodDropdown | Screen 103 | Medium |
| MindfulHeroSection | Screen 104 | Medium |
| TotalHoursDisplay | Screen 104 | Medium |
| SessionCard | Screen 104 | High |
| SoundscapeBadge | Screen 104 | Low |
| SessionProgressBar | Screen 104 | Medium |
| SessionTimeLabels | Screen 104 | Low |

### Shared Patterns

1. **Stress Level Color System** (5 levels)
   - Calm: Green (#9AAD5C)
   - Normal: Gray (#6B6B6B)
   - Elevated: Yellow (#C4A535)
   - Stressed: Orange (#E8853A)
   - Extreme: Purple (#7B68B5)

2. **Camera/Biometric Integration**
   - Face detection with overlays
   - Heart rate display
   - Blood pressure display
   - Real-time indicators

3. **Session Progress Tracking**
   - Progress bars with time labels
   - Current time / Total time format
   - Play/pause controls

---

## Summary

| Screen | Name | Status | Critical Issues |
|--------|------|--------|-----------------|
| 100 | RecordExpressionPrep | Documented | None |
| 101 | FacialExpressionCamera | Documented | High BP placeholder (134 sys) |
| 102 | StressLevelConfirmation | Documented | None |
| 103 | StressLevelStats | Documented | None |
| 104 | MindfulHoursDashboard | Documented | None |

**Total New Components**: 19
**Critical Issues**: None (minor placeholder data issues)
**Stress Management**: COMPLETE (7/7) ✓
**Mindful Hours**: 1/8 done
