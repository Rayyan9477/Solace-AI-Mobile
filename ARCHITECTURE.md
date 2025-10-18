# 📐 System Architecture

**Detailed technical architecture and design patterns for Solace AI Mobile**

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Patterns](#core-patterns)
3. [Layered Architecture](#layered-architecture)
4. [State Management](#state-management)
5. [Navigation](#navigation)
6. [Component Structure](#component-structure)
7. [Data Flow](#data-flow)
8. [Performance Optimization](#performance-optimization)
9. [Error Handling](#error-handling)
10. [Security](#security)

---

## Architecture Overview

### Design Pattern: Feature-Based + Atomic Design

Solace AI Mobile uses a **hybrid architecture**:

1. **Feature-Based Organization** - Code grouped by business domain
2. **Atomic Design Pattern** - UI components organized hierarchically
3. **Separation of Concerns** - Each layer has specific responsibilities

```
┌─────────────────────────────────────────────────────┐
│                  Application Layer                   │
│              (Screens, Navigation, Routing)          │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────┐
│              Feature Layer                           │
│   (Mood, Chat, Assessment, Crisis, etc.)            │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────┐
│           Shared Layer (UI & Logic)                 │
│   (Components, Hooks, Utils, Services)              │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────┐
│            Data Layer                                │
│   (Redux Store, LocalStorage, API)                  │
└─────────────────────────────────────────────────────┘
```

---

## Core Patterns

### 1. Feature Module Pattern

Each feature is self-contained:

```
src/features/mood/
├── screens/
│   ├── MoodTrackerScreen.js
│   ├── MoodStatsScreen.js
│   └── EnhancedMoodTrackerScreen.js
├── components/
│   ├── MoodSelector.js
│   ├── IntensitySlider.js
│   └── MoodChart.js
├── services/
│   └── moodService.js
├── hooks/
│   └── useMoodTracking.js
├── types/
│   └── mood.types.ts
└── index.ts (Exports)
```

**Benefits:**
- ✅ Encapsulation - Feature owns its logic
- ✅ Scalability - Easy to add new features
- ✅ Maintainability - Clear boundaries
- ✅ Testability - Isolated test suites

### 2. Atomic Design Pattern

Components organized by complexity:

```
shared/components/
├── atoms/              # Basic, reusable units
│   ├── Button
│   ├── Input
│   ├── Text
│   └── Icon
├── molecules/          # Composed atoms
│   ├── Card
│   ├── Modal
│   ├── Form
│   └── Modal
└── organisms/          # Complex, feature-complete
    ├── Layout
    ├── Navigation
    └── HeaderBar
```

**Component Hierarchy:**

```
Organism (Complex container)
  └── Molecule (Composition of atoms)
      ├── Atom (Basic element)
      ├── Atom
      └── Atom
```

### 3. Container/Presentational Pattern

Screens = Containers, Components = Presentational

```javascript
// ✅ Container Screen (Smart)
export const MoodTrackerScreen = () => {
  const dispatch = useDispatch();
  const moods = useSelector(selectMoods);
  const [selectedMood, setSelectedMood] = useState(null);
  
  const handleMoodSelect = (mood) => {
    dispatch(saveMood(mood));
  };
  
  return <MoodTracker mood={moods} onSelect={handleMoodSelect} />;
};

// ✅ Presentational Component (Dumb)
export const MoodTracker = ({ mood, onSelect }) => {
  return (
    <View>
      {mood.map(m => <MoodCard key={m.id} mood={m} onPress={onSelect} />)}
    </View>
  );
};
```

---

## Layered Architecture

### Layer 1: Application Layer

**Responsibility**: Route management and screen orchestration

```
src/app/
├── navigation/
│   └── AppNavigator.js (Routes & Stack setup)
├── providers/
│   ├── AppProvider.js (Redux, Theme setup)
│   └── RefactoredAppProvider.js (Master orchestrator)
└── store/
    ├── store.js
    └── slices/
```

**Key Components:**
- React Navigation configuration
- Provider orchestration
- Global error handling

### Layer 2: Feature Layer

**Responsibility**: Business logic and domain features

Each feature contains:
- **Screens**: User interfaces
- **Components**: Feature-specific UI
- **Services**: Business logic
- **Hooks**: Reusable feature logic
- **Types**: Feature-specific types

**Example: Mood Feature**
```
features/mood/
├── screens/
│   ├── MoodTrackerScreen.js (Main UI)
│   ├── MoodStatsScreen.js (Analytics UI)
│   └── EnhancedMoodTrackerScreen.js (Guided flow)
├── components/
│   ├── MoodSelector.js (Mood choice UI)
│   ├── IntensitySlider.js (Slider UI)
│   └── MoodChart.js (Chart UI)
├── services/
│   └── moodService.js (API calls, data processing)
├── hooks/
│   └── useMoodTracking.js (Feature hook)
└── types/
    └── mood.types.ts (TypeScript types)
```

### Layer 3: Shared Layer

**Responsibility**: Reusable UI and utilities

```
shared/
├── components/
│   ├── atoms/ (Button, Input, Text)
│   ├── molecules/ (Card, Modal, Form)
│   └── organisms/ (Layout, Navigation)
├── hooks/
│   ├── useTheme.js
│   ├── useAuth.js
│   └── useNavigation.js
├── utils/
│   ├── dateUtils.js
│   ├── stringUtils.js
│   └── mathUtils.js
├── services/
│   ├── apiService.js (HTTP client)
│   ├── storageService.js (Local storage)
│   └── authService.js (Auth logic)
├── theme/
│   ├── UnifiedThemeProvider.js
│   ├── lightTheme.js
│   └── darkTheme.js
└── constants/
    └── appConstants.js
```

### Layer 4: Data Layer

**Responsibility**: State management and persistence

```
Redux Store Structure:
{
  auth: {
    user: { id, email, name },
    token: 'jwt_token',
    isAuthenticated: boolean,
    error: null
  },
  mood: {
    entries: [{ date, mood, intensity }],
    currentMood: null,
    stats: { average, trend }
  },
  chat: {
    messages: [],
    sessionId: null
  },
  theme: {
    mode: 'light' | 'dark',
    autoDetect: boolean
  }
}
```

---

## State Management

### Redux Architecture

**Store Configuration** (`src/app/store/store.js`):

```javascript
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import authReducer from './slices/authSlice';
import moodReducer from './slices/moodSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'mood', 'theme']
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    mood: moodReducer,
    chat: chatReducer,
    // ... other slices
  }
});

export const persistor = persistStore(store);
```

### Slice Pattern (Redux Toolkit)

**Example: Mood Slice** (`src/app/store/slices/moodSlice.js`):

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchMoodHistory = createAsyncThunk(
  'mood/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/moods');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const moodSlice = createSlice({
  name: 'mood',
  initialState: {
    entries: [],
    loading: false,
    error: null,
    currentMood: null
  },
  reducers: {
    setCurrentMood: (state, action) => {
      state.currentMood = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoodHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMoodHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(fetchMoodHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setCurrentMood, clearError } = moodSlice.actions;
export default moodSlice.reducer;
```

### Using Redux in Components

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { fetchMoodHistory, setCurrentMood } from '@app/store/slices/moodSlice';

export const MoodTrackerScreen = () => {
  const dispatch = useDispatch();
  const { entries, loading, error } = useSelector(state => state.mood);
  
  useEffect(() => {
    dispatch(fetchMoodHistory());
  }, [dispatch]);
  
  const handleMoodSelect = (mood) => {
    dispatch(setCurrentMood(mood));
  };
  
  return (
    <View>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {entries.map(entry => <MoodEntry key={entry.id} entry={entry} />)}
    </View>
  );
};
```

---

## Navigation

### Navigation Structure

```
Root Navigator
├── AuthStack (When not authenticated)
│   ├── SignInScreen
│   ├── SignUpScreen
│   └── ForgotPasswordScreen
└── AppStack (When authenticated)
    ├── MainTabs (Bottom tab navigation)
    │   ├── DashboardTab
    │   │   └── MainAppScreen
    │   ├── MoodTab
    │   │   └── MoodTrackerScreen
    │   ├── ChatTab
    │   │   └── ChatScreen
    │   ├── WellnessTab
    │   │   └── WellnessScreen
    │   └── ProfileTab
    │       └── ProfileScreen
    ├── ModalStack (Modals overlay)
    │   ├── CrisisModal
    │   ├── JournalModal
    │   └── SettingsModal
    └── Nested Stacks (Detail views)
        ├── MoodDetailStack
        └── ChatDetailStack
```

### Navigation Configuration

```javascript
// AppNavigator.js
export const AppNavigator = ({ userToken }) => {
  return (
    <NavigationContainer theme={navigationTheme}>
      {userToken ? (
        <Stack.Navigator>
          <Stack.Screen
            name="MainApp"
            component={MainAppTabs}
            options={{ headerShown: false }}
          />
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="CrisisModal" component={CrisisModal} />
            <Stack.Screen name="SettingsModal" component={SettingsModal} />
          </Stack.Group>
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};
```

---

## Component Structure

### Atomic Component Example

**Atom: Button Component**

```javascript
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export const Button = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        disabled && styles.disabled
      ]}
      onPress={onPress}
      disabled={disabled}
      accessible
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      {...props}
    >
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  primary: {
    backgroundColor: '#007AFF'
  },
  secondary: {
    backgroundColor: '#E8E8E8'
  },
  disabled: {
    opacity: 0.5
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF'
  }
});
```

**Molecule: Card with Button**

```javascript
export const ActionCard = ({ title, description, buttonLabel, onPress }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Button
        label={buttonLabel}
        onPress={onPress}
        variant="primary"
      />
    </View>
  );
};
```

**Organism: Layout Container**

```javascript
export const ScreenLayout = ({ children, header, footer }) => {
  return (
    <SafeAreaView style={styles.container}>
      {header && <Header />}
      <ScrollView style={styles.content}>
        {children}
      </ScrollView>
      {footer && <Footer />}
    </SafeAreaView>
  );
};
```

---

## Data Flow

### Complete Data Flow Diagram

```
User Action
    │
    ▼
Component Event Handler
    │
    ▼
Dispatch Redux Action
    │
    ▼
Async Thunk (Optional API Call)
    │
    ▼
API Service → Backend
    │
    ▼
Slice Reducer Updates State
    │
    ▼
Redux Persist (Save to AsyncStorage)
    │
    ▼
Component Selector Re-evaluates
    │
    ▼
Component Re-renders
    │
    ▼
UI Updates
```

### Example: Saving a Mood

```javascript
// 1. User taps mood button
<MoodOption mood="happy" onPress={() => handleMoodSelect('happy')} />

// 2. Component dispatches action
const handleMoodSelect = (mood) => {
  dispatch(saveMood({ mood, timestamp: new Date() }));
};

// 3. Slice handles action
const saveMood = createAsyncThunk(
  'mood/save',
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiService.post('/moods', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 4. Reducer updates state
.addCase(saveMood.fulfilled, (state, action) => {
  state.entries.push(action.payload);
  state.currentMood = action.payload;
})

// 5. Redux Persist saves to AsyncStorage

// 6. Selectors return updated state
const { currentMood } = useSelector(state => state.mood);

// 7. Component re-renders with new mood
```

---

## Performance Optimization

### Memoization

**useMemo for expensive calculations:**

```javascript
const moodStats = useMemo(() => {
  return calculateMoodStatistics(moodEntries);
}, [moodEntries]);
```

**useCallback for stable callbacks:**

```javascript
const handleMoodSelect = useCallback((mood) => {
  dispatch(setCurrentMood(mood));
}, [dispatch]);
```

**React.memo for component memoization:**

```javascript
export const MoodCard = React.memo(({ mood, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{mood.name}</Text>
    </TouchableOpacity>
  );
});
```

### Code Splitting

```javascript
// Lazy load feature screens
const ChatScreen = lazy(() => import('@features/chat/screens/ChatScreen'));
const AssessmentScreen = lazy(() => import('@features/assessment/screens/AssessmentScreen'));

// Loading fallback
<Suspense fallback={<LoadingSpinner />}>
  <ChatScreen />
</Suspense>
```

### List Optimization

```javascript
// Use FlatList instead of map
<FlatList
  data={moodEntries}
  renderItem={({ item }) => <MoodEntry entry={item} />}
  keyExtractor={(item) => item.id}
  removeClippedSubviews={true}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
/>
```

---

## Error Handling

### Global Error Boundary

```javascript
export class AppErrorBoundary extends Component {
  componentDidCatch(error, errorInfo) {
    logError(error, errorInfo);
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onRetry={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}
```

### API Error Handling

```javascript
export const apiService = {
  async get(url) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        // Handle unauthorized
        store.dispatch(logout());
      } else if (error.response?.status === 500) {
        // Handle server error
        showErrorMessage('Server error. Please try again.');
      } else {
        // Handle network error
        showErrorMessage('Network error. Please check your connection.');
      }
      throw error;
    }
  }
};
```

### Feature-Level Error Handling

```javascript
const { data, loading, error } = useSelector(state => state.mood);

return (
  <View>
    {loading && <LoadingSpinner />}
    {error && <ErrorAlert message={error} onRetry={refetch} />}
    {data && <MoodList data={data} />}
  </View>
);
```

---

## Security

### Authentication Token Management

```javascript
// Secure token storage
const storeToken = async (token) => {
  await SecureStore.setItemAsync('auth_token', token);
};

const getToken = async () => {
  return await SecureStore.getItemAsync('auth_token');
};

// Token refresh logic
const refreshToken = async () => {
  const oldToken = await getToken();
  const response = await api.post('/refresh', { token: oldToken });
  await storeToken(response.newToken);
  return response.newToken;
};
```

### API Security

```javascript
// Add auth header to all requests
axios.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const newToken = await refreshToken();
      error.config.headers.Authorization = `Bearer ${newToken}`;
      return axios(error.config);
    }
    throw error;
  }
);
```

### Data Encryption

```javascript
// Encrypt sensitive data
import CryptoJS from 'crypto-js';

const encryptData = (data, password) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), password).toString();
};

const decryptData = (encrypted, password) => {
  const bytes = CryptoJS.AES.decrypt(encrypted, password);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
```

---

## Summary

Solace AI Mobile uses a **sophisticated, scalable architecture**:

- ✅ **Feature-Based Organization** - Clear boundaries and ownership
- ✅ **Atomic Design** - Reusable, maintainable components
- ✅ **Redux State Management** - Centralized, predictable state
- ✅ **Layered Architecture** - Separation of concerns
- ✅ **Performance Optimized** - Memoization and code splitting
- ✅ **Secure** - Token management and encryption
- ✅ **Error Resilient** - Comprehensive error handling

This architecture enables:
- 🚀 **Fast Development** - Clear patterns and structure
- 📈 **Easy Scaling** - Add features without affecting existing code
- 🧪 **Better Testing** - Isolated, testable components
- 🔒 **Security** - Proper auth and data handling
- ♿ **Accessibility** - Built-in from component level
