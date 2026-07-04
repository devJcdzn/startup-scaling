export function calculateRunway(
  money: number,
  dailyBalance: number
): number | "profitable" {
  if (dailyBalance >= 0) return "profitable";
  return Math.floor(money / Math.abs(dailyBalance));
}
