import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN === "*" ? true : process.env.CORS_ORIGIN,
      methods: ["GET", "POST"],
    },
  });

  // Auth middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("No token"));

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded._id);
      if (!user) return next(new Error("User not found"));

      socket.userId = user._id.toString();
      socket.join(socket.userId); // personal room
      next();
    } catch (err) {
      next(new Error("Auth failure"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.userId);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.userId);
    });

    socket.on("update_location", async ({ latitude, longitude }) => {
      try {
        await User.findByIdAndUpdate(socket.userId, {
          location: { type: "Point", coordinates: [longitude, latitude] },
        });
      } catch (e) {
        console.error("Location update error:", e);
      }
    });
  });

  return io;
};
