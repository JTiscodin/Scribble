"use client";

import {
  Player,
  SocketMessages,
  ServerMessageTypes,
  ServerMessages,
  Chat,
} from "@/lib/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePlayerContext } from "./PlayerContext";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface GameContextType {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  drawer: Player | null;
  host: Player | null;
  setHost: React.Dispatch<React.SetStateAction<Player | null>>;
  chat: Chat[];
  setChat: React.Dispatch<React.SetStateAction<Chat[]>>;
  setDrawer: React.Dispatch<React.SetStateAction<Player | null>>;
  startGame: () => void;
}

const GameContext = createContext<GameContextType>({
  players: [],
  setPlayers: () => {},
  drawer: null,
  host: null,
  setHost: () => {},
  chat: [],
  setChat: () => {},
  setDrawer: () => {},
  startGame: () => {},
});

export default function GameContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { socket, username } = usePlayerContext();
  const [players, setPlayers] = useState<Player[]>([]);
  const [chat, setChat] = useState<Chat[]>([]);
  const [host, setHost] = useState<Player | null>(null);
  const [drawer, setDrawer] = useState<Player | null>(null);

  useEffect(() => {
    if (socket) {
      socket.onmessage = async (evt: any) => {
        try {
          const message: ServerMessageTypes = await JSON.parse(evt.data);
          console.log(message)
          switch (message.type) {
            case ServerMessages.GAME_STARTED: {
              router.push("/room/" + params.roomId + "/game");
              setDrawer(message.drawer);
              break;
            }
            case ServerMessages.PLAYER_ADDED: {
              toast({
                title: "New Player added",
              });
              setPlayers(message.players);
              break;
            }
            case ServerMessages.PLAYER_LEFT: {
              toast({
                title: "Player Left",
              });
              setPlayers(message.players);
              break;
            }
            case ServerMessages.CHAT_UPDATED :{
              
              setChat(message.chat)
              console.log('chat updated')
              break;
            }
            default: {
              console.log("unclear message");
            }
          }
        } catch (e) {
          console.log(e);
        }
      };
    }
  }, [socket]);

  const startGame = async () => {
    const data = JSON.stringify({
      type: SocketMessages.START_GAME,
      username,
      roomId: params.roomId,
    });
    socket?.send(data);
  };

  return (
    <GameContext.Provider
      value={{
        players,
        setPlayers,
        chat,
        setChat,
        host,
        drawer,
        setDrawer,
        setHost,
        startGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameContextProvider");
  }
  return context;
};
