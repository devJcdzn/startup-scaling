import type { GameState } from "../types";

export function applyGrowthPressure(
  state: GameState,
  newUsers: number
): GameState {
  if (state.users <= 0) return state;

  const pressure = newUsers / state.users;
  let next = { ...state };

  if (pressure > 0.5) {
    next.performance = Math.max(0, next.performance - 10);
    next.reputation = Math.max(0, next.reputation - 5);
    next.bugs = Math.min(100, next.bugs + 8);
  } else if (pressure > 0.25) {
    next.performance = Math.max(0, next.performance - 5);
    next.bugs = Math.min(100, next.bugs + 3);
  }

  return next;
}
