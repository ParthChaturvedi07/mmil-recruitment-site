import express from "express";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error.middleware.js";
import authRouter from "./routes/authRoute.js";
import profileRouter from "./routes/profileUpdateRoute.js";
import adminRouter from "./routes/applicationsRoute.js";
import applications from "./routes/applicationsRoute.js";

import webDevRouter from "./routes/webDevRoute.js";
import technicalRouter from "./routes/technicalRoute.js";
import designRouter from "./routes/designRoute.js";

import adminRouter from "./routes/applicationsRoute.js";
import applications from "./routes/applicationsRoute.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes can go here...

<<<<<<< HEAD
app.use("/api/auth", authRouter);

app.use("/api/webdev", webDevRouter);
app.use("/api/technical", technicalRouter);
app.use("/api/design", designRouter);

app.use("/api/auth", profileRouter);
app.use("/api/auth", adminRouter);

app.use("/api/admin", applications);
=======
app.use("/api/auth",authRouter)
app.use("/api/auth",profileRouter)
app.use("/api/auth",adminRouter)

app.use("/api/admin",applications)
>>>>>>> 0e05e0ea9d102dc28ecf0a9404065dfc67c6871b

app.use("/uploads", express.static("uploads"));

// example --> app.use("/api", indexRoutes);
app.use("/", (req, res) => {
  res.send("server started");
});
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

export default app;
