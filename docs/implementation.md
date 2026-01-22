# Solace AI Mobile - Complete UI Implementation Plan

**Goal:** Build the complete UI for freud.ai mental health app - 158 screens across 32 batches, following atomic design patterns with TDD approach.

**Architecture:** Feature-based module structure with shared atomic components (atoms/molecules/organisms). UI-only implementation using placeholder data - no backend logic. Dark mode first, accessibility-first design.

**Tech Stack:** React Native 0.76.9, Expo SDK 52, TypeScript 5.3, React Navigation 6, Redux Toolkit, React Native Reanimated 3.16, Jest + React Testing Library

---

## Table of Contents

1. [Critical Blockers](#critical-blockers)
2. [MCP Servers & Resources](#mcp-servers--resources)
3. [Implementation Rules](#implementation-rules)
4. [Phase 0: Prerequisites](#phase-0-prerequisites)
5. [Phase 1: Design System Foundation](#phase-1-design-system-foundation)
6. [Phase 2: Core Component Library](#phase-2-core-component-library)
7. [Phase 3: Feature Screens](#phase-3-feature-screens)
8. [Phase 4: Navigation Integration](#phase-4-navigation-integration)
9. [Phase 5: Testing & Quality](#phase-5-testing--quality)
10. [Phase 6: Safety-Critical Screens](#phase-6-safety-critical-screens)
11. [Verification Checklists](#verification-checklists)
12. [Summary & Metrics](#summary--metrics)

---

## MCP Servers & Resources

### 📦 Complete Toolkit Guide

**IMPORTANT**: Before starting implementation, review the comprehensive toolkit:

📄 **[TOOLS-AND-RESOURCES.md](./TOOLS-AND-RESOURCES.md)** - Full guide with:
- **MCP Servers**: Expo, React Native Dev, React Native Upgrader, Context7, Exa
- **Component Libraries**: GlueStack UI, React Native Paper, Shopify Restyle, NativeWind
- **Chart Libraries**: react-native-gifted-charts (CRITICAL for mood/sleep tracking)
- **Forms**: React Hook Form + Zod (type-safe validation)
- **State Management**: Zustand for UI state
- **Animation**: Moti (simplified Reanimated DSL)
- **Testing**: React Native Owl, eslint-plugin-react-native-a11y
- **VS Code Extensions**: 10 essential extensions for React Native
- **Build Tools**: EAS, Metro, Bundle Visualizer, Storybook
- **50+ Package Recommendations** with installation priorities

### ✅ Packages Installed (HIGH PRIORITY)

The following packages have been installed and are ready to use:
```bash
# Core component library + forms + charts ✓ INSTALLED
@gluestack-ui/themed @gluestack-ui/config @gluestack-style/react
react-hook-form zod @hookform/resolvers
react-native-gifted-charts
zustand @shopify/restyle

# Dev tools ✓ INSTALLED
eslint-plugin-react-native-a11y
eslint-plugin-react-native
```

**Remember to use these tools throughout implementation!**

### Required MCP Servers

| Server | Purpose | Configuration |
|--------|---------|---------------|
| **Expo MCP** | Native Expo integration | `npx expo-mcp-server` |
| **React Native Dev MCP** | Component analysis, debugging | `@mrnitro360/react-native-mcp` |
| **Context7** | Documentation queries | Pre-configured |
| **Exa** | Code examples | Pre-configured |

### MCP Usage Rules

1. **Before every component**: Query Context7 for latest React Native/Expo patterns
2. **For complex UI**: Use Exa to find production-grade examples
3. **Navigation setup**: Query Context7 for React Navigation v6 patterns
4. **Animations**: Query Exa for react-native-reanimated examples
5. **Forms**: Query Context7 for react-hook-form patterns

### Example MCP Queries

- For Button: `"React Native custom button component TypeScript accessibility"`
- For Navigation: `"React Navigation v6 TypeScript stack navigator bottom tabs"`
- For Charts: `"react native chart visualization mood tracker health app"`
- For Crisis Modal: `"React Native modal accessibility alert critical"`

---

## Implementation Rules

### Rule 1: UI Only - No Logic
- Components receive data via props
- No API calls, no business logic
- Use hardcoded placeholder data
- State only for UI interactions (modals, tabs, animations)

### Rule 2: Atomic Design Pattern

```
src/shared/components/
├── atoms/       → Single-purpose primitives (Button, Input, Badge)
├── molecules/   → Composed from atoms (Header, Card, FormField)
├── organisms/   → Complex feature components (ChatBubble, MoodSelector)
├── templates/   → Screen layouts (no data)
└── index.ts     → Barrel exports
```

### Rule 3: Component API Standards

Every component MUST have these props:
- `testID?: string` - For testing
- `accessibilityLabel?: string` - For a11y
- `style?: StyleProp<ViewStyle>` - For customization

Export pattern: Named export for component + type export for props

### Rule 4: File Naming Convention

```
ComponentName/
├── index.ts              # Re-exports
├── ComponentName.tsx     # Main component
├── ComponentName.types.ts # TypeScript interfaces
├── ComponentName.styles.ts # Styles (optional)
└── ComponentName.test.tsx # Tests
```

### Rule 5: Theme Integration
- Always use theme values from `useTheme()` hook
- Never hardcode colors, spacing, or typography values
- Use semantic color names (background, surface, text)

### Rule 6: Accessibility Requirements
- Every interactive element needs `accessibilityLabel`
- Every image needs `accessibilityRole="image"` + `accessible` prop
- Minimum touch target: 44x44 points
- Support for screen readers
- Crisis modals: `accessibilityRole="alert"` + `accessibilityLiveRegion="assertive"`

### Rule 7: Dark Mode First
- All designs are dark mode (from UI audit)
- Build dark mode first, light mode later
- Use semantic color names (background, surface, text)

### Rule 8: TDD Workflow
1. Write failing test
2. Run test (expect FAIL)
3. Write minimal implementation
4. Run test (expect PASS)
5. Commit with descriptive message

---

## Phase 0: Prerequisites


---

### Sprint 0.1: Development Environment Setup

#### Task 0.1.1: Install Required Dependencies

**New packages to install:**
- `@gorhom/bottom-sheet@^5.0.0` - Modal/sheet components
- `react-native-calendars@^1.1305.0` - Date components
- `react-native-chart-kit@^6.12.0` - Visualizations
- `react-native-markdown-display@^7.0.0` - Rich text

**Verification:**
- Run `npx expo install --check` - All packages compatible
- Run `npx tsc --noEmit` - No TypeScript errors

---

## Phase 1: Design System Foundation

### Sprint 1.1: Theme Extension

#### Task 1.1.1: Add Shadow Tokens

**Files:**
- Create: `src/shared/theme/shadows.ts`
- Create: `src/shared/theme/__tests__/shadows.test.ts`

**Required exports:**
- `shadows` - Object with levels: `none`, `sm`, `md`, `lg`, `xl`
- `applyShadow(level)` - Cross-platform shadow utility function

**Each shadow level must have:**
- `shadowColor`
- `shadowOffset: { width, height }`
- `shadowOpacity`
- `shadowRadius`
- `elevation` (for Android)

---

#### Task 1.1.2: Add Gradient Definitions

**Files:**
- Create: `src/shared/theme/gradients.ts`
- Create: `src/shared/theme/__tests__/gradients.test.ts`

**Required exports:**
- `gradients` - Object with presets: `morning`, `calming`, `energizing`, `grounding`, `therapeutic`, `crisis`
- `getGradientProps(preset)` - Returns expo-linear-gradient compatible props
- Type: `GradientPreset`, `GradientConfig`

**Each gradient must have:**
- `colors: string[]` - Array of hex colors (min 2)
- `direction: 'vertical' | 'horizontal' | 'diagonal'`
- `locations?: number[]` - Optional color stops

---

#### Task 1.1.3: Add Animation Timings

**Files:**
- Create: `src/shared/theme/animationTimings.ts`
- Create: `src/shared/theme/__tests__/animationTimings.test.ts`

**Required exports:**
- `animations.duration` - Object with: `instant` (100ms), `fast` (200ms), `normal` (300ms), `slow` (500ms), `therapeutic` (800ms), `breathing` (4000ms)
- `animations.stagger` - Object with: `fast`, `normal`, `slow`
- `easings` - Object with Reanimated easing curves: `easeIn`, `easeOut`, `easeInOut`, `gentle`, `calming`
- `easings.spring` - Spring animation config
- `easings.therapeuticSpring` - Gentle spring for calming animations
- `animationPresets` - Pre-configured animation objects: `fadeIn`, `slideUp`, `scalePress`, `breathingCircle`

---

#### Task 1.1.4: Add Z-Index Scale

**Files:**
- Create: `src/shared/theme/zIndex.ts`
- Create: `src/shared/theme/__tests__/zIndex.test.ts`

**Required exports:**
- `zIndex` - Object with levels:
  - `base: 0`
  - `dropdown: 100`
  - `sticky: 200`
  - `fixed: 300`
  - `modalBackdrop: 400`
  - `modal: 500`
  - `popover: 600`
  - `tooltip: 700`
  - `toast: 800`
  - `crisis: 1000` (HIGHEST - crisis alerts must never be covered)

---

#### Task 1.1.5: Update Theme Index Exports

**Files:**
- Modify: `src/shared/theme/index.ts`

**Add exports for:**
- `shadows`, `applyShadow` from `./shadows`
- `gradients`, `getGradientProps`, `GradientPreset`, `GradientConfig` from `./gradients`
- `animations`, `easings`, `animationPresets` from `./animationTimings`
- `zIndex` from `./zIndex`

---

### Sprint 1.2: Typography Enhancement

#### Task 1.2.1: Create Enhanced Text Component

**Files:**
- Create: `src/shared/components/atoms/text/Text.tsx`
- Create: `src/shared/components/atoms/text/Text.types.ts`
- Create: `src/shared/components/atoms/text/Text.test.tsx`
- Create: `src/shared/components/atoms/text/index.ts`

**Required props (TextProps):**
- `variant`: `'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline' | 'button' | 'link'`
- `color`: `'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error' | 'info' | 'onPrimary' | 'onSurface' | 'onBackground'`
- `weight`: `'regular' | 'medium' | 'semibold' | 'bold'`
- `align`: `'left' | 'center' | 'right'`
- `testID`, `accessibilityLabel`, `style`

**Variant specifications:**
| Variant | Font Size | Font Weight | Line Height |
|---------|-----------|-------------|-------------|
| h1 | 32 | 700 | 40 |
| h2 | 28 | 700 | 36 |
| h3 | 24 | 600 | 32 |
| h4 | 20 | 600 | 28 |
| h5 | 18 | 600 | 24 |
| h6 | 16 | 600 | 22 |
| body1 | 16 | 400 | 24 |
| body2 | 14 | 400 | 20 |
| caption | 12 | 400 | 16 |
| overline | 10 | 500 | 14 |
| button | 14 | 600 | 20 |
| link | 14 | 500 | 20 |

---

## Phase 2: Core Component Library

### Component Inventory

| Sprint | Category | Components | Priority |
|--------|----------|------------|----------|
| 2.1 | Atoms - Input | Button, IconButton, TextInput, Toggle, Checkbox, RadioButton | P0 |
| 2.2 | Atoms - Display | Slider, Badge, Avatar, Chip, ProgressBar, Divider, Skeleton | P0 |
| 2.3 | Molecules - Nav | Header, BottomNavigation, TabBar, SearchBar | P0 |
| 2.4 | Molecules - Content | Card, ListItem, FormField, EmptyState | P0 |
| 2.5 | Molecules - Overlay | Modal, BottomSheet, Toast, Tooltip | P0 |
| 2.6 | Molecules - Picker | DatePicker, TimePicker, DropdownSelect | P1 |
| 2.7 | Organisms - Chat | ChatBubble, TypingIndicator, MessageInput, VoiceWaveform | P0 |
| 2.8 | Organisms - Track | MoodSelector, MoodCalendar, MoodChart, ScoreCard | P0 |
| 2.9 | Organisms - Cards | JournalEntryCard, SessionCard, ArticleCard, PostCard | P1 |
| 2.10 | Organisms - Special | NotificationCard, FAQAccordion, StatCard, **CrisisModal** | P0 |

---

### 🛠️ Tools to Use in Phase 2

**Before building each component, remember to:**

1. **Query MCP Servers** for patterns:
   - Context7: `"React Native [component-name] TypeScript accessibility"`
   - Exa: `"production react native [component-name] component variants"`

2. **Use GlueStack UI** as reference for:
   - Accessibility patterns (already WCAG 2.1 AA compliant)
   - Dark mode implementation
   - Component variants and props structure

3. **Use React Hook Form + Zod** for all form components:
   - Button: Include in form submit handlers
   - TextInput: Integrate with `Controller` from react-hook-form
   - Checkbox, RadioButton, Toggle: Use with form validation

4. **Use Shopify Restyle** for styling:
   - Import theme values instead of hardcoding colors/spacing
   - Use type-safe theme hooks

5. **Use eslint-plugin-react-native-a11y**:
   - Ensure all components pass accessibility checks
   - Minimum touch target: 44x44 points
   - Proper `accessibilityLabel` on all interactive elements

---

### Sprint 2.1: Atoms - Input Controls

#### Task 2.1.1: Button Component

**Files:**
- Create: `src/shared/components/atoms/buttons/Button.tsx`
- Create: `src/shared/components/atoms/buttons/Button.types.ts`
- Create: `src/shared/components/atoms/buttons/Button.test.tsx`
- Create: `src/shared/components/atoms/buttons/index.ts`

**Required props (ButtonProps):**
- `label: string` - Button text
- `onPress: () => void` - Press handler
- `variant`: `'primary' | 'secondary' | 'outline' | 'ghost' | 'crisis' | 'link'`
- `size`: `'sm' | 'md' | 'lg'`
- `loading?: boolean` - Shows ActivityIndicator
- `disabled?: boolean` - Disables interaction
- `leftIcon?: ReactNode` - Icon before label
- `rightIcon?: ReactNode` - Icon after label
- `fullWidth?: boolean` - 100% width
- `testID`, `accessibilityLabel`, `style`, `labelStyle`

**Size specifications:**
| Size | Height | Padding Horizontal | Font Size |
|------|--------|-------------------|-----------|
| sm | 36 | 12 | 14 |
| md | 44 | 16 | 16 |
| lg | 52 | 24 | 18 |

**Variant colors (using theme):**
| Variant | Background | Text | Border |
|---------|------------|------|--------|
| primary | brown-70 | white | transparent |
| secondary | gray-20 | gray-90 | transparent |
| outline | transparent | brown-70 | brown-70 |
| ghost | transparent | brown-70 | transparent |
| crisis | red-50 | white | red-60 |
| link | transparent | blue-60 | transparent |

**Required features:**
- Animated press feedback (scale 0.96 on press)
- 44pt minimum touch target
- Accessibility: `accessibilityRole="button"`, `accessibilityState`
- Crisis variant: elevated shadow with red tint

---

#### Task 2.1.2: IconButton Component

**Files:**
- Create: `src/shared/components/atoms/buttons/IconButton.tsx`
- Create: `src/shared/components/atoms/buttons/IconButton.types.ts`
- Create: `src/shared/components/atoms/buttons/IconButton.test.tsx`

**Required props:**
- `icon: ReactNode` - Icon element
- `onPress: () => void`
- `size`: `'sm' (32) | 'md' (44) | 'lg' (56)`
- `variant`: `'filled' | 'tinted' | 'outlined' | 'ghost'`
- `circular?: boolean` - Round shape
- `disabled?: boolean`
- `testID`, `accessibilityLabel`

---

#### Task 2.1.3: TextInput Component

**Files:**
- Create: `src/shared/components/atoms/forms/TextInput.tsx`
- Create: `src/shared/components/atoms/forms/TextInput.types.ts`
- Create: `src/shared/components/atoms/forms/TextInput.test.tsx`

**Required props:**
- `value: string`
- `onChangeText: (text: string) => void`
- `placeholder?: string`
- `label?: string`
- `error?: string`
- `helperText?: string`
- `secureTextEntry?: boolean`
- `multiline?: boolean`
- `leftIcon?: ReactNode`
- `rightIcon?: ReactNode`
- `inputMode`: standard RN TextInput inputMode
- `testID`, `accessibilityLabel`

**States:**
- Default, Focused, Error, Disabled
- Error state: red border, error message below

---

#### Task 2.1.4: Toggle Component

**Files:**
- Create: `src/shared/components/atoms/forms/Toggle.tsx`
- Create: `src/shared/components/atoms/forms/Toggle.types.ts`
- Create: `src/shared/components/atoms/forms/Toggle.test.tsx`

**Required props:**
- `value: boolean`
- `onValueChange: (value: boolean) => void`
- `disabled?: boolean`
- `label?: string`
- `testID`, `accessibilityLabel`

---

#### Task 2.1.5: Checkbox Component

**Files:**
- Create: `src/shared/components/atoms/forms/Checkbox.tsx`
- Create: `src/shared/components/atoms/forms/Checkbox.types.ts`
- Create: `src/shared/components/atoms/forms/Checkbox.test.tsx`

**Required props:**
- `checked: boolean`
- `onChange: (checked: boolean) => void`
- `indeterminate?: boolean`
- `disabled?: boolean`
- `label?: string`
- `testID`, `accessibilityLabel`

---

#### Task 2.1.6: RadioButton Component

**Files:**
- Create: `src/shared/components/atoms/forms/RadioButton.tsx`
- Create: `src/shared/components/atoms/forms/RadioButton.types.ts`
- Create: `src/shared/components/atoms/forms/RadioButton.test.tsx`

**Required props:**
- `selected: boolean`
- `onSelect: () => void`
- `disabled?: boolean`
- `label?: string`
- `value: string`
- `testID`, `accessibilityLabel`

---

### Sprint 2.2: Atoms - Display Elements

| Task | Component | Required Props |
|------|-----------|----------------|
| 2.2.1 | Slider | `value`, `onValueChange`, `min`, `max`, `step`, `showLabels` |
| 2.2.2 | Badge | `label`, `variant` (default/success/warning/error/info), `size`, `dot` |
| 2.2.3 | Avatar | `source`, `name`, `size` (xs/sm/md/lg/xl), `fallbackIcon`, `online` |
| 2.2.4 | Chip | `label`, `selected`, `onPress`, `deletable`, `onDelete`, `disabled` |
| 2.2.5 | ProgressBar | `progress` (0-1), `variant` (linear/circular), `showLabel`, `color` |
| 2.2.6 | Divider | `orientation` (horizontal/vertical), `label`, `thickness` |
| 2.2.7 | Skeleton | `variant` (text/rectangular/circular), `width`, `height`, `animation` |

---

### Sprint 2.3-2.6: Molecules

| Sprint | Component | Files Location | Key Features |
|--------|-----------|----------------|--------------|
| 2.3 | Header | `molecules/header/` | Title, back button, right actions, transparent variant |
| 2.3 | BottomNavigation | `molecules/navigation/` | 5 tabs with icons, badge support, active indicator |
| 2.3 | TabBar | `molecules/navigation/` | Scrollable, animated indicator |
| 2.3 | SearchBar | `molecules/search/` | Clear button, voice input, filters |
| 2.4 | Card | `molecules/cards/` | Pressable, elevated, outlined variants |
| 2.4 | ListItem | `molecules/lists/` | Leading/trailing, divider, swipeable |
| 2.4 | FormField | `molecules/forms/` | Label, input, error, helper text |
| 2.4 | EmptyState | `molecules/feedback/` | Icon, title, description, action button |
| 2.5 | Modal | `molecules/overlays/` | Title, content, actions, close button |
| 2.5 | BottomSheet | `molecules/overlays/` | @gorhom/bottom-sheet integration |
| 2.5 | Toast | `molecules/feedback/` | Auto-dismiss, action, variants |
| 2.5 | Tooltip | `molecules/overlays/` | Arrow pointing, auto-position |
| 2.6 | DatePicker | `molecules/pickers/` | react-native-calendars integration |
| 2.6 | TimePicker | `molecules/pickers/` | Hour/minute wheels |
| 2.6 | DropdownSelect | `molecules/pickers/` | Single/multi select, searchable |

---

### Sprint 2.7-2.10: Organisms

| Sprint | Component | Files Location | Key Features |
|--------|-----------|----------------|--------------|
| 2.7 | ChatBubble | `organisms/chat/` | User/AI variants, timestamp, reactions |
| 2.7 | TypingIndicator | `organisms/chat/` | Animated dots |
| 2.7 | MessageInput | `organisms/chat/` | Text, voice, attachment buttons |
| 2.7 | VoiceWaveform | `organisms/chat/` | Animated bars during recording |
| 2.8 | MoodSelector | `organisms/mood/` | 5-scale emoji picker with animation |
| 2.8 | MoodCalendar | `organisms/mood/` | Calendar with mood indicators |
| 2.8 | MoodChart | `organisms/mood/` | Line/bar chart with react-native-chart-kit |
| 2.8 | ScoreCard | `organisms/dashboard/` | Circular progress, trend indicator |
| 2.9 | JournalEntryCard | `organisms/journal/` | Preview, date, mood, tags |
| 2.9 | SessionCard | `organisms/sessions/` | Duration, type, progress |
| 2.9 | ArticleCard | `organisms/resources/` | Image, title, reading time |
| 2.9 | PostCard | `organisms/community/` | Author, content, reactions, comments |
| 2.10 | NotificationCard | `organisms/notifications/` | Icon, title, time, unread indicator |
| 2.10 | FAQAccordion | `organisms/help/` | Expandable, animated |
| 2.10 | StatCard | `organisms/dashboard/` | Value, label, trend arrow |
| 2.10 | **CrisisModal** | `organisms/crisis/` | **SAFETY-CRITICAL** - See Phase 6 |

---

## Phase 3: Feature Screens

### Batch-to-Sprint Mapping

| Batch | Feature | Screens | Sprint | Dependencies |
|-------|---------|---------|--------|--------------|
| 1-2 | Splash & Welcome | 1-10 | 3.1 | Phase 1 complete |
| 3 | Authentication | 11-14 | 3.2 | Sprint 3.1 |
| 4-5 | Profile Setup | 15-25 | 3.3 | Sprint 3.2 |
| 6-8 | Mental Health Assessment | 26-39 | 3.4 | Sprint 3.3, **P1 Issue #2 resolved** |
| 9-10 | Home & Dashboard | 40-46 | 3.5 | Sprint 3.4 |
| 11-14 | AI Chatbot | 47-66 | 3.6-3.7 | Sprint 3.5, **P1 Issue #1 resolved** |
| 14-16 | Mood Tracker | 67-77 | 3.8 | Sprint 3.6 |
| 16-18 | Journal | 78-86 | 3.9 | Sprint 3.8, **P1 Issues #16, #18 resolved** |
| 18-20 | Sleep Quality | 87-96 | 3.10 | Sprint 3.9 |
| 20-21 | Stress Management | 97-103 | 3.11 | Sprint 3.10 |
| 21-23 | Mindful Hours | 104-111 | 3.12 | Sprint 3.11 |
| 23-24 | Resources | 112-118 | 3.13 | Sprint 3.12 |
| 24-26 | Community | 119-128 | 3.14 | Sprint 3.13, **P1 Issue #26 resolved** |
| 26-27 | Search | 129-133 | 3.15 | Sprint 3.14 |
| 27-29 | Notifications | 134-139 | 3.16 | Sprint 3.15 |
| 29-31 | Profile Settings | 140-153 | 3.17 | Sprint 3.16 |
| 31-32 | Error Screens | 154-158 | 3.18 | Sprint 3.17 |

---

### 🛠️ Tools to Use in Phase 3

**Critical reminders for screen development:**

1. **Use react-native-gifted-charts** for ALL mood/sleep/stress visualizations:
   - Mood Tracker (Screens 67-77): `LineChart`, `BarChart` for mood trends
   - Sleep Quality (Screens 87-96): `BarChart` for sleep hours, quality scores
   - Stress Management (Screens 97-103): Charts for stress levels over time
   - Dashboard (Screens 40-46): `LineChart` for Freud Score trends

2. **Use React Hook Form + Zod** for ALL forms:
   - Profile Setup (Screens 15-25): Multi-step form validation
   - Journal Entry (Screens 78-86): Entry creation/editing forms
   - Assessment (Screens 26-39): Question forms with validation

3. **Use Zustand** for UI state in screens with complex interactions:
   - Modal visibility states
   - Multi-step wizard progress (Onboarding)
   - Tab switching state
   - Form draft state

4. **Query MCP servers before building complex screens**:
   - Chat screens: `"React Native chat interface FlatList keyboard avoiding"`
   - Calendar screens: `"react-native-calendars date picker TypeScript"`
   - Chart screens: `"react native gifted charts mood tracker health app"`

5. **Use GlueStack UI components** where applicable:
   - Alert for crisis modals
   - Card for content containers
   - Modal for confirmations
   - Toast for notifications

---

### Sprint 3.1: Splash & Welcome Flow (Screens 1-10)

#### Task 3.1.1: Splash Screen

**Files:**
- Create: `src/features/auth/screens/SplashScreen.tsx`
- Create: `src/features/auth/screens/SplashScreen.test.tsx`

**Reference:** `docs/ui-audit/batch-01-splash-loading-welcome.md`

**Required elements:**
- App logo (200x200) centered
- Dark brown background `#1C1410`
- Fade-in animation (800ms) with scale (0.8 → 1.05 → 1)
- Auto-transition after 2 seconds
- `onComplete` callback prop

---

#### Task 3.1.2-3.1.10: Remaining Welcome Screens

| Task | Screen | File | Required Elements |
|------|--------|------|-------------------|
| 3.1.2 | Loading Progress | `LoadingProgressScreen.tsx` | ProgressBar (0-100%), Logo, status text |
| 3.1.3 | Quote Splash | `QuoteSplashScreen.tsx` | Inspirational quote, author, fade animation |
| 3.1.4 | Fetching Data | `FetchingDataScreen.tsx` | Spinner, "Setting up your space" text |
| 3.1.5 | Welcome 1 | `WelcomeScreen.tsx` | Carousel container, pagination dots |
| 3.1.6-10 | Welcome 2-6 | Carousel pages | OnboardingCard, illustration, title, description, CTA button |

---

### Sprint 3.2: Authentication (Screens 11-14)

**Files location:** `src/features/auth/screens/`

| Screen # | File | Required Elements |
|----------|------|-------------------|
| 11 | `SignInScreen.tsx` | Email input, Password input, Sign In button, Forgot password link, Social logins |
| 12 | `SignUpScreen.tsx` | Name, Email, Password inputs, Terms checkbox, Create Account button |
| 13 | `ForgotPasswordScreen.tsx` | Email input, Send Reset button, Back to login link |
| 14 | `ResetPasswordScreen.tsx` | New password input, Confirm password, Reset button |

---

### Sprint 3.3: Profile Setup (Screens 15-25)

**Files location:** `src/features/onboarding/screens/`

| Screen # | File | Required Elements |
|----------|------|-------------------|
| 15 | `WelcomeBackScreen.tsx` | Greeting, user avatar placeholder, Continue button |
| 16 | `NameInputScreen.tsx` | First name input, Last name input, Continue button |
| 17 | `BirthDateScreen.tsx` | DatePicker, age verification |
| 18 | `GenderScreen.tsx` | Radio buttons (Male/Female/Non-binary/Prefer not to say) |
| 19 | `LocationScreen.tsx` | Country picker, optional city input |
| 20 | `OccupationScreen.tsx` | Dropdown select, other input field |
| 21 | `SleepHabitsScreen.tsx` | Time picker for bedtime/wake time |
| 22 | `StressSourcesScreen.tsx` | Multi-select chips (Work, Family, Health, etc.) |
| 23 | `GoalsScreen.tsx` | Multi-select list (Reduce anxiety, Better sleep, etc.) |
| 24 | `NotificationPermScreen.tsx` | Permission request, Enable/Skip buttons |
| 25 | `PrivacyConsentScreen.tsx` | Privacy policy, consent checkboxes, Continue button |

---

### Sprint 3.4: Mental Health Assessment (Screens 26-39)

**Files location:** `src/features/assessment/screens/`

**BLOCKED BY:** P1 Issue #2 must be resolved first

| Screen # | File | Required Elements |
|----------|------|-------------------|
| 26-35 | `AssessmentQuestionScreen.tsx` | Question text, 4 answer options, progress bar |
| 36 | `AssessmentIntroScreen.tsx` | Intro text, Start button, estimated time |
| 37 | `AssessmentProgressScreen.tsx` | Progress indicator, current/total questions |
| 38 | `ExpressionAnalysisScreen.tsx` | Camera view, face outline, capture button |
| 39 | `AssessmentResultsScreen.tsx` | Score display, category breakdown, recommendations |

---

### Sprint 3.5: Home & Dashboard (Screens 40-46)

**Files location:** `src/features/dashboard/screens/`

| Screen # | File | Required Elements |
|----------|------|-------------------|
| 40 | `DashboardScreen.tsx` | Freud score, quick actions, mood widget, activity feed |
| 41 | `ScoreDetailScreen.tsx` | Score chart, history, contributing factors |
| 42 | `QuickActionsScreen.tsx` | Grid of action cards (Chat, Journal, etc.) |
| 43 | `ActivityFeedScreen.tsx` | Timeline of activities |
| 44 | `InsightsScreen.tsx` | AI-generated insights cards |
| 45 | `GoalsProgressScreen.tsx` | Progress bars, milestone badges |
| 46 | `WeeklySummaryScreen.tsx` | Stats cards, trend charts |

---

### Sprint 3.6-3.7: AI Chatbot (Screens 47-66)

**Files location:** `src/features/chat/screens/`

**BLOCKED BY:** P1 Issue #1 must be resolved first

| Screen # | File | Required Elements |
|----------|------|-------------------|
| 47 | `ChatListScreen.tsx` | List of conversations, new chat button |
| 48-50 | `ChatScreen.tsx` | Chat bubbles, message input, typing indicator |
| 51-54 | Voice interaction screens | VoiceWaveform, recording indicator |
| 55-58 | Mood check-in flow | MoodSelector integration |
| 59-62 | CBT exercise screens | Step cards, interactive elements |
| 63-66 | Session summary screens | Summary card, save/share options |

---

### Sprint 3.8: Mood Tracker (Screens 67-77)

**Files location:** `src/features/mood/screens/`

| Screen # | File | Required Elements |
|----------|------|-------------------|
| 67 | `MoodHomeScreen.tsx` | Current mood, log button, calendar preview |
| 68 | `LogMoodScreen.tsx` | MoodSelector, notes input, tags |
| 69 | `MoodHistoryScreen.tsx` | MoodCalendar, list view toggle |
| 70 | `MoodDetailScreen.tsx` | Selected day mood, notes, activities |
| 71-73 | `MoodChartScreen.tsx` | MoodChart with date range picker |
| 74-77 | Mood insights screens | Patterns, triggers, recommendations |

---

### Sprint 3.9: Journal (Screens 78-86)

**Files location:** `src/features/journal/screens/`

**BLOCKED BY:** P1 Issues #16, #18 must be resolved first

| Screen # | File | Required Elements |
|----------|------|-------------------|
| 78 | `JournalHomeScreen.tsx` | Entry list, new entry button, search |
| 79 | `NewEntryScreen.tsx` | Rich text editor, mood tag, prompts |
| 80-82 | Guided prompts screens | Prompt cards, templates |
| 83 | `EntryDetailScreen.tsx` | Full entry view, edit/delete |
| 84 | `JournalEntryScreen.tsx` | Entry content (sanitized) |
| 85 | `TagsFilterScreen.tsx` | Tag chips, filter by tag |
| 86 | `CrisisAlertScreen.tsx` | **SAFETY-CRITICAL** - CrisisModal integration |

---

### Sprint 3.10-3.12: Wellness Features (Screens 87-111)

**Sleep Quality (87-96):** `src/features/sleep/screens/`
- Sleep log, history, insights, tips

**Stress Management (97-103):** `src/features/stress/screens/`
- Stress tracker, exercises, breathing

**Mindful Hours (104-111):** `src/features/mindfulness/screens/`
- Meditation sessions, timers, guided audio

---

### Sprint 3.13-3.14: Content Features (Screens 112-128)

**Resources (112-118):** `src/features/resources/screens/`
- Articles, videos, external links

**Community (119-128):** `src/features/community/screens/`

**BLOCKED BY:** P1 Issue #26 must be resolved first
- Feed, posts, comments, support groups

---

### Sprint 3.15-3.18: Utility Features (Screens 129-158)

**Search (129-133):** `src/features/search/screens/`
- Global search, results, filters

**Notifications (134-139):** `src/features/notifications/screens/`
- Notification list, settings, preferences

**Profile Settings (140-153):** `src/features/profile/screens/`
- Profile view, edit, account settings, privacy

**Error Screens (154-158):** `src/shared/screens/errors/`
- 404, Offline, Server error, Maintenance, Session expired

---

## Phase 4: Navigation Integration

### Navigation Architecture

```
RootNavigator
├── AuthStack (unauthenticated)
│   ├── Splash → LoadingProgress → QuoteSplash → FetchingData
│   ├── Welcome (carousel)
│   ├── SignIn / SignUp
│   └── ForgotPassword
│
├── OnboardingStack (first-time user)
│   ├── ProfileSetup (10 screens)
│   └── Assessment (14 screens)
│
└── MainStack (authenticated)
    ├── BottomTabs
    │   ├── Dashboard (Home)
    │   ├── Mood (Track)
    │   ├── Chat (AI)
    │   ├── Journal (Write)
    │   └── Profile (Me)
    │
    └── Modal/Stack Screens
        ├── Search, Notifications
        ├── Community, Mindfulness
        ├── Sleep, Stress, Resources
        ├── Settings (nested)
        └── Error screens + Crisis
```

### Sprint 4.1: Navigation Types

**Files:**
- Modify: `src/shared/types/navigation.ts`

**Required type definitions:**
- `AuthStackParamList` - Screens 1-14
- `OnboardingStackParamList` - Screens 15-39
- `MainTabParamList` - Bottom tab navigator
- `DashboardStackParamList`, `MoodStackParamList`, `ChatStackParamList`, `JournalStackParamList`, `ProfileStackParamList`
- `RootStackParamList` - All screens including modals, errors, crisis

---

### Sprint 4.2: Navigator Implementation

**Files:**
- Create: `src/app/navigation/RootNavigator.tsx`
- Create: `src/app/navigation/AuthStack.tsx`
- Create: `src/app/navigation/OnboardingStack.tsx`
- Create: `src/app/navigation/MainTabNavigator.tsx`
- Create: `src/app/navigation/linking.ts` - Deep linking config

---

## Phase 5: Testing & Quality

### Sprint 5.1: Test Infrastructure

**Files:**
- Create: `src/test/utils.tsx` - Custom render with all providers
- Create: `src/test/mocks/theme.tsx` - Theme mock
- Create: `src/test/mocks/navigation.tsx` - Navigation mock

**Test utility requirements:**
- `customRender` function wrapping components with:
  - Redux Provider
  - ThemeProvider
  - NavigationContainer

---

### Sprint 5.2: Coverage Requirements

**Minimum coverage targets:**
- Statements: 70%
- Branches: 60%
- Functions: 70%
- Lines: 70%

**Commands:**
- `npm test -- --coverage`
- `npm test -- --watch` (development)

---

## Phase 6: Safety-Critical Screens

### CRITICAL: Crisis Intervention Requirements

**The following screens MUST include crisis resources. Implementation without these is NOT acceptable.**

| Screen # | Name | Trigger | Required Elements |
|----------|------|---------|-------------------|
| 25 | FreudScoreCritical | Score < 30 | CrisisModal, 988 Hotline |
| 39 | ExpressionAnalysisResults | Crisis keywords | CrisisModal auto-trigger |
| 84 | JournalEntry | Crisis content | CrisisModal auto-trigger |
| 86 | CrisisAlertModal | AI detection | Full crisis intervention |
| 128 | CommunityLiveSupport | Crisis message | Inline resources + CrisisModal |

---

### Sprint 6.1: CrisisModal Component

**SAFETY-CRITICAL COMPONENT - REQUIRES CLINICAL REVIEW**

**Files:**
- Create: `src/shared/components/organisms/crisis/CrisisModal.tsx`
- Create: `src/shared/components/organisms/crisis/CrisisModal.types.ts`
- Create: `src/shared/components/organisms/crisis/CrisisModal.test.tsx`
- Create: `src/shared/components/organisms/crisis/index.ts`

**Required props (CrisisModalProps):**
- `visible: boolean`
- `onDismiss: () => void`
- `requireAcknowledge?: boolean` - User must check box before dismissing
- `triggerSource?: 'assessment' | 'journal' | 'chat' | 'score' | 'manual'`
- `testID`

**Required crisis resources to display:**
1. **988 Suicide & Crisis Lifeline**
   - Phone: 988
   - Description: "Free, confidential support 24/7"
   - Action: Call button that opens `tel:988`

2. **Crisis Text Line**
   - SMS: Text HOME to 741741
   - Description: "Text with a trained crisis counselor"
   - Action: Text button that opens SMS app

3. **International Association for Suicide Prevention**
   - URL: https://www.iasp.info/resources/Crisis_Centres/
   - Description: "Find crisis centers worldwide"
   - Action: Link button

**UI requirements:**
- z-index: 1000 (highest)
- `accessibilityRole="alert"`
- `accessibilityLiveRegion="assertive"`
- Heart-pulse icon (MaterialCommunityIcons)
- Supportive, non-triggering language
- **DO NOT use words:** suicidal, kill, die, hurt yourself

**Test requirements:**
- Displays 988 prominently
- Displays Crisis Text Line
- Call button opens `tel:988`
- Text button opens SMS to 741741
- Uses supportive language (no triggering words)
- Has z-index 1000

---

## Verification Checklists

### Pre-Sprint Checklist

- [ ] Query Context7/Exa for latest patterns
- [ ] Review batch documentation in `docs/ui-audit/`
- [ ] Check CRITICAL-ISSUES.md for blockers
- [ ] Verify dependencies installed

### Post-Sprint Checklist

- [ ] All screens render without errors
- [ ] Navigation flows work correctly
- [ ] Components match design mockups
- [ ] Dark mode displays correctly
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] Lint passes: `npm run lint`
- [ ] Tests pass: `npm test`
- [ ] Commit with co-author tag

### Final Verification

- [ ] Type checking: `npx tsc --noEmit`
- [ ] Lint: `npm run lint`
- [ ] Tests with coverage: `npm test -- --coverage`
- [ ] Build iOS: `npx expo run:ios --device`
- [ ] Build Android: `npx expo run:android --device`

### Safety-Critical Sign-off

| Review Type | Reviewer | Date | Approved |
|-------------|----------|------|----------|
| Clinical Safety | [Mental Health Professional] | | [ ] |
| Legal Compliance | [Legal Team] | | [ ] |
| Brand Consistency | [Product/Design Lead] | | [ ] |
| Copy Review | [Copywriter/Editor] | | [ ] |

---

## Summary & Metrics

### Phase Summary

| Phase | Sprints | Tasks | Deliverables |
|-------|---------|-------|--------------|
| Phase 0 | 2 | 4 | Prerequisites verified |
| Phase 1 | 2 | 10 | Theme system v2.0 |
| Phase 2 | 10 | 44 | 44 components |
| Phase 3 | 18 | 158+ | 158 screens |
| Phase 4 | 2 | 8 | Navigation complete |
| Phase 5 | 2 | 6 | Test infrastructure |
| Phase 6 | 1 | 5 | Safety-critical verified |
| **Total** | **37** | **235+** | **Full UI implementation** |

### Files to Create

| Category | Count | Location |
|----------|-------|----------|
| Theme tokens | 6 | `src/shared/theme/` |
| Atoms | 13 | `src/shared/components/atoms/` |
| Molecules | 13 | `src/shared/components/molecules/` |
| Organisms | 18 | `src/shared/components/organisms/` |
| Navigation | 6 | `src/app/navigation/` |
| Screens | 158 | `src/features/*/screens/` |
| Tests | 200+ | Co-located with components |
| **Total** | **414+** | - |

### Critical Dependencies

**Required packages:**
- `@gorhom/bottom-sheet@^5.0.0`
- `react-native-calendars@^1.1305.0`
- `react-native-chart-kit@^6.12.0`
- `react-native-markdown-display@^7.0.0`

### Execution Order

```
Phase 0 (Prerequisites)
    ↓ [BLOCKING]
Phase 1 (Design System)
    ↓
Phase 2 (Components) → Phase 4 (Navigation)
    ↓                       ↓
Phase 3 (Screens) ←────────┘
    ↓
Phase 5 (Testing)
    ↓
Phase 6 (Safety-Critical) → Launch
```

---

*Document Version: 3.0*
*Last Updated: 2026-01-16*
*Total Screens: 158*
*Total Components: 44*
*Methodology: TDD with bite-sized tasks*
