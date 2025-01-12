"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Player,
  ServerMessages,
  ServerMessageTypes,
  SocketMessages,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { usePlayerContext } from "@/contexts/PlayerContext";
import { useToast } from "@/components/ui/use-toast";
import { useGameContext } from "@/contexts/GameContext";
export default function Room() {
  //Implement the room page
  /* 
  1. Should have a sidebar displaying all players (should be a scrollable if exceeded certain height)
  2. Should have a crown on the host's head
  3. Let's just display player's name initially.
  */
  const params = useParams();

  const { setHost, host, players, setPlayers, startGame } = useGameContext();

  const router = useRouter();
  const { username, socket } = usePlayerContext();
  const { toast } = useToast();

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

  useEffect(() => {
    console.log(params.roomId);

    //connect to room when this page is loaded
    //getting the players for particular roomId
    const getPlayers = async () => {
      const response = await fetch(
        "http://localhost:5000/players/" + params.roomId
      );
      const data = await response.json();
      console.log(data);
      setPlayers(data.players);
      setHost(data.host);
    };

    getPlayers();
  }, [params.roomId, setPlayers]);

  const handleLeaveRoom = async () => {
    const data = JSON.stringify({
      type: SocketMessages.LEAVE_ROOM,
      username,
      roomId: params.roomId,
    });
    socket?.send(data);
    router.replace("/");
  };

  const handleCopyLink = async () => {
    //copy the link to clipboard
    const link = "http://localhost:3000/?roomId=" + params.roomId;

    navigator.clipboard.writeText(link);

    toast({ title: "Copied to Clipboard" });
  };

  return (
    <div className="relative w-screen min-h-screen flex flex-col justify-center items-center">
      <div className="finisher-header absolute inset-0 pointer-events-none"></div>
      <div className=" gap-7 flex justify-center items-center">
        {/* Sidebar */}
        <Card className="min-w-[40vw] bg-transparent text-white border-none">
          <CardHeader>
            <CardTitle>Players</CardTitle>
            <hr />
            <CardContent>
              {players.length != 0 &&
                players.map((player: Player, i) => {
                  return (
                    <div className="my-2" key={i}>
                      {player.username === host?.username
                        ? `${player.username} (host)`
                        : player.username}
                      <hr />
                    </div>
                  );
                })}
            </CardContent>
          </CardHeader>
        </Card>

        {username === host?.username && (
          <Button variant={"secondary"} onClick={startGame}>Start Game</Button>
        )}
        <Button variant={"secondary"} onClick={handleLeaveRoom}>Leave Room</Button>
      </div>
      <Button variant={"secondary"} className="my-4" onClick={handleCopyLink}>
        Copy Link
      </Button>
      {/* <p>{`http://localhost:3000/?roomId=${params.roomId}`}</p> */}
    </div>
  );
}
