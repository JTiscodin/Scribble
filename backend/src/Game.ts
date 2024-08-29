import { Room } from "./Room";
import { Canvas, Player, ServerMessages } from "./types";
import { v4 as uuid } from "uuid";

export class Game {
  private id: string;
  public canvas: Canvas;
  public room: Room;
  public players: Player[];
  public drawer: Player;
  private host: Player;
  private words: string[];
  private chosenWord: string | null;

  constructor(room: Room) {
    this.id = uuid();
    this.room = room;
    this.players = Array.from(room.players);
    this.drawer = room.host;
    this.host = room.host;
    this.canvas = "";
    this.words = ["Cat", "Dog", "Light", "Sun", "Straw"];
    this.chosenWord = null;
  }

  chooseWord(){
    const data = JSON.stringify({type: ServerMessages.CHOOSE_WORD, })
    this.players.forEach((player) => {
      // player.socket?.send()
    })
  }

  updateCanvas(canvas: Canvas, username: string) {
    //Update the canvas
    if (username === this.drawer.username) {
      this.canvas = canvas;
    }else{
      //handle errors
    }
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
