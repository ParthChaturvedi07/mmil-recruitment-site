import express from 'express'
import { getStats, getStudentsByDomain, getAllStudents, updateStudentStatus } from '../controllers/applicationsController.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import adminMiddleware from '../middlewares/adminMiddleware.js'

const applications = express.Router()

// Secure all admin routes
applications.use(authMiddleware, adminMiddleware);

applications.get("/stats", getStats)
applications.get("/students", getAllStudents)
applications.put("/students/:id/status", updateStudentStatus)
applications.get("/domain/:domain", getStudentsByDomain)

export default applications