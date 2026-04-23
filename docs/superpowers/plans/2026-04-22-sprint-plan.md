# Solace AI Mobile — Sprint Plan

> **Companion to** [2026-04-22-prototype-v4.2-migration.md](./2026-04-22-prototype-v4.2-migration.md) (task-level detail) and [../../../DESIGN.md](../../../DESIGN.md) (execution rules, conventions, design system).
>
> This document organizes the migration plan into 11 sprints. Each sprint lists (a) agent-parallel batches, (b) sequential tasks, (c) exit criteria, (d) demo artifact.

## Locked decisions (from 2026-04-22 clarification session)

These override any conflicting defaults in the migration plan:

| # | Decision | Impact |
|---|---|---|
| D-1 | **Frontend-only for now**, backend wires up later. | No HIPAA/compliance scope in this plan. Welcome-screen badges render as visual, real claims deferred. |
| D-2 | **Chat UI must stay fully working, do not break the interface.** | Ship with `mockChatService` (scripted CBT-style responses). No "coming soon" placeholder. Voice mode also works with mock. |
| D-3 | **Delete aggressively.** | Everything in Appendix B of the migration plan is gone. No placeholder stubs. |
| D-4 | **Persistence:** local SQLite now, remote sync wired later. | Every table gets `sync_status`, `remote_id`, `updated_at` columns so sync can land without migrations. |
| D-5 | **Auth: Supabase.** | Chosen over Clerk — open source, has Postgres + realtime ready for Phase 6, RN SDK solid, generous free tier, ties into the eventual sync layer cleanly. If you prefer Clerk, the only differences are package + SDK calls; data flow identical. |
| D-6 | **Web platform later.** | Build RN-first; keep components web-viable (no `Platform.OS === 'web'` shims required now). `expo-blur` + `react-native-svg` both work on web, so no compromise. |
| D-7 | **Theme picker during onboarding** (5 presets). | New onboarding step 4, after Welcome/Goals/Assessment. |
| D-8 | **WCAG AAA target.** | Color contrast ≥7:1 for body text, ≥4.5:1 for large text. All interactive elements announce state changes. Reduced-motion collapses all loops. |
| D-9 | **Solo dev + multi-agent support.** | Every sprint flags parallel-safe work so subagents can batch it. |
| D-10 | **Max test coverage + max testing.** | 90% line coverage target, MSW for all network, behavior tests (not render-shallow), snapshot tests on every primitive, a11y assertions required. |

---

## Sprint summary

| Sprint | Name | Duration | Parallel capacity | Demo artifact |
|---|---|---|---|---|
| 0 | Foundation | 1 week | Low (sequential — everything depends on this) | Cosmic theme + fonts + primitives visible on a test screen |
| 1 | Demolition + Auth | 1 week | Medium | Supabase login working, ~80 legacy files gone |
| 2 | Mood & Daily Loop | 1.5 weeks | High (5 screens parallel) | Home v2 + Daily Check-in + Calendar + Insights live with real persistence |
| 3 | Chat (mocked) | 1.5 weeks | Medium | Full chat UI with scripted CBT responses, voice mode, CBT record |
| 4 | Wellness (mindful + sleep) | 1.5 weeks | High (7 screens parallel) | Meditation player, breathing orb, sleep log with real DB |
| 5 | Journal + Assessment + System | 1.5 weeks | High (10 screens parallel) | All 42 prototype screens exist |
| 6 | Brand & States | 1 week | High | Splash, Quote, Welcome, 404, Offline, Loading — full cohesion |
| 7 | Onboarding ↔ Theme picker | 1 week | Low | 5-theme picker woven into onboarding; runtime switch persists |
| 8 | Navigation + Deep Links + Crisis | 1 week | Medium | Crisis accessible from any screen; all 42 deep links resolve |
| 9 | Persistence + Sync scaffolding | 1 week | Low | SQLite repos; Supabase sync stubs with `sync_status` |
| 10 | Quality gates (AAA a11y, MSW, coverage) | 1 week | Medium | CI green, coverage ≥90%, VoiceOver walkthrough clean |
| 11 | Polish, docs, bug bash, release prep | 1 week | High | Signed build candidate + fully rewritten PROJECT.md/README |

**Total: 12 weeks** solo-with-agents. Halve the wall-clock time if you parallelize aggressively through sprints 2/4/5/6.

---

## Sprint 0 — Foundation (1 week)

**Goal:** Nothing ships to users yet. Everything is scaffolding.

**Why sequential:** every screen depends on palette + fonts + primitives.

### Sequential tasks (do in order)
1. **S0.1 — Pre-flight:** Branch, tag `pre-v42-migration`, baseline metrics. (Task 0.1 in migration plan)
2. **S0.2 — PROJECT.md rewrite:** Reflect actual stack. (Task 0.2)
3. **S0.3 — Drop dead scripts:** (Task 0.3)
4. **S0.4 — Install fonts & deps:** `@expo-google-fonts/*`, `expo-blur`, `expo-font`. (Task 1.1)
5. **S0.5 — Rewrite `colors.ts`:** cosmic palette. (Task 1.2)
6. **S0.6 — Load fonts in `App.tsx` + update `typography.ts`:** (Task 1.3)
7. **S0.7 — ThemeContext with 5 presets + AsyncStorage:** (Task 1.4)

### Parallelizable batch — Agent dispatch (after S0.7 lands)
Run 3 agents in parallel, each builds a group of primitives (see DESIGN.md § Component hierarchy):

- **Agent A:** `StatusBarSafe`, `BracketLabel`, `AuroraHairline`, `IconButton`
- **Agent B:** `GlassCard`, `GlassAuroraCard`, `HeroCard`, `StatBar`, `RingProgress`
- **Agent C:** `MoodFace` (5-level SVG with gradients), `BreathingOrb` (animated), `SmokeBlob`, `Icon` (Lucide→Feather map)

Each primitive ships with a test, a snapshot, and a 1-line `index.ts` export.

### Sequential cleanup
- **S0.8 — Haptic util:** (Task 1.6)
- **S0.9 — ThemeSwitcher component:** (Task 1.7)
- **S0.10 — Foundation smoke gate:** boot iOS + Android, confirm palette + fonts + primitives render. Tag `phase-1-foundation-complete`.

### Exit criteria
- `npx tsc --noEmit` clean
- `npm test -- src/shared` — all green, no regressions
- Physical-device render of all 14 primitives on a dev test screen
- Baseline coverage report snapshot

### Demo
GIF: Theme switcher flipping between 5 presets on a test screen showing every primitive.

---

## Sprint 1 — Demolition + Auth (1 week)

**Goal:** Remove the ~80 legacy files; wire Supabase auth so Phase 2+ has a real login.

### Parallel batch A — Demolition (one agent per feature folder, 8 commits)
| Agent | Feature | Files to delete |
|---|---|---|
| A1 | Chat | Appendix B.1 (20 files + tests) |
| A2 | Assessment | Appendix B.2 (6 files + tests) |
| A3 | Mood | Appendix B.3 (7 files + tests) |
| A4 | Journal | Appendix B.4 (11 files + tests) |
| A5 | Sleep | Appendix B.5 (9 files + tests) |
| A6 | Profile | Appendix B.6 (12 files + tests) |
| A7 | Mindful | Appendix B.7 (5 files + tests) |
| A8 | Dashboard + Onboarding + Community + Resources | B.8 + B.9 + **entire `features/community/*`** + **entire `features/resources/*`** + FacialExpression/ExpressionAnalysis families |

Each agent:
1. Deletes source + test file pairs.
2. Removes dead exports from the feature `index.ts`.
3. Removes navigation type entries from `src/shared/types/navigation.ts`.
4. Removes deep-link entries from `src/app/navigation/linking.ts`.
5. Runs `npx tsc --noEmit` — fixes any red cascades.
6. Commits: `chore(<feature>): delete N superseded screens per prototype v4.2`.

### Sequential tasks (after demolition lands)
1. **S1.1 — Install Supabase:** `@supabase/supabase-js`, `@react-native-async-storage/async-storage` (already there), `react-native-url-polyfill`.
2. **S1.2 — Create `src/shared/auth/supabaseClient.ts`:**
   ```ts
   import 'react-native-url-polyfill/auto';
   import { createClient } from '@supabase/supabase-js';
   import AsyncStorage from '@react-native-async-storage/async-storage';
   export const supabase = createClient(
     process.env.EXPO_PUBLIC_SUPABASE_URL!,
     process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
     { auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false } }
   );
   ```
3. **S1.3 — Rewrite `src/app/AuthContext.tsx`** to proxy Supabase:
   - `signIn(email, password)` → `supabase.auth.signInWithPassword`
   - `signUp(email, password, displayName)` → `supabase.auth.signUp`
   - `signInWithOAuth('apple' | 'google')` → `supabase.auth.signInWithOAuth`
   - `signOut()` → `supabase.auth.signOut`
   - `resetPassword(email)` → `supabase.auth.resetPasswordForEmail`
   - `onAuthStateChange` → keeps `user`, `session`, `isAuthenticated` in state
   - `hasCompletedOnboarding` stays in AsyncStorage (user metadata syncs to Supabase profile row later)
4. **S1.4 — SQL migration file:** `supabase/migrations/0001_profiles.sql`:
   ```sql
   create table profiles (
     id uuid references auth.users primary key,
     display_name text,
     avatar_url text,
     onboarding_completed boolean default false,
     preferred_theme text default 'cosmic',
     created_at timestamptz default now(),
     updated_at timestamptz default now()
   );
   alter table profiles enable row level security;
   create policy "users read own profile" on profiles for select using (auth.uid() = id);
   create policy "users update own profile" on profiles for update using (auth.uid() = id);
   ```
5. **S1.5 — `.env.example`:** Document `EXPO_PUBLIC_SUPABASE_URL` + anon key placeholders. Add real values to local `.env` (git-ignored).
6. **S1.6 — Auth smoke test:** Sign up → email confirmation → sign in → sign out — recorded in `docs/superpowers/plans/sprint-1-auth-smoke.md`.

### Exit criteria
- File count: ~80 fewer source files than baseline.
- Supabase login works on iOS + Android from a real device.
- Auth state persists across app restarts.
- `npx tsc --noEmit` clean; `npm test` green.
- Tag `phase-2-demolition-complete`.

### Demo
Video: Sign up with a fresh email → verify → sign in → close app → reopen (still logged in) → sign out.

---

## Sprint 2 — Mood & Daily Loop (1.5 weeks)

**Goal:** The daily emotional-check-in ritual is the heart of the product. Build it first.

### Parallel batch — 5 screens in parallel (5 agents)
Each agent reads the named prototype file + the matching `SCREENS.md` section + the `RN-SPECS.md` section (if priority), then implements with test coverage.

| Agent | Prototype | RN file | Priority spec? |
|---|---|---|---|
| M1 | `20-home-v2.js` | `features/dashboard/screens/HomeV2Screen.tsx` | ✅ RN-SPECS §1 |
| M2 | `21-checkin.js` | `features/mood/screens/DailyCheckInScreen.tsx` | ✅ RN-SPECS §2 |
| M3 | `06-mood.js` | `features/mood/screens/MoodDashboardScreen.tsx` | — |
| M4 | `22-mood-calendar.js` | `features/mood/screens/MoodCalendarScreen.tsx` | — |
| M5 | `23-mood-insights.js` | `features/mood/screens/MoodInsightsScreen.tsx` | — |

**Each agent delivers:** screen + hook + any new atoms/molecules + test file + snapshot. Commit format `feat(mood): add <Screen> (prototype NN)`.

### Sequential glue (after batch lands)
1. **S2.1 — SQLite schema + `moodRepository`** (Task 6.1 for mood only in this sprint).
2. **S2.2 — `useMoodEntries` hook** — replaces prop-driven data in all 5 screens.
3. **S2.3 — Seed dev data** behind `__DEV__` (30 days of fake entries for calendar density).
4. **S2.4 — Navigation glue:** Wire `DailyCheckIn` as a modal from `HomeV2.checkInHero`, wire all Mood routes.
5. **S2.5 — a11y pass:** VoiceOver walks Home v2 → DailyCheckIn → Calendar → Insights. Every state change announced.

### Exit criteria
- Logged mood entries persist across restart
- Calendar reflects entries in real time
- VoiceOver can complete daily check-in without sighted help
- Sprint 2 coverage delta ≥90% on new files

### Demo
Video: Log a mood + 3 influence tags + note → return to Home → open Calendar (new dot appears for today) → open Insights (AI summary mentions new entry).

---

## Sprint 3 — Chat (mocked, fully working) (1.5 weeks)

**Goal:** Chat UI feels real. No stubs, no "coming soon" disclaimers visible to users.

### Sequential task — Mock backend first
1. **S3.1 — `mockChatService.ts`** at `src/features/chat/services/mockChatService.ts`:
   - Async `sendMessage(thread, text, mode)` → returns Promise that resolves after 600–1400ms with scripted responses.
   - Response library split by `ChatMode` (general, cbt, mindfulness, sleep), each with ~25 response templates.
   - Typing-indicator emulated via a `BehaviorSubject`-style stream (simple event emitter).
   - Crisis-detection: before scripting a response, run `detectCrisisSignals(text)` — if positive, return the crisis intervention response + trigger the CrisisInterventionSheet.
2. **S3.2 — Conversation persistence** — `conversations` + `chat_messages` tables + `chatRepository`. Every message is saved; history survives restart.
3. **S3.3 — Crisis classifier** (Task 6.3): rule-based regex module, fully unit-tested (12 positive + 12 negative).

### Parallel batch — 5 chat screens
| Agent | Prototype | RN file | Notes |
|---|---|---|---|
| C1 | `07-chat.js` | `ActiveChatScreen.tsx` | Primary — consumes mockChatService |
| C2 | `24-chat-list.js` | `ChatsListScreen.tsx` | Multi-conversation list |
| C3 | `25-voice.js` | `VoiceSessionScreen.tsx` | Waveform visual; mock transcription via `expo-speech` TTS loopback |
| C4 | `26-session-summary.js` | `SessionSummaryScreen.tsx` | Generated from last 10 messages of a conversation |
| C5 | `27-cbt.js` | `CBTThoughtRecordScreen.tsx` | 5-step stepper; persists as a journal entry with `kind='cbt'` |

### Sequential — CrisisInterventionSheet (highest-risk component)
1. **S3.4 — `CrisisInterventionSheet.tsx`** — modal over chat when classifier trips. Peach halo (not alarming red), `tel:988`, `sms:741741?body=HOME`, "Or talk to Solace" fallback (stays in app), "I'm safe — dismiss" logs to `safety_dismissals` table for audit.
2. **S3.5 — Integration test:** send `"I want to end it all"` → sheet within 100ms → tap `Call 988` → `Linking.openURL('tel:988')` called.

### Exit criteria
- User can: pick a mode, send 20 messages, get scripted responses, see typing indicator, react "this helped" on AI messages, embed action cards (breathing link works → opens breathing screen).
- Conversation list shows 5+ conversations with preview + timestamp.
- Voice session: mic button starts 'recording', waveform animates, stop produces a message.
- Classifier trips on all 12 positive phrases, ignores all 12 negatives.
- Coverage ≥90% on new chat files.

### Demo
3 videos:
1. CBT-mode conversation feels like a real therapist session (scripted).
2. Voice session with waveform + fake transcript.
3. Crisis phrase → sheet → 988 dialer opens.

---

## Sprint 4 — Wellness (mindful + sleep) (1.5 weeks)

### Parallel batch A — Mindful (4 screens)
| Agent | Prototype | RN file |
|---|---|---|
| W1 | `10-breathing.js` | `features/mindful/screens/BreathingExerciseActiveScreen.tsx` |
| W2 | `30-mindful-library.js` | `features/mindful/screens/MindfulLibraryScreen.tsx` |
| W3 | `31-mindful-player.js` | `features/mindful/screens/MeditationPlayerScreen.tsx` (RN-SPECS §4) |
| W4 | `32-session-complete.js` | `features/mindful/screens/SessionCompleteScreen.tsx` |

### Parallel batch B — Sleep (3 screens)
| Agent | Prototype | RN file |
|---|---|---|
| W5 | `11-sleep.js` | `features/sleep/screens/SleepDashboardScreen.tsx` |
| W6 | `33-sleep-log.js` | `features/sleep/screens/SleepLogEntryScreen.tsx` (RN-SPECS §7) |
| W7 | `34-soundscapes.js` | `features/sleep/screens/SoundscapesScreen.tsx` |

### Sequential glue
1. **S4.1 — SQLite:** `meditation_sessions` + `sleep_logs` tables, repos, hooks.
2. **S4.2 — Asset prep:** bundle 6 soundscapes (rain, ocean, forest, brown-noise, fire, singing-bowl) as MP3 in `src/shared/assets/audio/`. Royalty-free.
3. **S4.3 — `expo-av` audio service:** `src/shared/services/audioService.ts` — single `AudioService.play(trackId)`, handles background audio config, ducking, interruptions.
4. **S4.4 — Breathing orb integration:** Breathing screen pulses the `<BreathingOrb>` primitive at inhale-hold-exhale tempo. Text-to-speech narration via `expo-speech` (optional toggle).

### Exit criteria
- All 7 wellness screens live, theme-aware.
- 6 soundscapes play continuously with correct looping.
- Sleep log persists; dashboard shows 7-day trend from real data.
- Meditation session logs to DB on complete; streak increments.

### Demo
Video: Start 5-minute breathing session → hear guidance → orb pulses with tempo → complete → Session Complete screen shows stats.

---

## Sprint 5 — Journal + Assessment + System (1.5 weeks)

### Parallel batch A — Journal (3 screens)
| Agent | Prototype | RN file |
|---|---|---|
| J1 | `08-journal.js` | `features/journal/screens/JournalDashboardScreen.tsx` |
| J2 | `28-journal-composer.js` | `features/journal/screens/JournalComposerScreen.tsx` (RN-SPECS §6) |
| J3 | `29-journal-detail.js` | `features/journal/screens/JournalDetailScreen.tsx` |

### Parallel batch B — Assessment (3 screens)
| Agent | Prototype | RN file |
|---|---|---|
| A1 | `04-assessment.js` | `features/assessment/screens/AssessmentQuestionScreen.tsx` |
| A2 | `18-assessment-intro.js` | `features/assessment/screens/AssessmentIntroScreen.tsx` |
| A3 | `19-assessment-results.js` | `features/assessment/screens/AssessmentResultsScreen.tsx` (RN-SPECS §5) |

### Parallel batch C — System (4 screens)
| Agent | Prototype | RN file |
|---|---|---|
| Y1 | `35-notifications.js` | `features/notifications/screens/NotificationsInboxScreen.tsx` |
| Y2 | `36-search.js` | `features/search/screens/SearchScreen.tsx` |
| Y3 | `37-account-settings.js` | `features/profile/screens/AccountSettingsScreen.tsx` |
| Y4 | `38-paywall.js` | `features/profile/screens/PaywallScreen.tsx` (RN-SPECS §8) |

### Sequential glue
1. **S5.1 — Journal SQLite repo + `useJournalEntries`.**
2. **S5.2 — Assessment question bank:** `src/features/assessment/data/questions.json` — 14 evidence-based questions (derived from PHQ-9 + GAD-7 style). Assessment is fully offline; score calc already exists at `src/features/assessment/utils/scoreCalculator.ts` — reuse.
3. **S5.3 — Search index:** In-memory index over `journal_entries`, `mindful_library`, `articles` (seeded bundle of 12 articles JSON for now). Uses `fuse.js` for fuzzy match.
4. **S5.4 — Global search entry point** from `HomeV2Screen` header search icon.

### Exit criteria
- Every prototype screen 01–42 exists as an RN file.
- Journal entries persist + render markdown in detail view.
- Assessment full flow completes, score saves to `assessment_results` table.
- Search returns real results from DB + bundled articles.
- Paywall renders plan cards with hardcoded prices + RevenueCat stub (real wiring deferred per D-1).

### Demo
Video: Complete assessment → see results → read recommendations → write a journal entry → search for a keyword → find the entry.

---

## Sprint 6 — Brand moments + System states (1 week)

### Parallel batch — 9 screens
| Agent | Prototype | RN file |
|---|---|---|
| B1 | `01-welcome.js` | `features/onboarding/screens/WelcomeScreen.tsx` (rewrite) |
| B2 | `02-signin.js` | `features/auth/screens/SignInScreen.tsx` (rewrite, now wired to Supabase) |
| B3 | `03-onboarding.js` | `features/onboarding/screens/OnboardingStep1Screen.tsx` |
| B4 | `13-splash.js` | `features/onboarding/screens/SplashScreen.tsx` |
| B5 | `14-quote.js` | `features/onboarding/screens/QuoteScreen.tsx` + 30-quote bundle |
| B6 | `39-loading.js` | `features/errors/screens/LoadingSkeletonScreen.tsx` |
| B7 | `40-empty.js` | `features/journal/screens/JournalEmptyScreen.tsx` (reusable empty state) |
| B8 | `41-offline.js` | `features/errors/screens/OfflineScreen.tsx` + NetInfo hook |
| B9 | `42-not-found.js` | `features/errors/screens/NotFoundScreen.tsx` |

Plus **B10:** `09-profile.js` → `features/profile/screens/ProfileDashboardScreen.tsx` (rewrite).

### Sequential glue
1. **S6.1 — NetInfo provider:** Wrap app in `<OfflineGate>` that renders `OfflineScreen` over content when `state.isConnected === false`.
2. **S6.2 — Splash → Quote handoff:** App boot flow is `SplashScreen (0.8s) → QuoteScreen (2.4s with progress bar) → RootNavigator`.

### Exit criteria
- All 42 prototype screens exist.
- Offline overlay kicks in on airplane mode.
- 404 renders for unknown deep links.
- Tag `phase-4-screens-complete`.

---

## Sprint 7 — Onboarding ↔ Theme picker (1 week)

**Goal:** Weave the 5-preset theme picker into onboarding (D-7), persist selection to profile.

### Sequential (this one doesn't parallelize well — it's flow design)
1. **S7.1 — New screen `OnboardingThemePickerScreen.tsx`** at `features/onboarding/screens/`:
   - 5 preset cards in a vertical scroll, each a 220×140 preview tile showing the palette applied to a miniaturized Home v2 thumbnail.
   - Live preview: tapping a preset applies theme app-wide immediately.
   - "Continue" CTA persists to AsyncStorage + Supabase `profiles.preferred_theme` column.
2. **S7.2 — Onboarding flow order:**
   1. Welcome
   2. Sign in / Sign up
   3. Assessment intro
   4. Assessment questions (14)
   5. Assessment results (first value moment)
   6. Goals picker
   7. **Theme picker** ← new
   8. Face ID primer
   9. Notification primer
   10. Profile setup (name, DoB — one screen)
   11. → MainFlow
3. **S7.3 — Update `OnboardingStack`** navigation type + stack order.
4. **S7.4 — `completeOnboarding()` in AuthContext** writes `onboarding_completed=true` to Supabase profile + local `hasCompletedOnboarding=true`.

### Exit criteria
- Fresh user completes onboarding in ≤5 minutes; selected theme persists on reboot.
- Theme picker respects reduced-motion (no preview animation loops).
- VoiceOver announces each preset name + active state.

---

## Sprint 8 — Navigation + Deep Links + Crisis (1 week)

### Sequential
1. **S8.1 — Rewrite `src/shared/types/navigation.ts`** to reflect the final screen set (Task 5.1).
2. **S8.2 — Add `CrisisButton` primitive** — 56×56 floating FAB, bottom-right above tab bar, visible across MainFlow (Task 5.2). It's a root-stack modal that pushes `features/crisis/screens/CrisisSupportScreen`.
3. **S8.3 — Rewrite `linking.ts`:** All 42 screens deep-linkable (Task 5.3). Delete `parseDeepLink` (Task 5.4).
4. **S8.4 — Move Crisis to its own feature folder** `src/features/crisis/` — screens, services, components. This is Phase 7.1 pulled forward.

### Parallel batch — Link verification
Dispatch 3 agents each hitting ~14 deep links via a smoke test script. Any route that fails to resolve, fix.

### Exit criteria
- `solace://<anything>` routes to the right screen or `NotFoundScreen`.
- Crisis reachable from any screen in ≤1 tap.
- Deep-link test: `solace://mood/checkin` opens DailyCheckIn even when app was killed.

---

## Sprint 9 — Persistence + Sync scaffolding (1 week)

### Sequential (persistence completeness)
1. **S9.1 — Full SQLite schema migration runner** (Task 6.1): every feature's tables land, `PRAGMA user_version` gates migrations.
2. **S9.2 — Add sync columns** to every user-data table:
   ```sql
   alter table mood_entries     add column sync_status text default 'local';  -- 'local' | 'synced' | 'dirty'
   alter table mood_entries     add column remote_id text;
   alter table mood_entries     add column updated_at integer not null default 0;
   -- repeat for journal_entries, sleep_logs, meditation_sessions, conversations, chat_messages
   ```
3. **S9.3 — Supabase mirror tables:** Migration `0002_user_data.sql` — mirror all 6 tables on the server with RLS policies restricting to `auth.uid() = user_id`.
4. **S9.4 — Sync engine stub** at `src/shared/data/sync/syncEngine.ts` — defines the interface and the dirty-queue, but does NOT run. Wired up in the future remote-sync sprint.
5. **S9.5 — Realtime subscription stub** — pattern shown but commented, so future you knows where to hook Supabase realtime for multi-device.

### Parallel batch
3 agents, one per remaining repository:
- Journal repo + hook refactor
- Sleep repo + hook refactor
- Meditation repo + hook refactor

### Exit criteria
- Every screen that displays user data reads from SQLite — zero remaining prop-driven placeholders.
- Schema migrations apply cleanly on a fresh install AND on an existing install.
- Sync engine interface compiles and tests pass (no actual sync yet — that's a future sprint).

---

## Sprint 10 — Quality gates (1 week)

### Sequential
1. **S10.1 — MSW install + setup** (`jest.setup.js`):
   ```ts
   import { setupServer } from 'msw/node';
   import { rest } from 'msw';
   export const server = setupServer();
   beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
   afterEach(() => server.resetHandlers());
   afterAll(() => server.close());
   ```
   Fix ~5–10 tests that broke when the permissive `fetch` mock disappeared.
2. **S10.2 — Coverage thresholds:**
   ```js
   coverageThreshold: { global: { branches: 85, functions: 90, lines: 90, statements: 90 } }
   ```
3. **S10.3 — A11y AAA audit:**
   - Run `axe-core` against each screen via the test harness.
   - Install `eslint-plugin-jsx-a11y` at error level.
   - VoiceOver walkthrough: every flow from Welcome → DailyCheckIn → Chat → Journal → Sleep → Crisis must complete eyes-closed.
   - Contrast audit script: iterate every `fontSize >= 18` → assert ≥4.5:1; every smaller → ≥7:1. Fail CI on violation.
4. **S10.4 — CI pipeline** (`.github/workflows/ci.yml`):
   - `npm run lint` (must pass)
   - `npm run test:ci` (must meet coverage)
   - `npm run test:playwright` (must pass)
   - `npx tsc --noEmit` (must pass)
   - `npm run a11y:audit` (new script)

### Parallel batch — Fill coverage gaps
Dispatch 4 agents, each owns a feature slice, writes behavior tests (not render tests) to bring coverage to ≥90% per file:
- Agent T1: `dashboard` + `mood` behavior tests
- Agent T2: `chat` + `crisis` behavior tests
- Agent T3: `mindful` + `sleep` behavior tests
- Agent T4: `journal` + `assessment` behavior tests

Each test must:
1. Render the real screen (not a mocked wrapper).
2. Dispatch a user interaction.
3. Assert a state change was observed (DB write, navigation, visible DOM change).
4. Have an `accessibilityRole` / label assertion.

### Exit criteria
- Coverage ≥90% lines, ≥85% branches, global.
- A11y CI job green.
- VoiceOver recording of full app tour published to `docs/accessibility/voiceover-tour.mp4`.

---

## Sprint 11 — Polish, docs, bug bash, release prep (1 week)

### Sequential
1. **S11.1 — Bug bash:** 1 full day on physical iOS device + 1 day on physical Android. Log every issue as a GitHub issue with labels. Triage + fix critical, defer nice-to-have.
2. **S11.2 — Icon assets:** Generate app icons + splash assets from `prototypes/inspiration/` brand marks. `expo prebuild` configs.
3. **S11.3 — Performance audit:**
   - React DevTools Profiler on the 3 heaviest screens (ActiveChat with 50 messages, MoodCalendar with 365 dots, MindfulLibrary with 20+ cards).
   - Replace any 10ms+ render with `React.memo` + `useMemo`.
   - Bundle visualizer report: flag any >300KB chunk.
4. **S11.4 — Rewrite `PROJECT.md`** finally + **`README.md`** with current state.
5. **S11.5 — Delete stale docs:** `SCREEN_INVENTORY.md` if inventoried to deleted files. Re-run the inventory if you want to keep it.
6. **S11.6 — Release candidate build:**
   ```bash
   npx expo prebuild
   eas build --platform ios --profile preview
   eas build --platform android --profile preview
   ```
7. **S11.7 — Tag `v5.0.0-prototype-v4.2`**, merge PR to main.

### Parallel batch — Storybook (optional)
Dispatch agents to build Storybook stories for all 14 primitives + 20 molecules. Only if appetite remains.

### Exit criteria
- Signed iOS + Android builds installable.
- Zero P0/P1 bugs in the backlog.
- Docs accurate.
- Celebration. 🍋

---

## Cross-sprint workflow rules

### Definition of Done (every ticket)
- ✅ Matches prototype pixel-intent (visual comparison screenshot in the PR).
- ✅ Theme-aware (all 5 presets render correctly — screenshots of each in PR).
- ✅ Accessibility: role, label, state, live region as applicable.
- ✅ Reduced-motion path tested.
- ✅ Behavior test exists (not just render test).
- ✅ Snapshot test for primitives/atoms.
- ✅ Haptics wired where relevant.
- ✅ File length ≤300 lines (split if longer).
- ✅ Zero hardcoded colors/fonts/spacing — all from theme.
- ✅ No prop-driven placeholder data (hook + repo).
- ✅ `npx tsc --noEmit` clean.
- ✅ Coverage for this file ≥90% lines.
- ✅ Conventional commit message, reference prototype screen NN.

### Branch strategy
- `main` — always deployable.
- `feat/sprint-N-<slice>` — per sprint slice (or per agent batch).
- Merge to `main` at sprint close with a tag `sprint-N-complete`.
- Never force-push after a sprint closes.

### Agent dispatch rules
See DESIGN.md § Subagent dispatch.

---

## Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Mock chat feels "off" — users notice scripted responses | High | Medium | Make templates long enough + vary sentence starters. Log "ai response felt robotic?" thumbs-down for training. |
| Supabase auth flow breaks during offline first-run | Medium | High | Gate UI on `NetInfo.isConnected`; fall back to cached session. |
| SQLite schema conflicts after a wrong migration | Medium | High | Always `PRAGMA user_version` gate; `expo-sqlite` transactions. |
| Crisis classifier misses a phrase | Medium | Critical | Maintain test suite with 50+ real crisis phrases from CDC/SAMHSA examples; expand monthly. |
| Theme switch causes flicker on slow Android devices | Low | Low | Pre-compute StyleSheet for each theme; swap via ref. |
| Font loading blocks splash too long | Low | Low | Keep SplashScreen visible; hide only on `fontsLoaded`. |
| MSW strict mode breaks integration tests | Medium | Medium | Sprint 10 budget includes fixing them — planned. |
| Coverage threshold blocks CI with legitimate uncovered lines | Low | Low | Use `/* istanbul ignore next */` sparingly, documented. |

---

## What this sprint plan does NOT cover (future work)

- Real Claude/LLM chat backend (needs a server + API key management).
- Remote sync engine (stubbed in Sprint 9, executed later).
- HIPAA compliance workstream.
- RevenueCat StoreKit wiring.
- Push notifications (just permissions prompt; no backend yet).
- Analytics (PostHog/Amplitude) — not in prototype.
- Multi-language i18n.
- App store metadata, screenshots, privacy policy URLs.

Each becomes its own future plan when the product is ready.
