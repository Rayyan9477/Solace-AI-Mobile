/**
 * Tests for the RepositoryProvider context.
 */

import React from "react";
import { Text } from "react-native";
import { act, render, waitFor } from "@testing-library/react-native";

import { closeDatabase } from "../../shared/data/db";
import {
  getNoopRepositories,
  RepositoryProvider,
  useRepositories,
  type Repositories,
} from "./RepositoryProvider";

function Probe({
  capture,
}: {
  capture: (repos: Repositories) => void;
}): React.ReactElement {
  const repos = useRepositories();
  React.useEffect(() => {
    capture(repos);
  }, [repos, capture]);
  return <Text>{repos.isReady ? "ready" : "loading"}</Text>;
}

describe("RepositoryProvider", () => {
  afterEach(async () => {
    await closeDatabase();
  });

  it("renders its children", () => {
    const { getByText } = render(
      <RepositoryProvider>
        <Text testID="child">child</Text>
      </RepositoryProvider>,
    );
    expect(getByText("child")).toBeTruthy();
  });

  it("starts in the loading state with no-op repos", () => {
    const captures: Repositories[] = [];
    render(
      <RepositoryProvider>
        <Probe capture={(r) => captures.push(r)} />
      </RepositoryProvider>,
    );
    expect(captures.length).toBeGreaterThan(0);
    expect(captures[0]?.isReady).toBe(false);
  });

  it("flips isReady to true after the database opens", async () => {
    const { getByText } = render(
      <RepositoryProvider databaseName="provider_ready.db">
        <Probe capture={() => undefined} />
      </RepositoryProvider>,
    );
    await waitFor(() => {
      expect(getByText("ready")).toBeTruthy();
    });
  });

  it("exposes all five repositories + sync queue once ready", async () => {
    const captures: Repositories[] = [];
    render(
      <RepositoryProvider databaseName="provider_repos.db">
        <Probe capture={(r) => captures.push(r)} />
      </RepositoryProvider>,
    );
    await waitFor(() => {
      const last = captures[captures.length - 1];
      expect(last?.isReady).toBe(true);
    });
    const last = captures[captures.length - 1];
    expect(last?.mood).toBeTruthy();
    expect(last?.journal).toBeTruthy();
    expect(last?.sleep).toBeTruthy();
    expect(last?.chat).toBeTruthy();
    expect(last?.settings).toBeTruthy();
    expect(last?.syncQueue).toBeTruthy();
  });

  it("repositories work end-to-end through the provider", async () => {
    const captures: Repositories[] = [];
    render(
      <RepositoryProvider databaseName="provider_e2e.db">
        <Probe capture={(r) => captures.push(r)} />
      </RepositoryProvider>,
    );
    await waitFor(() => {
      const last = captures[captures.length - 1];
      expect(last?.isReady).toBe(true);
    });
    const repos = captures[captures.length - 1];
    if (!repos) throw new Error("expected repos");
    await act(async () => {
      await repos.mood.create({ level: 4 });
    });
    const moods = await repos.mood.list();
    expect(moods).toHaveLength(1);
    expect(moods[0]?.level).toBe(4);
  });

  it("useRepositories returns a no-op bundle when called outside the provider", () => {
    const captures: Repositories[] = [];
    render(<Probe capture={(r) => captures.push(r)} />);
    expect(captures[0]?.isReady).toBe(false);
  });

  it("getNoopRepositories returns a stable no-op bundle", () => {
    const noop = getNoopRepositories();
    expect(noop.isReady).toBe(false);
    expect(typeof noop.mood.list).toBe("function");
    expect(typeof noop.syncQueue.processQueue).toBe("function");
  });

  it("noop mood.create rejects with a 'not ready' error", async () => {
    const noop = getNoopRepositories();
    await expect(noop.mood.create({ level: 3 })).rejects.toThrow(/not ready/i);
  });

  it("noop journal.create rejects", async () => {
    const noop = getNoopRepositories();
    await expect(noop.journal.create({ body: "x" })).rejects.toThrow(
      /not ready/i,
    );
  });

  it("noop sleep.create rejects", async () => {
    const noop = getNoopRepositories();
    await expect(
      noop.sleep.create({ bedtime: 0, wokeUp: 1, date: "2024-01-01" }),
    ).rejects.toThrow(/not ready/i);
  });

  it("noop chat methods reject for create + work for list", async () => {
    const noop = getNoopRepositories();
    await expect(
      noop.chat.createConversation({ mode: "general" }),
    ).rejects.toThrow(/not ready/i);
    await expect(noop.chat.listConversations()).resolves.toEqual([]);
  });

  it("noop settings.set rejects", async () => {
    const noop = getNoopRepositories();
    await expect(
      noop.settings.set({ key: "x", value: "y" }),
    ).rejects.toThrow(/not ready/i);
  });

  it("noop syncQueue is a no-op", async () => {
    const noop = getNoopRepositories();
    expect(noop.syncQueue.pendingCount()).toBe(0);
    expect(noop.syncQueue.list()).toEqual([]);
    const result = await noop.syncQueue.processQueue();
    expect(result.skipped).toBe(true);
  });
});
