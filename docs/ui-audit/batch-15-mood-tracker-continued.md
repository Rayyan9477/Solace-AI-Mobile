# Batch 15: Mood Tracker - Selector Variants & History

**Screens Covered**: 70-74 (Mood Tracker Screens 4-8)
**Source Files**: `ui-designs/Dark-mode/🔒 Mood Tracker/Mood_Tracker_Screen_04.png` through `Mood_Tracker_Screen_08.png`

---

## Screen 70: MoodSelectorSad

### 1. Purpose
Mood selector screen variant showing the "Sad" mood state with orange theme, allowing users to confirm or adjust their mood selection.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [Status Bar]                        9:41│
├─────────────────────────────────────────┤
│                                         │
│    ORANGE FULL-SCREEN BACKGROUND        │
│                                         │
│    How are you feeling                  │
│         this day?                       │
│                                         │
│                                         │
│           ┌─────────────┐               │
│           │             │               │
│           │     😢      │               │
│           │  (sad face) │               │
│           │             │               │
│           └─────────────┘               │
│                                         │
│        I'm Feeling Sad                  │
│                                         │
│                                         │
│    ○───●───○───○───○                    │
│        ↑                                │
│    (second position selected)           │
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
| LargeMoodEmoji | Sad face emoji | `mood: 'sad'`, `size: 'xlarge'` |
| MoodLabel | "I'm Feeling Sad" | `mood: 'sad'` |
| CurvedMoodSlider | Arc selection with 5 points | `value: 1`, `onChange` |
| PrimaryButton | "Set Mood" with checkmark | `label`, `icon`, `onPress` |

### 4. Responsibility Split

**UI (Presentational)**:
- Display orange full-screen background
- Render sad emoji with appropriate styling
- Show slider with second point selected
- Handle button press animation

**Logic (Container/Hooks)**:
- Track selected mood index (1 = sad)
- Save mood entry on confirmation
- Navigate back to mood dashboard

### 5. State Definition

```typescript
// Reuses MoodSelectorState from Screen 69
// selectedMoodIndex = 1 (sad position)
// backgroundColor = '#E8853A' (orange)
```

### 6. Data Models

```typescript
const SAD_MOOD_CONFIG: MoodSelection = {
  mood: 'sad',
  moodIndex: 1,
  emoji: '😢',
  label: 'Sad',
  backgroundColor: '#E8853A',  // Orange
};
```

### 7. Navigation

| Action | Destination | Data Passed |
|--------|-------------|-------------|
| Set Mood | MoodDashboard | `moodEntry: { mood: 'sad', ... }` |
| Slider change | Stay (update UI) | `newMoodIndex` |
| Back gesture | Previous screen | - |

### 8. UI States & Edge Cases

Same as Screen 69 (MoodSelector), but with:
- Orange color theme
- Sad emoji display
- Index position 1 on slider

### 9. Implementation Breakdown

This is a variant of Screen 69 with different state:
- Background color: Orange (#E8853A)
- Emoji: Sad face
- Slider position: Index 1 (second from left)

### 10. Open Issues

| Issue | Priority | Notes |
|-------|----------|-------|
| Shared component | LOW | Should be same component as Screen 69 with different props |

---

## Screen 71: MoodSelectorNeutral

### 1. Purpose
Mood selector screen variant showing the "Neutral" mood state with brown/tan theme.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [Status Bar]                        9:41│
├─────────────────────────────────────────┤
│                                         │
│    BROWN/TAN FULL-SCREEN BACKGROUND     │
│                                         │
│    How are you feeling                  │
│         this day?                       │
│                                         │
│           ┌─────────────┐               │
│           │             │               │
│           │     😐      │               │
│           │  (neutral)  │               │
│           │             │               │
│           └─────────────┘               │
│                                         │
│       I'm Feeling Neutral               │
│                                         │
│                                         │
│    ○───○───●───○───○                    │
│            ↑                            │
│    (center position selected)           │
│                                         │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │          Set Mood    ✓             │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### 3. Component List

Same as Screen 70, with different props:
- `mood: 'neutral'`
- `backgroundColor: '#8B7355'` (brown/tan)
- `sliderPosition: 2` (center)

### 4-9. Implementation

Same pattern as Screen 70, variant configuration:

```typescript
const NEUTRAL_MOOD_CONFIG: MoodSelection = {
  mood: 'neutral',
  moodIndex: 2,
  emoji: '😐',
  label: 'Neutral',
  backgroundColor: '#8B7355',  // Brown/tan
};
```

### 10. Open Issues

| Issue | Priority | Notes |
|-------|----------|-------|
| Emoji design | LOW | Neutral emoji has straight-line mouth - verify asset |

---

## Screen 72: MoodSelectorHappy

### 1. Purpose
Mood selector screen variant showing the "Happy" mood state with yellow/golden theme.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [Status Bar]                        9:41│
├─────────────────────────────────────────┤
│                                         │
│    YELLOW/GOLDEN FULL-SCREEN BACKGROUND │
│                                         │
│    How are you feeling                  │
│         this day?                       │
│                                         │
│           ┌─────────────┐               │
│           │             │               │
│           │     🙂      │               │
│           │  (smiling)  │               │
│           │             │               │
│           └─────────────┘               │
│                                         │
│        I'm Feeling Happy                │
│                                         │
│                                         │
│    ○───○───○───●───○                    │
│                ↑                        │
│    (fourth position selected)           │
│                                         │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │          Set Mood    ✓             │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### 3-9. Implementation

Same pattern as previous screens, variant configuration:

```typescript
const HAPPY_MOOD_CONFIG: MoodSelection = {
  mood: 'happy',
  moodIndex: 3,
  emoji: '🙂',
  label: 'Happy',
  backgroundColor: '#F5C563',  // Yellow/golden
};
```

### 10. Open Issues

| Issue | Priority | Notes |
|-------|----------|-------|
| Happy vs Content | LOW | Is this "Happy" or "Content"? Verify mood scale labels |

---

## Screen 73: MoodSelectorOverjoyed

### 1. Purpose
Mood selector screen variant showing the "Overjoyed" mood state (highest positive) with green theme.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [Status Bar]                        9:41│
├─────────────────────────────────────────┤
│                                         │
│    GREEN/OLIVE FULL-SCREEN BACKGROUND   │
│                                         │
│    How are you feeling                  │
│         this day?                       │
│                                         │
│           ┌─────────────┐               │
│           │             │               │
│           │     😄      │               │
│           │ (overjoyed) │               │
│           │             │               │
│           └─────────────┘               │
│                                         │
│      I'm Feeling Overjoyed              │
│                                         │
│                                         │
│    ○───○───○───○───●                    │
│                    ↑                    │
│    (rightmost position selected)        │
│                                         │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │          Set Mood    ✓             │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### 3-9. Implementation

Same pattern as previous screens, variant configuration:

```typescript
const OVERJOYED_MOOD_CONFIG: MoodSelection = {
  mood: 'overjoyed',
  moodIndex: 4,
  emoji: '😄',
  label: 'Overjoyed',
  backgroundColor: '#9AAD5C',  // Green/olive
};
```

### 10. Open Issues

| Issue | Priority | Notes |
|-------|----------|-------|
| "Overjoyed" vs "Elated" | LOW | Verify final label for highest mood |

---

## Complete Mood Scale Reference

Based on Screens 69-73, the full mood scale is:

| Index | Mood | Emoji | Background Color | Hex |
|-------|------|-------|-----------------|-----|
| 0 | Depressed | 😵 | Purple | #7B68B5 |
| 1 | Sad | 😢 | Orange | #E8853A |
| 2 | Neutral | 😐 | Brown/Tan | #8B7355 |
| 3 | Happy | 🙂 | Yellow/Golden | #F5C563 |
| 4 | Overjoyed | 😄 | Green/Olive | #9AAD5C |

---

## Screen 74: MoodHistoryList

### 1. Purpose
Displays a chronological list of all mood entries with associated biometric data, allowing users to view their mood history and access AI-generated suggestions.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [Status Bar]                        9:41│
├─────────────────────────────────────────┤
│ (←)                                     │
│                                         │
│    My Mood                              │
│                                         │
│ ┌─────────────────┬─────────────────┐   │
│ │     History     │  AI Suggestions │   │
│ │    [selected]   │                 │   │
│ └─────────────────┴─────────────────┘   │
│                                         │
│ All                                 ⋮   │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ SEP  │ Overjoyed              😄   │ │
│ │  12  │ ❤️ 96bpm  ⚡ 121sys        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ SEP  │ Happy                   🙂   │ │
│ │  11  │ ❤️ 65bpm  ⚡ 111sys        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ SEP  │ Sad                     😢   │ │
│ │   9  │ ❤️ 99bpm  ⚡ 150sys        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ SEP  │ Neutral                 😐   │ │
│ │  10  │ ❤️ 77bpm  ⚡ 111sys        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ SEP  │ Depressed               😵   │ │
│ │   8  │ ❤️ 121bpm ⚡ 180sys        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────┐     ┌─────┐     ┌─────┐        │
│ │ ⚙️  │     │  +  │     │ ✏️  │        │
│ └─────┘     └─────┘     └─────┘        │
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Props/Config |
|-----------|-------------|--------------|
| HeaderWithBack | Back button + title | `title: 'My Mood'`, `onBack` |
| SegmentedControl | History/AI Suggestions tabs | `segments`, `selectedIndex`, `onChange` |
| SectionHeader | "All" with menu | `title`, `onMenu` |
| MoodHistoryCard | Individual mood entry | `date`, `mood`, `heartRate`, `bloodPressure`, `emoji` |
| DateColumn | Month + day display | `month`, `day` |
| BiometricRow | Heart rate + BP display | `heartRate`, `systolic` |
| MoodEmojiIcon | Colored mood emoji | `mood`, `size` |
| BottomActionBar | Settings, FAB, Edit | `actions` |
| SettingsButton | Gear icon | `onPress` |
| FloatingActionButton | Add new entry | `onPress`, `icon: 'plus'` |
| EditButton | Pencil icon | `onPress` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render list of mood entries with cards
- Display biometric data with icons
- Show colored emojis matching mood
- Handle tab switching animation

**Logic (Container/Hooks)**:
- Fetch mood history from storage
- Sort/filter entries
- Handle entry selection
- Navigate to add new mood

### 5. State Definition

```typescript
interface MoodHistoryState {
  // Tab Selection
  selectedTab: 'history' | 'aiSuggestions';

  // History Data
  moodEntries: MoodHistoryEntry[];
  isLoading: boolean;

  // Filters
  filterType: 'all' | 'week' | 'month';
  sortOrder: 'newest' | 'oldest' | 'mood';

  // Selection
  selectedEntryId: string | null;
  isEditMode: boolean;
}

interface MoodHistoryEntry {
  id: string;
  date: string;
  month: string;
  day: number;
  mood: Mood;
  emoji: string;
  heartRate: number;          // bpm
  bloodPressureSys: number;   // systolic
  bloodPressureDia?: number;  // diastolic (not shown)
  note?: string;
}
```

### 6. Data Models

```typescript
interface MoodWithBiometrics {
  id: string;
  userId: string;
  timestamp: string;
  mood: Mood;
  biometrics: {
    heartRate: number;
    bloodPressure: {
      systolic: number;
      diastolic: number;
    };
    source: 'manual' | 'apple_health' | 'google_fit' | 'device';
  };
  context?: {
    location?: string;
    activity?: string;
    weather?: string;
  };
}

interface MoodHistoryFilters {
  dateRange: 'all' | 'week' | 'month' | 'year';
  moods: Mood[];
  hasBiometrics: boolean;
}
```

### 7. Navigation

| Action | Destination | Data Passed |
|--------|-------------|-------------|
| Back button | Previous screen | - |
| "AI Suggestions" tab | MoodAISuggestions | - |
| Entry card tap | MoodEntryDetail | `entryId` |
| FAB (+) | MoodSelector | - |
| Settings (⚙️) | MoodSettings | - |
| Edit (✏️) | MoodHistoryEdit | - |
| Menu (⋮) | FilterSortModal | - |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Loading history | Skeleton cards |
| No entries | Empty state with "Start tracking your mood" |
| Many entries | Virtualized list for performance |
| Missing biometrics | Show "--" or hide biometric row |
| Entry tap | Navigate to detail view |
| Edit mode | Show checkboxes for multi-select |
| Filter active | Show filter indicator, entry count |

### 9. Implementation Breakdown

1. **MoodHistoryCard Component**
   - Date column (month abbreviated, day number)
   - Mood label text
   - Biometric icons with values
   - Colored emoji on right

2. **Biometric Display**
   - Heart icon (❤️) with BPM value
   - Lightning/pressure icon (⚡) with systolic value
   - Color coding for abnormal values

3. **Tab Switching**
   - Segmented control for History/AI Suggestions
   - Animated underline indicator
   - Content switch on selection

4. **List Optimization**
   - FlatList with virtualization
   - Item separators
   - Pull-to-refresh

### 10. Open Issues

| Issue | Priority | Notes |
|-------|----------|-------|
| **Non-chronological dates** | **MEDIUM** | Sep 12, 11, 9, 10, 8 - intentional "newest first" or error? |
| **180 systolic BP** | **HIGH** | This is hypertensive crisis level - inappropriate placeholder |
| **121 bpm resting** | **MEDIUM** | High resting HR for "Depressed" - medically questionable correlation |
| Biometric data source | HIGH | How are heart rate and BP collected? Device integration needed |
| AI Suggestions tab | HIGH | What does this tab show? Not visible in designs |
| Date format | LOW | "SEP 12" vs "Sep 12" - standardize |

---

## New Components Identified (Batch 15)

| Component | First Seen | Reusable |
|-----------|------------|----------|
| SegmentedControl | Screen 74 | Yes - tab switching |
| MoodHistoryCard | Screen 74 | Yes - mood list entries |
| DateColumn | Screen 74 | Yes - date displays |
| BiometricRow | Screen 74 | Yes - health data display |
| BottomActionBar | Screen 74 | Yes - multi-action footer |
| SettingsButton | Screen 74 | Yes - settings access |
| EditButton | Screen 74 | Yes - edit mode toggle |

---

## Issues Identified (Batch 15)

### Issue #13: Medically Inappropriate Biometric Placeholders (Screen 74)

**Location**: `batch-15-mood-tracker-continued.md` - Screen 74
**Source**: `ui-designs/Dark-mode/🔒 Mood Tracker/Mood_Tracker_Screen_08.png`

**Problem**: Biometric data placeholders show medically concerning values:

| Entry | Heart Rate | Blood Pressure | Medical Concern |
|-------|------------|----------------|-----------------|
| Depressed | 121 bpm | 180 sys | **HYPERTENSIVE CRISIS** (180+ is emergency) |
| Sad | 99 bpm | 150 sys | Stage 2 Hypertension |

**Risk**:
- Normalizes dangerous health values in a mental health context
- Could confuse users about healthy ranges
- May create false correlation between mood and dangerous BP levels
- Medical professionals may view this as irresponsible

**Required Action**:
- [ ] Use realistic, healthy biometric ranges as placeholders
- [ ] Normal heart rate: 60-100 bpm
- [ ] Normal blood pressure: 90-120 systolic
- [ ] If showing correlation, ensure it's medically accurate
- [ ] Add disclaimer about biometric data interpretation

---

### Issue #14: Non-Chronological Date Order (Screen 74)

**Location**: `batch-15-mood-tracker-continued.md` - Screen 74
**Source**: `ui-designs/Dark-mode/🔒 Mood Tracker/Mood_Tracker_Screen_08.png`

**Problem**: Dates appear in order: Sep 12, Sep 11, Sep 9, Sep 10, Sep 8

**Analysis**: This could be:
- Intentional "sort by newest" (but Sep 9 and Sep 10 are out of order)
- Design error/placeholder issue

**Required Action**:
- [ ] Clarify intended sort order
- [ ] If "newest first", dates should be: Sep 12, 11, 10, 9, 8
- [ ] Fix placeholder data to demonstrate intended sorting

---

## Summary

| Screen | Name | Key Features |
|--------|------|--------------|
| 70 | MoodSelectorSad | Orange background, sad emoji, slider position 1 |
| 71 | MoodSelectorNeutral | Brown/tan background, neutral emoji, slider position 2 |
| 72 | MoodSelectorHappy | Yellow background, happy emoji, slider position 3 |
| 73 | MoodSelectorOverjoyed | Green background, overjoyed emoji, slider position 4 |
| 74 | MoodHistoryList | Entry cards with biometrics, History/AI Suggestions tabs, action bar |

**Mood Tracker Progress**: 8/11 screens documented
**Total App Screens Documented**: 74/153
