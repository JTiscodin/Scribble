"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

interface PlayerContextValue {
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
  socket: WebSocket | null;
}

interface PlayerContextProviderProps {
  children: ReactNode;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

const PlayerContextProvider = ({ children }: PlayerContextProviderProps) => {
  const params = useSearchParams();
  const router = useRouter();
  const [username, setUsername] = useState<string>(
    localStorage.getItem("username") || ""
  );
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/");
    setSocket(socket);

    if (!params.has("roomId")) {
      router.replace("/")
    }

    return () => socket.close();
  }, []);

  return (
    <PlayerContext.Provider value={{ username, setUsername, socket }}>
      {children}
    </PlayerContext.Provider>
  );
};

// Custom hook to use the PlayerContext
export const usePlayerContext = () => {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error(
      "usePlayerContext must be used within a PlayerContextProvider"
    );
  }

  return context;
};

export default PlayerContextProvider;
