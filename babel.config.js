/**
 * Babel configuration.
 *
 * Added in Phase 0 (2026-07-27). The repo previously had NO babel config at
 * all, which meant `babel-plugin-transform-remove-console` — installed as a
 * devDependency and referenced by the comment in `metro.config.js` — never
 * ran. `console.*` was therefore shipped intact in production bundles.
 *
 * Notes on what is deliberately NOT here:
 *
 * - No `module-resolver`. The 380 `@/…` imports resolve through Metro's
 *   built-in `tsconfig.json` `paths` support (Expo SDK 50+) and through
 *   jest-expo in tests. Adding a second resolution mechanism would be
 *   redundant and could drift from `tsconfig.json`.
 *
 * - No explicit worklets/reanimated plugin. `babel-preset-expo@54` adds
 *   `react-native-worklets/plugin` automatically when `react-native-worklets`
 *   is installed (verified in `babel-preset-expo/build/index.js`). Listing it
 *   manually risks double-registration.
 *
 * `console.error` and `console.warn` are preserved on purpose: they are the
 * app's only production diagnostics today (AuthContext storage failures,
 * RepositoryProvider bootstrap failure, ProfileStack persistence warnings).
 * Once error reporting lands they become breadcrumbs. Only `log`/`info`/
 * `debug`/`trace` — developer noise — are stripped.
 */
module.exports = function babelConfig(api) {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    env: {
      production: {
        plugins: [
          [
            "transform-remove-console",
            { exclude: ["error", "warn"] },
          ],
        ],
      },
    },
  };
};
