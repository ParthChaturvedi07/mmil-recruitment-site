import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import technicalMiddleware from "../middlewares/technicalMiddleware.js";
import { submitTechnicalProject, getTechnicalProjects } from "../controllers/technicalController.js";

const router = express.Router();

router.post("/submit", authMiddleware, technicalMiddleware, submitTechnicalProject);
router.get("/my-project", authMiddleware, getTechnicalProjects);

export default router