import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  file: {
    type: Buffer,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // Refers to the User model, check capitalization in userModel.js (it is "user")
    required: true,
  },
}, { timestamps: true });

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
