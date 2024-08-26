"use client";

import ToolsList from "@/components/Tools";
import { Button } from "@/components/ui/button";
import Canvas from "@/components/Canvas";
import CanvasContextProvider from "@/contexts/CanvasContext";
import { usePlayerContext } from "@/contexts/PlayerContext";

export default function CanvasTest() {
  
  return (
    <CanvasContextProvider>
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="flex h-screen w-screen items-center justify-center ">
          <Canvas />
          <ToolsList />
        </div>
        <div>
          <Button>Send Canvas</Button>
        </div>
      </div>
    </CanvasContextProvider>
  );
}
