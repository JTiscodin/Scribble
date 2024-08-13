"use client";

import { Player } from "@/lib/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface PlayerContextProviderProps {
  children: ReactNode;
}

const PlayerContext = createContext<Player | null>(null);

const PlayerContextProvider = ({ children }: PlayerContextProviderProps) => {
  const [username, setUsername] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8787/ws");

    setSocket(socket);

    socket.onmessage = (evt) => {
      console.log(evt.data);
    };

    return () => socket?.close();
  }, []);

  return (
    <PlayerContext.Provider value={{ socket, username }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);

  if (!context) {
    console.error("Use the hook within the context provider");
  }
  return context;
};

export default PlayerContextProvider;
