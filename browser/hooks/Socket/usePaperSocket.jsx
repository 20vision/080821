import { io } from "socket.io-client";

import { useState, useEffect } from "react";

const socket = () => {
    const [socket, setSocket] = useState()

    useEffect(() => {
        const socketIo = io("http://localhost:4500",{withCredentials: true})
        setSocket(socketIo)
        return () => {
            console.log('disconnected')
            socketIo.disconnect()
        }
    }, [])

    return socket
}

export default socket