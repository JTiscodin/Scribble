"use client";

import {
  Player,
  SocketMessages,
  ServerMessageTypes,
  ServerMessages,
  Chat,
  ModalTypes,
} from "@/lib/types";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePlayerContext } from "./PlayerContext";
import { redirect, useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useCanvasContext } from "./CanvasContext";
import useSound from "use-sound";

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
  leaderboard: Array<[string, number]> | null;
  modalType: ModalTypes;
  modalData: any;
  word: string | null;
  time: number | null;
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
  leaderboard: null,
  modalType: ModalTypes.Hide,
  modalData: null,
  word: null,
  time: 0,
});

export default function GameContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [play, { sound, stop }] = useSound("/sounds/old-video-game-5.wav", {
    volume: 0.5,
  });
  const [playCorrectAns] = useSound("/sounds/announcement-sound-4.wav", {
    volume: 0.5,
  });
  const { socket, username } = usePlayerContext();
  const [players, setPlayers] = useState<Player[]>([]);
  const [chat, setChat] = useState<Chat[]>([]);
  const [host, setHost] = useState<Player | null>(null);
  const [drawer, setDrawer] = useState<Player | null>(null);
  const [modalType, setModalType] = useState<ModalTypes>(ModalTypes.Points);
  const [modalData, setModalData] = useState<any>();
  const [leaderboard, setLeaderboard] = useState<Array<
    [string, number]
  > | null>(null);
  const { setLines } = useCanvasContext();
  const [word, setWord] = useState<string | null>(null);
  const [time, setTime] = useState<number | null>(30);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev && prev > 0) {
          return prev - 1;
        }
        clearInterval(timerRef.current!);
        return 0;
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTime(0);
  }, []);

  useEffect(() => {
    return () => clearInterval(timerRef.current!);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.onmessage = async (evt: any) => {
        try {
          const message: ServerMessageTypes = await JSON.parse(evt.data);
          switch (message.type) {
            case ServerMessages.GAME_STARTED: {
              play();
              router.replace("/room/" + params.roomId + "/game");
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
              playCorrectAns();
              break;
            }
            case ServerMessages.CHOOSE_WORD: {
              toast({
                title: "choose word",
              });
              setModalType(ModalTypes.WordChoose);
              setModalData(message.words);
              break;
            }
            case ServerMessages.WORD_CHOSEN: {
              setModalType(ModalTypes.Hide);
              if (username != drawer?.username) setWord(message.word);
              toast({
                title: "word chosen",
              });
              break;
            }
            case ServerMessages.ROUND_STARTED: {
              setDrawer(message.drawer);
              setTime(message.timer / 1000);
              setModalType(ModalTypes.Hide);
              break;
            }
            case ServerMessages.ROUND_ENDED: {
              setModalType(ModalTypes.Points);
              setModalData(message.pointsTable);
            }
            case ServerMessages.START_TIMER: {
              if (time && time > 0) {
                console.log("here");
                startTimer();
              }
              break;
            }
            case ServerMessages.LEADERBOARD_UPDATE: {
              setLeaderboard(message.leaderboard);
              break;
            }
            case ServerMessages.END_TIMER: {
              stopTimer();
              break;
            }
            case ServerMessages.GAME_ENDED: {
              router.replace("/");
              break;
            }
          }
        } catch (e) {
          console.log(e);
        }
      };
    }
  }, [socket, play]);

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
        leaderboard,
        modalType,
        modalData,
        word,
        time,
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
