import WebSocket from "ws";
import { Room } from "./Room";
import { MessageTypes, ServerMessages, SocketMessages } from "./types";
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
        //Check if the the roomName and username length is not empty
        if (message.roomName.length == 0 && message.username.length == 0) {
          //handle errors here
          break;
        }

        const room = new Room(
          { socket: ws, username: message.username },
          message.roomName
        );
        const data = JSON.stringify({
          type: ServerMessages.ROOM_CREATED,
          roomId: room.id,
        });

        //Sending the confirmation that it room is created to the person created it.
        ws.send(data);
        rooms.push(room);
        console.log("created new room " + room.roomName);
        console.log("the room id is :" + room.id);
        break;
      }

      case SocketMessages.START_GAME: {
        //Start a game in a particular room
        const room = rooms.find((room) => room.id === message.roomId);

        //Check if the initiator of start game is a host or not.
        if (room && room.host.username === message.username) {
          const game = new Game(room);
          room.game = game;
          const data = JSON.stringify({
            type: ServerMessages.GAME_STARTED,
            drawer: game.drawer,
          });
          room.players.forEach((player) => player.socket?.send(data));
          // game.startGame(2000);
        } else {
          //TODO:handle room not found or other errors
        }

        break;
      }
      case SocketMessages.JOIN_ROOM: {
        const room = rooms.find((room) => room.id === message.roomId);

        if (room) {
          room?.addPlayer({ socket: ws, username: message.username });
          const players = Array.from(room.players);
          const data = JSON.stringify({
            type: ServerMessages.PLAYER_ADDED,
            players,
          });
          room.players.forEach((player) => {
            if (player.username !== message.username) player.socket?.send(data);
          });
        }

        break;
      }
      case SocketMessages.LEAVE_ROOM: {
        const room = rooms.find((room) => room.id === message.roomId);
        if (room) {
          room.removePlayer({ socket: ws, username: message.username });

          //Creating latest array after removing the player
          const players = Array.from(room.players);
          const data = JSON.stringify({
            type: ServerMessages.PLAYER_LEFT,
            players: players,
          });
          room.players.forEach((player) => {
            if (player.username !== message.username) player.socket?.send(data);
          });
        }
        break;
      }
      case SocketMessages.CANVAS_CHANGE: {
        const room = rooms.find((room) => room.id === message.roomId);
        if (room && room.game) {
          //change the canvas of the room
          room.game.updateCanvas(message.canvas, message.username);
          const data = JSON.stringify({
            type: ServerMessages.CANVAS_UPDATED,
            canvas: room.game.canvas,
          });
          wss.clients.forEach((client) => {
            if (client != ws && client.readyState === WebSocket.OPEN) {
              client.send(data);
            }
          });
        } else {
          //handle errors
        }

        break;
      }
      case SocketMessages.CHECK_ANSWER: {
        const room = rooms.find((room) => room.id === message.roomId)
        if(room && room.game){
          //Performing the checkAnswer method if room is found
          room.game?.checkAnswer(message.answer, {socket: ws, username: message.username})
        }
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
