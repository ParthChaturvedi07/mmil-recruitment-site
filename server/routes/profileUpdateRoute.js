import express from 'express'
import { completeProfile } from '../controllers/authController.js'
import authMiddlware from '../middlewares/authMiddleware.js'
import upload from "../middlewares/uploadMiddleware.js";
const profileRouter = express.Router()

profileRouter.put('/complete-profile',authMiddlware, upload.single('resume'), completeProfile)

export default profileRouter