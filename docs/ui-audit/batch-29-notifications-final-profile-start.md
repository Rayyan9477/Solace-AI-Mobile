# Batch 29: Smart Notifications (Final) + Profile Settings (Start)

## Screens Covered
- **Screen 140**: Smart Notifications 07 - SleepQualityIncrease
- **Screen 141**: Profile Settings 01 - ProfileDashboard
- **Screen 142**: Profile Settings 02 - AccountSettings
- **Screen 143**: Profile Settings 03 - PersonalInformation
- **Screen 144**: Profile Settings 04 - NotificationSettings

---

## Screen 140: Smart Notifications 07 - SleepQualityIncrease

### 1. Purpose
Full-screen celebration notification informing users that their sleep quality has improved compared to the previous month, encouraging continued healthy sleep habits.

### 2. UI Structure
```
├── StatusBar
├── BackButton (moon icon, top-left)
├── IllustrationContainer
│   ├── SleepIllustration (person with pillows)
│   └── DecorativeStars
├── ContentSection
│   ├── DurationDisplay ("7h 50m")
│   ├── Title ("Sleep Quality Increased!")
│   └── Subtitle (comparison text)
└── ActionButton ("See Sleep Quality")
```

### 3. Component List
| Component | Variant | Notes |
|-----------|---------|-------|
| `StatusBar` | light | iOS status bar |
| `IconButton` | moon | Top-left back/close |
| `IllustrationContainer` | sleep-celebration | Full-width illustration |
| `SleepIllustration` | person-with-pillows | Decorative sleeping figure |
| `DecorativeStars` | scattered | Ambient decoration |
| `DurationDisplay` | large-highlight | "7h 50m" prominent text |
| `NotificationTitle` | celebration | "Sleep Quality Increased!" |
| `NotificationSubtitle` | comparison | Percentage comparison text |
| `ActionButton` | primary-sparkle | "See Sleep Quality" with icon |

### 4. Responsibility Split

**UI Layer:**
- Render sleep illustration with decorative elements
- Display duration in large format
- Show celebration message and comparison
- Handle button press animation

**Logic Layer:**
- Calculate sleep duration improvement
- Compute percentage change from previous period
- Format duration display (hours and minutes)
- Navigate to sleep quality details on CTA

### 5. State Definition
```typescript
interface SleepQualityNotificationState {
  // Sleep data
  currentDuration: {
    hours: number;
    minutes: number;
  };
  previousDuration: {
    hours: number;
    minutes: number;
  };

  // Comparison
  percentageIncrease: number;
  comparisonPeriod: 'week' | 'month';

  // UI state
  isAnimating: boolean;
}
```

### 6. Data Models
```typescript
interface SleepQualityImprovement {
  currentPeriod: {
    averageDuration: number; // minutes
    qualityScore: number;
    startDate: Date;
    endDate: Date;
  };
  previousPeriod: {
    averageDuration: number;
    qualityScore: number;
    startDate: Date;
    endDate: Date;
  };
  improvement: {
    durationChange: number; // minutes
    percentageChange: number;
    isPositive: boolean;
  };
}

// Formatter utility
const formatSleepDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};
```

### 7. Navigation
- **Entry Points**: Push notification tap, scheduled trigger
- **Exit Points**:
  - "See Sleep Quality" → Sleep tracking detail screen
  - Moon icon → Dismiss notification

### 8. UI States & Edge Cases
| State | Behavior |
|-------|----------|
| Improvement | Show celebration with percentage |
| Decline | Different notification type (not shown) |
| No Change | Should not trigger this notification |
| Animation | Entry animation for illustration |

### 9. Implementation Breakdown

**Phase 1: Layout**
- Full-screen container with brown gradient background
- Illustration positioned in upper portion
- Content centered below illustration

**Phase 2: Components**
- Create SleepIllustration component
- Build DurationDisplay with large typography
- Implement ActionButton with sparkle icon

**Phase 3: Integration**
- Connect to sleep tracking data
- Calculate improvement metrics
- Navigate to detail view

### 10. Open Issues
- [ ] **SMART NOTIFICATIONS COMPLETE (7/7)** ✅

---

## Screen 141: Profile Settings 01 - ProfileDashboard

### 1. Purpose
Display user profile overview with key personal stats, membership status, mental health score, and current mood indicator.

### 2. UI Structure
```
├── StatusBar
├── HeaderBackground (nature image)
├── ProfileSection
│   ├── AvatarContainer
│   │   ├── ProfileAvatar
│   │   └── SettingsButton (gear icon)
│   ├── UserName ("Shinomiya Kaguya")
│   └── MembershipBadge ("Basic Member")
├── StatsRow
│   ├── StatItem (Age: 17y)
│   ├── StatItem (Weight: 48kg)
│   └── StatItem (Height: 162cm)
├── MetricsCards
│   ├── FreudScoreCard
│   │   ├── CircularProgress (80)
│   │   └── StatusLabel ("Healthy")
│   └── MoodCard
│       ├── MoodLabel ("Sad")
│       └── MoodBarChart
└── BottomNavigation
```

### 3. Component List
| Component | Variant | Notes |
|-----------|---------|-------|
| `StatusBar` | transparent | Overlays header image |
| `HeaderBackground` | image | Nature/leaves background |
| `ProfileAvatar` | large-bordered | Circular with white border |
| `SettingsButton` | icon-overlay | Gear icon on avatar |
| `UserName` | display-large | Primary user identifier |
| `MembershipBadge` | tier-basic | "Basic Member" pill |
| `StatsRow` | horizontal | Age, Weight, Height |
| `StatItem` | labeled | Value with label above |
| `FreudScoreCard` | dashboard | Score with circular progress |
| `CircularProgress` | score | 80/100 visualization |
| `StatusLabel` | health-tier | "Healthy" indicator |
| `MoodCard` | dashboard | Current mood display |
| `MoodBarChart` | mini-histogram | Weekly mood visualization |
| `BottomNavigation` | with-fab | Standard nav with plus button |

### 4. Responsibility Split

**UI Layer:**
- Render parallax header background
- Display avatar with settings overlay
- Show membership badge styling
- Render stat items in row
- Display score and mood cards

**Logic Layer:**
- Fetch user profile data
- Calculate Freud Score
- Determine mood from recent entries
- Handle navigation to settings
- Manage membership tier display

### 5. State Definition
```typescript
interface ProfileDashboardState {
  // User data
  user: {
    name: string;
    avatarUrl: string;
    membershipTier: 'basic' | 'premium' | 'professional';
  };

  // Stats
  stats: {
    age: number;
    weight: number;
    weightUnit: 'kg' | 'lbs';
    height: number;
    heightUnit: 'cm' | 'ft';
  };

  // Metrics
  freudScore: {
    value: number;
    status: 'critical' | 'low' | 'moderate' | 'healthy' | 'optimal';
  };

  mood: {
    current: MoodType;
    weeklyData: number[];
  };

  // UI state
  isLoading: boolean;
  headerScrollOffset: number;
}

type MoodType = 'happy' | 'calm' | 'sad' | 'anxious' | 'angry' | 'neutral';
```

### 6. Data Models
```typescript
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  dateOfBirth: Date;
  gender: string;
  location: string;
  accountType: 'patient' | 'psychiatrist' | 'professional';
  membership: {
    tier: MembershipTier;
    startDate: Date;
    expiryDate: Date | null;
  };
  physicalStats: {
    weight: number;
    height: number;
    units: {
      weight: 'kg' | 'lbs';
      height: 'cm' | 'ft';
    };
  };
}

type MembershipTier = 'basic' | 'premium' | 'professional';

const MEMBERSHIP_LABELS: Record<MembershipTier, string> = {
  basic: 'Basic Member',
  premium: 'Premium Member',
  professional: 'Professional'
};
```

### 7. Navigation
- **Entry Points**: Bottom navigation profile tab, notification tap
- **Exit Points**:
  - Settings gear → Account Settings
  - Freud Score card → Score details
  - Mood card → Mood history

### 8. UI States & Edge Cases
| State | Behavior |
|-------|----------|
| Loading | Skeleton placeholders for all sections |
| No Avatar | Default avatar placeholder |
| No Mood Data | Empty state for mood chart |
| Score Calculating | Loading indicator in score card |
| Premium User | Different badge styling |

### 9. Implementation Breakdown

**Phase 1: Layout**
- Parallax header with background image
- Avatar positioned overlapping header/content
- Stats row with equal spacing

**Phase 2: Components**
- Build ProfileAvatar with settings overlay
- Create MembershipBadge with tier variants
- Implement StatItem with label/value layout

**Phase 3: Cards**
- FreudScoreCard with circular progress
- MoodCard with bar chart visualization

**Phase 4: Integration**
- Connect to user profile store
- Fetch real-time score and mood
- Implement navigation handlers

### 10. Open Issues
- [ ] **CRITICAL**: "Shinomiya Kaguya" is anime character name - replace with realistic placeholder (See Issue #8)
- [ ] **CRITICAL**: Age shown as 17y (minor) - use adult age for placeholder
- [ ] Determine header background image source (user upload or preset?)

---

## Screen 142: Profile Settings 02 - AccountSettings

### 1. Purpose
Comprehensive settings menu providing access to all app configuration options including notifications, personal info, security, and account management.

### 2. UI Structure
```
├── StatusBar
├── Header
│   ├── BackButton
│   └── Title ("Account Settings")
├── ScrollableContent
│   ├── SectionHeader ("General Settings")
│   ├── SettingsItem (Notifications)
│   ├── SettingsItem (Personal Information)
│   ├── SettingsItem (Emergency Contact) [value: "15+"]
│   ├── SettingsItem (Language) [value: "English (EN)"]
│   ├── SettingsItem (Dark Mode) [toggle: ON]
│   ├── SettingsItem (Invite Friends)
│   ├── SettingsItem (Submit Feedback)
│   ├── SectionHeader ("Security & Privacy")
│   ├── SettingsItem (Security)
│   ├── SettingsItem (Help Center)
│   ├── SectionHeader ("Danger Zone")
│   ├── SettingsItem (Close Account) [destructive]
│   ├── SectionHeader ("Log Out")
│   └── SettingsItem (Log Out)
└── SafeAreaBottom
```

### 3. Component List
| Component | Variant | Notes |
|-----------|---------|-------|
| `StatusBar` | dark | Standard status bar |
| `Header` | back-title | Navigation header |
| `BackButton` | icon | Returns to profile |
| `HeaderTitle` | settings | "Account Settings" |
| `SectionHeader` | settings-group | Group label with more icon |
| `SettingsItem` | navigation | With chevron |
| `SettingsItem` | value | With right-side value |
| `SettingsItem` | toggle | With switch control |
| `SettingsItem` | destructive | Orange/warning styling |
| `ToggleSwitch` | on/off | Dark mode toggle |
| `ChevronIcon` | right | Navigation indicator |
| `WarningIcon` | triangle | Danger zone indicator |

### 4. Responsibility Split

**UI Layer:**
- Render grouped settings list
- Display section headers with styling
- Show value labels and toggles
- Apply destructive styling to danger zone
- Handle toggle interactions

**Logic Layer:**
- Load current settings values
- Handle dark mode toggle
- Navigate to sub-settings screens
- Manage logout flow
- Handle account closure flow

### 5. State Definition
```typescript
interface AccountSettingsState {
  // Settings values
  settings: {
    language: string;
    languageCode: string;
    darkMode: boolean;
    emergencyContactCount: number;
  };

  // UI state
  isLoading: boolean;
  showLogoutConfirm: boolean;
  showCloseAccountConfirm: boolean;
}

interface SettingsItem {
  id: string;
  icon: IconName;
  label: string;
  type: 'navigation' | 'toggle' | 'value' | 'destructive';
  value?: string;
  toggleValue?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}
```

### 6. Data Models
```typescript
interface AppSettings {
  general: {
    language: {
      code: string;
      name: string;
    };
    darkMode: boolean;
  };
  notifications: NotificationSettings;
  security: SecuritySettings;
  privacy: PrivacySettings;
}

const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    id: 'general',
    title: 'General Settings',
    items: [
      { id: 'notifications', icon: 'bell', label: 'Notifications', type: 'navigation' },
      { id: 'personal-info', icon: 'user', label: 'Personal Information', type: 'navigation' },
      { id: 'emergency', icon: 'alert-triangle', label: 'Emergency Contact', type: 'value' },
      { id: 'language', icon: 'flag', label: 'Language', type: 'value' },
      { id: 'dark-mode', icon: 'moon', label: 'Dark Mode', type: 'toggle' },
      { id: 'invite', icon: 'users', label: 'Invite Friends', type: 'navigation' },
      { id: 'feedback', icon: 'message-square', label: 'Submit Feedback', type: 'navigation' }
    ]
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    items: [
      { id: 'security', icon: 'shield', label: 'Security', type: 'navigation' },
      { id: 'help', icon: 'help-circle', label: 'Help Center', type: 'navigation' }
    ]
  },
  {
    id: 'danger',
    title: 'Danger Zone',
    items: [
      { id: 'close-account', icon: 'user-x', label: 'Close Account', type: 'destructive' }
    ]
  },
  {
    id: 'logout',
    title: 'Log Out',
    items: [
      { id: 'logout', icon: 'log-out', label: 'Log Out', type: 'navigation' }
    ]
  }
];
```

### 7. Navigation
- **Entry Points**: Profile dashboard settings button
- **Exit Points**:
  - Back → Profile Dashboard
  - Notifications → Notification Settings
  - Personal Information → Personal Info Editor
  - Emergency Contact → Emergency Contacts List
  - Language → Language Picker
  - Invite Friends → Share/Invite Flow
  - Submit Feedback → Feedback Form
  - Security → Security Settings
  - Help Center → Help/FAQ Screen
  - Close Account → Account Closure Flow
  - Log Out → Logout Confirmation → Auth Screen

### 8. UI States & Edge Cases
| State | Behavior |
|-------|----------|
| Loading | Skeleton list items |
| Logout Confirm | Show confirmation modal |
| Close Account | Multi-step confirmation |
| Dark Mode Toggle | Immediate theme switch |
| No Emergency Contacts | Show "0" or "Add" prompt |

### 9. Implementation Breakdown

**Phase 1: Layout**
- Settings list with section grouping
- Consistent item height and spacing
- Proper section header styling

**Phase 2: Components**
- Build SettingsItem with variants
- Create SectionHeader component
- Implement toggle switch styling

**Phase 3: Integration**
- Connect to settings store
- Implement dark mode toggle
- Set up navigation handlers
- Add confirmation modals

### 10. Open Issues
- [ ] "15+" for Emergency Contact - clarify meaning (count? age requirement?)
- [ ] Determine logout confirmation flow
- [ ] Define account closure requirements (data deletion, cooldown period?)

---

## Screen 143: Profile Settings 03 - PersonalInformation

### 1. Purpose
Allow users to view and edit their personal profile information including avatar, password, demographics, and physical stats.

### 2. UI Structure
```
├── StatusBar
├── Header
│   ├── BackButton
│   └── Title ("Personal Information")
├── ScrollableContent
│   ├── AvatarSection
│   │   ├── CurrentAvatar (with edit icon)
│   │   ├── OrDivider ("OR")
│   │   └── AlternativeAvatarOptions
│   │       ├── GraphAvatar
│   │       ├── CameraOption
│   │       └── EmojiOption (partial)
│   ├── FormSection
│   │   ├── PasswordField (masked)
│   │   ├── DateOfBirthField ("Jun 24, 2005")
│   │   ├── GenderDropdown ("Trans Female")
│   │   ├── LocationDropdown ("Tokyo, Japan")
│   │   ├── AccountTypeSelector
│   │   │   ├── RadioOption (Psychiatrist)
│   │   │   ├── RadioOption (Patient) [selected]
│   │   │   └── RadioOption (Professional)
│   │   └── WeightSlider (87kg - 100kg)
│   └── SaveButton
└── SafeAreaBottom
```

### 3. Component List
| Component | Variant | Notes |
|-----------|---------|-------|
| `StatusBar` | dark | Standard status bar |
| `Header` | back-title | Navigation header |
| `AvatarEditor` | with-alternatives | Main avatar with options |
| `AvatarOption` | image | Current photo avatar |
| `AvatarOption` | graph | Stats-based avatar |
| `AvatarOption` | camera | Take new photo |
| `AvatarOption` | emoji | Emoji avatar |
| `EditBadge` | camera-icon | Overlay on avatar |
| `OrDivider` | text | "OR" separator |
| `FormField` | password | Masked input with toggle |
| `FormField` | date-picker | Date of birth selector |
| `FormField` | dropdown | Gender and location |
| `DropdownSelect` | single | Expandable selection |
| `RadioGroup` | horizontal | Account type options |
| `RadioButton` | pill | Selectable option |
| `SliderInput` | range | Weight selection |
| `SliderLabel` | min-max | Range indicators |
| `Button` | primary | "Save Settings" |

### 4. Responsibility Split

**UI Layer:**
- Render avatar editing options
- Display form fields with current values
- Show dropdown menus
- Handle slider interactions
- Validate input formatting

**Logic Layer:**
- Load current profile data
- Handle avatar upload/selection
- Validate form inputs
- Submit profile updates
- Handle password change flow

### 5. State Definition
```typescript
interface PersonalInfoState {
  // Form values
  formData: {
    avatarUrl: string | null;
    avatarType: 'photo' | 'graph' | 'emoji';
    password: string;
    passwordVisible: boolean;
    dateOfBirth: Date;
    gender: string;
    location: string;
    accountType: 'psychiatrist' | 'patient' | 'professional';
    weight: number;
  };

  // Original values (for change detection)
  originalData: PersonalInfoFormData;

  // UI state
  isLoading: boolean;
  isSaving: boolean;
  hasChanges: boolean;
  errors: Record<string, string>;

  // Dropdowns
  showGenderPicker: boolean;
  showLocationPicker: boolean;
  showDatePicker: boolean;
}

interface PersonalInfoFormData {
  avatarUrl: string | null;
  avatarType: AvatarType;
  dateOfBirth: Date;
  gender: string;
  location: string;
  accountType: AccountType;
  weight: number;
}
```

### 6. Data Models
```typescript
type AvatarType = 'photo' | 'graph' | 'camera' | 'emoji';
type AccountType = 'psychiatrist' | 'patient' | 'professional';

interface GenderOption {
  value: string;
  label: string;
}

const GENDER_OPTIONS: GenderOption[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'trans_male', label: 'Trans Male' },
  { value: 'trans_female', label: 'Trans Female' },
  { value: 'non_binary', label: 'Non-Binary' },
  { value: 'prefer_not_say', label: 'Prefer not to say' },
  { value: 'other', label: 'Other' }
];

const ACCOUNT_TYPES: AccountTypeOption[] = [
  { value: 'psychiatrist', label: 'Psychiatrist' },
  { value: 'patient', label: 'Patient' },
  { value: 'professional', label: 'Professional' }
];

interface WeightSliderConfig {
  min: number;
  max: number;
  step: number;
  unit: 'kg' | 'lbs';
}
```

### 7. Navigation
- **Entry Points**: Account Settings → Personal Information
- **Exit Points**:
  - Back → Account Settings
  - Save Settings → Account Settings (with success)
  - Avatar camera → Camera/Gallery picker

### 8. UI States & Edge Cases
| State | Behavior |
|-------|----------|
| Loading | Form skeleton |
| Saving | Button loading state, form disabled |
| Validation Error | Inline error messages |
| Unsaved Changes | Confirm discard on back |
| Password Change | May require re-authentication |
| Avatar Upload | Progress indicator |

### 9. Implementation Breakdown

**Phase 1: Layout**
- Header with back navigation
- Avatar section with horizontal options
- Stacked form fields
- Bottom save button

**Phase 2: Components**
- Build AvatarEditor with multiple options
- Create FormField variants
- Implement RadioGroup for account type
- Build WeightSlider component

**Phase 3: Validation**
- Date of birth validation (age requirements)
- Weight range validation
- Required field checking

**Phase 4: Integration**
- Connect to profile API
- Handle avatar upload
- Implement save functionality
- Add unsaved changes warning

### 10. Open Issues
- [ ] **DATA INCONSISTENCY**: Weight shows 48kg on profile but slider shows 90kg range (87-100kg)
- [ ] Password field - changing password here vs dedicated security screen?
- [ ] Weight slider range (87-100kg) seems arbitrary - should be full range
- [ ] Professional account type verification requirements?
- [ ] "OR" divider for avatar options - UX is unclear

---

## Screen 144: Profile Settings 04 - NotificationSettings

### 1. Purpose
Allow users to configure notification preferences for chatbot alerts, sounds, vibration, and promotional/resource notifications.

### 2. UI Structure
```
├── StatusBar
├── Header
│   ├── BackButton
│   └── Title ("Notification Settings")
├── ScrollableContent
│   ├── SectionHeader ("Chatbot")
│   ├── SettingsToggle (Push Notifications) [ON]
│   ├── SettingsToggle (Support Notification) [ON]
│   ├── SettingsToggle (Alert Notification) [ON]
│   ├── SectionWithDescription ("Sound")
│   │   ├── Description text
│   │   └── Toggle [ON]
│   ├── SectionWithDescription ("Vibration")
│   │   ├── Description text
│   │   └── Toggle [ON]
│   ├── SectionHeader ("Misc")
│   ├── SettingsItem (Offers) [value: "50% OFF"]
│   ├── SettingsToggle (App Updates) [ON]
│   ├── SectionWithDescription ("Resources")
│   │   ├── Description text
│   │   └── Toggle [ON]
└── SafeAreaBottom
```

### 3. Component List
| Component | Variant | Notes |
|-----------|---------|-------|
| `StatusBar` | dark | Standard status bar |
| `Header` | back-title | Navigation header |
| `SectionHeader` | notification-group | Category label with menu icon |
| `SettingsToggle` | icon-label | Toggle with icon and label |
| `SettingsToggle` | with-description | Toggle with explanatory text |
| `SettingsItem` | value-navigation | With value and chevron |
| `ToggleSwitch` | on/off | Notification toggles |
| `DescriptionText` | muted | Helper text for settings |
| `BellIcon` | notification | Push notifications |
| `ChatIcon` | support | Support notification |
| `AlertIcon` | warning | Alert notification |
| `TagIcon` | offers | Promotional offers |
| `DownloadIcon` | updates | App updates |

### 4. Responsibility Split

**UI Layer:**
- Render notification categories
- Display toggle states
- Show section descriptions
- Handle toggle animations

**Logic Layer:**
- Load notification preferences
- Save toggle changes
- Request notification permissions
- Handle offers navigation

### 5. State Definition
```typescript
interface NotificationSettingsState {
  // Chatbot notifications
  chatbot: {
    pushNotifications: boolean;
    supportNotification: boolean;
    alertNotification: boolean;
  };

  // System notifications
  sound: boolean;
  vibration: boolean;

  // Misc notifications
  misc: {
    offers: boolean;
    appUpdates: boolean;
    resources: boolean;
  };

  // UI state
  isLoading: boolean;
  isSaving: boolean;
  permissionStatus: 'granted' | 'denied' | 'undetermined';
}
```

### 6. Data Models
```typescript
interface NotificationPreferences {
  chatbot: {
    push: boolean;
    support: boolean;
    alert: boolean;
  };
  system: {
    sound: boolean;
    vibration: boolean;
  };
  promotional: {
    offers: boolean;
    updates: boolean;
    resources: boolean;
  };
}

interface NotificationSettingItem {
  id: string;
  icon: IconName;
  label: string;
  description?: string;
  type: 'toggle' | 'navigation';
  value?: string;
  enabled: boolean;
  category: 'chatbot' | 'system' | 'misc';
}

const NOTIFICATION_SECTIONS = [
  {
    id: 'chatbot',
    title: 'Chatbot',
    items: [
      { id: 'push', icon: 'bell', label: 'Push Notifications' },
      { id: 'support', icon: 'message-circle', label: 'Support Notification' },
      { id: 'alert', icon: 'alert-triangle', label: 'Alert Notification' }
    ]
  },
  {
    id: 'sound',
    title: 'Sound',
    description: 'When Sound Notifications are on, your phone will always check for sounds.',
    isToggle: true
  },
  {
    id: 'vibration',
    title: 'Vibration',
    description: 'When Vibration Notifications are on, your phone will vibrate.',
    isToggle: true
  },
  {
    id: 'misc',
    title: 'Misc',
    items: [
      { id: 'offers', icon: 'tag', label: 'Offers', type: 'navigation', value: '50% OFF' },
      { id: 'updates', icon: 'download', label: 'App Updates' }
    ]
  },
  {
    id: 'resources',
    title: 'Resources',
    description: 'Browse our collection of resources to tailor your mental health.',
    isToggle: true
  }
];
```

### 7. Navigation
- **Entry Points**: Account Settings → Notifications
- **Exit Points**:
  - Back → Account Settings
  - Offers → Promotional Offers Screen

### 8. UI States & Edge Cases
| State | Behavior |
|-------|----------|
| Loading | Toggle skeletons |
| Permission Denied | Show prompt to enable in settings |
| Saving | Disable toggles during save |
| All Off | Warning about missing notifications? |
| Sound Off + Vibration Off | Silent mode indicator |

### 9. Implementation Breakdown

**Phase 1: Layout**
- Grouped settings list
- Section headers with descriptions
- Consistent toggle alignment

**Phase 2: Components**
- Build SettingsToggle variants
- Create section with description layout
- Implement navigation item with value

**Phase 3: Integration**
- Connect to notification preferences store
- Handle permission requests
- Save preferences on toggle change
- Debounce rapid toggles

### 10. Open Issues
- [ ] "50% OFF" in Offers - this appears to be promotional, clarify purpose
- [ ] Sound description grammar: "check for sounds" - should be "play sounds"?
- [ ] What happens when master push is off but individual ones are on?

---

## Cross-Screen Analysis

### Shared Components Identified
| Component | Used In | Notes |
|-----------|---------|-------|
| `Header` | 142, 143, 144 | Back button + title pattern |
| `SectionHeader` | 142, 144 | Settings group header |
| `SettingsItem` | 142, 144 | Navigation/toggle row |
| `ToggleSwitch` | 142, 143, 144 | On/off toggle |
| `BottomNavigation` | 141 | Main app navigation |

### State Management Strategy
- **Profile Dashboard**: Global user profile store
- **Account Settings**: Settings store with persistence
- **Personal Information**: Form state with validation
- **Notification Settings**: Notification preferences store

### New Issues Found

| Issue # | Screen | Severity | Description |
|---------|--------|----------|-------------|
| #34 | 141 | CRITICAL | "Shinomiya Kaguya" is anime character name |
| #35 | 141 | HIGH | Age 17y shown - using minor as placeholder |
| #36 | 141, 143 | MEDIUM | Weight inconsistency: 48kg vs 90kg |
| #37 | 144 | LOW | Sound description grammar issue |

---

## Progress Update
- **Smart Notifications**: 7/7 ✅ COMPLETE
- **Profile Settings & Help Center**: 4/13 (Started)
- **Total Progress**: 144/153 screens (94%)
