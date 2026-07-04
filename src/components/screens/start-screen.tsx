"use client";

import { useGameStore } from "@/game/store/game-store";
import { useSound } from "@/hooks/use-sound";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function StartScreen() {
  const startGame = useGameStore((s) => s.startGame);
  const { playClick } = useSound();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen px-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
        className="text-center space-y-8"
      >
        <div className="space-y-2">
          <motion.h1
            className="text-5xl md:text-7xl font-bold tracking-tight text-[#fafafa]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Battle of{" "}
            <span className="text-[#3b82f6]">Scaling</span>
          </motion.h1>
          <motion.p
            className="text-lg text-[#a1a1aa] max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Grow from 100 users to 1,000,000 in 30 days.
            <br />
            Make hard engineering decisions under pressure.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Button
            size="lg"
            className="text-lg px-12 py-6 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold"
            onClick={() => {
              playClick();
              startGame();
            }}
          >
            Start Game
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex gap-8 justify-center text-sm text-[#52525b]"
        >
          <span>30 Days</span>
          <span>•</span>
          <span>6 Stats</span>
          <span>•</span>
          <span>15 Events</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
