import app from "./app.js";
import { createServer } from "http";
import { ENV } from "./config/env.js";
import { connectDb } from "./config/db.js";
import { initSocket } from "./utils/socket.js";

const httpServer = createServer(app);
initSocket(httpServer);

const startServer = async () => {
  try {
    await connectDb();  

    httpServer.listen(ENV.PORT, () => {
      console.log(`Server running on port ${ENV.PORT}`);
    });


  } catch (error) {
    console.error(" Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
