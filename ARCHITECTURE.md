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
7. [Theme System & Responsive Design](#theme-system--responsive-design)
8. [Data Flow](#data-flow)
9. [Performance Optimization](#performance-optimization)
10. [Error Handling](#error-handling)
11. [Security](#security)

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

## Theme System & Responsive Design

### Overview

Solace AI Mobile implements a comprehensive theming system with customizable color palettes and responsive design patterns optimized for web, tablet, and mobile platforms.

### Theme Architecture

```
┌─────────────────────────────────────────────────────────┐
│              ThemeProvider (Context)                    │
│  - Light/Dark mode management                           │
│  - Custom color palette loading                         │
│  - AsyncStorage persistence                             │
└────────────────┬────────────────────────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
┌───▼────────────┐  ┌────────▼────────────┐
│  Base Themes   │  │  Custom Colors      │
│  (Light/Dark)  │  │  (5 Presets)        │
└───┬────────────┘  └────────┬────────────┘
    │                         │
    └────────────┬────────────┘
                 │
         ┌───────▼────────┐
         │  Merged Theme  │
         │  (Final Output)│
         └────────────────┘
```

### Theme Provider Implementation

**Location**: `src/shared/theme/ThemeProvider.tsx`

**Features**:
- Light/Dark mode toggle
- Custom color palette management
- Persistent storage across sessions
- Runtime theme switching
- Preset color palette selection

**Usage**:
```javascript
import { useTheme } from '@theme/ThemeProvider';

export const MyComponent = () => {
  const { theme, isDark, toggleTheme, setCustomColors, resetCustomColors } = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background.primary }}>
      <Text style={{ color: theme.colors.text.primary }}>
        Current mode: {isDark ? 'Dark' : 'Light'}
      </Text>
    </View>
  );
};
```

### Color Customization System

**Location**: `src/shared/theme/customColors.ts`

**5 Preset Palettes**:

| Preset | Name | Use Case | Primary Colors |
|--------|------|----------|----------------|
| `default` | Mindful Brown | General wellness, evening | Brown tones (#704A33, #AC836C) |
| `serene` | Serene Green | Anxiety relief, meditation | Green tones (#5A6838, #98B068) |
| `warm` | Warm Orange | Motivation, morning | Orange/amber (#C96100, #ED7E1C) |
| `wisdom` | Wisdom Purple | Focus, contemplation | Purple tones (#5849A5, #8978F7) |
| `sunshine` | Sunshine Yellow | Mood elevation, energy | Yellow tones (#A37A00, #FFB014) |

**Color Structure**:
```typescript
interface CustomColorPalette {
  primary?: string;      // Main brand color
  secondary?: string;    // Secondary accent
  accent?: string;       // Highlight color
  background?: string;   // Background override
  text?: string;         // Text color override
}

interface CustomColors {
  light?: CustomColorPalette;  // Light mode colors
  dark?: CustomColorPalette;   // Dark mode colors
}
```

**Theme Customization UI**: Navigate to **Profile → Theme Settings** to select and preview color palettes.

### Responsive Design System

**Location**: `src/shared/hooks/useResponsive.ts`

**Breakpoint System**:

| Breakpoint | Width | Device Type | Layout Strategy |
|------------|-------|-------------|-----------------|
| **base** | < 640px | Mobile phones | Full-width, vertical scroll |
| **sm** | ≥ 640px | Large phones | Slight padding increase |
| **md** | ≥ 768px | Tablets (iPad) | Centered content, max-width |
| **lg** | ≥ 1024px | Laptops | Card-based layout |
| **xl** | ≥ 1280px | Desktops | Multi-column support |
| **xxl** | ≥ 1536px | Large displays | Max content constraints |

**useResponsive Hook**:
```javascript
import { useResponsive } from '@shared/hooks/useResponsive';

export const MyScreen = () => {
  const {
    width,                    // Current screen width
    height,                   // Current screen height
    isWeb,                    // true if web platform
    isMobile,                 // true if mobile platform
    currentBreakpoint,        // Current breakpoint name
    getResponsiveValue,       // Get value based on breakpoint
    getMaxContentWidth,       // Get max content width
    getContainerPadding,      // Get responsive padding
    isSm, isMd, isLg, isXl    // Breakpoint boolean flags
  } = useResponsive();

  return (
    <View style={{
      maxWidth: isWeb ? 480 : '100%',
      padding: getContainerPadding(),
    }}>
      <Text>Content adapts to screen size</Text>
    </View>
  );
};
```

**ResponsiveContainer Component**:
```javascript
import { ResponsiveContainer } from '@shared/components/organisms/ResponsiveContainer';

export const MyScreen = () => {
  return (
    <ResponsiveContainer maxWidth={800} centerContent>
      {/* Content automatically centered on large screens */}
      <Text>Responsive content</Text>
    </ResponsiveContainer>
  );
};
```

### Responsive Layout Patterns

**Mobile-First Approach**:
```javascript
const styles = StyleSheet.create({
  container: {
    padding: 16,                    // Mobile default
    ...(isWeb && {
      padding: 32,                  // Web override
      maxWidth: 480,
      marginHorizontal: 'auto',
    }),
  },
  text: {
    fontSize: 16,                   // Mobile default
    ...(isLg && { fontSize: 18 }), // Large screen override
  },
});
```

**Adaptive Components**:
```javascript
// Different rendering strategies based on screen size
const renderLayout = () => {
  if (isMobile) {
    return <StackLayout>{content}</StackLayout>;
  }
  return <GridLayout columns={2}>{content}</GridLayout>;
};
```

### Web Optimization

**Auth Screens** (LoginScreen, SignupScreen):
- Centered content with max-width 480px on web
- Card-like appearance with rounded corners
- Increased padding (32px vs 24px)
- Adjusted logo sizing (56px vs 64px)
- Better ScrollView behavior

**Dashboard & Feature Screens**:
- Responsive grid layouts
- Adaptive card sizing
- Web-specific spacing
- Touch-optimized on mobile

### Theme Persistence

**Storage Keys**:
- `@solace_theme_mode`: Light/Dark mode preference
- `custom_colors`: User's selected color palette

**Persistence Flow**:
```
User selects theme
      ↓
ThemeProvider updates state
      ↓
AsyncStorage saves preference
      ↓
App restart loads from storage
      ↓
Theme applied automatically
```

### Accessibility Considerations

**Theme System**:
- ✅ High contrast color ratios (WCAG AA compliant)
- ✅ Reduced motion support
- ✅ Screen reader friendly
- ✅ Keyboard navigation (web)

**Responsive Design**:
- ✅ Touch targets ≥ 44px (mobile)
- ✅ Proper focus management (web)
- ✅ Accessible breakpoint transitions
- ✅ No content hidden by responsive behavior

### Performance Optimization

**Theme Switching**:
- Memoized theme objects
- No re-renders for unchanged components
- Efficient AsyncStorage operations

**Responsive Calculations**:
- Cached dimension listeners
- Debounced resize handlers (web)
- Minimal layout recalculations

**Bundle Impact**:
- useResponsive hook: ~3KB
- ResponsiveContainer: ~1KB
- customColors module: ~4KB
- **Total**: ~8KB additional bundle size

### Best Practices

**Using Themes**:
```javascript
// ✅ Good - Use theme colors
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.primary,
    borderColor: theme.colors.brown[30],
  },
});

// ❌ Bad - Hardcoded colors
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5DDD5',
  },
});
```

**Responsive Styling**:
```javascript
// ✅ Good - Progressive enhancement
const contentMaxWidth = isWeb ? Math.min(width, 800) : '100%';

// ❌ Bad - Platform-specific branching
const contentMaxWidth = Platform.OS === 'web' ? 800 : width;
```

**Component Design**:
```javascript
// ✅ Good - Flexible components that adapt
<Card maxWidth={isWeb ? 480 : '100%'} />

// ❌ Bad - Separate web/mobile components
{isWeb ? <WebCard /> : <MobileCard />}
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
