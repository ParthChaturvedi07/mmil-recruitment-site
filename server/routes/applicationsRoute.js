import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import { getAllApplications,getApplicationsByDepartment } from "../controllers/applicationsController.js";

const router = express.Router();

router.get(
  "/applications",
  authMiddleware,
  adminMiddleware,
  getAllApplications
);

router.get(
  "/applications/:department",
  authMiddleware,
  adminMiddleware,
  getApplicationsByDepartment
);
export default router;
