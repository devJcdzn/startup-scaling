"use client";

interface MetricRowProps {
  label: string;
  value: string;
  status?: "healthy" | "neutral" | "warning" | "critical";
  trend?: "up" | "down" | "stable";
}

const STATUS_COLORS: Record<string, string> = {
  healthy: "#22c55e",
  neutral: "#a1a1aa",
  warning: "#f59e0b",
  critical: "#ef4444",
};

const TREND_ICONS: Record<string, string> = {
  up: "↑",
  down: "↓",
  stable: "—",
};

export function MetricRow({ label, value, status = "neutral", trend }: MetricRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-[#a1a1aa]">{label}</span>
      <div className="flex items-center gap-1.5">
        {trend && (
          <span className="text-[10px]" style={{ color: STATUS_COLORS[status] }}>
            {TREND_ICONS[trend]}
          </span>
        )}
        <span
          className="text-sm font-bold tabular-nums"
          style={{ color: STATUS_COLORS[status] }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}
