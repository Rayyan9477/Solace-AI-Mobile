/**
 * Tests for the SQLite-backed chat repository.
 */

import { closeDatabase, openDatabase } from "../db";
import {
  createSqliteChatRepository,
  type ChatRepository,
} from "./ChatRepository";

describe("ChatRepository", () => {
  let repo: ChatRepository;

  beforeEach(async () => {
    const db = await openDatabase("chat_repo.db");
    repo = createSqliteChatRepository(db);
  });

  afterEach(async () => {
    await closeDatabase();
  });

  it("createConversation persists a conversation", async () => {
    const conv = await repo.createConversation({ mode: "general" });
    expect(conv.id).toBeTruthy();
    expect(conv.mode).toBe("general");
    expect(conv.syncStatus).toBe("pending");
    expect(conv.lastMessageAt).toBeUndefined();
  });

  it("conversationById returns null for missing id", async () => {
    expect(await repo.conversationById("missing")).toBeNull();
  });

  it("listConversations returns conversations newest-first by lastMessageAt", async () => {
    const a = await repo.createConversation({ mode: "general", title: "A" });
    const b = await repo.createConversation({ mode: "cbt", title: "B" });
    await repo.appendMessage({
      conversationId: b.id,
      role: "user",
      content: "newer message in b",
    });
    await repo.appendMessage({
      conversationId: a.id,
      role: "user",
      content: "old message in a",
      createdAt: 100,
    });
    const list = await repo.listConversations();
    // b's last_message_at is "now" while a's is hard-coded to 100.
    expect(list[0]?.id).toBe(b.id);
    expect(list[1]?.id).toBe(a.id);
  });

  it("listConversations applies the limit", async () => {
    for (let i = 0; i < 5; i += 1) {
      await repo.createConversation({ mode: "general" });
    }
    const list = await repo.listConversations(2);
    expect(list).toHaveLength(2);
  });

  it("appendMessage rejects an unknown conversationId", async () => {
    await expect(
      repo.appendMessage({
        conversationId: "missing",
        role: "user",
        content: "hi",
      }),
    ).rejects.toThrow(/Conversation not found/);
  });

  it("appendMessage rejects an empty content string", async () => {
    const c = await repo.createConversation({ mode: "general" });
    await expect(
      repo.appendMessage({
        conversationId: c.id,
        role: "user",
        content: "",
      }),
    ).rejects.toThrow(/non-empty/);
  });

  it("appendMessage updates conversation lastMessageAt", async () => {
    const c = await repo.createConversation({ mode: "general" });
    expect(c.lastMessageAt).toBeUndefined();
    const msg = await repo.appendMessage({
      conversationId: c.id,
      role: "user",
      content: "hello",
    });
    const refreshed = await repo.conversationById(c.id);
    expect(refreshed?.lastMessageAt).toBe(msg.createdAt);
  });

  it("listMessages returns messages oldest-first", async () => {
    const c = await repo.createConversation({ mode: "general" });
    const m1 = await repo.appendMessage({
      conversationId: c.id,
      role: "user",
      content: "first",
      createdAt: 100,
    });
    const m2 = await repo.appendMessage({
      conversationId: c.id,
      role: "assistant",
      content: "second",
      createdAt: 200,
    });
    const list = await repo.listMessages(c.id);
    expect(list.map((m) => m.id)).toEqual([m1.id, m2.id]);
  });

  it("listMessages applies the limit", async () => {
    const c = await repo.createConversation({ mode: "general" });
    for (let i = 0; i < 5; i += 1) {
      await repo.appendMessage({
        conversationId: c.id,
        role: "user",
        content: `msg ${i}`,
        createdAt: i,
      });
    }
    const list = await repo.listMessages(c.id, 2);
    expect(list).toHaveLength(2);
  });

  it("listMessages scopes by conversationId", async () => {
    const a = await repo.createConversation({ mode: "general" });
    const b = await repo.createConversation({ mode: "general" });
    await repo.appendMessage({
      conversationId: a.id,
      role: "user",
      content: "in a",
    });
    await repo.appendMessage({
      conversationId: b.id,
      role: "user",
      content: "in b",
    });
    const list = await repo.listMessages(a.id);
    expect(list).toHaveLength(1);
    expect(list[0]?.content).toBe("in a");
  });

  it("deleteConversation removes the conversation", async () => {
    const c = await repo.createConversation({ mode: "general" });
    await repo.deleteConversation(c.id);
    expect(await repo.conversationById(c.id)).toBeNull();
  });

  it("deleteConversation also removes its messages", async () => {
    const c = await repo.createConversation({ mode: "general" });
    await repo.appendMessage({
      conversationId: c.id,
      role: "user",
      content: "hi",
    });
    await repo.deleteConversation(c.id);
    const messages = await repo.listMessages(c.id);
    expect(messages).toHaveLength(0);
  });

  it("deleteMessage removes a single message", async () => {
    const c = await repo.createConversation({ mode: "general" });
    const m = await repo.appendMessage({
      conversationId: c.id,
      role: "user",
      content: "x",
    });
    await repo.deleteMessage(m.id);
    const list = await repo.listMessages(c.id);
    expect(list).toHaveLength(0);
  });

  it("createConversation generates unique ids", async () => {
    const a = await repo.createConversation({ mode: "general" });
    const b = await repo.createConversation({ mode: "general" });
    expect(a.id).not.toBe(b.id);
  });

  it("appendMessage generates unique ids", async () => {
    const c = await repo.createConversation({ mode: "general" });
    const m1 = await repo.appendMessage({
      conversationId: c.id,
      role: "user",
      content: "a",
    });
    const m2 = await repo.appendMessage({
      conversationId: c.id,
      role: "user",
      content: "b",
    });
    expect(m1.id).not.toBe(m2.id);
  });

  it("appendMessage stores role correctly", async () => {
    const c = await repo.createConversation({ mode: "general" });
    const u = await repo.appendMessage({
      conversationId: c.id,
      role: "user",
      content: "u",
    });
    const a = await repo.appendMessage({
      conversationId: c.id,
      role: "assistant",
      content: "a",
    });
    expect(u.role).toBe("user");
    expect(a.role).toBe("assistant");
  });
});
