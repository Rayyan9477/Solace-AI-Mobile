# DETAILED IMPLEMENTATION PLAN
## Solace AI Mobile - Complete Quality Enhancement Roadmap

**Generated:** November 19, 2025
**Based on:** COMPREHENSIVE_VISUAL_QUALITY_ANALYSIS.md + Codebase Review
**Total Tasks:** 100+ actionable items
**Estimated Timeline:** 22-26 weeks (5-6 months)

---

## TABLE OF CONTENTS

1. [Critical Issues - Immediate Action Required](#1-critical-issues)
2. [High Priority - Core Functionality](#2-high-priority)
3. [Medium Priority - Quality & Polish](#3-medium-priority)
4. [Nice-to-Have - Advanced Features](#4-nice-to-have)
5. [Testing Strategy](#5-testing-strategy)
6. [Security Hardening](#6-security-hardening)
7. [Performance Optimization](#7-performance-optimization)
8. [Platform Testing](#8-platform-testing)
9. [Implementation Order](#9-implementation-order)
10. [Success Metrics](#10-success-metrics)

---

## 1. CRITICAL ISSUES - IMMEDIATE ACTION REQUIRED

### 🔴 Priority 1: Fix Runtime Crashes (2 screens)

**Affected Files:**
- `src/features/dashboard/FreudScoreScreen.tsx`
- `src/features/mood/screens/MoodCalendarScreen.tsx`

**Issue:** Missing `Alert` import causing runtime crashes

**Implementation Steps:**
1. Open [FreudScoreScreen.tsx](src/features/dashboard/FreudScoreScreen.tsx)
2. Add at top: `import { Alert } from 'react-native';`
3. Test screen navigation to verify fix
4. Open [MoodCalendarScreen.tsx](src/features/mood/screens/MoodCalendarScreen.tsx)
5. Add at top: `import { Alert } from 'react-native';`
6. Test screen navigation to verify fix

**Effort:** 5 minutes
**Testing:** Navigate to both screens, verify no crashes

---

### 🔴 Priority 2: Fix Fake Assessment Scoring

**Affected File:**
- `src/features/assessment/screens/AssessmentResultsScreen.tsx:38`

**Current Code:**
```typescript
const score = Math.floor(Math.random() * 31) + 70; // FAKE!
```

**Issue:** Entire assessment is fake - user answers are ignored

**Implementation Steps:**

1. **Create Scoring Algorithm Service**
   - File: `src/features/assessment/services/scoringAlgorithm.ts`
   - Implement validated mental health scoring models:
     - PHQ-9 (Depression) - 9 questions, 0-27 scale
     - GAD-7 (Anxiety) - 7 questions, 0-21 scale
     - PSS-10 (Stress) - 10 questions, 0-40 scale
     - ISI (Insomnia) - 7 questions, 0-28 scale

2. **Scoring Algorithm Structure**
```typescript
interface AssessmentAnswer {
  questionId: string;
  answer: string | number | string[];
  category: 'anxiety' | 'depression' | 'stress' | 'sleep';
}

interface ScoringResult {
  overallScore: number; // 0-100
  categoryScores: {
    anxiety: number;
    depression: number;
    stress: number;
    sleep: number;
  };
  severity: 'excellent' | 'good' | 'fair' | 'needs-attention';
  recommendations: string[];
  insights: string[];
}

export const calculateAssessmentScore = (
  answers: AssessmentAnswer[]
): ScoringResult => {
  // Map answers to validated scales
  // Weight by category
  // Calculate composite score
  // Generate personalized recommendations
};
```

3. **Replace Random Scoring**
   - Import scoring service in `AssessmentResultsScreen.tsx`
   - Pass actual user answers from Redux store
   - Calculate real score before rendering
   - Display personalized insights

4. **Add Explanations**
   - Create explanation cards showing:
     - Why user received this score
     - Which answers contributed most
     - Specific areas of concern
     - Actionable next steps

**Effort:** 40-60 hours
**Requires:** Mental health domain expertise, validated scoring models
**Testing:** Test with various answer combinations, verify score accuracy

**References:**
- PHQ-9: https://www.apa.org/depression-guideline/patient-health-questionnaire.pdf
- GAD-7: https://www.phqscreeners.com/select-screener

---

### 🔴 Priority 3: Implement Sound Analysis Recording

**Affected File:**
- `src/features/assessment/screens/AssessmentScreen.tsx` (Question 13, line ~450)

**Current State:** UI button exists but no recording functionality

**Implementation Steps:**

1. **Request Microphone Permissions**
```typescript
import { Audio } from 'expo-av';

const requestMicrophonePermission = async () => {
  const { status } = await Audio.requestPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission Required', 'Microphone access is needed for sound analysis.');
    return false;
  }
  return true;
};
```

2. **Implement Recording**
```typescript
const [recording, setRecording] = useState<Audio.Recording | null>(null);
const [isRecording, setIsRecording] = useState(false);

const startRecording = async () => {
  try {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) return;

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    setRecording(recording);
    setIsRecording(true);
  } catch (err) {
    logger.error('Failed to start recording', err);
  }
};

const stopRecording = async () => {
  if (!recording) return;

  setIsRecording(false);
  await recording.stopAndUnloadAsync();
  const uri = recording.getURI();

  // Send to server for analysis or store locally
  handleAudioAnalysis(uri);
  setRecording(null);
};
```

3. **Add Visual Feedback**
   - Show recording indicator (red dot, waveform)
   - Display recording duration timer
   - Add stop/cancel buttons
   - Show "Analyzing..." state after recording

4. **Store Result**
   - Save audio file URI to assessment answers
   - Include metadata (duration, size, timestamp)
   - Update Redux store

**Effort:** 8-12 hours
**Dependencies:** `expo-av`
**Testing:** Test on iOS and Android, verify permissions, test recording quality

---

### 🔴 Priority 4: Implement Expression Analysis Camera

**Affected File:**
- `src/features/assessment/screens/AssessmentScreen.tsx` (Question 14, line ~475)

**Current State:** Empty screen with Continue button

**Implementation Steps:**

1. **Request Camera Permissions**
```typescript
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';

const requestCameraPermission = async () => {
  const { status } = await Camera.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission Required', 'Camera access is needed for expression analysis.');
    return false;
  }
  return true;
};
```

2. **Implement Camera View**
```typescript
const [hasPermission, setHasPermission] = useState<boolean | null>(null);
const [faceData, setFaceData] = useState<any>(null);

const handleFacesDetected = ({ faces }: { faces: any[] }) => {
  if (faces.length > 0) {
    setFaceData(faces[0]);
    // Analyze expression: smiling, frowning, neutral
  }
};

return (
  <Camera
    style={styles.camera}
    type={Camera.Constants.Type.front}
    onFacesDetected={handleFacesDetected}
    faceDetectorSettings={{
      mode: FaceDetector.FaceDetectorMode.fast,
      detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
      runClassifications: FaceDetector.FaceDetectorClassifications.all,
    }}
  >
    <FaceOverlay faceData={faceData} />
  </Camera>
);
```

3. **Add Visual Feedback**
   - Show face detection overlay
   - Display "Looking for face..." message
   - Show checkmark when face detected
   - Display expression analysis result

4. **Privacy Considerations**
   - Clear disclaimer about data usage
   - Option to skip this question
   - Don't upload photos without explicit consent
   - Only store analysis results, not images

**Effort:** 12-16 hours
**Dependencies:** `expo-camera`, `expo-face-detector`
**Testing:** Test face detection accuracy, test on various lighting conditions

**Note:** This is a sensitive feature. Consider making it optional or removing if too invasive.

---

### 🔴 Priority 5: Implement Voice Recording in Journal

**Affected Files:**
- `src/features/journal/screens/JournalCreateScreen.tsx` (line ~75)
- `src/features/journal/screens/JournalDetailScreen.tsx` (line ~80)

**Current State:** Voice button UI exists but no actual recording

**Implementation Steps:**

1. **Create Voice Recording Service**
   - File: `src/features/journal/services/voiceRecordingService.ts`

```typescript
import { Audio } from 'expo-av';

export class VoiceRecordingService {
  private recording: Audio.Recording | null = null;

  async startRecording(): Promise<void> {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Microphone permission denied');
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    this.recording = new Audio.Recording();
    await this.recording.prepareToRecordAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    await this.recording.startAsync();
  }

  async stopRecording(): Promise<string> {
    if (!this.recording) throw new Error('No active recording');

    await this.recording.stopAndUnloadAsync();
    const uri = this.recording.getURI();
    this.recording = null;

    return uri;
  }

  async pauseRecording(): Promise<void> {
    await this.recording?.pauseAsync();
  }

  async resumeRecording(): Promise<void> {
    await this.recording?.startAsync();
  }

  getStatus(): Promise<Audio.RecordingStatus> {
    return this.recording?.getStatusAsync();
  }
}
```

2. **Integrate in JournalCreateScreen**
```typescript
const [isRecording, setIsRecording] = useState(false);
const [recordingUri, setRecordingUri] = useState<string | null>(null);
const [duration, setDuration] = useState(0);
const voiceService = useRef(new VoiceRecordingService()).current;

const toggleRecording = async () => {
  if (isRecording) {
    const uri = await voiceService.stopRecording();
    setRecordingUri(uri);
    setIsRecording(false);
  } else {
    await voiceService.startRecording();
    setIsRecording(true);
    // Start timer
  }
};
```

3. **Add Recording UI**
   - Waveform visualization during recording
   - Duration timer (00:00)
   - Pause/Resume buttons
   - Delete recording button
   - Play preview button

4. **Save with Journal Entry**
   - Upload audio to server or store locally
   - Include audio URI in journal entry data
   - Add transcription option (future)

**Effort:** 10-14 hours
**Dependencies:** `expo-av`

---

### 🔴 Priority 6: Implement Audio Playback in Journal Detail

**Affected File:**
- `src/features/journal/screens/JournalDetailScreen.tsx`

**Implementation Steps:**

1. **Create Audio Player Component**
   - File: `src/features/journal/components/AudioPlayer.tsx`

```typescript
import { Audio } from 'expo-av';

interface AudioPlayerProps {
  uri: string;
  onError?: (error: string) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ uri, onError }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const playSound = async () => {
    try {
      if (!sound) {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true },
          onPlaybackStatusUpdate
        );
        setSound(newSound);
      } else {
        await sound.playAsync();
      }
      setIsPlaying(true);
    } catch (error) {
      onError?.('Failed to play audio');
    }
  };

  const pauseSound = async () => {
    await sound?.pauseAsync();
    setIsPlaying(false);
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
      setIsPlaying(status.isPlaying);
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={isPlaying ? pauseSound : playSound}>
        <Icon name={isPlaying ? 'pause' : 'play'} />
      </TouchableOpacity>
      <Slider
        value={position}
        maximumValue={duration}
        onSlidingComplete={async (value) => {
          await sound?.setPositionAsync(value);
        }}
      />
      <Text>{formatTime(position)} / {formatTime(duration)}</Text>
    </View>
  );
};
```

2. **Integrate in JournalDetailScreen**
```typescript
{entry.audioUri && (
  <AudioPlayer
    uri={entry.audioUri}
    onError={(error) => Alert.alert('Playback Error', error)}
  />
)}
```

3. **Add Playback Controls**
   - Play/Pause button
   - Seekbar with progress
   - Playback speed control (0.5x, 1x, 1.5x, 2x)
   - Volume control
   - Download option

**Effort:** 8-10 hours

---

## 2. HIGH PRIORITY - CORE FUNCTIONALITY

### ⚠️ Typography System - Replace 847 Hardcoded Font Sizes

**Issue:** Inconsistent typography across app, hardcoded sizes

**Implementation Steps:**

1. **Audit Current Typography Usage**
   - Run grep: `grep -r "fontSize:" src/ --include="*.tsx" > typography-audit.txt`
   - Categorize by screen/component

2. **Enhance Theme Typography**
   - File: `src/shared/theme/typography.ts`
   - Already has good foundation, ensure all variants defined:

```typescript
export const typography = {
  display: { fontSize: 57, lineHeight: 64, fontWeight: '400' },
  h1: { fontSize: 32, lineHeight: 40, fontWeight: '700' },
  h2: { fontSize: 28, lineHeight: 36, fontWeight: '600' },
  h3: { fontSize: 24, lineHeight: 32, fontWeight: '600' },
  h4: { fontSize: 20, lineHeight: 28, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  bodyLarge: { fontSize: 18, lineHeight: 28, fontWeight: '400' },
  bodySmall: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
  button: { fontSize: 16, lineHeight: 24, fontWeight: '600' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
  overline: { fontSize: 10, lineHeight: 16, fontWeight: '500', textTransform: 'uppercase' },
  label: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
};
```

3. **Use Typography Components**
   - Replace all hardcoded text with `<Typography variant="...">`
   - File: `src/shared/components/Typography.tsx` (already exists)

**Before:**
```typescript
<Text style={{ fontSize: 24, fontWeight: '600' }}>Hello</Text>
```

**After:**
```typescript
<Typography variant="h3">Hello</Typography>
```

4. **Create Migration Script**
   - File: `scripts/migrateTypography.js`
   - Automated find/replace with pattern matching

**Effort:** 40-50 hours (manual review required)
**Files Affected:** ~100 files

---

### ⚠️ Color System - Replace 234 Hardcoded Colors

**Issue:** Hardcoded #FFFFFF, #000000, inconsistent colors

**Implementation Steps:**

1. **Audit Color Usage**
   - Run: `grep -r "#[0-9A-Fa-f]" src/ --include="*.tsx" > color-audit.txt`
   - Categorize: background, text, border, shadow, etc.

2. **Map to Theme Colors**
   - File: `src/shared/theme/colors.ts` (excellent system already exists)
   - Map hardcoded colors to semantic names:

```typescript
// Color mapping reference
'#FFFFFF' → colors.background.primary
'#000000' → colors.text.primary
'#F5F5F5' → colors.background.secondary
'#4A90E2' → colors.primary[500]
'#E74C3C' → colors.error[500]
// etc...
```

3. **Use Theme Hook**
```typescript
const { colors } = useTheme();

// Before:
<View style={{ backgroundColor: '#FFFFFF' }}>

// After:
<View style={{ backgroundColor: colors.background.primary }}>
```

4. **Dark Mode Support**
   - Ensure all colors have dark mode equivalents
   - File: `src/shared/theme/darkTheme.ts`
   - Test all screens in dark mode

**Effort:** 30-40 hours
**Files Affected:** ~80 files

---

### ⚠️ Icon System - Replace 156 Emoji Icons with SVG

**Issue:** Using emoji (🏠, 💬, etc.) instead of professional icons

**Implementation Steps:**

1. **Choose Icon Library**
   - Already using: `@expo/vector-icons` (Material Community Icons)
   - Alternative: Custom SVG icons with `react-native-svg`

2. **Create Icon Component**
   - File: `src/shared/components/Icon.tsx`

```typescript
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  accessibilityLabel: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color,
  accessibilityLabel,
}) => {
  const { colors } = useTheme();

  return (
    <MaterialCommunityIcons
      name={name}
      size={size}
      color={color || colors.text.primary}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
    />
  );
};
```

3. **Emoji to Icon Mapping**
```typescript
// Migration map
const emojiToIcon = {
  '🏠': 'home',
  '💬': 'chat',
  '😊': 'emoticon-happy',
  '📊': 'chart-bar',
  '⚙️': 'cog',
  '🔔': 'bell',
  '📝': 'note-text',
  '🧘': 'meditation',
  '❤️': 'heart',
  '⭐': 'star',
  // ... complete mapping
};
```

4. **Replace All Emojis**
   - Search for emoji in JSX: `grep -r "[^\x00-\x7F]" src/`
   - Replace with Icon component

**Before:**
```typescript
<Text>🏠</Text>
```

**After:**
```typescript
<Icon name="home" size={24} accessibilityLabel="Home icon" />
```

**Effort:** 20-30 hours
**Benefit:** Professional appearance, better accessibility, easier theming

---

### ⚠️ Backend API Integration

**Current State:** 90% mock data, no real API calls

**Implementation Steps:**

1. **Set Up API Client**
   - File: `src/shared/services/api.ts` (exists, needs completion)

```typescript
import axios from 'axios';
import { getToken } from './authService';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.solace-ai.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, refresh or logout
    }
    return Promise.reject(error);
  }
);
```

2. **Create API Endpoints**
   - File: `src/shared/services/endpoints.ts`

```typescript
export const endpoints = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    resetPassword: '/auth/reset-password',
  },
  profile: {
    get: '/profile',
    update: '/profile',
    uploadAvatar: '/profile/avatar',
  },
  assessment: {
    submit: '/assessment/submit',
    results: '/assessment/results/:id',
    history: '/assessment/history',
  },
  mood: {
    log: '/mood/log',
    history: '/mood/history',
    analytics: '/mood/analytics',
    calendar: '/mood/calendar',
  },
  journal: {
    list: '/journal',
    create: '/journal',
    get: '/journal/:id',
    update: '/journal/:id',
    delete: '/journal/:id',
    uploadAudio: '/journal/audio',
  },
  chat: {
    conversations: '/chat/conversations',
    messages: '/chat/conversations/:id/messages',
    send: '/chat/conversations/:id/messages',
  },
  // ... complete all endpoints
};
```

3. **Create API Service Functions**
   - File: `src/features/mood/services/moodApi.ts`

```typescript
import { apiClient } from '@/shared/services/api';
import { endpoints } from '@/shared/services/endpoints';

export interface MoodEntry {
  mood: string;
  intensity: number;
  note?: string;
  timestamp: string;
}

export const moodApi = {
  logMood: async (entry: MoodEntry) => {
    const response = await apiClient.post(endpoints.mood.log, entry);
    return response.data;
  },

  getMoodHistory: async (startDate?: string, endDate?: string) => {
    const response = await apiClient.get(endpoints.mood.history, {
      params: { startDate, endDate },
    });
    return response.data;
  },

  getMoodAnalytics: async (period: 'week' | 'month' | 'year') => {
    const response = await apiClient.get(endpoints.mood.analytics, {
      params: { period },
    });
    return response.data;
  },
};
```

4. **Replace Mock Data in Redux**
   - Update Redux thunks to call real APIs

**Before:**
```typescript
const mockMoodData = [
  { date: '2025-01-01', mood: 'happy', intensity: 4 },
  // ...
];
```

**After:**
```typescript
export const fetchMoodHistory = createAsyncThunk(
  'mood/fetchHistory',
  async ({ startDate, endDate }: DateRange) => {
    const data = await moodApi.getMoodHistory(startDate, endDate);
    return data;
  }
);
```

5. **Add Loading States**
```typescript
const { data, isLoading, error } = useSelector((state) => state.mood);

if (isLoading) return <LoadingScreen />;
if (error) return <ErrorScreen message={error} />;
```

**Effort:** 100-150 hours
**Priority:** HIGH - app is not functional without this

---

### ⚠️ Data Persistence Layer

**Current State:** Settings don't persist, data lost on restart

**Implementation Steps:**

1. **Set Up Redux Persist**
   - File: `src/app/store/index.ts`

```typescript
import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'user', 'theme'], // Only persist these
  blacklist: ['loading'], // Don't persist these
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
```

2. **Wrap App with PersistGate**
   - File: `App.tsx`

```typescript
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/app/store';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <NavigationContainer>
          {/* App content */}
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
```

3. **Implement Local Database for Large Data**
   - Install: `expo install expo-sqlite`
   - File: `src/shared/services/database.ts`

```typescript
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('solace.db');

export const initDatabase = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS mood_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mood TEXT NOT NULL,
      intensity INTEGER NOT NULL,
      note TEXT,
      timestamp TEXT NOT NULL,
      synced INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS journal_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT NOT NULL,
      audioUri TEXT,
      timestamp TEXT NOT NULL,
      synced INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS offline_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      endpoint TEXT NOT NULL,
      method TEXT NOT NULL,
      body TEXT,
      timestamp TEXT NOT NULL
    );
  `);
};

export const moodDb = {
  insert: async (entry: MoodEntry) => {
    const result = await db.runAsync(
      'INSERT INTO mood_entries (mood, intensity, note, timestamp) VALUES (?, ?, ?, ?)',
      [entry.mood, entry.intensity, entry.note, entry.timestamp]
    );
    return result.lastInsertRowId;
  },

  getAll: async () => {
    const result = await db.getAllAsync('SELECT * FROM mood_entries ORDER BY timestamp DESC');
    return result;
  },

  // ... other CRUD operations
};
```

4. **Implement Offline Queue**
```typescript
export const offlineQueue = {
  add: async (endpoint: string, method: string, body: any) => {
    await db.runAsync(
      'INSERT INTO offline_queue (endpoint, method, body, timestamp) VALUES (?, ?, ?, ?)',
      [endpoint, method, JSON.stringify(body), new Date().toISOString()]
    );
  },

  sync: async () => {
    const pending = await db.getAllAsync('SELECT * FROM offline_queue');
    for (const item of pending) {
      try {
        await apiClient.request({
          url: item.endpoint,
          method: item.method,
          data: JSON.parse(item.body),
        });
        await db.runAsync('DELETE FROM offline_queue WHERE id = ?', [item.id]);
      } catch (error) {
        logger.error('Sync failed for item', item.id, error);
      }
    }
  },
};
```

**Effort:** 30-40 hours

---

### ⚠️ Professional Welcome Screen Illustrations

**Affected File:**
- `src/features/onboarding/screens/WelcomeScreen.tsx`

**Current State:** Using placeholder shapes (circles, rectangles)

**Implementation Steps:**

1. **Hire Designer or Use Illustration Library**
   - Services: Figma Community, undraw.co, storyset.com
   - Style: Modern, gradient-based, therapeutic feel
   - Format: SVG for scalability

2. **Create 6 Custom Illustrations**
   - **Step 1 (Personalize):** Person with profile settings
   - **Step 2 (Mood Tracking):** Calendar with mood faces
   - **Step 3 (Journaling):** Person writing in journal
   - **Step 4 (Resources):** Library of books/resources
   - **Step 5 (Community):** Group of people connecting
   - **Step 6 (Get Started):** Launching/rocket metaphor

3. **Implement SVG Illustrations**
   - Install: `expo install react-native-svg`
   - Create components: `src/features/onboarding/illustrations/`

```typescript
// Step1Illustration.tsx
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export const Step1Illustration = ({ size = 200 }) => (
  <Svg width={size} height={size} viewBox="0 0 200 200">
    {/* SVG paths from designer */}
  </Svg>
);
```

4. **Replace Placeholder in WelcomeScreen**

**Before (line 155):**
```typescript
<View style={[styles.illustration, { backgroundColor: colors.primary[100] }]}>
  <Text style={{ fontSize: 80 }}>👤</Text>
</View>
```

**After:**
```typescript
<Step1Illustration size={200} />
```

5. **Add Animation**
```typescript
const animatedValue = useSharedValue(0);

useEffect(() => {
  animatedValue.value = withSpring(1, { damping: 10 });
}, [currentStep]);

const animatedStyle = useAnimatedStyle(() => ({
  opacity: animatedValue.value,
  transform: [{ scale: animatedValue.value }],
}));
```

**Effort:** 20-30 hours (including design work)
**Alternative:** Use Lottie animations (JSON-based)

---

### ⚠️ Implement OAuth Social Login

**Affected Files:**
- `src/features/auth/LoginScreen.tsx`
- `src/features/auth/SignupScreen.tsx`

**Current State:** Buttons show Alert, no actual OAuth

**Implementation Steps:**

1. **Use Existing Social Auth Service**
   - File: `src/shared/services/socialAuthService.ts` (already exists!)
   - Review implementation, complete any TODOs

2. **Set Up OAuth Providers**

**Google Sign-In:**
```typescript
// Already implemented in socialAuthService.ts
import { useSocialAuth } from '@/shared/hooks/useSocialAuth';

const { signInWithGoogle, isLoading, error } = useSocialAuth();

const handleGoogleLogin = async () => {
  try {
    const result = await signInWithGoogle();
    if (result.success) {
      navigation.navigate('Dashboard');
    }
  } catch (error) {
    Alert.alert('Login Failed', error.message);
  }
};
```

**Facebook Sign-In:**
```typescript
const { signInWithFacebook } = useSocialAuth();

const handleFacebookLogin = async () => {
  const result = await signInWithFacebook();
  // Handle result
};
```

**Apple Sign-In:**
```typescript
const { signInWithApple } = useSocialAuth();

const handleAppleLogin = async () => {
  const result = await signInWithApple();
  // Handle result
};
```

**Microsoft Sign-In:**
```typescript
const { signInWithMicrosoft } = useSocialAuth();

const handleMicrosoftLogin = async () => {
  const result = await signInWithMicrosoft();
  // Handle result
};
```

3. **Configure OAuth Credentials**
   - File: `.env`

```bash
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
EXPO_PUBLIC_GOOGLE_CLIENT_SECRET=your-google-client-secret

EXPO_PUBLIC_FACEBOOK_APP_ID=your-facebook-app-id
EXPO_PUBLIC_FACEBOOK_APP_SECRET=your-facebook-app-secret

EXPO_PUBLIC_MICROSOFT_CLIENT_ID=your-microsoft-client-id
EXPO_PUBLIC_MICROSOFT_TENANT_ID=your-microsoft-tenant-id

# Apple Sign-In requires additional setup in Xcode
```

4. **Update LoginScreen**

**Replace (lines 98-103):**
```typescript
const handleFacebookLogin = () => {
  Alert.alert('Facebook Login', 'Not implemented yet');
};
```

**With:**
```typescript
const handleFacebookLogin = async () => {
  setIsLoading(true);
  try {
    const result = await signInWithFacebook();
    if (result.success) {
      await storeToken(result.token);
      dispatch(setUser(result.user));
      navigation.navigate('Dashboard');
    }
  } catch (error) {
    Alert.alert('Login Failed', error.message);
  } finally {
    setIsLoading(false);
  }
};
```

5. **Add Loading States to Buttons**
```typescript
<TouchableOpacity
  style={styles.socialButton}
  onPress={handleGoogleLogin}
  disabled={isLoading}
>
  {isLoading ? (
    <ActivityIndicator color={colors.primary[500]} />
  ) : (
    <>
      <Icon name="google" />
      <Text>Continue with Google</Text>
    </>
  )}
</TouchableOpacity>
```

6. **Handle OAuth Errors**
```typescript
const handleOAuthError = (error: any) => {
  if (error.code === 'user-cancelled') {
    // User cancelled, don't show error
    return;
  }

  if (error.code === 'network-error') {
    Alert.alert('Network Error', 'Please check your internet connection');
    return;
  }

  Alert.alert('Login Failed', 'Something went wrong. Please try again.');
  logger.error('OAuth error', error);
};
```

**Effort:** 15-20 hours (including testing on iOS/Android)
**Dependencies:** Platform-specific setup required

**Documentation:**
- Follow: `OAUTH_SOCIAL_AUTHENTICATION_SETUP_GUIDE.md` (should exist in repo)

---

### ⚠️ Implement Actual Search Functionality

**Affected Files:**
- `src/features/search/SearchScreen.tsx`
- `src/features/search/SearchFiltersScreen.tsx`
- `src/features/search/VoiceSearchScreen.tsx`
- `src/features/search/SearchCategoriesScreen.tsx`
- `src/features/search/PopularSearchesScreen.tsx`
- `src/features/search/RecentSearchesScreen.tsx`

**Current State:** UI exists but no search logic

**Implementation Steps:**

1. **Create Search Service**
   - File: `src/features/search/services/searchService.ts`

```typescript
export interface SearchFilters {
  categories?: string[];
  dateRange?: { start: string; end: string };
  contentTypes?: ('journal' | 'mood' | 'resource' | 'conversation')[];
}

export interface SearchResult {
  id: string;
  type: 'journal' | 'mood' | 'resource' | 'conversation' | 'community';
  title: string;
  excerpt: string;
  date: string;
  relevance: number;
  metadata?: Record<string, any>;
}

export const searchService = {
  search: async (query: string, filters?: SearchFilters): Promise<SearchResult[]> => {
    // Call backend search API
    const response = await apiClient.post('/search', {
      query,
      filters,
    });
    return response.data;
  },

  getRecentSearches: async (): Promise<string[]> => {
    const searches = await AsyncStorage.getItem('recent-searches');
    return searches ? JSON.parse(searches) : [];
  },

  saveSearch: async (query: string) => {
    const recent = await searchService.getRecentSearches();
    const updated = [query, ...recent.filter(q => q !== query)].slice(0, 10);
    await AsyncStorage.setItem('recent-searches', JSON.stringify(updated));
  },

  getPopularSearches: async (): Promise<string[]> => {
    const response = await apiClient.get('/search/popular');
    return response.data;
  },
};
```

2. **Implement Search in SearchScreen**

```typescript
const [query, setQuery] = useState('');
const [results, setResults] = useState<SearchResult[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [filters, setFilters] = useState<SearchFilters>({});

const performSearch = async (searchQuery: string) => {
  if (!searchQuery.trim()) return;

  setIsLoading(true);
  try {
    const data = await searchService.search(searchQuery, filters);
    setResults(data);
    await searchService.saveSearch(searchQuery);
  } catch (error) {
    Alert.alert('Search Failed', 'Please try again');
  } finally {
    setIsLoading(false);
  }
};

// Debounced search
const debouncedSearch = useMemo(
  () => debounce(performSearch, 500),
  [filters]
);

useEffect(() => {
  if (query.length >= 3) {
    debouncedSearch(query);
  }
}, [query]);
```

3. **Add Search Suggestions (Autocomplete)**
```typescript
const [suggestions, setSuggestions] = useState<string[]>([]);

const fetchSuggestions = async (partial: string) => {
  const response = await apiClient.get('/search/suggestions', {
    params: { q: partial },
  });
  setSuggestions(response.data);
};

<FlatList
  data={suggestions}
  renderItem={({ item }) => (
    <TouchableOpacity onPress={() => setQuery(item)}>
      <Text>{item}</Text>
    </TouchableOpacity>
  )}
/>
```

4. **Implement Search Filters**
```typescript
// SearchFiltersScreen.tsx
const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
const [dateRange, setDateRange] = useState<DateRange | null>(null);

const applyFilters = () => {
  const filters: SearchFilters = {
    categories: selectedCategories,
    dateRange: dateRange,
  };

  navigation.navigate('Search', { filters });
};
```

5. **Implement Voice Search**
```typescript
import * as Speech from 'expo-speech';

const startVoiceSearch = async () => {
  const { status } = await Audio.requestPermissionsAsync();
  if (status !== 'granted') return;

  // Start speech recognition
  // Convert to text
  // Perform search with result
};
```

6. **Add Search History Persistence**
```typescript
// Store in AsyncStorage or SQLite
const saveToHistory = async (result: SearchResult) => {
  const history = await AsyncStorage.getItem('search-history');
  const parsed = history ? JSON.parse(history) : [];
  const updated = [result, ...parsed.filter(r => r.id !== result.id)].slice(0, 50);
  await AsyncStorage.setItem('search-history', JSON.stringify(updated));
};
```

**Effort:** 30-40 hours
**Backend Required:** Search indexing, fuzzy matching, ranking algorithm

---

## 3. MEDIUM PRIORITY - QUALITY & POLISH

### 💡 Implement i18n System

**Affected File:**
- `src/features/profile/screens/LanguageSettingsScreen.tsx`

**Current State:** Language selection cosmetic only, no translations

**Implementation Steps:**

1. **Install i18n Library**
```bash
npm install i18next react-i18next expo-localization
```

2. **Set Up i18n Configuration**
   - File: `src/shared/services/i18n.ts`

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import en from '../locales/en.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';
import de from '../locales/de.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.locale.split('-')[0], // Device language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

3. **Create Translation Files**
   - Directory: `src/shared/locales/`

```json
// en.json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "loading": "Loading..."
  },
  "auth": {
    "login": "Log In",
    "signup": "Sign Up",
    "email": "Email",
    "password": "Password",
    "forgotPassword": "Forgot Password?"
  },
  "mood": {
    "selectMood": "How are you feeling?",
    "veryBad": "Very Bad",
    "bad": "Bad",
    "neutral": "Neutral",
    "good": "Good",
    "veryGood": "Very Good"
  },
  // ... complete translations
}
```

4. **Use Translations in Components**

**Before:**
```typescript
<Text>How are you feeling?</Text>
```

**After:**
```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();

<Text>{t('mood.selectMood')}</Text>
```

5. **Implement Language Switching**
```typescript
// LanguageSettingsScreen.tsx
import i18n from '@/shared/services/i18n';

const changeLanguage = async (languageCode: string) => {
  await i18n.changeLanguage(languageCode);
  await AsyncStorage.setItem('user-language', languageCode);
  Alert.alert('Success', 'Language updated successfully');
};
```

6. **Handle RTL Languages**
```typescript
import { I18nManager } from 'react-native';

if (languageCode === 'ar' || languageCode === 'he') {
  I18nManager.forceRTL(true);
} else {
  I18nManager.forceRTL(false);
}
```

7. **Translation Coverage**
   - Translate all static text
   - Format dates/times per locale
   - Format numbers/currency per locale
   - Translate error messages
   - Translate accessibility labels

**Effort:** 60-80 hours
**Languages to Support:** English, Spanish, French, German, Arabic (minimum)

---

### 💡 Fix Visual Quality Issues

**Typography Consistency:**
- Already covered above (replace 847 hardcoded sizes)

**Spacing Consistency:**
- Audit all magic numbers
- Replace with theme spacing scale

```typescript
// Before:
<View style={{ padding: 15, marginBottom: 20 }}>

// After:
import { spacing } from '@/shared/theme/spacing';

<View style={{
  padding: spacing.md,
  marginBottom: spacing.lg,
}}>
```

**Icon Consistency:**
- Already covered above (replace 156 emojis)

**Dark Mode Coverage:**
- Test every screen in dark mode
- Fix any hard-coded colors that don't adapt
- Ensure sufficient contrast (WCAG 4.5:1)

---

### 💡 Complete Sub-Settings Screens

Many settings screens are placeholders. Complete implementations:

1. **PersonalInformationScreen** (55% complete)
   - Add profile photo upload
   - Add date of birth picker
   - Add phone number with validation
   - Add address fields

2. **AccountSettingsScreen** (40% complete)
   - Implement change email flow
   - Implement change password flow
   - Add two-factor authentication setup
   - Add session management (active devices)

3. **PrivacySettingsScreen** (50% complete)
   - Implement data download
   - Implement account deletion flow
   - Add privacy preference toggles
   - Add consent management

4. **SecuritySettingsScreen** (45% complete)
   - Add biometric authentication setup
   - Implement app lock/PIN
   - Add login history
   - Add suspicious activity alerts

5. **NotificationSettingsScreen** (60% complete)
   - Wire toggles to actual notification system
   - Add granular notification controls
   - Implement quiet hours
   - Add notification preview

**Effort per screen:** 8-12 hours
**Total:** 40-60 hours for all sub-settings

---

### 💡 Add Comprehensive Loading States

**Current Issue:** 60+ screens missing loading indicators

**Implementation:**

1. **Create Loading Component Library**
   - Already exists: `src/shared/components/LoadingScreen.tsx`
   - Variants needed:
     - Full screen loading
     - Inline loading (spinner)
     - Skeleton screens
     - Progress loading

2. **Skeleton Screen Component**
   - File: `src/shared/components/SkeletonScreen.tsx`

```typescript
import { Skeleton } from '@rneui/themed';

export const MoodListSkeleton = () => (
  <View>
    {[1, 2, 3, 4, 5].map(i => (
      <View key={i} style={styles.skeletonItem}>
        <Skeleton circle width={40} height={40} />
        <Skeleton width="70%" height={20} />
      </View>
    ))}
  </View>
);
```

3. **Add Loading States to Redux Slices**
```typescript
export const fetchMoodHistory = createAsyncThunk(
  'mood/fetchHistory',
  async () => {
    const data = await moodApi.getMoodHistory();
    return data;
  }
);

// Reducer handles loading automatically
extraReducers: (builder) => {
  builder
    .addCase(fetchMoodHistory.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchMoodHistory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.history = action.payload;
    })
    .addCase(fetchMoodHistory.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
},
```

4. **Use Loading States in Components**
```typescript
const { data, isLoading, error } = useSelector(selectMoodState);

if (isLoading) return <MoodListSkeleton />;
if (error) return <ErrorState message={error} onRetry={retry} />;
return <MoodList data={data} />;
```

**Effort:** 20-30 hours

---

### 💡 Code Quality Improvements

**Remove TODOs (87 instances):**
- Grep: `grep -r "TODO" src/`
- Categorize by priority
- Implement or remove each one
- Track in project management tool

**Replace console.logs (234 instances):**
- Use logger service: `src/shared/utils/logger.ts`
- Implement log levels: debug, info, warn, error
- Add remote logging (Sentry, LogRocket)

**Fix TypeScript any types (156 instances):**
- Grep: `grep -r ": any" src/`
- Create proper interfaces
- Use generics where appropriate
- Enable stricter TypeScript rules

**Refactor Large Files (15 files >500 lines):**
- Break into smaller components
- Extract hooks
- Move logic to services
- Follow single responsibility principle

**Reduce Code Duplication (30%):**
- Identify common patterns
- Create shared components
- Create custom hooks
- Create utility functions

**Effort:** 60-80 hours

---

## 4. NICE-TO-HAVE - ADVANCED FEATURES

### 🎯 Haptic Feedback

```typescript
import * as Haptics from 'expo-haptics';

const handleMoodSelection = (mood: string) => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  setSelectedMood(mood);
};

const handleCrisisAlert = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  // Show crisis resources
};
```

**Implementation:**
- Add to mood selection
- Add to button presses
- Add to success actions
- Add to error alerts
- Add to breathing exercises (rhythmic feedback)

**Effort:** 10-15 hours

---

### 🎯 Achievement System

**Implementation:**

1. **Define Achievements**
```typescript
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  condition: (userStats: UserStats) => boolean;
  unlockedAt?: string;
}

export const achievements: Achievement[] = [
  {
    id: 'first-mood',
    title: 'First Steps',
    description: 'Log your first mood',
    icon: 'emoticon-happy',
    points: 10,
    condition: (stats) => stats.moodCount >= 1,
  },
  {
    id: 'week-streak',
    title: '7-Day Streak',
    description: 'Log mood 7 days in a row',
    icon: 'fire',
    points: 50,
    condition: (stats) => stats.currentStreak >= 7,
  },
  // ... more achievements
];
```

2. **Track Progress**
```typescript
export const checkAchievements = async (userStats: UserStats) => {
  const unlocked: Achievement[] = [];

  for (const achievement of achievements) {
    if (!achievement.unlockedAt && achievement.condition(userStats)) {
      achievement.unlockedAt = new Date().toISOString();
      unlocked.push(achievement);
      await saveAchievement(achievement);
    }
  }

  return unlocked;
};
```

3. **Show Unlock Animation**
```typescript
const showAchievementUnlocked = (achievement: Achievement) => {
  // Toast notification
  // Confetti animation
  // Sound effect
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};
```

**Effort:** 20-30 hours

---

### 🎯 Push Notifications

**Implementation:**

1. **Set Up Expo Notifications**
```typescript
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const registerForPushNotifications = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return null;

  const token = await Notifications.getExpoPushTokenAsync();
  return token.data;
};
```

2. **Schedule Local Notifications**
```typescript
// Daily mood reminder
await Notifications.scheduleNotificationAsync({
  content: {
    title: 'Time for a check-in',
    body: 'How are you feeling today?',
  },
  trigger: {
    hour: 9,
    minute: 0,
    repeats: true,
  },
});
```

3. **Handle Deep Links**
```typescript
Notifications.addNotificationResponseReceivedListener(response => {
  const { screen, params } = response.notification.request.content.data;
  navigation.navigate(screen, params);
});
```

**Effort:** 15-20 hours

---

### 🎯 Widget Support

**iOS Widget:**
- Use: `expo-dev-client` with native modules
- Create Swift widget extension
- Sync data via App Groups

**Android Widget:**
- Use: `expo-home-screen-widget` (community package)
- Create widget layouts
- Update with BroadcastReceiver

**Widgets to Create:**
- Daily mood widget
- Freud score widget
- Quick journal button
- Breathing exercise timer

**Effort:** 40-50 hours (platform-specific)

---

### 🎯 Voice Commands

**Implementation:**
```typescript
import * as Speech from 'expo-speech';
import Voice from '@react-native-voice/voice';

export const useVoiceCommands = () => {
  const [isListening, setIsListening] = useState(false);

  const startListening = async () => {
    await Voice.start('en-US');
    setIsListening(true);
  };

  Voice.onSpeechResults = (e) => {
    const command = e.value[0].toLowerCase();
    handleCommand(command);
  };

  const handleCommand = (command: string) => {
    if (command.includes('log mood')) {
      navigation.navigate('MoodSelection');
    } else if (command.includes('start journal')) {
      navigation.navigate('JournalCreate');
    } else if (command.includes('meditation')) {
      navigation.navigate('BreathingExercise');
    }
  };

  return { startListening, isListening };
};
```

**Effort:** 25-30 hours

---

## 5. TESTING STRATEGY

### Unit Tests

**Files to Test:**
- All utility functions
- Redux reducers and actions
- Services (API, auth, storage)
- Pure helper functions

**Example:**
```typescript
// __tests__/utils/accessibility.test.ts
import { validateColorContrast } from '@/shared/utils/accessibility';

describe('validateColorContrast', () => {
  it('should pass for sufficient contrast', () => {
    const result = validateColorContrast('#000000', '#FFFFFF');
    expect(result.passes).toBe(true);
    expect(result.ratio).toBeGreaterThan(4.5);
  });

  it('should fail for insufficient contrast', () => {
    const result = validateColorContrast('#CCCCCC', '#FFFFFF');
    expect(result.passes).toBe(false);
  });
});
```

**Target:** 80% coverage
**Effort:** 40-50 hours

---

### Component Tests

**Files to Test:**
- All shared components
- Complex feature components
- Form components with validation

**Example:**
```typescript
// __tests__/components/Button.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@/shared/components/Button';

describe('Button', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Button>Click Me</Button>);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button onPress={onPress}>Click</Button>);
    fireEvent.press(getByText('Click'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows loading indicator when loading', () => {
    const { getByTestId } = render(<Button loading>Click</Button>);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('is disabled when disabled prop is true', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button disabled onPress={onPress}>Click</Button>);
    fireEvent.press(getByText('Click'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
```

**Effort:** 50-60 hours

---

### Integration Tests

**Scenarios to Test:**
- Auth flow (login → dashboard)
- Mood logging flow
- Assessment completion
- Journal creation with audio
- Chat conversation

**Example:**
```typescript
// __tests__/integration/moodFlow.test.tsx
describe('Mood Logging Flow', () => {
  it('completes full mood logging', async () => {
    const { getByText, getByTestId } = render(<App />);

    // Navigate to mood selection
    fireEvent.press(getByTestId('mood-quick-action'));

    // Select mood
    fireEvent.press(getByText('Happy'));

    // Add intensity
    fireEvent.press(getByTestId('intensity-slider'));

    // Add note
    fireEvent.changeText(getByTestId('mood-note-input'), 'Feeling great today!');

    // Save
    fireEvent.press(getByText('Save Mood'));

    // Verify success
    await waitFor(() => {
      expect(getByText('Mood logged successfully')).toBeTruthy();
    });
  });
});
```

**Effort:** 30-40 hours

---

### E2E Tests (Detox/Playwright)

**Critical Flows:**
1. User registration
2. User login
3. Password reset
4. Assessment completion
5. Mood tracking
6. Journal entry with audio
7. Chat conversation
8. Profile update

**Example (Detox):**
```typescript
// e2e/authFlow.e2e.ts
describe('Authentication Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should show login screen', async () => {
    await expect(element(by.id('login-screen'))).toBeVisible();
  });

  it('should login with valid credentials', async () => {
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('SecurePass123!');
    await element(by.id('login-button')).tap();

    await waitFor(element(by.id('dashboard-screen')))
      .toBeVisible()
      .withTimeout(5000);
  });
});
```

**Effort:** 40-50 hours

---

### Accessibility Testing

**Tools:**
- iOS: Xcode Accessibility Inspector
- Android: TalkBack, Accessibility Scanner
- Automated: Axe, pa11y

**Manual Testing Checklist:**
- [ ] Screen reader navigation works
- [ ] All interactive elements are reachable
- [ ] Proper focus order
- [ ] Descriptive labels on all elements
- [ ] Sufficient color contrast (4.5:1)
- [ ] Touch targets minimum 44x44 points
- [ ] No text in images (or has alt text)
- [ ] Forms have proper labels and error messages
- [ ] Videos have captions
- [ ] No seizure-inducing animations

**Effort:** 20-30 hours

---

### Visual Regression Testing

**Tool:** Percy, Chromatic, or Applitools

**Setup:**
```typescript
// __tests__/visual/screens.visual.ts
import { percySnapshot } from '@percy/playwright';

describe('Visual Regression', () => {
  it('LoginScreen matches snapshot', async () => {
    await page.goto('/login');
    await percySnapshot(page, 'LoginScreen');
  });

  it('DashboardScreen matches snapshot', async () => {
    await page.goto('/dashboard');
    await percySnapshot(page, 'DashboardScreen - Light Mode');

    await page.click('[data-testid="theme-toggle"]');
    await percySnapshot(page, 'DashboardScreen - Dark Mode');
  });
});
```

**Screens to Test:**
- All 99+ screens in light mode
- All screens in dark mode
- All screens at mobile breakpoint
- All screens at tablet breakpoint

**Effort:** 30-40 hours

---

## 6. SECURITY HARDENING

### Authentication Security

**Implement:**
- [ ] Rate limiting (already in LoginScreen, verify working)
- [ ] Account lockout after failed attempts
- [ ] Password strength meter (already in SignupScreen)
- [ ] Breach detection (have I been pwned?)
- [ ] Session timeout
- [ ] Concurrent session limits
- [ ] Suspicious login detection

**Secure Token Storage:**
```typescript
import * as SecureStore from 'expo-secure-store';

export const storeToken = async (token: string) => {
  await SecureStore.setItemAsync('auth-token', token);
};

export const getToken = async () => {
  return await SecureStore.getItemAsync('auth-token');
};
```

---

### Data Security

**Sensitive Data Encryption:**
```typescript
import * as Crypto from 'expo-crypto';

export const encryptData = async (data: string, key: string) => {
  const encrypted = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    data + key
  );
  return encrypted;
};
```

**Secure Data Storage:**
- Use SecureStore for tokens, keys
- Use encrypted SQLite for local database
- Implement data-at-rest encryption

---

### Network Security

**API Security:**
- [ ] HTTPS only (enforce)
- [ ] Certificate pinning
- [ ] Request signing
- [ ] Token refresh flow
- [ ] XSS protection (sanitize inputs - already in chat)
- [ ] CSRF protection

**Example:**
```typescript
import axios from 'axios';
import { getToken } from './authService';

apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  config.headers.Authorization = `Bearer ${token}`;

  // Add request signature
  const signature = await generateSignature(config.data);
  config.headers['X-Request-Signature'] = signature;

  return config;
});
```

---

### Input Validation & Sanitization

**Already implemented in:**
- `src/shared/utils/sanitization.ts`
- `src/shared/utils/validation.ts`

**Ensure coverage:**
- [ ] All text inputs sanitized
- [ ] All URLs validated
- [ ] All file uploads validated
- [ ] All API responses validated

---

### Error Reporting

**Implement Sentry:**
```typescript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Use in error boundaries
componentDidCatch(error, errorInfo) {
  Sentry.captureException(error, { extra: errorInfo });
}
```

**Effort:** 30-40 hours

---

## 7. PERFORMANCE OPTIMIZATION

### Bundle Size Optimization

**Current Analysis:**
```bash
npx expo-bundle-size --platform ios
```

**Optimizations:**
- [ ] Implement code splitting
- [ ] Lazy load feature modules
- [ ] Tree shake unused code
- [ ] Optimize images (WebP, compressed)
- [ ] Remove unused dependencies

**Implementation:**
```typescript
// Lazy load screens
const DashboardScreen = React.lazy(() => import('./features/dashboard/DashboardScreen'));
const MoodTrackerScreen = React.lazy(() => import('./features/mood/MoodTrackerScreen'));

<Suspense fallback={<LoadingScreen />}>
  <DashboardScreen />
</Suspense>
```

---

### Render Performance

**Optimizations:**
- [ ] Add React.memo to pure components
- [ ] Use useCallback for event handlers
- [ ] Use useMemo for expensive calculations
- [ ] Optimize Redux selectors (already have useOptimizedSelectors)
- [ ] Use FlatList windowSize optimization
- [ ] Implement list item recycling

**Example:**
```typescript
export const MoodCard = React.memo(({ mood, onPress }) => {
  const handlePress = useCallback(() => {
    onPress(mood.id);
  }, [mood.id, onPress]);

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text>{mood.emoji}</Text>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  return prevProps.mood.id === nextProps.mood.id;
});
```

---

### Image Optimization

**Implementation:**
```typescript
import { Image } from 'expo-image';

<Image
  source={uri}
  placeholder={blurhash}
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk"
/>
```

**Optimizations:**
- [ ] Use expo-image (better performance)
- [ ] Implement blurhash placeholders
- [ ] Lazy load off-screen images
- [ ] Use WebP format
- [ ] Implement responsive images (sizes)

---

### Network Performance

**Optimizations:**
- [ ] Implement request caching
- [ ] Use compression (gzip)
- [ ] Implement request batching
- [ ] Use pagination for large lists
- [ ] Implement optimistic updates

**Example:**
```typescript
// Optimistic update
const logMood = async (mood: MoodEntry) => {
  // Update UI immediately
  dispatch(addMoodOptimistic(mood));

  try {
    // Send to server
    const result = await moodApi.logMood(mood);
    dispatch(confirmMood(result));
  } catch (error) {
    // Rollback on error
    dispatch(removeMoodOptimistic(mood.id));
    Alert.alert('Failed to save mood');
  }
};
```

---

### Database Performance

**Optimizations:**
- [ ] Add indexes to SQLite tables
- [ ] Use transactions for batch operations
- [ ] Implement query optimization
- [ ] Use prepared statements

**Example:**
```typescript
// Add index
db.execAsync(`
  CREATE INDEX IF NOT EXISTS idx_mood_timestamp
  ON mood_entries(timestamp DESC);
`);

// Use transaction
await db.transactionAsync(async tx => {
  for (const entry of entries) {
    await tx.executeSqlAsync(
      'INSERT INTO mood_entries (mood, timestamp) VALUES (?, ?)',
      [entry.mood, entry.timestamp]
    );
  }
});
```

**Effort:** 40-50 hours

---

## 8. PLATFORM TESTING

### iOS Testing

**Devices:**
- [ ] iPhone SE (3rd gen) - Small screen
- [ ] iPhone 14 - Standard size
- [ ] iPhone 14 Pro Max - Large screen
- [ ] iPad (10th gen) - Tablet

**iOS Versions:**
- [ ] iOS 15
- [ ] iOS 16
- [ ] iOS 17

**Features to Test:**
- [ ] Face ID authentication
- [ ] Touch ID authentication
- [ ] Safe area handling (notch, Dynamic Island)
- [ ] Keyboard handling
- [ ] Status bar behavior
- [ ] Push notifications
- [ ] Background refresh
- [ ] App lifecycle (background/foreground)

---

### Android Testing

**Devices:**
- [ ] Samsung Galaxy S21 (Android 12)
- [ ] Google Pixel 6 (Android 13)
- [ ] Samsung Galaxy Tab S8 (tablet)
- [ ] Budget device (Android 10)

**Android Versions:**
- [ ] Android 10
- [ ] Android 11
- [ ] Android 12
- [ ] Android 13
- [ ] Android 14

**Features to Test:**
- [ ] Fingerprint authentication
- [ ] Back button handling
- [ ] Keyboard handling (different keyboards)
- [ ] Status bar/navigation bar
- [ ] Push notifications
- [ ] Background refresh
- [ ] Permission handling
- [ ] App lifecycle

---

### Cross-Platform Features

**Test on Both Platforms:**
- [ ] Theme switching (light/dark)
- [ ] Responsive layouts
- [ ] Typography rendering
- [ ] Touch targets (44x44)
- [ ] Form validation
- [ ] Network error handling
- [ ] Offline mode
- [ ] Data synchronization
- [ ] Animations performance
- [ ] Memory usage
- [ ] Battery usage

**Effort:** 60-80 hours (comprehensive testing)

---

## 9. IMPLEMENTATION ORDER

### Phase 1: Critical Fixes (Week 1-2)
1. Fix Alert import bugs (2 screens) - 5 min
2. Fix fake assessment scoring - 40-60 hrs
3. Implement voice recording - 10-14 hrs
4. Implement audio playback - 8-10 hrs
5. Implement sound analysis - 8-12 hrs
6. Implement expression analysis - 12-16 hrs

**Total:** ~2 weeks

---

### Phase 2: Core Functionality (Week 3-8)
1. Backend API integration - 100-150 hrs
2. Data persistence layer - 30-40 hrs
3. Replace mock data (all screens) - 60-80 hrs
4. OAuth social login - 15-20 hrs
5. Search functionality - 30-40 hrs
6. Loading states (all screens) - 20-30 hrs

**Total:** ~6 weeks

---

### Phase 3: Visual Quality (Week 9-12)
1. Replace hardcoded font sizes - 40-50 hrs
2. Replace hardcoded colors - 30-40 hrs
3. Replace emoji icons - 20-30 hrs
4. Professional welcome illustrations - 20-30 hrs
5. Fix spacing inconsistencies - 10-15 hrs
6. Dark mode coverage - 15-20 hrs

**Total:** ~4 weeks

---

### Phase 4: Feature Completion (Week 13-18)
1. i18n system - 60-80 hrs
2. Complete sub-settings screens - 40-60 hrs
3. Offline mode sync - 30-40 hrs
4. Comprehensive error states - 20-30 hrs
5. Code quality improvements - 60-80 hrs
6. Analytics integration - 15-20 hrs

**Total:** ~6 weeks

---

### Phase 5: Testing & Optimization (Week 19-24)
1. Unit tests (80% coverage) - 40-50 hrs
2. Component tests - 50-60 hrs
3. Integration tests - 30-40 hrs
4. E2E tests - 40-50 hrs
5. Accessibility testing - 20-30 hrs
6. Visual regression testing - 30-40 hrs
7. Performance optimization - 40-50 hrs
8. Platform testing - 60-80 hrs

**Total:** ~6 weeks

---

### Phase 6: Nice-to-Have (Week 25-26)
1. Haptic feedback - 10-15 hrs
2. Achievement system - 20-30 hrs
3. Push notifications - 15-20 hrs
4. Voice commands - 25-30 hrs
5. Widget support - 40-50 hrs

**Total:** ~2 weeks (or backlog)

---

## 10. SUCCESS METRICS

### Quality Metrics

**Code Quality:**
- [ ] 0 TODO comments remaining
- [ ] 0 console.log statements
- [ ] 0 TypeScript `any` types
- [ ] 0 files > 500 lines
- [ ] < 10% code duplication

**Test Coverage:**
- [ ] 80%+ unit test coverage
- [ ] All critical flows have E2E tests
- [ ] All shared components have tests
- [ ] Accessibility audit passes 100%

**Performance:**
- [ ] App startup < 2 seconds
- [ ] Screen transitions < 300ms
- [ ] API responses < 1 second
- [ ] Bundle size < 30MB
- [ ] Memory usage < 200MB

**Visual Quality:**
- [ ] 100% screens match design (95%+ fidelity)
- [ ] 0 hardcoded colors
- [ ] 0 hardcoded font sizes
- [ ] 0 emoji icons
- [ ] All screens work in dark mode

**Functionality:**
- [ ] 0% mock data (100% real API)
- [ ] 0 fake features (assessment scoring real)
- [ ] All buttons functional
- [ ] All forms validate and save
- [ ] Offline mode works

**Accessibility:**
- [ ] WCAG 2.1 AA compliant
- [ ] Screen reader tested on iOS/Android
- [ ] Keyboard navigation works
- [ ] Color contrast passes
- [ ] Touch targets meet 44x44

**Security:**
- [ ] Security audit passed
- [ ] No exposed secrets
- [ ] All inputs sanitized
- [ ] Authentication secure
- [ ] Data encrypted

---

## FINAL CHECKLIST

### Before Production Launch

- [ ] All critical bugs fixed
- [ ] All core features functional
- [ ] All tests passing
- [ ] Security audit completed
- [ ] Performance benchmarks met
- [ ] Accessibility audit passed
- [ ] Legal review (privacy policy, terms)
- [ ] Content review (all text proofread)
- [ ] Error tracking integrated
- [ ] Analytics integrated
- [ ] App store assets ready
- [ ] Marketing materials ready
- [ ] Support documentation ready
- [ ] Beta testing completed
- [ ] Crash rate < 1%

---

**Document End**
**Next Steps:** Review with team, assign tasks, track in project management tool (Jira, Linear, etc.)
