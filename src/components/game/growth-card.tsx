"use client";

import { MetricCard } from "./metric-card";
import { MetricRow } from "./metric-row";
import { STRINGS } from "@/game/content/strings";

interface GrowthCardProps {
  users: number;
  newUsersToday: number;
  hype: number;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function getHypeStatus(v: number): "healthy" | "warning" | "critical" {
  if (v >= 60) return "healthy";
  if (v >= 30) return "warning";
  return "critical";
}

export function GrowthCard({ users, newUsersToday, hype }: GrowthCardProps) {
  const prevUsers = users - newUsersToday;
  const growthRate = prevUsers > 0 ? (newUsersToday / prevUsers) * 100 : 0;

  return (
    <MetricCard title={STRINGS.cards.growth} icon="🚀" accentColor="#8b5cf6">
      <MetricRow
        label={STRINGS.metrics.users}
        value={formatNumber(users)}
        status="neutral"
      />
      <MetricRow
        label={STRINGS.metrics.newToday}
        value={`+${formatNumber(newUsersToday)}`}
        status="healthy"
        trend="up"
      />
      <MetricRow
        label={STRINGS.metrics.hype}
        value={`${hype}/100`}
        status={getHypeStatus(hype)}
      />
      <MetricRow
        label={STRINGS.metrics.growthRate}
        value={`+${growthRate.toFixed(1)}%`}
        status={growthRate > 10 ? "healthy" : growthRate > 5 ? "warning" : "critical"}
        trend={growthRate > 10 ? "up" : growthRate > 5 ? "stable" : "down"}
      />
    </MetricCard>
  );
}
