"use client";

import React from "react";
import { MetricCard } from "./metric-card";
import { MetricRow } from "./metric-row";
import { metricIcons } from "@/lib/icons";
import { formatCurrency, formatCompactNumber, formatPercent, formatRunway } from "@/lib/formatters";
import { getMetricStatus } from "@/lib/metric-status";
import { metricDescriptions } from "@/components/game/feedback/metric-tooltip";

interface MetricsGridProps {
  stats: {
    money: number;
    dailyBalance: number;
    runwayDays: number | "profitable";
    mrr: number;
    dailyRevenue: number;
    dailyExpenses: number;
    users: number;
    payingUsers: number;
    conversionRate: number;
    hype: number;
    performance: number;
    reputation: number;
    techDebt: number;
    bugs: number;
  };
  activeEffects?: Record<string, number> | null;
}

export function MetricsGrid({ stats, activeEffects }: MetricsGridProps) {
  // Apply preview effects if hover is active
  const preview = {
    money: stats.money + (activeEffects?.money || 0),
    mrr: stats.mrr + (activeEffects?.money ? Math.round(activeEffects.money * 0.05) : 0),
    users: stats.users + (activeEffects?.users || 0),
    reputation: stats.reputation + (activeEffects?.reputation || 0),
    performance: stats.performance + (activeEffects?.performance || 0),
    techDebt: stats.techDebt + (activeEffects?.techDebt || 0),
    bugs: stats.bugs + (activeEffects?.bugs || 0),
    hype: stats.hype + (activeEffects?.hype || 0),
  };

  const isPreviewing = !!activeEffects;

  return (
    <div className="grid grid-cols-4 gap-3 shrink-0 select-none px-3 pt-3 bg-[#0b0b0f]">
      {/* 1. CASHFLOW */}
      <div className="h-[88px] overflow-hidden">
        <MetricCard title="Cashflow" icon={metricIcons.cash}>
          <MetricRow
            icon={metricIcons.cash}
            label="Cash"
            value={formatCurrency(isPreviewing ? preview.money : stats.money)}
            status={getMetricStatus("money", isPreviewing ? preview.money : stats.money)}
            tooltipContent={metricDescriptions.cash}
          />
          <MetricRow
            icon={metricIcons.dailyBalance}
            label="Burn"
            value={`${stats.dailyBalance >= 0 ? "+" : ""}${formatCurrency(stats.dailyBalance)}/d`}
            status={stats.dailyBalance >= 0 ? "healthy" : "warning"}
            tooltipContent={metricDescriptions.netCashflow}
          />
          <MetricRow
            icon={metricIcons.runway}
            label="Runway"
            value={formatRunway(stats.runwayDays)}
            status={stats.runwayDays === "profitable" ? "healthy" : (stats.runwayDays < 60 ? "critical" : "neutral")}
            tooltipContent={metricDescriptions.runway}
          />
        </MetricCard>
      </div>

      {/* 2. REVENUE */}
      <div className="h-[88px] overflow-hidden">
        <MetricCard title="Revenue" icon={metricIcons.mrr}>
          <MetricRow
            icon={metricIcons.mrr}
            label="MRR"
            value={formatCurrency(isPreviewing ? preview.mrr : stats.mrr)}
            status="healthy"
            trend={isPreviewing && activeEffects?.money ? (activeEffects.money > 0 ? "up" : "down") : "stable"}
            tooltipContent={metricDescriptions.mrr}
          />
          <MetricRow
            icon={metricIcons.conversionRate}
            label="Conv"
            value={formatPercent(stats.conversionRate)}
            tooltipContent={metricDescriptions.conversion}
          />
          <MetricRow
            icon={metricIcons.payingUsers}
            label="CAC"
            value={`$${Math.max(4, 25 - (isPreviewing ? preview.hype : stats.hype) * 0.2).toFixed(1)}`}
          />
        </MetricCard>
      </div>

      {/* 3. GROWTH */}
      <div className="h-[88px] overflow-hidden">
        <MetricCard title="Growth" icon={metricIcons.users}>
          <MetricRow
            icon={metricIcons.users}
            label="Users"
            value={formatCompactNumber(isPreviewing ? preview.users : stats.users)}
            status="neutral"
            trend={isPreviewing && activeEffects?.users ? (activeEffects.users > 0 ? "up" : "down") : "stable"}
            tooltipContent={metricDescriptions.users}
          />
          <MetricRow
            icon={metricIcons.payingUsers}
            label="New Today"
            value={`+${formatCompactNumber(stats.payingUsers)}`}
          />
          <MetricRow
            icon={metricIcons.hype}
            label="Hype"
            value={`${isPreviewing ? preview.hype : stats.hype}%`}
            status={getMetricStatus("hype", isPreviewing ? preview.hype : stats.hype)}
          />
        </MetricCard>
      </div>

      {/* 4. PRODUCT */}
      <div className="h-[88px] overflow-hidden">
        <MetricCard title="Product" icon={metricIcons.performance}>
          <MetricRow
            icon={metricIcons.performance}
            label="Stability"
            value={formatPercent(isPreviewing ? preview.performance : stats.performance)}
            status={getMetricStatus("performance", isPreviewing ? preview.performance : stats.performance)}
            trend={isPreviewing && activeEffects?.performance ? (activeEffects.performance > 0 ? "up" : "down") : "stable"}
            tooltipContent={metricDescriptions.stability}
          />
          <MetricRow
            icon={metricIcons.reputation}
            label="Reputation"
            value={`${isPreviewing ? preview.reputation : stats.reputation}/100`}
            status={getMetricStatus("reputation", isPreviewing ? preview.reputation : stats.reputation)}
          />
          <MetricRow
            icon={metricIcons.techDebt}
            label="Debt/Bugs"
            value={`${isPreviewing ? preview.techDebt : stats.techDebt}% · ${isPreviewing ? preview.bugs : stats.bugs} B`}
            status={getMetricStatus("techDebt", isPreviewing ? preview.techDebt : stats.techDebt)}
            tooltipContent={metricDescriptions.techBacklog}
          />
        </MetricCard>
      </div>
    </div>
  );
}
