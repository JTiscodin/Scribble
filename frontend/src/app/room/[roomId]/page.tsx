"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
export default function Room() {
  const params = useParams();

  //Implement the room page
  /* 
    1. Should have a sidebar displaying all players (should be a scrollable if exceeded certain height)
    2. Should have a crown on the host's head
    3. Let's just display player's name initially.
  */

  useEffect(() => {
    console.log(params.roomId);
  }, []);
  const router = useRouter();

  return (
    <div className="w-screen min-h-screen flex justify-center items-center">
      {/* Sidebar */}
      <Card>
        <CardHeader>
          <CardTitle>Players</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
