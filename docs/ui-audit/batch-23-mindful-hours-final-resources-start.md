# Batch 23: Mindful Hours Final + Mindful Resources Start

## Overview
- **Screens Covered**: 110-114
- **Features**:
  - Mindful Hours Screens 7-8 (COMPLETION)
  - Mindful Resources Screens 1-3 (Light Mode Only)
- **Status**: Complete

---

## Screen 110: BreathingExerciseActive

### 1. Purpose
Active state of the breathing exercise player showing the in-progress breathing animation with phase indication and session controls.

### 2. UI Structure (Visual Only)
```
[StatusBar]
[SoundscapeBadge: "Sound: Chirping Birds"]

[ConcentricCirclesContainer]
  └── [BreathingCircle - Animated expanding/contracting]
      └── [PhaseLabel: "Breathe Out..."]

[ProgressContainer]
  ├── [ElapsedTime: "05:21"]
  ├── [ProgressBar - Filled portion]
  └── [TotalTime: "25:00"]

[ControlsRow]
  ├── [RewindButton]
  ├── [PauseButton - Primary]
  └── [FastForwardButton]
```

### 3. Component List
| Component | Description | Reusable? |
|-----------|-------------|-----------|
| SoundscapeBadge | Shows active soundscape with speaker icon | Yes |
| ConcentricCirclesContainer | Background circles animation container | Feature |
| BreathingCircle | Animated circle that expands/contracts with breath | Feature |
| PhaseLabel | Current breathing phase text | Feature |
| ProgressBar | Linear progress indicator with time labels | Yes |
| ElapsedTimeLabel | Shows elapsed time in MM:SS | Yes |
| TotalTimeLabel | Shows total session time | Yes |
| RewindButton | Skip back control (circular arrow left) | Yes |
| PauseButton | Large primary pause control | Yes |
| FastForwardButton | Skip forward control (circular arrow right) | Yes |
| ControlsRow | Horizontal container for playback controls | Yes |

### 4. Responsibility Split
| UI Layer | Logic Layer |
|----------|-------------|
| Render concentric circles animation | Calculate circle scale based on phase |
| Display phase label | Manage breathing phase state machine |
| Render progress bar | Track elapsed time |
| Show control buttons | Handle pause/resume logic |
| Animate button press feedback | Process skip controls |
| Display soundscape badge | Manage audio playback |

### 5. State Definition
```typescript
interface BreathingExerciseActiveState {
  // Session state
  isPlaying: boolean;
  isPaused: boolean;
  elapsedTime: number; // seconds
  totalDuration: number; // seconds

  // Breathing state
  currentPhase: BreathingPhase;
  phaseProgress: number; // 0-1 within current phase
  cycleCount: number;
  circleScale: number; // 0.5-1.0 for animation

  // Audio state
  soundscape: Soundscape;
  volume: number;
  isMuted: boolean;
}

type BreathingPhase = 'breathe_in' | 'hold_in' | 'breathe_out' | 'hold_out';

interface BreathingConfig {
  breatheInDuration: number;
  holdInDuration: number;
  breatheOutDuration: number;
  holdOutDuration: number;
}
```

### 6. Data Models
```typescript
interface ExerciseProgress {
  sessionId: string;
  startTime: Date;
  elapsedSeconds: number;
  totalSeconds: number;
  completedCycles: number;
  currentPhase: BreathingPhase;
}

interface PhaseDisplay {
  phase: BreathingPhase;
  label: string; // "Breathe In...", "Hold...", "Breathe Out..."
  duration: number;
}

const PHASE_LABELS: Record<BreathingPhase, string> = {
  breathe_in: 'Breathe In...',
  hold_in: 'Hold...',
  breathe_out: 'Breathe Out...',
  hold_out: 'Rest...'
};
```

### 7. Navigation
- **From**: Screen 109 (BreathingExercisePlayer - Initial state)
- **To**:
  - Back button → Confirm exit dialog → MindfulHoursHome
  - Complete session → Screen 111 (ExerciseCompleted)
  - Pause → Same screen (paused state)

### 8. UI States & Edge Cases
| State | Visual Treatment |
|-------|------------------|
| Playing | Circle animates, timer counts up |
| Paused | Circle frozen, pause button shows play icon |
| Phase Transition | Smooth animation between phases |
| Near Completion | Same display (no special indicator) |
| Session Complete | Transition to completion modal |
| Low Battery | System warning (app continues) |
| Incoming Call | Pause automatically |
| Background | Continue audio, pause animation |

### 9. Implementation Breakdown
1. **Phase 1**: Breathing animation system
   - Create pulsing circle with scale animation
   - Implement phase state machine (in→hold→out→rest→repeat)
   - Sync animation timing with breathing config
2. **Phase 2**: Progress tracking
   - Implement elapsed time counter
   - Create linear progress bar component
   - Format time display (MM:SS)
3. **Phase 3**: Playback controls
   - Implement pause/resume functionality
   - Add skip forward/back (±30 seconds or ±1 cycle)
   - Handle background audio continuation
4. **Phase 4**: Session completion
   - Detect when elapsed >= total
   - Trigger completion modal
   - Save session to history

### 10. Open Issues
- [ ] Should skip controls move by time (±30s) or by breath cycle?
- [ ] What happens if user locks phone - continue audio only?
- [ ] Is there haptic feedback for phase transitions?
- [ ] Should progress bar show phase segments?

---

## Screen 111: ExerciseCompletedModal

### 1. Purpose
Success modal displayed after completing a mindful breathing exercise, showing gamification rewards and encouragement message.

### 2. UI Structure (Visual Only)
```
[OverlayBackground - Semi-transparent dark]
[BackgroundScreen - MindfulHoursStats partially visible]

[ModalCard]
  ├── [IllustrationContainer]
  │   └── [RelaxedWomanIllustration - with flowers]
  ├── [Title: "Exercise Completed!"]
  ├── [RewardsRow]
  │   ├── [FreudScoreBadge: "+8 Freud Score"]
  │   └── [StressLevelBadge: "-1 Stress Level"]
  ├── [CongratulationsMessage]
  │   └── "Your mental health is improving, congratulations!! 🎉"
  └── [ConfirmButton: "Got it, thanks! ✓"]

[CloseButton - X at bottom center]
```

### 3. Component List
| Component | Description | Reusable? |
|-----------|-------------|-----------|
| ModalOverlay | Dark semi-transparent backdrop | Yes |
| SuccessModal | Modal container with rounded corners | Yes |
| SuccessIllustration | Decorative relaxation artwork | Feature |
| CompletionTitle | "Exercise Completed!" heading | Feature |
| RewardsRow | Horizontal container for reward badges | Feature |
| FreudScoreBadge | Shows points earned (+8) | Yes |
| StressLevelBadge | Shows stress reduction (-1) | Yes |
| CongratulationsText | Encouraging message with emoji | Feature |
| ConfirmButton | Primary action button with checkmark | Yes |
| ModalCloseButton | X button to dismiss | Yes |

### 4. Responsibility Split
| UI Layer | Logic Layer |
|----------|-------------|
| Render modal overlay with animation | Calculate rewards based on session |
| Display illustration | Update Freud Score in state |
| Show reward badges | Update Stress Level |
| Render confirmation button | Save session to history |
| Handle close button | Navigate after dismissal |
| Animate modal entrance | Trigger any achievement checks |

### 5. State Definition
```typescript
interface ExerciseCompletedState {
  isVisible: boolean;
  sessionSummary: CompletedSession;
  rewards: SessionRewards;
  isProcessing: boolean;
}

interface CompletedSession {
  sessionId: string;
  exerciseType: 'breathing' | 'meditation' | 'relaxation';
  duration: number;
  completedAt: Date;
  goal: ExerciseGoal;
}

interface SessionRewards {
  freudScoreEarned: number;
  stressReduction: number;
  streakBonus?: number;
  achievementUnlocked?: Achievement;
}
```

### 6. Data Models
```typescript
interface ExerciseCompletionResult {
  session: CompletedSession;
  rewards: SessionRewards;
  newTotals: {
    totalFreudScore: number;
    currentStressLevel: number;
    totalMindfulMinutes: number;
  };
  message: string;
}

// Reward calculation rules
const REWARD_RULES = {
  baseFreudScore: 5,
  perMinuteBonus: 0.5,
  stressReductionBase: 1,
  streakMultiplier: 1.2
};
```

### 7. Navigation
- **From**: Screen 110 (BreathingExerciseActive - on completion)
- **To**:
  - "Got it, thanks!" → MindfulHoursStats (Screen 105)
  - Close (X) → MindfulHoursStats

### 8. UI States & Edge Cases
| State | Visual Treatment |
|-------|------------------|
| Modal Opening | Fade in overlay, slide up modal |
| Display | Full modal with rewards |
| Processing | Button shows loading state |
| Dismissed | Fade out animation |
| Achievement Unlocked | Additional badge/celebration |
| First Completion | Special first-time message? |
| Error Saving | Show retry option |

### 9. Implementation Breakdown
1. **Phase 1**: Modal structure
   - Create modal overlay component
   - Add slide-up animation
   - Implement close button logic
2. **Phase 2**: Content display
   - Render illustration asset
   - Create reward badge components
   - Style congratulations message
3. **Phase 3**: Reward integration
   - Calculate session rewards
   - Update global Freud Score
   - Update stress level
4. **Phase 4**: Session persistence
   - Save completed session to history
   - Trigger achievement checks
   - Navigate to stats on dismiss

### 10. Open Issues
- [ ] Should different exercise durations give different rewards?
- [ ] Is there a daily cap on Freud Score earnings?
- [ ] Should incomplete sessions (exited early) get partial rewards?
- [ ] Does stress reduction compound or cap at a minimum?

---

## Screen 112: MindfulResourcesHome

### 1. Purpose
Main dashboard for mindful resources showing featured content, articles, and courses in a combined overview with quick access to all resource types.

### 2. UI Structure (Visual Only)
```
[StatusBar]
[Header]
  └── [BackButton]

[ScrollContainer]
  ├── [TitleSection]
  │   ├── [Title: "Our Resources"]
  │   └── [StatsRow]
  │       ├── [ArticleCount: "📄 185 Articles"]
  │       └── [CourseCount: "🎓 512 Courses"]
  │
  ├── [FeaturedResourceSection]
  │   ├── [SectionLabel: "Featured Resource"]
  │   ├── [OptionsButton - 3 dots]
  │   └── [FeaturedCard]
  │       ├── [CardImage]
  │       ├── [CategoryBadge: "Mental Health"]
  │       ├── [Title: "Freud App: Your Pocket..."]
  │       └── [ArrowIndicator]
  │
  ├── [ArticlesSection]
  │   ├── [SectionHeader: "Our Articles" + "See All"]
  │   ├── [ArticleCarousel]
  │   │   ├── [ArticleCard 1]
  │   │   │   ├── [Image]
  │   │   │   ├── [CategoryBadge]
  │   │   │   ├── [Title]
  │   │   │   └── [MetricsRow: views, likes, comments]
  │   │   └── [ArticleCard 2]
  │   └── [PaginationDots]
  │
  └── [CoursesSection]
      ├── [SectionHeader: "Our Courses"]
      └── [CourseList]
          ├── [CourseRow 1 - Mindfulness 101]
          ├── [CourseRow 2 - Indian Meditation]
          └── [CourseRow 3 - African Meditation]

[BottomNavigation]
  ├── [StatsIcon]
  ├── [FAB - Plus button]
  └── [SettingsIcon?]
```

### 3. Component List
| Component | Description | Reusable? |
|-----------|-------------|-----------|
| BackButton | Navigation back arrow | Yes |
| SectionTitle | "Our Resources" heading | Feature |
| ResourceStatsRow | Article and course counts with icons | Feature |
| SectionHeader | Section label with "See All" link | Yes |
| FeaturedResourceCard | Large featured content card | Feature |
| CategoryBadge | Colored pill with category name | Yes |
| ArticleCard | Compact article preview card | Feature |
| ArticleMetrics | Views, likes, comments row | Feature |
| CourseRow | Horizontal course list item | Feature |
| CourseAvatar | Instructor thumbnail image | Yes |
| StarRating | Rating display with star icon | Yes |
| ViewCount | View count with eye icon | Yes |
| LessonCount | Lesson count with book icon | Yes |
| PaginationDots | Carousel page indicators | Yes |
| FloatingActionButton | Center plus button | Yes |
| BottomNav | Navigation bar with icons | Yes |

### 4. Responsibility Split
| UI Layer | Logic Layer |
|----------|-------------|
| Render resource cards | Fetch featured content |
| Display article carousel | Load articles with pagination |
| Show course list | Fetch course catalog |
| Handle scroll | Track viewed items for analytics |
| Render pagination dots | Manage carousel position |
| Display metrics | Format large numbers (200K) |
| Handle FAB press | Determine FAB action |

### 5. State Definition
```typescript
interface MindfulResourcesHomeState {
  // Loading states
  isLoading: boolean;
  isFeaturedLoading: boolean;

  // Content
  featuredResource: Resource | null;
  articles: Article[];
  courses: Course[];

  // Stats
  totalArticles: number;
  totalCourses: number;

  // UI state
  articleCarouselIndex: number;
  error: string | null;
}

interface ResourcesStats {
  articleCount: number;
  courseCount: number;
  totalViews: number;
}
```

### 6. Data Models
```typescript
interface Resource {
  id: string;
  type: 'article' | 'course' | 'video';
  title: string;
  category: ResourceCategory;
  thumbnail: string;
  isFeatured: boolean;
}

interface Article extends Resource {
  type: 'article';
  author: string;
  excerpt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  readTimeMinutes: number;
  publishedAt: Date;
}

interface Course extends Resource {
  type: 'course';
  instructor: Instructor;
  rating: number;
  ratingCount: number;
  viewCount: number;
  lessonCount: number;
  totalDuration: number;
  enrollmentCount: number;
}

interface Instructor {
  id: string;
  name: string;
  avatar: string;
  credentials: string;
}

type ResourceCategory =
  | 'mental_health'
  | 'stress'
  | 'anxiety'
  | 'meditation'
  | 'tips_tricks'
  | 'ai_ml';
```

### 7. Navigation
- **From**: Home Dashboard, Bottom Tab Navigation
- **To**:
  - Featured card → ArticleDetail or CourseDetail
  - "See All" Articles → Screen 113 (ArticlesList)
  - "See All" Courses → Screen 114 (CoursesList)
  - Article card → ArticleDetail
  - Course row → CourseDetail
  - FAB → Create resource? (unclear)

### 8. UI States & Edge Cases
| State | Visual Treatment |
|-------|------------------|
| Loading | Skeleton placeholders |
| Loaded | Full content display |
| Empty Articles | "No articles yet" message |
| Empty Courses | "No courses yet" message |
| Featured Unavailable | Hide featured section |
| Network Error | Error message with retry |
| Pull to Refresh | Refresh indicator |
| Offline | Cached content with indicator |

### 9. Implementation Breakdown
1. **Phase 1**: Layout structure
   - Create scroll container with sections
   - Implement section headers with "See All"
   - Add bottom navigation bar
2. **Phase 2**: Featured section
   - Create featured card component
   - Add category badge system
   - Implement tap navigation
3. **Phase 3**: Articles carousel
   - Create horizontal scroll carousel
   - Add pagination dots
   - Create article card with metrics
4. **Phase 4**: Courses list
   - Create course row component
   - Add rating and stats display
   - Implement "See All" navigation
5. **Phase 5**: Data integration
   - Connect to resources API
   - Implement loading states
   - Add error handling

### 10. Open Issues
- [x] **CRITICAL**: "Dr. Hannibal Lector" as instructor name - fictional serial killer (See CRITICAL-ISSUES.md)
- [ ] What does the FAB (+) button do?
- [ ] What are the bottom nav icons for?
- [ ] Stats show 185 articles but search shows 2,152 - which is correct?
- [ ] Is "Clayton Biggsby" appropriate? (Reference to Dave Chappelle character)
- [ ] Should course avatars show instructor or course icon?

---

## Screen 113: ArticlesList

### 1. Purpose
Full articles listing screen with search functionality, category filtering, and comprehensive article browsing.

### 2. UI Structure (Visual Only)
```
[StatusBar]
[CurvedHeader - Olive green]
  ├── [BackButton]
  └── [Title: "Our Articles"]

[SearchSection]
  └── [SearchBar: "Search 2,152 articles..."]

[SuggestedCategorySection]
  ├── [SectionHeader: "Suggested Category" + "See All"]
  └── [CategoryPillsRow - Horizontal scroll]
      ├── [Pill: Stress + icon]
      ├── [Pill: Anxiety + icon]
      ├── [Pill: Health + icon]
      ├── [Pill: Status + icon]
      └── [Pill: Heal... (truncated)]

[AllArticlesSection]
  ├── [SectionHeader: "All Articles"]
  └── [ArticleCardList]
      ├── [ArticleCard - "How Freud App Helps..."]
      │   ├── [Image]
      │   ├── [CategoryBadge: "AI/ML"]
      │   ├── [Title]
      │   └── [ArrowIndicator]
      ├── [ArticleCard - "Freud App: Your Pocket..."]
      │   ├── [Image]
      │   ├── [CategoryBadge: "Mental Health"]
      │   └── [Title]
      └── [ArticleCard - "Exploring the Depths..."]
          ├── [Image]
          ├── [CategoryBadge: "Tips & Tricks"]
          └── [Title]
```

### 3. Component List
| Component | Description | Reusable? |
|-----------|-------------|-----------|
| CurvedHeader | Olive green curved header section | Yes (themed) |
| SearchBar | Text input with search icon and placeholder | Yes |
| SectionHeader | Label with optional "See All" link | Yes |
| CategoryPill | Selectable pill with icon and label | Yes |
| CategoryPillsRow | Horizontal scrolling pill container | Yes |
| ArticleCardLarge | Full-width article card with image | Feature |
| CategoryBadge | Colored category label pill | Yes |
| ArrowIndicator | Right chevron for navigation hint | Yes |
| ArticleImage | Thumbnail/hero image for article | Yes |
| ArticleTitle | Multi-line title text | Yes |

### 4. Responsibility Split
| UI Layer | Logic Layer |
|----------|-------------|
| Render search bar | Handle search query |
| Display category pills | Filter by category |
| Show article cards | Fetch paginated articles |
| Handle scroll | Load more on scroll |
| Highlight selected category | Track filter state |
| Render article images | Cache images |
| Handle card tap | Navigate to article |

### 5. State Definition
```typescript
interface ArticlesListState {
  // Search & Filter
  searchQuery: string;
  selectedCategory: string | null;
  availableCategories: Category[];

  // Articles
  articles: Article[];
  totalCount: number;
  currentPage: number;
  hasMore: boolean;

  // UI
  isSearching: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  articleCount: number;
}
```

### 6. Data Models
```typescript
interface ArticleListItem {
  id: string;
  title: string;
  thumbnail: string;
  category: ResourceCategory;
  categoryLabel: string;
  excerpt?: string;
}

interface ArticlesResponse {
  articles: ArticleListItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
  };
}

interface ArticleSearchParams {
  query?: string;
  category?: string;
  page: number;
  pageSize: number;
  sortBy: 'recent' | 'popular' | 'recommended';
}
```

### 7. Navigation
- **From**: Screen 112 (MindfulResourcesHome - "See All" articles)
- **To**:
  - Back button → MindfulResourcesHome
  - Article card → ArticleDetail
  - Category pill → Filtered list
  - "See All" categories → CategoryList?

### 8. UI States & Edge Cases
| State | Visual Treatment |
|-------|------------------|
| Initial Load | Skeleton cards |
| Loaded | Full article list |
| Searching | Search loading indicator |
| No Results | "No articles found" message |
| Category Filtered | Highlighted category pill |
| Load More | Bottom loading indicator |
| All Loaded | "No more articles" message |
| Network Error | Error with retry |
| Offline | Cached articles only |

### 9. Implementation Breakdown
1. **Phase 1**: Header and search
   - Create curved olive header
   - Implement search bar component
   - Add debounced search
2. **Phase 2**: Category filtering
   - Create category pill component
   - Implement horizontal scroll container
   - Add selection state handling
3. **Phase 3**: Article list
   - Create article card component
   - Implement FlatList with pagination
   - Add load more on scroll
4. **Phase 4**: Search integration
   - Connect search to API
   - Implement category filtering
   - Combine search + filter

### 10. Open Issues
- [ ] Category pills show truncated text ("Heal...") - need proper ellipsis or expand
- [ ] What's the difference between "Status" and "Health" categories?
- [ ] Should search happen on type or on submit?
- [ ] Is there article sorting (newest, popular)?
- [ ] 2,152 articles count doesn't match 185 from home screen

---

## Screen 114: CoursesList

### 1. Purpose
Full courses listing with category filtering, featured course display, and comprehensive course browsing.

### 2. UI Structure (Visual Only)
```
[StatusBar]
[CurvedHeader - Orange]
  ├── [BackButton]
  └── [Title: "Our Courses"]

[FilterChipsRow - Horizontal scroll]
  ├── [Chip: Health - selected style]
  ├── [Chip: Meditation]
  ├── [Chip: Stress]
  └── [Chip: Anxi... (truncated)]

[FeaturedCourseSection]
  ├── [SectionLabel: "Featured Course"]
  └── [FeaturedCourseCard]
      ├── [BackgroundImage - Nature scene]
      ├── [Title: "Gratefulness in Nature"]
      ├── [Instructor: "By Ananyan U. Wu"]
      ├── [Duration: "15:00"]
      └── [PlayButton - Centered]

[AllCoursesSection]
  ├── [SectionHeader: "All Courses" + "See All"]
  └── [CourseRowList]
      ├── [CourseRow - Mindfulness 101]
      │   ├── [Avatar]
      │   ├── [Title + Instructor]
      │   └── [Metrics: rating, views, lessons]
      ├── [CourseRow - Indian Meditation]
      ├── [CourseRow - African Meditation]
      └── [CourseRow - Indian Meditation (duplicate)]
```

### 3. Component List
| Component | Description | Reusable? |
|-----------|-------------|-----------|
| CurvedHeaderOrange | Orange themed curved header | Yes (themed) |
| FilterChip | Selectable category chip | Yes |
| FilterChipsRow | Horizontal scrolling chips | Yes |
| FeaturedCourseCard | Large video-style course card | Feature |
| CourseBackgroundImage | Full-bleed course thumbnail | Yes |
| PlayButtonOverlay | Centered play icon on image | Yes |
| CourseDurationBadge | Time indicator on video | Yes |
| InstructorLabel | "By [name]" text | Yes |
| CourseRow | Horizontal course list item | Feature |
| CourseAvatar | Circular instructor/course image | Yes |
| CourseMetrics | Rating, views, lessons row | Feature |
| StarRating | Star icon with number | Yes |
| ViewCountBadge | Eye icon with count | Yes |
| LessonCountBadge | Book icon with count | Yes |

### 4. Responsibility Split
| UI Layer | Logic Layer |
|----------|-------------|
| Render filter chips | Handle filter selection |
| Display featured course | Fetch featured course |
| Show course list | Load paginated courses |
| Handle play button | Navigate to course player |
| Display metrics | Format large numbers |
| Handle scroll | Load more courses |
| Animate chip selection | Track selected filters |

### 5. State Definition
```typescript
interface CoursesListState {
  // Filters
  availableFilters: CourseFilter[];
  selectedFilters: string[];

  // Content
  featuredCourse: Course | null;
  courses: Course[];
  totalCount: number;
  currentPage: number;
  hasMore: boolean;

  // UI
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
}

interface CourseFilter {
  id: string;
  label: string;
  count: number;
}
```

### 6. Data Models
```typescript
interface CourseListItem {
  id: string;
  title: string;
  instructor: {
    name: string;
    avatar: string;
  };
  thumbnail: string;
  rating: number;
  viewCount: number;
  lessonCount: number;
  totalDuration: number;
  isFeatured: boolean;
}

interface FeaturedCourse extends CourseListItem {
  videoPreviewUrl?: string;
  description: string;
}

interface CoursesResponse {
  featured: FeaturedCourse | null;
  courses: CourseListItem[];
  pagination: {
    page: number;
    total: number;
    hasMore: boolean;
  };
}
```

### 7. Navigation
- **From**: Screen 112 (MindfulResourcesHome - "See All" courses)
- **To**:
  - Back button → MindfulResourcesHome
  - Featured course play → CoursePlayer
  - Course row → CourseDetail
  - Filter chip → Filtered results

### 8. UI States & Edge Cases
| State | Visual Treatment |
|-------|------------------|
| Initial Load | Skeleton cards |
| Loaded | Full course list |
| No Featured | Hide featured section |
| Filter Applied | Highlighted chip(s) |
| No Results | "No courses match filter" |
| Loading More | Bottom spinner |
| All Loaded | End of list message |
| Network Error | Error with retry |
| Playing Preview | Video player modal? |

### 9. Implementation Breakdown
1. **Phase 1**: Header and filters
   - Create orange curved header
   - Implement filter chip component
   - Handle multi-select filters
2. **Phase 2**: Featured course
   - Create featured card with image
   - Add play button overlay
   - Show duration badge
3. **Phase 3**: Course list
   - Create course row component
   - Add metrics display
   - Implement pagination
4. **Phase 4**: Filter integration
   - Connect filters to API
   - Handle multiple filter selection
   - Clear filters functionality

### 10. Open Issues
- [x] **CRITICAL**: "Dr. Hannibal Lector" as instructor - fictional serial killer (See CRITICAL-ISSUES.md)
- [ ] Filter chip text truncated ("Anxi...") - need proper handling
- [ ] "Indian Meditation" appears twice in the list - duplicate data?
- [ ] Is "Clayton Biggsby" appropriate? (Dave Chappelle character)
- [ ] What happens when play button is tapped - in-app player or external?
- [ ] Should filters be single or multi-select?
- [ ] "See All" link exists but we're already on all courses screen

---

## Cross-Screen Patterns (Batch 23)

### Mindful Hours Completion Flow
```
Screen 109 → Screen 110 → Screen 111
Start Exercise → Active Exercise → Completion Modal
```

### Mindful Resources Navigation
```
Screen 112 (Home) ─┬─→ Screen 113 (Articles)
                   └─→ Screen 114 (Courses)
```

### Shared Components Across Screens
1. **CategoryBadge** - Used in articles and courses
2. **CourseRow** - Identical pattern in home and list
3. **SectionHeader** - "See All" pattern throughout
4. **CurvedHeader** - Different colors (olive, orange)
5. **FilterChip/CategoryPill** - Similar selection pattern

### Data Inconsistencies
1. Article count: 185 (home) vs 2,152 (search)
2. Duplicate course entries
3. Instructor name issues (Hannibal Lector)

---

## New Components Identified (Batch 23)

| Component | First Appearance | Priority |
|-----------|-----------------|----------|
| SoundscapeBadge | Screen 110 | Medium |
| ProgressBarWithTime | Screen 110 | High |
| PlaybackControls | Screen 110 | High |
| SuccessModal | Screen 111 | High |
| RewardBadge | Screen 111 | Medium |
| ResourceStatsRow | Screen 112 | Low |
| FeaturedResourceCard | Screen 112 | Medium |
| ArticleCard (with metrics) | Screen 112 | Medium |
| CourseRow | Screen 112 | Medium |
| SearchBar | Screen 113 | High |
| CategoryPill | Screen 113 | Medium |
| ArticleCardLarge | Screen 113 | Medium |
| FilterChip | Screen 114 | Medium |
| FeaturedCourseCard | Screen 114 | Medium |
| PlayButtonOverlay | Screen 114 | Medium |
| CourseDurationBadge | Screen 114 | Low |

---

## Summary

**Screens Documented**: 5 (110-114)
**Feature Completion**:
- Mindful Hours: 8/8 - COMPLETE
- Mindful Resources: 3/7 - In Progress

**Critical Issues Found**:
- Hannibal Lector instructor name (repeat from earlier batches)

**Medium Issues Found**:
- Data inconsistency: Article counts don't match
- Duplicate course entries
- Truncated category text in filters

**Key Implementation Notes**:
1. Breathing exercise requires complex animation timing
2. Resources feature introduces new light-mode-only screens
3. Course/article cards share similar patterns - good abstraction opportunity
4. Search and filter patterns can be generalized
