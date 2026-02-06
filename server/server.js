import app from "./app.js";
import { ENV } from "./config/env.js";
import { connectDb } from "./config/db.js";

const startServer = async () => {
  try {
    await connectDb();  

    app.listen(ENV.PORT, () => {
      console.log(`Server running on port ${ENV.PORT}`);
    });

  } catch (error) {
    console.error(" Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
