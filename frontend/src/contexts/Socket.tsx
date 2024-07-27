"use client"

import { useContext, useEffect, useState ,createContext, ReactNode, useMemo } from "react"

const SocketContext = createContext<WebSocket | null>(null);

interface SocketProviderProps {
  children: ReactNode;
}

const SocketContextProvider = ({children}: SocketProviderProps) => {
  const socket = useMemo(() => new WebSocket("ws://localhost:8787/ws"), [])
  return <SocketContext.Provider value={socket}>
    {children}
  </SocketContext.Provider>
}

const useSocket = () => {
  return useContext(SocketContext)
}

export default SocketContextProvider
