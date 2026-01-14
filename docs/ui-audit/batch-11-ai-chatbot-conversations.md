# Batch 11: AI Therapy Chatbot Conversations (Screens 4-8)

**Source**: `ui-designs/Dark-mode/AI Therapy Chatbot/` (individual screen files)
**Screens Covered**: 5 (New Conversation, Limitations, Active Chat, Chat with Media, Crisis Referral)
**Global Screen Numbers**: 50-54

---

## CRITICAL ISSUES IN THIS BATCH

### ISSUE: Fictional Serial Killers as Therapist Names (Screens 7-8)

**Severity**: CRITICAL - MUST FIX IMMEDIATELY

The designs reference **"Dr. Hannibal Lector"** and **"Prof. Johann Liebert"** as therapist recommendations:

- **Hannibal Lecter** - Fictional serial killer/cannibal from "The Silence of the Lambs"
- **Johann Liebert** - Fictional serial killer from anime "Monster"

This is extremely dangerous and inappropriate for a mental health application. These must be replaced with generic placeholder names before any implementation.

**Also flagged**: Profanity in chat examples ("F***", "b****")

---

## Screen 50: NewConversationSetup

### 1. Purpose
Configuration screen for starting a new AI therapy conversation. Allows users to customize the AI model, communication style, therapy goals, and privacy settings.

### 2. UI Structure (Visual Only)

```
[SafeAreaView - Dark Background #1C1410]
├── [StatusBar - Light content]
│
├── [Header]
│   ├── [BackButton - Circular]
│   └── [Title: "New Conversation" - Large, white]
│
├── [ScrollableForm]
│   ├── [FormSection: Topic Name]
│   │   ├── [Label: "Topic Name"]
│   │   └── [TextInput: "Wrong Life Choices, I'm Sad!" - With icon]
│   │
│   ├── [FormSection: AI Model]
│   │   ├── [Label: "AI Model"]
│   │   └── [Dropdown: "Freud_on_CORE_v1.1.47"]
│   │
│   ├── [FormSection: AI LLM Checkpoints]
│   │   ├── [Label: "AI LLM Checkpoints"]
│   │   ├── [Sublabel: "Select up to 3"]
│   │   └── [ChipGrid - 2x3]
│   │       ├── [Chip: "GPT-4" - Selected, green]
│   │       ├── [Chip: "GPT-5" - Selected, green]
│   │       ├── [Chip: "Llama2"]
│   │       ├── [Chip: "BabyAGI"]
│   │       ├── [Chip: "PaLM3"]
│   │       └── [Chip: "PrivateGPT"]
│   │
│   ├── [FormSection: Preferred Name]
│   │   ├── [Label: "Preferred Name"]
│   │   └── [TextInput: "Shinomiya"]
│   │
│   ├── [FormSection: Conversation Icon]
│   │   ├── [Label: "Conversation Icon"]
│   │   └── [IconSelectorRow]
│   │       └── [AvatarIcon x 6 - Various patterns/colors]
│   │
│   ├── [FormSection: Communication Style]
│   │   ├── [Label: "Communication Style"]
│   │   └── [StyleChipsRow]
│   │       ├── [Chip: "Casual" with icon]
│   │       ├── [Chip: "Formal" - Selected, green]
│   │       └── [Chip: "Fun" with icon]
│   │
│   ├── [FormSection: Therapy Goals]
│   │   ├── [Label: "Therapy Goals"]
│   │   └── [Dropdown: "Reduce Stress Level"]
│   │
│   └── [FormSection: Privacy & Security]
│       ├── [Label: "Privacy & Security"]
│       └── [ToggleRow]
│           ├── [Label: "Make Chat Public"]
│           └── [Toggle - ON, green]
│
└── [FooterArea]
    └── [CreateButton - Green, full width]
        ├── [Text: "Create Conversation"]
        └── [Icon: Lock]
```

### 3. Component List

| Component | Variant/State | Props |
|-----------|---------------|-------|
| SafeAreaView | Dark background | `backgroundColor: #1C1410` |
| BackButton | Circular | `onPress: fn` |
| ScreenTitle | Large | `text: "New Conversation"` |
| FormLabel | Standard | `text: string` |
| TextInput | With icon | `value`, `placeholder`, `icon`, `onChange` |
| Dropdown | Select | `value`, `options[]`, `onChange` |
| SelectableChip | Multi-select | `label`, `selected`, `maxSelections`, `onToggle` |
| AvatarIconSelector | Single select | `options[]`, `selected`, `onChange` |
| StyleChip | Single select | `label`, `icon`, `selected`, `onSelect` |
| ToggleRow | With label | `label`, `value`, `onChange` |
| PrimaryButton | Green | `text`, `icon`, `onPress` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render form sections with labels
- Display text inputs and dropdowns
- Show chip selectors (multi and single)
- Render avatar icon row
- Display toggle switch
- Show create button

**Logic (Container/Hook)**:
- Track all form field values
- Validate required fields
- Enforce max selections (3 for LLM checkpoints)
- Create conversation on submit
- Navigate to chat screen

### 5. State Definition

```typescript
interface NewConversationState {
  // Form Values
  topicName: string;
  aiModel: string;
  llmCheckpoints: string[];       // Max 3
  preferredName: string;
  conversationIcon: string;
  communicationStyle: 'casual' | 'formal' | 'fun';
  therapyGoal: string;
  isPublic: boolean;

  // UI State
  isCreating: boolean;
  errors: Record<string, string>;
}
```

### 6. Data Models

```typescript
interface ConversationConfig {
  topicName: string;
  aiModel: string;
  llmCheckpoints: string[];
  preferredName: string;
  iconId: string;
  style: CommunicationStyle;
  goal: TherapyGoal;
  privacy: PrivacySettings;
}

type CommunicationStyle = 'casual' | 'formal' | 'fun';

interface TherapyGoal {
  id: string;
  label: string;
}

const AI_MODELS = [
  { id: 'freud_core_1147', label: 'Freud_on_CORE_v1.1.47' },
  // ... more models
];

const LLM_CHECKPOINTS = [
  'GPT-4', 'GPT-5', 'Llama2', 'BabyAGI', 'PaLM3', 'PrivateGPT'
];
```

### 7. Navigation

- **Entry Points**: ChatbotEmpty, ConversationsDashboard, ChatsList
- **Exit Points**:
  - Create: New chat conversation screen
  - Back: Previous screen

### 8. UI States & Edge Cases

| State | Visual Behavior |
|-------|-----------------|
| Empty form | Default values, create enabled |
| Max checkpoints (3) | Additional chips disabled |
| Creating | Button shows loading |
| Validation error | Show error below field |
| Success | Navigate to chat |

### 9. Implementation Breakdown

1. **Phase 1: Form Layout**
   - Create scrollable form structure
   - Add form sections with labels

2. **Phase 2: Input Components**
   - Text inputs with icons
   - Dropdown selects
   - Multi-select chips (max 3)
   - Single-select style chips
   - Avatar icon selector
   - Toggle switch

3. **Phase 3: Submission**
   - Validate required fields
   - Create conversation API call
   - Navigate on success

### 10. Open Issues

| Issue | Type | Notes |
|-------|------|-------|
| Topic placeholder inappropriate | Content | "Wrong Life Choices, I'm Sad!" |
| "Make Chat Public" implications | Privacy | What does public mean? |
| LLM checkpoint selection purpose | Feature | How do checkpoints affect chat? |
| Icon options | Assets | Need avatar icon assets |

---

## Screen 51: ChatbotLimitations (Onboarding Carousel)

### 1. Purpose
Onboarding screen explaining AI chatbot limitations before starting a conversation. Sets appropriate expectations about the AI's capabilities.

### 2. UI Structure (Visual Only)

```
[SafeAreaView - Dark Background #1C1410]
├── [StatusBar - Light content]
│
├── [Header]
│   ├── [BackButton - Circular]
│   ├── [TitleArea]
│   │   ├── [Title: "Doctor Freud.AI"]
│   │   └── [Subtitle: "251 Chats Left • GPT-5"]
│   └── [SearchButton - Right]
│
├── [CarouselContent - Centered]
│   ├── [IllustrationContainer - Dark circular bg]
│   │   └── [RobotIllustration]
│   │       ├── [Cute robot character - Gray]
│   │       ├── [Floating decorative elements]
│   │       └── [Orange/green accent shapes]
│   │
│   ├── [CategoryBadge: "Limitations" - Tan pill]
│   │
│   ├── [Title: "Limited Knowledge"]
│   │
│   ├── [Description]
│   │   └── ["No human being is perfect. So is chatbots. Dr Freud's knowledge is limited to 2025."]
│   │
│   └── [PaginationDots - 5 dots]
│       └── [Dot 1 active, Dots 2-5 inactive]
│
└── [ChatInputArea - Bottom]
    ├── [AttachmentButton]
    ├── [TextInput: "Type to start chatting..."]
    └── [SendButton - Green]
```

### 3. Component List

| Component | Variant/State | Props |
|-----------|---------------|-------|
| ChatHeader | With stats | `title`, `chatsLeft`, `model` |
| RobotIllustration | Limitations variant | Custom asset |
| CategoryBadge | Tan | `text: "Limitations"` |
| OnboardingTitle | Large centered | `text: string` |
| OnboardingDescription | Secondary | `text: string` |
| PaginationDots | 5 items | `total: 5`, `current: 1` |
| ChatInput | Standard | `placeholder`, `onSend`, `onAttach` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render chat header with stats
- Display limitation illustration
- Show category badge
- Render title and description
- Display pagination dots
- Show chat input

**Logic (Container/Hook)**:
- Track current carousel page
- Handle swipe gestures
- Allow skipping to chat
- Track onboarding completion

### 5. State Definition

```typescript
interface LimitationsOnboardingState {
  currentPage: number;          // 1-5
  totalPages: number;           // 5
  hasCompletedOnboarding: boolean;
}

const LIMITATIONS_PAGES = [
  {
    category: 'Limitations',
    title: 'Limited Knowledge',
    description: "No human being is perfect. So is chatbots. Dr Freud's knowledge is limited to 2025.",
  },
  // ... 4 more pages
];
```

### 6. Data Models

```typescript
interface OnboardingPage {
  id: string;
  category: string;
  title: string;
  description: string;
  illustration: ImageSource;
}
```

### 7. Navigation

- **Entry Points**: After creating new conversation
- **Exit Points**:
  - Complete carousel: Active chat
  - Type message: Skip to active chat
  - Back: Cancel conversation

### 8. UI States & Edge Cases

| State | Visual Behavior |
|-------|-----------------|
| Page 1 | Show first limitation |
| Swiping | Animate to next page |
| Last page | May auto-proceed or show "Start" |
| Type in input | Skip carousel, start chat |

### 9. Implementation Breakdown

1. **Phase 1: Carousel**
   - Create horizontal carousel/pager
   - Implement swipe gestures
   - Add pagination dots

2. **Phase 2: Content**
   - Create illustration container
   - Add category badge
   - Display title/description

3. **Phase 3: Integration**
   - Allow typing to skip
   - Track completion
   - Navigate to chat

### 10. Open Issues

| Issue | Type | Notes |
|-------|------|-------|
| Other 4 pages content | Content | What are the other limitations? |
| Grammar: "So is chatbots" | Copy | Should be "So are chatbots" |
| Can user skip? | UX | Type to skip or must view all? |

---

## Screen 52: ActiveChatConversation

### 1. Purpose
Main chat interface for ongoing AI therapy conversation. Shows message history with emotion detection badges and AI responses.

### 2. UI Structure (Visual Only)

```
[SafeAreaView - Dark Background #1C1410]
├── [StatusBar - Light content]
│
├── [ChatHeader]
│   ├── [BackButton - Circular]
│   ├── [TitleArea]
│   │   ├── [Title: "Doctor Freud.AI"]
│   │   └── [Subtitle: "251 Chats Left • GPT-6"]
│   └── [SearchButton]
│
├── [MessageList - Scrollable]
│   ├── [UserMessage]
│   │   ├── [MessageBubble - Brown/tan]
│   │   │   └── [Text: "I can't believe this is happening!..."]
│   │   └── [UserAvatar - Right side]
│   │
│   ├── [UserMessage]
│   │   ├── [MessageBubble]
│   │   │   └── [Text: "F*** this world and everyone!" + emoji]
│   │   └── [UserAvatar]
│   │
│   ├── [EmotionBadge - Orange, centered]
│   │   └── [Text: "Emotion: Anger, Despair. Data Updated."]
│   │
│   ├── [AIMessage]
│   │   ├── [AIAvatar - Green, left side]
│   │   └── [MessageBubble - Darker]
│   │       └── [Text: "Shinomiya, Let's work on coping strategies..."]
│   │
│   ├── [DateDivider: "Today"]
│   │
│   ├── [UserMessage]
│   │   ├── [MessageBubble]
│   │   │   └── [Text: "Thank you, Doctor Freud. 🙏..."]
│   │   └── [UserAvatar]
│   │
│   ├── [EmotionBadge - Green, centered]
│   │   └── [Text: "Emotion: Happy. Data Updated."]
│   │
│   └── [AIMessage]
│       ├── [AIAvatar]
│       └── [MessageBubble]
│           └── [Text: "No worries, Shinomiya!..."]
│
└── [ChatInputArea]
    ├── [AttachmentButton]
    ├── [TextInput: "Type to start chatting..."]
    └── [SendButton - Green]
```

### 3. Component List

| Component | Variant/State | Props |
|-----------|---------------|-------|
| ChatHeader | Standard | `title`, `subtitle`, `onBack`, `onSearch` |
| MessageList | Scrollable | `messages[]` |
| UserMessageBubble | Right-aligned | `text`, `timestamp`, `avatar` |
| AIMessageBubble | Left-aligned | `text`, `timestamp`, `avatar` |
| EmotionBadge | Colored | `emotion`, `color: 'orange' \| 'green'` |
| DateDivider | Centered | `date: string` |
| ChatInput | Standard | `onSend`, `onAttach`, `placeholder` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render chat header
- Display message list
- Show user messages (right) and AI messages (left)
- Display emotion detection badges
- Show date dividers
- Render chat input

**Logic (Container/Hook)**:
- Load message history
- Send new messages
- Receive AI responses (streaming?)
- Detect and display emotions
- Handle attachments
- Scroll management

### 5. State Definition

```typescript
interface ActiveChatState {
  // Conversation
  conversationId: string;
  messages: ChatMessage[];

  // Input
  inputText: string;
  isSending: boolean;

  // AI State
  isAITyping: boolean;

  // Quota
  chatsRemaining: number;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  emotion?: EmotionDetection;
}

interface EmotionDetection {
  emotions: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  color: string;
}
```

### 6. Data Models

```typescript
interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    emotionDetected?: string[];
    sentiment?: string;
  };
}

interface SendMessageRequest {
  conversationId: string;
  content: string;
  attachments?: Attachment[];
}
```

### 7. Navigation

- **Entry Points**: NewConversation, ChatsList
- **Exit Points**:
  - Back: ChatsList or Home
  - Search: Search within conversation

### 8. UI States & Edge Cases

| State | Visual Behavior |
|-------|-----------------|
| Loading history | Skeleton messages |
| Sending | Message appears with pending indicator |
| AI typing | Show typing indicator |
| Emotion detected | Show colored badge below message |
| Error sending | Show retry option |

### 9. Implementation Breakdown

1. **Phase 1: Message List**
   - Create message bubble components
   - Differentiate user/AI styling
   - Add avatars

2. **Phase 2: Emotion Detection**
   - Create EmotionBadge component
   - Position between messages
   - Color based on sentiment

3. **Phase 3: Input & Sending**
   - Create chat input component
   - Handle send action
   - Implement typing indicator

### 10. Open Issues

| Issue | Type | Notes |
|-------|------|-------|
| CRITICAL: Profanity in example | Content | "F*** this world" must be removed |
| Streaming responses | Feature | Does AI response stream or appear at once? |
| Message persistence | Data | How are messages stored? |
| Emotion detection accuracy | Feature | How is emotion detected? |

---

## Screen 53: ChatWithMedia

### 1. Purpose
Chat interface showing AI responses with embedded media content (videos, resources). Demonstrates how the AI can share educational content.

### 2. UI Structure (Visual Only)

```
[SafeAreaView - Dark Background #1C1410]
├── [StatusBar - Light content]
│
├── [ChatHeader]
│   ├── [BackButton]
│   ├── [TitleArea: "Doctor Freud.AI" / "251 Chats Left • GPT-6"]
│   └── [SearchButton]
│
├── [MessageList]
│   ├── [UserMessage]
│   │   ├── [MessageBubble]
│   │   │   └── [Text: "I hate my school teacher. I hate that stupid b****..."]
│   │   └── [Emoji: Angry face]
│   │
│   ├── [AIMessage]
│   │   ├── [AIAvatar]
│   │   └── [MessageBubble]
│   │       ├── [Text: "Shinomiya, Teachers are great profession!..."]
│   │       └── [ResourceCard - Embedded]
│   │           ├── [Thumbnail - Meditation/nature scene]
│   │           ├── [PlayButton - Centered]
│   │           ├── [Title: "Mindfulness Course #1"]
│   │           └── [ProgressBar: "8:00"]
│   │
│   ├── [UserMessage]
│   │   └── [Text: "Great, thanks a lot doc F! 😏"]
│   │
│   └── [AITypingIndicator]
│       ├── [AIAvatar]
│       └── [Text: "Dr. Freud is thinking..." + animated dots]
│
└── [ChatInputArea]
```

### 3. Component List

| Component | Variant/State | Props |
|-----------|---------------|-------|
| ChatHeader | Standard | Same as Screen 52 |
| UserMessageBubble | With emoji | `text`, `emoji` |
| AIMessageBubble | With media | `text`, `media?: MediaContent` |
| EmbeddedVideoCard | Inline | `thumbnail`, `title`, `duration`, `onPlay` |
| VideoProgressBar | Mini | `currentTime`, `duration` |
| TypingIndicator | Animated | `text: "Dr. Freud is thinking..."` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render standard chat UI
- Display embedded video cards within AI messages
- Show typing indicator animation
- Render play button and progress

**Logic (Container/Hook)**:
- Handle video playback
- Track video progress
- Parse AI responses for media
- Manage typing indicator state

### 5. State Definition

```typescript
interface ChatWithMediaState extends ActiveChatState {
  // Media
  playingVideoId: string | null;
  videoProgress: Record<string, number>;
}

interface MediaContent {
  type: 'video' | 'audio' | 'article';
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  duration: number;
}
```

### 6. Data Models

```typescript
interface AIMessageWithMedia {
  id: string;
  role: 'assistant';
  content: string;
  media?: {
    type: 'video' | 'article' | 'resource';
    resourceId: string;
    title: string;
    thumbnail: string;
    metadata: any;
  };
}
```

### 7. Navigation

- Same as Screen 52
- Video tap: Opens video player (inline or fullscreen)

### 8. UI States & Edge Cases

| State | Visual Behavior |
|-------|-----------------|
| Video loading | Thumbnail with spinner |
| Video playing | Show pause button, update progress |
| Video paused | Show play button |
| AI thinking | Show typing indicator |

### 9. Implementation Breakdown

1. **Phase 1: Media Cards**
   - Create EmbeddedVideoCard component
   - Add thumbnail display
   - Implement play button

2. **Phase 2: Playback**
   - Integrate video player
   - Track progress
   - Handle inline vs fullscreen

3. **Phase 3: Typing Indicator**
   - Create animated dots
   - Show during AI response generation

### 10. Open Issues

| Issue | Type | Notes |
|-------|------|-------|
| CRITICAL: Profanity "b****" | Content | Must be removed |
| CRITICAL: "Dr. Hannibal Lector" | Content | Fictional serial killer name |
| Video player implementation | Tech | Inline or external? |
| "doc F" abbreviation | Copy | Casual but acceptable |

---

## Screen 54: CrisisDetectionReferral

### 1. Purpose
Critical screen showing AI response to detected suicidal content. AI appropriately declines to help directly and provides professional referrals.

### 2. UI Structure (Visual Only)

```
[SafeAreaView - Dark Background #1C1410]
├── [StatusBar - Light content]
│
├── [ChatHeader]
│   ├── [BackButton]
│   ├── [TitleArea: "Doctor Freud.AI" / "251 Chats Left • GPT-6"]
│   └── [SearchButton]
│
├── [MessageList]
│   ├── [UserMessage]
│   │   ├── [MessageBubble]
│   │   │   └── [Text: "Doc, I don't think this app is working. I want to simply stop existing. 😕"]
│   │   └── [UserAvatar]
│   │
│   ├── [CrisisAlertBadge - Red/Orange, centered]
│   │   └── [Text: "Emotion: Suicidal, Crisis Support Active"]
│   │
│   ├── [AIMessage]
│   │   ├── [AIAvatar]
│   │   └── [MessageBubble]
│   │       ├── [Text: "I'm really sorry to hear that you're feeling this way, but I can't provide help. It's important to talk to professional."]
│   │       │
│   │       ├── [Text: "I recommend Dr. Hannibal Lector or Dr. Johann Liebert for 25 minute session Free."]
│   │       │
│   │       └── [ProfessionalCards]
│   │           ├── [ProfessionalCard 1]
│   │           │   ├── [Avatar - Placeholder]
│   │           │   ├── [Name: "Dr. Hannibal Lector"]
│   │           │   ├── [VerifiedBadge - Checkmark]
│   │           │   ├── [Role: "Therapist"]
│   │           │   └── [Rating: "★ 4.7"]
│   │           │
│   │           └── [ProfessionalCard 2]
│   │               ├── [Avatar - Placeholder]
│   │               ├── [Name: "Prof. Johann Liebert"]
│   │               ├── [Role: "Psychologist"]
│   │               └── [Rating: "★ 3.2"]
│   │
│   └── [UserMessage]
│       └── [Text: "OK thanks. Let me try it then.. 😊"]
│
└── [ChatInputArea]
```

### 3. Component List

| Component | Variant/State | Props |
|-----------|---------------|-------|
| ChatHeader | Standard | Same as previous |
| CrisisAlertBadge | Red/Orange | `text`, `isActive: true` |
| AIMessageBubble | With referrals | `text`, `referrals: Professional[]` |
| ProfessionalCard | Inline | `name`, `role`, `rating`, `verified`, `avatar` |
| VerifiedBadge | Checkmark | `isVerified: boolean` |
| StarRating | Display | `rating: number` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render crisis alert badge prominently
- Display AI's appropriate response
- Show professional referral cards
- Allow tapping to book appointment

**Logic (Container/Hook)**:
- Detect crisis keywords
- Trigger crisis protocol
- Fetch available professionals
- Log crisis detection for safety
- Potentially notify emergency contacts

### 5. State Definition

```typescript
interface CrisisDetectionState {
  // Crisis
  crisisDetected: boolean;
  crisisType: 'suicidal' | 'self-harm' | 'other';
  supportActive: boolean;

  // Referrals
  recommendedProfessionals: Professional[];

  // Safety
  emergencyResourcesShown: boolean;
}

interface Professional {
  id: string;
  name: string;
  role: 'Therapist' | 'Psychologist' | 'Psychiatrist';
  rating: number;
  verified: boolean;
  avatar?: string;
  availability: string;
  freeSessionAvailable: boolean;
}
```

### 6. Data Models

```typescript
interface CrisisResponse {
  detected: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  emotions: string[];
  recommendedAction: 'continue' | 'refer' | 'emergency';
  professionals: Professional[];
  resources: CrisisResource[];
}

interface CrisisResource {
  type: 'hotline' | 'text' | 'chat' | 'professional';
  name: string;
  contact: string;
  available: string;
}
```

### 7. Navigation

- **Entry Points**: Active chat when crisis detected
- **Exit Points**:
  - Professional card: Booking flow
  - Back: Chat list (with confirmation?)
  - Emergency: Direct dial hotline

### 8. UI States & Edge Cases

| State | Visual Behavior |
|-------|-----------------|
| Crisis detected | Show red alert badge |
| Loading professionals | Skeleton cards |
| No professionals available | Show hotline numbers instead |
| User clicks professional | Navigate to booking |
| User tries to continue chatting | May show warning/block |

### 9. Implementation Breakdown

1. **Phase 1: Crisis Detection UI**
   - Create CrisisAlertBadge component
   - Style prominently (red/orange)
   - Position above AI response

2. **Phase 2: Professional Cards**
   - Create ProfessionalCard component
   - Add verified badge
   - Include rating display

3. **Phase 3: Safety Flow**
   - Implement crisis detection trigger
   - Log for safety monitoring
   - Provide emergency resources

### 10. Open Issues

| Issue | Type | Notes |
|-------|------|-------|
| CRITICAL: "Dr. Hannibal Lector" | Content | Fictional serial killer - MUST CHANGE |
| CRITICAL: "Prof. Johann Liebert" | Content | Fictional serial killer - MUST CHANGE |
| Crisis logging | Safety | Must log all crisis detections |
| Emergency escalation | Safety | What if user in immediate danger? |
| AI refusing help wording | Copy | "I can't provide help" may feel dismissive |

---

## Cross-Screen Patterns

### Chat Message Components

```typescript
interface MessageBubbleProps {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  avatar?: string;
  media?: MediaContent;
  referrals?: Professional[];
}

interface EmotionBadgeProps {
  emotions: string[];
  sentiment: 'positive' | 'negative' | 'neutral' | 'crisis';
  onDataUpdate?: () => void;
}
```

### Crisis Detection Flow

```typescript
interface CrisisDetectionConfig {
  keywords: string[];
  severityThresholds: Record<string, number>;
  autoReferralEnabled: boolean;
  emergencyContacts: Contact[];
  hotlineNumbers: Record<string, string>;
}

// Keywords that trigger crisis detection
const CRISIS_KEYWORDS = [
  'stop existing', 'end it all', 'kill myself',
  'don\'t want to live', 'suicidal', 'hurt myself',
  // ... more keywords
];
```

### New Components Identified

| Component | Description | Priority |
|-----------|-------------|----------|
| ConversationForm | Multi-section form | Medium |
| SelectableChip | Multi-select chip | High |
| AvatarIconSelector | Icon picker | Medium |
| StyleChip | Single-select with icon | Medium |
| ChatHeader | Stats + search | High |
| MessageBubble | User/AI variants | High |
| EmotionBadge | Sentiment indicator | High |
| CrisisAlertBadge | Crisis indicator | High |
| EmbeddedVideoCard | Inline video | Medium |
| TypingIndicator | Animated dots | Medium |
| ProfessionalCard | Referral card | Medium |
| PaginationDots | Carousel indicator | Low |

---

## Summary

| # | Screen Name | Type | Key Features |
|---|-------------|------|--------------|
| 50 | NewConversationSetup | Form | Topic, AI model, LLM checkpoints (max 3), style, goals, privacy |
| 51 | ChatbotLimitations | Onboarding | 5-page carousel, robot illustration, limitations info |
| 52 | ActiveChatConversation | Chat | Messages, emotion badges (Anger/Happy), date dividers |
| 53 | ChatWithMedia | Chat | Embedded video card, typing indicator |
| 54 | CrisisDetectionReferral | Chat + Crisis | Suicidal detection, professional referral cards |

**BATCH 11 COMPLETE - 8/20 AI Therapy Chatbot screens documented**

---

## CRITICAL ISSUES ADDED TO TRACKER

The following issues have been added to [CRITICAL-ISSUES.md](./CRITICAL-ISSUES.md):

1. **CRITICAL**: "Dr. Hannibal Lector" and "Prof. Johann Liebert" as therapist names - these are famous fictional serial killers
2. **HIGH**: Profanity in chat examples ("F***", "b****")
3. **MEDIUM**: Grammar error "So is chatbots" → "So are chatbots"
4. **MEDIUM**: Topic placeholder "Wrong Life Choices, I'm Sad!"
