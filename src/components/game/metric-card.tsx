"use client";

import React from "react";

interface MetricCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

export function MetricCard({ title, icon: Icon, children }: MetricCardProps) {
  return (
    <div className="bg-[#121217] border border-[#1f1f29] rounded p-2.5 shadow-sm max-h-[160px] flex flex-col justify-between select-none">
      <div className="flex items-center gap-1.5 border-b border-[#1f1f29]/80 pb-1 mb-1.5 shrink-0">
        <Icon className="size-3.5 text-[#10b981]" />
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          {title}
        </span>
      </div>
      <div className="flex-1 min-h-0 flex flex-col justify-center space-y-1">
        {children}
      </div>
    </div>
  );
}
