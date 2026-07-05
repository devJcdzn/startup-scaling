"use client";

import { useGameStore } from "@/game/store/game-store";
import { ActiveEffectCard } from "./active-effect-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ActiveEffectsPanel() {
  const modifiers = useGameStore((s) => s.activeModifiers);
  const day = useGameStore((s) => s.day);

  return (
    <Card className="bg-[#18181b] border-[#27272a]">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider">
          Active Effects
        </CardTitle>
      </CardHeader>
      <CardContent>
        {modifiers.length === 0 ? (
          <p className="text-xs text-[#52525b]">
            No active effects. Decisions will create persistent buffs or debuffs.
          </p>
        ) : (
          <div className="space-y-2">
            {modifiers.map((mod) => (
              <ActiveEffectCard key={mod.id} modifier={mod} currentDay={day} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
