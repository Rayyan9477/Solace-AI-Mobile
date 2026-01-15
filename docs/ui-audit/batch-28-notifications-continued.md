# Batch 28: Smart Notifications Continued

## Overview
- **Screens Covered**: 135-139
- **Features**: Smart Notifications Screens 2-6
- **Status**: Complete

---

## Screen 135: FreudScoreIncrease

### 1. Purpose
Full-screen notification celebrating a Freud Score increase with comparison to previous period.

### 2. UI Structure (Visual Only)
```
[StatusBar]
[Header]
  └── [BackButton]

[IllustrationSection - Green/olive background]
  └── [HappyPersonIllustration - covering eyes joyfully]

[ContentSection]
  ├── [ScoreChange: "+8"]
  ├── [Sparkles - decorative]
  ├── [Title: "Freud Score Increased"]
  ├── [Message: "You're 26% happier compared to
  │    last month. Congrats! 🙌"]
  └── [CurrentScoreRow]
      ├── [Label: "Score Now:"]
      └── [ScoreBadge: "88.2"]

[ActionButton: "See Score 🔐"]
```

### 3. Component List
| Component | Description | Reusable? |
|-----------|-------------|-----------|
| FullScreenNotification | Full-screen container | Yes |
| NotificationIllustration | Themed artwork | Feature |
| ScoreChangeDisplay | Large "+X" number | Feature |
| SparkleDecorations | Celebration sparkles | Yes |
| NotificationTitle | Centered heading | Yes |
| NotificationMessage | Detail text with emoji | Yes |
| CurrentScoreBadge | Score pill display | Feature |
| ActionButton | Primary CTA | Yes |
| LockIcon | Premium indicator (🔐) | Yes |

### 4. Responsibility Split
| UI Layer | Logic Layer |
|----------|-------------|
| Render illustration | Calculate score change |
| Display score delta | Compare to previous period |
| Show current score | Fetch latest score |
| Animate entrance | Track notification view |
| Handle button tap | Navigate to score detail |

### 5. State Definition
```typescript
interface FreudScoreNotificationState {
  scoreChange: number;
  percentageChange: number;
  currentScore: number;
  previousScore: number;
  comparisonPeriod: 'week' | 'month';
  isPositive: boolean;
}
```

### 6. Data Models
```typescript
interface ScoreChangeNotification {
  type: 'score_increase' | 'score_decrease';
  delta: number;
  percentageChange: number;
  currentScore: number;
  previousScore: number;
  period: string;
  celebrationLevel: 'minor' | 'moderate' | 'major';
}

const CELEBRATION_THRESHOLDS = {
  minor: 5,
  moderate: 10,
  major: 20
};
```

### 7. Navigation
- **From**: Push notification, Notifications list tap
- **To**:
  - "See Score" → FreudScoreDetail
  - Back → Notifications list
  - Swipe dismiss → Notifications list

### 8. UI States & Edge Cases
| State | Visual Treatment |
|-------|------------------|
| Score Increased | Green theme, positive message |
| Score Decreased | Different theme/illustration |
| Major Increase | Extra celebration animation |
| First Score | Welcome message variant |
| Premium Required | Lock icon on button |

### 9. Implementation Breakdown
1. **Phase 1**: Layout
   - Create full-screen container
   - Add themed illustration
   - Style score display
2. **Phase 2**: Content
   - Calculate percentage change
   - Format comparison message
   - Display current score badge
3. **Phase 3**: Animation
   - Entrance animation
   - Sparkle effects
   - Score count-up animation
4. **Phase 4**: Navigation
   - Handle button tap
   - Implement back navigation
   - Swipe to dismiss

### 10. Open Issues
- [ ] What does the lock icon (🔐) on button mean - premium feature?
- [ ] Is there a score decrease notification variant?
- [ ] What triggers "major" vs "minor" celebration?
- [ ] How is percentage calculated (vs previous score)?

---

## Screen 136: JournalProgress

### 1. Purpose
Full-screen notification showing journal completion progress for the current month with encouragement.

### 2. UI Structure (Visual Only)
```
[StatusBar]
[Header]
  └── [BackButton]

[IllustrationSection - Warm tan/brown background]
  └── [ReadingPersonIllustration - person with open book]

[ContentSection]
  ├── [ProgressDisplay: "21/30"]
  ├── [Title: "Journal Completed"]
  ├── [Message: "You still need to complete 9 daily
  │    journal this month. Keep it up!"]

[ActionButton: "See Journal 🔐"]
```

### 3. Component List
| Component | Description | Reusable? |
|-----------|-------------|-----------|
| FullScreenNotification | Container | Yes |
| JournalIllustration | Person reading artwork | Feature |
| ProgressFraction | "X/Y" large display | Feature |
| NotificationTitle | "Journal Completed" | Yes |
| EncouragementMessage | Motivational text | Yes |
| ActionButton | Navigate to journal | Yes |

### 4. Responsibility Split
| UI Layer | Logic Layer |
|----------|-------------|
| Render illustration | Calculate journal progress |
| Display fraction | Count completed entries |
| Show remaining count | Calculate days remaining |
| Button tap | Navigate to journal |

### 5. State Definition
```typescript
interface JournalProgressState {
  completedCount: number;
  targetCount: number;
  remainingCount: number;
  currentMonth: string;
  streakDays: number;
}
```

### 6. Data Models
```typescript
interface JournalProgressNotification {
  type: 'journal_progress';
  completed: number;
  target: number;
  remaining: number;
  month: string;
  daysRemaining: number;
  isOnTrack: boolean;
}
```

### 7. Navigation
- **From**: Push notification, Notifications list
- **To**:
  - "See Journal" → Journal home/list
  - Back → Notifications

### 8. UI States & Edge Cases
| State | Visual Treatment |
|-------|------------------|
| On Track | Encouraging message |
| Behind | Gentle reminder |
| Completed All | Celebration variant |
| New Month | Reset message |
| No Journals | Onboarding message |

### 9. Implementation Breakdown
1. **Phase 1**: Progress display
   - Create fraction component
   - Calculate remaining
   - Style large numbers
2. **Phase 2**: Messaging
   - Dynamic encouragement based on progress
   - Handle edge cases
3. **Phase 3**: Navigation
   - Link to journal feature
   - Preserve notification state

### 10. Open Issues
- [ ] **GRAMMAR**: "9 daily journal" should be "9 daily journals" (plural)
- [ ] What's the default monthly target (30)?
- [ ] Is target customizable?
- [ ] What happens on months with fewer days?

---

## Screen 137: TherapyReminder

### 1. Purpose
Full-screen reminder notification for an upcoming scheduled therapy session with Dr. Freud AI.

### 2. UI Structure (Visual Only)
```
[StatusBar]
[Header]
  └── [BackButton]

[IllustrationSection - Orange/warm background]
  └── [PersonWithPhoneIllustration]
      └── [Sparkles/stars decorations]

[ContentSection]
  ├── [TimeDisplay: "05:25 AM"]
  ├── [Title: "Therapy with Dr. Freud AI"]
  ├── [Message: "You have a therapy session with Dr
  │    Freud AI in 8h 21m from now."]

[ActionButton: "See Schedule 🗓"]
```

### 3. Component List
| Component | Description | Reusable? |
|-----------|-------------|-----------|
| FullScreenNotification | Container | Yes |
| TherapyIllustration | Person with phone artwork | Feature |
| TimeDisplay | Large time format | Feature |
| SessionTitle | "Therapy with..." heading | Feature |
| CountdownMessage | Time until session | Feature |
| ScheduleButton | View schedule CTA | Yes |
| CalendarIcon | 🗓 indicator | Yes |

### 4. Responsibility Split
| UI Layer | Logic Layer |
|----------|-------------|
| Render illustration | Fetch scheduled session |
| Display session time | Calculate countdown |
| Show countdown | Update countdown timer |
| Button tap | Navigate to schedule |

### 5. State Definition
```typescript
interface TherapyReminderState {
  sessionTime: Date;
  sessionTitle: string;
  timeUntilSession: {
    hours: number;
    minutes: number;
  };
  sessionType: 'therapy' | 'meditation' | 'check_in';
}
```

### 6. Data Models
```typescript
interface ScheduledSession {
  id: string;
  type: SessionType;
  scheduledTime: Date;
  duration: number;
  title: string;
  therapist: string;
  reminderSentAt: Date;
}

type SessionType = 'therapy' | 'meditation' | 'breathing' | 'check_in';
```

### 7. Navigation
- **From**: Push notification (scheduled), Notifications list
- **To**:
  - "See Schedule" → Schedule/Calendar view
  - Back → Notifications
  - Session time reached → Start session prompt

### 8. UI States & Edge Cases
| State | Visual Treatment |
|-------|------------------|
| Hours Away | Full countdown |
| Minutes Away | Urgent styling |
| Session Starting | "Start Now" variant |
| Session Passed | "Missed" message |
| Rescheduled | Updated time |

### 9. Implementation Breakdown
1. **Phase 1**: Time display
   - Format session time
   - Calculate countdown
   - Update in real-time
2. **Phase 2**: Content
   - Session type title
   - Countdown message
   - Dynamic update
3. **Phase 3**: Actions
   - Navigate to schedule
   - Quick start option
   - Snooze/reschedule?

### 10. Open Issues
- [ ] Is countdown updated in real-time?
- [ ] What happens when session time arrives?
- [ ] Can user snooze or reschedule from here?
- [ ] Is "05:25 AM" the session time or reminder time?

---

## Screen 138: StressDecreased

### 1. Purpose
Full-screen notification celebrating a decrease in stress level with visual mood indicator.

### 2. UI Structure (Visual Only)
```
[StatusBar]
[Header]
  └── [BackButton]

[IllustrationSection - Purple/lavender background]
  └── [SerenePersonIllustration - calm expression]
      └── [Angel/wing shapes in background]

[ContentSection]
  ├── [CurrentLevel: "Neutral"]
  ├── [Title: "Stress Decresased!"] ⚠️ TYPO
  ├── [Message: "You are now Neutral. Congrats!"]
  └── [MoodTransitionRow]
      ├── [StressedEmoji: 😟]
      ├── [Arrow: →]
      ├── [NeutralEmoji: 😐] ← Current (highlighted)
      ├── [Arrow: →]
      └── [HappyEmoji: 😊]

[ActionButton: "See Stress Level ⚙"]
```

### 3. Component List
| Component | Description | Reusable? |
|-----------|-------------|-----------|
| FullScreenNotification | Container | Yes |
| StressIllustration | Calm person artwork | Feature |
| CurrentLevelDisplay | Large "Neutral" text | Feature |
| StatusTitle | "Stress Decreased" | Feature |
| CongratulationsMessage | Success text | Yes |
| MoodTransitionRow | Emoji progression | Feature |
| TransitionArrow | → between emojis | Yes |
| HighlightedEmoji | Current state indicator | Yes |
| SettingsButton | ⚙ with action | Yes |

### 4. Responsibility Split
| UI Layer | Logic Layer |
|----------|-------------|
| Render illustration | Calculate stress change |
| Display current level | Map level to label |
| Show mood transition | Determine emoji states |
| Highlight current | Track stress position |
| Button tap | Navigate to stress detail |

### 5. State Definition
```typescript
interface StressDecreasedState {
  previousLevel: StressLevel;
  currentLevel: StressLevel;
  levelLabel: string;
  transitionEmojis: string[];
  highlightIndex: number;
}

type StressLevel = 1 | 2 | 3 | 4 | 5;

const STRESS_LABELS: Record<StressLevel, string> = {
  1: 'Very Low',
  2: 'Low',
  3: 'Neutral',
  4: 'High',
  5: 'Very High'
};
```

### 6. Data Models
```typescript
interface StressNotification {
  type: 'stress_decreased' | 'stress_increased';
  previousLevel: StressLevel;
  currentLevel: StressLevel;
  change: number;
  triggeredBy?: string;
  recordedAt: Date;
}

const STRESS_EMOJIS: Record<StressLevel, string> = {
  1: '😊',
  2: '🙂',
  3: '😐',
  4: '😟',
  5: '😰'
};
```

### 7. Navigation
- **From**: Push notification, Notifications list
- **To**:
  - "See Stress Level" → Stress Management detail
  - Back → Notifications

### 8. UI States & Edge Cases
| State | Visual Treatment |
|-------|------------------|
| Decreased | Celebration theme |
| Increased | Different illustration/tone |
| Lowest Level | Extra celebration |
| Highest Level | Support resources |
| No Change | No notification |

### 9. Implementation Breakdown
1. **Phase 1**: Level display
   - Show current level name
   - Style based on level
   - Add illustration
2. **Phase 2**: Mood transition
   - Create emoji row
   - Highlight current
   - Show progression
3. **Phase 3**: Actions
   - Navigate to stress detail
   - Settings access

### 10. Open Issues
- [x] **TYPO**: "Decresased" should be "Decreased"
- [ ] Is there an "Increased" variant with different tone?
- [ ] What triggers stress level changes?
- [ ] Should mood transition show actual previous→current?

---

## Screen 139: MeditationReminder

### 1. Purpose
Full-screen reminder notification encouraging user to complete their daily meditation session.

### 2. UI Structure (Visual Only)
```
[StatusBar]
[Header]
  └── [BackButton]

[IllustrationSection - Gray/muted background]
  └── [MeditatingPersonIllustration - prayer pose]

[ContentSection]
  ├── [Title: "It's Time!"]
  ├── [Subtitle: "Time for mediation session."] ⚠️ TYPO
  ├── [Message: "Dr Freud AI said you need to do it
  │    today. Pelase do 25m session."] ⚠️ TYPOS

[ActionButton: "Let's Meditate →"]
```

### 3. Component List
| Component | Description | Reusable? |
|-----------|-------------|-----------|
| FullScreenNotification | Container | Yes |
| MeditationIllustration | Person meditating artwork | Feature |
| UrgentTitle | "It's Time!" heading | Feature |
| ReminderSubtitle | Session type text | Feature |
| AIRecommendationMessage | AI-driven suggestion | Feature |
| StartSessionButton | Primary CTA with arrow | Yes |

### 4. Responsibility Split
| UI Layer | Logic Layer |
|----------|-------------|
| Render illustration | Fetch AI recommendation |
| Display reminder | Determine session duration |
| Show AI message | Track reminder delivery |
| Button tap | Start meditation session |

### 5. State Definition
```typescript
interface MeditationReminderState {
  recommendedDuration: number; // minutes
  sessionType: 'meditation' | 'breathing' | 'relaxation';
  aiReason?: string;
  isOverdue: boolean;
}
```

### 6. Data Models
```typescript
interface MeditationReminder {
  type: 'meditation_reminder';
  sessionType: string;
  recommendedDuration: number;
  aiGenerated: boolean;
  reason?: string;
  scheduledFor?: Date;
}
```

### 7. Navigation
- **From**: Push notification (scheduled), AI recommendation
- **To**:
  - "Let's Meditate" → Meditation session start
  - Back → Notifications
  - Snooze? → Reschedule reminder

### 8. UI States & Edge Cases
| State | Visual Treatment |
|-------|------------------|
| Standard Reminder | Normal styling |
| Overdue | Urgent styling |
| AI Recommended | AI attribution |
| Custom Duration | Show custom time |
| Already Done Today | Different message |

### 9. Implementation Breakdown
1. **Phase 1**: Reminder layout
   - Create illustration section
   - Style urgent title
   - Add AI message
2. **Phase 2**: Content
   - Show recommended duration
   - AI-generated reason
   - Time-based urgency
3. **Phase 3**: Actions
   - Quick start button
   - Navigate to meditation
   - Track interaction

### 10. Open Issues
- [x] **TYPO**: "mediation" should be "meditation"
- [x] **TYPO**: "Pelase" should be "Please"
- [ ] How does AI determine when to remind?
- [ ] Can user snooze the reminder?
- [ ] Is duration customizable before starting?

---

## Cross-Screen Patterns (Batch 28)

### Full-Screen Notification Pattern
All notifications in this batch follow a consistent pattern:
```
[Back Button]
[Themed Illustration - Full width]
[Large Primary Content]
[Supporting Message]
[Action Button]
```

### Color Themes by Notification Type
| Type | Background Color | Illustration Style |
|------|-----------------|-------------------|
| Score Increase | Green/Olive | Joyful person |
| Journal Progress | Tan/Brown | Reading person |
| Therapy Reminder | Orange | Person with phone |
| Stress Decreased | Purple | Serene person |
| Meditation Reminder | Gray | Meditating person |

### Shared Components
1. **FullScreenNotification** - Container pattern
2. **NotificationTitle** - Large centered heading
3. **NotificationMessage** - Supporting text
4. **ActionButton** - Primary CTA
5. **Illustration** - Themed artwork (different per type)

---

## Issues Identified (Batch 28)

### Issue #31: Grammar Error "daily journal" (Screen 136)

**Severity**: LOW

**Location**: Screen 136 (JournalProgress)
**Problem**: "You still need to complete 9 daily journal" - missing plural

**Should be**: "9 daily journals"

**Required Action**:
- [ ] Fix plural: "journal" → "journals"

---

### Issue #32: Typo "Decresased" (Screen 138)

**Severity**: LOW

**Location**: Screen 138 (StressDecreased)
**Problem**: "Stress Decresased!" - misspelled

**Should be**: "Stress Decreased!"

**Required Action**:
- [ ] Fix typo: "Decresased" → "Decreased"

---

### Issue #33: Multiple Typos in Meditation Reminder (Screen 139)

**Severity**: MEDIUM (multiple errors in one screen)

**Location**: Screen 139 (MeditationReminder)
**Problems**:
1. "Time for mediation session" - should be "meditation"
2. "Pelase do 25m session" - should be "Please"

**Required Action**:
- [ ] Fix "mediation" → "meditation"
- [ ] Fix "Pelase" → "Please"
- [ ] Proofread all notification text before implementation

---

## New Components Identified (Batch 28)

| Component | First Appearance | Priority |
|-----------|-----------------|----------|
| FullScreenNotification | Screen 135 | High |
| ScoreChangeDisplay | Screen 135 | Medium |
| SparkleDecorations | Screen 135 | Low |
| CurrentScoreBadge | Screen 135 | Medium |
| ProgressFraction | Screen 136 | Medium |
| EncouragementMessage | Screen 136 | Low |
| TimeDisplay | Screen 137 | Medium |
| CountdownMessage | Screen 137 | Medium |
| CurrentLevelDisplay | Screen 138 | Medium |
| MoodTransitionRow | Screen 138 | Medium |
| TransitionArrow | Screen 138 | Low |
| HighlightedEmoji | Screen 138 | Low |
| UrgentTitle | Screen 139 | Low |
| AIRecommendationMessage | Screen 139 | Low |
| StartSessionButton | Screen 139 | Medium |

---

## Summary

**Screens Documented**: 5 (135-139)
**Feature Progress**: Smart Notifications 6/7

**Issues Found**:
- #31: Grammar "daily journal" (singular instead of plural)
- #32: Typo "Decresased"
- #33: Multiple typos in meditation reminder ("mediation", "Pelase")

**Key Implementation Notes**:
1. All notifications follow consistent full-screen pattern
2. Each notification type has unique themed illustration
3. Color themes help users recognize notification types
4. AI-driven content needs careful proofreading
5. Action buttons consistently navigate to feature detail
