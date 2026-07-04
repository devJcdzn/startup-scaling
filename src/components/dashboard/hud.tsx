"use client";

import { StatCard } from "./stat-card";
import { EconomyCard } from "./economy-card";
import { useGameStats } from "@/game/store/game-store";
import { Badge } from "@/components/ui/badge";

const STATS = [
  { key: "users" as const, label: "Users", icon: "👥", color: "#3b82f6", maxValue: 1_000_000 },
  { key: "performance" as const, label: "Performance", icon: "⚡", color: "#f59e0b", maxValue: 100 },
  { key: "reputation" as const, label: "Reputation", icon: "⭐", color: "#8b5cf6", maxValue: 100 },
  { key: "hype" as const, label: "Hype", icon: "🔥", color: "#ef4444", maxValue: 100 },
  { key: "techDebt" as const, label: "Tech Debt", icon: "🐛", color: "#ec4899", maxValue: 100 },
  { key: "bugs" as const, label: "Bugs", icon: "🐞", color: "#ef4444", maxValue: 100 },
];

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

function formatRunway(runway: number | "profitable"): string {
  if (runway === "profitable") return "Profitable";
  return `${runway} days`;
}

function getRunwayColor(runway: number | "profitable"): string {
  if (runway === "profitable") return "#22c55e";
  if (runway <= 5) return "#ef4444";
  if (runway <= 10) return "#f59e0b";
  return "#22c55e";
}

export function HUD() {
  const stats = useGameStats();

  const dayProgress = (stats.day / 30) * 100;

  const cashItems = [
    { label: "Money", value: formatMoney(stats.money), color: "#fafafa" },
    {
      label: "Daily Balance",
      value: `${stats.dailyBalance >= 0 ? "+" : ""}${formatMoney(stats.dailyBalance)}`,
      color: stats.dailyBalance >= 0 ? "#22c55e" : "#ef4444",
    },
    {
      label: "Runway",
      value: formatRunway(stats.runwayDays),
      color: getRunwayColor(stats.runwayDays),
    },
  ];

  const revenueItems = [
    { label: "MRR", value: formatMoney(stats.mrr), color: "#22c55e" },
    { label: "Revenue/day", value: `+${formatMoney(stats.dailyRevenue)}`, color: "#22c55e" },
    { label: "Paying Users", value: stats.payingUsers.toLocaleString(), color: "#3b82f6" },
    { label: "Conversion", value: `${(stats.conversionRate * 100).toFixed(1)}%`, color: "#3b82f6" },
  ];

  const breakdown = stats.dailyExpensesBreakdown;
  const expenseItems = [
    { label: "Expenses/day", value: `-${formatMoney(stats.dailyExpenses)}`, color: "#ef4444" },
    { label: "Base Ops", value: `-${formatMoney(breakdown.base)}`, color: "#a1a1aa" },
    { label: "Infrastructure", value: `-${formatMoney(breakdown.infrastructure)}`, color: "#a1a1aa" },
    { label: "Tech Debt", value: `-${formatMoney(breakdown.techDebt)}`, color: breakdown.techDebt > 0 ? "#f59e0b" : "#a1a1aa" },
    { label: "Bugs", value: `-${formatMoney(breakdown.bugs)}`, color: breakdown.bugs > 0 ? "#ef4444" : "#a1a1aa" },
    { label: "Performance", value: `-${formatMoney(breakdown.performance)}`, color: breakdown.performance > 0 ? "#f59e0b" : "#a1a1aa" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-[#fafafa]">
            Day {stats.day} <span className="text-[#a1a1aa] font-normal">/ 30</span>
          </h2>
          {stats.timeScale < 1 && (
            <Badge variant="outline" className="text-[#f59e0b] border-[#f59e0b]/30 text-xs">
              Decision Active
            </Badge>
          )}
        </div>
        <Badge variant="outline" className="text-[#a1a1aa] border-[#27272a]">
          Difficulty: {stats.difficulty.toFixed(1)}
        </Badge>
      </div>

      <div className="w-full bg-[#27272a] rounded-full h-1.5">
        <div
          className="bg-[#3b82f6] h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${dayProgress}%` }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <EconomyCard
          title="Cash"
          icon="💰"
          items={cashItems}
          accentColor="#22c55e"
        />
        <EconomyCard
          title="Revenue"
          icon="📈"
          items={revenueItems}
          accentColor="#3b82f6"
        />
        <EconomyCard
          title="Expenses"
          icon="📉"
          items={expenseItems}
          accentColor="#ef4444"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {STATS.map((stat) => (
          <StatCard
            key={stat.key}
            label={stat.label}
            value={stats[stat.key]}
            maxValue={stat.maxValue}
            color={stat.color}
            icon={stat.icon}
          />
        ))}
      </div>
    </div>
  );
}
