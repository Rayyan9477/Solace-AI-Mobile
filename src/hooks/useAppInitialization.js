/**
 * App Initialization Hook - Simplified for stability
 *
 * This version removes complex, multi-stage initialization to prevent blank screens
 * and ensure a reliable startup sequence.
 */

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { restoreAuthState } from "../store/slices/authSlice";

// Simplified initialization stages
export const INIT_STAGES = {
  STARTING: "starting",
  READY: "ready",
};

const useAppInitialization = () => {
  const dispatch = useDispatch();
  const [stage, setStage] = useState(INIT_STAGES.STARTING);

  useEffect(() => {
    console.log("≡ƒÜÇ useAppInitialization: Starting app initialization...");
    const initializeApp = async () => {
      try {
        console.log("≡ƒöä useAppInitialization: Dispatching restoreAuthState...");
        // Restore authentication state from storage
        await dispatch(restoreAuthState());
        console.log("≡ƒöä useAppInitialization: restoreAuthState completed");

        // Give the app a moment to update the UI after state restoration
        setTimeout(() => {
          setStage(INIT_STAGES.READY);
          console.log("✅ App initialized and ready.");
        }, 500); // A short delay can help prevent race conditions

      } catch (error) {
        console.error("❌ App initialization failed:", error);
        // Even if initialization fails, we move to ready to avoid a blank screen.
        // The app's navigator will handle the unauthenticated state.
        setStage(INIT_STAGES.READY);
      }
    };

    initializeApp();
  }, [dispatch]);

  // Return a simplified state for the app provider
  return {
    stage,
    isReady: stage === INIT_STAGES.READY,
    isLoading: stage !== INIT_STAGES.READY,
    // The following are returned to maintain the hook's contract
    progress: 100,
    error: null,
    isRetrying: false,
    retryCount: 0,
    loadingTime: 0,
    hasError: false,
    retryInitialization: () => {},
  };
};

export default useAppInitialization;
