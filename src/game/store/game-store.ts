import { create } from "zustand";
import { useShallow } from "zustand/shallow";
import type { GameState, GameStatus } from "../types";
import {
  createInitialState,
  tick as engineTick,
  applyChoice,
  advanceDay,
  reseedRng,
} from "../engine";

interface GameStore extends GameState {
  startGame: () => void;
  tick: (now: number) => void;
  choose: (choiceIndex: number) => void;
  restart: () => void;
  dismissFeedback: () => void;
  applyDelayPenaltyIfDue: (now: number) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialState(Date.now()),

  startGame: () => {
    const state = createInitialState(Date.now());
    set({ ...state, status: "running" });
  },

  tick: (now: number) => {
    const state = get();
    if (state.status !== "running" && state.status !== "decision") return;

    let next = engineTick(state, now);

    if (next.status === "running" || next.status === "decision") {
      next = advanceDay(next);
    }

    set(next);
  },

  choose: (choiceIndex: number) => {
    const state = get();
    if (!state.currentEvent) return;
    set(applyChoice(state, choiceIndex));
  },

  restart: () => {
    const state = createInitialState(Date.now());
    set({ ...state, status: "running" });
  },

  dismissFeedback: () => set({ pendingEffects: null }),

  applyDelayPenaltyIfDue: (now: number) => {
    const state = get();
    if (!state.currentEvent?.delayPenalty) return;
    if (state.lastPenaltyTime === 0) {
      set({ lastPenaltyTime: now });
      return;
    }

    const elapsed = now - state.lastPenaltyTime;
    if (elapsed < state.currentEvent.delayPenalty.intervalMs) return;

    let next = { ...state };
    const effects = state.currentEvent.delayPenalty.effects;
    for (const key of Object.keys(effects) as Array<keyof typeof effects>) {
      const val = effects[key];
      if (val !== undefined) {
        (next as any)[key] = (next as any)[key] + val;
      }
    }
    next.lastPenaltyTime = now;

    next.performance = Math.max(0, Math.min(100, next.performance));
    next.reputation = Math.max(0, Math.min(100, next.reputation));
    next.hype = Math.max(0, Math.min(100, next.hype));
    next.techDebt = Math.max(0, Math.min(100, next.techDebt));
    next.bugs = Math.max(0, Math.min(100, next.bugs));
    next.users = Math.max(0, next.users);
    next.money = Math.max(0, next.money);

    if (next.money <= 0 || next.performance <= 0 || next.reputation <= 0) {
      next.status = "lost";
    }

    set(next);
  },
}));

export function useGameStatus(): GameStatus {
  return useGameStore((s) => s.status);
}

export function useGameStats() {
  return useGameStore(
    useShallow((s) => ({
      day: s.day,
      users: s.users,
      money: s.money,
      performance: s.performance,
      reputation: s.reputation,
      hype: s.hype,
      techDebt: s.techDebt,
      bugs: s.bugs,
      difficulty: s.difficulty,
      timeScale: s.timeScale,
    }))
  );
}

export function useGameEvent() {
  return useGameStore(
    useShallow((s) => ({
      currentEvent: s.currentEvent,
      pendingEffects: s.pendingEffects,
      lastPenaltyTime: s.lastPenaltyTime,
    }))
  );
}
