"use client"

import { createContext, useState, useEffect, ReactNode } from "react"

const SocketContext = createContext<WebSocket | null>(null)

export default function SocketContextProvider({children}: {children: ReactNode}) {
    const [socket, setSocket] = useState<WebSocket | null>(null)

    useEffect(() => {
        const ws = new WebSocket('wss://your-worker-url.workers.dev/ws')
        
        ws.onopen = () => {
            console.log('Connected to WebSocket')
            setSocket(ws)
        }

        ws.onclose = () => {
            console.log('Disconnected from WebSocket')
            setSocket(null)
        }

        return () => {
            ws.close()
        }
    }, [])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export { SocketContext }