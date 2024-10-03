'use client'

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { Tool } from "@/lib/types";
import Konva from "konva";
import { Stage } from "konva/lib/Stage";

interface MyComponentProps {
  children: ReactNode;
}


interface CanvasContextType {
  elements: any[];
  setElements: React.Dispatch<React.SetStateAction<any[]>>;
  stroke: string;
  setStroke: React.Dispatch<React.SetStateAction<string>>;
  stageRef: React.MutableRefObject<Konva.Stage | null>;
  isDrawing: React.MutableRefObject<boolean>;
  lines: any[];
  setLines: React.Dispatch<React.SetStateAction<any[]>>;
}

const CanvasContext = createContext<CanvasContextType | null>(null);

export const useCanvasContext = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error(
      "useCanvasContext must be used within a CanvasContextProvider"
    );
  }
  return context;
};

const CanvasContextProvider: React.FC<MyComponentProps> = ({ children }) => {
  const [elements, setElements] = useState<any[]>([]);
  const [stroke, setStroke] = useState<string>("#FF5733")
  const stageRef = useRef<Konva.Stage | null>(null);
  const [lines, setLines] = useState<any[]>([]);
  const isDrawing = useRef<boolean>(false);

  return (
    <CanvasContext.Provider
      value={{
        elements,
        setElements,
        stroke,
        setStroke,
        isDrawing,
        stageRef,
        lines,
        setLines,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export default CanvasContextProvider;
