export enum GameCommands{
    START,
    END,
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
