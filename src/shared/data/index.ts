/**
 * Persistence barrel.
 *
 * @description Single import point for the data layer. Consumers should pull
 *   types and repository factories from here rather than reaching into the
 *   submodules directly.
 *
 * @module shared/data
 */

export * from "./types";
export {
  closeDatabase,
  DEFAULT_DB_NAME,
  getDatabase,
  getSchemaVersion,
  isWebPlatform,
  openDatabase,
  runMigrations,
} from "./db";
export { generateId } from "./ids";
export {
  decodeStringArray,
  encodeStringArray,
  optionalNumber,
  optionalString,
} from "./serialize";
export { LATEST_VERSION, MIGRATIONS } from "./migrations";
export type { Migration } from "./migrations";

export {
  createSqliteMoodRepository,
  type MoodListFilter,
  type MoodRepository,
} from "./repositories/MoodRepository";
export {
  createSqliteJournalRepository,
  type JournalListFilter,
  type JournalRepository,
} from "./repositories/JournalRepository";
export {
  createSqliteSleepRepository,
  type SleepListFilter,
  type SleepRepository,
} from "./repositories/SleepRepository";
export {
  createSqliteChatRepository,
  type ChatRepository,
} from "./repositories/ChatRepository";
export {
  createSqliteSettingsRepository,
  type SettingsRepository,
} from "./repositories/SettingsRepository";
