import CanvasContextProvider from "@/contexts/CanvasContext";
import GameContextProvider from "@/contexts/GameContext";
import PlayerContextProvider from "@/contexts/PlayerContext";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <CanvasContextProvider>
      <GameContextProvider>{children}</GameContextProvider>
    </CanvasContextProvider>
  );
}
