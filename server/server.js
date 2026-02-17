import app from "./app.js";
import { createServer } from "http";
import { ENV } from "./config/env.js";
import { connectDb } from "./config/db.js";
import { initSocket } from "./utils/socket.js";

const httpServer = createServer(app);

const startServer = async () => {
  try {
    await connectDb();

    // Init socket AFTER db is connected
    initSocket(httpServer);

    httpServer.listen(ENV.PORT, () => {
      console.log(`Server running on port ${ENV.PORT}`);
      console.log(`Environment: ${ENV.NODE_ENV}`);
      console.log(`Allowed origins: ${ENV.ALLOWED_ORIGINS}`);
    });

  } catch (error) {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections globally
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Handle uncaught exceptions globally
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error.message);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  httpServer.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
});

startServer();