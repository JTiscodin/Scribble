import { useCanvasContext } from "@/contexts/CanvasContext";
import { useEffect, useState } from "react";
import { Stage, Layer, Rect, Circle, Transformer } from "react-konva";
import Rectangle from "./CanvasElements/Rectangle";

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
  const { elements, setElements } = useCanvasContext();

  const [rectangles, setRectangles] = useState(initialRectangles);
  const [selectedId, selectShape] = useState<String>("");

  const checkDeselect = (e: any) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape("");
    }
  };

  return (
    <Stage
      className="border-2 border-green-600 rounded-3xl w-[70vw] h-[90vh] overflow-hidden bg-gray-50"
      width={2000}
      height={2000}
      onMouseDown={checkDeselect}
      onTouchStart={checkDeselect}
    >
      <Layer>
        {elements.map((e) => {
          return e;
        })}
      </Layer>
      <Layer>
        {rectangles.map((rect, i) => {
          return (
            <Rectangle
              key={i}
              shapeProps={rect}
              isSelected={rect.id === selectedId}
              onSelect={() => {
                selectShape(rect.id);
              }}
              onChange={(newAttrs) => {
                const rects = rectangles.slice();
                rects[i] = newAttrs;
                setRectangles(rects);
              }}
            />
          );
        })}
      </Layer>
    </Stage>
  );
}
