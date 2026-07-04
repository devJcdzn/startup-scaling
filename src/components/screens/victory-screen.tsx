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

export function VictoryScreen() {
  const restart = useGameStore((s) => s.restart);
  const stats = useGameStats();
  const { playClick, playSuccess } = useSound();

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
          className="text-6xl md:text-8xl font-bold text-[#22c55e]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          VICTORY!
        </motion.h1>

        <motion.p
          className="text-xl text-[#a1a1aa]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          You survived 30 days and reached {formatNumber(stats.users)} users!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-4 max-w-md mx-auto text-center"
        >
          <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-4">
            <div className="text-2xl font-bold text-[#3b82f6]">{formatNumber(stats.users)}</div>
            <div className="text-xs text-[#a1a1aa]">Users</div>
          </div>
          <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-4">
            <div className="text-2xl font-bold text-[#22c55e]">${stats.money.toLocaleString()}</div>
            <div className="text-xs text-[#a1a1aa]">Money</div>
          </div>
          <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-4">
            <div className="text-2xl font-bold text-[#8b5cf6]">{stats.reputation}</div>
            <div className="text-xs text-[#a1a1aa]">Reputation</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            size="lg"
            className="text-lg px-12 py-6 bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold"
            onClick={() => {
              playClick();
              restart();
            }}
          >
            Play Again
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
