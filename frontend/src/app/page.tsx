"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [msg, setMsg] = useState("");

  const handleClick = async () => {
    const res = await fetch("http://127.0.0.1:8787/");
    const data = await res.json();
    setMsg(data.msg);
  };


  const handleGameSubmit = (e:any ) => {
    e.preventDefault();
  }

  return (
    <div className="min-h-screen w-screen flex flex-col justify-center items-center">
      <Card className="w-[30vw]">
        <CardHeader>
          <CardTitle>Lets Start</CardTitle>
          <CardContent className="">
            <form onSubmit={handleGameSubmit} className="my-2 p-4 flex flex-col items-center gap-6">
              <Input placeholder="Enter your username" />
              <Button>Play Random Game</Button>
              <Button>Start a Private Game</Button>
            </form>
          </CardContent>
        </CardHeader>
      </Card>
      <Button onClick={handleClick}>Click me</Button>
      <div>{msg}</div>
    </div>
  );
}
