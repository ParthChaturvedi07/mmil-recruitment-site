import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    trim: true 
  },

  googleId: { 
    type: String, 
    unique: true, 
    sparse: true 
  },

  email: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true, 
    trim: true 
  },

  passwordHash: { type: String },

  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student"
  },

  department: {
    type: String,
    enum: ["technical", "webdev", "programming", "designing"]
  },

  // Optional nested object
  links: {
    github: { type: String },
    behance: { type: String },
    figma: { type: String },
  },

  phone: { type: String },
  resume: { type: String },
  branch: { type: String },
  year: { type: String },
  admissionNumber: { type: String },
  universityRoll: { type: String },

  onboardingStep: {
    type: Number,
    default: 0
  },

  isProfileComplete: {
    type: Boolean,
    default: false
  },

  aptitudeStatus: {
    type: String,
    enum: ["pending", "qualified", "rejected"],
    default: "pending"
  },
  technicalStatus: {
    type: String,
    enum: ["pending", "qualified", "rejected"],
    default: "pending"
  },
  hrStatus: {
    type: String,
    enum: ["pending", "selected", "rejected"],
    default: "pending"
  }
}, { timestamps: true });


const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;