# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

- Repository: Solace AI Mobile (Expo + React Native, with web support)
- Platform: Windows (pwsh) by default; iOS/Android builds require their respective toolchains

1) Common commands

- Install dependencies
```bash path=null start=null
npm install
```

- Start the app (Expo)
```bash path=null start=null
npm start
```
  - In the Expo terminal UI: press a for Android, i for iOS (macOS only), w for Web.

- Run on Android (prebuild native if needed)
```bash path=null start=null
npm run android
```

- Run on iOS (macOS only)
```bash path=null start=null
npm run ios
```

- Web (via Expo web)
```bash path=null start=null
npm run web
```

- Lint and fix
```bash path=null start=null
npm run lint
npm run lint:fix
```

- Unit tests (Jest via jest-expo)
```bash path=null start=null
npm test
```

- Watch mode / coverage / update snapshots / CI
```bash path=null start=null
npm run test:watch
npm run test:coverage
npm run test:update
npm run test:ci
```

- Run a single Jest test file
```bash path=null start=null
npx jest src/screens/mood/EnhancedMoodTrackerScreen.test.js
```

- Run Jest tests by name (pattern)
```bash path=null start=null
npx jest -t "Mood Tracking"
```

- Playwright tests (frontend E2E)
```bash path=null start=null
npm run test:playwright           # headless
npm run test:playwright:headed    # with UI
npm run test:playwright:debug     # Inspector/debug
npm run test:playwright:mobile    # mobile projects
npm run test:playwright:desktop   # desktop project
npm run test:playwright:report    # open HTML report
```

- Run a single Playwright test
```bash path=null start=null
npx playwright test tests/comprehensive-app-test.spec.js
# Or filter by title
npx playwright test -g "Dashboard renders"
```

- Detox (configured for iOS simulator; run on macOS with Xcode)
```bash path=null start=null
npm run test:e2e
```

- Setup convenience (repo + theme preview workspace)
```bash path=null start=null
npm run setup
npm run dev        # runs Expo app + theme preview concurrently
```

2) High-level architecture and structure

- App runtime and platforms
  - Expo SDK (~52) with React Native 0.76.x. Entry is expo/AppEntry.js per package.json (App.js exists for local render helpers).
  - app.json drives platform configuration (name/slug/icons/splash; iOS bundleIdentifier; Android package/permissions; web bundler=metro).

- Navigation
  - src/navigation/AppNavigator.js defines the primary stacks and tabs. It imports both light and dark variants of many screens and chooses at runtime via getThemeAwareScreen(lightScreen, darkScreen, isDarkMode).
  - A dedicated dark-mode stack exists in src/navigation/DarkModeNavigator.js with multiple splash variants and onboarding/auth flows.
  - NavigationErrorBoundary wraps navigator rendering with a themed, user-visible fallback and retry, capturing component-level errors during navigation.

- Theming and context
  - Theme is provided via src/shared/theme/UnifiedThemeProvider (imported as useTheme in navigation). The navigator and headers pull colors from theme.colors.*.
  - getThemeAwareScreen always returns a valid screen: prefers light, then dark, then a FallbackScreen. This prevents route registration gaps from crashing navigation.

- Error boundaries and fallbacks
  - src/components/ErrorBoundary and WebCompatibilityErrorBoundary exist for cross-platform error capture.
  - FallbackScreen provides a safe render target when a screen fails to load or is missing.

- Icon system
  - src/components/icons/OptimizedIconSystem.js exports a curated set of SVG icons used in navigation and components to reduce bundle size. Icons support variants (filled/outline), size, and platform-aware stroke widths via props.

- Screens (selected highlights)
  - Core experiences live under src/screens/* with both light and dark variants in many modules (auth, home, journal, mood, mindfulness, wellness, settings, community, chat).
  - EnhancedMoodTrackerScreen and MainAppScreen implement multi-step flows and time-based gradient theming; they rely on animations and therapeutic color tokens.

- Testing
  - Unit tests: jest-expo preset; setupFilesAfterEnv includes @testing-library/jest-native extensions; transformIgnorePatterns set for RN/Expo packages.
  - Coverage collection is limited to src/**/* and excludes stories, styles, and selected heavy UI files (see jest.config.js for paths).
  - Playwright config at repo root; tests live under tests/. Use npm run test:playwright* scripts.
  - Detox is available via script for iOS simulator; requires macOS + Xcode.

- Linting and formatting
  - ESLint config extends universe/native with relaxed RN rules; npm run lint / lint:fix cover .js/.jsx/.ts/.tsx. Prettier and lint-staged are present; prepare script installs Husky hooks.

3) What matters from README.md and CLAUDE.md

- From README.md
  - Use Node 16+, npm or yarn, Expo CLI, and platform toolchains (Android Studio, Xcode on macOS).
  - Quick start: npm install, npm start, press a/i/w to launch target.
  - For local quality gates: npm test and npm run lint.

- From CLAUDE.md (adapted for assistant usage in this repo)
  - Work module-by-module on UI components and screens, integrating them for a cohesive UX with strong accessibility and therapeutic design.
  - Keep documentation of major improvements and design decisions organized by module in CLAUDE.md when substantial UI/UX changes are introduced.
  - An internal icon and design system exists; prefer it over ad-hoc icon packs for visual consistency and accessibility.

4) Common development workflows in this repo

- Add a new screen with light/dark support
```bash path=null start=null
# 1) Implement LightScreen.js and DarkLightScreen.js under src/screens/<area>/
# 2) Export the components
# 3) In AppNavigator, register using getThemeAwareScreen(LightScreen, DarkScreen, isDarkMode)
# 4) Verify route name is unique and matches any navigation.navigate usage
# 5) Add a smoke Jest test and, if needed, a Playwright scenario
```

- Debug a navigation crash or blank screen
```bash path=null start=null
# 1) Look for stack traces from NavigationErrorBoundary in the console
# 2) Ensure the screen component is imported and not undefined at registration time
# 3) If a light or dark variant is missing, getThemeAwareScreen should fall back to FallbackScreen
# 4) Temporarily render the screen directly to isolate provider/theme issues
```

- Run a single unit test file or by name
```bash path=null start=null
npx jest src/components/accessibility/MentalHealthAccessible.test.js
npx jest -t "Accessibility"  # name pattern
```

5) Notes and pitfalls specific to this codebase

- Mixed navigation paradigms exist (standard stack/tab plus a separate DarkModeNavigator). Prefer AppNavigator for primary app entry unless you are explicitly validating the dark-only flow.
- Theme dependency: many components assume theme.colors.* exists; when rendering screens in isolation (e.g., in tests), wrap them with the same provider used in the app (UnifiedThemeProvider) or mock useTheme.
- Reanimated and gesture-handler: ensure the Babel plugin react-native-reanimated/plugin is enabled (it is, in babel.config.js). For new nested animations, follow the plugin’s placement rules.
- Web: app.json sets web bundler to metro. Lightweight SVG icons rely on react-native-svg; ensure polyfills are available in web target if adding new SVG features.
- Jest transformIgnorePatterns are already configured for RN/Expo packages. If adding new native packages, you may need to update jest.config.js to transform them.

6) File reference (selected)

- app.json: Expo multi-platform configuration (icons, splash, permissions, bundle ids)
- babel.config.js: presets and plugins (reanimated plugin included)
- jest.config.js: jest-expo preset, coverage, and transforms
- .eslintrc.js: ESLint universe/native config with RN-focused overrides
- src/navigation/AppNavigator.js and src/navigation/DarkModeNavigator.js: screen registration, theme-aware selection, error boundary
- src/components/icons/OptimizedIconSystem.js: curated SVG icon set used across the app

End of WARP.md

