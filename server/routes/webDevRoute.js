import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { submitWebDevProject, getMyProject, getAllProjects } from "../controllers/webDevController.js";

const router = express.Router();


router.post("/submit", authMiddleware, submitWebDevProject);


router.get("/my-project", authMiddleware, getMyProject);


router.get("/all", authMiddleware, getAllProjects);

export default router;
