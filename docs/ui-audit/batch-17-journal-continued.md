# Batch 17: Mental Health Journal (Screens 3-7)

**Screens Covered**: 80-84 (Journal Type Selector, Voice Recording, Text Composer, Timeline List)
**Source Files**: `ui-designs/Dark-mode/🔒 Mental Health Journal/Mental_Health_Journal_Screen_03.png` through `Mental_Health_Journal_Screen_07.png`

---

## Screen 80: NewJournalTypeSelector

### 1. Purpose
Selection screen allowing users to choose between voice-based (AI transcription) or manual text journaling methods.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [9:41]                    [Signal][Batt]│
│                                         │
│  (◐) ← Back                             │
│                                         │
│  New Mental                             │
│  Health Journal                         │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  🎤 (green circle)                  ││
│  │                                     ││
│  │  Voice Journal                    > ││
│  │  Automaticly create ealth journal   ││
│  │  by Voice & Face detection with AI  ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  📄 (orange circle)                 ││
│  │                                     ││
│  │  Text journal                     > ││
│  │  Set up manual text journal based   ││
│  │  on your current mood & conditions  ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │       Create Journal  +             ││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Variant/State |
|-----------|-------------|---------------|
| BackButton | Crescent moon icon in circle | Default |
| ScreenTitle | "New Mental Health Journal" | Large, white, multi-line |
| JournalTypeCard | Voice option card | With mic icon, chevron |
| JournalTypeCard | Text option card | With document icon, chevron |
| IconCircle | Colored background for icons | Green (voice), Orange (text) |
| ChevronRight | Navigation indicator | Gray |
| PrimaryButton | "Create Journal +" | Full-width, tan |

### 4. Responsibility Split

**UI Layer (Presentational)**:
- Render two selectable card options
- Show icon with colored background
- Display title and description text
- Highlight selected option
- Render create button

**Logic Layer (Container/Hooks)**:
- Track selected journal type
- Validate selection before proceeding
- Navigate to appropriate creation flow
- Track analytics for type selection

### 5. State Definition

```typescript
interface NewJournalTypeSelectorState {
  // Local UI State
  selectedType: 'voice' | 'text' | null;
  isCreating: boolean;
}
```

### 6. Data Models

```typescript
type JournalType = 'voice' | 'text';

interface JournalTypeOption {
  type: JournalType;
  icon: IconType;
  iconColor: string;
  title: string;
  description: string;
}

const journalTypeOptions: JournalTypeOption[] = [
  {
    type: 'voice',
    icon: 'microphone',
    iconColor: '#9AAD5C', // Olive green
    title: 'Voice Journal',
    description: 'Automatically create health journal by Voice & Face detection with AI'
  },
  {
    type: 'text',
    icon: 'document',
    iconColor: '#E8853A', // Orange
    title: 'Text journal',
    description: 'Set up manual text journal based on your current mood & conditions'
  }
];
```

### 7. Navigation

| Action | Destination | Parameters |
|--------|-------------|------------|
| Back button | JournalDashboard | - |
| Select Voice + Create | VoiceJournalReady | `{ type: 'voice' }` |
| Select Text + Create | TextJournalComposer | `{ type: 'text' }` |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| No selection | Create button disabled or selects default |
| Voice selected | Voice card highlighted, proceed to recording |
| Text selected | Text card highlighted, proceed to composer |
| Creating | Show loading state on button |
| Mic permission denied | Show permission request or fallback to text |
| Camera permission denied | Voice with face detection may be limited |

### 9. Implementation Breakdown

1. **JournalTypeCard Component**
   - Icon with colored circular background
   - Title and description text
   - Chevron indicating navigation
   - Selected state with border highlight
   - Pressable with feedback

2. **Selection Logic**
   - Single selection (radio-style)
   - Create button activates on selection
   - Permission checks for voice option

3. **Navigation Flow**
   - Voice: Check microphone permission → VoiceJournalReady
   - Text: Direct navigation → TextJournalComposer

### 10. Open Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| 80-1 | Typo: "Automaticly" | Medium | Should be "Automatically" |
| 80-2 | Typo: "ealth" | Medium | Should be "health" |
| 80-3 | Inconsistent capitalization | Low | "Voice Journal" vs "Text journal" |
| 80-4 | Button behavior unclear | Medium | Is selection required or does tapping card navigate directly? |

---

## Screen 81: VoiceJournalReady

### 1. Purpose
Preparation screen for voice journal recording, showing user is ready to begin speaking their journal entry.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [9:41]                    [Signal][Batt]│
│                                         │
│  (◐) ← Back                             │
│                                         │
│                                         │
│                                         │
│       Say anything that's               │
│          on your mind!                  │
│                                         │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ ││││││││││││││││││││││││││││││││││││││
│  │ (Audio waveform - idle/flat bars)   ││
│  └─────────────────────────────────────┘│
│                                         │
│                                         │
│            ┌─────────┐                  │
│            │    🎤   │ ← Large mic btn  │
│            └─────────┘                  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  (✕)      Ready        (✓)       │  │
│  │ Cancel               Confirm      │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Variant/State |
|-----------|-------------|---------------|
| BackButton | Crescent moon in circle | Default |
| PromptTitle | "Say anything that's on your mind!" | Centered, white, large |
| AudioWaveform | Vertical bar visualization | Idle state (uniform height) |
| MicrophoneButton | Large circular record button | Ready state, white bg |
| StatusLabel | "Ready" text | Centered below mic |
| CancelButton | X icon in brown circle | Left position |
| ConfirmButton | Checkmark in brown circle | Right position |
| BottomActionBar | Container for cancel/confirm | Curved brown background |

### 4. Responsibility Split

**UI Layer (Presentational)**:
- Display encouraging prompt text
- Render idle waveform visualization
- Show large microphone button
- Display ready status
- Position action buttons

**Logic Layer (Container/Hooks)**:
- Initialize audio recording session
- Request microphone permissions
- Handle recording start on mic tap
- Manage cancel/confirm actions
- Track recording state

### 5. State Definition

```typescript
interface VoiceJournalReadyState {
  // Local UI State
  isReady: boolean;
  permissionGranted: boolean;

  // Recording State
  recordingState: 'idle' | 'ready' | 'initializing';
}
```

### 6. Data Models

```typescript
interface VoiceRecordingSession {
  sessionId: string;
  startedAt: Date | null;
  status: 'pending' | 'ready' | 'recording' | 'completed' | 'cancelled';
}
```

### 7. Navigation

| Action | Destination | Parameters |
|--------|-------------|------------|
| Back button | NewJournalTypeSelector | - |
| Cancel (X) | NewJournalTypeSelector | - |
| Tap microphone | VoiceJournalRecording | Start recording |
| Confirm (✓) | Disabled in ready state | - |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Initializing | Show loading spinner on mic button |
| Ready | Mic button pulsing/ready animation |
| Permission denied | Show permission request modal |
| Microphone unavailable | Show error, offer text alternative |
| Confirm disabled | Checkmark grayed out until recording done |

### 9. Implementation Breakdown

1. **AudioWaveform Component**
   - Array of vertical bars
   - Uniform height in idle state
   - Animated when recording active
   - Color: muted brown/tan

2. **MicrophoneButton Component**
   - Large circular button (white background)
   - Microphone icon centered
   - Tap to start recording
   - Could have pulse animation when ready

3. **BottomActionBar Component**
   - Curved top edge (matches design system)
   - Cancel (left) and Confirm (right) buttons
   - Status text centered between buttons

### 10. Open Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| 81-1 | Confirm button behavior | Medium | Should be disabled or hidden in ready state |
| 81-2 | Back vs Cancel redundancy | Low | Both navigate away - consider removing one |

---

## Screen 82: VoiceJournalRecording

### 1. Purpose
Active voice recording screen with real-time speech-to-text transcription and audio visualization.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [9:41]                    [Signal][Batt]│
│                                         │
│  (◐) ← Back                             │
│                                         │
│                                         │
│    Today I had a hard                   │
│    time concentrating. I                │
│    was very worried                     │
│    about making                         │
│    mistakes, very angr|                 │
│                      ↑ cursor           │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │    ▌▌▌█▌▌▌▌▌▌██▌▌▌▌▌▌▌█▌▌▌▌        ││
│  │ (Active audio waveform - varying)   ││
│  └─────────────────────────────────────┘│
│                                         │
│            ┌─────────┐                  │
│            │    🎤   │ ← Mic button     │
│            └─────────┘                  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  (✕)      00:05       (✓)        │  │
│  │ Orange    Timer      Green        │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Variant/State |
|-----------|-------------|---------------|
| BackButton | Crescent moon in circle | Default |
| TranscriptionDisplay | Live speech-to-text | Scrolling, with cursor |
| KeywordHighlight | Emphasized text | Bold white on key phrases |
| AudioWaveform | Active sound visualization | Varying heights, tan/orange |
| MicrophoneButton | Recording control | Active state |
| RecordingTimer | "00:05" format | Centered |
| CancelButton | X icon | Orange background (active) |
| ConfirmButton | Checkmark icon | Green/olive background (active) |

### 4. Responsibility Split

**UI Layer (Presentational)**:
- Display live transcription text
- Highlight key emotional phrases
- Animate audio waveform bars
- Show recording duration timer
- Render colored action buttons

**Logic Layer (Container/Hooks)**:
- Manage audio recording stream
- Process speech-to-text in real-time
- Detect keywords for highlighting
- Track recording duration
- Handle pause/resume/stop
- Save audio file on confirm

### 5. State Definition

```typescript
interface VoiceJournalRecordingState {
  // Recording State
  isRecording: boolean;
  isPaused: boolean;
  durationSeconds: number;

  // Transcription State
  transcriptionText: string;
  highlightedPhrases: string[];
  isTranscribing: boolean;

  // Audio State
  audioLevels: number[]; // For waveform visualization
  audioFileUri: string | null;
}
```

### 6. Data Models

```typescript
interface VoiceJournalRecording {
  id: string;
  audioUri: string;
  transcription: string;
  duration: number; // seconds
  detectedEmotions: string[];
  highlightedPhrases: HighlightedPhrase[];
  createdAt: Date;
}

interface HighlightedPhrase {
  text: string;
  startIndex: number;
  endIndex: number;
  emotionType: 'negative' | 'positive' | 'neutral';
}
```

### 7. Navigation

| Action | Destination | Parameters |
|--------|-------------|------------|
| Back button | Confirmation modal | Discard warning |
| Cancel (orange X) | NewJournalTypeSelector | Discard recording |
| Confirm (green ✓) | JournalPreview or Save | `{ recording: VoiceJournalRecording }` |
| Tap mic | Pause/Resume recording | - |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Recording active | Waveform animates, timer increments |
| Paused | Waveform frozen, mic icon changes |
| Transcription lag | Show typing indicator |
| Long recording | Scroll transcription, show duration warning |
| Silence detected | Maybe prompt user to continue |
| Max duration reached | Auto-stop with notification |
| Speech unclear | Show confidence indicator or retry suggestion |

### 9. Implementation Breakdown

1. **TranscriptionDisplay Component**
   - Large text area with real-time updates
   - Auto-scroll to bottom as text grows
   - Support for keyword highlighting (bold)
   - Blinking cursor at end
   - Word-by-word or phrase-by-phrase reveal

2. **AudioWaveform Component (Active)**
   - Bar heights respond to audio input levels
   - Smooth animation between levels
   - Color gradient: brown → tan → orange for intensity
   - 20-30 bars typical

3. **RecordingTimer Component**
   - MM:SS format
   - Updates every second
   - Could show max duration countdown

4. **Keyword Detection**
   - AI identifies emotional keywords
   - "making mistakes" highlighted in design
   - Bold or background highlight treatment

### 10. Open Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| 82-1 | Incomplete word shown | Low | "angr" truncated - is this real-time streaming artifact? |
| 82-2 | Highlight criteria unclear | Medium | What triggers keyword highlighting? |
| 82-3 | Pause functionality | Medium | Is mic tap pause or stop? |

---

## Screen 83: TextJournalComposer

### 1. Purpose
Manual text entry form for creating a journal entry with mood selection, stress level, and stressor tagging.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│  (◐) ← Back                             │
│                                         │
│  Add New Journal                        │
│                                         │
│  ┌──────────────┬──────────────┐        │
│  │    Text      │    Voice     │ ← Tabs │
│  │   (active)   │              │        │
│  └──────────────┴──────────────┘        │
│                                         │
│  Journal Title                          │
│  ┌─────────────────────────────────────┐│
│  │ 📄 Feeling Bad Again           🎨  ││
│  └─────────────────────────────────────┘│
│                                         │
│  Write Your Entry                       │
│  ┌─────────────────────────────────────┐│
│  │ I had [a bad day] today, at         ││
│  │ school... It's fine I guess...|     ││
│  │                                     ││
│  │                                     ││
│  │  ↩️  ↪️   📷   🎤   ⬆️            ││
│  └─────────────────────────────────────┘│
│                                         │
│  Stress Level                           │
│  ●━━━━━━━━━━━●━━━━━━━━━○               │
│  1           3           5              │
│                                         │
│  Select Your Emotion                    │
│  [😖] [😢] [😐] [😊] [😆]              │
│  (sel)                                  │
│                                         │
│  Select Stressor                        │
│  [Loneliness ●] [Money Issue ○] [Patie..│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │       Create Journal  +             ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Variant/State |
|-----------|-------------|---------------|
| BackButton | Crescent moon | Default |
| ScreenTitle | "Add New Journal" | Large, white |
| SegmentedControl | Text / Voice tabs | Text selected (tan bg) |
| FormLabel | "Journal Title", etc. | Gray, small |
| TitleInput | Text field with icon | Document icon, color picker |
| ColorPickerButton | Color selection icon | Right side of title input |
| RichTextEditor | Multi-line entry area | With toolbar |
| TextHighlight | Yellow/orange highlight | On "a bad day" phrase |
| EditorToolbar | Undo, Redo, Camera, Mic, Upload | Icon row |
| StressSlider | 1-5 scale slider | Value at 3, green track |
| EmotionSelector | 5 emoji row | Depressed selected (purple border) |
| StressorChips | Horizontal scroll chips | Radio-style selection |
| PrimaryButton | "Create Journal +" | Full-width, tan |

### 4. Responsibility Split

**UI Layer (Presentational)**:
- Render tab switcher
- Display form fields with labels
- Show rich text editor with toolbar
- Render emoji selector row
- Display stress slider
- Show stressor chips (scrollable)
- Position create button

**Logic Layer (Container/Hooks)**:
- Manage form state (title, content, stress, emotion, stressor)
- Handle text formatting (highlights)
- Process media attachments
- Validate required fields
- Submit journal entry
- Auto-detect emotion from text (AI feature)

### 5. State Definition

```typescript
interface TextJournalComposerState {
  // Form State
  title: string;
  titleColor: string;
  entryContent: string;
  stressLevel: number; // 1-5
  selectedEmotion: Mood;
  selectedStressor: string | null;

  // Editor State
  textFormatting: TextFormatRange[];
  attachments: Attachment[];

  // UI State
  activeTab: 'text' | 'voice';
  isSubmitting: boolean;
  hasUnsavedChanges: boolean;
}

interface TextFormatRange {
  start: number;
  end: number;
  type: 'highlight' | 'bold' | 'italic';
  color?: string;
}

interface Attachment {
  type: 'image' | 'audio' | 'file';
  uri: string;
  name: string;
}
```

### 6. Data Models

```typescript
type Mood = 'depressed' | 'sad' | 'neutral' | 'happy' | 'overjoyed';

interface JournalEntry {
  id: string;
  title: string;
  titleColor?: string;
  content: string;
  formattedContent?: TextFormatRange[];
  stressLevel: number;
  mood: Mood;
  stressor: string | null;
  attachments: Attachment[];
  createdAt: Date;
  updatedAt: Date;
  source: 'text' | 'voice';
}

const stressorOptions = [
  'Loneliness',
  'Money Issue',
  'Patience', // Truncated in design as "Patie..."
  'Work',
  'Relationships',
  'Health',
  // ... more options
];

const moodEmojis: Record<Mood, { emoji: string; color: string }> = {
  depressed: { emoji: '😖', color: '#7B68B5' }, // Purple
  sad: { emoji: '😢', color: '#E8853A' },       // Orange
  neutral: { emoji: '😐', color: '#6B6B6B' },   // Gray
  happy: { emoji: '😊', color: '#C4A535' },     // Yellow/gold
  overjoyed: { emoji: '😆', color: '#9AAD5C' }  // Green
};
```

### 7. Navigation

| Action | Destination | Parameters |
|--------|-------------|------------|
| Back button | Confirmation if unsaved | Discard warning |
| Voice tab | VoiceJournalReady | Switch mode |
| Camera icon | Camera/Photo picker | Add image attachment |
| Mic icon | Voice note recording | Inline audio |
| Create Journal | JournalTimelineList | Save and navigate |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Empty form | Create button disabled |
| Title only | Minimum required for save |
| Long content | Text area scrolls internally |
| Multiple stressors? | Design shows radio (single select) |
| No emotion selected | Require or default to neutral |
| Switching to Voice tab | Warn if content entered |
| Attachments added | Show preview thumbnails |
| Max character limit | Show counter, prevent overflow |

### 9. Implementation Breakdown

1. **SegmentedControl Component**
   - Two segments: Text | Voice
   - Active segment has tan/beige background
   - Tap to switch modes

2. **TitleInput Component**
   - Document icon prefix
   - Text input field
   - Color picker button suffix
   - Border styling

3. **RichTextEditor Component**
   - Multi-line text input
   - Support for text highlighting
   - Toolbar with formatting options
   - Character/word count optional

4. **EditorToolbar Component**
   - Undo/Redo buttons
   - Camera (add photo)
   - Microphone (add voice note)
   - Upload (add file)

5. **StressSlider Component**
   - Range 1-5
   - Green filled track
   - Dot indicator at current value
   - Number labels at 1, 3, 5

6. **EmotionSelector Component**
   - Horizontal row of 5 emoji buttons
   - Selected has colored border
   - Maps to Mood enum

7. **StressorChips Component**
   - Horizontal scrolling
   - Radio-style (single select)
   - Selected chip has green background with radio dot

### 10. Open Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| 83-1 | Stressor truncation | Low | "Patie..." - need full list |
| 83-2 | Highlight trigger unclear | Medium | Is "a bad day" auto-detected or manual? |
| 83-3 | Color picker behavior | Low | What colors available for title? |
| 83-4 | Multi-stressor selection? | Medium | Radio suggests single, but user may have multiple |

---

## Screen 84: JournalTimelineList

### 1. Purpose
Chronological timeline view of all journal entries with calendar navigation, mood indicators, and entry previews.

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [9:41]                    [Signal][Batt]│
│                                         │
│  (◐)                                    │
│                                         │
│  My Journals                            │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ Mon  Tue  Wed  Thu  Fri  Sat  Sun  ││
│  │  25  [26]  27   28   29   30    3  ││
│  │   •    •    •    •    •    •    •  ││
│  │  (colors indicate mood entries)     ││
│  └─────────────────────────────────────┘│
│                                         │
│  Timeline              Newest ▼         │
│                                         │
│  10:00 ─┬─ ●  Feeling Positive Today! 😊│
│         │     [Overjoyed] (green)       │
│         │     Im grateful for the...    │
│         │     ↗ 7 AI Suggestions • ♡96  │
│         │                               │
│       ─┬─ ●  Got A Gift from my BF...   │
│         │     [Happy] (yellow)          │
│         │     I experienced pure joy... │
│         │     ↗ 7 AI Suggestions • ♡96  │
│         │                               │
│  09:00 ─┬─ ●  Felt Bad. but it's all OK.│
│         │     [Neutral] (gray)          │
│         │     I felt anxious today...   │
│         │     ↗ 7 AI Suggestions • ♡96  │
│         │                               │
│  08:00 ─┬─ ●  Felt Sad & Grief. IDK...  │
│         │     [Sad] (orange)            │
│         │     Feeling sad today...      │
│         │     ↗ 7 AI Suggestions • ♡96  │
│         │                               │
│  07:00 ─┬─ ●  I wanna end myself.       │
│         │     [Depressed] (purple)      │
│         │     MY BF just got killed...  │
│         │     ↗ 7 AI Suggestions • ♡96  │
│                                         │
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Variant/State |
|-----------|-------------|---------------|
| BackButton | Crescent moon | Default |
| ScreenTitle | "My Journals" | Large, white |
| WeekCalendarStrip | Horizontal day selector | Tue 26 selected (orange) |
| DayCell | Individual day column | With mood dot indicator |
| MoodDotIndicator | Colored dot under date | Varies by mood |
| SectionHeader | "Timeline" | With sort dropdown |
| SortDropdown | "Newest ▼" | Dropdown selector |
| TimelineConnector | Vertical line with timestamps | Left side |
| JournalEntryCard | Entry preview card | With avatar, mood badge |
| TimeLabel | "10:00", "09:00", etc. | Gray, left of timeline |
| MoodAvatar | Colored circle avatar | Matches mood color |
| EntryTitle | Journal title text | White, bold |
| MoodBadge | "Overjoyed", "Happy", etc. | Colored pill |
| EntryPreview | Truncated content | Gray text |
| MetadataRow | AI suggestions + heart rate | Small, gray |

### 4. Responsibility Split

**UI Layer (Presentational)**:
- Render week calendar strip
- Display timeline with connectors
- Show entry cards with mood styling
- Position time labels
- Render sort dropdown

**Logic Layer (Container/Hooks)**:
- Fetch journal entries for date range
- Handle date selection
- Sort entries by time
- Navigate to entry detail
- Track scroll position for lazy loading

### 5. State Definition

```typescript
interface JournalTimelineListState {
  // Calendar State
  selectedDate: Date;
  weekStartDate: Date;

  // List State
  entries: JournalEntry[];
  sortOrder: 'newest' | 'oldest';
  isLoading: boolean;

  // UI State
  scrollPosition: number;
}
```

### 6. Data Models

```typescript
interface JournalEntryPreview {
  id: string;
  title: string;
  contentPreview: string; // Truncated
  mood: Mood;
  timestamp: Date;
  aiSuggestionsCount: number;
  heartRate?: number; // bpm
}

interface WeekDay {
  dayOfWeek: string; // Mon, Tue, etc.
  date: number;
  hasEntries: boolean;
  dominantMood?: Mood; // For dot color
}

// Timeline entry from design
const sampleEntries: JournalEntryPreview[] = [
  {
    id: '1',
    title: 'Feeling Positive Today!',
    contentPreview: 'Im grateful for the supportive phone call I had with my best friend.',
    mood: 'overjoyed',
    timestamp: new Date('2024-11-26T10:00:00'),
    aiSuggestionsCount: 7,
    heartRate: 96
  },
  // ... more entries
];
```

### 7. Navigation

| Action | Destination | Parameters |
|--------|-------------|------------|
| Back button | Previous screen | - |
| Day cell tap | Filter to that date | `{ date: Date }` |
| Entry card tap | JournalEntryDetail | `{ entryId: string }` |
| Sort dropdown | Re-sort list | `{ order: 'newest' | 'oldest' }` |
| FAB (if present) | NewJournalTypeSelector | - |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Loading | Show skeleton cards |
| Empty day | "No entries" message |
| Many entries | Virtualized list for performance |
| Long title | Truncate with ellipsis |
| Long preview | Max 2 lines, truncate |
| Future dates | Disabled or empty |
| Week navigation | Swipe or arrows to change week |

### 9. Implementation Breakdown

1. **WeekCalendarStrip Component**
   - Horizontal scroll of 7 days
   - Selected day highlighted (orange circle)
   - Mood dots below each day
   - Swipeable to adjacent weeks

2. **TimelineConnector Component**
   - Vertical line on left
   - Time labels at entry positions
   - Avatar dots on the line

3. **JournalEntryCard Component**
   - Title with emoji suffix
   - Mood badge (colored pill)
   - Content preview (2 lines max)
   - Metadata row (AI suggestions, heart rate)
   - Tap handler for navigation

4. **SortDropdown Component**
   - "Newest" / "Oldest" options
   - Down arrow indicator
   - Updates list on selection

### 10. Open Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| 84-1 | **CRITICAL: Suicidal content** | **CRITICAL** | "I wanna end myself" - inappropriate placeholder |
| 84-2 | **CRITICAL: Violent content** | **CRITICAL** | "BF just got killed in a car accident. Whoever fucking do this will get..." |
| 84-3 | Profanity in placeholder | High | "fucking" in entry text |
| 84-4 | Missing timestamp | Low | Second entry has no time label |
| 84-5 | Japanese text | Low | "Daijubu dayu! fufufu" - intentional or error? |
| 84-6 | Typo: "Im" | Low | Should be "I'm" |
| 84-7 | Week mismatch | Low | Sun shows "3" - different month? |

---

## Cross-Screen Components (Batch 17)

### New Components Identified

| Component | Used In | Priority |
|-----------|---------|----------|
| JournalTypeCard | Screen 80 | Medium |
| VoicePromptDisplay | Screen 81 | Medium |
| AudioWaveformVisualizer | Screens 81, 82 | High |
| TranscriptionDisplay | Screen 82 | High |
| KeywordHighlight | Screen 82 | Medium |
| RecordingControls | Screens 81, 82 | High |
| RichTextEditor | Screen 83 | High |
| EditorToolbar | Screen 83 | Medium |
| ColorPickerButton | Screen 83 | Low |
| StressSlider | Screen 83 | Medium |
| EmotionSelectorRow | Screen 83 | High |
| StressorChipList | Screen 83 | Medium |
| WeekCalendarStrip | Screen 84 | High |
| TimelineView | Screen 84 | High |
| TimelineConnector | Screen 84 | Medium |
| JournalEntryCard | Screen 84 | High |
| MoodDotIndicator | Screen 84 | Low |
| MetadataRow | Screen 84 | Low |

### Shared Patterns

1. **Voice Recording Flow**
   - Ready → Recording → Preview → Save
   - Waveform visualization throughout
   - Cancel/Confirm action bar

2. **Mood Selection**
   - 5-point scale consistent across app
   - Same emoji set and colors
   - Used in composer and display

3. **Timeline Display**
   - Time labels on left
   - Connected vertical line
   - Cards with mood-colored avatars

---

## Critical Issues Found

### CRITICAL: Screen 84 - Harmful Placeholder Content

**Issue**: Multiple journal entries contain extremely inappropriate content:

1. **"I wanna end myself"** - Suicidal ideation as entry title
2. **"MY BF just got killed in a car accident. Whoever fucking do this will get..."** - Violence, trauma, and profanity

**Risk Level**: **CRITICAL**

**Impact**:
- Inappropriate for mental health application mockups
- May be triggering for developers, reviewers, QA
- Sets completely wrong tone for journal feature
- Profanity unprofessional in design assets

**Required Actions**:
- [ ] Replace all harmful placeholder titles and content
- [ ] Use neutral, supportive example entries
- [ ] Review all journal mockups for similar issues

**Suggested Replacements**:
| Current | Replacement |
|---------|-------------|
| "I wanna end myself" | "Reflecting on a difficult day" |
| "MY BF just got killed..." | "Processing some challenging news I received today" |

---

## Summary

| Screen | Name | Status | Critical Issues |
|--------|------|--------|-----------------|
| 80 | NewJournalTypeSelector | Documented | 2 typos |
| 81 | VoiceJournalReady | Documented | None |
| 82 | VoiceJournalRecording | Documented | None |
| 83 | TextJournalComposer | Documented | None |
| 84 | JournalTimelineList | Documented | **CRITICAL: Harmful content** |

**Total New Components**: 18
**Critical Issues**: 1 (with multiple sub-issues)
**Typos Found**: 3 ("Automaticly", "ealth", "Im")
