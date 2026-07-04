"use client";

import { MetricCard } from "./metric-card";
import { MetricRow } from "./metric-row";
import { STRINGS } from "@/game/content/strings";

interface ProductHealthCardProps {
  performance: number;
  reputation: number;
  bugs: number;
  techDebt: number;
}

function getPerformanceStatus(v: number): "healthy" | "warning" | "critical" {
  if (v >= 70) return "healthy";
  if (v >= 40) return "warning";
  return "critical";
}

function getReputationStatus(v: number): "healthy" | "warning" | "critical" {
  if (v >= 70) return "healthy";
  if (v >= 40) return "warning";
  return "critical";
}

function getBugsStatus(v: number): "healthy" | "warning" | "critical" {
  if (v <= 10) return "healthy";
  if (v <= 40) return "warning";
  return "critical";
}

function getTechDebtStatus(v: number): "healthy" | "warning" | "critical" {
  if (v <= 30) return "healthy";
  if (v <= 70) return "warning";
  return "critical";
}

export function ProductHealthCard({
  performance,
  reputation,
  bugs,
  techDebt,
}: ProductHealthCardProps) {
  return (
    <MetricCard
      title={STRINGS.cards.productHealth}
      icon="⚡"
      accentColor="#f59e0b"
    >
      <MetricRow
        label={STRINGS.metrics.performance}
        value={`${performance}/100`}
        status={getPerformanceStatus(performance)}
      />
      <MetricRow
        label={STRINGS.metrics.reputation}
        value={`${reputation}/100`}
        status={getReputationStatus(reputation)}
      />
      <MetricRow
        label={STRINGS.metrics.bugs}
        value={`${bugs}`}
        status={getBugsStatus(bugs)}
      />
      <MetricRow
        label={STRINGS.metrics.techDebt}
        value={`${techDebt}/100`}
        status={getTechDebtStatus(techDebt)}
      />
    </MetricCard>
  );
}
