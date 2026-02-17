import { Server } from "socket.io";
import { ENV } from "../config/env.js";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ENV.ALLOWED_ORIGINS,
      methods: ["GET", "POST"]
    }
  });

  // Authentication Middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(token, ENV.JWT_SECRET);
      const user = await userModel.findById(decoded.id);
      
      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication error: " + err.message));
    }
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id, "User:", socket.user.role);

    // Join admin room if user is an admin
    if (socket.user.role === "admin") {
      socket.join("admin");
      console.log(`Socket ${socket.id} joined admin room`);
    }

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

export const emitAdminUpdate = (data) => {
  if (io) {
    console.log("Emitting admin:update event");
    io.to("admin").emit("admin:update", data);
  }
};
