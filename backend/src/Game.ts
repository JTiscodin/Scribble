import { Room } from "./Room";
import { Player } from "./types";
import { v4 as uuid } from "uuid";

export class Game {
  timer: any;
  private id: string;
  private Canvas: string;
  public room: Room;
  public players: Player[];
  private drawer: Player;
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
    this.timer = setTimeout(() => {
      return this.endGame();
    }, time);
  }

  endGame() {
    //End the game
  }
}
