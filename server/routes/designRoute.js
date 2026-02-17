import express from "express";
import {
  addDesignProject,
  getDesignProjects,
} from "../controllers/designController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import designMiddleware from "../middlewares/designMiddleware.js";


const designRouter = express.Router();

designRouter.post(
  "/add",
  authMiddleware,
  designMiddleware,

  addDesignProject,
);

designRouter.get("/designs", getDesignProjects);

export default designRouter;
