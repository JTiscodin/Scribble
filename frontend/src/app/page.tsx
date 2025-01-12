"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePlayerContext } from "@/contexts/PlayerContext";
import useSound from "use-sound"
import {
  GameCommands,
  Room,
  RoomMode,
  ServerMessages,
  ServerMessageTypes,
  SocketMessages,
} from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [msg, setMsg] = useState("");

  const [play, {stop, sound}] = useSound("/sounds/little-happy-tune.mp3")

  const [rooms, setRooms] = useState([]);

  const { socket, username, setUsername } = usePlayerContext();

  const params = useSearchParams();

  const handleJoinRoom = () => {
    const id = params.get("roomId");
    const data = JSON.stringify({
      type: SocketMessages.JOIN_ROOM,
      roomId: id,
      username,
    });
    socket?.send(data);
    router.replace("/room/" + id);
    localStorage.setItem("username", username);
  };

  const handleCreateRoom = async () => {
    const data = JSON.stringify({
      type: SocketMessages.CREATE_ROOM,
      roomName: msg,
      username,
    });
    socket?.send(data);
  };

  useEffect(() => {
    play();
    console.log(sound?._state)
    return () => stop();
  },[play, stop])

  useEffect(() => {
    if (socket) {
      socket.onmessage = (evt) => {
        try {
          const msg: ServerMessageTypes = JSON.parse(evt.data);
          if (msg.type === ServerMessages.ROOM_CREATED) {
            router.replace("/room/" + msg.roomId);
          }
        } catch (error) {}
      };
    }
  }, [socket]);

  const handleGameSubmit = (e: any) => {
    e.preventDefault();

    const data = {
      username,
      mode: RoomMode.Private,
      msg: SocketMessages.CREATE_ROOM,
    };
  };

  // Load the finisher-header animation
  useEffect(() => {
    const loadFinisherHeader = async () => {
      const script = document.createElement("script");
      script.src = "/finisher-header.es5.min.js"; // Ensure this file is in the public folder
      script.type = "text/javascript";
      script.onload = () => {
        new (window as any).FinisherHeader({
          count: 20,
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
    <div className="relative min-h-screen w-screen">
      <div className="finisher-header absolute inset-0"></div>

      <div className="relative flex flex-col justify-center items-center min-h-screen">
        <h1 className=" text-6xl font-extrabold text-white drop-shadow-lg mb-8">
          Scribble
        </h1>

        <div className="flex justify-evenly gap-5">
          <Card className="w-[30vw] bg-transparent border-none">
            <CardHeader>
              <CardTitle className="text-white">Let&apos;s Start</CardTitle>
              <CardContent>
                <form
                  onSubmit={handleGameSubmit}
                  className="my-2 p-4 flex flex-col items-center gap-6"
                >
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                  />
                  {!params.has("roomId") && (
                    <Input
                      value={msg}
                      onChange={(e) => setMsg(e.target.value)}
                      placeholder="Room name"
                    />
                  )}
                  <Button
                    className=""
                    variant={"secondary"}
                    onClick={() =>
                      params.has("roomId")
                        ? handleJoinRoom()
                        : handleCreateRoom()
                    }
                  >
                    {params.has("roomId") ? "Join Game" : "Create Room"}
                  </Button>
                </form>
              </CardContent>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
