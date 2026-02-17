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

  addDesignProject,
);

designRouter.get("/designs", getDesignProjects);

export default designRouter;
