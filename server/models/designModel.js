import mongoose from "mongoose";

const DesignSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
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
