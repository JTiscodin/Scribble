import { MessageTypes, ModalTypes, SocketMessages } from "@/lib/types";
import { Button } from "./ui/button";
import { usePlayerContext } from "@/contexts/PlayerContext";
import { useParams, useSearchParams } from "next/navigation";

interface ModalProps {
  modalType: ModalTypes;
  data: any;
}

const Modal = ({ modalType, data }: ModalProps) => {
  const { socket } = usePlayerContext();
  const { roomId }: { roomId: string } = useParams();

  if (modalType === ModalTypes.Hide) {
    return "";
  }

  const fakeWords = ["Cat", "Dog", "Cow"];

  const fakePoints = [["Alice", 10], ["Bob", 20]]

  const handleWordChoose = async (word: string) => {
    //send the choose word mesesage to the server
    data = JSON.stringify({
      type: SocketMessages.CHOSE_WORD,
      word,
      roomId,
    });
    socket?.send(data);
  };

  if (modalType === ModalTypes.Points) {
    return (
      <div className="h-[80vw] flex justify-center items-center bg-transparent w-screen z-10 fixed">
        <div className="bg-black/40 h-[80vh] rounded-3xl aspect-square gap-6 flex flex-col justify-center items-center ">
          <h1 className="text-4xl">Current Standings</h1>
          {data?.map(([username, points]: [string, number]) => (
            <div className="flex justify-between w-full px-[10vw] text-white text-2xl" key={username}>
              <h1>{username}</h1>
              <h1>{points}</h1>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-[80vw] flex justify-center items-center bg-transparent w-screen z-10 fixed">
      <div className="bg-black/40 h-[80vh] rounded-3xl aspect-square gap-6 flex flex-col justify-center items-center ">
        <h1 className="text-4xl">Choose Word</h1>
        {data?.map((word: string) => {
          return (
            <Button
              key={word}
              onClick={() => handleWordChoose(word)}
              variant={"outline"}
              className="border-2 border-purple-500 text-4xl"
            >
              {word}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default Modal;
