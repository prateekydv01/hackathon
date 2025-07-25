import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";

import { initializeSocket } from "./utils/socket.js";
import { setSocketInstance } from "./utils/socketInstance.js";

import healthcheckRouter from "./routers/healthCheck.routes.js";
import userRouter from "./routers/user.router.js";
import emergencyRouter from "./routers/emergency.routes.js";

const app = express();
const server = createServer(app);

// Socket.io
const io = initializeSocket(server);
setSocketInstance(io);

// Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN === "*" ? true : process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/emergency", emergencyRouter);

// Global error handler
app.use((err, req, res, next) => {
  const status = err.statuscode || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export { app, server };
