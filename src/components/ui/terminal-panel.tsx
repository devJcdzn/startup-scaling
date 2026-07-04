"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TerminalPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: React.ReactNode;
  showControls?: boolean;
}

export function TerminalPanel({
  title,
  children,
  className,
  showControls = true,
  ...props
}: TerminalPanelProps) {
  return (
    <div
      className={cn(
        "relative border border-[#2e2e38] bg-[#1a1a1e] font-mono text-[#e2e8f0] rounded flex flex-col min-h-0",
        className
      )}
      {...props}
    >
      {/* Modern Window/Tab Header */}
      <div className="flex items-center justify-between border-b border-[#2e2e38] px-3 py-1.5 bg-[#141417] text-[10px] select-none text-slate-400 font-semibold shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-primary font-bold font-mono">&gt;</span>
          <span className="tracking-wider uppercase font-mono">{title || "terminal"}</span>
        </div>
        
        {showControls && (
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-rose-500/60"></span>
            <span className="size-2 rounded-full bg-amber-500/60"></span>
            <span className="size-2 rounded-full bg-emerald-500/60"></span>
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="flex-1 min-h-0 p-3.5 flex flex-col text-xs">
        {children}
      </div>
    </div>
  );
}
