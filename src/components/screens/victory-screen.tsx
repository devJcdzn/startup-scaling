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

export function VictoryScreen() {
  const restart = useGameStore((s) => s.restart);
  const stats = useGameStats();
  const { playClick } = useSound();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#09090b]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-6"
      >
        <div className="text-center space-y-2">
          <motion.h1
            className="text-4xl font-bold text-[#22c55e]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {STRINGS.victory.title}
          </motion.h1>
          <motion.p
            className="text-sm text-[#a1a1aa]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {STRINGS.victory.message}
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
                  <div className="font-bold text-[#22c55e]">Won</div>
                </div>
                <div>
                  <span className="text-[#a1a1aa]">Survived</span>
                  <div className="font-bold text-[#fafafa]">30 / 30 days</div>
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
                  <div className="font-bold text-[#fafafa]">{formatMoney(stats.money)}</div>
                </div>
                <div>
                  <span className="text-[#a1a1aa]">Performance</span>
                  <div className="font-bold text-[#f59e0b]">{stats.performance}%</div>
                </div>
                <div>
                  <span className="text-[#a1a1aa]">Reputation</span>
                  <div className="font-bold text-[#8b5cf6]">{stats.reputation}%</div>
                </div>
                <div>
                  <span className="text-[#a1a1aa]">Tech Debt</span>
                  <div className="font-bold text-[#ec4899]">{stats.techDebt}%</div>
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
            className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold"
            onClick={() => {
              playClick();
              restart();
            }}
          >
            Play Again
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
