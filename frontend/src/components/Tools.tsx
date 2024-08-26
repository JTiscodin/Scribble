import { useCanvasContext } from "@/contexts/CanvasContext";
import { SocketMessages, Tool } from "@/lib/types";
import { Button } from "./ui/button";
import { usePlayerContext } from "@/contexts/PlayerContext";

export default function ToolsList() {
  const { stroke, setStroke, setLines, lines } = useCanvasContext();

  const { socket } = usePlayerContext();

  const changePenColour = (stroke: string) => {
    setStroke(stroke);
  };

  const handleCanvasReset = async () => {
    if (socket) {
      setLines([]);
      const data = JSON.stringify({
        type: SocketMessages.CANVAS_CHANGE,
        canvas: [],
      });
      socket.send(data);
    }
  };

  const strokeColors = [
    "#FF5733", // Orange-Red
    "#33FF57", // Green
    "#3357FF", // Blue
    "#FF33A6", // Pink
    "#33FFF1", // Cyan
    "#FFC733", // Yellow
    "#8C33FF", // Purple
    "#FF8633", // Orange
    "#33D1FF", // Sky Blue
    "#FF338A", // Magenta
  ];

  return (
    <div className=" absolute w-[4vw] right-[4vw] min-h-[50vh] text-white rounded-3xl flex flex-col justify-around items-center">
      {strokeColors.map((color, i) => (
        <div
          key={i}
          onClick={() => changePenColour(color)}
          style={{ backgroundColor: color }} // Set the background color directly
          className="w-8 h-8  duration-100 hover:scale-125 rounded-full cursor-pointer"
        />
      ))}
      <Button className="my-4" onClick={handleCanvasReset}>Reset</Button>
    </div>
  );
}
