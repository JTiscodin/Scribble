import { Stage, Layer, Rect, Circle } from "react-konva";

export default function Canvas() {
  return (
    <Stage
      className="border-2 border-green-600 rounded-3xl w-[70vw] overflow-hidden bg-gray-50"
      width={window.innerWidth - 80}
      height={window.innerHeight - 80}
    >
      <Layer>
        <Rect draggable width={50} height={50} fill="red" />
        <Circle draggable x={200} y={200} stroke="black" radius={100} />
      </Layer>
    </Stage>
  );
}
