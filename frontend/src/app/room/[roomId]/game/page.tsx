"use client";

import ToolsList from "@/components/Tools";
import { Button } from "@/components/ui/button";
import Canvas from "@/components/Canvas";
import CanvasContextProvider from "@/contexts/CanvasContext";
import { usePlayerContext } from "@/contexts/PlayerContext";
import { useParams } from "next/navigation";
import ChatBox from "@/components/ChatBox";
import Board from "@/components/Board";
import { useGameContext } from "@/contexts/GameContext";
import Modal from "@/components/Modal";
import { useEffect, useState } from "react";

export default function CanvasTest() {
  const { roomId }: { roomId: string } = useParams();

  //Make a game context and set it to default values when game is started
  const { drawer, modalType, modalData, time, word } = useGameContext();

  const { username } = usePlayerContext();

  // Load the finisher-header animation
  useEffect(() => {
    const loadFinisherHeader = async () => {
      const script = document.createElement("script");
      script.src = "/finisher-header.es5.min.js"; // Ensure this file is in the public folder
      script.type = "text/javascript";
      script.onload = () => {
        new (window as any).FinisherHeader({
          count: 10,
          size: {
            min: 2,
            max: 40,
            pulse: 0,
          },
          speed: {
            x: {
              min: 0,
              max: 0.8,
            },
            y: {
              min: 0,
              max: 0.2,
            },
          },
          colors: {
            background: "#15182e",
            particles: ["#ff926b", "#87ddfe", "#acaaff", "#1bffc2", "#f9a5fe"],
          },
          blending: "screen",
          opacity: {
            center: 1,
            edge: 1,
          },
          skew: 0,
          shapes: ["c", "s", "t"],
        });
      };
      document.body.appendChild(script);
    };

    loadFinisherHeader();

    return () => {
      const script = document.querySelector(
        'script[src="/finisher-header.es5.min.js"]'
      );
      if (script) document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center">
      <div className="finisher-header absolute inset-0 pointer-events-none"></div>

      <Modal data={modalData} modalType={modalType} />
      <div className="flex h-screen gap-5 my-8  items-start justify-center ">
        {/* LeaderBoard */}
        <Board />
        <div className="flex flex-col text-white ">
          <div className="flex justify-around w-full">
            {/* Word (blanks or whatever) */}
            <div>Word ➡️ {word}</div>
            <div>Time Left: {time}s</div>
          </div>
          <Canvas roomId={roomId} />
          {drawer?.username === username && <ToolsList />}
          {/* {true && <ToolsList />} */}
        </div>
        <ChatBox />
        {/* Chat */}
      </div>
    </div>
  );
}
