import { useGameContext } from "@/contexts/GameContext";

export default function Board() {
  const { players, host } = useGameContext();
  return (
    <div className="h-[90vh] p-5 w-[20vw] bg-slate-200 overflow-y-auto  rounded-3xl ">
      <h1 className="font-bold text-3xl mb-4 text-purple-600"> Players</h1>
      {players.map((player) => {
        return (
          <div className="my-2" key={player.username}>
            {player.username} {player.username === host?.username ? "(host)" : ""}
            <hr className="border-2 border-green-700" />
          </div>
        );
      })}
    </div>
  );
}
