"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePlayerContext } from "@/contexts/PlayerContext";
import { GameCommands, Room, RoomMode, SocketMessages } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [msg, setMsg] = useState("");

  const [rooms, setRooms] = useState([]);

  const { socket, username, setUsername } = usePlayerContext();

  const handleJoinRoom = (id: string) => {
    //write logic to join a room
    const data = JSON.stringify({
      type: SocketMessages.JOIN_ROOM,
      roomId: id,
      username,
    });
    socket?.send(data);
    router.push("/room/" + id);
    localStorage.setItem("username", username)
  };

  const handleCreateRoom = () => {
    //handle create room
    const data = JSON.stringify({
      type: SocketMessages.CREATE_ROOM,
      roomName: msg,
      username,
    });
    socket?.send(data);
  };

  const handleChangeinCanvas = () => {
    //send the canvas here
    const data = JSON.stringify({
      type: SocketMessages.CANVAS_CHANGE,
      canvas: "something",
    });
    socket?.send(data);
  };

  const handleGameSubmit = (e: any) => {
    e.preventDefault();

    var json =
      '{"attrs":{"width":578,"height":200},"className":"Stage","children":[{"attrs":{},"className":"Layer","children":[{"attrs":{"x":100,"y":100,"sides":6,"radius":70,"fill":"red","stroke":"black","strokeWidth":4},"className":"RegularPolygon"}]}]}';

    // !Check if username is empty
    const data = {
      username,
      mode: RoomMode.Private,
      msg: SocketMessages.CREATE_ROOM,
    };
    // socket?.send(JSON.stringify(data));
  };

  useEffect(() => {
    const getRooms = async () => {
      const response = await fetch("http://localhost:5000/rooms");
      const data = await response.json();
      setRooms(data);
    };

    getRooms();
  });

  return (
    <div className="min-h-screen w-screen flex flex-col justify-center items-center">
      <div className="flex justify-evenly gap-5">
        <Card className="w-[30vw]">
          <CardHeader>
            <CardTitle>Lets Start</CardTitle>
            <CardContent className="">
              <form
                onSubmit={handleGameSubmit}
                className="my-2 p-4 flex flex-col items-center gap-6"
              >
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
                <Input
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Enter msg"
                />
                <Button>Play Random Game</Button>
                <Button>Start a Private Game</Button>
              </form>
            </CardContent>
          </CardHeader>
        </Card>
        {rooms.length != 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Available rooms</CardTitle>
              <CardContent className="flex flex-col gap-2">
                {rooms.map((room: Room) => {
                  return (
                    <Button
                      onClick={() => handleJoinRoom(room.id)}
                      key={room.id}
                    >
                      <h1>{room.name}</h1>
                      <hr />
                    </Button>
                  );
                })}
              </CardContent>
            </CardHeader>
          </Card>
        )}
      </div>
      <div className=" flex justify-evenly">
        <Button onClick={handleCreateRoom}>Create Room</Button>
        <Button>Join Room</Button>
        <Button onClick={handleChangeinCanvas}>Change Canvas</Button>
      </div>
    </div>
  );
}
