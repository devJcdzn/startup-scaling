import type { ActiveModifier } from "./types";

export function expireModifiers(
  modifiers: ActiveModifier[],
  currentDay: number
): ActiveModifier[] {
  return modifiers.filter((mod) => {
    if (mod.durationDays === undefined) return true;
    return currentDay - mod.startedAtDay < mod.durationDays;
  });
}
