# Batch 9: Home & Mental Health Score (Screens 1-5)

**Source**: `ui-designs/Dark-mode/Home & Mental Health Score/` (individual screen files)
**Screens Covered**: 5 (Home Dashboard, Freud Score Detail, Score Insights, Filter, AI Suggestions)
**Global Screen Numbers**: 40-44

---

## Screen 40: HomeDashboard

### 1. Purpose
Main home screen of the app after onboarding/login. Serves as the central hub displaying mental health metrics, quick access to features, AI chatbot stats, and mindfulness content. This is the primary screen users see daily.

### 2. UI Structure (Visual Only)

```
[SafeAreaView - Dark Background #1C1410]
├── [StatusBar - Light content, 9:41]
│
├── [Header]
│   ├── [DateLabel: "Tue, 20 Jan 2025" - Top left, small]
│   ├── [UserGreeting - Row]
│   │   ├── [Avatar - Circular profile image]
│   │   ├── [GreetingText: "Hi, Shinomiya!"]
│   │   └── [NotificationBell - Right side, may have badge]
│   └── [SearchBar - Full width]
│       ├── [SearchIcon]
│       └── [Placeholder: "Search anything"]
│
├── [ScrollableContent]
│   ├── [MentalHealthMetricsSection]
│   │   ├── [SectionTitle: "Mental Health Metrics"]
│   │   └── [MetricsGrid - 2 columns]
│   │       ├── [FreudScoreCard - Large, spans width]
│   │       │   ├── [CircularGauge - 80 score]
│   │       │   ├── [Label: "Freud Score"]
│   │       │   └── [Status: "Mentally Stable"]
│   │       │
│   │       ├── [MoodCard - Small]
│   │       │   ├── [Label: "Mood"]
│   │       │   └── [MoodEmoji]
│   │       │
│   │       ├── [MindfulHoursCard - Small]
│   │       │   ├── [Label: "Mindful Hours"]
│   │       │   └── [Value: "3 Hrs"]
│   │       │
│   │       ├── [SleepQualityCard - Small]
│   │       │   ├── [Label: "Sleep Quality"]
│   │       │   └── [MiniGraph/Score]
│   │       │
│   │       └── [MentalJournalCard - Small]
│   │           ├── [Label: "Mental Journal"]
│   │           └── [Value: "9 Pages"]
│   │
│   ├── [SecondaryMetricsRow]
│   │   ├── [StressLevelCard]
│   │   │   ├── [Label: "Stress Level"]
│   │   │   └── [Value: "4/5" with indicator]
│   │   │
│   │   └── [MoodTrackerCard]
│   │       ├── [Label: "Mood Tracker"]
│   │       └── [WeeklyEmojis - Row of 7 emoji faces]
│   │
│   ├── [AITherapyChatbotSection]
│   │   ├── [SectionTitle: "AI Therapy Chatbot"]
│   │   ├── [ConversationCount: "2,541"]
│   │   ├── [Label: "Conversations"]
│   │   └── [RecommendationButton]
│   │       └── [Text: "Get recommendation for the day's needs"]
│   │
│   └── [MindfulArticlesSection]
│       ├── [SectionTitle: "Mindful Articles"]
│       └── [ArticleCards - Horizontal scroll]
│
└── [BottomNavigationBar - Fixed]
    ├── [HomeTab - Active]
    ├── [ChatTab]
    ├── [JournalTab]
    ├── [CommunityTab]
    └── [ProfileTab]
```

### 3. Component List

| Component | Variant/State | Props |
|-----------|---------------|-------|
| SafeAreaView | Dark background | `backgroundColor: #1C1410` |
| DateLabel | Small text | `date: Date` |
| UserGreeting | With avatar | `userName: string`, `avatarUrl: string` |
| NotificationBell | With badge | `unreadCount?: number` |
| SearchBar | Expandable | `placeholder: string`, `onSearch: fn` |
| SectionTitle | Standard | `text: string` |
| FreudScoreCard | Large featured | `score: number`, `status: string` |
| CircularGauge | Score display | `value: number`, `max: 100`, `color: string` |
| MetricCard | Small | `label: string`, `value: string \| number`, `icon?: string` |
| MoodEmoji | Current mood | `mood: MoodLevel` |
| WeeklyMoodRow | 7 emojis | `moods: MoodLevel[]` |
| ChatbotStatsCard | Large | `conversationCount: number` |
| ArticleCard | Horizontal scroll item | `title: string`, `thumbnail: string` |
| BottomNavigationBar | 5 tabs | `activeTab: string`, `onTabPress: fn` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render header with date, greeting, notifications
- Display search bar
- Render mental health metrics grid
- Show Freud score with circular gauge
- Display secondary metric cards
- Render AI chatbot section with stats
- Show mindful articles carousel
- Display bottom navigation bar

**Logic (Container/Hook)**:
- Fetch user data (name, avatar)
- Fetch mental health metrics (score, mood, hours, etc.)
- Fetch conversation count
- Fetch articles list
- Handle navigation to detail screens
- Handle search functionality
- Handle notification badge count
- Handle tab navigation

### 5. State Definition

```typescript
interface HomeDashboardState {
  // User Data
  user: {
    name: string;
    avatar: string;
  };

  // Mental Health Metrics
  freudScore: number;
  freudStatus: 'Mentally Stable' | 'Needs Attention' | 'Critical';
  currentMood: MoodLevel;
  mindfulHours: number;
  sleepQuality: number;
  journalPages: number;
  stressLevel: number;
  weeklyMoods: MoodLevel[];

  // Chatbot Stats
  conversationCount: number;

  // Content
  articles: Article[];

  // UI State
  isLoading: boolean;
  activeTab: string;
  notificationCount: number;
}
```

### 6. Data Models

```typescript
interface DashboardMetrics {
  freudScore: number;
  freudStatus: string;
  mood: MoodLevel;
  mindfulHours: number;
  sleepQuality: number;
  journalEntries: number;
  stressLevel: number;
  weeklyMoods: MoodLevel[];
}

interface Article {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  readTime: number;
}

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
}
```

### 7. Navigation

- **Entry Points**:
  - Assessment completion → Home
  - Login → Home
  - App launch (authenticated) → Home
- **Exit Points**:
  - Freud Score card → FreudScoreDetail
  - Mood card → MoodTracker
  - Mindful Hours → MindfulHours feature
  - Sleep Quality → SleepQuality feature
  - Journal → MentalJournal feature
  - AI Chatbot → ChatbotScreen
  - Articles → ArticleDetail
  - Search → SearchScreen
  - Notifications → NotificationsScreen
  - Bottom tabs → respective screens

### 8. UI States & Edge Cases

| State | Visual Behavior |
|-------|-----------------|
| Loading | Skeleton placeholders for all cards |
| No data | Show empty state with "Complete assessment" prompt |
| Score critical | Freud card may show alert styling |
| New notifications | Bell icon shows badge count |
| No articles | Hide articles section or show empty state |

### 9. Implementation Breakdown

1. **Phase 1: Layout Structure**
   - Create scrollable home layout
   - Implement header with greeting
   - Add search bar component

2. **Phase 2: Metrics Grid**
   - Create FreudScoreCard with circular gauge
   - Create MetricCard for smaller metrics
   - Implement grid layout

3. **Phase 3: Secondary Sections**
   - Create chatbot stats section
   - Add articles carousel
   - Implement bottom navigation

4. **Phase 4: Data Integration**
   - Connect to user data API
   - Fetch metrics from backend
   - Handle refresh/pull-to-refresh

### 10. Open Issues

| Issue | Type | Notes |
|-------|------|-------|
| Grid layout exact structure | Design | Need precise spacing and sizing |
| Search functionality scope | Feature | What can be searched? |
| Notification deep linking | Navigation | Where do notifications link to? |
| Pull-to-refresh | Feature | Should metrics refresh on pull? |
| Date format localization | i18n | "Tue, 20 Jan 2025" format |

---

## Screen 41: FreudScoreDetail

### 1. Purpose
Detailed view of user's Freud mental health score with current status, visual representation, and historical score entries with recommendations.

### 2. UI Structure (Visual Only)

```
[SafeAreaView - Green Gradient Background #4A9E8C to #3D8B7A]
├── [StatusBar - Light content]
│
├── [Header]
│   ├── [BackButton - Left, circular with arrow]
│   ├── [Title: "Freud Score"]
│   └── [StatusBadge: "Normal" - Right, pill shape]
│
├── [ScoreDisplayArea - Centered, upper portion]
│   ├── [LargeScoreNumber: "80" - Very large, white, bold]
│   ├── [StatusLabel: "Mentally Stable" - Below score]
│   └── [DecorativeCircles - Background pattern]
│
├── [ChartIconButton - Centered, brown circle]
│   └── [BarChartIcon - White]
│
├── [ScoreHistorySection - Dark bottom panel]
│   ├── [SectionHeader]
│   │   ├── [Title: "Score History"]
│   │   └── [SeeAllLink: "See All"]
│   │
│   └── [HistoryList]
│       ├── [HistoryEntry 1]
│       │   ├── [DateBadge: "SEP 12"]
│       │   ├── [MoodLabel: "Anxious, Depressed"]
│       │   ├── [Recommendation: "Do 25m Breathing."]
│       │   └── [ScoreIndicator: 65, partial orange ring]
│       │
│       ├── [HistoryEntry 2]
│       │   ├── [DateBadge: "SEP 11"]
│       │   ├── [MoodLabel: "Very Happy"]
│       │   ├── [Recommendation: "No Recommendation."]
│       │   └── [ScoreIndicator: 95, full green ring]
│       │
│       └── [HistoryEntry 3]
│           ├── [DateBadge: "SEP 10"]
│           ├── [MoodLabel: "Neutral"]
│           ├── [Recommendation: "Keep it up."]
│           └── [ScoreIndicator: 65, partial brown ring]
```

### 3. Component List

| Component | Variant/State | Props |
|-----------|---------------|-------|
| SafeAreaView | Green gradient | `backgroundColor: gradient` |
| BackButton | Circular | `onPress: fn` |
| ScreenTitle | White | `text: "Freud Score"` |
| StatusBadge | Pill shape | `status: "Normal"` |
| LargeScoreDisplay | Hero | `score: 80`, `status: "Mentally Stable"` |
| DecorativeCircles | Background | Pattern elements |
| IconButton | Circular brown | `icon: "bar-chart"`, `onPress: fn` |
| SectionHeader | With link | `title: string`, `linkText: string`, `onLinkPress: fn` |
| ScoreHistoryEntry | Card | `date`, `mood`, `recommendation`, `score` |
| CircularScoreIndicator | Mini | `score: number`, `color: string` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render gradient background
- Display header with back button and status badge
- Show large score number and status
- Render chart icon button
- Display history list with entries

**Logic (Container/Hook)**:
- Fetch current score and status
- Fetch score history
- Handle navigation to chart view
- Handle "See All" navigation
- Determine status badge text and color

### 5. State Definition

```typescript
interface FreudScoreDetailState {
  // Current Score
  currentScore: number;
  currentStatus: 'Normal' | 'Elevated' | 'Critical';
  statusLabel: string;

  // History
  scoreHistory: ScoreHistoryEntry[];
  isLoadingHistory: boolean;
}

interface ScoreHistoryEntry {
  id: string;
  date: Date;
  mood: string;
  score: number;
  recommendation: string;
}
```

### 6. Data Models

```typescript
interface FreudScoreData {
  score: number;
  status: 'Normal' | 'Elevated' | 'Critical';
  statusLabel: string;
  lastUpdated: Date;
}

interface ScoreHistoryItem {
  id: string;
  date: Date;
  mood: string[];
  score: number;
  recommendation: string | null;
  color: string;
}
```

### 7. Navigation

- **Entry Points**: HomeDashboard (tap Freud Score card)
- **Exit Points**:
  - Back: HomeDashboard
  - Chart icon: FreudScoreInsights
  - See All: Full score history screen
  - History entry: Entry detail (if applicable)

### 8. UI States & Edge Cases

| State | Visual Behavior |
|-------|-----------------|
| Loading | Skeleton for history list |
| No history | Show empty state message |
| Critical score | Red/orange gradient background |
| Normal score | Green gradient background |
| Many history items | List scrolls |

### 9. Implementation Breakdown

1. **Phase 1: Hero Section**
   - Implement gradient background
   - Create large score display
   - Add decorative circles

2. **Phase 2: History List**
   - Create ScoreHistoryEntry component
   - Implement circular score indicator
   - Add scroll behavior

3. **Phase 3: Navigation**
   - Wire up back button
   - Implement chart button navigation
   - Add "See All" functionality

### 10. Open Issues

| Issue | Type | Notes |
|-------|------|-------|
| Status badge values | Data | What are all possible statuses? |
| Gradient colors for different statuses | Design | Colors for Normal/Elevated/Critical |
| History entry tap action | Navigation | Does tapping entry do anything? |
| Chart button destination | Navigation | Goes to insights or separate chart? |

---

## Screen 42: FreudScoreInsights

### 1. Purpose
Analytics view showing Freud score trends over time with positive/negative breakdown, mood history, and access to AI suggestions for improvement.

### 2. UI Structure (Visual Only)

```
[SafeAreaView - Dark Background #1C1410]
├── [StatusBar - Light content]
│
├── [Header]
│   ├── [BackButton - Left, circular]
│   └── [DarkModeToggle? - Right, moon icon]
│
├── [TitleSection]
│   ├── [Title: "Freud Score"]
│   ├── [Subtitle: "See your mental score insights"]
│   └── [HelpButton: "?" - Right side, circular]
│
├── [ChartSection]
│   ├── [ChartLegend - Row]
│   │   ├── [LegendItem: Green dot + "Postive"]
│   │   ├── [LegendItem: Orange dot + "Negative"]
│   │   └── [PeriodDropdown: "Monthly" with dropdown arrow]
│   │
│   ├── [BarChart - Stacked positive/negative]
│   │   ├── [Bars for each day/week, green (positive) and orange (negative)]
│   │   ├── [XAxis: Date range "09 Jan" to "09 Feb"]
│   │   └── [TimelineScrubber - Horizontal slider]
│   │
│   └── [DateRangeLabels]
│       ├── [StartDate: "09 Jan"]
│       └── [EndDate: "09 Feb"]
│
├── [MoodHistorySection]
│   ├── [SectionHeader: "Mood History" with options menu (...)]
│   └── [WeeklyMoodRow]
│       ├── [Mon: Neutral emoji]
│       ├── [Tue: Happy emoji]
│       ├── [Wed: Angry/Distressed emoji]
│       ├── [Thu: Neutral emoji]
│       ├── [Fri: Sad emoji]
│       ├── [Sat: Meh emoji]
│       └── [Sun: Neutral emoji]
│
└── [AISwipeButton - Bottom, pill shape]
    ├── [SwipeIcon: Curved arrows "》"]
    └── [Text: "Swipe for AI suggestions"]
```

### 3. Component List

| Component | Variant/State | Props |
|-----------|---------------|-------|
| SafeAreaView | Dark background | `backgroundColor: #1C1410` |
| BackButton | Circular | `onPress: fn` |
| IconButton | Moon/toggle | `icon: "moon"`, `onPress: fn` |
| ScreenTitle | Large | `text: "Freud Score"` |
| Subtitle | Secondary | `text: string` |
| HelpButton | Circular | `onPress: fn` |
| ChartLegend | Horizontal | `items: LegendItem[]` |
| PeriodDropdown | Select | `value: string`, `options: string[]`, `onChange: fn` |
| StackedBarChart | Interactive | `data: ChartData[]`, `period: string` |
| TimelineScrubber | Slider | `startDate`, `endDate`, `onChange: fn` |
| MoodHistoryRow | Weekly | `moods: { day: string, mood: MoodLevel }[]` |
| SwipeActionButton | Pill | `text: string`, `onSwipe: fn` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render header with back and toggle
- Display title and help button
- Render chart with legend
- Show stacked bar chart
- Display mood history row
- Show swipe button for AI suggestions

**Logic (Container/Hook)**:
- Fetch chart data for selected period
- Handle period dropdown change
- Handle timeline scrubbing
- Handle swipe to AI suggestions
- Toggle dark mode (if applicable)

### 5. State Definition

```typescript
interface FreudScoreInsightsState {
  // Chart Data
  chartData: ChartDataPoint[];
  selectedPeriod: 'Weekly' | 'Monthly' | 'Yearly';
  dateRange: {
    start: Date;
    end: Date;
  };

  // Mood History
  weeklyMoods: {
    day: string;
    mood: MoodLevel;
  }[];

  // UI State
  isLoading: boolean;
}

interface ChartDataPoint {
  date: Date;
  positive: number;
  negative: number;
}
```

### 6. Data Models

```typescript
interface InsightsChartData {
  period: string;
  data: {
    date: string;
    positive: number;
    negative: number;
  }[];
}

interface MoodHistoryWeek {
  weekStart: Date;
  days: {
    dayName: string;
    mood: MoodLevel;
  }[];
}
```

### 7. Navigation

- **Entry Points**: FreudScoreDetail (chart icon)
- **Exit Points**:
  - Back: FreudScoreDetail
  - Swipe button: AIScoreSuggestions
  - Help button: Help modal/tooltip

### 8. UI States & Edge Cases

| State | Visual Behavior |
|-------|-----------------|
| Loading | Skeleton for chart and moods |
| No data for period | Empty chart with message |
| Period change | Chart animates to new data |
| Scrubbing timeline | Chart updates with new date range |

### 9. Implementation Breakdown

1. **Phase 1: Chart Section**
   - Implement stacked bar chart
   - Add legend with color indicators
   - Create period dropdown

2. **Phase 2: Timeline**
   - Add date range labels
   - Implement timeline scrubber
   - Connect to chart filtering

3. **Phase 3: Mood History**
   - Create weekly mood row
   - Display day labels with emojis

4. **Phase 4: Navigation**
   - Implement swipe gesture for AI suggestions
   - Wire up help button

### 10. Open Issues

| Issue | Type | Notes |
|-------|------|-------|
| "Postive" typo | Copy | Should be "Positive" |
| Moon icon function | Feature | Dark mode toggle or decoration? |
| Swipe vs tap | UX | Is swipe required or can user tap? |
| Chart library | Tech | Which charting library to use? |
| Period options | Data | Weekly, Monthly, Yearly? |

---

## Screen 43: FilterFreudScore (Bottom Sheet)

### 1. Purpose
Bottom sheet modal for filtering Freud score history by date range, score range, and AI suggestion inclusion. Allows users to narrow down their historical data view.

### 2. UI Structure (Visual Only)

```
[BottomSheetModal - Dark panel over dimmed background]
├── [DragHandle - Centered, gray bar]
│
├── [Header]
│   ├── [Title: "Filter Freud Score"]
│   └── [HelpButton: "?" - Right, circular]
│
├── [DateRangeSection]
│   ├── [Label: "From"]
│   ├── [DatePicker: Calendar icon + "2025/18/16"]
│   │
│   ├── [Label: "To"]
│   └── [DatePicker: Calendar icon + "2025/18/16"]
│
├── [ScoreRangeSection]
│   ├── [Label: "Score Range"]
│   └── [DualHandleSlider]
│       ├── [LeftHandle: At 0]
│       ├── [RightHandle: At 25]
│       ├── [Track - Green between handles]
│       ├── [LeftLabel: "0"]
│       └── [RightLabel: "25"]
│
├── [AIToggleSection]
│   ├── [Label: "Include AI Suggestions"]
│   └── [ToggleSwitch - ON (green)]
│
└── [ApplyButton - Full width]
    ├── [Text: "Filter Freud Score (15)"]
    └── [FilterIcon]
```

### 3. Component List

| Component | Variant/State | Props |
|-----------|---------------|-------|
| BottomSheet | Modal | `isVisible: boolean`, `onClose: fn` |
| DragHandle | Standard | Visual only |
| SectionTitle | Standard | `text: string` |
| HelpButton | Circular | `onPress: fn` |
| DatePickerButton | With icon | `label`, `value: Date`, `onPress: fn` |
| DualHandleSlider | Range | `min`, `max`, `values: [number, number]`, `onChange: fn` |
| ToggleSwitch | On/Off | `value: boolean`, `onChange: fn` |
| PrimaryButton | With count | `text`, `count?: number`, `onPress: fn` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render bottom sheet with drag handle
- Display filter title and help
- Render date picker buttons
- Show dual-handle score range slider
- Display AI suggestions toggle
- Show apply button with result count

**Logic (Container/Hook)**:
- Track filter values (dates, range, toggle)
- Calculate matching result count
- Handle date picker modal
- Handle slider changes
- Apply filters on submit
- Close sheet on apply or outside tap

### 5. State Definition

```typescript
interface FilterFreudScoreState {
  // Filter Values
  fromDate: Date;
  toDate: Date;
  scoreRange: [number, number];  // [min, max]
  includeAISuggestions: boolean;

  // Result Preview
  matchingCount: number;

  // UI State
  isDatePickerVisible: boolean;
  activeDateField: 'from' | 'to' | null;
}
```

### 6. Data Models

```typescript
interface FreudScoreFilter {
  fromDate: Date;
  toDate: Date;
  scoreMin: number;
  scoreMax: number;
  includeAISuggestions: boolean;
}

interface FilterResult {
  filter: FreudScoreFilter;
  matchingCount: number;
}
```

### 7. Navigation

- **Entry Points**: FreudScoreInsights or Score History (filter button)
- **Exit Points**:
  - Apply: Returns to calling screen with filters applied
  - Dismiss: Close sheet, no changes
  - Help: Help modal/tooltip

### 8. UI States & Edge Cases

| State | Visual Behavior |
|-------|-----------------|
| Default | Reasonable defaults (last month, full range) |
| Invalid date range | Show error, disable apply |
| No matching results | Button shows "(0)", may show warning |
| Toggle off | AI suggestions excluded from results |

### 9. Implementation Breakdown

1. **Phase 1: Bottom Sheet**
   - Implement bottom sheet modal
   - Add drag handle and dismiss behavior

2. **Phase 2: Date Pickers**
   - Create date picker buttons
   - Implement date picker modal
   - Handle date validation

3. **Phase 3: Range Slider**
   - Implement dual-handle slider
   - Show selected range labels
   - Support 0-100 range

4. **Phase 4: Apply Logic**
   - Calculate matching count in real-time
   - Apply filters on button press
   - Communicate filters to parent

### 10. Open Issues

| Issue | Type | Notes |
|-------|------|-------|
| Date format "2025/18/16" | Bug | Invalid date format shown |
| Score range 0-100 or 0-25? | Data | Slider shows 25, but scores are 0-100 |
| Real-time count update | Feature | Does count update as filters change? |
| Date picker style | Design | Native or custom date picker? |

---

## Screen 44: AIScoreSuggestions

### 1. Purpose
Display AI-generated suggestions for improving mental health score, categorized by activity type. Shows actionable recommendations based on user's assessment and score history.

### 2. UI Structure (Visual Only)

```
[SafeAreaView - Dark Background #1C1410]
├── [StatusBar - Light content]
│
├── [Header]
│   ├── [BackButton - Left, circular]
│   └── [DarkModeToggle? - Right, moon icon]
│
├── [TitleSection]
│   ├── [Title: "AI Score Suggestions"]
│   └── [StatsRow]
│       ├── [LocationIcon + "52 Total"]
│       └── [AIIcon + "GPT-6"]
│
├── [FilterBar]
│   ├── [Label: "All Suggestions"]
│   └── [SortDropdown: "Newest" with dropdown arrow]
│
├── [SuggestionsList - Scrollable]
│   ├── [SuggestionCard 1 - Mindfulness]
│   │   ├── [IconRow]
│   │   │   ├── [Icon: Meditation/breathing - Green bg]
│   │   │   ├── [Icon: Yoga - Green bg]
│   │   │   └── [Badge: "8+" - Orange]
│   │   ├── [Title: "Mindfulness Activities"]
│   │   ├── [Subtitle: "Breathing, Relax • 25-30min"]
│   │   └── [ChevronRight - Navigation arrow]
│   │
│   ├── [SuggestionCard 2 - Physical]
│   │   ├── [IconRow]
│   │   │   ├── [Icon: Running - Orange bg]
│   │   │   ├── [Icon: Cycling - Orange bg]
│   │   │   └── [Badge: "8+" - Orange]
│   │   ├── [Title: "Physical Activities"]
│   │   ├── [Subtitle: "Jogging, Running, Swimming • 16-50min"]
│   │   └── [ChevronRight]
│   │
│   ├── [SuggestionCard 3 - Social]
│   │   ├── [IconRow]
│   │   │   ├── [Icon: Social - Purple bg]
│   │   │   ├── [Icon: People - Yellow bg]
│   │   │   └── [Badge: "8+" - Orange]
│   │   ├── [Title: "Social Connection"]
│   │   ├── [Subtitle: "Party, Binge Watching • 1-2hr"]
│   │   └── [ChevronRight]
│   │
│   └── [SuggestionCard 4 - Professional]
│       ├── [IconRow]
│       │   ├── [Icon: Therapy - Yellow bg]
│       │   ├── [Icon: Phone - Yellow bg]
│       │   └── [Badge: "8+" - Orange]
│       ├── [Title: "Professional Support"]
│       ├── [Subtitle: "Psychiatrist, Hotline • 25-30min"]
│       └── [ChevronRight]
│
└── [HomeIndicator]
```

### 3. Component List

| Component | Variant/State | Props |
|-----------|---------------|-------|
| SafeAreaView | Dark background | `backgroundColor: #1C1410` |
| BackButton | Circular | `onPress: fn` |
| IconButton | Moon | `onPress: fn` |
| ScreenTitle | Large | `text: "AI Score Suggestions"` |
| StatsBadge | With icon | `icon`, `text: string` |
| FilterBar | With dropdown | `label`, `sortValue`, `onSortChange: fn` |
| SortDropdown | Select | `value`, `options`, `onChange: fn` |
| SuggestionCard | Category card | `icons[]`, `badge`, `title`, `subtitle`, `onPress: fn` |
| CategoryIcon | Colored circle | `icon: string`, `backgroundColor: string` |
| CountBadge | Small | `count: string` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render header with back button
- Display title with stats
- Show filter bar with sort dropdown
- Render list of suggestion cards
- Display icons, titles, subtitles per card
- Show navigation arrows

**Logic (Container/Hook)**:
- Fetch AI suggestions from API
- Handle sorting (Newest, Oldest, etc.)
- Handle card tap to navigate to detail
- Track suggestion interaction analytics
- Refresh suggestions on pull

### 5. State Definition

```typescript
interface AIScoreSuggestionsState {
  // Data
  suggestions: SuggestionCategory[];
  totalCount: number;
  aiModel: string;             // "GPT-6"

  // Filters
  sortBy: 'newest' | 'oldest' | 'duration' | 'category';
  filterCategory?: string;

  // UI State
  isLoading: boolean;
}

interface SuggestionCategory {
  id: string;
  category: 'mindfulness' | 'physical' | 'social' | 'professional';
  title: string;
  activities: string[];
  duration: string;
  activityCount: number;
  icons: { icon: string; color: string }[];
}
```

### 6. Data Models

```typescript
interface AISuggestion {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  activities: Activity[];
  duration: string;
  generatedAt: Date;
  aiModel: string;
}

interface Activity {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  duration: string;
  description?: string;
}

const SUGGESTION_CATEGORIES = {
  mindfulness: {
    color: '#9AAD5C',
    icon: 'meditation',
  },
  physical: {
    color: '#E8853A',
    icon: 'running',
  },
  social: {
    color: '#7B68B5',
    icon: 'people',
  },
  professional: {
    color: '#F4D03F',
    icon: 'therapy',
  },
};
```

### 7. Navigation

- **Entry Points**:
  - FreudScoreInsights (swipe button)
  - Home dashboard (recommendation button)
- **Exit Points**:
  - Back: Previous screen
  - Card tap: Suggestion detail/activity list

### 8. UI States & Edge Cases

| State | Visual Behavior |
|-------|-----------------|
| Loading | Skeleton cards |
| No suggestions | Empty state with message |
| Sort change | List re-orders with animation |
| Card tap | Navigate to detail view |
| Many suggestions | List scrolls |

### 9. Implementation Breakdown

1. **Phase 1: List Layout**
   - Create scrollable list
   - Implement SuggestionCard component
   - Add icon row with category icons

2. **Phase 2: Header & Filter**
   - Create stats badges
   - Implement sort dropdown
   - Wire up filter bar

3. **Phase 3: Navigation**
   - Handle card tap to detail
   - Add chevron arrows
   - Implement sort functionality

### 10. Open Issues

| Issue | Type | Notes |
|-------|------|-------|
| "GPT-6" reference | Copy | Is this actual AI model or branding? |
| "8+" badge meaning | UX | Number of activities? Recommendations? |
| Category detail screen | Navigation | What does tapping a card show? |
| "Binge Watching" as self-care | Content | Questionable mental health advice |
| Duration ranges | Data | How are durations determined? |

---

## Cross-Screen Patterns

### Home Dashboard Data Flow

```typescript
// Central dashboard state management
interface DashboardDataSource {
  // Fetches all dashboard metrics in one call
  fetchDashboardData: () => Promise<DashboardMetrics>;

  // Individual refresh functions
  refreshFreudScore: () => Promise<FreudScoreData>;
  refreshMood: () => Promise<MoodData>;
  refreshStats: () => Promise<StatsData>;
}
```

### Score Visualization Components

```typescript
// Shared score display components
interface CircularGaugeProps {
  value: number;
  maxValue: number;
  size: 'small' | 'medium' | 'large';
  color: string;
  showLabel?: boolean;
}

interface ScoreHistoryEntryProps {
  date: Date;
  mood: string;
  score: number;
  recommendation?: string;
  onPress?: () => void;
}
```

### New Components Identified

| Component | Description | Priority |
|-----------|-------------|----------|
| HomeDashboard | Main home screen layout | High |
| UserGreeting | Avatar + name + notifications | High |
| MetricCard | Small metric display card | High |
| FreudScoreCard | Large score with gauge | High |
| CircularGauge | Score visualization | High |
| BottomNavigationBar | 5-tab navigation | High |
| ScoreHistoryEntry | History list item | Medium |
| StackedBarChart | Positive/negative chart | Medium |
| TimelineScrubber | Date range slider | Medium |
| WeeklyMoodRow | 7-day mood display | Medium |
| DualHandleSlider | Range selection | Medium |
| SuggestionCard | AI suggestion category | Medium |
| CategoryIcon | Colored icon circle | Low |
| SwipeActionButton | Swipe to action | Low |

---

## Summary

| # | Screen Name | Type | Key Features |
|---|-------------|------|--------------|
| 40 | HomeDashboard | Main screen | Metrics grid, Freud score gauge, chatbot stats, articles |
| 41 | FreudScoreDetail | Detail view | Large score display, history list, gradient background |
| 42 | FreudScoreInsights | Analytics | Stacked bar chart, mood history, period selector |
| 43 | FilterFreudScore | Bottom sheet | Date range, score range slider, AI toggle |
| 44 | AIScoreSuggestions | List view | Categorized suggestions, activity icons, durations |

**BATCH 9 COMPLETE - 5/7 Home & Mental Health Score screens documented**

---

## Critical Notes

1. **Typos Identified**:
   - Screen 42: "Postive" → "Positive"
   - Screen 43: Date format "2025/18/16" is invalid

2. **GPT-6 Reference**: Screen 44 mentions "GPT-6" - clarify if this is placeholder or actual branding.

3. **"Binge Watching" as Mental Health Activity**: Screen 44 suggests "Binge Watching" under Social Connection - this may need clinical review.

4. **Home Dashboard Complexity**: Screen 40 is the most complex screen so far with many interconnected components. Consider breaking into sub-components.

5. **Chart Implementation**: Screen 42 requires a charting library for the stacked bar chart. Recommend victory-native or react-native-chart-kit.
