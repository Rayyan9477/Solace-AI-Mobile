/**
 * Auth Context
 * @description Global authentication state management via React Context
 * @module App
 *
 * Provides auth state (isAuthenticated, hasCompletedOnboarding) and
 * methods (signIn, signOut, completeOnboarding) to the entire app.
 * Persists auth state to AsyncStorage for session continuity.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_STORAGE_KEY = "@solace/auth_state";

interface AuthContextType {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  isLoading: boolean;
  signIn: () => void;
  signOut: () => void;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthState {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
}

type AuthStateUpdate = AuthState | ((prev: AuthState) => AuthState);

const DEFAULT_AUTH_STATE: AuthState = {
  isAuthenticated: false,
  hasCompletedOnboarding: false,
};

/**
 * AuthProvider Component
 * Wraps the app to provide auth state via context.
 */
export function AuthProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [authState, setAuthState] = useState<AuthState>(DEFAULT_AUTH_STATE);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted auth state on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          setAuthState(JSON.parse(stored));
        }
      } catch {
        // Silently fall back to default state
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Persist auth state on change
  const persistState = useCallback(async (update: AuthStateUpdate) => {
    let nextState = DEFAULT_AUTH_STATE;

    setAuthState((prevState) => {
      nextState = typeof update === "function" ? update(prevState) : update;
      return nextState;
    });

    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextState));
    } catch {
      // Storage write failure is non-critical
    }
  }, []);

  const signIn = useCallback(() => {
    persistState((prevState) => ({ ...prevState, isAuthenticated: true }));
  }, [persistState]);

  const signOut = useCallback(() => {
    persistState(DEFAULT_AUTH_STATE);
  }, [persistState]);

  const completeOnboarding = useCallback(() => {
    persistState((prevState) => ({ ...prevState, hasCompletedOnboarding: true }));
  }, [persistState]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        hasCompletedOnboarding: authState.hasCompletedOnboarding,
        isLoading,
        signIn,
        signOut,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth Hook
 * Access auth state and methods from any component within AuthProvider.
 * @throws Error if used outside AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
