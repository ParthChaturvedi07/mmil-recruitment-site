import express from 'express'
import { completeProfile } from '../controllers/authController.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import upload from "../middlewares/uploadMiddleware.js";
import uploadMemory from "../middlewares/uploadMemoryMiddleware.js";
import Resume from "../models/resumeModel.js";
const profileRouter = express.Router()

profileRouter.put('/complete-profile',authMiddleware, upload.single('resume'), completeProfile)


profileRouter.post(
  "/upload-resume",
  authMiddleware,
  uploadMemory.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const resume = new Resume({
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        file: req.file.buffer,
        uploadedBy: req.user.id,
      });

      await resume.save();

      res.status(201).json({
        message: "Resume uploaded and stored in database successfully",
        resumeId: resume._id,
      });
    } catch (err) {
      console.error("Resume upload error:", err);
      res.status(500).json({ message: "Error uploading resume" });
    }
  }
);

profileRouter.get("/resume/:id", async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.set({
      "Content-Type": resume.contentType,
      "Content-Disposition": `inline; filename="${resume.filename}"`,
    });

    res.send(resume.file);
  } catch (err) {
    console.error("Error fetching resume:", err);
    res.status(500).json({ message: "Error retrieving resume" });
  }
});

export default profileRouter