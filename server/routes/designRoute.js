import express from "express";
import {
  addDesignProject,
  getDesignProjects,
} from "../controllers/designController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import designMiddleware from "../middlewares/designMiddleware.js";


const designRouter = express.Router();

designRouter.post(
  "/add-design",
  authMiddleware,
 designMiddleware,
  addDesignProject,
);

designRouter.get("/designs", authMiddleware, getDesignProjects);

export default designRouter;
