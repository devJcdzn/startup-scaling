"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TerminalProgressProps {
  value: number; // 0 to 100
  length?: number;
  showPercent?: boolean;
  className?: string;
  fillChar?: string;
  emptyChar?: string;
}

export function TerminalProgress({
  value,
  length = 15,
  showPercent = true,
  className = "",
  fillChar = "■",
  emptyChar = "·",
}: TerminalProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const filledCount = Math.round((clamped / 100) * length);
  const emptyCount = length - filledCount;

  const bar = fillChar.repeat(filledCount) + emptyChar.repeat(emptyCount);

  return (
    <div className={cn("font-mono text-[11px] inline-flex items-center gap-1.5 select-none", className)}>
      <span className="text-primary font-bold tracking-wider">{bar}</span>
      {showPercent && (
        <span className="min-w-[4ch] text-right font-bold text-slate-300">{Math.round(clamped)}%</span>
      )}
    </div>
  );
}
