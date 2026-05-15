/**
 * Repository Provider.
 *
 * @description Owns the SQLite singleton and exposes the five domain
 *   repositories + the sync queue via React context. While the underlying
 *   database is still bootstrapping (`isReady = false`), the hook returns
 *   no-op repositories so consumers can render placeholders without
 *   crashing during cold-start.
 *
 *   Wiring order in `App.tsx`:
 *     `AuthProvider > RepositoryProvider > ThemeProvider`
 *
 * @module app/providers
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Platform } from "react-native";

import { openDatabase } from "../../shared/data/db";
import {
  createSqliteChatRepository,
  type ChatRepository,
} from "../../shared/data/repositories/ChatRepository";
import {
  createSqliteJournalRepository,
  type JournalRepository,
} from "../../shared/data/repositories/JournalRepository";
import {
  createSqliteMindfulRepository,
  type MindfulRepository,
} from "../../shared/data/repositories/MindfulRepository";
import {
  createSqliteMoodRepository,
  type MoodRepository,
} from "../../shared/data/repositories/MoodRepository";
import {
  createSqliteSettingsRepository,
  type SettingsRepository,
} from "../../shared/data/repositories/SettingsRepository";
import {
  createSqliteSleepRepository,
  type SleepRepository,
} from "../../shared/data/repositories/SleepRepository";
import {
  createNoopSyncQueue,
  createSyncQueue,
  type SyncQueue,
} from "../../shared/services/sync";

/** Aggregate exposed to consumers via {@link useRepositories}. */
export interface Repositories {
  readonly mood: MoodRepository;
  readonly journal: JournalRepository;
  readonly sleep: SleepRepository;
  readonly chat: ChatRepository;
  readonly settings: SettingsRepository;
  readonly mindful: MindfulRepository;
  readonly syncQueue: SyncQueue;
  /** True once the SQLite migration has finished. */
  readonly isReady: boolean;
}

const NOOP_REPOSITORIES: Repositories = buildNoopRepositories();

const RepositoryContext = createContext<Repositories>(NOOP_REPOSITORIES);

/** Props accepted by {@link RepositoryProvider}. */
export interface RepositoryProviderProps {
  readonly children: React.ReactNode;
  /** Override database name (used by tests). */
  readonly databaseName?: string;
}

/**
 * Provider that opens the SQLite DB once on mount, instantiates each
 * repository, and exposes them to descendants via `useRepositories()`.
 */
export function RepositoryProvider(
  props: RepositoryProviderProps,
): React.ReactElement {
  const { children, databaseName } = props;
  const [repos, setRepos] = useState<Repositories>(NOOP_REPOSITORIES);

  useEffect(() => {
    let cancelled = false;

    // Web bypass: Expo SDK 54 ships `expo-sqlite` with a Web Worker on web,
    // but our Metro config uses `output: "single"` (app.json) which cannot
    // bundle the worker URL. The bootstrap would hang forever inside the
    // Worker constructor. Web is not a production persistence target — we
    // flip `isReady: true` immediately with the no-op repos so screens
    // render their empty-state placeholders instead of a permanent skeleton.
    // Native iOS/Android still go through the real SQLite path below.
    if (Platform.OS === "web") {
      setRepos({ ...NOOP_REPOSITORIES, isReady: true });
      return () => {
        cancelled = true;
      };
    }

    (async () => {
      try {
        const db = await openDatabase(databaseName);
        if (cancelled) return;
        const syncQueue = createSyncQueue({ db });
        try {
          await syncQueue.hydrate();
        } catch {
          // Hydration failure must not block app boot — the queue still
          // accepts new tasks and the durable rows will be picked up next
          // launch.
        }
        if (cancelled) return;
        setRepos({
          mood: createSqliteMoodRepository(db),
          journal: createSqliteJournalRepository(db),
          sleep: createSqliteSleepRepository(db),
          chat: createSqliteChatRepository(db),
          settings: createSqliteSettingsRepository(db),
          mindful: createSqliteMindfulRepository(db),
          syncQueue,
          isReady: true,
        });
      } catch (err) {
        // Booting the DB failed — keep the no-op repos so the app still
        // renders. Sprint 11+ will surface this via a banner.
        if (__DEV__) {
          console.error("[RepositoryProvider] SQLite bootstrap failed:", err);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [databaseName]);

  const value = useMemo<Repositories>(() => repos, [repos]);

  return React.createElement(
    RepositoryContext.Provider,
    { value },
    children,
  );
}

/**
 * Access the repository bundle from any descendant of
 * {@link RepositoryProvider}. Returns the no-op bundle when called outside a
 * provider (e.g. in tests that don't wrap their tree).
 */
export function useRepositories(): Repositories {
  return useContext(RepositoryContext);
}

/** Exported for tests + other providers that need the bare no-op surface. */
export function getNoopRepositories(): Repositories {
  return NOOP_REPOSITORIES;
}

function buildNoopRepositories(): Repositories {
  const noopMood: MoodRepository = {
    list: async () => [],
    byId: async () => null,
    create: async () => {
      throw new Error("Repositories not ready");
    },
    update: async () => {
      throw new Error("Repositories not ready");
    },
    delete: async () => undefined,
    getStreak: async () => 0,
    getCalendar: async () => [],
  };
  const noopJournal: JournalRepository = {
    list: async () => [],
    byId: async () => null,
    create: async () => {
      throw new Error("Repositories not ready");
    },
    update: async () => {
      throw new Error("Repositories not ready");
    },
    delete: async () => undefined,
    count: async () => 0,
  };
  const noopSleep: SleepRepository = {
    list: async () => [],
    byId: async () => null,
    byDate: async () => null,
    create: async () => {
      throw new Error("Repositories not ready");
    },
    update: async () => {
      throw new Error("Repositories not ready");
    },
    delete: async () => undefined,
    averageDurationMs: async () => null,
  };
  const noopChat: ChatRepository = {
    listConversations: async () => [],
    conversationById: async () => null,
    createConversation: async () => {
      throw new Error("Repositories not ready");
    },
    deleteConversation: async () => undefined,
    listMessages: async () => [],
    appendMessage: async () => {
      throw new Error("Repositories not ready");
    },
    deleteMessage: async () => undefined,
  };
  const noopSettings: SettingsRepository = {
    get: async () => null,
    getValue: async () => null,
    set: async () => {
      throw new Error("Repositories not ready");
    },
    delete: async () => undefined,
    getAll: async () => [],
  };
  const noopMindful: MindfulRepository = {
    list: async () => [],
    byId: async () => null,
    create: async () => {
      throw new Error("Repositories not ready");
    },
    totalDurationMs: async () => 0,
    count: async () => 0,
  };
  return {
    mood: noopMood,
    journal: noopJournal,
    sleep: noopSleep,
    chat: noopChat,
    settings: noopSettings,
    mindful: noopMindful,
    syncQueue: createNoopSyncQueue(),
    isReady: false,
  };
}
