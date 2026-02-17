import express from "express";
import cors from "cors";
import morgan from "morgan";
import { ENV } from "./config/env.js";

import { errorHandler } from "./middlewares/error.middleware.js";

import authRouter from "./routes/authRoute.js";
import profileRouter from "./routes/profileUpdateRoute.js";
import chatbotRouter from "./routes/chatbotRoute.js";
// import adminRouter from "./routes/adminRoute.js";

import webDevRouter from "./routes/webDevRoute.js";
import technicalRouter from "./routes/technicalRoute.js";
import designRouter from "./routes/designRoute.js";
import programmingRouter from "./routes/programmingRoute.js";
import applicationsRouter from "./routes/applicationsRoute.js";

const app = express();

app.use(cors({
  origin: ["https://mmil.club", "http://www.mmil.club", "https://mmil-recruitment.vercel.app", "http://localhost:5173", "http://127.0.0.1:5173"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Auth routes
app.use("/api/auth", authRouter);

app.use("/api/auth", authRouter)
app.use("/api/auth", profileRouter)
// app.use("/api/auth",adminRouter)
app.use("/api/chat", chatbotRouter)
// Profile routes
app.use("/api/profile", profileRouter);

// Admin routes
app.use("/api/admin", applicationsRouter);

// Domain routes
app.use("/api/webdev", webDevRouter);
app.use("/api/technical", technicalRouter);
app.use("/api/design", designRouter);
app.use("/api/programming", programmingRouter);

// Static uploads
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("server started");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use(errorHandler);

export default app;

