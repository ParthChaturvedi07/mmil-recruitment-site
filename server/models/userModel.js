import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: String,

  googleId: { type: String, unique: true },

  email: { type: String, unique: true },

  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student"
  },

  department: {
    type: String,
    enum: ["technical", "webdev", "programming", "designing"]
  },
  links: {
  github: { type: String },
  behance: { type: String },
  figma: { type: String },
},

phone:{
  type:String,
  // required: true
},

  resume:{
    type:String,
    // required: true
  },

  branch: {
    type: String,
    // required: true
    
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
}
)

const userModel = mongoose.model.user || mongoose.model("user", userSchema)

export default userModel
