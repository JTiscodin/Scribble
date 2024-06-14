"use client";

import { Stage, Layer, Rect, Circle } from "react-konva";
import ToolsList from "@/components/Tools";
import Canvas from "@/components/Canvas";

export default function CanvasTest() {
  return (
    <div className="flex h-screen w-screen items-center justify-center ">
      <Canvas />
      <ToolsList />
    </div>
  );
}
