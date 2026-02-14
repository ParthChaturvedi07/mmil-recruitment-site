import express from 'express'
import { googleAuth, registerWithEmail, loginWithEmail } from '../controllers/authController.js'

const authRouter = express.Router()

authRouter.post("/google", googleAuth)

authRouter.post("/register", registerWithEmail)

authRouter.post("/login", loginWithEmail)

export default authRouter