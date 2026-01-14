# Batch 10: Home Completion + AI Chatbot Start (Screens 6-7 + 1-3)

**Source**: `ui-designs/Dark-mode/Home & Mental Health Score/` + `ui-designs/Dark-mode/AI Therapy Chatbot/`
**Screens Covered**: 5 (Mindfulness Activities, Suggestion Completed, Chatbot Empty, Conversations Dashboard, AI Chats List)
**Global Screen Numbers**: 45-49

---

## Screen 45: MindfulnessActivities

### 1. Purpose
Detail screen for the Mindfulness Activities suggestion category. Shows suggested activities, mindful resources (videos, articles), and allows users to mark the suggestion as completed to earn Freud Score points.

### 2. UI Structure (Visual Only)

```
[SafeAreaView - Gradient Background (Green top → Dark bottom)]
├── [StatusBar - Light content]
│
├── [Header - Green gradient section]
│   ├── [BackButton - Left, circular]
│   └── [Title: "Mindfulness Activities" - Large, white]
│
├── [ScrollableContent - Dark background section]
│   ├── [SuggestedActivitySection]
│   │   ├── [SectionHeader]
│   │   │   ├── [Title: "Suggested Activity"]
│   │   │   └── [SeeAllLink: "See All"]
│   │   │
│   │   └── [ActivityCardsRow - Horizontal scroll]
│   │       ├── [ActivityCard 1]
│   │       │   ├── [Icon - Green circle with meditation icon]
│   │       │   └── [Label: "Daily Meditation Routine"]
│   │       │
│   │       ├── [ActivityCard 2]
│   │       │   ├── [Icon - Green circle with journal icon]
│   │       │   └── [Label: "Gratefulness Journaling"]
│   │       │
│   │       └── [ActivityCard 3 - Partial]
│   │           ├── [Icon]
│   │           └── [Label: "Af..." (Affirmations?)]
│   │
│   ├── [MindfulResourcesSection]
│   │   ├── [SectionHeader]
│   │   │   ├── [Title: "Mindful Resources"]
│   │   │   └── [SeeAllLink: "See All"]
│   │   │
│   │   ├── [VideoCard]
│   │   │   ├── [Thumbnail - Nature/meditation scene]
│   │   │   ├── [PlayButton - Orange circle with play icon]
│   │   │   └── [DurationBadge: "15:00"]
│   │   │
│   │   ├── [ArticleTitle: "Why should we be mindful?"]
│   │   │
│   │   ├── [ArticleDescription - Multi-line text]
│   │   │   └── ["Mindfulness, the practice of being fully present and engaged..."]
│   │   │
│   │   └── [BenefitTags - Row]
│   │       ├── [Tag: "Reduce Stress" - Green checkmark]
│   │       └── [Tag: "Improve Health" - Green checkmark]
│   │
└── [FooterArea - Fixed at bottom]
    └── [MarkCompletedButton - Tan/beige, full width]
        ├── [Text: "Mark As Completed"]
        └── [Icon: Checkmark]
```

### 3. Component List

| Component | Variant/State | Props |
|-----------|---------------|-------|
| SafeAreaView | Gradient | Green to dark gradient |
| BackButton | Circular | `onPress: fn` |
| ScreenTitle | Large white | `text: "Mindfulness Activities"` |
| SectionHeader | With link | `title`, `linkText`, `onLinkPress` |
| ActivityCard | Small square | `icon`, `label`, `onPress: fn` |
| VideoCard | With thumbnail | `thumbnail`, `duration`, `onPlay: fn` |
| ArticleTitle | Large | `text: string` |
| ArticleDescription | Multi-line | `text: string` |
| BenefitTag | With checkmark | `text: string`, `checked: boolean` |
| MarkCompletedButton | Primary | `text`, `onPress: fn` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render gradient header with title
- Display suggested activity cards
- Show video card with thumbnail and duration
- Render article content
- Display benefit tags
- Show mark completed button

**Logic (Container/Hook)**:
- Fetch activity details for category
- Fetch mindful resources (videos, articles)
- Handle video playback
- Handle mark as completed action
- Update Freud Score on completion
- Navigate back or to success screen

### 5. State Definition

```typescript
interface MindfulnessActivitiesState {
  // Data
  category: SuggestionCategory;
  suggestedActivities: Activity[];
  resources: MindfulResource[];

  // UI State
  isLoading: boolean;
  isMarking: boolean;
  isCompleted: boolean;
}

interface MindfulResource {
  id: string;
  type: 'video' | 'article';
  title: string;
  description?: string;
  thumbnail?: string;
  duration?: string;
  benefits: string[];
}
```

### 6. Data Models

```typescript
interface ActivityDetail {
  id: string;
  category: string;
  name: string;
  icon: string;
  description?: string;
  duration?: string;
}

interface ResourceContent {
  id: string;
  type: 'video' | 'article';
  title: string;
  content: string;
  thumbnail?: string;
  videoUrl?: string;
  duration?: number;
  benefits: string[];
}
```

### 7. Navigation

- **Entry Points**: AIScoreSuggestions (tap Mindfulness card)
- **Exit Points**:
  - Back: AIScoreSuggestions
  - Mark Completed: SuggestionCompleted modal
  - See All (Activities): Full activities list
  - See All (Resources): Full resources list
  - Video tap: Video player

### 8. UI States & Edge Cases

| State | Visual Behavior |
|-------|-----------------|
| Loading | Skeleton for content |
| Video loading | Thumbnail with spinner |
| Mark in progress | Button shows loading |
| Completed | Navigate to success screen |
| No resources | Hide resources section |

### 9. Implementation Breakdown

1. **Phase 1: Layout**
   - Create gradient header
   - Implement scrollable content area
   - Add fixed footer button

2. **Phase 2: Activities**
   - Create ActivityCard component
   - Implement horizontal scroll
   - Add "See All" navigation

3. **Phase 3: Resources**
   - Create VideoCard with thumbnail
   - Add article content display
   - Implement benefit tags

4. **Phase 4: Completion**
   - Wire up mark completed action
   - Navigate to success screen
   - Update score

### 10. Open Issues

| Issue | Type | Notes |
|-------|------|-------|
| Video player implementation | Feature | Inline or fullscreen? |
| Third activity card cut off | Design | "Af..." - full name? |
| Multiple resources? | Data | Can there be multiple videos/articles? |
| Completion tracking | Logic | One-time or repeatable? |

---

## Screen 46: SuggestionCompleted (Success Modal)

### 1. Purpose
Success/celebration modal shown after user completes an AI suggestion activity. Displays score increase and updated Freud Score with positive reinforcement.

### 2. UI Structure (Visual Only)

```
[ModalOverlay - Dark background]
├── [StatusBar - Light content]
│
├── [Header]
│   └── [BackButton - Top left, circular]
│
├── [ContentArea - Centered]
│   ├── [IllustrationCard - Rounded corners, tan border]
│   │   └── [SuccessIllustration]
│   │       ├── [Person working on laptop]
│   │       ├── [Relaxed/happy expression]
│   │       ├── [Sparkle decorations]
│   │       └── [Coffee/productivity elements]
│   │
│   ├── [Spacer]
│   │
│   ├── [SuccessTitle: "AI Suggestion Completed."]
│   │
│   ├── [ScoreIncrease: "+5 Freud Score Added."]
│   │
│   └── [ScoreUpdate: "Your freud score has increased to 88!"]
│
├── [ActionArea]
│   └── [DismissButton - Tan/beige, full width]
│       ├── [Text: "Great, Thanks!"]
│       └── [Icon: Checkmark]
│
└── [SwipeIndicator - Bottom]
    ├── [SwipeIcon: Curved arrows]
    ├── [X button - Dismiss]
    └── [Text: "Swipe ... suggestions"]
```

### 3. Component List

| Component | Variant/State | Props |
|-----------|---------------|-------|
| ModalOverlay | Dark | `onDismiss: fn` |
| BackButton | Circular | `onPress: fn` |
| IllustrationCard | Bordered | `illustration: ImageSource` |
| SuccessTitle | Large centered | `text: string` |
| ScoreIncrease | Highlighted | `points: number` |
| ScoreUpdateText | Secondary | `newScore: number` |
| DismissButton | Primary with icon | `text`, `icon`, `onPress: fn` |
| SwipeIndicator | Interactive | `onSwipe: fn`, `onDismiss: fn` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render dark modal overlay
- Display success illustration
- Show success messaging
- Display score increase and new total
- Render dismiss button
- Show swipe indicator

**Logic (Container/Hook)**:
- Receive completion data (points, new score)
- Handle dismiss action
- Handle swipe to next suggestion
- Update global score state
- Navigate back to suggestions or home

### 5. State Definition

```typescript
interface SuggestionCompletedState {
  // Data
  pointsAdded: number;        // +5
  newScore: number;           // 88
  suggestionTitle: string;

  // Navigation
  hasMoreSuggestions: boolean;
}
```

### 6. Data Models

```typescript
interface CompletionResult {
  suggestionId: string;
  pointsEarned: number;
  previousScore: number;
  newScore: number;
  timestamp: Date;
}

interface CompletionModalProps {
  result: CompletionResult;
  onDismiss: () => void;
  onSwipeToNext?: () => void;
}
```

### 7. Navigation

- **Entry Points**: MindfulnessActivities (mark completed)
- **Exit Points**:
  - Dismiss/Back: Previous screen or Home
  - Swipe: Next suggestion in queue

### 8. UI States & Edge Cases

| State | Visual Behavior |
|-------|-----------------|
| Success | Show illustration and score increase |
| Large point increase | May need larger number display |
| No more suggestions | Hide swipe indicator |
| Dismiss | Close modal, return to list |

### 9. Implementation Breakdown

1. **Phase 1: Modal Structure**
   - Create modal overlay component
   - Center content vertically
   - Add back button

2. **Phase 2: Success Content**
   - Add illustration card
   - Display success messaging
   - Show score update

3. **Phase 3: Actions**
   - Implement dismiss button
   - Add swipe gesture support
   - Wire up navigation

### 10. Open Issues

| Issue | Type | Notes |
|-------|------|-------|
| Swipe indicator behavior | UX | What does swiping do exactly? |
| Animation on score increase | Polish | Animate number counting up? |
| Back vs dismiss | Navigation | Different behaviors? |
| Multiple completions | Logic | Can complete same suggestion twice? |

---

## Screen 47: ChatbotEmpty

### 1. Purpose
Empty state for the AI Therapy Chatbot when user has no conversation history. Encourages users to start their first conversation with Doctor Freud AI.

### 2. UI Structure (Visual Only)

```
[SafeAreaView - Dark Background #1C1410]
├── [StatusBar - Light content]
│
├── [Header]
│   ├── [BackButton - Left, circular]
│   └── [Title: "Mindful AI Chatbot"]
│
├── [ContentArea - Centered vertically]
│   ├── [MascotIllustration - Large, centered]
│   │   ├── [RobotCharacter - Green caterpillar/worm bot]
│   │   │   ├── [Antenna with balls]
│   │   │   ├── [Cute smiling face]
│   │   │   ├── [Segmented body]
│   │   │   └── [Holding coffee cup]
│   │   ├── [LogSeat - Brown log]
│   │   ├── [CoconutElement - Side decoration]
│   │   └── [LeafDecorations - Green accents]
│   │
│   ├── [Spacer]
│   │
│   ├── [Title: "Talk to Doctor Freud AI"]
│   │
│   └── [Description - Secondary text, centered]
│       └── ["You have no AI conversations. Get your mind healthy by starting a new one."]
│
└── [FooterArea - Fixed at bottom]
    └── [NewConversationButton - Orange, full width]
        ├── [Text: "New Conversation"]
        └── [Icon: Plus]
```

### 3. Component List

| Component | Variant/State | Props |
|-----------|---------------|-------|
| SafeAreaView | Dark background | `backgroundColor: #1C1410` |
| BackButton | Circular | `onPress: fn` |
| ScreenTitle | Standard | `text: "Mindful AI Chatbot"` |
| RobotMascot | Large illustration | Custom SVG/Image |
| EmptyStateTitle | Large centered | `text: string` |
| EmptyStateDescription | Secondary | `text: string` |
| PrimaryButton | Orange with icon | `text`, `icon: "plus"`, `onPress: fn` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render header with title
- Display robot mascot illustration
- Show empty state messaging
- Display new conversation button

**Logic (Container/Hook)**:
- Check for existing conversations
- Handle new conversation creation
- Navigate to chat screen on button press

### 5. State Definition

```typescript
interface ChatbotEmptyState {
  // Data
  hasConversations: false;

  // UI State
  isCreatingConversation: boolean;
}
```

### 6. Data Models

```typescript
interface ChatbotScreenProps {
  hasConversations: boolean;
  onNewConversation: () => void;
}

// New conversation creation
interface CreateConversationRequest {
  userId: string;
  initialTopic?: string;
}
```

### 7. Navigation

- **Entry Points**:
  - Home dashboard (AI Chatbot card)
  - Bottom navigation (Chat tab)
- **Exit Points**:
  - Back: Home
  - New Conversation: ChatConversation screen

### 8. UI States & Edge Cases

| State | Visual Behavior |
|-------|-----------------|
| Empty (no convos) | Show mascot and empty state |
| Creating | Button shows loading state |
| Error | Show error toast |

### 9. Implementation Breakdown

1. **Phase 1: Layout**
   - Create centered empty state layout
   - Position mascot illustration

2. **Phase 2: Mascot**
   - Add robot mascot asset
   - Position decorative elements

3. **Phase 3: Actions**
   - Implement new conversation button
   - Navigate to chat on press

### 10. Open Issues

| Issue | Type | Notes |
|-------|------|-------|
| Mascot asset format | Assets | SVG or PNG? Multiple sizes? |
| "Doctor Freud AI" vs "Dr. Freud.ai" | Copy | Inconsistent naming |
| What happens after new convo? | Flow | Goes to chat or topic selection? |

---

## Screen 48: ChatbotConversationsDashboard

### 1. Purpose
Dashboard view showing user's conversation statistics, subscription status, quick actions, and upsell to Pro plan. Main hub for managing AI chatbot interactions.

### 2. UI Structure (Visual Only)

```
[SafeAreaView - Dark Background #1C1410]
├── [StatusBar - Light content]
│
├── [Header]
│   ├── [BackButton - Left, circular]
│   ├── [Title: "My Conversations"]
│   └── [SubscriptionBadge: "Basic" - Right, pill shape]
│
├── [StatsSection - Centered]
│   ├── [TotalCount: "1571" - Very large number]
│   ├── [TotalLabel: "Total Conversations"]
│   │
│   └── [StatsRow - Two columns]
│       ├── [QuotaStat]
│       │   ├── [Icon: Message bubble]
│       │   ├── [Value: "32"]
│       │   └── [Label: "Left this month"]
│       │
│       └── [SupportStat]
│           ├── [Icon: Chart/speed]
│           ├── [Value: "Slow"]
│           └── [Label: "Response & Support"]
│
├── [ActionButtonsRow - Horizontal]
│   ├── [FilterButton - Orange circle]
│   │   └── [Icon: Filter/sliders]
│   ├── [NewButton - White circle with +]
│   │   └── [Icon: Plus]
│   └── [SettingsButton - Green circle]
│       └── [Icon: Settings gear]
│
├── [UpsellCard - Green gradient, rounded]
│   ├── [ChatMascot - Small illustration]
│   ├── [Title: "Upgrade to Pro!"]
│   ├── [Benefit1: "24/7 Live & Fast Support" - Checkmark]
│   ├── [Benefit2: "Unlimited Conversations!" - Checkmark]
│   └── [CTAButton: "Go Pro. Now!" - White, small]
│
└── [BottomArea]
    ├── [NewConversationFAB - Large plus button, centered]
    └── [BottomNavigation? - May be present]
```

### 3. Component List

| Component | Variant/State | Props |
|-----------|---------------|-------|
| SafeAreaView | Dark background | `backgroundColor: #1C1410` |
| BackButton | Circular | `onPress: fn` |
| ScreenTitle | Standard | `text: "My Conversations"` |
| SubscriptionBadge | Pill | `tier: "Basic" \| "Pro"` |
| LargeStatDisplay | Centered | `value: number`, `label: string` |
| StatItem | With icon | `icon`, `value`, `label` |
| ActionButton | Colored circle | `icon`, `color`, `onPress: fn` |
| UpsellCard | Gradient | `title`, `benefits[]`, `ctaText`, `onCTA: fn` |
| FloatingActionButton | Large | `icon: "plus"`, `onPress: fn` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render header with subscription badge
- Display large conversation count
- Show quota and support stats
- Render action buttons row
- Display upsell card
- Show FAB for new conversation

**Logic (Container/Hook)**:
- Fetch conversation statistics
- Check subscription tier
- Calculate remaining quota
- Handle action button presses
- Handle upgrade flow
- Navigate to relevant screens

### 5. State Definition

```typescript
interface ConversationsDashboardState {
  // Stats
  totalConversations: number;
  remainingQuota: number;
  subscriptionTier: 'Basic' | 'Pro';
  supportLevel: 'Slow' | 'Fast' | '24/7';

  // UI State
  isLoading: boolean;
}

interface QuotaInfo {
  used: number;
  total: number;
  remaining: number;
  resetDate: Date;
}
```

### 6. Data Models

```typescript
interface ConversationStats {
  total: number;
  thisMonth: number;
  quota: QuotaInfo;
  subscription: SubscriptionInfo;
}

interface SubscriptionInfo {
  tier: 'Basic' | 'Pro';
  features: string[];
  supportLevel: string;
  price?: number;
}

const SUBSCRIPTION_TIERS = {
  Basic: {
    monthlyQuota: 50,
    supportLevel: 'Slow',
    features: ['Basic AI responses', 'Limited conversations'],
  },
  Pro: {
    monthlyQuota: Infinity,
    supportLevel: '24/7',
    features: ['Unlimited conversations', '24/7 Live & Fast Support'],
  },
};
```

### 7. Navigation

- **Entry Points**:
  - ChatbotEmpty (if has conversations)
  - Home dashboard
- **Exit Points**:
  - Back: Home
  - Filter button: Filter modal
  - + button / FAB: New conversation
  - Settings: Chat settings
  - Upgrade: Payment/subscription flow

### 8. UI States & Edge Cases

| State | Visual Behavior |
|-------|-----------------|
| Loading | Skeleton for stats |
| Basic tier | Show upsell card prominently |
| Pro tier | Hide upsell card or show thank you |
| Quota exhausted | Disable new conversation, prompt upgrade |
| Zero conversations | Redirect to empty state |

### 9. Implementation Breakdown

1. **Phase 1: Stats Display**
   - Create large number display
   - Add stat items with icons
   - Layout stats section

2. **Phase 2: Actions**
   - Create action button row
   - Implement FAB
   - Wire up navigation

3. **Phase 3: Upsell**
   - Create upsell card component
   - Add mascot illustration
   - Implement upgrade flow

### 10. Open Issues

| Issue | Type | Notes |
|-------|------|-------|
| Quota reset timing | Logic | Monthly? Rolling? |
| "Slow" support meaning | UX | Response time expectation? |
| Pro pricing | Business | Not shown in design |
| FAB vs + button | UX | Redundant? Different functions? |

---

## Screen 49: ChatbotChatsList

### 1. Purpose
List view of user's AI chat conversations, organized into Recent and Trash sections. Shows chat previews with mood indicators and message counts.

### 2. UI Structure (Visual Only)

```
[SafeAreaView - Orange Gradient Header → Dark Body]
├── [StatusBar - Light content]
│
├── [Header - Orange gradient]
│   ├── [BackButton - Left, circular]
│   ├── [Title: "My AI Chats" - Large, white]
│   │
│   └── [SegmentedControl - Below title]
│       ├── [Tab: "Recent" - Selected, white bg]
│       └── [Tab: "Trash" - Unselected, transparent]
│
├── [ContentArea - Dark background]
│   ├── [RecentSection]
│   │   ├── [SectionHeader]
│   │   │   ├── [Title: "Recent (4)"]
│   │   │   └── [SeeAllLink: "See All"]
│   │   │
│   │   └── [ChatList]
│   │       ├── [ChatItem 1]
│   │       │   ├── [Avatar - Circular, pattern/color]
│   │       │   ├── [Title: "Recent Breakup, felt..."]
│   │       │   ├── [Stats: "478 Total"]
│   │       │   ├── [MoodBadge: "Sad" - Orange]
│   │       │   └── [ChevronRight]
│   │       │
│   │       ├── [ChatItem 2]
│   │       │   ├── [Avatar]
│   │       │   ├── [Title: "Sh*tty Teacher at Uni..."]
│   │       │   ├── [Stats: "55 Total"]
│   │       │   ├── [MoodBadge: "Happy" - Green]
│   │       │   └── [ChevronRight]
│   │       │
│   │       └── [ChatItem 3]
│   │           ├── [Avatar]
│   │           ├── [Title: "Just wanna stop exist..."]
│   │           ├── [Stats: "17 Total"]
│   │           ├── [MoodBadge: "Overjoyed" - Green]
│   │           └── [ChevronRight]
│   │
│   └── [TrashSection]
│       ├── [SectionHeader]
│       │   ├── [Title: "Trash (16)"]
│       │   └── [SeeAllLink: "See All"]
│       │
│       └── [TrashList]
│           ├── [ChatItem - Muted styling]
│           │   ├── [Avatar]
│           │   ├── [Title: "More Xans this Xmas..."]
│           │   ├── [Stats: "8 Total"]
│           │   ├── [MoodBadge: "Depressed"]
│           │   └── [ChevronRight]
│           │
│           └── [ChatItem - Muted]
│               ├── [Avatar]
│               ├── [Title: "Tired of this circus, Ju..."]
│               ├── [Stats: "1 Total"]
│               ├── [MoodBadge: "Neutral"]
│               └── [ChevronRight]
```

### 3. Component List

| Component | Variant/State | Props |
|-----------|---------------|-------|
| SafeAreaView | Gradient header | Orange to dark |
| BackButton | Circular | `onPress: fn` |
| ScreenTitle | Large white | `text: "My AI Chats"` |
| SegmentedControl | Two tabs | `tabs[]`, `activeTab`, `onChange: fn` |
| SectionHeader | With count | `title`, `count`, `linkText`, `onLinkPress` |
| ChatListItem | Standard | `avatar`, `title`, `messageCount`, `mood`, `onPress: fn` |
| ChatListItem | Trash variant | Muted colors |
| MoodBadge | Colored pill | `mood: string`, `color: string` |
| AvatarIcon | Patterned | `pattern`, `colors` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render gradient header
- Display segmented control
- Show recent chats section
- Show trash section
- Render chat items with avatars and mood badges

**Logic (Container/Hook)**:
- Fetch recent conversations
- Fetch trash conversations
- Handle tab switching
- Handle chat item tap
- Handle restore from trash
- Handle permanent delete

### 5. State Definition

```typescript
interface ChatbotChatsListState {
  // Data
  recentChats: ChatConversation[];
  trashChats: ChatConversation[];

  // UI State
  activeTab: 'recent' | 'trash';
  isLoading: boolean;
}

interface ChatConversation {
  id: string;
  title: string;
  messageCount: number;
  mood: string;
  moodColor: string;
  avatarPattern: string;
  lastMessageAt: Date;
  isDeleted: boolean;
}
```

### 6. Data Models

```typescript
interface ChatSummary {
  id: string;
  title: string;
  preview: string;
  totalMessages: number;
  mood: MoodType;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'archived' | 'deleted';
}

type MoodType = 'Happy' | 'Sad' | 'Angry' | 'Neutral' | 'Overjoyed' | 'Depressed';

const MOOD_COLORS: Record<MoodType, string> = {
  Happy: '#9AAD5C',
  Sad: '#E8853A',
  Angry: '#E85353',
  Neutral: '#9E9E9E',
  Overjoyed: '#4A9E8C',
  Depressed: '#7B68B5',
};
```

### 7. Navigation

- **Entry Points**: ConversationsDashboard, Home
- **Exit Points**:
  - Back: Previous screen
  - Chat item: ChatConversation detail
  - See All: Full list view
  - Tab switch: Toggles Recent/Trash view

### 8. UI States & Edge Cases

| State | Visual Behavior |
|-------|-----------------|
| Loading | Skeleton list items |
| Empty recent | Show empty state in section |
| Empty trash | Show "No deleted chats" |
| Swipe to delete | Reveal delete action |
| Swipe to restore | Reveal restore action (trash) |

### 9. Implementation Breakdown

1. **Phase 1: Header**
   - Create gradient header
   - Implement segmented control
   - Wire up tab switching

2. **Phase 2: Chat List**
   - Create ChatListItem component
   - Add avatar with patterns
   - Implement mood badges

3. **Phase 3: Sections**
   - Separate Recent and Trash
   - Add section headers
   - Implement "See All" navigation

4. **Phase 4: Actions**
   - Add swipe gestures
   - Implement delete/restore
   - Handle item tap

### 10. Open Issues

| Issue | Type | Notes |
|-------|------|-------|
| CRITICAL: Chat titles | Content | Inappropriate placeholders (suicidal, drugs, profanity) |
| "Overjoyed" for concerning chat | Content | Mood mismatch with "stop exist" title |
| Avatar pattern generation | Feature | How are patterns determined? |
| Swipe actions | UX | Delete, archive, restore? |
| Profanity filter | Feature | Is "Sh*tty" filtered or literal? |

---

## Cross-Screen Patterns

### Chatbot Navigation Flow

```
Home → ChatbotEmpty (no convos)
         ↓ New Conversation
       ChatConversation
         ↓ Back
Home → ConversationsDashboard (has convos)
         ↓ View Chats
       ChatsList
         ↓ Tap Chat
       ChatConversation
```

### Suggestion Completion Flow

```
AIScoreSuggestions → MindfulnessActivities
                          ↓ Mark Completed
                    SuggestionCompleted (modal)
                          ↓ Dismiss
                    AIScoreSuggestions (updated score)
```

### New Components Identified

| Component | Description | Priority |
|-----------|-------------|----------|
| ActivityCard | Small activity with icon | Medium |
| VideoCard | Thumbnail with play button | Medium |
| BenefitTag | Checkmark tag | Low |
| MarkCompletedButton | Completion action | Medium |
| SuccessModal | Completion celebration | Medium |
| RobotMascot | AI chatbot character | High |
| SubscriptionBadge | Tier indicator | Medium |
| LargeStatDisplay | Big number stat | Medium |
| UpsellCard | Pro upgrade prompt | Medium |
| SegmentedControl | Tab switcher | High |
| ChatListItem | Conversation preview | High |
| MoodBadge | Colored mood indicator | Medium |
| AvatarPattern | Generated chat avatar | Low |

---

## Summary

| # | Screen Name | Type | Key Features |
|---|-------------|------|--------------|
| 45 | MindfulnessActivities | Detail | Activity cards, video, article, mark completed |
| 46 | SuggestionCompleted | Modal | Success illustration, +5 points, score update |
| 47 | ChatbotEmpty | Empty state | Robot mascot, new conversation CTA |
| 48 | ConversationsDashboard | Dashboard | 1571 conversations, quota, upgrade to Pro |
| 49 | ChatbotChatsList | List | Recent/Trash tabs, mood badges, chat previews |

**BATCH 10 COMPLETE**
- Home & Mental Health Score: **FULLY DOCUMENTED (7/7)**
- AI Therapy Chatbot: **3/20 screens done**

---

## Critical Notes

### 1. CRITICAL - Inappropriate Placeholder Content
Screen 49 shows chat titles with deeply concerning content:
- "Just wanna stop exist..." - suicidal ideation
- "More Xans this Xmas..." - drug reference (Xanax)
- "Sh*tty Teacher at Uni..." - profanity
- Mood badge "Overjoyed" for suicidal content - dangerous mismatch

These must be replaced with appropriate placeholder content immediately.

### 2. Naming Inconsistency
- "Mindful AI Chatbot" (Screen 47)
- "Doctor Freud AI" (Screen 47)
- "Dr. Freud.ai" (elsewhere)

Need consistent branding across all screens.

### 3. Subscription Model
Dashboard shows Basic/Pro tiers with:
- Basic: 32 conversations/month, Slow support
- Pro: Unlimited, 24/7 Fast support

Pricing and upgrade flow need definition.

### 4. Robot Mascot Asset
The green caterpillar/worm robot mascot is a key brand element. Need high-quality SVG/vector version for implementation.
