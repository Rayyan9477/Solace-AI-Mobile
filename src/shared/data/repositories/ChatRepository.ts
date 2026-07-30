/**
 * Chat Repository.
 *
 * @description CRUD over `chat_conversations` + `chat_messages`. Conversation
 *   delete cascades to messages via the schema FK. Appending a message
 *   updates the conversation's `last_message_at` so the conversations list
 *   stays sorted without an extra query.
 *
 * @module shared/data/repositories
 */

import type { SQLiteDatabase } from "expo-sqlite";

import { generateId } from "../ids";
import { optionalNumber, optionalString } from "../serialize";
import type {
  ChatConversation,
  ChatMessage,
  ChatMode,
  ChatRole,
  NewChatConversation,
  NewChatMessage,
  SyncStatus,
} from "../types";

/** Public surface of the chat repository. */
export interface ChatRepository {
  /** List conversations newest-first by `lastMessageAt` (then `updatedAt`). */
  listConversations(limit?: number): Promise<ChatConversation[]>;
  conversationById(id: string): Promise<ChatConversation | null>;
  createConversation(input: NewChatConversation): Promise<ChatConversation>;
  /** Hard-delete a conversation; cascades to its messages. */
  deleteConversation(id: string): Promise<void>;
  /** List messages oldest-first within a conversation. */
  listMessages(conversationId: string, limit?: number): Promise<ChatMessage[]>;
  /** Append a message and bump `last_message_at` on the conversation. */
  appendMessage(input: NewChatMessage): Promise<ChatMessage>;
  /** Hard-delete a single message. */
  deleteMessage(id: string): Promise<void>;
}

interface ConversationRow {
  id: string;
  title: string | null;
  mode: string;
  last_message_at: number | null;
  sync_status: string;
  remote_id: string | null;
  updated_at: number;
}

interface MessageRow {
  id: string;
  conversation_id: string;
  role: string;
  content: string;
  created_at: number;
  sync_status: string;
  remote_id: string | null;
  updated_at: number;
}

/** SQLite-backed implementation of {@link ChatRepository}. */
export function createSqliteChatRepository(
  db: SQLiteDatabase,
): ChatRepository {
  const conversationFromRow = (row: ConversationRow): ChatConversation => ({
    id: row.id,
    title: optionalString(row.title),
    mode: parseMode(row.mode),
    lastMessageAt: optionalNumber(row.last_message_at),
    syncStatus: parseSyncStatus(row.sync_status),
    remoteId: optionalString(row.remote_id),
    updatedAt: row.updated_at,
  });
  const messageFromRow = (row: MessageRow): ChatMessage => ({
    id: row.id,
    conversationId: row.conversation_id,
    role: parseRole(row.role),
    content: row.content,
    createdAt: row.created_at,
    syncStatus: parseSyncStatus(row.sync_status),
    remoteId: optionalString(row.remote_id),
    updatedAt: row.updated_at,
  });

  return {
    async listConversations(limit) {
      const limitClause = typeof limit === "number"
        ? ` LIMIT ${Math.max(0, Math.floor(limit))}`
        : "";
      const rows = await db.getAllAsync<ConversationRow>(
        `SELECT * FROM chat_conversations
         ORDER BY COALESCE(last_message_at, updated_at) DESC${limitClause}`,
      );
      return rows.map(conversationFromRow);
    },

    async conversationById(id) {
      const row = await db.getFirstAsync<ConversationRow>(
        "SELECT * FROM chat_conversations WHERE id = ?",
        [id],
      );
      return row ? conversationFromRow(row) : null;
    },

    async createConversation(input) {
      const now = Date.now();
      const id = generateId();
      await db.runAsync(
        `INSERT INTO chat_conversations (
          id, title, mode, last_message_at,
          sync_status, remote_id, updated_at
        ) VALUES (?, ?, ?, NULL, 'pending', NULL, ?)`,
        [id, input.title ?? null, input.mode, now],
      );
      return {
        id,
        title: input.title,
        mode: input.mode,
        syncStatus: "pending",
        updatedAt: now,
      };
    },

    async deleteConversation(id) {
      // Schema declares ON DELETE CASCADE, but we don't rely on PRAGMA
      // foreign_keys being on. Delete messages first to be safe.
      await db.runAsync(
        "DELETE FROM chat_messages WHERE conversation_id = ?",
        [id],
      );
      await db.runAsync("DELETE FROM chat_conversations WHERE id = ?", [id]);
    },

    async listMessages(conversationId, limit) {
      const limitClause = typeof limit === "number"
        ? ` LIMIT ${Math.max(0, Math.floor(limit))}`
        : "";
      const rows = await db.getAllAsync<MessageRow>(
        `SELECT * FROM chat_messages
         WHERE conversation_id = ?
         ORDER BY created_at ASC${limitClause}`,
        [conversationId],
      );
      return rows.map(messageFromRow);
    },

    async appendMessage(input) {
      if (typeof input.content !== "string" || input.content.length === 0) {
        throw new Error("Chat message content must be a non-empty string.");
      }
      const conversation = await db.getFirstAsync<ConversationRow>(
        "SELECT * FROM chat_conversations WHERE id = ?",
        [input.conversationId],
      );
      if (!conversation) {
        throw new Error(`Conversation not found: ${input.conversationId}`);
      }
      const now = Date.now();
      const createdAt = input.createdAt ?? now;
      const id = generateId();
      await db.runAsync(
        `INSERT INTO chat_messages (
          id, conversation_id, role, content, created_at,
          sync_status, remote_id, updated_at
        ) VALUES (?, ?, ?, ?, ?, 'pending', NULL, ?)`,
        [id, input.conversationId, input.role, input.content, createdAt, now],
      );
      await db.runAsync(
        `UPDATE chat_conversations
         SET last_message_at = ?, sync_status = 'pending', updated_at = ?
         WHERE id = ?`,
        [createdAt, now, input.conversationId],
      );
      return {
        id,
        conversationId: input.conversationId,
        role: input.role,
        content: input.content,
        createdAt,
        syncStatus: "pending",
        updatedAt: now,
      };
    },

    async deleteMessage(id) {
      await db.runAsync("DELETE FROM chat_messages WHERE id = ?", [id]);
    },
  };
}

function parseMode(raw: string): ChatMode {
  if (raw === "cbt" || raw === "mindfulness" || raw === "sleep") return raw;
  return "general";
}

function parseRole(raw: string): ChatRole {
  if (raw === "assistant" || raw === "system") return raw;
  return "user";
}

function parseSyncStatus(raw: string): SyncStatus {
  if (raw === "synced" || raw === "conflict") return raw;
  return "pending";
}
