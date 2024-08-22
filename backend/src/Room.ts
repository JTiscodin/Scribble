import { Game } from "./Game";
import { Player } from "./types";
import { v4 as uuid } from "uuid";

export class Room {
  public id: string;
  public host: Player;
  public roomName: string;
  public players: Set<Player>;
  public game: Game | undefined;

  constructor(host: Player, roomName: string) {
    this.id = uuid();
    this.host = host;
    this.roomName = roomName;
    this.players = new Set();
    this.addPlayer(host);
  }
  
  addPlayer(player: Player) {
    //TODO: Check if the player already exists, tell them they are already in the game
    this.players.add(player);
  }

  removePlayer(player: Player) {
    //TODO: Check if the player exists give a custom error message
    this.players.delete(player);
  }
}
