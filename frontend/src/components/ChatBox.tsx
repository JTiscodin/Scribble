"use client";

import { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { useGameContext } from "@/contexts/GameContext";
import { usePlayerContext } from "@/contexts/PlayerContext";
import { CheckAnswer, SocketMessages } from "@/lib/types";
import { useParams } from "next/navigation";

export default function ChatBox() {
  const { chat, setChat } = useGameContext();

  const { socket, username } = usePlayerContext();

  const [focused, setFocused] = useState<boolean>(false);

  const [msg, setMsg] = useState<string>("");

  const params: { roomId: string } = useParams();

  const tempChats = [
    { username: "JT", msg: "Something right 1 ?" },
    { username: "JT", msg: "Something right 2 ?" },
    { username: "JT", msg: "Something right 3 ?" },
  ];

  const handleKeyDownEvent = useCallback(
    async (evt: any) => {
      if (focused && evt.key === "Enter" && msg.trim().length != 0) {
        //send the chat data here to the server
        const data: CheckAnswer = {
          type: SocketMessages.CHECK_ANSWER,
          answer: msg,
          roomId: params.roomId,
          username,
        };
        socket?.send(JSON.stringify(data));
        setMsg('')
        console.log("sent the chat");
      }
    },
    [focused, params.roomId, msg, socket, username]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDownEvent);

    return () => window.removeEventListener("keydown", handleKeyDownEvent);
  }, [handleKeyDownEvent]);

  return (
    <div className="relative h-[90vh] w-[20vw] bg-slate-200 rounded-3xl flex flex-col justify-between items-center p-3">
      <div className="flex flex-col border-2 h-[80vh] overflow-y-auto mb-5 w-full justify-end">
        {chat.map((chat, index) => (
          <div key={index} className="flex flex-col w-full">
            <div className="flex">
              <p className="font-semibold text-purple-700">{chat.username}</p>
              <p className="ml-2 text-violet-500">{chat.message}</p>
            </div>
            <hr className="border-2 border-black w-full mt-1" />
          </div>
        ))}
      </div>
      <Input
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Type your message"
        className="p-4 w-full"
      />
    </div>
  );
}
