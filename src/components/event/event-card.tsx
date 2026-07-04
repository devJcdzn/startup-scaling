"use client";

import type { GameEvent } from "@/game/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useSound } from "@/hooks/use-sound";

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
          </div>
          <CardTitle className="text-lg text-[#fafafa]">{event.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-[#a1a1aa]">{event.description}</p>
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
