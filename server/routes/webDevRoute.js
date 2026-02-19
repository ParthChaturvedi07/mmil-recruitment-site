import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { submitWebDevProject, getMyProject, getAllProjects } from "../controllers/webDevController.js";

import webDevMiddleware from "../middlewares/webDevMiddleware.js";

const router = express.Router();


import submissionClosedMiddleware from "../middlewares/submissionClosedMiddleware.js";

router.post("/submit", authMiddleware, submissionClosedMiddleware, webDevMiddleware, submitWebDevProject);


router.get("/my-project", authMiddleware, getMyProject);


router.get("/all", authMiddleware, getAllProjects);

export default router;
