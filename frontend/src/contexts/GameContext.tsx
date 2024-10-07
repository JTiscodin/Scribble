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
import { useCanvasContext } from "./CanvasContext";

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
  showModal: boolean;
  modalData: any;
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
  showModal: false,
  modalData: "",
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
  const [showModal, setShowModal] = useState<boolean>(true);
  const [modalData, setModalData] = useState<any>();
  const { setLines } = useCanvasContext();

  useEffect(() => {
    if (socket) {
      socket.onmessage = async (evt: any) => {
        try {
          const message: ServerMessageTypes = await JSON.parse(evt.data);
          console.log(message);
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
            case ServerMessages.CANVAS_UPDATED: {
              setLines(message.canvas);
              break;
            }
            case ServerMessages.PLAYER_LEFT: {
              toast({
                title: "Player Left",
              });
              setPlayers(message.players);
              break;
            }
            case ServerMessages.CHAT_UPDATED: {
              setChat(message.chat);
              break;
            }
            case ServerMessages.CORRECT_ANSWER: {
              toast({
                title: message.msg,
              });
              break;
            }
            case ServerMessages.CHOOSE_WORD: {
              toast({
                title: "choose word",
              });
              console.log(message.words)
              setModalData(message.words)
              setShowModal(true)
              break;
            }
            case ServerMessages.WORD_CHOSEN: {
              setShowModal(false)
              toast({
                title: "word chosen",
              });
              break;
            }
            default: {
              console.log("Unclear message", message.type);
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
        showModal,
        modalData
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
