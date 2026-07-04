export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return value.toLocaleString();
}

export function formatCurrency(value: number): string {
  const sign = value < 0 ? "-" : "";
  const absVal = Math.abs(value);
  if (absVal >= 1_000_000) return `${sign}$${(absVal / 1_000_000).toFixed(1)}M`;
  if (absVal >= 1_000) return `${sign}$${(absVal / 1_000).toFixed(1)}k`;
  return `${sign}$${absVal.toLocaleString()}`;
}

export function formatPercent(value: number): string {
  // If the value is a fraction (e.g. 0.024) format as 2.4%
  if (value > 0 && value < 1) {
    return `${(value * 100).toFixed(1)}%`;
  }
  return `${value.toFixed(1)}%`;
}

export function formatRunway(value: number | "profitable"): string {
  if (value === "profitable") return "Profitable";
  const months = Math.ceil(value / 30);
  return `${months} ${months === 1 ? "month" : "months"}`;
}
