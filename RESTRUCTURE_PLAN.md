# Solace AI Mobile - Restructure Plan

## Current vs. Proposed Structure

### Current Issues:
- Mixed naming conventions (kebab-case vs camelCase)
- Some files in wrong directories
- Inconsistent file organization
- Missing barrel exports in some directories

### Proposed Structure (Following React Native Best Practices):

```
src/
├── components/                    # Reusable UI components
│   ├── ui/                       # Basic UI components (renamed from 'common')
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   ├── Card/
│   │   ├── Input/
│   │   └── index.ts              # Barrel exports
│   ├── forms/                    # Form-related components
│   ├── icons/                    # Icon system
│   ├── navigation/               # Navigation components
│   ├── layout/                   # Layout components
│   └── index.ts
├── screens/                      # Screen components
│   ├── auth/
│   │   ├── LoginScreen/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── LoginScreen.test.tsx
│   │   │   ├── styles.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── dashboard/
│   ├── profile/
│   └── index.ts
├── features/                     # Feature-based modules
│   ├── authentication/
│   ├── mood-tracking/
│   ├── chat/
│   ├── assessment/
│   └── design-system/           # Move design system here
├── shared/                       # Shared utilities
│   ├── constants/
│   ├── utils/
│   ├── hooks/
│   ├── types/
│   └── theme/                   # Move theme system here
├── services/                     # API and external services
├── store/                        # State management
├── navigation/                   # Navigation configuration
└── __tests__/                   # Global tests
```

### File Naming Conventions:
- **Components**: PascalCase (Button.tsx, UserProfile.tsx)
- **Screens**: PascalCase with "Screen" suffix (LoginScreen.tsx)
- **Utilities**: camelCase (apiClient.ts, formatDate.ts)
- **Constants**: UPPER_SNAKE_CASE (API_ENDPOINTS.ts)
- **Types**: PascalCase (UserTypes.ts, ApiTypes.ts)
- **Hooks**: camelCase with "use" prefix (useAuth.ts)

### Directory Changes:
1. `components/common/` → `components/ui/`
2. `design-system/` → `features/design-system/`
3. `styles/theme.js` → `shared/theme/`
4. `utils/` → `shared/utils/`
5. `contexts/` → `shared/contexts/`
6. Individual screen files → Screen directories with index.ts

### Benefits:
- Consistent naming conventions
- Better code organization
- Easier imports with barrel exports
- Scalable feature-based architecture
- Industry standard practices
- Better developer experience