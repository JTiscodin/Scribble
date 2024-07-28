"use client";

import { Button } from "@/components/ui/button";
import { useSocket } from "@/contexts/Socket";
import { useEffect, useState } from "react";

const TestPage = () => {
  const socket = useSocket();

  const [msg, setMsg] = useState<string>("");

  // useEffect(() => {
  //   const ws = new WebSocket("ws://localhost:8787/ws");

  //   console.log(ws.readyState);

  //   ws.onopen = (event) => {
  //     ws.send("Connected");

  //   };

  //   ws.onmessage = (evt) => {
  //       console.log(evt.data)
  //   }
  //   return () => {
  //     if (ws?.readyState !== 3) ws.close(1000, "Disconnected");
  //   };
  // }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    socket && socket.send(msg);
  };

  if (!socket) {
    return (
      <div>
        <p> Loading ...</p>
      </div>
    );
  }
  return (
    <>
      <h1>Hello </h1>
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
          className="border-2 border-green-600"
        />
        <Button>Submit</Button>
      </form>
    </>
  );
};

export default TestPage;
