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
  TODO: Make Round Logic (done)
  TODO: Connect Timer per round (done)
*/

export class Game {
  private id: string;
  public canvas: Canvas;
  public chat: Chat[];
  public room: Room;
  public players: Player[];
  public drawer: Player | null;
  private host: Player;
  private words: string[];
  private chosenWord: string | null;
  private choosenDrawers: Set<Player>;
  private pointsTable: Map<string, number>;
  private guessedCorrectly: Set<string>;
  static readonly BASE_POINTS = 300;
  static readonly PENALTY_RATE = 10;

  constructor(room: Room) {
    this.id = uuid();
    this.room = room;
    this.players = Array.from(room.players);
    this.drawer = null;
    this.host = room.host;
    this.canvas = "";
    this.words = ["Cat", "Dog", "Light", "Sun", "Straw"];
    this.chosenWord = "Hello";
    this.chat = [];
    this.choosenDrawers = new Set<Player>();
    //Intializing map with all the players name and scores to 0.
    this.pointsTable = new Map<string, number>(
      this.players.map((player) => [player.username, 0])
    );
    this.guessedCorrectly = new Set<string>();
    this.startGame(30000);
  }

  allocatePoints(username: string) {
    if (this.pointsTable.has(username)) {
      let prevPoints = this.pointsTable.get(username);
      //add the points to the player
      let newPoints =
        Game.BASE_POINTS - this.guessedCorrectly.size * Game.PENALTY_RATE;
      this.pointsTable.set(username, prevPoints! + newPoints);
      this.guessedCorrectly.add(username);
    } else {
      console.log("Username not found in points table");
    }
  }

  async chooseWord(): Promise<void> {
    //returning a promise which resolves after certain events
    return new Promise<void>((resolve) => {
      const threeWords: string[] = [];

      //Creating an array of three random words
      //TODO: Fix the same word issue here (No same word should appear)
      for (let i = 0; i < 3; i++) {
        const random = Math.floor(Math.random() * this.words.length);
        threeWords.push(this.words[random]);
      }

      const data = JSON.stringify({
        type: ServerMessages.CHOOSE_WORD,
        words: threeWords,
      });
      this.drawer?.socket?.send(data);

      //Choosing an automatic word if none is selected after some time
      const automaticWordChoose = setTimeout(() => {
        const randomWord = threeWords[Math.floor(Math.random() * 3)];
        this.wordChoosen(randomWord);
        resolve();
      }, 10000);

      //cancelling autoselection when the user chooses a word
      this.drawer?.socket?.on("message", async (data: any) => {
        const message: MessageTypes = await JSON.parse(data);
        if (message.type === SocketMessages.CHOSE_WORD) {
          const word = message.word;
          clearTimeout(automaticWordChoose);
          this.wordChoosen(word);
          resolve();
        }
      });
    });
  }

  wordChoosen(word: string) {
    this.chosenWord = word;

    const empty = "";
    let blanks = empty.padStart(word.length * 2, "_ ");
    const data = JSON.stringify({
      type: ServerMessages.WORD_CHOSEN,
      word: blanks,
    });

    this.players.forEach((player) => {
      player.socket?.send(data);
    });
  }

  updateCanvas(canvas: Canvas, username: string) {
    //Update the canvas also check if it's the drawer or not.
    if (username === this.drawer?.username) {
      this.canvas = canvas;
    } else {
      //handle errors
    }
  }

  checkAnswer(msg: string, player: Player) {
    if (msg.trim().length === 0) return;

    if (!this.chosenWord || msg !== this.chosenWord) {
      //If wrong answer or general chat
      this.chat.push({ message: msg, username: player.username });
    } else {
      //Right Answer
      //TODO: Give Points to player here

      //!Check if player has already guessed the word.
      if (
        this.guessedCorrectly.has(player.username) ||
        player.username === this.drawer?.username
      )
        return;

      //If not guessed correctly
      this.allocatePoints(player.username);
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
    console.log(availablePlayers.length);

    if (availablePlayers.length === 0) {
      //end the round
      // Start again or whatever you want
      return;
    } else {
      //choose a random drawer
      const randomNum = Math.floor(Math.random() * availablePlayers.length);
      this.drawer = availablePlayers[randomNum];
      this.choosenDrawers.add(this.drawer);
    }
  }

  async startGame(time: number) {
    /* 
      0. Send the leaderBoard
      1. Choose Drawer
      2. Drawer chooses the word
      3. Timer starts
    */
    let rounds = this.players.length; //!This logic needs to change

    while (rounds !== 0) {
      //Round Start

      //Send the pointstable / leaderboard
      const leaderboardMessage = JSON.stringify({
        type: ServerMessages.LEADERBOARD_UPDATE,
        leaderboard: Array.from(this.pointsTable.entries()),
      });
      this.players.forEach((player) => player.socket?.send(leaderboardMessage));

      //Choosing a random drawer
      this.chooseDrawer();

      //Broadcasting the drawer and the timer of the round
      const data = JSON.stringify({
        type: ServerMessages.ROUND_STARTED,
        timer: time,
        drawer: this.drawer,
      });
      this.players.forEach((player) => player.socket?.send(data));

      //Drawer chooses the word
      await this.chooseWord();

      //Broadcasting start timer message here
      const startTimerMessage = JSON.stringify({
        type: ServerMessages.START_TIMER,
      });
      this.players.forEach((player) => player.socket?.send(startTimerMessage));
      //adding a delay for the given time OR starting the timer here
      await new Promise((resolve) => setTimeout(resolve, time));

      const endTimerMessage = JSON.stringify({
        type: ServerMessages.END_TIMER,
      });
      this.players.forEach((player) => player.socket?.send(endTimerMessage));
      //Round End => Send scores and everything
      rounds--;

      //Send The Round Ending Message
      const roundEndedMessage = JSON.stringify({
        type: ServerMessages.ROUND_ENDED,
        pointsTable: Array.from(this.pointsTable.entries()),
      });
      this.players.forEach((player) => player.socket?.send(roundEndedMessage));

      //adding a five second delay before start of next round.
      await new Promise((resolve) => setTimeout(resolve, 5000));

      //Resetting things after each round
      this.guessedCorrectly = new Set<string>();
    }

    //Game Ends
    console.log("game ended");
    //Sending the game ended message
    const gameEndedMessage = JSON.stringify({
      type: ServerMessages.GAME_ENDED,
    });
    this.players.forEach((player) => player.socket?.send(gameEndedMessage));
  }

  endGame() {
    //End the game
    //Send messages from the server and redirect the users to the waiting page
  }
}
