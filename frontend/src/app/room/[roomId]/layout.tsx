import GameContextProvider from "@/contexts/GameContext";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return <GameContextProvider>{children}</GameContextProvider>;
}
