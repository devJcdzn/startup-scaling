"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface StatCardProps {
  label: string;
  value: number;
  maxValue?: number;
  color: string;
  icon: string;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function StatCard({
  label,
  value,
  maxValue = 100,
  color,
  icon,
}: StatCardProps) {
  const [flash, setFlash] = useState<"positive" | "negative" | null>(null);
  const [prevValue, setPrevValue] = useState(value);

  useEffect(() => {
    if (value > prevValue) setFlash("positive");
    else if (value < prevValue) setFlash("negative");
    setPrevValue(value);

    const timeout = setTimeout(() => setFlash(null), 600);
    return () => clearTimeout(timeout);
  }, [value, prevValue]);

  const progressValue = Math.min(100, Math.max(0, (value / maxValue) * 100));

  const flashColor =
    flash === "positive"
      ? "text-[#22c55e]"
      : flash === "negative"
        ? "text-[#ef4444]"
        : "";

  return (
    <Card className="bg-[#18181b] border-[#27272a] overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[#a1a1aa] flex items-center gap-1.5">
            <span className="text-base">{icon}</span>
            {label}
          </span>
          <AnimatePresence mode="popLayout">
            <motion.span
              key={value}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`text-sm font-bold tabular-nums ${flashColor}`}
            >
              {label === "Users" ? formatNumber(value) : value}
            </motion.span>
          </AnimatePresence>
        </div>
        <Progress value={progressValue} className="h-2">
          <ProgressTrack className="bg-[#27272a]">
            <ProgressIndicator style={{ backgroundColor: color }} />
          </ProgressTrack>
        </Progress>
      </CardContent>
    </Card>
  );
}
