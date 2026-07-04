import { rngRange } from "./rng";

export function calculateGrowthMultiplier(
  reputation: number,
  hype: number
): number {
  let multiplier = 1.0;

  if (reputation <= 20) multiplier -= 0.5;
  else if (reputation <= 40) multiplier -= 0.25;
  else if (reputation <= 60) multiplier -= 0.1;

  if (hype >= 80) multiplier += 0.4;
  else if (hype >= 60) multiplier += 0.2;

  return Math.max(0.1, multiplier);
}

export function calculateNewUsers(
  users: number,
  hype: number,
  rng: () => number,
  multiplier: number = 1.0
): number {
  if (users < 1) return 1;
  const baseRate = 0.16 + hype / 100;
  const variance = rngRange(rng, 0.8, 1.2);
  return Math.max(1, Math.floor(users * baseRate * variance * multiplier));
}
