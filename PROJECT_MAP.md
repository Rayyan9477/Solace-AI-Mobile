# Solace AI Mobile - Project Map

> **Last Updated**: 2025-11-30
> **Version**: 2.0.0
> **Analysis Scope**: Complete src/ directory deep dive

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Technology Stack](#2-technology-stack)
3. [Directory Structure](#3-directory-structure)
4. [Architecture Overview](#4-architecture-overview)
5. [App Layer](#5-app-layer)
6. [Features Layer](#6-features-layer)
7. [Shared Layer](#7-shared-layer)
8. [Service Architecture](#8-service-architecture)
9. [State Management](#9-state-management)
10. [Security Architecture](#10-security-architecture)
11. [Data Flow Patterns](#11-data-flow-patterns)
12. [API Integration](#12-api-integration)
13. [Offline Support](#13-offline-support)
14. [Internationalization](#14-internationalization)
15. [Known Issues Summary](#15-known-issues-summary)

---

## 1. Executive Summary

**Solace AI Mobile** is a comprehensive React Native mental health application built with Expo, designed to provide AI-powered therapeutic support, mood tracking, mindfulness exercises, and crisis intervention capabilities.

### Key Statistics

| Metric | Value |
|--------|-------|
| Total Files | 277 TypeScript/TSX files |
| Feature Modules | 15 distinct modules |
| Screens | 100+ screens |
| Redux Slices | 6 state slices |
| API Endpoints | 49 endpoints |
| Languages Supported | 10 languages |
| Components | 34+ reusable components |

### Core Capabilities

- **AI Therapy Chat**: Real-time conversational therapy with crisis detection
- **Mood Tracking**: SQLite-backed mood logging with analytics
- **Mindfulness**: 13 meditation and breathing exercise screens
- **Assessments**: PHQ-9, GAD-7, and custom mental health assessments
- **Community**: Peer support forums with moderation
- **Smart Notifications**: ML-driven therapeutic reminders
- **Offline Support**: Full offline-first architecture with sync queue

---

## 2. Technology Stack

### Core Framework
- React Native 0.74+ (Expo SDK 51)
- TypeScript 5.x (Strict Mode)

### State Management
- Redux Toolkit 2.x
- Redux Persist (AES-256 encrypted)
- React Query (Server State)

### Storage Solutions
- SQLite (expo-sqlite) - Mood data, offline cache
- AsyncStorage - General preferences
- SecureStore - Tokens, sensitive data

### Navigation
- React Navigation 6.x (Native Stack, Bottom Tab, Drawer)

### UI/Styling
- React Native Paper (Material Design)
- Custom Atomic Design System
- Reanimated 3.x (Animations)
- Gesture Handler 2.x

### Networking
- Axios 1.x (HTTP Client)
- Socket.io (Real-time Chat)

---

## 3. Directory Structure

```
src/
├── app/                          # Application core
│   ├── navigation/               # Navigation configuration
│   │   └── AppNavigator.tsx      # Main navigator (724 lines)
│   ├── providers/                # Context providers
│   │   ├── AppProvider.tsx       # Root provider (583 lines)
│   │   ├── AccessibilityProvider.tsx
│   │   ├── MentalHealthProvider.tsx
│   │   └── PerformanceProvider.tsx
│   ├── services/                 # Core services
│   │   ├── api.ts                # HTTP client (803 lines)
│   │   ├── apiCache.ts           # Response caching
│   │   ├── dataPersistence.ts    # Storage abstraction
│   │   ├── mentalHealthAPI.ts    # Mental health endpoints (1,200+ lines)
│   │   ├── secureStorage.ts      # Encrypted storage
│   │   └── tokenService.ts       # JWT management
│   ├── store/                    # Redux store
│   │   ├── index.ts              # Store configuration
│   │   ├── middleware/           # Custom middleware
│   │   └── slices/               # State slices (6 slices)
│   └── hooks/                    # App-level hooks
│
├── features/                     # Feature modules (15 modules)
│   ├── assessment/               # Mental health assessments
│   ├── auth/                     # Authentication
│   ├── chat/                     # AI Therapy Chat (1,162 lines)
│   ├── community/                # Peer Support
│   ├── crisis/                   # Crisis Intervention
│   ├── dashboard/                # Main Dashboard
│   ├── error/                    # Error Handling
│   ├── journal/                  # Journaling
│   ├── mindfulness/              # Meditation (13 screens)
│   ├── mood/                     # Mood Tracking (SQLite)
│   ├── offlineMode/              # Offline Support (1,102 lines)
│   ├── onboarding/               # User Onboarding
│   ├── profile/                  # User Profile
│   ├── search/                   # Search
│   ├── smartNotifications/       # ML Notifications (1,152 lines)
│   ├── therapy/                  # Therapy Sessions
│   └── wellness/                 # Wellness Tools
│
└── shared/                       # Shared resources
    ├── components/               # Atomic Design (34+ components)
    │   ├── atoms/                # Button, Text, Input, Icon, etc.
    │   ├── molecules/            # Card, ListItem, Modal, etc.
    │   └── organisms/            # Header, BottomSheet, Form, etc.
    ├── hooks/                    # Custom hooks
    ├── services/                 # Shared services
    ├── utils/                    # Utility functions
    ├── config/                   # Configuration
    ├── constants/                # Constants
    ├── theme/                    # Theming
    └── types/                    # TypeScript types
```

---

## 4. Architecture Overview

### Layered Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        PRESENTATION                          │
│  Screens (100+) + Components (Atoms → Molecules → Organisms)│
├─────────────────────────────────────────────────────────────┤
│                      STATE MANAGEMENT                        │
│  Redux (6 slices) + React Query + Context Providers         │
├─────────────────────────────────────────────────────────────┤
│                        SERVICES                              │
│  API + Auth + Storage + Analytics + i18n                    │
├─────────────────────────────────────────────────────────────┤
│                         DATA                                 │
│  SQLite (Mood) + AsyncStorage (Prefs) + SecureStore (Tokens)│
└─────────────────────────────────────────────────────────────┘
```

### Provider Stack

```tsx
<ReduxProvider>
  <PersistGate>
    <QueryClientProvider>
      <ThemeProvider>
        <AccessibilityProvider>
          <MentalHealthProvider>
            <PerformanceProvider>
              <OfflineProvider>
                <NavigationContainer>
                  <AppNavigator />
                </NavigationContainer>
              </OfflineProvider>
            </PerformanceProvider>
          </MentalHealthProvider>
        </AccessibilityProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </PersistGate>
</ReduxProvider>
```

---

## 5. App Layer

### 5.1 Navigation (AppNavigator.tsx - 724 lines)

**Location**: `src/app/navigation/AppNavigator.tsx`

#### Navigator Structure
```
RootNavigator
├── AuthStack (Unauthenticated)
│   ├── Welcome, Login, Signup, ForgotPassword, Onboarding
│
├── MainStack (Authenticated)
│   ├── MainTabs (Home, Chat, Mood, Mindfulness, Journal, Profile)
│   └── Modal Screens (Assessment, Crisis, Community, Therapy, etc.)
│
└── Shared Screens (Error, Maintenance, NotFound)
```

### 5.2 Core Services

| Service | Location | Lines | Purpose |
|---------|----------|-------|---------|
| api.ts | src/app/services/api.ts | 803 | HTTP client with interceptors, retry logic |
| tokenService.ts | src/app/services/tokenService.ts | ~200 | JWT management, refresh logic |
| secureStorage.ts | src/app/services/secureStorage.ts | ~150 | Encrypted storage abstraction |
| mentalHealthAPI.ts | src/app/services/mentalHealthAPI.ts | 1,200+ | 49 mental health API endpoints |
| apiCache.ts | src/app/services/apiCache.ts | ~100 | Response caching layer |

### 5.3 Redux Store (6 Slices)

| Slice | Lines | Purpose |
|-------|-------|---------|
| authSlice | 255 | Authentication state, tokens, user session |
| moodSlice | 392 | Mood entries, stats, trends |
| userSlice | 265 | User profile, preferences |
| chatSlice | 148 | Chat messages, conversations |
| assessmentSlice | 484 | Assessment history, results |
| therapySlice | 644 | Therapy sessions, bookings |

---

## 6. Features Layer

### 6.1 Assessment Module
**Location**: `src/features/assessment/`

- PHQ-9, GAD-7, PSS-10, WHO-5 scoring algorithms
- `scoringAlgorithm.ts` (400+ lines) - Clinical scoring logic
- Severity threshold classification
- History tracking and trend analysis

### 6.2 Auth Module
**Location**: `src/features/auth/`

- Email/password authentication
- Biometric login (Face ID/Touch ID)
- Secure token storage via SecureStore
- Session management with timeout

### 6.3 Chat Module (AI Therapy)
**Location**: `src/features/chat/`

**ChatScreen.tsx (1,162 lines)** - Core features:
- Real-time AI conversation with streaming
- Voice input with transcription
- Crisis keyword detection and intervention
- Session summarization
- Message history persistence

### 6.4 Crisis Module
**Location**: `src/features/crisis/`

- Emergency hotlines (40+ countries)
- Personal safety plan management
- Crisis detection service with keyword scanning
- Automatic emergency contact notification
- 988 Suicide & Crisis Lifeline integration

### 6.5 Mindfulness Module (13 screens)
**Location**: `src/features/mindfulness/`

| Screen | Purpose |
|--------|---------|
| MindfulnessHomeScreen | Category selection |
| MeditationScreen | Guided meditations |
| BreathingExerciseScreen | 4-7-8, Box breathing |
| BodyScanScreen | Body awareness |
| ProgressiveMuscleScreen | PMR exercises |
| VisualizationScreen | Imagery exercises |
| GratitudeScreen | Gratitude practice |
| SleepStoriesScreen | Bedtime stories |
| FocusModeScreen | Concentration tools |
| QuickRelaxScreen | 1-5 minute exercises |

### 6.6 Mood Module
**Location**: `src/features/mood/`

**moodStorageService.ts (642 lines)**
- SQLite-based persistence with sync tracking
- Offline-first architecture
- Analytics and trend calculation
- Factor correlation analysis

### 6.7 Offline Mode
**Location**: `src/features/offlineMode/`

**OfflineManager.ts (1,102 lines)**
- Network state detection
- Request queue management with priority
- Automatic retry on reconnect
- Conflict resolution (server timestamp wins)
- Storage quota management

### 6.8 Smart Notifications
**Location**: `src/features/smartNotifications/`

**NotificationManager.ts (1,152 lines)**
- ML-based timing optimization
- User behavior learning
- Quiet hours respect (22:00-08:00)
- Therapeutic message rotation
- Engagement tracking and A/B testing

---

## 7. Shared Layer

### Component Library (Atomic Design)

**Atoms (7 components)**: Button, Text, Input, Icon, Spinner, Badge, Avatar

**Molecules (7 components)**: Card, ListItem, SearchInput, Toast, Modal, DatePicker, ProgressBar

**Organisms (5 components)**: Header, BottomSheet, Carousel, Form, DataTable

### Shared Services

| Service | Purpose |
|---------|---------|
| analyticsService | HIPAA-compliant event tracking |
| hapticService | Therapeutic haptic patterns |
| i18nService | 10 language support |
| logger | PII-safe logging |
| errorHandlingService | Centralized error handling |
| retryService | Exponential backoff retry logic |

### Custom Hooks

| Hook | Purpose |
|------|---------|
| useDebounce | Debounce input values |
| useKeyboard | Keyboard visibility state |
| useNetworkStatus | Network connectivity |
| usePermissions | Permission requests |
| useTheme | Theme access |

---

## 8. Service Architecture

### Service Dependency Graph

```
                    ┌─────────────────┐
                    │     Screens     │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Redux     │     │ React Query │     │  Services   │
│   Store     │     │   Cache     │     │   Layer     │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  API Layer  │
                    │  (api.ts)   │
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ SecureStore │   │AsyncStorage │   │   SQLite    │
└─────────────┘   └─────────────┘   └─────────────┘
```

---

## 9. State Management

### Redux Store Shape

```typescript
interface RootState {
  auth: AuthState;      // Authentication, tokens
  mood: MoodState;      // Mood entries, stats
  user: UserState;      // Profile, preferences
  chat: ChatState;      // Messages, conversations
  assessment: AssessmentState;  // Results, history
  therapy: TherapyState;        // Sessions, bookings
}
```

### Persistence Configuration

- **Whitelist**: auth, user, mood (persisted)
- **Blacklist**: chat (excluded - too large)
- **Encryption**: AES-256 transform on sensitive slices
- **Timeout**: 10 second rehydration limit

---

## 10. Security Architecture

### Security Layers

| Layer | Implementation |
|-------|----------------|
| Application | Input validation, XSS prevention |
| Transport | HTTPS/TLS 1.3, Certificate pinning |
| Authentication | JWT tokens, Biometric verification |
| Storage | SecureStore, AES-256 encryption |

### Token Strategy

- **Access Token**: 1 hour expiry, refresh 5 min before
- **Refresh Token**: 30 days, rotation on use
- **Storage**: expo-secure-store (Keychain/Keystore)

---

## 11. Data Flow Patterns

### Authentication Flow
```
User Input → Login Screen → API Auth → Store Tokens → SecureStore → Navigate Home
```

### Mood Tracking Flow
```
User Entry → Mood Screen → SQLite (Local) → Redux Update
                                          → Offline Queue → Sync to Server
```

### Crisis Detection Flow
```
User Message → Crisis Detect → Crisis Screen → Notify Contacts
                                             → Emergency Resources
```

---

## 12. API Integration

### Endpoint Categories (49 Total)

| Category | Count | Auth Required |
|----------|-------|---------------|
| Auth | 5 | Partial |
| Mood | 8 | Yes |
| Assessment | 6 | Yes |
| Journal | 5 | Yes |
| Chat | 7 | Yes |
| Community | 8 | Yes |
| Therapy | 7 | Yes |
| Mindfulness | 6 | Yes |
| Emergency | 5 | No |

---

## 13. Offline Support

### Capabilities Matrix

| Feature | Offline Read | Offline Write | Sync Strategy |
|---------|--------------|---------------|---------------|
| Mood | SQLite | SQLite | Background |
| Journal | SQLite | SQLite | Background |
| Chat | Cache | Queue only | On reconnect |
| Assessments | Cache | Queue | On reconnect |
| Mindfulness | Downloaded | N/A | Pre-download |

### Sync Priority
1. **CRITICAL**: Crisis alerts (immediate)
2. **HIGH**: Mood entries, assessments
3. **NORMAL**: Journal, chat
4. **LOW**: Analytics, preferences

---

## 14. Internationalization

### Supported Languages (10)

| Language | Code | Coverage | Status |
|----------|------|----------|--------|
| English | en | 100% | Production |
| Spanish | es | 100% | Production |
| French | fr | 100% | Production |
| German | de | 100% | Production |
| Portuguese | pt | 100% | Production |
| Italian | it | 95% | Beta |
| Japanese | ja | 90% | Beta |
| Korean | ko | 90% | Beta |
| Chinese (Simplified) | zh-CN | 85% | Beta |
| Chinese (Traditional) | zh-TW | 85% | Beta |

---

## 15. Known Issues Summary

### Critical Priority

| Issue | Location | Description |
|-------|----------|-------------|
| Token Expiration Mismatch | tokenService.ts:45 | Hard-coded 1hr vs API variable expiry |
| Encryption Fallback | secureStorage.ts:89 | Falls back to unencrypted AsyncStorage |
| Selector Error Swallowing | moodSlice.ts:156 | Silent catch blocks hide errors |

### High Priority

| Issue | Location | Description |
|-------|----------|-------------|
| Sync Queue Routing | OfflineManager.ts:234 | Queue bypasses some API routes |
| Mood Stats Validation | moodStorageService.ts:412 | Missing null checks on stats |
| Assessment Scoring | scoringAlgorithm.ts:78 | Hardcoded thresholds need config |

### Medium Priority

| Issue | Location | Description |
|-------|----------|-------------|
| No Rate Limiting | LoginScreen.tsx | Client-side only, no server check |
| Memory Leak Risk | ChatScreen.tsx:890 | WebSocket not cleaned on unmount |
| Request Cancellation | api.ts:234 | Stale request race conditions |

---

## Appendix: File Count by Layer

| Layer | Files |
|-------|-------|
| src/app/ | 20 files |
| src/features/ | 186 files |
| src/shared/ | 71 files |
| **TOTAL** | **277 files** |

---

*Document generated: 2025-11-30*
*Analysis method: Multi-agent codebase exploration*
*For detailed bug tracking, see BUG_REPORT.md*
