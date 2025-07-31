# Solace AI Mobile - Folder Structure

## Overview

This document outlines the new folder structure implemented for the Solace AI Mobile application, following React Native and React best practices for scalability and maintainability.

## New Structure (src-new/)

```
src-new/
├── app/                          # App-level configuration and setup
│   ├── navigation/              # App navigation configuration
│   │   └── AppNavigator.js     # Main navigation setup
│   └── store/                  # Redux store configuration
│       ├── store.js           # Store setup and configuration
│       └── slices/            # Redux Toolkit slices
│           ├── authSlice.js
│           ├── chatSlice.js
│           ├── userSlice.js
│           ├── assessmentSlice.js
│           └── moodSlice.js
│
├── components/                  # Reusable UI components
│   ├── ui/                     # Basic UI components
│   │   ├── Avatar.js
│   │   ├── Badge.js
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── Icon.js
│   │   ├── Input.js
│   │   ├── ActivityIndicator.js
│   │   └── index.js
│   ├── forms/                  # Form-specific components
│   │   └── TherapeuticForm.js
│   ├── layout/                 # Layout and navigation components
│   │   └── navigation/         # Navigation components
│   │       ├── BottomTabBar.js
│   │       ├── Header.js
│   │       └── SafeNavigationHeader.js
│   ├── feedback/               # User feedback components
│   │   ├── LoadingScreen.js
│   │   └── index.js
│   ├── accessibility/          # Accessibility components
│   │   └── AccessibleTouchable.js
│   └── index.js
│
├── features/                    # Feature-based modules
│   ├── authentication/         # Authentication feature
│   │   ├── components/         # Auth-specific components
│   │   ├── screens/           # Auth screens
│   │   │   ├── LoginScreen.js
│   │   │   └── RegisterScreen.js
│   │   ├── hooks/             # Auth-specific hooks
│   │   └── services/          # Auth-specific services
│   │
│   ├── dashboard/              # Dashboard feature
│   │   ├── components/        # Dashboard components
│   │   │   ├── MoodCheckIn.js
│   │   │   ├── QuickActions.js
│   │   │   ├── WelcomeHeader.js
│   │   │   ├── DailyInsights.js
│   │   │   ├── ProgressOverview.js
│   │   │   └── RecentActivity.js
│   │   └── screens/           # Dashboard screens
│   │       └── DashboardScreen.js
│   │
│   ├── chat/                  # Chat feature
│   │   ├── components/        # Chat components
│   │   │   ├── ChatBubble.js
│   │   │   ├── ChatInput.js
│   │   │   ├── EmotionIndicator.js
│   │   │   ├── MessageBubble.js
│   │   │   ├── TherapeuticChatBubble.js
│   │   │   ├── TypingIndicator.js
│   │   │   └── VoiceRecorder.js
│   │   └── screens/           # Chat screens
│   │       └── ChatScreen.js
│   │
│   ├── mood-tracking/         # Mood tracking feature
│   │   ├── components/        # Mood tracking components
│   │   │   ├── ActivitySelector.js
│   │   │   ├── IntensitySlider.js
│   │   │   └── MoodSelector.js
│   │   └── screens/           # Mood tracking screens
│   │       └── MoodTrackerScreen.js
│   │
│   ├── assessment/            # Assessment feature
│   │   ├── components/        # Assessment components
│   │   │   ├── AssessmentCard.js
│   │   │   └── AssessmentHistory.js
│   │   └── screens/           # Assessment screens
│   │       └── AssessmentScreen.js
│   │
│   ├── profile/               # Profile feature
│   │   ├── components/        # Profile components
│   │   │   ├── ProfileHeader.js
│   │   │   ├── SettingsSection.js
│   │   │   └── StatsCard.js
│   │   └── screens/           # Profile screens
│   │       ├── ProfileScreen.js
│   │       └── AccessibilitySettingsScreen.js
│   │
│   └── index.js               # Features index
│
├── shared/                     # Shared utilities and resources
│   ├── design-system/         # Design system and theming
│   │   ├── DesignTokens.js    # Design tokens
│   │   ├── DesignSystemContext.js
│   │   ├── ColorCustomizer.js
│   │   ├── ComponentCustomizer.js
│   │   ├── theme.js           # Theme configuration
│   │   ├── icons/             # Icon system
│   │   │   ├── AllIcons.js
│   │   │   ├── AppIcons.js
│   │   │   ├── HealthTechIcons.js
│   │   │   ├── GeneralUIIcons.js
│   │   │   ├── ArrowsDirectionsIcons.js
│   │   │   ├── MentalHealthIcons.js
│   │   │   ├── NavigationInterfaceIcons.js
│   │   │   ├── DataVisualizationIcons.js
│   │   │   ├── AccessibilityCommunicationIcons.js
│   │   │   ├── NotificationStatusIcons.js
│   │   │   ├── IconSystem.js
│   │   │   ├── PlatformIcon.js
│   │   │   ├── README.md
│   │   │   └── index.js
│   │   ├── DesignSystemScreen.js
│   │   ├── IconTestScreen.js
│   │   ├── ThemeShowcaseScreen.js
│   │   ├── README.md
│   │   └── index.js
│   │
│   ├── hooks/                 # Custom hooks
│   │   └── ThemeContext.js    # Theme context hook
│   │
│   ├── utils/                 # Utility functions
│   │   ├── accessibility.js
│   │   ├── hapticFeedback.js
│   │   └── platformOptimizations.js
│   │
│   ├── services/              # API and external services
│   │   └── api.js
│   │
│   ├── constants/             # App constants
│   │   └── environment.js
│   │
│   └── types/                 # TypeScript type definitions (if needed)
│
├── assets/                     # Static assets (images, fonts, etc.)
│
├── __tests__/                  # Test files
│   └── components/
│       └── common/
│           ├── Avatar.test.js
│           ├── Badge.test.js
│           ├── Button.test.js
│           └── Card.test.js
│
└── __mocks__/                  # Mock files for testing
```

## Key Principles

### 1. Feature-Based Organization
- Each major feature (authentication, chat, dashboard, etc.) has its own directory
- Features contain their own components, screens, hooks, and services
- Promotes modularity and reduces coupling between features

### 2. Separation of Concerns
- **App-level**: Navigation, store configuration, and app-wide setup
- **Components**: Reusable UI components organized by type
- **Features**: Feature-specific logic and components
- **Shared**: Utilities, hooks, services, and design system used across features

### 3. Design System Integration
- Centralized design system with tokens, themes, and icons
- Icon system with 140+ therapeutic-focused icons
- Comprehensive theming system with accessibility support

### 4. Scalability
- Easy to add new features by creating new feature directories
- Clear boundaries between different parts of the application
- Consistent patterns for organization

## Benefits

1. **Maintainability**: Easy to locate and modify code
2. **Scalability**: Simple to add new features and components
3. **Team Collaboration**: Clear ownership and boundaries
4. **Testing**: Organized test structure matching source structure
5. **Performance**: Tree-shakable imports and modular architecture

## Migration from Old Structure

The old structure (`src/`) has been reorganized into the new structure (`src-new/`) with:

- Updated import paths throughout the codebase
- Consolidated duplicated files
- Improved organization following React Native best practices
- Enhanced design system integration
- Better separation between app-level and feature-level code

## Usage

When the migration is complete:
1. Update all import statements to use the new paths
2. Test all functionality to ensure imports work correctly
3. Remove the old `src/` directory
4. Rename `src-new/` to `src/`
5. Update build configurations if necessary