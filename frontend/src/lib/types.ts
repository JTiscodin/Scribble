interface CreateRoomMessage {
  type: SocketMessages.CREATE_ROOM;
  username: string;
  roomName: string;
}

interface StartGameMessage {
  type: SocketMessages.START_GAME;
  username: string;
  roomId: string;
}

interface CanvasChangeMessage {
  type: SocketMessages.CANVAS_CHANGE;
  username: string;
  roomId: string;
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
  roomId: string;
  answer: string;
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
  | CheckAnswer;

//Server messagese that will be sent to the sockets on frontend
interface CanvasUpdated {
  type: ServerMessages.CANVAS_UPDATED;
  canvas: string;
}

interface PlayerAddedMessage {
  type: ServerMessages.PLAYER_ADDED;
  players: Player[];
}

interface GameStartedMessage {
  type: ServerMessages.GAME_STARTED;
  drawer: Player;
}

interface GameEndedMessage {
  type: ServerMessages.GAME_ENDED;
  winner: Player;
}

interface PlayerLeftMessage {
  type: ServerMessages.PLAYER_LEFT;
  players: Player[];
}

interface RoomCreated {
  type: ServerMessages.ROOM_CREATED;
  roomId: string
}

export type ServerMessageTypes =
  | CanvasUpdated
  | PlayerAddedMessage
  | GameStartedMessage
  | GameEndedMessage
  | PlayerLeftMessage
  | RoomCreated

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
}

export enum ServerMessages {
  PLAYER_ADDED,
  PLAYER_LEFT,
  GAME_STARTED,
  CANVAS_UPDATED,
  ANSWER_CHECKED,
  ROOM_CREATED,
  GAME_ENDED,
  CHOOSE_WORD,
  NEW_DRAWER,
  WORD_CHOSEN,
}

export type Canvas = {};
