"use client";

import { useGameScreen } from "@/game/store/game-store";
import { StartScreen } from "@/components/screens/start-screen";
import { GameScreen } from "@/components/screens/game-screen";
import { VictoryScreen } from "@/components/screens/victory-screen";
import { DefeatScreen } from "@/components/screens/defeat-screen";

export default function Home() {
  const screen = useGameScreen();

  switch (screen) {
    case "start":
      return <StartScreen />;
    case "playing":
      return <GameScreen />;
    case "victory":
      return <VictoryScreen />;
    case "defeat":
      return <DefeatScreen />;
    default:
      return <StartScreen />;
  }
}
