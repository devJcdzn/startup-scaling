"use client";

import React from "react";

interface MetricTooltipProps {
  content: string;
}

export function MetricTooltip({ content }: MetricTooltipProps) {
  return (
    <span className="group relative ml-1 inline-flex items-center justify-center text-[8px] text-slate-500 hover:text-slate-300 font-bold bg-[#1f1f29] rounded-full size-3 cursor-help shrink-0 select-none">
      ?
      <span className="pointer-events-none absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block w-[180px] bg-[#121217] border border-[#1f1f29] p-2 text-[9px] text-slate-300 rounded shadow-xl text-left font-normal normal-case leading-relaxed">
        {content}
      </span>
    </span>
  );
}

export const metricDescriptions = {
  cash: "Money available to survive daily operations. Zero triggers company liquidation.",
  runway: "Months remaining at current net daily cashflow before running out of funds.",
  mrr: "Monthly recurring revenue base driven by paying customer base.",
  netCashflow: "Daily revenue inflow minus daily infrastructure and maintenance expenses.",
  users: "Total active accounts utilizing the platform.",
  conversion: "The rate at which total users convert to paying monthly subscribers.",
  stability: "Overall system reliability. Drop in stability leads to user churn.",
  techBacklog: "Active backlog bugs and technical debt percentage accumulating overhead.",
};
