# Solace AI Mobile - UI Audit Documentation

## Overview

This directory contains implementation-ready documentation for all UI screens in the Solace AI Mobile application. Each screen has been audited from the design files located in `ui-designs/`.

**App Name**: freud.ai (Solace AI)
**Purpose**: Mental health AI companion mobile application

---

## CRITICAL ISSUES - READ FIRST

**Several design mockups contain inappropriate content that MUST be fixed before implementation.**

See **[CRITICAL-ISSUES.md](./CRITICAL-ISSUES.md)** for full details including:
- Suicidal ideation in placeholder text (Screens 39, 49, 84)
- Crisis alert uses triggering language (Screen 86) - **CLINICAL REVIEW REQUIRED**
- Drug references and profanity in chat titles (Screen 49)
- Violent content and profanity in journal placeholders (Screen 84)
- Harmful messaging for crisis scores (Screen 25)
- Fictional serial killer names as therapists (Screens 53-54, 59)
- AI diagnosing medical conditions (Screen 59) - **LEGAL RISK**
- Multiple typos and data issues

**Do not implement affected screens until design issues are resolved.**

---

## Audit Progress

| Batch | Screens | Status | File |
|-------|---------|--------|------|
| Batch 1 | Splash & Loading (1-4) + Welcome (1) | Complete | [batch-01-splash-loading-welcome.md](./batch-01-splash-loading-welcome.md) |
| Batch 2 | Welcome/Onboarding (2-6) | Complete | [batch-02-welcome-onboarding.md](./batch-02-welcome-onboarding.md) |
| Batch 3 | Sign In & Sign Up (1-4) + Profile Setup (1) | Complete | [batch-03-authentication-profile-start.md](./batch-03-authentication-profile-start.md) |
| Batch 4 | Profile Setup (2-6) | Complete | [batch-04-profile-setup-continued.md](./batch-04-profile-setup-continued.md) |
| Batch 5 | Profile Setup (7-11) | Complete | [batch-05-profile-setup-completion.md](./batch-05-profile-setup-completion.md) |
| Batch 6 | Mental Health Assessment (1-5) | Complete | [batch-06-mental-health-assessment-start.md](./batch-06-mental-health-assessment-start.md) |
| Batch 7 | Mental Health Assessment (6-10) | Complete | [batch-07-mental-health-assessment-continued.md](./batch-07-mental-health-assessment-continued.md) |
| Batch 8 | Mental Health Assessment (11-14) | Complete | [batch-08-mental-health-assessment-final.md](./batch-08-mental-health-assessment-final.md) |
| Batch 9 | Home & Mental Health Score (1-5) | Complete | [batch-09-home-mental-health-score.md](./batch-09-home-mental-health-score.md) |
| Batch 10 | Home & Mental Health Score (6-7) + AI Chatbot (1-3) | Complete | [batch-10-home-completion-chatbot-start.md](./batch-10-home-completion-chatbot-start.md) |
| Batch 11 | AI Chatbot (4-8) | Complete | [batch-11-ai-chatbot-conversations.md](./batch-11-ai-chatbot-conversations.md) |
| Batch 12 | AI Chatbot (9-13) | Complete | [batch-12-ai-chatbot-rich-media.md](./batch-12-ai-chatbot-rich-media.md) |
| Batch 13 | AI Chatbot (14-18) | Complete | [batch-13-ai-chatbot-voice-reports.md](./batch-13-ai-chatbot-voice-reports.md) |
| Batch 14 | AI Chatbot (19-20) + Mood Tracker (1-3) | Complete | [batch-14-ai-chatbot-final-mood-tracker-start.md](./batch-14-ai-chatbot-final-mood-tracker-start.md) |
| Batch 15 | Mood Tracker (4-8) | Complete | [batch-15-mood-tracker-continued.md](./batch-15-mood-tracker-continued.md) |
| Batch 16 | Mood Tracker (9-11) + Journal (1-2) | Complete | [batch-16-mood-tracker-final-journal-start.md](./batch-16-mood-tracker-final-journal-start.md) |
| Batch 17 | Journal (3-7) | Complete | [batch-17-journal-continued.md](./batch-17-journal-continued.md) |
| Batch 18 | Journal (8-9) + Sleep Quality (1-3) | Complete | [batch-18-journal-final-sleep-start.md](./batch-18-journal-final-sleep-start.md) |
| Batch 19 | Sleep Quality (4-8) | Complete | [batch-19-sleep-quality-continued.md](./batch-19-sleep-quality-continued.md) |
| Batch 20 | Sleep Quality (9-10) + Stress Management (1-3) | Complete | [batch-20-sleep-final-stress-start.md](./batch-20-sleep-final-stress-start.md) |
| Batch 21 | Stress Management (4-7) + Mindful Hours (1) | Complete | [batch-21-stress-final-mindful-start.md](./batch-21-stress-final-mindful-start.md) |
| Batch 22 | Mindful Hours (2-6) | Complete | [batch-22-mindful-hours-continued.md](./batch-22-mindful-hours-continued.md) |
| Batch 23 | Mindful Hours (7-8) + Mindful Resources (1-3) | Complete | [batch-23-mindful-hours-final-resources-start.md](./batch-23-mindful-hours-final-resources-start.md) |
| Batch 24 | Mindful Resources (4-7) + Community Support (1) | Complete | [batch-24-resources-final-community-start.md](./batch-24-resources-final-community-start.md) |
| Batch 25 | Community Support (2-6) | Complete | [batch-25-community-support-continued.md](./batch-25-community-support-continued.md) |
| Batch 26 | Community Support (7-10) + Search (1) | Complete | [batch-26-community-final-search-start.md](./batch-26-community-final-search-start.md) |
| ... | ... | ... | ... |

---

## Screen Inventory

### Pre-Auth Flow
- [x] Splash & Loading (4 screens)
- [x] Welcome Screen (6 screens)
- [x] Sign In & Sign Up (4 screens)

### Onboarding Flow
- [x] Profile Setup & Completion (11 screens)
- [x] Mental Health Assessment (14 screens)

### Main App Flow
- [x] Home & Mental Health Score (7 screens)
- [x] AI Therapy Chatbot (20 screens) - COMPLETE
- [x] Mood Tracker (11 screens) - COMPLETE
- [x] Mental Health Journal (9 screens) - COMPLETE
- [x] Sleep Quality (10 screens) - COMPLETE
- [x] Stress Management (7 screens) - COMPLETE
- [x] Mindful Hours (8 screens) - COMPLETE
- [x] Mindful Resources (7 screens - Light mode only) - COMPLETE
- [x] Community Support (10 screens) - COMPLETE
- [ ] Search Screen (5 screens) - 1/5 done
- [ ] Smart Notifications (7 screens)
- [ ] Profile Settings & Help Center (13 screens)
- [ ] Error & Other Utilities (5 screens)

**Total Screens**: ~153

---

## Navigation Map

```
App Launch
    │
    ▼
[Splash] → [LoadingProgress] → [QuoteSplash] → [FetchingData]
    │
    ▼
[Welcome] ─┬─► [Onboarding Flow] → [Profile Setup] → [Assessment] → [Home]
           │
           └─► [Sign In] → [Home]
```

---

## Design System Reference

Source: `ui-designs/Design System and Components/`

| Category | File |
|----------|------|
| Color Palette | Color Palette.png |
| Typography | Typography.png |
| Buttons | Buttons 1.png, Buttons 2.png |
| Inputs | Inputs 1.png, Inputs 2.png |
| Cards & Lists | Cards & Lists 1.png, Cards & Lists 2.png |
| Modals | Modals.png |
| Navigation | Navigations.png |
| Alerts | Alerts & Notifications.png |
| Progress Indicators | Progress & Indicators 1.png, 2.png |
| Chat System | Chat System.png |

---

## Global Color Palette (Identified)

| Name | Hex | Usage |
|------|-----|-------|
| Dark Brown | #1C1410 | Primary dark background |
| Tan/Beige | #C4A574 | Logo, primary buttons, accents |
| Bright Orange | #E8853A | Accent screens, highlights, Onboarding Step 2 |
| Olive Green | #9AAD5C | Secondary accent, Fetching screen |
| Onboarding Green | #6B7B3A | Onboarding Step 1 (Meditation) |
| Gray/Muted | #6B6B6B | Onboarding Step 3 (Journaling) |
| Golden/Mustard | #C4A535 | Onboarding Step 4 (Resources) |
| Purple/Lavender | #7B68B5 | Onboarding Step 5, Community theme, Critical Score |
| White | #FFFFFF | Text on dark, icons |
| Light Gray | TBD | Secondary text |
| Score Green/Teal | #4A9E8C | Healthy Freud Score background |
| Score Orange | #E8853A | Unstable Freud Score background |

---

## Reusable Components Master List

Components identified across all batches that should be built as shared components:

### High Priority (Core)
- [ ] AppLogo
- [ ] PrimaryButton
- [ ] SecondaryButton
- [ ] TextLink
- [ ] TextInput
- [ ] EmailInput
- [ ] PasswordInput
- [ ] FormLabel
- [ ] FormErrorMessage
- [ ] BackButton
- [ ] HeaderWithBack

### Medium Priority (Common)
- [ ] DecorativeCircle
- [ ] QuoteText
- [ ] StatusText
- [ ] ProgressText
- [ ] ProgressBar (segmented)
- [ ] Card
- [ ] ListItem
- [ ] CircleArrowButton
- [ ] StepBadge
- [ ] CurvedHeader
- [ ] SocialLoginButton
- [ ] SocialLoginRow
- [ ] SelectableOptionCard
- [ ] ModalOverlay
- [ ] ModalCard
- [ ] DismissButton
- [ ] CheckboxOption
- [ ] CircularScoreDisplay
- [ ] GradientBackground
- [ ] LoadingTransition

### Lower Priority (Feature-Specific)
- [ ] MascotIllustration
- [ ] FloatingIcon
- [ ] MoodSelector
- [ ] MoodEmojiIcon
- [ ] SparkleDecoration
- [ ] OnboardingContainer
- [ ] OnboardingTitle
- [ ] ContentPanel
- [ ] AssessmentQuestion
- [ ] AvatarCarousel
- [ ] AvatarDisplay
- [ ] UploadButton
- [ ] SwipeIndicator
- [ ] MaskedContact
- [ ] AssessmentHeader
- [ ] SelectableOptionCard (Assessment)
- [ ] GenderCard
- [ ] VerticalScrollPicker
- [ ] HorizontalRulerSlider
- [ ] SemicircularMoodSelector
- [ ] MoodEmoji
- [ ] SegmentedToggle
- [ ] YesNoButtonGroup
- [ ] DetailedOptionCard
- [ ] VerticalSleepSlider
- [ ] SleepLevelRow
- [ ] SleepEmoji
- [ ] GridOptionCard
- [ ] AlphabetNavBar
- [ ] MedicationRow
- [ ] RemovableChip
- [ ] SelectedChipsArea
- [ ] SymptomTagInput
- [ ] Tag
- [ ] SuggestionChip
- [ ] HorizontalNumberSelector
- [ ] LargeNumberDisplay
- [ ] ConcentricCircleVisualizer
- [ ] PhraseDisplay
- [ ] LargeTextInput
- [ ] VoiceInputButton
- [ ] CharacterCounter
- [ ] HomeDashboard
- [ ] UserGreeting
- [ ] MetricCard
- [ ] FreudScoreCard
- [ ] CircularGauge
- [ ] BottomNavigationBar
- [ ] ScoreHistoryEntry
- [ ] StackedBarChart
- [ ] TimelineScrubber
- [ ] WeeklyMoodRow
- [ ] DualHandleSlider
- [ ] SuggestionCard
- [ ] CategoryIcon
- [ ] SwipeActionButton
- [ ] ActivityCard
- [ ] VideoCard
- [ ] BenefitTag
- [ ] MarkCompletedButton
- [ ] SuccessModal
- [ ] RobotMascot
- [ ] SubscriptionBadge
- [ ] UpsellCard
- [ ] SegmentedControl
- [ ] ChatListItem
- [ ] MoodBadge
- [ ] AvatarPattern
- [ ] ConversationSetupForm
- [ ] LLMCheckpointSelector
- [ ] CommunicationStyleSelector
- [ ] TherapyGoalSelector
- [ ] IconSelector
- [ ] PrivacyToggle
- [ ] LimitationCard
- [ ] LimitationCarousel
- [ ] PageIndicator
- [ ] ChatMessageBubble
- [ ] AIMessageBubble
- [ ] UserMessageBubble
- [ ] EmotionBadge
- [ ] TypingIndicator
- [ ] ChatInputBar
- [ ] AttachmentButton
- [ ] MediaCard
- [ ] InlineThumbnail
- [ ] CrisisAlert
- [ ] ProfessionalCard
- [ ] EmergencyResourcesSection
- [ ] CrisisHotline
- [ ] SupportActionButton
- [ ] BookRecommendationCard
- [ ] BookProgressBar
- [ ] BookIcon
- [ ] SleepQualityChart
- [ ] ActionButtonRow
- [ ] DownloadButton
- [ ] FreudScoreLineChart
- [ ] ScoreIndicator
- [ ] CelebrationAnimation
- [ ] CameraPreview
- [ ] FaceDetectionOverlay
- [ ] BiometricIndicator
- [ ] BloodPressureIndicator
- [ ] InstructionBanner
- [ ] CaptureButton
- [ ] ModeToggle
- [ ] AttachedImageCard
- [ ] AnalyzeButton
- [ ] EmotionUpdateBanner
- [ ] RecommendationLink
- [ ] StarburstBackground
- [ ] ExpressionIllustration
- [ ] LightningBoltIcon
- [ ] ActionBar
- [ ] ReadyLabel
- [ ] TranscriptionDisplay
- [ ] ConcentricCirclesAnimation
- [ ] RecordingTimer
- [ ] VoiceMessageCard
- [ ] AudioWaveform
- [ ] PlayButton
- [ ] JournalPreviewCard
- [ ] JournalEntryMini
- [ ] SortDropdown
- [ ] QuoteCard
- [ ] QuotationMarks
- [ ] QuoteText
- [ ] QuoteAttribution
- [ ] SocialButton
- [ ] FileCard
- [ ] FileIcon
- [ ] FileSizeLabel
- [ ] DateLabel
- [ ] AIModelSelector
- [ ] ModelChip
- [ ] BetaBadge
- [ ] CharacterCounter
- [ ] TrashIllustration
- [ ] DangerButton
- [ ] MoodHeroSection
- [ ] LargeMoodEmoji
- [ ] MoodLabel
- [ ] WeeklyMoodChart
- [ ] MoodBar
- [ ] MoodLineChart
- [ ] TimeRangeSelector
- [ ] MoodAnnotation
- [ ] EmojiCalendarRow
- [ ] FloatingActionButton
- [ ] CurvedMoodSlider
- [ ] SliderPoint
- [ ] SegmentedControl
- [ ] MoodHistoryCard
- [ ] DateColumn
- [ ] BiometricRow
- [ ] BottomActionBar
- [ ] SettingsButton
- [ ] EditButton
- [ ] BottomSheet
- [ ] MoodFilterGrid
- [ ] DatePickerButton
- [ ] ToggleSwitch
- [ ] FilterResultsPreview
- [ ] ApplyFilterButton
- [ ] ClearFilterLink
- [ ] StepListContainer
- [ ] StepItem
- [ ] StepCheckbox
- [ ] ExternalLinkButton
- [ ] FreudPointsBadge
- [ ] StreakDisplay
- [ ] ScoreBreakdown
- [ ] JournalStatsRow
- [ ] CalendarGrid
- [ ] DayCell
- [ ] ProgressLabel
- [ ] SummaryText
- [ ] ChartContainer
- [ ] BarChartMulti
- [ ] ChartBar
- [ ] ChartLegend
- [ ] LegendItem
- [ ] WeekSelector
- [ ] JournalTypeCard
- [ ] VoicePromptDisplay
- [ ] AudioWaveformVisualizer
- [ ] TranscriptionDisplay
- [ ] KeywordHighlight
- [ ] RecordingControls
- [ ] RichTextEditor
- [ ] EditorToolbar
- [ ] ColorPickerButton
- [ ] StressSlider
- [ ] EmotionSelectorRow
- [ ] StressorChipList
- [ ] WeekCalendarStrip
- [ ] TimelineView
- [ ] TimelineConnector
- [ ] JournalEntryCard
- [ ] MoodDotIndicator
- [ ] MetadataRow
- [ ] KeywordHighlighter
- [ ] UndoRedoControls
- [ ] JournalToolbar
- [ ] CrisisAlertModal
- [ ] CrisisIllustration
- [ ] EmergencyActionButtons
- [ ] SleepScoreHero
- [ ] DecorativeBackground
- [ ] SleepMetricCard
- [ ] CircularProgressRing
- [ ] GaugeChart
- [ ] FanChartSegment
- [ ] SleepTypeLegend
- [ ] MonthCalendarGrid
- [ ] CalendarDayCell
- [ ] CalendarDateRange
- [ ] SleepHistoryCard
- [ ] QualityBadgePill
- [ ] AISuggestionCard
- [ ] ConcentricCirclesBackground
- [ ] LargePlayButton
- [ ] ScheduleButton
- [ ] TimePickerField
- [ ] RangeSlider
- [ ] DaySelectorChip
- [ ] ToggleRow
- [ ] SleepIllustration
- [ ] TimeBadge
- [ ] SwipeToActionBar
- [ ] DurationBadge
- [ ] MultiRingChart
- [ ] SleepStageCard
- [ ] StageIconBadge
- [ ] TimeRangeSelector
- [ ] SleepTimelineChart
- [ ] IrregularityMarker
- [ ] BottomSheetModal
- [ ] SleepTypeIconSelector
- [ ] StressHeroSection
- [ ] DecorativeShapesOverlay
- [ ] MiniBarChart
- [ ] MiniLineChart
- [ ] StatsCardPair
- [ ] ArcGaugeSelector
- [ ] GaugePoint
- [ ] BubbleSelector
- [ ] StressorBubble
- [ ] ImpactBanner
- [ ] RequirementChecklist
- [ ] RequirementCard
- [ ] CameraPreviewFull
- [ ] FaceDetectionOverlay
- [ ] BiometricBadgePill
- [ ] GridOverlay
- [ ] SuccessIllustration
- [ ] WaveDecoration
- [ ] StressLegend
- [ ] BubbleChart
- [ ] StressBubble
- [ ] PeriodDropdown
- [ ] MindfulHeroSection
- [ ] TotalHoursDisplay
- [ ] SessionCard
- [ ] SoundscapeBadge
- [ ] SessionProgressBar
- [ ] SessionTimeLabels
- [ ] DonutChart
- [ ] DonutSegment
- [ ] CategoryLegend
- [ ] CategoryStatsCard
- [ ] HoursBreakdown
- [ ] PercentageLabel
- [ ] ExerciseWizardContainer
- [ ] WizardStepIndicator
- [ ] GoalSelectionCard
- [ ] GoalIcon
- [ ] GoalDescription
- [ ] RecommendedBadge
- [ ] DurationPicker
- [ ] DurationPreset
- [ ] DurationDisplay
- [ ] SessionLengthLabel
- [ ] TimerVisualizer
- [ ] SoundscapeGrid
- [ ] SoundscapeCard
- [ ] AudioVisualizerBars
- [ ] VolumeWave
- [ ] SoundscapeIcon
- [ ] SoundscapeLabel
- [ ] NowPlayingIndicator
- [ ] SelectedCheckmark
- [ ] BreathingCircle
- [ ] PulsingCircleAnimation
- [ ] PhaseLabel
- [ ] TimerDisplay
- [ ] CycleCounter
- [ ] SoundscapeIndicator
- [ ] ExerciseControls
- [ ] PauseButton
- [ ] StopButton
- [ ] VolumeControl
- [ ] RewindButton
- [ ] FastForwardButton
- [ ] ControlsRow
- [ ] SuccessModal
- [ ] RewardsRow
- [ ] FreudScoreBadge
- [ ] StressLevelBadge
- [ ] CompletionTitle
- [ ] CongratulationsText
- [ ] ConfirmButton
- [ ] ModalCloseButton
- [ ] ResourceStatsRow
- [ ] FeaturedResourceCard
- [ ] ArticleCard
- [ ] ArticleMetrics
- [ ] CourseRow
- [ ] CourseAvatar
- [ ] StarRating
- [ ] ViewCountBadge
- [ ] LessonCountBadge
- [ ] SearchBar
- [ ] CategoryPill
- [ ] CategoryPillsRow
- [ ] ArticleCardLarge
- [ ] ArticleImage
- [ ] ArticleTitle
- [ ] FilterChip
- [ ] FilterChipsRow
- [ ] FeaturedCourseCard
- [ ] CourseBackgroundImage
- [ ] PlayButtonOverlay
- [ ] CourseDurationBadge
- [ ] InstructorLabel
- [ ] CourseMetrics
- [ ] ArticleDetailHeader
- [ ] AuthorRow
- [ ] FollowButton
- [ ] SectionHeaderWithIcon
- [ ] ArticleImageFull
- [ ] ImageCaption
- [ ] SubHeading
- [ ] PremiumPaywall
- [ ] PremiumBadge
- [ ] GoProButton
- [ ] CourseDetailHeader
- [ ] InstructorRow
- [ ] OfflineDownloadRow
- [ ] LessonListHeader
- [ ] LessonRow
- [ ] LessonDuration
- [ ] LessonRating
- [ ] OptionsMenu
- [ ] CircularProgressRing
- [ ] ProgressArc
- [ ] NextLessonCard
- [ ] NextLessonLabel
- [ ] LessonPreviewRow
- [ ] CompletionIllustration
- [ ] RatingPrompt
- [ ] EmojiRatingRow
- [ ] RatingEmoji
- [ ] RateSessionButton
- [ ] CommunityIllustration
- [ ] HandsHeartArtwork
- [ ] WelcomeTitle
- [ ] WelcomeDescription
- [ ] StartPostingButton
- [ ] FooterLinksRow
- [ ] TextLink
- [ ] CommunityHeader
- [ ] UserProfileBadge
- [ ] VerifiedBadge
- [ ] PostCountLabel
- [ ] BrowseBySection
- [ ] FilterPill
- [ ] PostCard
- [ ] PostAuthorRow
- [ ] UserBadge
- [ ] TimestampLabel
- [ ] PostText
- [ ] HashtagLink
- [ ] PostImage
- [ ] EngagementRow
- [ ] ViewCount
- [ ] LikeCount
- [ ] ShareButton
- [ ] CategoryGrid
- [ ] CategoryCard
- [ ] ComposerCard
- [ ] MultilineTextInput
- [ ] InputToolbar
- [ ] CameraButton
- [ ] MicButton
- [ ] EmojiButton
- [ ] PostTypePill
- [ ] MetricIcon
- [ ] PrivacyToggle
- [ ] SaveDraftButton
- [ ] TimeFilterTabs
- [ ] TimeTab
- [ ] NotificationSection
- [ ] NotificationRow
- [ ] NotificationAvatar
- [ ] NotificationTitle
- [ ] NotificationSubtitle
- [ ] BottomSheet
- [ ] BottomSheetHeader
- [ ] HelpIconButton
- [ ] DatePickerField
- [ ] RangeSlider
- [ ] SliderTrack
- [ ] SliderHandle
- [ ] SliderLabel
- [ ] ApplyFilterButton
- [ ] FilterCountBadge
- [ ] ProfileHeader
- [ ] LargeAvatar
- [ ] MessageButton
- [ ] StatsRow
- [ ] StatItem
- [ ] LocationRow
- [ ] BioSection
- [ ] ContentTabs
- [ ] TabButton
- [ ] ConfirmationModal
- [ ] CancelButton
- [ ] ConfirmDeleteButton
- [ ] ChatHeader
- [ ] ChatLimitBadge
- [ ] GlobalSearchBar
- [ ] FreudLogoSpinner

---

## Implementation Order (Recommended)

1. **Phase 1**: Design System Setup
   - Colors, typography, spacing constants
   - Base components (buttons, inputs, links)

2. **Phase 2**: Pre-Auth Flow
   - Splash screens
   - Welcome/onboarding screens
   - Sign in/sign up screens

3. **Phase 3**: Profile Setup
   - Profile completion flow
   - Mental health assessment

4. **Phase 4**: Core Features
   - Home screen
   - AI Chatbot
   - Mood Tracker

5. **Phase 5**: Secondary Features
   - Journal, Sleep, Stress features
   - Community, Notifications
   - Settings

---

## How to Use This Documentation

1. **For Developers**: Each screen document provides:
   - Complete UI hierarchy
   - Component breakdown with props
   - State requirements
   - Navigation specifications
   - Implementation steps

2. **For QA**: Use the UI States & Edge Cases section to create test cases

3. **For Project Managers**: Use the Open Issues sections to track design clarifications needed

---

## Document Structure (Per Screen)

Each screen follows this structure:
1. Purpose
2. UI Structure (Visual Only)
3. Component List
4. Responsibility Split (UI vs Logic)
5. State Definition
6. Data Models
7. Navigation
8. UI States & Edge Cases
9. Implementation Breakdown
10. Open Issues
