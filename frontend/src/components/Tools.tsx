import { LuRectangleHorizontal } from "react-icons/lu";
import { FaP, FaPencil, FaArrowPointer } from "react-icons/fa6";
import { MdOutlineTextFields } from "react-icons/md";
import { useCanvasContext } from "@/contexts/CanvasContext";
import { Tool } from "@/lib/types";
import { Rect } from "react-konva";

type tool = {
  logo: JSX.Element;
  tool: Tool;
};

export default function ToolsList() {
  const { tool, setTool, elements, setElements, isDrawing } = useCanvasContext();

  const handleToolClick = (tool: Tool) => {
    switch (tool) {
      case Tool.Pen:
        setTool(tool);
        console.log(tool);
        
        break;

      case Tool.Rectangle:
        setTool(tool);
        console.log(tool);
        setElements((prev) => [
          ...prev,
          <Rect draggable width={50} height={50} fill="red" />,
        ]);
      default:
        setTool(Tool.Default);
        console.log(tool);
    }
  };

  let tools: tool[] = [
    {
      logo: (
        <LuRectangleHorizontal className="h-10 w-10 p-1  hover:bg-purple-400 duration-200 rounded-2xl" />
      ),
      tool: Tool.Rectangle,
    },
    {
      logo: (
        <FaArrowPointer className="h-7 w-7 p-1  hover:bg-purple-400 duration-200 rounded-2xl" />
      ),
      tool: Tool.Default,
    },
    {
      logo: (
        <FaPencil className="h-8 w-8 p-1  hover:bg-purple-400 duration-200 rounded-2xl" />
      ),
      tool: Tool.Pen,
    },
  ];

  return (
    <div className="bg-stone-800 absolute w-[4vw] right-[4vw] h-[50vh] text-white rounded-3xl flex flex-col justify-around items-center ">
      {tools.map((e) => {
        return (
          <button key={e.tool} onClick={() => handleToolClick(e.tool)}>
            {e.logo}
          </button>
        );
      })}
    </div>
  );
}
