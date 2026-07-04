"use client";

import { useGameStatus } from "@/game/store/game-store";
import { StartScreen } from "@/components/screens/start-screen";
import { GameScreen } from "@/components/screens/game-screen";
import { VictoryScreen } from "@/components/screens/victory-screen";
import { DefeatScreen } from "@/components/screens/defeat-screen";

export default function Home() {
  const status = useGameStatus();

  switch (status) {
    case "idle":
      return <StartScreen />;
    case "running":
    case "decision":
      return <GameScreen />;
    case "won":
      return <VictoryScreen />;
    case "lost":
      return <DefeatScreen />;
    default:
      return <StartScreen />;
  }
}
