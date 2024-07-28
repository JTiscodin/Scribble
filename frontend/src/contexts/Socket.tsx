"use client";

import {
  useContext,
  useEffect,
  useState,
  createContext,
  ReactNode,
  useMemo,
} from "react";

const SocketContext = createContext<WebSocket | null>(null);

interface SocketProviderProps {
  children: ReactNode;
}

const SocketContextProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8787/ws");

    setSocket(socket);

    //listening to server instances
    socket.onmessage = (evt) => {
      console.log(evt.data);
    };
    return () => {
      socket?.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (context === undefined) {
    throw new Error("use it within a provider");
  }

  return context;
};

export default SocketContextProvider;
