import mongoose from "mongoose";

const ProgrammingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            trim: true,
        },
        hackerRankUsername: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

const programmingModel =
    mongoose.models.programming || mongoose.model("programming", ProgrammingSchema);

export default programmingModel;
