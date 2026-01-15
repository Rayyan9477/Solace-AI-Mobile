# Batch 19: Sleep Quality Continued (Screens 4-8)

**Screens Covered**: 90-94 (Start Sleep, Schedule, Sleeping, Wake Up, Summary)
**Source Files**: `ui-designs/Dark-mode/🔒 Sleep Quality/Sleep_Quality_Screen_04.png` through `08.png`

---

## Screen 90: StartSleepingScreen

### 1. Purpose
Initiation screen for manual sleep tracking with large interactive button to start sleep session, or option to schedule sleep for later.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [9:41]                    [Signal][Batt]│
│                                         │
│                                         │
│                                         │
│    ╭───────────────────────╮            │
│   ╱  ╭─────────────────╮   ╲           │
│  │   │  ╭───────────╮  │    │          │
│  │   │  │  ╭─────╮  │  │    │          │
│  │   │  │  │  ▶  │  │  │    │          │
│  │   │  │  ╰─────╯  │  │    │          │
│  │   │  ╰───────────╯  │    │          │
│  │   ╰─────────────────╯    │          │
│   ╲                         ╱           │
│    ╰───────────────────────╯            │
│   (Concentric circles - tan/brown)      │
│                                         │
│                                         │
│      Start Sleeping                     │
│                                         │
│                                         │
│                                         │
│                                         │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ 🗓️  Or Schedule Sleep              ││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Variant/State |
|-----------|-------------|---------------|
| ConcentricCircles | Decorative background | 4-5 circles, tan/brown gradient |
| PlayButton | Large play icon in center | White, tap to start |
| ActionLabel | "Start Sleeping" | White, large, centered |
| SecondaryButton | "Or Schedule Sleep" | Border button with calendar icon |
| CalendarIcon | Small icon in button | White |

### 4. Responsibility Split

**UI Layer (Presentational)**:
- Display concentric circle design
- Render large play button
- Show action labels
- Display schedule option button

**Logic Layer (Container/Hooks)**:
- Handle start sleep tap
- Navigate to sleep schedule form
- Initialize sleep tracking session
- Request necessary permissions (e.g., Do Not Disturb)
- Store sleep start timestamp

### 5. State Definition

```typescript
interface StartSleepingScreenState {
  // UI State
  isStarting: boolean;
  hasScheduledSleep: boolean;

  // Permissions
  doNotDisturbGranted: boolean;
  notificationPermissionGranted: boolean;
}
```

### 6. Data Models

```typescript
interface SleepSession {
  id: string;
  startTime: Date;
  endTime: Date | null;
  status: 'active' | 'completed' | 'cancelled';
  isManual: boolean; // true for manual tracking, false for automatic
}
```

### 7. Navigation

| Action | Destination | Parameters |
|--------|-------------|------------|
| Tap Play button | SleepingScreen | Create new sleep session |
| Tap Schedule button | NewSleepSchedule | - |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Starting session | Show loading animation on play button |
| Permission denied | Show permission request modal |
| Already sleeping | Prevent duplicate session, show "Already tracking" |
| Low battery | Warn user about battery usage |

### 9. Implementation Breakdown

1. **ConcentricCircles Component**
   - SVG or layered Views
   - 4-5 circles radiating outward
   - Gradient from light tan (center) to dark brown (outer)
   - Could have subtle pulse animation

2. **PlayButton Component**
   - Large circular button in center
   - White play triangle icon
   - Tap handler starts sleep session
   - Feedback animation on press

3. **Start Sleep Logic**
   - Record current timestamp
   - Enable Do Not Disturb (if permitted)
   - Set alarm for wake time (if scheduled)
   - Navigate to sleeping screen
   - Background tracking begins

### 10. Open Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| 90-1 | No back button | Low | How does user navigate away? |
| 90-2 | Visual design purpose | Low | Concentric circles - why this design? |

---

## Screen 91: NewSleepSchedule

### 1. Purpose
Configuration form for setting up recurring sleep schedules with bedtime, wake time, snooze settings, repeat days, and automation toggles.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [9:41]                    [Signal][Batt]│
│                                         │
│  (◐) ← Back                             │
│                                         │
│  New Sleep Schedule                     │
│                                         │
│  Sleep At           Wake Up At          │
│  ┌─────────────┐   ┌─────────────┐     │
│  │ 🛏️ 11:00 PM│   │ ⏰ 06:00 AM│     │
│  └─────────────┘   └─────────────┘     │
│                                         │
│  Repeat Snooze                          │
│  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━○        │
│  1             3              5         │
│                                         │
│  Auto Repeat Every                      │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │
│  │ Mon │ │ Tue │ │ Wed │ │ Thu │      │
│  │  ○  │ │  ●  │ │  ○  │ │     │      │
│  └─────┘ └─────┘ └─────┘ └─────┘      │
│                                         │
│  Auto Display Sleep Stats    ───○      │
│                                         │
│  Auto Set Alarm              ───●      │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │   Set Sleep Schedule  +             ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Variant/State |
|-----------|-------------|---------------|
| BackButton | Crescent moon | Default |
| ScreenTitle | "New Sleep Schedule" | Large, white |
| FormSection | Container for form fields | Grouped sections |
| TimePicker | Sleep/Wake time selectors | With icons, brown cards |
| BedIcon | Bed emoji/icon | In sleep time picker |
| AlarmIcon | Clock emoji/icon | In wake time picker |
| FormLabel | Section labels | Small, white |
| SnoozeSlider | Range slider 1-5 | Green dot at value 3 |
| DaySelector | Weekday chip buttons | Multi-select, Tue selected |
| DayChip | Individual day button | Circle indicator shows selection |
| ToggleSwitch | Binary on/off switches | Two toggles |
| PrimaryButton | "Set Sleep Schedule +" | Full-width, orange |

### 4. Responsibility Split

**UI Layer (Presentational)**:
- Render time pickers
- Display slider with current value
- Show day selection chips
- Render toggle switches
- Position submit button

**Logic Layer (Container/Hooks)**:
- Manage form state
- Validate time selections
- Handle day selection
- Save schedule configuration
- Set device alarms
- Configure Do Not Disturb schedule

### 5. State Definition

```typescript
interface NewSleepScheduleState {
  // Schedule Configuration
  sleepTime: Time; // { hour: 23, minute: 0 }
  wakeTime: Time;  // { hour: 6, minute: 0 }
  snoozeCount: number; // 1-5
  repeatDays: DayOfWeek[]; // ['Tuesday']

  // Automation Settings
  autoDisplayStats: boolean;
  autoSetAlarm: boolean;

  // UI State
  isSubmitting: boolean;
}

type Time = {
  hour: number; // 0-23
  minute: number; // 0-59
};

type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
```

### 6. Data Models

```typescript
interface SleepSchedule {
  id: string;
  name?: string; // "Weekday Schedule", "Weekend Schedule"
  sleepTime: Time;
  wakeTime: Time;
  snoozeCount: number;
  repeatDays: DayOfWeek[];
  autoDisplayStats: boolean;
  autoSetAlarm: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Calculate sleep duration
function calculateSleepDuration(sleep: Time, wake: Time): number {
  let sleepMinutes = sleep.hour * 60 + sleep.minute;
  let wakeMinutes = wake.hour * 60 + wake.minute;

  // Handle overnight sleep
  if (wakeMinutes < sleepMinutes) {
    wakeMinutes += 24 * 60; // Add 24 hours
  }

  return (wakeMinutes - sleepMinutes) / 60; // Return hours
}

// Example: 11:00 PM to 6:00 AM = 7 hours
```

### 7. Navigation

| Action | Destination | Parameters |
|--------|-------------|------------|
| Back button | Previous screen | - |
| Set Schedule button | SleepCalendarHistory | Save and navigate |
| Time picker tap | Time picker modal | - |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Invalid time range | Show error if wake < sleep (same day) |
| No days selected | Disable submit or show error |
| Alarm permission denied | Show permission request |
| Schedule conflict | Warn if overlaps existing schedule |
| Default values | Pre-populate with smart defaults (11 PM - 6 AM) |

### 9. Implementation Breakdown

1. **TimePicker Components**
   - Native picker or custom wheel picker
   - Format: 12-hour with AM/PM or 24-hour
   - Icon prefix (bed/alarm)
   - Tap to open picker modal

2. **SnoozeSlider Component**
   - Horizontal slider
   - Range: 1-5 snoozes
   - Green filled track
   - Labels at 1, 3, 5
   - Value 3 selected in design

3. **DaySelector Component**
   - 7 chips in scrollable row (wraps to 2 rows if needed)
   - Multi-select capability
   - Selected day has green background with filled circle
   - Unselected has outline circle
   - Tuesday selected in design

4. **ToggleSwitch Components**
   - Two switches for automation
   - "Auto Display Sleep Stats" - OFF
   - "Auto Set Alarm" - ON
   - Standard iOS/Android toggle styling

### 10. Open Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| 91-1 | Snooze count unclear | Medium | Is this snooze attempts or snooze duration? |
| 91-2 | Schedule name missing | Low | No field to name the schedule |
| 91-3 | Multiple schedules? | Medium | Can user have multiple schedules? |
| 91-4 | Day chips truncated | Low | "Thu" appears cut off - may need better layout |

---

## Screen 92: SleepingScreen

### 1. Purpose
Active sleep tracking screen displayed during sleep session, showing current time, elapsed duration, and option to manually end sleep.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [9:41]                    [Signal][Batt]│
│                                         │
│                                         │
│         ┌──────────────┐                │
│         │ ALARM AT 10:05│ ← Badge       │
│         └──────────────┘                │
│                                         │
│   Good Night, Shinomiya!                │
│                                         │
│        22:15                            │
│      (huge time)                        │
│                                         │
│  ⏱️ Duration    00h 01m  ← Brown pill   │
│                                         │
│                                         │
│  ╭─────────────────────────────────╮    │
│  │                                 │    │
│  │    [Illustration: Person        │    │
│  │     sleeping peacefully         │    │
│  │     on pillow with              │    │
│  │     decorative elements]        │    │
│  │                                 │    │
│  ╰─────────────────────────────────╯    │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  )) )) Swipe to Wake Up!           ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Variant/State |
|-----------|-------------|---------------|
| AlarmBadge | "ALARM AT 10:05" | Top center, brown/tan pill |
| GreetingText | "Good Night, Shinomiya!" | White, centered |
| CurrentTime | "22:15" | Huge, white, bold |
| DurationBadge | "⏱️ Duration 00h 01m" | Brown pill, small |
| SleepIllustration | Person sleeping artwork | Stylized, warm colors |
| SwipeToWakeBar | Bottom action bar | White pill with gesture icon |
| GestureIcon | Double parentheses ")) ))" | Left side of bar |

### 4. Responsibility Split

**UI Layer (Presentational)**:
- Display current time (updates every minute)
- Show elapsed duration
- Render sleeping illustration
- Display alarm badge
- Show swipe-to-wake bar

**Logic Layer (Container/Hooks)**:
- Track sleep session in background
- Update duration every minute
- Monitor device sensors (if automatic tracking)
- Handle swipe gesture to end sleep
- Keep screen on or handle wake locks
- Disable touch interactions (except swipe)

### 5. State Definition

```typescript
interface SleepingScreenState {
  // Session Data
  sessionId: string;
  sleepStartTime: Date;
  currentTime: Date;
  elapsedMinutes: number;

  // Alarm
  alarmTime: Time | null;

  // User Info
  userName: string; // "Shinomiya"

  // UI State
  isSwipingToWake: boolean;
}
```

### 6. Data Models

```typescript
interface ActiveSleepSession {
  id: string;
  userId: string;
  startTime: Date;
  scheduledWakeTime: Date | null;
  isActive: boolean;

  // Tracking data (updated periodically)
  movements: number;
  soundDetected: boolean;
  heartRate?: number[];
}

// Format duration for display
function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m`;
}
```

### 7. Navigation

| Action | Destination | Parameters |
|--------|-------------|------------|
| Swipe to wake | SleepSummaryScreen | End session, show results |
| Alarm triggers | WakeUpScreen | Natural wake flow |
| (No back button) | Cannot navigate away | Intentional |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Just started | Duration shows "00h 01m" (just started) |
| Long sleep | Duration continues incrementing |
| Alarm time reached | Navigate to wake screen with sound |
| Accidental tap | Ignore taps, only swipe works |
| Screen timeout | Keep screen dim but on (configurable) |
| Battery low | Show warning, offer to cancel |

### 9. Implementation Breakdown

1. **Time Display Logic**
   - Update current time every minute
   - Calculate elapsed duration from startTime
   - Format as "22:15" and "00h 01m"
   - Use interval timer

2. **SwipeToWake Component**
   - Swipe gesture handler
   - Horizontal swipe threshold (e.g., 70% of width)
   - Visual feedback during swipe
   - Completion triggers wake action

3. **SleepIllustration Component**
   - Static or subtly animated artwork
   - Person sleeping peacefully
   - Warm color palette (orange, yellow, brown)
   - Could have breathing animation

4. **Screen Wake Lock**
   - Keep screen on (dimmed) or allow timeout
   - Prevent accidental screen interactions
   - Battery optimization considerations

### 10. Open Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| 92-1 | Duration shows 00h 01m | Low | Just started - placeholder, but seems odd for 22:15 display |
| 92-2 | Alarm time discrepancy | Medium | Badge shows "10:05" but schedule was "06:00 AM" |
| 92-3 | No cancel option | Medium | User can only wake up, no way to cancel session |

---

## Screen 93: WakeUpScreen

### 1. Purpose
Morning wake-up screen displayed when alarm triggers or user manually wakes, showing wake time, sleep duration, and option to confirm waking up.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [9:41]                    [Signal][Batt]│
│                                         │
│                                         │
│         ┌──────────────┐                │
│         │ GOOD MORNING!│ ← Badge        │
│         └──────────────┘                │
│                                         │
│   Wake Up, Shinomiya!                   │
│                                         │
│        06:15                            │
│      (huge time)                        │
│                                         │
│  ⏱️ Duration    08h 12m  ← Brown pill   │
│                                         │
│                                         │
│  ╭─────────────────────────────────╮    │
│  │                                 │    │
│  │    [Illustration: Person        │    │
│  │     waking up, stretching       │    │
│  │     arms, in bed with           │    │
│  │     morning light]              │    │
│  │                                 │    │
│  ╰─────────────────────────────────╯    │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  )) )) Swipe to Wake Up!           ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Variant/State |
|-----------|-------------|---------------|
| MorningBadge | "GOOD MORNING!" | Top center, tan pill |
| GreetingText | "Wake Up, Shinomiya!" | White, centered |
| WakeTime | "06:15" | Huge, white, bold |
| DurationBadge | "⏱️ Duration 08h 12m" | Brown pill |
| WakeIllustration | Person waking/stretching | Stylized, warm colors |
| SwipeToWakeBar | Bottom action bar | White pill with gesture icon |
| GestureIcon | Double parentheses ")) ))" | Left side |

### 4. Responsibility Split

**UI Layer (Presentational)**:
- Display wake time
- Show total sleep duration
- Render wake-up illustration
- Display morning greeting
- Show swipe-to-confirm bar

**Logic Layer (Container/Hooks)**:
- Calculate total sleep duration
- Play alarm sound (if scheduled wake)
- Handle swipe gesture to confirm wake
- End sleep tracking session
- Prepare sleep summary data
- Stop alarm sound on swipe

### 5. State Definition

```typescript
interface WakeUpScreenState {
  // Session Data
  sessionId: string;
  sleepStartTime: Date;
  wakeTime: Date;
  totalSleepMinutes: number;

  // User Info
  userName: string;

  // Alarm
  alarmTriggered: boolean;
  alarmPlaying: boolean;

  // UI State
  isSwipingToConfirm: boolean;
}
```

### 6. Data Models

```typescript
interface WakeUpData {
  sessionId: string;
  wakeTime: Date;
  totalSleepDuration: number; // minutes
  wakeMethod: 'alarm' | 'manual';
}

// Example from design
const exampleWakeData: WakeUpData = {
  sessionId: 'abc123',
  wakeTime: new Date('2025-01-XX 06:15'),
  totalSleepDuration: 492, // 8h 12m
  wakeMethod: 'alarm'
};
```

### 7. Navigation

| Action | Destination | Parameters |
|--------|-------------|------------|
| Swipe to confirm | SleepSummaryScreen | End session, show breakdown |
| (No back button) | Cannot go back | Intentional |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Alarm playing | Sound/vibration active |
| Swipe to stop | Stops alarm, proceeds to summary |
| Snooze (if enabled) | Alternative action to snooze |
| Very short sleep | Warning about insufficient sleep |
| Long sleep | Normal flow |

### 9. Implementation Breakdown

1. **Alarm Sound Logic**
   - Play alarm sound when screen loads (if alarm triggered)
   - Gradually increase volume
   - Vibration pattern
   - Stop on swipe gesture

2. **Duration Calculation**
   - End time - Start time = Total duration
   - Example: 06:15 - 22:15 = 8h 00m
   - Design shows 08h 12m (includes time to fall asleep?)

3. **WakeIllustration Component**
   - Person stretching in bed
   - Morning light colors (orange, peach)
   - Different from sleep illustration
   - Energetic, upward movement

4. **SwipeToConfirm Gesture**
   - Same as sleep screen
   - Stops alarm
   - Navigates to summary
   - Clear visual feedback

### 10. Open Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| 93-1 | Duration calculation off | Low | 22:15 to 06:15 should be 8h 00m, not 08h 12m |
| 93-2 | No snooze option | Medium | User can only wake fully, no snooze |
| 93-3 | Same swipe text | Low | "Swipe to Wake Up!" but already awake - should be "Swipe to Continue" |

---

## Screen 94: SleepSummary

### 1. Purpose
Post-sleep summary showing total sleep duration with detailed breakdown of sleep stages (REM, Core, Post) and visual representation.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [9:41]                    [Signal][Batt]│
│                                         │
│                                         │
│      You Slept for                      │
│                                         │
│         8.25h                           │
│       (huge text)                       │
│                                         │
│                                         │
│         ╭───────────╮                   │
│        ╱  ╭───────╮  ╲                  │
│       │   │ ╭───╮ │   │                 │
│       │   │ │ ● │ │   │                 │
│       │   │ ╰───╯ │   │                 │
│       │   ╰───────╯   │                 │
│        ╲             ╱                  │
│         ╰───────────╯                   │
│    (Multi-ring chart with icons)        │
│    Green ring (outer), Orange (mid),    │
│    Gray (inner), Brown (background)     │
│                                         │
│  REM      Core      Post                │
│  2.14h    6.04h     12min               │
│  ┌───┐   ┌───┐    ┌───┐                │
│  │ ✓ │   │ 💤│    │ ● │                │
│  └───┘   └───┘    └───┘                │
│ (green)  (orange)  (gray)               │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │   Got It, Thanks!  →                ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Variant/State |
|-----------|-------------|---------------|
| SummaryTitle | "You Slept for" | White, centered |
| TotalSleepTime | "8.25h" | Huge, white, bold |
| MultiRingChart | Concentric ring visualization | 3-4 rings, colored |
| RingSegment | Individual sleep stage ring | Green, Orange, Gray |
| StageIcon | Icon within ring | Checkmark, sleep, dot |
| LegendRow | Three stage breakdowns | Bottom section |
| StageCard | Individual stage display | Icon, label, duration |
| StageLabel | "REM", "Core", "Post" | White text |
| StageDuration | "2.14h", "6.04h", "12min" | Large, white |
| StageIconBadge | Colored circle with icon | Green/Orange/Gray |
| PrimaryButton | "Got It, Thanks! →" | Full-width, tan |

### 4. Responsibility Split

**UI Layer (Presentational)**:
- Display total sleep duration
- Render multi-ring chart
- Show stage breakdown cards
- Position icons and labels
- Display confirmation button

**Logic Layer (Container/Hooks)**:
- Calculate sleep stage durations
- Process sleep tracking data
- Determine ring segment sizes
- Save sleep record to database
- Navigate on confirmation
- Update sleep statistics

### 5. State Definition

```typescript
interface SleepSummaryState {
  // Sleep Data
  sessionId: string;
  totalSleepHours: number; // 8.25
  breakdown: SleepStageBreakdown;

  // UI State
  isProcessing: boolean;
  isSaved: boolean;
}

interface SleepStageBreakdown {
  rem: number;      // hours: 2.14
  core: number;     // hours: 6.04
  post: number;     // minutes: 12
  light?: number;   // Optional
  deep?: number;    // Optional
  awake?: number;   // Optional
}
```

### 6. Data Models

```typescript
interface SleepStage {
  type: 'rem' | 'core' | 'post' | 'light' | 'deep' | 'awake';
  duration: number; // minutes
  percentage: number; // of total sleep
  color: string;
  icon: IconType;
  label: string;
}

const sleepStages: SleepStage[] = [
  {
    type: 'rem',
    duration: 128.4, // 2.14h in minutes
    percentage: 26,
    color: '#9AAD5C', // Green
    icon: 'checkmark',
    label: 'REM'
  },
  {
    type: 'core',
    duration: 362.4, // 6.04h in minutes
    percentage: 73,
    color: '#E8853A', // Orange
    icon: 'sleep',
    label: 'Core'
  },
  {
    type: 'post',
    duration: 12,
    percentage: 2,
    color: '#6B6B6B', // Gray
    icon: 'dot',
    label: 'Post'
  }
];

// Total check: 2.14 + 6.04 + 0.2 (12min) = 8.38h ≈ 8.25h (small discrepancy)
```

### 7. Navigation

| Action | Destination | Parameters |
|--------|-------------|------------|
| Got It button | SleepCalendarHistory or Dashboard | Save complete |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Processing data | Show loading state |
| Save failed | Retry button or error message |
| Very short sleep | Show warning about data quality |
| Missing stage data | Show only available stages |
| Zero in stage | Don't display that stage |

### 9. Implementation Breakdown

1. **MultiRingChart Component**
   - SVG-based concentric rings
   - Each ring represents a sleep stage
   - Ring thickness proportional to duration (or fixed)
   - Color-coded by stage
   - Icons positioned within rings
   - Inner rings for deeper stages

2. **Ring Calculation**
   - Outer ring: REM (green) - longest arc
   - Middle ring: Core (orange) - medium arc
   - Inner ring: Post (gray) - smallest arc
   - Background ring: Brown (not shown in legend)
   - Arc length proportional to duration percentage

3. **Stage Breakdown Cards**
   - Three columns
   - Each shows: Icon badge, Label, Duration
   - Icon matches ring icon
   - Duration formatted as hours or minutes

4. **Data Validation**
   - Sum of stages should equal total
   - Design shows slight discrepancy (8.38h vs 8.25h)
   - May need rounding logic

### 10. Open Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| 94-1 | Duration math discrepancy | Low | 2.14 + 6.04 + 0.2 = 8.38h, but shows 8.25h |
| 94-2 | "Post" stage unclear | Medium | What is "Post" sleep? Post-wake or light sleep? |
| 94-3 | Missing "Light" and "Deep" | Low | Standard sleep tracking includes these stages |
| 94-4 | Ring visualization logic | Low | Which ring is which stage? Order unclear |

---

## Cross-Screen Components (Batch 19)

### New Components Identified

| Component | Used In | Priority |
|-----------|---------|----------|
| ConcentricCirclesBackground | Screen 90 | Low |
| LargePlayButton | Screen 90 | Medium |
| ScheduleButton | Screen 90 | Low |
| TimePickerField | Screen 91 | High |
| RangeSlider | Screen 91 | High |
| DaySelectorChip | Screen 91 | Medium |
| ToggleRow | Screen 91 | Medium |
| SleepIllustration | Screens 92, 93 | Medium |
| TimeBadge | Screens 92, 93 | Low |
| SwipeToActionBar | Screens 92, 93 | High |
| DurationBadge | Screens 92, 93 | Medium |
| MultiRingChart | Screen 94 | High |
| SleepStageCard | Screen 94 | Medium |
| StageIconBadge | Screen 94 | Low |

### Shared Patterns

1. **Sleep Stage Color System**
   - REM: Green (#9AAD5C) with checkmark icon
   - Core: Orange (#E8853A) with sleep icon
   - Post: Gray (#6B6B6B) with dot icon
   - Light: (not shown yet)
   - Deep: (not shown yet)

2. **Time Display Formats**
   - Current time: "22:15" (24-hour format)
   - Duration: "08h 12m" or "8.25h"
   - Short duration: "12min"

3. **Swipe Gestures**
   - Horizontal swipe to confirm actions
   - Visual feedback with gesture icon ")) ))"
   - Used for wake-up confirmations

4. **Greeting Personalization**
   - Uses user's name: "Shinomiya"
   - Time-appropriate: "Good Night" vs "Wake Up" vs "Good Morning"

---

## Summary

| Screen | Name | Status | Critical Issues |
|--------|------|--------|-----------------|
| 90 | StartSleepingScreen | Documented | None |
| 91 | NewSleepSchedule | Documented | None |
| 92 | SleepingScreen | Documented | None |
| 93 | WakeUpScreen | Documented | Minor duration issue |
| 94 | SleepSummary | Documented | Math discrepancy |

**Total New Components**: 14
**Critical Issues**: None
**Minor Issues**: Duration calculation inconsistencies in screens 92-94
**Sleep Quality**: 8/10 done (2 remaining)
