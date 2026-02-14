import mongoose from "mongoose";

const DesignSchema = new mongoose.Schema(
  {
    figmaLink: {
      type: String,
      required: true,
    },

    githubLink: {
      type: String,
    },
  },
  { timestamps: true }
);


const designModel =
  mongoose.models.design || mongoose.model("design", DesignSchema);

export default designModel;
