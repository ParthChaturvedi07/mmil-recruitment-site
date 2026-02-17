import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { submitProgrammingProject } from "../controllers/programmingController.js";

const router = express.Router();

router.post("/submit", authMiddleware, submitProgrammingProject);

export default router;
