"use client";

import { StatCard } from "./stat-card";
import { useGameStats } from "@/game/store/game-store";
import { Badge } from "@/components/ui/badge";

const STATS = [
  { key: "users" as const, label: "Users", icon: "👥", color: "#3b82f6", maxValue: 1_000_000 },
  { key: "money" as const, label: "Money", icon: "💰", color: "#22c55e", maxValue: 5000 },
  { key: "performance" as const, label: "Performance", icon: "⚡", color: "#f59e0b", maxValue: 100 },
  { key: "reputation" as const, label: "Reputation", icon: "⭐", color: "#8b5cf6", maxValue: 100 },
  { key: "hype" as const, label: "Hype", icon: "🔥", color: "#ef4444", maxValue: 100 },
  { key: "techDebt" as const, label: "Tech Debt", icon: "🐛", color: "#ec4899", maxValue: 100 },
  { key: "bugs" as const, label: "Bugs", icon: "🐞", color: "#ef4444", maxValue: 100 },
];

export function HUD() {
  const stats = useGameStats();

  const dayProgress = (stats.day / 30) * 100;

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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
