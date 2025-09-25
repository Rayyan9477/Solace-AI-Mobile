# Solace AI Mobile - Source Code Architecture

This document outlines the reorganized file structure following React Native best practices and feature-based architecture principles.

## 📁 Directory Structure

```
src/
├── app/                          # App-level configuration and providers
│   ├── navigation/              # Navigation configuration
│   │   └── AppNavigator.js     # Main app navigator
│   ├── providers/              # App-wide context providers
│   │   ├── AppProvider.js      # Main app provider with all contexts
│   │   └── RefactoredAppProvider.js # Enhanced app provider
│   └── store/                  # Redux store configuration
│       ├── store.js           # Main store setup
│       └── slices/            # Remaining global slices
│
├── core/                        # Core utilities and shared logic
│   ├── config/                 # App configuration files
│   ├── constants/              # App-wide constants
│   ├── hooks/                  # Shared custom hooks
│   ├── services/               # API services and external integrations
│   └── utils/                  # Utility functions and helpers
│       └── shared/             # Shared utilities (legacy structure)
│
├── features/                    # Feature-based modules
│   ├── auth/                   # Authentication feature
│   │   ├── components/         # Auth-specific components
│   │   ├── screens/           # Auth screens (Login, Signup, etc.)
│   │   ├── store/             # Auth state management
│   │   │   └── authSlice.js   # Auth Redux slice
│   │   └── index.js           # Auth feature exports
│   │
│   ├── dashboard/              # Dashboard feature
│   │   ├── components/        # Dashboard components
│   │   ├── screens/           # Dashboard screens
│   │   └── index.js           # Dashboard feature exports
│   │
│   ├── mood/                   # Mood tracking feature
│   │   ├── components/        # Mood tracking components
│   │   ├── screens/           # Mood tracking screens
│   │   ├── store/             # Mood state management
│   │   │   └── moodSlice.js   # Mood Redux slice
│   │   └── index.js           # Mood feature exports
│   │
│   ├── chat/                   # AI Chat feature
│   │   ├── components/        # Chat components
│   │   ├── screens/           # Chat screens
│   │   ├── store/             # Chat state management
│   │   │   └── chatSlice.js   # Chat Redux slice
│   │   └── index.js           # Chat feature exports
│   │
│   ├── therapy/                # Therapy sessions feature
│   ├── assessment/             # Mental health assessments
│   ├── profile/               # User profile management
│   ├── onboarding/            # App onboarding flow
│   └── wellness/              # Wellness and mindfulness features
│
└── ui/                         # UI System (Design System)
    ├── components/             # UI Components (Atomic Design)
    │   ├── atoms/             # Basic building blocks
    │   │   ├── TherapeuticButton.js    # Mental health focused buttons
    │   │   ├── Checkbox.js            # Form elements
    │   │   ├── DarkModeToggle.js      # Theme switching
    │   │   ├── ErrorBoundary.js       # Error handling
    │   │   ├── GradientBackground.js  # Background components
    │   │   └── index.js               # Atoms exports
    │   │
    │   ├── molecules/         # Simple combinations
    │   │   ├── MentalHealthCard.js    # Therapeutic card components
    │   │   ├── LoadingScreen.js       # Loading states
    │   │   ├── Modal.js               # Modal dialogs
    │   │   ├── Table.js               # Data display
    │   │   └── index.js               # Molecules exports
    │   │
    │   ├── organisms/         # Complex components
    │   │   └── Layout.js              # Layout components
    │   │
    │   └── index.js          # All components exports
    │
    ├── theme/                 # Theme system
    │   ├── ThemeProvider.js   # Theme context provider
    │   ├── MaterialTheme.js   # Therapeutic color themes
    │   └── index.js           # Theme exports
    │
    ├── animations/            # Animation system
    │   └── TherapeuticAnimations.js   # Mental health focused animations
    │
    ├── assets/               # Static assets
    │   ├── icons/            # Icon components and assets
    │   ├── backgrounds/      # Background assets
    │   └── shaders/          # Shader effects
    │
    ├── types/                # TypeScript type definitions
    └── index.js              # Main UI system export
```

## 🏗️ Architecture Principles

### 1. Feature-Based Organization
- Each major feature (auth, mood, chat, etc.) is self-contained
- Features include their own components, screens, and state management
- Easy to scale and maintain individual features independently

### 2. Atomic Design System
- **Atoms**: Basic UI elements (buttons, inputs, etc.)
- **Molecules**: Simple combinations of atoms (cards, forms, etc.)
- **Organisms**: Complex UI sections (layouts, navigation, etc.)

### 3. Separation of Concerns
- **App Level**: Global providers, navigation, store configuration
- **Core**: Shared utilities, services, and configurations
- **Features**: Business logic organized by domain
- **UI**: Design system and reusable components

### 4. Mental Health Focus
- Therapeutic color palettes and design patterns
- Accessibility-first approach for users with mental health conditions
- Crisis intervention and safety features integrated throughout

## 📦 Import Patterns

### Recommended Import Patterns

```javascript
// UI Components
import { TherapeuticButton, MentalHealthCard } from '../ui';
import { LoadingScreen } from '../ui/components/molecules';

// Feature Components
import { MoodTracker } from '../features/mood/components';
import { ChatScreen } from '../features/chat/screens';

// Core Utilities
import { apiClient } from '../core/services';
import { formatDate } from '../core/utils';

// App Configuration
import { AppProvider } from '../app/providers';
import { store } from '../app/store';
```

### Legacy Support
The old component structure is maintained for backward compatibility:
```javascript
// Still works but deprecated
import { Button, Card } from '../components';
```

## 🎨 Theme System

The theme system is now located in `ui/theme/` and provides:
- Therapeutic color palettes optimized for mental health apps
- Light and dark mode support
- Accessibility-focused design tokens
- Mental health semantic colors (calm, stress, anxiety, etc.)

## 🔧 Development Guidelines

### Adding New Features
1. Create a new directory under `features/`
2. Include `components/`, `screens/`, `store/` (if needed)
3. Create an `index.js` for exports
4. Update the main feature exports if necessary

### Adding UI Components
1. Determine the atomic level (atom, molecule, organism)
2. Place in appropriate `ui/components/` subdirectory
3. Update the relevant index files
4. Follow the therapeutic design principles

### File Naming Conventions
- **Components**: PascalCase (`TherapeuticButton.js`)
- **Screens**: PascalCase with Screen suffix (`LoginScreen.js`)
- **Utilities**: camelCase (`formatDate.js`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.js`)
- **Hooks**: camelCase with use prefix (`useAuth.js`)

## 🧪 Testing Structure

Tests should follow the same structure:
```
src/
├── features/
│   └── auth/
│       ├── components/
│       │   └── __tests__/
│       └── screens/
│           └── __tests__/
└── ui/
    └── components/
        └── atoms/
            └── __tests__/
```

## 🔄 Migration Notes

This reorganization maintains backward compatibility while providing a cleaner structure for future development. Key changes:

1. **Components** → Split between `ui/components/` and `features/*/components/`
2. **Providers** → Moved to `app/providers/`
3. **Store** → Moved to `app/store/` and feature-specific stores
4. **Design System** → Consolidated in `ui/`
5. **Utilities** → Organized in `core/utils/`

The old import paths are still supported but should be gradually migrated to the new structure.