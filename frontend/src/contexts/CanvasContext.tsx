import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { Tool } from "@/lib/types";

interface MyComponentProps {
  children: ReactNode;
}

interface CanvasContextType {
  elements: any[];
  setElements: React.Dispatch<React.SetStateAction<any[]>>;
  tool: any;
  setTool: React.Dispatch<React.SetStateAction<any>>;
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
  const [tool, setTool] = useState<any>(Tool.Default);

  return (
    <CanvasContext.Provider value={{ elements, setElements, tool, setTool }}>
      {children}
    </CanvasContext.Provider>
  );
};

export default CanvasContextProvider;
