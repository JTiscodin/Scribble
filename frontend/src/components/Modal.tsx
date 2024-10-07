import { MessageTypes, SocketMessages } from "@/lib/types";
import { Button } from "./ui/button";
import { usePlayerContext } from "@/contexts/PlayerContext";
import { useParams, useSearchParams } from "next/navigation";

interface ModalProps {
  showModal: boolean;
  data: any;
}

const Modal = ({ showModal, data }: ModalProps) => {
  const { socket } = usePlayerContext();
  const { roomId }: { roomId: string } = useParams();

  if (!showModal) {
    return "";
  }

  const fakeData = ["Cat", "Dog", "Cow"];

  const handleWordChoose = (word: string) => {
    //send the choose word mesesage to the server
    data = JSON.stringify({
      type: SocketMessages.CHOSE_WORD,
      word,
      roomId,
    });
    socket?.send(data);
  };

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
