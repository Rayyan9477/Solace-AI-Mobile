# Solace AI Mobile — React Native Implementation Specs

**8 priority screens** for the RN Expo build (SDK 54, RN 0.81, React Navigation v6, Reanimated v4).

Generated from the prototype via the `mobile-developer` agent. Use alongside `SCREENS.md` (design intent) for a complete implementation package.

---

## Shared Patterns

### Theme Access

All screens consume the project's existing theme barrel. Never import from sub-paths when the token already lives in the barrel.

```ts
import {
  palette, colors, spacing, borderRadius,
  typeScale, gradients, getGradientProps, animations,
} from '@/shared/theme';
```

Fraunces is not yet loaded via `expo-font` — add it once in `app/_layout.tsx` (or `App.tsx`):

```ts
import { useFonts } from 'expo-font';
const [fontsLoaded] = useFonts({
  'Fraunces-Regular':  require('@/assets/fonts/Fraunces-Regular.ttf'),
  'Fraunces-SemiBold': require('@/assets/fonts/Fraunces-SemiBold.ttf'),
  'Fraunces-Italic':   require('@/assets/fonts/Fraunces-Italic.ttf'),
  'FiraCode-Regular':  require('@/assets/fonts/FiraCode-Regular.ttf'),
});
```

Use via `fontFamily: 'Fraunces-SemiBold'` in `StyleSheet`. System sans (`Inter`/SF Pro/Roboto) needs no load step.

### Spacing Utility

```ts
import { spacing } from '@/shared/theme';
// usage: s(2) === spacing.sm (8), s(3) === spacing.md (12)
const s = (multiplier: number) => spacing.sm * multiplier;
```

### Haptic Feedback Helper

Create once at `src/shared/utils/haptics.ts`:

```ts
import * as Haptics from 'expo-haptics';
export const haptic = {
  light:    () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  medium:   () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  heavy:    () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  success:  () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  warning:  () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  error:    () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  select:   () => Haptics.selectionAsync(),
};
```

### Reanimated v4 Preamble

Reanimated v4 ships `useSharedValue`, `useAnimatedStyle`, `withSpring`, `withTiming`, `withRepeat`, `withSequence` from `react-native-reanimated`. Worklet directive `'worklet'` still required inside animated callbacks.

Spring defaults used across these screens:

```ts
const SPRING_SNAPPY = { damping: 18, stiffness: 300 };
const SPRING_GENTLE = { damping: 22, stiffness: 180 };
const SPRING_BOUNCE = { damping: 12, stiffness: 250 };
```

### Gradient Wrapper

```ts
import { LinearGradient } from 'expo-linear-gradient';
import { getGradientProps } from '@/shared/theme';
// <LinearGradient {...getGradientProps('darkHero')} style={styles.hero} />
```

### Safe Area + Status Bar

```ts
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
// Immersive screens: <StatusBar style="light" />
// Use insets.top for header padding, insets.bottom for CTA row padding.
```

---

## Priority Screen 1 — Home v2 (Emotional Check-in Hero)

**File:** `src/features/dashboard/screens/HomeV2Screen.tsx`
**Supporting:** `hooks/useHomeData.ts`, `components/CheckInHeroCard.tsx`, `components/QuickActionRail.tsx`

### Data Shape

```ts
interface HomeV2Props {
  navigation: NativeStackNavigationProp<DashboardStackParamList, 'HomeV2'>;
}

interface HomeData {
  userName: string;
  greeting: string;
  checkInMood: MoodLevel | null;
  solaceScore: number;        // 0-100
  streak: number;
  quickActions: QuickAction[];
  recentInsight: string;
}

type MoodLevel = 1 | 2 | 3 | 4 | 5;
```

### Component Tree

```
HomeV2Screen (SafeAreaView, bg: palette.midnight[950])
  StatusBar style="light"
  ScrollView
    HomeHeader (AvatarButton, greeting, NotificationBell with badge)
    CheckInHeroCard (LinearGradient, "How are you right now?")
      MoodFaceRow (5 mood faces as radio group)
      SelectedMoodLabel (animated in on select)
    SolaceScoreCard (score, mini progress bar, streak)
    QuickActionRail (horizontal ScrollView, 4 chips)
    RecentInsightCard (italic Fraunces, bg: midnight[800])
```

### Animations

```ts
// Hero card entrance
heroScale.value = withSpring(1, SPRING_GENTLE);
heroOpacity.value = withTiming(1, { duration: 200 });

// Mood face press feedback
faceScale.value = withSpring(0.88, SPRING_SNAPPY); // pressIn
faceScale.value = withSpring(1, SPRING_BOUNCE);    // pressOut

// Label slide-up on select
labelTranslateY.value = withSpring(0);
labelOpacity.value = withTiming(1);
```

### Accessibility

- `accessibilityRole="radiogroup"` on MoodFaceRow
- Each MoodFace: `accessibilityRole="radio"`, `accessibilityLabel="Mood level N: MoodName"`, `accessibilityState={{selected}}`
- SolaceScore: `accessibilityLabel="Your Solace score is 72 out of 100"`
- NotificationBell: `accessibilityLabel="Notifications, 3 unread"`

### Platform Notes

- iOS: `haptic.select()` on each MoodFace press
- Android: same via haptic util (graceful degrade)
- iOS safe area top: `insets.top + spacing.lg`
- Android status bar: `StatusBar translucent=false`

### Performance

- ScrollView OK (<10 items, no FlatList needed)
- `React.memo` on `CheckInHeroCard` (gradient is expensive)
- `useMemo` for greeting string (only recomputes on mount)

---

## Priority Screen 2 — Daily Check-in

**File:** `src/features/mood/screens/DailyCheckInScreen.tsx`
**Supporting:** `hooks/useCheckIn.ts`, `components/MoodFaceScale.tsx`, `components/InfluenceTagGrid.tsx`

### Data Shape

```ts
interface CheckInState {
  selectedMood: MoodLevel | null;
  selectedTags: Set<string>;
  note: string;
  isSubmitting: boolean;
}

// 8 influence tags: sleep, exercise, nutrition, social, work, stress, weather, medication
interface InfluenceTag {
  id: string;
  label: string;
  icon: string;
  category: 'positive' | 'neutral' | 'negative';
}
```

### Component Tree

```
DailyCheckInScreen (SafeAreaView, bg: palette.midnight[950])
  KeyboardAvoidingView (behavior: 'padding' iOS, 'height' Android)
    ScrollView
      BackButton
      Title ("How are you today?", typeScale.h2, Fraunces-SemiBold)
      MoodFaceScale (row of 5 Pressables, 60x60)
      InfluenceTagGrid (flexWrap View, 8 pills)
      NoteTextInput (multiline, 4 lines)
      SubmitButton (full-width, borderRadius.pill)
```

### Animations

```ts
// Big mood face pulse on select
selectedScale.value = withSequence(
  withSpring(1.18, SPRING_BOUNCE),
  withSpring(1, SPRING_SNAPPY)
);

// Tag toggle color interpolation
animatedTagStyle: backgroundColor interpolateColor(tagBg.value, [0,1],
  [palette.midnight[800], palette.sage[500] + '33'])
```

### Accessibility

- MoodFaceButton: `accessibilityRole="radio"`, `accessibilityState={{checked}}`
- InfluenceTag: `accessibilityRole="checkbox"`
- SubmitButton: `accessibilityState={{disabled, busy}}`

### Platform Notes

- iOS: `haptic.select()` on mood face, `haptic.success()` on submit
- Android: `haptic.light()` on mood face, `haptic.medium()` on submit

---

## Priority Screen 3 — AI Chat (CBT Mode)

**File:** `src/features/chat/screens/ActiveChatScreen.tsx`
**Supporting:** `components/TypingIndicator.tsx`, `components/ReactionChipBar.tsx`, `components/EmbeddedActionCard.tsx`, `hooks/useChatMode.ts`

### Data Shape

```ts
type ChatMode = 'general' | 'cbt' | 'mindfulness' | 'sleep';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'action_card' | 'date_divider';
  content?: string;
  timestamp?: Date;
  reactions?: ReactionData[];
  actionCard?: ActionCardData;
}
```

### Component Tree

```
ActiveChatScreen (flex:1, bg: palette.midnight[950])
  ChatHeader (BackButton, AvatarCircle, Title, CBTModeToggle)
  ChatModeBar (horizontal ScrollView, 4 mode chips)
  KeyboardAvoidingView
    FlatList (inverted, data: messages)
      UserMessageBubble (peach gradient, borderRadius.tr-sm)
      AIMessageBubble (glass, borderRadius.tl-sm)
        ReactionChipBar
      EmbeddedActionCard (gradient border)
      TypingIndicator (3 animated dots)
    ChatInputRow (TextInput, Attach, Send)
```

### Animations

```ts
// Typing dots (staggered)
withRepeat(withSequence(
  withTiming(-6, { duration: 300 }),
  withTiming(0, { duration: 300 })
), -1); // with delay(i * 150)

// New message entrance
entering={FadeInDown.duration(300).springify()}

// Action card entrance
entering={SlideInLeft.duration(350).springify()}
```

### Accessibility

- FlatList: `accessibilityRole="list"`
- AIMessageBubble: `accessibilityLiveRegion="polite"` (new messages announced)
- TypingIndicator: `accessibilityRole="status"`, `accessibilityLiveRegion="assertive"`

### Performance

- FlatList mandatory: `windowSize={10}`, `maxToRenderPerBatch={15}`, `removeClippedSubviews={true}` (Android only)
- `React.memo` all message bubbles
- Stable `keyExtractor` (message.id)

---

## Priority Screen 4 — Meditation Player

**File:** `src/features/mindful/screens/MeditationPlayerScreen.tsx`
**Supporting:** `hooks/useMeditationPlayer.ts`, `components/CosmicArtwork.tsx`, `components/GradientProgressBar.tsx`, `components/TransportControls.tsx`

### Data Shape

```ts
interface MeditationTrack {
  id: string;
  title: string;
  category: string;
  durationSeconds: number;
  artworkUri: string | null;
  cosmicColors: [string, string, string];
}

interface PlayerState {
  isPlaying: boolean;
  elapsedSeconds: number;
  isShuffle: boolean;
  isRepeat: boolean;
  volume: number;
}
```

### Component Tree

```
MeditationPlayerScreen (flex:1)
  LinearGradient (cosmic bg, full-screen)
  StatusBar style="light" translucent={true}
  SafeAreaView
    BackButton / OptionsButton
    CosmicArtwork (240x240, pulsing when playing, concentric rings)
    CategoryLabel / TrackTitle
    GradientProgressBar (sage → aurora)
    TransportControls (Shuffle, SkipBack, PlayPause 72x72, SkipForward, Repeat)
    VolumeSlider
```

### Animations

```ts
// Artwork pulse when playing
artworkScale.value = withRepeat(withSequence(
  withTiming(1.04, { duration: 2000 }),
  withTiming(1, { duration: 2000 })
), -1, true);

// Progress bar
progressWidth.value = withTiming(newVal, { duration: 950 });

// Play/pause press
playScale.value = withSpring(0.92, SPRING_SNAPPY); // pressIn
playScale.value = withSpring(1, SPRING_BOUNCE);    // pressOut
```

### Platform Notes

- iOS: `expo-av` `Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: true })`
- Android: `FOREGROUND_SERVICE` + `WAKE_LOCK` permissions in `app.json`
- Gradient progress bar: `LinearGradient` inside `overflow:hidden` View + animated child

### Performance

- Don't re-render entire screen on each elapsed-second tick — isolate progress bar in its own component
- Use `expo-image` not RN `Image` (better caching + blurHash)

---

## Priority Screen 5 — Assessment Results

**File:** `src/features/assessment/screens/AssessmentResultsScreen.tsx`
**Supporting:** `components/ScoreRing.tsx`, `components/BreakdownBar.tsx`, `components/RecommendationCard.tsx`

### Data Shape

```ts
interface AssessmentResult {
  score: number;              // 0-100
  category: 'healthy' | 'unstable' | 'critical';
  breakdown: BreakdownItem[]; // exactly 4 items
  recommendations: Recommendation[];
  completedAt: Date;
}

interface BreakdownItem {
  label: string;   // "Anxiety", "Mood", "Sleep", "Stress"
  score: number;
  color: string;
  trend: 'up' | 'down' | 'stable';
}
```

### Component Tree

```
AssessmentResultsScreen (bg: palette.midnight[950])
  ScrollView
    ResultsHeader (row)
    ScoreRing (200x200, SVG Circle + animated stroke-dashoffset)
    CategoryBadge (pill)
    BreakdownSection (4 animated bars, staggered)
    RecommendationCards (3 cards, FadeInUp staggered)
    CTARow ("Talk to Solace" / "Go Home")
```

### Animations

```ts
// SVG ring draw
const circumference = 2 * Math.PI * 88;
dashOffset.value = withTiming(
  circumference * (1 - score / 100),
  { duration: 1200, easing: Easing.out(Easing.cubic) }
);

// Score count-up
displayScore.value = withTiming(score, { duration: 1100 });

// Breakdown bars staggered
bar[i].width = withDelay(i * 150, withSpring(targetWidth, SPRING_GENTLE));

// Cards stagger
entering={FadeInUp.delay(i * 100).springify()}
```

### Accessibility

- ScoreRing: `accessibilityRole="progressbar"`, `accessibilityValue={{min:0, max:100, now:score}}`
- BreakdownBar: same pattern
- Wrap with `accessibilityLiveRegion="polite"` so score is announced on mount

### Platform Notes

- `react-native-svg` required (~15.x)
- Haptic on ring completion: iOS `haptic.success()`, Android `haptic.medium()` at 1.2s delay

---

## Priority Screen 6 — Journal Composer

**File:** `src/features/journal/screens/JournalComposerScreen.tsx`
**Supporting:** `hooks/useJournalComposer.ts`, `components/MoodStrip.tsx`, `components/WritingPromptBanner.tsx`, `components/HashtagChipInput.tsx`, `components/ComposerToolbar.tsx`

### Data Shape

```ts
interface JournalEntry {
  id: string | null;
  title: string;
  body: string;             // markdown string
  mood: MoodLevel | null;
  hashtags: string[];
  writingPrompt: string | null;
  createdAt: Date;
}

// NOTE: RN TextInput doesn't support native rich text.
// Track formatting state in markdown string, render preview
// with react-native-markdown-display in detail screen.
```

### Component Tree

```
JournalComposerScreen (bg: palette.midnight[950])
  KeyboardAvoidingView
    ComposerHeader (back, title, Save button)
    ScrollView (keyboardShouldPersistTaps="handled")
      MoodStrip (horizontal, 5 pills)
      WritingPromptBanner (dismissible)
      TitleTextInput (typeScale.h4, Fraunces-SemiBold)
      BodyTextInput (multiline, flex:1, minHeight: 200)
      HashtagChipInput (flexWrap View, TextInput for new tags)
    ComposerToolbar (absolute bottom, 6 format buttons)
```

### Animations

```ts
// Writing prompt dismiss
bannerHeight.value = withTiming(0, { duration: 250 });
bannerOpacity.value = withTiming(0, { duration: 200 });

// Mood pill selection
pillScale.value = withSequence(
  withSpring(0.9, SPRING_SNAPPY),
  withSpring(1, SPRING_BOUNCE)
);

// Hashtag chip enter/exit
entering={ZoomIn.duration(200)}
exiting={ZoomOut.duration(150)}
```

### Platform Notes

- iOS: Keyboard.addListener('keyboardWillShow') + animate toolbar `bottom` smoothly
- Android: `KeyboardAvoidingView behavior="height"` + toolbar `position: 'relative'`
- Android TextInput multiline: `textAlignVertical="top"`, explicit `paddingTop`

### Performance

- Use `useRef` for title/body values, sync to state only on blur (avoid re-render every keystroke)
- `React.memo` on `ComposerToolbar`

---

## Priority Screen 7 — Sleep Log Entry

**File:** `src/features/sleep/screens/SleepLogEntryScreen.tsx`
**Supporting:** `hooks/useSleepLog.ts`, `components/NightSkyBackground.tsx`, `components/TimeCard.tsx`, `components/QualitySlider.tsx`, `components/FeelingTagGrid.tsx`

### Data Shape

```ts
interface SleepLogEntry {
  bedtime: Date;
  wakeTime: Date;
  durationMinutes: number;    // computed
  quality: number;            // 1-10
  feelingTags: string[];
  notes: string;
}

// 8 feeling tags: rested, groggy, tired, refreshed, anxious, peaceful, restless, energized
```

### Component Tree

```
SleepLogEntryScreen (flex:1)
  NightSkyBackground (position: absolute, full-screen)
    LinearGradient (['#0A0614','#1a1035','#2d1b4e'])
    StarField (12 animated + 18 static dots)
  SafeAreaView
    KeyboardAvoidingView
      ScrollView
        LogHeader
        DurationHero ("7h 32m", typeScale.display3, Fraunces-SemiBold)
        TimeCardsRow (Bedtime + WakeTime, opens DateTimePicker)
        QualitySlider (custom, 1-10 with live label)
        FeelingTagGrid (8 pills)
        NotesTextInput (multiline, 3 lines)
        SaveButton (bg: palette.lavender[500])
```

### Animations

```ts
// Starfield twinkle (max 12 animated for perf)
withRepeat(withSequence(
  withTiming(0.2, { duration: 1500 + Math.random()*1000 }),
  withTiming(1, { duration: 1500 + Math.random()*1000 })
), -1, true);

// Duration count-up
displayMinutes.value = withTiming(durationMinutes,
  { duration: 800, easing: Easing.out(Easing.quad) });

// Quality thumb scale on drag
thumbScale.value = withSpring(1.3, SPRING_BOUNCE); // onSlidingStart
thumbScale.value = withSpring(1, SPRING_SNAPPY);   // onSlidingComplete
```

### Platform Notes

- iOS: `@react-native-community/datetimepicker` in modal (`display="spinner"`) inside bottom sheet
- Android: same library, `display="clock"`
- Starfield: seeded random via `useMemo` so stars don't shuffle on re-render

### Performance

- Max 12 animated stars (18 static)
- `@react-native-community/slider` is native — no JS overhead during drag
- `React.memo` on `NightSkyBackground` (never changes after mount)

---

## Priority Screen 8 — Paywall (Solace Plus)

**File:** `src/features/profile/screens/PaywallScreen.tsx`
**Supporting:** `hooks/useSubscription.ts`, `components/PlanCard.tsx`, `components/FeatureListItem.tsx`

### Data Shape

```ts
type PlanId = 'annual' | 'monthly';

interface Plan {
  id: PlanId;
  label: string;
  price: string;              // from store metadata
  monthlyEquivalent: string;
  badge?: string;
  isFeatured: boolean;
}

interface PaywallFeature {
  id: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  color: string;
}
```

### Component Tree

```
PaywallScreen (modal, flex:1, bg: palette.midnight[950])
  SafeAreaView
    ScrollView
      DismissButton (top-right)
      HeroSection (LinearGradient, "Solace Plus" + Sparkles icon)
      FeatureList (5 feature rows with accent colors)
      PlanCardsRow (2 cards: Annual featured + Monthly)
        AnimatedCheckmark on selected card
      TrialBanner ("Start your 7-day free trial")
      CTAButton (full-width, palette.peach[500])
      RestoreLink
      LegalText (tiny)
```

### Animations

```ts
// Hero entrance
entering={FadeInDown.duration(400).springify()}

// Feature stagger
entering={FadeInLeft.delay(i * 80).duration(300)}

// Plan card selection
cardSelected.value = withTiming(isSelected ? 1 : 0, { duration: 200 });
// borderColor + backgroundColor interpolateColor

// Checkmark scale in
checkScale.value = withSpring(1, SPRING_BOUNCE);
```

### Platform Notes

- iOS: `expo-in-app-purchases` or RevenueCat for StoreKit
- Android: same library → Google Play Billing
- iOS: modal presentation with grab handle (4x32dp pill at top)
- Android: `animation: 'slide_from_bottom'` in screenOptions
- Never hardcode prices — fetch from store product metadata

### Performance

- ScrollView OK (no lists)
- Pre-render ActivityIndicator with `opacity:0`, animate to 1 on `isPurchasing` (prevents layout shift)

---

## File Creation Summary

| Screen | Primary File | Hook | Components |
|---|---|---|---|
| Home V2 | `src/features/dashboard/screens/HomeV2Screen.tsx` | `useHomeData` | CheckInHeroCard, QuickActionRail |
| Daily Check-in | `src/features/mood/screens/DailyCheckInScreen.tsx` | `useCheckIn` | MoodFaceScale, InfluenceTagGrid |
| AI Chat | `src/features/chat/screens/ActiveChatScreen.tsx` (extend) | `useChatMode` | TypingIndicator, ReactionChipBar, EmbeddedActionCard |
| Meditation Player | `src/features/mindful/screens/MeditationPlayerScreen.tsx` | `useMeditationPlayer` | CosmicArtwork, GradientProgressBar, TransportControls |
| Assessment Results | `src/features/assessment/screens/AssessmentResultsScreen.tsx` (extend) | — | ScoreRing, BreakdownBar, RecommendationCard |
| Journal Composer | `src/features/journal/screens/JournalComposerScreen.tsx` | `useJournalComposer` | MoodStrip, WritingPromptBanner, HashtagChipInput, ComposerToolbar |
| Sleep Log Entry | `src/features/sleep/screens/SleepLogEntryScreen.tsx` | `useSleepLog` | NightSkyBackground, TimeCard, QualitySlider, FeelingTagGrid |
| Paywall | `src/features/profile/screens/PaywallScreen.tsx` | `useSubscription` | PlanCard, FeatureListItem |

**Shared additions:**
- `src/shared/utils/haptics.ts` (helper)
- Font loading in `app/_layout.tsx`

**Stack registration changes:**
- `DashboardStack.tsx`: add `HomeV2` route
- `MoodStack.tsx`: add `DailyCheckIn` (or replace `MoodSelector`)
- `MindfulStack.tsx`: add `MeditationPlayer` with `presentation: 'fullScreenModal'`
- `SleepStack.tsx`: add `SleepLogEntry`
- Any stack: add `Paywall` with `presentation: 'modal'`

---

## Recommended Build Order

1. **Font loading + haptic util** (1 commit, unblocks everything)
2. **Home v2** (sets emotional tone — most impactful first impression)
3. **Daily Check-in** (core daily ritual)
4. **AI Chat** (therapy engine, most complex animations)
5. **Meditation Player** (immersive reference for gradient + transport pattern)
6. **Assessment Results** (SVG animation reference — ScoreRing is reused)
7. **Journal Composer** (rich text handling reference)
8. **Sleep Log** (night sky + slider patterns)
9. **Paywall** (last; StoreKit integration and review cycle)

Each screen should ship with its components, hook, and Storybook stories together.
