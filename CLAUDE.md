# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Solace AI Mobile** is a React Native mental health support application built with Expo. The app provides comprehensive mental health tools including mood tracking, AI therapy chat, mindfulness resources, and crisis intervention features. It supports both light and dark themes with therapeutic color palettes.

## Development Commands

### Essential Commands
- **Start development server**: `npm start` or `npx expo start`
- **Web development**: `npm run web` or `npx expo start --web`
- **Build for platforms**:
  - Android: `npm run android`
  - iOS: `npm run ios`

### Testing
- **Run all tests**: `npm test`
- **Test with coverage**: `npm run test:coverage`
- **Test in watch mode**: `npm run test:watch`
- **Update snapshots**: `npm run test:update`
- **CI tests**: `npm run test:ci`

### End-to-End Testing (Playwright)
- **Run E2E tests**: `npm run test:playwright`
- **Debug mode**: `npm run test:playwright:debug`
- **Mobile devices**: `npm run test:playwright:mobile`
- **Frontend tests**: `npm run test:playwright:frontend`
- **Show reports**: `npm run test:playwright:report`

### Code Quality
- **Lint code**: `npm run lint`
- **Fix linting issues**: `npm run lint:fix`

### Development Workflow
- **Full setup**: `npm run setup` (installs dependencies for main app and theme-preview)
- **Concurrent development**: `npm run dev` (runs both main app and theme preview)

## Architecture Overview

### Core Structure

The codebase follows a **feature-based architecture** with shared components following the **Atomic Design Pattern**.

```
src/
├── app/                          # App-level configuration
│   ├── navigation/              # Navigation configuration (AppNavigator.js)
│   ├── providers/               # App-level providers (Redux, Theme)
│   ├── services/                # App-level services (API, auth)
│   └── store/                   # Redux store and slices
│       ├── slices/              # Feature slices (auth, mood, chat, etc.)
│       └── store.js             # Store configuration with persistence
│
├── features/                     # Feature-based modules (Domain logic)
│   ├── auth/                    # Authentication feature
│   │   ├── screens/             # LoginScreen, SignupScreen
│   │   └── services/            # Auth-specific services
│   ├── mood/                    # Mood tracking feature
│   │   ├── components/          # MoodSelector, IntensitySlider
│   │   └── screens/             # MoodScreen
│   ├── chat/                    # AI therapy chat feature
│   ├── assessment/              # Mental health assessments
│   ├── crisis/                  # Crisis intervention (consolidated)
│   ├── wellness/                # Wellness and mindfulness
│   ├── profile/                 # User profile management
│   ├── dashboard/               # Main dashboard
│   │   ├── components/          # QuickActions, MoodCheckIn
│   │   └── screens/             # MainAppScreen
│   └── onboarding/              # User onboarding flow
│
├── shared/                       # Shared across all features
│   ├── components/              # Shared UI components (Atomic Design)
│   │   ├── atoms/               # Basic components (Button, Input, etc.)
│   │   ├── molecules/           # Component combinations (Card, Modal)
│   │   ├── organisms/           # Complex components (Layout, Navigation)
│   │   └── forms/               # Form components
│   ├── hooks/                   # Custom React hooks
│   ├── utils/                   # Utility functions
│   ├── services/                # Shared services (API, storage, tokens)
│   ├── config/                  # App configuration
│   ├── constants/               # App constants
│   ├── theme/                   # Theme system (UnifiedThemeProvider)
│   ├── types/                   # TypeScript types/interfaces
│   └── assets/                  # Static assets (images, fonts)
│
└── components/                   # Legacy - being migrated to features/shared
```

### Import Aliases (Babel Configuration)

Use these aliases for cleaner imports:

- `@app/*` → `src/app/*`
- `@features/*` → `src/features/*`
- `@shared/*` → `src/shared/*`
- `@components/*` → `src/shared/components/*`
- `@theme/*` → `src/shared/theme/*`
- `@utils/*` → `src/shared/utils/*`

Example:
```javascript
// Instead of: import { Button } from '../../../shared/components/atoms/Button'
import { Button } from '@shared/components/atoms/Button';

// Instead of: import { useAuth } from '../../hooks/useAuth'
import { useAuth } from '@shared/hooks/useAuth';
```

### Key Architectural Patterns

**Theme System**: Uses `UnifiedThemeProvider` for consistent theming across light/dark modes with therapeutic color palettes optimized for mental health applications.

**State Management**: Redux Toolkit with Redux Persist for client-side state. Auth state, user data, and mood tracking are persisted to AsyncStorage.

**Navigation**: React Navigation v6 with stack and tab navigators. Theme-aware screen selection using `getThemeAwareScreen()` helper function.

**Error Handling**: Comprehensive error boundaries at multiple levels including `AppErrorBoundary` and `NavigationErrorBoundary`.

**Initialization**: Progressive app initialization with `useAppInitialization` hook handling loading states, error recovery, and emergency fallbacks.

## Key Components to Understand

### RefactoredAppProvider (`src/components/RefactoredAppProvider.js`)
- Central provider orchestrating theme, performance, accessibility, and mental health contexts
- Handles app initialization states and error boundaries
- Contains emergency support features for crisis situations

### AppNavigator (`src/navigation/AppNavigator.js`)
- Main navigation logic with authentication-based routing
- Theme-aware screen rendering with fallbacks
- Comprehensive accessibility labels for screen readers

### UnifiedThemeProvider (`src/shared/theme/UnifiedThemeProvider.js`)
- Manages light/dark theme switching
- Provides therapeutic color palettes
- Handles system theme detection and persistence

### Store Configuration (`src/store/store.js`)
- Redux Toolkit setup with persistence
- Includes slices for auth, mood, chat, assessment, and therapy
- Configured with proper serialization handling

## Mental Health App Specific Features

**Crisis Intervention**: The app includes crisis detection and intervention features. Always handle mental health content sensitively and ensure emergency resources remain accessible.

**Therapeutic Colors**: Both light and dark themes use carefully selected color palettes optimized for mental wellness. Maintain these color choices when modifying UI.

**Accessibility**: Enhanced accessibility features including screen reader support, reduced motion options, and high contrast modes. Always test accessibility when making UI changes.

**Performance**: Optimized for mental health use cases with performance monitoring and memory optimization to ensure smooth user experience during emotional moments.

## Development Notes

### Platform Compatibility
- **Web Support**: Fully configured for web deployment via Expo
- **Mobile**: iOS and Android support with platform-specific optimizations
- **React Native Version**: 0.76.9 with Expo SDK ~52.0.0

### Testing Strategy
- **Unit Tests**: Jest with React Native Testing Library
- **E2E Tests**: Playwright with comprehensive device matrix
- **Accessibility Tests**: Built into Jest setup with screen reader simulation
- **Crisis Scenario Testing**: Specialized mocks for crisis intervention features

### Global Polyfills
The app includes global polyfills for the `compact` function to handle array filtering. These are defined in `App.js` and are critical for app functionality.

### State Persistence
- **Auth State**: Persisted with timeout protection to prevent hanging
- **Theme Preferences**: Saved across sessions
- **Mood Data**: Encrypted storage using Expo SecureStore

### Performance Considerations
- **Bundle Optimization**: Metro configuration optimized for web and mobile
- **Lazy Loading**: Components are progressively loaded to improve startup time
- **Error Recovery**: Multiple fallback strategies to prevent app crashes

## Common Development Patterns

When working on this codebase:

1. **Theme Usage**: Always use the `useTheme()` hook for consistent styling
2. **Navigation**: Use theme-aware screen selection for consistent UX
3. **State Management**: Follow Redux Toolkit patterns with proper typing
4. **Error Boundaries**: Wrap new features in appropriate error boundaries
5. **Accessibility**: Include proper accessibility props for all interactive elements
6. **Testing**: Write tests for both happy path and crisis scenarios

## Security Notes

- **Sensitive Data**: Uses Expo SecureStore for sensitive information
- **API Security**: Proper token handling in auth slice
- **Crisis Safety**: Emergency features remain functional even during app errors