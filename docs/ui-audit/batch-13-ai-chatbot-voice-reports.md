# Batch 13: AI Therapy Chatbot - Voice Analysis & Health Reports

**Screens Covered**: 60-64 (AI Therapy Chatbot Screens 14-18)
**Source Files**: `ui-designs/Dark-mode/🔒 AI Therapy Chatbot/AI_Therapy_Chatbot_Screen_14.png` through `AI_Therapy_Chatbot_Screen_18.png`

---

## Screen 60: VoiceExpressionReady

### 1. Purpose
Provides an onboarding/ready screen for the voice expression analysis feature, explaining to users that they can speak freely and the AI will analyze their voice patterns for emotional state detection.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [Status Bar]                        9:41│
├─────────────────────────────────────────┤
│ (←)                                     │
│                                         │
│           ╔═══════════════╗             │
│          ╱  ⚡  ⚡  ⚡  ⚡  ╲            │
│         ╱                   ╲           │
│        ╱    [ILLUSTRATION]   ╲          │
│       │     Person with       │         │
│       │     hands up,         │         │
│       │     expressing        │         │
│        ╲    stress/emotion   ╱          │
│         ╲                   ╱           │
│          ╲  STARBURST BG   ╱            │
│           ╚═══════════════╝             │
│                                         │
│       Say anything that's               │
│          on your mind.                  │
│                                         │
│     Dr. freud AI will listen and        │
│      analyze your voice expression.     │
│                                         │
│                                         │
│              ┌───────┐                  │
│              │  🎤   │                  │
│              │       │                  │
│              └───────┘                  │
│                                         │
├─────────────────────────────────────────┤
│    (✕)         Ready           (✓)      │
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Props/Config |
|-----------|-------------|--------------|
| BackButton | Top-left close/back circle | `onPress`, `style: 'circle'` |
| StarburstBackground | Olive/yellow explosion pattern | `color`, `intensity` |
| ExpressionIllustration | Person with hands up, stressed | `type: 'voiceExpression'` |
| LightningBoltIcon | Yellow stress indicators | `count`, `positions` |
| HeadingText | "Say anything that's on your mind." | `size: 'large'`, `centered` |
| SubtitleText | AI description text | `size: 'small'`, `color: 'muted'` |
| MicrophoneButton | Large white circular button | `size: 'large'`, `onPress` |
| ActionBar | Bottom bar with cancel/confirm | `leftAction`, `centerText`, `rightAction` |
| CancelButton | Orange X button | `onPress`, `color: 'orange'` |
| ConfirmButton | Green checkmark button | `onPress`, `color: 'green'` |
| ReadyLabel | Center "Ready" text | `text` |

### 4. Responsibility Split

**UI (Presentational)**:
- Display illustration with starburst background
- Render microphone button with tap animation
- Show action bar with cancel/confirm options
- Animate lightning bolts around illustration

**Logic (Container/Hooks)**:
- Check microphone permission status
- Prepare audio recording session
- Handle navigation on cancel/confirm
- Track feature onboarding completion

### 5. State Definition

```typescript
interface VoiceExpressionReadyState {
  // Permissions
  microphonePermission: 'granted' | 'denied' | 'undetermined';

  // UI State
  isReady: boolean;
  showPermissionPrompt: boolean;

  // Animation
  animationPlaying: boolean;
}

type LocalState = ['animationPlaying', 'showPermissionPrompt'];
type AsyncState = ['microphonePermission'];
```

### 6. Data Models

```typescript
interface VoiceSessionConfig {
  maxDuration: number;          // Maximum recording time in seconds
  sampleRate: number;           // Audio sample rate
  channels: number;             // Mono or stereo
  encoding: 'aac' | 'wav';      // Audio encoding format
  realTimeTranscription: boolean;
  emotionAnalysis: boolean;
}
```

### 7. Navigation

| Action | Destination | Data Passed |
|--------|-------------|-------------|
| Back button (←) | Previous screen | - |
| Cancel (✕) | Previous screen | - |
| Microphone tap | VoiceRecordingActive | `sessionConfig` |
| Confirm (✓) | VoiceRecordingActive | `sessionConfig` |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Microphone permission denied | Show permission request modal |
| First time use | May show brief tutorial animation |
| Microphone unavailable | Show error, suggest text input |
| Already recording | Navigate directly to recording screen |
| Low battery | Warning about recording length |

### 9. Implementation Breakdown

1. **StarburstBackground Component**
   - SVG or animated gradient background
   - Olive/yellow color scheme
   - Radial expansion from center

2. **ExpressionIllustration Component**
   - Vector illustration of person expressing emotion
   - Lightning bolts indicate mental state
   - Centered within starburst

3. **Permission Flow**
   - Check `expo-av` permission on mount
   - Request permission if needed
   - Handle denial gracefully

### 10. Open Issues

| Issue | Priority | Notes |
|-------|----------|-------|
| Illustration asset | HIGH | Need vector version of stress illustration |
| Animation performance | MEDIUM | Starburst animation may be heavy |
| Permission UX | MEDIUM | What happens on permission denial? |
| Accessibility | HIGH | Screen reader description for illustration |

---

## Screen 61: VoiceRecordingActive

### 1. Purpose
Active voice recording screen with real-time speech-to-text transcription, allowing users to speak freely while seeing their words transcribed live.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [Status Bar]                        9:41│
├─────────────────────────────────────────┤
│                                         │
│                                         │
│    Hey Doc, I'm at my friends           │
│    house & I suddenly feel very         │
│    sad and crying.                      │
│                                         │
│                                         │
│    Please update this to                │
│    my health journal|                   │
│                       ↑ cursor          │
│                                         │
│                                         │
│                                         │
│         ╭───────────────────╮           │
│        ╱                     ╲          │
│       │    [CONCENTRIC       │          │
│       │     CIRCLES          │          │
│       │     ANIMATION]       │          │
│        ╲                     ╱          │
│         ╰───────────────────╯           │
│                                         │
│              ┌───────┐                  │
│              │  🎤   │                  │
│              │ ACTIVE│                  │
│              └───────┘                  │
│                                         │
├─────────────────────────────────────────┤
│    (✕)       00:24:55          (✓)      │
│   orange                       green    │
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Props/Config |
|-----------|-------------|--------------|
| TranscriptionDisplay | Real-time text output | `text`, `isLive`, `cursorVisible` |
| ConcentricCirclesAnimation | Audio visualization | `isRecording`, `amplitude` |
| MicrophoneButton | Active recording indicator | `isRecording`, `onPress` |
| RecordingTimer | Duration display | `duration`, `format: 'HH:MM:SS'` |
| CancelButton | Stop and discard | `onPress`, `color: 'orange'` |
| ConfirmButton | Stop and send | `onPress`, `color: 'green'` |

### 4. Responsibility Split

**UI (Presentational)**:
- Display transcribed text in real-time
- Animate concentric circles based on audio amplitude
- Show recording timer
- Render blinking cursor at text end

**Logic (Container/Hooks)**:
- Manage audio recording session
- Process speech-to-text conversion
- Handle pause/resume/stop actions
- Calculate and update timer

### 5. State Definition

```typescript
interface VoiceRecordingState {
  // Recording
  isRecording: boolean;
  isPaused: boolean;
  recordingDuration: number;      // in seconds
  audioUri: string | null;

  // Transcription
  transcribedText: string;
  isTranscribing: boolean;
  transcriptionConfidence: number;

  // Audio Analysis
  currentAmplitude: number;       // For visualization
  averageAmplitude: number;

  // Errors
  error: string | null;
}

type LocalState = ['isPaused', 'currentAmplitude'];
type AsyncState = ['isRecording', 'isTranscribing', 'transcribedText'];
```

### 6. Data Models

```typescript
interface VoiceRecording {
  id: string;
  audioUri: string;
  duration: number;
  transcription: string;
  createdAt: string;

  // Analysis (populated after processing)
  emotionAnalysis?: EmotionAnalysis;
  sentimentScore?: number;
  keywords?: string[];
}

interface EmotionAnalysis {
  primaryEmotion: string;
  confidence: number;
  voiceTone: 'calm' | 'stressed' | 'excited' | 'sad' | 'angry';
  speechRate: 'slow' | 'normal' | 'fast';
}
```

### 7. Navigation

| Action | Destination | Data Passed |
|--------|-------------|-------------|
| Cancel (✕) | VoiceExpressionReady (discard) | - |
| Confirm (✓) | ChatWithVoiceMessage | `voiceRecording` |
| Microphone tap | Toggle pause/resume | - |
| Back gesture | Confirmation dialog | - |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Recording active | Concentric circles animate, timer counts up |
| Paused | Circles freeze, timer pauses, "Paused" label |
| Transcription lag | Show "..." or partial text indicator |
| Maximum duration reached | Auto-stop with notification |
| Low storage | Warning before max recording length |
| Background app | Continue recording with notification |
| No speech detected | Prompt "We can't hear you, try speaking louder" |

### 9. Implementation Breakdown

1. **Audio Recording**
   - Use `expo-av` Audio.Recording
   - Configure for speech quality (16kHz, mono)
   - Handle background recording

2. **Real-time Transcription**
   - Integrate with speech-to-text service (Google Speech, AWS Transcribe, Whisper)
   - Streaming transcription for real-time display
   - Handle multiple languages if needed

3. **Concentric Circles Animation**
   - React Native Animated or Reanimated
   - Scale circles based on audio amplitude
   - Smooth interpolation for visual appeal

4. **Timer Component**
   - Update every second
   - Format as HH:MM:SS
   - Persist across pause/resume

### 10. Open Issues

| Issue | Priority | Notes |
|-------|----------|-------|
| Speech-to-text service | HIGH | Which service? Google, AWS, Whisper? |
| Offline transcription | MEDIUM | Can we use on-device ML (Whisper.cpp)? |
| Maximum recording length | MEDIUM | What's the limit? 30 min? 1 hour? |
| Background recording | HIGH | iOS limitations on background audio |
| Privacy | HIGH | Where is audio processed? On-device or cloud? |

---

## Screen 62: VoiceMessageSentWithJournal

### 1. Purpose
Displays the sent voice message in the chat interface along with AI's response, showing automatic journal update with GPS location integration and embedded journal preview cards.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [Status Bar]                        9:41│
├─────────────────────────────────────────┤
│ ← Doctor Freud.AI                    🔍 │
│   251 Chats Left • GPT-6                │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ ▶ 04:55  ▓▓░░▓▓▓░▓▓░░▓▓▓░░▓  │ ← │
│  │          12:22 PM • Read        │    │
│  └─────────────────────────────────┘    │
│                                         │
│    ┌─────────────────────────────────┐  │
│ →  │ Got it, Shinomiya! I've updated│  │
│    │ your journal based on GPS       │  │
│    │ location & current mental       │  │
│    │ health symptoms. ⭐              │  │
│    │                                │  │
│    │ I recommend taking a quick     │  │
│    │ break and going back home to   │  │
│    │ rest! Don't be too hard on     │  │
│    │ yourself! 🙏🙏                  │  │
│    │                                │  │
│    │ ┌─────────────────────────┐    │  │
│    │ │ 📔 Mindful Journal      │    │  │
│    │ │         [Newest ▼]      │    │  │
│    │ │                         │    │  │
│    │ │ ┌─────────┐ ┌─────────┐ │    │  │
│    │ │ │Jun 25   │ │Jun 24   │ │    │  │
│    │ │ │😢 Sad   │ │Depressiv│ │    │  │
│    │ │ │Feeling  │ │Surprise │ │    │  │
│    │ │ │Sad at   │ │birt!... │ │    │  │
│    │ │ │friend's │ │         │ │    │  │
│    │ │ └─────────┘ └─────────┘ │    │  │
│    │ │        [See All]        │    │  │
│    │ └─────────────────────────┘    │  │
│    └─────────────────────────────────┘  │
│                                         │
│ ┌───────────────────────────────────┐   │
│ │ ✓ Health Journal Updated.        │   │
│ └───────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│ [📎] Type to start chatting... [🎤][➤] │
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Props/Config |
|-----------|-------------|--------------|
| ChatHeader | Standard header | `title`, `chatsLeft`, `model` |
| VoiceMessageCard | Audio playback UI | `audioUri`, `duration`, `timestamp`, `isRead` |
| AudioWaveform | Visual representation of audio | `data`, `progress`, `color` |
| PlayButton | Play/pause audio | `isPlaying`, `onPress` |
| AIMessageBubble | AI response with embedded content | `text`, `embeddedContent` |
| JournalPreviewCard | Embedded journal widget | `entries`, `sortOrder`, `onSeeAll` |
| JournalEntryMini | Individual entry preview | `date`, `mood`, `title`, `preview` |
| MoodBadge | Emotion indicator | `mood`, `color` |
| SortDropdown | Filter/sort selector | `value`, `options`, `onChange` |
| SuccessNotification | Green confirmation banner | `message` |
| ChatInputBar | Message composition | Standard props |

### 4. Responsibility Split

**UI (Presentational)**:
- Render voice message with waveform visualization
- Display journal entries in card grid
- Show mood badges with appropriate colors
- Animate success notification

**Logic (Container/Hooks)**:
- Play/pause audio playback
- Parse AI response for journal data
- Navigate to full journal on "See All"
- Handle audio scrubbing

### 5. State Definition

```typescript
interface VoiceMessageChatState {
  // Audio Playback
  isPlaying: boolean;
  playbackProgress: number;       // 0-1
  playbackDuration: number;

  // Journal
  journalEntries: JournalEntry[];
  journalSortOrder: 'newest' | 'oldest' | 'mood';

  // Notification
  showSuccessNotification: boolean;
  notificationMessage: string;
}

interface JournalEntry {
  id: string;
  date: string;
  mood: string;
  moodColor: string;
  title: string;
  preview: string;
  location?: string;
  source: 'voice' | 'text' | 'auto';
}
```

### 6. Data Models

```typescript
interface VoiceMessageData {
  id: string;
  audioUri: string;
  duration: number;             // in seconds
  waveformData: number[];       // Amplitude values for visualization
  transcription: string;
  timestamp: string;
  isRead: boolean;
}

interface JournalUpdateFromVoice {
  journalId: string;
  entryId: string;
  detectedMood: string;
  detectedLocation: string;
  extractedSymptoms: string[];
  autoGeneratedTitle: string;
  originalTranscription: string;
}
```

### 7. Navigation

| Action | Destination | Data Passed |
|--------|-------------|-------------|
| Back arrow | ConversationsDashboard | - |
| "See All" | MentalHealthJournal | `filter: 'recent'` |
| Journal entry tap | JournalEntryDetail | `entryId` |
| Voice message tap | Play/pause audio | - |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Audio loading | Show loading spinner on play button |
| Audio playing | Play button becomes pause, waveform animates |
| Audio finished | Reset to beginning, show play button |
| No journal entries | Show "No entries yet" in card |
| Many entries | Horizontal scroll within card |
| Entry title truncated | Ellipsis after 2 lines |

### 9. Implementation Breakdown

1. **VoiceMessageCard Component**
   - Audio waveform visualization
   - Play/pause toggle
   - Duration and timestamp display
   - Read receipt indicator

2. **JournalPreviewCard Component**
   - Embedded mini journal view
   - 2-column grid of entry previews
   - Sort dropdown integration
   - "See All" navigation

3. **GPS Integration**
   - Request location permission
   - Attach location to journal entry
   - Display location context in AI response

### 10. Open Issues

| Issue | Priority | Notes |
|-------|----------|-------|
| **Truncated text "Surprise birt! gift from bes"** | **MEDIUM** | Appears to be typo/placeholder - should be "Surprise birthday gift from best friend" |
| **"Depressiv" badge truncated** | **MEDIUM** | Should be "Depressed" or ensure proper truncation |
| Date format inconsistency | LOW | "Jun 25, 2025" vs "Jun 24" (missing year) |
| GPS permission UX | MEDIUM | When to request? What if denied? |
| Waveform generation | MEDIUM | How to generate waveform data from audio? |

---

## Screen 63: DailyQuoteWithSocial

### 1. Purpose
Displays AI-generated daily mental health quotes with social engagement features (likes, comments), encouraging positive mindset through inspirational content.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [Status Bar]                        9:41│
├─────────────────────────────────────────┤
│ ← Doctor Freud.AI                    🔍 │
│   251 Chats Left • GPT-6                │
├─────────────────────────────────────────┤
│                                         │
│    ┌─────────────────────────────────┐  │
│ →  │ Hey Shinomiya, here's your     │  │
│    │ daily mental health quote of   │  │
│    │ the day! 😊🔥                   │  │
│    │                                │  │
│    │ ┌─────────────────────────┐    │  │
│    │ │         ❝❝              │    │  │
│    │ │                         │    │  │
│    │ │ "The best way out is    │    │  │
│    │ │  always through. All    │    │  │
│    │ │  way through."          │    │  │
│    │ │                         │    │  │
│    │ │   — ROBERT FROST        │    │  │
│    │ │                         │    │  │
│    │ │ [51 Likes] [8 Comments] │    │  │
│    │ └─────────────────────────┘    │  │
│    └─────────────────────────────────┘  │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ Amazing, sugoi desu! 🔥🔥       │ ← │
│  │ BTW, who's robert frost?       │    │
│  └─────────────────────────────────┘    │
│                                         │
│    ┌─────────────────────────────────┐  │
│ →  │ Robert Frost was an American  │  │
│    │ poet known for his realistic  │  │
│    │ depictions of rural New       │  │
│    │ England life. 🤓              │  │
│    └─────────────────────────────────┘  │
│                                         │
├─────────────────────────────────────────┤
│ [📎] Type to start chatting... [🎤][➤] │
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Props/Config |
|-----------|-------------|--------------|
| ChatHeader | Standard header | `title`, `chatsLeft`, `model` |
| AIMessageBubble | AI intro text | `text` |
| QuoteCard | Styled quote display | `quote`, `author`, `likes`, `comments` |
| QuotationMarks | Decorative quote marks | `position: 'top'`, `size` |
| QuoteText | The quote content | `text`, `style: 'italic'` |
| QuoteAttribution | Author name | `author`, `style: 'caps'` |
| SocialButton | Like/comment buttons | `type`, `count`, `onPress`, `color` |
| UserMessageBubble | User response | `text` |
| ChatInputBar | Message composition | Standard props |

### 4. Responsibility Split

**UI (Presentational)**:
- Render quote card with decorative styling
- Display social engagement buttons
- Show like/comment counts
- Apply appropriate typography for quotes

**Logic (Container/Hooks)**:
- Fetch daily quote from service
- Handle like/unlike actions
- Navigate to comments view
- Track quote engagement metrics

### 5. State Definition

```typescript
interface DailyQuoteState {
  // Quote Data
  quote: Quote | null;
  isLoading: boolean;

  // Social
  hasLiked: boolean;
  likesCount: number;
  commentsCount: number;

  // Comments
  showComments: boolean;
  comments: Comment[];
}

interface Quote {
  id: string;
  text: string;
  author: string;
  authorBio?: string;
  category: string;           // "motivation", "mindfulness", "resilience"
  dateShown: string;
}
```

### 6. Data Models

```typescript
interface QuoteEngagement {
  quoteId: string;
  userId: string;
  liked: boolean;
  likedAt?: string;
  commented: boolean;
  commentCount: number;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: string;
  likes: number;
}
```

### 7. Navigation

| Action | Destination | Data Passed |
|--------|-------------|-------------|
| Back arrow | ConversationsDashboard | - |
| "Likes" button | Toggle like | - |
| "Comments" button | CommentsModal | `quoteId`, `comments` |
| Author name tap | AuthorInfoModal | `authorName` |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Quote loading | Skeleton loader in quote card |
| Already liked | "Likes" button highlighted, count includes user |
| No comments yet | "0 Comments" or "Be first to comment" |
| Long quote | Smaller font size, or scroll within card |
| Unknown author | Show "— Unknown" |
| Follow-up question | AI provides author info |

### 9. Implementation Breakdown

1. **QuoteCard Component**
   - Decorative quotation marks (large, stylized)
   - Quote text with serif/italic typography
   - Author attribution in caps
   - Social engagement row

2. **Social Engagement**
   - Like button with count
   - Comment button with count
   - Animate like button on tap
   - Real-time count updates (if community feature)

3. **Author Info Feature**
   - AI can answer questions about quote authors
   - Pre-loaded author bios for common authors
   - Wikipedia/knowledge base integration

### 10. Open Issues

| Issue | Priority | Notes |
|-------|----------|-------|
| Quote source | MEDIUM | Where do quotes come from? Curated database? |
| Social features scope | HIGH | Is this community-wide or just user engagement? |
| Author info accuracy | LOW | Need verified author bios |
| Quote categories | MEDIUM | How to categorize/tag quotes? |
| Offensive quote filter | HIGH | Ensure all quotes are appropriate |

---

## Screen 64: MonthlyHealthReportFiles

### 1. Purpose
Delivers the user's monthly mental health data reports as downloadable files, allowing users to access and export their tracked health information in various formats.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [Status Bar]                        9:41│
├─────────────────────────────────────────┤
│ ← Doctor Freud.AI                    🔍 │
│   251 Chats Left • GPT-6                │
├─────────────────────────────────────────┤
│                                         │
│    ┌─────────────────────────────────┐  │
│ →  │ Hey Shinomiya, your monthly    │  │
│    │ mental health data is ready    │  │
│    │ for this August! Have a look   │  │
│    │ at it! Your data is protected  │  │
│    │ 🔒🔐                            │  │
│    │                                │  │
│    │ ┌─────────────────────────┐    │  │
│    │ │ 🟠 Mental State.pdf     │    │  │
│    │ │    Aug 7 • 4kb      [⬇] │    │  │
│    │ └─────────────────────────┘    │  │
│    │                                │  │
│    │ ┌─────────────────────────┐    │  │
│    │ │ 🟢 Stress Level.nor     │    │  │
│    │ │    Aug 8 • 29mb     [⬇] │    │  │
│    │ └─────────────────────────┘    │  │
│    │                                │  │
│    │ ┌─────────────────────────┐    │  │
│    │ │ 🔵 Sleep Level.mp4      │    │  │
│    │ │    Aug 3 • 8gb      [⬇] │    │  │
│    │ └─────────────────────────┘    │  │
│    └─────────────────────────────────┘  │
│                                         │
│ ┌───────────────────────────────────┐   │
│ │ ✓ Health report updated to your  │   │
│ │   account.                       │   │
│ └───────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ OMG, thanks soo much doc! 🥹    │ ← │
│  │ My life is easier because now  │    │
│  │ I've got the data! 🎉          │    │
│  └─────────────────────────────────┘    │
│                                         │
├─────────────────────────────────────────┤
│ [📎] Type to start chatting... [🎤][➤] │
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Props/Config |
|-----------|-------------|--------------|
| ChatHeader | Standard header | `title`, `chatsLeft`, `model` |
| AIMessageBubble | AI intro with embedded files | `text`, `embeddedContent` |
| FileCard | Downloadable file display | `filename`, `date`, `size`, `iconColor`, `onDownload` |
| FileIcon | Colored circle icon | `color`, `fileType` |
| DownloadButton | Download action button | `onPress`, `isDownloading` |
| FileSizeLabel | Size display | `size`, `unit` |
| DateLabel | File date | `date`, `format` |
| SuccessNotification | Update confirmation | `message` |
| UserMessageBubble | User response | `text` |
| ChatInputBar | Message composition | Standard props |

### 4. Responsibility Split

**UI (Presentational)**:
- Display file cards with icon, name, metadata
- Show download progress when active
- Render success notification
- Color-code files by type

**Logic (Container/Hooks)**:
- Generate/fetch report files
- Handle file downloads
- Save to device storage
- Track download progress

### 5. State Definition

```typescript
interface HealthReportState {
  // Reports
  reports: HealthReport[];
  isGenerating: boolean;

  // Downloads
  activeDownloads: Map<string, DownloadProgress>;
  completedDownloads: string[];

  // Notification
  showNotification: boolean;
  notificationMessage: string;
}

interface DownloadProgress {
  fileId: string;
  progress: number;           // 0-100
  status: 'pending' | 'downloading' | 'completed' | 'failed';
}
```

### 6. Data Models

```typescript
interface HealthReport {
  id: string;
  filename: string;
  fileType: 'pdf' | 'csv' | 'json' | 'mp4';
  fileSize: number;           // in bytes
  fileSizeDisplay: string;    // "4kb", "29mb"
  generatedDate: string;
  downloadUrl: string;
  iconColor: string;
  category: 'mental_state' | 'stress' | 'sleep' | 'mood' | 'activity';
  month: string;
  year: number;
  isProtected: boolean;
}

interface ReportContent {
  mentalState: {
    averageScore: number;
    trend: string;
    insights: string[];
  };
  stressLevel: {
    averageLevel: number;
    peakDays: string[];
    triggers: string[];
  };
  sleepQuality: {
    averageHours: number;
    qualityScore: number;
    patterns: string[];
  };
}
```

### 7. Navigation

| Action | Destination | Data Passed |
|--------|-------------|-------------|
| Back arrow | ConversationsDashboard | - |
| Download button | System download/share | `fileUrl` |
| File card tap | FilePreview (if supported) | `file` |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Report generating | Show loading state, "Generating report..." |
| Download in progress | Progress bar on file card |
| Download complete | Checkmark icon, "Downloaded" label |
| Download failed | Error message, retry button |
| No reports available | "No data for this month" |
| Large file | Warning about download size/time |
| No storage space | Error message before download |

### 9. Implementation Breakdown

1. **FileCard Component**
   - Colored icon based on file type
   - Filename with extension
   - Date and size metadata
   - Download button with progress state

2. **Report Generation**
   - Generate PDF from user data
   - Compile statistics for the month
   - Create visualizations for sleep/stress

3. **Download Flow**
   - Check storage permissions
   - Download to device
   - Show in downloads/files app
   - Support sharing via system sheet

### 10. Open Issues

| Issue | Priority | Notes |
|-------|----------|-------|
| **".rar" file format** | **HIGH** | Inappropriate format for health data - should be PDF, CSV, or JSON |
| **"8gb" file size** | **HIGH** | Unrealistic for a sleep report - should be KB or MB range |
| **File size inconsistency** | **MEDIUM** | 4kb vs 29mb vs 8gb seems arbitrary |
| **Date order** | **LOW** | Aug 7, Aug 8, Aug 3 not chronological |
| Report generation | HIGH | How are reports generated? Backend service? |
| Data privacy | HIGH | Are files encrypted? How stored? |
| File format selection | MEDIUM | Let user choose PDF vs CSV vs JSON? |
| Video report (.mp4) | MEDIUM | Why video? Consider removing or explaining |

---

## New Components Identified (Batch 13)

| Component | First Seen | Reusable |
|-----------|------------|----------|
| StarburstBackground | Screen 60 | Yes - onboarding/feature intros |
| ExpressionIllustration | Screen 60 | No - specific to voice feature |
| LightningBoltIcon | Screen 60 | Yes - stress indicators |
| ActionBar | Screen 60 | Yes - bottom action bars |
| ReadyLabel | Screen 60 | Yes - state labels |
| TranscriptionDisplay | Screen 61 | Yes - any speech-to-text |
| ConcentricCirclesAnimation | Screen 61 | Yes - audio visualization |
| RecordingTimer | Screen 61 | Yes - any recording feature |
| VoiceMessageCard | Screen 62 | Yes - chat voice messages |
| AudioWaveform | Screen 62 | Yes - audio visualization |
| PlayButton | Screen 62 | Yes - media playback |
| JournalPreviewCard | Screen 62 | Yes - embedded journal views |
| JournalEntryMini | Screen 62 | Yes - compact entry display |
| SortDropdown | Screen 62 | Yes - list filtering |
| QuoteCard | Screen 63 | Yes - inspirational content |
| QuotationMarks | Screen 63 | Yes - decorative typography |
| QuoteText | Screen 63 | Yes - quote styling |
| QuoteAttribution | Screen 63 | Yes - author credits |
| SocialButton | Screen 63 | Yes - engagement actions |
| FileCard | Screen 64 | Yes - downloadable files |
| FileIcon | Screen 64 | Yes - file type indicators |
| FileSizeLabel | Screen 64 | Yes - metadata display |
| DateLabel | Screen 64 | Yes - timestamp display |

---

## Issues Identified (Batch 13)

### Issue #11: Truncated/Typo Placeholder Text (Screen 62)

**Location**: `batch-13-ai-chatbot-voice-reports.md` - Screen 62
**Source**: `ui-designs/Dark-mode/🔒 AI Therapy Chatbot/AI_Therapy_Chatbot_Screen_16.png`

**Problem**: Journal entry shows "Surprise birt! gift from bes" - clearly truncated/typo placeholder

**Required Action**:
- [ ] Fix to "Surprise birthday gift from best friend Very Happy"
- [ ] Ensure all placeholder text is complete and readable

---

### Issue #12: Inappropriate File Formats in Health Report (Screen 64)

**Location**: `batch-13-ai-chatbot-voice-reports.md` - Screen 64
**Source**: `ui-designs/Dark-mode/🔒 AI Therapy Chatbot/AI_Therapy_Chatbot_Screen_18.png`

**Problem**: Health reports use inappropriate file formats and sizes:
- "Stress Level.rar" - RAR is archive format, not appropriate for health data
- "Sleep Level.mp4" - 8GB video file is unrealistic
- File sizes (4kb, 29mb, 8gb) are inconsistent and unrealistic

**Required Action**:
- [ ] Change all file formats to appropriate types (PDF, CSV, JSON)
- [ ] Use realistic file sizes (KB to low MB range)
- [ ] Remove or justify video format for health reports

---

## Summary

| Screen | Name | Key Features |
|--------|------|--------------|
| 60 | VoiceExpressionReady | Starburst illustration, microphone button, "Ready" action bar |
| 61 | VoiceRecordingActive | Real-time transcription, 24:55 timer, concentric circles animation |
| 62 | VoiceMessageSentWithJournal | Audio playback card, GPS integration, embedded journal preview |
| 63 | DailyQuoteWithSocial | Quote card with 51 likes/8 comments, author info follow-up |
| 64 | MonthlyHealthReportFiles | Three downloadable files (PDF, RAR, MP4), data protection messaging |

**Total AI Chatbot Screens Documented**: 18/20
**Total App Screens Documented**: 64/153
