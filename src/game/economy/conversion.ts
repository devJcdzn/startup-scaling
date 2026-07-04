import type { GameState } from "../types";
import { BASE_CONVERSION_RATE } from "./types";

export function calculateConversionRate(state: GameState): number {
  let rate = BASE_CONVERSION_RATE;

  if (state.reputation >= 80) rate += 0.01;
  if (state.reputation <= 50) rate -= 0.01;
  if (state.reputation <= 30) rate -= 0.02;

  if (state.performance <= 60) rate -= 0.005;
  if (state.performance <= 40) rate -= 0.01;
  if (state.performance <= 20) rate -= 0.02;

  if (state.bugs >= 30) rate -= 0.005;
  if (state.bugs >= 60) rate -= 0.01;

  return Math.max(0.001, Math.min(0.08, rate));
}
