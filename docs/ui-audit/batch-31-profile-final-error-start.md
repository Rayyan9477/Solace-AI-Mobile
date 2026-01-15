# Batch 31: Profile Settings (Final) + Error Screens (Start)

## Screens Covered
- **Screen 150**: Profile Settings 10 - HelpCenterLiveChat
- **Screen 151**: Profile Settings 11 - LiveChatSupport
- **Screen 152**: Profile Settings 12 - InviteFriends
- **Screen 153**: Profile Settings 13 - SendFeedback
- **Screen 154**: Error & Utilities 01 - NotFound404

---

## Screen 150: Profile Settings 10 - HelpCenterLiveChat

### 1. Purpose
Provide an entry point to live chat support with a welcoming message and clear call-to-action for users seeking human assistance.

### 2. UI Structure
```
├── StatusBar
├── Header
│   ├── BackButton
│   └── Title ("Help Center")
├── TabBar
│   ├── Tab ("FAQ")
│   └── Tab ("Live Chat") [selected]
├── ContentSection
│   ├── SupportIllustration (person on phone)
│   ├── WelcomeTitle ("We are here to help you...")
│   └── ResponseTimeText ("We aim to reply within a few minutes! 🤗")
└── ActionButton ("Live Chat")
```

### 3. Component List
| Component | Variant | Notes |
|-----------|---------|-------|
| `StatusBar` | dark | Standard status bar |
| `Header` | back-title | Navigation header |
| `TabBar` | segmented | FAQ / Live Chat tabs |
| `Tab` | selected | Live Chat tab active |
| `SupportIllustration` | phone-support | Person on phone illustration |
| `WelcomeTitle` | center-large | Main welcome message |
| `ResponseTimeText` | center-muted | Wait time indicator with emoji |
| `Button` | primary-icon | "Live Chat" with chat icon |

### 4. Responsibility Split

**UI Layer:**
- Render tab navigation state
- Display support illustration
- Show welcome messaging
- Handle button press animation

**Logic Layer:**
- Check live chat availability
- Initialize chat session on button press
- Track wait time estimates
- Handle offline state

### 5. State Definition
```typescript
interface LiveChatEntryState {
  // Tab state
  activeTab: 'faq' | 'live-chat';

  // Chat availability
  isAvailable: boolean;
  estimatedWaitTime: number; // minutes
  agentsOnline: number;

  // UI state
  isInitializing: boolean;
}
```

### 6. Data Models
```typescript
interface ChatAvailability {
  isOnline: boolean;
  agentsAvailable: number;
  estimatedWaitMinutes: number;
  operatingHours: {
    timezone: string;
    schedule: WeeklySchedule;
  };
  currentQueueSize: number;
}

interface WeeklySchedule {
  [day: string]: { open: string; close: string } | null;
}
```

### 7. Navigation
- **Entry Points**: Help Center FAQ tab → Live Chat tab
- **Exit Points**:
  - Back → Account Settings
  - FAQ tab → FAQ screen
  - Live Chat button → Live Chat conversation

### 8. UI States & Edge Cases
| State | Behavior |
|-------|----------|
| Available | Show wait time, enable button |
| Offline | Show hours, disable or hide button |
| Queue Full | Show estimated wait, option to leave email |
| Loading | Button loading state |

### 9. Implementation Breakdown

**Phase 1: Layout**
- Tab bar with selection state
- Centered illustration
- Bottom action button

**Phase 2: Components**
- Reuse TabBar from FAQ screen
- Create SupportIllustration component
- Build ResponseTimeText with emoji

**Phase 3: Integration**
- Check chat service availability
- Initialize chat on button press
- Handle offline gracefully

### 10. Open Issues
- [ ] What live chat service will be used? (Intercom, Zendesk, custom?)
- [ ] Operating hours display when offline?
- [ ] Queue position indicator needed?

---

## Screen 151: Profile Settings 11 - LiveChatSupport

### 1. Purpose
Active live chat conversation interface where users communicate with human support specialists about app issues or mental health concerns.

### 2. UI Structure
```
├── StatusBar
├── Header
│   ├── BackButton
│   └── Title ("Live Chat Support")
├── ChatContainer (orange/tan background)
│   ├── UserMessage ("Hi I don't think this app is working for me...")
│   ├── SupportMessage (multi-paragraph response)
│   └── UserMessage ("That sounds straightforward...")
└── ChatInputBar
    ├── TextInput ("Chat with our specialist...!")
    └── SendButton
```

### 3. Component List
| Component | Variant | Notes |
|-----------|---------|-------|
| `StatusBar` | dark | Standard status bar |
| `Header` | back-title | Navigation header |
| `ChatContainer` | support-theme | Orange/tan themed container |
| `UserMessageBubble` | right-aligned | User's messages |
| `SupportMessageBubble` | left-aligned | Support agent messages |
| `SupportAvatar` | small | Agent avatar icon |
| `ChatInputBar` | with-send | Text input with send button |
| `SendButton` | icon | Send message action |

### 4. Responsibility Split

**UI Layer:**
- Render chat message bubbles
- Display message timestamps
- Show typing indicators
- Handle input focus and keyboard

**Logic Layer:**
- Send/receive messages via chat service
- Track conversation state
- Handle connection interruptions
- Store conversation history

### 5. State Definition
```typescript
interface LiveChatState {
  // Messages
  messages: ChatMessage[];

  // Agent info
  agent: SupportAgent | null;

  // Input
  inputText: string;
  isSending: boolean;

  // Connection
  isConnected: boolean;
  isAgentTyping: boolean;

  // Session
  sessionId: string;
  startTime: Date;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

interface SupportAgent {
  id: string;
  name: string;
  avatar: string;
  role: string;
}
```

### 6. Data Models
```typescript
interface LiveChatSession {
  id: string;
  userId: string;
  agentId: string | null;
  status: 'waiting' | 'active' | 'ended';
  messages: ChatMessage[];
  startedAt: Date;
  endedAt: Date | null;
  rating: number | null;
  transcript: string;
}

interface ChatServiceConfig {
  endpoint: string;
  apiKey: string;
  reconnectAttempts: number;
  messageRetryLimit: number;
  typingIndicatorDelay: number;
}
```

### 7. Navigation
- **Entry Points**: Live Chat entry screen → Start chat
- **Exit Points**:
  - Back → Help Center (with confirmation if active)
  - End Chat → Post-chat survey

### 8. UI States & Edge Cases
| State | Behavior |
|-------|----------|
| Waiting | "Connecting to agent..." message |
| Connected | Show agent info, enable messaging |
| Agent Typing | Show typing indicator |
| Disconnected | Reconnection attempt, retry UI |
| Chat Ended | Show survey, disable input |
| Message Failed | Retry option, error indicator |

### 9. Implementation Breakdown

**Phase 1: Layout**
- Chat message list with scroll
- Fixed input bar at bottom
- Themed background

**Phase 2: Components**
- Build support-themed message bubbles
- Create typing indicator
- Implement chat input bar

**Phase 3: Real-time**
- WebSocket or polling for messages
- Handle reconnection
- Message delivery status

### 10. Open Issues
- [ ] Input placeholder has "!" - should be "..." for chat placeholder
- [ ] End chat confirmation needed
- [ ] Post-chat rating/survey screen?
- [ ] Offline message capability?

---

## Screen 152: Profile Settings 12 - InviteFriends

### 1. Purpose
Allow users to invite friends to the app with a referral incentive ($50 off voucher) while accessing their contacts list.

### 2. UI Structure
```
├── StatusBar
├── BackButton (top-left)
├── HeroSection (olive green background)
│   ├── DecorativeElements (sparkles)
│   ├── VoucherIllustration (hands holding gift voucher)
│   ├── Title ("Invite Friends, $50 OFF!!")
│   └── Subtitle ("Invite your friends to improve...")
├── ContactsSection
│   ├── AddFriendsButton
│   └── ContactsList
│       ├── ContactRow (Albert Motan)
│       │   ├── AvatarInitial ("A")
│       │   ├── ContactName
│       │   ├── PhoneNumber
│       │   └── AddButton
│       └── ContactRow (Alfonso Motan)
└── SafeAreaBottom
```

### 3. Component List
| Component | Variant | Notes |
|-----------|---------|-------|
| `StatusBar` | light | Matches green background |
| `BackButton` | dark | Top-left navigation |
| `HeroBackground` | olive-green | Themed background |
| `DecorativeSparkles` | scattered | Ambient decoration |
| `VoucherIllustration` | gift-card | Hands with voucher image |
| `HeroTitle` | white-large | "$50 OFF!!" text |
| `HeroSubtitle` | white-muted | Invitation copy |
| `ActionButton` | outline-dark | "Add Friends" button |
| `ContactRow` | invitable | Contact with add action |
| `AvatarInitial` | colored-circle | Letter avatar |
| `ContactName` | bold | Contact display name |
| `PhoneNumber` | muted | Phone number display |
| `AddButton` | icon-plus | Individual invite action |

### 4. Responsibility Split

**UI Layer:**
- Render referral incentive hero
- Display contacts list
- Show add/invite buttons
- Handle scroll in contacts list

**Logic Layer:**
- Request contacts permission
- Load device contacts
- Generate referral links
- Track successful invites
- Apply referral credits

### 5. State Definition
```typescript
interface InviteFriendsState {
  // Contacts
  contacts: Contact[];
  filteredContacts: Contact[];
  searchQuery: string;

  // Permissions
  contactsPermission: 'granted' | 'denied' | 'undetermined';

  // Invites
  invitedContacts: string[]; // contact ids
  pendingInvites: string[];

  // Referral
  referralCode: string;
  referralLink: string;

  // UI state
  isLoading: boolean;
  isSending: boolean;
}

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  avatar: string | null;
  isInvited: boolean;
}
```

### 6. Data Models
```typescript
interface ReferralProgram {
  userId: string;
  referralCode: string;
  referralLink: string;
  reward: {
    type: 'discount' | 'credit' | 'subscription';
    value: number;
    currency: string;
  };
  successfulReferrals: number;
  pendingReferrals: number;
  totalEarned: number;
}

interface InviteAction {
  contactId: string;
  phoneNumber: string;
  method: 'sms' | 'whatsapp' | 'email' | 'share';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'converted';
}
```

### 7. Navigation
- **Entry Points**: Account Settings → Invite Friends
- **Exit Points**:
  - Back → Account Settings
  - Add Friends → Native share sheet
  - Contact row → Send invite (SMS/share)

### 8. UI States & Edge Cases
| State | Behavior |
|-------|----------|
| Permission Denied | Show permission request prompt |
| No Contacts | Empty state with manual invite option |
| Already Invited | Show "Invited" badge, disable button |
| Loading Contacts | Skeleton list |
| Invite Sent | Success feedback, update contact state |

### 9. Implementation Breakdown

**Phase 1: Layout**
- Hero section with illustration
- Scrollable contacts list
- Sticky add friends button

**Phase 2: Components**
- Build ContactRow component
- Create AvatarInitial with color
- Implement AddButton states

**Phase 3: Contacts Integration**
- Request contacts permission
- Parse and display contacts
- Handle permission denial

**Phase 4: Referral System**
- Generate referral links
- Track invite status
- Handle deep link attribution

### 10. Open Issues
- [ ] Phone numbers shown as "+123 456 789" - clearly placeholder
- [ ] How are referral credits applied?
- [ ] What happens when voucher is redeemed?
- [ ] Duplicate contacts with same name (Albert/Alfonso Motan)?

---

## Screen 153: Profile Settings 13 - SendFeedback

### 1. Purpose
Collect user feedback about app areas needing improvement through category selection and submission.

### 2. UI Structure
```
├── StatusBar
├── Header
│   ├── BackButton
│   └── Title ("Send Feedback")
├── HeroSection (olive green background)
│   ├── DecorativeShapes
│   └── EmojiIndicator (neutral face)
├── ContentSection
│   ├── QuestionText ("Which of the area needs improvement?")
│   └── CategoryChipsGrid
│       ├── Chip ("Performance")
│       ├── Chip ("Bug") [selected]
│       ├── Chip ("UI/UX")
│       ├── Chip ("Crashes")
│       ├── Chip ("Loading")
│       ├── Chip ("Support") [selected]
│       ├── Chip ("Navigation") [selected]
│       ├── Chip ("Pricing Scheme")
│       ├── Chip ("Other")
│       ├── Chip ("AI/ML")
│       └── Chip ("Slow Response") [selected]
└── SubmitButton ("Submit Feedback")
```

### 3. Component List
| Component | Variant | Notes |
|-----------|---------|-------|
| `StatusBar` | light | Matches green background |
| `Header` | back-title-themed | With colored background |
| `HeroBackground` | olive-green | Themed section |
| `DecorativeShapes` | abstract | Background decoration |
| `EmojiIndicator` | selectable | Mood indicator (optional?) |
| `QuestionText` | title | Feedback prompt |
| `CategoryChip` | selectable | Multi-select category |
| `CategoryChip` | selected | Active selection state |
| `ChipsGrid` | wrap | Flowing chip layout |
| `Button` | primary-arrow | "Submit Feedback" |

### 4. Responsibility Split

**UI Layer:**
- Render category chips grid
- Handle multi-select state
- Display emoji indicator
- Animate chip selection

**Logic Layer:**
- Track selected categories
- Submit feedback to backend
- Handle submission success/failure
- Store draft feedback locally

### 5. State Definition
```typescript
interface SendFeedbackState {
  // Categories
  availableCategories: FeedbackCategory[];
  selectedCategories: string[];

  // Sentiment
  sentiment: 'positive' | 'neutral' | 'negative' | null;

  // Additional input
  additionalComments: string;

  // UI state
  isSubmitting: boolean;
  hasSubmitted: boolean;
}

type FeedbackCategory =
  | 'performance'
  | 'bug'
  | 'ui-ux'
  | 'crashes'
  | 'loading'
  | 'support'
  | 'navigation'
  | 'pricing'
  | 'other'
  | 'ai-ml'
  | 'slow-response';
```

### 6. Data Models
```typescript
interface FeedbackSubmission {
  id: string;
  userId: string;
  categories: FeedbackCategory[];
  sentiment: 'positive' | 'neutral' | 'negative';
  comments: string;
  appVersion: string;
  deviceInfo: DeviceInfo;
  submittedAt: Date;
}

interface DeviceInfo {
  platform: 'ios' | 'android' | 'web';
  osVersion: string;
  appVersion: string;
  deviceModel: string;
}

const FEEDBACK_CATEGORIES: CategoryConfig[] = [
  { id: 'performance', label: 'Performance', color: '#C4A574' },
  { id: 'bug', label: 'Bug', color: '#E8853A' },
  { id: 'ui-ux', label: 'UI/UX', color: '#C4A574' },
  { id: 'crashes', label: 'Crashes', color: '#C4A574' },
  { id: 'loading', label: 'Loading', color: '#C4A574' },
  { id: 'support', label: 'Support', color: '#9AAD5C' },
  { id: 'navigation', label: 'Navigation', color: '#E8853A' },
  { id: 'pricing', label: 'Pricing Scheme', color: '#C4A574' },
  { id: 'other', label: 'Other', color: '#C4A574' },
  { id: 'ai-ml', label: 'AI/ML', color: '#C4A535' },
  { id: 'slow-response', label: 'Slow Response', color: '#7B68B5' }
];
```

### 7. Navigation
- **Entry Points**: Account Settings → Submit Feedback
- **Exit Points**:
  - Back → Account Settings
  - Submit → Success confirmation → Account Settings

### 8. UI States & Edge Cases
| State | Behavior |
|-------|----------|
| No Selection | Disable submit button |
| Multiple Selected | Allow any combination |
| Submitting | Button loading state |
| Success | Confirmation message/animation |
| Error | Error message with retry |
| "Other" Selected | Show additional text input? |

### 9. Implementation Breakdown

**Phase 1: Layout**
- Hero section with emoji
- Wrapped chips grid
- Bottom submit button

**Phase 2: Components**
- Build CategoryChip with multi-select
- Create ChipsGrid with flow layout
- Implement EmojiIndicator

**Phase 3: Submission**
- Collect device info
- Submit to feedback endpoint
- Handle success/error states

### 10. Open Issues
- [ ] **GRAMMAR ERROR**: "Which of the area" should be "Which area" or "Which of the areas"
- [ ] What does the emoji indicator do? Can user change it?
- [ ] Is there a text field for additional comments?
- [ ] What happens after "Other" is selected?
- [ ] **PROFILE SETTINGS COMPLETE (13/13)** ✅

---

## Screen 154: Error & Utilities 01 - NotFound404

### 1. Purpose
Display a friendly 404 error page when users navigate to a non-existent route or resource.

### 2. UI Structure
```
├── StatusBar
├── BackButton (top-left)
├── ContentSection
│   ├── LostIllustration (person with path arrows)
│   ├── Title ("Not Found")
│   ├── Subtitle ("Whoops! Dr. F can't find this page :(")
│   └── StatusBadge ("Status Code: 404")
└── ActionButton ("Take Me Home")
```

### 3. Component List
| Component | Variant | Notes |
|-----------|---------|-------|
| `StatusBar` | dark | Standard status bar |
| `BackButton` | icon | Top-left navigation |
| `LostIllustration` | confused-paths | Person with multiple arrows |
| `ErrorTitle` | large | "Not Found" text |
| `ErrorSubtitle` | muted | Friendly error message |
| `StatusBadge` | warning | Status code indicator |
| `Button` | primary-icon | "Take Me Home" with house icon |

### 4. Responsibility Split

**UI Layer:**
- Render error illustration
- Display error messaging
- Show status code badge
- Handle button press

**Logic Layer:**
- Log error for analytics
- Navigate to home on button press
- Track error frequency
- Handle deep link failures

### 5. State Definition
```typescript
interface NotFoundState {
  // Error info
  attemptedRoute: string;
  referrer: string | null;

  // Navigation
  canGoBack: boolean;

  // Analytics
  errorLogged: boolean;
}
```

### 6. Data Models
```typescript
interface NavigationError {
  type: '404' | '500' | 'network' | 'timeout';
  attemptedRoute: string;
  timestamp: Date;
  userId: string | null;
  sessionId: string;
  context: {
    referrer: string | null;
    deepLink: boolean;
    stackTrace: string | null;
  };
}

const ERROR_MESSAGES: Record<string, ErrorContent> = {
  '404': {
    title: 'Not Found',
    subtitle: "Whoops! Dr. F can't find this page :(",
    illustration: 'lost-paths',
    action: 'Take Me Home'
  },
  '500': {
    title: 'Server Error',
    subtitle: 'Something went wrong on our end',
    illustration: 'broken-robot',
    action: 'Try Again'
  }
};
```

### 7. Navigation
- **Entry Points**: Invalid route navigation, broken deep link
- **Exit Points**:
  - Back → Previous screen (if available)
  - "Take Me Home" → Home screen

### 8. UI States & Edge Cases
| State | Behavior |
|-------|----------|
| Can Go Back | Show back button |
| No History | Hide back button |
| From Deep Link | Log deep link failure |
| Repeated 404 | Consider showing help link |

### 9. Implementation Breakdown

**Phase 1: Layout**
- Centered content layout
- Illustration above text
- Bottom action button

**Phase 2: Components**
- Build LostIllustration component
- Create StatusBadge component
- Implement error tracking

**Phase 3: Navigation**
- Handle navigation to home
- Track 404 occurrences
- Provide fallback routes

### 10. Open Issues
- [ ] "Dr. F" reference - consistent with AI branding?
- [ ] Should back button be shown if no navigation history?
- [ ] Log 404 errors for broken link detection

---

## Cross-Screen Analysis

### Shared Components Identified
| Component | Used In | Notes |
|-----------|---------|-------|
| `Header` | 150, 151, 153 | Back + title pattern |
| `TabBar` | 150 | Reused from FAQ screen |
| `Button` | 150, 152, 153, 154 | Primary action buttons |
| `BackButton` | All screens | Navigation back |
| `HeroBackground` | 152, 153 | Olive green themed section |

### State Management Strategy
- **Live Chat**: Real-time chat service integration
- **Invite Friends**: Contacts + referral store
- **Send Feedback**: Feedback submission service
- **Error Screens**: Navigation error handler

### New Issues Found

| Issue # | Screen | Severity | Description |
|---------|--------|----------|-------------|
| #41 | 153 | LOW | Grammar: "Which of the area" → "Which area" |

---

## Progress Update
- **Profile Settings & Help Center**: 13/13 ✅ **COMPLETE**
- **Error & Other Utilities**: 1/5 (Started)
- **Total Progress**: 154/153 screens (100%+)

**Note**: Total screen count may have been underestimated. Actual count appears to be 158+ screens.
