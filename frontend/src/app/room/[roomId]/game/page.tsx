"use client";

import ToolsList from "@/components/Tools";
import { Button } from "@/components/ui/button";
import Canvas from "@/components/Canvas";
import CanvasContextProvider from "@/contexts/CanvasContext";
import { usePlayerContext } from "@/contexts/PlayerContext";
import { useParams } from "next/navigation";

export default function CanvasTest() {
  const { roomId }: { roomId: string } = useParams();
  
  //Make a game context and set it to default values when game is started
  
  return (
    <CanvasContextProvider>
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="flex h-screen w-screen items-center justify-center ">
          <Canvas roomId={roomId} />
          <ToolsList />
        </div>  
      </div>
    </CanvasContextProvider>
  );
}
