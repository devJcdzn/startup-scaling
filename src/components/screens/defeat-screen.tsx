"use client";

import { useGameStore, useGameStats } from "@/game/store/game-store";
import { useSound } from "@/hooks/use-sound";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { STRINGS } from "@/game/content/strings";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

function getDefeatInfo(
  money: number,
  performance: number,
  reputation: number,
  day: number,
  users: number
): { title: string; message: string; reason: string } {
  if (money <= 0) return { ...STRINGS.defeat.cash, reason: "Ran out of cash" };
  if (performance <= 0) return { ...STRINGS.defeat.performance, reason: "Performance collapsed" };
  if (reputation <= 0) return { ...STRINGS.defeat.reputation, reason: "Reputation destroyed" };
  if (day >= 30 && users < 1_000_000) return { ...STRINGS.defeat.deadline, reason: "Didn't scale enough" };
  return { title: "Game Over", message: "Something went wrong.", reason: "Unknown" };
}

export function DefeatScreen() {
  const restart = useGameStore((s) => s.restart);
  const stats = useGameStats();
  const { playClick } = useSound();

  const defeat = getDefeatInfo(
    stats.money,
    stats.performance,
    stats.reputation,
    stats.day,
    stats.users
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#09090b]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-6"
      >
        <div className="text-center space-y-2">
          <motion.h1
            className="text-4xl font-bold text-[#ef4444]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {defeat.title}
          </motion.h1>
          <motion.p
            className="text-sm text-[#a1a1aa]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {defeat.message}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-[#18181b] border-[#27272a]">
            <CardContent className="p-4 space-y-3">
              <div className="text-[10px] text-[#52525b] uppercase font-bold tracking-wider">
                Run Summary
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-[#a1a1aa]">Result</span>
                  <div className="font-bold text-[#ef4444]">Failed</div>
                </div>
                <div>
                  <span className="text-[#a1a1aa]">Reason</span>
                  <div className="font-bold text-[#fafafa]">{defeat.reason}</div>
                </div>
                <div>
                  <span className="text-[#a1a1aa]">Survived</span>
                  <div className="font-bold text-[#fafafa]">{stats.day} / 30 days</div>
                </div>
                <div>
                  <span className="text-[#a1a1aa]">Peak Users</span>
                  <div className="font-bold text-[#3b82f6]">{formatNumber(stats.users)}</div>
                </div>
                <div>
                  <span className="text-[#a1a1aa]">Final MRR</span>
                  <div className="font-bold text-[#22c55e]">{formatMoney(stats.mrr)}</div>
                </div>
                <div>
                  <span className="text-[#a1a1aa]">Final Cash</span>
                  <div className="font-bold text-[#ef4444]">{formatMoney(stats.money)}</div>
                </div>
                <div>
                  <span className="text-[#a1a1aa]">Performance</span>
                  <div className="font-bold text-[#f59e0b]">{stats.performance}%</div>
                </div>
                <div>
                  <span className="text-[#a1a1aa]">Reputation</span>
                  <div className="font-bold text-[#8b5cf6]">{stats.reputation}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Button
            size="lg"
            className="bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold"
            onClick={() => {
              playClick();
              restart();
            }}
          >
            Try Again
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
