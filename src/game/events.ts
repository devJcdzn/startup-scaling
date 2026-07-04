import type { GameEvent } from "./types";

export function selectEvent(
  events: GameEvent[],
  difficulty: number,
  rng: () => number,
  usedEvents: string[]
): GameEvent | null {
  const eligible = events.filter(
    (e) => e.difficultyThreshold <= difficulty && !usedEvents.includes(e.id)
  );

  if (eligible.length === 0) return null;

  const weights = eligible.map((e) => {
    const gap = difficulty - e.difficultyThreshold;
    return Math.max(1, 10 - gap);
  });

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let roll = rng() * totalWeight;

  for (let i = 0; i < eligible.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return eligible[i];
  }

  return eligible[eligible.length - 1];
}
