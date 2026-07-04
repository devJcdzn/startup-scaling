"use client";

import React from "react";
import { MetricCard } from "./metric-card";
import { MetricRow } from "./metric-row";
import { metricIcons } from "@/lib/icons";
import { formatCurrency, formatCompactNumber, formatPercent, formatRunway } from "@/lib/formatters";
import { getMetricStatus } from "@/lib/metric-status";

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
    hype: stats.hype + (activeEffects?.hype || 0),
    performance: stats.performance + (activeEffects?.performance || 0),
    techDebt: stats.techDebt + (activeEffects?.techDebt || 0),
    bugs: stats.bugs + (activeEffects?.bugs || 0),
  };

  const isPreviewing = !!activeEffects;

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4 shrink-0">
      {/* 1. LIQUID RESERVES */}
      <MetricCard title="Liquid Reserves" icon={metricIcons.cash}>
        <MetricRow
          icon={metricIcons.cash}
          label="Cash Balance"
          value={formatCurrency(isPreviewing ? preview.money : stats.money)}
          subvalue={isPreviewing && activeEffects?.money ? `${activeEffects.money > 0 ? "+" : ""}${formatCurrency(activeEffects.money)}` : "Available runway capital"}
          status={getMetricStatus("money", isPreviewing ? preview.money : stats.money)}
        />
        <MetricRow
          icon={metricIcons.runway}
          label="Runway"
          value={formatRunway(stats.runwayDays)}
          subvalue="Expected operations lifetime"
          status={stats.runwayDays === "profitable" ? "healthy" : (stats.runwayDays < 60 ? "critical" : "neutral")}
        />
      </MetricCard>

      {/* 2. REVENUE STREAMS */}
      <MetricCard title="Revenue Streams" icon={metricIcons.mrr}>
        <MetricRow
          icon={metricIcons.mrr}
          label="Recurring MRR"
          value={formatCurrency(isPreviewing ? preview.mrr : stats.mrr)}
          subvalue="Monthly revenue base"
          status="healthy"
          trend={isPreviewing && activeEffects?.money ? (activeEffects.money > 0 ? "up" : "down") : "stable"}
        />
        <MetricRow
          icon={metricIcons.dailyRevenue}
          label="Net Cashflow"
          value={`${stats.dailyBalance >= 0 ? "+" : ""}${formatCurrency(stats.dailyBalance)}/d`}
          subvalue={`In: ${formatCurrency(stats.dailyRevenue)} · Out: ${formatCurrency(stats.dailyExpenses)}`}
          status={stats.dailyBalance > 0 ? "healthy" : (stats.dailyBalance < -100 ? "critical" : "neutral")}
        />
      </MetricCard>

      {/* 3. ACQUISITION & GROWTH */}
      <MetricCard title="Acquisition & Growth" icon={metricIcons.users}>
        <MetricRow
          icon={metricIcons.users}
          label="Customers"
          value={formatCompactNumber(isPreviewing ? preview.users : stats.users)}
          subvalue={`${formatCompactNumber(stats.payingUsers)} paying subscriptions`}
          status="neutral"
          trend={isPreviewing && activeEffects?.users ? (activeEffects.users > 0 ? "up" : "down") : "stable"}
        />
        <MetricRow
          icon={metricIcons.conversionRate}
          label="Conversion"
          value={formatPercent(stats.conversionRate)}
          subvalue={`Brand Hype: ${isPreviewing ? preview.hype : stats.hype}%`}
          status={getMetricStatus("hype", isPreviewing ? preview.hype : stats.hype)}
        />
      </MetricCard>

      {/* 4. PLATFORM CAPACITY */}
      <MetricCard title="Platform capacity" icon={metricIcons.performance}>
        <MetricRow
          icon={metricIcons.performance}
          label="Platform Stability"
          value={formatPercent(isPreviewing ? preview.performance : stats.performance)}
          subvalue={`Reputation: ${isPreviewing ? preview.reputation : stats.reputation}/100`}
          status={getMetricStatus("performance", isPreviewing ? preview.performance : stats.performance)}
          trend={isPreviewing && activeEffects?.performance ? (activeEffects.performance > 0 ? "up" : "down") : "stable"}
        />
        <MetricRow
          icon={metricIcons.techDebt}
          label="Tech Backlog"
          value={`${isPreviewing ? preview.bugs : stats.bugs} bugs`}
          subvalue={`Technical Debt: ${isPreviewing ? preview.techDebt : stats.techDebt}%`}
          status={getMetricStatus("techDebt", isPreviewing ? preview.techDebt : stats.techDebt)}
        />
      </MetricCard>
    </div>
  );
}
