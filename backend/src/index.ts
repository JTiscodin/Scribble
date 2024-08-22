import WebSocket from "ws";
import { Room } from "./Room";
import { MessageTypes, SocketMessages } from "./types";
import { Game } from "./Game";

const wss = new WebSocket.Server({ port: 8080 });

const rooms: Room[] = [];

wss.on("connection", (ws: WebSocket) => {
  console.log("New cliend connected");

  ws.on("message", (data: any) => {
    const message: MessageTypes = JSON.parse(data);

    switch (message.type) {
      case SocketMessages.CREATE_ROOM: {
        const room = new Room(
          { socket: ws, username: message.username },
          message.roomName
        );
        rooms.push(room);
        console.log("created new room " + room.roomName)
        console.log("the room id is :" + room.id)
        break;
      }
      case SocketMessages.START_GAME: {
        //Error handling for multiple cases

        //Start a game in a particular room
        const room = rooms.find((room) => room.id === message.roomId);

        if(room){
          const game = new Game(room)
          room.game = game
        }

        break;
      }
      case SocketMessages.JOIN_ROOM: {
        const room = rooms.find((room) => room.id === message.roomId);

        room?.addPlayer({ socket: ws, username: message.username });

        console.log("added player " + message.username + "to room " + room?.roomName)
        break;
      }
      case SocketMessages.END_GAME:
      //End game in a partcular room
      default:
        console.log("Unknown message type");
    }
    console.log("recieved msg: " + message);
    ws.send("Server recieved your message " + message);
  });

  ws.on("close", () => {
    console.log("client disconnected");
  });
});
