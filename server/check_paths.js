
import mongoose from "mongoose";
import { ENV } from "./config/env.js";
import userModel from "./models/userModel.js";

const checkPaths = async () => {
    try {
        await mongoose.connect(ENV.MONGO_URI);
        console.log("Connected to MongoDB");

        const students = await userModel.find({ role: "student", resume: { $exists: true, $ne: null } }).limit(5);

        console.log("Sample Resume Paths:");
        students.forEach(s => {
            console.log(`- ${s.name}: ${s.resume}`);
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
    }
};

checkPaths();
