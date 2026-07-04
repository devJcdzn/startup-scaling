export function calculateDifficulty(users: number): number {
  return Math.log10(Math.max(1, users)) / 2;
}
