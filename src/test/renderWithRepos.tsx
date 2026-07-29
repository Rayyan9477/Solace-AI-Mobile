/**
 * renderWithRepos — render a tree against REAL repositories.
 *
 * @description Phase 0 (2026-07-27) test utility. Until now the five feature
 *   stacks were globally mocked to `() => null` in `jest.setup.js`, so the
 *   stack adapters — which own every data-flow decision in the app
 *   (repository reads/writes, entity↔screen mapping, crisis wiring) — were
 *   invisible to the suite. With those mocks gone, adapters are testable, but
 *   they need a provider tree and a live repository bundle.
 *
 *   This helper mounts the real {@link RepositoryProvider} against the
 *   in-memory `expo-sqlite` mock, waits for the bootstrap to finish, and hands
 *   the caller the live `Repositories` bundle so a test can assert on what was
 *   actually persisted — not on what a mock was told to return.
 *
 * @example
 *   const { getByTestId, repos } = await renderWithRepos(<MoodStack />);
 *   fireEvent.press(getByTestId("set-mood-button"));
 *   await waitFor(async () => expect(await repos.mood.list()).toHaveLength(1));
 *
 * @module test
 */

import React from "react";
import { render, waitFor, type RenderResult } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";

import {
  RepositoryProvider,
  useRepositories,
  type Repositories,
} from "@/app/providers/RepositoryProvider";

/** Options accepted by {@link renderWithRepos}. */
export interface RenderWithReposOptions {
  /**
   * Database filename. Give each test a unique name so state never leaks
   * between cases — the SQLite mock keys its in-memory store by filename.
   */
  readonly databaseName?: string;
  /**
   * Wrap the tree in a `NavigationContainer`. Required when rendering a
   * navigator (stack/tab); leave off for a bare screen. Defaults to true.
   */
  readonly withNavigation?: boolean;
  /**
   * Initial navigation state, so a test can mount directly onto the route it
   * cares about instead of driving through unrelated screens to reach it.
   * Requires `withNavigation`.
   *
   * @example
   *   { index: 0, routes: [{ name: "AssessmentIntro" }] }
   */
  readonly navigationState?: Parameters<
    typeof NavigationContainer
  >[0]["initialState"];
}

/** Result of {@link renderWithRepos} — RTL's result plus the live repos. */
export type RenderWithReposResult = RenderResult & {
  /** The live repository bundle the tree is rendering against. */
  readonly repos: Repositories;
};

/** Invisible probe that lifts the context value out for the caller. */
function ReposProbe({
  onRepos,
}: {
  onRepos: (repos: Repositories) => void;
}): null {
  const repos = useRepositories();
  React.useEffect(() => {
    onRepos(repos);
  }, [repos, onRepos]);
  return null;
}

let uniqueDbCounter = 0;

/**
 * Render `ui` inside a real RepositoryProvider and wait for `isReady`.
 *
 * @param ui - element under test (a screen, an adapter, or a whole navigator)
 * @param options - see {@link RenderWithReposOptions}
 * @returns RTL result extended with the live `repos` bundle
 */
export async function renderWithRepos(
  ui: React.ReactElement,
  options: RenderWithReposOptions = {},
): Promise<RenderWithReposResult> {
  const {
    databaseName = `test_${(uniqueDbCounter += 1)}.db`,
    withNavigation = true,
    navigationState,
  } = options;

  let captured: Repositories | null = null;
  const onRepos = (repos: Repositories): void => {
    captured = repos;
  };

  const body = withNavigation ? (
    <NavigationContainer initialState={navigationState}>
      {ui}
    </NavigationContainer>
  ) : (
    ui
  );

  const result = render(
    <RepositoryProvider databaseName={databaseName}>
      <ReposProbe onRepos={onRepos} />
      {body}
    </RepositoryProvider>,
  );

  // Bootstrap opens the DB and runs migrations asynchronously. Adapters gate
  // their reads on `isReady`, so tests must not start asserting before it
  // flips or they race the skeleton fallback.
  await waitFor(() => {
    if (!captured || !(captured as Repositories).isReady) {
      throw new Error("repositories not ready");
    }
  });

  return Object.assign(result, { repos: captured as unknown as Repositories });
}
