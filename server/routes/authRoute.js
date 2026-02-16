import express from 'express'
import { googleAuth, registerWithEmail, loginWithEmail, logout } from '../controllers/authController.js'

const authRouter = express.Router()

authRouter.post("/google", googleAuth)

authRouter.post("/register", registerWithEmail)

authRouter.post("/login", loginWithEmail)

authRouter.post("/logout", logout)

export default authRouter