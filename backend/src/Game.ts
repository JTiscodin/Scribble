import { Room } from "./Room";
import { Player } from "./types";

export class Game {
  private Canvas: any
  public room: Room;
  public players: Player[];
  private drawer: Player;
  private host: Player;

  constructor(room: Room) {
    this.room = room;
    this.players = Array.from(room.players);
    this.drawer = room.host;
    this.host = room.host;
  }

  chooseDrawer() {
    let player: Player =
      this.players[Math.floor(Math.random() * this.players.length)];
    this.drawer = player;
  }
}
