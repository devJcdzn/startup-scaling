"use client";

import { useGameStore, useGameStats } from "@/game/store/game-store";
import { useSound } from "@/hooks/use-sound";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function getDefeatReason(
  money: number,
  performance: number,
  reputation: number
): string {
  if (money <= 0) return "You ran out of money.";
  if (performance <= 0) return "Performance hit zero. Users fled.";
  if (reputation <= 0) return "Your reputation was destroyed.";
  return "Game over.";
}

export function DefeatScreen() {
  const restart = useGameStore((s) => s.restart);
  const stats = useGameStats();
  const { playClick, playError } = useSound();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen px-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="text-center space-y-8"
      >
        <motion.h1
          className="text-6xl md:text-8xl font-bold text-[#ef4444]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          DEFEATED
        </motion.h1>

        <motion.p
          className="text-xl text-[#a1a1aa]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {getDefeatReason(stats.money, stats.performance, stats.reputation)}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-4 max-w-md mx-auto text-center"
        >
          <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-4">
            <div className="text-2xl font-bold text-[#3b82f6]">Day {stats.day}</div>
            <div className="text-xs text-[#a1a1aa]">Survived</div>
          </div>
          <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-4">
            <div className="text-2xl font-bold text-[#3b82f6]">{formatNumber(stats.users)}</div>
            <div className="text-xs text-[#a1a1aa]">Users</div>
          </div>
          <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-4">
            <div className="text-2xl font-bold text-[#ef4444]">${stats.money.toLocaleString()}</div>
            <div className="text-xs text-[#a1a1aa]">Money</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            size="lg"
            className="text-lg px-12 py-6 bg-[#ef4444] hover:bg-[#dc2626] text-white font-semibold"
            onClick={() => {
              playClick();
              restart();
            }}
          >
            Try Again
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
