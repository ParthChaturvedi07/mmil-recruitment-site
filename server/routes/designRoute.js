import express from "express";
import {
  addDesignProject,
  getDesignProjects,
} from "../controllers/designController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import designMiddleware from "../middlewares/designMiddleware.js";


const designRouter = express.Router();

import submissionClosedMiddleware from "../middlewares/submissionClosedMiddleware.js";

designRouter.post(
  "/add",
  authMiddleware,
  submissionClosedMiddleware,
  designMiddleware,

  addDesignProject,
);

designRouter.get("/designs", getDesignProjects);

export default designRouter;
