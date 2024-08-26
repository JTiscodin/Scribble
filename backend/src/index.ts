import WebSocket from "ws";
import { Room } from "./Room";
import { MessageTypes, SocketMessages } from "./types";
import { Game } from "./Game";
import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors());

const wss = new WebSocket.Server({ port: 8080 });

const rooms: Room[] = [];

wss.on("connection", (ws: WebSocket) => {
  console.log("New cliend connected");
  console.log("Total connected clients " + wss.clients.size);

  ws.on("message", (data: any) => {
    const message: MessageTypes = JSON.parse(data);

    switch (message.type) {
      case SocketMessages.CREATE_ROOM: {
        const room = new Room(
          { socket: ws, username: message.username },
          message.roomName
        );
        rooms.push(room);
        console.log("created new room " + room.roomName);
        console.log("the room id is :" + room.id);
        break;
      }
      case SocketMessages.START_GAME: {
        //Error handling for multiple cases

        //Start a game in a particular room
        const room = rooms.find((room) => room.id === message.roomId);

        if (room) {
          const game = new Game(room);
          room.game = game;
          game.startGame(2000);
        } else {
          //handle room not found
        }

        break;
      }
      case SocketMessages.JOIN_ROOM: {
        const room = rooms.find((room) => room.id === message.roomId);

        room?.addPlayer({ socket: ws, username: message.username });
        break;
      }
      case SocketMessages.LEAVE_ROOM: {
        const room = rooms.find((room) => room.id === message.roomId);
        if (room) {
          room.removePlayer({ socket: ws, username: message.username });
        }
        break;
      }
      case SocketMessages.CANVAS_CHANGE: {
        const data = JSON.stringify({
          type: SocketMessages.CANVAS_UPDATED,
          canvas: message.canvas,
        });
        wss.clients.forEach((client) => {
          if (client != ws && client.readyState === WebSocket.OPEN) {
            client.send(data);
          }
        });

        break;
      }
      case SocketMessages.END_GAME: {
        //End game in a partcular room
        break;
      }
      default:
        console.log("Unknown message type");
    }
    ws.send("Server recieved your message " + JSON.stringify(message));
  });

  ws.on("close", () => {
    console.log("client disconnected");
  });
});

app.get("/rooms", (req, res) => {
  //return the names of the active rooms
  const roomArr = rooms.map((room) => {
    return {
      id: room.id,
      name: room.roomName,
      host: room.host,
    };
  });

  return res.json(roomArr);
});

app.get("/players/:roomId", async (req, res) => {
  const roomId = req.params.roomId;
  const room = rooms.find((room) => room.id === roomId);
  const players = Array.from(room?.players || []);
  if (room) {
    res.json({ players, host: room.host });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log("Started server on port " + PORT);
});
