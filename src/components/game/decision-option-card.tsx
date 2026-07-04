"use client";

import type { Choice } from "@/game/types";
import { Button } from "@/components/ui/button";
import { useSound } from "@/hooks/use-sound";

interface DecisionOptionCardProps {
  choice: Choice;
  index: number;
  onChoose: (index: number) => void;
}

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

export function DecisionOptionCard({
  choice,
  index,
  onChoose,
}: DecisionOptionCardProps) {
  const { playClick } = useSound();

  return (
    <Button
      variant="outline"
      className="w-full justify-start text-left h-auto py-3 px-4 border-[#27272a] hover:border-[#3b82f6] hover:bg-[#1e293b] transition-colors"
      onClick={() => {
        playClick();
        onChoose(index);
      }}
    >
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-[#fafafa]">
          [{index + 1}] {choice.text}
        </span>
        <div className="flex flex-wrap gap-2 text-xs">
          {Object.entries(choice.effects).map(([key, value]) => (
            <span
              key={key}
              className={
                value > 0 ? "text-[#22c55e]" : "text-[#ef4444]"
              }
            >
              {formatEffect(key, value)}
            </span>
          ))}
        </div>
      </div>
    </Button>
  );
}
