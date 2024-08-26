"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Player, SocketMessages } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { usePlayerContext } from "@/contexts/PlayerContext";
export default function Room() {
  //Implement the room page
  /* 
  1. Should have a sidebar displaying all players (should be a scrollable if exceeded certain height)
  2. Should have a crown on the host's head
  3. Let's just display player's name initially.
  */
  const params = useParams();
  const [players, setPlayers] = useState<Player[]>([]);
  const router = useRouter();
  const { username, socket } = usePlayerContext();
  const [host, setHost] = useState<Player | null>(null)

  useEffect(() => {
    console.log(params.roomId);

    //connect to room when this page is loaded
    //getting the players for particular roomId
    const getPlayers = async () => {
      const response = await fetch(
        "http://localhost:5000/players/" + params.roomId
      );
      const data = await response.json();
      setPlayers(data.players);
      setHost(data.host)
    };

    getPlayers();
  }, [params.roomId]);

  const handleLeaveRoom = async () => {
    const data = JSON.stringify({
      type: SocketMessages.LEAVE_ROOM,
      username,
      roomId: params.roomId,
    });
    socket?.send(data);
    router.push("/");
  };

  return (
    <div className="w-screen min-h-screen gap-7 flex justify-center items-center">
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
                    {player.username === host?.username ? `${player.username} (host)` : player.username}
                    <hr />
                  </div>
                );
              })}
          </CardContent>
        </CardHeader>
      </Card>

      {username === host?.username &&<Button>Start Game</Button>}
      <Button onClick={handleLeaveRoom}>Leave Room</Button>
    </div>
  );
}
