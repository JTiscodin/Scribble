import { useCanvasContext } from "@/contexts/CanvasContext";
import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Circle, Transformer, Line } from "react-konva";
import Rectangle from "./CanvasElements/Rectangle";
import Konva from "konva";
import { Tool } from "@/lib/types";

const initialRectangles = [
  {
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    fill: "red",
    id: "rect1",
  },
  {
    x: 150,
    y: 150,
    width: 100,
    height: 100,
    fill: "green",
    id: "rect2",
  },
];

export default function Canvas() {
  const { elements, setElements, isDrawing, stageRef, lines, setLines, tool } =
    useCanvasContext();
  const [rectangles, setRectangles] = useState(initialRectangles);
  const [selectedId, selectShape] = useState<String>("");

  const handleMouseDown = (e: any) => {
    if (tool === Tool.Pen) {
      isDrawing.current = true;
      const pos = e.target.getStage().getPointerPosition();
      setLines((prev) => [...prev, { points: [pos.x, pos.y] }]);
    }
    console.log("mouse is down");
  };

  useEffect(() => {
    var json =
      '{"attrs":{"width":578,"height":200},"className":"Stage","children":[{"attrs":{},"className":"Layer","children":[{"attrs":{"x":100,"y":100,"sides":6,"radius":70,"fill":"red","stroke":"black","strokeWidth":4},"className":"RegularPolygon"}]}]}';
  }, []);

  const handleMouseUp = () => {
    isDrawing.current = false;
    console.log(stageRef.current?.toJSON());
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
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
              stroke="#df4b26"
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
