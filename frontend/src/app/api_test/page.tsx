"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const TestPage = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const [msg, setMsg] = useState<string>("")

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8787/ws");

    console.log(ws.readyState);

    ws.onopen = (event) => {
      ws.send("Connected");
      setSocket(ws)
    };

    ws.onmessage = (evt) => {
        console.log(evt.data)
    }
    return () => {
      // Cleanup on unmount if ws wasn't closed already
      if (ws?.readyState !== 3) ws.close(1000, "Disconnected");
    };
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    socket && socket.send(msg)
  };


  if(!socket){
    return (
        <div>
            <p> Loading ...</p>
        </div>
    )
  }
  return (
    <>
      <h1>Hello </h1>
      <form onSubmit={handleSubmit}>
        <input onChange={(e) => setMsg(e.target.value)} value={msg} className="border-2 border-green-600" />
        <Button>Submit</Button>
      </form>
    </>
  );
};

export default TestPage;
