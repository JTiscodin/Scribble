"use client";

import ToolsList from "@/components/Tools";
import { Button } from "@/components/ui/button";
import Canvas from "@/components/Canvas";
import CanvasContextProvider from "@/contexts/CanvasContext";
import { usePlayerContext } from "@/contexts/PlayerContext";
import { useParams } from "next/navigation";
import ChatBox from "@/components/ChatBox";
import Board from "@/components/Board";
import { useGameContext } from "@/contexts/GameContext";

export default function CanvasTest() {
  const { roomId }: { roomId: string } = useParams();

  //Make a game context and set it to default values when game is started
  const { drawer } = useGameContext();

  const {username} = usePlayerContext()

  return (
    <CanvasContextProvider>
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="flex h-screen gap-5 my-8  items-start justify-center ">
          {/* LeaderBoard */}
          <Board  />
          <div className="flex flex-col  ">
            <Canvas roomId={roomId} />

            {drawer?.username === username && <ToolsList />}
          </div>
          <ChatBox />
          {/* Chat */}
        </div>
      </div>
    </CanvasContextProvider>
  );
}
