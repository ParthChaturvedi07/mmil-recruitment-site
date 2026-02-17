import mongoose from "mongoose";

const webDevSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  hostedSiteLink: String,
  githubRepoLink: String,
  submittedAt: {
    type: Date,
    default: Date.now

  }

})
const webdevModel = mongoose.model.web || mongoose.model('web', webDevSchema)

export default webdevModel