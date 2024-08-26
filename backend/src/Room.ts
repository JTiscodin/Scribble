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
    for(let pl of this.players){
      if(pl.username === player.username) return
    }
    this.players.add(player);
    console.log("added player " + player.username + ' to room ' + this.roomName)
  }

  removePlayer(player: Player) {
    //TODO: Check if the player exists give a custom error message
    for(let pl of this.players){
      if(pl.username === player.username) {
        this.players.delete(pl  )
        console.log('removed player ' + player.username+ ' from room ' + this.roomName)
      }else{
        //player not found 
      }
    }
    
  }
}
