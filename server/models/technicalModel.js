import mongoose from "mongoose";

const technicalSchema = new mongoose.Schema({
    githubLink:{ 
        type: String,
    required: true},
    projectLink:{
      type:  String,
      required:true
    }
})

const technicalModel = mongoose.model.technical || mongoose.model('technical', technicalSchema)

export default technicalModel