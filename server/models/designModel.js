
import mongoose from "mongoose";
const DesignSchema = new mongoose.Schema({
    figmaLink: {
        type: String,
        required: true
    },
    githubLink:{
        type:String
    }
});

const designModel = mongoose.model.design || mongoose.model('design', DesignSchema)

export default designModel