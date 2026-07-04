"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "@/game/store/game-store";
import { DAY_DURATION_MS } from "@/game/types";

const TICK_MS = 100;

export function useGameLoop(): void {
  const lastTickRef = useRef<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = performance.now();
      const state = useGameStore.getState();

      if (state.status !== "running" && state.status !== "decision") {
        lastTickRef.current = now;
        return;
      }

      if (lastTickRef.current === 0) {
        lastTickRef.current = now;
        return;
      }

      const delta = now - lastTickRef.current;
      lastTickRef.current = now;

      const scaledDelta = delta * state.timeScale;
      const newAccumulator = state.timeAccumulator + scaledDelta;

      if (newAccumulator >= DAY_DURATION_MS) {
        useGameStore.setState({
          timeAccumulator: newAccumulator - DAY_DURATION_MS,
        });
        state.tick(now);
      } else {
        useGameStore.setState({ timeAccumulator: newAccumulator });
        if (state.status === "decision" && state.currentEvent) {
          state.applyDelayPenaltyIfDue(now);
        }
      }
    }, TICK_MS);

    return () => clearInterval(interval);
  }, []);
}
