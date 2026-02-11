import mongoose from "mongoose";

const DesignSchema = new mongoose.Schema(
  {
    figmaLink: {
      type: String,
      required: true,
    },
<<<<<<< HEAD
    githubLink: {
      type: String,
    },
  },
  { timestamps: true }
);
=======
    githubLink:{
        type:String
    }
});
>>>>>>> 0e05e0ea9d102dc28ecf0a9404065dfc67c6871b

const designModel =
  mongoose.models.design || mongoose.model("design", DesignSchema);

export default designModel;
