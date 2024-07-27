"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import SocketContextProvider from "@/contexts/Socket";

export default function Home() {
  const [msg, setMsg] = useState("");

  const handleClick = async () => {
    const res = await fetch("http://127.0.0.1:8787/");
    const data = await res.json();
    setMsg(data.msg);
  };

  return (
    <SocketContextProvider>
      <div>
        <h1>Home</h1>
        <Button onClick={handleClick}>Click me</Button>
        <div>{msg}</div>
      </div>
    </SocketContextProvider>
  );
}
