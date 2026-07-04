import { create } from "zustand";
import { useShallow } from "zustand/shallow";
import type { GameState, GameScreen } from "../types";
import {
  createInitialState,
  tick as engineTick,
  applyChoice,
  reseedRng,
} from "../engine";

interface GameStore extends GameState {
  startGame: () => void;
  tick: () => void;
  choose: (choiceIndex: number) => void;
  restart: () => void;
  dismissFeedback: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialState(Date.now()),

  startGame: () => {
    const state = createInitialState(Date.now());
    set({ ...state, screen: "playing" });
  },

  tick: () => {
    const state = get();
    if (state.isPaused || state.screen !== "playing") return;
    set(engineTick(state));
  },

  choose: (choiceIndex: number) => {
    const state = get();
    if (!state.currentEvent) return;
    set(applyChoice(state, choiceIndex));
  },

  restart: () => {
    const state = createInitialState(Date.now());
    set({ ...state, screen: "playing" });
  },

  dismissFeedback: () => set({ pendingEffects: null }),
}));

export function useGameScreen(): GameScreen {
  return useGameStore((s) => s.screen);
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
      difficulty: s.difficulty,
    }))
  );
}

export function useGameEvent() {
  return useGameStore(
    useShallow((s) => ({
      currentEvent: s.currentEvent,
      pendingEffects: s.pendingEffects,
    }))
  );
}
