import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { ENV } from "./config/env.js";
import { errorHandler } from "./middlewares/error.middleware.js";

import authRouter from "./routes/authRoute.js";
import profileRouter from "./routes/profileUpdateRoute.js";
import chatbotRouter from "./routes/chatbotRoute.js";
import webDevRouter from "./routes/webDevRoute.js";
import technicalRouter from "./routes/technicalRoute.js";
import designRouter from "./routes/designRoute.js";
import applicationsRouter from "./routes/applicationsRoute.js";

const app = express();

// Allowed origins — supports string or array from ENV
const allowedOrigins = Array.isArray(ENV.ALLOWED_ORIGINS)
  ? ENV.ALLOWED_ORIGINS
  : typeof ENV.ALLOWED_ORIGINS === "string"
  ? ENV.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:5173"];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error(`CORS policy: origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

// Security Headers
app.use(
  helmet({
    crossOriginOpenerPolicy: false, // disabled for Google OAuth popup support
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Handle preflight BEFORE all routes
app.options("*", cors(corsOptions));

// Apply CORS globally
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/chat", chatbotRouter);
app.use("/api/profile", profileRouter);
app.use("/api/admin", applicationsRouter);
app.use("/api/webdev", webDevRouter);
app.use("/api/technical", technicalRouter);
app.use("/api/design", designRouter);
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => res.send("server started"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use(errorHandler);

export default app;