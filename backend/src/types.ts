import WebSocket from "ws";

interface CreateRoomMessage {
  type: SocketMessages.CREATE_ROOM;
  username: string;
  roomName: string;
}

interface StartGameMessage {
  type: SocketMessages.START_GAME;
  roomId: string;
}

interface CanvasChangeMessage {
  type: SocketMessages.CANVAS_CHANGE;
  canvas: Canvas;
}

interface EndGameMessage {
  type: SocketMessages.END_GAME;
  roomId: string;
}

interface JoinRoomMessage {
  type: SocketMessages.JOIN_ROOM;
  roomId: string;
  username: string;
}

interface CheckAnswer {
  type: SocketMessages.CHECK_ANSWER;
  answer: string;
}

interface CanvasUpdated {
  type: SocketMessages.CANVAS_UPDATED;
  canvas: string;
}

interface LeaveRoomMessage {
  type: SocketMessages.LEAVE_ROOM;
  roomId: string;
  username: string;
}

export type MessageTypes =
  | CreateRoomMessage
  | StartGameMessage
  | EndGameMessage
  | JoinRoomMessage
  | CanvasChangeMessage
  | LeaveRoomMessage
  | CanvasUpdated;

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
  JOIN_ROOM,
  CANVAS_CHANGE,
  CHECK_ANSWER,
  LEAVE_ROOM,
  CANVAS_UPDATED,
}

export type Canvas = {};
