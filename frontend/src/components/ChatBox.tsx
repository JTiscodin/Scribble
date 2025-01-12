"use client";

import { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { useGameContext } from "@/contexts/GameContext";
import { usePlayerContext } from "@/contexts/PlayerContext";
import { CheckAnswer, SocketMessages } from "@/lib/types";
import { useParams } from "next/navigation";

export default function ChatBox() {
  const {chat} = useGameContext()
  const { socket, username } = usePlayerContext();
  const [focused, setFocused] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const params: { roomId: string } = useParams();

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  const handleKeyDownEvent = useCallback(
    async (evt: any) => {
      if (focused && evt.key === "Enter" && msg.trim().length != 0) {
        const data: CheckAnswer = {
          type: SocketMessages.CHECK_ANSWER,
          answer: msg,
          roomId: params.roomId,
          username,
        };
        socket?.send(JSON.stringify(data));
        setMsg("");
      }
    },
    [focused, msg, chat]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDownEvent);
    return () => window.removeEventListener("keydown", handleKeyDownEvent);
  }, [handleKeyDownEvent]);

  return (
    <div className="relative h-[90vh] w-[20vw] bg-slate-200 rounded-3xl flex flex-col p-3">
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-5">
        <div className="flex flex-col justify-end min-h-full">
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
