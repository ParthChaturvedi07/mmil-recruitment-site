import express from 'express'
import { googleAuth, registerWithEmail, loginWithEmail, logout, checkAuthStatus, verifyOtp } from '../controllers/authController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const authRouter = express.Router()

authRouter.post("/google", googleAuth)

authRouter.post("/register", registerWithEmail)

authRouter.post("/login", loginWithEmail)

authRouter.post("/verify-otp", verifyOtp)

authRouter.post("/logout", logout)

authRouter.get("/check-status", authMiddleware, checkAuthStatus)

export default authRouter