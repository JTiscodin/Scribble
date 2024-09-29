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

  useEffect(() => {
    if (socket) {
      socket.onmessage = async (evt) => {
        try {
          const message: ServerMessageTypes = JSON.parse(evt.data);
          if (message.type === ServerMessages.GAME_STARTED) {
            //router the user to the game page
            router.push("/room/" + params.roomId + "/game");
          } else if (message.type === ServerMessages.PLAYER_ADDED) {
            toast({
              title: "New Player added",
            });
            setPlayers(message.players);
          } else if (message.type === ServerMessages.PLAYER_LEFT) {
            toast({
              title: "Player Left",
            });
            setPlayers(message.players);
          }
        } catch (e) {
          console.log(e);
        }
      };
    }
  }, [socket]);

  const handleLeaveRoom = async () => {
    const data = JSON.stringify({
      type: SocketMessages.LEAVE_ROOM,
      username,
      roomId: params.roomId,
    });
    socket?.send(data);
    router.push("/");
  };

  const handleCopyLink = async () => {
    //copy the link to clipboard
    const link = "http://localhost:3000/?roomId=" + params.roomId

    navigator.clipboard.writeText(link)

    toast({title: "Copied to Clipboard"})
  }

  return (
    <div className=" w-screen min-h-screen flex flex-col justify-center items-center">
      <div className=" gap-7 flex justify-center items-center">
        {/* Sidebar */}
        <Card className="min-w-[40vw]">
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
          <Button onClick={startGame}>Start Game</Button>
        )}
        <Button onClick={handleLeaveRoom}>Leave Room</Button>
      </div>
      <Button className="my-4" onClick={handleCopyLink}>Copy Link</Button>
      {/* <p>{`http://localhost:3000/?roomId=${params.roomId}`}</p> */}
    </div>
  );
}
