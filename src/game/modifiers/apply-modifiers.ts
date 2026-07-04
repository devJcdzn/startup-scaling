import type { GameState } from "../types";
import type { ActiveModifier } from "./types";

export function applyActiveModifiers(
  state: GameState,
  modifiers: ActiveModifier[]
): GameState {
  let next = { ...state };

  for (const mod of modifiers) {
    if (mod.durationDays !== undefined) {
      const age = next.day - mod.startedAtDay;
      if (age >= mod.durationDays) continue;
    }

    for (const effect of mod.effects) {
      if (effect.mode === "flat" && effect.interval === "day" && effect.stat) {
        const key = effect.stat as keyof GameState;
        if (typeof next[key] === "number") {
          (next as any)[key] = (next[key] as number) + effect.value;
        }
      }
    }
  }

  return next;
}
