import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { useNotification } from "./NotificationContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) return;

    // Create socket connection
    const socketInstance = io(`${import.meta.env.VITE_API_URL}/`, {
      withCredentials: true,
    });

    socketInstance.on("connect", () => {
      console.log("🔌 Socket connected (client)");
      socketInstance.emit("join", user._id);
    });

    // 🔔 LISTEN FOR HIRED EVENT
    socketInstance.on("hired", (data) => {
      console.log("🎉 HIRED EVENT RECEIVED:", data);

      addNotification({
        id: Date.now(),
        message: data.message,
      });
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Socket disconnected (client)");
    });

    setSocket(socketInstance);

    // Cleanup on logout / unmount
    return () => {
      socketInstance.off("hired");
      socketInstance.disconnect();
      setSocket(null);
    };
  }, [user, addNotification]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
