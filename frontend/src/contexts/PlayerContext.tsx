"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  Suspense,
  useContext,
  useEffect,
  useState,
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

const PlayerContextInner = ({ children }: PlayerContextProviderProps) => {
  const params = useSearchParams();
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "");
  }, []);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:5000/";
    const socket = new WebSocket(wsUrl);
    setSocket(socket);

    if (!params.has("roomId")) {
      router.replace("/");
    }

    return () => socket.close();
  }, []);

  return (
    <PlayerContext.Provider value={{ username, setUsername, socket }}>
      {children}
    </PlayerContext.Provider>
  );
};

const PlayerContextProvider = ({ children }: PlayerContextProviderProps) => {
  return (
    <Suspense fallback={null}>
      <PlayerContextInner>{children}</PlayerContextInner>
    </Suspense>
  );
};

// Custom hook to use the PlayerContext
export const usePlayerContext = () => {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error(
      "usePlayerContext must be used within a PlayerContextProvider",
    );
  }

  return context;
};

export default PlayerContextProvider;
