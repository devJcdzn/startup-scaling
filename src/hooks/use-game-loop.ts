"use client";

import { useEffect } from "react";
import { useGameStore } from "@/game/store/game-store";

export function useGameLoop(): void {
  useEffect(() => {
    const interval = setInterval(() => {
      const state = useGameStore.getState();
      if (!state.isPaused && state.screen === "playing") {
        state.tick();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      const state = useGameStore.getState();
      if (document.hidden) {
        if (state.screen === "playing" && !state.isPaused) {
          useGameStore.setState({ isPaused: true });
        }
      } else {
        if (state.screen === "playing" && state.isPaused) {
          useGameStore.setState({ isPaused: false });
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);
}
