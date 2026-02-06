import express from 'express'
import { getAllApplications } from '../controllers/applicationsController.js'

const applications = express.Router()

applications.get("/applications", getAllApplications)

export default applications