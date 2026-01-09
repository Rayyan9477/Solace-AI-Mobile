# UI Audit Documentation - Batch 1

## Splash & Loading Flow + Welcome Start

**Audit Date**: 2026-01-09
**Source**: `ui-designs/Dark-mode/Splash & Loading/` + `ui-designs/Dark-mode/Welcome Screen/`
**Screens Covered**: 5

---

## Batch 1 Overview

| # | Screen | Route Name | Purpose |
|---|--------|-----------|---------|
| 1 | Splash_&_Loading_Screen_01 | `Splash` | App launch brand display |
| 2 | Splash_&_Loading_Screen_02 | `LoadingProgress` | Progress indicator during init |
| 3 | Splash_&_Loading_Screen_03 | `QuoteSplash` | Inspirational quote interstitial |
| 4 | Splash_&_Loading_Screen_04 | `FetchingData` | Data sync with shake hint |
| 5 | Welcome_Screen_Screen_01 | `Welcome` | Entry point to onboarding/sign-in |

---

## Navigation Flow

```
App Launch
    │
    ▼
┌─────────┐
│ Splash  │ (Screen 01)
└────┬────┘
     │ auto-advance
     ▼
┌─────────────────┐
│ LoadingProgress │ (Screen 02)
└────────┬────────┘
         │ progress = 100%
         ▼
┌─────────────┐
│ QuoteSplash │ (Screen 03)
└──────┬──────┘
       │ timer complete
       ▼
┌──────────────┐
│ FetchingData │ (Screen 04)
└──────┬───────┘
       │ fetch complete
       ▼
┌─────────┐
│ Welcome │ (Screen 05)
└────┬────┘
     │
     ├──► "Get Started" → Onboarding Flow
     │
     └──► "Sign In" → Sign In Screen
```

---

# Screen 1: `Splash_&_Loading_Screen_01.png`

## 1. Purpose

- **User goal**: Visual confirmation that the app is launching
- **Primary actions**: None (passive viewing)
- **When/why**: First screen displayed immediately upon app launch; provides brand recognition while app initializes

---

## 2. UI Structure (Visual Only)

```
Screen
 └── Full Screen Container (dark brown background #1C1410)
      └── Centered Content
           ├── Logo Icon (4 circles in clover arrangement)
           └── Brand Text "freud.ai"
```

**Components:**

| Element | Displayed Content | User Interactions | Reusable |
|---------|------------------|-------------------|----------|
| Logo Icon | 4 tan/brown circles arranged in clover pattern | None | Yes |
| Brand Text | "freud.ai" in white, serif font | None | Yes |
| Status Bar | System time, signal, wifi, battery | None (system) | N/A |

---

## 3. Component List

| Component Name | UI Responsibility | Reusable | Props (name: type) |
|----------------|-------------------|----------|-------------------|
| SplashContainer | Full-screen dark background container | No | backgroundColor: string |
| AppLogo | Renders the 4-circle clover logo | Yes | size: 'small' \| 'medium' \| 'large', variant: 'light' \| 'dark' |
| BrandText | Displays "freud.ai" text | Yes | color: string |

---

## 4. Responsibility Split

### UI Layer
- Render full-screen dark brown background
- Center logo and text vertically and horizontally
- Apply correct typography styling to brand text

### Logic Layer
- Trigger automatic navigation after initialization completes
- Track app initialization status
- Handle minimum display duration timer

---

## 5. State Definition

```
Local State:
- isInitialized: boolean

Async State:
- appBootstrapStatus: 'pending' | 'complete' | 'error'

Derived State:
- shouldNavigate: boolean (derived from isInitialized && appBootstrapStatus === 'complete')
```

---

## 6. Data Models

```
No external data required.
Internal timing data:
- minimumDisplayDuration: number (milliseconds)
- initializationStartTime: timestamp
```

---

## 7. Navigation

- **Route name**: `Splash`
- **Incoming parameters**: None
- **Outgoing targets**:
  - → `LoadingProgress` (Screen 02) OR
  - → `Welcome` (if already onboarded)
- **Trigger conditions**: App initialization complete + minimum display time elapsed

---

## 8. UI States & Edge Cases

- **Loading**: This IS the loading state
- **Error**: Not shown (would fall back to retry or error screen)
- **Accessibility**: Logo should have accessible label "freud.ai logo"

---

## 9. Implementation Breakdown

```
Step 1: Create full-screen container with dark brown background (#1C1410)
Step 2: Create AppLogo component with 4-circle clover arrangement
Step 3: Create BrandText component with proper typography
Step 4: Center content vertically and horizontally
Step 5: Wire navigation timer/initialization logic
Step 6: Test on multiple screen sizes for proper centering
```

---

## 10. Open Issues

- [ ] Exact hex color for background not specified (appears ~#1C1410)
- [ ] Logo circle colors (appears tan gradient)
- [ ] Minimum display duration not specified
- [ ] Animation on logo appearance not visible (static image)

---

---

# Screen 2: `Splash_&_Loading_Screen_02.png`

## 1. Purpose

- **User goal**: Understand app is loading and see progress
- **Primary actions**: None (passive viewing)
- **When/why**: Displayed during app initialization when data/resources are being loaded

---

## 2. UI Structure (Visual Only)

```
Screen
 └── Full Screen Container (dark brown background)
      ├── Decorative Circles (5 large circles at edges/corners)
      │    ├── Top-left circle (partially visible)
      │    ├── Top-right circle (partially visible)
      │    ├── Left-center circle (partially visible)
      │    ├── Bottom-left circle (partially visible)
      │    └── Bottom-center circle (partially visible)
      └── Centered Progress Text "99%"
```

**Components:**

| Element | Displayed Content | User Interactions | Reusable |
|---------|------------------|-------------------|----------|
| Progress Percentage | "99%" in white, large font | None | Yes |
| Decorative Circles | 5 large brown circles positioned at screen edges | None | Yes |

---

## 3. Component List

| Component Name | UI Responsibility | Reusable | Props (name: type) |
|----------------|-------------------|----------|-------------------|
| LoadingContainer | Full-screen background with overflow hidden | No | backgroundColor: string |
| DecorativeCircle | Large circle for visual interest | Yes | size: number, color: string, position: {x, y} |
| ProgressText | Displays percentage value | Yes | percentage: number, color: string |

---

## 4. Responsibility Split

### UI Layer
- Render dark background
- Position decorative circles at specified locations (overflow hidden)
- Display and animate percentage text
- Center percentage display

### Logic Layer
- Calculate loading progress (0-100)
- Update percentage as resources load
- Trigger navigation when progress reaches 100%

---

## 5. State Definition

```
Local State:
- progress: number (0-100)

Async State:
- resourceLoadStatus: { loaded: number, total: number }

Derived State:
- displayPercentage: string (formatted from progress)
```

---

## 6. Data Models

```
Progress tracking:
- currentProgress: number
- resourceManifest: Array<{ name: string, status: 'pending' | 'loaded' }>
```

---

## 7. Navigation

- **Route name**: `LoadingProgress`
- **Incoming parameters**: None
- **Outgoing targets**:
  - → `QuoteSplash` (Screen 03) when progress = 100%
- **Trigger conditions**: Progress reaches 100%

---

## 8. UI States & Edge Cases

- **Loading**: Always in loading state (0-99%)
- **Complete**: Briefly shows 100% before navigation
- **Error**: Not shown in design (needs clarification)
- **Accessibility**: Progress should be announced to screen readers

---

## 9. Implementation Breakdown

```
Step 1: Create container with dark background and overflow:hidden
Step 2: Position 5 decorative circles at edges using absolute positioning
Step 3: Create ProgressText component with large white typography
Step 4: Center progress text both vertically and horizontally
Step 5: Wire progress state to display
Step 6: Add number animation/counting effect for percentage
Step 7: Wire navigation trigger at 100%
```

---

## 10. Open Issues

- [ ] Exact positions of decorative circles not specified
- [ ] Circle colors (lighter brown than background)
- [ ] Whether percentage animates smoothly or updates in steps
- [ ] Behavior if loading stalls (timeout handling)
- [ ] Is 99% a real progress or just visual placeholder?

---

---

# Screen 3: `Splash_&_Loading_Screen_03.png`

## 1. Purpose

- **User goal**: Receive inspirational content while waiting
- **Primary actions**: None (passive viewing)
- **When/why**: Displayed as transitional screen during loading; provides mental health context through motivational quotes

---

## 2. UI Structure (Visual Only)

```
Screen
 └── Full Screen Container (bright orange background #E8853A)
      ├── Top Section
      │    └── Small Logo Icon (white, 4 circles)
      ├── Middle Section
      │    └── Quote Text (large, white, serif/italic)
      │         "In the midst of winter, I found there
      │          was within me an invincible summer."
      └── Bottom Section
           └── Attribution Text "— ALBERT CAMUS"
```

**Components:**

| Element | Displayed Content | User Interactions | Reusable |
|---------|------------------|-------------------|----------|
| Logo Icon | Small white 4-circle clover | None | Yes |
| Quote Text | Inspirational quote in large italic serif | None | Yes |
| Attribution | Author name with em-dash prefix | None | Yes |

---

## 3. Component List

| Component Name | UI Responsibility | Reusable | Props (name: type) |
|----------------|-------------------|----------|-------------------|
| QuoteContainer | Full-screen colored background | No | backgroundColor: string |
| AppLogo | Small white logo variant | Yes | size: 'small', variant: 'light' |
| QuoteText | Large italic quote display | Yes | text: string, color: string |
| AttributionText | Author attribution with styling | Yes | author: string, color: string |

---

## 4. Responsibility Split

### UI Layer
- Render vibrant orange background
- Position logo in upper-left area
- Display quote with proper typography (serif, italic, large)
- Display attribution with proper formatting
- Left-align all text content

### Logic Layer
- Select quote from available quotes (random or sequential)
- Track display duration
- Trigger navigation after duration completes

---

## 5. State Definition

```
Local State:
- currentQuote: { text: string, author: string }
- displayTimer: number

Shared / Global State:
- quotesCollection: Array<Quote>

Derived State:
- None
```

---

## 6. Data Models

```typescript
interface Quote {
  id: string;
  text: string;
  author: string;
  category?: string;
}

interface QuoteCollection {
  quotes: Quote[];
}
```

---

## 7. Navigation

- **Route name**: `QuoteSplash`
- **Incoming parameters**: None (or optional quoteId)
- **Outgoing targets**:
  - → `FetchingData` (Screen 04) OR
  - → `Welcome` (Screen 05) if data already cached
- **Trigger conditions**: Timer completes (auto-advance)

---

## 8. UI States & Edge Cases

- **Loading**: N/A (static content)
- **Empty**: Should have fallback quote if collection empty
- **Accessibility**: Quote should be readable by screen readers with proper pause after quote and before attribution

---

## 9. Implementation Breakdown

```
Step 1: Create full-screen container with orange background (#E8853A)
Step 2: Position small white logo in upper-left with padding
Step 3: Create QuoteText component with serif/italic typography
Step 4: Create AttributionText with em-dash and caps styling
Step 5: Left-align text with generous horizontal padding
Step 6: Wire quote selection logic
Step 7: Add auto-navigation timer
```

---

## 10. Open Issues

- [ ] Quote selection logic (random vs. daily vs. sequential)
- [ ] Display duration before auto-advance
- [ ] Whether screen is skippable by tap
- [ ] Full quotes database/source
- [ ] Typography exact font family (appears serif/italic)

---

---

# Screen 4: `Splash_&_Loading_Screen_04.png`

## 1. Purpose

- **User goal**: Understand data is being fetched; discover shake interaction
- **Primary actions**: Shake device to interact (optional)
- **When/why**: Displayed when app fetches user data or syncs with server

---

## 2. UI Structure (Visual Only)

```
Screen
 └── Full Screen Container (olive/sage green background #9AAD5C)
      ├── Decorative Circles (darker green, various positions)
      │    ├── Top-right circle (partial)
      │    ├── Bottom-left circle (partial)
      │    └── Bottom-right circle (partial)
      └── Centered Content
           ├── Status Text "Fetching Data..."
           └── Hint Row
                ├── Shake Icon (phone with motion lines)
                └── Hint Text "Shake screen to interact!"
```

**Components:**

| Element | Displayed Content | User Interactions | Reusable |
|---------|------------------|-------------------|----------|
| Status Text | "Fetching Data..." in white, bold | None | Yes |
| Shake Icon | Phone icon with motion indicators | None | Yes |
| Hint Text | "Shake screen to interact!" | Device shake gesture | Yes |
| Decorative Circles | Large dark green circles | None | Yes |

---

## 3. Component List

| Component Name | UI Responsibility | Reusable | Props (name: type) |
|----------------|-------------------|----------|-------------------|
| FetchingContainer | Full-screen green background | No | backgroundColor: string |
| DecorativeCircle | Large decorative circle | Yes | size: number, color: string, position: object |
| StatusText | Bold status message | Yes | text: string, color: string |
| HintRow | Icon + text horizontal layout | Yes | icon: ReactNode, text: string |
| ShakeIcon | Phone with motion lines icon | Yes | size: number, color: string |

---

## 4. Responsibility Split

### UI Layer
- Render olive/sage green background
- Position decorative circles with overflow hidden
- Center status text and hint row
- Display shake icon inline with hint text

### Logic Layer
- Monitor device accelerometer for shake gesture
- Handle shake interaction (trigger action/animation)
- Track data fetch progress
- Trigger navigation when fetch completes

---

## 5. State Definition

```
Local State:
- isFetching: boolean
- shakeDetected: boolean

Async State:
- fetchStatus: 'pending' | 'fetching' | 'complete' | 'error'
- fetchedData: UserData | null

Derived State:
- statusMessage: string (based on fetchStatus)
```

---

## 6. Data Models

```typescript
interface FetchStatus {
  status: 'pending' | 'fetching' | 'complete' | 'error';
  progress?: number;
  error?: string;
}

interface ShakeEvent {
  timestamp: number;
  intensity: number;
}
```

---

## 7. Navigation

- **Route name**: `FetchingData`
- **Incoming parameters**: None
- **Outgoing targets**:
  - → `Welcome` (Screen 05) on fetch complete
  - → `ErrorScreen` on fetch failure
- **Trigger conditions**: Data fetch completes successfully

---

## 8. UI States & Edge Cases

- **Loading**: "Fetching Data..." (current state)
- **Shake response**: Visual feedback when shake detected (not shown)
- **Error**: Fetch failure state (not shown in design)
- **Accessibility**: Shake interaction needs alternative for users who cannot shake device

---

## 9. Implementation Breakdown

```
Step 1: Create container with olive green background (#9AAD5C)
Step 2: Position decorative darker green circles at edges
Step 3: Create StatusText component with bold white typography
Step 4: Create HintRow with icon and text
Step 5: Create/use ShakeIcon component
Step 6: Center content vertically and horizontally
Step 7: Wire shake detection using accelerometer API
Step 8: Wire data fetching logic
Step 9: Wire navigation on completion
```

---

## 10. Open Issues

- [ ] What does "shake to interact" actually do? (Easter egg? Speed up? Animation?)
- [ ] Exact green colors for background and circles
- [ ] Error state handling not shown
- [ ] Alternative interaction for accessibility
- [ ] Whether shake is required or optional

---

---

# Screen 5: `Welcome_Screen_Screen_01.png`

## 1. Purpose

- **User goal**: Understand app purpose and begin onboarding or sign in
- **Primary actions**: Tap "Get Started" to begin onboarding OR tap "Sign In" if returning user
- **When/why**: First interactive screen after loading; entry point to onboarding flow

---

## 2. UI Structure (Visual Only)

```
Screen
 └── Full Screen Container (dark brown background)
      ├── Top Section
      │    └── Logo Icon (tan/brown 4-circle clover)
      ├── Header Section
      │    ├── Title "Welcome to the ultimate"
      │    ├── Title (continued) "freud UI Kit!"
      │    └── Subtitle "Your mindful mental health AI companion
      │                  for everyone, anywhere 🌿"
      ├── Illustration Section
      │    └── Circular Container (brown background)
      │         ├── Character Illustration (green blob robot)
      │         └── Floating Icons
      │              ├── Chart icon (orange circle)
      │              ├── Lightbulb icon (orange circle)
      │              ├── Calendar icon (orange circle)
      │              └── Small decorative circles
      ├── CTA Section
      │    └── Primary Button "Get Started →"
      └── Footer Section
           └── Text "Already have an account? Sign In."
```

**Components:**

| Element | Displayed Content | User Interactions | Reusable |
|---------|------------------|-------------------|----------|
| Logo Icon | 4-circle clover in tan/brown | None | Yes |
| Title Text | "Welcome to the ultimate freud UI Kit!" | None | Yes |
| Subtitle | Description with plant emoji | None | Yes |
| Character Illustration | Green robot/blob mascot | None | Yes |
| Floating Icons | Chart, lightbulb, calendar in orange circles | None | Yes |
| Get Started Button | "Get Started →" tan button | Tap | Yes |
| Sign In Link | "Already have an account? Sign In." | Tap on "Sign In" | Yes |

---

## 3. Component List

| Component Name | UI Responsibility | Reusable | Props (name: type) |
|----------------|-------------------|----------|-------------------|
| WelcomeContainer | Full-screen dark background | No | - |
| AppLogo | 4-circle clover logo | Yes | size: string, variant: string |
| WelcomeTitle | Large title with "freud" underlined | Yes | - |
| WelcomeSubtitle | Descriptive text with emoji | Yes | text: string |
| MascotIllustration | Character with floating icons | Yes | - |
| FloatingIcon | Orange circle with icon | Yes | icon: string, position: object |
| PrimaryButton | Tan button with arrow | Yes | label: string, onPress: function, icon?: string |
| TextLink | Inline text with tappable portion | Yes | prefix: string, linkText: string, onPress: function |

---

## 4. Responsibility Split

### UI Layer
- Render dark brown background
- Display logo centered at top
- Display title with "freud" having underline decoration
- Display subtitle with emoji
- Render mascot illustration with floating icons
- Render primary CTA button
- Render sign-in link at bottom

### Logic Layer
- Handle "Get Started" press → navigate to onboarding
- Handle "Sign In" press → navigate to sign-in screen
- Track if user is new vs returning (for analytics)

---

## 5. State Definition

```
Local State:
- None required (stateless presentation)

Shared / Global State:
- isAuthenticated: boolean (to potentially skip this screen)
- hasCompletedOnboarding: boolean

Derived State:
- None
```

---

## 6. Data Models

```
No external data required for this screen.
Static content only.
```

---

## 7. Navigation

- **Route name**: `Welcome`
- **Incoming parameters**: None
- **Outgoing targets**:
  - → `Onboarding` (next welcome screen or onboarding flow) via "Get Started"
  - → `SignIn` via "Sign In" link
- **Trigger conditions**:
  - User taps "Get Started" button
  - User taps "Sign In" text link

---

## 8. UI States & Edge Cases

- **Loading**: N/A (static content)
- **Disabled**: Button should never be disabled on this screen
- **Accessibility**:
  - Button needs accessible label
  - Sign In link needs clear touch target
  - Illustration needs alt text description
  - Emoji may need text alternative

---

## 9. Implementation Breakdown

```
Step 1: Create full-screen container with dark brown background
Step 2: Create and position AppLogo at top center
Step 3: Create WelcomeTitle with "freud" underline styling
Step 4: Create WelcomeSubtitle with emoji support
Step 5: Build MascotIllustration with circular container
Step 6: Add FloatingIcon components with absolute positioning
Step 7: Create PrimaryButton with tan background and arrow icon
Step 8: Create TextLink component for sign-in option
Step 9: Wire navigation handlers
Step 10: Test touch targets and accessibility
```

---

## 10. Open Issues

- [ ] Exact mascot illustration asset source (SVG? Lottie? PNG?)
- [ ] Floating icons animation (static or animated?)
- [ ] "freud" underline style (solid? wavy? color?)
- [ ] Button arrow icon source
- [ ] Whether plant emoji renders consistently cross-platform
- [ ] Touch target size for "Sign In" link

---

---

## Reusable Components Identified (Batch 1)

| Component | Used In | Priority |
|-----------|---------|----------|
| AppLogo | Screens 1, 3, 5 | High |
| DecorativeCircle | Screens 2, 4 | Medium |
| PrimaryButton | Screen 5 | High |
| TextLink | Screen 5 | High |
| QuoteText | Screen 3 | Medium |
| StatusText | Screen 4 | Medium |
| ProgressText | Screen 2 | Medium |

---

## Color Palette Identified (Batch 1)

| Color | Hex (Approximate) | Usage |
|-------|-------------------|-------|
| Dark Brown | #1C1410 | Primary background |
| Tan/Beige | #C4A574 | Logo, buttons |
| Bright Orange | #E8853A | Quote screen background |
| Olive Green | #9AAD5C | Fetching screen background |
| White | #FFFFFF | Text, icons |

---

## Next Batch Preview

**Batch 2** will cover:
- Welcome_Screen_Screen_02.png
- Welcome_Screen_Screen_03.png
- Welcome_Screen_Screen_04.png
- Welcome_Screen_Screen_05.png
- Welcome_Screen_Screen_06.png
