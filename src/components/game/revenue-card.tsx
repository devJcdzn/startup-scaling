"use client";

import { MetricCard } from "./metric-card";
import { MetricRow } from "./metric-row";
import { STRINGS } from "@/game/content/strings";

interface RevenueCardProps {
  users: number;
  payingUsers: number;
  conversionRate: number;
  arpu: number;
  mrr: number;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

export function RevenueCard({
  users,
  payingUsers,
  conversionRate,
  arpu,
  mrr,
}: RevenueCardProps) {
  return (
    <MetricCard title={STRINGS.cards.revenue} icon="📈" accentColor="#3b82f6">
      <MetricRow
        label={STRINGS.metrics.users}
        value={formatNumber(users)}
        status="neutral"
      />
      <MetricRow
        label={STRINGS.metrics.payingUsers}
        value={formatNumber(payingUsers)}
        status="healthy"
      />
      <MetricRow
        label={STRINGS.metrics.conversion}
        value={`${(conversionRate * 100).toFixed(1)}%`}
        status={conversionRate >= 0.02 ? "healthy" : "warning"}
      />
      <MetricRow
        label={STRINGS.metrics.arpu}
        value={`$${arpu}`}
        status="neutral"
      />
      <MetricRow
        label={STRINGS.metrics.mrr}
        value={formatMoney(mrr)}
        status="healthy"
      />
    </MetricCard>
  );
}
