
import mongoose from "mongoose";
import { ENV } from "./config/env.js";
import userModel from "./models/userModel.js";

const checkResumeLookup = async () => {
    try {
        await mongoose.connect(ENV.MONGO_URI);
        console.log("Connected to MongoDB");

        const students = await userModel.aggregate([
            { $match: { role: "student" } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "resumes",
                    localField: "_id",
                    foreignField: "uploadedBy",
                    as: "resumeDoc",
                },
            },
            {
                $addFields: {
                    resumeId: { $arrayElemAt: ["$resumeDoc._id", 0] },
                },
            },
            {
                $project: {
                    name: 1,
                    resume: 1,
                    resumeId: 1
                }
            }
        ]);

        console.log("Sample Students with Resume Lookup:");
        students.forEach(s => {
            console.log(`- ${s.name}:`);
            console.log(`  File Path (legacy): ${s.resume}`);
            console.log(`  Resume ID (DB): ${s.resumeId}`);
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
    }
};

checkResumeLookup();
