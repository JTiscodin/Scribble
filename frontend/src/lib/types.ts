export enum Tool {
    Default = "Default",
    Rectangle = "Rectangle",
    Circle = "Circle",
    Pen = "Pen",
  }

  export type Player = {
    username: string,
    socket: WebSocket | null;
  }