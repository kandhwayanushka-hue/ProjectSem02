import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

export default function useSocket(event, callback) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    const socket = io(SOCKET_URL)
    socket.on(event, (data) => callbackRef.current(data))
    return () => socket.disconnect()
  }, [event])
}
