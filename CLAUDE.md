# 🤖 CLAUDE.md - AI Development Assistant Guide

This file provides guidance to Claude Code and AI assistants when working with code in this repository.

## Quick Links to Documentation

> **Start here**: Read these documents to understand the project

- 📖 **[README.md](./README.md)** - Project overview, quick start, features
- 📋 **[PROJECT.md](./PROJECT.md)** - Complete project guide with structure and setup
- 🏗️ **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Deep dive into system design and patterns
- 🎨 **[DESIGN_GUIDE.md](./DESIGN_GUIDE.md)** - Design system, UI components, accessibility
- 👥 **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Development standards, coding conventions, testing

## Project Overview

**Solace AI Mobile** is a React Native mental health support application built with Expo. The app provides comprehensive mental health tools including:

- 🤖 AI therapy chat with emotional intelligence
- 📊 Mood tracking with analytics
- 🧘 Mindfulness and wellness features
- 📝 Secure mental health journaling
- 🆘 Crisis intervention and support
- 👥 Community support features
- 📈 Mental health assessments
- 🌓 Light/dark therapeutic themes
- ♿ Full accessibility support

**Production Ready**: 519/548 tests passing (94.7%)

## Development Commands

**See [PROJECT.md](./PROJECT.md) for complete command reference**

### Essential Commands
```bash
npm start                    # Start Expo development server
npm run web                  # Web development
npm run dev                  # Main app + theme preview (concurrent)
npm run setup               # Full setup including dependencies
```

### Testing
```bash
npm test                     # Run all tests
npm run test:ci              # CI with coverage
npm run test:playwright      # E2E tests
npm run lint:fix             # Fix linting issues
```

---

## Architecture Quick Reference

**See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation**

### Directory Structure

```
src/
├── app/                    # App-level (navigation, providers, store)
├── features/               # Feature modules (mood, chat, auth, etc.)
│   ├── mood/              # Complete mood feature
│   ├── chat/              # AI therapy chat
│   ├── assessment/        # Assessments
│   └── ...
├── shared/                # Shared (components, theme, utils)
│   ├── components/        # UI components (Atomic Design)
│   ├── theme/             # Theme system
│   ├── hooks/             # Custom hooks
│   └── utils/             # Utilities
└── ...
```

### State Management (Redux)

- **Location**: `src/app/store/`
- **Pattern**: Redux Toolkit with Redux Persist
- **Slices**: auth, mood, chat, assessment, theme
- **Storage**: AsyncStorage (persisted)

### Navigation

- **Main Config**: `src/app/navigation/AppNavigator.js`
- **Auth Stack**: SignIn → SignUp
- **App Stack**: MainTabs (Dashboard, Mood, Chat, etc.)
- **Modals**: Crisis, Settings, Journal (overlays)

### Theme System

- **Provider**: `src/shared/theme/UnifiedThemeProvider.js`
- **Themes**: Light (bright) and Dark (therapeutic brown)
- **Colors**: Therapeutic palettes optimized for mental wellness
- **Usage**: `import { useTheme } from '@theme/ThemeProvider'`

---

## Import Aliases

Always use aliases for cleaner imports:

```javascript
import { Button } from '@components/atoms/Button';           // ✅ Good
import { useTheme } from '@theme/ThemeProvider';            // ✅ Good
import { saveMood } from '@app/store/slices/moodSlice';     // ✅ Good
import { formatDate } from '@utils/dateUtils';              // ✅ Good

import { Button } from '../../../shared/components/atoms/Button'; // ❌ Avoid
```

**Aliases configured in `babel.config.js`**:

| Alias | Maps To |
|-------|---------|
| `@app/*` | `src/app/*` |
| `@features/*` | `src/features/*` |
| `@shared/*` | `src/shared/*` |
| `@components/*` | `src/shared/components/*` |
| `@theme/*` | `src/shared/theme/*` |
| `@utils/*` | `src/shared/utils/*` |

---

## Key Locations

| What | Location |
|------|----------|
| **Navigation Config** | `src/app/navigation/AppNavigator.js` |
| **Redux Store** | `src/app/store/store.js` |
| **Main Providers** | `src/app/providers/RefactoredAppProvider.js` |
| **Theme System** | `src/shared/theme/UnifiedThemeProvider.js` |
| **Shared Components** | `src/shared/components/` (atoms, molecules, organisms) |
| **Feature Screens** | `src/features/{featureName}/screens/` |
| **Feature Components** | `src/features/{featureName}/components/` |
| **Entry Point** | `App.js` |

---

## Mental Health Considerations

### When Working on Features

- 🤝 **Sensitivity**: Always consider users may be in distress
- 🚨 **Crisis Safety**: Ensure crisis features work even if app fails
- 📖 **Therapeutic Accuracy**: Consult mental health principles
- ♿ **Accessibility**: Mental health users may have access needs
- 🔒 **Privacy**: Treat all user data with utmost confidentiality

### Critical Features

**Crisis Intervention**:
- Always keep emergency resources accessible
- Test thoroughly - this code can save lives
- Never disable or hide crisis features
- Ensure works even during app errors

**Mood Tracking**:
- Validate mood data thoroughly
- Consider tracking user's emotional vulnerability
- Provide compassionate error messages
- Store securely with encryption

---

## Common Development Patterns

### Using Theme

```javascript
import { useTheme } from '@theme/ThemeProvider';

export const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.surface }}>
      <Text style={{ color: theme.colors.text }}>Content</Text>
    </View>
  );
};
```

### Redux State Management

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { saveMood } from '@app/store/slices/moodSlice';

export const MoodScreen = () => {
  const dispatch = useDispatch();
  const moods = useSelector(state => state.mood.entries);
  
  const handleSaveMood = (mood) => {
    dispatch(saveMood(mood));
  };
  
  return <MoodTracker moods={moods} onSave={handleSaveMood} />;
};
```

### Navigation

```javascript
import { useNavigation } from '@react-navigation/native';

export const MoodCard = ({ mood }) => {
  const navigation = useNavigation();
  
  const handlePress = () => {
    navigation.navigate('MoodDetail', { moodId: mood.id });
  };
  
  return <TouchableOpacity onPress={handlePress}><Text>{mood.name}</Text></TouchableOpacity>;
};
```

### Feature Services

```javascript
// src/features/mood/services/moodService.js
export const moodService = {
  async fetchMoodHistory(userId) {
    return await apiService.get(`/users/${userId}/moods`);
  },
  
  async saveMood(mood) {
    return await apiService.post('/moods', mood);
  }
};

// Usage in component
import { moodService } from '@features/mood/services/moodService';

const moods = await moodService.fetchMoodHistory(userId);
```

---

## Testing Guidelines

### Unit Test Example

```javascript
describe('MoodCard', () => {
  it('renders mood name', () => {
    const { getByText } = render(
      <MoodCard mood={{ name: 'Happy' }} onPress={() => {}} />
    );
    expect(getByText('Happy')).toBeTruthy();
  });
});
```

### Integration Test Example

```javascript
describe('Mood Workflow', () => {
  it('saves mood and updates history', async () => {
    const { getByRole } = render(
      <ReduxProvider store={store}>
        <MoodTracker />
      </ReduxProvider>
    );
    
    fireEvent.press(getByRole('button', { name: /happy/i }));
    
    await waitFor(() => {
      expect(store.getState().mood.currentMood).toBe('happy');
    });
  });
});
```

---

## Code Standards

**See [CONTRIBUTING.md](./CONTRIBUTING.md) for complete coding standards**

### Functional Components Only

```javascript
// ✅ Good
export const MoodCard = ({ mood, onPress }) => {
  const [selected, setSelected] = useState(false);
  const theme = useTheme();
  
  return (
    <TouchableOpacity
      accessible
      accessibilityLabel={`Select ${mood.name}`}
      accessibilityRole="button"
      onPress={onPress}
    >
      <Text>{mood.name}</Text>
    </TouchableOpacity>
  );
};
```

### Accessibility

```javascript
// ✅ Always include accessibility attributes
<TouchableOpacity
  accessible
  accessibilityLabel="Select mood"
  accessibilityRole="button"
  accessibilityState={{ disabled: false }}
  onPress={handlePress}
>
  <Text>Select Mood</Text>
</TouchableOpacity>
```

### Documentation

```javascript
/**
 * MoodCard component for mood selection
 * @component
 * @param {Mood} mood - The mood object
 * @param {Function} onPress - Callback when mood selected
 * @returns {JSX.Element}
 */
export const MoodCard = ({ mood, onPress }) => {
  // Implementation
};
```

---

## Useful Resources

| Resource | Link |
|----------|------|
| **React Native Docs** | https://reactnative.dev/docs/getting-started |
| **Expo Docs** | https://docs.expo.dev/ |
| **React Navigation** | https://reactnavigation.org/ |
| **Redux Toolkit** | https://redux-toolkit.js.org/ |
| **React Native Paper** | https://reactnativepaper.com/ |
| **Project Docs** | See [PROJECT.md](./PROJECT.md), [ARCHITECTURE.md](./ARCHITECTURE.md) |

---

## Quick Troubleshooting

### Metro Issues
```bash
npm start -- --reset-cache    # Clear Metro cache
```

### Dependency Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### Test Issues
```bash
npm test -- --clearCache     # Clear Jest cache
npm test -- --watchAll=false # Run tests once
```

### Build Issues
```bash
npm run expo:install          # Reinstall Expo modules
npm run prebuild              # Prebuild native modules
```

---

## Performance Notes

- **Bundle Optimization**: Metro optimized for web and mobile
- **Lazy Loading**: Components progressively loaded
- **Error Recovery**: Multiple fallback strategies
- **Accessibility**: Built-in screen reader support
- **State Persistence**: AsyncStorage for auth/mood/theme

---

## Security Notes

- 🔐 **Token Management**: Secure storage with Expo SecureStore
- 🔒 **API Security**: Bearer token in Authorization header
- 🛡️ **Encryption**: Crypto-JS for sensitive data
- ⚠️ **Crisis Safety**: Emergency features always functional
- 🚨 **Error Handling**: Never expose sensitive info in errors

---

**Last Updated**: October 2025 | **For Complete Guidance**: See project documentation