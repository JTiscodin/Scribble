import { Room } from "./Room";
import {
  Canvas,
  Chat,
  MessageTypes,
  Player,
  ServerMessages,
  SocketMessages,
} from "./types";
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
  private choosenDrawers: Set<Player>;

  constructor(room: Room) {
    this.id = uuid();
    this.room = room;
    this.players = Array.from(room.players);
    this.drawer = room.host;
    this.host = room.host;
    this.canvas = "";
    this.words = ["Cat", "Dog", "Light", "Sun", "Straw"];
    this.chosenWord = "Hello";
    this.chat = [];
    this.choosenDrawers = new Set<Player>();
    // this.startGame();
  }

  async chooseWord() {
    const threeWords: string[] = [];

    //Creating an array of theree random words
    for (let i = 0; i < 3; i++) {
      const random = Math.random() * this.words.length;
      threeWords.push(this.words[random]);
    }
    const data = JSON.stringify({
      type: ServerMessages.CHOOSE_WORD,
      words: threeWords,
    });
    this.drawer.socket?.send(data);

    //Choosing an automatic word if none is selected after some time
    const automaticWordChoose = setTimeout(() => {
      const randomWord = threeWords[Math.random() * 3];
      this.wordChoosen(randomWord, this.drawer);
    }, 5000);

    //cancelling autoselection when the user chooses a word
    this.drawer.socket?.on("message", (message: MessageTypes) => {
      if (message.type === SocketMessages.CHOOSE_WORD) {
        const word = message.word;
        clearTimeout(automaticWordChoose);
        this.wordChoosen(word, this.drawer);
      }
    });
  }

  wordChoosen(word: string, player: Player) {
    if (player.socket !== this.drawer.socket) return;

    this.chosenWord = word;

    //TODO: Sending the blanks equal to the size of the word (for eg: "tree" we send "_ _ _ _")

    const data = JSON.stringify({
      type: ServerMessages.WORD_CHOSEN,
      
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

  async checkAnswer(msg: string, player: Player) {
    if (msg.trim().length === 0) return;

    if (!this.chosenWord || msg !== this.chosenWord) {
      //If wrong answer or general chat
      this.chat.push({ message: msg, username: player.username });
    } else {
      //Right Answer
      //Give Points to player
      const data = JSON.stringify({
        type: ServerMessages.CORRECT_ANSWER,
        msg: "You guessed the word right",
      });
      player.socket?.send(data);
      //Custom Message
      this.chat.push({
        message: player.username + " guessed the word",
        username: "SERVER",
      });
    }

    const data = JSON.stringify({
      type: ServerMessages.CHAT_UPDATED,
      chat: this.chat,
    });

    this.players.forEach((player) => {
      console.log("sent data to player" + player.username + " msg: " + msg);
      player.socket?.send(data);
    });
  }

  chooseDrawer() {
    const availablePlayers = this.players.filter(
      (player) => !this.choosenDrawers.has(player)
    );

    if (availablePlayers.length === 0) {
      //end the round
      // Start again or whatever you want
      return;
    } else {
      //choose a random drawer
      const randomNum = Math.random() * availablePlayers.length;
      this.drawer = availablePlayers[randomNum];
    }
  }

  async startGame(time: number) {
    /* 
      1. Choose Drawer
      2. Drawer chooses the word
      3. Timer starts
    */
    let rounds = this.players.length;

    while (rounds != 0) {
      //Choosing a random drawer
      this.chooseDrawer();
      //Drawer chooses the word
      this.chooseWord();
      //Actual round starts, i.e start timer
      const data = JSON.stringify({
        type: ServerMessages.ROUND_STARTED,
        time,
      });
      this.players.forEach((player) => player.socket?.send(data));
      await new Promise((resolve) => setTimeout(resolve, time));

      rounds--;
    }
  }

  endGame() {
    //End the game
    //send messages from the server and redirect the users to the waiting page
  }
}
