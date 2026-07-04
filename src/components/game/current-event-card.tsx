"use client";

import type { GameEvent } from "@/game/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DecisionOptionCard } from "./decision-option-card";
import { motion } from "framer-motion";
import { useGameStore } from "@/game/store/game-store";
import { useState, useEffect } from "react";
import { STRINGS } from "@/game/content/strings";

interface CurrentEventCardProps {
  event: GameEvent;
  onChoose: (index: number) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  infrastructure: "#f59e0b",
  growth: "#3b82f6",
  product: "#8b5cf6",
  business: "#22c55e",
};

const SEVERITY_COLORS: Record<string, string> = {
  low: "#22c55e",
  medium: "#f59e0b",
  high: "#ef4444",
  critical: "#dc2626",
};

const EFFECT_LABELS: Record<string, string> = {
  users: "Users",
  money: "Cash",
  performance: "Performance",
  reputation: "Reputation",
  hype: "Hype",
  techDebt: "Tech Debt",
  bugs: "Bugs",
};

function formatEffect(key: string, value: number): string {
  const label = EFFECT_LABELS[key] ?? key;
  const sign = value > 0 ? "+" : "";
  return `${sign}${value} ${label}`;
}

export function CurrentEventCard({ event, onChoose }: CurrentEventCardProps) {
  const lastPenaltyTime = useGameStore((s) => s.lastPenaltyTime);
  const [countdown, setCountdown] = useState<number>(0);

  useEffect(() => {
    if (!event.delayPenalty) return;

    const interval = setInterval(() => {
      const now = performance.now();
      const elapsed = now - lastPenaltyTime;
      const remaining = Math.max(
        0,
        (event.delayPenalty!.intervalMs - elapsed) / 1000
      );
      setCountdown(remaining);
    }, 100);

    return () => clearInterval(interval);
  }, [event.delayPenalty, lastPenaltyTime]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <Card className="bg-[#18181b] border-[#27272a]">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className="text-[10px] uppercase font-bold"
              style={{
                borderColor: SEVERITY_COLORS[event.severity] ?? "#27272a",
                color: SEVERITY_COLORS[event.severity] ?? "#a1a1aa",
              }}
            >
              {event.severity}
            </Badge>
            <Badge
              variant="outline"
              className="text-[10px] uppercase font-bold"
              style={{
                borderColor: CATEGORY_COLORS[event.category] ?? "#27272a",
                color: CATEGORY_COLORS[event.category] ?? "#a1a1aa",
              }}
            >
              {event.category}
            </Badge>
          </div>
          <CardTitle className="text-lg text-[#fafafa]">{event.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-[#a1a1aa] leading-relaxed">
            {event.description}
          </p>

          {event.delayPenalty && (
            <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#ef4444]">
                  {STRINGS.event.penaltyIn(countdown)}
                </span>
                <span className="text-[10px] text-[#a1a1aa]">
                  Every {(event.delayPenalty.intervalMs / 1000).toFixed(0)}s
                </span>
              </div>
              <div className="text-xs text-[#a1a1aa]">
                <span className="font-medium">{STRINGS.event.ifIgnored}</span>{" "}
                {Object.entries(event.delayPenalty.effects)
                  .map(([key, value]) => formatEffect(key, value))
                  .join(", ")}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <span className="text-[10px] text-[#52525b] uppercase font-bold">
              {STRINGS.event.expectedImpact}
            </span>
            {event.choices.map((choice, i) => (
              <DecisionOptionCard
                key={i}
                choice={choice}
                index={i}
                onChoose={onChoose}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
