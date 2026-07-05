"use client";

import { useGameStore } from "@/game/store/game-store";
import { useShallow } from "zustand/shallow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RiskItem {
  label: string;
  value: string;
  status: "healthy" | "warning" | "critical";
  detail?: string;
}

export function AtRiskPanel() {
  const stats = useGameStore(
    useShallow((s) => ({
      money: s.money,
      runwayDays: s.runwayDays,
      performance: s.performance,
      reputation: s.reputation,
      users: s.users,
      day: s.day,
    }))
  );

  const risks: RiskItem[] = [];

  // Cash risk
  if (stats.runwayDays === "profitable") {
    risks.push({
      label: "Cash",
      value: "Healthy",
      status: "healthy",
      detail: "Profitable operations",
    });
  } else if (stats.runwayDays <= 7) {
    risks.push({
      label: "Cash",
      value: `${stats.runwayDays} days runway`,
      status: "critical",
      detail: "May run out of cash soon",
    });
  } else if (stats.runwayDays <= 30) {
    risks.push({
      label: "Cash",
      value: `${stats.runwayDays} days runway`,
      status: "warning",
      detail: "Runway getting short",
    });
  } else {
    risks.push({
      label: "Cash",
      value: `${stats.runwayDays} days`,
      status: "healthy",
    });
  }

  // Stability risk
  if (stats.performance >= 70) {
    risks.push({
      label: "Stability",
      value: `${stats.performance}/100`,
      status: "healthy",
    });
  } else if (stats.performance >= 40) {
    risks.push({
      label: "Stability",
      value: `${stats.performance}/100`,
      status: "warning",
      detail: "May reduce conversion",
    });
  } else {
    risks.push({
      label: "Stability",
      value: `${stats.performance}/100`,
      status: "critical",
      detail: "At risk of reputation loss",
    });
  }

  // Reputation risk
  if (stats.reputation >= 70) {
    risks.push({
      label: "Reputation",
      value: `${stats.reputation}/100`,
      status: "healthy",
    });
  } else if (stats.reputation >= 40) {
    risks.push({
      label: "Reputation",
      value: `${stats.reputation}/100`,
      status: "warning",
      detail: "Conversion may suffer",
    });
  } else {
    risks.push({
      label: "Reputation",
      value: `${stats.reputation}/100`,
      status: "critical",
      detail: "Users may leave",
    });
  }

  // Scale goal
  const expectedUsers = Math.floor((1_000_000 / 30) * stats.day);
  const progress = stats.users / expectedUsers;
  if (progress >= 1) {
    risks.push({
      label: "Scale Goal",
      value: `${(stats.users / 1000).toFixed(0)}K / 1M`,
      status: "healthy",
      detail: "On track",
    });
  } else if (progress >= 0.5) {
    risks.push({
      label: "Scale Goal",
      value: `${(stats.users / 1000).toFixed(0)}K / 1M`,
      status: "warning",
      detail: "Behind pace",
    });
  } else {
    risks.push({
      label: "Scale Goal",
      value: `${(stats.users / 1000).toFixed(0)}K / 1M`,
      status: "critical",
      detail: "Critical — may not reach 1M",
    });
  }

  return (
    <Card className="bg-[#121217] border border-[#1f1f29]">
      <CardHeader className="pb-2">
        <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          At Risk
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {risks.map((risk, i) => (
          <div key={i} className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400">{risk.label}</span>
            <div className="flex items-center gap-2">
              {risk.detail && (
                <span className="text-slate-600 text-[8px]">{risk.detail}</span>
              )}
              <span
                className={`font-bold ${
                  risk.status === "healthy"
                    ? "text-emerald-400"
                    : risk.status === "warning"
                      ? "text-amber-400"
                      : "text-rose-400"
                }`}
              >
                {risk.value}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
