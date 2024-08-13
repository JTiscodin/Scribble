export enum GameCommands{
    START,
    END,
}

export enum RoomMode{
    Private = "Private",
    Public = "Public"
}

export type Room = {
    id: string,
    name: string,
    players: Player[]
    mode: RoomMode

}

export type Game = {
    id: number,    
    canvas: Canvas,
    players: Player[]

}

export type Canvas = {
    
}



export type Player = {
    username: string,
    socket: WebSocket,
}
