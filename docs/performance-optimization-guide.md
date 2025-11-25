# Performance Optimization Guide
**Solace AI Mobile Application**
**Date:** January 2025

---

## Overview

This guide provides comprehensive strategies and utilities for optimizing the performance of the Solace AI Mobile application. The utilities created enable monitoring, profiling, and optimization of React Native performance.

---

## Performance Utilities Created

### 1. Performance Monitoring & Profiling
**File:** [src/shared/utils/performance.ts](../src/shared/utils/performance.ts)

#### useRenderPerformance
Monitors component render performance and logs warnings for slow or frequent renders.

```typescript
import { useRenderPerformance } from '@shared/utils/performance';

function MyComponent() {
  // Monitor renders, warn if > 16ms (60fps threshold)
  useRenderPerformance('MyComponent', 16);

  return <View>...</View>;
}
```

**Benefits:**
- Identifies performance bottlenecks
- Tracks slow renders (> 16ms for 60fps)
- Monitors excessive re-renders
- Provides average render time metrics

#### useWhyDidYouUpdate
Debug tool to track why a component re-rendered.

```typescript
import { useWhyDidYouUpdate } from '@shared/utils/performance';

function MyComponent(props) {
  useWhyDidYouUpdate('MyComponent', props);

  // See which props changed in console
  return <View>...</View>;
}
```

**Benefits:**
- Identifies unnecessary re-renders
- Shows which props changed
- Helps optimize React.memo dependencies

---

### 2. Memoization & Optimization Hooks

#### useTrackedMemo
Enhanced `useMemo` with performance tracking.

```typescript
import { useTrackedMemo } from '@shared/utils/performance';

function MyComponent() {
  const expensiveResult = useTrackedMemo(
    () => expensiveComputation(),
    [dependency],
    'expensiveComputation' // Name for logging
  );

  return <View>{expensiveResult}</View>;
}
```

**When to use:**
- Complex calculations
- Data transformations
- Filtering/sorting large arrays
- Object/array creation in render

#### useTrackedCallback
Enhanced `useCallback` with performance tracking.

```typescript
import { useTrackedCallback } from '@shared/utils/performance';

function MyComponent() {
  const handlePress = useTrackedCallback(
    () => {
      // Handle press
    },
    [dependency],
    'handlePress'
  );

  return <Button onPress={handlePress} />;
}
```

**When to use:**
- Event handlers passed to child components
- Callbacks in `useEffect` dependencies
- Functions passed to memoized components

---

### 3. Debouncing & Throttling

#### useDebounce
Delays function execution until after wait time.

```typescript
import { useDebounce } from '@shared/utils/performance';

function SearchInput() {
  const debouncedSearch = useDebounce(
    (query: string) => {
      // Perform search
      searchAPI(query);
    },
    300 // Wait 300ms after last input
  );

  return (
    <TextInput
      onChangeText={debouncedSearch}
      placeholder="Search..."
    />
  );
}
```

**Use cases:**
- Search inputs
- Auto-save forms
- Window resize handlers
- Text input validation

#### useThrottle
Limits function execution to once per time period.

```typescript
import { useThrottle } from '@shared/utils/performance';

function ScrollHandler() {
  const throttledScroll = useThrottle(
    (event) => {
      // Handle scroll
      updateScrollPosition(event);
    },
    100 // Execute max once per 100ms
  );

  return (
    <ScrollView onScroll={throttledScroll}>
      {/* Content */}
    </ScrollView>
  );
}
```

**Use cases:**
- Scroll handlers
- Mouse move events
- API rate limiting
- Animation frame callbacks

---

### 4. Interaction Manager Integration

#### useAfterInteractions
Defer expensive operations until animations complete.

```typescript
import { useAfterInteractions } from '@shared/utils/performance';

function ExpensiveComponent() {
  const [data, setData] = useState(null);

  useAfterInteractions(() => {
    // Load heavy data after interactions
    loadHeavyData().then(setData);
  }, []);

  return data ? <DataView data={data} /> : <Loading />;
}
```

**Benefits:**
- Improves perceived performance
- Prevents UI jank during animations
- Better user experience during navigation

#### useLazyRender
Only render heavy components when visible.

```typescript
import { useLazyRender } from '@shared/utils/performance';

function HeavyComponent({ visible }) {
  const shouldRender = useLazyRender(visible);

  if (!shouldRender) {
    return <Placeholder />;
  }

  return <ExpensiveComponent />;
}
```

**Use cases:**
- Tab content
- Modal/drawer content
- Below-the-fold content
- Conditional heavy components

---

### 5. FlatList Optimization

#### useFlatListOptimization
Optimized props for better FlatList performance.

```typescript
import { useFlatListOptimization } from '@shared/utils/performance';

function MyList() {
  const listOptimization = useFlatListOptimization(80); // 80px item height

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      {...listOptimization}
    />
  );
}
```

**Optimizations included:**
- `removeClippedSubviews: true`
- `maxToRenderPerBatch: 10`
- `updateCellsBatchingPeriod: 50`
- `windowSize: 5`
- Optimized `initialNumToRender`
- `getItemLayout` for fixed height items
- Optimized `keyExtractor`

---

### 6. Memory Monitoring

#### useMemoryMonitor
Track memory usage during development.

```typescript
import { useMemoryMonitor } from '@shared/utils/performance';

function LargeDataComponent() {
  useMemoryMonitor('LargeDataComponent', 5000); // Check every 5s

  // Warns if memory usage > 90%
  return <View>...</View>;
}
```

**Benefits:**
- Detects memory leaks
- Warns about high memory usage
- Development-only monitoring

---

## Caching System

### File: [src/shared/utils/cache.ts](../src/shared/utils/cache.ts)

### Features

1. **In-Memory Caching** with TTL (Time To Live)
2. **LRU Eviction** (Least Recently Used)
3. **AsyncStorage Persistence**
4. **Automatic Pruning** of expired entries
5. **Cache Statistics** (hits, misses, hit rate)

### Global Cache Instances

#### 1. API Cache
**TTL:** 5 minutes
**Max Size:** 50 entries
**Persisted:** Yes

```typescript
import { apiCache } from '@shared/utils/cache';

// Store API response
apiCache.set('dashboard-data', dashboardData);

// Retrieve cached data
const cached = apiCache.get('dashboard-data');
if (cached) {
  setData(cached);
} else {
  const fresh = await fetchDashboard();
  apiCache.set('dashboard-data', fresh);
  setData(fresh);
}
```

#### 2. Asset Cache
**TTL:** 30 minutes
**Max Size:** 100 entries
**Persisted:** Yes

```typescript
import { assetCache } from '@shared/utils/cache';

// Cache images, icons, static assets
assetCache.set('icon-happy', iconData);
```

#### 3. User Data Cache
**TTL:** 15 minutes
**Max Size:** 20 entries
**Persisted:** Yes

```typescript
import { userDataCache } from '@shared/utils/cache';

// Cache user profile, preferences
userDataCache.set('user-profile', profileData);
```

#### 4. Component Cache
**TTL:** None (manual management)
**Max Size:** 50 entries
**Persisted:** No

```typescript
import { componentCache } from '@shared/utils/cache';

// Cache computed values within components
componentCache.set('computed-result', result);
```

### Cache Methods

```typescript
// Set value
cache.set(key, data, customTtl);

// Get value
const data = cache.get(key);

// Check existence
if (cache.has(key)) { ... }

// Delete specific key
cache.delete(key);

// Clear all
cache.clear();

// Get statistics
const stats = cache.getStats();
// { size, hits, misses, hitRate, evictions }

// Remove expired entries
cache.prune();
```

### Memoization Helpers

#### memoizeAsync
Memoize async functions with caching.

```typescript
import { memoizeAsync, apiCache } from '@shared/utils/cache';

const fetchUserData = memoizeAsync(
  async (userId: string) => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  },
  apiCache,
  (userId) => `user-${userId}` // Key generator
);

// First call: fetches from API
const user1 = await fetchUserData('123');

// Second call: returns from cache
const user2 = await fetchUserData('123');
```

#### memoizeSync
Memoize synchronous functions with caching.

```typescript
import { memoizeSync, componentCache } from '@shared/utils/cache';

const complexCalculation = memoizeSync(
  (input: number) => {
    // Expensive computation
    return result;
  },
  componentCache
);

// Cached on subsequent calls
const result = complexCalculation(42);
```

---

## Performance Best Practices

### 1. Component Optimization

#### Use React.memo for Pure Components

```typescript
import React, { memo } from 'react';

// Before
export const MyComponent = ({ data }) => {
  return <View>{data}</View>;
};

// After
export const MyComponent = memo(({ data }) => {
  return <View>{data}</View>;
}, (prevProps, nextProps) => {
  // Return true if props are equal (skip render)
  return prevProps.data === nextProps.data;
});
```

#### Memoize Expensive Computations

```typescript
import { useMemo } from 'react';

function DataList({ items }) {
  // Bad: Computed on every render
  const sortedItems = items.sort((a, b) => a.date - b.date);

  // Good: Only recomputed when items change
  const sortedItems = useMemo(
    () => items.sort((a, b) => a.date - b.date),
    [items]
  );

  return <List data={sortedItems} />;
}
```

#### Memoize Callbacks

```typescript
import { useCallback } from 'react';

function Parent() {
  // Bad: New function on every render
  const handleClick = () => console.log('clicked');

  // Good: Same function reference
  const handleClick = useCallback(
    () => console.log('clicked'),
    []
  );

  return <ChildComponent onClick={handleClick} />;
}
```

### 2. List Optimization

#### Use FlatList Properly

```typescript
import { FlatList } from 'react-native';

<FlatList
  data={items}
  renderItem={renderItem}
  // Performance props
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  initialNumToRender={10}
  windowSize={5}
  // Key extraction
  keyExtractor={(item) => item.id}
  // Fixed height optimization
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

#### Extract renderItem to Memoized Component

```typescript
// Bad: Creates new component on every render
<FlatList
  renderItem={({ item }) => <View>{item.name}</View>}
/>

// Good: Memoized component
const ListItem = memo(({ item }) => <View>{item.name}</View>);

<FlatList
  renderItem={({ item }) => <ListItem item={item} />}
/>
```

### 3. Image Optimization

```typescript
import { Image } from 'react-native';

<Image
  source={{ uri: imageUrl }}
  // Resize Mode
  resizeMode="cover"
  // Cache Control
  cache="force-cache"
  // Fade Duration
  fadeDuration={300}
/>
```

### 4. Navigation Optimization

```typescript
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

<Stack.Navigator
  // Optimize screen transitions
  screenOptions={{
    // Lazy load screens
    lazy: true,
    // Detach inactive screens
    detachInactiveScreens: true,
    // Freeze inactive screens
    freezeOnBlur: true,
  }}
>
  <Stack.Screen name="Home" component={HomeScreen} />
</Stack.Navigator>
```

### 5. Bundle Size Optimization

#### Use Dynamic Imports

```typescript
// Before: All imported upfront
import HeavyComponent from './HeavyComponent';

// After: Lazy loaded
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

function MyScreen() {
  return (
    <React.Suspense fallback={<Loading />}>
      <HeavyComponent />
    </React.Suspense>
  );
}
```

#### Tree Shaking

```typescript
// Bad: Imports entire library
import _ from 'lodash';

// Good: Imports only what's needed
import debounce from 'lodash/debounce';
```

### 6. State Management Optimization

#### Use Selectors with Memoization

```typescript
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

// Memoized selector
const selectUserData = createSelector(
  (state) => state.user,
  (state) => state.profile,
  (user, profile) => ({ user, profile })
);

function MyComponent() {
  // Only re-renders when selector result changes
  const { user, profile } = useSelector(selectUserData);

  return <View>...</View>;
}
```

---

## Performance Checklist

### Component Level
- [ ] Use `React.memo` for pure components
- [ ] Memoize expensive computations with `useMemo`
- [ ] Memoize callbacks with `useCallback`
- [ ] Avoid inline functions and objects in JSX
- [ ] Use `useRenderPerformance` to monitor renders
- [ ] Implement `useWhyDidYouUpdate` during debugging

### List Components
- [ ] Use `FlatList` instead of `ScrollView` for long lists
- [ ] Implement `getItemLayout` for fixed-height items
- [ ] Use `removeClippedSubviews`
- [ ] Optimize `windowSize` and `maxToRenderPerBatch`
- [ ] Extract `renderItem` to memoized component
- [ ] Use proper `keyExtractor`

### Data & API
- [ ] Implement caching for API responses
- [ ] Use `memoizeAsync` for repeated API calls
- [ ] Debounce search/filter inputs
- [ ] Throttle scroll/resize handlers
- [ ] Implement pagination for large datasets
- [ ] Use `useAfterInteractions` for non-critical data

### Images & Assets
- [ ] Optimize image sizes
- [ ] Use appropriate image formats (WebP)
- [ ] Implement lazy loading for below-fold images
- [ ] Cache images with `assetCache`
- [ ] Use `resizeMode` appropriately

### Navigation
- [ ] Enable lazy loading for screens
- [ ] Use `detachInactiveScreens`
- [ ] Implement `freezeOnBlur`
- [ ] Preload critical screens
- [ ] Use deep linking efficiently

### Bundle Size
- [ ] Implement code splitting
- [ ] Use dynamic imports for heavy libraries
- [ ] Enable tree shaking
- [ ] Remove unused dependencies
- [ ] Analyze bundle with `react-native-bundle-visualizer`

---

## Performance Monitoring

### Development Tools

1. **React DevTools Profiler**
   - Record component renders
   - Identify slow components
   - Analyze re-render causes

2. **Flipper**
   - Network inspection
   - Layout inspector
   - Performance monitoring
   - Redux DevTools integration

3. **Custom Hooks**
   - `useRenderPerformance`
   - `useWhyDidYouUpdate`
   - `useMemoryMonitor`

### Production Monitoring

1. **Cache Statistics**
```typescript
import { getAllCacheStats } from '@shared/utils/cache';

// Get stats for all caches
const stats = getAllCacheStats();
console.log('API Cache Hit Rate:', stats.api.hitRate);
```

2. **Performance Metrics**
- Track app startup time
- Monitor frame rate
- Measure API response times
- Track cache hit rates

---

## Common Performance Pitfalls

### 1. Creating Objects/Arrays in Render
```typescript
// Bad
<Component style={{ margin: 10 }} />
<Component items={[1, 2, 3]} />

// Good
const style = { margin: 10 };
const items = [1, 2, 3];
<Component style={style} />
<Component items={items} />
```

### 2. Inline Functions in Lists
```typescript
// Bad
<FlatList renderItem={({ item }) => (
  <TouchableOpacity onPress={() => handlePress(item)}>
    {item.name}
  </TouchableOpacity>
)} />

// Good
const ListItem = memo(({ item, onPress }) => (
  <TouchableOpacity onPress={() => onPress(item)}>
    {item.name}
  </TouchableOpacity>
));

<FlatList renderItem={({ item }) => (
  <ListItem item={item} onPress={handlePress} />
)} />
```

### 3. Large State Objects
```typescript
// Bad: Single large state object
const [state, setState] = useState({
  user: {},
  profile: {},
  settings: {},
  data: []
});

// Good: Split into multiple states
const [user, setUser] = useState({});
const [profile, setProfile] = useState({});
const [settings, setSettings] = useState({});
const [data, setData] = useState([]);
```

### 4. Unnecessary useEffect
```typescript
// Bad
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

// Good
const fullName = useMemo(
  () => `${firstName} ${lastName}`,
  [firstName, lastName]
);
```

---

## Performance Metrics Target

| Metric | Target | Tool |
|--------|--------|------|
| Time to Interactive | < 2s | Flipper |
| Frame Rate | 60 FPS | React DevTools |
| API Response Cache Hit | > 80% | Cache Stats |
| Slow Renders (>16ms) | < 5% | useRenderPerformance |
| Bundle Size | < 10MB | Bundle Analyzer |
| Memory Usage | < 200MB | Chrome DevTools |

---

## Next Steps

1. **Apply to Dashboard** - Optimize DashboardScreen with memoization
2. **List Optimization** - Apply to JournalListScreen, MoodHistoryScreen
3. **API Integration** - Use caching for all API calls
4. **Component Audit** - Add React.memo to pure components
5. **Bundle Analysis** - Identify and remove unnecessary dependencies

---

## References

- [React Native Performance](https://reactnative.dev/docs/performance)
- [React Optimization Techniques](https://react.dev/reference/react/memo)
- [Flipper Debugging](https://fbflipper.com/)
- [JavaScript Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)

**Document Version:** 1.0
**Last Updated:** January 2025
