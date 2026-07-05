"use client";

import React from "react";
import { MetricStatus, statusClassName } from "@/lib/metric-status";
import { MetricTooltip } from "@/components/game/feedback/metric-tooltip";

interface MetricRowProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  subvalue?: string;
  status?: MetricStatus;
  trend?: "up" | "down" | "stable";
  tooltipContent?: string;
}

export function MetricRow({
  icon: Icon,
  label,
  value,
  subvalue,
  status = "neutral",
  trend,
  tooltipContent,
}: MetricRowProps) {
  const statusColor = statusClassName[status];

  return (
    <div className="flex items-center justify-between py-1 text-[11px] border-b border-[#1f1f29]/30 last:border-0">
      <div className="flex items-center gap-2 min-w-0">
        <Icon className="size-3.5 text-slate-400 shrink-0" />
        <div className="min-w-0">
          <div className="flex items-center">
            <span className="text-slate-300 font-medium truncate block">{label}</span>
            {tooltipContent && <MetricTooltip content={tooltipContent} />}
          </div>
          {subvalue && (
            <span className="text-[9px] text-slate-500 block truncate leading-tight">
              {subvalue}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1.5 pl-2 shrink-0">
        <span className={`font-bold ${statusColor}`}>{value}</span>
        {trend && trend !== "stable" && (
          <span className={`text-[9px] ${trend === "up" ? "text-emerald-400" : "text-[#f43f5e]"}`}>
            {trend === "up" ? "▲" : "▼"}
          </span>
        )}
      </div>
    </div>
  );
}
