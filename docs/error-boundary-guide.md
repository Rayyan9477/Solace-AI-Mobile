# Error Boundary Implementation Guide

## Overview

This project uses React Error Boundaries to catch and handle errors in screen components, providing a better user experience when errors occur. This guide explains how error boundaries work, how to use them, and how to apply them to new screens.

---

## Table of Contents

1. [What Are Error Boundaries?](#what-are-error-boundaries)
2. [Components Available](#components-available)
3. [Current Implementation Status](#current-implementation-status)
4. [How to Apply Error Boundaries](#how-to-apply-error-boundaries)
5. [Migration Scripts](#migration-scripts)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## What Are Error Boundaries?

Error boundaries are React components that:
- **Catch JavaScript errors** anywhere in the component tree below them
- **Log those errors** for debugging
- **Display a fallback UI** instead of crashing the entire app
- **Work only for React components** (not for event handlers, async code, or SSR)

**When errors occur:**
- **Development:** Shows detailed error information with stack traces
- **Production:** Shows user-friendly error message with retry option

---

## Components Available

### 1. `ErrorBoundaryWrapper`

The main error boundary class component.

```tsx
<ErrorBoundaryWrapper
  fallbackComponent={(error, reset) => <CustomFallback />}
  onError={(error, errorInfo) => console.log(error)}
>
  <YourComponent />
</ErrorBoundaryWrapper>
```

**Props:**
- `fallbackComponent?: (error: Error, reset: () => void) => React.ReactElement` - Custom error UI
- `onError?: (error: Error, errorInfo: React.ErrorInfo) => void` - Error callback
- `children: React.ReactNode` - Components to protect

### 2. `ScreenErrorBoundary`

Specialized error boundary for screen-level errors.

```tsx
<ScreenErrorBoundary screenName="Dashboard">
  <DashboardScreen />
</ScreenErrorBoundary>
```

**Props:**
- `screenName: string` - Name of the screen (for logging)
- `children: React.ReactNode` - Screen component

**Features:**
- Automatically includes screen name in error logs
- Screen-specific fallback UI
- Navigation reset functionality
- Automatic error reporting

### 3. `DefaultErrorFallback`

Default fallback UI component displayed when errors occur.

**Features:**
- Error emoji indicator
- User-friendly error message
- Retry button
- Development mode: Shows error details and stack trace
- Production mode: Generic message with support contact info

### 4. `withErrorBoundary` HOC

Higher-Order Component for wrapping individual components.

```tsx
const SafeComponent = withErrorBoundary(MyComponent, {
  fallbackComponent: CustomFallback,
  onError: (error) => console.error(error),
});
```

---

## Current Implementation Status

### ✅ Screens with Error Boundaries (15/90+)

**High-Traffic Screens:**
1. ✅ [DashboardScreen](../src/features/dashboard/DashboardScreen.tsx)
2. ✅ [MoodHistoryScreen](../src/features/mood/screens/MoodHistoryScreen.tsx)
3. ✅ [JournalListScreen](../src/features/journal/screens/JournalListScreen.tsx)
4. ✅ [ChatScreen](../src/features/chat/ChatScreen.tsx)
5. ✅ [AssessmentScreen](../src/features/assessment/screens/AssessmentScreen.tsx)

**Authentication Screens:**
6. ✅ [LoginScreen](../src/features/auth/LoginScreen.tsx)
7. ✅ [SignupScreen](../src/features/auth/SignupScreen.tsx)
8. ✅ [ForgotPasswordScreen](../src/features/auth/ForgotPasswordScreen.tsx)
9. ✅ [SocialLoginScreen](../src/features/auth/screens/SocialLoginScreen.tsx)

**Critical Screens:**
10. ✅ [WelcomeScreen](../src/features/onboarding/screens/WelcomeScreen.tsx)
11. ✅ [SplashScreen](../src/features/onboarding/screens/SplashScreen.tsx)
12. ✅ [CrisisSupportScreen](../src/features/crisis/screens/CrisisSupportScreen.tsx)

**Settings Screens:**
13. ✅ [ProfileSettingsScreen](../src/features/profile/screens/ProfileSettingsScreen.tsx)
14. ✅ [AccountSettingsScreen](../src/features/profile/screens/AccountSettingsScreen.tsx)
15. ✅ [SecuritySettingsScreen](../src/features/profile/screens/SecuritySettingsScreen.tsx)

### ⏳ Remaining Screens (~75)

Use the migration scripts (see below) to apply error boundaries to:
- Community screens (7 screens)
- Mindfulness screens (11 screens)
- Therapy screens (7 screens)
- Search screens (6 screens)
- Wellness screens (7 screens)
- Profile screens (remaining 8 screens)
- Mood tracking screens (remaining 5 screens)
- Journal screens (remaining 4 screens)
- Error screens (6 screens)
- And more...

---

## How to Apply Error Boundaries

### Method 1: Manual Implementation (Recommended for New Screens)

When creating a new screen, wrap it with `ScreenErrorBoundary` from the start:

```tsx
// src/features/my-feature/screens/MyScreen.tsx

import React from 'react';
import { View, Text } from 'react-native';
import { ScreenErrorBoundary } from '@shared/components/ErrorBoundaryWrapper';

// Define your screen component
const MyScreenComponent = ({ navigation, route }) => {
  return (
    <View>
      <Text>My Screen Content</Text>
    </View>
  );
};

// Export wrapped with error boundary
export const MyScreen = (props: any) => (
  <ScreenErrorBoundary screenName="My Screen">
    <MyScreenComponent {...props} />
  </ScreenErrorBoundary>
);

export default MyScreen;
```

### Method 2: Using the HOC

For smaller components or reusable components:

```tsx
import { withErrorBoundary } from '@shared/components/ErrorBoundaryWrapper';

const MyComponent = () => {
  return <View><Text>Component</Text></View>;
};

export default withErrorBoundary(MyComponent);
```

### Method 3: Batch Migration Scripts

For applying error boundaries to multiple existing screens, use the migration scripts.

---

## Migration Scripts

### Script 1: Batch Apply to Critical Screens

Applies error boundaries to a predefined list of critical screens.

**Location:** `src/scripts/applyErrorBoundariesBatch.js`

**Usage:**
```bash
node src/scripts/applyErrorBoundariesBatch.js
```

**What it does:**
- Applies error boundaries to 10-15 critical screens
- Checks if screens already have error boundaries
- Reports success/failure for each screen

**Customize:**
Edit the `CRITICAL_SCREENS` array in the script to add/remove screens:

```javascript
const CRITICAL_SCREENS = [
  'src/features/auth/LoginScreen.tsx',
  'src/features/auth/SignupScreen.tsx',
  // Add your screens here
];
```

### Script 2: Apply to All Screens (Advanced)

Automatically finds and applies error boundaries to ALL screens in the project.

**Location:** `src/scripts/applyErrorBoundaries.ts`

**Usage:**
```bash
npx ts-node src/scripts/applyErrorBoundaries.ts
```

**What it does:**
- Scans all `*Screen.tsx` files in `src/features`
- Checks which screens already have error boundaries
- Applies error boundaries to remaining screens
- Generates a report showing coverage

**Features:**
- Automatic screen name extraction
- Skips screens that already have error boundaries
- Handles different export patterns
- Comprehensive error handling and reporting

**Example Output:**
```
🔍 Finding all screen files...

Found 90 screen files

📊 Status:
  ✅ 15 screens already have error boundaries
  ⏳ 75 screens need error boundaries

🔧 Applying error boundaries to remaining screens...

✅ Applied error boundary to MoodStatsScreen.tsx
✅ Applied error boundary to JournalCreateScreen.tsx
✅ Applied error boundary to TherapyExercisesScreen.tsx
...

✨ Migration Complete!
  ✅ Successfully updated: 73 screens
  ❌ Failed: 2 screens
  📝 Total coverage: 88/90 screens (98%)
```

---

## Best Practices

### 1. **Always Wrap Screen Components**

Every screen component should be wrapped with `ScreenErrorBoundary`:

```tsx
// ✅ Good
export const MyScreen = (props) => (
  <ScreenErrorBoundary screenName="My Screen">
    <MyScreenComponent {...props} />
  </ScreenErrorBoundary>
);

// ❌ Bad - no error boundary
export const MyScreen = (props) => {
  return <MyScreenComponent {...props} />;
};
```

### 2. **Use Descriptive Screen Names**

Screen names should be human-readable and match the screen's purpose:

```tsx
// ✅ Good
<ScreenErrorBoundary screenName="Mood History">

// ❌ Bad
<ScreenErrorBoundary screenName="Screen1">
```

### 3. **Don't Wrap Error Boundaries**

Error boundaries can't catch errors in themselves:

```tsx
// ❌ Bad - error boundary wrapping another error boundary
<ScreenErrorBoundary>
  <ScreenErrorBoundary>
    <Component />
  </ScreenErrorBoundary>
</ScreenErrorBoundary>

// ✅ Good - single error boundary
<ScreenErrorBoundary>
  <Component />
</ScreenErrorBoundary>
```

### 4. **Handle Async Errors Separately**

Error boundaries don't catch:
- Errors in event handlers
- Errors in async code (setTimeout, promises)
- Errors in SSR

For these cases, use try-catch blocks:

```tsx
const handleSubmit = async () => {
  try {
    await submitData();
  } catch (error) {
    logger.error('Submit failed:', error);
    Alert.alert('Error', 'Failed to submit data');
  }
};
```

### 5. **Log Errors for Monitoring**

Always use the logger utility for error logging:

```tsx
import { logger } from '@shared/utils/logger';

const onError = (error: Error, errorInfo: React.ErrorInfo) => {
  logger.error('[ErrorBoundary] Caught error:', error, errorInfo);
};
```

### 6. **Test Error Boundaries**

Create test cases to verify error boundaries work:

```tsx
// Example test
it('should catch errors and show fallback UI', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };

  const { getByText } = render(
    <ScreenErrorBoundary screenName="Test">
      <ThrowError />
    </ScreenErrorBoundary>
  );

  expect(getByText(/something went wrong/i)).toBeInTheDocument();
});
```

---

## Troubleshooting

### Issue: Error Boundary Not Catching Errors

**Possible Causes:**
1. **Async errors:** Error boundaries don't catch errors in async code
2. **Event handlers:** Error boundaries don't catch errors in event handlers
3. **Outside component tree:** Error is thrown outside the error boundary

**Solutions:**
- Use try-catch for async code and event handlers
- Ensure error boundary wraps the component tree
- Check React DevTools for component hierarchy

### Issue: Script Fails to Apply Error Boundary

**Possible Causes:**
1. **Non-standard export pattern:** Script can't find the export statement
2. **Already has error boundary:** Screen already protected
3. **File permissions:** Can't write to file

**Solutions:**
- Manually apply error boundary using Method 1
- Check if screen already has `ScreenErrorBoundary` import
- Verify file permissions

### Issue: Import Path Not Found

**Error:** `Cannot find module '@shared/components/ErrorBoundaryWrapper'`

**Solutions:**
1. Check tsconfig.json paths configuration:
```json
{
  "compilerOptions": {
    "paths": {
      "@shared/*": ["./src/shared/*"]
    }
  }
}
```

2. Verify ErrorBoundaryWrapper.tsx exists at correct path:
```
src/shared/components/ErrorBoundaryWrapper.tsx
```

3. Use relative path if needed:
```tsx
import { ScreenErrorBoundary } from '../../../shared/components/ErrorBoundaryWrapper';
```

### Issue: Props Not Passed to Wrapped Component

**Problem:** Navigation props not working after wrapping

**Solution:** Always spread props when wrapping:

```tsx
// ✅ Correct - props are passed through
export const MyScreen = (props: any) => (
  <ScreenErrorBoundary screenName="My Screen">
    <MyScreenComponent {...props} />
  </ScreenErrorBoundary>
);

// ❌ Wrong - props not passed
export const MyScreen = (props: any) => (
  <ScreenErrorBoundary screenName="My Screen">
    <MyScreenComponent />
  </ScreenErrorBoundary>
);
```

---

## Additional Resources

- [React Error Boundaries Documentation](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [ErrorBoundaryWrapper Source Code](../src/shared/components/ErrorBoundaryWrapper.tsx)
- [Error Boundary Tests](../src/shared/components/__tests__/ErrorBoundaryWrapper.test.tsx)
- [Security Audit Report](./security-audit-report.md)
- [Performance Optimization Guide](./performance-optimization-guide.md)

---

## Summary

**Key Takeaways:**

1. ✅ **All screens should have error boundaries** to prevent full app crashes
2. ✅ **Use `ScreenErrorBoundary`** for screen-level protection
3. ✅ **Use migration scripts** to batch apply to existing screens
4. ✅ **Always wrap new screens** from the start
5. ✅ **Test error boundaries** to ensure they work correctly

**Next Steps:**

1. Run `node src/scripts/applyErrorBoundariesBatch.js` for quick wins
2. Run `npx ts-node src/scripts/applyErrorBoundaries.ts` for full coverage
3. Manually fix any screens that failed automatic migration
4. Add error boundary tests for critical screens
5. Monitor error logs to catch and fix issues early

---

**Report Generated:** January 2025
**Status:** 15/90+ screens protected (17% coverage)
**Goal:** 100% screen coverage
