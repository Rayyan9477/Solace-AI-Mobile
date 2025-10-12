# Solace AI Mobile – Architecture Overview

This document summarizes the structure, conventions, and import aliases used across the app to improve maintainability and modularity.

## Structure

- src/
  - app/
    - navigation/ – App navigation root and stacks
    - providers/ – AppProvider orchestration and exports
    - store/ – Redux store and slices
  - features/ – Feature-first screens and components
  - shared/
    - animations/, constants/, expo/, services/, theme/, types/, ui/, utils/
  - ui/
    - components/, animations/, theme/ – Design system-level UI and theming bridge

## Providers

- Use `RefactoredAppProvider` from `@app/providers` as the main provider wrapper.
- Theme orchestration is centralized in `shared/theme/ThemeProvider`. The UI-layer provider at `ui/theme/ThemeProvider` re-exports the shared provider to avoid divergence.

## Aliases

Configured in `babel.config.js` and `tsconfig.json`:

- `@/*` → `src/*`
- `@shared/*` → `src/shared/*`
- `@features/*` → `src/features/*`
- `@components/*` → `src/shared/ui/*`
- `@utils/*` → `src/shared/utils/*`
- `@theme/*` → `src/shared/theme/*`
- `@expo/*` → `src/shared/expo/*`
- `@app/*` → `src/app/*`
- `@ui/*` → `src/ui/*`

## Barrels

To keep imports stable during refactors, barrels exist for:

- `@app/navigation`
- `@app/providers`
- `@app/store`
- `@shared/services`
- `@shared/utils`

## Naming

- Prefer kebab-case folder names for features (e.g., `crisis-intervention`).
- Bridge index added at `features/crisis-intervention/index.js` to re-export from the legacy `crisisIntervention` folder.

## Testing

- Jest is configured via `jest.config.js`. Coverage is collected for `src/**/*`.

## Migration notes

- Avoid importing from deep paths; prefer aliases and barrels. This minimizes churn when moving files.
- Legacy or duplicate modules should be re-exported via a single source to prevent divergence.
