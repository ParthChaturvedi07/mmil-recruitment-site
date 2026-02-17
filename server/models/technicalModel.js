import mongoose from "mongoose";

const technicalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    githubLink: {
        type: String,
        required: true
    },
    projectLink: {
        type: String,
        required: true
    }
})

const technicalModel = mongoose.model.technical || mongoose.model('technical', technicalSchema)

export default technicalModel