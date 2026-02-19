import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import technicalMiddleware from "../middlewares/technicalMiddleware.js";
import { submitTechnicalProject, getTechnicalProjects } from "../controllers/technicalController.js";

const router = express.Router();

import submissionClosedMiddleware from "../middlewares/submissionClosedMiddleware.js";

router.post("/submit", authMiddleware, submissionClosedMiddleware, technicalMiddleware, submitTechnicalProject);
router.get("/my-project", authMiddleware, getTechnicalProjects);

export default router