export enum Tool {
    Default = "Default",
    Rectangle = "Rectangle",
    Circle = "Circle",
    Pen = "Pen",
  }
  
  export type Player = {
    username: string;
    socket: WebSocket | null;
  };
  
  export enum GameCommands {
    START,
    END,
  }
  
  export enum RoomMode {
    Private = "Private",
    Public = "Public",
  }
  
  export type Room = {
    id: string;
    name: string;
    players: Player[];
    mode: RoomMode;
  };
  
  export type Game = {
    id: number;
    canvas: Canvas;
    players: Player[];
  };
  
  export enum SocketMessages {
    START_GAME,
    END_GAME,
    CREATE_ROOM,
  }
  
  export type Canvas = {};
  