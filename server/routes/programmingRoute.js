import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { submitProgrammingProject } from "../controllers/programmingController.js";

const router = express.Router();

import submissionClosedMiddleware from "../middlewares/submissionClosedMiddleware.js";

router.post("/submit", authMiddleware, submissionClosedMiddleware, submitProgrammingProject);

export default router;
