# Solace AI Mobile - UI Audit Documentation

## Overview

This directory contains implementation-ready documentation for all UI screens in the Solace AI Mobile application. Each screen has been audited from the design files located in `ui-designs/`.

**App Name**: freud.ai (Solace AI)
**Purpose**: Mental health AI companion mobile application

---

## CRITICAL ISSUES - READ FIRST

**Several design mockups contain inappropriate content that MUST be fixed before implementation.**

See **[CRITICAL-ISSUES.md](./CRITICAL-ISSUES.md)** for full details including:
- Suicidal ideation in placeholder text (Screens 39, 49)
- Drug references and profanity in chat titles (Screen 49)
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
- [ ] Mood Tracker (11 screens) - 8/11 done
- [ ] Mental Health Journal (9 screens)
- [ ] Sleep Quality (10 screens)
- [ ] Stress Management (7 screens)
- [ ] Mindful Hours (8 screens)
- [ ] Mindful Resources (7 screens - Light mode only)
- [ ] Community Support (10 screens)
- [ ] Search Screen (5 screens)
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
