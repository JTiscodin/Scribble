import { useCanvasContext } from "@/contexts/CanvasContext";

import { Stage, Layer, Rect, Circle, Transformer, Line } from "react-konva";

import { usePlayerContext } from "@/contexts/PlayerContext";
import {
  MessageTypes,
  ServerMessages,
  ServerMessageTypes,
  SocketMessages,
} from "@/lib/types";
import { useEffect } from "react";

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

  const { socket, username } = usePlayerContext();

  useEffect(() => {
    if (socket) {
      socket.onmessage = async (evt) => {
        try {
          const msg: ServerMessageTypes = JSON.parse(evt.data);
          console.log(msg);
          if (msg.type === ServerMessages.CANVAS_UPDATED) {
            setLines(msg.canvas);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
    }
  }, [socket]);

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines((prev) => [...prev, { points: [pos.x, pos.y], stroke }]);
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
      className="border-2 border-green-600 rounded-3xl w-[70vw] h-[90vh] overflow-hidden bg-gray-50"
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
