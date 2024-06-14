import { ReactNode, createContext, useContext, useState } from "react";

interface MyComponentProps {
  children: ReactNode;
}

interface CanvasContextType {
  elements: any[];
  setElements: React.Dispatch<React.SetStateAction<any[]>>;
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

  return (
    <CanvasContext.Provider value={{ elements, setElements }}>
      {children}
    </CanvasContext.Provider>
  );
};

export default CanvasContextProvider;
