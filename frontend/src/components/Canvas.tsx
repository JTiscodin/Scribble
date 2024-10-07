import { useCanvasContext } from "@/contexts/CanvasContext";
import { useToast } from "@/components/ui/use-toast";
import { Stage, Layer, Rect, Circle, Transformer, Line } from "react-konva";

import { usePlayerContext } from "@/contexts/PlayerContext";
import {
  MessageTypes,
  ServerMessages,
  ServerMessageTypes,
  SocketMessages,
} from "@/lib/types";
import { useEffect } from "react";
import { useGameContext } from "@/contexts/GameContext";

export default function Canvas({ roomId }: { roomId: string }) {
  const {
    elements,
    setElements,
    isDrawing,
    stageRef,
    lines,
    setLines,
    stroke,
    setStroke,
  } = useCanvasContext();

  const { drawer } = useGameContext();

  const {toast} = useToast();

  const { socket, username } = usePlayerContext();

  const handleMouseDown = (e: any) => {
    if (username === drawer?.username) {
      isDrawing.current = true;
      const pos = e.target.getStage().getPointerPosition();
      setLines((prev) => [...prev, { points: [pos.x, pos.y], stroke }]);
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) {
      return;
    }
    try {
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      let lastLine = lines[lines.length - 1];
      lastLine.points = lastLine.points.concat([point.x, point.y]);
      //replacing the last line with the new line
      lines.splice(lines.length - 1, 1, lastLine);
      //We use lines.concat() because it returns a shallow copy of the lines array we just modified
      setLines(lines.concat());
      const data = JSON.stringify({
        type: SocketMessages.CANVAS_CHANGE,
        canvas: lines,
        username,
        roomId: roomId,
      });
      socket?.send(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Stage
      className="border-2 border-green-600 rounded-3xl w-[50vw] h-[80vh] overflow-hidden bg-gray-50"
      ref={stageRef}
      width={2000}
      height={2000}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <Layer>
        {lines.map((line, i) => {
          return (
            <Line
              key={i}
              points={line.points}
              stroke={line.stroke}
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation="source-over"
            />
          );
        })}
      </Layer>
    </Stage>
  );
}
