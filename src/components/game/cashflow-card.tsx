"use client";

import { MetricCard } from "./metric-card";
import { MetricRow } from "./metric-row";
import { STRINGS } from "@/game/content/strings";

interface CashflowCardProps {
  money: number;
  dailyRevenue: number;
  dailyExpenses: number;
  dailyBalance: number;
  runwayDays: number | "profitable";
}

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

function getBalanceStatus(balance: number, runway: number | "profitable"): "healthy" | "warning" | "critical" {
  if (balance >= 0) return "healthy";
  if (runway !== "profitable" && runway <= 5) return "critical";
  return "warning";
}

function getRunwayStatus(runway: number | "profitable"): "healthy" | "warning" | "critical" {
  if (runway === "profitable") return "healthy";
  if (runway <= 5) return "critical";
  if (runway <= 15) return "warning";
  return "healthy";
}

export function CashflowCard({
  money,
  dailyRevenue,
  dailyExpenses,
  dailyBalance,
  runwayDays,
}: CashflowCardProps) {
  const balanceStatus = getBalanceStatus(dailyBalance, runwayDays);
  const runwayStatus = getRunwayStatus(runwayDays);

  return (
    <MetricCard title={STRINGS.cards.cashflow} icon="💰" accentColor="#22c55e">
      <MetricRow
        label={STRINGS.metrics.cash}
        value={formatMoney(money)}
        status="neutral"
      />
      <MetricRow
        label={STRINGS.metrics.dailyRevenue}
        value={`+${formatMoney(dailyRevenue)}`}
        status="healthy"
      />
      <MetricRow
        label={STRINGS.metrics.dailyExpenses}
        value={`-${formatMoney(dailyExpenses)}`}
        status="warning"
      />
      <MetricRow
        label={STRINGS.metrics.dailyBalance}
        value={`${dailyBalance >= 0 ? "+" : ""}${formatMoney(dailyBalance)}`}
        status={balanceStatus}
      />
      <MetricRow
        label={STRINGS.metrics.runway}
        value={
          runwayDays === "profitable"
            ? STRINGS.runway.profitable
            : STRINGS.runway.days(runwayDays)
        }
        status={runwayStatus}
      />
    </MetricCard>
  );
}
