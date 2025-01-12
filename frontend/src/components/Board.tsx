import { useGameContext } from "@/contexts/GameContext";

export default function Board() {
  const { leaderboard, host, drawer } = useGameContext();
  const fakeLeaderBoard = [
    { username: "JT", points: 10 },
    { username: "Someone", points: 20 },
  ];
  return (
    <div className="h-[90vh] p-5 w-[20vw] bg-slate-200 overflow-y-auto  rounded-3xl ">
      <h1 className="font-bold text-3xl mb-4 text-purple-600"> Points Table</h1>
      {leaderboard?.map(([username, points]) => {
        return (
          <div className="my-2 flex flex-col" key={username}>
            <div className="flex justify-between">
              <h1>
                {username} {username === host?.username ? "(host)" : ""}{" "}
                {username === drawer?.username && "(drawer)"}
              </h1>
              <h1>{points}</h1>
            </div>
            <hr className="border-2 border-green-700" />
          </div>
        );
      })}
    </div>
  );
}
