export type MetricStatus = "healthy" | "neutral" | "warning" | "critical";

export function getMetricStatus(metric: string, value: number): MetricStatus {
  switch (metric) {
    case "money":
      if (value > 2000) return "healthy";
      if (value > 500) return "neutral";
      if (value > 0) return "warning";
      return "critical";

    case "performance":
    case "reputation":
      if (value >= 80) return "healthy";
      if (value >= 50) return "neutral";
      if (value >= 25) return "warning";
      return "critical";

    case "hype":
      if (value >= 60) return "healthy";
      if (value >= 20) return "neutral";
      return "warning";

    case "techDebt":
      if (value <= 20) return "healthy";
      if (value <= 50) return "neutral";
      if (value <= 75) return "warning";
      return "critical";

    case "bugs":
      if (value === 0) return "healthy";
      if (value <= 3) return "neutral";
      if (value <= 8) return "warning";
      return "critical";

    default:
      return "neutral";
  }
}

export const statusClassName: Record<MetricStatus, string> = {
  healthy: "text-emerald-400",
  neutral: "text-zinc-300",
  warning: "text-amber-400",
  critical: "text-red-400",
};

export const statusBackgroundClassName: Record<MetricStatus, string> = {
  healthy: "bg-emerald-500/10",
  neutral: "bg-zinc-500/10",
  warning: "bg-amber-500/10",
  critical: "bg-red-500/10",
};
