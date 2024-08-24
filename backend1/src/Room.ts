import { Player, RoomMode } from "./types";

interface RoomContructorArgs {
  name: string;
  mode: RoomMode;
  host: Player;
}

export class Room {
  private host;
  private name;
  private id;
  private mode;

  public players: Player[];

  constructor({ host, name, mode }: RoomContructorArgs) {
    this.host = host;
    this.id = "randomId";
    this.name = name;
    this.players = [host];
    this.mode = mode;
  }

  addPlayer(player: Player): void {
    //TODO: check if the username already exists
    this.players.push(player);
  }

  removePlayer(player: Player): void {
    //TODO: check if the player exists
    this.players = this.players.filter((pl) => pl.username !== player.username);
  }
}
