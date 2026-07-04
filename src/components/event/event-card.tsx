"use client";

import type { GameEvent } from "@/game/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useSound } from "@/hooks/use-sound";
import { useGameStore } from "@/game/store/game-store";
import { useState, useEffect } from "react";

interface EventCardProps {
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

function formatEffects(effects: Record<string, number>): string {
  return Object.entries(effects)
    .map(([key, value]) => {
      const sign = value > 0 ? "+" : "";
      const label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase());
      return `${sign}${value} ${label}`;
    })
    .join(", ");
}

export function EventCard({ event, onChoose }: EventCardProps) {
  const { playClick } = useSound();
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
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="outline"
              className="text-xs"
              style={{
                borderColor: CATEGORY_COLORS[event.category] ?? "#27272a",
                color: CATEGORY_COLORS[event.category] ?? "#a1a1aa",
              }}
            >
              {event.category}
            </Badge>
            <Badge
              variant="outline"
              className="text-xs"
              style={{
                borderColor: SEVERITY_COLORS[event.severity] ?? "#27272a",
                color: SEVERITY_COLORS[event.severity] ?? "#a1a1aa",
              }}
            >
              {event.severity}
            </Badge>
          </div>
          <CardTitle className="text-lg text-[#fafafa]">{event.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-[#a1a1aa]">{event.description}</p>

          {event.delayPenalty && (
            <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#ef4444]">
                  Penalty in: {countdown.toFixed(1)}s
                </span>
                <span className="text-xs text-[#a1a1aa]">
                  Every {(event.delayPenalty.intervalMs / 1000).toFixed(0)}s
                </span>
              </div>
              <div className="text-xs text-[#a1a1aa]">
                If you delay: {formatEffects(event.delayPenalty.effects)}
              </div>
            </div>
          )}

          <div className="space-y-2">
            {event.choices.map((choice, i) => (
              <Button
                key={i}
                variant="outline"
                className="w-full justify-between text-left h-auto py-3 px-4 border-[#27272a] hover:border-[#3b82f6] hover:bg-[#1e293b] transition-colors"
                onClick={() => {
                  playClick();
                  onChoose(i);
                }}
              >
                <span className="text-sm font-medium text-[#fafafa]">
                  {choice.text}
                </span>
                <span className="text-xs text-[#a1a1aa] ml-2">
                  {formatEffects(choice.effects)}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
