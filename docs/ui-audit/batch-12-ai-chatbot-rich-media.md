# Batch 12: AI Therapy Chatbot - Rich Media & Analysis Features

**Screens Covered**: 55-59 (AI Therapy Chatbot Screens 9-13)
**Source Files**: `ui-designs/Dark-mode/🔒 AI Therapy Chatbot/AI_Therapy_Chatbot_Screen_09.png` through `AI_Therapy_Chatbot_Screen_13.png`

---

## Screen 55: ChatbotBookRecommendations

### 1. Purpose
Displays AI-generated book recommendations within the chat interface, allowing users to request curated reading materials based on their mental health needs and reading preferences.

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
│  │ Hey hey doc!! Can you please   │ ← │
│  │ suggest some mental health book│    │
│  │ suggestions based on my mental │    │
│  │ health status? 🙏               │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ Needs to be <100 pages and     │ ← │
│  │ can be read within 30 minutes!!│    │
│  │ ⭐⭐                             │    │
│  └─────────────────────────────────┘    │
│                                         │
│    ┌─────────────────────────────────┐  │
│ →  │ Hey Shinomiya, Here are a few  │  │
│    │ mental health books for you    │  │
│    │ with <100 pages!               │  │
│    │                                │  │
│    │ ┌─────────────────────────┐    │  │
│    │ │ 📚 The Normality Demons │    │  │
│    │ │    By Andrew Solomon    │    │  │
│    │ │ [Tan] ━━━━━━━━━━ 23p   │    │  │
│    │ └─────────────────────────┘    │  │
│    │                                │  │
│    │ ┌─────────────────────────┐    │  │
│    │ │ 📕 Lost Connections     │    │  │
│    │ │    By Johann Hari       │    │  │
│    │ │ [Orange] ━━━━━━━━ 18p  │    │  │
│    │ └─────────────────────────┘    │  │
│    │                                │  │
│    │ ┌─────────────────────────┐    │  │
│    │ │ 📗 Stop Overthinking    │    │  │
│    │ │    By Chase D. Weekis   │    │  │
│    │ │ [Teal] ━━━━━━━━━ 16p   │    │  │
│    │ └─────────────────────────┘    │  │
│    └─────────────────────────────────┘  │
│                                         │
├─────────────────────────────────────────┤
│ [📎] Type to start chatting... [🎤][➤] │
├─────────────────────────────────────────┤
│          [QWERTY Keyboard]              │
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Props/Config |
|-----------|-------------|--------------|
| ChatHeader | Header with AI name, quota, model | `title`, `chatsLeft`, `model`, `onBack`, `onSearch` |
| UserMessageBubble | User's message aligned right | `text`, `timestamp`, `isSequential` |
| AIMessageBubble | AI response with embedded cards | `text`, `embeddedContent`, `timestamp` |
| BookRecommendationCard | Individual book suggestion | `title`, `author`, `pageCount`, `colorTheme`, `onPress` |
| BookProgressBar | Visual page count indicator | `currentPages`, `maxPages`, `color` |
| BookIcon | Colored book illustration | `color`, `size` |
| ChatInputBar | Message composition area | `onSend`, `onAttach`, `onVoice`, `placeholder` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render book recommendation cards with visual styling
- Display progress bars for page counts
- Handle card tap animations
- Show keyboard and input field

**Logic (Container/Hooks)**:
- Parse AI response for embedded book data
- Handle book card interactions (open details, save, etc.)
- Track book recommendations for user preferences
- Manage message state and sending

### 5. State Definition

```typescript
interface BookRecommendationsState {
  // Chat State
  messages: ChatMessage[];
  isLoading: boolean;

  // Book Recommendations
  recommendations: BookRecommendation[];
  selectedBook: BookRecommendation | null;

  // Input
  inputText: string;
  isTyping: boolean;
}

type LocalState = ['inputText', 'isTyping', 'selectedBook'];
type SharedState = ['messages', 'recommendations'];
type AsyncState = ['isLoading'];
```

### 6. Data Models

```typescript
interface BookRecommendation {
  id: string;
  title: string;
  author: string;
  pageCount: number;
  maxPages: number;           // For progress bar
  colorTheme: 'tan' | 'orange' | 'teal' | 'purple';
  coverImageUrl?: string;
  description?: string;
  amazonUrl?: string;
  tags: string[];
  relevanceScore: number;     // AI-determined match score
}

interface BookRecommendationResponse {
  books: BookRecommendation[];
  basedOn: string;            // "mental health status", "reading time", etc.
  aiConfidence: number;
}
```

### 7. Navigation

| Action | Destination | Data Passed |
|--------|-------------|-------------|
| Back arrow | ConversationsDashboard | - |
| Search icon | ChatSearch | `conversationId` |
| Book card tap | BookDetailModal | `book: BookRecommendation` |
| Send message | Stay (new message) | `messageText` |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Loading recommendations | Show skeleton cards in AI response |
| No matching books | AI message: "I couldn't find books matching your criteria" |
| Book unavailable | Grayed out card with "Currently unavailable" |
| Long book title | Truncate with ellipsis after 2 lines |
| Many recommendations | Vertical scroll within AI message bubble |
| Offline mode | Show cached recommendations only |

### 9. Implementation Breakdown

1. **BookRecommendationCard Component**
   - Colored icon based on `colorTheme`
   - Title and author text styling
   - Progress bar showing page count
   - Tap handler for details

2. **AI Response Parser**
   - Detect book recommendation intent in AI response
   - Extract structured book data from response
   - Render embedded cards within message bubble

3. **Book Interaction Flow**
   - Tap card → Show book details modal
   - Add to reading list action
   - Link to external purchase/download

### 10. Open Issues

| Issue | Priority | Notes |
|-------|----------|-------|
| Book database source | HIGH | Need real book data API (Google Books, OpenLibrary) |
| Author name accuracy | MEDIUM | "Chase D. Weekis" vs "Chase D. Weeks" - verify |
| Purchase integration | LOW | Link to Amazon, Audible, etc.? |
| Saved recommendations | MEDIUM | Where to persist user's book list |

---

## Screen 56: ChatbotSleepAnalysis

### 1. Purpose
Displays AI-generated sleep analysis with embedded interactive charts, providing data-driven recommendations based on the user's sleep tracking history.

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
│  │ Heya Doc F! I seem to have     │ ← │
│  │ trouble sleeping lately. Have  │    │
│  │ any suggestions?               │    │
│  └─────────────────────────────────┘    │
│                                         │
│    ┌─────────────────────────────────┐  │
│ →  │ Hello Shinomiya! Of course,    │  │
│    │ based on your sleep data over  │  │
│    │ last month, I would recommend  │  │
│    │ 3x sessions of 25m sleep       │  │
│    │ meditation before sleeping.    │  │
│    │                                │  │
│    │ ┌─────────────────────────┐    │  │
│    │ │ 💤 Sleep Quality   [1year▼]│  │  │
│    │ │ ┌─────────────────────┐ │    │  │
│    │ │ │ ▐█ ▐▌▐█▐▌▐█ ▐█▐█▐▌▐█│ │    │  │
│    │ │ │ ▐█▐█▐▌▐█▐▌▐█▐▌▐█▐▌▐█│ │    │  │
│    │ │ │    [Download]       │ │    │  │
│    │ │ └─────────────────────┘ │    │  │
│    │ │                         │    │  │
│    │ │ [Suggestions][Meditate] │    │  │
│    │ │ [Eat Well]   [Exercise] │    │  │
│    │ └─────────────────────────┘    │  │
│    └─────────────────────────────────┘  │
│                                         │
│ ┌───────────────────────────────────┐   │
│ │ ⭐ Course Added: Sleep Meditation │   │
│ └───────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ Thank You Doc F! A* 🎉⭐        │ ← │
│  └─────────────────────────────────┘    │
│                                         │
├─────────────────────────────────────────┤
│ [📎] Type to start chatting... [🎤][➤] │
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Props/Config |
|-----------|-------------|--------------|
| ChatHeader | Standard chat header | `title`, `chatsLeft`, `model` |
| UserMessageBubble | User question | `text`, `timestamp` |
| AIMessageBubble | Response with embedded chart | `text`, `embeddedContent` |
| SleepQualityChart | Interactive bar chart | `data`, `timeRange`, `onDownload` |
| TimeRangeDropdown | Filter selector (1year, 6mo, etc.) | `value`, `options`, `onChange` |
| ActionButtonRow | Quick action buttons | `buttons: ActionButton[]` |
| ActionButton | Individual action chip | `label`, `icon`, `onPress` |
| SuccessNotification | Green confirmation banner | `message`, `icon` |
| DownloadButton | Export chart data | `onPress`, `format` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render bar chart with sleep quality data
- Display action buttons in grid layout
- Show success notification with animation
- Handle time range dropdown interaction

**Logic (Container/Hooks)**:
- Fetch sleep data from health tracking service
- Process data for chart visualization
- Handle course enrollment action
- Generate PDF/image for download

### 5. State Definition

```typescript
interface SleepAnalysisState {
  // Chat
  messages: ChatMessage[];

  // Sleep Data
  sleepData: SleepDataPoint[];
  selectedTimeRange: '1week' | '1month' | '3months' | '6months' | '1year';

  // Actions
  activeCourses: string[];
  isEnrolling: boolean;

  // Notifications
  notification: NotificationState | null;
}

interface SleepDataPoint {
  date: string;
  quality: number;           // 0-100
  duration: number;          // minutes
  deepSleep: number;         // percentage
  remSleep: number;          // percentage
}
```

### 6. Data Models

```typescript
interface SleepRecommendation {
  type: 'meditation' | 'exercise' | 'nutrition' | 'habit';
  title: string;
  duration: string;          // "25m", "3x per week"
  frequency: string;
  courseId?: string;
  isEnrolled: boolean;
}

interface ActionButton {
  id: string;
  label: string;
  icon: string;
  action: 'navigate' | 'enroll' | 'filter';
  targetScreen?: string;
  courseId?: string;
}
```

### 7. Navigation

| Action | Destination | Data Passed |
|--------|-------------|-------------|
| "Suggestions" button | SleepSuggestions | `sleepData` |
| "Meditate" button | MeditationCourses | `filter: 'sleep'` |
| "Eat Well" button | NutritionGuide | - |
| "Exercise" button | ExerciseRoutines | `filter: 'sleep'` |
| Download button | System share sheet | `chartImage` |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| No sleep data | Show empty chart with "No data for this period" |
| Course already enrolled | Button shows checkmark, text "Enrolled" |
| Download in progress | Show loading spinner on button |
| Long time range (1 year) | Aggregate data by week |
| Chart interaction | Tap bar to show specific day details |

### 9. Implementation Breakdown

1. **SleepQualityChart Component**
   - Bar chart using react-native-chart-kit or Victory Native
   - Time range filtering with dropdown
   - Download functionality for sharing
   - Tap interaction for bar details

2. **ActionButtonRow Component**
   - 2x2 grid layout for action buttons
   - Each button navigates or enrolls
   - Visual feedback on tap

3. **Course Enrollment Flow**
   - Tap "Meditate" → Check if course exists
   - Enroll user → Show success notification
   - Update button state to "Enrolled"

### 10. Open Issues

| Issue | Priority | Notes |
|-------|----------|-------|
| Sleep data source | HIGH | Apple Health, Google Fit, or manual entry? |
| Chart library selection | MEDIUM | Victory Native vs react-native-chart-kit |
| Download format | LOW | PNG, PDF, or CSV options |
| Course system integration | HIGH | How do "courses" work in the app? |

---

## Screen 57: ChatbotFreudScoreProgress

### 1. Purpose
Displays the user's mental health score progression over time within the chat, celebrating improvements and providing encouragement through AI-generated insights.

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
│  │ Hey Doc F! What's my progress? │ ← │
│  │ Is my mental health improving  │    │
│  │ or not?? 🤔🤔                   │    │
│  └─────────────────────────────────┘    │
│                                         │
│    ┌─────────────────────────────────┐  │
│ →  │ Hello, Shinomiya! Your freud   │  │
│    │ score has increased to 88 last │  │
│    │ month. That's almost +285%     │  │
│    │ increase 6 months ago!         │  │
│    │                                │  │
│    │ Congratulations! You're        │  │
│    │ getting better! 🎊🎉           │  │
│    │                                │  │
│    │ ┌─────────────────────────┐    │  │
│    │ │ 🧠 Freud Score  [1month▼]│   │  │
│    │ │ ┌─────────────────────┐ │    │  │
│    │ │ │         ╭──88.5     │ │    │  │
│    │ │ │      ╭─╯            │ │    │  │
│    │ │ │   ╭─╯               │ │    │  │
│    │ │ │ ─╯                  │ │    │  │
│    │ │ └─────────────────────┘ │    │  │
│    │ └─────────────────────────┘    │  │
│    └─────────────────────────────────┘  │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ What? Unbelievable!! 🎊        │ ← │
│  │ Thanks a lot Doc F! 🎉🎉       │    │
│  │ You're truly the best AI       │    │
│  │ therapy. UwU.                  │    │
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
| UserMessageBubble | User's progress query | `text`, `timestamp` |
| AIMessageBubble | Celebratory response | `text`, `embeddedContent` |
| FreudScoreChart | Line graph showing progression | `data`, `timeRange`, `currentScore` |
| ScoreIndicator | Current score display on chart | `score`, `change`, `changePercent` |
| TimeRangeDropdown | Filter for time period | `value`, `options`, `onChange` |
| CelebrationAnimation | Confetti/particles overlay | `trigger`, `intensity` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render line chart with smooth curve
- Display current score indicator
- Animate celebration elements
- Show improvement percentage

**Logic (Container/Hooks)**:
- Calculate score change over time
- Determine celebration threshold
- Fetch historical score data
- Generate motivational message

### 5. State Definition

```typescript
interface FreudScoreProgressState {
  // Score Data
  scoreHistory: ScoreDataPoint[];
  currentScore: number;
  previousScore: number;
  changePercent: number;

  // Chart
  selectedTimeRange: '1week' | '1month' | '3months' | '6months' | '1year';

  // Celebration
  showCelebration: boolean;
  celebrationIntensity: 'low' | 'medium' | 'high';
}

interface ScoreDataPoint {
  date: string;
  score: number;
  factors: ScoreFactor[];
}

interface ScoreFactor {
  name: string;
  impact: number;        // positive or negative
  category: 'sleep' | 'mood' | 'activity' | 'social' | 'stress';
}
```

### 6. Data Models

```typescript
interface ProgressAnalysis {
  currentScore: number;
  startScore: number;
  changeAbsolute: number;
  changePercent: number;
  trend: 'improving' | 'stable' | 'declining';
  milestones: Milestone[];
  nextGoal: number;
}

interface Milestone {
  score: number;
  achievedDate: string;
  label: string;          // "First improvement", "Healthy range", etc.
}
```

### 7. Navigation

| Action | Destination | Data Passed |
|--------|-------------|-------------|
| Back arrow | ConversationsDashboard | - |
| Chart tap | FreudScoreDetail | `scoreHistory` |
| Time range change | Stay (refresh chart) | `newTimeRange` |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Score improved significantly | Show celebration animation, confetti |
| Score declined | Supportive message, no celebration |
| Score stable | Encouraging message about consistency |
| No historical data | Show single point, explain data collection |
| Very high improvement (+285%) | Extra celebration, achievement badge |
| New user | Explain score system, show baseline |

### 9. Implementation Breakdown

1. **FreudScoreChart Component**
   - Line chart with gradient fill below
   - Animated drawing effect
   - Current score callout at endpoint
   - Time range filtering

2. **Progress Calculation**
   - Compare current to baseline (6 months ago)
   - Calculate percentage change
   - Determine celebration threshold (>20% = celebrate)
   - Generate contextual message

3. **Celebration System**
   - Confetti animation on significant improvement
   - Intensity based on improvement magnitude
   - Celebration emoji in AI response

### 10. Open Issues

| Issue | Priority | Notes |
|-------|----------|-------|
| +285% calculation | HIGH | Seems unrealistic - verify scoring algorithm |
| Celebration threshold | MEDIUM | What improvement % triggers celebration? |
| Score decline messaging | HIGH | Ensure supportive, non-judgmental tone |
| Chart animation | LOW | Smooth curve animation on load |

---

## Screen 58: FacialExpressionCamera

### 1. Purpose
Provides a camera interface for capturing facial expressions to be analyzed by AI for emotional state detection, including biometric data overlay (heart rate, blood pressure).

### 2. UI Structure (Visual Only)

```
┌─────────────────────────────────────────┐
│ [Status Bar]                        9:41│
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────┐         ┌──────────┐     │
│  │ 💚 68bpm │         │ 💜 134sys│     │
│  └──────────┘         └──────────┘     │
│                                         │
│                                         │
│         ┌─────────────────┐             │
│         │                 │             │
│         │    [CAMERA      │             │
│         │     PREVIEW]    │             │
│         │                 │             │
│         │  ┌───────────┐  │             │
│         │  │  ◯ FACE   │  │             │
│         │  │  DETECT   │  │             │
│         │  │  OVERLAY  │  │             │
│         │  └───────────┘  │             │
│         │                 │             │
│         └─────────────────┘             │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ ⚠️ Stay still for better AI     │    │
│  │    Analysis                     │    │
│  └─────────────────────────────────┘    │
│                                         │
│                                         │
│     ┌───┐     ┌───────┐     ┌───┐      │
│     │ 🖼 │     │   ◉   │     │ 🔄 │      │
│     └───┘     └───────┘     └───┘      │
│                                         │
│           ┌───┐   ┌───┐                │
│           │ 📷 │   │ 📊 │                │
│           └───┘   └───┘                │
│                                         │
└─────────────────────────────────────────┘
```

### 3. Component List

| Component | Description | Props/Config |
|-----------|-------------|--------------|
| CameraPreview | Full-screen camera feed | `facing`, `onCapture`, `overlay` |
| FaceDetectionOverlay | Circular targeting ring | `detected`, `position`, `size` |
| BiometricIndicator | Heart rate display | `value`, `unit`, `color`, `icon` |
| BloodPressureIndicator | BP/sys reading | `systolic`, `diastolic`, `color` |
| InstructionBanner | Yellow guidance text | `message`, `icon` |
| CaptureButton | Large center photo button | `onPress`, `isCapturing` |
| GalleryButton | Access photo library | `onPress` |
| FlipCameraButton | Switch front/back | `onPress`, `currentFacing` |
| ModeToggle | Switch camera/analytics mode | `mode`, `onChange` |

### 4. Responsibility Split

**UI (Presentational)**:
- Render camera preview full-screen
- Display face detection overlay
- Show biometric readings in corners
- Handle capture button animation

**Logic (Container/Hooks)**:
- Initialize camera with face detection
- Process biometric data from sensors
- Handle image capture and storage
- Manage camera permissions

### 5. State Definition

```typescript
interface FacialExpressionCameraState {
  // Camera
  cameraReady: boolean;
  cameraFacing: 'front' | 'back';
  isCapturing: boolean;

  // Face Detection
  faceDetected: boolean;
  facePosition: { x: number; y: number };
  faceSize: { width: number; height: number };

  // Biometrics
  heartRate: number | null;
  bloodPressureSys: number | null;
  bloodPressureDia: number | null;

  // Permissions
  cameraPermission: 'granted' | 'denied' | 'undetermined';

  // Mode
  currentMode: 'camera' | 'analytics';
}
```

### 6. Data Models

```typescript
interface CapturedExpression {
  id: string;
  imageUri: string;
  capturedAt: string;
  faceData: {
    boundingBox: BoundingBox;
    landmarks: FaceLandmark[];
  };
  biometrics: {
    heartRate: number;
    bloodPressureSys: number;
    bloodPressureDia: number;
  };
  pendingAnalysis: boolean;
}

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface FaceLandmark {
  type: 'leftEye' | 'rightEye' | 'nose' | 'mouth' | 'leftCheek' | 'rightCheek';
  position: { x: number; y: number };
}
```

### 7. Navigation

| Action | Destination | Data Passed |
|--------|-------------|-------------|
| Capture button | ChatbotExpressionAnalysis | `capturedImage` |
| Gallery button | System image picker | - |
| Analytics mode | BiometricsDashboard | - |
| Back (implicit) | Previous chat screen | - |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| No face detected | Overlay shows dotted ring, instruction: "Position face in frame" |
| Face detected | Solid ring, instruction: "Stay still for better AI Analysis" |
| Multiple faces | Use largest/closest face |
| Poor lighting | Warning: "Better lighting recommended" |
| Camera permission denied | Show permission request screen |
| Biometrics unavailable | Hide indicators, rely on expression only |
| Image captured | Flash animation, navigate to analysis |

### 9. Implementation Breakdown

1. **Camera Integration**
   - Use expo-camera or react-native-vision-camera
   - Configure face detection with ML Kit
   - Front-facing camera default for selfie

2. **Face Detection Overlay**
   - Real-time face bounding box tracking
   - Smooth animation following face movement
   - Visual feedback when face properly positioned

3. **Biometric Integration**
   - Apple Health / Google Fit for heart rate
   - Note: Real-time BP typically requires medical device
   - May need to clarify if simulated or actual sensor data

4. **Capture Flow**
   - User positions face → Detection confirms
   - Tap capture → Save image with metadata
   - Navigate to analysis screen

### 10. Open Issues

| Issue | Priority | Notes |
|-------|----------|-------|
| Biometric data source | **CRITICAL** | How is heart rate (68 bpm) and BP (134 sys) obtained? Requires smartwatch/medical device |
| Face detection library | HIGH | expo-face-detector, ML Kit, or Vision Camera |
| Privacy concerns | HIGH | Facial data storage and processing policy |
| Lighting detection | MEDIUM | Auto-detect poor lighting conditions |
| Multiple face handling | LOW | What if multiple people in frame? |

---

## Screen 59: ChatbotExpressionAnalysis

### 1. Purpose
Displays AI analysis results of a user-uploaded facial expression image, providing emotional state detection and personalized recommendations based on the analysis.

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
│  │ Hi Doc can you analyze my      │ ← │
│  │ expression with AI/ML and give │    │
│  │ some AI suggestion? 🙂         │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ ┌─────────────────────────┐    │ ← │
│  │ │ [USER PHOTO]            │    │    │
│  │ │                         │    │    │
│  │ │ h4te_this_world.jpg     │    │    │
│  │ │            [🔍 Analy]   │    │    │
│  │ └─────────────────────────┘    │    │
│  └─────────────────────────────────┘    │
│                                         │
│    ┌─────────────────────────────────┐  │
│ →  │ Hey Shinomiya. Based on my LLM │  │
│    │ & Analysis, it seems you have  │  │
│    │ a Chronic Depression Disorder  │  │
│    │ 😢😢                            │  │
│    │                                │  │
│    │ May I recommend Guided         │  │
│    │ Meditation 101 by              │  │
│    │ Dr. Hannibal Lector?           │  │
│    └─────────────────────────────────┘  │
│                                         │
│ ┌───────────────────────────────────┐   │
│ │ ✓ Emotion: Depressed.            │   │
│ │   Journal Updated                │   │
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
| UserMessageBubble | User's analysis request | `text`, `attachments` |
| AttachedImageCard | Uploaded photo preview | `imageUri`, `filename`, `onAnalyze` |
| AnalyzeButton | Trigger AI analysis | `onPress`, `isAnalyzing` |
| AIMessageBubble | Analysis response | `text`, `emotionDetected` |
| EmotionUpdateBanner | Journal update notification | `emotion`, `action` |
| RecommendationLink | Course/resource suggestion | `title`, `author`, `onPress` |

### 4. Responsibility Split

**UI (Presentational)**:
- Display uploaded image preview
- Render analysis results text
- Show emotion detection banner
- Display recommendation links

**Logic (Container/Hooks)**:
- Upload image to analysis service
- Process ML/LLM response
- Update journal with detected emotion
- Handle recommendation navigation

### 5. State Definition

```typescript
interface ExpressionAnalysisState {
  // Upload
  uploadedImage: UploadedImage | null;
  isUploading: boolean;

  // Analysis
  isAnalyzing: boolean;
  analysisResult: ExpressionAnalysisResult | null;

  // Journal
  journalUpdated: boolean;
  detectedEmotion: Emotion | null;

  // Recommendations
  recommendations: Recommendation[];
}

interface UploadedImage {
  uri: string;
  filename: string;
  size: number;
  mimeType: string;
}

type Emotion = 'depressed' | 'anxious' | 'happy' | 'neutral' | 'stressed' | 'angry' | 'sad';
```

### 6. Data Models

```typescript
interface ExpressionAnalysisResult {
  primaryEmotion: Emotion;
  confidence: number;           // 0-1
  secondaryEmotions: {
    emotion: Emotion;
    confidence: number;
  }[];
  facialFeatures: {
    eyeOpenness: number;
    mouthCurvature: number;     // -1 (frown) to 1 (smile)
    browPosition: number;
    overallTension: number;
  };
  recommendation: string;
  suggestedActions: string[];
}

interface Recommendation {
  type: 'meditation' | 'exercise' | 'therapy' | 'resource';
  title: string;
  author?: string;
  courseId?: string;
  url?: string;
}
```

### 7. Navigation

| Action | Destination | Data Passed |
|--------|-------------|-------------|
| Back arrow | ConversationsDashboard | - |
| "Analyze" button | Stay (trigger analysis) | `imageUri` |
| Recommendation tap | CourseDetail / ResourceDetail | `recommendation` |
| Journal link | MentalHealthJournal | `latestEntry` |

### 8. UI States & Edge Cases

| State | Behavior |
|-------|----------|
| Uploading image | Show progress indicator on image card |
| Analysis in progress | Show "Analyzing..." with spinner |
| No face detected | Error: "Could not detect a face in the image" |
| Poor image quality | Warning: "Image quality may affect accuracy" |
| Multiple emotions detected | Show primary with confidence, mention secondary |
| Analysis failed | Error message with retry option |

### 9. Implementation Breakdown

1. **Image Upload Component**
   - Display thumbnail preview
   - Show filename (truncated if long)
   - "Analyze" button triggers ML processing
   - Loading state during upload/analysis

2. **Expression Analysis Service**
   - Send image to ML endpoint
   - Parse emotion detection results
   - Generate recommendation based on emotion
   - Update user's journal automatically

3. **Journal Integration**
   - Auto-create journal entry with detected emotion
   - Show confirmation banner
   - Link to full journal view

### 10. Open Issues

| Issue | Priority | Notes |
|-------|----------|-------|
| **"Dr. Hannibal Lector" reference** | **CRITICAL** | Fictional serial killer - MUST REPLACE |
| **"Chronic Depression Disorder" diagnosis** | **CRITICAL** | AI should NOT diagnose medical conditions - legal/ethical issue |
| **Filename "h4te_this_world.jpg"** | **HIGH** | Inappropriate placeholder - concerning content |
| ML model selection | HIGH | What facial analysis model? (AWS Rekognition, Google Vision, custom) |
| Confidence thresholds | MEDIUM | When to show low-confidence warning |
| Privacy/data retention | HIGH | How long is facial data stored? |
| Automatic journal update | MEDIUM | Should user confirm before auto-updating? |

---

## New Components Identified (Batch 12)

| Component | First Seen | Reusable |
|-----------|------------|----------|
| BookRecommendationCard | Screen 55 | Yes - for any book/resource lists |
| BookProgressBar | Screen 55 | Yes - for page/reading progress |
| BookIcon | Screen 55 | Yes - colored book illustrations |
| SleepQualityChart | Screen 56 | Yes - reuse in Sleep Quality feature |
| ActionButtonRow | Screen 56 | Yes - grid of action buttons |
| DownloadButton | Screen 56 | Yes - export charts/data |
| FreudScoreChart | Screen 57 | Yes - already in Home, now in chat |
| ScoreIndicator | Screen 57 | Yes - endpoint callout on charts |
| CelebrationAnimation | Screen 57 | Yes - milestones, achievements |
| CameraPreview | Screen 58 | Yes - any camera feature |
| FaceDetectionOverlay | Screen 58 | Yes - facial analysis features |
| BiometricIndicator | Screen 58 | Yes - health data display |
| BloodPressureIndicator | Screen 58 | Yes - medical readings |
| InstructionBanner | Screen 58 | Yes - any guided capture |
| CaptureButton | Screen 58 | Yes - camera/recording features |
| ModeToggle | Screen 58 | Yes - multi-mode screens |
| AttachedImageCard | Screen 59 | Yes - chat image attachments |
| AnalyzeButton | Screen 59 | Yes - trigger AI processing |
| EmotionUpdateBanner | Screen 59 | Yes - journal/mood updates |
| RecommendationLink | Screen 59 | Yes - course/resource links |

---

## Critical Issues Identified

### Issue #9: AI Diagnosing Medical Conditions (Screen 59)

**Problem**: AI response states "it seems you have a Chronic Depression Disorder"

**Risk**:
- **CRITICAL** - AI should never diagnose medical/psychiatric conditions
- Legal liability for practicing medicine without a license
- Could cause user distress or inappropriate self-treatment
- Violates medical ethics and potentially laws (varies by jurisdiction)

**Required Action**:
- [ ] Replace diagnostic language with observational language
- [ ] Example: "You seem to be experiencing feelings of sadness" instead of "you have Chronic Depression Disorder"
- [ ] Add disclaimer that AI is not a medical professional
- [ ] Recommend consulting licensed professionals for diagnosis

### Issue #10: Inappropriate Image Filename (Screen 59)

**Problem**: Placeholder filename "h4te_this_world.jpg" contains concerning content

**Risk**:
- Normalizes negative self-talk
- Inappropriate for mental health application
- May be triggering for vulnerable users

**Required Action**:
- [ ] Replace with neutral filename like "selfie_01.jpg" or "expression_capture.jpg"

### Issue #11: "Dr. Hannibal Lector" Reference (Screen 59)

**Already tracked in Issue #8** - Fictional serial killer name used for meditation course recommendation.

---

## Summary

| Screen | Name | Key Features |
|--------|------|--------------|
| 55 | ChatbotBookRecommendations | Book cards with author, page count, color themes |
| 56 | ChatbotSleepAnalysis | Embedded sleep chart, action buttons, course enrollment |
| 57 | ChatbotFreudScoreProgress | Score line graph, celebration, +285% improvement |
| 58 | FacialExpressionCamera | Camera with face detection, biometric overlay |
| 59 | ChatbotExpressionAnalysis | Image upload, emotion detection, journal update |

**Total AI Chatbot Screens Documented**: 13/20
**Total App Screens Documented**: 59/153
