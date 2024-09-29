import { Room } from "./Room";
import { Canvas, Chat, Player, ServerMessages } from "./types";
import { v4 as uuid } from "uuid";

/* 
  TODO: Implement Point System
  TODO: Make Round Logic
  TODO: Connect Timer per round
*/

export class Game {
  private id: string;
  public canvas: Canvas;
  public chat: Chat[];
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
    this.chat = [];
    // this.startGame();
  }

  chooseWord() {
    const threeWords = [];

    //Creating an array of theree random words
    for (let i = 0; i < 3; i++) {
      const random = Math.random() * this.words.length;
      threeWords.push(this.words[random]);
    }
    const data = JSON.stringify({
      type: ServerMessages.CHOOSE_WORD,
      words: threeWords,
    });
    this.players.forEach((player) => {
      player.socket?.send(data);
    });
  }

  updateCanvas(canvas: Canvas, username: string) {
    //Update the canvas also check if it's the drawer or not.
    if (username === this.drawer.username) {
      this.canvas = canvas;
    } else {
      //handle errors
    }
  }

  checkAnswer(msg: string, player: Player) {
    if (msg.trim().length === 0) return;

    console.log(this.chat);

    if (!this.chosenWord || msg !== this.chosenWord) {
      //If wrong answer or general chat
      this.chat.push({ message: msg, username: player.username });
    } else {
      //Right Answer
      const data = JSON.stringify({
        type: ServerMessages.CORRECT_ANSWER,
        msg: "You guessed the word right",
      });
      player.socket?.send(data);
      //Custom Message

      this.chat.push({message: player.username + " guessed the word", username: "SERVER" })
    }

    // if (!this.chooseWord) {
    //   this.chat.push({ message: msg, username: player.username });
    // } else {
    //   if (msg === this.chosenWord) {
    //     //right answer
    //   } else {
    //     //wrong answer
    //     this.chat.push({ message: msg, username: player.username });
    //   }
    // }

    const data = JSON.stringify({
      type: ServerMessages.CHAT_UPDATED,
      chat: this.chat,
    });

    this.players.forEach((player) => {
      console.log("sent data to player" + player.username + " msg: " + msg);
      player.socket?.send(data);
    });
  }

  userMessage(msg: string, player: Player) {}

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
