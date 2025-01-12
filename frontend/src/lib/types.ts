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

interface ChoseWord {
  type: SocketMessages.CHOSE_WORD;
  roomId: string;
  word: string;
}

export interface CheckAnswer {
  type: SocketMessages.CHECK_ANSWER;
  roomId: string;
  answer: string;
  username: string;
}

interface LeaveRoomMessage {
  type: SocketMessages.LEAVE_ROOM;
  roomId: string;
  username: string;
}

export type Chat = {
  username: string;
  message: string;
};

export type MessageTypes =
  | CreateRoomMessage
  | StartGameMessage
  | EndGameMessage
  | JoinRoomMessage
  | CanvasChangeMessage
  | LeaveRoomMessage
  | CheckAnswer
  | ChoseWord;

//Server messages that will be sent to the sockets on frontend
interface CanvasUpdated {
  type: ServerMessages.CANVAS_UPDATED;
  canvas: any;
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
  roomId: string;
}

interface chooseWord {
  type: ServerMessages.CHOOSE_WORD;
  words: string[];
}

interface chatUpdated {
  type: ServerMessages.CHAT_UPDATED;
  chat: Chat[];
}

interface correctAnswer {
  type: ServerMessages.CORRECT_ANSWER;
  msg: string;
}

interface RoundStarted {
  type: ServerMessages.ROUND_STARTED;
  timer: number; //time in milli seconds
  drawer: Player;
}

interface RoundEnded {
  type: ServerMessages.ROUND_ENDED;
  pointsTable: Array<[string, number]>;
}

interface StartTimer {
  type: ServerMessages.START_TIMER;
}

interface EndTimer {
  type: ServerMessages.END_TIMER;
}

interface WordChoosen {
  type: ServerMessages.WORD_CHOSEN;
  word: string;
}

interface LeaderBoardUpdate {
  type: ServerMessages.LEADERBOARD_UPDATE;
  leaderboard: Array<[string, number]>;
}

export type ServerMessageTypes =
  | CanvasUpdated
  | PlayerAddedMessage
  | GameStartedMessage
  | GameEndedMessage
  | PlayerLeftMessage
  | RoomCreated
  | chooseWord
  | chatUpdated
  | correctAnswer
  | RoundStarted
  | RoundEnded
  | StartTimer
  | EndTimer
  | WordChoosen
  | LeaderBoardUpdate;

export enum Tool {
  Default = "Default",
  Rectangle = "Rectangle",
  Circle = "Circle",
  Pen = "Pen",
}

export enum ModalTypes {
  Hide,
  WordChoose,
  Points,
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
  CHOSE_WORD,
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
  CHAT_UPDATED,
  WORD_CHOSEN,
  CORRECT_ANSWER,
  ROUND_STARTED,
  ROUND_ENDED,
  START_TIMER,
  END_TIMER,
  LEADERBOARD_UPDATE,
}

export type Canvas = {};
