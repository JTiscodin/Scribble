"use client";

import { Stage, Layer, Rect, Circle } from "react-konva";
import ToolsList from "@/components/Tools";
import Canvas from "@/components/Canvas";
import CanvasContextProvider from "@/contexts/CanvasContext";

export default function CanvasTest() {
  return (
    <CanvasContextProvider>
      <div className="flex h-screen w-screen items-center justify-center ">
        <Canvas />
        <ToolsList />
      </div>
    </CanvasContextProvider>
  );
}
