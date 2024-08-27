import { Room } from "./Room";
import { Player } from "./types";
import { v4 as uuid } from "uuid";

export class Game {
  private id: string;
  private Canvas: string;
  public room: Room;
  public players: Player[];
  public drawer: Player;
  private host: Player;

  constructor(room: Room) {
    this.id = uuid();
    this.room = room;
    this.players = Array.from(room.players);
    this.drawer = room.host;
    this.host = room.host;
    this.Canvas = "";
  }

  updateCanvas(canvas: string) {
    //Update the canvas
    this.Canvas = canvas;
    //send all people the canvas, except for the drawer
  }

  chooseDrawer() {
    let player: Player =
      this.players[Math.floor(Math.random() * this.players.length)];
    this.drawer = player;
  }

  startGame(time: number) {
    //start the timer and the game
  }

  endGame() {
    //End the game
    //send messages from the server and redirect the users to the waiting page

  }
}
